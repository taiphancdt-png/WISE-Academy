// Màn hình người chơi trên điện thoại
const app = $('#app');
const music = new Music();
const P = {
  pin: '', playerId: '', nick: '', s: null, key: '', answer: null, voted: false,
  sound: store('slp-sound') === true, timer: null, poller: null, failCount: 0,
};
const SPEAKER_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
const SPEAKER_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';

function setBg(c) { document.body.style.background = c || 'var(--navy)'; }
function stripHtml() { return `<div class="strip">${WASTES.map((w) => `<span style="background:${w.color}"></span>`).join('')}</div>`; }

function updateSoundBtn() {
  const b = $('#soundBtn');
  b.classList.toggle('hidden', !P.playerId);
  b.innerHTML = P.sound ? SPEAKER_ON : SPEAKER_OFF;
  b.setAttribute('aria-pressed', String(P.sound));
  b.setAttribute('aria-label', P.sound ? 'Tắt âm thanh' : 'Bật âm thanh');
}
$('#soundBtn').addEventListener('click', () => {
  P.sound = !P.sound; store('slp-sound', P.sound); updateSoundBtn();
  if (P.sound) music.pop(); else music.stop();
});
const sfx = (name) => { if (P.sound) music[name](); };

// ---------- Vào game ----------
function renderJoin(err) {
  setBg();
  const urlPin = new URLSearchParams(location.search).get('pin') || P.pin || '';
  app.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:8px">
      ${stripHtml()}
      <h1 class="big-title">Săn<br>Lãng Phí 5′</h1>
      <p class="sub">8 tình huống · trả lời đúng và nhanh để leo hạng.</p>
    </div>
    <form id="joinForm" style="display:flex;flex-direction:column;gap:16px">
      <label class="field">Mã PIN trên màn hình người dẫn
        <input id="pin" inputmode="numeric" autocomplete="off" maxlength="7" value="${esc(urlPin)}" style="letter-spacing:.18em;font-weight:700;font-size:26px" required>
      </label>
      <label class="field">Nickname của bạn
        <input id="nick" maxlength="20" autocomplete="nickname" value="${esc(P.nick)}" placeholder="VD: An Lean Master" required>
      </label>
      ${err ? `<div class="error" role="alert">${esc(err)}</div>` : ''}
      <button class="btn btn-primary" type="submit" style="height:60px;font-size:19px">Vào game</button>
    </form>
    <div class="foot">Mỗi tình huống chọn MỘT loại lãng phí nổi bật nhất.</div>`;
  $('#joinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    music.ensure(); // mở khoá âm thanh trên iPhone bằng thao tác chạm
    const pin = $('#pin').value.replace(/\D/g, '');
    const nick = $('#nick').value.trim();
    const btn = e.submitter || $('#joinForm button');
    btn.disabled = true; btn.textContent = 'Đang vào…';
    try {
      const r = await api('join', { pin, nick });
      P.pin = pin; P.playerId = r.playerId; P.nick = r.nick;
      store('slp-player', { pin, playerId: r.playerId, nick: r.nick });
      history.replaceState(null, '', `?pin=${pin}`);
      startPolling();
    } catch (err2) {
      renderJoin(err2.message);
    }
  });
}

// ---------- Vòng lặp lấy trạng thái ----------
function startPolling() {
  $('#me').textContent = P.nick;
  updateSoundBtn();
  P.answer = store(`slp-ans-${P.pin}`);
  P.voted = store(`slp-vote-${P.pin}`) === true;
  clearInterval(P.poller);
  tick();
  P.poller = setInterval(tick, 1000);
  clearInterval(P.timer);
  P.timer = setInterval(updateTimer, 200);
}

async function tick() {
  try {
    const s = await api(`state?pin=${P.pin}`);
    P.failCount = 0;
    clock.sync(s.now);
    P.s = s;
    const key = [s.phase, s.q, P.answer && P.answer.q === s.q ? 'a' : '', P.voted ? 'v' : ''].join('|');
    if (key !== P.key) { P.key = key; render(true); }
  } catch (err) {
    if (err.status === 404) {
      clearInterval(P.poller); clearInterval(P.timer); store('slp-player', null);
      P.playerId = ''; updateSoundBtn(); renderJoin('Phòng chơi không còn tồn tại.');
    } else if (++P.failCount === 4) {
      const n = document.createElement('div'); n.className = 'error'; n.textContent = 'Mạng chập chờn, đang kết nối lại…'; app.prepend(n);
    }
  }
}

function me() { return P.s && P.s.board ? P.s.board.find((b) => b.id === P.playerId) : null; }

function render(changed) {
  const s = P.s;
  if (!s) return;
  if (changed) music.stop();
  if (s.phase === 'lobby') return renderLobby();
  if (s.phase === 'question') return P.answer && P.answer.q === s.q ? renderLocked() : renderQuestion();
  if (s.phase === 'reveal') return renderReveal(changed);
  if (s.phase === 'leaderboard') return renderLeaderboard();
  if (s.phase === 'final') return renderFinal(changed);
  if (s.phase === 'poll') return P.voted ? renderVoted() : renderPoll();
  return renderEnd();
}

function renderLobby() {
  setBg();
  app.innerHTML = `
    <div class="center" style="margin-top:12vh">
      ${stripHtml()}
      <h1 class="big-title" style="font-size:34px">Bạn đã vào!</h1>
      <div class="chip" style="background:var(--amber);color:#fff;font-size:20px;padding:8px 18px">${esc(P.nick)}</div>
      <p class="sub pulse">Theo dõi màn hình người dẫn, chờ bắt đầu…</p>
    </div>
    <div class="card-white" style="margin-top:auto">
      <div class="label-sm">Mẹo nhỏ</div>
      <p style="margin:6px 0 0;font-size:16px;line-height:1.5"><b>Người</b> di chuyển → Thao tác thừa. <b>Vật</b> di chuyển → Vận chuyển.</p>
    </div>`;
}

function qHeader(s) {
  return `
    <div class="qbar">
      <div><small>Câu</small><b>${s.q + 1} / ${s.total}</b></div>
      <div class="timer" id="timer">${Math.ceil(clock.left(s.startedAt, s.duration))}</div>
      <div style="text-align:right"><small>Điểm</small><b>${fmt(me() ? me().score : (P.lastScore || 0))}</b></div>
    </div>
    <div class="progress"><div id="prog" style="width:100%"></div></div>`;
}

function renderQuestion() {
  setBg();
  const s = P.s;
  const left = clock.left(s.startedAt, s.duration);
  app.innerHTML = `
    ${qHeader(s)}
    <div class="card-white">
      <div class="label-sm">Tình huống · ${esc(s.question.area || '')}</div>
      <p class="qtext">${esc(s.question.t)}</p>
    </div>
    <div style="font-size:15px;font-weight:600;color:var(--muted-2)">Đây là loại lãng phí nào?</div>
    <div class="answers">
      ${WASTES.map((w) => `<button class="ans" type="button" data-k="${w.k}" style="background:${w.color}" ${left <= 0 ? 'disabled' : ''}>
        <span class="top">${svgIcon(w.k)}<b>${w.k}</b></span><span class="nm">${esc(w.name)}</span></button>`).join('')}
    </div>
    <div class="foot" id="qfoot">Chạm một lần là khoá đáp án</div>`;
  app.querySelectorAll('.ans').forEach((b) => b.addEventListener('click', () => choose(b.dataset.k)));
}

async function choose(k) {
  const s = P.s;
  if (P.answer && P.answer.q === s.q) return;
  P.answer = { q: s.q, choice: k };
  store(`slp-ans-${P.pin}`, P.answer);
  if (navigator.vibrate) navigator.vibrate(30);
  sfx('pop');
  P.key = [s.phase, s.q, 'a', P.voted ? 'v' : ''].join('|');
  renderLocked();
  try {
    await api('answer', { pin: P.pin, playerId: P.playerId, q: s.q, choice: k });
  } catch (err) {
    const f = $('#lockmsg'); if (f) { f.textContent = err.message; f.style.color = '#FFD7DD'; }
  }
}

function renderLocked() {
  setBg();
  const s = P.s; const k = P.answer.choice;
  app.innerHTML = `
    ${qHeader(s)}
    <div class="center" style="margin-top:8vh">
      <div class="badge" style="background:${W[k].color};color:var(--ink)">${svgIcon(k, 52)}</div>
      <h2 style="margin:0;font-size:28px">Đã khoá đáp án</h2>
      <span class="chip" style="background:${W[k].color};font-size:18px;padding:8px 16px">${esc(wasteLabel(k))}</span>
      <p class="sub pulse" id="lockmsg">Chờ người dẫn công bố…</p>
    </div>`;
}

function updateTimer() {
  const s = P.s;
  if (!s || s.phase !== 'question') return;
  const left = clock.left(s.startedAt, s.duration);
  const t = $('#timer'); const p = $('#prog');
  if (t) { t.textContent = Math.ceil(left); t.classList.toggle('low', left <= 3); }
  if (p) p.style.width = `${(left / s.duration) * 100}%`;
  if (left <= 0 && !(P.answer && P.answer.q === s.q)) {
    app.querySelectorAll('.ans').forEach((b) => { b.disabled = true; b.classList.add('dim'); });
    const f = $('#qfoot'); if (f) f.textContent = 'Hết giờ! Chờ công bố đáp án…';
  }
}

function renderReveal(changed) {
  const s = P.s; const m = me();
  const ok = m && m.lastCorrect;
  P.lastScore = m ? m.score : P.lastScore;
  setBg(ok ? '#0B3B37' : '#3A1620');
  if (changed) sfx(ok ? 'fanfare' : 'wah');
  const mine = m && m.lastChoice;
  app.innerHTML = `
    <div class="qbar"><div><small>Câu</small><b>${s.q + 1} / ${s.total}</b></div><div></div></div>
    <div class="center">
      <div class="badge" style="background:${ok ? 'var(--ok)' : 'var(--bad)'};color:${ok ? '#0B3B37' : '#3A1620'}">
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ok ? '<path d="M5 12.5l4.5 4.5L19 7.5"/>' : '<path d="M7 7l10 10M17 7L7 17"/>'}</svg>
      </div>
      <h1 class="big-title" style="font-size:38px">${ok ? 'Chính xác!' : (mine ? 'Chưa đúng' : 'Hết giờ')}</h1>
      ${ok ? `<b style="font-size:30px;color:var(--amber)">+ ${fmt(m.lastPts)} điểm</b>${m.streak >= 2 ? `<span class="sub">Chuỗi đúng ×${m.streak}</span>` : ''}` : `<span class="sub">Không sao, còn ${s.total - s.q - 1} câu để gỡ điểm!</span>`}
    </div>
    <div class="card-white" style="display:flex;flex-direction:column;gap:10px">
      ${!ok && mine ? `<div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--ink-3);font-size:14px">Bạn chọn</span><span class="chip" style="background:${W[mine].color}">${esc(wasteLabel(mine))}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--ink-3);font-size:14px">Đáp án</span><span class="chip" style="background:${W[s.answer].color}">${esc(wasteLabel(s.answer))}</span></div>
      ${s.why ? `<p style="margin:0;font-size:16px;line-height:1.5">${esc(s.why)}</p>` : ''}
    </div>
    <div class="stat2">
      <div class="stat"><span>Tổng điểm</span><b>${fmt(m ? m.score : 0)}</b></div>
      <div class="stat"><span>Thứ hạng</span><b>${m ? m.rank : '-'} / ${s.board.length}</b></div>
    </div>
    <div class="foot pulse">Chờ câu tiếp theo…</div>`;
}

