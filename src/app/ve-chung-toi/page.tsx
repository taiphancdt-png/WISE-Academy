import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, ShieldCheck, Target } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Section, SectionHeader, CtaBand } from "@/components/ui";

export const metadata = {
  title: "Về Chúng Tôi & Triết Lý RGPDCA — WISE Academy",
  description: "Tìm hiểu tầm nhìn, sứ mệnh, giá trị cốt lõi W-I-S-E và phương pháp luận độc quyền RGPDCA được hướng dẫn bởi MIT chuẩn quốc tế.",
  alternates: { canonical: "/ve-chung-toi" },
};

// W · I · S · E accent colors (brand navy / orange family). Orange shades used here pass contrast for large text.
const VALUE_COLORS = ["#002F5B", "#E8590C", "#073866", "#C9500E"];
// Darker variants for the small uppercase labels so they meet AA contrast on white.
const VALUE_TEXT = ["#002F5B", "#B5470C", "#073866", "#A8430B"];

// Card placement and outgoing arrow for each RGPDCA step on desktop (3 columns × 2 rows, clockwise loop).
const LOOP = [
  { place: "lg:col-start-1 lg:row-start-1", icon: ArrowRight, arrowPos: "top-1/2 -translate-y-1/2 -right-[52px]" },
  { place: "lg:col-start-2 lg:row-start-1", icon: ArrowRight, arrowPos: "top-1/2 -translate-y-1/2 -right-[52px]" },
  { place: "lg:col-start-3 lg:row-start-1", icon: ArrowDown, arrowPos: "left-1/2 -translate-x-1/2 -bottom-[60px]" },
  { place: "lg:col-start-3 lg:row-start-2", icon: ArrowLeft, arrowPos: "top-1/2 -translate-y-1/2 -left-[52px]" },
  { place: "lg:col-start-2 lg:row-start-2", icon: ArrowLeft, arrowPos: "top-1/2 -translate-y-1/2 -left-[52px]" },
  { place: "lg:col-start-1 lg:row-start-2", icon: ArrowUp, arrowPos: "left-1/2 -translate-x-1/2 -top-[60px]" },
];

