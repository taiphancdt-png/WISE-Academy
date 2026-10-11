/* =====================================================================
   THỬ THÁCH TPM, XƯỞNG CƠ KHÍ SÁU TÀI  |  Lõi game (JavaScript thuần)
   ---------------------------------------------------------------------
   Lõi: tiện ích, âm thanh, cảnh xưởng isometric, khung màn chơi, bản đồ,
        cốt truyện, bài học nhanh, kéo thả, máy tính, đồng hồ đo.
   Các màn chơi nằm ở tpm-am-pm.js, tpm-rm-parts.js, tpm-mtbf-kaizen.js,
   tpm-month.js; kết quả ở tpm-result.js. Dữ liệu: tpm-data.js · Công thức: tpm-calc.js
   ===================================================================== */
(function () {
  "use strict";

  var D = window.TPM_DATA, C = window.TPM_CALC, A = window.ASSETS;
  var OX = A.scene.ox, OY = A.scene.oy, SW = A.scene.w, SH = A.scene.h;
  var BEST_KEY = "wise_tpm_best_v1", PROG_KEY = "wise_tpm_prog_v1", SOUND_KEY = "wise5s_xck_sound", NAME_KEY = "wise5s_xck_last";
  var MACH = ["lathe", "mill"];

  /* ============ 1. TIỆN ÍCH ============ */
  function $(id) { return document.getElementById(id); }
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function iso(x, y, z) { return { x: OX + (x - y) * 32, y: OY + (x + y) * 16 - (z || 0) }; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  /* số kiểu Việt Nam: dấu phẩy thập phân */
  function num(v, d) { var s = (Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toFixed(d || 0); return s.replace(".", ","); }
  function pct(v, d) { return num(v * 100, d == null ? 1 : d) + "%"; }
  function parseNum(s) { if (s == null) return NaN; s = String(s).trim().replace("%", "").replace(/\s/g, "").replace(",", "."); return s === "" ? NaN : Number(s); }
  function fmtTime(s) { s = Math.max(0, Math.floor(s)); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }
  function mname(id) { return id === "lathe" ? "Máy tiện CNC" : "Máy phay CNC"; }

  /* Bộ icon nét (vẽ tay bằng SVG, dùng currentColor), thay cho emoji */
  var ICONS = {
    smoke: '<path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M18.7 5.3l-2.8 2.8M8.1 15.9l-2.8 2.8"/><circle cx="12" cy="12" r="2.6"/>',
    setup: '<path d="M14.6 3.6a4.6 4.6 0 0 0-5.9 6L3.4 14.9a1.9 1.9 0 0 0 2.7 2.7l5.3-5.3a4.6 4.6 0 0 0 6-5.9l-2.7 2.7-2.4-.6-.6-2.4z"/>',
    forklift: '<path d="M3 17V11h3.5l2-4H12v10M12 13H3"/><path d="M15.5 3v14h5"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/>',
    wait: '<path d="M6 3h12M6 21h12M8 3v3.5l4 5.5 4-5.5V3M8 21v-3.5l4-5.5 4 5.5V21"/>',
    power: '<path d="M13.5 2.5L5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
    short: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7M14 8.5v7"/>',
    slow: '<path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17l-4.2-4.6"/><path d="M5.5 12.8l1.3.7M12 8.5v1.4M18.5 12.8l-1.3.7"/>',
    defect: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>',
    pm: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4M8.8 14.6l2.2 2.2 4.4-4.4"/>',
    meet: '<circle cx="8" cy="8.5" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M2.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5M14 14.6c3.2-.6 6.5 1.2 6.5 4.9"/>',
    cup: '<path d="M4.5 9h11.5v5.5a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.8a2.2 2.2 0 0 1 0 4.4H16M8 2.5v3M12 2.5v3"/>',
    plan: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4M8 13.5h3M8 17h6"/>',
    clip: '<rect x="5" y="4" width="14" height="17.5" rx="1.5"/><path d="M9 4V2.8h6V4M8.5 9.5h7M8.5 13h7M8.5 16.5h4"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx=".6"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
    chart: '<path d="M3.5 20.5h17M6.5 17V11M11 17V6M15.5 17v-4M20 17V8"/>',
    bulb: '<path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    book: '<path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z"/>',
    redo: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
    ff: '<path d="M3.5 6l8 6-8 6zM12.5 6l8 6-8 6z"/>',
    map: '<path d="M3.5 6.5l5.5-2.5 6 2.5 5.5-2.5v13.5l-5.5 2.5-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    clean: '<path d="M14 3.5l6.5 6.5M4 20.5l7-7M11 13.5l-2.5-2.5 6-6 2.5 2.5zM4 20.5c0-3 1.5-5 4.5-6.5"/><path d="M15 16.5l1.5 1.5M18 13.5l1.5 1.5M17 19.5l1 1"/>',
    lube: '<path d="M12 3.5c3 4 5.5 7 5.5 10.2A5.5 5.5 0 0 1 6.5 13.7C6.5 10.5 9 7.5 12 3.5z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    tighten: '<path d="M12 2.8l7.8 4.6v9.2L12 21.2l-7.8-4.6V7.4z"/><circle cx="12" cy="12" r="3.2"/>',
    tagG: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.6"/>',
    alarm: '<path d="M6 17.5V12a6 6 0 0 1 12 0v5.5"/><path d="M3.5 17.5h17v3h-17zM12 2.5v2.5M4.6 5.6l1.7 1.7M19.4 5.6l-1.7 1.7"/>',
    loto: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.6"/><path d="M12 16.5v2"/>',
    ear: '<path d="M7 9.5a5 5 0 0 1 10 0c0 3-2.5 4-3.5 6s-1 4.5-3.5 4.5A2.5 2.5 0 0 1 7.5 18"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1.5-1.5 2-1.5 3.5"/>',
    thermo: '<path d="M10 4.5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z"/><path d="M12 9v8"/>',
    vibe: '<path d="M2.5 12h3l2-5 3 10 3-12 3 10 2-3h3"/>',
    code: '<rect x="3" y="4.5" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17.5V21M7 9l2.5 2-2.5 2M12 13h4"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    zoomIn: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5M10.5 7.5v6M7.5 10.5h6"/>',
    zoomOut: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5M7.5 10.5h6"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    download: '<path d="M12 3.5v12M7 10.5l5 5 5-5M4 20.5h16"/>',
    people: '<circle cx="8" cy="8.5" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M2.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5M14 14.6c3.2-.6 6.5 1.2 6.5 4.9"/>',
    check: '<path d="M4.5 12.5l5 5 10-11"/>',
    hint: '<path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'
  };
  function ic(name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + '</svg>'; }
  

  var toastT = null;
  function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 2600); }
  function modal(html, wide) { var c = $("modalCard"); c.className = "modal-card" + (wide ? " wide" : ""); c.innerHTML = html; $("modal").classList.add("on"); $("modal").setAttribute("aria-hidden", "false"); }
  function closeModal() { delete $("modal").dataset.lock; $("modal").classList.remove("on"); $("modal").setAttribute("aria-hidden", "true"); }

  /* ============ 2. ÂM THANH (Web Audio, không cần file) ============ */
  var Sound = {
    ctx: null, on: store(SOUND_KEY) !== false, hum: null,
    init: function () { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); },
    tone: function (f, dur, type, vol, slide, delay) {
      if (!this.on || !this.ctx) return;
      var c = this.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .1, t + .012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
    },
    click: function () { this.tone(640, .04, "sine", .06); },
    tick: function () { this.tone(1200, .05, "triangle", .05); },
    drop: function () { this.tone(330, .1, "sine", .14, -80); this.tone(660, .06, "triangle", .05, 0, .05); },
    bell: function () { var s = this; [988, 784].forEach(function (f, i) { s.tone(f, .35, "sine", .09, 0, i * .18); }); },
    ok: function () { var s = this; [660, 880].forEach(function (f, i) { s.tone(f, .14, "triangle", .08, 0, i * .08); }); },
    no: function () { this.tone(220, .18, "square", .04, -50); },
    win: function () { var s = this; [523, 659, 784, 1047, 1319].forEach(function (f, i) { s.tone(f, .26, "triangle", .12, 0, i * .11); }); },
    meh: function () { var s = this; [392, 370, 330].forEach(function (f, i) { s.tone(f, .24, "triangle", .1, 0, i * .16); }); },
    /* tiếng máy chạy nhẹ (âm nền) */
    humOn: function () {
      if (!this.on || !this.ctx || this.hum) return;
      var c = this.ctx, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = "sawtooth"; o.frequency.value = 58; o2.type = "triangle"; o2.frequency.value = 117;
      f.type = "lowpass"; f.frequency.value = 380; g.gain.value = 0.018;
      o.connect(f); o2.connect(f); f.connect(g); g.connect(c.destination); o.start(); o2.start();
      this.hum = { o: o, o2: o2, g: g };
    },
    humOff: function () { if (this.hum) { try { this.hum.o.stop(); this.hum.o2.stop(); } catch (e) { } this.hum = null; } }
  };
  function soundIcon() {
    $("btnSound").innerHTML = Sound.on
      ? '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  }

  /* ============ 3. CẢNH XƯỞNG (đã đạt 5S) ============ */
  function depthOf(tx, ty) { return (tx + ty + 1) * 20; }
  /* Vị trí chuẩn 5S của các khối (giống "Xưởng đạt chuẩn" ở game 5S) */
  var LAYOUT = { shelf: [0, 0], lathe: [0, 3], mill: [0, 6], qc: [0, 9], finished: [0, 12], redtag: [10, 11], bins: [12, 13], desk: [10, 4] };
  var FOOT = { shelf: [2, 3], lathe: [2, 3], mill: [2, 3], qc: [2, 3], finished: [2, 3], redtag: [3, 2], bins: [1, 4], desk: [2, 2] };
  var SPRITE = { shelf: "shelf", lathe: "lathe", mill: "mill", qc: "qc", finished: "pallet", redtag: "redPallet", desk: "desk" };

  function addImg(root, meta, cls, z, dx, dy) {
    dx = dx || 0; dy = dy || 0;
    var im = new Image(); im.decoding = "async"; im.src = meta.src; im.alt = ""; im.draggable = false;
    im.className = cls || "";
    im.style.left = (meta.x + (dx - dy) * 32) + "px"; im.style.top = (meta.y + (dx + dy) * 16) + "px";
    im.style.width = meta.w + "px"; im.style.height = meta.h + "px"; im.style.zIndex = z;
    root.appendChild(im); return im;
  }
  function bz(b) { var p = LAYOUT[b], f = FOOT[b]; return depthOf(p[0] + f[0] - 1, p[1] + f[1] - 1) + 2; }
  function bshift(b) { var p = LAYOUT[b], o = A.blocks[b]; return { dx: p[0] - o[0], dy: p[1] - o[1] }; }

  /* Băng keo định vị chuẩn (vẽ sẵn, xưởng đã đạt 5S) */
  function tapeSVG() {
    var segs = [], c;
    function s(x0, y0, x1, y1, col) { segs.push([x0, y0, x1, y1, col]); }
    s(3, 0, 3, 17, "y"); s(5, 0, 5, 8, "y"); s(5, 10, 5, 17, "y"); s(5, 8, 13, 8, "y"); s(5, 10, 13, 10, "y");
    s(0, 12, 2, 12, "g"); s(0, 15, 2, 15, "g"); s(2, 12, 2, 15, "g");
    s(10, 11, 13, 11, "r"); s(10, 13, 13, 13, "r"); s(10, 11, 10, 13, "r");
    ["lathe", "mill"].forEach(function (b) { var y = LAYOUT[b][1]; s(0, y, 2, y, "h"); s(0, y + 3, 2, y + 3, "h"); s(2, y, 2, y + 3, "h"); });
    s(10, 3, 11, 3, "w"); s(10, 4, 11, 4, "w"); s(10, 3, 10, 4, "w"); s(11, 3, 11, 4, "w");
    var col = { y: "#F5C02E", g: "#2E9A57", r: "#D9412F", w: "#F4F6F9" };
    var o = '<svg width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '" stroke-linecap="butt">';
    segs.forEach(function (q) {
      var a = iso(q[0], q[1], 0), b = iso(q[2], q[3], 0);
      function ln(cc, w, ex) { return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + cc + '" stroke-width="' + w + '"' + (ex || "") + '/>'; }
      o += ln("rgba(20,28,36,.3)", 7.5);
      o += q[4] === "h" ? ln("#F5C02E", 5.5) + ln("#2B2B2B", 5.5, ' stroke-dasharray="6 6"') : ln(col[q[4]], 5.5);
      o += ln("rgba(255,255,255,.35)", 1.2);
    });
    return o + '</svg>';
  }
  function arrowsSVG() {
    var shape = [[-0.6, -0.12], [0.15, -0.12], [0.15, -0.32], [0.6, 0], [0.15, 0.32], [0.15, 0.12], [-0.6, 0.12]], K = 1.35;
    function arrow(cx, cy, dx, dy) {
      return '<polygon points="' + shape.map(function (q) { var s = q[0] * K, t = q[1] * K, P = iso(cx + s * dx - t * dy, cy + s * dy + t * dx, 0); return P.x.toFixed(1) + "," + P.y.toFixed(1); }).join(" ") + '"/>';
    }
    var o = '<svg width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '"><g fill="rgba(255,255,255,.88)" stroke="rgba(0,47,91,.18)" stroke-width="1">';
    [2.5, 5.5, 12, 15].forEach(function (y) { o += arrow(4, y, 0, 1); });
    [7, 10.5].forEach(function (x) { o += arrow(x, 9, -1, 0); });
    return o + '</g></svg>';
  }

  /* Dựng xưởng; live = có máy chạy (đèn andon, bộ đếm, công nhân) */
  function buildWorkshop(root, live) {
    root.innerHTML = ""; root.style.width = SW + "px"; root.style.height = SH + "px";
    var ctx = { root: root, m: {} };
    addImg(root, A.props.floor, "", 0);
    var tl = mk("div", "layer", tapeSVG()); tl.style.zIndex = 1; root.appendChild(tl);
    var ar = mk("div", "layer", arrowsSVG()); ar.style.zIndex = 1; root.appendChild(ar);
    addImg(root, A.props.hatchRW, "", 1, -0, 0);
    addImg(root, A.props.boardFull, "", 5);
    addImg(root, A.props.bench, "", depthOf(8, 0) + 2);
    addImg(root, A.props.extinguisher, "", depthOf(10, 0) + 2);
    addImg(root, A.props.truck, "", depthOf(4, 22) + 2);
    Object.keys(SPRITE).forEach(function (b) {
      var sh = bshift(b), im = addImg(root, A.props[SPRITE[b]], "blk blk-" + b, bz(b), sh.dx, sh.dy);
      if (b === "lathe" || b === "mill") ctx.m[b] = { img: im };
    });
    var s = bshift("shelf"); addImg(root, A.props.shelfLabelOk, "", bz("shelf") + 12, s.dx, s.dy);
    s = bshift("finished"); addImg(root, A.props.signFinished, "", bz("finished") - 1, s.dx, s.dy);
    s = bshift("redtag"); addImg(root, A.props.signRedtag, "", bz("redtag") - 1, s.dx, s.dy);
    var bsh = bshift("bins");
    ["binMetal", "binRecycle", "binGeneral", "binOily"].forEach(function (k, i) {
      var z = depthOf(LAYOUT.bins[0], LAYOUT.bins[1] + i) + 2;
      addImg(root, A.props[k], "", z, bsh.dx, bsh.dy); addImg(root, A.props[k + "LabelOk"], "", z + 1, bsh.dx, bsh.dy);
    });
    // xe nâng đỗ đúng ô định vị
    var fk = A.items.forklift, kf = 1.45, fp = iso(10.5, 3.5, 0), fe = new Image();
    fe.src = fk.src; fe.className = "forklift"; fe.alt = "";
    Object.assign(fe.style, { left: (fp.x - fk.ax * kf) + "px", top: (fp.y - fk.ay * kf) + "px", width: fk.w * kf + "px", height: fk.h * kf + "px", zIndex: depthOf(10, 3) + 4 });
    root.appendChild(fe); ctx.forklift = fe; ctx.fkHome = { x: fp.x - fk.ax * kf, y: fp.y - fk.ay * kf };
    addImg(root, A.props.lightshafts, "shafts", 9000);
    if (live) {
      // đèn andon, bảng đếm sản phẩm, tia lửa, khói, công nhân vận hành
      var spots = {
        lathe: { andon: { x: 652, y: 166 }, tag: { x: 612, y: 78 }, spark: iso(1.0, 3.86, 64), smoke: iso(1, 4.4, 100), worker: [2.45, 4.6] },
        mill:  { andon: { x: 432, y: 168 }, tag: { x: 452, y: 78 }, spark: iso(1.28, 7.47, 60), smoke: iso(0.9, 7.4, 150), worker: [2.45, 7.6] }
      };
      MACH.forEach(function (id) {
        var sp = spots[id], m = ctx.m[id];
        var an = mk("div", "andon", '<i class="l-r"></i><i class="l-y"></i><i class="l-g"></i><i class="l-b"></i><span class="pole"></span>');
        an.style.left = sp.andon.x + "px"; an.style.top = sp.andon.y + "px"; an.style.zIndex = 9100; root.appendChild(an); m.andon = an;
        var tag = mk("div", "mtag", '<b>' + mname(id) + '</b><span class="lcd">SL <em>000</em></span>');
        tag.style.left = sp.tag.x + "px"; tag.style.top = sp.tag.y + "px"; tag.style.zIndex = 9150; root.appendChild(tag); m.tag = tag;
        var spk = mk("div", "sparks", "<i></i><i></i><i></i><i></i><i></i>"); spk.style.left = sp.spark.x + "px"; spk.style.top = sp.spark.y + "px"; spk.style.zIndex = bz(id) + 1; root.appendChild(spk); m.sparks = spk;
        // phoi kim loại bắn ra khi cắt gọt (xoắn, bay vòng cung rồi rơi xuống nền)
        var chp = mk("div", "chips " + id), ch = "";
        for (var ci = 0; ci < 16; ci++) {
          var dir = id === "lathe" ? 1 : -1, dx = dir * rnd(22, 70) + rnd(-12, 12);
          ch += '<i style="--dx:' + dx.toFixed(0) + 'px;--up:' + (-rnd(16, 42)).toFixed(0) + 'px;--dn:' + rnd(40, 70).toFixed(0) + 'px;--r:' + (rnd(240, 720) * dir).toFixed(0) +
            'deg;animation-delay:' + (ci * 0.07).toFixed(2) + 's;animation-duration:' + rnd(.8, 1.2).toFixed(2) + 's" class="' + (ci % 3 === 0 ? "c2" : ci % 3 === 1 ? "c3" : "") + '"></i>';
        }
        chp.innerHTML = ch; chp.style.left = sp.spark.x + "px"; chp.style.top = sp.spark.y + "px"; chp.style.zIndex = 9040; root.appendChild(chp); m.chips = chp;
        var smk = mk("div", "smoke", "<i></i><i></i><i></i><i></i>"); smk.style.left = sp.smoke.x + "px"; smk.style.top = sp.smoke.y + "px"; smk.style.zIndex = 9050; root.appendChild(smk); m.smoke = smk;
        var w = window.createCharacter(), wp = iso(sp.worker[0], sp.worker[1], 0);
        w.style.left = (wp.x - 30) + "px"; w.style.top = (wp.y - 78) + "px"; w.style.zIndex = Math.floor((sp.worker[0] + sp.worker[1]) * 20) + 8;
        w.classList.add("face-back", "mirror"); w.classList.remove("face-front");
        root.appendChild(w); m.worker = w;
      });
    }
    return ctx;
  }

  /* ============ 2b. ÂM THANH BỔ SUNG (chẩn đoán bằng tai) ============ */
  Sound.noise = function (dur, vol, freq, q, delay) {
    if (!this.on || !this.ctx) return;
    var c = this.ctx, t = c.currentTime + (delay || 0), len = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = "bandpass"; f.frequency.value = freq || 1200; f.Q.value = q || 1;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .1, t + .03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  };
  Sound.grind = function () { for (var i = 0; i < 7; i++) { this.noise(.1, .14, 2600 + i * 60, 7, i * .11); this.tone(170 + (i % 2) * 30, .09, "sawtooth", .045, 0, i * .11); } };
  Sound.hiss = function () { this.noise(1.3, .09, 5200, .7); };
  Sound.beepAlarm = function () { for (var i = 0; i < 4; i++) this.tone(1400, .12, "square", .045, 0, i * .25); };
  Sound.siren = function () { for (var i = 0; i < 3; i++) { this.tone(640, .3, "square", .045, 320, i * .62); this.tone(960, .3, "square", .045, -320, i * .62 + .31); } };
  Sound.tag = function () { this.tone(520, .06, "triangle", .08); this.tone(780, .08, "triangle", .07, 0, .06); };
  Sound.wrench = function () { for (var i = 0; i < 3; i++) this.noise(.05, .12, 3200, 4, i * .09); };

  /* ============ 4. KHUNG GAME ============ */
  var T = window.TPM_GAME = { D: D, C: C, A: A, levels: {} };
  var S = null, PLAYER = "";
  var LEVELS = [
    { k: "lesson", n: "Bài học nhanh TPM", tag: "TPM", max: 0,  pin: [6.6, 3.6, 20] },
    { k: "am",     n: "Thanh tra đầu ca",   tag: "AM",  max: D.scoring.am,     pin: [1.2, 4.2, 168], who: "Máy tiện CNC" },
    { k: "pm",     n: "Lập lịch bảo trì",   tag: "PM",  max: D.scoring.pm,     pin: [6.4, 0.2, 150], who: "Bảng TPM" },
    { k: "rm",     n: "Sự cố khẩn cấp",     tag: "RM",  max: D.scoring.rm,     pin: [1.6, 8.4, 110], who: "Máy phay CNC" },
    { k: "parts",  n: "Kho phụ tùng",       tag: "KHO", max: D.scoring.parts,  pin: [1, 1.4, 120], who: "Kho phụ tùng" },
    { k: "mtbf",   n: "Đọc nhật ký bảo trì",tag: "MTBF",max: D.scoring.mtbf,   pin: [11, 5, 84], who: "Bàn kỹ sư" },
    { k: "kaizen", n: "Phòng họp Kaizen",   tag: "KZ",  max: D.scoring.kaizen, pin: [7.6, 1, 70], who: "Phòng bảo trì" },
    { k: "month",  n: "Tháng TPM của xưởng",tag: "THÁNG", max: D.scoring.month, pin: [7.6, 11, 30], who: "Toàn xưởng" }
  ];
  T.LEVELS = LEVELS;
  function lv(k) { return LEVELS.filter(function (x) { return x.k === k; })[0]; }
  function idx(k) { for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].k === k) return i; return -1; }

  function show(id) { ["scr-start", "scr-play", "scr-result"].forEach(function (s) { $(s).classList.toggle("show", s === id); }); }
  function elapsed() { return S ? S.timeBase + (Date.now() - S.t0) / 1000 : 0; }
  function totalScore() { var t = 0; LEVELS.forEach(function (l) { t += S.scores[l.k] || 0; }); return t; }
  function hud(cur) {
    $("lvlLamps").innerHTML = LEVELS.map(function (l, i) {
      var st = S.done[l.k] ? " done" : l.k === cur ? " on" : unlocked(l.k) ? "" : " lock";
      return '<div class="st' + st + '" title="' + esc(l.n) + '"><i class="lamp"></i><b>' + (i === 0 ? "00" : "0" + i) + '</b><span>' + l.tag + '</span></div>';
    }).join("");
    $("scorePill").textContent = num(totalScore(), 0) + " điểm";
  }
  function unlocked(k) { var i = idx(k); return i === 0 || !!S.done[LEVELS[i - 1].k]; }
  T.hud = hud; T.elapsed = elapsed; T.unlocked = unlocked;
  /* điểm trừ an toàn theo từng màn (chơi lại màn không bị trừ cộng dồn) */
  T.setPen = function (k, v) { S.pens = S.pens || {}; S.pens[k] = v; S.penalty = Object.keys(S.pens).reduce(function (a, x) { return a + S.pens[x]; }, 0); };

  /* lưu tiến độ theo tên người chơi */
  function saveProg() {
    var all = store(PROG_KEY) || {};
    all[PLAYER] = { done: S.done, scores: S.scores, penalty: S.penalty, pens: S.pens || {}, notes: S.notes, timeBase: elapsed(), month: S.monthResult || null };
    store(PROG_KEY, all);
  }
  function clearProg() { var all = store(PROG_KEY) || {}; delete all[PLAYER]; store(PROG_KEY, all); }

  function makeScen(sample) {
    var ids = D.am.anomalies.map(function (a) { return a.id; });
    return {
      amPick: sample ? ids.filter(function (id) { return id !== "cover" && id !== "grease"; }) : shuffle(ids).slice(0, D.am.pickCount),
      logs: sample ? JSON.parse(JSON.stringify(D.logs)) : C.generateLogs(),
      parts: sample ? JSON.parse(JSON.stringify(D.parts.items)) : C.generateParts(D),
      incident: sample ? D.rm.incidents[0] : D.rm.incidents[Math.floor(Math.random() * D.rm.incidents.length)],
      sample: !!sample
    };
  }
  function newRun(sample) {
    S = { done: {}, scores: {}, penalty: 0, notes: {}, timeBase: 0, t0: Date.now(), scen: makeScen(sample) };
    T.S = S;
  }
  function resumeRun(p) {
    S = { done: p.done || {}, scores: p.scores || {}, penalty: p.penalty || 0, pens: p.pens || {}, notes: p.notes || {}, timeBase: p.timeBase || 0, t0: Date.now(), scen: makeScen(false), monthResult: p.month || null };
    T.S = S;
  }

  /* ---------- lời thoại nhân vật ---------- */
  var WHO = { owner: [D.owner, D.ownerRole], engineer: [D.engineer, D.engineerRole], manager: ["Tổ trưởng", "Vận hành"] };
  function coach(role, text, tag) {
    var w = WHO[role] || WHO.engineer;
    return '<div class="coach"><div class="coach-av" data-role="' + role + '"></div><div class="bubble"><div class="who"><span>' + esc(w[0]) + ' · ' + esc(w[1]) + '</span><em>' + (tag || "Ghi chú") + '</em></div><p>' + text + '</p></div></div>';
  }
  function putChars(root) {
    (root || document).querySelectorAll(".coach-av,[data-char]").forEach(function (el) {
      if (el.firstChild) return;
      var role = el.getAttribute("data-role") || el.getAttribute("data-char") || "worker";
      el.appendChild(window.createCharacter({ role: role }));
    });
  }
  T.coach = coach; T.putChars = putChars;

  /* ---------- khung trang trong màn chơi ---------- */
  function page(html, wide) { $("stage").innerHTML = '<div class="page' + (wide ? " wide" : "") + '">' + html + '</div>'; putChars($("stage")); $("stage").scrollTop = 0; }
  T.page = page;
  T.startLevel = function (k) { S.cur = k; $("lvlTitle").innerHTML = '<b>' + lv(k).tag + '</b>' + esc(lv(k).n); hud(k); show("scr-play"); };

  /* Kết thúc màn: lưu điểm, chị kỹ sư giải thích, về bản đồ */
  T.endLevel = function (k, score, opts) {
    opts = opts || {};
    var L = lv(k);
    S.scores[k] = Math.max(0, Math.min(L.max, Math.round(score * 10) / 10));
    S.done[k] = true; saveProg(); hud(k);
    var pctv = L.max ? S.scores[k] / L.max : 1;
    pctv >= .8 ? Sound.ok() : Sound.meh();
    var next = LEVELS[idx(k) + 1];
    page(coach("engineer", opts.say || "Xong màn này rồi! Cùng xem lại từng lựa chọn nhé.", "Giải thích") +
      '<div class="card lvl-score"><div class="ls-main"><span class="plate">' + L.tag + '</span><h2>' + esc(L.n) + '</h2></div>' +
      '<div class="ls-num"><b>' + num(S.scores[k], 1) + '</b><small>/' + L.max + '</small></div>' +
      '<div class="ls-bar"><i style="width:' + Math.round(pctv * 100) + '%"></i></div>' + (opts.sub ? '<p class="ls-sub">' + opts.sub + '</p>' : '') + '</div>' +
      (opts.review || "") +
      '<div class="page-btns"><button class="btn btn-ghost" id="toMap">' + ic("map") + 'Về bản đồ</button>' +
      (next ? '<button class="btn btn-primary btn-lg" id="toNext">Màn tiếp: ' + esc(next.n) + ' →</button>' : '<button class="btn btn-primary btn-lg" id="toFinal">Xem kết quả →</button>') + '</div>', true);
    $("toMap").onclick = function () { Sound.click(); T.map(); };
    if ($("toNext")) $("toNext").onclick = function () { Sound.click(); T.go(next.k); };
    if ($("toFinal")) $("toFinal").onclick = function () { Sound.click(); T.finish(); };
  };
  T.go = function (k) {
    if (!unlocked(k)) { toast("Hoàn thành màn trước để mở khoá."); return; }
    if (k === "lesson") { T.lesson(); return; }
    var L = T.levels[k]; if (L) { T.startLevel(k); L.run(); }
  };

  /* ---------- kéo thả dùng chung (chuột + cảm ứng; chạm-chọn-chạm dự phòng) ---------- */
  T.dnd = function (root, onDrop) {
    var drag = null, sel = null;
    function clearOver() { root.querySelectorAll("[data-drop].over").forEach(function (b) { b.classList.remove("over"); }); }
    root.onpointerdown = function (e) {
      var card = e.target.closest(".dcard"); if (!card || card.classList.contains("locked") || e.target.closest("button,select,input")) return;
      drag = { id: card.dataset.id, x0: e.clientX, y0: e.clientY, card: card, ghost: null };
    };
    function move(e) {
      if (!drag) return;
      if (!drag.ghost) {
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 8) return;
        var r = drag.card.getBoundingClientRect();
        drag.ghost = drag.card.cloneNode(true); drag.ghost.classList.add("ghost"); drag.ghost.style.width = r.width + "px";
        drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top; document.body.appendChild(drag.ghost); drag.card.classList.add("dragging");
      }
      drag.ghost.style.left = (e.clientX - drag.dx) + "px"; drag.ghost.style.top = (e.clientY - drag.dy) + "px";
      clearOver(); var o = document.elementFromPoint(e.clientX, e.clientY); o = o && o.closest("[data-drop]"); if (o && root.contains(o)) o.classList.add("over");
    }
    function up(e) {
      if (!drag) return; var d = drag; drag = null; clearOver();
      if (d.ghost) {
        d.ghost.remove(); d.card.classList.remove("dragging");
        var o = document.elementFromPoint(e.clientX, e.clientY); o = o && o.closest("[data-drop]");
        if (o && root.contains(o)) { onDrop(d.id, o.dataset.drop); Sound.drop(); }
      } else {
        sel = sel === d.id ? null : d.id; Sound.click();
        root.querySelectorAll(".dcard").forEach(function (x) { x.classList.toggle("sel", x.dataset.id === sel); });
      }
    }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    root.onclick = function (e) {
      var b = e.target.closest("[data-drop]");
      if (b && sel && !e.target.closest(".dcard")) { var id = sel; sel = null; onDrop(id, b.dataset.drop); Sound.drop(); }
    };
    return { destroy: function () { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); } };
  };

  /* ---------- máy tính bỏ túi ---------- */
  T.calc = function () {
    Sound.click(); var expr = "";
    modal('<h3>Máy tính</h3><div class="calc"><div class="cbrand">WISE · FX-TPM</div><div class="cdisp" id="cdisp">0</div><div class="ckeys">' +
      ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ",", "⌫", "="].map(function (k) { return '<button data-k="' + k + '"' + (k === "=" ? ' class="eq"' : /[÷×−+()C⌫]/.test(k) ? ' class="op"' : '') + '>' + k + '</button>'; }).join("") +
      '</div></div><div class="modal-btns"><button class="btn btn-ghost" data-close>Đóng</button></div>');
    $("modalCard").querySelectorAll(".ckeys button").forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.k; Sound.click();
        if (k === "C") expr = ""; else if (k === "⌫") expr = expr.slice(0, -1);
        else if (k === "=") { var js = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-").replace(/,/g, "."); if (/^[0-9+\-*/(). ]+$/.test(js)) { try { var v = Function('"use strict";return (' + js + ')')(); expr = isFinite(v) ? String(Math.round(v * 10000) / 10000).replace(".", ",") : "Lỗi"; } catch (er) { expr = "Lỗi"; } } }
        else { if (expr === "Lỗi") expr = ""; expr += k; }
        $("cdisp").textContent = expr || "0";
      };
    });
  };

  /* ---------- đồng hồ kim (HMI) ----------
     o: {v, max, txt, label, lv: good|mid|low, mark (vạch mục tiêu)} */
  T.gauge = function (o) {
    var cx = 60, cy = 60, R = 44, t = "", i, a, f = clamp(o.v / o.max, 0, 1);
    for (i = 0; i <= 20; i++) { a = Math.PI * (1 - i / 20); var r1 = R + 3, r2 = R + (i % 5 ? 7 : 11); t += '<line x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy - r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy - r2 * Math.sin(a)).toFixed(1) + '" class="gtick' + (i % 5 ? "" : " big") + '"/>'; }
    var len = Math.PI * R, mk2 = "";
    if (o.mark != null) { a = Math.PI * (1 - clamp(o.mark / o.max, 0, 1)); mk2 = '<circle cx="' + (cx + R * Math.cos(a)).toFixed(1) + '" cy="' + (cy - R * Math.sin(a)).toFixed(1) + '" r="2.6" class="gwc"/>'; }
    return '<div class="gauge g-' + (o.lv || "mid") + '"><svg viewBox="0 0 120 70">' + t +
      '<path d="M16,60 A44,44 0 0 1 104,60" class="gtrack"/><path d="M16,60 A44,44 0 0 1 104,60" class="gval" style="stroke-dasharray:' + len.toFixed(1) + ';--off:' + (len * (1 - f)).toFixed(1) + ';--len:' + len.toFixed(1) + '"/>' + mk2 +
      '<g class="needle" style="--a:' + (-90 + 180 * f).toFixed(1) + 'deg"><path d="M58.6,60 L60,22 L61.4,60 Z"/><circle cx="60" cy="60" r="4.5"/></g></svg>' +
      '<b>' + o.txt + '</b><span>' + o.label + '</span></div>';
  };

  /* ---------- hình phụ tùng (dùng ở kho, sự cố, kết quả) ---------- */
  T.partSVG = function (k) {
    var P = {
      insert: '<path d="M14 44 L32 10 L50 44 Z" fill="#C9CFD6" stroke="#4A5560" stroke-width="2"/><path d="M22 40 L32 20 L42 40 Z" fill="#E8C55A" stroke="#8A6A12" stroke-width="1.5"/><circle cx="32" cy="34" r="4" fill="#4A5560"/>',
      filter: '<rect x="20" y="12" width="24" height="36" rx="4" fill="#2E6FB8" stroke="#16365C" stroke-width="2"/><rect x="18" y="8" width="28" height="8" rx="2" fill="#9AA5B0" stroke="#4A5560" stroke-width="2"/><path d="M24 22h16M24 28h16M24 34h16M24 40h16" stroke="#9CC4EA" stroke-width="1.5"/>',
      belt: '<path d="M14 30 C14 14 50 14 50 30 C50 46 14 46 14 30 Z" fill="none" stroke="#2B2B2B" stroke-width="7"/><path d="M14 30 C14 14 50 14 50 30 C50 46 14 46 14 30 Z" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="3 3"/>',
      bearing: '<circle cx="32" cy="30" r="20" fill="#B9C2CB" stroke="#4A5560" stroke-width="2"/><circle cx="32" cy="30" r="13" fill="#DDE3E8" stroke="#4A5560" stroke-width="1.5"/><circle cx="32" cy="30" r="8" fill="#2A323B"/>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var a = i * Math.PI / 4; return '<circle cx="' + (32 + 16.5 * Math.cos(a)).toFixed(1) + '" cy="' + (30 + 16.5 * Math.sin(a)).toFixed(1) + '" r="2.6" fill="#F4F6F8" stroke="#4A5560" stroke-width=".8"/>'; }).join(""),
      sensor: '<rect x="12" y="22" width="30" height="16" rx="3" fill="#F2B705" stroke="#6E5200" stroke-width="2"/><rect x="42" y="25" width="10" height="10" rx="2" fill="#4A5560"/><path d="M12 30 C4 30 6 46 14 48" stroke="#2B2B2B" stroke-width="3" fill="none"/><circle cx="20" cy="30" r="3" fill="#3DDC84"/>',
      oil: '<path d="M18 18 h22 l6 8 v22 a3 3 0 0 1 -3 3 h-25 a3 3 0 0 1 -3 -3 v-27 z" fill="#E2550B" stroke="#7A2A04" stroke-width="2"/><rect x="22" y="10" width="10" height="8" fill="#2A323B"/><rect x="20" y="30" width="22" height="12" rx="1" fill="#FFF3E6"/><path d="M24 36h14" stroke="#E2550B" stroke-width="2"/>',
      hose: '<path d="M10 40 C20 10 40 50 54 20" stroke="#2B2B2B" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="48" y="14" width="10" height="10" rx="2" fill="#C9CFD6" stroke="#4A5560" stroke-width="1.5" transform="rotate(-30 53 19)"/>'
    };
    return '<svg class="part-ic" viewBox="0 0 64 60" aria-hidden="true">' + (P[k] || P.insert) + '</svg>';
  };

  /* ============ 5. MÀN HÌNH MỞ ĐẦU, CỐT TRUYỆN, BẢN ĐỒ ============ */
  function storyScreen(after) {
    var i = 0;
    show("scr-play"); S.cur = "story"; $("lvlTitle").innerHTML = '<b>TPM</b>Cốt truyện'; hud("");
    function draw() {
      var f = D.story[i];
      $("stage").innerHTML = '<div class="story"><div class="story-bg"><div id="storyScene" class="scene"></div></div>' +
        '<div class="story-cast"><div class="cast ' + (f.who === "owner" ? "on" : "") + '" data-char="owner"></div><div class="cast me" data-char="worker"></div><div class="cast ' + (f.who === "engineer" ? "on" : "") + '" data-char="engineer"></div></div>' +
        '<div class="story-box"><div class="sb-who"><span class="plate">' + esc(WHO[f.who][0]) + '</span><small>' + esc(WHO[f.who][1]) + '</small><em>' + (i + 1) + '/' + D.story.length + '</em></div><p>' + esc(f.text.replace("Chào trưởng nhóm!", "Chào " + PLAYER + ", trưởng nhóm TPM!")) + '</p>' +
        '<div class="sb-btns"><button class="btn btn-ghost" id="stSkip">Bỏ qua</button><button class="btn btn-primary" id="stNext">' + (i < D.story.length - 1 ? "Tiếp →" : "Nhận nhiệm vụ") + '</button></div></div></div>';
      buildWorkshop($("storyScene"), false); fitCover($("storyScene"), $("stage"));
      putChars($("stage"));
      $("stNext").onclick = function () { Sound.click(); if (i < D.story.length - 1) { i++; draw(); } else after(); };
      $("stSkip").onclick = function () { Sound.click(); after(); };
    }
    draw();
  }
  function fitCover(scene, box) { var s = Math.max(box.clientWidth / SW, box.clientHeight / SH) * 1.05; scene.style.transformOrigin = "0 0"; scene.style.transform = "translate(" + ((box.clientWidth - SW * s) / 2) + "px," + ((box.clientHeight - SH * s) / 2) + "px) scale(" + s + ")"; }
  function fitContain(scene, box) { var s = Math.min(box.clientWidth / SW, box.clientHeight / SH); scene.style.transformOrigin = "0 0"; scene.style.transform = "translate(" + ((box.clientWidth - SW * s) / 2) + "px," + ((box.clientHeight - SH * s) / 2) + "px) scale(" + s + ")"; }
  T.fitContain = fitContain; T.fitCover = fitCover; T.buildWorkshop = buildWorkshop; T.iso = iso;

  /* Bản đồ xưởng: ghim các màn lên đúng khu vực */
  T.map = function () {
    S.cur = "map"; show("scr-play"); $("lvlTitle").innerHTML = '<b>BẢN ĐỒ</b>' + esc(D.workshop); hud("");
    var nextK = null; LEVELS.some(function (l) { if (!S.done[l.k]) { nextK = l.k; return true; } return false; });
    $("stage").innerHTML = '<div class="mapwrap"><div class="mapview" id="mapView"><div id="mapScene" class="scene"></div></div>' +
      '<aside class="mapside card"><h3><span class="plate">Nhiệm vụ</span>Triển khai TPM</h3>' +
      '<div class="targets"><div><span>Máy tiện · MTBF</span><b>80h → ≥ ' + D.targets.latheMTBF + 'h</b></div><div><span>Máy phay · MTTR</span><b>6h → ≤ ' + D.targets.millMTTR + 'h</b></div></div>' +
      '<ol class="lvlist">' + LEVELS.map(function (l, i) {
        var st = S.done[l.k] ? "done" : unlocked(l.k) ? "open" : "lock";
        return '<li class="' + st + (l.k === nextK ? " next" : "") + '" data-go="' + l.k + '"><span class="ln">' + (i === 0 ? "★" : i) + '</span><span class="lt"><b>' + esc(l.n) + '</b><small>' + l.tag + (l.who ? " · " + esc(l.who) : "") + '</small></span><span class="lsc">' +
          (S.done[l.k] ? (l.max ? num(S.scores[l.k], 1) + "/" + l.max : "✓") : st === "lock" ? ic("lock") : "") + '</span></li>';
      }).join("") + '</ol>' +
      '<div class="mapfoot"><span>Tổng điểm</span><b>' + num(totalScore(), 1) + '<small>/100</small></b></div>' +
      (nextK ? '<button class="btn btn-primary btn-lg" id="mapGo">' + (S.done.lesson ? "Vào màn: " : "Bắt đầu: ") + esc(lv(nextK).n) + '</button>' : '<button class="btn btn-primary btn-lg" id="mapFinal">Xem kết quả →</button>') +
      '<button class="btn btn-ghost" id="mapReset">' + ic("redo") + 'Chơi lại từ đầu (kịch bản mới)</button></aside></div>';
    var root = $("mapScene"); buildWorkshop(root, false);
    // biển tên khu vực mới
    [["BẢNG TPM", iso(6.4, 0.2, 196)], ["KHO PHỤ TÙNG", iso(1, 1.6, 214)], ["PHÒNG BẢO TRÌ", iso(7.8, 0.4, 112)]].forEach(function (z) {
      var p = mk("div", "zone-plate", z[0]); p.style.left = z[1].x + "px"; p.style.top = z[1].y + "px"; p.style.zIndex = 9200; root.appendChild(p);
    });
    LEVELS.forEach(function (l, i) {
      var p = iso(l.pin[0], l.pin[1], l.pin[2]), st = S.done[l.k] ? "done" : unlocked(l.k) ? "open" : "lock";
      var pin = mk("button", "pin " + st + (l.k === nextK ? " next" : ""), '<span class="pin-n">' + (i === 0 ? "★" : i) + '</span><span class="pin-t"><b>' + l.tag + '</b><em>' + esc(l.n) + '</em></span>');
      pin.style.left = p.x + "px"; pin.style.top = p.y + "px"; pin.style.zIndex = 9300 + i; pin.dataset.go = l.k;
      root.appendChild(pin);
    });
    fitMap();
    $("stage").querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { Sound.click(); T.go(b.dataset.go); }; });
    if ($("mapGo")) $("mapGo").onclick = function () { Sound.click(); T.go(nextK); };
    if ($("mapFinal")) $("mapFinal").onclick = function () { Sound.click(); T.finish(); };
    $("mapReset").onclick = function () {
      modal('<h3>Chơi lại từ đầu?</h3><p>Điểm các màn đã chơi sẽ bị xoá và bạn nhận một kịch bản mới.</p><div class="modal-btns"><button class="btn btn-ghost" data-close>Huỷ</button><button class="btn btn-primary" id="rsGo">Chơi lại</button></div>');
      $("rsGo").onclick = function () { closeModal(); clearProg(); newRun(false); saveProg(); T.map(); };
    };
  };
  /* khung bản đồ: phóng vào phòng xưởng, ghim giữ cỡ chữ đọc được */
  function fitMap() {
    var box = $("mapView"), sc = $("mapScene"), R = { x: 190, y: 40, w: 860, h: 560 };
    var s = Math.min(box.clientWidth / R.w, box.clientHeight / R.h);
    sc.style.transformOrigin = "0 0";
    sc.style.transform = "translate(" + ((box.clientWidth - R.w * s) / 2 - R.x * s) + "px," + ((box.clientHeight - R.h * s) / 2 - R.y * s) + "px) scale(" + s + ")";
    sc.style.setProperty("--inv", Math.max(1, 0.95 / s));
  }
  window.addEventListener("resize", function () { if (S && S.cur === "map" && $("mapScene")) fitMap(); });

  /* ============ 6. BÀI HỌC NHANH TPM ============ */
  T.lesson = function () {
    T.startLevel("lesson");
    var i = 0, steps = [
      function () {
        return coach("engineer", "TPM, <b>Total Productive Maintenance</b>, Bảo trì năng suất toàn diện: <b>mọi người</b> cùng giữ máy luôn sẵn sàng, từ người vận hành tới giám đốc.") +
          '<div class="card board"><div class="board-h"><span class="plate">TPM</span><span class="board-s">3 con số không</span></div><div class="zeros">' +
          D.zeros.map(function (z, k) { return '<div class="zero" style="--d:' + (k * .15) + 's"><b>0</b><span>' + esc(z.replace("Zero ", "")) + '</span></div>'; }).join("") + '</div>' +
          '<p class="cap">TPM tốt → <b>MTBF tăng</b>, <b>MTTR giảm</b> → độ sẵn sàng A tăng → <b>OEE tăng</b></p></div>';
      },
      function () {
        return coach("engineer", "TPM đứng trên <b>8 trụ cột</b>, xây trên nền móng <b>5S</b>, chính là game 1 bạn đã chơi. Game này tập trung vào 3 trụ cột đầu: AM, PM và Cải tiến tập trung, cộng thêm An toàn.") +
          '<div class="temple"><div class="roof"><span>TPM</span><small>Zero hỏng hóc · Zero lỗi · Zero tai nạn</small></div><div class="cols">' +
          D.pillars.map(function (p, k) { return '<div class="col' + (k < 3 || k === 6 ? " hot" : "") + '" style="--d:' + (k * .08) + 's"><b>' + p.k + '</b><span>' + esc(p.n) + '</span><em>' + esc(p.d) + '</em></div>'; }).join("") +
          '</div><div class="base">Nền móng: 5S, Sàng lọc · Sắp xếp · Sạch sẽ · Săn sóc · Sẵn sàng</div></div>';
      },
      function () {
        return coach("engineer", "Ba kiểu bảo trì bạn sẽ thực hành. Càng dịch sang trái (AM, PM) thì càng rẻ; để máy hỏng rồi mới sửa (RM) là <b>đắt nhất</b>.") +
          '<div class="roles">' + D.roles.map(function (r, k) {
            return '<div class="role r-' + r.k + '" style="--d:' + (k * .12) + 's"><div class="role-ic">' + ic(r.k === "AM" ? "clean" : r.k === "PM" ? "pm" : "alarm") + '</div><b>' + r.k + '</b><h4>' + esc(r.n) + '</h4><small>' + esc(r.who) + '</small><p>' + esc(r.d) + '</p><div class="cost"><span>Chi phí</span><i style="width:' + [18, 40, 100][k] + '%"></i></div></div>';
          }).join("") + '</div>' +
          '<div class="card paper"><h3>7 bước bảo trì tự quản (AM)</h3><ol class="stairs">' + D.amSteps.map(function (s, k) { return '<li style="--k:' + k + '"><b>' + (k + 1) + '</b>' + esc(s) + '</li>'; }).join("") + '</ol></div>';
      }
    ];
    function draw() {
      page(steps[i]() + '<div class="page-btns">' + (i ? '<button class="btn btn-ghost" id="lsPrev">← Trước</button>' : '') + '<button class="btn btn-primary btn-lg" id="lsNext">' + (i < steps.length - 1 ? "Tiếp →" : "Vào bản đồ xưởng →") + '</button></div>', true);
      $("lsNext").onclick = function () { Sound.click(); if (i < steps.length - 1) { i++; draw(); } else { S.scores.lesson = 0; S.done.lesson = true; saveProg(); T.map(); } };
      if ($("lsPrev")) $("lsPrev").onclick = function () { Sound.click(); i--; draw(); };
    }
    draw();
  };

  /* ============ 7. THƯ VIỆN BÀI HỌC ============ */
  T.library = function () {
    Sound.click();
    modal('<h3>Thư viện bài học TPM</h3><div class="lessons">' + D.lessons.map(function (l, i) { return '<div class="lesson"><div class="si" style="background:' + ["#2F78C4", "#2E9A57", "#D9412F", "#E2550B", "#8A4FD8", "#14558F", "#5B6878"][i % 7] + '">' + (i + 1) + '</div><div><b>' + esc(l.t) + '</b><p>' + esc(l.d) + '</p></div></div>'; }).join("") +
      '<div class="lesson"><div class="si" style="background:#002F5B">∑</div><div><b>Công thức</b><p>MTBF = Giờ vận hành ÷ Số lần hỏng · MTTR = Giờ sửa ÷ Số lần hỏng · Độ sẵn sàng = MTBF ÷ (MTBF + MTTR) · Min (ROP) = Dùng/ngày × Lead time + Tồn an toàn · Max = Min + Lượng đặt mỗi lần</p></div></div>' +
      '<div class="lesson"><div class="si" style="background:#2E9A57">AM</div><div><b>Thẻ bất thường</b><p>Thẻ XANH: người vận hành tự xử lý. Thẻ ĐỎ: cần bộ phận bảo trì. Quy trình sự cố: báo hỏng → LOTO → chẩn đoán → lấy phụ tùng → sửa → chạy thử → bàn giao → ghi nhật ký.</p></div></div>' +
      '<div class="lesson"><div class="si" style="background:#E7A812">8</div><div><b>8 trụ cột TPM</b><p>' + D.pillars.map(function (p) { return p.n; }).join(" · ") + '</p></div></div></div>' +
      '<div class="modal-btns"><button class="btn btn-primary" data-close>Đã hiểu</button></div>', true);
  };

  /* ============ 8. KHỞI ĐỘNG ============ */
  function startGame() {
    var p = (store(PROG_KEY) || {})[PLAYER];
    Sound.init();
    if (p && p.done && Object.keys(p.done).length) {
      modal('<h3>Tiếp tục?</h3><p>' + esc(PLAYER) + ' đã hoàn thành ' + Object.keys(p.done).length + '/' + LEVELS.length + ' màn. Tiếp tục từ bản đồ hay chơi lại kịch bản mới?</p><div class="modal-btns"><button class="btn btn-ghost" id="spNew">Chơi lại từ đầu</button><button class="btn btn-primary" id="spGo">Tiếp tục</button></div>');
      $("spGo").onclick = function () { closeModal(); resumeRun(p); T.map(); };
      $("spNew").onclick = function () { closeModal(); clearProg(); newRun(false); saveProg(); storyScreen(function () { T.lesson(); }); };
      return;
    }
    newRun(!store("wise_tpm_played")); store("wise_tpm_played", true); saveProg();
    storyScreen(function () { T.lesson(); });
  }
  T.restart = function () { clearProg(); newRun(false); saveProg(); T.map(); };
  T.saveProg = saveProg;

  function init() {
    var t = C.selfTest(D);
    (t.ok ? console.info : console.error)("[TPM] Kiểm tra công thức với số liệu mẫu: " + (t.ok ? "ĐẠT" : "LỖI") + "\n" + t.lines.join("\n"));
    buildWorkshop($("startScene"), false);
    function fitBg() { var sc = $("startScene"), s = Math.max(innerWidth / SW, innerHeight / SH) * 1.08; sc.style.transform = "translate(-50%,-50%) scale(" + s + ")"; sc.style.transformOrigin = "50% 50%"; }
    fitBg(); window.addEventListener("resize", fitBg);
    soundIcon();
    var inp = $("playerName"), btn = $("btnStart"), last = store(NAME_KEY);
    if (last) inp.value = last;
    function upd() { var n = inp.value.trim(); btn.disabled = !n; var best = store(BEST_KEY) || {}; $("bestLine").textContent = n && best[n] ? "Kỷ lục TPM của " + n + ": " + best[n] + "/100" : ""; }
    inp.addEventListener("input", upd); upd();
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !btn.disabled) btn.click(); });
    btn.addEventListener("click", function () { var n = inp.value.trim(); if (!n) return; store(NAME_KEY, n); PLAYER = n; T.player = n; window.CHAR_NAMES.worker = n; Sound.click(); startGame(); });
    $("btnLessonStart").addEventListener("click", T.library);
    $("btnLib").addEventListener("click", T.library);
    $("btnMap").addEventListener("click", function () { if (!S) return; Sound.click(); if (T.onLeave) { T.onLeave(); T.onLeave = null; } T.map(); });
    $("btnSound").addEventListener("click", function () { Sound.on = !Sound.on; store(SOUND_KEY, Sound.on); soundIcon(); Sound.init(); if (!Sound.on) Sound.humOff(); Sound.click(); });
    $("modal").addEventListener("click", function (e) { if ((e.target.id === "modal" && !$("modal").dataset.lock) || e.target.hasAttribute("data-close")) closeModal(); });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("modal").dataset.lock) closeModal(); });
    setInterval(function () { if (S) $("playTime").textContent = fmtTime(elapsed()); }, 500);
  }
  T.init = init;
  T.util = { $: $, mk: mk, esc: esc, num: num, pct: pct, parseNum: parseNum, clamp: clamp, rnd: rnd, shuffle: shuffle, store: store, ic: ic, toast: toast, modal: modal, closeModal: closeModal, fmtTime: fmtTime, mname: mname, Sound: Sound, show: show, confetti: null };
  T.keys = { BEST_KEY: BEST_KEY };
  T.clearProg = clearProg;

  document.addEventListener("DOMContentLoaded", init);
})();
