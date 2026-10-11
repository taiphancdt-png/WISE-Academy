/* =====================================================================
   HÀM TÍNH OEE & SINH KỊCH BẢN, tách riêng để kiểm tra độc lập
   ---------------------------------------------------------------------
   Công thức chuẩn:
     Thời gian SX kế hoạch = Thời gian ca − Dừng có kế hoạch
     Thời gian vận hành    = Thời gian SX kế hoạch − Tổn thất dừng máy (A)
     A   = Thời gian vận hành / Thời gian SX kế hoạch
     P   = (Chu kỳ lý tưởng × Tổng sản phẩm) / Thời gian vận hành
     Q   = Sản phẩm tốt / Tổng sản phẩm
     OEE = A × P × Q = (Sản phẩm tốt × Chu kỳ lý tưởng) / Thời gian SX kế hoạch
     Takt time = Thời gian SX kế hoạch / Nhu cầu khách hàng
   Kiểm tra tự động: OEE_CALC.selfTest() với số liệu mẫu (Tiện 68,0%; Phay 74,3%).
   ===================================================================== */
window.OEE_CALC = (function () {
  "use strict";

  function sum(list, key) { return list.reduce(function (a, e) { return a + (e[key] || 0); }, 0); }
  function round(v, d) { var k = Math.pow(10, d || 0); return Math.round(v * k) / k; }

  /* Tính toàn bộ chỉ số cho một máy trong một ca */
  function calc(m, shift) {
    var ev = m.events;
    var planStop = sum(ev.filter(function (e) { return e.cat === "plan"; }), "min");
    var lossA = sum(ev.filter(function (e) { return e.cat === "A"; }), "min");
    var lossPmin = sum(ev.filter(function (e) { return e.cat === "P"; }), "min");
    var defects = sum(ev.filter(function (e) { return e.cat === "Q"; }), "qty");
    var planned = shift - planStop;
    var run = planned - lossA;
    var total = m.total, good = total - defects;
    var A = run / planned;
    var P = (m.ideal * total) / run;
    var Q = good / total;
    var OEE = A * P * Q;
    return {
      shift: shift, planStop: planStop, planned: planned, lossA: lossA, run: run,
      ideal: m.ideal, total: total, defects: defects, good: good, demand: m.demand,
      A: A, P: P, Q: Q, OEE: OEE, OEE2: (good * m.ideal) / planned,
      speedLoss: run - m.ideal * total,                 // phút mất do tốc độ (tổn thất P)
      lossPlisted: lossPmin,                            // tổng phút các thẻ P (phải khớp speedLoss)
      qualityLoss: defects * m.ideal,                   // phút "làm ra phế phẩm" (tổn thất Q)
      goodTime: good * m.ideal,                         // phút tạo ra sản phẩm tốt
      takt: planned / m.demand,
      meets: good >= m.demand, gap: good - m.demand
    };
  }

  /* Gộp các thẻ theo nhóm tổn thất (cho câu hỏi "tổn thất lớn nhất"), Q đổi ra phút = số sp × chu kỳ lý tưởng */
  function lossGroups(m) {
    var g = {};
    m.events.forEach(function (e) {
      if (e.cat === "plan") return;
      var key = e.group || e.desc, mins = e.cat === "Q" ? e.qty * m.ideal : e.min;
      if (!g[key]) g[key] = { name: key, cat: e.cat, loss: e.loss, fix: e.fix, min: 0 };
      g[key].min += mins;
    });
    return Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.min - a.min; });
  }

  /* ---------------- Kiểm tra tự động với số liệu mẫu ---------------- */
  function selfTest(data) {
    var expect = {
      lathe: { planned: 450, run: 360, A: 80.0, P: 90.0, Q: 94.4, OEE: 68.0, takt: 2.0, meets: false },
      mill:  { planned: 420, run: 378, A: 90.0, P: 85.7, Q: 96.3, OEE: 74.3, takt: 4.2, meets: true }
    };
    var out = [], ok = true;
    data.sample.machines.forEach(function (m) {
      var r = calc(m, data.shift), e = expect[m.id];
      var got = { planned: r.planned, run: r.run, A: round(r.A * 100, 1), P: round(r.P * 100, 1), Q: round(r.Q * 100, 1),
                  OEE: round(r.OEE * 100, 1), takt: round(r.takt, 2), meets: r.meets };
      Object.keys(e).forEach(function (k) {
        var pass = got[k] === e[k];
        if (!pass) ok = false;
        out.push((pass ? "✔ " : "✘ ") + m.name + " · " + k + " = " + got[k] + (pass ? "" : " (mong đợi " + e[k] + ")"));
      });
      var cons = Math.abs(r.speedLoss - r.lossPlisted) < 1e-9 && Math.abs(r.OEE - r.OEE2) < 1e-9;
      if (!cons) ok = false;
      out.push((cons ? "✔ " : "✘ ") + m.name + " · tổn thất P khớp số liệu (" + r.speedLoss + " phút), OEE = A×P×Q = Tốt×CT/KH");
    });
    return { ok: ok, lines: out };
  }

  /* ---------------- Sinh kịch bản ngẫu nhiên (khi chơi lại) ---------------- */
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function r5(a, b) { return 5 * rint(Math.ceil(a / 5), Math.floor(b / 5)); }

  /* chia tổng S thành n phần nguyên trong [lo, hi] */
  function split(S, n, lo, hi) {
    var parts = [], left = S;
    for (var i = 0; i < n; i++) {
      var rest = n - i - 1, mn = Math.max(lo, left - rest * hi), mx = Math.min(hi, left - rest * lo);
      var v = i === n - 1 ? left : rint(mn, mx);
      parts.push(v); left -= v;
    }
    return parts;
  }

  function genMachine(id, pool, shift) {
    for (var tries = 0; tries < 200; tries++) {
      var ideal = pick(pool.ideal), events = [], used = [];
      function slot(lo, hi) { var t; for (var k = 0; k < 30; k++) { t = rint(lo, hi); if (used.every(function (u) { return Math.abs(u - t) > 12; })) break; } used.push(t); return t; }
      // dừng có kế hoạch
      var plan = pick(pool.plan), pt = [0, rint(140, 200), rint(330, 380)];
      plan.forEach(function (p, i) {
        events.push({ t: i === 0 ? 0 : (p.anim === "pm" ? slot(220, 300) : pt[Math.min(i, 2)]), cat: "plan", loss: 0, min: p.min, desc: p.desc, anim: p.anim,
          why: p.anim === "pm" ? "Bảo trì ĐÃ có trong lịch kế hoạch → dừng có kế hoạch, không phải tổn thất A." : p.desc + " nằm trong kế hoạch → trừ khỏi thời gian ca, không tính vào OEE." });
      });
      // tổn thất A
      var aList = shuffle(pool.A).slice(0, rint(2, 3));
      aList.forEach(function (a) {
        events.push({ t: slot(30, 430), cat: "A", loss: a.loss, min: r5(a.r[0], a.r[1]), desc: a.desc, group: a.group, fix: a.fix, anim: a.anim,
          why: a.loss === 1 ? "Máy hỏng đột xuất phải dừng → tổn thất A (hỏng hóc thiết bị)." : "Máy dừng vì chuyển đổi / chờ đợi → tổn thất A (cài đặt, chuyển đổi & chờ đợi)." });
      });
      var planStop = events.filter(function (e) { return e.cat === "plan"; }).reduce(function (s, e) { return s + e.min; }, 0);
      var planned = shift - planStop, run = planned - events.filter(function (e) { return e.cat === "A"; }).reduce(function (s, e) { return s + e.min; }, 0);
      // sản lượng theo P mục tiêu 0,82-0,95; ideal×total phải là số nguyên
      var total = Math.floor((0.82 + Math.random() * 0.13) * run / ideal);
      if (ideal % 1 !== 0 && total % 2) total--;
      var speedLoss = run - ideal * total;
      if (speedLoss < 14 || total < 40) continue;
      var nShort = rint(3, 4), S = Math.min(rint(nShort * 2, nShort * 5), speedLoss - 6);
      if (S < nShort * 2) continue;
      split(S, nShort, 2, 5).forEach(function (v) {
        events.push({ t: slot(20, 470), cat: "P", loss: 3, min: v, desc: "Dừng " + v + " phút do " + pool.short.desc, group: pool.short.group, fix: pool.short.fix, anim: "short",
          why: "Dừng ngắn dưới 5 phút → tổn thất P (dừng ngắn), không phải A." });
      });
      var sl = pick(pool.slow), slow = speedLoss - S;
      events.push({ t: slot(60, 400), cat: "P", loss: 4, min: slow, desc: sl.desc + " (cộng dồn cả ca " + slow + " phút)", group: sl.group, fix: sl.fix, anim: "slow",
        why: "Máy vẫn chạy nhưng chậm hơn chu kỳ lý tưởng → tổn thất P (giảm tốc độ)." });
      // phế phẩm
      var defects = Math.max(2, Math.round(total * (0.02 + Math.random() * 0.04)));
      var hasStart = aList.some(function (a) { return a.loss === 1 || a.anim === "setup"; });
      var start = hasStart ? rint(1, Math.min(5, defects - 1)) : 0, inProc = defects - start;
      if (start) events.push({ t: slot(40, 440), cat: "Q", loss: 5, qty: start, desc: start + " sp lỗi khi chạy thử sau sửa chữa / chuyển đổi", group: "Phế phẩm khi khởi động", fix: "startup", anim: "defect",
        why: "Lỗi lúc chạy thử sau sửa chữa / chuyển đổi → tổn thất Q (phế phẩm khi khởi động)." });
      var q6 = pick(pool.q6), parts = inProc >= 4 ? split(inProc, 2, 1, inProc) : [inProc];
      parts.forEach(function (v) {
        events.push({ t: slot(40, 470), cat: "Q", loss: 6, qty: v, desc: v + " sp " + q6.desc, group: q6.group, fix: "pokayoke", anim: "defect",
          why: "Phế phẩm trong lúc sản xuất ổn định → tổn thất Q (phế phẩm trong sản xuất)." });
      });
      var good = total - defects, demand = 5 * Math.round(good * (0.88 + Math.random() * 0.24) / 5);
      var m = { id: id, name: pool.name, ideal: ideal, demand: demand, total: total, events: events };
      var r = calc(m, shift);
      if (r.A > 0 && r.A <= 1 && r.P > 0 && r.P <= 1 && r.Q > 0 && r.Q <= 1 && r.run > 0) return m;
    }
    return null;
  }

  function generate(data) {
    return { machines: ["lathe", "mill"].map(function (id) { return genMachine(id, data.pools[id], data.shift); }) };
  }

  return { calc: calc, lossGroups: lossGroups, selfTest: selfTest, generate: generate, round: round };
})();
