import React from "react";
import { ShieldCheck, Target } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Section, SectionHeader, CtaBand } from "@/components/ui";

export const metadata = {
  title: "Về Chúng Tôi & Triết Lý RGPDCA — WISE Academy",
  description: "Tìm hiểu tầm nhìn, sứ mệnh, giá trị cốt lõi W-I-S-E và phương pháp luận độc quyền RGPDCA được hướng dẫn bởi MIT chuẩn quốc tế.",
};

export default function AboutPage() {
  const values = [
    {
      letter: "W",
      word: "WORKABLE",
      title: "Dễ Làm & Hiệu Quả Thực Tế",
      desc: "Chúng tôi ưu tiên tạo ra giá trị đo lường được cho doanh nghiệp: giải pháp phải đơn giản, thực tế và áp dụng được ngay trên sàn xưởng."
    },
    {
      letter: "I",
      word: "IMPROVEMENT",
      title: "Cải Tiến Liên Tục Mỗi Ngày",
      desc: "WISE cam kết mang đến giá trị vượt trội bằng sự tận tâm, chuyên nghiệp, biến việc tìm kiếm điểm tốt hơn thành thói quen văn hóa trong nhà máy."
    },
    {
      letter: "S",
      word: "SHARE",
      title: "Chia Sẻ Kinh Nghiệm Thật",
      desc: "Chúng tôi nỗ lực đóng góp giá trị chung cho cộng đồng sản xuất Việt Nam, phụng sự nền công nghiệp nước nhà với tinh thần trách nhiệm cao nhất."
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
      name: "Khảo Sát Thực Tế Tại Phân Xưởng",
      action: "Xuống Tận Nơi Quan Sát Thao Tác & Đánh Giá Hiện Trạng",
      content: "Chuyên gia WISE trực tiếp đến phân xưởng, quan sát luồng nguyên vật liệu và dòng thông tin. Quan sát tỉ mỉ các động tác thừa, phỏng vấn sâu ban lãnh đạo và quản đốc để xây dựng bức tranh hiện trạng toàn diện."
    },
    {
      phase: "BƯỚC 02",
      code: "G - GOALS",
      name: "Xác Lập Mục Tiêu & Định Lượng Kết Quả",
      action: "Gắn Kết Cải Tiến Vận Hành Với Bảng Cân Đối Tài Chính",
      content: "Cùng Ban Giám Đốc xác định rõ các chỉ số đo lường thành công: Tỷ lệ nâng OEE, rút ngắn Lead Time, giảm hàng tồn kho trên chuyền (WIP), giảm tỷ lệ phế phẩm (PPM/Defect Rate) và tính toán giá trị tiết kiệm tài chính (Cost Savings) cụ thể."
    },
    {
      phase: "BƯỚC 03",
      code: "P - PLAN",
      name: "Thiết Kế Lộ Trình Chuyển Đổi Tinh Gọn (Roadmap)",
      action: "Lean House & Lộ Trình 3 Giai Đoạn Chuẩn MIT",
      content: "Xây dựng bản kế hoạch chi tiết gồm 3 giai đoạn: Khám phá nhận thức (Explore) -> Xây dựng nền móng (Foundation) -> Nhân rộng toàn diện (Scale). Kế hoạch phân bổ nguồn lực rõ ràng theo từng tháng, xác định dây chuyền thí điểm mẫu (Model Line) và thiết lập ban chỉ đạo cải tiến."
    },
    {
      phase: "BƯỚC 04",
      code: "D - DO",
      name: "Triển Khai Thí Điểm & Huấn Luyện Tại Hiện Trường",
      action: "Simulation Game + Kèm Cặp Dự Án Thực Chiến",
      content: "Tổ chức đào tạo gắn liền với thực hành xưởng. Ứng dụng Lean Simulation Game để xóa bỏ tư duy lối mòn, sau đó chuyên gia cùng đội ngũ kỹ sư trực tiếp triển khai 5S, Lean Cell, SMED, Kanban tại chuyền mẫu để đạt được Quick Wins ngay trong 60 - 90 ngày đầu tiên."
    },
    {
      phase: "BƯỚC 05",
      code: "C - CHECK",
      name: "Đo Lường, Đánh Giá & Phân Tích Khoảng Cách",
      action: "Đo Lường Before/After & Kiểm Toán Tiến Độ Định Kỳ",
      content: "Hàng tuần và hàng tháng, ban chỉ đạo tiến hành đo lường các chỉ số Before/After trên chuyền sản xuất thực tế. Đối chiếu với mục tiêu ban đầu, phân tích nguyên nhân gốc rễ (Root Cause Analysis) nếu có độ lệch và điều chỉnh biện pháp can thiệp kịp thời."
    },
    {
      phase: "BƯỚC 06",
      code: "A - ACTION & ADJUST",
      name: "Chuẩn Hóa (Standardize) & Nhân Rộng Bền Vững",
      action: "Ban Hành SOP, Hệ Thống DMS & Đào Tạo Lean Leaders",
      content: "Đóng gói các giải pháp thành công thành Tiêu chuẩn công việc (Standard Work/SOP). Thiết lập hệ thống quản lý hàng ngày (Daily Management System - DMS) để giữ vững kết quả và chuyển giao năng lực cho các Lean Leaders tự nhân rộng ra toàn bộ nhà máy."
    }
  ];

  return (
    <div>
      <PageHero
        eyebrow="Câu chuyện & sứ mệnh"
        image="/images/projects/geodis-vietnam-dao-tao-thuc-hanh-5s-an-toan-quan-ly-truc-quan/photo_10.webp"
        title={<>Về WISE Academy: <span className="text-[#FF7A30]">đồng hành kiến tạo</span> năng lực vận hành xuất sắc</>}
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
              WISE định vị là <strong className="text-[#102A43]">đơn vị dẫn đầu</strong> trong đào tạo và tư vấn Lean ứng dụng tại Việt Nam và khu vực Đông Nam Á, đồng hành cùng các doanh nghiệp sản xuất trên hành trình tối ưu hóa vận hành, xây dựng nhà máy thông minh và nâng tầm năng lực cạnh tranh quốc tế.
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

      {/* Core values */}
      <Section>
        <SectionHeader
          eyebrow="Giá trị cốt lõi"
          title={<>Bốn trụ cột <span className="text-[#F76011]">W · I · S · E</span></>}
          description="Bộ gen định hình cách các chuyên gia WISE tư vấn, tương tác và đồng hành cùng khách hàng."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.letter} className="card-soft p-7">
              <span className="w-12 h-12 rounded-full bg-[#002F5B] text-[#FF7A30] flex items-center justify-center font-extrabold text-xl">
                {v.letter}
              </span>
              <span className="mt-5 block text-[11px] font-bold uppercase tracking-widest text-[#C9500E]">{v.word}</span>
              <h3 className="mt-1 text-lg font-semibold text-[#002F5B]">{v.title}</h3>
              <p className="mt-3 text-sm text-[#486581] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* RGPDCA */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Phương pháp luận RGPDCA"
          title={<>Lộ trình 6 giai đoạn <span className="text-[#F76011]">khoa học & bền vững</span></>}
          description="Không áp dụng một công thức rập khuôn cho mọi nhà máy. WISE cùng đội ngũ của bạn đi qua 6 bước khép kín để đảm bảo thay đổi là thật và duy trì được sau khi dự án kết thúc."
        />
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rgpdcaDetails.map((item, i) => (
            <li key={item.phase} className="card-soft p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#F76011]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#486581]">{item.code}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#002F5B] leading-snug">{item.name}</h3>
              <p className="mt-2 text-xs font-semibold text-[#C9500E]">{item.action}</p>
              <p className="mt-3 text-sm text-[#486581] leading-relaxed">{item.content}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Bạn muốn chuyên gia xuống khảo sát thực tế tại nhà máy cùng WISE?"
        description="Chuyên gia của chúng tôi sẵn sàng cùng Ban Giám Đốc trực tiếp xuống phân xưởng để cùng nhìn nhận các điểm lãng phí và cơ hội cải tiến."
        label="Đặt lịch khảo sát miễn phí"
      />
    </div>
  );
}
