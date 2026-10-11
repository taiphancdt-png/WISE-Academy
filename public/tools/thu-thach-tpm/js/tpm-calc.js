/* =====================================================================
   HÀM TÍNH TPM, tách riêng để kiểm tra độc lập
   ---------------------------------------------------------------------
     MTBF  = Tổng thời gian vận hành / Số lần hỏng        (càng CAO càng tốt)
     MTTR  = Tổng thời gian sửa chữa / Số lần hỏng         (càng THẤP càng tốt)
     Độ sẵn sàng thiết bị = MTBF / (MTBF + MTTR)
     Min (ROP) = Mức dùng/ngày × Lead time + Tồn kho an toàn
     Max       = Min + Lượng đặt mỗi lần
   Kiểm tra tự động: TPM_CALC.selfTest(TPM_DATA)
   ===================================================================== */
window.TPM_CALC = (function () {
  "use strict";
  function round(v, d) { var k = Math.pow(10, d || 0); return Math.round(v * k) / k; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- công thức cơ bản ---------- */
  function mtbf(opHours, failures) { return failures > 0 ? opHours / failures : opHours; }
  function mttr(repairHours, failures) { return failures > 0 ? repairHours / failures : 0; }
  function availability(MTBF, MTTR) { return MTBF / (MTBF + MTTR); }
  function rop(usePerDay, leadDays, safety) { return usePerDay * leadDays + safety; }
  function maxStock(ROP, orderQty) { return ROP + orderQty; }

  /* Thống kê nhật ký 1 máy */
  function logStats(log) {
    var n = log.events.length, rep = log.events.reduce(function (s, e) { return s + e.h; }, 0);
    var b = mtbf(log.opHours, n), r = mttr(rep, n);
    return { op: log.opHours, n: n, rep: rep, mtbf: b, mttr: r, avail: availability(b, r) };
  }
  function partLevels(p) { var m = rop(p.use, p.lead, p.safety); return { min: m, max: maxStock(m, p.q) }; }

  /* ---------- kiểm tra tự động với số liệu mẫu ---------- */
  function selfTest(D) {
    var out = [], ok = true;
    function chk(name, got, exp) { var pass = Math.abs(got - exp) < 1e-9; if (!pass) ok = false; out.push((pass ? "✔ " : "✘ ") + name + " = " + round(got, 2) + (pass ? "" : " (mong đợi " + exp + ")")); }
    var L = logStats(D.logs.lathe), M = logStats(D.logs.mill);
    chk("Máy tiện · MTBF (giờ)", L.mtbf, 80); chk("Máy tiện · MTTR (giờ)", L.mttr, 4); chk("Máy tiện · Độ sẵn sàng (%)", round(L.avail * 100, 1), 95.2);
    chk("Máy phay · MTBF (giờ)", M.mtbf, 140); chk("Máy phay · MTTR (giờ)", M.mttr, 6); chk("Máy phay · Độ sẵn sàng (%)", round(M.avail * 100, 1), 95.9);
    var exp = { insert: [30, 60], filter: [1, 2], belt: [1, 2], bearing: [1, 2], sensor: [1, 2], oil: [3.5, 10] };
    D.parts.items.forEach(function (p) { var l = partLevels(p); chk(p.n + " · Min (ROP)", l.min, exp[p.id][0]); chk(p.n + " · Max", l.max, exp[p.id][1]); });
    return { ok: ok, lines: out };
  }

  /* ---------- sinh kịch bản ngẫu nhiên khi chơi lại ---------- */
  var LATHE_POOL = ["Kẹt bàn xe dao, rãnh trượt thiếu dầu", "Lỏng ốc bắt dao gây rung, sản phẩm rỗ", "Quá nhiệt bơm dầu do lọc nghẹt", "Đứt dây curoa trục chính", "Kẹt gạt phoi, xước rãnh trượt", "Lỏng ốc nắp che, curoa trượt"];
  var MILL_POOL = [["Vòng bi trục chính hỏng (chờ mua vòng bi)", 8, 11], ["Cảm biến hành trình lỗi, dò lỗi lâu do không có tài liệu", 4, 6], ["Tuột ống thủy lực", 2.5, 3.5], ["Lỗi bộ thay dao tự động, không có SOP", 4, 6]];
  function generateLogs() {
    // máy tiện: hỏng vặt nhiều (MTBF thấp), sửa nhanh
    var n = rint(4, 6), op = 10 * rint(38, 42), lathe = [], used = {};
    var mustKet = rint(1, 2);
    for (var i = 0; i < n; i++) {
      var desc = i < mustKet ? LATHE_POOL[0] : pick(LATHE_POOL.slice(1));
      var day; do { day = rint(1, 28); } while (used[day]); used[day] = 1;
      lathe.push({ day: day, desc: desc, h: rint(4, 10) / 2 });
    }
    lathe.sort(function (a, b) { return a.day - b.day; });
    // máy phay: ít hỏng (MTBF cao), sửa lâu (MTTR cao)
    var m = rint(2, 3), opm = 10 * rint(40, 44), mill = [], pool = shuffle(MILL_POOL.slice(1)), u2 = {};
    var list = [MILL_POOL[0]].concat(pool.slice(0, m - 1));
    list.forEach(function (x) { var d; do { d = rint(2, 27); } while (u2[d]); u2[d] = 1; mill.push({ day: d, desc: x[0], h: rint(x[1] * 2, x[2] * 2) / 2 }); });
    mill.sort(function (a, b) { return a.day - b.day; });
    return { lathe: { name: "Máy tiện CNC", opHours: op, events: lathe }, mill: { name: "Máy phay CNC", opHours: opm, events: mill } };
  }
  function generateParts(D) {
    return D.parts.items.map(function (p) {
      var c = JSON.parse(JSON.stringify(p));
      if (p.id === "insert") { c.use = rint(3, 6); c.lead = rint(3, 7); c.safety = 2 * rint(4, 8); c.q = 5 * Math.round(c.use * c.lead * 1.4 / 5) || 10; c.useTxt = c.use + " cái/ngày"; }
      if (p.id === "oil") { c.use = pick([0.5, 1]); c.lead = rint(2, 5); c.safety = rint(1, 3); c.q = c.use * 10; c.useTxt = String(c.use).replace(".", ",") + " lít/ngày"; }
      return c;
    });
  }

  /* ---------- mô phỏng kho 30 ngày ----------
     levels: {id: {min, max}} người chơi đặt. Bắt đầu với tồn = Max.
     Hết hàng tiêu hao → máy dừng 8 giờ/ngày thiếu. Phụ tùng dự phòng cần mà hết → chờ mua gấp urgentH giờ. */
  function simulateParts(items, levels, days) {
    days = days || 30;
    var res = { downHours: 0, events: [], capitalK: 0, series: {} };
    var totalValue = 0;
    items.forEach(function (p) {
      var L = levels[p.id], stock = L.max, pending = [], s = [];
      for (var d = 1; d <= days; d++) {
        pending = pending.filter(function (o) { if (o.day <= d) { stock += o.qty; return false; } return true; });
        if (p.use > 0) {
          if (stock >= p.use) stock -= p.use;
          else { var lack = 1 - stock / p.use; stock = 0; var h = Math.round(8 * lack * 10) / 10; res.downHours += h; res.events.push({ day: d, part: p.n, txt: "Hết " + p.n.toLowerCase() + ", máy dừng " + String(h).replace(".", ",") + " giờ" }); }
        }
        (p.need || []).forEach(function (nd) {
          if (nd === d) {
            if (stock >= 1) { stock -= 1; res.events.push({ day: d, part: p.n, ok: true, txt: "Cần " + p.n.toLowerCase() + ", có sẵn trong kho" }); }
            else { var w = p.urgentH || 8; res.downHours += w; res.events.push({ day: d, part: p.n, txt: "Cần " + p.n.toLowerCase() + " nhưng kho hết, chờ mua gấp " + w + " giờ" }); }
          }
        });
        var onOrder = pending.reduce(function (a, o) { return a + o.qty; }, 0);
        if (stock + onOrder <= L.min + 1e-9 && L.max > stock + onOrder) pending.push({ day: d + p.lead, qty: L.max - stock - onOrder });
        s.push(stock); totalValue += stock * p.price;
      }
      res.series[p.id] = s;
    });
    res.capitalK = totalValue / days;
    res.downHours = Math.round(res.downHours * 10) / 10;
    res.events.sort(function (a, b) { return a.day - b.day; });
    return res;
  }

  /* ---------- mô phỏng 3 tháng theo lịch PM ----------
     place: {taskId: {f, w}} · trả về số lần hỏng mỗi tháng của từng máy */
  function pmSim(tasks, place, base) {
    var ramp = [0.5, 0.85, 1];
    function run(credit) {
      var red = { lathe: 0, mill: 0 };
      // hệ số hiệu quả: PM giảm được phần lớn, không phải toàn bộ, các lần hỏng
      tasks.forEach(function (t) { var c = credit(t); red.lathe += 0.75 * t.wl * c; red.mill += 0.6 * t.wm * c; });
      return {
        lathe: ramp.map(function (r) { return Math.max(0.4, base.lathe - red.lathe * r); }),
        mill: ramp.map(function (r) { return Math.max(0.3, base.mill - red.mill * r); })
      };
    }
    return {
      none: { lathe: [base.lathe, base.lathe, base.lathe], mill: [base.mill, base.mill, base.mill] },
      yours: run(function (t) { var p = place[t.id]; if (!p) return 0; return (p.f === t.f ? 0.6 : 0) + (p.w === t.w ? 0.4 : 0); }),
      ideal: run(function () { return 1; })
    };
  }

  return { round: round, mtbf: mtbf, mttr: mttr, availability: availability, rop: rop, maxStock: maxStock,
           logStats: logStats, partLevels: partLevels, selfTest: selfTest,
           generateLogs: generateLogs, generateParts: generateParts, simulateParts: simulateParts, pmSim: pmSim };
})();
