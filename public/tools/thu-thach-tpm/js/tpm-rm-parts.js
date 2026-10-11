/* =====================================================================
   MÀN 3, RM "SỰ CỐ KHẨN CẤP"  ·  MÀN 4, "KHO PHỤ TÙNG"
   ===================================================================== */
(function () {
  "use strict";
  var T = window.TPM_GAME, D = T.D, C = T.C, U = T.util;
  var $ = U.$, mk = U.mk, esc = U.esc, num = U.num, ic = U.ic, Sound = U.Sound, toast = U.toast, modal = U.modal, closeModal = U.closeModal, clamp = U.clamp, parseNum = U.parseNum;
  function hh(h) { var m = Math.round(h * 60); return Math.floor(m / 60) + ":" + ("0" + m % 60).slice(-2); }
  T.hh = hh;

  /* độ dài dãy con chung dài nhất, chấm thứ tự các bước */
  function lcs(a, b) { var d = []; for (var i = 0; i <= a.length; i++) { d.push([]); for (var j = 0; j <= b.length; j++) d[i].push(i && j ? (a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1])) : 0); } return d[a.length][b.length]; }

  /* ============ MÀN 3, RM ============ */
  T.levels.rm = { run: function () {
    var S = T.S, cfg = D.rm, inc = S.scen.incident, seq = [], pool = U.shuffle(cfg.steps.concat(cfg.distractors)), t0 = Date.now(), plan = 0, clockI = null, alarmI = null, phase = "plan";
    var res = { hours: 0, wait: 0, diagTries: 0, clues: {}, safety: false, log: [] };
    T.setPen("rm", 0);
    function stepById(id) { return pool.filter(function (s) { return s.id === id; })[0]; }
    T.page(T.coach("engineer", "Máy phay báo động đỏ! Đồng hồ dừng máy đang chạy, mỗi giây suy nghĩ là thêm thời gian dừng. Hãy <b>xếp đúng trình tự xử lý sự cố</b> (bấm thẻ để đưa vào quy trình), rồi bấm Thực hiện. <b>An toàn là trên hết.</b>", "Khẩn cấp") +
      '<div class="rm-wrap"><div class="rm-left"><div class="alarmbar"><span class="al-dot"></span><b>' + esc(inc.machine) + '</b><span class="al-code">' + esc(inc.code) + '</span></div>' +
      '<div class="simview rmview" id="rmView"><div id="rmScene" class="scene"></div><div class="cctv"><span class="rec"><i></i>REC</span><span>CAM 03 · MÁY PHAY</span></div><div class="scan"></div><div class="redflash"></div></div>' +
      '<div class="dtbox"><div class="clockbox big"><span class="lbl2">Thời gian dừng máy</span><b id="rmClock">0:00</b><span class="lbl2">giờ:phút</span></div><div class="dtlog" id="rmLog"><p>Đang chờ xử lý…</p></div></div></div>' +
      '<div class="rm-right"><div class="card"><h3><span class="plate">Quy trình</span>Trình tự xử lý của bạn</h3><ol class="timeline" id="rmSeq"></ol></div>' +
      '<div class="card tray-card"><div class="tray-head"><span class="plate">Thẻ công việc</span><span>bấm để thêm / bớt</span></div><div class="steppool" id="rmPool"></div></div>' +
      '<div class="m2-foot"><p class="small-note" id="rmMsg">Chọn đủ 8 bước rồi bấm Thực hiện. Có 2 thẻ gây nhiễu!</p><button class="btn btn-primary btn-lg" id="rmGo" disabled>' + ic("ff") + 'Thực hiện</button></div></div></div>', true);
    var ws = T.buildWorkshop($("rmScene"), true), mm = ws.m.mill;
    mm.andon.className = "andon on-r"; if (inc.id === "bearing") mm.smoke.classList.add("on"); mm.worker.classList.add("scratch");
    ws.m.lathe.andon.className = "andon on-g"; ws.m.lathe.img.classList.add("run"); ws.m.lathe.sparks.classList.add("on"); ws.m.lathe.chips.classList.add("on");
    (function fit() { var v = $("rmView"), C2 = { x: 520, y: 250, w: 380, h: 330 }, s = Math.min(v.clientWidth / C2.w, v.clientHeight / C2.h); $("rmScene").style.transform = "translate(" + (v.clientWidth / 2 - C2.x * s) + "px," + (v.clientHeight / 2 - C2.y * s) + "px) scale(" + s + ")"; })();
    Sound.init(); Sound.siren(); alarmI = setInterval(function () { if (phase === "plan") Sound.beepAlarm(); }, 6000);
    clockI = setInterval(function () { if (phase === "plan") { plan = (Date.now() - t0) / 1000 / 60; } if ($("rmClock")) $("rmClock").textContent = hh(plan + res.hours + res.wait); }, 300);
    T.onLeave = function () { clearInterval(clockI); clearInterval(alarmI); };
    function log(t, cls) { res.log.push(t); var el = mk("p", cls || "", t); $("rmLog").appendChild(el); $("rmLog").scrollTop = 1e6; }
    $("rmLog").innerHTML = "";
    log("Máy phay dừng, " + inc.code, "bad");

    function draw() {
      $("rmSeq").innerHTML = seq.map(function (id, i) { var s = stepById(id); return '<li class="tl-step' + (s.loto ? " loto" : "") + '" data-id="' + id + '"><b>' + (i + 1) + '</b><span>' + esc(s.n) + '<small>' + esc(s.d) + '</small></span><i class="x">×</i></li>'; }).join("") +
        (seq.length < 8 ? '<li class="tl-empty"><b>' + (seq.length + 1) + '</b><span>Bấm thẻ bên dưới để thêm bước tiếp theo</span></li>' : "");
      $("rmPool").innerHTML = pool.filter(function (s) { return seq.indexOf(s.id) < 0; }).map(function (s) { return '<button class="stepcard' + (s.loto ? " loto" : "") + '" data-id="' + s.id + '">' + (s.loto ? ic("loto") : s.diag ? ic("search") : s.part ? ic("box") : ic("setup")) + '<span><b>' + esc(s.n) + '</b><small>' + esc(s.d) + '</small></span></button>'; }).join("");
      $("rmGo").disabled = seq.length < 8;
      $("rmSeq").querySelectorAll(".tl-step").forEach(function (li) { li.onclick = function () { if (phase !== "plan") return; Sound.click(); seq.splice(seq.indexOf(li.dataset.id), 1); draw(); }; });
      $("rmPool").querySelectorAll(".stepcard").forEach(function (b) { b.onclick = function () { if (phase !== "plan" || seq.length >= 8) return; Sound.drop(); seq.push(b.dataset.id); draw(); }; });
    }
    draw();
    $("rmGo").onclick = function () { phase = "run"; Sound.click(); $("rmGo").disabled = true; $("rmMsg").textContent = "Đang thực hiện quy trình…"; log("Thời gian suy nghĩ lên phương án: " + Math.round(plan * 60) + " phút"); run(0); };

    var lotoDone = false;
    function run(i) {
      document.querySelectorAll("#rmSeq .tl-step").forEach(function (li, k) { li.classList.toggle("now", k === i); li.classList.toggle("past", k < i); });
      if (i >= seq.length) { end(); return; }
      var s = stepById(seq[i]);
      setTimeout(function () {
        if (s.id === "x1") { res.hours += 1; log("Bật máy chạy thử khi chưa sửa → hỏng nặng thêm, mất thêm 1 giờ", "bad"); Sound.no(); return run(i + 1); }
        if (s.id === "x2") { violation("Mở cửa máy khi trục chính còn quay", function () { run(i + 1); }); return; }
        if (s.loto) { lotoDone = true; res.hours += s.h; log("Đã khoá năng lượng, treo thẻ LOTO (" + hh(s.h) + ")", "ok"); Sound.wrench(); if (T.S && $("rmScene")) mm.andon.className = "andon on-b"; return run(i + 1); }
        if ((s.diag || s.id === "s5") && !lotoDone && !s.warned) { s.warned = true; violation(s.diag ? "Chẩn đoán, mở nắp máy khi chưa khoá năng lượng" : "Sửa chữa khi chưa khoá năng lượng (LOTO)", function () { exec(); }); return; }
        exec();
        function exec() {
        if (s.diag) { diagnose(function () { res.hours += s.h; run(i + 1); }); return; }
        if (s.part) {
          res.hours += s.h;
          if (inc.stock > 0) log("Kho có sẵn " + inc.part.toLowerCase() + ", xuất kho ngay", "ok");
          else { res.wait += inc.waitHours; log("Kho HẾT " + inc.part.toLowerCase() + " → chờ mua gấp " + inc.waitHours + " giờ", "bad"); Sound.no(); }
          return run(i + 1);
        }
        if (s.id === "s5") { res.hours += inc.repair; log("Sửa chữa / thay " + inc.part.toLowerCase() + " (" + hh(inc.repair) + ")", "ok"); Sound.wrench(); return run(i + 1); }
        res.hours += s.h; log(s.n + " (" + hh(s.h) + ")"); Sound.tick();
        if (s.id === "s7") { mm.andon.className = "andon on-g"; mm.smoke.classList.remove("on"); mm.worker.classList.remove("scratch"); }
        run(i + 1);
        }
      }, 750);
    }
    function violation(t, cb) {
      if (!res.safety) { res.safety = true; T.setPen("rm", D.scoring.lotoPenalty); }
      Sound.siren(); log("VI PHẠM AN TOÀN: " + t, "bad");
      modal('<div class="safety"><div class="sf-ic">' + ic("loto") + '</div><h3>Vi phạm an toàn!</h3><p>' + esc(t) + '. Máy có thể khởi động bất ngờ, dầu thủy lực còn áp suất, người sửa có thể bị kẹp tay, điện giật.</p><p><b>Luôn LOTO trước khi chạm vào máy.</b> Trừ ' + D.scoring.lotoPenalty + ' điểm an toàn.</p></div><div class="modal-btns"><button class="btn btn-primary" id="sfOk">Đã hiểu</button></div>');
      $("modal").dataset.lock = "1";
      $("sfOk").onclick = function () { closeModal(); if (cb) cb(); };
    }
    function diagnose(next) {
      var tools = [["sound", "ear", "Nghe tiếng máy"], ["temp", "thermo", "Đo nhiệt độ ổ trục"], ["vib", "vibe", "Đo độ rung"], ["code", "code", "Đọc mã lỗi"]];
      function body() {
        return '<h3>Chẩn đoán sự cố</h3><p>Dùng dụng cụ để thu thập manh mối, rồi chọn nguyên nhân.</p><div class="tools">' + tools.map(function (t) {
          return '<button class="tool' + (res.clues[t[0]] ? " seen" : "") + '" data-t="' + t[0] + '">' + ic(t[1]) + '<b>' + t[2] + '</b><small>' + (res.clues[t[0]] ? esc(inc.clues[t[0]]) : "Bấm để kiểm tra") + '</small></button>';
        }).join("") + '</div><h4 class="dg-h">Nguyên nhân là:</h4><div class="opts">' + inc.causes.map(function (c, k) { return '<button class="opt' + (res["no" + k] ? " wrong" : "") + '" data-k="' + k + '"' + (res["no" + k] ? " disabled" : "") + '><span class="radio"></span><span>' + esc(c) + '</span></button>'; }).join("") + '</div>';
      }
      function wire() {
        $("modalCard").querySelectorAll(".tool").forEach(function (b) { b.onclick = function () { var t = b.dataset.t; res.clues[t] = true; if (t === "sound") { inc.sound === "grind" ? Sound.grind() : inc.sound === "hiss" ? Sound.hiss() : Sound.beepAlarm(); } else Sound.tick(); $("modalCard").innerHTML = body(); wire(); }; });
        $("modalCard").querySelectorAll(".opt").forEach(function (b) {
          b.onclick = function () {
            var k = +b.dataset.k; res.diagTries++;
            if (k === inc.ok) { Sound.ok(); closeModal(); log("Chẩn đoán: " + inc.causes[k] + " ✓", "ok"); next(); }
            else { res["no" + k] = true; res.hours += cfg.wrongDiagHours; Sound.no(); toast("Không phải, tháo kiểm tra mất thêm " + num(cfg.wrongDiagHours, 1) + " giờ"); log("Chẩn đoán sai: " + inc.causes[k] + " (+" + hh(cfg.wrongDiagHours) + ")", "bad"); $("modalCard").innerHTML = body(); wire(); }
          };
        });
      }
      modal(body(), true); wire();
      $("modal").dataset.lock = "1";
    }
    function end() {
      clearInterval(alarmI); T.onLeave = function () { clearInterval(clockI); };
      var mttr = plan + res.hours + res.wait, ideal = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
      var clean = seq.filter(function (id) { return id[0] === "s"; }), L = lcs(clean, ideal), distract = seq.length - clean.length;
      var lotoOK = clean.indexOf("s2") >= 0 && clean.indexOf("s2") < clean.indexOf("s3") && clean.indexOf("s2") < clean.indexOf("s5") && !res.safety;
      var scOrder = Math.max(0, 7 * L / 8 - distract), scLoto = lotoOK ? 3 : 0, scDiag = res.diagTries <= 1 ? 4 : res.diagTries === 2 ? 2 : 0, scClue = Object.keys(res.clues).length >= 2 ? 1 : 0;
      var missing = ideal.filter(function (id) { return seq.indexOf(id) < 0; });
      log("Hoàn tất. MTTR lần này: " + hh(mttr), "ok");
      setTimeout(function () {
        clearInterval(clockI); T.onLeave = null;
        var review = '<div class="card"><h3>Thời gian sửa chữa (MTTR) lần này: ' + hh(mttr) + ' giờ</h3><div class="mttr-break">' +
          [["Suy nghĩ lên phương án", plan, "#5A6672"], ["Thực hiện các bước", res.hours, "#3C8CE0"], ["Chờ phụ tùng", res.wait, "#D9412F"]].map(function (r) { return '<div><span>' + r[0] + '</span><i style="--w:' + (mttr ? r[1] / mttr * 100 : 0) + '%;--c:' + r[2] + '"></i><b>' + hh(r[1]) + '</b></div>'; }).join("") + '</div>' +
          '<p class="small-note">' + (res.wait ? "Chờ phụ tùng chiếm phần lớn thời gian dừng, đây là lý do MTTR máy phay cao. Màn tiếp theo sẽ xử lý chuyện kho phụ tùng." : "Kho có sẵn phụ tùng nên sửa nhanh.") + '</p></div>' +
          '<div class="card"><h3>Trình tự chuẩn <small>bạn đúng ' + L + '/8 vị trí tương đối' + (distract ? " · " + distract + " thẻ gây nhiễu (−" + distract + ")" : "") + '</small></h3><ol class="stdseq">' + cfg.steps.map(function (s) {
            var inMine = seq.indexOf(s.id) >= 0; return '<li class="' + (inMine ? "" : "miss") + (s.loto ? " loto" : "") + '"><b>' + esc(s.n) + '</b><span>' + esc(s.d) + '</span>' + (inMine ? "" : '<em>Bạn bỏ sót</em>') + '</li>';
          }).join("") + '</ol>' + cfg.distractors.map(function (x) { return seq.indexOf(x.id) >= 0 ? '<div class="feedback no"><b>' + esc(x.n) + ':</b> ' + esc(x.d) + '</div>' : ""; }).join("") +
          (res.safety ? '<div class="feedback no"><b>Vi phạm an toàn (−' + D.scoring.lotoPenalty + ' điểm tổng):</b> phải LOTO trước khi chẩn đoán và sửa chữa.</div>' : '<div class="feedback ok"><b>An toàn:</b> đã khoá năng lượng trước khi chạm vào máy.</div>') + '</div>' +
          '<div class="card"><h3>Chẩn đoán <small>' + (res.diagTries <= 1 ? "đúng ngay lần đầu" : "đúng sau " + res.diagTries + " lần") + ' · dùng ' + Object.keys(res.clues).length + '/4 manh mối</small></h3><p>' + esc(inc.why) + '</p></div>';
        T.endLevel("rm", scOrder + scLoto + scDiag + scClue, {
          say: "Bảo trì sự cố luôn đắt nhất: máy dừng ngoài kế hoạch, cả xưởng chờ. Quy trình chuẩn giúp sửa nhanh và an toàn: <b>báo hỏng → LOTO → chẩn đoán → lấy phụ tùng → sửa → chạy thử → bàn giao → ghi nhật ký</b>. Nhìn biểu đồ: thời gian chờ phụ tùng mới là “kẻ thù” lớn nhất của MTTR.",
          sub: "MTTR lần này " + hh(mttr) + " · thứ tự " + num(scOrder, 1) + "/7 · LOTO " + scLoto + "/3 · chẩn đoán " + scDiag + "/4 · manh mối " + scClue + "/1", review: review });
      }, 900);
    }
  } };

  /* ============ MÀN 4, KHO PHỤ TÙNG ============ */
  T.levels.parts = { run: function () {
    var S = T.S, items = S.scen.parts, cfg = D.parts, val = {};
    items.forEach(function (p) { val[p.id] = { cls: "", min: "", max: "" }; });
    function fmt(v) { return String(v).replace(".", ","); }
    T.page(T.coach("engineer", "Kho phụ tùng sau khi làm 5S đã gọn gàng, nhưng <b>chưa có mức tồn kho</b>. Hãy phân loại A/B/C, tính <b>Min (điểm đặt hàng lại)</b> và <b>Max</b> cho từng mã. Sau đó mô phỏng 30 ngày: thiếu hàng thì máy dừng chờ, thừa hàng thì đọng vốn (ngân sách tồn kho " + num(cfg.budgetK / 1000, 0) + " triệu).") +
      '<div class="card shelfcard"><div class="shelf-h"><span class="plate">Kho phụ tùng · K-01</span><span class="formula">Min (ROP) = Dùng/ngày × Lead time + Tồn an toàn &nbsp;·&nbsp; Max = Min + Lượng đặt/lần</span><button class="btn btn-ghost calc-btn" id="ptCalc">' + ic("calc") + 'Máy tính</button></div>' +
      '<div class="shelf">' + items.map(function (p) { return '<div class="bin"><div class="bin-ic">' + T.partSVG(p.icon) + '</div><div class="bin-l"><b>' + esc(p.n) + '</b><small>' + esc(p.useTxt) + '</small></div></div>'; }).join("") + '</div></div>' +
      '<div class="card formsheet"><h3><span class="plate">Thẻ kho</span>Phân loại & mức tồn kho</h3><div class="ptable-wrap"><table class="ptable"><thead><tr><th>Phụ tùng</th><th>Dùng/ngày</th><th>Lead time</th><th>Tồn an toàn</th><th>Đặt/lần</th><th>Phân loại</th><th>Min (ROP)</th><th>Max</th></tr></thead><tbody>' +
      items.map(function (p) {
        return '<tr data-id="' + p.id + '"><td class="pn"><span class="mini">' + T.partSVG(p.icon) + '</span>' + esc(p.n) + '</td><td>' + esc(p.useTxt) + '</td><td>' + p.lead + ' ngày</td><td>' + fmt(p.safety) + ' ' + p.unit + '</td><td>' + fmt(p.q) + ' ' + p.unit + '</td>' +
          '<td><div class="seg3">' + ["A", "B", "C"].map(function (c) { return '<button data-c="' + c + '">' + c + '</button>'; }).join("") + '</div></td>' +
          '<td><input inputmode="decimal" data-f="min" placeholder="?"><small>' + p.unit + '</small></td><td><input inputmode="decimal" data-f="max" placeholder="?"><small>' + p.unit + '</small></td></tr>';
      }).join("") + '</tbody></table></div><div class="clsinfo">' + ["A", "B", "C"].map(function (c) { return '<span><b class="c-' + c + '">' + c + '</b>' + esc(cfg.clsInfo[c]) + '</span>'; }).join("") + '</div>' +
      '<p class="small-note">Phụ tùng “dự phòng” hoặc thay theo lịch PM có mức dùng/ngày = 0 → Min chính là tồn kho an toàn.</p></div>' +
      '<div class="page-btns"><button class="btn btn-primary btn-lg" id="ptRun" disabled>' + ic("ff") + 'Áp dụng & mô phỏng 30 ngày</button></div>', true);
    $("ptCalc").onclick = T.calc;
    document.querySelectorAll(".ptable tr[data-id]").forEach(function (tr) {
      var id = tr.dataset.id;
      tr.querySelectorAll(".seg3 button").forEach(function (b) { b.onclick = function () { Sound.click(); val[id].cls = b.dataset.c; tr.querySelectorAll(".seg3 button").forEach(function (x) { x.classList.toggle("on", x === b); }); check(); }; });
      tr.querySelectorAll("input").forEach(function (inp) { inp.oninput = function () { val[id][inp.dataset.f] = inp.value; check(); }; });
    });
    function check() { $("ptRun").disabled = items.some(function (p) { var v = val[p.id]; return !v.cls || v.min === "" || v.max === ""; }); }
    $("ptRun").onclick = function () { Sound.click(); runSim(); };

    function spark(series, p, lvls) {
      var W = 200, H = 46, mx = Math.max(lvls.max, Math.max.apply(null, series), 1), o = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="sparkln">';
      var y = function (v) { return H - 4 - v / mx * (H - 10); };
      o += '<line x1="0" x2="' + W + '" y1="' + y(lvls.min) + '" y2="' + y(lvls.min) + '" class="sp-min"/>';
      o += '<polyline points="' + series.map(function (v, i) { return (i * W / 29).toFixed(1) + "," + y(v).toFixed(1); }).join(" ") + '" class="sp-line"/>';
      series.forEach(function (v, i) { if (v <= 0) o += '<circle cx="' + (i * W / 29).toFixed(1) + '" cy="' + y(0) + '" r="2.6" class="sp-out"/>'; });
      return o + '</svg>';
    }
    function runSim() {
      var mine = {}, right = {};
      items.forEach(function (p) { var v = val[p.id], a = parseNum(v.min), b = parseNum(v.max); mine[p.id] = { min: isNaN(a) ? 0 : a, max: isNaN(b) ? 0 : Math.max(b, isNaN(a) ? 0 : a) }; right[p.id] = C.partLevels(p); });
      var r = C.simulateParts(items, mine, 30), rr = C.simulateParts(items, right, 30);
      var clsOk = 0, minOk = 0, maxOk = 0, tol = D.tolerance.qty;
      items.forEach(function (p) { var v = val[p.id]; if (v.cls === p.cls) clsOk++; if (Math.abs(parseNum(v.min) - right[p.id].min) <= tol) minOk++; if (Math.abs(parseNum(v.max) - right[p.id].max) <= tol) maxOk++; });
      var noOut = r.downHours === 0, inBud = r.capitalK <= cfg.budgetK;
      var sc = 5 * clsOk / 6 + 4 * minOk / 6 + 3 * maxOk / 6 + (noOut ? 1.5 : 0) + (inBud ? 1.5 : 0);
      // hoạt cảnh 30 ngày
      T.page(T.coach("engineer", "Đang mô phỏng 30 ngày với mức Min-Max của bạn…") +
        '<div class="dash"><div class="dash-top"><div class="dash-t"><i class="led"></i>Mô phỏng kho 30 ngày<span id="dayLbl">Ngày 0/30</span></div></div><div class="simgrid" id="simGrid"></div><div class="dtlog big" id="ptLog"></div></div>', true);
      var day = 0, evI = 0, iv = setInterval(function () {
        day++; if (!$("dayLbl")) { clearInterval(iv); return; }
        $("dayLbl").textContent = "Ngày " + day + "/30";
        $("simGrid").innerHTML = items.map(function (p) { var s = r.series[p.id].slice(0, day); return '<div class="simcell"><div class="sc-h">' + T.partSVG(p.icon) + '<b>' + esc(p.n) + '</b><em>' + fmt(Math.round(s[s.length - 1] * 10) / 10) + ' ' + p.unit + '</em></div>' + spark(s.concat(new Array(30 - s.length).fill(null)).map(function (x) { return x == null ? s[s.length - 1] : x; }).slice(0, 30), p, mine[p.id]) + '</div>'; }).join("");
        while (evI < r.events.length && r.events[evI].day <= day) { var e = r.events[evI++]; $("ptLog").insertAdjacentHTML("beforeend", '<p class="' + (e.ok ? "ok" : "bad") + '">Ngày ' + e.day + ': ' + esc(e.txt) + '</p>'); if (!e.ok) Sound.no(); else Sound.tick(); $("ptLog").scrollTop = 1e6; }
        if (day >= 30) { clearInterval(iv); setTimeout(done, 900); }
      }, 140);
      T.onLeave = function () { clearInterval(iv); };
      function done() {
        T.onLeave = null;
        var review = '<div class="card"><h3>Kết quả 30 ngày</h3><div class="pm-kpi"><div class="' + (noOut ? "good" : "bad") + '"><span>Giờ máy dừng chờ phụ tùng</span><b>' + num(r.downHours, 1) + ' giờ</b><small>mức chuẩn: ' + num(rr.downHours, 1) + ' giờ</small></div>' +
          '<div class="' + (inBud ? "good" : "bad") + '"><span>Vốn tồn kho bình quân</span><b>' + num(r.capitalK / 1000, 1) + ' triệu</b><small>ngân sách ' + num(cfg.budgetK / 1000, 0) + ' triệu · mức chuẩn ' + num(rr.capitalK / 1000, 1) + ' triệu</small></div></div></div>' +
          '<div class="card"><h3>Đáp án <small>phân loại ' + clsOk + '/6 · Min ' + minOk + '/6 · Max ' + maxOk + '/6</small></h3><div class="ilist">' + items.map(function (p) {
            var v = val[p.id], L = right[p.id], okc = v.cls === p.cls, okm = Math.abs(parseNum(v.min) - L.min) <= tol, okx = Math.abs(parseNum(v.max) - L.max) <= tol, st = okc && okm && okx ? "ok" : okc || okm || okx ? "half" : "bad";
            return '<div class="irow ' + st + '"><div class="th">' + T.partSVG(p.icon) + '</div><div><h4>' + esc(p.n) + ' <small>· loại ' + p.cls + '</small></h4><div class="where">Bạn: <b>' + (v.cls || "-") + ' · Min ' + esc(v.min) + ' · Max ' + esc(v.max) + '</b></div>' +
              '<p>Min = ' + fmt(p.use) + ' × ' + p.lead + ' + ' + fmt(p.safety) + ' = <b>' + fmt(L.min) + ' ' + p.unit + '</b> · Max = ' + fmt(L.min) + ' + ' + fmt(p.q) + ' = <b>' + fmt(L.max) + ' ' + p.unit + '</b>. ' + esc(cfg.clsInfo[p.cls]) + '.</p></div><span class="badge ' + st + '">' + (st === "ok" ? "Đúng" : st === "half" ? "Một phần" : "Sai") + '</span></div>';
          }).join("") + '</div></div>';
        T.endLevel("parts", sc, { say: "Phụ tùng loại <b>A</b> (vòng bi trục chính, cảm biến) hỏng là dừng máy và phải chờ rất lâu → <b>luôn có dự phòng</b>, dù giá cao. Loại <b>C</b> rẻ, dùng hằng ngày → tính Min theo mức dùng × lead time + tồn an toàn. Đặt Max quá cao thì đọng vốn, quá thấp thì đặt hàng liên tục.", sub: "Dừng chờ phụ tùng " + num(r.downHours, 1) + " giờ · vốn tồn kho " + num(r.capitalK / 1000, 1) + " triệu", review: review });
      }
    }
  } };
})();
