/* =====================================================================
   MÀN 5, "ĐỌC NHẬT KÝ BẢO TRÌ" (MTBF, MTTR)  ·  MÀN 6, "PHÒNG HỌP KAIZEN"
   ===================================================================== */
(function () {
  "use strict";
  var T = window.TPM_GAME, D = T.D, C = T.C, U = T.util;
  var $ = U.$, esc = U.esc, num = U.num, ic = U.ic, Sound = U.Sound, toast = U.toast, modal = U.modal, closeModal = U.closeModal, clamp = U.clamp, parseNum = U.parseNum;
  function fmt(v) { return String(v).replace(".", ","); }

  /* ============ MÀN 5, MTBF & MTTR ============ */
  T.levels.mtbf = { run: function () {
    var S = T.S, logs = S.scen.logs, st = { lathe: C.logStats(logs.lathe), mill: C.logStats(logs.mill) }, val = {}, used = {}, hints = 0, sub = false;
    var F = [
      { k: "mtbf", l: "MTBF", u: "giờ", hint: "= Tổng giờ vận hành ÷ Số lần hỏng" },
      { k: "mttr", l: "MTTR", u: "giờ", hint: "= Tổng giờ sửa chữa ÷ Số lần hỏng" },
      { k: "avail", l: "Độ sẵn sàng", u: "%", hint: "= MTBF ÷ (MTBF + MTTR) × 100" }
    ];
    function truth(m, k) { return k === "avail" ? st[m].avail * 100 : st[m][k]; }
    function ok(m, k) { var x = parseNum(val[m + k]); return !isNaN(x) && Math.abs(x - truth(m, k)) <= (k === "avail" ? D.tolerance.pct : D.tolerance.hours) + 1e-9; }
    function sol(m, k) {
      var s = st[m];
      if (k === "mtbf") return fmt(s.op) + " ÷ " + s.n + " = <b>" + num(s.mtbf, 1) + " giờ</b>";
      if (k === "mttr") return "(" + logs[m].events.map(function (e) { return fmt(e.h); }).join(" + ") + ") ÷ " + s.n + " = " + fmt(s.rep) + " ÷ " + s.n + " = <b>" + num(s.mttr, 2) + " giờ</b>";
      return num(s.mtbf, 1) + " ÷ (" + num(s.mtbf, 1) + " + " + num(s.mttr, 2) + ") = <b>" + num(s.avail * 100, 1) + "%</b>";
    }
    function logbook(m) {
      var L = logs[m];
      return '<div class="logbook"><h4><span class="plate">' + (m === "lathe" ? "MT-01" : "MP-02") + '</span>' + esc(L.name) + '</h4><table class="ltab"><thead><tr><th>Ngày</th><th>Sự cố</th><th>Giờ sửa</th></tr></thead><tbody>' +
        L.events.map(function (e) { return '<tr><td>' + e.day + '</td><td>' + esc(e.desc) + '</td><td>' + fmt(e.h) + '</td></tr>'; }).join("") +
        '</tbody></table><div class="kv"><span>Tổng giờ vận hành trong tháng</span><b>' + L.opHours + ' giờ</b></div></div>';
    }
    function draw() {
      T.page(T.coach("engineer", sub ? "Đây là lời giải từng bước, đối chiếu nhé." : "Nhật ký bảo trì tháng trước của 2 máy. Tự tính <b>MTBF, MTTR, độ sẵn sàng</b> (sai số cho phép ±0,5). Có máy tính bỏ túi; mỗi lần xem gợi ý bị trừ 1 điểm. Cuối cùng chẩn đoán: máy nào cần tăng MTBF, máy nào cần giảm MTTR?") +
        '<div class="m3grid"><div class="card clipboard"><div class="clip-top"></div><div class="sheet"><h3>Nhật ký bảo trì · 1 tháng</h3>' + logbook("lathe") + logbook("mill") + '</div></div>' +
        '<div class="card formsheet"><h3><span class="plate">Phiếu tính</span>Chỉ số bảo trì <button class="btn btn-ghost calc-btn" id="lgCalc">' + ic("calc") + 'Máy tính</button></h3>' +
        ["lathe", "mill"].map(function (m) {
          return '<div class="fgroup"><h4>' + (m === "lathe" ? "Máy tiện CNC" : "Máy phay CNC") + '</h4>' + F.map(function (f) {
            var key = m + f.k, good = sub ? ok(m, f.k) : null;
            return '<div class="frow' + (sub ? (good ? " ok" : " bad") : "") + '"><label>' + f.l + '</label><div class="fin"><input inputmode="decimal" data-k="' + key + '" value="' + esc(val[key] || "") + '"' + (sub ? " disabled" : "") + ' placeholder="?"><span class="unit">' + f.u + '</span>' +
              (sub ? '<span class="mark">' + (good ? "✓" : "✗") + '</span>' : '<button class="hintb" data-h="' + key + '" title="Gợi ý (−1 điểm)">' + ic("hint") + '</button>') + '</div>' +
              (used[key] && !sub ? '<div class="hint">' + f.hint + '</div>' : '') + (sub ? '<div class="sol">' + sol(m, f.k) + '</div>' : '') + '</div>';
          }).join("") + '</div>';
        }).join("") +
        '<div class="fgroup"><h4>Chẩn đoán</h4>' + [["up", "Máy cần ưu tiên TĂNG MTBF (hỏng vặt nhiều)", "lathe"], ["down", "Máy cần ưu tiên GIẢM MTTR (sửa lâu)", "mill"]].map(function (q) {
          var good = sub ? val[q[0]] === q[2] : null;
          return '<div class="frow' + (sub ? (good ? " ok" : " bad") : "") + '"><label>' + q[1] + '</label><div class="fin"><select data-k="' + q[0] + '"' + (sub ? " disabled" : "") + '><option value="">- chọn -</option><option value="lathe"' + (val[q[0]] === "lathe" ? " selected" : "") + '>Máy tiện CNC</option><option value="mill"' + (val[q[0]] === "mill" ? " selected" : "") + '>Máy phay CNC</option></select>' + (sub ? '<span class="mark">' + (good ? "✓" : "✗") + '</span>' : '') + '</div></div>';
        }).join("") + '</div></div></div>' +
        '<div class="page-btns"><button class="btn btn-primary btn-lg" id="lgGo">' + (sub ? "Tiếp tục →" : "Nộp bài tính") + '</button></div>', true);
      $("lgCalc").onclick = T.calc;
      document.querySelectorAll("[data-k]").forEach(function (inp) { inp.addEventListener(inp.tagName === "SELECT" ? "change" : "input", function () { val[inp.dataset.k] = inp.value; }); });
      document.querySelectorAll(".hintb").forEach(function (b) { b.onclick = function () { if (!used[b.dataset.h]) { used[b.dataset.h] = true; hints++; toast("Gợi ý: −1 điểm"); } Sound.click(); draw(); }; });
      $("lgGo").onclick = function () {
        if (sub) { finish(); return; }
        var empty = ["lathe", "mill"].reduce(function (a, m) { return a + F.filter(function (f) { return !val[m + f.k]; }).length; }, 0) + (val.up ? 0 : 1) + (val.down ? 0 : 1);
        if (empty) { modal('<h3>Nộp bài?</h3><p>Còn ' + empty + ' ô trống, ô trống tính là sai.</p><div class="modal-btns"><button class="btn btn-ghost" data-close>Điền tiếp</button><button class="btn btn-primary" id="lgSure">Vẫn nộp</button></div>'); $("lgSure").onclick = function () { closeModal(); sub = true; Sound.click(); draw(); }; }
        else { sub = true; Sound.click(); draw(); }
      };
    }
    function finish() {
      var n = 0; ["lathe", "mill"].forEach(function (m) { F.forEach(function (f) { if (ok(m, f.k)) n++; }); });
      var dg = (val.up === "lathe" ? 1 : 0) + (val.down === "mill" ? 1 : 0);
      var sc = Math.max(0, 2 * n + 1.5 * dg - hints);
      var L = st.lathe, M = st.mill;
      T.endLevel("mtbf", sc, {
        say: "Máy tiện MTBF " + num(L.mtbf, 0) + " giờ, cứ khoảng " + Math.round(L.mtbf / 8) + " ca là hỏng một lần: <b>bệnh MTBF thấp</b>, chữa bằng AM + PM. Máy phay MTBF " + num(M.mtbf, 0) + " giờ nhưng MTTR " + num(M.mttr, 1) + " giờ: <b>bệnh MTTR cao</b>, chữa bằng phụ tùng dự phòng, SOP, đào tạo, CBM. Độ sẵn sàng ~95% nghe cao, nhưng mỗi % là hàng chục giờ máy mỗi năm!",
        sub: "Đúng " + n + "/6 chỉ số · chẩn đoán " + dg + "/2 · gợi ý −" + hints,
        review: '<div class="card"><h3>Tóm tắt</h3><div class="cmp2">' + ["lathe", "mill"].map(function (m) { var s = st[m]; return '<div><b>' + (m === "lathe" ? "Máy tiện CNC" : "Máy phay CNC") + '</b><span>MTBF <em>' + num(s.mtbf, 1) + ' h</em></span><span>MTTR <em>' + num(s.mttr, 2) + ' h</em></span><span>Độ sẵn sàng <em>' + num(s.avail * 100, 1) + '%</em></span></div>'; }).join("") + '</div></div>' });
    }
    draw();
  } };

  /* ============ MÀN 6, KAIZEN ============ */
  T.levels.kaizen = { run: function () {
    var cfg = D.kaizen, cs = null, lvl = 0, whyOK = [], picked = {}, pdca = {}, opts = [];
    function pickCase() {
      T.page(T.coach("engineer", "Phòng họp Kaizen. Chọn <b>một sự cố</b> để cả nhóm phân tích Why-Why tìm nguyên nhân gốc, rồi lập kế hoạch đối phó theo PDCA.") +
        '<div class="cases">' + cfg.cases.map(function (c) {
          return '<button class="casecard" data-id="' + c.id + '"><span class="plate">' + (c.id === "lathe" ? "MT-01" : "MP-02") + '</span><b>' + esc(c.title) + '</b><small>' + esc(c.machine) + ' · vấn đề ' + c.metric + '</small><span class="cc-k"><em>' + c.metric + '</em>' + (c.metric === "MTBF" ? c.before.mtbf + " giờ" : c.before.mttr + " giờ") + '</span></button>';
        }).join("") + '</div>', true);
      document.querySelectorAll(".casecard").forEach(function (b) { b.onclick = function () { Sound.click(); cs = cfg.cases.filter(function (c) { return c.id === b.dataset.id; })[0]; opts = cs.chain.map(function (w) { return U.shuffle(w.opts.map(function (o, i) { return { t: o, ok: i === w.ok }; })); }); why(); }; });
    }
    function ladder() {
      return '<div class="whyladder"><div class="wl-top"><span class="plate">Sự cố</span><b>' + esc(cs.title) + '</b><small>' + esc(cs.machine) + '</small></div>' + cs.chain.map(function (w, i) {
        if (i > lvl) return '<div class="wl-step lock"><b>Tại sao ' + (i + 1) + '?</b><span>…</span></div>';
        var ans = whyOK[i], right = w.opts[w.ok];
        return '<div class="wl-step' + (i === lvl ? " cur" : ans === true ? " ok" : ans === false ? " bad" : "") + '"><b>Tại sao ' + (i + 1) + '?</b><span>' + esc(w.q) + '</span>' + (i < lvl ? '<em>' + esc(right) + (ans === false ? " <i>(bạn chọn sai)</i>" : "") + '</em>' : '') + '</div>';
      }).join("") + (lvl >= cs.chain.length ? '<div class="wl-root"><span class="plate">Nguyên nhân gốc</span><b>' + esc(cs.root) + '</b></div>' : '') + '</div>';
    }
    function why() {
      if (lvl >= cs.chain.length) { measures(); return; }
      var w = cs.chain[lvl];
      T.page(T.coach("engineer", "Hỏi <b>“Tại sao?”</b> liên tục cho tới khi gặp lỗ hổng của <b>hệ thống</b> (tiêu chuẩn, quy trình), đừng dừng ở nguyên nhân bề mặt hay đổ lỗi cho người.") +
        '<div class="kz-grid">' + ladder() + '<div class="card paper"><h3>Tại sao ' + (lvl + 1) + ': ' + esc(w.q) + '</h3><div class="opts">' + opts[lvl].map(function (o, i) { return '<button class="opt" data-i="' + i + '"><span class="radio"></span><span>' + esc(o.t) + '</span></button>'; }).join("") + '</div></div></div>', true);
      document.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          var o = opts[lvl][+b.dataset.i]; whyOK[lvl] = o.ok;
          if (o.ok) { Sound.ok(); } else { Sound.no(); toast("Chưa phải, đáp án đúng: " + w.opts[w.ok]); }
          b.classList.add(o.ok ? "right" : "wrong");
          setTimeout(function () { lvl++; why(); }, o.ok ? 500 : 1500);
        };
      });
    }
    function measures() {
      T.page(T.coach("engineer", "Đã tìm ra gốc rễ. Chọn <b>3 biện pháp đối phó</b> xử lý đúng nguyên nhân gốc (không phải chữa cháy).") +
        '<div class="kz-grid">' + ladder() + '<div class="card"><h3><span class="plate">Thẻ giải pháp</span>Chọn 3 biện pháp <small id="mcnt">0/3</small></h3><div class="mgrid">' + cs.measures.map(function (m, i) {
          return '<button class="mcard' + (picked[i] ? " sel" : "") + '" data-i="' + i + '"><i class="box">' + (picked[i] ? ic("check") : "") + '</i><span>' + esc(m.n) + '</span></button>';
        }).join("") + '</div><div class="page-btns"><button class="btn btn-primary" id="mGo" disabled>Lập kế hoạch PDCA →</button></div></div></div>', true);
      function upd() { var n = Object.keys(picked).length; $("mcnt").textContent = n + "/3"; $("mGo").disabled = n !== 3; }
      document.querySelectorAll(".mcard").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; if (picked[i]) delete picked[i]; else { if (Object.keys(picked).length >= 3) { toast("Chỉ chọn 3 biện pháp"); return; } picked[i] = true; } Sound.click(); b.classList.toggle("sel", !!picked[i]); b.querySelector(".box").innerHTML = picked[i] ? ic("check") : ""; upd(); }; });
      upd(); $("mGo").onclick = function () { Sound.click(); plan(); };
    }
    function plan() {
      var sel = Object.keys(picked).map(Number);
      T.page(T.coach("engineer", "Mỗi biện pháp phải có <b>người phụ trách</b> và <b>thời hạn</b> cụ thể, không có thì biện pháp sẽ chỉ nằm trên giấy.") +
        '<div class="pdca-wrap"><div class="pdca-wheel"><div class="q p"><b>P</b><span>Why-Why · biện pháp</span></div><div class="q d"><b>D</b><span>Thực hiện</span></div><div class="q c"><b>C</b><span>Đo ' + cs.metric + '</span></div><div class="q a"><b>A</b><span>Chuẩn hoá</span></div></div>' +
        '<div class="card formsheet"><h3><span class="plate">PDCA</span>Kế hoạch hành động</h3><table class="ptable pdca"><thead><tr><th>Biện pháp</th><th>Người phụ trách</th><th>Thời hạn</th></tr></thead><tbody>' + sel.map(function (i) {
          return '<tr><td>' + esc(cs.measures[i].n) + '</td><td><select data-o="' + i + '"><option value="">- chọn -</option>' + cfg.owners.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join("") + '</select></td><td><select data-d="' + i + '"><option value="">- chọn -</option>' + cfg.deadlines.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join("") + '</select></td></tr>';
        }).join("") + '</tbody></table></div></div><div class="page-btns"><button class="btn btn-primary btn-lg" id="pdGo" disabled>Thực hiện & xem kết quả →</button></div>', true);
      function upd() { $("pdGo").disabled = sel.some(function (i) { return !pdca[i] || !pdca[i].o || !pdca[i].d; }); }
      document.querySelectorAll("select[data-o],select[data-d]").forEach(function (s) { s.onchange = function () { var i = s.dataset.o || s.dataset.d; pdca[i] = pdca[i] || {}; pdca[i][s.dataset.o ? "o" : "d"] = s.value; upd(); }; });
      $("pdGo").onclick = function () { Sound.click(); result(sel); };
    }
    function result(sel) {
      var whyN = whyOK.filter(Boolean).length, good = sel.filter(function (i) { return cs.measures[i].ok; }).length, bad = sel.length - good;
      var pd = sel.filter(function (i) { var m = cs.measures[i]; return m.ok && m.owner.indexOf(pdca[i].o) >= 0 && cfg.okDeadlines.indexOf(pdca[i].d) >= 0; }).length;
      var sc = 1.5 * whyN + clamp(2 * good - bad, 0, 6) + pd;
      // trước / sau: hiệu quả theo số biện pháp đúng
      var b = cs.before, af = cs.after, k = good / 3;
      var aM = b.mtbf + (af.mtbf - b.mtbf) * k, aR = b.mttr + (af.mttr - b.mttr) * k, A0 = b.mtbf / (b.mtbf + b.mttr), A1 = aM / (aM + aR);
      var oee0 = D.before[cs.id].oee, oee1 = oee0 * A1 / A0;
      function row(lbl, v0, v1, u, better) { var up = v1 > v0, g = better === "up" ? up : !up; return '<div class="ba"><span>' + lbl + '</span><b>' + num(v0, 1) + u + '</b><i class="arr ' + (v1 === v0 ? "" : g ? "good" : "bad") + '">→</i><b class="' + (v1 === v0 ? "" : g ? "good" : "bad") + '">' + num(v1, 1) + u + '</b></div>'; }
      var review = '<div class="card"><h3>Trước / sau Kaizen <small>' + esc(cs.machine) + ' · ' + good + '/3 biện pháp trúng gốc rễ</small></h3><div class="hmi"><div class="balist">' +
        row("MTBF", b.mtbf, aM, " h", "up") + row("MTTR", b.mttr, aR, " h", "down") + row("Độ sẵn sàng", A0 * 100, A1 * 100, "%", "up") + row("OEE (ước tính)", oee0, oee1, "%", "up") + '</div>' +
        '<p class="hmi-note">TPM tốt → MTBF tăng, MTTR giảm → độ sẵn sàng A tăng → OEE tăng. OEE ước tính = OEE trước × A sau ÷ A trước.</p></div></div>' +
        '<div class="card"><h3>Đáp án biện pháp <small>Why-Why đúng ' + whyN + '/4 · PDCA hợp lý ' + pd + '/3</small></h3><div class="ilist">' + cs.measures.map(function (m, i) {
          var s = !!picked[i], st = m.ok ? (s ? "ok" : "half") : (s ? "bad" : "ok");
          return '<div class="irow ' + st + '"><div class="th"><span class="emo">' + ic(m.ok ? "check" : "alarm") + '</span></div><div><h4>' + esc(m.n) + '</h4>' + (s && pdca[i] ? '<div class="where">Bạn giao: <b>' + esc(pdca[i].o) + ' · ' + esc(pdca[i].d) + '</b>' + (m.ok ? ' · phù hợp: ' + esc(m.owner.join(" / ")) + ', ≤ 1 tháng' : '') + '</div>' : '') + '<p>' + (m.ok ? "Đánh vào nguyên nhân gốc: " + esc(cs.root) + "." : esc(m.why)) + '</p></div><span class="badge ' + st + '">' + (m.ok ? (s ? "Đã chọn ✓" : "Bỏ sót") : (s ? "Chọn sai" : "Đúng là loại")) + '</span></div>';
        }).join("") + '</div></div>';
      T.endLevel("kaizen", sc, { say: "Gốc rễ: <b>" + esc(cs.root) + "</b>. Biện pháp tốt luôn sửa <b>hệ thống</b> (tiêu chuẩn, quy trình, mức tồn kho), rồi bước <b>A</b> của PDCA là chuẩn hoá: cập nhật checklist AM, lịch PM, OPL, Min-Max để lỗi không quay lại.", sub: "Why-Why " + whyN + "/4 · biện pháp " + good + "/3 · PDCA " + pd + "/3", review: review });
    }
    pickCase();
  } };
})();