function topList(s, n) {
  const m = me();
  const top = s.board.slice(0, n);
  let html = top.map((b) => `<div class="${b.id === P.playerId ? 'me' : ''}"><b class="r">${b.rank}</b><span class="n">${esc(b.nick)}</span><b>${fmt(b.score)}</b></div>`).join('');
  if (m && m.rank > n) html += `<div class="me"><b class="r">${m.rank}</b><span class="n">${esc(m.nick)} (bạn)</span><b>${fmt(m.score)}</b></div>`;
  return `<div class="list-rank">${html}</div>`;
}

function renderLeaderboard() {
  setBg();
  const s = P.s; const m = me();
  app.innerHTML = `
    <div><div class="eyebrow" style="color:var(--amber)">BẢNG XẾP HẠNG</div><h1 class="big-title" style="font-size:32px">Sau câu ${s.q + 1}</h1></div>
    <div class="stat2"><div class="stat"><span>Hạng của bạn</span><b style="color:var(--amber)">${m ? m.rank : '-'} / ${s.board.length}</b></div><div class="stat"><span>Điểm</span><b>${fmt(m ? m.score : 0)}</b></div></div>
    ${topList(s, 5)}
    <div class="foot pulse">Chờ câu tiếp theo…</div>`;
}

function marksHtml(m, total) {
  const marks = (m ? m.marks : '').padEnd(total, '-');
  return `<div class="marks" style="grid-template-columns:repeat(${Math.min(total, 10)},1fr)">${[...marks].map((c, i) => `<span style="background:${c === '1' ? 'var(--ok)' : 'var(--line)'};color:${c === '1' ? 'var(--ink)' : 'var(--text)'};${c !== '1' ? 'text-decoration:line-through' : ''}">${i + 1}</span>`).join('')}</div>`;
}

