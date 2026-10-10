/* =====================================================================
   THỬ THÁCH 5S, XƯỞNG CƠ KHÍ CHÚ TÀI  |  Bộ máy game (JavaScript thuần)
   ---------------------------------------------------------------------
   3 giai đoạn:
     1. Dọn xưởng , S1 Sàng lọc, S2 Sắp xếp (gồm sắp xếp lại mặt bằng), S3 Sạch sẽ
     2. Tiêu chuẩn, S4 Săn sóc: băng keo định vị (người chơi tự kéo), nhãn, biển, hình bóng dụng cụ
     3. Duy trì   , S5 Sẵn sàng: lịch đánh giá, xếp hạng, khen thưởng
   Cấu trúc file:
     1. Tiện ích & toạ độ          7. Sơ đồ mặt bằng (kéo thả khối, spaghetti)
     2. Âm thanh                   8. Băng keo định vị
     3. Khối di chuyển được        9. Hạng mục S4 dạng lựa chọn & dấu "?"
     4. Tạo ván chơi               10. HUD, bảng hành động, camera
     5. Vẽ cảnh                    11. Chấm điểm
     6. Nhân vật, hành động        12. Màn hình, giai đoạn, S5, kết quả
   Nội dung (vật dụng, câu hỏi, giải thích) nằm ở js/config.js.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.GAME_CONFIG, A = window.ASSETS, LY = C.layout;
  var OX = A.scene.ox, OY = A.scene.oy, SW = A.scene.w, SH = A.scene.h;
  var GW = C.grid.w, GH = C.grid.h;
  var BEST_KEY = "wise5s_xck_best_v3", SOUND_KEY = "wise5s_xck_sound";
  var STATIONS = LY.flow.slice();                               // 5 trạm theo dòng chảy
  var BLOCKS = STATIONS.concat(["redtag", "bins", "desk"]);     // mọi khối kéo thả được
  var BLOCK_SPRITE = { shelf: "shelf", lathe: "lathe", mill: "mill", qc: "qc", finished: "pallet", redtag: "redPallet", desk: "desk" };
  var BIN_KEYS = ["binMetal", "binRecycle", "binGeneral", "binOily"];
  var GROUP_ICON = { "Lịch đánh giá": "📅", "Xếp hạng": "🏆", "Khen thưởng": "🎖️" };
  var GEAR = '<svg class="gear" viewBox="-12 -12 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="' + (function () {
    var d = "", n = 40; for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n, r = (i % 4 === 1 || i % 4 === 2) ? 11 : 8.4; d += (i ? "L" : "M") + (r * Math.cos(a)).toFixed(2) + "," + (r * Math.sin(a)).toFixed(2); }
    return d + "Z M-3.6,0 a3.6,3.6 0 1 0 7.2,0 a3.6,3.6 0 1 0 -7.2,0 Z"; })() + '"/></svg>';

  /* ============ 1. TIỆN ÍCH ============ */
  function $(id) { return document.getElementById(id); }
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function iso(x, y, z) { return { x: OX + (x - y) * 32, y: OY + (x + y) * 16 - (z || 0) }; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function k2(x, y) { return x + "," + y; }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function fmtTime(s) { s = Math.max(0, Math.floor(s)); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }
  function depthOf(tx, ty) { return (tx + ty + 1) * 20; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function copyLayout(l) { var o = {}; Object.keys(l).forEach(function (k) { o[k] = l[k].slice(); }); return o; }

  var BLOCKED = {};
  C.blocked.forEach(function (t) { BLOCKED[k2(t[0], t[1])] = true; });
  var AISLE = {};
  C.aisle.rects.forEach(function (r) { for (var x = r.x0; x <= r.x1; x++) for (var y = r.y0; y <= r.y1; y++) AISLE[k2(x, y)] = true; });

  var FIXED = [
    { k: "bench", front: [8, 0], label: "Bàn nguội", zone: "board" },
    { k: "extinguisher", front: [10, 0], label: "Bình chữa cháy", tiles: [[10, 0]] },
    { k: "truck", front: [4, 22], label: "Xe container chờ lấy hàng ở cổng xuất", tiles: [[3, 16], [4, 16]] }
  ];
  var FIX_BY = {}; FIXED.forEach(function (p) { FIX_BY[p.k] = p; });
  function fixZ(k) { var p = FIX_BY[k]; return depthOf(p.front[0], p.front[1]) + 2; }

  /* ============ 2. ÂM THANH (Web Audio, không cần file) ============ */
  var Sound = {
    ctx: null, on: store(SOUND_KEY) !== false,
    init: function () { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); },
    tone: function (freq, dur, type, vol, slide, delay) {
      if (!this.on || !this.ctx) return;
      var c = this.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
    },
    noise: function (dur, vol, freq, delay) {
      if (!this.on || !this.ctx) return;
      var c = this.ctx, t = c.currentTime + (delay || 0), n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b; f.type = "bandpass"; f.frequency.value = freq || 2000; f.Q.value = .8; g.gain.value = vol || .1;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
    },
    pick: function () { this.tone(420, .09, "triangle", .14, 260); this.tone(760, .08, "triangle", .08, 0, .06); },
    place: function () { this.tone(260, .12, "sine", .2, -90); this.noise(.05, .05, 900); },
    trash: function () { this.noise(.22, .12, 1400); this.tone(170, .14, "square", .04, -60, .08); },
    tag: function () { this.tone(980, .05, "square", .05); this.tone(1320, .07, "square", .05, 0, .05); },
    tape: function () { this.noise(.18, .08, 2400); },
    wipe: function () { this.noise(.35, .07, 3200); this.noise(.35, .07, 2600, .38); },
    sparkle: function () { var s = this; [1319, 1760, 2093, 2637].forEach(function (f, i) { s.tone(f, .14, "sine", .06, 0, i * .055); }); },
    step: function () { this.tone(110 + Math.random() * 30, .035, "sine", .025); },
    engine: function () { this.tone(70, .5, "sawtooth", .04, 30); },
    click: function () { this.tone(640, .04, "sine", .06); },
    deny: function () { this.tone(200, .12, "square", .04, -40); },
    move: function () { this.noise(.5, .08, 300); this.tone(90, .4, "sawtooth", .03, 30); },
    phase: function () { var s = this; [523, 784, 1047].forEach(function (f, i) { s.tone(f, .2, "triangle", .1, 0, i * .1); }); },
    win: function () { var s = this; [523, 659, 784, 1047, 1319].forEach(function (f, i) { s.tone(f, .26, "triangle", .12, 0, i * .11); }); },
    meh: function () { var s = this; [392, 370, 330].forEach(function (f, i) { s.tone(f, .24, "triangle", .1, 0, i * .16); }); }
  };

  /* ============ 3. KHỐI DI CHUYỂN ĐƯỢC (máy, kệ, khu vực, thùng rác) ============ */
  function bpos(model, b) { return model.layout[b]; }
  function bfoot(b) { return LY.foot[b]; }
  function blockTiles(model, b) {
    var p = bpos(model, b), f = bfoot(b), t = [];
    for (var x = p[0]; x < p[0] + f[0]; x++) for (var y = p[1]; y < p[1] + f[1]; y++) t.push([x, y]);
    return t;
  }
  function blockZ(model, b) { var p = bpos(model, b), f = bfoot(b); return depthOf(p[0] + f[0] - 1, p[1] + f[1] - 1) + 2; }
  function binTile(model, idx) { var p = bpos(model, "bins"); return [p[0], p[1] + idx]; }
  function binZ(model, idx) { var t = binTile(model, idx); return depthOf(t[0], t[1]) + 2; }
  /* độ lệch (ô) so với vị trí gốc khi sinh hình */
  function blockShift(model, b) { var p = bpos(model, b), o = A.blocks[b]; return { dx: p[0] - o[0], dy: p[1] - o[1] }; }
  function zoneTiles(model, z) {
    var Z = C.zones[z];
    if (Z.station) return blockTiles(model, Z.station);
    if (typeof Z.bin === "number") return [binTile(model, Z.bin)];
    return Z.tiles;
  }
  function blockOccupancy(model, skip) {
    var o = {};
    BLOCKS.forEach(function (b) { if (b === skip) return; blockTiles(model, b).forEach(function (t) { o[k2(t[0], t[1])] = b; }); });
    return o;
  }

  /* ============ 4. TẠO VÁN CHƠI ============ */
  function startLayout() {
    var order, n = 0;
    do { order = shuffle(LY.flow); n++; } while (n < 200 && order.filter(function (v, i) { return v !== LY.flow[i]; }).length < 3);
    var l = {};
    order.forEach(function (st, i) { l[st] = [0, LY.slotsY[i]]; });
    Object.keys(LY.start).forEach(function (b) { l[b] = LY.start[b].slice(); });
    return l;
  }

  function newModel() {
    var model = { layout: startLayout(), items: [], dirt: [], s4: {}, s5: {}, tape: [], reports: {} };
    var used = blockOccupancy(model), slotUse = { finished: 0, shelf: 0 };
    C.blocked.forEach(function (t) { used[k2(t[0], t[1])] = 1; });
    used[k2(C.playerStart.x, C.playerStart.y)] = 1;

    function takeTile(poolName) {
      var pool = C.spawnPools[poolName];
      if (!pool) return null;
      if (pool[0] === "zone") {
        var z = poolName === "shelfzone" ? "shelf" : "finished";
        return { t: "zone", zone: z, slot: 3 + (slotUse[z]++) };
      }
      var opts = shuffle(pool);
      for (var i = 0; i < opts.length; i++) {
        var p = opts[i], kk;
        if (poolName === "lathe" || poolName === "mill") {          // trên máy, toạ độ tương đối theo khối
          kk = "S" + poolName + p.join(",");
          if (used[kk]) continue; used[kk] = 1;
          return { t: "surface", on: poolName, x: p[0], y: p[1], z: p[2], rot: rnd(-60, 60) };
        }
        if (p.length === 5) {                                      // trên bàn nguội
          kk = "S" + p.join(",");
          if (used[kk]) continue; used[kk] = 1;
          return { t: "surface", on: "bench", x: p[0], y: p[1], z: p[2], tx: p[3], ty: p[4], rot: rnd(-60, 60) };
        }
        var key = k2(p[0], p[1]);
        if (used[key]) continue; used[key] = 1;
        return { t: "floor", tx: p[0], ty: p[1], x: p[0] + .5 + rnd(-.12, .12), y: p[1] + .5 + rnd(-.12, .12), rot: rnd(0, 360), tilt: rnd(-14, 14) };
      }
      return null;
    }
    model.items = C.items.map(function (cfg) {
      var it = { cfg: cfg, id: cfg.id, tagged: false, moved: false, loc: null };
      var pools = shuffle(cfg.spawn);
      for (var i = 0; i < pools.length && !it.loc; i++) it.loc = takeTile(pools[i]);
      if (!it.loc) it.loc = takeTile("floor") || { t: "floor", tx: 8, ty: 3, x: 8.5, y: 3.5, rot: 0, tilt: 0 };
      if (cfg.vehicle && it.loc.t === "floor") { it.loc.tilt = 0; it.loc.x = it.loc.tx + .5; it.loc.y = it.loc.ty + .5; }
      else if (cfg.blocks && it.loc.t === "floor") it.loc.tilt = rnd(10, 22) * (Math.random() < .5 ? -1 : 1);   // thùng đổ nghiêng
      it.start = JSON.stringify(it.loc);
      return it;
    });
    model.dirt = C.dirt.map(function (cfg) {
      if (cfg.source) {                                            // dầu rò luôn nằm sát máy gây rò
        var q = leakTile(model, cfg.source); used[k2(q[0], q[1])] = 1;
        return { cfg: cfg, id: cfg.id, tx: q[0], ty: q[1], x: q[0] + .45, y: q[1] + .5, rot: rnd(0, 360), cleaned: false };
      }
      var pools = shuffle(cfg.pool), loc = null;
      for (var i = 0; i < pools.length && !loc; i++) loc = takeTile(pools[i]);
      if (!loc || loc.t !== "floor") loc = takeTile("floor");
      return { cfg: cfg, id: cfg.id, tx: loc.tx, ty: loc.ty, x: loc.tx + .5, y: loc.ty + .5, rot: rnd(0, 360), cleaned: false };
    });
    C.s4.forEach(function (t) { model.s4[t.id] = null; });
    C.s5.forEach(function (q) { model.s5[q.id] = null; });
    return model;
  }

  function leakTile(model, m) { var p = bpos(model, m); return [p[0] + 2, p[1] + 1]; }
  function leakFixed(model, m) { var r = model.reports[m], L = LEAK_BY[m]; return !!(r && r.act != null && L.act[r.act].ok); }
  function leaksAgain(m) { return LEAK_BY[m] && LEAK_BY[m].releak; }
  var LEAK_BY = {}; C.leaks.forEach(function (l) { LEAK_BY[l.machine] = l; });

  function okIndex(list) { for (var i = 0; i < list.length; i++) if (list[i].ok) return i; return 0; }

  function idealModel(model) {
    var m = { layout: copyLayout(LY.ideal), items: [], dirt: model.dirt.map(function (d) { return Object.assign({}, d, { cleaned: true }); }), s4: {}, s5: {}, tape: [], reports: {} };
    C.leaks.forEach(function (l) { m.reports[l.machine] = { src: okIndex(l.src), act: okIndex(l.act) }; });
    var cnt = {}, park = [[10, 3], [11, 3]], pk = 0;
    model.items.forEach(function (it) {
      var z = it.cfg.correct, loc;
      if (it.cfg.vehicle) { var q = park[pk++ % park.length]; loc = { t: "floor", tx: q[0], ty: q[1], x: q[0] + .5, y: q[1] + .5, rot: 0, tilt: 0 }; }
      else if (typeof C.zones[z].bin === "number") loc = { t: "bin", zone: z };
      else if (z === "board") loc = { t: "zone", zone: "board", slot: it.cfg.slot || 0 };
      else { cnt[z] = (cnt[z] || 0) + 1; loc = { t: "zone", zone: z, slot: cnt[z] - 1 }; }
      m.items.push({ cfg: it.cfg, id: it.id, loc: loc, tagged: z === "redtag" });
    });
    C.s4.forEach(function (t) { m.s4[t.id] = okIndex(t.options); });
    C.tape.forEach(function (t) { expectedEdges(m, t).forEach(function (k) { var e = edgeSeg(k); e.c = t.colors[0]; m.tape.push(e); }); });
    return m;
  }

  /* ============ 5. VẼ CẢNH ============ */
  function addImg(root, meta, cls, z, dx, dy) {
    dx = dx || 0; dy = dy || 0;
    var im = new Image(); im.src = meta.src; im.alt = ""; im.draggable = false;
    im.className = cls || "";
    im.style.left = (meta.x + (dx - dy) * 32) + "px"; im.style.top = (meta.y + (dx + dy) * 16) + "px";
    im.style.width = meta.w + "px"; im.style.height = meta.h + "px";
    im.style.zIndex = z;
    root.appendChild(im);
    return im;
  }

  /* Lớp tiêu chuẩn S4 (biển, nhãn, ô cấm…), đi theo khối gắn kèm */
  function overlayPos(model, key) {
    var b = null, z = 1, bi;
    if (key === "signFinished") { b = "finished"; z = "b-1"; }
    else if (/^shelfLabel/.test(key)) { b = "shelf"; z = "b+12"; }
    else if (key === "signRedtag") { b = "redtag"; z = "b-1"; }
    else if ((bi = BIN_KEYS.findIndex(function (k) { return key.indexOf(k + "Label") === 0; })) >= 0) { b = "bins"; z = binZ(model, bi) + 1; }
    var sh = b ? blockShift(model, b) : { dx: 0, dy: 0 };
    if (z === "b-1") z = blockZ(model, b) - 1;
    if (z === "b+12") z = blockZ(model, b) + 12;
    return { dx: sh.dx, dy: sh.dy, z: z };
  }
  function chosenShows(model) {
    var keys = [];
    C.s4.forEach(function (t) { var i = model.s4[t.id]; if (i != null) keys = keys.concat(t.options[i].show); });
    return keys;
  }

  function placement(model, it) {
    var L = it.loc, flat = !!it.cfg.flat, p, sl;
    if (L.t === "floor") return { mode: flat ? "flat" : "iso", x: L.x, y: L.y, z: 0, depth: depthOf(L.tx, L.ty) + (flat ? 0 : 4), rot: L.rot, tilt: L.tilt || 0 };
    if (L.t === "surface") {
      if (L.on === "bench") return { mode: flat ? "flat" : "iso", x: L.x, y: L.y, z: L.z, depth: fixZ("bench") + 1, rot: L.rot, tilt: 0 };
      p = bpos(model, L.on);
      return { mode: flat ? "flat" : "iso", x: p[0] + L.x, y: p[1] + L.y, z: L.z, depth: blockZ(model, L.on) + 1, rot: L.rot, tilt: 0 };
    }
    if (L.t === "zone" && L.zone === "board") {
      var B = A.board;
      if (flat && typeof L.slot === "string" && B.slots[L.slot]) { var s = B.slots[L.slot]; return { mode: "wall", sx: B.ox + s.u, sy: B.oy + s.u * .5 + s.v, depth: 6 }; }
      var sp = B.spare[(typeof L.slot === "number" ? L.slot : 0) % B.spare.length];
      return { mode: flat ? "wallc" : "isoxy", sx: B.ox + sp.u, sy: B.oy + sp.u * .5 + sp.v, depth: 7 };
    }
    if (L.t === "zone") {
      var slots = C.zoneSlots[L.zone], n = slots.length, lift = Math.floor(L.slot / n) * 18, b = C.zones[L.zone].station;
      sl = slots[L.slot % n]; p = bpos(model, b);
      var minSum = Math.min.apply(null, slots.map(function (q) { return q[0] + q[1]; }));
      return { mode: flat ? "flat" : "iso", x: p[0] + sl[0], y: p[1] + sl[1], z: sl[2] + lift, depth: blockZ(model, b) + 1 + Math.round(sl[0] + sl[1] - minSum), rot: flat ? ((L.slot * 47) % 70) - 35 : 0, tilt: 0 };
    }
    return null;
  }

  function spriteMeta(cfg) { return cfg.flat ? A.icons[cfg.sprite] : A.items[cfg.sprite]; }

  function makeItemEl(model, it, live) {
    var pl = placement(model, it); if (!pl) return null;
    var m = spriteMeta(it.cfg), w = mk("div", "it"), g = new Image();
    g.src = m.src; g.alt = it.cfg.name; g.className = "gfx"; g.draggable = false;
    g.style.width = m.w + "px"; g.style.height = m.h + "px";
    var tagX = 0, tagY = 0;
    if (pl.mode === "flat") {
      var p = iso(pl.x, pl.y, pl.z);
      w.style.left = p.x + "px"; w.style.top = p.y + "px";
      g.style.transform = "matrix(1,.5,-1,.5,0,0) rotate(" + pl.rot + "deg) translate(" + (-m.w / 2) + "px," + (-m.h / 2) + "px)";
      w.appendChild(mk("div", "hit")); tagX = 4; tagY = -26;
    } else if (pl.mode === "iso" || pl.mode === "isoxy") {
      var q = pl.mode === "iso" ? iso(pl.x, pl.y, pl.z) : { x: pl.sx, y: pl.sy };
      w.style.left = q.x + "px"; w.style.top = q.y + "px";
      g.style.left = (-m.ax) + "px"; g.style.top = (-m.ay) + "px";
      if (pl.tilt) { g.style.transformOrigin = m.ax + "px " + m.ay + "px"; g.style.transform = "rotate(" + pl.tilt + "deg)"; }
      tagX = 6; tagY = -m.ay + 4;
    } else {
      w.style.left = pl.sx + "px"; w.style.top = pl.sy + "px";
      var dx = pl.mode === "wallc" ? -m.w / 2 : 0;
      g.style.transform = "matrix(1,.5,0,1," + dx + "," + (dx * .5) + ")";
      tagX = m.w + 2; tagY = 0;
    }
    w.style.zIndex = pl.depth;
    w.appendChild(g);
    if (it.tagged || (it.loc.t === "zone" && it.loc.zone === "redtag")) {
      var tg = new Image(); tg.src = A.icons.redtag.src; tg.className = "tag"; tg.style.left = tagX + "px"; tg.style.top = tagY + "px"; w.appendChild(tg);
    }
    if (live) {
      w.addEventListener("click", function (e) { e.stopPropagation(); onItemClick(it, e); });
      w.addEventListener("mouseenter", function (e) { showTip(it.cfg.name, e); });
      w.addEventListener("mouseleave", hideTip);
    }
    return w;
  }

  function makeDirtEl(d, live) {
    var m = A.icons[d.cfg.kind], w = mk("div", "it dirt"), g = new Image(), p = iso(d.x, d.y, 0);
    g.src = m.src; g.className = "gfx"; g.alt = d.cfg.name; g.draggable = false;
    g.style.width = m.w + "px"; g.style.height = m.h + "px";
    g.style.transform = "matrix(1,.5,-1,.5,0,0) rotate(" + d.rot + "deg) translate(" + (-m.w / 2) + "px," + (-m.h / 2) + "px)";
    w.style.left = p.x + "px"; w.style.top = p.y + "px"; w.style.zIndex = 2;
    w.appendChild(mk("div", "hit")); w.appendChild(g);
    if (live) {
      w.addEventListener("click", function (e) { e.stopPropagation(); onDirtClick(d); });
      w.addEventListener("mouseenter", function (e) { showTip(d.cfg.name, e); });
      w.addEventListener("mouseleave", hideTip);
    }
    return w;
  }

  /* Dựng toàn bộ cảnh. live = có tương tác (màn chơi); false = ảnh tĩnh (nền mở đầu, so sánh) */
  function buildScene(root, model, live) {
    root.innerHTML = "";
    root.style.width = SW + "px"; root.style.height = SH + "px";
    var ctx = { root: root, items: {}, dirt: {}, props: {}, markers: {} };
    addImg(root, A.props.floor, "static", 0);
    function bind(im, label, onClick) {
      if (!live) return;
      im.className = "prop";
      im.addEventListener("click", function (e) { e.stopPropagation(); onClick(); });
      im.addEventListener("mouseenter", function (e) { showTip(label, e); });
      im.addEventListener("mouseleave", hideTip);
    }
    var boardTask = C.s4.filter(function (t) { return t.id === "board"; })[0];
    var bi = model.s4.board, boardKey = bi == null ? "boardPlain" : (boardTask.options[bi].show[0] || "boardPlain");
    ctx.props.board = addImg(root, A.props[boardKey], "static", 5);
    bind(ctx.props.board, "Bảng dụng cụ", function () { onZoneClick("board"); });
    FIXED.forEach(function (p) {
      var im = addImg(root, A.props[p.k], "static", fixZ(p.k));
      ctx.props[p.k] = im;
      bind(im, p.label, function () { if (p.zone) onZoneClick(p.zone); else onTilesClick(p.tiles); });
    });
    // khối di chuyển được
    Object.keys(BLOCK_SPRITE).forEach(function (b) {
      var sh = blockShift(model, b), im = addImg(root, A.props[BLOCK_SPRITE[b]], "static", blockZ(model, b), sh.dx, sh.dy);
      ctx.props[b] = im;
      bind(im, LY.names[b], function () { if (b === "shelf" || b === "finished" || b === "redtag") onZoneClick(b); else onTilesClick(blockTiles(G.model, b)); });
    });
    var bsh = blockShift(model, "bins");
    BIN_KEYS.forEach(function (k, i) {
      var im = addImg(root, A.props[k], "static", binZ(model, i), bsh.dx, bsh.dy);
      ctx.props[k] = im;
      bind(im, C.zones[k].name, function () { onZoneClick(k); });
    });
    chosenShows(model).forEach(function (key) {
      if (/^board/.test(key)) return;
      var pos = overlayPos(model, key);
      addImg(root, A.props[key], "static ovl", pos.z, pos.dx, pos.dy);
    });
    C.leaks.forEach(function (l) {
      if (!leakFixed(model, l.machine)) return;
      var c = bcenter(model.layout, l.machine), q = iso(c[0], c[1], 150), bd = mk("div", "maint", esc(l.badge));
      bd.style.left = q.x + "px"; bd.style.top = q.y + "px"; root.appendChild(bd);
    });
    ctx.tapeEl = mk("div", "tape-layer"); root.appendChild(ctx.tapeEl);
    ctx.tapeEl.innerHTML = tapeSVG(model.tape || [], null);
    model.dirt.forEach(function (d) { if (!d.cleaned) { var e = makeDirtEl(d, live); root.appendChild(e); ctx.dirt[d.id] = e; } });
    model.items.forEach(function (it) { var e = makeItemEl(model, it, live); if (e) { root.appendChild(e); ctx.items[it.id] = e; } });
    addImg(root, A.props.lightshafts, "shafts", 9000);
    return ctx;
  }

  /* ============ 6. NHÂN VẬT, TÌM ĐƯỜNG, HÀNH ĐỘNG ============ */
  var G = null, PLAYER = "", SPEED = 4.6;

  function isFree(x, y) {
    if (x < 0 || y < 0 || x >= GW || y >= GH) return false;
    if (BLOCKED[k2(x, y)]) return false;
    if (G.occ[k2(x, y)]) return false;
    for (var i = 0; i < G.model.items.length; i++) {
      var it = G.model.items[i];
      if (it.cfg.blocks && it.loc.t === "floor" && it.loc.tx === x && it.loc.ty === y) return false;
    }
    return true;
  }

  function bfs(sx, sy, goal) {
    if (goal(sx, sy)) return [];
    var q = [[sx, sy]], prev = {}, seen = {}; seen[k2(sx, sy)] = 1;
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length) {
      var c = q.shift();
      for (var i = 0; i < 4; i++) {
        var nx = c[0] + dirs[i][0], ny = c[1] + dirs[i][1], kk = k2(nx, ny);
        if (seen[kk] || !isFree(nx, ny)) continue;
        seen[kk] = 1; prev[kk] = c;
        if (goal(nx, ny)) {
          var path = [[nx, ny]], cur = c;
          while (cur && !(cur[0] === sx && cur[1] === sy)) { path.unshift(cur); cur = prev[k2(cur[0], cur[1])]; }
          return path;
        }
        q.push([nx, ny]);
      }
    }
    return null;
  }

  function reachTiles(tiles) { var p = G.player; return tiles.some(function (t) { return cheb(p.x, p.y, t[0], t[1]) <= 1; }); }

  function goNear(tiles, then) {
    var path = bfs(G.player.x, G.player.y, function (x, y) { return tiles.some(function (t) { return cheb(x, y, t[0], t[1]) <= 1; }); });
    if (!path) { toast("Không có đường đi tới đó, hãy dọn vật cản trước nhé."); Sound.deny(); return; }
    G.player.path = path; G.player.then = then || null;
    if (!path.length) arrive(); else renderPanel();
  }

  function itemTiles(it) {
    var L = it.loc;
    if (L.t === "floor") return [[L.tx, L.ty]];
    if (L.t === "surface") return L.on === "bench" ? [[L.tx, L.ty]] : blockTiles(G.model, L.on);
    if (L.t === "zone") return zoneTiles(G.model, L.zone);
    return [];
  }

  function setFace(dx, dy) {
    var w = G.player.el, back = dx < 0 || dy < 0, mirror = dy > 0 || dx < 0;
    w.classList.toggle("face-back", back); w.classList.toggle("face-front", !back); w.classList.toggle("mirror", mirror);
  }

  function placePlayer() {
    var p = G.player, s = iso(p.fx, p.fy, 0);
    p.el.style.left = (s.x - 30) + "px"; p.el.style.top = (s.y - 78) + "px";
    p.el.style.zIndex = Math.floor((p.fx + p.fy) * 20) + 8;
  }

  function arrive() {
    var p = G.player, fn = p.then; p.then = null;
    p.el.classList.remove("walking");
    refreshNear();
    if (fn) fn();
    renderPanel();
  }

  function loop(ts) {
    if (!G || !G.running) return;
    var dt = Math.min(.05, (ts - (G.lastTs || ts)) / 1000); G.lastTs = ts;
    var p = G.player;
    if (!p.busy && p.path.length) {
      var t = p.path[0], tx = t[0] + .5, ty = t[1] + .5, ddx = tx - p.fx, ddy = ty - p.fy, dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (!p.el.classList.contains("walking")) p.el.classList.add("walking");
      setFace(Math.sign(Math.round(ddx * 10)), Math.sign(Math.round(ddy * 10)));
      var stepLen = SPEED * dt;
      if (dist <= stepLen) {
        p.fx = tx; p.fy = ty; p.x = t[0]; p.y = t[1]; p.path.shift();
        if ((G.steps = (G.steps || 0) + 1) % 2 === 0) Sound.step();
        if (!p.path.length) arrive(); else refreshNear();
      } else { p.fx += ddx / dist * stepLen; p.fy += ddy / dist * stepLen; }
      placePlayer();
    }
    updateCamera(false);
    if (!G.lastTimer || ts - G.lastTimer > 250) { G.lastTimer = ts; $("timer").textContent = fmtTime(elapsed()); updateSbar(); }
    requestAnimationFrame(loop);
  }

  function elapsed() { return G ? ((G.endTime || Date.now()) - G.startTime) / 1000 : 0; }

  function busy(cls, ms, done) {
    var p = G.player; p.busy = true;
    if (cls) { p.el.classList.remove(cls); void p.el.offsetWidth; p.el.classList.add(cls); }
    renderPanel();
    setTimeout(function () { if (cls) p.el.classList.remove(cls); p.busy = false; if (done) done(); refreshNear(); renderPanel(); updateSbar(); }, ms);
  }

  function setHeld(it) {
    var p = G.player, h = p.el.querySelector(".worker-held");
    p.held = it;
    p.el.classList.toggle("carrying", !!it && !it.cfg.vehicle);
    p.el.classList.toggle("driving", !!it && !!it.cfg.vehicle);
    h.innerHTML = it ? '<img src="' + spriteMeta(it.cfg).src + '" alt="">' : "";
  }

  function addItemEl(it, pop) {
    var old = G.scene.items[it.id]; if (old) old.remove();
    var e = makeItemEl(G.model, it, true); if (!e) return;
    G.scene.root.appendChild(e); G.scene.items[it.id] = e;
    if (pop) e.classList.add("pop");
  }

  function pick(it) {
    if (G.player.held) return;
    var el = G.scene.items[it.id];
    if (it.cfg.vehicle) Sound.engine(); else Sound.pick();
    if (el) el.classList.add("lift");
    busy(it.cfg.vehicle ? null : "bend", 420, function () {
      if (el) { el.remove(); delete G.scene.items[it.id]; }
      it.loc = { t: "held" }; it.moved = true;
      setHeld(it);
    });
  }

  function freeSlot(zone) {
    var used = {};
    G.model.items.forEach(function (o) { if (o.loc.t === "zone" && o.loc.zone === zone && typeof o.loc.slot === "number") used[o.loc.slot] = 1; });
    for (var i = 0; i < 60; i++) if (!used[i]) return i;
    return 0;
  }

  function putZone(it, zone) {
    var Z = C.zones[zone];
    if (typeof Z.bin === "number") {
      var bt = binTile(G.model, Z.bin), p = iso(G.player.fx, G.player.fy, 40), target = iso(bt[0] + .5, bt[1] + .5, 44);
      var fl = new Image(); fl.src = spriteMeta(it.cfg).src; fl.className = "fly";
      fl.style.left = (p.x - 14) + "px"; fl.style.top = (p.y - 14) + "px"; fl.style.width = "28px";
      G.scene.root.appendChild(fl);
      requestAnimationFrame(function () { fl.style.transform = "translate(" + (target.x - p.x) + "px," + (target.y - p.y) + "px) scale(.4) rotate(160deg)"; fl.style.opacity = ".2"; });
      setHeld(null);
      it.loc = { t: "bin", zone: zone };
      busy("bend", 450, function () {
        fl.remove(); Sound.trash();
        var bp = G.scene.props[zone];
        if (bp) { bp.classList.remove("wobble"); void bp.offsetWidth; bp.classList.add("wobble"); }
      });
      return;
    }
    var slot = zone === "board" ? (it.cfg.flat && it.cfg.slot ? it.cfg.slot : freeSlot("board")) : freeSlot(zone);
    it.loc = { t: "zone", zone: zone, slot: slot };
    if (zone === "redtag") { it.tagged = true; Sound.tag(); }
    setHeld(null);
    busy("bend", 380, function () { addItemEl(it, true); Sound.place(); });
  }

  function blockerAt(x, y) { return G.model.items.some(function (o) { return o.cfg.blocks && o.loc.t === "floor" && o.loc.tx === x && o.loc.ty === y; }); }
  function dropTile(it) {
    var p = G.player;
    if (!it.cfg.blocks || !blockerAt(p.x, p.y)) return [p.x, p.y];
    var n = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (var i = 0; i < n.length; i++) { var x = p.x + n[i][0], y = p.y + n[i][1]; if (isFree(x, y)) return [x, y]; }
    return null;
  }
  function dropFloor(it) {
    var p = G.player, v = !!it.cfg.vehicle, dt = dropTile(it);
    if (!dt) { toast("Chỗ này chật quá, hãy tới chỗ rộng hơn."); Sound.deny(); return; }
    it.loc = { t: "floor", tx: dt[0], ty: dt[1], x: dt[0] + .5 + (v ? 0 : rnd(-.15, .15)), y: dt[1] + .5 + (v ? 0 : rnd(-.15, .15)), rot: rnd(0, 360), tilt: 0 };
    setHeld(null);
    busy(v ? null : "bend", 380, function () { addItemEl(it, true); Sound.place(); if (G.phase === 2) addMarkers(); });
  }

  function tagHere(it) {
    it.tagged = true; it.moved = true; Sound.tag();
    busy("bend", 380, function () { addItemEl(it, true); });
  }

  function burst(x, y) {
    var b = mk("div", "burst"); b.style.left = x + "px"; b.style.top = y + "px";
    b.appendChild(mk("div", "ring"));
    for (var i = 0; i < 12; i++) {
      var s = mk("div", "spark" + (i % 3 === 0 ? " s2" : "")), a = (i / 12) * Math.PI * 2 + rnd(-.2, .2), r = rnd(22, 46);
      s.style.setProperty("--dx", Math.cos(a) * r + "px"); s.style.setProperty("--dy", (Math.sin(a) * r * .6 - 14) + "px");
      s.style.animationDelay = rnd(0, .15) + "s";
      b.appendChild(s);
    }
    G.scene.root.appendChild(b);
    setTimeout(function () { b.remove(); }, 1300);
  }

  function clean(d) {
    Sound.wipe();
    busy("wiping", 1100, function () {
      d.cleaned = true;
      var e = G.scene.dirt[d.id]; if (e) { e.classList.add("vanish"); setTimeout(function () { e.remove(); }, 700); delete G.scene.dirt[d.id]; }
      var p = iso(d.x, d.y, 4); burst(p.x, p.y); Sound.sparkle();
      if (d.cfg.source && leaksAgain(d.cfg.source)) scheduleReleak(d);
    });
  }

  /* Chỉ lau mà không sửa nguồn rò → máy lại chảy dầu ra sàn */
  function scheduleReleak(d) {
    var game = G;
    setTimeout(function () {
      if (G !== game || !G.running || !d.cleaned || leakFixed(G.model, d.cfg.source)) return;
      var q = leakTile(G.model, d.cfg.source);
      if (!isFree(q[0], q[1]) || (G.player.x === q[0] && G.player.y === q[1])) { scheduleReleak(d); return; }
      d.cleaned = false; d.tx = q[0]; d.ty = q[1]; d.x = q[0] + .45; d.y = q[1] + .5; d.rot = rnd(0, 360);
      var e = makeDirtEl(d, true); G.scene.root.appendChild(e); G.scene.dirt[d.id] = e; e.classList.add("pop");
      toast("💧 " + LY.names[d.cfg.source] + " lại chảy dầu ra sàn!"); Sound.deny(); refreshNear(); updateSbar();
    }, C.releakSec * 1000);
  }

  /* Báo cáo sự cố rò dầu + phiếu yêu cầu bảo trì */
  function openReport(l) {
    var r = G.model.reports[l.machine] || { src: null, act: null }, draft = { src: r.src, act: r.act };
    function grp(key, title, opts) {
      return '<p class="pq-t">' + title + '</p><div class="opts" data-g="' + key + '">' + opts.map(function (o, i) {
        return '<button class="opt' + (draft[key] === i ? " sel" : "") + '" data-i="' + i + '"><span class="radio"></span><span>' + esc(o.label) + '</span></button>';
      }).join("") + '</div>';
    }
    modal('<h3>📋 ' + esc(l.name) + '</h3><p>Phiếu báo cáo bất thường: Xưởng Cơ khí Chú Tài</p>' +
      grp("src", "1. Nguồn gây bẩn (nguyên nhân dầu chảy ra sàn) là gì?", l.src) +
      grp("act", "2. Hành động xử lý:", l.act) +
      '<div class="modal-btns"><button class="btn btn-ghost" data-close>Để sau</button><button class="btn btn-primary" id="rpSend" disabled>Gửi báo cáo</button></div>');
    $("modalCard").querySelectorAll(".opts").forEach(function (g) {
      g.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          draft[g.getAttribute("data-g")] = +b.getAttribute("data-i"); Sound.click();
          g.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); });
          $("rpSend").disabled = draft.src == null || draft.act == null;
        });
      });
    });
    $("rpSend").disabled = draft.src == null || draft.act == null;
    $("rpSend").onclick = function () {
      closeModal(); G.model.reports[l.machine] = draft; Sound.tag();
      busy("bend", 500, function () { rebuildLive(); toast("Đã gửi phiếu: " + l.name.toLowerCase() + "."); });
    };
  }

  /* --- Bấm vào đồ vật: nhân vật tự chạy tới --- */
  function canAct() { return G && G.running && !G.player.busy && !G.tapeMode; }
  function onItemClick(it, e) {
    if (!canAct()) return;
    Sound.init();
    G.focus = { type: "item", id: it.id };
    if (e && e.pointerType && e.pointerType !== "mouse") showTipAt(it.cfg.name, e.clientX, e.clientY, 1200);
    goNear(itemTiles(it)); refreshNear(); renderPanel();
  }
  function onDirtClick(d) {
    if (!canAct()) return;
    Sound.init(); G.focus = { type: "dirt", id: d.id };
    goNear([[d.tx, d.ty]]); refreshNear(); renderPanel();
  }
  function onZoneClick(z) {
    if (!canAct()) return;
    Sound.init(); G.focus = { type: "zone", id: z };
    goNear(zoneTiles(G.model, z)); renderPanel();
  }
  function onTilesClick(tiles) {
    if (!canAct()) return;
    Sound.init(); G.focus = null;
    goNear(tiles); renderPanel();
  }

  /* ============ 7. SƠ ĐỒ MẶT BẰNG, KÉO THẢ KHỐI, SPAGHETTI ============ */
  function bcenter(l, b) { var f = bfoot(b); return [l[b][0] + f[0] / 2, l[b][1] + f[1] / 2]; }
  function flowTiles(l) {
    var cur = LY.entry, d = 0;
    LY.flow.forEach(function (st) { var c = bcenter(l, st); d += Math.abs(c[0] - cur[0]) + Math.abs(c[1] - cur[1]); cur = c; });
    return d + Math.abs(LY.exit[0] - cur[0]) + Math.abs(LY.exit[1] - cur[1]);
  }
  var FLOW_BEST = flowTiles(LY.ideal);
  var FLOW_WORST = (function () {
    var w = 0;
    (function perm(a, k) {
      if (k === a.length) { var l = {}; a.forEach(function (st, i) { l[st] = [0, LY.slotsY[i]]; }); w = Math.max(w, flowTiles(l)); return; }
      for (var i = k; i < a.length; i++) { var b = a.slice(), t = b[k]; b[k] = b[i]; b[i] = t; perm(b, k + 1); }
    })(LY.flow.slice(), 0);
    return w;
  })();
  function meters(t) { return Math.round(t * LY.meterPerTile); }
  function blocksOnAisle(model) {
    var et = C.extinguisherTile;
    return BLOCKS.filter(function (b) { return blockTiles(model, b).some(function (t) { return AISLE[k2(t[0], t[1])] || (t[0] === et[0] && t[1] === et[1]); }); });
  }

  /* Ô bị chiếm bởi đồ vật/vết bẩn/nhân vật, không cho đặt khối đè lên */
  function floorObstacles() {
    var o = {};
    G.model.items.forEach(function (i) { if (i.loc.t === "floor") o[k2(i.loc.tx, i.loc.ty)] = i.cfg.name; });
    G.model.dirt.forEach(function (d) { if (!d.cleaned) o[k2(d.tx, d.ty)] = d.cfg.name; });
    o[k2(G.player.x, G.player.y)] = "Nhân vật";
    G.player.path.forEach(function () { });
    return o;
  }
  /* Thả đúng lên một khối cùng kích thước → đổi chỗ hai khối */
  function swapTarget(draft, b, x, y) {
    var f = bfoot(b);
    for (var i = 0; i < BLOCKS.length; i++) {
      var o = BLOCKS[i], ff = bfoot(o);
      if (o !== b && draft[o][0] === x && draft[o][1] === y && ff[0] === f[0] && ff[1] === f[1]) return o;
    }
    return null;
  }
  function placeValid(draft, b, x, y, obst) {
    var f = bfoot(b);
    if (x < 0 || y < 0 || x + f[0] > GW || y + f[1] > GH) return "Ra ngoài xưởng";
    var occ = {};
    BLOCKS.forEach(function (o) { if (o === b) return; var p = draft[o], ff = bfoot(o); for (var xx = p[0]; xx < p[0] + ff[0]; xx++) for (var yy = p[1]; yy < p[1] + ff[1]; yy++) occ[k2(xx, yy)] = LY.names[o]; });
    for (var xx = x; xx < x + f[0]; xx++) for (var yy = y; yy < y + f[1]; yy++) {
      var kk = k2(xx, yy);
      if (BLOCKED[kk]) return "Vướng bàn nguội / bình chữa cháy";
      if (occ[kk]) return "Đè lên " + occ[kk];
      if (obst[kk]) return "Còn " + obst[kk].toLowerCase() + " ở đó, dọn trước";
    }
    return "";
  }

  var PS = 20; // px mỗi ô trên sơ đồ
  function planSVG(draft, drag) {
    var W = GW * PS, H = GH * PS, o = '';
    function R(x0, y0, x1, y1, fill, txt, cls) {
      return '<rect' + (cls ? ' class="' + cls + '"' : '') + ' x="' + x0 * PS + '" y="' + y0 * PS + '" width="' + (x1 - x0) * PS + '" height="' + (y1 - y0) * PS + '" rx="3" fill="' + fill + '"/>' +
        (txt ? '<text x="' + (x0 + x1) / 2 * PS + '" y="' + ((y0 + y1) / 2 * PS + 3) + '" class="pl-s">' + txt + '</text>' : '');
    }
    o += '<svg class="plan-svg" id="planSvg" viewBox="-10 -30 ' + (W + 20) + ' ' + (H + 92) + '" role="img" aria-label="Sơ đồ mặt bằng">';
    o += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="6" fill="#EEE9E1" stroke="#9A9183" stroke-width="2"/>';
    for (var gx = 1; gx < GW; gx++) o += '<line x1="' + gx * PS + '" y1="0" x2="' + gx * PS + '" y2="' + H + '" stroke="#DDD5C8" stroke-width=".6"/>';
    for (var gy = 1; gy < GH; gy++) o += '<line x1="0" y1="' + gy * PS + '" x2="' + W + '" y2="' + gy * PS + '" stroke="#DDD5C8" stroke-width=".6"/>';
    C.aisle.rects.forEach(function (r) { o += R(r.x0, r.y0, r.x1 + 1, r.y1 + 1, "rgba(245,192,46,.32)"); });
    o += R(6, 0.05, 9, 0.95, "#D9A86C", "Bàn nguội") + R(10, 0.05, 11, 0.95, "#D9412F") + R(10, 1, 11, 2, "rgba(217,65,47,.25)");
    var obst = floorObstacles();
    Object.keys(obst).forEach(function (kk) { var p = kk.split(",").map(Number); o += '<circle cx="' + (p[0] + .5) * PS + '" cy="' + (p[1] + .5) * PS + '" r="3" fill="' + (obst[kk] === "Nhân vật" ? "#F76011" : "#8A7F72") + '"/>'; });
    o += '<g class="pl-door"><rect x="' + 3 * PS + '" y="-24" width="' + 2 * PS + '" height="18" rx="4" fill="#F76011"/><text x="' + 4 * PS + '" y="-11">NHẬP</text></g>';
    o += '<g class="pl-door"><rect x="' + 2.4 * PS + '" y="' + (H + 6) + '" width="' + 3.2 * PS + '" height="44" rx="5" fill="#B8462E"/><text x="' + 4 * PS + '" y="' + (H + 24) + '">XUẤT</text><text x="' + 4 * PS + '" y="' + (H + 40) + '" style="font-size:8px">xe container</text></g>';
    // đường vận chuyển (spaghetti): đi theo trục, mỗi chặng một làn
    var cur = [LY.entry[0], -0.3], pts = [[cur[0] * PS, cur[1] * PS]], n = LY.flow.length;
    LY.flow.concat(["__exit"]).forEach(function (st, k) {
      var c = st === "__exit" ? [LY.exit[0], GH + .3] : bcenter(draft, st), off = (k - n / 2) * 4;
      pts.push([cur[0] * PS + off, cur[1] * PS]); pts.push([cur[0] * PS + off, c[1] * PS]); pts.push([c[0] * PS, c[1] * PS]);
      cur = c;
    });
    o += '<polyline points="' + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="none" stroke="#E0552A" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="7 5" class="pl-flow"/>';
    BLOCKS.forEach(function (b) {
      var p = draft[b], f = bfoot(b), isDrag = drag && drag.b === b, x = isDrag ? drag.x : p[0], y = isDrag ? drag.y : p[1];
      var name = LY.names[b], words = name.split(" "), l1 = words.slice(0, 2).join(" "), l2 = words.slice(2).join(" ");
      var cx = (x + f[0] / 2) * PS, small = f[0] < 2;
      o += '<g class="pl-slot' + (isDrag ? (drag.err ? ' bad' : ' sel') : drag && drag.swap === b ? ' swap' : '') + '" data-b="' + b + '"><rect x="' + (x * PS + 2) + '" y="' + (y * PS + 2) + '" width="' + (f[0] * PS - 4) + '" height="' + (f[1] * PS - 4) + '" rx="6"/>' +
        '<text x="' + cx + '" y="' + (y * PS + (small ? 1.1 : 1.2) * PS) + '" class="pl-ic">' + LY.icons[b] + '</text>' +
        (small ? '' : '<text x="' + cx + '" y="' + (y * PS + 1.95 * PS) + '" class="pl-n">' + esc(l1) + '</text>' + (l2 ? '<text x="' + cx + '" y="' + (y * PS + 2.45 * PS) + '" class="pl-n">' + esc(l2) + '</text>' : '')) + '</g>';
    });
    return o + '</svg>';
  }

  function openLayout() {
    if (!G || !G.running || G.player.busy || G.tapeMode) return;
    if (G.player.held && G.player.held.cfg.vehicle) { toast("Hãy đỗ xe trước khi sắp xếp mặt bằng."); return; }
    Sound.click();
    var draft = copyLayout(G.model.layout), drag = null, obst = floorObstacles();
    function changed() { return BLOCKS.some(function (b) { return draft[b][0] !== G.model.layout[b][0] || draft[b][1] !== G.model.layout[b][1]; }); }
    function draw() {
      var d = flowTiles(draft), onA = blocksOnAisle({ layout: draft });
      $("planHost").innerHTML = planSVG(draft, drag);
      $("planInfo").innerHTML = '<div class="flow-num"><small>Quãng đường vận chuyển / lô hàng</small><b>' + meters(d) + ' m</b></div>' +
        (drag && drag.swap ? '<p class="warn ok">⇄ Thả để đổi chỗ với ' + esc(LY.names[drag.swap]) + '</p>' : drag && drag.err ? '<p class="warn">⛔ ' + esc(drag.err) + '</p>' : onA.length ? '<p class="warn">⚠️ Đang lấn lối đi / khu PCCC: ' + onA.map(function (b) { return LY.names[b]; }).join(", ") + '</p>' : '') +
        '<p class="small-note">Trình tự công nghệ:</p><ol class="flow-steps">' + LY.flow.map(function (st) { return '<li>' + LY.icons[st] + ' ' + esc(LY.names[st]) + '</li>'; }).join("") + '</ol>';
      $("lyApply").disabled = !changed();
      bindDrag();
    }
    function svgPoint(e) {
      var svg = $("planSvg"), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse()); return [q.x / PS, q.y / PS];
    }
    function bindDrag() {
      $("planHost").querySelectorAll(".pl-slot").forEach(function (g) {
        g.addEventListener("pointerdown", function (e) {
          e.preventDefault();
          var b = g.getAttribute("data-b"), q = svgPoint(e);
          drag = { b: b, ox: q[0] - draft[b][0], oy: q[1] - draft[b][1], x: draft[b][0], y: draft[b][1], err: "" };
          try { $("planHost").setPointerCapture(e.pointerId); } catch (er) { }
          Sound.click(); draw();
        });
      });
    }
    function onMove(e) {
      if (!drag) return;
      var q = svgPoint(e), x = Math.round(q[0] - drag.ox), y = Math.round(q[1] - drag.oy);
      if (x === drag.x && y === drag.y) return;
      drag.x = x; drag.y = y; drag.swap = swapTarget(draft, drag.b, x, y);
      drag.err = drag.swap ? "" : placeValid(draft, drag.b, x, y, obst); draw();
    }
    function onUp() {
      if (!drag) return;
      if (drag.swap) { draft[drag.swap] = draft[drag.b].slice(); draft[drag.b] = [drag.x, drag.y]; Sound.place(); }
      else if (!drag.err && (drag.x !== draft[drag.b][0] || drag.y !== draft[drag.b][1])) { draft[drag.b] = [drag.x, drag.y]; Sound.place(); }
      else if (drag.err) Sound.deny();
      drag = null; draw();
    }
    modal('<h3>📐 Sơ đồ mặt bằng</h3><p>Kéo thả máy móc, kệ, khu vực, cụm thùng rác tới vị trí mới (tự canh theo lưới); thả đè lên khối cùng cỡ để đổi chỗ. Vật liệu vào ở <b>CỬA NHẬP</b>, hàng ra <b>CỔNG XUẤT</b> có xe container. Đường đứt nét là quãng đường một lô hàng đi qua các công đoạn.</p>' +
      '<div class="plan-wrap"><div id="planHost" class="plan-host"></div><div class="plan-side" id="planInfo"></div></div>' +
      '<div class="modal-btns"><button class="btn btn-ghost" id="lyReset">Hoàn tác</button><button class="btn btn-ghost" data-close>Đóng</button><button class="btn btn-primary" id="lyApply" disabled>Áp dụng bố trí mới</button></div>');
    $("modalCard").classList.add("wide");
    var host = $("planHost");
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("mouseup", onUp);
    $("lyReset").onclick = function () { draft = copyLayout(G.model.layout); drag = null; Sound.click(); draw(); };
    $("lyApply").onclick = function () { closeModal(); applyLayout(draft); };
    draw();
  }

  function rebuildLive() {
    var root = G.scene.root;
    G.occ = blockOccupancy(G.model);
    G.scene = buildScene(root, G.model, true);
    root.appendChild(G.player.el); placePlayer();
    if (G.phase === 2) addMarkers();
    refreshNear();
  }

  function applyLayout(l) {
    var moved = BLOCKS.filter(function (b) { return l[b][0] !== G.model.layout[b][0] || l[b][1] !== G.model.layout[b][1]; });
    G.model.layout = copyLayout(l);
    Sound.move();
    G.scene.root.classList.add("relayout");
    busy("bend", 600, function () {
      rebuildLive();
      requestAnimationFrame(function () { G.scene.root.classList.remove("relayout"); });
      moved.forEach(function (b) { var c = bcenter(G.model.layout, b), q = iso(c[0], c[1], 40); burst(q.x, q.y); });
      Sound.sparkle(); toast("Đã sắp xếp lại mặt bằng xưởng.");
    });
  }

  /* ============ 8. BĂNG KEO ĐỊNH VỊ (người chơi tự kéo trên nền) ============ */
  var TAPE_BY = {}; C.tapeColors.forEach(function (c) { TAPE_BY[c.id] = c; });

  /* Cạnh lưới: "h x,y" = đoạn (x,y)→(x+1,y);  "v x,y" = đoạn (x,y)→(x,y+1) */
  function edgeSeg(k) { var p = k.slice(1).split(",").map(Number); return k[0] === "h" ? { x0: p[0], y0: p[1], x1: p[0] + 1, y1: p[1] } : { x0: p[0], y0: p[1], x1: p[0], y1: p[1] + 1 }; }
  function tapeEdges(tape) {
    var m = {};
    tape.forEach(function (sg) {
      var x0 = Math.min(sg.x0, sg.x1), x1 = Math.max(sg.x0, sg.x1), y0 = Math.min(sg.y0, sg.y1), y1 = Math.max(sg.y0, sg.y1), k;
      if (y0 === y1) for (var x = x0; x < x1; x++) { k = "h" + x + "," + y0; (m[k] = m[k] || {})[sg.c] = 1; }
      else for (var y = y0; y < y1; y++) { k = "v" + x0 + "," + y; (m[k] = m[k] || {})[sg.c] = 1; }
    });
    return m;
  }
  function rectEdges(x0, y0, x1, y1) {
    var e = [], x, y;
    for (x = x0; x < x1; x++) { if (y0 > 0) e.push("h" + x + "," + y0); if (y1 < GH) e.push("h" + x + "," + y1); }
    for (y = y0; y < y1; y++) { if (x0 > 0) e.push("v" + x0 + "," + y); if (x1 < GW) e.push("v" + x1 + "," + y); }
    return e;   // bỏ các cạnh nằm sát tường
  }
  function blockRect(model, b) { var p = bpos(model, b), f = bfoot(b); return rectEdges(p[0], p[1], p[0] + f[0], p[1] + f[1]); }
  function expectedEdges(model, t) {
    var tg = t.target, e = [], x, y;
    if (tg === "aisle") {
      C.aisle.rects.forEach(function (r) {
        for (y = r.y0; y <= r.y1; y++) { e.push("v" + r.x0 + "," + y); e.push("v" + (r.x1 + 1) + "," + y); }
        for (x = r.x0; x <= r.x1; x++) { e.push("h" + x + "," + r.y0); e.push("h" + x + "," + (r.y1 + 1)); }
      });
      // bỏ cạnh nằm trong lòng lối đi (chỗ giao nhau) và cạnh sát tường / mép xưởng
      return e.filter(function (k, i) {
        if (e.indexOf(k) !== i) return false;
        var s = edgeSeg(k);
        if (s.y0 === 0 && s.y1 === 0 || s.y0 === GH && s.y1 === GH || s.x0 === GW && s.x1 === GW) return false;
        var a, b2;
        if (k[0] === "h") { a = k2(s.x0, s.y0 - 1); b2 = k2(s.x0, s.y0); } else { a = k2(s.x0 - 1, s.y0); b2 = k2(s.x0, s.y0); }
        return !(AISLE[a] && AISLE[b2]);
      });
    }
    if (tg.indexOf("block:") === 0) return blockRect(model, tg.slice(6));
    if (tg.indexOf("blocks:") === 0) return tg.slice(7).split(",").reduce(function (a, b) { return a.concat(blockRect(model, b)); }, []);
    if (tg === "vehicles") {
      var set = {}, tiles = model.items.filter(function (i) { return i.cfg.vehicle && i.loc.t === "floor"; }).map(function (i) { return [i.loc.tx, i.loc.ty]; });
      tiles.forEach(function (q) { set[k2(q[0], q[1])] = 1; });
      tiles.forEach(function (q) {
        x = q[0]; y = q[1];
        if (!set[k2(x, y - 1)]) e.push("h" + x + "," + y);
        if (!set[k2(x, y + 1)]) e.push("h" + x + "," + (y + 1));
        if (!set[k2(x - 1, y)]) e.push("v" + x + "," + y);
        if (!set[k2(x + 1, y)]) e.push("v" + (x + 1) + "," + y);
      });
    }
    return e;
  }
  function tapeScore(model, t) {
    var exp = expectedEdges(model, t), m = tapeEdges(model.tape || []), ok = 0, any = 0, used = {};
    exp.forEach(function (k) {
      var c = m[k]; if (!c) return; any++;
      Object.keys(c).forEach(function (cc) { used[cc] = 1; });
      if (t.colors.some(function (col) { return c[col]; })) ok++;
    });
    return { cov: exp.length ? ok / exp.length : 0, any: exp.length ? any / exp.length : 0, used: Object.keys(used) };
  }
  function tapeStatus(model, t) { var sc = tapeScore(model, t); return sc.cov >= .6 ? "ok" : (sc.cov >= .3 || sc.any >= .6) ? "half" : "bad"; }

  function segSVG(sg, preview) {
    var a = iso(sg.x0, sg.y0, 0), b = iso(sg.x1, sg.y1, 0);
    function ln(col, w, extra) { return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + col + '" stroke-width="' + w + '"' + (extra || "") + '/>'; }
    var o = ln("rgba(20,28,36,.3)", 7.5);
    switch (sg.c) {
      case "hazard": o += ln("#F5C02E", 5.5) + ln("#2B2B2B", 5.5, ' stroke-dasharray="6 6"'); break;
      case "redwhite": o += ln("#FFFFFF", 5.5) + ln("#D9412F", 5.5, ' stroke-dasharray="6 6"'); break;
      default: o += ln(TAPE_BY[sg.c] ? TAPE_BY[sg.c].css : "#F5C02E", 5.5);
    }
    o += ln("rgba(255,255,255,.35)", 1.2);
    if (preview) o = '<g opacity=".75">' + o + '<circle cx="' + a.x + '" cy="' + a.y + '" r="4" fill="#fff" stroke="#F76011" stroke-width="2"/><circle cx="' + b.x + '" cy="' + b.y + '" r="4" fill="#fff" stroke="#F76011" stroke-width="2"/></g>';
    return o;
  }
  function tapeSVG(tape, preview) {
    var o = '<svg width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '" stroke-linecap="butt">';
    tape.forEach(function (sg) { o += segSVG(sg); });
    if (preview) o += segSVG(preview, true);
    return o + '</svg>';
  }
  function drawTapes() { if (G && G.scene.tapeEl) G.scene.tapeEl.innerHTML = tapeSVG(G.model.tape, G.drag && G.drag.len ? G.drag.seg : null); }

  function vertexAt(e) {
    var r = G.scene.root.getBoundingClientRect(), sx = (e.clientX - r.left) / G.scale, sy = (e.clientY - r.top) / G.scale;
    var a = (sx - OX) / 32, b = (sy - OY) / 16;
    return [clamp(Math.round((a + b) / 2), 0, GW), clamp(Math.round((b - a) / 2), 0, GH)];
  }

  function buildTapebar() {
    $("tbColors").innerHTML = C.tapeColors.map(function (c) {
      return '<button class="tb-c" data-c="' + c.id + '" title="' + c.name + '"><span class="sw" style="background:' + c.css + '"></span><span>' + c.name + '</span></button>';
    }).join("");
    $("tbColors").querySelectorAll(".tb-c").forEach(function (b) {
      b.addEventListener("click", function () { G.tapeColor = b.getAttribute("data-c"); Sound.click(); markTapeColor(); });
    });
  }
  function markTapeColor() { $("tbColors").querySelectorAll(".tb-c").forEach(function (b) { b.classList.toggle("sel", b.getAttribute("data-c") === G.tapeColor); }); }

  function enterTape(t) {
    if (!G || !G.running || G.player.busy) return;
    if (G.player.held && G.player.held.cfg.vehicle) { toast("Hãy đỗ xe trước khi dán băng keo."); return; }
    G.tapeMode = true; G.prevZoom = G.zoomAll; G.zoomAll = true; G.player.path = [];
    $("scr-game").classList.add("taping");
    $("tbTitle").textContent = t ? t.icon + " Dán băng keo: " + t.name : "🩹 Dán băng keo định vị";
    markTapeColor(); layout(); Sound.click(); hideTip();
    if (!G.tapeColor) toast("Chọn màu băng keo, rồi kéo trên nền xưởng.");
  }
  function exitTape() {
    G.tapeMode = false; G.zoomAll = G.prevZoom; G.drag = null;
    $("scr-game").classList.remove("taping");
    drawTapes(); layout(); addMarkers(); renderPanel(); updateSbar();
  }

  function initTapeInput() {
    var vp = $("viewport");
    vp.addEventListener("pointerdown", function (e) {
      if (!G || !G.tapeMode) return;
      e.preventDefault();
      if (!G.tapeColor) { toast("Chọn màu băng keo trước đã."); Sound.deny(); return; }
      var v = vertexAt(e);
      G.drag = { a: v, seg: { x0: v[0], y0: v[1], x1: v[0], y1: v[1], c: G.tapeColor }, len: 0 };
      try { vp.setPointerCapture(e.pointerId); } catch (er) { }
      drawTapes();
    });
    vp.addEventListener("pointermove", function (e) {
      if (!G || !G.tapeMode || !G.drag) return;
      var v = vertexAt(e), a = G.drag.a, dx = v[0] - a[0], dy = v[1] - a[1];
      var b = Math.abs(dx) >= Math.abs(dy) ? [v[0], a[1]] : [a[0], v[1]];     // luôn canh thẳng theo trục dọc / ngang
      G.drag.seg.x1 = b[0]; G.drag.seg.y1 = b[1]; G.drag.len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
      drawTapes();
    });
    function up() {
      if (!G || !G.tapeMode || !G.drag) return;
      if (G.drag.len > 0) { G.model.tape.push(G.drag.seg); Sound.tape(); }
      G.drag = null; drawTapes(); updateSbar();
    }
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
    $("tbUndo").addEventListener("click", function () { if (!G.model.tape.length) return; G.model.tape.pop(); Sound.click(); drawTapes(); updateSbar(); });
    $("tbClear").addEventListener("click", function () { if (!G.model.tape.length) return; G.model.tape = []; Sound.trash(); drawTapes(); updateSbar(); });
    $("tbDone").addEventListener("click", function () { Sound.click(); exitTape(); });
    $("btnTape").addEventListener("click", function () { if (G && G.tapeMode) exitTape(); else enterTape(null); });
  }

  function tapeTouched(t) { var m = tapeEdges(G.model.tape); return expectedEdges(G.model, t).some(function (k) { return m[k]; }); }

  /* ============ 9. HẠNG MỤC S4 DẠNG LỰA CHỌN & DẤU "?" ============ */
  function taskTiles(t) { return t.tiles || (t.zone ? zoneTiles(G.model, t.zone) : blockTiles(G.model, t.station)); }
  function tapeMarkerPos(t) {
    if (t.marker) return { x: t.marker[0] + .5, y: t.marker[1] + .5, z: 40 };
    var tg = t.target, c;
    if (tg.indexOf("block:") === 0) { c = bcenter(G.model.layout, tg.slice(6)); return { x: c[0], y: c[1], z: 70 }; }
    if (tg.indexOf("blocks:") === 0) { c = bcenter(G.model.layout, tg.slice(7).split(",")[0]); return { x: c[0], y: c[1], z: 150 }; }
    var v = G.model.items.filter(function (i) { return i.cfg.vehicle && i.loc.t === "floor"; });
    if (!v.length) return { x: 8.5, y: 4.5, z: 60 };
    return { x: v.reduce(function (a, i) { return a + i.loc.x; }, 0) / v.length, y: v.reduce(function (a, i) { return a + i.loc.y; }, 0) / v.length, z: 70 };
  }

  function addMarkers() {
    Object.keys(G.scene.markers || {}).forEach(function (k) { G.scene.markers[k].remove(); });
    G.scene.markers = {};
    C.tape.forEach(function (t) {
      var pos = tapeMarkerPos(t), done = tapeTouched(t), p = iso(pos.x, pos.y, pos.z), m = mk("button", "marker tape" + (done ? " done" : ""));
      m.innerHTML = '<span class="mk-b">' + (done ? "✓" : "?") + '</span><span class="mk-l">🩹 ' + esc(t.name) + '</span>';
      m.style.left = p.x + "px"; m.style.top = p.y + "px";
      m.addEventListener("click", function (e) { e.stopPropagation(); enterTape(t); });
      G.scene.root.appendChild(m); G.scene.markers["t-" + t.id] = m;
    });
    C.s4.forEach(function (t) {
      var tiles = taskTiles(t), cx = 0, cy = 0;
      tiles.forEach(function (q) { cx += q[0] + .5; cy += q[1] + .5; }); cx /= tiles.length; cy /= tiles.length;
      var z = t.station ? 130 : t.zone === "binRecycle" ? 64 : t.zone === "redtag" ? 70 : 44;
      if (t.id === "board") { cx = 7.5; cy = 0.2; z = 160; }
      var done = G.model.s4[t.id] != null, p = iso(cx, cy, z), m = mk("button", "marker" + (done ? " done" : ""));
      m.innerHTML = '<span class="mk-b">' + (done ? "✓" : "?") + '</span><span class="mk-l">' + esc(t.name) + '</span>';
      m.style.left = p.x + "px"; m.style.top = p.y + "px";
      m.setAttribute("aria-label", t.name);
      m.addEventListener("click", function (e) { e.stopPropagation(); onTaskClick(t); });
      G.scene.root.appendChild(m); G.scene.markers[t.id] = m;
    });
  }

  function onTaskClick(t) {
    if (!canAct()) return;
    Sound.init(); G.focus = { type: "task", id: t.id };
    goNear(taskTiles(t), function () { openTask(t); });
  }

  function openTask(t) {
    var cur = G.model.s4[t.id];
    modal('<h3>' + t.icon + ' ' + esc(t.name) + '</h3><p>' + esc(t.q) + '</p><div class="opts">' +
      t.options.map(function (o, i) {
        var sw = o.sw ? '<span class="sw" style="background:' + o.sw + '"></span>' : '<span class="sw none">-</span>';
        return '<button class="opt' + (cur === i ? " sel" : "") + '" data-i="' + i + '">' + sw + '<span>' + esc(o.label) + '</span></button>';
      }).join("") + '</div><div class="modal-btns"><button class="btn btn-ghost" data-close>Để sau</button></div>');
    $("modalCard").querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () { closeModal(); applyTask(t, +b.getAttribute("data-i")); });
    });
  }

  function applyTask(t, i) {
    Sound.wipe();
    busy("wiping", 1000, function () {
      G.model.s4[t.id] = i;
      rebuildLive();
      var tiles = taskTiles(t), q = tiles[Math.floor(tiles.length / 2)], c = iso(q[0] + .5, q[1] + .5, 10);
      burst(c.x, c.y); Sound.sparkle();
    });
  }

  /* ============ 10. HUD, BẢNG HÀNH ĐỘNG, CAMERA ============ */
  var S_ICONS = {
    s1: '<svg viewBox="0 0 24 24"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" fill="currentColor"/></svg>',
    s2: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity=".55"/></svg>',
    s3: '<svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" fill="currentColor"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" fill="currentColor"/></svg>',
    s4: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="18" rx="3" fill="currentColor"/><rect x="8" y="2" width="8" height="5" rx="1.5" fill="currentColor" stroke="#fff" stroke-width="1.5"/><path d="M8 14l3 3 5-6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    s5: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" fill="currentColor"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var S_META = [
    { k: "s1", name: "Sàng lọc", c: "#E0552A", ph: 1 }, { k: "s2", name: "Sắp xếp", c: "#2F78C4", ph: 1 }, { k: "s3", name: "Sạch sẽ", c: "#1FA3B8", ph: 1 },
    { k: "s4", name: "Săn sóc", c: "#2E9A57", ph: 2 }, { k: "s5", name: "Sẵn sàng", c: "#8A4FD8", ph: 3 }
  ];
  var PHASE_NAME = { 1: "Giai đoạn 1/3 · Dọn xưởng", 2: "Giai đoạn 2/3 · Tiêu chuẩn hoá", 3: "Giai đoạn 3/3 · Duy trì" };

  function buildSbar() {
    $("sbar").innerHTML = S_META.map(function (s) {
      return '<div class="sicon" id="si-' + s.k + '" style="--c:' + s.c + ';--p:0" title="' + s.name + '"><div class="ring5"><i>' + S_ICONS[s.k] + '</i></div><small>' + s.name + '</small></div>';
    }).join("");
  }

  /* Tiến độ trung lập, cho biết đã làm bao nhiêu, KHÔNG cho biết đúng/sai */
  function updateSbar() {
    if (!G) return;
    var its = G.model.items, n = its.length;
    var vals = {
      s1: its.filter(function (i) { return i.moved; }).length / n,
      s2: its.filter(function (i) { return i.loc.t === "zone" || i.loc.t === "bin" || (i.cfg.vehicle && i.moved); }).length / n,
      s3: G.model.dirt.filter(function (d) { return d.cleaned; }).length / G.model.dirt.length,
      s4: (C.s4.filter(function (t) { return G.model.s4[t.id] != null; }).length + C.tape.filter(tapeTouched).length) / (C.s4.length + C.tape.length),
      s5: C.s5.filter(function (q) { return G.model.s5[q.id] != null; }).length / C.s5.length
    };
    S_META.forEach(function (s) {
      var e = $("si-" + s.k); if (!e) return;
      e.style.setProperty("--p", Math.round(vals[s.k] * 100));
      e.classList.toggle("locked", s.ph > G.phase); e.classList.toggle("active", s.ph === G.phase);
    });
    $("phasePill").textContent = PHASE_NAME[G.phase];
  }

  function refreshNear() {
    if (!G) return;
    var held = G.player.held;
    G.model.items.forEach(function (it) {
      var e = G.scene.items[it.id]; if (!e) return;
      var near = !held && reachTiles(itemTiles(it));
      e.classList.toggle("near", near);
      e.classList.toggle("focus", near && G.focus && G.focus.type === "item" && G.focus.id === it.id);
    });
    G.model.dirt.forEach(function (d) { var e = G.scene.dirt[d.id]; if (e) e.classList.toggle("near", !held && reachTiles([[d.tx, d.ty]])); });
    var zp = { board: "board", shelf: "shelf", finished: "finished", redtag: "redtag", binMetal: "binMetal", binRecycle: "binRecycle", binGeneral: "binGeneral", binOily: "binOily" };
    Object.keys(zp).forEach(function (z) {
      var im = G.scene.props[zp[z]]; if (im) im.classList.toggle("near", !!held && !held.cfg.vehicle && reachTiles(zoneTiles(G.model, z)));
    });
  }

  function actionsList() {
    var p = G.player, acts = [];
    if (p.held && p.held.cfg.vehicle) return [{ label: "Đỗ " + p.held.cfg.name.toLowerCase() + " tại đây", icon: "🅿️", cls: "primary", fn: function () { dropFloor(p.held); } }];
    if (p.held) {
      Object.keys(C.zones).forEach(function (z) {
        var Z = C.zones[z];
        if (reachTiles(zoneTiles(G.model, z))) acts.push({ label: Z.put, icon: Z.icon, cls: typeof Z.bin === "number" ? "bin" : (z === "redtag" ? "red" : "primary"), z: z, fn: function () { putZone(p.held, z); } });
      });
      if (G.focus && G.focus.type === "zone") acts.sort(function (a, b) { return (b.z === G.focus.id) - (a.z === G.focus.id); });
      acts.push({ label: "Đặt xuống sàn tại đây", icon: "⬇️", cls: "", fn: function () { dropFloor(p.held); } });
      return acts;
    }
    var near = G.model.items.filter(function (it) { return it.loc.t !== "bin" && it.loc.t !== "held" && reachTiles(itemTiles(it)); });
    var f = G.focus && G.focus.type === "item" ? G.focus.id : null;
    near.sort(function (a, b) { return (b.id === f) - (a.id === f); });
    near.forEach(function (it) {
      if (it.cfg.vehicle) { acts.push({ label: "Lái đi: " + it.cfg.name, icon: "🚜", cls: "primary", fn: function () { pick(it); } }); return; }
      var inZone = it.loc.t === "zone";
      acts.push({ label: (inZone ? "Lấy lại: " : "Nhặt: ") + it.cfg.name, icon: "✋", cls: "primary", fn: function () { pick(it); },
        sub: (!it.tagged && !inZone) ? { icon: "🏷️", title: "Dán thẻ đỏ tại chỗ: " + it.cfg.name, fn: function () { tagHere(it); } } : null });
    });
    var fd = G.focus && G.focus.type === "dirt" ? G.focus.id : null;
    G.model.dirt.forEach(function (d) {
      if (d.cleaned || !reachTiles([[d.tx, d.ty]])) return;
      var a = { label: d.cfg.kind === "oil" ? "Lau vết dầu" : "Quét phoi kim loại", icon: d.cfg.kind === "oil" ? "🧽" : "🧹", cls: "clean", fn: function () { clean(d); } };
      if (d.id === fd) acts.unshift(a); else acts.push(a);
    });
    C.leaks.forEach(function (l) {
      var near = blockTiles(G.model, l.machine).concat([leakTile(G.model, l.machine)]);
      G.model.dirt.forEach(function (d) { if (d.cfg.source === l.machine) near.push([d.tx, d.ty]); });
      if (reachTiles(near)) acts.push({ label: (G.model.reports[l.machine] ? "Xem lại báo cáo: " : "Báo cáo sự cố dầu: ") + LY.names[l.machine], icon: "📋", cls: "report", fn: function () { openReport(l); } });
    });
    if (G.phase === 2) {
      C.s4.forEach(function (t) {
        if (reachTiles(taskTiles(t))) acts.unshift({ label: (G.model.s4[t.id] == null ? "Thiết lập: " : "Đổi tiêu chuẩn: ") + t.name, icon: t.icon, cls: "std", fn: function () { openTask(t); } });
      });
    }
    return acts.slice(0, 9);
  }

  var currentActs = [];
  function renderPanel() {
    if (!G) return;
    var p = G.player, hb = $("heldBox"), msg = $("panelMsg"), box = $("actions");
    if (p.held) { hb.classList.add("on"); hb.innerHTML = '<span class="th"><img src="' + spriteMeta(p.held.cfg).src + '" alt=""></span><span>' + (p.held.cfg.vehicle ? "Đang lái: " : "Đang cầm: ") + esc(p.held.cfg.name) + '</span>'; }
    else { hb.classList.remove("on"); hb.innerHTML = ""; }
    currentActs = (p.busy || p.path.length) ? [] : actionsList();
    if (p.busy) msg.textContent = "Đang thao tác…";
    else if (p.path.length) msg.textContent = p.held && p.held.cfg.vehicle ? "Đang lái xe…" : "Đang đi tới…";
    else if (p.held && p.held.cfg.vehicle) msg.textContent = "Bấm vào đồ vật / khu vực gần chỗ muốn đỗ, xe sẽ chạy tới, rồi chọn Đỗ xe.";
    else if (p.held) msg.textContent = currentActs.length > 1 ? "Chọn nơi đặt, hoặc bấm vào kệ, khu vực, thùng rác khác để mang tới đó." : "Bấm vào kệ / khu vực / thùng rác muốn đặt, nhân vật sẽ tự mang tới.";
    else if (currentActs.length) msg.textContent = "Chọn hành động:";
    else msg.textContent = G.phase === 2 ? "Bấm vào các dấu ? để thiết lập tiêu chuẩn; dấu 🩹 hoặc nút Băng keo để dán định vị trên nền." : "Bấm vào đồ vật, vết bẩn, máy hoặc khu vực, nhân vật sẽ tự chạy tới. Nút “Mặt bằng” để sắp xếp lại máy móc, kệ, khu vực.";
    box.innerHTML = "";
    currentActs.forEach(function (a, i) {
      var grp = mk("div", "act-grp");
      var b = mk("button", "act " + (a.cls || ""), '<span class="ai">' + a.icon + '</span><span>' + esc(a.label) + '</span>' + (i < 9 ? '<kbd>' + (i + 1) + '</kbd>' : ""));
      b.addEventListener("click", function (e) { e.stopPropagation(); if (G.player.busy) return; Sound.init(); Sound.click(); a.fn(); renderPanel(); });
      grp.appendChild(b);
      if (a.sub) {
        var sb = mk("button", "act act-sub red", '<span class="ai">' + a.sub.icon + '</span><span class="sub-lbl">Thẻ đỏ</span>');
        sb.title = a.sub.title; sb.setAttribute("aria-label", a.sub.title);
        sb.addEventListener("click", function (e) { e.stopPropagation(); if (G.player.busy) return; Sound.init(); Sound.click(); a.sub.fn(); renderPanel(); });
        grp.appendChild(sb);
      }
      box.appendChild(grp);
    });
  }

  var HUD_H = 64;    // height kept free for the top bar
  var PANEL_H = 150; // room kept for the action panel at the bottom
  function layout() {
    if (!G) return;
    var vp = $("viewport"), vw = vp.clientWidth, vh = vp.clientHeight;
    // the whole-shop view fits between the top bar and the action panel, so the panel never hides part of the shop
    // (a fixed allowance for the panel, so the view does not zoom in and out each time the actions change)
    var fit = Math.min(vw / SW, (vh - HUD_H - PANEL_H - 16) / SH);
    G.vw = vw; G.vh = vh;
    if (G.zoomAll || fit >= .74) { G.scale = Math.min(fit, 1.7); G.follow = false; }
    else { G.scale = clamp(Math.min(vw / 470, vh / 520), .62, 1.15); G.follow = true; }
    $("btnZoom").innerHTML = G.follow
      ? '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2.4" fill="none"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    $("btnZoom").title = G.follow ? "Xem toàn cảnh" : "Theo nhân vật";
    updateCamera(true);
  }

  function updateCamera(snap) {
    var s = G.scale, vw = G.vw, vh = G.vh, tx, ty;
    var bar = G.tapeMode ? $("tapebar") : $("panel"), panelH = bar.offsetHeight || 120;
    if (!G.follow) { tx = (vw - SW * s) / 2; ty = HUD_H + Math.max(0, (vh - HUD_H - Math.max(panelH, PANEL_H) - 16 - SH * s) / 2); }
    else {
      var p = iso(G.player.fx, G.player.fy, 36);
      tx = vw / 2 - p.x * s; ty = (vh - panelH) * .52 - p.y * s + 40;
      tx = SW * s > vw ? clamp(tx, vw - SW * s, 0) : (vw - SW * s) / 2;
      // following the worker: the shop can scroll until its bottom edge sits above the action panel
      ty = SH * s > vh - HUD_H - panelH ? clamp(ty, vh - SH * s - panelH - 16, HUD_H) : HUD_H + (vh - HUD_H - panelH - SH * s) / 2;
    }
    if (snap || !G.cam) G.cam = { x: tx, y: ty };
    else { G.cam.x += (tx - G.cam.x) * .14; G.cam.y += (ty - G.cam.y) * .14; }
    G.scene.root.style.transform = "translate3d(" + G.cam.x.toFixed(1) + "px," + G.cam.y.toFixed(1) + "px,0) scale(" + s + ")";
  }

  var tipTimer = null;
  function showTip(text, e) { if (G && G.tapeMode) return; showTipAt(text, e.clientX, e.clientY, 0); }
  function showTipAt(text, x, y, ms) {
    var t = $("tip"); t.textContent = text; t.style.left = x + "px"; t.style.top = y + "px"; t.classList.add("on");
    clearTimeout(tipTimer); if (ms) tipTimer = setTimeout(hideTip, ms);
  }
  function hideTip() { $("tip").classList.remove("on"); }
  var toastTimer = null;
  function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("on"); }, 2800); }

  function soundIcon() {
    var html = Sound.on
      ? '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    $("btnSound").innerHTML = html; $("btnSound2").innerHTML = html;
  }

  /* ============ 11. CHẤM ĐIỂM 5S ============ */
  function placeKey(it) { var L = it.loc; if (L.t === "zone" || L.t === "bin") return L.zone; return L.t; }
  function placeName(it) {
    var L = it.loc, s;
    if (L.t === "zone" || L.t === "bin") s = C.zones[L.zone].name;
    else if (L.t === "held") s = it.cfg.vehicle ? "Vẫn đang lái" : "Vẫn đang cầm trên tay";
    else if (L.t === "surface") s = { lathe: "Để trên máy tiện", mill: "Để trên bàn máy phay", bench: "Để trên bàn nguội" }[L.on];
    else s = AISLE[k2(L.tx, L.ty)] ? (it.cfg.vehicle ? "Đỗ trên lối đi" : "Để trên lối đi") : (it.cfg.vehicle ? "Đỗ ngoài lối đi" : "Để trên sàn");
    if (it.tagged && !(L.t === "zone" && L.zone === "redtag")) s += " (đã dán thẻ đỏ)";
    if (it.start === JSON.stringify(L)) s += ": chưa xử lý";
    return s;
  }
  function statusOf(it) {
    var k = placeKey(it), c = it.cfg.correct, L = it.loc, et = C.extinguisherTile;
    if (it.cfg.vehicle) return L.t === "floor" && !AISLE[k2(L.tx, L.ty)] && !(L.tx === et[0] && L.ty === et[1]) ? "ok" : "bad";
    if (k === c) return "ok";
    if ((it.cfg.alt || []).indexOf(k) >= 0) return "half";
    if (c === "redtag" && it.tagged && (k === "floor" || k === "surface")) return "half";
    return "bad";
  }

  function evaluate(model) {
    var items = model.items, notes = { s1: [], s2: [], s3: [], s4: [], s5: [] };
    var KEEP = { board: 1, shelf: 1, finished: 1, park: 1 }, BIN = { binMetal: 1, binRecycle: 1, binGeneral: 1, binOily: 1 };
    var needed = items.filter(function (i) { return KEEP[i.cfg.correct]; });
    var unneeded = items.filter(function (i) { return !KEEP[i.cfg.correct]; });
    var trash = items.filter(function (i) { return BIN[i.cfg.correct]; });
    function val(i) { var s = statusOf(i); return s === "ok" ? 1 : s === "half" ? .5 : 0; }

    // S1 Sàng lọc (20): tỷ lệ vật không cần đã loại bỏ / dán thẻ đỏ đúng, trừ 2 điểm mỗi vật còn cần bị vứt nhầm
    var u = 0, left = 0;
    unneeded.forEach(function (i) { var v = val(i), k = placeKey(i); if (!v && (BIN[k] || k === "redtag")) v = .5; u += v; if (!BIN[k] && k !== "redtag" && !i.tagged) left++; });
    var thrown = needed.filter(function (i) { var k = placeKey(i); return BIN[k] || k === "redtag"; });
    var s1 = 20 * u / unneeded.length - 2 * thrown.length;
    if (left) notes.s1.push("Còn " + left + " vật không cần thiết chưa loại bỏ hoặc dán thẻ đỏ.");
    thrown.forEach(function (i) { notes.s1.push("Loại bỏ nhầm vật còn cần dùng: " + i.cfg.name + "."); });
    if (!notes.s1.length) notes.s1.push("Tách bạch tốt cái cần và không cần.");

    // S2 Sắp xếp (20): đúng vị trí (10) + mặt bằng theo dòng chảy (6, trừ khi máy lấn lối đi) + lối đi (2) + PCCC (2)
    var s2v = 0; needed.forEach(function (i) { s2v += val(i); });
    var flow = flowTiles(model.layout), blk = blocksOnAisle(model);
    var lay = Math.max(0, 6 * clamp((FLOW_WORST - flow) / (FLOW_WORST - FLOW_BEST), 0, 1) - 2 * blk.length);
    var onAisle = items.filter(function (i) { return i.loc.t === "floor" && AISLE[k2(i.loc.tx, i.loc.ty)]; });
    var et = C.extinguisherTile;
    var extBlocked = items.some(function (i) { return i.loc.t === "floor" && i.loc.tx === et[0] && i.loc.ty === et[1]; });
    var s2 = 10 * s2v / needed.length + lay + (onAisle.length ? 0 : 2) + (extBlocked ? 0 : 2);
    var wrongPlace = needed.filter(function (i) { return statusOf(i) !== "ok"; }).length;
    if (wrongPlace) notes.s2.push(wrongPlace + " dụng cụ/vật tư/thành phẩm/xe chưa về đúng vị trí.");
    if (flow > FLOW_BEST + 1.5) notes.s2.push("Mặt bằng chưa theo dòng chảy: " + meters(flow) + " m/lô (tối ưu ~" + meters(FLOW_BEST) + " m).");
    if (blk.length) notes.s2.push("Máy móc/khu vực lấn lối đi hoặc khu PCCC: " + blk.map(function (b) { return LY.names[b]; }).join(", ") + ".");
    if (onAisle.length) notes.s2.push("Lối đi còn " + onAisle.length + " vật dụng/xe.");
    if (extBlocked) notes.s2.push("Bình chữa cháy vẫn bị che chắn, lỗi an toàn nghiêm trọng.");
    if (!notes.s2.length) notes.s2.push("Mặt bằng theo dòng chảy, mọi thứ ở đúng chỗ.");

    // S3 Sạch sẽ (20): vệ sinh (8) + phân loại rác đúng thùng (6) + báo cáo sự cố rò dầu & phiếu bảo trì (6)
    var dc = model.dirt.filter(function (d) { return d.cleaned; }).length;
    var rightBin = trash.filter(function (i) { return placeKey(i) === i.cfg.correct; }).length;
    var wrongBin = items.filter(function (i) { var k = placeKey(i); return BIN[k] && k !== i.cfg.correct && (i.cfg.alt || []).indexOf(k) < 0; }).length;
    var rp = 0;
    C.leaks.forEach(function (l) {
      var r = model.reports[l.machine];
      if (r && r.src != null && l.src[r.src].ok) rp += .5;
      if (r && r.act != null && l.act[r.act].ok) rp += .5;
      if (!r) notes.s3.push("Chưa báo cáo: " + l.name.toLowerCase() + (l.releak ? ", lau xong dầu lại chảy." : "."));
      else if (!leakFixed(model, l.machine) || !l.src[r.src].ok) notes.s3.push("Báo cáo sự cố " + LY.names[l.machine].toLowerCase() + " chưa đúng nguồn gây bẩn / cách xử lý.");
    });
    var s3 = 8 * dc / model.dirt.length + 6 * rightBin / trash.length + 6 * rp / C.leaks.length;
    if (dc < model.dirt.length) notes.s3.push("Còn " + (model.dirt.length - dc) + " vết dầu/phoi chưa vệ sinh.");
    if (wrongBin) notes.s3.push(wrongBin + " vật bỏ sai thùng phân loại rác.");
    if (!notes.s3.length) notes.s3.push("Xưởng sạch, rác phân loại đúng.");

    // S4 Săn sóc (20): băng keo định vị (đúng vị trí + đúng màu) và các hạng mục lựa chọn
    var s4ok = 0;
    C.tape.forEach(function (t) {
      var st = tapeStatus(model, t);
      s4ok += st === "ok" ? 1 : st === "half" ? .5 : 0;
      if (st !== "ok") notes.s4.push((st === "half" ? "Băng keo chưa đủ / sai màu: " : "Chưa dán băng keo: ") + t.name.toLowerCase() + ".");
    });
    C.s4.forEach(function (t) {
      var i = model.s4[t.id];
      if (i != null && t.options[i].ok) s4ok++;
      else notes.s4.push((i == null ? "Chưa thiết lập: " : "Chưa đúng chuẩn: ") + t.name.toLowerCase() + ".");
    });
    var s4 = 20 * s4ok / (C.s4.length + C.tape.length);
    if (!notes.s4.length) notes.s4.push("Tiêu chuẩn rõ ràng: băng keo đúng màu, đúng vị trí; nhãn, biển đầy đủ.");

    // S5 Sẵn sàng (20): kế hoạch duy trì
    var s5ok = 0;
    C.s5.forEach(function (q) {
      var i = model.s5[q.id];
      if (i != null && q.options[i].ok) s5ok++;
      else notes.s5.push(q.group + ": " + (i == null ? "chưa chọn" : "chưa phù hợp") + ".");
    });
    var s5 = 20 * s5ok / C.s5.length;
    if (!notes.s5.length) notes.s5.push("Kế hoạch duy trì đầy đủ: lịch đánh giá, xếp hạng, khen thưởng.");

    var sc = [s1, s2, s3, s4, s5].map(function (v) { return Math.round(clamp(v, 0, 20)); });
    var total = sc.reduce(function (a, b) { return a + b; }, 0);
    return { scores: sc, total: total, rating: total >= 85 ? "Xuất sắc" : total >= 60 ? "Đạt" : "Cần cải thiện", notes: notes, flow: flow, blk: blk };
  }

  /* ============ 12. MÀN HÌNH, GIAI ĐOẠN, S5, KẾT QUẢ ============ */
  function show(id) { ["scr-start", "scr-game", "scr-plan", "scr-result"].forEach(function (s) { $(s).classList.toggle("show", s === id); }); }
  function modal(html) { $("modalCard").className = "modal-card"; $("modalCard").innerHTML = html; $("modal").classList.add("on"); $("modal").setAttribute("aria-hidden", "false"); }
  function closeModal() { $("modal").classList.remove("on"); $("modal").setAttribute("aria-hidden", "true"); }

  function lessonHTML() {
    return '<h3>Bài học 5S</h3><p>5 bước tạo nơi làm việc an toàn, hiệu quả, nền tảng của mọi hoạt động cải tiến.</p><div class="lessons">' +
      C.lessons.map(function (l, i) {
        var s = S_META[i];
        return '<div class="lesson"><div class="si" style="background:' + s.c + ';--sc:' + s.c + '">' + S_ICONS[s.k] + '</div><div><b>' + (i + 1) + '. ' + esc(l.s) + '</b><em>' + esc(l.jp) + '</em><p>' + esc(l.text) + '</p></div></div>';
      }).join("") + '</div><div class="modal-btns"><button class="btn btn-primary" data-close>Đã hiểu</button></div>';
  }
  function openLesson() { Sound.click(); modal(lessonHTML()); }

  function startGame() {
    Sound.init();
    var model = newModel();
    G = { model: model, running: true, startTime: Date.now(), focus: null, zoomAll: false, playerName: PLAYER, phase: 1, tapeMode: false, tapeColor: null };
    G.occ = blockOccupancy(model);
    G.scene = buildScene($("scene"), model, true);
    var w = window.createCharacter();
    G.player = { x: C.playerStart.x, y: C.playerStart.y, fx: C.playerStart.x + .5, fy: C.playerStart.y + .5, path: [], held: null, busy: false, el: w };
    G.scene.root.appendChild(w);
    $("scr-game").classList.remove("taping");
    setFace(0, -1); placePlayer();
    setPhaseUI();
    show("scr-game");
    layout(); refreshNear(); renderPanel(); updateSbar();
    requestAnimationFrame(loop);
    setTimeout(function () {
      modal('<h3>Giai đoạn 1 · Dọn xưởng</h3><p><b>' + esc(C.workshop) + '</b> đang rất bừa bộn: dụng cụ vứt lung tung, hàng lỗi lẫn hàng tốt, dầu loang, phoi văng, xe nâng đỗ tùy tiện… máy móc, kệ vật tư cũng đặt không theo trình tự.</p>' +
        '<ul class="intro-list"><li><b>Sàng lọc:</b> giữ cái cần, loại bỏ hoặc dán thẻ đỏ cái không cần.</li><li><b>Sắp xếp:</b> mỗi thứ về đúng chỗ.</li><li><b>Sắp xếp layout xưởng:</b> bấm nút <b>📐 Mặt bằng</b> để kéo thả máy móc, kệ, khu vực theo dòng chảy Cửa nhập → Kệ vật tư → Máy tiện → Máy phay → QC → Thành phẩm → Cổng xuất. Đường đứt nét (spaghetti) càng ngắn, càng ít quay đầu thì càng tốt.</li><li><b>Sạch sẽ:</b> lau dầu, quét phoi, phân loại rác đúng 4 thùng; máy chảy dầu thì tìm nguồn gây bẩn và báo cáo bảo trì.</li></ul>' +
        '<p>Bấm vào đồ vật, nhân vật tự chạy tới. Game không gợi ý đúng/sai cho đến khi chấm điểm.</p><div class="modal-btns"><button class="btn btn-primary" data-close>Bắt đầu dọn!</button></div>');
    }, 450);
  }

  function setPhaseUI() {
    $("btnDone").textContent = G.phase === 1 ? "XONG GIAI ĐOẠN 1 →" : "XONG GIAI ĐOẠN 2 →";
    $("btnTape").style.display = G.phase === 2 ? "" : "none";
    updateSbar();
  }

  function onDone() {
    if (!G || !G.running) return;
    Sound.click();
    if (G.tapeMode) exitTape();
    if (G.phase === 1) {
      modal('<h3>Hoàn tất giai đoạn 1?</h3><p>Chuyển sang <b>Giai đoạn 2 · Săn sóc (tiêu chuẩn hoá)</b>. Bạn vẫn có thể dọn tiếp hoặc đổi mặt bằng ở giai đoạn 2.</p>' +
        '<div class="modal-btns"><button class="btn btn-ghost" data-close>Dọn tiếp</button><button class="btn btn-primary" id="mGo">Sang giai đoạn 2</button></div>');
      $("mGo").onclick = function () { closeModal(); enterPhase2(); };
    } else {
      var left = C.s4.filter(function (t) { return G.model.s4[t.id] == null; }).length + C.tape.filter(function (t) { return !tapeTouched(t); }).length;
      modal('<h3>Hoàn tất giai đoạn 2?</h3><p>' + (left ? 'Còn <b>' + left + '</b> hạng mục chưa thiết lập. ' : '') + 'Chuyển sang <b>Giai đoạn 3 · Sẵn sàng</b>: lên lịch đánh giá, xếp hạng và khen thưởng.</p>' +
        '<div class="modal-btns"><button class="btn btn-ghost" data-close>Làm tiếp</button><button class="btn btn-primary" id="mGo">Sang giai đoạn 3</button></div>');
      $("mGo").onclick = function () { closeModal(); enterPhase3(); };
    }
  }

  function enterPhase2() {
    G.phase = 2; setPhaseUI(); addMarkers(); renderPanel(); Sound.phase();
    modal('<h3>Giai đoạn 2 · Săn sóc: Tiêu chuẩn hoá</h3><p>Xưởng đã gọn hơn, nhưng <b>chưa có tiêu chuẩn</b> để giữ thành quả: chưa có vạch lối đi, chưa định vị khu vực và chỗ đỗ xe, chưa có nhãn, bảng dụng cụ chưa có hình bóng…</p>' +
      '<p><b>🩹 Băng keo định vị:</b> chọn màu rồi <b>kéo trên nền xưởng</b> để dán, băng keo tự canh thẳng theo trục dọc/ngang và bám theo lưới ô sàn.</p>' +
      '<p>Các dấu <span class="q-dot">?</span> khác: nhân vật chạy tới, bạn chọn tiêu chuẩn phù hợp.</p>' +
      '<div class="modal-btns"><button class="btn btn-primary" data-close>Bắt đầu</button></div>');
  }

  function enterPhase3() {
    G.phase = 3; G.running = false; G.player.path = [];
    Sound.phase();
    renderPlan(); show("scr-plan");
    $("timer2").textContent = fmtTime(elapsed());
    G.planTimer = setInterval(function () { $("timer2").textContent = fmtTime(elapsed()); }, 500);
  }

  function renderPlan() {
    var groups = ["Lịch đánh giá", "Xếp hạng", "Khen thưởng"];
    $("planQs").innerHTML = groups.map(function (g) {
      var qs = C.s5.filter(function (q) { return q.group === g; });
      return '<section class="plan-card"><h2><span class="pg-ic">' + GROUP_ICON[g] + '</span>' + g + '</h2>' + (g === "Xếp hạng" ? rankDemo() : "") + qs.map(function (q) {
        return '<div class="pq" data-q="' + q.id + '"><p class="pq-t">' + esc(q.q) + '</p><div class="opts">' + q.options.map(function (o, i) {
          return '<button class="opt' + (G.model.s5[q.id] === i ? " sel" : "") + '" data-i="' + i + '"><span class="radio"></span><span>' + esc(o.label) + '</span></button>';
        }).join("") + '</div></div>';
      }).join("") + '</section>';
    }).join("");
    $("planQs").querySelectorAll(".pq").forEach(function (box) {
      box.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () {
          G.model.s5[box.getAttribute("data-q")] = +b.getAttribute("data-i"); Sound.click();
          box.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); });
          planProgress();
        });
      });
    });
    planProgress();
  }
  function rankDemo() {
    var t = [["Tổ Tiện", 92], ["Tổ Phay", 85], ["Tổ QC", 81], ["Tổ Kho", 64]];
    return '<div class="rank-demo"><small>Ví dụ: bảng điểm 5S tháng của các tổ</small>' + t.map(function (r, i) {
      return '<div class="rk"><span class="rk-n">' + (i + 1) + '</span><span class="rk-t">' + r[0] + '</span><span class="rk-bar"><i style="width:' + r[1] + '%"></i></span><b>' + r[1] + '</b></div>';
    }).join("") + '</div>';
  }
  function planProgress() {
    var n = C.s5.filter(function (q) { return G.model.s5[q.id] != null; }).length;
    $("planCount").textContent = n + "/" + C.s5.length + " câu đã chọn";
    $("btnFinish").disabled = n < C.s5.length;
  }

  function finish() {
    clearInterval(G.planTimer);
    G.running = false; G.endTime = Date.now();
    var t = elapsed(), R = evaluate(G.model), name = G.playerName;
    var best = store(BEST_KEY) || {}, prev = best[name] || 0, isBest = R.total > prev;
    if (isBest) { best[name] = R.total; store(BEST_KEY, best); }
    window.WISE_LMS.sendResult({
      player: name, score: R.total, rating: R.rating, timeSec: Math.round(t),
      breakdown: { sangLoc: R.scores[0], sapXep: R.scores[1], sachSe: R.scores[2], sanSoc: R.scores[3], sanSang: R.scores[4] },
      finishedAt: new Date().toISOString()
    });
    renderResult(R, t, Math.max(prev, R.total), isBest && prev > 0);
    show("scr-result"); $("scr-result").scrollTop = 0;
    animateResult(R);
  }

  function starSVG() { return '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.8z" fill="#FFD24A" stroke="#C99A12" stroke-width="1"/></svg>'; }
  function medalSVG(total) {
    var c = total >= 85 ? ["#FFE27A", "#E7A812"] : total >= 60 ? ["#E9EEF3", "#9AA8B6"] : ["#F0B98A", "#B5733D"];
    return '<svg class="medal" viewBox="0 0 86 110"><path d="M22 0h16l8 34H30z" fill="#F76011"/><path d="M48 0h16l-8 34H40z" fill="#0B4278"/>' +
      '<circle cx="43" cy="68" r="34" fill="' + c[1] + '"/><circle cx="43" cy="68" r="28" fill="' + c[0] + '"/>' +
      '<path d="M43 48l5.8 12 13.2 1.6-9.8 9.2 2.6 13.2L43 77.6l-11.8 6.4 2.6-13.2-9.8-9.2L37.2 60z" fill="' + c[1] + '"/>' +
      '<text x="43" y="104" text-anchor="middle" font-family="Arial" font-size="10" font-weight="900" fill="#fff">5S</text></svg>';
  }
  var BADGE = { ok: "Đúng", half: "Gần đúng", bad: "Chưa đúng" };
  function irow(st, thumb, title, you, right, why) {
    return '<div class="irow ' + st + '"><div class="th">' + thumb + '</div><div><h4>' + esc(title) + '</h4><div class="where">Bạn: <b>' + esc(you) + '</b></div>' +
      (st !== "ok" && right ? '<div class="where">Đúng chuẩn: <b>' + esc(right) + '</b></div>' : '') + '<p>' + esc(why) + '</p></div><span class="badge ' + st + '">' + BADGE[st] + '</span></div>';
  }

  function renderResult(R, t, best, newRecord) {
    var M = G.model, cls = R.total >= 85 ? "r1" : R.total >= 60 ? "r2" : "r3";
    var rows = S_META.map(function (s, i) {
      var nts = R.notes[s.k].slice(0, 3).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
      return '<div class="srow"><div class="si" style="background:' + s.c + ';--sc:' + s.c + '">' + S_ICONS[s.k] + '</div><div><b>' + s.name + '</b>' +
        '<div class="bar"><i style="background:' + s.c + '" data-w="' + (R.scores[i] * 5) + '"></i></div><ul>' + nts + '</ul></div>' +
        '<div class="pts">' + R.scores[i] + '<small>/20</small></div></div>';
    }).join("");
    var order = { bad: 0, half: 1, ok: 2 };
    var list = M.items.map(function (it) { return { it: it, st: statusOf(it) }; }).sort(function (a, b) { return order[a.st] - order[b.st]; });
    var layOk = R.flow <= FLOW_BEST + 1.5 && !R.blk.length;
    var sec1 = irow(layOk ? "ok" : (R.flow <= (FLOW_BEST + FLOW_WORST) / 2 ? "half" : "bad"), '<span class="emo">📐</span>', "Bố trí mặt bằng: " + meters(R.flow) + " m / lô hàng",
      R.blk.length ? "Lấn lối đi/khu PCCC: " + R.blk.map(function (b) { return LY.names[b]; }).join(", ") : "Quãng đường vận chuyển " + meters(R.flow) + " m",
      LY.flow.map(function (s) { return LY.names[s]; }).join(" → ") + " (~" + meters(FLOW_BEST) + " m)", LY.why);
    sec1 += list.map(function (x) { var it = x.it; return irow(x.st, '<img src="' + spriteMeta(it.cfg).src + '" alt="">', it.cfg.name, placeName(it), it.cfg.vehicle ? C.parkName : C.zones[it.cfg.correct].name, it.cfg.why); }).join("");
    M.dirt.forEach(function (d) { sec1 += irow(d.cleaned ? "ok" : "bad", '<img src="' + A.icons[d.cfg.kind].src + '" alt="">', d.cfg.name, d.cleaned ? "Đã vệ sinh sạch" : "Chưa vệ sinh", "Lau / quét sạch", d.cfg.why); });
    C.leaks.forEach(function (l) {
      var r = M.reports[l.machine], okS = r && l.src[r.src].ok, okA = r && l.act[r.act].ok, st = okS && okA ? "ok" : (okS || okA) ? "half" : "bad";
      sec1 += irow(st, '<span class="emo">📋</span>', l.name, r ? "Nguồn: " + l.src[r.src].label + " · Xử lý: " + l.act[r.act].label : "Chưa báo cáo sự cố",
        "Nguồn: " + l.src[okIndex(l.src)].label + " · Xử lý: " + l.act[okIndex(l.act)].label, l.why);
    });
    var sec4 = C.tape.map(function (tk) {
      var sc = tapeScore(M, tk), st = tapeStatus(M, tk);
      var you = sc.any ? "Dán " + Math.round(sc.any * 100) + "% đúng vị trí · màu: " + sc.used.map(function (c) { return TAPE_BY[c].name; }).join(", ") : "Chưa dán băng keo ở khu vực này";
      return irow(st, '<span class="emo">' + tk.icon + '</span>', tk.name, you, tk.right, tk.why);
    }).join("") + C.s4.map(function (tk) {
      var i = M.s4[tk.id], ok = i != null && tk.options[i].ok;
      return irow(ok ? "ok" : "bad", '<span class="emo">' + tk.icon + '</span>', tk.name, i == null ? "Chưa thiết lập" : tk.options[i].label, tk.options[okIndex(tk.options)].label, tk.why);
    }).join("");
    var sec5 = C.s5.map(function (q) {
      var i = M.s5[q.id], ok = i != null && q.options[i].ok;
      return irow(ok ? "ok" : "bad", '<span class="emo">' + GROUP_ICON[q.group] + '</span>', q.q, i == null ? "Chưa chọn" : q.options[i].label, q.options[okIndex(q.options)].label, q.why);
    }).join("");

    $("result").innerHTML =
      '<div class="res-hero"><div class="res-char" id="resChar"></div><div class="res-main">' +
        '<div class="res-title">' + GEAR + ' ' + esc(C.workshop) + ' · ' + esc(G.playerName) + '</div>' +
        '<div class="res-score"><span id="scoreNum">0</span><small>/100</small></div>' +
        '<div class="stars" id="stars">' + starSVG() + starSVG() + starSVG() + '</div>' +
        '<span class="rating ' + cls + '">' + R.rating + '</span>' +
        '<div class="res-meta">Thời gian ' + fmtTime(t) + ' · Kỷ lục của bạn: ' + best + (newRecord ? ' · <b style="color:#FFD24A">Kỷ lục mới!</b>' : '') + '</div>' +
      '</div>' + medalSVG(R.total) + '</div>' +
      '<div class="res-grid"><div class="card"><h2>Điểm theo từng chữ S</h2>' + rows + '</div>' +
      '<div class="card"><h2>So sánh</h2><div class="compare"><div class="mini" id="miniYou"><span class="cap">Xưởng của bạn</span></div>' +
      '<div class="mini good" id="miniGood"><span class="cap">Xưởng đạt chuẩn 5S</span></div></div></div></div>' +
      '<div class="card"><h2>Giai đoạn 1 · Sàng lọc, Sắp xếp, Sạch sẽ</h2><div class="ilist">' + sec1 + '</div></div>' +
      '<div class="card"><h2>Giai đoạn 2 · Săn sóc: Tiêu chuẩn hoá</h2><div class="ilist">' + sec4 + '</div></div>' +
      '<div class="card"><h2>Giai đoạn 3 · Sẵn sàng: Duy trì</h2><div class="ilist">' + sec5 + '</div></div>' +
      '<div class="res-actions"><button class="btn btn-primary btn-lg" id="btnAgain">Chơi lại</button><button class="btn btn-dark btn-lg" id="btnLesson2">Xem bài học 5S</button></div>';

    var w = window.createCharacter(); w.classList.add(R.total >= 60 ? "celebrate" : "scratch");
    $("resChar").appendChild(w);
    renderMini($("miniYou"), M);
    renderMini($("miniGood"), idealModel(M));
    $("btnAgain").onclick = function () { Sound.click(); startGame(); };
    $("btnLesson2").onclick = openLesson;
  }

  function renderMini(box, model) {
    var sc = mk("div", "scene"); box.appendChild(sc);
    buildScene(sc, model, false);
    function fit() { var s = box.clientWidth / SW; sc.style.transform = "scale(" + s + ")"; box.style.height = (SH * s) + "px"; }
    fit(); requestAnimationFrame(fit);
    box._fit = fit;
  }

  function animateResult(R) {
    var el = $("scoreNum"), t0 = performance.now(), dur = 1400;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(R.total * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
    var stars = R.total >= 85 ? 3 : R.total >= 60 ? 2 : R.total >= 35 ? 1 : 0;
    var svgs = $("stars").querySelectorAll("svg");
    for (var i = 0; i < stars; i++) (function (i) { setTimeout(function () { svgs[i].classList.add("on"); Sound.tone(880 + i * 220, .15, "triangle", .1); }, 900 + i * 300); })(i);
    setTimeout(function () { document.querySelectorAll(".srow .bar i").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; }); }, 300);
    if (R.total >= 60) setTimeout(function () { Sound.win(); confetti(R.total >= 85 ? 140 : 70); }, 700);
    else setTimeout(function () { Sound.meh(); }, 700);
  }

  function confetti(n) {
    var box = $("confetti"), cols = ["#F76011", "#FFD24A", "#2E9A57", "#2F78C4", "#E0552A", "#FFFFFF", "#8A4FD8"];
    box.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var c = mk("i"); c.style.left = rnd(0, 100) + "vw"; c.style.background = cols[i % cols.length];
      c.style.setProperty("--dx", rnd(-120, 120) + "px"); c.style.setProperty("--rot", rnd(360, 1080) + "deg");
      c.style.animationDuration = rnd(2.2, 4) + "s"; c.style.animationDelay = rnd(0, .8) + "s";
      c.style.width = rnd(6, 12) + "px"; c.style.height = rnd(8, 16) + "px";
      box.appendChild(c);
    }
    setTimeout(function () { box.innerHTML = ""; }, 5200);
  }

  /* ============ KHỞI ĐỘNG ============ */
  function initStart() {
    var sc = $("startScene");
    buildScene(sc, newModel(), false);
    function fitBg() { var s = Math.max(innerWidth / SW, innerHeight / SH) * 1.08; sc.style.transform = "translate(-50%,-50%) scale(" + s + ")"; sc.style.transformOrigin = "50% 50%"; }
    fitBg(); window.addEventListener("resize", fitBg);
    var inp = $("playerName"), btn = $("btnStart");
    var last = store("wise5s_xck_last");
    if (last) inp.value = last;
    function upd() {
      var n = inp.value.trim(); btn.disabled = !n;
      var best = store(BEST_KEY) || {};
      $("bestLine").textContent = n && best[n] ? "Kỷ lục của " + n + ": " + best[n] + "/100" : "";
    }
    inp.addEventListener("input", upd); upd();
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !btn.disabled) btn.click(); });
    btn.addEventListener("click", function () {
      var n = inp.value.trim(); if (!n) return;
      store("wise5s_xck_last", n); PLAYER = n; startGame();
    });
    $("btnLesson1").addEventListener("click", openLesson);
  }

  function initGlobal() {
    buildSbar(); soundIcon(); buildTapebar(); initTapeInput();
    function toggleSound() { Sound.on = !Sound.on; store(SOUND_KEY, Sound.on); soundIcon(); Sound.init(); Sound.click(); }
    $("btnSound").addEventListener("click", toggleSound);
    $("btnSound2").addEventListener("click", toggleSound);
    $("btnZoom").addEventListener("click", function () { if (!G || G.tapeMode) return; G.zoomAll = !G.zoomAll; Sound.click(); layout(); });
    $("btnLayout").addEventListener("click", openLayout);
    $("btnDone").addEventListener("click", onDone);
    $("btnFinish").addEventListener("click", function () { Sound.click(); finish(); });
    $("btnPlanLesson").addEventListener("click", openLesson);
    $("modal").addEventListener("click", function (e) { if (e.target.id === "modal" || e.target.hasAttribute("data-close")) closeModal(); });
    window.addEventListener("resize", function () {
      if (G && G.running) layout();
      document.querySelectorAll(".mini").forEach(function (b) { if (b._fit) b._fit(); });
    });
    window.addEventListener("keydown", function (e) {
      if ($("modal").classList.contains("on")) { if (e.key === "Escape") closeModal(); return; }
      if (!G || !G.running || G.tapeMode || document.activeElement.tagName === "INPUT") return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && currentActs[n - 1] && !G.player.busy) { Sound.click(); currentActs[n - 1].fn(); renderPanel(); }
    });
  }

  /* Dùng khi kiểm thử: WISE5S_DEBUG() trả về trạng thái ván chơi hiện tại */
  window.WISE5S_DEBUG = function () { return G; };

  initGlobal();
  initStart();
})();
