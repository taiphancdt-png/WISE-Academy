/* =====================================================================
   THỬ THÁCH OEE, XƯỞNG CƠ KHÍ SÁU TÀI  |  Bộ máy game (JavaScript thuần)
   ---------------------------------------------------------------------
   Luồng chơi: Mở đầu → Hướng dẫn → Màn 1 Học nhanh → Màn 2 Một ngày vận hành
               → Màn 3 Tính OEE → Màn 4 Phân tích & cải tiến → Kết quả
   Dữ liệu: js/oee-data.js   ·   Công thức: js/oee-calc.js
   Cấu trúc file:
     1. Tiện ích         5. Màn 1, Học nhanh        9. Kết quả & bài học
     2. Âm thanh         6. Màn 2, Một ngày vận hành 10. Khởi động
     3. Cảnh xưởng       7. Màn 3, Tính OEE
     4. Khung chơi       8. Màn 4, Phân tích & cải tiến
   ===================================================================== */
(function () {
  "use strict";

  var D = window.OEE_DATA, O = window.OEE_CALC, A = window.ASSETS;
  var OX = A.scene.ox, OY = A.scene.oy, SW = A.scene.w, SH = A.scene.h;
  var BEST_KEY = "wise_oee_best_v1", SOUND_KEY = "wise5s_xck_sound", NAME_KEY = "wise5s_xck_last";
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
  function clock(t) { var m = D.shiftStart + Math.round(t); return ("0" + Math.floor(m / 60) % 24).slice(-2) + ":" + ("0" + m % 60).slice(-2); }
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
    hint: '<path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'
  };
  function ic(name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + '</svg>'; }
  window.OEE_ICON = ic;

  var toastT = null;
  function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 2600); }
  function modal(html, wide) { var c = $("modalCard"); c.className = "modal-card" + (wide ? " wide" : ""); c.innerHTML = html; $("modal").classList.add("on"); $("modal").setAttribute("aria-hidden", "false"); }
  function closeModal() { $("modal").classList.remove("on"); $("modal").setAttribute("aria-hidden", "true"); }

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

  /* ============ 4. KHUNG CHƠI ============ */
  var S = null, PLAYER = "";
  var STEPS = [{ k: 1, n: "Học nhanh" }, { k: 2, n: "Vận hành" }, { k: 3, n: "Tính OEE" }, { k: 4, n: "Phân tích" }];

  function show(id) { ["scr-start", "scr-guide", "scr-play", "scr-result"].forEach(function (s) { $(s).classList.toggle("show", s === id); }); window.scrollTo(0, 0); }
  function setStep(k) {
    S.step = k;
    $("steps4").innerHTML = STEPS.map(function (s) { return '<div class="st' + (s.k === k ? " on" : s.k < k ? " done" : "") + '"><i class="lamp"></i><b>0' + s.k + '</b><span>' + s.n + '</span></div>'; }).join("");
    $("stage").scrollTop = 0;
  }
  function startTimer() {
    clearInterval(S.timerI);
    S.timerI = setInterval(function () { $("playTime").textContent = fmtTime((Date.now() - S.t0) / 1000); }, 500);
  }

  function newGame(useSample) {
    var sc = useSample ? D.sample : O.generate(D);
    S = { scenario: sc, res: {}, cards: [], score: { m1: 0, m2: 0, m3: 0, m4: 0, bonus: 0 }, t0: Date.now(), step: 0,
          m1: {}, m2: { placed: {}, loss: {} }, m3: { val: {}, hints: 0, used: {} }, m4: { ans: {} }, review: {} };
    sc.machines.forEach(function (m) { S.res[m.id] = O.calc(m, D.shift); });
    var id = 0;
    sc.machines.forEach(function (m) { m.events.forEach(function (e) { S.cards.push({ id: "c" + (id++), m: m.id, e: e }); }); });
    S.cards.sort(function (a, b) { return a.e.t - b.e.t; });
  }

  /* ============ 5. MÀN 1, HỌC NHANH ============ */
  function coach(text) {
    return '<div class="coach"><div class="coach-av" id="coachAv"></div><div class="bubble"><div class="who"><span>Trưởng phòng sản xuất</span><em>Ghi chú</em></div><p>' + text + '</p></div></div>';
  }
  function putManager(id) { var el = $(id); if (!el) return; el.innerHTML = ""; var w = window.createCharacter({ role: "manager" }); el.appendChild(w); }

  function screenM1() {
    setStep(1);
    var m = D.sample.machines[0], r = O.calc(m, D.shift);
    var segs = [
      { k: "good", w: r.goodTime, c: "#2E9A57", l: "Thời gian tạo sản phẩm tốt" },
      { k: "q", w: r.qualityLoss, c: "#8A4FD8", l: "Tổn thất Q" },
      { k: "p", w: r.speedLoss, c: "#E7A812", l: "Tổn thất P" },
      { k: "a", w: r.lossA, c: "#D9412F", l: "Tổn thất A" },
      { k: "plan", w: r.planStop, c: "#3C7DD9", l: "Dừng có kế hoạch" }];
    var steps = [
      { show: [], txt: "Chào em! Hôm nay ta đo <b>OEE</b>, Hiệu suất thiết bị tổng thể. Lấy ví dụ máy tiện CNC trong 1 ca: <b>480 phút</b>.",
        cap: "Thời gian ca: <b>480 phút</b>" },
      { show: ["plan"], txt: "Đầu tiên trừ <b>dừng có kế hoạch</b>: họp đầu ca, giải lao, bảo trì theo lịch. Phần này <b>không tính vào OEE</b>.",
        cap: "480 − " + r.planStop + " = <b>" + r.planned + " phút SX kế hoạch</b>" },
      { show: ["plan", "a"], txt: "Máy hỏng, thay dao chuyển mã, chờ phôi… làm máy <b>dừng</b> → <b>tổn thất A</b>. A = Thời gian vận hành ÷ Thời gian SX kế hoạch.",
        cap: r.planned + " − " + r.lossA + " = <b>" + r.run + " phút vận hành</b> → A = " + r.run + " ÷ " + r.planned + " = <b>" + pct(r.A) + "</b>" },
      { show: ["plan", "a", "p"], txt: "Máy chạy nhưng <b>dừng ngắn</b> (kẹt phoi vài phút) hoặc <b>chạy chậm</b> hơn chu kỳ lý tưởng → <b>tổn thất P</b>. P tính bằng <b>chu kỳ lý tưởng</b>, không phải takt time.",
        cap: "P = " + num(r.ideal, 1) + " × " + r.total + " ÷ " + r.run + " = <b>" + pct(r.P) + "</b> (mất " + num(r.speedLoss, 0) + " phút)" },
      { show: ["plan", "a", "p", "q"], txt: "Sản phẩm <b>lỗi</b> cũng tốn thời gian máy mà không bán được → <b>tổn thất Q</b>. Q = Sản phẩm tốt ÷ Tổng sản phẩm.",
        cap: "Q = " + r.good + " ÷ " + r.total + " = <b>" + pct(r.Q) + "</b>" },
      { show: ["plan", "a", "p", "q", "good"], txt: "Phần xanh còn lại là thời gian <b>thật sự tạo ra sản phẩm tốt</b>. <b>OEE = A × P × Q</b>. Chuẩn thế giới là ≥ 85%, máy tiện của ta còn xa lắm!",
        cap: "OEE = " + pct(r.A) + " × " + pct(r.P) + " × " + pct(r.Q) + " = <b>" + pct(r.OEE) + "</b>" }];
    var i = 0;
    function bar(showKeys) {
      return '<div class="tbar">' + segs.slice().reverse().map(function (s) {
        var on = showKeys.indexOf(s.k) >= 0;
        return '<div class="seg ' + (on ? "on" : "") + '" style="flex:' + s.w + ';--c:' + s.c + '"><span>' + (on ? Math.round(s.w) + "'" : "") + '</span></div>';
      }).join("") + '</div><div class="tlegend">' + segs.slice().reverse().map(function (s) { return '<span style="--c:' + s.c + '"><i></i>' + s.l + '</span>'; }).join("") + '</div>';
    }
    function draw() {
      var st = steps[i];
      $("stage").innerHTML = '<div class="page">' + coach(st.txt) +
        '<div class="card lesson-card board"><div class="board-h"><span class="plate">MT-01 · Máy tiện CNC</span><span class="board-s">Bảng thời gian 1 ca · 480 phút</span><span class="board-n">' + (i + 1) + '/' + steps.length + '</span></div>' + bar(st.show) + '<p class="cap">' + st.cap + '</p></div>' +
        '<div class="page-btns">' + (i > 0 ? '<button class="btn btn-ghost" id="m1Prev">← Trước</button>' : '') +
        '<button class="btn btn-primary btn-lg" id="m1Next">' + (i < steps.length - 1 ? "Tiếp →" : "Làm bài kiểm tra nhanh") + '</button></div></div>';
      putManager("coachAv");
      requestAnimationFrame(function () { document.querySelectorAll(".seg.on").forEach(function (e) { e.classList.add("cut"); }); });
      $("m1Next").onclick = function () { Sound.click(); if (i < steps.length - 1) { i++; draw(); } else quiz(); };
      if ($("m1Prev")) $("m1Prev").onclick = function () { Sound.click(); i--; draw(); };
    }
    function quiz() {
      $("stage").innerHTML = '<div class="page">' + coach("Trước khi vào ca, trả lời nhanh 3 câu nhé.") +
        D.quiz.map(function (q, qi) {
          return '<div class="card pq paper" data-q="' + qi + '"><p class="pq-t"><span class="qn">Câu ' + (qi + 1) + '</span>' + esc(q.q) + '</p><div class="opts">' +
            q.options.map(function (o, oi) { return '<button class="opt" data-i="' + oi + '"><span class="radio"></span><span>' + esc(o) + '</span></button>'; }).join("") + '</div><div class="fb"></div></div>';
        }).join("") + '<div class="page-btns"><button class="btn btn-primary btn-lg" id="m1Check" disabled>Nộp bài</button></div></div>';
      putManager("coachAv");
      document.querySelectorAll(".pq").forEach(function (box) {
        box.querySelectorAll(".opt").forEach(function (b) {
          b.onclick = function () {
            if (S.m1.done) return;
            S.m1[box.dataset.q] = +b.dataset.i; Sound.click();
            box.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); });
            $("m1Check").disabled = D.quiz.some(function (q, qi) { return S.m1[qi] == null; });
          };
        });
      });
      $("m1Check").onclick = function () {
        if (S.m1.done) { screenM2(); return; }
        S.m1.done = true; var ok = 0;
        document.querySelectorAll(".pq").forEach(function (box) {
          var qi = +box.dataset.q, q = D.quiz[qi], good = S.m1[qi] === q.ok; if (good) ok++;
          box.querySelectorAll(".opt").forEach(function (x) { var i2 = +x.dataset.i; if (i2 === q.ok) x.classList.add("right"); else if (i2 === S.m1[qi]) x.classList.add("wrong"); });
          box.querySelector(".fb").innerHTML = '<div class="feedback ' + (good ? "ok" : "no") + '"><b>' + (good ? "Đúng!" : "Chưa đúng.") + '</b> ' + esc(q.why) + '</div>';
        });
        S.score.m1 = 10 * ok / D.quiz.length;
        ok === D.quiz.length ? Sound.ok() : Sound.no();
        $("m1Check").textContent = "Vào ca sản xuất → (" + ok + "/" + D.quiz.length + " câu đúng)";
      };
    }
    draw();
  }

  /* ============ 6. MÀN 2, MỘT NGÀY VẬN HÀNH & PHÂN LOẠI ============ */
  function cardIcon(e) { if (ICONS[e.anim]) return ic(e.anim); if (/Họp/.test(e.desc)) return ic("meet"); if (/Giải lao/.test(e.desc)) return ic("cup"); return ic("plan"); }
  function mcode(id) { return id === "lathe" ? "MT-01" : "MP-02"; }
  function cardVal(e) { return e.qty != null ? e.qty + " sp" : e.min + " phút"; }
  function cardHTML(c) {
    var e = c.e, L = S.m2.loss[c.id], cat = S.m2.placed[c.id];
    return '<div class="ecard m-' + c.m + (S.sel === c.id ? " sel" : "") + '" data-id="' + c.id + '">' +
      '<i class="ec-hole"></i><div class="ec-top"><span class="ec-m">' + mcode(c.m) + '</span><span class="ec-time">' + clock(e.t) + '</span></div>' +
      '<div class="ec-body"><span class="ec-ic">' + cardIcon(e) + '</span><span class="ec-desc">' + esc(e.desc) + '</span></div>' +
      '<div class="ec-foot"><span class="ec-val">' + cardVal(e) + '</span>' +
      (cat && cat !== "plan" ? '<button class="ec-loss' + (L ? " set" : "") + '" data-loss="' + c.id + '">' + (L ? "Loại " + L + " · " + esc(D.losses[L].name) : "+ Loại tổn thất") + '</button>' : '') + '</div></div>';
  }

  /* Trạng thái máy tại thời điểm t (phút) */
  function machineState(mid, t) {
    var st = { color: "g", anim: null, ev: null };
    S.scenario.machines.forEach(function (m) {
      if (m.id !== mid) return;
      m.events.forEach(function (e) {
        if (e.cat === "Q") return;
        var dur = e.cat === "P" && e.loss === 4 ? Math.min(e.min, 60) : e.min;
        if (t >= e.t && t < e.t + dur) {
          var c = e.cat === "A" ? "r" : e.cat === "plan" ? "b" : "y", pri = { r: 3, b: 2, y: 1, g: 0 };
          if (pri[c] > pri[st.color]) { st.color = c; st.anim = e.anim; st.ev = e; }
        }
      });
    });
    return st;
  }

  function screenM2() {
    setStep(2);
    S.sim = { t: 0, speed: 1, running: true, shown: {}, last: null, colors: {} };
    $("stage").innerHTML =
      '<div class="m2">' +
        '<div class="m2-sim card"><div class="sim-head"><div class="clockbox"><span class="lbl2">Ca 1</span><b id="simClock">06:00</b><span class="lbl2" id="simLeft">còn 8 giờ</span></div>' +
          '<div class="speed"><button data-sp="1" class="on">×1</button><button data-sp="2">×2</button><button data-sp="4">×4</button><button data-sp="99" title="Tua đến hết ca">' + ic("ff") + 'Hết ca</button></div></div>' +
          '<div class="simview" id="simView"><div id="simScene" class="scene"></div><div class="cctv"><span class="rec"><i></i>REC</span><span>CAM 02 · KHU MÁY CNC</span></div><div class="scan"></div></div>' +
          '<div class="simbar"><div class="simprog"><i id="simProg"></i></div><div class="andon-legend"><span><i class="g"></i>Chạy</span><span><i class="y"></i>Chậm / dừng ngắn</span><span><i class="r"></i>Dừng máy</span><span><i class="b"></i>Dừng có kế hoạch</span></div></div>' +
        '</div>' +
        '<div class="m2-sort">' +
          '<div class="card tray-card"><div class="tray-head"><span class="plate">Phiếu sự kiện</span><span id="trayCount">0 thẻ</span></div><div class="tray" id="tray" data-drop="tray"></div></div>' +
          '<div class="baskets">' + ["plan", "A", "P", "Q"].map(function (k) {
            var c = D.cats[k];
            return '<div class="basket" data-drop="' + k + '" style="--c:' + c.color + '"><div class="bh"><span class="bcode">' + (k === "plan" ? "KH" : k) + '</span><div><b>' + c.name + '</b><small>' + c.note + '</small></div></div><div class="blist" id="b-' + k + '"></div></div>';
          }).join("") + '</div>' +
          '<div class="m2-foot"><p id="m2Msg" class="small-note">Kéo thẻ vào giỏ (hoặc chạm thẻ rồi chạm giỏ). Không có báo đúng/sai cho đến khi chấm.</p><button class="btn btn-primary" id="m2Done" disabled>Chấm phân loại</button></div>' +
        '</div>' +
      '</div>';
    S.ws = buildWorkshop($("simScene"), true);
    fitSim();
    document.querySelectorAll(".speed button").forEach(function (b) {
      b.onclick = function () {
        Sound.click(); var sp = +b.dataset.sp;
        if (sp === 99) { S.sim.t = D.shift; } else S.sim.speed = sp;
        document.querySelectorAll(".speed button").forEach(function (x) { x.classList.toggle("on", x === b && sp !== 99); });
      };
    });
    initDrag();
    $("m2Done").onclick = scoreM2;
    Sound.humOn();
    requestAnimationFrame(simLoop);
  }

  function fitSim() {
    var v = $("simView"); if (!v) return;
    var C = { x: 545, y: 235, w: 440, h: 380 };                // tâm & khung quanh 2 máy
    var s = Math.min(v.clientWidth / C.w, v.clientHeight / C.h);
    var tx = v.clientWidth / 2 - C.x * s, ty = v.clientHeight / 2 - C.y * s;
    $("simScene").style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
  }

  function simLoop(ts) {
    if (!S || S.step !== 2 || !S.sim) return;
    var sim = S.sim, dt = sim.last ? Math.min(.1, (ts - sim.last) / 1000) : 0; sim.last = ts;
    if (sim.t < D.shift) sim.t = Math.min(D.shift, sim.t + dt * 6 * sim.speed);       // ×1: 1 giây = 6 phút
    var t = sim.t;
    $("simClock").textContent = clock(t);
    $("simLeft").textContent = t >= D.shift ? "Hết ca" : "còn " + num((D.shift - t) / 60, 1) + " giờ";
    $("simProg").style.width = (t / D.shift * 100) + "%";
    // thẻ xuất hiện
    S.cards.forEach(function (c) {
      if (!sim.shown[c.id] && c.e.t <= t) {
        sim.shown[c.id] = true; Sound.tick();
        var el = mk("div", null, cardHTML(c)).firstChild; el.classList.add("new"); $("tray").prepend(el);
        if (c.e.cat === "Q") flashDefect(c.m);
      }
    });
    // máy & đèn andon
    MACH.forEach(function (id) {
      var st = machineState(id, t), m = S.ws.m[id];
      if (sim.colors[id] !== st.color) {
        if (st.color === "r" && sim.colors[id] !== undefined) Sound.bell();
        sim.colors[id] = st.color;
        m.andon.className = "andon on-" + st.color;
        m.img.classList.toggle("run", st.color === "g" || st.color === "y");
        m.img.classList.toggle("slow", st.color === "y");
        m.img.classList.toggle("dark", st.anim === "power");
        m.sparks.classList.toggle("on", st.color === "g");
        m.chips.classList.toggle("on", st.color === "g" || (st.color === "y" && st.anim === "slow"));
        m.chips.classList.toggle("slow", st.color === "y");
        m.smoke.classList.toggle("on", st.anim === "smoke");
        m.worker.classList.toggle("wiping", st.anim === "setup" || st.anim === "pm" || st.anim === "smoke");
        m.worker.classList.toggle("scratch", st.anim === "wait" || st.anim === "power" || st.anim === "forklift");
        if (st.anim === "forklift") driveForklift(id, st.ev);
      }
      var r = S.res[id], prod = Math.round(r.total * prodFrac(id, t));
      m.tag.querySelector("em").textContent = ("00" + prod).slice(-3);
    });
    updateTray();
    if (t >= D.shift && !sim.ended) { sim.ended = true; Sound.humOff(); MACH.forEach(function (id) { var m = S.ws.m[id]; m.andon.className = "andon on-b"; m.img.classList.remove("run", "slow"); m.sparks.classList.remove("on"); m.chips.classList.remove("on"); }); toast("Hết ca! Hoàn tất phân loại các thẻ rồi bấm Chấm phân loại."); }
    requestAnimationFrame(simLoop);
  }

  /* tỷ lệ sản lượng đã làm tới thời điểm t (máy không chạy khi đỏ/xanh dương/dừng ngắn) */
  function prodFrac(id, t) {
    if (!S.prodCache) S.prodCache = {};
    if (!S.prodCache[id]) {
      var arr = [0], acc = 0;
      for (var k = 0; k < D.shift; k++) { var st = machineState(id, k + .5); acc += st.color === "g" ? 1 : (st.color === "y" && st.anim === "slow") ? .6 : 0; arr.push(acc); }
      S.prodCache[id] = arr;
    }
    var a = S.prodCache[id]; return a[Math.min(D.shift, Math.floor(t))] / a[D.shift];
  }

  function flashDefect(id) { var m = S.ws.m[id], f = mk("div", "defect-pop", ic("defect")); f.style.left = m.tag.style.left; f.style.top = m.tag.style.top; S.ws.root.appendChild(f); setTimeout(function () { f.remove(); }, 1400); }
  function driveForklift(id, e) {
    var fe = S.ws.forklift, to = iso(3.5, LAYOUT[id][1] + 1, 0), fk = A.items.forklift, k = 1.45;
    fe.style.transition = "left 2.4s ease-in-out, top 2.4s ease-in-out";
    fe.style.left = (to.x - fk.ax * k) + "px"; fe.style.top = (to.y - fk.ay * k) + "px"; fe.style.zIndex = Math.floor((3.5 + LAYOUT[id][1] + 1) * 20) + 4;
    setTimeout(function () { if (!S || !S.ws) return; fe.style.left = S.ws.fkHome.x + "px"; fe.style.top = S.ws.fkHome.y + "px"; fe.style.zIndex = depthOf(10, 3) + 4; }, 5200);
  }

  function updateTray() {
    var n = $("tray").children.length, all = S.cards.length, shown = Object.keys(S.sim.shown).length;
    $("trayCount").textContent = n + " thẻ chờ phân loại · " + shown + "/" + all + " sự kiện";
    var placed = S.cards.filter(function (c) { return S.m2.placed[c.id]; }).length;
    $("m2Done").disabled = !(S.sim.t >= D.shift && placed === all);
    $("m2Msg").textContent = S.sim.t < D.shift ? "Ca đang chạy… kéo thẻ vào giỏ ngay khi thẻ xuất hiện (hoặc chạm thẻ rồi chạm giỏ)." :
      placed < all ? "Còn " + (all - placed) + " thẻ chưa phân loại." : "Đã phân loại đủ " + all + " thẻ. Bạn có thể chọn thêm loại tổn thất (nâng cao) rồi bấm Chấm phân loại.";
  }

  function rerenderCard(id) {
    var c = S.cards.filter(function (x) { return x.id === id; })[0], old = document.querySelector('.ecard[data-id="' + id + '"]');
    var el = mk("div", null, cardHTML(c)).firstChild;
    if (old) old.replaceWith(el);
    return el;
  }
  function placeCard(id, target) {
    var old = document.querySelector('.ecard[data-id="' + id + '"]');
    if (target === "tray") { delete S.m2.placed[id]; delete S.m2.loss[id]; }
    else { if (S.m2.placed[id] !== target) delete S.m2.loss[id]; S.m2.placed[id] = target; }
    S.sel = null;
    var c = S.cards.filter(function (x) { return x.id === id; })[0], el = mk("div", null, cardHTML(c)).firstChild;
    if (old) old.remove();
    (target === "tray" ? $("tray") : $("b-" + target)).appendChild(el);
    el.classList.add("bounce"); Sound.drop(); updateTray();
  }

  /* Kéo thả bằng con trỏ (chuột + cảm ứng); chạm-chọn-chạm làm phương án dự phòng */
  function initDrag() {
    var root = $("stage"), drag = null;
    root.addEventListener("pointerdown", function (e) {
      var lossBtn = e.target.closest(".ec-loss"); if (lossBtn) return;
      var card = e.target.closest(".ecard"); if (!card || S.step !== 2) return;
      drag = { id: card.dataset.id, x0: e.clientX, y0: e.clientY, card: card, ghost: null };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      if (!drag.ghost) {
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 8) return;
        var r = drag.card.getBoundingClientRect();
        drag.ghost = drag.card.cloneNode(true); drag.ghost.classList.add("ghost"); drag.ghost.style.width = r.width + "px";
        drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top; document.body.appendChild(drag.ghost); drag.card.classList.add("dragging");
      }
      drag.ghost.style.left = (e.clientX - drag.dx) + "px"; drag.ghost.style.top = (e.clientY - drag.dy) + "px";
      document.querySelectorAll("[data-drop]").forEach(function (b) { b.classList.remove("over"); });
      var over = document.elementFromPoint(e.clientX, e.clientY); over = over && over.closest("[data-drop]"); if (over) over.classList.add("over");
    });
    window.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var d = drag; drag = null;
      document.querySelectorAll("[data-drop]").forEach(function (b) { b.classList.remove("over"); });
      if (d.ghost) {
        d.ghost.remove(); d.card.classList.remove("dragging");
        var over = document.elementFromPoint(e.clientX, e.clientY); over = over && over.closest("[data-drop]");
        if (over) placeCard(d.id, over.dataset.drop);
      } else {
        // chạm: chọn / bỏ chọn thẻ
        S.sel = S.sel === d.id ? null : d.id; Sound.click();
        document.querySelectorAll(".ecard").forEach(function (x) { x.classList.toggle("sel", x.dataset.id === S.sel); });
      }
    });
    root.addEventListener("click", function (e) {
      var lossBtn = e.target.closest(".ec-loss");
      if (lossBtn) { e.stopPropagation(); chooseLoss(lossBtn.dataset.loss); return; }
      var b = e.target.closest("[data-drop]");
      if (b && S.sel && !e.target.closest(".ecard")) placeCard(S.sel, b.dataset.drop);
    });
  }

  function chooseLoss(id) {
    Sound.click();
    var cat = S.m2.placed[id];
    modal('<h3>Chọn loại tổn thất</h3><p>Nâng cao: thẻ này thuộc loại nào trong 6 tổn thất lớn? (có thêm điểm nếu đúng)</p><div class="opts">' +
      Object.keys(D.losses).map(function (k) { var L = D.losses[k]; return '<button class="opt' + (S.m2.loss[id] == k ? " sel" : "") + '" data-k="' + k + '"><span class="lnum" style="--c:' + D.cats[L.cat].color + '">' + k + '</span><span>' + esc(L.name) + ' <small>(' + D.cats[L.cat].short + ')</small></span></button>'; }).join("") +
      '</div><div class="modal-btns"><button class="btn btn-ghost" data-close>Để sau</button></div>');
    $("modalCard").querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { S.m2.loss[id] = +b.dataset.k; closeModal(); rerenderCard(id).classList.add("bounce"); Sound.drop(); }; });
  }

  function scoreM2() {
    Sound.click();
    var n = S.cards.length, catOk = 0, lossN = 0, lossOk = 0;
    S.cards.forEach(function (c) {
      var p = S.m2.placed[c.id], ok = p === c.e.cat; if (ok) catOk++;
      if (c.e.cat !== "plan") { lossN++; if (ok && S.m2.loss[c.id] === c.e.loss) lossOk++; }
    });
    S.score.m2 = 30 * catOk / n + 5 * (lossN ? lossOk / lossN : 0);
    S.review.m2 = { catOk: catOk, n: n, lossOk: lossOk, lossN: lossN };
    S.sim = null; Sound.humOff();
    catOk / n >= .8 ? Sound.ok() : Sound.no();
    var wrong = S.cards.filter(function (c) { return S.m2.placed[c.id] !== c.e.cat; });
    $("stage").innerHTML = '<div class="page">' + coach("Hết ca! Em phân loại đúng <b>" + catOk + "/" + n + "</b> thẻ" + (lossN ? ", chọn đúng loại tổn thất <b>" + lossOk + "/" + lossN + "</b> thẻ" : "") + ". Xem lại các thẻ chưa đúng nhé.") +
      '<div class="card"><h2>Điểm màn 2: ' + num(S.score.m2, 1) + '/35</h2>' +
      (wrong.length ? '<div class="ilist">' + wrong.map(function (c) {
        var p = S.m2.placed[c.id];
        return '<div class="irow bad"><div class="th"><span class="emo">' + cardIcon(c.e) + '</span></div><div><h4>' + esc(c.e.desc) + ' <small>· ' + mname(c.m) + ' · ' + cardVal(c.e) + '</small></h4>' +
          '<div class="where">Bạn chọn: <b>' + (p ? D.cats[p].name : "chưa phân loại") + '</b></div><div class="where">Đúng: <b>' + D.cats[c.e.cat].name + (c.e.loss ? ", " + D.losses[c.e.loss].name : "") + '</b></div><p>' + esc(c.e.why) + '</p></div><span class="badge bad">Chưa đúng</span></div>';
      }).join("") + '</div>' : '<p>Tuyệt vời, không có thẻ nào sai!</p>') +
      (lossN ? '<details class="more"><summary>Xem đáp án loại tổn thất của tất cả thẻ</summary><div class="ilist">' + S.cards.filter(function (c) { return c.e.cat !== "plan"; }).map(function (c) {
        var mine = S.m2.loss[c.id], ok = S.m2.placed[c.id] === c.e.cat && mine === c.e.loss;
        return '<div class="irow ' + (ok ? "ok" : "half") + '"><div class="th"><span class="emo">' + cardIcon(c.e) + '</span></div><div><h4>' + esc(c.e.desc) + '</h4><div class="where">Loại đúng: <b>' + c.e.loss + '. ' + D.losses[c.e.loss].name + '</b>' + (mine ? ' · bạn chọn: ' + mine + '. ' + D.losses[mine].name : ' · bạn chưa chọn') + '</div></div></div>';
      }).join("") + '</div></details>' : '') +
      '</div><div class="page-btns"><button class="btn btn-primary btn-lg" id="toM3">Sang màn 3: Tính OEE →</button></div></div>';
    putManager("coachAv");
    $("toM3").onclick = function () { Sound.click(); screenM3(); };
  }

  /* ============ 7. MÀN 3, TÍNH OEE ============ */
  var FIELDS = [
    { k: "planned", l: "Thời gian SX kế hoạch", u: "phút", hint: "= Thời gian ca − Tổng dừng có kế hoạch" },
    { k: "run", l: "Thời gian vận hành", u: "phút", hint: "= Thời gian SX kế hoạch − Tổng tổn thất A (dừng máy)" },
    { k: "A", l: "A, Độ sẵn sàng", u: "%", hint: "= Thời gian vận hành ÷ Thời gian SX kế hoạch" },
    { k: "P", l: "P, Hiệu suất", u: "%", hint: "= (Chu kỳ LÝ TƯỞNG × Tổng sản phẩm) ÷ Thời gian vận hành. Không dùng takt time!" },
    { k: "Q", l: "Q, Chất lượng", u: "%", hint: "= Sản phẩm tốt ÷ Tổng sản phẩm (sản phẩm tốt = tổng − phế phẩm)" },
    { k: "OEE", l: "OEE", u: "%", hint: "= A × P × Q (hoặc Sản phẩm tốt × Chu kỳ lý tưởng ÷ Thời gian SX kế hoạch)" },
    { k: "takt", l: "Takt time", u: "phút/sp", hint: "= Thời gian SX kế hoạch ÷ Nhu cầu khách hàng" },
    { k: "meets", l: "Đáp ứng đơn hàng?", u: "", hint: "So số sản phẩm TỐT với nhu cầu khách hàng trong ngày" }
  ];
  function truth(mid, k) {
    var r = S.res[mid];
    return { planned: r.planned, run: r.run, A: r.A * 100, P: r.P * 100, Q: r.Q * 100, OEE: r.OEE * 100, takt: r.takt, meets: r.meets ? "yes" : "no" }[k];
  }
  function checkField(mid, k) {
    var v = S.m3.val[mid + k], t = truth(mid, k);
    if (k === "meets") return v === t;
    var x = parseNum(v); if (isNaN(x)) return false;
    var tol = k === "planned" || k === "run" ? D.toleranceMin : k === "takt" ? D.toleranceTakt : D.tolerancePct;
    return Math.abs(x - t) <= tol + 1e-9;
  }
  function solution(mid, k) {
    var r = S.res[mid], m = S.scenario.machines.filter(function (x) { return x.id === mid; })[0];
    var plan = m.events.filter(function (e) { return e.cat === "plan"; }).map(function (e) { return e.min; }).join(" + ");
    var aL = m.events.filter(function (e) { return e.cat === "A"; }).map(function (e) { return e.min; }).join(" + ");
    return {
      planned: "480 − (" + plan + ") = 480 − " + r.planStop + " = <b>" + r.planned + " phút</b>",
      run: r.planned + " − (" + aL + ") = " + r.planned + " − " + r.lossA + " = <b>" + r.run + " phút</b>",
      A: r.run + " ÷ " + r.planned + " = <b>" + pct(r.A) + "</b>",
      P: "(" + num(r.ideal, 1) + " × " + r.total + ") ÷ " + r.run + " = " + num(r.ideal * r.total, 1) + " ÷ " + r.run + " = <b>" + pct(r.P) + "</b>",
      Q: "(" + r.total + " − " + r.defects + ") ÷ " + r.total + " = " + r.good + " ÷ " + r.total + " = <b>" + pct(r.Q) + "</b>",
      OEE: pct(r.A) + " × " + pct(r.P) + " × " + pct(r.Q) + " = <b>" + pct(r.OEE) + "</b> (kiểm tra: " + r.good + " × " + num(r.ideal, 1) + " ÷ " + r.planned + ")",
      takt: r.planned + " ÷ " + r.demand + " = <b>" + num(r.takt, 2) + " phút/sp</b>",
      meets: "Sản phẩm tốt " + r.good + (r.meets ? " ≥ " : " < ") + "nhu cầu " + r.demand + " → <b>" + (r.meets ? "Đáp ứng" : "KHÔNG đáp ứng (thiếu " + (-r.gap) + " sp)") + "</b>"
    }[k];
  }

  function dataSheet(m) {
    function list(cat, unit) {
      return '<ul class="dl">' + m.events.filter(function (e) { return e.cat === cat; }).sort(function (a, b) { return a.t - b.t; }).map(function (e) {
        return '<li><span>' + clock(e.t) + ' · ' + esc(e.desc) + '</span><b>' + (unit === "sp" ? e.qty + " sp" : e.min + "'") + '</b></li>';
      }).join("") + '</ul>';
    }
    return '<div class="sheet"><div class="clip-top"></div><h3><span class="plate">' + mcode(m.id) + '</span>Phiếu dữ liệu ca</h3>' +
      '<div class="kv"><span>Thời gian ca</span><b>480 phút</b></div>' +
      '<div class="kv"><span>Chu kỳ lý tưởng</span><b>' + num(m.ideal, 1) + ' phút/sp</b></div>' +
      '<div class="kv"><span>Tổng sản lượng</span><b>' + m.total + ' sp</b></div>' +
      '<div class="kv"><span>Nhu cầu khách hàng</span><b>' + m.demand + ' sp/ngày</b></div>' +
      '<h4 style="--c:' + D.cats.plan.color + '">Dừng có kế hoạch</h4>' + list("plan") +
      '<h4 style="--c:' + D.cats.A.color + '">Tổn thất A, dừng máy</h4>' + list("A") +
      '<h4 style="--c:' + D.cats.P.color + '">Tổn thất P, tốc độ</h4>' + list("P") +
      '<h4 style="--c:' + D.cats.Q.color + '">Tổn thất Q, phế phẩm</h4>' + list("Q", "sp") + '</div>';
  }

  function screenM3() {
    setStep(3);
    S.m3.tab = "lathe"; S.m3.submitted = false;
    draw();
    function draw() {
      var mid = S.m3.tab, m = S.scenario.machines.filter(function (x) { return x.id === mid; })[0], sub = S.m3.submitted;
      $("stage").innerHTML = '<div class="page wide">' + coach(sub ? "Đây là lời giải từng bước. Đối chiếu từng ô nhé." : "Dùng phiếu dữ liệu đã phân loại đúng để tính cho từng máy. Có máy tính bỏ túi; mỗi lần bấm Gợi ý bị trừ 1 điểm.") +
        '<div class="tabs">' + MACH.map(function (id) { var filled = FIELDS.filter(function (f) { return S.m3.val[id + f.k] != null && S.m3.val[id + f.k] !== ""; }).length; return '<button class="tab' + (id === mid ? " on" : "") + '" data-tab="' + id + '">' + mname(id) + ' <small>' + filled + '/' + FIELDS.length + '</small></button>'; }).join("") +
        '<button class="btn btn-ghost calc-btn" id="openCalc">' + ic("calc") + 'Máy tính</button></div>' +
        '<div class="m3grid"><div class="card clipboard">' + dataSheet(m) + '</div><div class="card formsheet"><h3><span class="plate">' + mcode(mid) + '</span>Bảng tính OEE, ' + m.name + '</h3><div class="fields">' +
        FIELDS.map(function (f) {
          var key = mid + f.k, v = S.m3.val[key], ok = sub ? checkField(mid, f.k) : null;
          var input = f.k === "meets"
            ? '<select data-f="' + f.k + '"' + (sub ? " disabled" : "") + '><option value="">- chọn -</option><option value="yes"' + (v === "yes" ? " selected" : "") + '>Có, đủ đơn hàng</option><option value="no"' + (v === "no" ? " selected" : "") + '>Không, thiếu hàng</option></select>'
            : '<input inputmode="decimal" data-f="' + f.k + '" value="' + esc(v == null ? "" : v) + '"' + (sub ? " disabled" : "") + ' placeholder="?">';
          return '<div class="frow' + (sub ? (ok ? " ok" : " bad") : "") + '"><label>' + f.l + '</label><div class="fin">' + input + '<span class="unit">' + f.u + '</span>' +
            (sub ? '<span class="mark">' + (ok ? "✓" : "✗") + '</span>' : '<button class="hintb" data-h="' + f.k + '" title="Gợi ý (−1 điểm)">' + ic("hint") + '</button>') + '</div>' +
            (S.m3.used[key] && !sub ? '<div class="hint">' + f.hint + '</div>' : '') +
            (sub ? '<div class="sol">' + solution(mid, f.k) + '</div>' : '') + '</div>';
        }).join("") + '</div></div></div>' +
        '<div class="page-btns">' + (sub ? '<span class="small-note">Điểm màn 3: <b>' + num(S.score.m3, 1) + '/35</b></span><button class="btn btn-primary btn-lg" id="toM4">Sang màn 4: Phân tích →</button>'
          : '<button class="btn btn-primary btn-lg" id="m3Submit">Nộp bài tính toán</button>') + '</div></div>';
      putManager("coachAv");
      document.querySelectorAll(".tab").forEach(function (b) { b.onclick = function () { Sound.click(); S.m3.tab = b.dataset.tab; draw(); }; });
      document.querySelectorAll("[data-f]").forEach(function (inp) {
        var ev = inp.tagName === "SELECT" ? "change" : "input";
        inp.addEventListener(ev, function () { S.m3.val[mid + inp.dataset.f] = inp.value; document.querySelector(".tab.on small").textContent = FIELDS.filter(function (f) { var v = S.m3.val[mid + f.k]; return v != null && v !== ""; }).length + "/" + FIELDS.length; });
      });
      document.querySelectorAll(".hintb").forEach(function (b) {
        b.onclick = function () { var key = mid + b.dataset.h; if (!S.m3.used[key]) { S.m3.used[key] = true; S.m3.hints++; toast("Gợi ý: −1 điểm"); } Sound.click(); draw(); };
      });
      $("openCalc").onclick = openCalc;
      if ($("m3Submit")) $("m3Submit").onclick = function () {
        var empty = MACH.reduce(function (a, id) { return a + FIELDS.filter(function (f) { var v = S.m3.val[id + f.k]; return v == null || v === ""; }).length; }, 0);
        if (empty) {
          modal('<h3>Nộp bài?</h3><p>Còn <b>' + empty + '</b> ô chưa điền (tính cả 2 máy). Ô trống được tính là sai.</p><div class="modal-btns"><button class="btn btn-ghost" data-close>Điền tiếp</button><button class="btn btn-primary" id="m3Go">Vẫn nộp</button></div>');
          $("m3Go").onclick = function () { closeModal(); submit(); };
        } else submit();
      };
      if ($("toM4")) $("toM4").onclick = function () { Sound.click(); screenM4(); };
    }
    function submit() {
      var ok = 0, all = 0;
      MACH.forEach(function (id) { FIELDS.forEach(function (f) { all++; if (checkField(id, f.k)) ok++; }); });
      S.score.m3 = Math.max(0, 35 * ok / all - S.m3.hints);
      S.review.m3 = { ok: ok, all: all, hints: S.m3.hints };
      S.m3.submitted = true; ok / all >= .75 ? Sound.ok() : Sound.no();
      draw();
    }
  }

  /* Máy tính bỏ túi */
  function openCalc() {
    Sound.click();
    var expr = "";
    modal('<h3>Máy tính</h3><div class="calc"><div class="cbrand">WISE · FX-OEE</div><div class="cdisp" id="cdisp">0</div><div class="ckeys">' +
      ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ",", "⌫", "="].map(function (k) { return '<button data-k="' + k + '"' + (/[=]/.test(k) ? ' class="eq"' : /[÷×−+()C⌫]/.test(k) ? ' class="op"' : '') + '>' + k + '</button>'; }).join("") +
      '</div></div><div class="modal-btns"><button class="btn btn-ghost" data-close>Đóng</button></div>');
    function show(v) { $("cdisp").textContent = v || "0"; }
    $("modalCard").querySelectorAll(".ckeys button").forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.k; Sound.click();
        if (k === "C") expr = ""; else if (k === "⌫") expr = expr.slice(0, -1);
        else if (k === "=") {
          var js = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-").replace(/,/g, ".");
          if (/^[0-9+\-*/(). ]+$/.test(js)) { try { var v = Function('"use strict";return (' + js + ')')(); expr = isFinite(v) ? String(Math.round(v * 10000) / 10000).replace(".", ",") : "Lỗi"; } catch (e) { expr = "Lỗi"; } }
        } else { if (expr === "Lỗi") expr = ""; expr += k; }
        show(expr);
      };
    });
  }

  /* ============ 8. MÀN 4, PHÂN TÍCH & CẢI TIẾN ============ */
  function level(k, v) { var wc = D.worldClass[k]; return v >= wc ? "good" : v >= wc - (k === "OEE" ? 20 : 10) ? "mid" : "low"; }
  function gauge(k, v) {
    var lv = level(k, v), cx = 60, cy = 60, R = 44, t = "", i, a, wc = D.worldClass[k];
    for (i = 0; i <= 20; i++) {
      a = Math.PI * (1 - i / 20); var r1 = R + 3, r2 = R + (i % 5 ? 7 : 11);
      t += '<line x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy - r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy - r2 * Math.sin(a)).toFixed(1) + '" class="gtick' + (i % 5 ? "" : " big") + '"/>';
    }
    a = Math.PI * (1 - wc / 100);
    var len = Math.PI * R, ang = -90 + 180 * clamp(v, 0, 100) / 100;
    return '<div class="gauge g-' + lv + '"><svg viewBox="0 0 120 70">' + t +
      '<path d="M' + (cx - R) + ',' + cy + ' A' + R + ',' + R + ' 0 0 1 ' + (cx + R) + ',' + cy + '" class="gtrack"/>' +
      '<path d="M' + (cx - R) + ',' + cy + ' A' + R + ',' + R + ' 0 0 1 ' + (cx + R) + ',' + cy + '" class="gval" style="stroke-dasharray:' + len.toFixed(1) + ';--off:' + (len * (1 - clamp(v, 0, 100) / 100)).toFixed(1) + ';--len:' + len.toFixed(1) + '"/>' +
      '<circle cx="' + (cx + R * Math.cos(a)).toFixed(1) + '" cy="' + (cy - R * Math.sin(a)).toFixed(1) + '" r="2.6" class="gwc"/>' +
      '<g class="needle" style="--a:' + ang.toFixed(1) + 'deg"><path d="M58.6,60 L60,22 L61.4,60 Z"/><circle cx="60" cy="60" r="4.5"/></g></svg>' +
      '<b>' + num(v, 1) + '<small>%</small></b><span>' + k + '</span></div>';
  }
  function waterfall(mid) {
    var r = S.res[mid], W = 560, H = 230, top = 16, base = 196, sc = (base - top) / D.shift, bw = 64, gap = 22, x = 40;
    var steps = [
      { l: "Thời gian ca", v: D.shift, from: 0, c: "#5B6878", total: true },
      { l: "Dừng KH", v: -r.planStop, c: D.cats.plan.color },
      { l: "Tổn thất A", v: -r.lossA, c: D.cats.A.color },
      { l: "Tổn thất P", v: -r.speedLoss, c: D.cats.P.color },
      { l: "Tổn thất Q", v: -r.qualityLoss, c: D.cats.Q.color },
      { l: "SP tốt", v: r.goodTime, from: 0, c: "#2E9A57", total: true }];
    var cur = D.shift, o = '<svg class="wf" viewBox="0 0 ' + W + ' ' + H + '"><line x1="30" y1="' + base + '" x2="' + (W - 10) + '" y2="' + base + '" class="axis"/>';
    steps.forEach(function (s, i) {
      var y0, y1;
      if (s.total) { y0 = base - s.v * sc; y1 = base; cur = s.v; }
      else { y0 = base - cur * sc; cur += s.v; y1 = base - cur * sc; }
      var bx = x + i * (bw + gap);
      o += '<rect class="wfbar" style="--d:' + (i * .18) + 's" x="' + bx + '" y="' + y0 + '" width="' + bw + '" height="' + Math.max(1, y1 - y0) + '" rx="4" fill="' + s.c + '"/>' +
        '<text x="' + (bx + bw / 2) + '" y="' + (y0 - 5) + '" class="wft">' + (s.total ? "" : "−") + num(Math.abs(s.v), Math.abs(s.v) % 1 ? 1 : 0) + "'</text>" +
        '<text x="' + (bx + bw / 2) + '" y="' + (base + 16) + '" class="wfl">' + s.l + '</text>';
      if (i < steps.length - 1 && !steps[i + 1].total) o += '<line x1="' + (bx + bw) + '" x2="' + (bx + bw + gap) + '" y1="' + (base - cur * sc) + '" y2="' + (base - cur * sc) + '" class="conn"/>';
    });
    return o + '</svg>';
  }
  /* Biểu đồ thanh ngang: mỗi chỉ số một hàng, 2 máy, vạch trắng = chuẩn thế giới */
  function compareChart() {
    var keys = ["A", "P", "Q", "OEE"], W = 600, X0 = 78, SC = 4.4, RH = 52, top = 14, H = top + keys.length * RH + 34;
    var o = '<svg class="cc" viewBox="0 0 ' + W + ' ' + H + '">';
    [0, 50, 75, 100].forEach(function (v) {
      var x = X0 + v * SC;
      o += '<line x1="' + x + '" x2="' + x + '" y1="' + (top - 6) + '" y2="' + (top + keys.length * RH - 8) + '" class="grid"/><text x="' + x + '" y="' + (top + keys.length * RH + 6) + '" class="wfl">' + v + '%</text>';
    });
    keys.forEach(function (k, i) {
      var y = top + i * RH, wc = D.worldClass[k], wx = X0 + wc * SC;
      o += '<text x="12" y="' + (y + 24) + '" class="wfk">' + k + '</text>';
      MACH.forEach(function (id, j) {
        var v = S.res[id][k] * 100, by = y + j * 19, lv = level(k, v);
        o += '<rect x="' + X0 + '" y="' + by + '" width="' + (100 * SC) + '" height="14" rx="2" class="trk"/>' +
          '<rect class="hbar" style="--d:' + ((i * 2 + j) * .08) + 's" x="' + X0 + '" y="' + by + '" width="' + (v * SC).toFixed(1) + '" height="14" rx="2" fill="' + (id === "lathe" ? "#3C8CE0" : "#F76011") + '"/>' +
          '<text x="' + (X0 + 100 * SC + 10) + '" y="' + (by + 11.5) + '" class="wfv v-' + lv + '">' + num(v, 1) + '%</text>';
      });
      o += '<line x1="' + wx + '" x2="' + wx + '" y1="' + (y - 5) + '" y2="' + (y + 38) + '" class="wcmark"/>' +
        '<text x="' + wx + '" y="' + (y - 7) + '" class="wcl">≥' + num(wc, wc % 1 ? 1 : 0) + '</text>';
    });
    var ly = H - 8;
    return o + '<g><rect x="' + X0 + '" y="' + (ly - 10) + '" width="12" height="12" fill="#3C8CE0" rx="2"/><text x="' + (X0 + 18) + '" y="' + ly + '" class="wfv">Máy tiện</text>' +
      '<rect x="' + (X0 + 110) + '" y="' + (ly - 10) + '" width="12" height="12" fill="#F76011" rx="2"/><text x="' + (X0 + 128) + '" y="' + ly + '" class="wfv">Máy phay</text>' +
      '<line x1="' + (X0 + 226) + '" x2="' + (X0 + 226) + '" y1="' + (ly - 12) + '" y2="' + (ly + 2) + '" class="wcmark"/><text x="' + (X0 + 234) + '" y="' + ly + '" class="wfv">Chuẩn thế giới</text></g></svg>';
  }

  function m4Questions(mid) {
    var r = S.res[mid], m = S.scenario.machines.filter(function (x) { return x.id === mid; })[0], g = O.lossGroups(m);
    var low = ["A", "P", "Q"].sort(function (a, b) { return r[a] - r[b]; })[0], big = g[0];
    var fixOpts = shuffle([big.fix].concat(shuffle(Object.keys(D.fixes).filter(function (k) { return k !== big.fix; })).slice(0, 3)));
    var grp = shuffle(g.slice(0, 5));
    return [
      { id: mid + "1", q: "Đại lượng nào của " + m.name + " thấp nhất (điểm yếu cần ưu tiên)?", opts: [{ v: "A", l: "A, Độ sẵn sàng" }, { v: "P", l: "P, Hiệu suất (tốc độ)" }, { v: "Q", l: "Q, Chất lượng" }], ok: low,
        why: "A = " + pct(r.A) + ", P = " + pct(r.P) + ", Q = " + pct(r.Q) + " → thấp nhất là " + low + "." },
      { id: mid + "2", q: "Tổn thất lớn nhất (tính ra phút) của " + m.name + " là gì?", opts: grp.map(function (x) { return { v: x.name, l: x.name }; }), ok: big.name,
        why: "Quy đổi ra phút: " + g.slice(0, 4).map(function (x) { return x.name + " " + num(x.min, x.min % 1 ? 1 : 0) + "'"; }).join(" · ") + (big.cat === "Q" ? "" : "") + ". Phế phẩm quy đổi = số sp × chu kỳ lý tưởng." },
      { id: mid + "3", q: "Giải pháp cải tiến phù hợp nhất cho tổn thất “" + big.name + "”?", opts: fixOpts.map(function (k) { return { v: k, l: D.fixes[k] }; }), ok: big.fix,
        why: "“" + big.name + "” thuộc nhóm " + D.losses[big.loss].name.toLowerCase() + " → " + D.fixes[big.fix] + "." }
    ];
  }

  function screenM4() {
    setStep(4);
    S.m4.qs = {}; MACH.forEach(function (id) { S.m4.qs[id] = m4Questions(id); });
    S.m4.submitted = false; draw();
    function kpi(k, v) {
      var wc = D.worldClass[k], lab = { A: "Độ sẵn sàng", P: "Hiệu suất", Q: "Chất lượng" }[k];
      return '<div class="kpi k-' + level(k, v) + '"><div class="kpi-h"><b>' + k + '</b><span>' + lab + '</span></div><div class="kpi-v">' + num(v, 1) + '<small>%</small></div>' +
        '<div class="kbar"><i style="width:' + clamp(v, 0, 100) + '%"></i><em style="left:' + wc + '%"></em></div><small class="kwc">Chuẩn ≥ ' + num(wc, wc % 1 ? 1 : 0) + '%</small></div>';
    }
    function panel(id) {
      var r = S.res[id];
      return '<div class="dm"><div class="dm-h"><span class="plate">' + mcode(id) + '</span><b>' + mname(id) + '</b><span class="flag ' + (r.meets ? "ok" : "bad") + '"><i></i>' + (r.meets ? "Đáp ứng đơn hàng" : "Thiếu " + (-r.gap) + " sp") + '</span></div>' +
        '<div class="dm-main"><div class="dm-oee">' + gauge("OEE", r.OEE * 100) + '</div><div class="kpis">' + ["A", "P", "Q"].map(function (k) { return kpi(k, r[k] * 100); }).join("") + '</div></div>' +
        '<div class="dm-sub"><div><span>SP tốt / tổng</span><b>' + r.good + '<small>/' + r.total + '</small></b></div><div><span>Nhu cầu</span><b>' + r.demand + '</b></div><div><span>Takt</span><b>' + num(r.takt, 2) + '<small>′</small></b></div><div><span>CT lý tưởng</span><b>' + num(r.ideal, 1) + '<small>′</small></b></div></div>' +
        '<div class="hmi-l">Thác nước thời gian ca · phút</div>' + waterfall(id) + '</div>';
    }
    function draw() {
      var sub = S.m4.submitted;
      $("stage").innerHTML = '<div class="page wide">' + coach(sub ? "Mỗi máy cần một hướng cải tiến khác nhau, đừng áp một giải pháp cho mọi máy!" : "Đọc bảng điều khiển: kim đồng hồ là OEE, vạch trắng trên mỗi thanh là chuẩn thế giới. Rồi điền phiếu phân tích bên dưới.") +
        '<section class="dash"><div class="dash-top"><div class="dash-t"><i class="led"></i>Bảng điều khiển OEE<span>Xưởng Cơ Khí Sáu Tài · Ca 1 · 06:00-14:00</span></div><div class="dash-legend"><span class="lg-good">Đạt chuẩn</span><span class="lg-mid">Cần theo dõi</span><span class="lg-low">Báo động</span></div></div>' +
        '<div class="dash-grid">' + MACH.map(panel).join("") + '</div>' +
        '<div class="dash-cmp"><div class="hmi-l">So sánh hai máy với chuẩn thế giới · %</div>' + compareChart() + '</div></section>' +
        '<div class="m4q">' + MACH.map(function (id) {
          return '<div class="card paper qsheet"><h3><span class="plate">' + mcode(id) + '</span>Phiếu phân tích, ' + mname(id) + '</h3>' +
            S.m4.qs[id].map(function (q, qi) {
              var a = S.m4.ans[q.id];
              return '<div class="pq" data-q="' + q.id + '"><p class="pq-t"><span class="qn">' + (qi + 1) + '</span>' + esc(q.q) + '</p><div class="opts">' + q.opts.map(function (o) {
                var cls = a === o.v ? " sel" : ""; if (sub) { if (o.v === q.ok) cls += " right"; else if (a === o.v) cls += " wrong"; }
                return '<button class="opt' + cls + '" data-v="' + esc(o.v) + '"' + (sub ? " disabled" : "") + '><span class="radio"></span><span>' + esc(o.l) + '</span></button>';
              }).join("") + '</div>' + (sub ? '<div class="feedback ' + (a === q.ok ? "ok" : "no") + '"><b>' + (a === q.ok ? "Đúng." : "Chưa đúng.") + '</b> ' + esc(q.why) + '</div>' : '') + '</div>';
            }).join("") + '</div>';
        }).join("") + '</div>' +
        '<div class="page-btns">' + (sub ? '<span class="small-note">Điểm màn 4: <b>' + num(S.score.m4, 1) + '/20</b></span><button class="btn btn-primary btn-lg" id="toResult">Xem kết quả →</button>' : '<button class="btn btn-primary btn-lg" id="m4Submit" disabled>Nộp phân tích</button>') + '</div></div>';
      putManager("coachAv");
      document.querySelectorAll(".qsheet .pq").forEach(function (box) {
        box.querySelectorAll(".opt").forEach(function (b) {
          b.onclick = function () { S.m4.ans[box.dataset.q] = b.dataset.v; Sound.click(); box.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); }); checkReady(); };
        });
      });
      function checkReady() { var all = MACH.reduce(function (a, id) { return a.concat(S.m4.qs[id]); }, []); if ($("m4Submit")) $("m4Submit").disabled = all.some(function (q) { return S.m4.ans[q.id] == null; }); }
      checkReady();
      if ($("m4Submit")) $("m4Submit").onclick = function () {
        var all = MACH.reduce(function (a, id) { return a.concat(S.m4.qs[id]); }, []), ok = all.filter(function (q) { return S.m4.ans[q.id] === q.ok; }).length;
        S.score.m4 = 20 * ok / all.length; S.review.m4 = { ok: ok, all: all.length };
        S.m4.submitted = true; ok / all.length >= .67 ? Sound.ok() : Sound.no(); draw();
      };
      if ($("toResult")) $("toResult").onclick = function () { Sound.click(); finish(); };
    }
  }

  /* ============ 9. KẾT QUẢ & BÀI HỌC ============ */
  function rating(t) { return t >= 90 ? "Chuyên gia OEE" : t >= 70 ? "Đạt" : "Cần học thêm"; }
  function lessonsHTML() {
    var L = S.res.lathe, M = S.res.mill, sc = S.scenario.machines;
    function weak(r) { return ["A", "P", "Q"].sort(function (a, b) { return r[a] - r[b]; })[0]; }
    var gL = O.lossGroups(sc[0])[0], gM = O.lossGroups(sc[1])[0];
    var pts = [
      "OEE máy tiện <b>" + pct(L.OEE) + "</b>, máy phay <b>" + pct(M.OEE) + "</b>, cả hai còn dưới chuẩn thế giới 85%.",
      "Máy tiện yếu nhất ở <b>" + weak(L) + "</b>; tổn thất lớn nhất là “" + esc(gL.name) + "” → " + esc(D.fixes[gL.fix]) + ".",
      "Máy phay yếu nhất ở <b>" + weak(M) + "</b>; tổn thất lớn nhất là “" + esc(gM.name) + "” → " + esc(D.fixes[gM.fix]) + ". Mỗi máy cần hướng cải tiến khác nhau.",
      "<b>Takt time</b> (" + num(L.takt, 2) + " phút/sp ở máy tiện) là nhịp nhu cầu khách hàng, dùng để so sản lượng với đơn hàng. <b>Chu kỳ lý tưởng</b> (" + num(L.ideal, 1) + " phút/sp) là năng lực của máy, dùng để tính P.",
      "Máy tiện làm được " + L.good + " sp tốt so với nhu cầu " + L.demand + (L.meets ? " → đáp ứng." : " → thiếu " + (-L.gap) + " sp: OEE thấp ảnh hưởng trực tiếp tới giao hàng.") +
        " Máy phay " + M.good + "/" + M.demand + (M.meets ? " → đáp ứng." : " → thiếu " + (-M.gap) + " sp.")
    ];
    return '<ul class="takeaways">' + pts.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>";
  }

  /* Xem lại: thẻ phân loại sai + lời giải từng bước của 2 máy */
  function reviewHTML() {
    var wrong = S.cards.filter(function (c) { return S.m2.placed[c.id] !== c.e.cat; });
    var w = wrong.length ? '<div class="ilist">' + wrong.map(function (c) {
      var p = S.m2.placed[c.id];
      return '<div class="irow bad"><div class="th"><span class="emo">' + cardIcon(c.e) + '</span></div><div><h4>' + esc(c.e.desc) + ' <small>· ' + mname(c.m) + '</small></h4><div class="where">Bạn chọn: <b>' + (p ? D.cats[p].name : "chưa phân loại") + '</b> · Đúng: <b>' + D.cats[c.e.cat].name + '</b></div><p>' + esc(c.e.why) + '</p></div><span class="badge bad">Sai</span></div>';
    }).join("") + '</div>' : '<p class="small-note">Bạn phân loại đúng tất cả thẻ sự kiện.</p>';
    var sol = MACH.map(function (id) {
      return '<div class="solbox"><b class="gt">' + mname(id) + '</b><ol class="solsteps">' + FIELDS.map(function (f) {
        var ok = checkField(id, f.k);
        return '<li class="' + (ok ? "ok" : "bad") + '"><span>' + f.l + '</span>' + solution(id, f.k) + '</li>';
      }).join("") + '</ol></div>';
    }).join("");
    return '<div class="card"><h2>Xem lại bài làm</h2>' +
      '<details class="more" open><summary>Thẻ sự kiện phân loại chưa đúng (' + wrong.length + ')</summary>' + w + '</details>' +
      '<details class="more"><summary>Lời giải tính OEE từng bước</summary><div class="solgrid">' + sol + '</div></details></div>';
  }

  function finish() {
    clearInterval(S.timerI);
    var sec = (Date.now() - S.t0) / 1000;
    S.score.bonus = sec <= 12 * 60 ? 5 : sec >= 25 * 60 ? 0 : 5 * (25 * 60 - sec) / (13 * 60);
    var base = S.score.m1 + S.score.m2 + S.score.m3 + S.score.m4, total = Math.min(100, Math.round(base + S.score.bonus)), rt = rating(total);
    var best = store(BEST_KEY) || {}, prev = best[PLAYER] || 0; if (total > prev) { best[PLAYER] = total; store(BEST_KEY, best); }
    window.WISE_LMS.sendResult({
      player: PLAYER, score: total, rating: rt, timeSec: Math.round(sec),
      breakdown: { hocNhanh: +num(S.score.m1, 1).replace(",", "."), phanLoai: +num(S.score.m2, 1).replace(",", "."), tinhToan: +num(S.score.m3, 1).replace(",", "."), phanTich: +num(S.score.m4, 1).replace(",", "."), thuongThoiGian: +num(S.score.bonus, 1).replace(",", ".") },
      finishedAt: new Date().toISOString()
    });
    var rows = [["Màn 1 · Học nhanh", S.score.m1, 10, "#2F78C4"], ["Màn 2 · Phân loại sự kiện", S.score.m2, 35, "#D9412F"], ["Màn 3 · Tính OEE", S.score.m3, 35, "#E7A812"], ["Màn 4 · Phân tích & cải tiến", S.score.m4, 20, "#2E9A57"], ["Thưởng thời gian (" + fmtTime(sec) + ")", S.score.bonus, 5, "#8A4FD8"]];
    var cls = total >= 90 ? "r1" : total >= 70 ? "r2" : "r3", medal = total >= 90 ? ["#FFE27A", "#E7A812"] : total >= 70 ? ["#E9EEF3", "#9AA8B6"] : ["#F0B98A", "#B5733D"];
    $("result").innerHTML =
      '<div class="res-hero"><div class="res-char" id="resChar"></div><div class="res-main"><div class="res-title">Thử thách OEE · ' + esc(PLAYER) + '</div>' +
      '<div class="res-score"><span id="scoreNum">0</span><small>/100</small></div><div class="stars" id="stars">' + [0, 1, 2].map(function () { return '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.8z" fill="#FFD24A" stroke="#C99A12" stroke-width="1"/></svg>'; }).join("") + '</div>' +
      '<span class="stamp ' + cls + '"><small>Kết quả đánh giá</small>' + rt + '</span><div class="res-meta">Kỷ lục của bạn: ' + Math.max(prev, total) + (total > prev && prev ? ' · <b style="color:#FFD24A">Kỷ lục mới!</b>' : '') + '</div></div>' +
      '<svg class="medal" viewBox="0 0 86 110"><path d="M22 0h16l8 34H30z" fill="#F76011"/><path d="M48 0h16l-8 34H40z" fill="#0B4278"/><circle cx="43" cy="68" r="34" fill="' + medal[1] + '"/><circle cx="43" cy="68" r="28" fill="' + medal[0] + '"/><text x="43" y="76" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="' + medal[1] + '">OEE</text></svg></div>' +
      '<div class="res-grid"><div class="card"><h2>Điểm từng màn</h2>' + rows.map(function (r) {
        return '<div class="srow2"><span>' + r[0] + '</span><div class="bar"><i style="background:' + r[3] + '" data-w="' + (r[1] / r[2] * 100) + '"></i></div><b>' + num(r[1], 1) + '<small>/' + r[2] + '</small></b></div>';
      }).join("") + '<p class="small-note">Xếp loại: Chuyên gia OEE ≥ 90 · Đạt 70-89 · Cần học thêm &lt; 70</p></div>' +
      '<div class="card paper"><h2>Bài học rút ra</h2>' + lessonsHTML() + '</div></div>' +
      '<div class="card"><h2>Kết quả OEE của ca</h2><div class="hmi"><div class="gauges two">' + MACH.map(function (id) { var r = S.res[id]; return '<div><b class="gt">' + mname(id) + '</b><div class="gauges">' + ["A", "P", "Q", "OEE"].map(function (k) { return gauge(k, r[k] * 100); }).join("") + '</div></div>'; }).join("") + '</div></div></div>' +
      reviewHTML() +
      '<div class="res-actions"><button class="btn btn-primary btn-lg" id="again">' + ic("redo") + 'Chơi lại · kịch bản mới</button><button class="btn btn-dark btn-lg" id="lessonR">' + ic("book") + 'Xem bài học OEE</button><a class="btn btn-ghost btn-lg" href="../thu-thach-5s/index.html">' + ic("gear") + 'Quay về game 5S</a></div>';
    show("scr-result");
    var w = window.createCharacter(); w.classList.add(total >= 70 ? "celebrate" : "scratch"); $("resChar").appendChild(w);
    var el = $("scoreNum"), t0 = performance.now();
    (function step(now) { var k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(total * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
    var stars = total >= 90 ? 3 : total >= 70 ? 2 : total >= 40 ? 1 : 0, sv = $("stars").querySelectorAll("svg");
    for (var i = 0; i < stars; i++) (function (i) { setTimeout(function () { sv[i].classList.add("on"); Sound.tone(880 + i * 220, .15, "triangle", .1); }, 900 + i * 300); })(i);
    setTimeout(function () { document.querySelectorAll(".srow2 .bar i").forEach(function (b) { b.style.width = b.dataset.w + "%"; }); }, 300);
    if (total >= 70) setTimeout(function () { Sound.win(); confetti(total >= 90 ? 140 : 70); }, 700); else setTimeout(function () { Sound.meh(); }, 700);
    $("again").onclick = function () { Sound.click(); startPlay(false); };
    $("lessonR").onclick = openLesson;
  }
  function confetti(n) {
    var box = $("confetti"), cols = ["#F76011", "#FFD24A", "#2E9A57", "#2F78C4", "#E0552A", "#FFFFFF", "#8A4FD8"]; box.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var c = mk("i"); c.style.left = rnd(0, 100) + "vw"; c.style.background = cols[i % cols.length];
      c.style.setProperty("--dx", rnd(-120, 120) + "px"); c.style.setProperty("--rot", rnd(360, 1080) + "deg");
      c.style.animationDuration = rnd(2.2, 4) + "s"; c.style.animationDelay = rnd(0, .8) + "s"; c.style.width = rnd(6, 12) + "px"; c.style.height = rnd(8, 16) + "px";
      box.appendChild(c);
    }
    setTimeout(function () { box.innerHTML = ""; }, 5200);
  }
  function openLesson() {
    Sound.click();
    modal('<h3>Bài học OEE</h3><div class="lessons">' + D.lessons.map(function (l, i) { return '<div class="lesson"><div class="si" style="background:' + ["#2F78C4", "#D9412F", "#E7A812", "#8A4FD8", "#5B6878", "#2E9A57"][i] + '">' + (i + 1) + '</div><div><b>' + esc(l.t) + '</b><p>' + esc(l.d) + '</p></div></div>'; }).join("") +
      '<div class="lesson"><div class="si" style="background:#002F5B">6</div><div><b>6 tổn thất lớn</b><p>' + Object.keys(D.losses).map(function (k) { return k + ". " + D.losses[k].name + " (" + D.losses[k].cat + ")"; }).join(" · ") + '</p></div></div></div>' +
      '<div class="modal-btns"><button class="btn btn-primary" data-close>Đã hiểu</button></div>', true);
  }

  /* ============ 10. KHỞI ĐỘNG ============ */
  function startPlay(sample) {
    Sound.init(); newGame(sample);
    show("scr-play"); startTimer(); screenM1();
  }

  function guideImages() {
    var g = [
      '<svg viewBox="0 0 120 70"><rect x="8" y="28" width="104" height="16" rx="4" fill="#E3E9EF"/><rect x="8" y="28" width="12" height="16" rx="4" fill="#3C7DD9"/><rect x="20" y="28" width="20" height="16" fill="#D9412F"/><rect x="40" y="28" width="9" height="16" fill="#E7A812"/><rect x="49" y="28" width="5" height="16" fill="#8A4FD8"/><rect x="54" y="28" width="58" height="16" rx="4" fill="#2E9A57"/><text x="60" y="62" text-anchor="middle" font-size="10" font-weight="800" fill="#002F5B">480 phút → OEE</text></svg>',
      '<svg viewBox="0 0 120 70"><rect x="10" y="8" width="34" height="44" rx="5" fill="#fff" stroke="#C9D3DD"/><path d="M27 15v3M27 27v3M21 22h3M30 22h3" stroke="#D9412F" stroke-width="2" stroke-linecap="round"/><rect x="16" y="32" width="22" height="3" fill="#C9D3DD"/><rect x="16" y="38" width="16" height="3" fill="#C9D3DD"/><path d="M48 30 h18" stroke="#F76011" stroke-width="3" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#F76011"/></marker></defs><rect x="72" y="8" width="18" height="50" rx="4" fill="#D9412F" opacity=".85"/><rect x="94" y="8" width="18" height="50" rx="4" fill="#E7A812" opacity=".85"/><text x="81" y="66" text-anchor="middle" font-size="9" font-weight="800" fill="#002F5B">A</text><text x="103" y="66" text-anchor="middle" font-size="9" font-weight="800" fill="#002F5B">P</text></svg>',
      '<svg viewBox="0 0 120 70"><rect x="30" y="4" width="60" height="62" rx="8" fill="#002F5B"/><rect x="36" y="10" width="48" height="14" rx="3" fill="#7FE0CF"/><text x="80" y="21" text-anchor="end" font-size="10" font-weight="800" fill="#0B3A30">68,0</text>' + [0, 1, 2].map(function (r) { return [0, 1, 2, 3].map(function (c) { return '<rect x="' + (37 + c * 12) + '" y="' + (29 + r * 12) + '" width="9" height="9" rx="2" fill="' + (c === 3 ? "#F76011" : "#C9D3DD") + '"/>'; }).join(""); }).join("") + '</svg>',
      '<svg viewBox="0 0 120 70"><rect x="14" y="10" width="14" height="48" rx="2" fill="#5B6878"/><rect x="32" y="10" width="14" height="6" fill="#3C7DD9"/><rect x="50" y="16" width="14" height="14" fill="#D9412F"/><rect x="68" y="30" width="14" height="6" fill="#E7A812"/><rect x="86" y="36" width="14" height="22" rx="2" fill="#2E9A57"/><line x1="10" y1="58" x2="110" y2="58" stroke="#C9D3DD"/></svg>'];
    g.forEach(function (s, i) { var el = $("gimg" + (i + 1)); if (el) el.innerHTML = s; });
  }

  /* hỗ trợ kiểm thử: xem trạng thái hiện tại trong Console, window.__oeeState() */
  window.__oeeState = function () { return S; };

  function init() {
    // kiểm tra tự động hàm tính OEE với số liệu mẫu (mở Console để xem)
    var t = O.selfTest(D);
    (t.ok ? console.info : console.error)("[OEE] Kiểm tra công thức với số liệu mẫu: " + (t.ok ? "ĐẠT" : "LỖI") + "\n" + t.lines.join("\n"));

    buildWorkshop($("startScene"), false);
    function fitBg() { var sc = $("startScene"), s = Math.max(innerWidth / SW, innerHeight / SH) * 1.08; sc.style.transform = "translate(-50%,-50%) scale(" + s + ")"; sc.style.transformOrigin = "50% 50%"; }
    fitBg(); window.addEventListener("resize", function () { fitBg(); fitSim(); });
    guideImages(); soundIcon();
    var inp = $("playerName"), btn = $("btnStart"), last = store(NAME_KEY);
    if (last) inp.value = last;
    function upd() { var n = inp.value.trim(); btn.disabled = !n; var best = store(BEST_KEY) || {}; $("bestLine").textContent = n && best[n] ? "Kỷ lục OEE của " + n + ": " + best[n] + "/100" : ""; }
    inp.addEventListener("input", upd); upd();
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !btn.disabled) btn.click(); });
    btn.addEventListener("click", function () { var n = inp.value.trim(); if (!n) return; store(NAME_KEY, n); PLAYER = n; Sound.init(); Sound.click(); show("scr-guide"); });
    $("btnGuideGo").addEventListener("click", function () { Sound.click(); startPlay(!store("wise_oee_played")); store("wise_oee_played", true); });
    $("btnLessonStart").addEventListener("click", openLesson);
    $("btnLesson").addEventListener("click", openLesson);
    $("btnSound").addEventListener("click", function () { Sound.on = !Sound.on; store(SOUND_KEY, Sound.on); soundIcon(); Sound.init(); if (!Sound.on) Sound.humOff(); else if (S && S.sim && !S.sim.ended) Sound.humOn(); Sound.click(); });
    $("modal").addEventListener("click", function (e) { if (e.target.id === "modal" || e.target.hasAttribute("data-close")) closeModal(); });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }
  init();
})();