function title(rank, n) {
  if (!rank) return 'Cảm ơn bạn!';
  if (rank === 1) return 'Nhà vô địch săn lãng phí!';
  if (rank <= 3) return 'Thợ săn lãng phí hạng Vàng';
  if (rank <= Math.ceil(n / 3)) return 'Thợ săn lãng phí hạng Bạc';
  return 'Thợ săn lãng phí tập sự';
}

function renderFinal(changed) {
  setBg();
  const s = P.s; const m = me();
  if (changed && m && m.rank <= 3) sfx('champion');
  app.innerHTML = `
    <div><div class="eyebrow" style="color:var(--amber)">HOÀN THÀNH</div><h1 class="big-title" style="font-size:30px">${esc(title(m && m.rank, s.board.length))}</h1></div>
    <div class="stat3">
      <div class="stat"><span>Hạng</span><b style="color:var(--amber)">${m ? m.rank : '-'}<small style="font-size:14px;color:var(--muted)">/${s.board.length}</small></b></div>
      <div class="stat"><span>Điểm</span><b>${fmt(m ? m.score : 0)}</b></div>
      <div class="stat"><span>Đúng</span><b>${m ? m.correct : 0}<small style="font-size:14px;color:var(--muted)">/${s.total}</small></b></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:13px;color:var(--muted)">Từng câu</span>${marksHtml(m, s.total)}</div>
    ${topList(s, 3)}
    <div class="foot pulse">Chờ câu hỏi bình chọn…</div>`;
}

