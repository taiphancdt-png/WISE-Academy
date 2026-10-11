/* =====================================================================
   MÀN TỔNG HỢP, "THÁNG TPM CỦA XƯỞNG"  ·  KẾT QUẢ, SO SÁNH TRƯỚC/SAU, OPL
   ===================================================================== */
(function () {
  "use strict";
  var T = window.TPM_GAME, D = T.D, C = T.C, U = T.util;
  var $ = U.$, mk = U.mk, esc = U.esc, num = U.num, ic = U.ic, Sound = U.Sound, toast = U.toast, modal = U.modal, closeModal = U.closeModal, clamp = U.clamp, store = U.store;
  function tr(k) { return num(k / 1000, 1) + " tr"; }

  /* ---------- mô hình 1 tuần ----------
     Máy tiện: hỏng kỳ vọng 1,25 lần/tuần × hệ số (AM 0,45 · thay lọc 0,85 · curoa 0,85), cộng dồn, qua mỗi số nguyên là 1 lần hỏng.
     Máy phay: tuần 2 tuột ống (nếu chưa PM ống), tuần 3 lỗi cảm biến, tuần 4 hỏng vòng bi (CBM ≥ 2 tuần + có vòng bi → thay theo kế hoạch). */
  function weekRun(M, w) {
    var cfg = D.month, ev = [], hrs = 0, cost = 0;
    function act(id) { return M.done[id] != null && M.done[id] <= w; }
    function before(id, wk) { return M.done[id] != null && M.done[id] < wk; }
    function loto(t) { if (!M.keep.loto) { if (!M.accident) { M.accident = t; ev.push({ bad: true, t: "TAI NẠN: " + t + " khi sửa chữa mà chưa khoá năng lượng (LOTO)" }); Sound.siren(); } return 0; } return 0.3; }
    // máy tiện
    var mult = (M.keep.am ? 0.45 : 1) * (act("filter") ? 0.85 : 1) * (act("belt") ? 0.85 : 1);
    var prev = Math.floor(M.latheAcc + 1e-9); M.latheAcc += cfg.latheBasePerWeek * mult; var now = Math.floor(M.latheAcc + 1e-9);
    for (var f = prev; f < now; f++) {
      var rh = 4 + loto("thợ bị kẹp tay ở bàn xe dao"); M.latheFails++; M.latheRep += rh; hrs += rh; cost += cfg.breakdownCostK.lathe;
      ev.push({ bad: true, t: "Máy tiện hỏng vặt (" + (M.keep.am ? "ốc lỏng" : "kẹt bàn xe dao do thiếu dầu") + "), sửa " + num(rh, 1) + " giờ" });
    }
    if (now === prev) ev.push({ ok: true, t: "Máy tiện chạy ổn định cả tuần" + (M.keep.am ? ", nhờ AM đầu ca" : "") });
    // máy phay
    var sop = before("sop", w), stockS = M.arrive.sensor != null && M.arrive.sensor <= w, stockB = M.arrive.bearing != null && M.arrive.bearing <= w;
    function millFix(name, diag, wait, rep, partK) {
      var l = loto("thợ bị điện giật nhẹ ở tủ điện máy phay"), h = diag + wait + rep + l;
      M.millRep.push(h); hrs += diag + rep + l; cost += 500 + (wait ? partK : 0);
      ev.push({ bad: true, t: "Máy phay: " + name + ", MTTR " + num(h, 1) + " giờ (chẩn đoán " + num(diag, 1) + " · chờ phụ tùng " + num(wait, 1) + " · sửa " + num(rep, 1) + (l ? " · LOTO 0,3" : "") + ")" });
    }
    if (w === 2) { if (act("hose")) ev.push({ ok: true, t: "PM siết đầu nối ống thủy lực → không bị tuột ống" }); else millFix("tuột ống thủy lực", 0.5, 0, sop ? 0.5 : 1.5, 0); }
    if (w === 3) millFix("cảm biến hành trình lỗi", sop ? 0.5 : 3, stockS ? 0 : 4, sop ? 0.5 : 1.5, 4550);
    if (w === 4) {
      var cbmW = M.cbm.filter(function (x) { return x < 4; }).length;
      if (cbmW >= 2 && stockB) { ev.push({ ok: true, t: "CBM thấy rung trục chính tăng dần → thay vòng bi theo kế hoạch cuối tuần (không phải sự cố)" }); hrs += 2.5; }
      else millFix("vòng bi trục chính hỏng" + (cbmW >= 2 ? " (CBM đã cảnh báo nhưng không có vòng bi)" : ""), sop ? 0.5 : 1.5, stockB ? 0 : 7, sop ? 1.5 : 2.5, 15600);
    }
    return { ev: ev, hrs: hrs, cost: cost };
  }
  function stats(M) {
    var op = D.month.opHours, n = M.millRep.length, rep = M.millRep.reduce(function (a, b) { return a + b; }, 0);
    return { latheF: M.latheFails, latheMTBF: M.latheFails ? op.lathe / M.latheFails : op.lathe, latheMTTR: M.latheFails ? M.latheRep / M.latheFails : 0,
             millN: n, millMTTR: n ? rep / n : 0, millMTBF: n ? op.mill / n : op.mill, cost: M.spent, accident: !!M.accident };
  }

  T.levels.month = { run: function () {
    var S = T.S, cfg = D.month;
    var M = { week: 1, spent: 0, done: {}, keep: {}, cbm: [], arrive: {}, latheAcc: 0, latheFails: 0, latheRep: 0, millRep: [], accident: false, log: [], sel: {}, trend: [] };
    function A(id) { return cfg.actions.filter(function (a) { return a.id === id; })[0]; }
    function planned() { var c = 0, h = 0; Object.keys(M.sel).forEach(function (id) { if (M.sel[id]) { c += A(id).cost; h += A(id).hrs; } }); return { c: c, h: h }; }
    function draw() {
      var st = stats(M), p = planned(), left = cfg.budgetK - M.spent;
      var lMTBF = M.week > 1 ? (M.latheFails ? (cfg.opHours.lathe * (M.week - 1) / 4) / M.latheFails : null) : null;
      T.page(T.coach("owner", M.week === 1 ? "Tháng TPM bắt đầu! Ngân sách bảo trì " + tr(cfg.budgetK) + ", thợ bảo trì có " + cfg.hoursPerWeek + " giờ/tuần. Mục tiêu: máy tiện MTBF ≥ " + D.targets.latheMTBF + " giờ, máy phay MTTR ≤ " + D.targets.millMTTR + " giờ, không vượt ngân sách, <b>không tai nạn</b>. Mỗi tuần chọn việc cần làm rồi bấm chạy tuần." : "Tuần " + M.week + "/4. Xem nhật ký tuần trước rồi quyết định tiếp nhé.", "Tuần " + M.week) +
        '<section class="dash"><div class="dash-top"><div class="dash-t"><i class="led"></i>Tháng TPM<span>' + esc(D.workshop) + ' · tuần ' + M.week + '/4</span></div><div class="wkdots">' + [1, 2, 3, 4].map(function (w) { return '<i class="' + (w < M.week ? "done" : w === M.week ? "on" : "") + '">' + w + '</i>'; }).join("") + '</div></div>' +
        '<div class="mkpi">' +
          kpi("Ngân sách còn", tr(left), left / cfg.budgetK, left < 0 ? "low" : left < cfg.budgetK * .2 ? "mid" : "good", "đã chi " + tr(M.spent)) +
          kpi("Máy tiện · số lần hỏng", st.latheF + " lần", 1 - Math.min(1, st.latheF / 5), st.latheF <= 1 ? "good" : st.latheF <= 2 ? "mid" : "low", "mục tiêu ≤ 2 lần/tháng (MTBF ≥ 200 h)") +
          kpi("Máy phay · MTTR", st.millN ? num(st.millMTTR, 1) + " h" : "chưa hỏng", st.millN ? 1 - Math.min(1, st.millMTTR / 8) : 1, !st.millN || st.millMTTR <= 2 ? "good" : st.millMTTR <= 4 ? "mid" : "low", "mục tiêu ≤ " + D.targets.millMTTR + " giờ") +
          kpi("An toàn", M.accident ? "1 tai nạn" : "0 tai nạn", M.accident ? 0 : 1, M.accident ? "low" : "good", M.keep.loto ? "LOTO đang áp dụng" : "chưa bắt buộc LOTO") +
        '</div></section>' +
        '<div class="mgrid2"><div class="card"><h3><span class="plate">Tuần ' + M.week + '</span>Chọn việc làm trong tuần <small>giờ công ' + num(p.h, 1) + '/' + cfg.hoursPerWeek + ' · chi ' + tr(p.c) + '</small></h3><div class="acts">' +
        cfg.actions.map(function (a) {
          var isDone = a.once && M.done[a.id] != null, on = a.keep ? M.keep[a.id] : M.sel[a.id];
          var st2 = isDone ? "done" : on ? "on" : "";
          var arrive = (a.id === "sensor" || a.id.indexOf("bearing") === 0) && isDone ? " · về kho tuần " + M.done[a.id] + "+" + a.lead : "";
          return '<button class="actcard ' + st2 + '" data-a="' + a.id + '"' + (isDone ? " disabled" : "") + '><i class="box">' + (on || isDone ? ic("check") : "") + '</i><span class="ac-t"><b>' + esc(a.n) + '</b><small>' + esc(a.d) + ' · ' + esc(a.eff) + arrive + '</small></span><span class="ac-c">' + (a.cost ? tr(a.cost) : "0 đ") + (a.hrs ? '<em>' + a.hrs + ' h</em>' : '') + (a.keep ? '<em>' + (on ? "đang áp dụng" : "bật/tắt") + '</em>' : isDone ? '<em>đã làm</em>' : '') + '</span></button>';
        }).join("") + '</div>' +
        (p.h > cfg.hoursPerWeek ? '<p class="feedback no">Vượt ' + num(p.h - cfg.hoursPerWeek, 1) + ' giờ công tuần này, bỏ bớt việc.</p>' : '') +
        '<div class="page-btns"><button class="btn btn-primary btn-lg" id="wkGo"' + (p.h > cfg.hoursPerWeek ? " disabled" : "") + '>' + ic("ff") + 'Chạy tuần ' + M.week + '</button></div></div>' +
        '<div class="card paper"><h3>Nhật ký bảo trì</h3><div class="mlog">' + (M.log.length ? M.log.map(function (w) { return '<div class="mlw"><b>Tuần ' + w.w + '</b>' + w.ev.map(function (e) { return '<p class="' + (e.bad ? "bad" : e.ok ? "ok" : "") + '">' + esc(e.t) + '</p>'; }).join("") + '</div>'; }).reverse().join("") : '<p class="empty">Chưa có sự kiện. Gợi ý: máy tiện “bệnh” MTBF, cần AM + PM; máy phay “bệnh” MTTR, cần phụ tùng, SOP, CBM. Và đừng quên an toàn.</p>') + '</div></div></div>', true);
      document.querySelectorAll(".actcard").forEach(function (b) {
        b.onclick = function () {
          var a = A(b.dataset.a); Sound.click();
          if (a.keep) M.keep[a.id] = !M.keep[a.id]; else M.sel[a.id] = !M.sel[a.id];
          draw();
        };
      });
      $("wkGo").onclick = function () { Sound.click(); runWeek(); };
    }
    function kpi(l, v, f, lv, sub) { return '<div class="kpi k-' + lv + '"><div class="kpi-h"><span>' + l + '</span></div><div class="kpi-v">' + v + '</div><div class="kbar"><i style="width:' + Math.round(clamp(f, 0, 1) * 100) + '%"></i></div><small class="kwc">' + sub + '</small></div>'; }
    function runWeek() {
      var w = M.week;
      Object.keys(M.sel).forEach(function (id) {
        if (!M.sel[id]) return; var a = A(id); M.spent += a.cost;
        if (id === "cbm") M.cbm.push(w); else M.done[id] = w;
        if (a.lead) M.arrive[id === "sensor" ? "sensor" : "bearing"] = Math.min(M.arrive[id === "sensor" ? "sensor" : "bearing"] || 99, w + a.lead);
      });
      M.sel = {};
      var r = weekRun(M, w); M.spent += r.cost;
      if (r.hrs > cfg.hoursPerWeek) r.ev.push({ bad: true, t: "Sửa chữa vượt giờ công, tăng ca " + num(r.hrs - cfg.hoursPerWeek, 1) + " giờ" });
      M.log.push({ w: w, ev: r.ev }); var s = stats(M);
      M.trend.push({ w: w, latheF: s.latheF, millMTTR: s.millMTTR, millN: s.millN });
      r.ev.some(function (e) { return e.bad; }) ? Sound.bell() : Sound.ok();
      if (w >= 4) { finish(); return; }
      M.week++; draw();
    }
    function finish() {
      var s = stats(M), okL = s.latheMTBF >= D.targets.latheMTBF, okM = s.millMTTR <= D.targets.millMTTR, okB = s.cost <= cfg.budgetK, okS = !s.accident;
      var sc = (okL ? 3 : 0) + (okM ? 3 : 0) + (okB ? 2 : 0) + (okS ? 2 : 0);
      S.monthResult = { latheF: s.latheF, latheMTBF: s.latheMTBF, latheMTTR: s.latheMTTR || 4, millN: s.millN, millMTTR: s.millMTTR, millMTBF: s.millMTBF, cost: s.cost, accident: s.accident, trend: M.trend };
      T.setPen("month", s.accident ? 3 : 0);
      var review = '<div class="card"><h3>Kết quả tháng TPM</h3><div class="goals">' +
        goal(okL, "Máy tiện MTBF ≥ " + D.targets.latheMTBF + " giờ", num(s.latheMTBF, 0) + " giờ (" + s.latheF + " lần hỏng)", 3) +
        goal(okM, "Máy phay MTTR ≤ " + D.targets.millMTTR + " giờ", s.millN ? num(s.millMTTR, 1) + " giờ (" + s.millN + " lần hỏng)" : "không hỏng lần nào", 3) +
        goal(okB, "Không vượt ngân sách " + tr(cfg.budgetK), "đã chi " + tr(s.cost), 2) +
        goal(okS, "Không tai nạn", s.accident ? "1 tai nạn (−3 điểm tổng)" : "0 tai nạn", 2) + '</div></div>' +
        '<div class="card paper"><h3>Nhật ký cả tháng</h3><div class="mlog">' + M.log.map(function (w) { return '<div class="mlw"><b>Tuần ' + w.w + '</b>' + w.ev.map(function (e) { return '<p class="' + (e.bad ? "bad" : e.ok ? "ok" : "") + '">' + esc(e.t) + '</p>'; }).join("") + '</div>'; }).join("") + '</div></div>';
      T.endLevel("month", sc, { say: "Bí quyết của tháng: máy tiện cần <b>AM đầu ca + PM thay lọc, curoa</b> để giảm hỏng vặt; máy phay cần <b>phụ tùng loại A có sẵn, SOP + đào tạo, CBM đo rung</b> để sửa nhanh hoặc thay trước khi hỏng; và <b>LOTO bắt buộc</b> cho mọi lần sửa.", sub: [okL, okM, okB, okS].filter(Boolean).length + "/4 mục tiêu đạt", review: review });
    }
    function goal(ok, t, v, p) { return '<div class="goal ' + (ok ? "ok" : "bad") + '"><i>' + (ok ? ic("check") : "✗") + '</i><span><b>' + esc(t) + '</b><small>' + esc(v) + '</small></span><em>' + (ok ? "+" + p : "0") + '</em></div>'; }
    draw();
  } };

  /* ============ KẾT QUẢ ============ */
  function rating(t) { return t >= 90 ? "Chuyên gia TPM" : t >= 70 ? "Đạt" : "Cần học thêm"; }
  function compare() {
    var L0 = C.logStats(D.logs.lathe), M0 = C.logStats(D.logs.mill), R = T.S.monthResult || { latheMTBF: 80, latheMTTR: 4, millMTTR: 6, millMTBF: 140, cost: 0, millN: 3 };
    var la1 = C.availability(R.latheMTBF, R.latheMTTR || 4), mi1 = R.millN ? C.availability(R.millMTBF, R.millMTTR) : 1;
    var rows = [
      ["MTBF máy tiện", num(L0.mtbf, 0) + " h", num(R.latheMTBF, 0) + " h", R.latheMTBF >= L0.mtbf],
      ["MTTR máy tiện", num(L0.mttr, 1) + " h", num(R.latheMTTR || 4, 1) + " h", (R.latheMTTR || 4) <= L0.mttr],
      ["MTBF máy phay", num(M0.mtbf, 0) + " h", num(R.millMTBF, 0) + " h", R.millMTBF >= M0.mtbf],
      ["MTTR máy phay", num(M0.mttr, 1) + " h", R.millN ? num(R.millMTTR, 1) + " h" : "không hỏng", !R.millN || R.millMTTR <= M0.mttr],
      ["Độ sẵn sàng máy tiện", num(L0.avail * 100, 1) + "%", num(la1 * 100, 1) + "%", la1 >= L0.avail],
      ["Độ sẵn sàng máy phay", num(M0.avail * 100, 1) + "%", num(mi1 * 100, 1) + "%", mi1 >= M0.avail],
      ["Chi phí bảo trì / tháng", tr(D.before.lathe.maintCostK + D.before.mill.maintCostK), tr(R.cost), R.cost <= D.before.lathe.maintCostK + D.before.mill.maintCostK],
      ["OEE máy tiện (ước tính)", num(D.before.lathe.oee, 1) + "%", num(D.before.lathe.oee * la1 / L0.avail, 1) + "%", la1 >= L0.avail],
      ["OEE máy phay (ước tính)", num(D.before.mill.oee, 1) + "%", num(D.before.mill.oee * mi1 / M0.avail, 1) + "%", mi1 >= M0.avail]
    ];
    return { rows: rows, la1: la1, mi1: mi1, R: R };
  }
  function trendChart(R) {
    var t = R.trend || [], W = 560, H = 200, x0 = 60, sx = 110, op = D.month.opHours;
    var pts = [{ w: 0, mtbf: 80, mttr: 6 }].concat(t.map(function (r) { return { w: r.w, mtbf: r.latheF ? op.lathe * r.w / 4 / r.latheF : op.lathe * r.w / 4, mttr: r.millN ? r.millMTTR : 0 }; }));
    var yB = function (v) { return 160 - Math.min(v, 400) / 400 * 130; }, yR = function (v) { return 160 - Math.min(v, 8) / 8 * 130; };
    var o = '<svg class="cc" viewBox="0 0 ' + W + ' ' + H + '">';
    [0, 100, 200, 300, 400].forEach(function (v) { o += '<line x1="' + x0 + '" x2="' + (W - 40) + '" y1="' + yB(v) + '" y2="' + yB(v) + '" class="grid"/><text x="' + (x0 - 6) + '" y="' + (yB(v) + 4) + '" class="wfl" text-anchor="end">' + v + 'h</text>'; });
    o += '<line x1="' + x0 + '" x2="' + (W - 40) + '" y1="' + yB(200) + '" y2="' + yB(200) + '" class="wcline"/>';
    o += '<polyline points="' + pts.map(function (p) { return (x0 + p.w * sx) + "," + yB(p.mtbf); }).join(" ") + '" class="tl-b"/>';
    // MTTR chỉ vẽ ở các tuần đã có lần hỏng (tuần chưa hỏng thì chưa có MTTR), trục phải 0-8 giờ
    var pr = pts.filter(function (p) { return p.w === 0 || p.mttr > 0; });
    [0, 2, 4, 6, 8].forEach(function (v) { o += '<text x="' + (W - 34) + '" y="' + (yR(v) + 4) + '" class="wfl" style="fill:#FF9A5C" text-anchor="start">' + v + 'h</text>'; });
    o += '<polyline points="' + pr.map(function (p) { return (x0 + p.w * sx) + "," + yR(p.mttr); }).join(" ") + '" class="tl-r"/>';
    pts.forEach(function (p) { o += '<circle cx="' + (x0 + p.w * sx) + '" cy="' + yB(p.mtbf) + '" r="4" class="tl-bd"/><text x="' + (x0 + p.w * sx) + '" y="182" class="wfl">' + (p.w ? "Tuần " + p.w : "Tháng trước") + '</text>'; });
    pr.forEach(function (p) { o += '<circle cx="' + (x0 + p.w * sx) + '" cy="' + yR(p.mttr) + '" r="4" class="tl-rd"/>'; });
    return o + '</svg><div class="lgd"><span><i style="background:#3C8CE0"></i>MTBF máy tiện (giờ)</span><span><i style="background:#FF7D33"></i>MTTR máy phay (trục phải, giờ)</span><span><i style="background:#3DDC84"></i>Mục tiêu MTBF 200 h</span></div>';
  }

  T.finish = function () {
    var S = T.S, sec = T.elapsed();
    var bonus = sec <= 25 * 60 ? D.scoring.timeBonus : sec >= 45 * 60 ? 0 : D.scoring.timeBonus * (45 * 60 - sec) / (20 * 60);
    var base = 0; T.LEVELS.forEach(function (l) { base += S.scores[l.k] || 0; });
    var total = Math.max(0, Math.min(100, Math.round(base + bonus - S.penalty))), rt = rating(total);
    var best = store(T.keys.BEST_KEY) || {}, prev = best[T.player] || 0; if (total > prev) { best[T.player] = total; store(T.keys.BEST_KEY, best); }
    window.WISE_LMS.sendResult({ player: T.player, score: total, rating: rt, timeSec: Math.round(sec),
      breakdown: { am: S.scores.am || 0, pm: S.scores.pm || 0, rm: S.scores.rm || 0, linhKien: S.scores.parts || 0, mtbfMttr: S.scores.mtbf || 0, kaizen: S.scores.kaizen || 0, thangTpm: S.scores.month || 0, thuongThoiGian: Math.round(bonus * 10) / 10, truAnToan: S.penalty },
      finishedAt: new Date().toISOString() });
    var cmp = compare(), cls = total >= 90 ? "r1" : total >= 70 ? "r2" : "r3", medal = total >= 90 ? ["#FFE27A", "#E7A812"] : total >= 70 ? ["#E9EEF3", "#9AA8B6"] : ["#F0B98A", "#B5733D"];
    var colors = ["#2E9A57", "#3C8CE0", "#D9412F", "#E7A812", "#8A4FD8", "#14558F", "#F76011"];
    $("result").innerHTML =
      '<div class="res-hero"><div class="res-char" id="resChar"></div><div class="res-main"><div class="res-title">Thử thách TPM · ' + esc(T.player) + '</div>' +
      '<div class="res-score"><span id="scoreNum">0</span><small>/100</small></div><div class="stars" id="stars">' + [0, 1, 2].map(function () { return '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6L2.5 9.3l6.6-.8z" fill="#FFD24A" stroke="#C99A12" stroke-width="1"/></svg>'; }).join("") + '</div>' +
      '<span class="stamp ' + cls + '"><small>Kết quả đánh giá</small>' + rt + '</span><div class="res-meta">Kỷ lục: ' + Math.max(prev, total) + ' · thời gian ' + U.fmtTime(sec) + '</div></div>' +
      '<svg class="medal" viewBox="0 0 86 110"><path d="M22 0h16l8 34H30z" fill="#F76011"/><path d="M48 0h16l-8 34H40z" fill="#0B4278"/><circle cx="43" cy="68" r="34" fill="' + medal[1] + '"/><circle cx="43" cy="68" r="28" fill="' + medal[0] + '"/><text x="43" y="76" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="' + medal[1] + '">TPM</text></svg></div>' +
      '<div class="res-grid"><div class="card"><h2>Điểm từng màn</h2>' + T.LEVELS.filter(function (l) { return l.max; }).map(function (l, i) {
        var v = S.scores[l.k] || 0; return '<div class="srow2"><span>' + l.tag + ' · ' + esc(l.n) + '</span><div class="bar"><i style="background:' + colors[i] + '" data-w="' + (v / l.max * 100) + '"></i></div><b>' + num(v, 1) + '<small>/' + l.max + '</small></b></div>';
      }).join("") + '<div class="srow2"><span>Thưởng thời gian</span><div class="bar"><i style="background:#5A6672" data-w="' + (bonus / D.scoring.timeBonus * 100) + '"></i></div><b>+' + num(bonus, 1) + '</b></div>' +
      (S.penalty ? '<div class="srow2 pen"><span>Trừ điểm an toàn</span><div class="bar"></div><b>−' + S.penalty + '</b></div>' : '') +
      '<p class="small-note">Xếp loại: Chuyên gia TPM ≥ 90 · Đạt 70-89 · Cần học thêm &lt; 70</p></div>' +
      '<div class="card paper"><h2>Bài học rút ra</h2><ul class="takeaways">' + D.lessons.map(function (l) { return '<li><b>' + esc(l.t) + ':</b> ' + esc(l.d) + '</li>'; }).join("") + '</ul><div class="page-btns"><button class="btn btn-dark" id="oplDl">' + ic("download") + 'Tải OPL 1 trang</button></div></div></div>' +
      '<section class="dash"><div class="dash-top"><div class="dash-t"><i class="led"></i>Bảng TPM · trước và sau<span>' + esc(D.workshop) + '</span></div></div>' +
      '<div class="gauges">' +
        T.gauge({ v: cmp.R.latheMTBF, max: 400, txt: num(cmp.R.latheMTBF, 0) + '<small>h</small>', label: "MTBF TIỆN", lv: cmp.R.latheMTBF >= 200 ? "good" : cmp.R.latheMTBF >= 120 ? "mid" : "low", mark: 200 }) +
        T.gauge({ v: 8 - Math.min(8, cmp.R.millMTTR || 0), max: 8, txt: (cmp.R.millN ? num(cmp.R.millMTTR, 1) : "0") + '<small>h</small>', label: "MTTR PHAY", lv: !cmp.R.millN || cmp.R.millMTTR <= 2 ? "good" : cmp.R.millMTTR <= 4 ? "mid" : "low", mark: 6 }) +
        T.gauge({ v: cmp.la1 * 100, max: 100, txt: num(cmp.la1 * 100, 1) + '<small>%</small>', label: "SẴN SÀNG TIỆN", lv: cmp.la1 >= .98 ? "good" : cmp.la1 >= .95 ? "mid" : "low", mark: 98 }) +
        T.gauge({ v: cmp.mi1 * 100, max: 100, txt: num(cmp.mi1 * 100, 1) + '<small>%</small>', label: "SẴN SÀNG PHAY", lv: cmp.mi1 >= .98 ? "good" : cmp.mi1 >= .95 ? "mid" : "low", mark: 98 }) +
      '</div><div class="dash-grid"><div class="dm"><div class="hmi-l">Chỉ số trước / sau TPM</div><table class="batable"><thead><tr><th></th><th>Trước TPM</th><th>Sau 1 tháng</th></tr></thead><tbody>' +
        cmp.rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="' + (r[3] ? "good" : "bad") + '">' + r[2] + '</td></tr>'; }).join("") + '</tbody></table></div>' +
      '<div class="dm"><div class="hmi-l">Xu hướng theo tuần</div>' + trendChart(cmp.R) + '</div></div></section>' +
      '<div class="res-actions"><button class="btn btn-primary btn-lg" id="again">' + ic("redo") + 'Chơi lại · kịch bản mới</button><button class="btn btn-dark btn-lg" id="libR">' + ic("book") + 'Xem bài học TPM</button>' +
      '<a class="btn btn-ghost btn-lg" href="../thu-thach-5s/index.html">' + ic("gear") + 'Quay về game 5S</a><a class="btn btn-ghost btn-lg" href="../thu-thach-oee/index.html">' + ic("chart") + 'Quay về game OEE</a></div>';
    U.show("scr-result"); $("scr-result").scrollTop = 0;
    var w = window.createCharacter(); w.classList.add(total >= 70 ? "celebrate" : "scratch"); $("resChar").appendChild(w);
    var el = $("scoreNum"), t0 = performance.now();
    (function step(now) { var k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(total * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
    var stars = total >= 90 ? 3 : total >= 70 ? 2 : total >= 40 ? 1 : 0, sv = $("stars").querySelectorAll("svg");
    for (var i = 0; i < stars; i++) (function (i) { setTimeout(function () { sv[i].classList.add("on"); Sound.tone(880 + i * 220, .15, "triangle", .1); }, 900 + i * 300); })(i);
    setTimeout(function () { document.querySelectorAll(".srow2 .bar i").forEach(function (b) { b.style.width = b.dataset.w + "%"; }); }, 300);
    if (total >= 70) setTimeout(function () { Sound.win(); confetti(total >= 90 ? 140 : 70); }, 700); else setTimeout(function () { Sound.meh(); }, 700);
    $("again").onclick = function () { Sound.click(); T.restart(); };
    $("libR").onclick = T.library;
    $("oplDl").onclick = function () { downloadOPL(total, rt, cmp); };
  };
  function confetti(n) {
    var box = $("confetti"), cols = ["#F76011", "#FFD24A", "#2E9A57", "#2F78C4", "#E0552A", "#FFFFFF", "#8A4FD8"]; box.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var c = mk("i"); c.style.left = U.rnd(0, 100) + "vw"; c.style.background = cols[i % cols.length];
      c.style.setProperty("--dx", U.rnd(-120, 120) + "px"); c.style.setProperty("--rot", U.rnd(360, 1080) + "deg");
      c.style.animationDuration = U.rnd(2.2, 4) + "s"; c.style.animationDelay = U.rnd(0, .8) + "s"; c.style.width = U.rnd(6, 12) + "px"; c.style.height = U.rnd(8, 16) + "px";
      box.appendChild(c);
    }
    setTimeout(function () { box.innerHTML = ""; }, 5200);
  }

  /* OPL, bài học một điểm, 1 trang HTML in được */
  function downloadOPL(total, rt, cmp) {
    var d = new Date(), date = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    var html = '<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>OPL, TPM, ' + esc(T.player) + '</title><style>' +
      '@page{size:A4;margin:12mm}body{font-family:"Be Vietnam Pro",Segoe UI,Arial,sans-serif;color:#14243A;margin:0;padding:18px;max-width:780px;margin:auto}' +
      '.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:6px solid #F76011;padding-bottom:8px}h1{font-size:26px;margin:0;color:#002F5B;text-transform:uppercase}h1 small{display:block;font-size:13px;color:#F76011;letter-spacing:2px}' +
      '.meta{text-align:right;font-size:12px;color:#5B6878}.sec{margin-top:14px}.sec h2{font-size:15px;text-transform:uppercase;background:#002F5B;color:#fff;padding:5px 10px;margin:0 0 8px}' +
      'ol{margin:0;padding-left:20px}li{margin:5px 0;font-size:13.5px;line-height:1.45}.f{display:grid;grid-template-columns:1fr 1fr;gap:6px}.f div{border:1.5px solid #002F5B;padding:6px 8px;font-size:13px}.f b{color:#F76011}' +
      'table{width:100%;border-collapse:collapse;font-size:12.5px}td,th{border:1px solid #C9D3DD;padding:5px 8px;text-align:left}th{background:#EEF2F6}.tags{display:flex;gap:8px}.tags span{flex:1;padding:6px;font-weight:700;font-size:12.5px;color:#fff;text-align:center}' +
      '.foot{margin-top:14px;font-size:11px;color:#5B6878;border-top:1px solid #C9D3DD;padding-top:6px}</style></head><body>' +
      '<div class="top"><h1><small>Bài học một điểm · OPL</small>TPM, Bảo trì năng suất toàn diện</h1><div class="meta">' + esc(D.workshop) + '<br>Học viên: <b>' + esc(T.player) + '</b><br>Ngày: ' + date + ' · Điểm: <b>' + total + '/100, ' + esc(rt) + '</b></div></div>' +
      '<div class="sec"><h2>Mục tiêu</h2><div class="tags"><span style="background:#2E9A57">Zero hỏng hóc</span><span style="background:#2F78C4">Zero lỗi</span><span style="background:#D9412F">Zero tai nạn</span></div></div>' +
      '<div class="sec"><h2>7 điều cần nhớ</h2><ol>' + D.lessons.map(function (l) { return '<li><b>' + esc(l.t) + ':</b> ' + esc(l.d) + '</li>'; }).join("") + '</ol></div>' +
      '<div class="sec"><h2>Công thức</h2><div class="f"><div><b>MTBF</b> = Giờ vận hành ÷ Số lần hỏng (càng cao càng tốt)</div><div><b>MTTR</b> = Giờ sửa chữa ÷ Số lần hỏng (càng thấp càng tốt)</div><div><b>Độ sẵn sàng</b> = MTBF ÷ (MTBF + MTTR)</div><div><b>Min (ROP)</b> = Dùng/ngày × Lead time + Tồn an toàn · <b>Max</b> = Min + Lượng đặt</div></div></div>' +
      '<div class="sec"><h2>AM hằng ngày, CILT</h2><table><tr><th>Vệ sinh</th><th>Kiểm tra</th><th>Bôi trơn</th><th>Siết chặt</th></tr><tr><td>Vệ sinh là kiểm tra, thấy vết xước, rò rỉ</td><td>Áp suất, lọc, curoa, tiếng kêu</td><td>Mức dầu đến vạch MAX, vú mỡ</td><td>Ốc theo dấu khớp</td></tr></table><p style="font-size:12.5px">Thẻ <b style="color:#2E9A57">XANH</b>: người vận hành tự xử lý · Thẻ <b style="color:#D9412F">ĐỎ</b>: chuyển bộ phận bảo trì · Sự cố: Báo hỏng → <b>LOTO</b> → Chẩn đoán → Phụ tùng → Sửa → Chạy thử → Bàn giao → Ghi nhật ký</p></div>' +
      '<div class="sec"><h2>Kết quả của tôi, trước / sau TPM</h2><table><tr><th>Chỉ số</th><th>Trước</th><th>Sau 1 tháng</th></tr>' + cmp.rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join("") + '</table></div>' +
      '<div class="foot">WISE Academy · Chuỗi game đào tạo Xưởng Cơ Khí Sáu Tài · Game 3: Thử thách TPM</div></body></html>';
    var blob = new Blob([html], { type: "text/html;charset=utf-8" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "OPL-TPM-" + T.player.replace(/[^\wÀ-ỹ]+/g, "-") + ".html"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast("Đã tải OPL, mở file và bấm In (Ctrl+P) để ra 1 trang A4.");
  }
})();
