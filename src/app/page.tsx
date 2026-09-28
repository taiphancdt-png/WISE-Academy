"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  Factory,
  BarChart3,
  Cpu,
  Phone,
  Mail,
  Send,
  Target,
  Sparkles,
  CalendarCheck,
  Zap,
  ShieldCheck,
  Search,
  BookOpen,
  Calendar
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import coursesData from "@/data/courses.json";
import projectsData from "@/data/projects.json";
import expertsData from "@/data/experts.json";
import articlesData from "@/data/articles.json";
import type { Course, Project, Expert, Article } from "@/types";

export default function HomePage() {
  const [selectedSolution, setSelectedSolution] = useState(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    need: "Khảo sát & Tìm điểm nghẽn tại xưởng",
    message: ""
  });

  const courses: Course[] = coursesData as Course[];
  const projects: Project[] = projectsData as Project[];
  const experts: Expert[] = expertsData as Expert[];
  const articles: Article[] = articlesData as Article[];

  const featuredCourses = courses.slice(0, 4);
  const featuredArticles = articles.slice(0, 3);
  const activeProject = projects[activeProjectIdx] || projects[0];

  const solutions = [
    {
      id: "01",
      title: "Khảo Sát & Tìm Điểm Nghẽn Tại Xưởng",
      tag: "ĐÁNH GIÁ THỰC TẾ",
      desc: "Chuyên gia WISE cùng ban giám đốc trực tiếp xuống xưởng sản xuất, quan sát từng công đoạn để chỉ rõ chỗ nào đang tốn thời gian, tốn nhân lực và gây lãng phí chi phí.",
      features: [
        "Chỉ rõ các điểm gây tắc nghẽn và ùn ứ hàng hóa trên chuyền",
        "Định lượng các khoản tiền đang bị lãng phí do phế phẩm và chờ đợi",
        "Vẽ lại sơ đồ luồng chạy của sản phẩm từ đầu vào đến xuất hàng",
        "Kế hoạch hành động 90 ngày để đạt kết quả tăng năng suất ngay"
      ],
      icon: Search
    },
    {
      id: "02",
      title: "Sắp Xếp & Tối Ưu Lại Dây Chuyền Sản Xuất",
      tag: "TỐI ƯU DÂY CHUYỀN",
      desc: "Thiết kế lại cách bố trí máy móc và luồng di chuyển của công nhân theo nguyên tắc tinh gọn: hàng chạy mượt mà, không bị chờ đợi, hạn chế tối đa việc di chuyển thừa.",
      features: [
        "Sắp xếp xưởng theo hình chữ U để tiết kiệm diện tích và nhân lực",
        "Rút ngắn thời gian thay đổi khuôn mẫu hoặc mã hàng mới (SMED)",
        "Thiết lập bảng theo dõi tiến độ sản xuất trực quan dễ thấy",
        "Giảm lượng hàng tồn dở dang nằm chờ giữa các công đoạn"
      ],
      icon: Factory
    },
    {
      id: "03",
      title: "Nâng Năng Suất Công Nhân & Cân Bằng Chuyền",
      tag: "NĂNG SUẤT LAO ĐỘNG",
      desc: "Phân tích từng thao tác của công nhân, loại bỏ các động tác thừa gây mệt mỏi, chia đều khối lượng công việc giữa các vị trí để chuyền chạy liên tục và năng suất tăng vọt.",
      features: [
        "Chuẩn hóa từng bước thao tác để công nhân mới học việc nhanh",
        "Cân bằng nhịp độ làm việc, không để người quá tải người ngồi chờ",
        "Tăng 15% - 30% sản lượng đầu ra mà không cần đầu tư máy mới",
        "Cải thiện điều kiện lao động, an toàn và giảm căng thẳng cho công nhân"
      ],
      icon: TrendingUp
    },
    {
      id: "04",
      title: "Huấn Luyện Quản Đốc & Xây Thói Quen Cải Tiến",
      tag: "PHÁT TRIỂN NỘI LỰC",
      desc: "Đào tạo các quản đốc, tổ trưởng và kỹ sư biết cách tự phát hiện lỗi, tự họp xử lý vấn đề hàng ngày và giữ gìn nề nếp nhà xưởng sạch sẽ, quy củ lâu dài.",
      features: [
        "Huấn luyện quản đốc và tổ trưởng kỹ năng kèm cặp công nhân",
        "Thực hành họp bàn giao ca và xử lý sự cố nhanh 15 phút mỗi ngày",
        "Phát động phong trào góp ý cải tiến nhỏ (Kaizen) có thưởng",
        "Chuyển giao toàn bộ biểu mẫu và hướng dẫn để nhà máy tự duy trì"
      ],
      icon: Users
    }
  ];

  const rgpdcaSteps = [
    { step: "01", name: "KHẢO SÁT", vn: "Xuống Tận Xưởng Quan Sát", desc: "Cùng ban lãnh đạo trực tiếp đi dạo xưởng, xem công nhân thao tác và thu thập số liệu thực tế." },
    { step: "02", name: "MỤC TIÊU", vn: "Định Lượng Kết Quả Cần Đạt", desc: "Xác định rõ con số: Muốn tăng bao nhiêu % sản lượng, giảm bao nhiêu tiền phế phẩm mỗi tháng." },
    { step: "03", name: "KẾ HOẠCH", vn: "Lập Kế Hoạch Từng Tuần", desc: "Phân công rõ ràng ai làm việc gì, thời hạn bao lâu, cam kết không làm gián đoạn việc giao hàng." },
    { step: "04", name: "LÀM THỬ", vn: "Làm Mẫu Tại 1 Chuyền Trước", desc: "Tập trung cải tiến trên 1 dây chuyền thí điểm, đo lường thấy năng suất tăng thật mới nhân rộng." },
    { step: "05", name: "ĐO LƯỜNG", vn: "So Sánh Kết Quả Trước / Sau", desc: "Đối chiếu các con số Before / After rõ ràng: Năng suất tăng bao nhiêu, hàng lỗi giảm bao nhiêu." },
    { step: "06", name: "GIỮ VỮNG", vn: "Viết Thành Quy Trình Chuẩn", desc: "Đóng gói thành tài liệu hướng dẫn dễ hiểu để quản đốc và công nhân duy trì nếp làm việc mới." },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION (Executive Consulting Dark Navy, Approachable Copy) */}
      <section className="relative bg-gradient-to-br from-[#001426] via-[#002F5B] to-[#041E35] text-white pt-14 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden">
        {/* Visual Grids & Glow */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F76011]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#002F5B]/80 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <SectionBadge number="★" title="TƯ VẤN & ĐÀO TẠO TỐI ƯU VẬN HÀNH SẢN XUẤT" light={true} />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Tối Ưu Vận Hành. <br />
              <span className="text-[#F76011] relative inline-block">
                Tăng Trưởng Năng Suất
                <span className="absolute bottom-1 left-0 w-full h-1 bg-[#F76011]/40 rounded-full"></span>
              </span> Bền Vững.
            </h1>

            <p className="text-base sm:text-lg text-[#C7D8E4] leading-relaxed max-w-2xl font-normal">
              WISE đồng hành cùng các chủ doanh nghiệp và giám đốc nhà máy: trực tiếp xuống xưởng tìm ra điểm nghẽn, loại bỏ các khâu lãng phí, giúp tăng sản lượng chuyền và tiết kiệm chi phí rõ rệt.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dich-vu-tu-van"
                className="inline-flex items-center gap-3 bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-[#F76011]/30 hover:shadow-xl hover:shadow-[#F76011]/50 hover:-translate-y-0.5 transition-all group"
              >
                <span>Khám phá giải pháp tư vấn</span>
                <ArrowRight className="w-4 h-4 growth-arrow" />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all group"
              >
                <span>Đặt lịch tư vấn miễn phí</span>
                <ArrowUpRight className="w-4 h-4 text-[#F76011] growth-arrow" />
              </Link>
            </div>

            {/* Practical Trust Strip */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00BE62]" />
                <span>Chuyên gia từng quản lý nhà máy lớn (Nike, Pou Chen)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00BE62]" />
                <span>Chứng nhận Đai Đen Lean Six Sigma quốc tế</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00BE62]" />
                <span>Xuống tận nơi cùng công nhân giải quyết vấn đề</span>
              </div>
            </div>
          </div>

          {/* Hero Right Metrics Display - Interactive Growth Card */}
          <div className="lg:col-span-5 relative">
            <div className="growth-card bg-[#073866]/85 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              {/* Header Box */}
              <div className="flex items-center justify-between pb-5 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F76011] flex items-center justify-center text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF7A30]">KẾT QUẢ ĐÃ CHỨNG MINH</span>
                    <h3 className="text-lg font-bold text-white">Chỉ Số Tăng Trưởng Thực Tế</h3>
                  </div>
                </div>
                <div className="growth-badge px-3 py-1 bg-[#F76011]/25 border border-[#F76011]/50 rounded-full text-[#FF7A30] text-xs font-bold">
                  <span>TĂNG TRƯỞNG</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Metrics Grid with Growth Vibe */}
              <div className="grid grid-cols-2 gap-5 py-6 border-b border-white/15">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#F76011]">+38%</span>
                    <span className="text-xs text-[#00BE62] font-bold">▲ Năng suất</span>
                  </div>
                  <p className="text-xs uppercase text-white/70 tracking-wider font-semibold">Sản Lượng Chuyền May</p>
                  <p className="text-[11px] text-white/80">Tăng trung bình sau 90 ngày thí điểm</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">-25%</span>
                    <span className="text-xs text-[#00BE62] font-bold">▼ Chi phí</span>
                  </div>
                  <p className="text-xs uppercase text-white/70 tracking-wider font-semibold">Thời Gian Chờ Đợi</p>
                  <p className="text-[11px] text-white/80">Giảm lãng phí tìm kiếm và phế phẩm</p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">12,000+</div>
                  <p className="text-xs uppercase text-white/70 tracking-wider font-semibold">Cán Bộ & Quản Lý</p>
                  <p className="text-[11px] text-white/80">Quản đốc, tổ trưởng được đào tạo</p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#F76011]">30+</div>
                  <p className="text-xs uppercase text-white/70 tracking-wider font-semibold">Nhà Máy Đối Tác</p>
                  <p className="text-[11px] text-white/80">Pou Chen, GEODIS, Huali, Samho...</p>
                </div>
              </div>

              {/* Bottom Quote inside Hero Box */}
              <div className="pt-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#F76011] flex items-center justify-center text-white shrink-0 font-bold text-xs">
                  W
                </span>
                <p className="text-xs text-white/85 leading-relaxed italic">
                  “Không dạy lý thuyết suông. Chúng tôi cùng bạn trực tiếp làm tại hiện trường nhà máy.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLIENT LOGO MARQUEE */}
      <section className="bg-white border-y border-slate-200 py-7 px-4 overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#486581] mb-5">
            Được Tin Tưởng Bởi Các Tập Đoàn Và Doanh Nghiệp Sản Xuất Hàng Đầu
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-base sm:text-xl font-extrabold text-[#002F5B]/75 tracking-wider">
            <span className="hover:text-[#F76011] transition-colors cursor-default">POU CHEN GROUP</span>
            <span className="text-slate-300">✦</span>
            <span className="hover:text-[#F76011] transition-colors cursor-default">GEODIS LOGISTICS</span>
            <span className="text-slate-300">✦</span>
            <span className="hover:text-[#F76011] transition-colors cursor-default">HUALI INDUSTRIAL</span>
            <span className="text-slate-300">✦</span>
            <span className="hover:text-[#F76011] transition-colors cursor-default">AG SAMHO</span>
            <span className="text-slate-300">✦</span>
            <span className="hover:text-[#F76011] transition-colors cursor-default">VICTORY FOOTWEAR</span>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES: W-I-S-E (Approachable & Clear) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#F8F9FA]">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <SectionBadge number="01" title="TRIẾT LÝ LÀM VIỆC" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B] leading-tight">
              Tôn Trọng Con Người.<br />
              <span className="text-[#F76011]">Lấy Xưởng Sản Xuất</span> Làm Gốc.
            </h2>
            <p className="text-base text-[#486581] leading-relaxed">
              Mọi giải pháp của WISE luôn xuất phát từ việc lắng nghe khó khăn của từng người trong xưởng: từ người công nhân đứng máy, tổ trưởng đến giám đốc nhà máy. Chúng tôi cùng bạn tìm nguyên nhân gốc rễ để nhà máy tự vận hành trơn tru và phát triển lâu dài.
            </p>
            <div className="pt-2">
              <Link 
                href="/ve-chung-toi"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#002F5B] hover:text-[#F76011] border-b-2 border-[#002F5B] hover:border-[#F76011] pb-1 transition-all group"
              >
                <span>Tìm hiểu thêm về văn hóa & câu chuyện WISE</span>
                <ArrowRight className="w-4 h-4 growth-arrow" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="growth-card bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center font-extrabold text-xl mb-4">
                W
              </div>
              <h3 className="text-lg font-bold text-[#002F5B]">Dễ Làm & Hiệu Quả Ngay (Workable)</h3>
              <p className="text-sm text-[#486581] mt-2 leading-relaxed">
                Giải pháp phải đơn giản, thực tế, công nhân áp dụng được ngay trên sàn xưởng mà không cần công nghệ quá phức tạp.
              </p>
            </div>

            <div className="growth-card bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center font-extrabold text-xl mb-4">
                I
              </div>
              <h3 className="text-lg font-bold text-[#002F5B]">Cải Tiến Liên Tục Mỗi Ngày (Improvement)</h3>
              <p className="text-sm text-[#486581] mt-2 leading-relaxed">
                Tạo thói quen tốt cho công nhân và quản đốc: mỗi ngày tìm ra 1 điểm chưa tốt để sửa chữa, gom lại thành bước nhảy vọt.
              </p>
            </div>

            <div className="growth-card bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center font-extrabold text-xl mb-4">
                S
              </div>
              <h3 className="text-lg font-bold text-[#002F5B]">Chia Sẻ Kinh Nghiệm Thật (Share)</h3>
              <p className="text-sm text-[#486581] mt-2 leading-relaxed">
                Đóng góp giá trị tri thức cho cộng đồng sản xuất Việt Nam, chia sẻ kinh nghiệm xử lý sự cố thực tế với tinh thần tận tâm.
              </p>
            </div>

            <div className="growth-card bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center font-extrabold text-xl mb-4">
                E
              </div>
              <h3 className="text-lg font-bold text-[#002F5B]">Vận Hành Gọn Gàng, Tiết Kiệm (Excellence)</h3>
              <p className="text-sm text-[#486581] mt-2 leading-relaxed">
                Mục tiêu cuối cùng là giảm thiểu lãng phí tiền bạc, nhân công và thời gian, giúp nhà máy đạt hiệu quả cao nhất với chi phí thấp nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR CONSULTING LEVERS (Growth Interactive Tabs) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white border-t border-slate-200">
        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <SectionBadge number="02" title="HỆ GIẢI PHÁP TƯ VẤN" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B]">
              4 Giải Pháp Trọng Tâm <span className="text-[#F76011]">Cho Nhà Máy</span>
            </h2>
            <p className="text-base text-[#486581]">
              Từ tìm đúng nguyên nhân tắc nghẽn đến đào tạo nhân sự tự duy trì nề nếp gọn gàng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tabs Selector Left */}
            <div className="lg:col-span-5 space-y-3">
              {solutions.map((sol, index) => {
                const isSelected = selectedSolution === index;
                const IconComponent = sol.icon;
                return (
                  <button
                    key={sol.id}
                    onClick={() => setSelectedSolution(index)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                      isSelected
                        ? "bg-[#002F5B] text-white border-[#002F5B] shadow-xl shadow-[#002F5B]/20 -translate-y-1"
                        : "bg-[#F8F9FA] text-[#102A43] border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 transition-colors ${
                      isSelected ? "bg-[#F76011] text-white" : "bg-white text-[#002F5B] border border-slate-200"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                        isSelected ? "text-[#FF7A30]" : "text-[#486581]"
                      }`}>
                        Giải pháp {sol.id}
                      </span>
                      <strong className="text-base font-bold block">{sol.title}</strong>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? "translate-x-1 text-[#F76011]" : "text-slate-400"}`} />
                  </button>
                );
              })}
            </div>

            {/* Solution Details Panel Right */}
            <div className="lg:col-span-7 bg-[#FFF5EC]/45 border border-[#F76011]/25 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden growth-card">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#F76011] bg-white px-3 py-1 rounded-full border border-[#F76011]/30">
                    {solutions[selectedSolution].tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002F5B] mt-3">
                    {solutions[selectedSolution].title}
                  </h3>
                  <p className="text-base text-[#486581] mt-3 leading-relaxed">
                    {solutions[selectedSolution].desc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#002F5B]">
                    Kết quả mang lại cho nhà xưởng:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {solutions[selectedSolution].features.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-[#F76011] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#102A43]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/dich-vu-tu-van"
                    className="inline-flex items-center gap-2 bg-[#002F5B] hover:bg-[#001E38] text-white text-sm font-bold px-6 py-3 rounded-full transition-all group"
                  >
                    <span>Xem chi tiết giải pháp</span>
                    <ArrowRight className="w-4 h-4 text-[#F76011] growth-arrow" />
                  </Link>
                  <Link
                    href="/lien-he"
                    className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white text-sm font-bold px-6 py-3 rounded-full transition-all shadow-md shadow-[#F76011]/30 group"
                  >
                    <span>Đặt lịch tư vấn trực tiếp</span>
                    <ArrowUpRight className="w-4 h-4 growth-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. METHODOLOGY: 6 BƯỚC ĐƠN GIẢN DỄ HIỂU */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#001E38] text-white relative">
        <div className="w-full max-w-[1600px] mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <SectionBadge number="03" title="QUY TRÌNH THỰC HIỆN" light={true} />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              6 Bước Cải Tiến Rõ Ràng & <span className="text-[#F76011]">Không Làm Rối Việc</span>
            </h2>
            <p className="text-base text-white/75">
              Chúng tôi không mang đến những tập lý thuyết dày cộp. Mọi bước đi đều tập trung vào việc giúp công nhân làm việc dễ hơn và năng suất tăng lên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rgpdcaSteps.map((step) => (
              <div 
                key={step.step}
                className="growth-card bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#F76011]/60 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#F76011] tracking-wider font-mono">
                    {step.step}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {step.name}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF7A30] transition-colors">
                  {step.vn}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#002F5B]/80 border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-white">Bạn muốn chuyên gia xuống thăm xưởng và góp ý trực tiếp?</h4>
              <p className="text-sm text-white/75 mt-1">Chúng tôi hỗ trợ 1 buổi khảo sát thực tế ban đầu hoàn toàn miễn phí để cùng bạn nhìn ra cơ hội tăng năng suất.</p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-sm px-7 py-3 rounded-full shrink-0 shadow-lg shadow-[#F76011]/30 transition-all group"
            >
              <span>Đặt lịch hẹn khảo sát</span>
              <ArrowRight className="w-4 h-4 growth-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TRAINING COURSES WITH GROWTH HOVER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white">
        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <SectionBadge number="04" title="CHƯƠNG TRÌNH ĐÀO TẠO" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B]">
                Học Xong Là <span className="text-[#F76011]">Làm Được Ngay</span> Trên Chuyền.
              </h2>
              <p className="text-base text-[#486581] max-w-xl">
                Các khóa học thực hành sát với sản phẩm thực tế, có trò chơi mô phỏng nhà máy sống động để quản đốc và tổ trưởng hào hứng tiếp thu.
              </p>
            </div>
            <Link
              href="/dao-tao"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F76011] hover:text-[#FF6712] transition-colors group"
            >
              <span>Xem danh sách 35+ khóa học</span>
              <ArrowRight className="w-4 h-4 growth-arrow" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div 
                key={course.id}
                className="growth-card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#002F5B] transition-all"
              >
                <div>
                  {/* Course Image */}
                  {course.image && (
                    <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span 
                        className="absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white shadow-sm"
                        style={{ backgroundColor: course.accent_color || "#002F5B" }}
                      >
                        {course.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {!course.image && (
                        <span 
                          className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                          style={{ backgroundColor: course.accent_color || "#002F5B" }}
                        >
                          {course.badge}
                        </span>
                      )}
                      <span className="text-xs text-[#486581] flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#F76011]" /> {course.duration}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#486581] line-clamp-3 leading-relaxed">
                      {course.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#002F5B] block">Dành cho:</span>
                      <p className="text-xs text-[#486581] line-clamp-2">{course.target}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href={`/dao-tao#${course.id}`}
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors"
                    >
                      <span>Xem nội dung khóa học</span>
                      <ArrowUpRight className="w-4 h-4 growth-arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL CASE STUDIES: BEFORE/AFTER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#F8F9FA] border-t border-slate-200">
        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <SectionBadge number="05" title="KẾT QUẢ THỰC TẾ" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B]">
                Các Dự Án Đã Làm <span className="text-[#F76011]">Và Hiệu Quả Đạt Được.</span>
              </h2>
              <p className="text-base text-[#486581] max-w-xl">
                Những con số đo lường trước và sau khi tối ưu chuyền sản xuất tại các nhà máy đối tác.
              </p>
            </div>
            
            {/* Project Switcher */}
            <div className="flex items-center gap-2">
              {projects.slice(0, 3).map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeProjectIdx === idx
                      ? "bg-[#002F5B] text-white shadow-sm"
                      : "bg-white text-[#486581] border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {p.client}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Study Spotlight */}
          <div className="growth-card bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#F76011] tracking-widest block mb-1">
                  {activeProject.industry}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002F5B]">
                  {activeProject.client}: {activeProject.title}
                </h3>
              </div>

              <blockquote className="border-l-4 border-[#F76011] pl-4 italic text-sm sm:text-base text-[#486581] leading-relaxed">
                “{activeProject.highlight}”
              </blockquote>

              <p className="text-sm text-[#486581] leading-relaxed">
                {activeProject.description}
              </p>

              {/* Factory Photos Gallery */}
              {activeProject.gallery && activeProject.gallery.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-[#002F5B] tracking-wider block">
                    Hình ảnh hiện trường tại nhà máy:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeProject.gallery.slice(0, 3).map((imgUrl, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                        <img
                          src={imgUrl}
                          alt={`Hiện trường ${activeProject.client}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics Grid with Growth Accents */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {activeProject.results.map((res, i) => (
                  <div key={i} className="bg-[#FFF5EC] border border-[#F76011]/20 p-4 rounded-xl">
                    <div className="text-2xl font-black text-[#F76011]">{res.metric}</div>
                    <div className="text-xs text-[#102A43] font-semibold mt-1">{res.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/du-an"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#002F5B] hover:text-[#F76011] transition-colors group"
                >
                  <span>Xem thêm các câu chuyện dự án khác</span>
                  <ArrowRight className="w-4 h-4 growth-arrow" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#002F5B] to-[#001E38] p-8 rounded-2xl text-white space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-xs uppercase font-bold text-[#FF7A30]">Cách Làm Của WISE</span>
                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">THỰC HÀNH TẠI XƯỞNG</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Đo đạc thời gian từng công đoạn tại chuyền để tìm điểm nghẽn.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Tổ chức đào tạo gắn liền với game mô phỏng thực tế.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Cùng quản đốc và kỹ sư làm thử nghiệm cải tiến trên chuyền thật.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <span>Báo cáo kết quả tăng trưởng rõ ràng cho ban giám đốc.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/lien-he"
                  className="block text-center bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-xs py-3 rounded-xl transition-all"
                >
                  Đăng ký tư vấn triển khai cho nhà máy của bạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EXPERT TEAM SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white">
        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <SectionBadge number="06" title="ĐỘI NGŨ CHUYÊN GIA" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B]">
                Kinh Nghiệm Thực Tế. <span className="text-[#F76011]">Hiểu Đời Sống Nhà Xưởng.</span>
              </h2>
              <p className="text-base text-[#486581] max-w-xl">
                Các chuyên gia của WISE từng trực tiếp làm việc tại các nhà xưởng quy mô lớn, thấu hiểu áp lực giao hàng và khó khăn của người làm sản xuất.
              </p>
            </div>
            <Link
              href="/chuyen-gia"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F76011] hover:text-[#FF6712] transition-colors group"
            >
              <span>Xem thông tin toàn bộ chuyên gia</span>
              <ArrowRight className="w-4 h-4 growth-arrow" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.slice(0, 4).map((expert) => (
              <div
                key={expert.id}
                className="growth-card bg-[#F8F9FA] border border-slate-200 rounded-3xl overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-slate-200 overflow-hidden relative">
                    {expert.image ? (
                      <img 
                        src={expert.image} 
                        alt={expert.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#002F5B] to-[#073866] text-white text-3xl font-extrabold">
                        {expert.name.split(" ").pop()?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-[#001E38]/85 text-[#FF7A30] text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                      CHUYÊN GIA
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-xs uppercase font-extrabold text-[#F76011] tracking-wider block">
                      {expert.role}
                    </span>
                    <h3 className="text-lg font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors">
                      {expert.name}
                    </h3>
                    <p className="text-xs text-[#486581] line-clamp-3 leading-relaxed">
                      {expert.bio}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-200/60 mt-2">
                  <div className="flex flex-wrap gap-1 mt-3">
                    {expert.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-[#486581]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5. KNOWLEDGE & ARTICLES SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#F8F9FA] border-t border-slate-200">
        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <SectionBadge number="07" title="GÓC TRI THỨC" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002F5B]">
                Kinh Nghiệm Quản Lý & <span className="text-[#F76011]">Tối Ưu Hiện Trường.</span>
              </h2>
              <p className="text-base text-[#486581] max-w-xl">
                Những bài viết hướng dẫn thực tế, sơ đồ biểu đồ dễ hiểu về cách sắp xếp 5S, bảo trì máy móc và loại bỏ lãng phí.
              </p>
            </div>
            <Link
              href="/tri-thuc"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F76011] hover:text-[#FF6712] transition-colors group"
            >
              <span>Xem tất cả bài viết ({articles.length})</span>
              <ArrowRight className="w-4 h-4 growth-arrow" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((art) => (
              <article
                key={art.id}
                className="growth-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#002F5B] transition-all"
              >
                <div>
                  <Link
                    href={`/tri-thuc/${art.slug || art.id}`}
                    className="block aspect-[16/9] bg-slate-100 overflow-hidden relative"
                  >
                    {art.thumbnail ? (
                      <img
                        src={art.thumbnail}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#002F5B] to-[#073866] text-white p-6 text-center">
                        <BookOpen className="w-10 h-10 text-[#FF7A30] mb-2" />
                        <span className="text-xs font-semibold text-white/80">WISE KNOWLEDGE</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#001E38]/85 text-[#FF7A30] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      {art.category}
                    </span>
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#486581]">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {art.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#F76011]" /> {art.readTime}
                      </span>
                    </div>

                    <Link href={`/tri-thuc/${art.slug || art.id}`} className="block">
                      <h3 className="text-base font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#486581] line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      {art.author || "WISE Academy"}
                    </span>
                    <Link
                      href={`/tri-thuc/${art.slug || art.id}`}
                      className="growth-arrow inline-flex items-center gap-1.5 text-xs font-bold text-[#F76011] group-hover:text-[#002F5B] transition-colors"
                    >
                      <span>Đọc bài viết</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LEAD CAPTURE & CONSULTATION FORM (Clear, Easy to Submit) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gradient-to-br from-[#001E38] via-[#002F5B] to-[#041E35] text-white relative overflow-hidden" id="tu-van">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <SectionBadge number="08" title="ĐẶT LỊCH HẸN" light={true} />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Bài Toán Của Nhà Máy Là <br />
              <span className="text-[#F76011]">Điểm Khởi Đầu</span> Của Chúng Tôi.
            </h2>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Bạn đang đau đầu vì chuyền sản xuất bị tắc nghẽn, hàng lỗi nhiều hay công nhân làm việc chưa tự giác? Hãy để lại số điện thoại, chuyên gia của WISE sẽ gọi lại trao đổi cụ thể.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F76011]/20 flex items-center justify-center text-[#F76011]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase text-white/60 tracking-wider">Gọi điện trực tiếp để trao đổi nhanh</span>
                  <a href="tel:+84989002121" className="block text-xl font-extrabold text-white hover:text-[#F76011] transition-colors">
                    0989 002 121 (Ms. Thủy)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F76011]/20 flex items-center justify-center text-[#F76011]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase text-white/60 tracking-wider">Hòm thư tiếp nhận yêu cầu</span>
                  <a href="mailto:contact@wisedemy.com.vn" className="block text-base font-bold text-white hover:text-[#F76011] transition-colors">
                    contact@wisedemy.com.vn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Box */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-[#102A43]">
              {formSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00BE62]/20 text-[#00BE62] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#002F5B]">Đã Nhận Yêu Cầu Thành Công!</h3>
                  <p className="text-sm text-[#486581]">
                    Cảm ơn bạn. Chuyên gia tư vấn của WISE sẽ liên hệ lại trực tiếp qua điện thoại trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#F76011] hover:underline pt-2"
                  >
                    <span>Gửi thêm yêu cầu khác</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-[#002F5B]">
                    Đặt Lịch Tư Vấn Nhà Máy
                  </h3>
                  <p className="text-xs text-[#486581]">
                    Hãy để lại thông tin để chuyên gia liên hệ tìm hiểu sơ bộ tình hình nhà máy trước khi gặp gỡ.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0989 xxx xxx"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                        Email Doanh Nghiệp *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ten@congty.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                        Tên Công Ty / Nhà Máy
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Công ty ABC"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Nhu Cầu Cần Hỗ Trợ
                    </label>
                    <select
                      value={formData.need}
                      onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] bg-white"
                    >
                      <option value="Khảo sát & Tìm điểm nghẽn tại xưởng">Khảo sát & Tìm điểm nghẽn trực tiếp tại xưởng</option>
                      <option value="Tăng năng suất dây chuyền sản xuất">Tăng năng suất dây chuyền sản xuất</option>
                      <option value="Sắp xếp nhà xưởng 5S gọn gàng, an toàn">Sắp xếp nhà xưởng 5S gọn gàng, ngăn nắp, an toàn</option>
                      <option value="Đào tạo kỹ năng cho quản đốc & tổ trưởng">Đào tạo kỹ năng quản lý cho quản đốc & tổ trưởng</option>
                      <option value="Giảm tỷ lệ hàng lỗi, phế phẩm">Giảm tỷ lệ hàng lỗi, phế phẩm trong xưởng</option>
                      <option value="Tổ chức buổi trải nghiệm game mô phỏng sản xuất">Tổ chức buổi trải nghiệm game mô phỏng sản xuất</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Mô Tả Vấn Đề Hiện Tại Của Nhà Máy
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ví dụ: Công nhân hay bị ứ việc ở khâu đóng gói, thời gian đổi mẫu lâu, công nhân thiếu tự giác sắp xếp đồ đạc..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#F76011] hover:bg-[#FF6712] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F76011]/30 hover:shadow-xl transition-all group"
                  >
                    <Send className="w-4 h-4 growth-arrow" />
                    <span>Gửi Yêu Cầu Đặt Lịch Tư Vấn</span>
                  </button>
                  <p className="text-[11px] text-center text-[#486581] mt-2">
                    Thông tin của bạn được cam kết bảo mật 100% giữa hai doanh nghiệp.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
