/* =====================================================================
   DỮ LIỆU GAME "THỬ THÁCH OEE, XƯỞNG CƠ KHÍ SÁU TÀI"
   ---------------------------------------------------------------------
   Đội đào tạo/IT có thể sửa:
     - sample   : kịch bản mẫu (lần chơi đầu), số liệu khớp đề bài
     - pools    : mẫu sự kiện để sinh kịch bản ngẫu nhiên khi chơi lại
     - fixes    : giải pháp cải tiến (màn 4)
     - quiz     : câu hỏi màn 1
   Đơn vị thời gian: phút, tính từ đầu ca (06:00). Ca 8 giờ = 480 phút.
   cat : plan (dừng có kế hoạch) | A | P | Q
   loss: 1..6 theo 6 tổn thất lớn (0 = dừng có kế hoạch)
   ===================================================================== */
window.OEE_DATA = {
  title: "Thử thách OEE",
  workshop: "Xưởng Cơ Khí Sáu Tài",
  shiftStart: 6 * 60,      // 06:00
  shift: 480,
  worldClass: { A: 90, P: 95, Q: 99.9, OEE: 85 },
  tolerancePct: 0.5,       // sai số chấp nhận cho %, theo điểm phần trăm
  toleranceMin: 0.5,       // sai số cho số phút
  toleranceTakt: 0.05,     // sai số cho takt time (phút/sp)

  cats: {
    plan: { name: "Dừng có kế hoạch", short: "Kế hoạch", color: "#3C7DD9", note: "Không tính vào OEE" },
    A:    { name: "Tổn thất A, Dừng máy", short: "Tổn thất A", color: "#D9412F", note: "Availability" },
    P:    { name: "Tổn thất P, Tốc độ", short: "Tổn thất P", color: "#E7A812", note: "Performance" },
    Q:    { name: "Tổn thất Q, Chất lượng", short: "Tổn thất Q", color: "#8A4FD8", note: "Quality" }
  },
  losses: {
    1: { name: "Hỏng hóc thiết bị", cat: "A" },
    2: { name: "Cài đặt, chuyển đổi, điều chỉnh & chờ đợi", cat: "A" },
    3: { name: "Dừng ngắn, chạy không tải", cat: "P" },
    4: { name: "Giảm tốc độ", cat: "P" },
    5: { name: "Phế phẩm khi khởi động", cat: "Q" },
    6: { name: "Phế phẩm / làm lại trong sản xuất", cat: "Q" }
  },

  /* Giải pháp cải tiến, màn 4 */
  fixes: {
    tpm:       "Bảo trì phòng ngừa / TPM: kiểm tra, bôi trơn, thay thế định kỳ các chi tiết dễ hỏng",
    smed:      "SMED: chuẩn bị trước dao, đồ gá; chuyển việc trong thành việc ngoài để rút ngắn thời gian chuyển đổi",
    supply:    "Cải tiến cấp vật tư: Kanban, lịch giao phôi đúng giờ cho từng máy",
    power:     "Nguồn điện dự phòng (UPS) cho máy, phối hợp lịch cắt điện",
    rootcause: "Phân tích nguyên nhân gốc (5 Why) các lần dừng ngắn: tấm chắn phoi, vệ sinh và hiệu chỉnh cảm biến",
    speed:     "Thay dao theo tuổi thọ, chuẩn hoá thông số cắt để máy chạy đúng chu kỳ lý tưởng",
    material:  "Kiểm soát vật liệu đầu vào; chọn dao và thông số cắt phù hợp vật liệu cứng",
    startup:   "Chuẩn hoá quy trình setup, kiểm tra sản phẩm đầu tiên trước khi chạy hàng loạt",
    pokayoke:  "Poka-yoke, đồ gá định vị chuẩn, kiểm tra trong quá trình để không lọt lỗi"
  },

  /* ------------------------------------------------------------------
     KỊCH BẢN MẪU (lần chơi đầu), đúng số liệu đề bài
     ------------------------------------------------------------------ */
  sample: {
    machines: [
      { id: "lathe", name: "Máy tiện CNC", ideal: 1.5, demand: 225, total: 216,
        events: [
          { t: 0,   cat: "plan", loss: 0, min: 10, desc: "Họp đầu ca", why: "Họp đầu ca nằm trong kế hoạch, trừ khỏi thời gian ca, không tính vào tổn thất OEE." },
          { t: 150, cat: "plan", loss: 0, min: 10, desc: "Giải lao giữa ca (lần 1)", why: "Giải lao theo quy định là dừng có kế hoạch." },
          { t: 360, cat: "plan", loss: 0, min: 10, desc: "Giải lao giữa ca (lần 2)", why: "Giải lao theo quy định là dừng có kế hoạch." },
          { t: 60,  cat: "A", loss: 1, min: 40, desc: "Hỏng trục chính, máy dừng chờ sửa", group: "Hỏng trục chính", fix: "tpm", anim: "smoke",
            why: "Máy hỏng phải dừng → mất thời gian vận hành → tổn thất A (hỏng hóc thiết bị)." },
          { t: 200, cat: "A", loss: 2, min: 30, desc: "Thay dao + chuyển mã hàng", group: "Thay dao, chuyển mã", fix: "smed", anim: "setup",
            why: "Chuyển đổi, thay dao làm máy dừng không sản xuất → tổn thất A (cài đặt, chuyển đổi)." },
          { t: 400, cat: "A", loss: 2, min: 20, desc: "Chờ phôi từ kho, xe nâng giao muộn", group: "Chờ phôi từ kho", fix: "supply", anim: "forklift",
            why: "Máy sẵn sàng nhưng không có phôi → dừng chờ → tổn thất A (chờ đợi)." },
          { t: 115, cat: "P", loss: 3, min: 3, desc: "Dừng 3 phút do kẹt phoi", group: "Dừng ngắn do kẹt phoi", fix: "rootcause", anim: "short",
            why: "Dừng rất ngắn (dưới 5 phút), lặp lại nhiều lần → tổn thất P (dừng ngắn), không phải A." },
          { t: 250, cat: "P", loss: 3, min: 4, desc: "Dừng 4 phút do kẹt phoi", group: "Dừng ngắn do kẹt phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn dưới 5 phút → tổn thất P." },
          { t: 320, cat: "P", loss: 3, min: 5, desc: "Dừng ngắn do kẹt phoi (gộp các lần, 5 phút)", group: "Dừng ngắn do kẹt phoi", fix: "rootcause", anim: "short",
            why: "Nhiều lần dừng vài chục giây, vài phút cộng dồn → tổn thất P (dừng ngắn)." },
          { t: 440, cat: "P", loss: 3, min: 3, desc: "Dừng 3 phút do kẹt phoi", group: "Dừng ngắn do kẹt phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn dưới 5 phút → tổn thất P." },
          { t: 270, cat: "P", loss: 4, min: 21, desc: "Dao mòn, máy chạy chậm hơn chu kỳ lý tưởng (cộng dồn cả ca 21 phút)", group: "Chạy chậm do dao mòn", fix: "speed", anim: "slow",
            why: "Máy vẫn chạy nhưng chậm hơn chu kỳ lý tưởng → tổn thất P (giảm tốc độ)." },
          { t: 105, cat: "Q", loss: 5, qty: 5, desc: "5 sp lỗi khi chạy thử sau sửa trục chính", group: "Phế phẩm chạy thử sau sửa", fix: "startup", anim: "defect",
            why: "Sản phẩm lỗi lúc khởi động lại sau sửa chữa → tổn thất Q (phế phẩm khi khởi động)." },
          { t: 300, cat: "Q", loss: 6, qty: 4, desc: "4 sp sai kích thước", group: "Sai kích thước trong ca", fix: "pokayoke", anim: "defect",
            why: "Sản phẩm lỗi trong lúc sản xuất ổn định → tổn thất Q (phế phẩm trong sản xuất)." },
          { t: 430, cat: "Q", loss: 6, qty: 3, desc: "3 sp sai kích thước", group: "Sai kích thước trong ca", fix: "pokayoke", anim: "defect",
            why: "Phế phẩm trong ca → tổn thất Q." }
        ] },
      { id: "mill", name: "Máy phay CNC", ideal: 3.0, demand: 100, total: 108,
        events: [
          { t: 0,   cat: "plan", loss: 0, min: 10, desc: "Họp đầu ca", why: "Họp đầu ca là dừng có kế hoạch." },
          { t: 180, cat: "plan", loss: 0, min: 20, desc: "Giải lao", why: "Giải lao theo quy định là dừng có kế hoạch." },
          { t: 240, cat: "plan", loss: 0, min: 30, desc: "Bảo trì định kỳ theo lịch (đã lên kế hoạch tuần)", anim: "pm",
            why: "Bảo trì ĐÃ có trong lịch kế hoạch → dừng có kế hoạch, KHÔNG phải tổn thất A (khác với hỏng đột xuất)." },
          { t: 40,  cat: "A", loss: 2, min: 30, desc: "Thay đồ gá chuyển mã hàng", group: "Thay đồ gá chuyển mã", fix: "smed", anim: "setup",
            why: "Chuyển đổi đồ gá làm máy dừng → tổn thất A (cài đặt, chuyển đổi)." },
          { t: 330, cat: "A", loss: 2, min: 12, desc: "Mất điện toàn xưởng", group: "Mất điện", fix: "power", anim: "power",
            why: "Máy dừng vì thiếu điều kiện vận hành (điện) → tổn thất A (chờ đợi)." },
          { t: 95,  cat: "P", loss: 3, min: 4, desc: "Dừng 4 phút do lỗi cảm biến phát hiện phôi", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn dưới 5 phút → tổn thất P, không phải A." },
          { t: 140, cat: "P", loss: 3, min: 3, desc: "Dừng 3 phút vệ sinh phoi kẹt bàn máy", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn → tổn thất P." },
          { t: 290, cat: "P", loss: 3, min: 5, desc: "Lỗi cảm biến, reset nhiều lần (gộp 5 phút)", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause", anim: "short",
            why: "Các lần dừng ngắn cộng dồn → tổn thất P." },
          { t: 370, cat: "P", loss: 3, min: 4, desc: "Dừng 4 phút vệ sinh phoi", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn → tổn thất P." },
          { t: 420, cat: "P", loss: 3, min: 4, desc: "Dừng 4 phút do lỗi cảm biến", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause", anim: "short",
            why: "Dừng ngắn → tổn thất P." },
          { t: 120, cat: "P", loss: 4, min: 34, desc: "Vật liệu cứng, phải giảm tốc độ cắt (cộng dồn cả ca 34 phút)", group: "Giảm tốc do vật liệu cứng", fix: "material", anim: "slow",
            why: "Máy chạy chậm hơn chu kỳ lý tưởng → tổn thất P (giảm tốc độ)." },
          { t: 75,  cat: "Q", loss: 5, qty: 1, desc: "1 sp lỗi khi chạy thử sau thay đồ gá", group: "Phế phẩm chạy thử sau chuyển đổi", fix: "startup", anim: "defect",
            why: "Lỗi lúc chạy thử sau chuyển đổi → tổn thất Q (phế phẩm khi khởi động)." },
          { t: 350, cat: "Q", loss: 6, qty: 3, desc: "3 sp lỗi bavia", group: "Lỗi bavia trong ca", fix: "pokayoke", anim: "defect",
            why: "Phế phẩm trong sản xuất → tổn thất Q." }
        ] }
    ]
  },

  /* ------------------------------------------------------------------
     MẪU SINH KỊCH BẢN NGẪU NHIÊN (khi chơi lại)
     r: [min, max] phút (bội số 5); máy tính lại đáp án theo công thức chuẩn
     ------------------------------------------------------------------ */
  pools: {
    lathe: {
      name: "Máy tiện CNC", ideal: [1.5, 2.0, 2.5],
      plan: [[{ desc: "Họp đầu ca", min: 10 }, { desc: "Giải lao giữa ca (lần 1)", min: 10 }, { desc: "Giải lao giữa ca (lần 2)", min: 10 }],
             [{ desc: "Họp đầu ca", min: 15 }, { desc: "Giải lao", min: 15 }],
             [{ desc: "Họp đầu ca", min: 10 }, { desc: "Giải lao", min: 20 }, { desc: "Vệ sinh 5S cuối ca theo quy định", min: 10 }]],
      A: [
        { desc: "Hỏng trục chính, máy dừng chờ sửa", loss: 1, r: [25, 50], fix: "tpm", anim: "smoke", group: "Hỏng trục chính" },
        { desc: "Hỏng bơm dầu thủy lực", loss: 1, r: [20, 45], fix: "tpm", anim: "smoke", group: "Hỏng bơm thủy lực" },
        { desc: "Thay dao + chuyển mã hàng", loss: 2, r: [20, 35], fix: "smed", anim: "setup", group: "Thay dao, chuyển mã" },
        { desc: "Chờ phôi từ kho, xe nâng giao muộn", loss: 2, r: [10, 25], fix: "supply", anim: "forklift", group: "Chờ phôi từ kho" },
        { desc: "Chờ người vận hành (đi họp đột xuất)", loss: 2, r: [10, 15], fix: "supply", anim: "wait", group: "Chờ người vận hành" }],
      short: { desc: "kẹt phoi", group: "Dừng ngắn do kẹt phoi", fix: "rootcause" },
      slow: [{ desc: "Dao mòn, máy chạy chậm hơn chu kỳ lý tưởng", fix: "speed", group: "Chạy chậm do dao mòn" },
             { desc: "Người vận hành giảm tốc độ cho an toàn", fix: "speed", group: "Người vận hành giảm tốc" }],
      q6: [{ desc: "sai kích thước", group: "Sai kích thước trong ca" }, { desc: "trầy xước bề mặt", group: "Trầy xước bề mặt" }]
    },
    mill: {
      name: "Máy phay CNC", ideal: [2.5, 3.0, 4.0],
      plan: [[{ desc: "Họp đầu ca", min: 10 }, { desc: "Giải lao", min: 20 }, { desc: "Bảo trì định kỳ theo lịch (đã lên kế hoạch tuần)", min: 30, anim: "pm" }],
             [{ desc: "Họp đầu ca", min: 10 }, { desc: "Giải lao", min: 20 }],
             [{ desc: "Họp đầu ca", min: 15 }, { desc: "Giải lao", min: 15 }, { desc: "Bảo trì định kỳ theo lịch", min: 20, anim: "pm" }]],
      A: [
        { desc: "Thay đồ gá chuyển mã hàng", loss: 2, r: [20, 40], fix: "smed", anim: "setup", group: "Thay đồ gá chuyển mã" },
        { desc: "Mất điện toàn xưởng", loss: 2, r: [5, 15], fix: "power", anim: "power", group: "Mất điện" },
        { desc: "Hỏng đầu kẹp dao (hư đột xuất)", loss: 1, r: [15, 40], fix: "tpm", anim: "smoke", group: "Hỏng đầu kẹp dao" },
        { desc: "Chờ bản vẽ / chương trình CNC mới", loss: 2, r: [10, 20], fix: "supply", anim: "wait", group: "Chờ chương trình CNC" }],
      short: { desc: "lỗi cảm biến / vệ sinh phoi", group: "Dừng ngắn: cảm biến / vệ sinh phoi", fix: "rootcause" },
      slow: [{ desc: "Vật liệu cứng, phải giảm tốc độ cắt", fix: "material", group: "Giảm tốc do vật liệu cứng" },
             { desc: "Dao mòn, giảm tốc độ tiến dao", fix: "speed", group: "Chạy chậm do dao mòn" }],
      q6: [{ desc: "lỗi bavia", group: "Lỗi bavia trong ca" }, { desc: "sai vị trí lỗ", group: "Sai vị trí lỗ" }]
    }
  },

  /* MÀN 1, câu hỏi nhanh */
  quiz: [
    { q: "Máy phay dừng 30 phút để bảo trì định kỳ THEO LỊCH đã lên kế hoạch. Thời gian này thuộc loại nào?",
      options: ["Dừng có kế hoạch, không tính vào OEE", "Tổn thất A, dừng máy", "Tổn thất P, tốc độ"], ok: 0,
      why: "Bảo trì theo lịch đã nằm trong kế hoạch nên được trừ khỏi thời gian ca trước khi tính OEE. Chỉ hỏng hóc đột xuất mới là tổn thất A." },
    { q: "Máy tiện dừng 3 phút do kẹt phoi, sau đó chạy lại bình thường. Đây là tổn thất gì?",
      options: ["Tổn thất A, hỏng hóc", "Tổn thất P, dừng ngắn", "Tổn thất Q, chất lượng"], ok: 1,
      why: "Các lần dừng ngắn (thường dưới 5 phút) làm giảm tốc độ sản xuất chung → tính vào P, không phải A." },
    { q: "Khi tính P (Performance), ta dùng thời gian nào làm chuẩn cho mỗi sản phẩm?",
      options: ["Takt time theo nhu cầu khách hàng", "Chu kỳ lý tưởng (Ideal Cycle Time) của máy", "Thời gian trung bình thực tế"], ok: 1,
      why: "P = (Chu kỳ lý tưởng × Tổng sản phẩm) / Thời gian vận hành. Takt time chỉ dùng để so sản lượng với nhu cầu khách hàng." }
  ],

  /* Tóm tắt bài học (nút "Bài học OEE") */
  lessons: [
    { t: "OEE là gì?", d: "OEE = A × P × Q cho biết bao nhiêu phần trăm thời gian sản xuất theo kế hoạch thực sự tạo ra sản phẩm tốt với tốc độ lý tưởng." },
    { t: "A, Độ sẵn sàng", d: "A = Thời gian vận hành / Thời gian SX kế hoạch. Mất do hỏng hóc, cài đặt, chuyển đổi, chờ đợi." },
    { t: "P, Hiệu suất", d: "P = (Chu kỳ lý tưởng × Tổng sản phẩm) / Thời gian vận hành. Mất do dừng ngắn và chạy chậm. Dùng chu kỳ lý tưởng, KHÔNG dùng takt time." },
    { t: "Q, Chất lượng", d: "Q = Sản phẩm tốt / Tổng sản phẩm. Mất do phế phẩm khi khởi động và phế phẩm, làm lại trong sản xuất." },
    { t: "Takt time", d: "Takt = Thời gian SX kế hoạch / Nhu cầu khách hàng. Dùng để biết có đáp ứng đơn hàng không, không dùng để tính P." },
    { t: "Chuẩn thế giới", d: "A ≥ 90%, P ≥ 95%, Q ≥ 99,9%, OEE ≥ 85%. Ưu tiên cải tiến tổn thất lớn nhất trước." }
  ]
};
