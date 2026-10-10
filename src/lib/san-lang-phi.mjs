// Logic máy chủ của game "Săn Lãng Phí" — dùng chung cho Netlify Function và máy chủ chạy thử local.
// Lưu trữ: Netlify Blobs (key-value). Mỗi câu trả lời / người chơi là 1 key riêng nên không bị ghi đè lẫn nhau.

const LETTERS = ['D', 'O', 'W', 'N', 'T', 'I', 'M', 'E'];
const MAX_PLAYERS = 300;

function json(data, status = 200, edgeCache = false) {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
  if (edgeCache) {
    // Giảm số lần gọi function khi 50+ điện thoại cùng hỏi trạng thái mỗi giây
    headers['Netlify-CDN-Cache-Control'] = 'public, s-maxage=1';
    headers['Netlify-Vary'] = 'query=pin';
  }
  return new Response(JSON.stringify(data), { status, headers });
}
const fail = (message, status = 400) => json({ error: message }, status);

function rid(n) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  let s = '';
  for (const b of bytes) s += chars[b % chars.length];
  return s;
}
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const unb64 = (s) => { try { return Buffer.from(s, 'base64url').toString('utf8'); } catch { return '?'; } };
const cleanText = (s, max) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

const K = {
  state: (pin) => `g/${pin}/state`,
  players: (pin) => `g/${pin}/p/`,
  answers: (pin) => `g/${pin}/a/`,
  votes: (pin) => `g/${pin}/v/`,
};

async function keys(store, prefix) {
  const { blobs } = await store.list({ prefix });
  return blobs.map((b) => b.key.slice(prefix.length));
}

async function listPlayers(store, pin) {
  return (await keys(store, K.players(pin))).map((rest) => {
    const i = rest.indexOf('.');
    return { id: rest.slice(0, i), nick: unb64(rest.slice(i + 1)) };
  });
}

// key: g/<pin>/a/<q>/<playerId>.<choice>.<ms>
async function listAnswers(store, pin, q) {
  const prefix = K.answers(pin) + (q === undefined ? '' : `${q}/`);
  return (await keys(store, prefix)).map((rest) => {
    let qq = q;
    if (q === undefined) { const s = rest.indexOf('/'); qq = Number(rest.slice(0, s)); rest = rest.slice(s + 1); }
    const [id, choice, ms] = rest.split('.');
    return { q: qq, id, choice, ms: Number(ms) };
  });
}

async function listVotes(store, pin) {
  return (await keys(store, K.votes(pin))).map((rest) => {
    const [id, choice] = rest.split('.');
    return { id, choice };
  });
}

function publicState(s) {
  const showQ = s.q >= 0 && ['question', 'reveal', 'leaderboard'].includes(s.phase);
  const revealed = s.revealedQ === s.q && s.phase !== 'question';
  const cur = s.q >= 0 ? s.questions[s.q] : null;
  const showBoard = ['reveal', 'leaderboard', 'final', 'poll', 'end'].includes(s.phase);
  return {
    pin: s.pin, title: s.title, phase: s.phase, q: s.q, total: s.questions.length,
    duration: s.duration, startedAt: s.startedAt, now: Date.now(),
    question: showQ ? { t: cur.t, area: cur.area } : null,
    answer: showQ && revealed ? cur.ans : null,
    why: showQ && revealed ? (cur.why || '') : null,
    board: showBoard ? s.board : null,
    dist: showBoard ? s.dist : null,
    stats: ['final', 'poll', 'end'].includes(s.phase) ? s.stats : null,
  };
}

function hostState(s) {
  const { hostKey, ...rest } = s;
  return { ...rest, now: Date.now() };
}

