/* =====================================================================
   DỮ LIỆU GAME "THỬ THÁCH TPM", đội đào tạo chỉnh sửa tại đây
   ---------------------------------------------------------------------
   Viết dạng JS (window.TPM_DATA) thay vì .json để game chạy được cả khi
   mở trực tiếp file hoặc nhúng iframe (không cần server). Cấu trúc giống JSON:
   chỉ sửa chữ / số trong dấu ngoặc kép, giữ nguyên dấu phẩy và ngoặc.
   ===================================================================== */
window.TPM_DATA = {
  title: "Thử thách TPM",
  subtitle: "Bảo trì năng suất toàn diện",
  workshop: "Xưởng Cơ Khí Sáu Tài",
  owner: "Chú Sáu Tài",
  ownerRole: "Chủ xưởng",
  engineer: "Chị Mai",
  engineerRole: "Kỹ sư bảo trì",
  targets: { latheMTBF: 200, millMTTR: 2 },
  tolerance: { hours: 0.5, pct: 0.5, qty: 0.5 },
  scoring: { am: 15, pm: 15, rm: 15, parts: 15, mtbf: 15, kaizen: 15, month: 10, timeBonus: 5, lotoPenalty: 5 },

  /* ---------- Cốt truyện (hộp thoại mở đầu) ---------- */
  story: [
    { who: "owner", text: "Chào trưởng nhóm! Xưởng mình đã đạt 5S, tuần trước đo OEE thì thấy máy dừng quá nhiều. Máy tiện 68%, máy phay 74%, còn xa chuẩn 85%." },
    { who: "owner", text: "Máy tiện thì hỏng vặt liên tục: kẹt bàn xe dao, lỏng ốc, đứt curoa… cứ vài hôm lại dừng. Máy phay ít hỏng, nhưng hỏng một lần là sửa cả ngày." },
    { who: "engineer", text: "Em là Mai, kỹ sư bảo trì. Số liệu tháng rồi: máy tiện MTBF 80 giờ, máy phay MTTR 6 giờ. Hai máy, hai “bệnh” khác nhau, nên thuốc cũng khác nhau." },
    { who: "owner", text: "Chú giao cho cháu triển khai TPM trong 1 tháng. Mục tiêu: máy tiện MTBF ≥ 200 giờ, máy phay MTTR ≤ 2 giờ, không vượt ngân sách và tuyệt đối không có tai nạn!" }
  ],

  /* ---------- Bài học nhanh: 8 trụ cột ---------- */
  pillars: [
    { k: "AM", n: "Bảo trì tự quản", d: "Người vận hành tự vệ sinh, kiểm tra, bôi trơn, siết chặt máy của mình mỗi ngày." },
    { k: "PM", n: "Bảo trì kế hoạch", d: "Bộ phận bảo trì làm theo lịch: theo thời gian, theo tình trạng, dự đoán." },
    { k: "KK", n: "Cải tiến tập trung", d: "Nhóm Kaizen phân tích Why-Why, loại bỏ tổn thất lớn nhất." },
    { k: "QM", n: "Bảo trì chất lượng", d: "Giữ điều kiện thiết bị để không sinh ra lỗi sản phẩm." },
    { k: "EM", n: "Quản lý thiết bị từ đầu", d: "Đưa bài học bảo trì vào thiết kế, mua máy mới dễ bảo trì." },
    { k: "ĐT", n: "Đào tạo & huấn luyện", d: "Nâng kỹ năng vận hành và sửa chữa, OPL, bài học 1 điểm." },
    { k: "AT", n: "An toàn, Sức khỏe, Môi trường", d: "Zero tai nạn: LOTO, che chắn, quản lý dầu thải." },
    { k: "VP", n: "TPM văn phòng", d: "Áp dụng TPM cho mua hàng, kho, kế hoạch, hỗ trợ xưởng." }
  ],
  zeros: ["Zero hỏng hóc", "Zero lỗi", "Zero tai nạn"],
  roles: [
    { k: "AM", n: "Bảo trì tự quản", who: "Người vận hành", d: "Hằng ngày · CILT: Vệ sinh, Kiểm tra, Bôi trơn, Siết chặt. Phát hiện bất thường, gắn thẻ." },
    { k: "PM", n: "Bảo trì kế hoạch", who: "Bộ phận bảo trì", d: "Theo lịch: thay lọc theo giờ chạy (TBM), đo rung/nhiệt (CBM), thay trước khi hỏng (PdM)." },
    { k: "RM", n: "Bảo trì sự cố", who: "Bảo trì + vận hành", d: "Sửa khi đã hỏng, dừng ngoài kế hoạch, tốn kém nhất. Phải đúng quy trình, có LOTO." }
  ],
  amSteps: ["Vệ sinh ban đầu", "Loại bỏ nguồn bẩn & vị trí khó tiếp cận", "Tiêu chuẩn tạm thời", "Kiểm tra tổng thể", "Kiểm tra tự quản", "Tiêu chuẩn hóa", "Tự quản hoàn toàn"],

  /* ---------- MÀN 1, AM: thanh tra đầu ca (máy tiện cận cảnh) ----------
     x, y: toạ độ trên hình máy tiện (khung 1000 × 600); r: bán kính vùng bấm
     ok: hành động đúng, clean | lube | tighten | green | red
     group: nhóm checklist CILT                                          */
  am: {
    gameMinutes: 10, realSeconds: 210, pickCount: 10,
    actions: {
      clean:   { n: "Vệ sinh",        d: "Lau sạch, loại bỏ phoi/bụi" },
      lube:    { n: "Bôi trơn",       d: "Châm dầu / bơm mỡ đúng điểm" },
      tighten: { n: "Siết chặt",      d: "Siết lại ốc, khớp dấu" },
      green:   { n: "Gắn thẻ XANH",   d: "Người vận hành tự xử lý được" },
      red:     { n: "Gắn thẻ ĐỎ",     d: "Cần bộ phận bảo trì xử lý" }
    },
    groups: {
      clean: "Vệ sinh, vệ sinh cũng là kiểm tra",
      check: "Kiểm tra, rò rỉ, áp suất, lọc, curoa, tiếng kêu",
      lube: "Bôi trơn, mức dầu, vú mỡ",
      tighten: "Siết chặt, ốc, bulông, dấu khớp",
      visual: "Nhận diện trực quan, nhãn, vạch mức"
    },
    anomalies: [
      { id: "leak",   x: 868, y: 478, r: 34, group: "check",   ok: "red",     name: "Rỉ dầu ở đầu nối ống thủy lực", why: "Rò rỉ trong hệ thủy lực có áp suất, người vận hành không tự tháo siết. Gắn thẻ ĐỎ cho bảo trì, đặt khay hứng dầu." },
      { id: "bolt",   x: 552, y: 232, r: 30, group: "tighten", ok: "tighten", name: "Ốc bắt đài dao lệch dấu khớp", why: "Dấu khớp (vạch sơn) bị lệch nghĩa là ốc đã lỏng → siết chặt đúng lực rồi kẻ lại dấu. Đây là việc AM hằng ngày." },
      { id: "oil",    x: 178, y: 452, r: 34, group: "lube",    ok: "lube",    name: "Dầu bôi trơn rãnh trượt dưới vạch MIN", why: "Thiếu dầu là nguyên nhân kẹt bàn xe dao. Châm dầu đúng loại tới vạch MAX, việc của người vận hành." },
      { id: "filter", x: 742, y: 470, r: 32, group: "check",   ok: "red",     name: "Lọc dầu thủy lực báo nghẹt (chỉ thị đỏ)", why: "Thay lọc là hạng mục PM theo giờ chạy, cần dừng máy và đúng phụ tùng → gắn thẻ ĐỎ, báo bảo trì." },
      { id: "chips",  x: 420, y: 346, r: 40, group: "clean",   ok: "clean",   name: "Phoi bám dày trên rãnh trượt", why: "Phoi kẹt vào gạt phoi làm xước rãnh trượt. Vệ sinh sạch, vệ sinh chính là kiểm tra, sẽ thấy vết xước nếu có." },
      { id: "belt",   x: 92,  y: 256, r: 34, group: "check",   ok: "red",     name: "Dây curoa có vết nứt", why: "Curoa nứt sắp đứt. Thay curoa phải tháo nắp che, chỉnh độ căng → thẻ ĐỎ cho bảo trì." },
      { id: "noise",  x: 262, y: 236, r: 36, group: "check",   ok: "red",     name: "Tiếng kêu lạ ở ổ trục chính", sound: true, why: "Tiếng rè rè kim loại là dấu hiệu vòng bi mòn. Người vận hành chỉ phát hiện và báo, gắn thẻ ĐỎ để bảo trì đo rung, chẩn đoán." },
      { id: "gauge",  x: 800, y: 418, r: 30, group: "check",   ok: "red",     name: "Đồng hồ áp suất ngoài vùng xanh", why: "Áp suất thủy lực thấp hơn vùng xanh, có thể do lọc nghẹt hoặc bơm yếu. Không tự chỉnh van; gắn thẻ ĐỎ." },
      { id: "label",  x: 624, y: 318, r: 28, group: "visual",  ok: "green",   name: "Mất nhãn điểm bôi trơn", why: "Người vận hành tự in và dán lại nhãn điểm bôi trơn được → thẻ XANH, xử lý ngay trong ca." },
      { id: "glass",  x: 232, y: 304, r: 26, group: "clean",   ok: "clean",   name: "Kính thăm dầu hộp trục chính bị mờ bẩn", why: "Không đọc được mức dầu thì không kiểm tra được. Lau sạch kính thăm dầu." },
      { id: "cover",  x: 92,  y: 168, r: 26, group: "tighten", ok: "green",   name: "Nắp che curoa thiếu 1 con ốc", why: "Lấy ốc dự phòng đúng cỡ lắp lại, người vận hành làm được → thẻ XANH (ghi lại để theo dõi)." },
      { id: "grease", x: 812, y: 306, r: 28, group: "lube",    ok: "lube",    name: "Vú mỡ ụ động khô, không có mỡ", why: "Bơm mỡ vào vú mỡ theo nhãn điểm bôi trơn, việc AM hằng ngày/tuần." }
    ],
    decoys: [
      { x: 520, y: 470, name: "Cửa tủ điện đóng kín, có khoá" },
      { x: 960, y: 210, name: "Bảng điều khiển CNC hiển thị bình thường" },
      { x: 350, y: 250, name: "Mâm cặp sạch, chấu kẹp đủ" },
      { x: 700, y: 300, name: "Gạt phoi còn tốt" }
    ]
  },

  /* ---------- MÀN 2, PM: lập lịch bảo trì ---------- */
  pm: {
    freqs: [
      { k: "day",   n: "Hằng ngày" },
      { k: "week",  n: "Hằng tuần" },
      { k: "month", n: "Hằng tháng" },
      { k: "hours", n: "Theo giờ chạy", s: "TBM" },
      { k: "cond",  n: "Theo tình trạng", s: "CBM / PdM" }
    ],
    who: [
      { k: "AM", n: "Vận hành (AM)" },
      { k: "PM", n: "Bảo trì (PM)" }
    ],
    baseFailures: { lathe: 5, mill: 3 },
    tasks: [
      { id: "t1",  n: "Vệ sinh phoi rãnh trượt, xem vết xước", m: "Máy tiện",   f: "day",   w: "AM", wl: 0.4, wm: 0.1, why: "Việc nhẹ, làm mỗi đầu ca trong checklist AM." },
      { id: "t2",  n: "Kiểm tra mức dầu & châm dầu rãnh trượt", m: "Máy tiện", f: "day",   w: "AM", wl: 0.9, wm: 0,   why: "Thiếu dầu gây kẹt bàn xe dao (2 lần/tháng), phải kiểm tra mỗi ca." },
      { id: "t3",  n: "Đọc đồng hồ áp suất thủy lực, ghi checklist", m: "2 máy", f: "day", w: "AM", wl: 0.2, wm: 0.3, why: "Chỉ cần nhìn và ghi, người vận hành làm hằng ngày, thấy sai vùng xanh thì gắn thẻ." },
      { id: "t4",  n: "Kiểm tra dấu khớp, siết ốc đài dao", m: "Máy tiện",   f: "week",  w: "AM", wl: 0.6, wm: 0,   why: "Ốc rung lỏng dần; dấu khớp giúp người vận hành phát hiện và siết hằng tuần." },
      { id: "t5",  n: "Vệ sinh lưới lọc dung dịch tưới nguội", m: "2 máy",  f: "week",  w: "AM", wl: 0.2, wm: 0.2, why: "Lưới lọc bẩn nhanh nhưng dễ tháo, AM hằng tuần." },
      { id: "t6",  n: "Kiểm tra độ căng & vết nứt dây curoa", m: "Máy tiện", f: "month", w: "PM", wl: 0.6, wm: 0,   why: "Cần tháo nắp che, dùng dụng cụ đo lực căng, bảo trì làm hằng tháng." },
      { id: "t7",  n: "Bơm mỡ ổ đỡ vít me bi", m: "2 máy",                   f: "month", w: "PM", wl: 0.3, wm: 0.2, why: "Điểm bôi trơn khó tiếp cận, lượng mỡ chính xác, bảo trì làm hằng tháng." },
      { id: "t8",  n: "Thay lọc dầu thủy lực (mỗi 500 giờ chạy)", m: "2 máy", f: "hours", w: "PM", wl: 0.6, wm: 0.2, why: "Bảo trì theo thời gian (TBM): đếm giờ chạy, đến hạn là thay, tránh quá nhiệt bơm." },
      { id: "t9",  n: "Thay dầu thủy lực (mỗi 2.000 giờ chạy)", m: "2 máy",  f: "hours", w: "PM", wl: 0.2, wm: 0.3, why: "TBM, thay theo số giờ chạy khuyến cáo của nhà sản xuất." },
      { id: "t10", n: "Đo rung trục chính, ghi xu hướng", m: "Máy phay",      f: "cond",  w: "PM", wl: 0,   wm: 0.9, why: "Bảo trì theo tình trạng / dự đoán: rung tăng dần → thay vòng bi trước khi hỏng." },
      { id: "t11", n: "Đo nhiệt độ ổ trục & động cơ bằng súng nhiệt", m: "2 máy", f: "cond", w: "PM", wl: 0.2, wm: 0.4, why: "CBM, nhiệt tăng bất thường báo hiệu thiếu bôi trơn hoặc vòng bi mòn." },
      { id: "t12", n: "Kiểm tra, siết đầu nối ống thủy lực", m: "Máy phay",   f: "month", w: "PM", wl: 0.2, wm: 0.5, why: "Ngăn tuột ống thủy lực, có áp suất nên do bảo trì làm, hằng tháng." }
    ]
  },

  /* ---------- MÀN 3, RM: sự cố khẩn cấp ---------- */
  rm: {
    steps: [
      { id: "s1", n: "Báo hỏng", d: "Bấm andon, báo tổ trưởng & bảo trì", h: 0.2 },
      { id: "s2", n: "Khoanh vùng & khoá năng lượng (LOTO)", d: "Ngắt điện, khí, thủy lực, treo khoá và thẻ", h: 0.3, loto: true },
      { id: "s3", n: "Chẩn đoán", d: "Nghe, đo, đọc mã lỗi để tìm nguyên nhân", h: 1.0, diag: true },
      { id: "s4", n: "Lấy phụ tùng", d: "Xuất kho đúng mã phụ tùng", h: 0.2, part: true },
      { id: "s5", n: "Sửa chữa / thay thế", d: "Theo SOP sửa chữa", h: 1.5 },
      { id: "s6", n: "Chạy thử", d: "Chạy không tải, kiểm tra sản phẩm đầu", h: 0.5 },
      { id: "s7", n: "Bàn giao sản xuất", d: "Gỡ LOTO, ký bàn giao", h: 0.1 },
      { id: "s8", n: "Ghi nhật ký & phân tích", d: "Ghi thời gian, nguyên nhân, phụ tùng, làm Why-Why", h: 0.2 }
    ],
    distractors: [
      { id: "x1", n: "Bật máy chạy lại thử xem còn lỗi không", d: "Có thể làm hỏng nặng thêm, nguy hiểm" },
      { id: "x2", n: "Mở cửa máy kiểm tra khi trục còn quay", d: "Vi phạm an toàn nghiêm trọng" }
    ],
    wrongDiagHours: 1.5,
    incidents: [
      { id: "bearing", machine: "Máy phay CNC", code: "AL-409 · QUÁ TẢI TRỤC CHÍNH", sound: "grind",
        clues: { sound: "Tiếng rè rè kim loại, to dần theo tốc độ", temp: "Ổ trục chính 82 °C (bình thường < 60 °C)", vib: "Rung 9,4 mm/s (giới hạn 4,5 mm/s)", code: "AL-409 Quá tải trục chính" },
        causes: ["Vòng bi trục chính hỏng", "Cảm biến hành trình lỗi", "Tuột ống thủy lực", "Dao cụ bị mòn"], ok: 0,
        part: "Vòng bi trục chính", stock: 0, waitHours: 7, repair: 1.5,
        why: "Nhiệt cao + rung lớn + tiếng rè ở trục chính → vòng bi hỏng. Kho không có vòng bi dự phòng nên phải chờ mua 7 giờ, đây là lý do MTTR máy phay cao." },
      { id: "sensor", machine: "Máy phay CNC", code: "AL-221 · QUÁ HÀNH TRÌNH TRỤC X", sound: "beep",
        clues: { sound: "Máy im lặng, chỉ có còi báo", temp: "Nhiệt độ bình thường 41 °C", vib: "Rung 1,2 mm/s, bình thường", code: "AL-221 Không nhận tín hiệu cảm biến hành trình X" },
        causes: ["Cảm biến hành trình lỗi", "Vòng bi trục chính hỏng", "Tuột ống thủy lực", "Hết dầu bôi trơn"], ok: 0,
        part: "Cảm biến hành trình", stock: 0, waitHours: 4, repair: 1.0,
        why: "Nhiệt và rung bình thường, mã lỗi chỉ thẳng vào tín hiệu cảm biến → thay cảm biến hành trình. Không có SOP và tài liệu thì dò lỗi rất lâu." },
      { id: "hose", machine: "Máy phay CNC", code: "AL-310 · ÁP SUẤT THỦY LỰC THẤP", sound: "hiss",
        clues: { sound: "Tiếng xì xì, có dầu phun dưới chân máy", temp: "Nhiệt độ dầu 48 °C, bình thường", vib: "Rung 1,5 mm/s, bình thường", code: "AL-310 Áp suất thủy lực thấp" },
        causes: ["Tuột ống thủy lực", "Vòng bi trục chính hỏng", "Cảm biến hành trình lỗi", "Lọc gió bẩn"], ok: 0,
        part: "Ống thủy lực + đầu nối", stock: 1, waitHours: 2, repair: 1.0,
        why: "Tiếng xì + dầu phun + áp suất thấp → ống thủy lực tuột. Có sẵn ống dự phòng trong kho nên sửa nhanh." }
    ]
  },

  /* ---------- MÀN 4, kho phụ tùng ----------
     use: dùng/ngày (0 = phụ tùng dự phòng hoặc thay theo PM)  · lead: ngày
     safety: tồn an toàn · q: lượng đặt mỗi lần · price: nghìn đồng/đơn vị
     Min (ROP) = use × lead + safety · Max = Min + q                         */
  parts: {
    budgetK: 35000,
    items: [
      { id: "insert", n: "Mảnh dao tiện (insert)", cls: "C", use: 4,   useTxt: "4 cái/ngày",        lead: 5,  safety: 10, q: 30,  unit: "cái",  price: 120,   icon: "insert" },
      { id: "filter", n: "Lọc dầu thủy lực",       cls: "B", use: 0,   useTxt: "thay mỗi 500 giờ",  lead: 7,  safety: 1,  q: 1,   unit: "cái",  price: 850,   icon: "filter", need: [15] },
      { id: "belt",   n: "Dây curoa",              cls: "B", use: 0,   useTxt: "dự phòng",          lead: 5,  safety: 1,  q: 1,   unit: "sợi",  price: 450,   icon: "belt",   need: [9], urgentH: 2 },
      { id: "bearing",n: "Vòng bi trục chính",     cls: "A", use: 0,   useTxt: "dự phòng",          lead: 30, safety: 1,  q: 1,   unit: "bộ",   price: 12000, icon: "bearing",need: [17], urgentH: 7 },
      { id: "sensor", n: "Cảm biến hành trình",    cls: "A", use: 0,   useTxt: "dự phòng",          lead: 14, safety: 1,  q: 1,   unit: "cái",  price: 3500,  icon: "sensor", need: [24], urgentH: 5 },
      { id: "oil",    n: "Dầu bôi trơn rãnh trượt",cls: "C", use: 0.5, useTxt: "0,5 lít/ngày",      lead: 3,  safety: 2,  q: 6.5, unit: "lít",  price: 90,    icon: "oil" }
    ],
    clsInfo: {
      A: "Quan trọng: hỏng là dừng máy, lead time dài, giá cao → luôn có dự phòng",
      B: "Trung bình: cần cho PM định kỳ, mua được trong vài ngày",
      C: "Thông dụng: rẻ, dễ mua, tiêu hao hằng ngày"
    }
  },

  /* ---------- MÀN 5, nhật ký bảo trì 1 tháng ---------- */
  logs: {
    lathe: { name: "Máy tiện CNC", opHours: 400, events: [
      { day: 3,  desc: "Kẹt bàn xe dao, rãnh trượt thiếu dầu",   h: 4.5 },
      { day: 8,  desc: "Lỏng ốc bắt dao gây rung, sản phẩm rỗ",   h: 2.5 },
      { day: 13, desc: "Kẹt bàn xe dao, rãnh trượt thiếu dầu",   h: 4 },
      { day: 19, desc: "Quá nhiệt bơm dầu do lọc nghẹt",          h: 5 },
      { day: 26, desc: "Đứt dây curoa trục chính",                h: 4 } ] },
    mill: { name: "Máy phay CNC", opHours: 420, events: [
      { day: 6,  desc: "Vòng bi trục chính hỏng (7 giờ chờ mua vòng bi)", h: 10 },
      { day: 15, desc: "Cảm biến hành trình lỗi, dò lỗi lâu do không có tài liệu", h: 5 },
      { day: 23, desc: "Tuột ống thủy lực",                       h: 3 } ] }
  },

  /* ---------- MÀN 6, Kaizen: Why-Why + PDCA ---------- */
  kaizen: {
    owners: ["Tổ trưởng vận hành", "Kỹ sư bảo trì", "Thủ kho", "Phòng nhân sự"],
    deadlines: ["1 tuần", "2 tuần", "1 tháng", "6 tháng", "Chưa xác định"],
    okDeadlines: ["1 tuần", "2 tuần", "1 tháng"],
    cases: [
      { id: "lathe", machine: "Máy tiện CNC", title: "Kẹt bàn xe dao (2 lần/tháng)", metric: "MTBF",
        chain: [
          { q: "Tại sao bàn xe dao bị kẹt?", opts: ["Rãnh trượt thiếu dầu bôi trơn", "Người vận hành chạy quá tải", "Phôi quá cứng"], ok: 0 },
          { q: "Tại sao rãnh trượt thiếu dầu?", opts: ["Bình dầu cạn mà không ai châm", "Dầu kém chất lượng", "Bơm dầu tự động hỏng"], ok: 0 },
          { q: "Tại sao không ai châm dầu?", opts: ["Việc châm dầu không có trong checklist đầu ca, không rõ ai làm", "Người vận hành lười", "Kho hết dầu"], ok: 0 },
          { q: "Tại sao không có trong checklist?", opts: ["Chưa xây dựng tiêu chuẩn AM cho máy tiện (điểm, tần suất, người làm)", "Quản đốc quên", "Máy mới mua về"], ok: 0 }
        ],
        root: "Chưa có tiêu chuẩn bảo trì tự quản (AM) cho máy tiện",
        measures: [
          { n: "Đưa “kiểm tra & châm dầu rãnh trượt” vào checklist AM đầu ca", ok: true, owner: ["Tổ trưởng vận hành", "Kỹ sư bảo trì"] },
          { n: "Kẻ vạch MIN/MAX, dán nhãn điểm bôi trơn (quản lý trực quan)", ok: true, owner: ["Kỹ sư bảo trì", "Tổ trưởng vận hành"] },
          { n: "Đào tạo OPL “Châm dầu rãnh trượt đúng cách” cho cả 2 ca", ok: true, owner: ["Kỹ sư bảo trì", "Tổ trưởng vận hành"] },
          { n: "Kỷ luật người vận hành ca trước", ok: false, why: "Đổ lỗi cho người không sửa được hệ thống, lỗi sẽ lặp lại." },
          { n: "Mua máy tiện mới", ok: false, why: "Tốn kém, không xử lý nguyên nhân gốc, máy mới cũng sẽ kẹt nếu không bôi trơn." },
          { n: "Tăng tốc độ cắt để bù sản lượng", ok: false, why: "Không liên quan nguyên nhân, còn làm máy mòn nhanh hơn." }
        ],
        before: { mtbf: 80, mttr: 4, failures: 5 }, after: { mtbf: 200, mttr: 4, failures: 2 } },
      { id: "mill", machine: "Máy phay CNC", title: "Sửa vòng bi trục chính mất 10 giờ", metric: "MTTR",
        chain: [
          { q: "Tại sao sửa mất 10 giờ?", opts: ["Phải chờ mua vòng bi 7 giờ", "Thợ sửa chậm", "Máy phay quá phức tạp"], ok: 0 },
          { q: "Tại sao phải chờ mua vòng bi?", opts: ["Kho không có vòng bi dự phòng", "Nhà cung cấp ở xa", "Thủ kho nghỉ phép"], ok: 0 },
          { q: "Tại sao kho không có vòng bi dự phòng?", opts: ["Vòng bi chưa được xếp loại phụ tùng quan trọng (A), không có mức Min", "Giá đắt nên không mua", "Vừa dùng hết tháng trước"], ok: 0 },
          { q: "Tại sao chưa được xếp loại?", opts: ["Chưa có quy trình quản lý phụ tùng theo mức độ quan trọng (A/B/C, Min-Max)", "Không ai biết vòng bi quan trọng", "Phần mềm kho bị lỗi"], ok: 0 }
        ],
        root: "Chưa có quy trình quản lý phụ tùng quan trọng (A/B/C, Min-Max)",
        measures: [
          { n: "Xếp vòng bi trục chính loại A, đặt Min 1, Max 2 bộ", ok: true, owner: ["Thủ kho", "Kỹ sư bảo trì"] },
          { n: "Đo rung trục chính định kỳ (CBM) để thay trước khi hỏng", ok: true, owner: ["Kỹ sư bảo trì"] },
          { n: "Viết SOP thay vòng bi + đào tạo thợ bảo trì", ok: true, owner: ["Kỹ sư bảo trì"] },
          { n: "Thuê thêm thợ sửa chữa", ok: false, why: "Thời gian mất chủ yếu là chờ phụ tùng, thêm người không giảm được." },
          { n: "Chỉ mua khi hỏng để tiết kiệm vốn", ok: false, why: "Chính là nguyên nhân MTTR cao, máy dừng 7 giờ đắt hơn nhiều giá 1 bộ vòng bi." },
          { n: "Cho máy chạy chậm lại vĩnh viễn", ok: false, why: "Giảm năng suất (tổn thất P) mà không giải quyết gốc rễ." }
        ],
        before: { mtbf: 140, mttr: 6, failures: 3 }, after: { mtbf: 210, mttr: 2, failures: 2 } }
    ]
  },

  /* ---------- MÀN TỔNG HỢP, Tháng TPM (4 tuần) ----------
     cost: nghìn đồng · hrs: giờ công bảo trì · once: chỉ làm 1 lần          */
  month: {
    budgetK: 40000, hoursPerWeek: 16, opHours: { lathe: 400, mill: 420 },
    latheBasePerWeek: 1.25,
    actions: [
      { id: "am",     n: "AM đầu ca máy tiện (15 phút/ca)",        d: "Vệ sinh, bôi trơn, siết chặt mỗi ca", cost: 0,     hrs: 0, keep: true, eff: "Giảm 55% hỏng vặt máy tiện" },
      { id: "filter", n: "PM: thay lọc dầu thủy lực máy tiện",     d: "TBM, đến hạn 500 giờ",                cost: 850,   hrs: 2, once: true, eff: "Giảm 15% hỏng máy tiện" },
      { id: "belt",   n: "PM: kiểm tra & thay curoa máy tiện",     d: "Thay curoa đã nứt",                     cost: 450,   hrs: 1, once: true, eff: "Giảm 15% hỏng máy tiện" },
      { id: "cbm",    n: "CBM: đo rung trục chính máy phay",       d: "Mỗi tuần, ghi xu hướng",                cost: 300,   hrs: 1, eff: "Phát hiện vòng bi sắp hỏng" },
      { id: "sop",    n: "Viết SOP sửa chữa + đào tạo chẩn đoán",  d: "Cho thợ bảo trì máy phay",              cost: 2000,  hrs: 6, once: true, eff: "Chẩn đoán còn 0,5 giờ; sửa nhanh hơn 1 giờ" },
      { id: "sensor", n: "Đặt cảm biến hành trình dự phòng",       d: "Lead time 14 ngày",                      cost: 3500,  hrs: 0, once: true, lead: 2, eff: "Có hàng sau 2 tuần" },
      { id: "bearingStd", n: "Đặt vòng bi chính hãng",             d: "Lead time 30 ngày",                      cost: 12000, hrs: 0, once: true, lead: 5, eff: "Có hàng sau 30 ngày" },
      { id: "bearingFast", n: "Mua gấp vòng bi (giao 3 ngày)",     d: "Giá cao hơn 30%",                        cost: 15600, hrs: 0, once: true, lead: 1, eff: "Có hàng tuần sau" },
      { id: "hose",   n: "PM: siết, thay đầu nối ống thủy lực",    d: "Máy phay",                               cost: 200,   hrs: 1, once: true, eff: "Ngăn tuột ống" },
      { id: "loto",   n: "Bắt buộc LOTO khi sửa chữa",             d: "Khoá & thẻ cho mọi lần sửa",            cost: 0,     hrs: 0, keep: true, eff: "Zero tai nạn" }
    ],
    millEvents: [
      { week: 3, type: "sensor",  n: "Cảm biến hành trình X lỗi" },
      { week: 4, type: "bearing", n: "Vòng bi trục chính hỏng" }
    ],
    breakdownCostK: { lathe: 1500, sensor: 3500, bearing: 12000, hose: 400 }
  },

  /* ---------- Kết quả trước TPM (lấy từ game 2, OEE) ---------- */
  before: {
    lathe: { oee: 68.0, maintCostK: 9500 },
    mill:  { oee: 74.3, maintCostK: 16800 }
  },

  /* ---------- Bài học rút ra ---------- */
  lessons: [
    { t: "TPM là việc của mọi người", d: "Người vận hành giữ máy hằng ngày (AM), bảo trì làm theo kế hoạch (PM), lãnh đạo cấp nguồn lực. Mục tiêu: Zero hỏng hóc, Zero lỗi, Zero tai nạn." },
    { t: "Vệ sinh là kiểm tra", d: "4 việc AM mỗi ca: Vệ sinh, Kiểm tra, Bôi trơn, Siết chặt. Phát hiện bất thường thì gắn thẻ: XANH tự xử lý, ĐỎ chuyển bảo trì." },
    { t: "Sửa khi hỏng là đắt nhất", d: "Bảo trì sự cố làm dừng máy ngoài kế hoạch, ảnh hưởng giao hàng. Chuyển dần sang PM theo thời gian, theo tình trạng và dự đoán." },
    { t: "An toàn trước, LOTO luôn luôn", d: "Mọi lần sửa phải khoá năng lượng (điện, khí, thủy lực) và treo thẻ. Không có ngoại lệ vì “sửa nhanh”." },
    { t: "MTBF càng cao, MTTR càng thấp càng tốt", d: "MTBF = giờ vận hành ÷ số lần hỏng; MTTR = giờ sửa ÷ số lần hỏng; Độ sẵn sàng = MTBF ÷ (MTBF + MTTR)." },
    { t: "Mỗi máy một bệnh", d: "MTBF thấp → AM + PM. MTTR cao → phụ tùng quan trọng có sẵn (Min-Max), SOP sửa chữa, đào tạo, CBM." },
    { t: "Tìm gốc rễ, đừng đổ lỗi", d: "Hỏi Why-Why tới khi gặp lỗ hổng hệ thống (tiêu chuẩn, quy trình), rồi đối phó theo PDCA có người phụ trách và thời hạn." }
  ]
};
