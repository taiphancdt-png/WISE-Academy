/* =====================================================================
   CẤU HÌNH GAME "THỬ THÁCH 5S, XƯỞNG CƠ KHÍ CHÚ TÀI"
   ---------------------------------------------------------------------
   Đội IT/đào tạo chỉ cần sửa file này để thay nội dung:
     - items      : vật dụng (tên, vị trí đúng, lời giải thích)
     - layout     : bố trí mặt bằng (5 trạm dọc tường dài)
     - tape       : băng keo định vị người chơi tự dán (S4)
     - s4         : các hạng mục tiêu chuẩn hoá dạng lựa chọn (S4)
     - s5         : lịch đánh giá, xếp hạng, khen thưởng (S5)
   Toạ độ lưới ô 13 x 17: x = cạnh ngang (tường cửa nhập), y = cạnh dọc (dãy máy).
   ===================================================================== */
window.GAME_CONFIG = {
  title: "Thử thách 5S",
  workshop: "Xưởng Cơ khí Chú Tài",
  grid: { w: 13, h: 17 },
  playerStart: { x: 6, y: 15 },

  /* Ô cố định không đi qua được: bàn nguội (gắn bảng dụng cụ trên tường), bình chữa cháy.
     Máy móc, kệ, khu thẻ đỏ, thùng rác là "khối" di chuyển được, xem layout.blocks */
  blocked: [[6, 0], [7, 0], [8, 0], [10, 0]],

  /* Lối đi chính: dọc từ cửa nhập tới cổng xuất + nhánh ngang. Vật cản/dầu/máy lấn lối đi bị trừ điểm */
  aisle: { rects: [{ x0: 3, x1: 4, y0: 0, y1: 16 }, { x0: 5, x1: 12, y0: 8, y1: 9 }] },
  extinguisherTile: [10, 1],

  /* ---------------- BỐ TRÍ MẶT BẰNG (S2: Sắp xếp) ----------------
     5 ô trạm dọc tường dài. Vật liệu vào từ CỬA NHẬP (phía sau), hàng ra CỔNG XUẤT (phía trước, có xe container). */
  layout: {
    /* Kích thước (ô) của từng khối di chuyển được trên sơ đồ mặt bằng */
    foot: { shelf: [2, 3], lathe: [2, 3], mill: [2, 3], qc: [2, 3], finished: [2, 3], redtag: [3, 2], bins: [1, 4], desk: [2, 2] },
    names: { shelf: "Kệ vật tư", lathe: "Máy tiện", mill: "Máy phay CNC", qc: "Bàn kiểm tra QC", finished: "Khu thành phẩm", redtag: "Khu thẻ đỏ", bins: "Cụm thùng rác", desk: "Bàn làm việc chú Tài" },
    icons: { shelf: "🗄️", lathe: "⚙️", mill: "🛠️", qc: "🔍", finished: "📦", redtag: "🏷️", bins: "♻️", desk: "🖥️" },
    /* Lúc đầu: các trạm xếp lộn xộn dọc tường dài (ô y 0,3,6,9,12); khu thẻ đỏ & thùng rác ở vị trí sau */
    slotsY: [0, 3, 6, 9, 12],
    start: { redtag: [10, 11], bins: [12, 13], desk: [10, 4] },
    /* Trình tự công nghệ (dòng chảy) và vị trí chuẩn để so sánh */
    flow: ["shelf", "lathe", "mill", "qc", "finished"],
    ideal: { shelf: [0, 0], lathe: [0, 3], mill: [0, 6], qc: [0, 9], finished: [0, 12], redtag: [10, 11], bins: [12, 13], desk: [10, 4] },
    entry: [4, 0], exit: [4, 17],
    meterPerTile: 1.5,
    why: "Bố trí theo dòng chảy Vật liệu → Tiện → Phay → Kiểm tra QC → Thành phẩm, từ cửa nhập tới cổng xuất có xe container: hàng đi một chiều, không quay ngược, quãng đường vận chuyển ngắn nhất; máy móc không lấn lối đi."
  },

  /* Khu vực đặt đồ. station = gắn với một trạm (vị trí đổi theo bố trí) */
  zones: {
    board:      { name: "Bảng dụng cụ",           put: "Treo lên bảng dụng cụ",       tiles: [[6, 0], [7, 0], [8, 0]], icon: "🔧" },
    shelf:      { name: "Kệ vật tư",              put: "Đặt lên kệ vật tư",            station: "shelf", icon: "🗄️" },
    finished:   { name: "Khu thành phẩm",         put: "Đặt vào khu thành phẩm",       station: "finished", icon: "📦" },
    redtag:     { name: "Khu chờ xử lý (thẻ đỏ)", put: "Dán thẻ đỏ → khu chờ xử lý",   station: "redtag", icon: "🏷️" },
    binMetal:   { name: "Thùng kim loại vụn",     put: "Bỏ vào thùng KIM LOẠI VỤN",    bin: 0, icon: "🔩" },
    binRecycle: { name: "Thùng rác tái chế",      put: "Bỏ vào thùng RÁC TÁI CHẾ",     bin: 1, icon: "♻️" },
    binGeneral: { name: "Thùng rác sinh hoạt",    put: "Bỏ vào thùng RÁC SINH HOẠT",   bin: 2, icon: "🗑️" },
    binOily:    { name: "Thùng giẻ dính dầu",     put: "Bỏ vào thùng GIẺ DÍNH DẦU",    bin: 3, icon: "🛢️" }
  },

  /* Vị trí hiển thị đồ trong khu vực, toạ độ TƯƠNG ĐỐI so với góc của khối [x, y, độ cao z] */
  zoneSlots: {
    shelf:    [[0.5, 0.5, 49], [0.5, 1.5, 49], [0.5, 2.5, 49], [0.5, 0.5, 9], [0.5, 1.5, 9], [0.5, 2.5, 9], [0.5, 0.5, 89], [0.5, 1.5, 89], [0.5, 2.5, 89]],
    finished: [[0.6, 1.0, 13], [1.4, 1.0, 13], [0.6, 2.0, 13], [1.4, 2.0, 13]],
    redtag:   [[0.5, 0.5, 11], [1.5, 0.5, 11], [2.5, 0.5, 11], [0.5, 1.5, 11], [1.5, 1.5, 11], [2.5, 1.5, 11]]
  },

  /* Nơi vật dụng có thể xuất hiện lúc đầu (mỗi ván chọn ngẫu nhiên) */
  spawnPools: {
    floor: [[5, 2], [6, 3], [7, 2], [8, 4], [9, 2], [10, 3], [11, 2], [12, 4], [12, 6], [6, 6], [8, 6], [10, 6], [5, 11],
            [7, 12], [9, 11], [6, 14], [8, 15], [10, 14], [9, 16], [8, 13], [7, 10], [11, 7], [5, 5], [10, 15], [6, 16], [11, 10]],
    nearMachine: [[2, 1], [2, 2], [2, 4], [2, 5], [2, 7], [2, 8], [2, 10], [2, 11], [2, 13], [2, 14], [2, 16], [2, 15]],
    aisle: [[4, 3], [3, 8], [4, 12], [7, 8], [9, 9], [11, 8], [3, 15]],
    vehicle: [[4, 6], [7, 9], [10, 8], [8, 5], [6, 13], [5, 14], [10, 9]],
    lathe: [[1.3, 1.5, 50]],
    mill: [[1.25, 1.8, 61], [1.2, 0.9, 61]],
    bench: [[6.5, 0.5, 40, 6, 0], [7.4, 0.55, 40, 7, 0]],
    finished: ["zone"], shelfzone: ["zone"],
    hatch: [[10, 1]]
  },

  /* ------------------------------------------------------------------
     VẬT DỤNG (giai đoạn 1)
     correct: board / shelf / finished / redtag / binMetal / binRecycle / binGeneral / binOily / park (xe)
     alt    : vị trí chấp nhận một phần (nửa điểm)
     ------------------------------------------------------------------ */
  items: [
    { id: "wrench", name: "Cờ lê 13", sprite: "wrench", flat: true, correct: "board", slot: "wrench", spawn: ["floor", "lathe"],
      why: "Dụng cụ dùng hằng ngày phải treo đúng ô trên bảng dụng cụ. Nhìn ô trống là biết ngay thiếu cái gì." },
    { id: "caliper", name: "Thước cặp", sprite: "caliper", flat: true, correct: "board", slot: "caliper", spawn: ["mill", "floor"],
      why: "Dụng cụ đo để trên máy dễ rơi, va đập làm sai số. Cất đúng chỗ để giữ độ chính xác." },
    { id: "hammer", name: "Búa", sprite: "hammer", flat: true, correct: "board", slot: "hammer", spawn: ["nearMachine", "floor"],
      why: "Búa nằm trên sàn gây vấp ngã. Treo lên bảng để ai cũng biết búa đang ở đâu." },
    { id: "bar2", name: "Phôi thép (lẫn trong thành phẩm)", sprite: "barstock", correct: "shelf", spawn: ["finished"],
      why: "Phôi chưa gia công để lẫn vào khu thành phẩm dễ bị giao nhầm cho khách." },
    { id: "crate", name: "Thùng phôi chắn lối đi", sprite: "crate", correct: "shelf", spawn: ["aisle"], blocks: true,
      why: "Thùng phôi chắn lối đi gây nguy hiểm cho người và xe nâng. Vật tư phải về kệ vật tư." },
    { id: "fin3", name: "Thùng thành phẩm (để trên kệ vật tư)", sprite: "finbox", correct: "finished", spawn: ["shelfzone"],
      why: "Thành phẩm để trên kệ vật tư sẽ bị lẫn với nguyên liệu và có thể bị đưa ngược vào sản xuất." },
    { id: "defect1", name: "Chi tiết lỗi (bị nứt)", sprite: "defect", correct: "redtag", alt: ["binMetal"], spawn: ["finished"],
      why: "Hàng lỗi lẫn với hàng tốt có thể bị giao cho khách. Dán thẻ đỏ, đưa ra khu chờ xử lý để quyết định sửa hay hủy." },
    { id: "drawing", name: "Bản vẽ cũ (hết hiệu lực)", sprite: "drawing", flat: true, correct: "binRecycle", alt: ["binGeneral", "redtag"], spawn: ["lathe", "floor"],
      why: "Bản vẽ cũ để ở máy dễ làm sai theo phiên bản cũ. Thu hồi, hủy và đưa giấy vào thùng tái chế." },
    { id: "rag1", name: "Giẻ lau dính dầu", sprite: "rag", flat: true, correct: "binOily", spawn: ["nearMachine"],
      why: "Giẻ dính dầu dễ bắt lửa và là chất thải nguy hại, phải bỏ đúng thùng giẻ dính dầu." },
    { id: "lunch", name: "Hộp cơm đã ăn (còn thức ăn thừa)", sprite: "lunch", correct: "binGeneral", spawn: ["nearMachine", "floor"],
      why: "Hộp cơm dính thức ăn là rác sinh hoạt, không tái chế được. Không ăn uống tại khu vực máy." },
    { id: "scrap1", name: "Mẩu sắt vụn", sprite: "scrap", correct: "binMetal", spawn: ["floor", "nearMachine"],
      why: "Sắt vụn phân loại riêng vào thùng kim loại vụn để bán phế liệu, không lẫn với rác khác." },
    { id: "carton1", name: "Thùng carton rỗng (chắn bình chữa cháy)", sprite: "carton", correct: "binRecycle", spawn: ["hatch"], blocks: true,
      why: "Thùng carton chắn bình chữa cháy, khi có cháy sẽ mất thời gian. Carton là rác tái chế; khu trước PCCC luôn phải trống." },
    { id: "forklift", name: "Xe nâng máy", sprite: "forklift", vehicle: true, correct: "park", spawn: ["vehicle"], blocks: true,
      why: "Xe nâng đỗ tùy tiện, nhất là trên lối đi, gây cản trở và nguy hiểm. Phải đỗ gọn ngoài lối đi, tại vị trí có định vị." }
  ],
  parkName: "Đỗ gọn ngoài lối đi, có băng keo định vị",

  /* Vết bẩn cần lau/quét. source = máy gây rò dầu (vết dầu luôn nằm sát máy đó) */
  dirt: [
    { id: "oil1", kind: "oil", name: "Vũng dầu cạnh máy tiện", source: "lathe", why: "Dầu loang gây trơn trượt. Lau sạch xong phải tìm hiểu vì sao dầu ra sàn để ngăn tái diễn." },
    { id: "oil2", kind: "oil", name: "Vũng dầu cạnh máy phay", source: "mill", why: "Vết dầu là triệu chứng, nguyên nhân mới là thứ cần xử lý. Vệ sinh là kiểm tra: phát hiện bất thường để sửa tận gốc." },
    { id: "chips1", kind: "chips", name: "Phoi kim loại", pool: ["nearMachine"], why: "Phoi sắc cạnh dễ đâm thủng giày, gây trượt ngã. Quét sạch sau mỗi ca." },
    { id: "chips2", kind: "chips", name: "Phoi kim loại", pool: ["nearMachine"], why: "Vệ sinh cũng là kiểm tra: dọn phoi giúp phát hiện sớm bất thường của máy." },
    { id: "chips3", kind: "chips", name: "Phoi kim loại", pool: ["aisle", "floor"], why: "Phoi văng ra lối đi cho thấy máy cần tấm chắn phoi, cải tiến tận gốc." }
  ],
  /* Máy rò rỉ (releak: true) chưa được sửa tận gốc sẽ chảy dầu lại sau (giây) */
  releakSec: 35,

  /* Báo cáo sự cố rò dầu (S3: Sạch sẽ: vệ sinh là kiểm tra) */
  leaks: [
    { machine: "lathe", name: "Sự cố vũng dầu: Máy tiện", releak: false, badge: "📋 Đã chuẩn hoá châm dầu",
      src: [
        { label: "Công nhân làm đổ dầu khi châm dầu cho máy (không dùng phễu, không có khay hứng)", ok: true },
        { label: "Gioăng / ống dầu của máy tiện bị rò rỉ" },
        { label: "Nước mưa từ mái nhà dột xuống" }],
      act: [
        { label: "Báo cáo sự cố + chuẩn hoá cách châm dầu: dùng phễu, khay hứng, dán hướng dẫn một điểm (OPL) tại máy", ok: true },
        { label: "Lập phiếu yêu cầu bảo trì tháo máy kiểm tra" },
        { label: "Lau sạch là được, không cần báo ai" }],
      why: "Dầu tràn do thao tác châm dầu chứ máy không hỏng, gọi bảo trì là lãng phí. Cần chuẩn hoá cách làm (phễu, khay hứng, OPL) để lần sau không đổ nữa." },
    { machine: "mill", name: "Sự cố vũng dầu: Máy phay CNC", releak: true, badge: "🛠️ Đã báo bảo trì",
      src: [
        { label: "Đường ống thủy lực / bơm dung dịch làm mát của máy phay bị rò", ok: true },
        { label: "Dầu từ xe nâng đỗ gần đó" },
        { label: "Không cần biết nguồn, cứ lau là xong" }],
      act: [
        { label: "Gắn thẻ bất thường lên máy + lập phiếu yêu cầu bảo trì sửa chữa (vị trí rò, ảnh, mức độ)", ok: true },
        { label: "Rải mùn cưa thấm dầu cho khỏi trơn" },
        { label: "Ghi vào sổ, cuối năm bảo trì định kỳ sẽ xem" }],
      why: "Rò thủy lực để lâu làm máy hỏng nặng và mất an toàn. Báo bảo trì ngay khi phát hiện; khay hứng hay mùn cưa chỉ là giải pháp tạm." }
  ],

  /* ------------------------------------------------------------------
     GIAI ĐOẠN 2, BĂNG KEO ĐỊNH VỊ (người chơi tự kéo trên nền, tự canh thẳng theo trục)
     target: aisle | block:<khối> | blocks:<khối>,<khối> | vehicles  (vị trí tính theo nơi người chơi đặt khối)
     colors: màu băng keo được coi là đúng chuẩn
     ------------------------------------------------------------------ */
  tapeColors: [
    { id: "yellow", name: "Vàng", css: "#F5C02E" },
    { id: "white", name: "Trắng", css: "#F4F6F9" },
    { id: "green", name: "Xanh lá", css: "#2E9A57" },
    { id: "red", name: "Đỏ", css: "#D9412F" },
    { id: "hazard", name: "Vàng / đen", css: "repeating-linear-gradient(45deg,#2B2B2B 0 5px,#F5C02E 5px 10px)" },
    { id: "redwhite", name: "Đỏ / trắng", css: "repeating-linear-gradient(45deg,#D9412F 0 5px,#fff 5px 10px)" }
  ],
  tape: [
    { id: "aisle", name: "Vạch lối đi", icon: "🛣️", target: "aisle", colors: ["yellow"], marker: [4, 5],
      right: "Băng vàng liền dọc hai mép lối đi chính và nhánh ngang",
      why: "Vàng là màu tiêu chuẩn cho lối đi và ranh giới. Kẻ hai mép lối đi giữ đường luôn thông thoáng, tách người và xe nâng." },
    { id: "finished", name: "Định vị khu thành phẩm", icon: "📦", target: "block:finished", colors: ["green"],
      right: "Băng xanh lá bao quanh khu thành phẩm",
      why: "Xanh lá là màu của hàng đạt/thành phẩm; đỏ dành cho hàng lỗi, dùng sai màu gây nhầm lẫn." },
    { id: "redtag", name: "Định vị khu chờ xử lý", icon: "🏷️", target: "block:redtag", colors: ["red"],
      right: "Băng đỏ bao quanh khu thẻ đỏ",
      why: "Hàng lỗi/chờ quyết định phải tách biệt bằng màu đỏ để không ai lấy nhầm đưa vào sản xuất hay giao khách." },
    { id: "machine", name: "Vùng an toàn quanh máy", icon: "⚠️", target: "blocks:lathe,mill", colors: ["hazard"],
      right: "Băng vàng-đen bao quanh máy tiện và máy phay",
      why: "Sọc vàng-đen là tín hiệu cảnh báo nguy hiểm (máy quay, phoi văng): người đi ngang tự giữ khoảng cách an toàn." },
    { id: "parking", name: "Chỗ đỗ xe nâng", icon: "🚜", target: "vehicles", colors: ["white", "yellow"],
      right: "Băng trắng (hoặc vàng) bao quanh chỗ đỗ xe nâng",
      why: "Thiết bị di động cũng cần \"địa chỉ\": ô đỗ định vị giúp trả xe đúng chỗ, không chiếm lối đi." }
  ],

  /* GIAI ĐOẠN 2, các hạng mục tiêu chuẩn hoá dạng lựa chọn */
  s4: [
    { id: "hatch", name: "Ô trước bình chữa cháy", icon: "🧯", tiles: [[10, 1]], q: "Khu vực ngay trước bình chữa cháy nên đánh dấu thế nào?",
      options: [
        { label: "Ô sọc đỏ-trắng: cấm để đồ", sw: "repeating-linear-gradient(45deg,#D9412F 0 5px,#fff 5px 10px)", ok: true, show: ["hatchRW"] },
        { label: "Viền vàng như một ô để hàng", sw: "#F5C02E", show: ["hatchYellow"] },
        { label: "Không cần đánh dấu", sw: "", show: [] }],
      why: "Sọc đỏ-trắng báo hiệu khu vực cấm để đồ, thiết bị PCCC phải tiếp cận được ngay trong vài giây." },
    { id: "signs", name: "Biển nhận diện khu vực", icon: "🪧", zone: "redtag", q: "Có cần gắn biển tên cho khu thành phẩm và khu chờ xử lý không?",
      options: [
        { label: "Gắn biển \"KHU THÀNH PHẨM\" và \"KHU CHỜ XỬ LÝ\"", sw: "#2E9A57", ok: true, show: ["signFinished", "signRedtag"] },
        { label: "Không cần, băng keo màu là đủ", sw: "", show: [] }],
      why: "Biển tên + màu băng keo giúp người mới, khách tham quan hay tài xế xe container đều nhận ra ngay từng khu." },
    { id: "board", name: "Bảng dụng cụ", icon: "🔧", zone: "board", q: "Chuẩn hoá bảng dụng cụ như thế nào?",
      options: [
        { label: "Vẽ hình bóng + ghi tên từng dụng cụ", sw: "#3B4856", ok: true, show: ["boardFull"] },
        { label: "Chỉ dán chữ \"DỤNG CỤ\" ở đầu bảng", sw: "#002F5B", show: ["boardGeneric"] },
        { label: "Để móc trống, treo đâu cũng được", sw: "", show: ["boardPlain"] }],
      why: "Bảng hình bóng (shadow board): mỗi dụng cụ một chỗ, nhìn ô trống là biết thiếu gì, ai đang mượn." },
    { id: "shelf", name: "Nhãn kệ vật tư", icon: "🗄️", station: "shelf", q: "Dán nhãn kệ vật tư như thế nào?",
      options: [
        { label: "Mã vị trí + tên vật tư + mức tồn MIN-MAX", sw: "#002F5B", ok: true, show: ["shelfLabelOk"] },
        { label: "Nhãn chung chữ \"KỆ\"", sw: "#9AA3AB", show: ["shelfLabelGeneric"] },
        { label: "Không cần nhãn", sw: "", show: [] }],
      why: "Nhãn đầy đủ giúp lấy đúng vật tư, trả đúng chỗ và biết khi nào cần đặt thêm (dưới mức MIN)." },
    { id: "bins", name: "Nhãn thùng phân loại rác", icon: "♻️", zone: "binRecycle", q: "Dán nhãn 4 thùng rác như thế nào?",
      options: [
        { label: "Nhãn + biểu tượng riêng từng loại, dán ở mặt dễ nhìn", sw: "#2F78C4", ok: true, show: ["binMetalLabelOk", "binRecycleLabelOk", "binGeneralLabelOk", "binOilyLabelOk"] },
        { label: "Ghi chung chữ \"RÁC\" cho cả 4 thùng", sw: "#9AA3AB", show: ["binMetalLabelGeneric", "binRecycleLabelGeneric", "binGeneralLabelGeneric", "binOilyLabelGeneric"] },
        { label: "Không cần, nhìn màu thùng là đủ", sw: "", show: [] }],
      why: "Màu thùng + nhãn + biểu tượng giúp phân loại đúng cả với người mới: kim loại, tái chế, sinh hoạt, giẻ dầu (chất thải nguy hại)." }
  ],

  /* GIAI ĐOẠN 3, SẴN SÀNG: lịch đánh giá, xếp hạng, khen thưởng */
  s5: [
    { id: "freq", group: "Lịch đánh giá", q: "Lên lịch đánh giá 5S cho xưởng thế nào?",
      options: [
        { label: "Tự kiểm 5 phút cuối mỗi ca + trưởng ca chấm hằng tuần + audit chéo hằng tháng", ok: true },
        { label: "Mỗi năm đánh giá 1 lần, trước đợt kiểm tra ISO" },
        { label: "Chỉ đánh giá khi có khách hoặc lãnh đạo xuống xưởng" }],
      why: "Đánh giá nhiều tầng (ca, tuần, tháng) biến 5S thành thói quen hằng ngày, không phải phong trào trước đợt kiểm tra." },
    { id: "who", group: "Lịch đánh giá", q: "Ai là người chấm điểm 5S?",
      options: [
        { label: "Luân phiên các tổ chấm chéo nhau theo cùng một checklist", ok: true },
        { label: "Mỗi tổ tự chấm cho tổ mình" },
        { label: "Chỉ giám đốc chấm" }],
      why: "Chấm chéo theo checklist chung giúp khách quan, mọi người học hỏi lẫn nhau và cùng hiểu chuẩn." },
    { id: "tool", group: "Lịch đánh giá", q: "Dùng công cụ gì để đánh giá?",
      options: [
        { label: "Checklist 5S có thang điểm cho từng chữ S + ảnh trước/sau", ok: true },
        { label: "Nhận xét miệng sau khi đi một vòng" },
        { label: "Chấm theo cảm nhận chung" }],
      why: "Checklist có thang điểm + ảnh giúp đo được, so sánh được qua từng tháng và chỉ ra đúng điểm cần cải thiện." },
    { id: "rank", group: "Xếp hạng", q: "Công bố kết quả xếp hạng như thế nào?",
      options: [
        { label: "Dán bảng điểm các tổ tại bảng 5S của xưởng hằng tháng, kèm điểm cần cải thiện", ok: true },
        { label: "Giữ kín kết quả để tránh mất lòng" },
        { label: "Chỉ nêu tên tổ kém nhất trong cuộc họp" }],
      why: "Quản lý trực quan: công khai, minh bạch tạo động lực thi đua lành mạnh và ai cũng biết mình đang ở đâu." },
    { id: "reward", group: "Khen thưởng", q: "Khen thưởng, động viên thế nào?",
      options: [
        { label: "Tuyên dương + cờ thi đua tổ dẫn đầu, chia sẻ cách làm hay; hỗ trợ tổ điểm thấp cải tiến", ok: true },
        { label: "Phạt tiền tổ có điểm thấp nhất" },
        { label: "Không cần khen thưởng vì 5S là việc phải làm" }],
      why: "Ghi nhận kịp thời giữ lửa cho 5S. Phạt tạo tâm lý đối phó, che giấu, Toyota sửa hệ thống chứ không đổ lỗi con người." }
  ],

  /* Tóm tắt lý thuyết 5S (nút "Xem bài học 5S") */
  lessons: [
    { s: "Sàng lọc", jp: "Seiri", text: "Phân biệt cái cần và không cần. Bỏ cái không cần; cái chưa chắc thì dán thẻ đỏ, đưa ra khu chờ xử lý để người có trách nhiệm quyết định." },
    { s: "Sắp xếp", jp: "Seiton", text: "Mỗi thứ một chỗ, mỗi chỗ một thứ. Sắp xếp layout xưởng theo dòng chảy: cửa nhập → kệ vật tư → gia công → kiểm tra → thành phẩm → cổng xuất, để lô hàng đi ngắn nhất, không quay đầu, không cắt ngang lối đi (vẽ sơ đồ spaghetti để thấy quãng đường). Dùng kệ, bảng hình bóng để lấy nhanh, trả đúng." },
    { s: "Sạch sẽ", jp: "Seiso", text: "Vệ sinh là kiểm tra. Lau dầu, quét phoi, phân loại rác đúng thùng: kim loại, tái chế, sinh hoạt, chất thải nguy hại." },
    { s: "Săn sóc", jp: "Seiketsu", text: "Tiêu chuẩn hoá để giữ 3S đầu: băng keo định vị theo màu (vàng lối đi, xanh thành phẩm, đỏ hàng lỗi, vàng-đen nguy hiểm), nhãn, hình bóng dụng cụ." },
    { s: "Sẵn sàng", jp: "Shitsuke", text: "Biến 5S thành thói quen: lịch đánh giá định kỳ, chấm chéo theo checklist, công bố xếp hạng, khen thưởng, động viên kịp thời." }
  ]
};
