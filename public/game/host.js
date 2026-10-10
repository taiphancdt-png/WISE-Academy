// Màn hình người dẫn: chọn câu hỏi → mở phòng → điều khiển game trên màn chiếu
const music = new Music();
const setupEl = $('#setup');
const stageEl = $('#stage');

const defaults = { picked: [], answers: {}, custom: [], duration: 15, title: 'Săn Lãng Phí 5′', autoReveal: true, earlyEnd: true, filter: 'all', onlyPicked: false };
const S = Object.assign({}, defaults, store('slp-host-setup') || {});
const H = { pin: '', key: '', s: null, players: [], answered: 0, dist: null, votes: null, voted: 0, poller: null, timer: null, lastKey: '', beeped: {}, auto: {}, musicOn: true, lobbyMusic: false };

const saveSetup = () => store('slp-host-setup', S);
const allQ = () => BANK.concat(S.custom);
const findQ = (id) => allQ().find((q) => q.id === id);
const ansOf = (q) => S.answers[q.id] || q.w;

// ======================= CHỌN CÂU HỎI =======================
function renderSetup() {
  stageEl.classList.add('hidden'); setupEl.classList.remove('hidden');
  document.body.style.background = 'var(--paper)';
  const covered = new Set(S.picked.map((id) => findQ(id)).filter(Boolean).map(ansOf));
  const missing = WASTES.filter((w) => !covered.has(w.k)).map((w) => w.name);
  const secs = S.picked.length * (S.duration + 7) + 80;
  const cards = allQ().filter((q) => (!S.onlyPicked || S.picked.includes(q.id)) && (S.filter === 'all' || ansOf(q) === S.filter));
  const resume = store('slp-host-game');

  setupEl.innerHTML = `<div class="wrap">
    <div class="row" style="justify-content:space-between;align-items:flex-end">
      <div style="display:flex;flex-direction:column;gap:8px;max-width:820px">
        <span class="logo-chip on-light"><img src="/images/brand/logo-transparent.png" alt="WISE Academy"></span>
        <div class="eyebrow">NGƯỜI DẪN · WISE ACADEMY</div>
        <h1>Săn Lãng Phí 5′: chuẩn bị phiên chơi</h1>
        <p style="margin:0;font-size:17px;line-height:1.5;color:var(--ink-2)">Bấm <b>Chọn</b> để đưa câu vào phiên, bấm chữ cái màu để đặt <b>đáp án đúng</b>. Lựa chọn được lưu tự động trên máy này.</p>
      </div>
      <div class="row" style="gap:10px">
        <button class="btn btn-dark" data-act="quick" type="button">Chọn nhanh 8 câu (mỗi loại 1)</button>
        <button class="btn btn-light" data-act="clear" type="button">Bỏ chọn tất cả</button>
      </div>
    </div>
    ${resume ? `<div class="warn" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between"><span>Có phòng chơi đang mở (PIN <b>${esc(resume.pin)}</b>).</span><span class="row" style="gap:8px"><button class="btn btn-dark" data-act="resume" type="button" style="height:44px">Quay lại phòng</button><button class="btn btn-light" data-act="forget" type="button" style="height:44px">Bỏ qua</button></span></div>` : ''}

    <div class="row">
      <div class="panel" style="flex:999 1 560px;min-width:0">
        <div class="row" style="justify-content:space-between;align-items:baseline;gap:10px"><h2>Phiên chơi · ${S.picked.length} câu</h2><span style="color:var(--ink-3)">${S.picked.length ? `≈ ${Math.floor(secs / 60)} phút ${secs % 60} giây` : 'Khuyến nghị 8 câu cho 5 phút'}</span></div>
        ${S.picked.length && missing.length ? `<div class="warn">Chưa có loại: ${esc(missing.join(', '))}. Nên phủ đủ 8 loại.</div>` : ''}
        ${S.picked.length ? '' : '<div class="empty">Chưa có câu nào. Bấm “Chọn” ở các câu bên dưới hoặc “Chọn nhanh 8 câu”.</div>'}
        <div style="display:flex;flex-direction:column;gap:8px">
          ${S.picked.map((id, i) => { const q = findQ(id); if (!q) return ''; const a = ansOf(q); return `<div class="sess-item"><b>${i + 1}</b><span class="t">${esc(q.t)}</span><span class="chip" style="background:${W[a].color}">${esc(wasteLabel(a))}</span>
            <button class="icon-btn" data-act="up" data-i="${i}" type="button" aria-label="Đưa lên"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>
            <button class="icon-btn" data-act="down" data-i="${i}" type="button" aria-label="Đưa xuống"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
            <button class="icon-btn" data-act="remove" data-i="${i}" type="button" aria-label="Bỏ khỏi phiên" style="color:#A3302D"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`; }).join('')}
        </div>
      </div>
      <div class="panel dark" style="flex:1 1 360px;min-width:0">
        <h2>Cài đặt & mở phòng</h2>
        <label class="field">Tên phiên (hiện trên màn chiếu / màn hình chia sẻ)<input id="title" maxlength="80" value="${esc(S.title)}" style="font-size:17px"></label>
        <label class="field">Thời gian mỗi câu (giây)<input id="duration" type="number" min="5" max="60" value="${S.duration}" style="font-size:17px"></label>
        <label class="toggle" style="color:var(--muted-2)"><input id="autoReveal" type="checkbox" ${S.autoReveal ? 'checked' : ''}> Tự công bố đáp án khi hết giờ</label>
        <label class="toggle" style="color:var(--muted-2)"><input id="earlyEnd" type="checkbox" ${S.earlyEnd ? 'checked' : ''}> Kết thúc sớm khi tất cả đã trả lời</label>
        <div id="createErr"></div>
        <button class="btn btn-primary" data-act="create" type="button" ${S.picked.length ? '' : 'disabled'} style="margin-top:auto;height:58px;font-size:18px">Mở phòng chơi ›</button>
      </div>
    </div>

    <div class="panel">
      <h2>Thêm tình huống của riêng bạn</h2>
      <div class="form-row">
        <label style="flex:999 1 380px;min-width:0">Tình huống (≤ 25 từ, có con số cụ thể)<input id="cText" maxlength="300" placeholder="VD: Tổ 3 mất 20 phút mỗi ca để tìm dao cắt đúng cỡ"></label>
        <label style="flex:1 1 150px">Lĩnh vực<select id="cArea"><option>Nhà máy</option><option>Văn phòng</option><option>Kho vận</option></select></label>
        <label style="flex:1 1 220px">Đáp án đúng<select id="cAns">${WASTES.map((w) => `<option value="${w.k}">${esc(wasteLabel(w.k))}</option>`).join('')}</select></label>
        <label style="flex:999 1 300px;min-width:0">Giải thích ngắn (tuỳ chọn)<input id="cWhy" maxlength="300" placeholder="Hiện khi công bố đáp án"></label>
        <button class="btn btn-dark" data-act="add" type="button" style="height:48px">Thêm & chọn</button>
      </div>
    </div>

    <div class="filters">
      <b style="margin-right:6px">Lọc theo đáp án:</b>
      <button class="pill ${S.filter === 'all' ? 'on' : ''}" data-act="filter" data-k="all" type="button">Tất cả</button>
      ${WASTES.map((w) => `<button class="pill ${S.filter === w.k ? 'on' : ''}" data-act="filter" data-k="${w.k}" type="button"><span class="dot" style="background:${w.color}"></span>${esc(wasteLabel(w.k))}</button>`).join('')}
      <button class="pill ${S.onlyPicked ? 'on' : ''}" data-act="only" type="button">Chỉ câu đã chọn</button>
    </div>

    <div class="cards">
      ${cards.map((q) => { const a = ansOf(q); const on = S.picked.includes(q.id); return `<div class="qcard ${on ? 'on' : ''}">
        <div class="hd"><div><b>${esc(q.id)}</b><small>${esc(q.a)}</small></div><button class="pick ${on ? 'on' : ''}" data-act="toggle" data-id="${esc(q.id)}" type="button" aria-pressed="${on}">${on ? '✓ Đã chọn' : 'Chọn'}</button></div>
        <p>${esc(q.t)}</p>
        <div class="letters">${WASTES.map((w) => `<button type="button" class="${w.k === a ? 'on' : ''}" style="background:${w.color}" data-act="ans" data-id="${esc(q.id)}" data-k="${w.k}" aria-label="Đặt đáp án đúng: ${esc(w.name)}" aria-pressed="${w.k === a}">${w.k}</button>`).join('')}</div>
        <div class="ansline">Đáp án đúng: <span class="chip" style="background:${W[a].color}">${esc(wasteLabel(a))}</span>${a !== q.w ? `<span style="color:#C9500E">· đã đổi (gợi ý: ${esc(wasteLabel(q.w))})</span>` : ''}</div>
      </div>`; }).join('')}
    </div>
  </div>`;
}

setupEl.addEventListener('change', (e) => {
  const id = e.target.id;
  if (id === 'title') S.title = e.target.value;
  if (id === 'duration') S.duration = Math.min(60, Math.max(5, Number(e.target.value) || 15));
  if (id === 'autoReveal') S.autoReveal = e.target.checked;
  if (id === 'earlyEnd') S.earlyEnd = e.target.checked;
  saveSetup();
  if (id === 'duration') renderSetup();
});

setupEl.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act; const i = Number(b.dataset.i);
  const p = S.picked;
  if (act === 'toggle') { const k = p.indexOf(b.dataset.id); if (k >= 0) p.splice(k, 1); else p.push(b.dataset.id); }
  else if (act === 'ans') S.answers[b.dataset.id] = b.dataset.k;
  else if (act === 'up' && i > 0) [p[i - 1], p[i]] = [p[i], p[i - 1]];
  else if (act === 'down' && i < p.length - 1) [p[i + 1], p[i]] = [p[i], p[i + 1]];
  else if (act === 'remove') p.splice(i, 1);
  else if (act === 'clear') S.picked = [];
  else if (act === 'filter') S.filter = b.dataset.k;
  else if (act === 'only') S.onlyPicked = !S.onlyPicked;
  else if (act === 'quick') {
    const pickedNow = [];
    WASTES.forEach((w) => { const pool = allQ().filter((q) => ansOf(q) === w.k); if (pool.length) pickedNow.push(pool[Math.floor(Math.random() * pool.length)].id); });
    for (let j = pickedNow.length - 1; j > 0; j--) { const r = Math.floor(Math.random() * (j + 1)); [pickedNow[j], pickedNow[r]] = [pickedNow[r], pickedNow[j]]; }
    S.picked = pickedNow;
  } else if (act === 'add') {
    const t = $('#cText').value.trim();
    if (!t) { $('#cText').focus(); return; }
    const id = `C${S.custom.length + 1}`;
    S.custom.push({ id, w: $('#cAns').value, a: $('#cArea').value, t, why: $('#cWhy').value.trim() });
    S.picked.push(id);
  } else if (act === 'create') return createGame(b);
  else if (act === 'resume') { const g = store('slp-host-game'); H.pin = g.pin; H.key = g.key; return enterStage(); }
  else if (act === 'forget') store('slp-host-game', null);
  saveSetup(); renderSetup();
});

async function createGame(btn) {
  btn.disabled = true; btn.textContent = 'Đang mở phòng…';
  music.ensure(); // mở khoá âm thanh
  const questions = S.picked.map(findQ).filter(Boolean).map((q) => ({ t: q.t, area: q.a, ans: ansOf(q), why: ansOf(q) === q.w ? (q.why || '') : '' }));
  try {
    const r = await api('create', { questions, duration: S.duration, title: S.title });
    H.pin = r.pin; H.key = r.hostKey;
    store('slp-host-game', { pin: r.pin, key: r.hostKey });
    enterStage();
  } catch (err) {
    $('#createErr').innerHTML = `<div class="error" role="alert">${esc(err.message)}</div>`;
    btn.disabled = false; btn.textContent = 'Mở phòng chơi ›';
  }
}

// Full screen for projecting / screen sharing; Safari still uses the webkit-prefixed calls
function toggleFullscreen() {
  const d = document, el = d.documentElement;
  // Inside the Toolkit page the frame is small: open the projector screen in its own tab (same room), where full
  // screen works everywhere. Done synchronously so the browser does not block the new tab.
  if (window.self !== window.top && H.pin) {
    window.open('/game/host?resume=1', '_blank');
    music.stop(); clearInterval(H.poller); clearInterval(H.timer);
    stageEl.innerHTML = `<div class="center" style="margin:auto;gap:16px;max-width:560px"><h1 style="margin:0;font-size:34px;line-height:1.2">Màn chiếu đã mở ở tab mới</h1><p class="sub">Chia sẻ hoặc chiếu tab đó, bấm nút toàn màn hình ở góc phải (hoặc phím F11).</p><button class="btn btn-ghost" data-act="here" type="button">Tiếp tục điều khiển ở đây</button></div>`;
    return;
  }
  const on = d.fullscreenElement || d.webkitFullscreenElement;
  try {
    const p = on ? (d.exitFullscreen || d.webkitExitFullscreen).call(d) : (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    if (p && p.catch) p.catch(() => {});
  } catch (err) { /* not allowed here: the host can use "Mở màn hình người dẫn" instead */ }
}

// ======================= MÀN CHIẾU =======================
function enterStage() {
  setupEl.classList.add('hidden'); stageEl.classList.remove('hidden');
  document.body.style.background = 'var(--navy)';
  H.lastKey = '';
  clearInterval(H.poller); clearInterval(H.timer);
  hostTick();
  H.poller = setInterval(hostTick, 1200);
  H.timer = setInterval(onTimer, 200);
}

async function hostTick() {
  try {
    const r = await api(`host?pin=${H.pin}&key=${encodeURIComponent(H.key)}`);
    applyHost(r);
  } catch (err) {
    if (err.status === 404 || err.status === 403) { store('slp-host-game', null); clearInterval(H.poller); clearInterval(H.timer); alert(err.message); renderSetup(); }
  }
}

function applyHost(r) {
  if (r.state) { H.s = r.state; clock.sync(r.state.now); }
  if (r.players) H.players = r.players;
  H.answered = r.answered || 0; H.dist = r.dist || null; H.votes = r.votes || null; H.voted = r.voted || 0;
  const key = `${H.s.phase}|${H.s.q}`;
  if (key !== H.lastKey) { H.lastKey = key; renderStage(true); } else updateLive();
}

async function control(action, extra = {}) {
  try {
    const r = await api('control', Object.assign({ pin: H.pin, key: H.key, action }, extra));
    applyHost(r);
  } catch (err) { alert(err.message); }
}

const total = () => H.s.questions.length;
const left = () => clock.left(H.s.startedAt, H.s.duration);

function topBar(extraControls) {
  const s = H.s;
  const dots = s.questions.map((_, i) => `<span class="${i < s.q || (i === s.q && s.phase !== 'question') ? 'done' : i === s.q ? 'cur' : ''}"></span>`).join('');
  return `<div class="stage-top">
    <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap"><span class="logo-chip"><img src="/images/brand/logo-transparent.png" alt="WISE Academy"></span>${s.q >= 0 ? `<b style="font-size:26px">Câu ${s.q + 1} / ${total()}</b><div class="dots">${dots}</div>` : `<b style="font-size:20px">${esc(s.title)}</b>`}</div>
    <div class="controls">${extraControls}
      <button class="icon-btn" data-act="mute" type="button" aria-label="${H.musicOn ? 'Tắt nhạc' : 'Bật nhạc'}" aria-pressed="${!H.musicOn}">${H.musicOn ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'}</button>
      <button class="icon-btn" data-act="fs" type="button" aria-label="Toàn màn hình"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
    </div></div>`;
}

// every choice keeps its full colour after the reveal so the class sees how everyone answered; the right one gets a tick
function barsHtml(dist, correct) {
  const vals = WASTES.map((w) => (dist ? dist[w.k] || 0 : 0));
  const max = Math.max(1, ...vals);
  return `<div class="bars" id="bars">${WASTES.map((w, i) => `<div class="bar ${correct === w.k ? 'correct' : ''}"><b data-n="${w.k}">${correct === w.k ? '✓ ' : ''}${vals[i]}</b><div class="col" data-c="${w.k}" style="background:${w.color};height:${Math.round((vals[i] / max) * 200) + 4}px"></div><span>${w.k} · ${esc(w.short || w.name)}</span></div>`).join('')}</div>`;
}

function play(fn) { if (H.musicOn) fn(); }

function renderStage(changed) {
  const s = H.s;
  if (changed) music.stop();
  const isLast = s.q >= total() - 1;
  if (s.phase === 'lobby') {
    const joinUrl = `${location.origin}/game?pin=${s.pin}`;
    let qr = '';
    try { const g = qrcode(0, 'M'); g.addData(joinUrl); g.make(); qr = g.createSvgTag({ cellSize: 8, margin: 2, scalable: true }); } catch (e) { qr = ''; }
    stageEl.innerHTML = `${topBar(`<button class="btn btn-ghost" data-act="lobbyMusic" type="button">${H.lobbyMusic ? 'Dừng nhạc chờ' : 'Phát nhạc chờ'}</button><button class="btn btn-ghost" data-act="copyLink" type="button">Sao chép link mời</button><button class="btn btn-ghost" data-act="cancel" type="button">Huỷ phòng</button><button class="btn btn-primary" data-act="start" data-q="0" type="button">Bắt đầu câu 1 ›</button>`)}
      <div class="lobby">
        <div class="left">
          <div class="strip" style="width:320px">${WASTES.map((w) => `<span style="background:${w.color}"></span>`).join('')}</div>
          <h1>${esc(s.title)}</h1>
          <div class="steps"><div><i>1</i>Quét QR hoặc bấm link trong khung chat</div><div><i>2</i>Nhập mã PIN</div><div><i>3</i>Đặt nickname của bạn</div></div>
          <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;align-items:baseline;gap:12px"><b id="pcount" style="font-size:56px;color:var(--amber)">${H.players.length}</b><span style="font-size:24px;color:var(--muted-2)">người chơi đã vào</span></div>
            <div class="names" id="names">${H.players.map((p) => `<span>${esc(p.nick)}</span>`).join('')}</div>
          </div>
        </div>
        <div class="qrbox"><div class="qr" role="img" aria-label="Mã QR vào game">${qr}</div><span style="font-size:18px;color:var(--ink-3)">hoặc nhập mã PIN</span><div class="pinbig">${s.pin.slice(0, 3)} ${s.pin.slice(3)}</div></div>
      </div>`;
    if (changed && H.lobbyMusic) play(() => music.lobby());
    return;
  }
  if (s.phase === 'question' || s.phase === 'reveal') {
    const q = s.questions[s.q];
    const rev = s.phase === 'reveal';
    const ctl = rev
      ? `<button class="btn btn-ghost" data-act="leaderboard" type="button">Bảng xếp hạng</button>${isLast ? '<button class="btn btn-primary" data-act="final" type="button">Kết quả cuối ›</button>' : `<button class="btn btn-primary" data-act="start" data-q="${s.q + 1}" type="button">Câu ${s.q + 2} ›</button>`}`
      : `<span style="font-size:18px;color:var(--muted-2)"><b id="answered" style="color:#fff;font-size:26px">${H.answered}</b> / ${H.players.length} đã trả lời</span><button class="btn btn-ok" data-act="reveal" type="button">Công bố đáp án</button><div class="htimer" id="htimer">${Math.ceil(left())}</div>`;
    stageEl.innerHTML = `${topBar(ctl)}
      <div class="hq">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><span class="label-sm" style="font-size:15px">Tình huống · ${esc(q.area || '')}</span>${rev ? `<span class="chip" style="background:${W[q.ans].color};font-size:20px;padding:8px 18px">Đáp án: ${esc(wasteLabel(q.ans))}</span>` : ''}</div>
        <p>${esc(q.t)}</p>
        ${rev && q.why ? `<div class="why"><b>Vì sao:</b> ${esc(q.why)}</div>` : ''}
      </div>
      ${barsHtml(rev ? s.dist : null, rev ? q.ans : null)}`; // the answer chart stays empty until the answer is revealed, so the shared screen gives nothing away
    if (changed && !rev) { H.beeped = {}; play(() => music.suspense(left)); }
    if (changed && rev) play(() => music.fanfare());
    return;
  }
  if (s.phase === 'leaderboard' || s.phase === 'final' || s.phase === 'poll' || s.phase === 'end') {
    const fin = s.phase !== 'leaderboard';
    const top = (s.board || []).slice(0, 5);
    const st = s.stats;
    let ctl = '';
    if (s.phase === 'leaderboard') ctl = isLast ? '<button class="btn btn-primary" data-act="final" type="button">Kết quả cuối ›</button>' : `<button class="btn btn-primary" data-act="start" data-q="${s.q + 1}" type="button">Câu ${s.q + 2} ›</button>`;
    if (s.phase === 'final') ctl = '<button class="btn btn-ghost" data-act="csv" type="button">Xuất Excel (CSV)</button><button class="btn btn-primary" data-act="poll" type="button">Mở bình chọn ›</button>';
    if (s.phase === 'poll') ctl = '<button class="btn btn-ghost" data-act="csv" type="button">Xuất Excel (CSV)</button><button class="btn btn-primary" data-act="end" type="button">Kết thúc</button>';
    if (s.phase === 'end') ctl = '<button class="btn btn-ghost" data-act="csv" type="button">Xuất Excel (CSV)</button><button class="btn btn-primary" data-act="newgame" type="button">Tạo phiên mới</button>';

    if (s.phase === 'poll' || s.phase === 'end') {
      stageEl.innerHTML = `${topBar(ctl)}
        <div class="hq"><span class="label-sm" style="font-size:15px">Câu hỏi chốt · bình chọn</span><p>Lãng phí nào bạn gặp nhiều nhất ở chỗ làm?</p><div class="why"><b id="voted">${H.voted}</b> / ${H.players.length} đã bình chọn${s.phase === 'end' ? ' · Loại nhiều phiếu nhất sẽ là đề bài Kaizen của lớp!' : ''}</div></div>
        ${barsHtml(H.votes, null)}`;
      return;
    }
    stageEl.innerHTML = `${topBar(ctl)}
      <div class="board">
        <div class="left">
          <div><div class="eyebrow" style="color:var(--amber)">${fin ? 'VINH DANH' : `BẢNG XẾP HẠNG SAU CÂU ${s.q + 1}`}</div><h1 style="margin:4px 0 0;font-size:52px;line-height:1.05;font-weight:800">Top 5 Thợ săn lãng phí</h1></div>
          ${top.map((b, i) => `<div class="rank-row ${i === 0 ? 'first' : ''}" style="animation-delay:${(top.length - i) * 0.25}s"><b class="r">${b.rank}</b><div class="n">${esc(b.nick)}<small>đúng ${b.correct}/${s.q + 1}${b.streak >= 3 ? ` · chuỗi ×${b.streak}` : ''}</small></div><span class="s">${fmt(b.score)}</span></div>`).join('') || '<p style="color:var(--muted)">Chưa có người chơi.</p>'}
        </div>
        ${fin && st ? `<div class="right">
          ${st.hardest ? `<div class="card-white" style="display:flex;flex-direction:column;gap:12px;border-radius:22px;padding:24px">
            <span class="label-sm" style="color:#A3302D">Điểm mù của lớp</span>
            <b style="font-size:24px">Câu ${st.hardest.q + 1} · ${Math.round(st.hardest.wrongRate * 100)}% chưa đúng</b>
            <p style="margin:0;font-size:16px;line-height:1.45;color:var(--ink-2)">“${esc(st.hardest.text)}”</p>
            <div class="ansline">Đáp án: <span class="chip" style="background:${W[st.hardest.ans].color}">${esc(wasteLabel(st.hardest.ans))}</span>${st.hardest.topWrong ? ` · hay nhầm với <span class="chip" style="background:${W[st.hardest.topWrong].color}">${esc(wasteLabel(st.hardest.topWrong))}</span>` : ''}</div>
          </div>` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="stat" style="background:var(--navy-2);border-radius:18px;padding:18px"><span>Tỷ lệ đúng cả lớp</span><b style="font-size:34px">${Math.round(st.accuracy * 100)}%</b></div>
            <div class="stat" style="background:var(--navy-2);border-radius:18px;padding:18px"><span>Người chơi</span><b style="font-size:34px">${st.players}</b></div>
          </div>
        </div>` : ''}
      </div>`;
    if (changed && fin) play(() => music.champion());
  }
}

function updateLive() {
  const s = H.s;
  if (s.phase === 'lobby') {
    const n = $('#pcount'); const names = $('#names');
    if (n && Number(n.textContent) !== H.players.length) {
      n.textContent = H.players.length;
      names.innerHTML = H.players.map((p) => `<span>${esc(p.nick)}</span>`).join('');
      if (H.musicOn && !H.lobbyMusic) music.pop();
    }
  }
  if (s.phase === 'question') {
    const a = $('#answered'); if (a) a.textContent = H.answered;
    if (S.earlyEnd && H.players.length > 0 && H.answered >= H.players.length && !H.auto[s.q]) {
      H.auto[s.q] = true; setTimeout(() => control('reveal'), 900);
    }
  }
  if (s.phase === 'poll') {
    const v = $('#voted'); if (v) v.textContent = H.voted;
    const bars = $('#bars'); if (bars) bars.outerHTML = barsHtml(H.votes, null);
  }
}

function onTimer() {
  const s = H.s;
  if (!s || s.phase !== 'question') return;
  const l = left();
  const t = $('#htimer');
  if (t) { t.textContent = Math.ceil(l); t.classList.toggle('low', l <= 3); }
  const sec = Math.ceil(l);
  if (sec <= 3 && sec >= 1 && !H.beeped[sec]) { H.beeped[sec] = true; play(() => music.beep()); }
  if (l <= 0 && !H.beeped.end) {
    H.beeped.end = true; play(() => music.buzzer());
    if (S.autoReveal && !H.auto[s.q]) { H.auto[s.q] = true; setTimeout(() => control('reveal'), 1200); }
  }
}

stageEl.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  music.ensure();
  if (act === 'start') return control('start', { q: Number(b.dataset.q) });
  if (['reveal', 'leaderboard', 'final', 'poll', 'end'].includes(act)) { if (act === 'reveal') H.auto[H.s.q] = true; return control(act); }
  if (act === 'mute') { H.musicOn = !H.musicOn; if (!H.musicOn) music.stop(); renderStage(false); return; }
  if (act === 'fs') { toggleFullscreen(); return; }
  if (act === 'here') { enterStage(); return; }
  if (act === 'lobbyMusic') { H.lobbyMusic = !H.lobbyMusic; if (H.lobbyMusic) play(() => music.lobby()); else music.stop(); renderStage(false); return; }
  if (act === 'csv') return exportCsv();
  // online classes: the join link (PIN included) is pasted into the meeting chat
  if (act === 'copyLink') {
    const link = `${location.origin}/game?pin=${H.pin}`;
    const done = () => { b.textContent = 'Đã sao chép link ✓'; setTimeout(() => { b.textContent = 'Sao chép link mời'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(link).then(done, () => prompt('Sao chép link mời:', link));
    else prompt('Sao chép link mời:', link);
    return;
  }
  if (act === 'cancel' || act === 'newgame') {
    if (act === 'cancel' && !confirm('Huỷ phòng này và quay lại màn chuẩn bị?')) return;
    music.stop(); clearInterval(H.poller); clearInterval(H.timer); store('slp-host-game', null); renderSetup();
  }
});

async function exportCsv() {
  try {
    const r = await api(`host?pin=${H.pin}&key=${encodeURIComponent(H.key)}&full=1`);
    const s = r.state; const qs = s.questions;
    const byP = {};
    (r.answers || []).forEach((a) => { (byP[a.id] = byP[a.id] || {})[a.q] = a; });
    const board = s.board || [];
    const rankOf = Object.fromEntries(board.map((b) => [b.id, b]));
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [];
    rows.push(['Hạng', 'Nickname', 'Điểm', 'Số câu đúng', ...qs.map((q, i) => `Câu ${i + 1} (ĐA: ${q.ans})`)]);
    const players = r.players.slice().sort((a, b) => ((rankOf[a.id] || {}).rank || 999) - ((rankOf[b.id] || {}).rank || 999));
    players.forEach((p) => {
      const b = rankOf[p.id] || {};
      rows.push([b.rank || '', p.nick, b.score || 0, b.correct || 0, ...qs.map((q, i) => { const a = (byP[p.id] || {})[i]; return a ? `${a.choice}${a.choice === q.ans ? ' ✓' : ' ✗'} (${(a.ms / 1000).toFixed(1)}s)` : '-'; })]);
    });
    rows.push([]);
    rows.push(['Câu', 'Tình huống', 'Đáp án', 'Số trả lời', 'Tỷ lệ đúng']);
    qs.forEach((q, i) => {
      const ans = (r.answers || []).filter((a) => a.q === i);
      const ok = ans.filter((a) => a.choice === q.ans).length;
      rows.push([i + 1, q.t, wasteLabel(q.ans), ans.length, ans.length ? `${Math.round((ok / Math.max(1, r.players.length)) * 100)}%` : '']);
    });
    if (r.votes) { rows.push([]); rows.push(['Bình chọn: lãng phí gặp nhiều nhất', 'Số phiếu']); WASTES.forEach((w) => rows.push([wasteLabel(w.k), r.votes[w.k] || 0])); }
    const csv = '﻿' + rows.map((row) => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `san-lang-phi-${s.pin}.csv`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) { alert(err.message); }
}

// /game/host?resume=1 (opened from the Toolkit frame) goes straight to the open room
const resumeGame = new URLSearchParams(location.search).get('resume') && store('slp-host-game');
if (resumeGame) { H.pin = resumeGame.pin; H.key = resumeGame.key; enterStage(); } else renderSetup();