// Tính điểm: đúng = 500 + thưởng tốc độ tới 500; chuỗi đúng liên tiếp +100 từ câu thứ 2
async function compute(store, s) {
  const players = await listPlayers(store, s.pin);
  const answers = await listAnswers(store, s.pin);
  const map = new Map();
  for (const a of answers) {
    if (a.q > s.q) continue;
    if (!map.has(a.id)) map.set(a.id, {});
    map.get(a.id)[a.q] = a;
  }
  const durMs = s.duration * 1000;
  const qStats = [];
  for (let q = 0; q <= s.q; q++) qStats.push({ answered: 0, correct: 0, wrong: {} });

  const board = players.map((p) => {
    const mine = map.get(p.id) || {};
    let score = 0, correct = 0, streak = 0, totalMs = 0, marks = '';
    let lastPts = 0, lastChoice = null, lastCorrect = false;
    for (let q = 0; q <= s.q; q++) {
      const a = mine[q];
      const ans = s.questions[q].ans;
      let pts = 0, ok = false;
      if (a) {
        qStats[q].answered++;
        totalMs += a.ms;
        if (a.choice === ans) {
          ok = true;
          pts = 500 + Math.round(500 * Math.max(0, 1 - a.ms / durMs)) + (streak >= 1 ? 100 : 0);
          streak++; correct++; qStats[q].correct++;
        } else {
          streak = 0;
          qStats[q].wrong[a.choice] = (qStats[q].wrong[a.choice] || 0) + 1;
        }
      } else {
        streak = 0;
      }
      score += pts;
      marks += a ? (ok ? '1' : '0') : '-';
      if (q === s.q) { lastPts = pts; lastChoice = a ? a.choice : null; lastCorrect = ok; }
    }
    return { id: p.id, nick: p.nick, score, correct, streak, totalMs, marks, lastPts, lastChoice, lastCorrect };
  });
  board.sort((a, b) => b.score - a.score || b.correct - a.correct || a.totalMs - b.totalMs);
  board.forEach((b, i) => { b.rank = i + 1; delete b.totalMs; });

  const dist = Object.fromEntries(LETTERS.map((l) => [l, 0]));
  for (const a of answers) if (a.q === s.q && dist[a.choice] !== undefined) dist[a.choice]++;

  let hardest = null;
  qStats.forEach((st, q) => {
    const n = Math.max(1, players.length);
    const wrongRate = (n - st.correct) / n;
    if (!hardest || wrongRate > hardest.wrongRate) {
      const topWrong = Object.entries(st.wrong).sort((a, b) => b[1] - a[1])[0];
      hardest = { q, wrongRate, text: s.questions[q].t, ans: s.questions[q].ans, topWrong: topWrong ? topWrong[0] : null };
    }
  });
  const totalCorrect = board.reduce((t, b) => t + b.correct, 0);
  const stats = {
    players: players.length,
    accuracy: players.length ? totalCorrect / (players.length * (s.q + 1)) : 0,
    hardest,
  };
  return { board, dist, stats };
}

