import React from "react";
import { Binoculars, Target } from "@/components/icons";
import PageHero from "@/components/PageHero";
import RgpdcaLoop from "@/components/RgpdcaLoop";
import CoreValuesBloom from "@/components/CoreValuesBloom";
import VisionMission from "@/components/VisionMission";
import PartnerLogos from "@/components/PartnerLogos";
import { Section, SectionHeader, CtaBand } from "@/components/ui";

export const metadata = {
  title: "Về Chúng Tôi & Triết Lý RGPDCA | WISE Academy",
  description: "Tìm hiểu tầm nhìn, sứ mệnh, giá trị cốt lõi W-I-S-E và phương pháp luận độc quyền RGPDCA được hướng dẫn bởi MIT chuẩn quốc tế.",
  alternates: { canonical: "/ve-chung-toi" },
};

// W · I · S · E accent colors (brand navy / orange family). Orange shades used here pass contrast for large text.

// Card placement and outgoing arrow for each RGPDCA step on desktop (3 columns × 2 rows, clockwise loop).

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
      content: "Chuyên gia WISE Academy cùng đội ngũ đi dọc chuỗi giá trị: đứng vòng tròn Ohno nhìn ra lãng phí, đo thời gian chu kỳ, tồn kho thực tế và lắng nghe người trực tiếp làm việc. Kết quả là Current VSM và danh sách vấn đề chứng minh bằng dữ liệu."
    },
    {
      phase: "BƯỚC 02",
      code: "G - GOALS",
      name: "Đặt mục tiêu cải tiến",
      action: "Các mục tiêu ưu tiên S-Q-D-C-M-E liên kết trực tiếp từ chiến lược vận hành của tổ chức",
      content: "Cùng ban lãnh đạo xác định đích đến dài hạn (True North) và vài chỉ số then chốt: OEE, Lead Time, WIP, tỷ lệ lỗi, năng suất. Mỗi chỉ số có giá trị nền, mục tiêu và giá trị tài chính, gắn cải tiến với kết quả kinh doanh."
    },
    {
      phase: "BƯỚC 03",
      code: "P - PLAN",
      name: "Thiết kế trạng thái tương lai & lộ trình",
      action: "Future VSM, Hoshin Kanri, Model Line",
      content: "Vẽ chuỗi giá trị tương lai, chọn khu vực mô hình (Model Line) và triển khai mục tiêu xuống từng cấp theo Hoshin Kanri. Lộ trình 3 giai đoạn Explore, Foundation, Scale có nguồn lực, người phụ trách và mốc thời gian rõ ràng."
    },
    {
      phase: "BƯỚC 04",
      code: "D - DO",
      name: "Triển khai thí điểm và học thông qua thực hành",
      action: "Dự án thí điểm & kèm cặp tại hiện trường",
      content: "Đào tạo đi liền thực hành: Lean Simulation Game thay đổi tư duy, rồi chuyên gia cùng đội nòng cốt chạy Dự án thí điểm tại Model Line với 5S, công việc tiêu chuẩn, cân bằng chuyền, SMED, Kanban. Có kết quả trong 60-90 ngày, đội ngũ tự làm được."
    },
    {
      phase: "BƯỚC 05",
      code: "C - CHECK",
      name: "Đo kết quả, tìm khoảng cách, học từ dữ liệu",
      action: "Quản lý trực quan & review định kỳ",
      content: "Kết quả trước và sau được đo trên quy trình thực tế, hiển thị trên bảng quản lý trực quan. Ban chỉ đạo review hằng tuần, hằng tháng; khoảng cách với mục tiêu được phân tích bằng A3, 5 Why để xử lý tận gốc."
    },
    {
      phase: "BƯỚC 06",
      code: "A - ACTION & ADJUST",
      name: "Chuẩn hóa, duy trì & nhân rộng (Yokoten)",
      action: "Standard Work, Daily Management, Leader Standard Work",
      content: "Cách làm tốt được chuẩn hóa thành công việc tiêu chuẩn, duy trì bằng quản lý hằng ngày: họp đầu ca, bảng KPI, Gemba Walk của lãnh đạo. Đội Lean nội bộ tự nhân rộng sang khu vực khác và khởi động vòng cải tiến mới."
    }
  ];

  return (
    <div>
      <PageHero
        image="/images/projects/geodis-vietnam-dao-tao-thuc-hanh-5s-an-toan-quan-ly-truc-quan/photo_10.webp"
        title={<>WISE Academy<span className="block mt-1 text-[#FF7A30] text-2xl sm:text-3xl lg:text-[38px] lg:whitespace-nowrap lg:-mx-16">đồng hành kiến tạo năng lực vận hành xuất sắc</span></>}
      />

      {/* Client / partner logos */}
      <PartnerLogos />

      {/* Quote */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-6">
        <figure className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-1 bg-[#F76011] mx-auto rounded-full mb-6" />
          <blockquote className="text-sm sm:text-[17px] italic text-[#002F5B] leading-relaxed">
            “Sự phát triển và trưởng thành của nhân viên<br />là trách nhiệm cao cả của người lãnh đạo.”
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase font-bold tracking-widest text-[#486581]">
            Harvey S. Firestone
          </figcaption>
        </figure>

        {/* Message from WISE Academy, drawn from the quote above */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002F5B] uppercase">
            Thông điệp từ <span className="text-[#F76011]">WISE Academy</span>
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base text-[#486581] leading-relaxed">
            <p>
              Câu nói của <strong className="text-[#102A43]">Harvey S. Firestone</strong> nhắc chúng tôi rằng thước đo cao nhất của
              người lãnh đạo không nằm ở những con số, mà ở sự trưởng thành của từng con người họ dẫn dắt. Doanh nghiệp chỉ có thể vươn
              xa khi đội ngũ cùng lớn lên. Vì thế, mọi hoạt động Tư vấn, Triển khai và Đào tạo Lean của chúng tôi đều bắt đầu từ sự tôn
              trọng con người, đặt con người vào trung tâm và trao quyền để mỗi người tự tin cải tiến công việc của chính mình.
            </p>
            <p>
              Đó là tinh thần WISE Academy mong muốn thắp lên qua từng dự án. Chúng tôi lắng nghe chân thành, thấu hiểu những trăn trở
              của từng con người, từng vị trí, từng bộ phận và từng cấp lãnh đạo, để cùng đối tác khơi mở năng lực tiềm ẩn và sát cánh
              trên hành trình kiến tạo một doanh nghiệp vận hành xuất sắc, nơi mỗi ngày đều tốt hơn hôm qua.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission: two W circles that open into the two cards as you scroll */}
      <Section tone="muted">
        <VisionMission
          items={[
            {
              title: "Tầm nhìn",
              icon: <Binoculars weight="duotone" />,
              className: "bg-gradient-to-br from-[#3A78B5] to-[#1C5690] text-white",
              body: (
                <p className="text-white/90">
                  WISE Academy hướng tới trở thành <strong className="text-[#FFC79E]">đơn vị đáng tin cậy hàng đầu</strong> về tư vấn và đào tạo vận hành xuất sắc theo phương pháp Lean và Lean Six Sigma tại Việt Nam, đồng hành cùng doanh nghiệp hình thành văn hóa cải tiến liên tục và nâng tầm năng lực cạnh tranh trên trường quốc tế.
                </p>
              ),
            },
            {
              title: "Sứ mệnh",
              icon: <Target weight="duotone" />,
              className: "bg-gradient-to-br from-[#F79A5C] to-[#EC7428] text-white",
              body: (
                <p className="text-white">
                  WISE Academy đồng hành cùng doanh nghiệp sản xuất, logistics và dịch vụ <strong className="text-[#002F5B]">phát triển năng lực nội tại và tạo dựng giá trị bền vững</strong>, bằng phương thức Lean lấy con người làm trung tâm, kết hợp chuyên môn sâu rộng và kinh nghiệm thực chiến <br className="hidden lg:block" />của đội ngũ chuyên gia.
                </p>
              ),
            },
          ]}
        />
      </Section>

      {/* Core values: four petals reading W I S E open into the four values as you scroll, then close again */}
      <CoreValuesBloom
        values={values}
        title={<>Bốn giá trị cốt lõi <span className="block text-[#F76011]">W · I · S · E</span></>}
        description="Bộ gen định hình cách các chuyên gia WISE Academy tư vấn, tương tác và đồng hành cùng khách hàng."
      />

      {/* RGPDCA */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="Phương pháp luận RGPDCA"
          title={<>Phương pháp tiếp cận <span className="text-[#F76011]">6 giai đoạn</span></>}
          description={
            <>
              Mỗi doanh nghiệp có một thực trạng vận hành riêng.
              <br className="hidden sm:block" /> WISE Academy áp dụng phương pháp tiếp cận 6 bước khoa học và thực tế:
              <br className="hidden sm:block" /> đánh giá, thiết kế, triển khai, đo lường, chuẩn hóa và duy trì,
              <br className="hidden sm:block" /> từ đó đề xuất lộ trình đồng hành phù hợp
              <br className="hidden sm:block" /> giữa thực trạng và mục tiêu của doanh nghiệp.
            </>
          }
        />
        <RgpdcaLoop steps={rgpdcaDetails} />
      </Section>

      <CtaBand
        title="Bạn muốn chuyên gia xuống khảo sát thực tế tại doanh nghiệp cùng WISE Academy?"
        description="Chuyên gia của chúng tôi sẵn sàng cùng Ban Giám Đốc trực tiếp xuống hiện trường để cùng nhìn nhận các điểm lãng phí và cơ hội cải tiến."
      />
    </div>
  );
}
