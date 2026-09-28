import React from "react";
import Link from "next/link";
import { 
  Target, 
  Factory, 
  Cpu, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  ShieldAlert,
  Layers,
  BarChart3
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";

export const metadata = {
  title: "Dịch Vụ Tư Vấn Tinh Gọn Hiện Trường — WISE Academy",
  description: "Các giải pháp tư vấn tối ưu hóa sản xuất, khảo sát thực tế tại xưởng, sắp xếp dây chuyền, nâng cao năng suất công nhân và giảm chi phí.",
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
    <div className="bg-[#F8F9FA]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#001426] via-[#002F5B] to-[#041E35] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <SectionBadge number="SERVICES" title="DỊCH VỤ TƯ VẤN DOANH NGHIỆP" light={true} />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Giải Pháp Tư Vấn <br />
            <span className="text-[#F76011]">Vận Hành Tinh Gọn</span> Hiện Trường.
          </h1>
          <p className="text-base sm:text-lg text-[#C7D8E4] max-w-3xl leading-relaxed">
            WISE cam kết mang lại giá trị có thể đo lường trực tiếp trên bảng cân đối kế toán thông qua việc giảm lãng phí, tăng năng suất chuyền và phát triển nội lực cải tiến của tổ chức.
          </p>
        </div>
      </section>

      {/* 4 Pillars in Detail */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto space-y-16">
        {pillars.map((pillar, idx) => (
          <div 
            key={pillar.id}
            id={pillar.id}
            className="growth-card bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start group"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-[#002F5B] text-white flex items-center justify-center font-black text-xl">
                  <span className="text-[#F76011]">{pillar.id}</span>
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#F76011] bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#F76011]/20">
                  {pillar.tag}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002F5B] leading-tight group-hover:text-[#F76011] transition-colors">
                {pillar.title}
              </h2>
              <p className="text-sm font-semibold text-[#F76011]">
                {pillar.subtitle}
              </p>
              <p className="text-sm text-[#486581] leading-relaxed">
                {pillar.desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#002F5B] font-bold">
                <Clock className="w-4 h-4 text-[#F76011]" />
                <span>Thời gian: {pillar.duration}</span>
              </div>
              <div className="pt-4">
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md shadow-[#F76011]/30 group"
                >
                  <span>Đặt lịch tư vấn giải pháp {pillar.id}</span>
                  <ArrowUpRight className="w-4 h-4 growth-arrow" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#002F5B]">
                Các kết quả bàn giao cụ thể (Deliverables):
              </h3>
              <div className="space-y-3">
                {pillar.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00BE62] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#102A43]">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3-Stage Transformation Roadmap */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#001E38] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <SectionBadge number="ROADMAP" title="LỘ TRÌNH CHUYỂN ĐỔI 3 GIAI ĐOẠN" light={true} />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hành Trình Đồng Hành <span className="text-[#F76011]">Dài Hạn</span>
            </h2>
            <p className="text-base text-white/70">
              Chuyển đổi Lean không thể hoàn thành trong một sớm một chiều. WISE thiết kế lộ trình 3 nấc thang rõ ràng để đảm bảo nguồn lực doanh nghiệp được tối ưu hóa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roadmapStages.map((stage, idx) => (
              <div 
                key={stage.stage}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#F76011] hover:bg-white/10 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F76011]">{stage.stage}</span>
                    <span className="text-xs font-bold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">{stage.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                  <div className="text-xs font-semibold text-[#FF7A30]">{stage.focus}</div>
                  <p className="text-xs text-white/75 leading-relaxed pt-2">
                    {stage.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 text-xs text-white/60 flex items-center justify-between">
                  <span>Bước {idx + 1} / 3</span>
                  <span className="text-[#F76011] font-bold">Cam kết chỉ số KPI</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-3 bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#F76011]/30 transition-all"
            >
              <span>Yêu cầu xây dựng lộ trình cho doanh nghiệp của bạn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