function renderPoll() {
  setBg();
  let pick = null;
  app.innerHTML = `
    <div><div class="eyebrow" style="color:var(--amber)">CÂU HỎI CHỐT · BÌNH CHỌN</div></div>
    <div class="card-white" style="display:flex;flex-direction:column;gap:12px">
      <b style="font-size:20px;line-height:1.35">Lãng phí nào bạn gặp nhiều nhất ở chỗ làm?</b>
      <div class="poll-grid">${WASTES.map((w) => `<button type="button" data-k="${w.k}" aria-pressed="false"><span class="dot" style="background:${w.color}"></span>${esc(w.short || w.name)}</button>`).join('')}</div>
    </div>
    <button id="sendVote" class="btn btn-primary" type="button" disabled style="margin-top:auto">Gửi bình chọn</button>`;
  app.querySelectorAll('.poll-grid button').forEach((b) => b.addEventListener('click', () => {
    pick = b.dataset.k;
    app.querySelectorAll('.poll-grid button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $('#sendVote').disabled = false;
  }));
  $('#sendVote').addEventListener('click', async () => {
    if (!pick) return;
    $('#sendVote').disabled = true;
    try {
      await api('vote', { pin: P.pin, playerId: P.playerId, choice: pick });
      P.voted = true; store(`slp-vote-${P.pin}`, true); sfx('pop');
      P.key = ''; tick();
    } catch (err) { $('#sendVote').disabled = false; alertBox(err.message); }
  });
}
function alertBox(msg) { const n = document.createElement('div'); n.className = 'error'; n.setAttribute('role', 'alert'); n.textContent = msg; app.prepend(n); }

function renderVoted() {
  setBg();
  app.innerHTML = `<div class="center" style="margin-top:16vh"><div class="badge" style="background:var(--amber);color:#fff"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h1 class="big-title" style="font-size:32px">Đã ghi nhận!</h1><p class="sub">Kết quả bình chọn sẽ là đề bài Kaizen của lớp. Theo dõi màn hình người dẫn nhé.</p></div>`;
}

function renderEnd() {
  setBg();
  const m = me();
  app.innerHTML = `<div class="center" style="margin-top:14vh">${stripHtml()}<h1 class="big-title" style="font-size:34px">Cảm ơn bạn đã chơi!</h1>${m ? `<p class="sub">Hạng ${m.rank} · ${fmt(m.score)} điểm · đúng ${m.correct}/${P.s.total}</p>` : ''}<p class="sub">Lãng phí không ở đâu xa, hãy săn nó ngay trong ca làm việc của bạn.</p></div>`;
  clearInterval(P.poller); clearInterval(P.timer);
}

// ---------- Khởi động ----------
(async function init() {
  const urlPin = (new URLSearchParams(location.search).get('pin') || '').replace(/\D/g, '');
  const saved = store('slp-player');
  if (saved && (!urlPin || urlPin === saved.pin)) {
    try {
      const r = await api('join', { pin: saved.pin, playerId: saved.playerId, nick: saved.nick });
      P.pin = saved.pin; P.playerId = r.playerId; P.nick = r.nick;
      return startPolling();
    } catch (e) { store('slp-player', null); P.nick = saved.nick || ''; }
  }
  P.pin = urlPin;
  renderJoin();
})();
