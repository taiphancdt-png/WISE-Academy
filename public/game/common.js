// Dùng chung cho màn người chơi và người dẫn
const WASTES = [
  { k: 'D', name: 'Lỗi', en: 'Defects', color: '#F25F5C', icon: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>' },
  { k: 'O', name: 'Sản xuất thừa', en: 'Overproduction', color: '#FF9F1C', icon: '<rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><rect x="8" y="3" width="8" height="8" rx="1"/>' },
  { k: 'W', name: 'Chờ đợi', en: 'Waiting', color: '#FFD23F', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  { k: 'N', name: 'Không tận dụng năng lực', short: 'Năng lực', en: 'Non-utilized talent', color: '#A06CD5', icon: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>' },
  { k: 'T', name: 'Vận chuyển', en: 'Transportation', color: '#3A86FF', icon: '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>' },
  { k: 'I', name: 'Tồn kho', en: 'Inventory', color: '#8AC926', icon: '<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8M7 17h10"/>' },
  { k: 'M', name: 'Thao tác thừa', en: 'Motion', color: '#2EC4B6', icon: '<circle cx="13" cy="4" r="2"/><path d="M9 21l3-7 3 3v4"/><path d="M7 12l3-4h4l3 4"/><path d="M12 14l-1-6"/>' },
  { k: 'E', name: 'Công đoạn thừa', en: 'Extra-processing', color: '#FF70A6', icon: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>' },
];
const W = Object.fromEntries(WASTES.map((w) => [w.k, w]));
const wasteLabel = (k) => (W[k] ? `${k} · ${W[k].name}` : '-');
const svgIcon = (k, size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${W[k].icon}</svg>`;

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');
const $ = (sel, root = document) => root.querySelector(sel);

function store(key, value) {
  try {
    if (value === undefined) { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { return null; }
  return value;
}

async function api(path, body) {
  const opts = body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' };
  const res = await fetch(`/api/game/${path}`, opts);
  let data = {};
  try { data = await res.json(); } catch (e) { data = { error: 'Mất kết nối máy chủ.' }; }
  if (!res.ok) { const err = new Error(data.error || 'Lỗi kết nối.'); err.status = res.status; throw err; }
  return data;
}

// Đồng hồ máy chủ: bù lệch giờ giữa điện thoại và máy chủ để đếm ngược khớp nhau
const clock = {
  offset: 0,
  sync(serverNow) { if (serverNow) this.offset = serverNow - Date.now(); },
  now() { return Date.now() + this.offset; },
  left(startedAt, duration) { return Math.max(0, duration - (this.now() - startedAt) / 1000); },
};

// ---------- Âm thanh tổng hợp bằng Web Audio (không cần file nhạc) ----------
class Music {
  constructor() { this.ctx = null; this.master = null; this.loopTimer = null; this.volume = 0.9; }
  ensure() {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!this.ctx) { try { this.ctx = new C(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.master) { this.master = this.ctx.createGain(); this.master.gain.value = this.volume; this.master.connect(this.ctx.destination); }
    return this.ctx;
  }
  stop() {
    if (this.loopTimer) { clearInterval(this.loopTimer); this.loopTimer = null; }
    if (this.master) { const m = this.master; m.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03); setTimeout(() => m.disconnect(), 300); this.master = null; }
  }
  hz(semi) { return 440 * Math.pow(2, semi / 12); }
  note(freq, t, dur, type = 'square', vol = 0.1) {
    const ctx = this.ensure(); if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // Bộ lặp có lookahead: fn(step, time) trả về độ dài bước (giây)
  loop(fn) {
    this.stop();
    const ctx = this.ensure(); if (!ctx) return;
    let next = ctx.currentTime + 0.08, step = 0;
    this.loopTimer = setInterval(() => {
      while (next < ctx.currentTime + 0.15) { const d = fn(step, next); next += d; step++; }
    }, 25);
  }
  // Nhạc chờ vui nhộn ở phòng chờ
  lobby() {
    const mel = [7, 11, 14, 11, 12, 9, 7, null, 4, 7, 9, 7, 5, 4, 2, null];
    const bass = [-17, -17, -10, -10, -12, -12, -14, -14];
    this.loop((s, t) => {
      const m = mel[s % mel.length];
      if (m !== null) this.note(this.hz(m), t, 0.14, 'triangle', 0.07);
      if (s % 2 === 0) this.note(this.hz(bass[(s / 2) % bass.length] - 12), t, 0.16, 'square', 0.05);
      if (s % 4 === 2) this.note(2400, t, 0.02, 'triangle', 0.03);
      return 0.2;
    });
  }
  // Nhạc hồi hộp + hài hước khi phát câu hỏi; nhanh dần ở 5 giây cuối
  suspense(getLeft) {
    const bass = [-29, -26, -24, -23, -22, -23, -24, -26];
    this.loop((s, t) => {
      const left = getLeft();
      const fast = left <= 5;
      this.note(this.hz(bass[s % bass.length] + (fast ? 5 : 0)), t, 0.12, 'square', 0.09);
      if (s % 2 === 0) this.note(1800, t, 0.03, 'triangle', 0.05);
      if (s % 16 === 12 && !fast) { this.note(this.hz(7), t, 0.08, 'triangle', 0.07); this.note(this.hz(12), t + 0.09, 0.12, 'triangle', 0.07); }
      return fast ? 0.17 : 0.3;
    });
  }
  beep() { const c = this.ensure(); if (c) this.note(880, c.currentTime, 0.15, 'sine', 0.18); }
  buzzer() { this.stop(); const c = this.ensure(); if (!c) return; const t = c.currentTime; this.note(110, t, 0.9, 'sawtooth', 0.12); this.note(116, t, 0.9, 'sawtooth', 0.1); }
  fanfare() {
    this.stop(); const c = this.ensure(); if (!c) return; const t0 = c.currentTime + 0.03;
    [3, 7, 10, 15, 10, 15].forEach((s, k) => this.note(this.hz(s), t0 + k * 0.1, 0.12, 'square', 0.06));
    [3, 7, 10, 15].forEach((s) => this.note(this.hz(s), t0 + 0.65, 1.0, 'triangle', 0.08));
    for (let k = 0; k < 12; k++) this.note(this.hz(24 + Math.floor(Math.random() * 12)), t0 + 0.7 + k * 0.06, 0.07, 'triangle', 0.04);
  }
  champion() {
    this.stop(); const c = this.ensure(); if (!c) return; const t0 = c.currentTime + 0.03;
    const seq = [[3, 0.15], [3, 0.15], [3, 0.15], [7, 0.45], [5, 0.15], [7, 0.15], [10, 0.6], [15, 1.2]];
    let t = t0;
    seq.forEach(([s, d]) => { this.note(this.hz(s), t, d * 0.95, 'square', 0.07); this.note(this.hz(s - 12), t, d * 0.95, 'triangle', 0.06); t += d; });
  }
  wah() {
    this.stop(); const ctx = this.ensure(); if (!ctx) return; const t0 = ctx.currentTime + 0.03;
    [196, 185, 175, 165].forEach((f, k) => {
      const t = t0 + k * 0.38; const dur = k === 3 ? 1.0 : 0.32;
      const o = ctx.createOscillator(); const flt = ctx.createBiquadFilter(); const g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
      if (k === 3) { const l = ctx.createOscillator(); const lg = ctx.createGain(); l.frequency.value = 6; lg.gain.value = 5; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); }
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(400, t); flt.frequency.linearRampToValueAtTime(1400, t + 0.08); flt.frequency.linearRampToValueAtTime(500, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(flt); flt.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  pop() { const c = this.ensure(); if (c) { this.note(660, c.currentTime, 0.06, 'triangle', 0.08); this.note(990, c.currentTime + 0.05, 0.08, 'triangle', 0.06); } }
}
