import React from "react";
import { Download } from "@/components/icons";
import PageHero from "@/components/PageHero";
import LeanRoadmapRace from "@/components/LeanRoadmapRace";
import { ButtonLink, CtaBand, Section, SectionHeader } from "@/components/ui";

const P = "/images/projects/";
const pillarImages = [
  P + "huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_1.webp",
  P + "ty-bach-chuong-trinh-dao-tao-lean-cell-layout/photo_1.webp",
  P + "yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_10.webp",
  P + "victory-lean-dianogtics-and-lean-fundamental-training/photo_1.webp",
  P + "project-lean-six-sigma-yellow-belt-pouchen-group/photo_10.webp",
];

export const metadata = {
  title: "Dịch Vụ Tư Vấn Tinh Gọn Hiện Trường | WISE Academy",
  description: "5 dịch vụ chính của WISE Academy: xây dựng/chuyển đổi Hệ thống Quản lý Lean, thiết kế Nhà máy Lean mới, tích hợp Lean & Chuyển đổi số, hệ thống Đào tạo & Phát triển nguồn nhân lực, Đào tạo & Huấn luyện Lean Six Sigma.",
  alternates: { canonical: "/dich-vu-tu-van" },
};

export default function ConsultingPage() {
  const surveySteps = [
    {
      title: "Thấu hiểu nhu cầu & ưu tiên",
      desc: "Lắng nghe ban lãnh đạo về bối cảnh, thách thức và những ưu tiên kinh doanh của doanh nghiệp."
    },
    {
      title: "Xác lập mục tiêu",
      desc: "Cùng thống nhất mục tiêu và chỉ số đo lường cụ thể về năng suất, chất lượng, chi phí và thời gian giao hàng."
    },
    {
      title: "Khảo sát hiện trạng",
      desc: "Đi Gemba quan sát dòng vật tư, dòng thông tin và cách đội ngũ làm việc để nhận diện lãng phí và cơ hội cải tiến."
    },
    {
      title: "Đề xuất lộ trình",
      desc: "Đưa ra giải pháp và lộ trình đồng hành phù hợp giữa thực trạng và mục tiêu của doanh nghiệp."
    }
  ];

  const pillars = [
    {
      id: "01",
      title: "Tư vấn xây dựng/chuyển đổi Hệ thống Quản lý Lean",
      subtitle: "Từ mô hình quản lý truyền thống sang hệ thống Lean, nền tảng của vận hành xuất sắc và tăng trưởng bền vững",
      desc: "WISE Academy đồng hành cùng doanh nghiệp sản xuất FDI và nội địa trên hai trục: Chuyển đổi hữu hình (quy trình, mặt bằng, dòng giá trị) và Chuyển đổi tư duy (năng lực lãnh đạo, văn hóa tổ chức). Lean không chỉ được áp dụng như công cụ mà trở thành triết lý quản lý dài hạn, triển khai theo khung 5 module lấy cảm hứng từ Hệ thống Sản xuất Toyota (Ngôi nhà Lean).",
      listTitle: "Phạm vi tư vấn",
      items: [
        "Chuyển đổi Lean cho nhà máy hiện hữu: tối ưu quy trình, cải tiến mặt bằng, tái thiết kế dòng giá trị và loại bỏ lãng phí",
        "Nền tảng & Hệ thống quản lý: 5S, Quản lý trực quan, Công việc tiêu chuẩn, Hệ thống quản lý hằng ngày",
        "Chất lượng xuất sắc: giải quyết vấn đề, Poka-Yoke, Quản lý chất lượng toàn diện (TQM)",
        "Năng suất & Dòng chảy: VSM, cân bằng chuyền, hệ thống kéo, Kanban, SMED",
        "Thiết bị & Độ tin cậy: Bảo trì năng suất toàn diện (TPM), cải thiện OEE",
        "Con người & Lãnh đạo Lean: Hoshin Kanri, A3, Catch-ball, Leader Standard Work"
      ],
      tag: "LEAN MANAGEMENT SYSTEM TRANSFORMATION",
      brochure: "/brochures/lean-management-system-transformation.pdf"
    },
    {
      id: "02",
      title: "Tư vấn thiết kế Nhà máy Lean mới",
      subtitle: "Thiết kế đúng ngay từ đầu cho nhà máy và dây chuyền mới",
      desc: "WISE Academy hỗ trợ doanh nghiệp thiết kế nhà máy hoặc dây chuyền sản xuất mới dựa trên nguyên tắc Lean, đảm bảo dòng chảy tối ưu, khả năng mở rộng và hiệu quả vận hành ngay từ ngày đầu, thay vì phải cải tạo tốn kém sau khi đã xây dựng.",
      listTitle: "Phạm vi tư vấn",
      items: [
        "Phân tích sản phẩm, sản lượng và nhịp sản xuất (Takt time) làm cơ sở thiết kế",
        "Thiết kế dòng giá trị tương lai (Future State VSM) cho nhà máy mới",
        "Thiết kế mặt bằng tổng thể và bố trí chuyền theo dòng chảy (Lean Layout, Cell)",
        "Thiết kế luồng vật tư, kho và cấp liệu nội bộ theo hệ thống kéo",
        "Hoạch định khả năng mở rộng công suất theo từng giai đoạn đầu tư"
      ],
      tag: "NEW LEAN FACTORY DESIGN",
      brochure: "/brochures/new-lean-factory-design.pdf"
    },
    {
      id: "03",
      title: "Tư vấn tích hợp Lean & Chuyển đổi số",
      subtitle: "Để mỗi khoản đầu tư công nghệ tạo ra giá trị vận hành và kinh doanh thực sự",
      desc: "Nhiều dự án chuyển đổi số không đạt kỳ vọng vì công nghệ được triển khai trên một nền tảng vận hành chưa tối ưu. Lean loại bỏ lãng phí và tối ưu quy trình, công nghệ số mang lại tự động hóa, dữ liệu thời gian thực và ra quyết định dựa trên dữ liệu. Khi kết hợp đúng cách, doanh nghiệp tăng năng suất, giảm chi phí và lỗi quy trình, xây dựng hệ thống sản xuất linh hoạt và dễ mở rộng.",
      listTitle: "Dịch vụ tư vấn chính",
      items: [
        "Hệ thống quản lý dữ liệu vận hành thời gian thực: giám sát và phân tích dữ liệu sản xuất để ra quyết định nhanh, chính xác",
        "Kỹ thuật hệ thống công nghiệp: thiết kế và tối ưu hệ thống sản xuất, tăng hiệu quả và ổn định vận hành",
        "Bảo trì năng suất toàn diện (TPM): nâng cao độ tin cậy thiết bị, giảm thời gian dừng máy",
        "Quản lý chất lượng toàn diện (TQM): kiểm soát quy trình, đồng nhất sản phẩm và cải tiến liên tục"
      ],
      tag: "LEAN & DIGITAL TRANSFORMATION INTEGRATION",
      brochure: "/brochures/lean-digital-transformation.pdf"
    },
    {
      id: "04",
      title: "Tư vấn hệ thống Đào tạo & Phát triển nguồn nhân lực",
      subtitle: "Biến đội ngũ thành động lực của vận hành xuất sắc trong bối cảnh nhiều biến động",
      desc: "Trong môi trường kinh doanh biến động, phức tạp và khó đoán định (VUCA), hệ thống Đào tạo & Phát triển (L&D) hiệu quả là yêu cầu chiến lược. WISE Academy hỗ trợ doanh nghiệp thiết kế và triển khai hệ thống L&D bài bản: phát triển năng lực cốt lõi gắn với chiến lược, củng cố đội ngũ lãnh đạo kế cận, nâng cao gắn kết, giữ chân nhân tài và hình thành văn hóa cải tiến liên tục.",
      listTitle: "Dịch vụ tư vấn & đào tạo chính",
      items: [
        "Tư vấn khung năng lực cốt lõi gắn với chiến lược kinh doanh",
        "Tư vấn xây dựng hệ thống Đào tạo & Phát triển (L&D) bài bản và liên tục",
        "Đào tạo TWI (Training Within Industry) cho quản lý tuyến đầu và tổ trưởng",
        "Đào tạo phương pháp giải quyết vấn đề có cấu trúc",
        "Đào tạo kỹ năng Coaching cho cấp quản lý",
        "Chương trình đào tạo giảng viên nội bộ (Train-the-Trainer)"
      ],
      tag: "HR LEARNING & DEVELOPMENT SYSTEM",
      brochure: "/brochures/hr-learning-development-system.pdf"
    },
    {
      id: "05",
      title: "Đào tạo & Huấn luyện Lean Six Sigma",
      subtitle: "Chìa khóa cho ra quyết định dựa trên dữ liệu trong kỷ nguyên số",
      desc: "WISE Academy hợp tác cùng Viện Lean Six Sigma quốc tế (LSSI) đào tạo, chứng nhận và huấn luyện cá nhân, doanh nghiệp giảm chi phí, nâng cao chất lượng và cải thiện năng suất. Chương trình theo chuẩn quốc tế, được thiết kế theo cấp độ, ngành nghề và quy trình, kèm huấn luyện dự án thực tế tại doanh nghiệp.",
      listTitle: "Chương trình đào tạo",
      items: [
        "Theo cấp độ: Lean Management, White Belt, Yellow Belt, Green Belt, Black Belt, Master Black Belt",
        "Theo ngành: Lean trong nông nghiệp, xây dựng, y tế và khách sạn",
        "Theo quy trình: Lean năng lượng, Lean logistics, Lean dịch vụ",
        "Thạc sĩ quản trị: Corporate Management, Lean Six Sigma 4.0, Black Belt Master's Degree",
        "Huấn luyện dự án cải tiến thực tế, chứng nhận quốc tế LSSI"
      ],
      tag: "LEAN SIX SIGMA TRAINING & COACHING",
      brochure: "/brochures/lean-six-sigma-training-coaching.pdf"
    }
  ];

  const roadmapStages = [
    {
      name: "Khám phá & Làm quen với Lean (Explore)",
      short: "Khám phá",
      time: "Linh hoạt theo mức độ cam kết",
      objective: "Lãnh đạo hiểu đúng về Lean, làm rõ lý do áp dụng và tạo điều kiện để đội ngũ tiếp cận Lean qua các sáng kiến gắn với chiến lược doanh nghiệp.",
      outcome: "Lãnh đạo đánh giá được doanh nghiệp đang ở chặng nào trên hành trình Lean."
    },
    {
      name: "Xây dựng nền tảng Lean (Foundation)",
      short: "Nền tảng",
      time: "6 - 9 tháng",
      objective: "Lãnh đạo thúc đẩy phát triển năng lực nền tảng cho đội ngũ vận hành và thực nghiệm ngay tại hiện trường để khơi dậy đổi mới, làm rõ hiện trạng, định hình tầm nhìn. Đội ngũ quản lý được đào tạo để thay đổi tư duy quản trị vận hành và thí điểm công cụ Lean nhằm tạo Quick Wins.",
      outcome: "75% tập trung xây dựng kiến thức nền tảng, 25% phát triển năng lực triển khai thực tế."
    },
    {
      name: "Nhân rộng Lean toàn tổ chức (Scale)",
      short: "Nhân rộng",
      time: "9 - 18 tháng",
      objective: "Nhân rộng các thực hành Lean tốt nhất ra toàn tổ chức và tạo kết quả kinh doanh rõ ràng qua các chỉ số hiệu suất vận hành đo lường được.",
      outcome: "25% tập trung kiến thức chuyên sâu, 75% nhân rộng, chuẩn hóa và cải tiến liên tục."
    },
    {
      name: "Đưa Lean vào vận hành hằng ngày (Embed)",
      short: "Vận hành",
      time: "12 - 18 tháng",
      objective: "Tích hợp Lean vào hoạt động hằng ngày trên toàn tổ chức, củng cố hệ thống quản lý để nhận diện bất thường và kiểm soát hiệu quả quy trình, con người và vấn đề.",
      outcome: "Năng lực đội ngũ vận hành nâng lên rõ rệt, tổ chức tự quản lý và duy trì được hiệu suất."
    },
    {
      name: "Xây dựng văn hóa cải tiến liên tục (Culture)",
      short: "Văn hóa",
      time: "Liên tục, không giới hạn",
      objective: "Nguyên tắc và thực hành Lean thấm sâu vào văn hóa tổ chức, giúp cải tiến liên tục để luôn đáp ứng và vượt kỳ vọng của khách hàng.",
      outcome: "Lean trở thành kim chỉ nam cho mọi hoạt động chiến lược, thể hiện qua kết quả về an toàn, chất lượng, giao hàng, chi phí, sự gắn kết của nhân viên và giá trị thương hiệu."
    }
  ];

  return (
    <div>
      <PageHero
        eyebrow="Dịch vụ tư vấn doanh nghiệp"
        image="/images/projects/yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_1.webp"
        title={<>Giải pháp tư vấn <span className="text-[#FF7A30]">vận hành tinh gọn</span> tại hiện trường</>}
        description="Mọi dự án tư vấn của WISE Academy đều bắt đầu từ bước khảo sát: thấu hiểu nhu cầu và các ưu tiên của doanh nghiệp, cùng xác lập mục tiêu rõ ràng và đánh giá hiện trạng ngay tại hiện trường. Đó là nền tảng để đề xuất giải pháp đúng trọng tâm và đo lường được kết quả."
      >
        <ButtonLink href="/lien-he">Đặt lịch khảo sát hiện trạng</ButtonLink>
      </PageHero>

      {/* Survey first: the four steps every engagement starts with */}
      <Section>
        <SectionHeader
          title={<>Thấu hiểu để <span className="text-[#F76011]">đồng hành</span></>}
          description="Mỗi doanh nghiệp có bối cảnh, ưu tiên và thực trạng vận hành riêng. Vì vậy trước khi đề xuất bất kỳ giải pháp nào, WISE Academy cùng doanh nghiệp đi qua bốn bước sau."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {surveySteps.map((step, i) => (
            <li key={step.title} className="card-soft p-6">
              <span className="text-3xl font-bold text-[#F76011]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-[#002F5B] leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm text-[#486581] leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <ButtonLink href="/lien-he">Hãy liên hệ với chúng tôi để cùng bắt đầu hành trình cải tiến</ButtonLink>
        </div>
      </Section>

      {/* Pillars: alternating image / text */}
      {pillars.map((pillar, idx) => (
        <section key={pillar.id} id={pillar.id} className={`${idx % 2 ? "bg-[#F8F9FA]" : "bg-white"} py-16 lg:py-20 px-4 sm:px-6 scroll-mt-24`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 ${idx % 2 ? "lg:order-2" : ""}`}>
              <img src={pillarImages[idx]} alt={pillar.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#C9500E]">{pillar.tag}</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#002F5B] leading-tight">{pillar.title}</h2>
              <p className="mt-4 text-sm sm:text-base text-[#486581] leading-relaxed">
                <strong className="text-[#102A43]">{pillar.subtitle}.</strong> {pillar.desc}
              </p>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-[#002F5B]">{pillar.listTitle}</h3>
              <ul className="mt-2">
                {pillar.items.map((d) => (
                  <li key={d} className="plus-item !font-medium">
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink href="/lien-he">Tư vấn dịch vụ {pillar.id}</ButtonLink>
                <a
                  href={pillar.brochure}
                  download={`WISE-Academy-dich-vu-${pillar.id}-brochure.pdf`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#002F5B] px-6 py-2.5 text-sm font-semibold text-[#002F5B] transition-colors hover:bg-[#002F5B] hover:text-white"
                >
                  <Download className="w-4 h-4" /> Tải brochure
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Roadmap */}
      <LeanRoadmapRace
        stages={roadmapStages}
        title={<>Lộ trình chuyển đổi Lean<br /><span className="text-[#FF7A30]">5 giai đoạn</span></>}
        description="Chuyển đổi Lean không thể hoàn thành trong một sớm một chiều. WISE Academy đồng hành cùng doanh nghiệp qua 5 chặng đường rõ ràng, từ làm quen với Lean đến hình thành văn hóa cải tiến liên tục."
      />

      <CtaBand
        title="Xây dựng lộ trình chuyển đổi cho doanh nghiệp của bạn"
        description="Bắt đầu bằng một buổi khảo sát hiện trường miễn phí để cùng nhìn ra cơ hội tăng năng suất và giảm chi phí."
      />
    </div>
  );
}
