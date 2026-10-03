import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, ShieldCheck, Target } from "@/components/icons";
import PageHero from "@/components/PageHero";
import { Section, SectionHeader, CtaBand } from "@/components/ui";

export const metadata = {
  title: "Về Chúng Tôi & Triết Lý RGPDCA | WISE Academy",
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
      title: "Áp dụng được\nHiệu quả thật",
      desc: "Chúng tôi ưu tiên tạo ra giá trị đo lường được cho doanh nghiệp: giải pháp phù hợp, thực tế và áp dụng được ngay tại nơi làm việc."
    },
    {
      letter: "I",
      word: "IMPROVEMENT",
      title: "Cải Tiến Liên Tục Mỗi Ngày",
      desc: "Chúng tôi cam kết mang đến giá trị vượt trội bằng sự tận tâm, chuyên nghiệp, chuyển hóa tư duy cải tiến liên tục trở thành văn hóa trong tổ chức."
    },
    {
      letter: "S",
      word: "SHARE",
      title: "Chia sẻ kinh nghiệm\nKết nối chuyên gia",
      desc: "Chúng tôi chia sẻ kinh nghiệm vận hành thật và kết nối doanh nghiệp với đội ngũ chuyên gia giàu kinh nghiệm, cùng đóng góp giá trị chung cho cộng đồng doanh nghiệp."
    },
    {
      letter: "E",
      word: "EXCELLENCE",
      title: "Gọn Gàng & Tiết Kiệm Chi Phí",
      desc: "Chúng tôi kiên định tìm kiếm giải pháp tối ưu nhất, giúp đối tác đạt được hiệu quả vận hành vượt trội trong khi tiết kiệm tối đa nguồn lực và chi phí."
    }
  ];

  const rgpdcaDetails = [
    {
      phase: "BƯỚC 01",
      code: "R - RESEARCH",
      name: "Đi Gemba,\nHiểu đúng hiện trạng",
      action: "Đến tận nơi, xem tận mắt, hỏi tại sao",
      content: "Chuyên gia WISE Academy cùng đội ngũ của bạn đi dọc chuỗi giá trị: đứng vòng tròn Ohno để nhìn ra lãng phí, đo thời gian chu kỳ và tồn kho thực tế, lắng nghe người trực tiếp làm việc. Kết quả là sơ đồ chuỗi giá trị hiện trạng (Current VSM) và danh sách vấn đề được chứng minh bằng dữ liệu, không bằng cảm tính."
    },
    {
      phase: "BƯỚC 02",
      code: "G - GOALS",
      name: "Xác định True North & mục tiêu đo được",
      action: "Từ chiến lược đến chỉ số Q-C-D-S-M",
      content: "Cùng ban lãnh đạo xác định đích đến dài hạn (True North) và chuyển thành vài chỉ số then chốt: OEE, Lead Time, WIP, tỷ lệ lỗi, năng suất lao động. Mỗi chỉ số có giá trị nền, mục tiêu và giá trị tài chính tương ứng, để cải tiến vận hành gắn trực tiếp với kết quả kinh doanh."
    },
    {
      phase: "BƯỚC 03",
      code: "P - PLAN",
      name: "Thiết kế trạng thái tương lai & lộ trình",
      action: "Future VSM, Hoshin Kanri, Model Line",
      content: "Vẽ sơ đồ chuỗi giá trị tương lai, chọn khu vực mô hình (Model Line) và triển khai mục tiêu xuống từng cấp theo Hoshin Kanri. Lộ trình đi qua 3 giai đoạn Explore, Foundation, Scale với nguồn lực, người phụ trách và mốc thời gian rõ ràng, do ban chỉ đạo và đội Lean nòng cốt dẫn dắt."
    },
    {
      phase: "BƯỚC 04",
      code: "D - DO",
      name: "Thí điểm tại Model Line, học bằng làm",
      action: "Kaizen Event & kèm cặp tại hiện trường",
      content: "Đào tạo đi liền thực hành: Lean Simulation Game để thay đổi tư duy, sau đó chuyên gia cùng đội nòng cốt chạy các Kaizen Event tại khu vực mô hình với 5S, công việc tiêu chuẩn, cân bằng chuyền, SMED, Kanban. Mục tiêu là có kết quả thấy được trong 60-90 ngày đầu và đội ngũ tự làm được."
    },
    {
      phase: "BƯỚC 05",
      code: "C - CHECK",
      name: "Đo kết quả, tìm khoảng cách, học từ dữ liệu",
      action: "Quản lý trực quan & review định kỳ",
      content: "Kết quả trước và sau được đo trên chính quy trình thực tế và hiển thị trên bảng quản lý trực quan. Ban chỉ đạo review hằng tuần, hằng tháng; mọi khoảng cách so với mục tiêu được phân tích bằng A3 và 5 Why để xử lý tận gốc, không dừng ở việc chữa cháy."
    },
    {
      phase: "BƯỚC 06",
      code: "A - ACTION & ADJUST",
      name: "Chuẩn hóa, duy trì & nhân rộng (Yokoten)",
      action: "Standard Work, Daily Management, Leader Standard Work",
      content: "Cách làm tốt được chuẩn hóa thành công việc tiêu chuẩn và duy trì bằng hệ thống quản lý hằng ngày: họp đầu ca, bảng KPI, Gemba Walk của người lãnh đạo. Đội Lean nội bộ được huấn luyện để tự nhân rộng sang các khu vực khác và khởi động vòng cải tiến tiếp theo."
    }
  ];

  return (
    <div>
      <PageHero
        image="/images/projects/geodis-vietnam-dao-tao-thuc-hanh-5s-an-toan-quan-ly-truc-quan/photo_10.webp"
        title={<>WISE Academy<span className="block mt-1 text-[#FF7A30] text-2xl sm:text-3xl lg:text-[38px] lg:whitespace-nowrap lg:-mx-16">đồng hành kiến tạo năng lực vận hành xuất sắc</span></>}
      />

      {/* Quote */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-6">
        <figure className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-1 bg-[#F76011] mx-auto rounded-full mb-6" />
          <blockquote className="text-xl sm:text-2xl italic text-[#002F5B] leading-relaxed">
            “Sự phát triển và trưởng thành của nhân viên<br />là trách nhiệm cao cả của người lãnh đạo.”
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase font-bold tracking-widest text-[#486581]">
            Harvey S. Firestone
          </figcaption>
        </figure>

        {/* WISE's guiding principle, drawn from the quote above */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002F5B] uppercase">
            Tôn chỉ của <span className="text-[#F76011]">WISE Academy</span>
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base text-[#486581] leading-relaxed">
            <p>
              Trích dẫn trên của <strong className="text-[#102A43]">Harvey S. Firestone</strong> đề cập đơn giản, trực tiếp đến trách
              nhiệm của lãnh đạo trong quản trị vận hành doanh nghiệp thông qua việc phát triển nguồn nhân lực chất lượng cho doanh
              nghiệp. Các dịch vụ Tư vấn Lean - Triển khai Lean - Đào tạo Lean luôn phải xuất phát từ việc tôn trọng con người, lấy
              nhân sự làm trung tâm và biết cách trao quyền một cách đúng đắn.
            </p>
            <p>
              Đây cũng chính là điều WISE Academy mong mỏi truyền đạt nhất trong mọi dự án của mình. WISE Academy luôn trao đổi chân thành và thấu
              cảm nỗi đau của từng con người, từng vị trí, từng bộ phận, từng cấp lãnh đạo để khai vấn đồng sự cùng đối tác trên
              hành trình phát triển, tối ưu hóa quy trình và vận hành doanh nghiệp.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <Section tone="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-[#002F5B] text-white p-8 sm:p-10 shadow-[0_20px_45px_-15px_rgba(0,47,91,0.5)]">
            <span className="w-12 h-12 rounded-full bg-white/10 text-[#FF7A30] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">Tầm nhìn</h2>
            <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
              WISE Academy định vị là <strong className="text-[#FF7A30]">đơn vị dẫn đầu</strong> trong đào tạo và tư vấn Lean ứng dụng tại Việt Nam và khu vực Đông Nam Á, đồng hành cùng các doanh nghiệp sản xuất, logistics và dịch vụ trên hành trình tối ưu hóa vận hành, chuyển đổi số và nâng tầm năng lực cạnh tranh quốc tế.
            </p>
          </div>
          <div className="rounded-2xl bg-[#C9500E] text-white p-8 sm:p-10 shadow-[0_20px_45px_-15px_rgba(201,80,14,0.5)]">
            <span className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">Sứ mệnh</h2>
            <p className="mt-3 text-sm sm:text-base text-white leading-relaxed">
              WISE Academy khai thác triệt để mọi cơ hội để <strong className="text-white underline decoration-white/40 underline-offset-4">phát triển năng lực nội tại và tạo giá trị bền vững</strong> cho đối tác, dựa trên nền tảng chuyên môn sâu rộng và kinh nghiệm thực chiến của đội ngũ chuyên gia Lean Six Sigma từng giữ cương vị quản lý cấp cao tại các tập đoàn sản xuất lớn.
            </p>
          </div>
        </div>
      </Section>

      {/* Core values - each pillar with its own accent */}
      <Section>
        <SectionHeader
          eyebrow="Giá trị cốt lõi"
          title={<>Bốn giá trị cốt lõi <span className="text-[#F76011]">W · I · S · E</span></>}
          description="Bộ gen định hình cách các chuyên gia WISE Academy tư vấn, tương tác và đồng hành cùng khách hàng."
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
                <h3 className="relative mt-1 text-lg font-semibold text-[#002F5B] whitespace-pre-line">{v.title}</h3>
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
          description="Không áp dụng một công thức rập khuôn cho mọi tổ chức. WISE Academy cùng đội ngũ của bạn đi qua 6 bước khép kín để đảm bảo thay đổi là thật và duy trì được sau khi dự án kết thúc."
        />
        {/* Loop: 1 → 2 → 3 ↓ 4 → 5 → 6 (bottom row runs right-to-left) ↑ back to 1 */}
        <div className="relative">
          {/* Faint loop drawn behind the six steps (desktop). The dash flows clockwise: 1 → 3 ↓ 4 → 6 ↑ 1. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
          >
            <ellipse cx="500" cy="300" rx="430" ry="235" fill="none" stroke="#F76011" strokeOpacity="0.07" strokeWidth="46" vectorEffect="non-scaling-stroke" />
            <path
              className="rgpdca-flow"
              d="M 70 300 A 430 235 0 1 1 930 300 A 430 235 0 1 1 70 300"
              fill="none"
              stroke="#F76011"
              strokeOpacity="0.45"
              strokeWidth="2"
              strokeDasharray="10 12"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ol className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-16 lg:gap-y-20">
            {rgpdcaDetails.map((item, i) => {
              const step = i + 1;
              const out = LOOP[i];
              const Arrow = out.icon;
              return (
                <li key={item.phase} className={`relative card-soft !transform-none p-7 ${out.place}`}>
                  <div className="flex items-center gap-4">
                    {/* The RGPDCA letter is the anchor of each step */}
                    <span className="w-14 h-14 rounded-xl bg-[#002F5B] text-[#FF7A30] text-3xl font-extrabold flex items-center justify-center shrink-0">
                      {item.code.charAt(0)}
                    </span>
                    <span className="leading-tight">
                      <span className="block text-xs font-semibold text-[#486581]">Bước {String(step).padStart(2, "0")}</span>
                      <span className="block text-sm font-bold uppercase tracking-wide text-[#002F5B]">
                        <span className="text-[#F76011]">{item.code.charAt(0)}</span>
                        {item.code.split(" - ")[1].slice(1)}
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#002F5B] leading-snug whitespace-pre-line">{item.name}</h3>
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
            <span className="inline-flex items-center gap-3 bg-[#002F5B] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
              <RefreshCw className="w-4 h-4 text-[#FF7A30]" />
              <span className="tracking-[0.25em] text-base sm:text-lg font-extrabold text-[#FF7A30]">RGPDCA</span>
              <span className="text-white/85">bước 6 quay lại bước 1</span>
            </span>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Bạn muốn chuyên gia xuống khảo sát thực tế tại doanh nghiệp cùng WISE Academy?"
        description="Chuyên gia của chúng tôi sẵn sàng cùng Ban Giám Đốc trực tiếp xuống hiện trường để cùng nhìn nhận các điểm lãng phí và cơ hội cải tiến."
      />
    </div>
  );
}