export async function handle(req, store) {
  const url = new URL(req.url);
  const action = url.pathname.split('/').filter(Boolean).pop();
  let body = {};
  if (req.method === 'POST') { try { body = await req.json(); } catch { body = {}; } }
  const pin = String(body.pin ?? url.searchParams.get('pin') ?? '').replace(/\D/g, '').slice(0, 6);

  try {
    if (action === 'create' && req.method === 'POST') {
      const qs = Array.isArray(body.questions) ? body.questions.slice(0, 40) : [];
      const questions = qs.map((q) => ({
        t: cleanText(q.t, 300), area: cleanText(q.area, 30), ans: LETTERS.includes(q.ans) ? q.ans : null, why: cleanText(q.why, 300),
      })).filter((q) => q.t && q.ans);
      if (!questions.length) return fail('Cần ít nhất 1 câu hỏi có đáp án.');
      const duration = Math.min(60, Math.max(5, Number(body.duration) || 15));
      let newPin = null;
      for (let i = 0; i < 12 && !newPin; i++) {
        const p = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
        if (!(await store.get(K.state(p)))) newPin = p;
      }
      if (!newPin) return fail('Không tạo được mã phòng, thử lại.', 500);
      const s = {
        pin: newPin, hostKey: rid(24), title: cleanText(body.title, 80) || 'Săn Lãng Phí', duration, questions,
        phase: 'lobby', q: -1, startedAt: 0, revealedQ: -1, board: [], dist: null, stats: null, createdAt: Date.now(),
      };
      await store.setJSON(K.state(newPin), s);
      return json({ pin: newPin, hostKey: s.hostKey });
    }

    if (!/^\d{6}$/.test(pin)) return fail('Mã PIN gồm 6 chữ số.');
    const s = await store.get(K.state(pin), { type: 'json' });
    if (!s) return fail('Không tìm thấy phòng chơi với mã PIN này.', 404);

    if (action === 'state') return json(publicState(s), 200, true);

    if (action === 'join' && req.method === 'POST') {
      const players = await listPlayers(store, pin);
      const pid = String(body.playerId || '');
      const existing = players.find((p) => p.id === pid);
      if (existing) return json({ playerId: existing.id, nick: existing.nick });
      if (s.phase === 'end') return fail('Phòng chơi đã kết thúc.', 409);
      const nick = cleanText(body.nick, 20);
      if (nick.length < 2) return fail('Nickname cần ít nhất 2 ký tự.');
      if (players.length >= MAX_PLAYERS) return fail('Phòng đã đủ người.', 409);
      if (players.some((p) => p.nick.toLowerCase() === nick.toLowerCase())) return fail('Nickname này đã có người dùng, hãy chọn tên khác.', 409);
      const id = rid(10);
      await store.set(`${K.players(pin)}${id}.${b64(nick)}`, '1');
      return json({ playerId: id, nick });
    }

    if (action === 'answer' && req.method === 'POST') {
      const id = String(body.playerId || '');
      const choice = String(body.choice || '');
      if (!/^[a-z0-9]{10}$/.test(id) || !LETTERS.includes(choice)) return fail('Dữ liệu không hợp lệ.');
      if (s.phase !== 'question' || Number(body.q) !== s.q) return fail('Câu hỏi đã đóng.', 409);
      const ms = Date.now() - s.startedAt;
      if (ms > s.duration * 1000 + 1500) return fail('Hết giờ rồi!', 409);
      if (!(await keys(store, `${K.players(pin)}${id}.`)).length) return fail('Bạn chưa vào phòng.', 403);
      if ((await keys(store, `${K.answers(pin)}${s.q}/${id}.`)).length) return json({ ok: true, already: true });
      await store.set(`${K.answers(pin)}${s.q}/${id}.${choice}.${Math.max(0, ms)}`, '1');
      return json({ ok: true });
    }

    if (action === 'vote' && req.method === 'POST') {
      const id = String(body.playerId || '');
      const choice = String(body.choice || '');
      if (!/^[a-z0-9]{10}$/.test(id) || !LETTERS.includes(choice)) return fail('Dữ liệu không hợp lệ.');
      if (s.phase !== 'poll') return fail('Bình chọn chưa mở.', 409);
      if ((await keys(store, `${K.votes(pin)}${id}.`)).length) return json({ ok: true, already: true });
      await store.set(`${K.votes(pin)}${id}.${choice}`, '1');
      return json({ ok: true });
    }

    // ---- Các thao tác của người dẫn: cần hostKey ----
    const key = String(body.key ?? url.searchParams.get('key') ?? '');
    if (key !== s.hostKey) return fail('Không có quyền người dẫn.', 403);

    if (action === 'host') {
      const players = await listPlayers(store, pin);
      const out = { state: hostState(s), players };
      if (s.phase === 'question' && s.q >= 0) {
        const ans = await listAnswers(store, pin, s.q);
        const dist = Object.fromEntries(LETTERS.map((l) => [l, 0]));
        for (const a of ans) if (dist[a.choice] !== undefined) dist[a.choice]++;
        out.answered = ans.length;
        out.dist = dist;
      }
      if (s.phase === 'poll' || s.phase === 'end') {
        const votes = await listVotes(store, pin);
        out.votes = Object.fromEntries(LETTERS.map((l) => [l, votes.filter((v) => v.choice === l).length]));
        out.voted = votes.length;
      }
      if (url.searchParams.get('full') === '1') out.answers = await listAnswers(store, pin);
      return json(out);
    }

    if (action === 'control' && req.method === 'POST') {
      const act = String(body.action || '');
      if (act === 'start') {
        const q = Number(body.q);
        if (!(q >= 0 && q < s.questions.length)) return fail('Câu hỏi không tồn tại.');
        s.q = q; s.phase = 'question'; s.startedAt = Date.now(); s.dist = null;
      } else if (act === 'reveal' || act === 'final') {
        if (s.q < 0) return fail('Chưa có câu hỏi nào.');
        Object.assign(s, await compute(store, s));
        s.revealedQ = s.q;
        s.phase = act === 'reveal' ? 'reveal' : 'final';
      } else if (act === 'leaderboard') {
        s.phase = 'leaderboard';
      } else if (act === 'poll') {
        s.phase = 'poll';
      } else if (act === 'end') {
        s.phase = 'end';
      } else {
        return fail('Thao tác không hợp lệ.');
      }
      await store.setJSON(K.state(pin), s);
      return json({ state: hostState(s) });
    }

    return fail('Không tìm thấy API.', 404);
  } catch (err) {
    console.error(err);
    return fail('Lỗi máy chủ, vui lòng thử lại.', 500);
  }
}