export default function AboutPage() {
  const values = [
    {
      letter: "W",
      word: "WORKABLE",
      title: "Dễ Làm & Hiệu Quả Thực Tế",
      desc: "Chúng tôi ưu tiên tạo ra giá trị đo lường được cho doanh nghiệp: giải pháp phải đơn giản, thực tế và áp dụng được ngay tại nơi làm việc."
    },
    {
      letter: "I",
      word: "IMPROVEMENT",
      title: "Cải Tiến Liên Tục Mỗi Ngày",
      desc: "WISE cam kết mang đến giá trị vượt trội bằng sự tận tâm, chuyên nghiệp, biến việc tìm kiếm điểm tốt hơn thành thói quen văn hóa trong tổ chức."
    },
    {
      letter: "S",
      word: "SHARE",
      title: "Chia Sẻ Kinh Nghiệm Thật",
      desc: "Chúng tôi nỗ lực đóng góp giá trị chung cho cộng đồng doanh nghiệp Việt Nam, phụng sự nền kinh tế nước nhà với tinh thần trách nhiệm cao nhất."
    },
    {
      letter: "E",
      word: "EXCELLENCE",
      title: "Gọn Gàng & Tiết Kiệm Chi Phí",
      desc: "WISE kiên định tìm kiếm giải pháp tối ưu nhất, giúp đối tác đạt được hiệu quả vận hành vượt trội trong khi tiết kiệm tối đa nguồn lực và chi phí."
    }
  ];

  const rgpdcaDetails = [
    {
      phase: "BƯỚC 01",
      code: "R - RESEARCH",
      name: "Khảo Sát Thực Tế Tại Hiện Trường",
      action: "Xuống Tận Nơi Quan Sát Thao Tác & Đánh Giá Hiện Trạng",
      content: "Chuyên gia WISE trực tiếp đến hiện trường — nhà máy, kho vận hay văn phòng — quan sát luồng vật tư và dòng thông tin. Quan sát tỉ mỉ các thao tác thừa, phỏng vấn sâu ban lãnh đạo và quản lý trực tiếp để xây dựng bức tranh hiện trạng toàn diện."
    },
    {
      phase: "BƯỚC 02",
      code: "G - GOALS",
      name: "Xác Lập Mục Tiêu & Định Lượng Kết Quả",
      action: "Gắn Kết Cải Tiến Vận Hành Với Bảng Cân Đối Tài Chính",
      content: "Cùng Ban Giám Đốc xác định rõ các chỉ số đo lường thành công: Tỷ lệ nâng OEE, rút ngắn Lead Time, giảm công việc dở dang và tồn kho (WIP), giảm tỷ lệ phế phẩm (PPM/Defect Rate) và tính toán giá trị tiết kiệm tài chính (Cost Savings) cụ thể."
    },
    {
      phase: "BƯỚC 03",
      code: "P - PLAN",
      name: "Thiết Kế Lộ Trình Chuyển Đổi Tinh Gọn (Roadmap)",
      action: "Lean House & Lộ Trình 3 Giai Đoạn Chuẩn MIT",
      content: "Xây dựng bản kế hoạch chi tiết gồm 3 giai đoạn: Khám phá nhận thức (Explore) -> Xây dựng nền móng (Foundation) -> Nhân rộng toàn diện (Scale). Kế hoạch phân bổ nguồn lực rõ ràng theo từng tháng, xác định khu vực thí điểm mẫu (Model Line) và thiết lập ban chỉ đạo cải tiến."
    },
    {
      phase: "BƯỚC 04",
      code: "D - DO",
      name: "Triển Khai Thí Điểm & Huấn Luyện Tại Hiện Trường",
      action: "Simulation Game + Kèm Cặp Dự Án Thực Chiến",
      content: "Tổ chức đào tạo gắn liền với thực hành tại hiện trường. Ứng dụng Lean Simulation Game để xóa bỏ tư duy lối mòn, sau đó chuyên gia cùng đội ngũ nòng cốt trực tiếp triển khai 5S, Lean Cell, SMED, Kanban tại khu vực mẫu để đạt được Quick Wins ngay trong 60 - 90 ngày đầu tiên."
    },
    {
      phase: "BƯỚC 05",
      code: "C - CHECK",
      name: "Đo Lường, Đánh Giá & Phân Tích Khoảng Cách",
      action: "Đo Lường Before/After & Kiểm Toán Tiến Độ Định Kỳ",
      content: "Hàng tuần và hàng tháng, ban chỉ đạo tiến hành đo lường các chỉ số Before/After trên quy trình thực tế. Đối chiếu với mục tiêu ban đầu, phân tích nguyên nhân gốc rễ (Root Cause Analysis) nếu có độ lệch và điều chỉnh biện pháp can thiệp kịp thời."
    },
    {
      phase: "BƯỚC 06",
      code: "A - ACTION & ADJUST",
      name: "Chuẩn Hóa (Standardize) & Nhân Rộng Bền Vững",
      action: "Ban Hành SOP, Hệ Thống DMS & Đào Tạo Lean Leaders",
      content: "Đóng gói các giải pháp thành công thành Tiêu chuẩn công việc (Standard Work/SOP). Thiết lập hệ thống quản lý hàng ngày (Daily Management System - DMS) để giữ vững kết quả và chuyển giao năng lực cho các Lean Leaders tự nhân rộng ra toàn bộ tổ chức."
    }
  ];

  return (
    <div>
      <PageHero
        eyebrow="Câu chuyện & sứ mệnh"
        image="/images/projects/geodis-vietnam-dao-tao-thuc-hanh-5s-an-toan-quan-ly-truc-quan/photo_10.webp"
        title={<>WISE Academy: <span className="text-[#FF7A30]">đồng hành kiến tạo năng lực vận hành xuất sắc</span></>}
        description="WISE định vị là đơn vị tiên phong trong đào tạo và tư vấn Lean ứng dụng tại Việt Nam, đồng hành cùng doanh nghiệp từ chẩn đoán, thiết kế giải pháp đến thực hành thí điểm và nhân rộng bền vững."
      />

      {/* Quote */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-6">
        <figure className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-1 bg-[#F76011] mx-auto rounded-full mb-6" />
          <blockquote className="text-xl sm:text-2xl italic text-[#002F5B] leading-relaxed">
            “Sự phát triển và trưởng thành của nguồn nhân lực là trách nhiệm cao cả nhất của lãnh đạo.”
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase font-bold tracking-widest text-[#486581]">
            Harvey S. Firestone · Triết lý cốt lõi của WISE Academy
          </figcaption>
        </figure>
      </section>

      {/* Vision & Mission */}
      <Section tone="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-soft !transform-none p-8 sm:p-10">
            <span className="w-12 h-12 rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-[#002F5B]">Tầm nhìn</h2>
            <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
              WISE định vị là <strong className="text-[#102A43]">đơn vị dẫn đầu</strong> trong đào tạo và tư vấn Lean ứng dụng tại Việt Nam và khu vực Đông Nam Á, đồng hành cùng các doanh nghiệp sản xuất, logistics và dịch vụ trên hành trình tối ưu hóa vận hành, chuyển đổi số và nâng tầm năng lực cạnh tranh quốc tế.
            </p>
          </div>
          <div className="card-soft !transform-none p-8 sm:p-10">
            <span className="w-12 h-12 rounded-full bg-[#002F5B] text-[#FF7A30] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-[#002F5B]">Sứ mệnh</h2>
            <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
              WISE khai thác triệt để mọi cơ hội để <strong className="text-[#102A43]">phát triển năng lực nội tại và tạo giá trị bền vững</strong> cho đối tác, dựa trên nền tảng chuyên môn sâu rộng và kinh nghiệm thực chiến của đội ngũ chuyên gia Lean Six Sigma từng giữ cương vị quản lý cấp cao tại các tập đoàn sản xuất lớn.
            </p>
          </div>
        </div>
      </Section>

      {/* Core values — each pillar with its own accent */}
      <Section>
        <SectionHeader
          eyebrow="Giá trị cốt lõi"
          title={<>Bốn trụ cột <span className="text-[#F76011]">W · I · S · E</span></>}
          description="Bộ gen định hình cách các chuyên gia WISE tư vấn, tương tác và đồng hành cùng khách hàng."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const color = VALUE_COLORS[i % VALUE_COLORS.length];
            return (
              <div key={v.letter} className="card-soft relative overflow-hidden p-7 pt-8" style={{ borderTop: `5px solid ${color}` }}>
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -bottom-8 text-[140px] font-extrabold leading-none select-none"
                  style={{ color, opacity: 0.08 }}
                >
                  {v.letter}
                </span>
                <span className="relative w-14 h-14 rounded-2xl text-white flex items-center justify-center font-extrabold text-2xl shadow-md" style={{ backgroundColor: color }}>
                  {v.letter}
                </span>
                <span className="relative mt-5 block text-[11px] font-bold uppercase tracking-widest" style={{ color: VALUE_TEXT[i % VALUE_TEXT.length] }}>
                  {v.word}
                </span>
                <h3 className="relative mt-1 text-lg font-semibold text-[#002F5B]">{v.title}</h3>
                <p className="relative mt-3 text-sm text-[#486581] leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* RGPDCA */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Phương pháp luận RGPDCA"
          title={<>Lộ trình 6 giai đoạn <span className="text-[#F76011]">khoa học & bền vững</span></>}
          description="Không áp dụng một công thức rập khuôn cho mọi tổ chức. WISE cùng đội ngũ của bạn đi qua 6 bước khép kín để đảm bảo thay đổi là thật và duy trì được sau khi dự án kết thúc."
        />
        {/* Loop: 1 → 2 → 3 ↓ 4 → 5 → 6 (bottom row runs right-to-left) ↑ back to 1 */}
        <div className="relative">
          <ol className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-16 lg:gap-y-20">
            {rgpdcaDetails.map((item, i) => {
              const step = i + 1;
              const out = LOOP[i];
              const Arrow = out.icon;
              return (
                <li key={item.phase} className={`relative card-soft !transform-none p-7 ${out.place}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#F76011]">{String(step).padStart(2, "0")}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#486581]">{item.code}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#002F5B] leading-snug">{item.name}</h3>
                  <p className="mt-2 text-xs font-semibold text-[#C9500E]">{item.action}</p>
                  <p className="mt-3 text-sm text-[#486581] leading-relaxed">{item.content}</p>

                  {/* Desktop: arrow toward the next step, sitting in the gap */}
                  <span
                    aria-hidden="true"
                    className={`hidden lg:flex absolute w-10 h-10 rounded-full bg-[#F76011] text-white items-center justify-center shadow-md shadow-[#F76011]/30 ${out.arrowPos}`}
                  >
                    <Arrow className="w-5 h-5" />
                  </span>
                  {/* Mobile: down arrow between stacked steps */}
                  {step < 6 && (
                    <span aria-hidden="true" className="lg:hidden absolute left-1/2 -translate-x-1/2 -bottom-10 w-8 h-8 rounded-full bg-[#F76011] text-white flex items-center justify-center">
                      <ArrowDown className="w-4 h-4" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Loop label in the middle of the cycle (desktop) / after step 6 (mobile) */}
          <div className="mt-10 lg:mt-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex justify-center pointer-events-none">
            <span className="inline-flex items-center gap-2 bg-[#002F5B] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
              <RefreshCw className="w-4 h-4 text-[#FF7A30]" />
              Vòng cải tiến liên tục · bước 6 quay lại bước 1
            </span>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Bạn muốn chuyên gia xuống khảo sát thực tế tại doanh nghiệp cùng WISE?"
        description="Chuyên gia của chúng tôi sẵn sàng cùng Ban Giám Đốc trực tiếp xuống hiện trường để cùng nhìn nhận các điểm lãng phí và cơ hội cải tiến."
        label="Đặt lịch khảo sát miễn phí"
      />
    </div>
  );
}
