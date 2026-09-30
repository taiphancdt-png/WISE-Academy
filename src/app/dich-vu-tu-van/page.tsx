import React from "react";
import { Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import { ButtonLink, CtaBand, Section, SectionHeader } from "@/components/ui";

const P = "/images/projects/";
const pillarImages = [
  P + "huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_1.webp",
  P + "ty-bach-chuong-trinh-dao-tao-lean-cell-layout/photo_1.webp",
  P + "yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_10.webp",
  P + "project-lean-six-sigma-yellow-belt-pouchen-group/photo_10.webp",
];

export const metadata = {
  title: "Dịch Vụ Tư Vấn Tinh Gọn Hiện Trường — WISE Academy",
  description: "Các giải pháp tư vấn tối ưu hóa sản xuất, khảo sát thực tế tại xưởng, sắp xếp dây chuyền, nâng cao năng suất công nhân và giảm chi phí.",
  alternates: { canonical: "/dich-vu-tu-van" },
};

export default function ConsultingPage() {
  const pillars = [
    {
      id: "01",
      title: "Khảo Sát Thực Tế & Tìm Điểm Nghẽn Tại Xưởng",
      subtitle: "Nhìn rõ các chỗ bị nghẽn, lãng phí thời gian và cơ hội tăng năng suất",
      desc: "Chuyên gia WISE thực hiện khảo sát toàn diện hệ thống sản xuất tại phân xưởng, quan sát luồng nguyên vật liệu và nhịp độ thao tác của công nhân để chỉ rõ các điểm lãng phí cần khắc phục ngay.",
      deliverables: [
        "Báo cáo đánh giá hiện trạng vận hành và mức độ lãng phí",
        "Sơ đồ luồng sản xuất thực tế từ nguyên liệu đến thành phẩm",
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
      subtitle: "Tái thiết hệ thống quản trị theo dòng chảy liên tục, từ chiến lược đến sàn sản xuất",
      desc: "Tổ chức lại phân xưởng theo nguyên tắc tinh gọn, xóa bỏ tình trạng sản xuất theo lô lớn rời rạc, thiết lập ô sản xuất hình chữ U (U-Shape Cell) và kéo theo nhu cầu khách hàng (Pull System).",
      deliverables: [
        "Thiết kế bản đồ dòng giá trị tương lai (Future State VSM)",
        "Thiết kế mặt bằng ô sản xuất tinh gọn (Lean Cell Layout Design)",
        "Thiết lập hệ thống kéo Kanban & Điểm kiểm soát tồn kho",
        "Rút ngắn thời gian thay khuôn/mã hàng bằng SMED (>40%)",
        "Xây dựng hệ thống quản trị sàn sản xuất hàng ngày (DMS)"
      ],
      duration: "6 - 12 tháng triển khai đồng hành",
      tag: "FULL SYSTEM TRANSFORMATION"
    },
    {
      id: "03",
      title: "Work Engineering & Cân Bằng Chuyền (Line Productivity)",
      subtitle: "Tối ưu hóa thao tác công nhân, giảm chu kỳ thao tác và tăng sản lượng trên chuyền",
      desc: "Áp dụng kỹ thuật công nghiệp (Industrial Engineering) để bấm giờ phân tích thao tác, loại bỏ động tác thừa, cân bằng tải trọng công việc giữa các công đoạn và xóa bỏ nút thắt cổ chai.",
      deliverables: [
        "Biểu đồ phân tích cân bằng chuyền (Yamazumi Chart)",
        "Bảng chuẩn hóa thao tác và định mức thời gian chuẩn (Standard Time)",
        "Giải pháp bố trí đồ gá (Jig) và công cụ hỗ trợ thông minh",
        "Tăng năng suất chuyền từ 15% - 30% mà không cần đầu tư máy mới",
        "Giảm tải tình trạng ùn ứ hàng dở dang (WIP) giữa các công đoạn"
      ],
      duration: "3 - 6 tháng tại các chuyền sản xuất mục tiêu",
      tag: "PRODUCTIVITY IMPROVEMENT"
    },
    {
      id: "04",
      title: "Vận Hành Số & Nhà Máy Thông Minh (Lean 4.0 & IoT)",
      subtitle: "Kết hợp tư duy tinh gọn với công nghệ giám sát thời gian thực và tự động hóa",
      desc: "Tránh bẫy số hóa lãng phí bằng cách tối ưu quy trình trước khi số hóa. Triển khai cảm biến IoT kết nối máy móc, bảng giám sát OEE theo thời gian thực và ứng dụng AI hỗ trợ kế hoạch sản xuất.",
      deliverables: [
        "Dashboard giám sát hiệu suất thiết bị OEE thời gian thực",
        "Hệ thống cảnh báo sự cố kỹ thuật số (Digital Andon)",
        "Số hóa nhật ký vận hành và biên bản kiểm tra chất lượng",
        "Tự động hóa thu thập dữ liệu máy móc và dự đoán bảo trì (PdM)",
        "Lộ trình chuyển đổi Nhà máy thông minh (Smart Factory Roadmap)"
      ],
      duration: "4 - 8 tháng tích hợp và thử nghiệm",
      tag: "DIGITAL TRANSFORMATION"
    }
  ];

  const roadmapStages = [
    {
      stage: "GIAI ĐOẠN 1",
      name: "Khám Phá & Đánh Thức Tư Duy (Explore)",
      time: "1 - 2 Tháng",
      focus: "75% Nhận thức & Nền tảng · 25% Thực nghiệm nhỏ",
      details: "Lãnh đạo phát triển cách hiểu đúng đắn về Lean, tổ chức Simulation Game cho ban điều hành, chẩn đoán toàn diện hiện trạng và lựa chọn chuyền thí điểm."
    },
    {
      stage: "GIAI ĐOẠN 2",
      name: "Xây Dựng Nền Móng Tinh Gọn (Foundation)",
      time: "6 - 9 Tháng",
      focus: "25% Kiến thức chuyên sâu · 75% Triển khai hiện trường",
      details: "Triển khai 5S, Visual Management, Lean Cell, SMED tại các chuyền mẫu. Đo lường các chỉ số năng suất (tăng 15-38%) và tạo Quick Wins để củng cố niềm tin."
    },
    {
      stage: "GIAI ĐOẠN 3",
      name: "Nhân Rộng & Chuẩn Hóa Bền Vững (Scale)",
      time: "9 - 18 Tháng",
      focus: "Duy trì văn hóa cải tiến liên tục & Hệ thống DMS",
      details: "Nhân rộng giải pháp sang toàn bộ các phân xưởng còn lại. Đào tạo đội ngũ Lean Leaders nội bộ tự vận hành, đánh giá và duy trì kết quả lâu dài."
    }
  ];

  return (
    <div>
      <PageHero
        eyebrow="Dịch vụ tư vấn doanh nghiệp"
        image="/images/projects/yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_1.webp"
        title={<>Giải pháp tư vấn <span className="text-[#FF7A30]">vận hành tinh gọn</span> tại hiện trường</>}
        description="WISE cam kết mang lại giá trị có thể đo lường trực tiếp trên bảng cân đối kế toán thông qua việc giảm lãng phí, tăng năng suất chuyền và phát triển nội lực cải tiến của tổ chức."
      />

      {/* Pillars: alternating image / text */}
      {pillars.map((pillar, idx) => (
        <section key={pillar.id} id={pillar.id} className={`${idx % 2 ? "bg-[#F8F9FA]" : "bg-white"} py-16 lg:py-20 px-4 sm:px-6 scroll-mt-24`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 ${idx % 2 ? "lg:order-2" : ""}`}>
              <img src={pillarImages[idx]} alt={pillar.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9500E]">
                Giải pháp {pillar.id} · {pillar.tag}
              </span>
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
      <Section>
        <SectionHeader
          eyebrow="Lộ trình chuyển đổi 3 giai đoạn"
          title={<>Hành trình đồng hành <span className="text-[#F76011]">dài hạn</span></>}
          description="Chuyển đổi Lean không thể hoàn thành trong một sớm một chiều. WISE thiết kế lộ trình 3 nấc thang rõ ràng để nguồn lực doanh nghiệp được sử dụng tối ưu."
        />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapStages.map((stage, idx) => (
            <li key={stage.stage} className="card-soft p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#F76011]">{String(idx + 1).padStart(2, "0")}</span>
                <span className="text-xs font-semibold text-[#002F5B] bg-[#EBF3FA] px-3 py-1 rounded-full">{stage.time}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#002F5B] leading-snug">{stage.name}</h3>
              <p className="mt-2 text-xs font-semibold text-[#C9500E]">{stage.focus}</p>
              <p className="mt-3 text-sm text-[#486581] leading-relaxed">{stage.details}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Xây dựng lộ trình chuyển đổi cho doanh nghiệp của bạn"
        description="Bắt đầu bằng một buổi khảo sát hiện trường miễn phí để cùng nhìn ra cơ hội tăng năng suất và giảm chi phí."
        label="Yêu cầu xây dựng lộ trình"
      />
    </div>
  );
}
