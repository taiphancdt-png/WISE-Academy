import React from "react";
import { Clock } from "@/components/icons";
import PageHero from "@/components/PageHero";
import LeanRoadmapRace from "@/components/LeanRoadmapRace";
import { ButtonLink, CtaBand, Section, SectionHeader } from "@/components/ui";

const P = "/images/projects/";
const pillarImages = [
  P + "huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_1.webp",
  P + "ty-bach-chuong-trinh-dao-tao-lean-cell-layout/photo_1.webp",
  P + "yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_10.webp",
  P + "project-lean-six-sigma-yellow-belt-pouchen-group/photo_10.webp",
];

export const metadata = {
  title: "Dịch Vụ Tư Vấn Tinh Gọn Hiện Trường | WISE Academy",
  description: "Tư vấn tối ưu vận hành cho sản xuất, logistics và dịch vụ: khảo sát hiện trường, chuyển đổi Lean, nâng cao năng suất, vận hành số và giảm chi phí.",
  alternates: { canonical: "/dich-vu-tu-van" },
};

export default function ConsultingPage() {
  const pillars = [
    {
      id: "01",
      title: "Khảo Sát Thực Tế & Tìm Điểm Nghẽn Tại Hiện Trường",
      subtitle: "Nhìn rõ các chỗ bị nghẽn, lãng phí thời gian và cơ hội tăng năng suất",
      desc: "Chuyên gia WISE Academy khảo sát toàn diện hệ thống vận hành ngay tại hiện trường - nhà máy, kho vận hay văn phòng - quan sát luồng vật tư, luồng thông tin và cách đội ngũ làm việc để chỉ rõ các điểm lãng phí cần khắc phục ngay.",
      deliverables: [
        "Báo cáo đánh giá hiện trạng vận hành và mức độ lãng phí",
        "Sơ đồ luồng công việc thực tế từ đầu vào đến khi giao cho khách hàng",
        "Bảng thống kê các nguyên nhân gây chậm trễ và hao hụt chi phí",
        "Kế hoạch hành động 90 ngày để đạt kết quả tăng năng suất rõ rệt",
        "Xác lập hệ thống chỉ số theo dõi năng suất gắn liền với lợi nhuận"
      ],
      duration: "2 - 4 tuần khảo sát & phân tích chuyên sâu",
      tag: "KHẢO SÁT & ĐÁNH GIÁ"
    },
    {
      id: "02",
      title: "Chuyển Đổi Lean Toàn Diện & Dòng Chảy Giá Trị (Lean Transformation)",
      subtitle: "Tái thiết hệ thống quản trị theo dòng chảy liên tục, từ chiến lược đến hiện trường",
      desc: "Tổ chức lại quy trình và khu vực làm việc theo nguyên tắc tinh gọn, xóa bỏ tình trạng làm theo lô lớn rời rạc, thiết lập dòng chảy liên tục (như ô sản xuất chữ U trong nhà máy) và vận hành kéo theo nhu cầu khách hàng (Pull System).",
      deliverables: [
        "Thiết kế bản đồ dòng giá trị tương lai (Future State VSM)",
        "Thiết kế mặt bằng / khu vực làm việc tinh gọn (Lean Layout)",
        "Thiết lập hệ thống kéo Kanban & Điểm kiểm soát tồn kho",
        "Rút ngắn thời gian chuyển đổi (SMED) cho máy móc và quy trình",
        "Xây dựng hệ thống quản trị hiện trường hàng ngày (DMS)"
      ],
      duration: "6 - 12 tháng triển khai đồng hành",
      tag: "FULL SYSTEM TRANSFORMATION"
    },
    {
      id: "03",
      title: "Work Engineering & Cân Bằng Công Việc (Productivity)",
      subtitle: "Tối ưu thao tác, giảm thời gian chu kỳ và tăng năng suất cho dây chuyền sản xuất, kho vận và quy trình dịch vụ",
      desc: "Áp dụng kỹ thuật công nghiệp (Industrial Engineering) để bấm giờ phân tích thao tác, loại bỏ động tác thừa, cân bằng tải trọng công việc giữa các công đoạn và xóa bỏ nút thắt cổ chai.",
      deliverables: [
        "Biểu đồ phân tích cân bằng công việc (Yamazumi Chart)",
        "Bảng chuẩn hóa thao tác và định mức thời gian chuẩn (Standard Time)",
        "Giải pháp bố trí đồ gá (Jig) và công cụ hỗ trợ thông minh",
        "Tăng năng suất 15% - 30% mà không cần đầu tư thêm thiết bị",
        "Giảm ùn ứ công việc dở dang (WIP) giữa các công đoạn"
      ],
      duration: "3 - 6 tháng tại các khu vực mục tiêu",
      tag: "PRODUCTIVITY IMPROVEMENT"
    },
    {
      id: "04",
      title: "Vận Hành Số & Lean 4.0 (IoT, AI)",
      subtitle: "Kết hợp tư duy tinh gọn với công nghệ giám sát thời gian thực và tự động hóa",
      desc: "Tránh bẫy số hóa lãng phí bằng cách tối ưu quy trình trước khi số hóa. Triển khai IoT kết nối thiết bị, bảng giám sát theo thời gian thực và ứng dụng AI hỗ trợ lập kế hoạch và ra quyết định.",
      deliverables: [
        "Dashboard giám sát hiệu suất thiết bị OEE thời gian thực",
        "Hệ thống cảnh báo sự cố kỹ thuật số (Digital Andon)",
        "Số hóa nhật ký vận hành và biên bản kiểm tra chất lượng",
        "Tự động hóa thu thập dữ liệu máy móc và dự đoán bảo trì (PdM)",
        "Lộ trình chuyển đổi vận hành số / nhà máy thông minh (Smart Operations Roadmap)"
      ],
      duration: "4 - 8 tháng tích hợp và thử nghiệm",
      tag: "DIGITAL TRANSFORMATION"
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
        description="WISE Academy cam kết mang lại giá trị có thể đo lường trực tiếp trên bảng cân đối kế toán thông qua việc giảm lãng phí, tăng năng suất và phát triển nội lực cải tiến của tổ chức - trong sản xuất, logistics và dịch vụ."
      />

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
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-[#002F5B]">Kết quả bàn giao</h3>
              <ul className="mt-2">
                {pillar.deliverables.map((d) => (
                  <li key={d} className="plus-item !font-medium">
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <ButtonLink href="/lien-he">Tư vấn giải pháp {pillar.id}</ButtonLink>
                <span className="flex items-center gap-2 text-xs font-semibold text-[#486581]">
                  <Clock className="w-4 h-4 text-[#F76011]" /> {pillar.duration}
                </span>
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
