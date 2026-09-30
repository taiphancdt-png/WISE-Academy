"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Phone,
  Mail,
  Send,
  Calendar,
  BookOpen,
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import PartnerLogos from "@/components/PartnerLogos";
import coursesData from "@/data/courses.json";
import projectsData from "@/data/projects.json";
import expertsData from "@/data/experts.json";
import articlesData from "@/data/articles.json";
import type { Course, Project, Expert, Article } from "@/types";

const IMG = {
  hero: "/images/projects/project-lean-six-sigma-yellow-belt-pouchen-group/photo_1.webp",
  gemba: "/images/projects/huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_1.webp",
  workshop: "/images/projects/samho-ag-lean-six-sigma-yellow-belt/photo_10.webp",
  floor: "/images/projects/yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_1.webp",
  classroom: "/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp",
  lineBalance: "/images/projects/yujin-kreves-dao-tao-tu-van-5s-an-toan-quan-ly-truc-quan/photo_10.webp",
  chart: "/images/projects/project-lean-six-sigma-yellow-belt-pouchen-group/photo_10.webp",
  kickoff: "/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-yellow-belt/photo_1.webp",
  team: "/images/projects/victory-lean-dianogtics-and-lean-fundamental-training/photo_2.webp",
  why: "/images/projects/geodis-vietnam-dao-tao-thuc-hanh-5s-an-toan-quan-ly-truc-quan/photo_11.webp",
};



const solutions = [
  "Khảo sát & tìm điểm nghẽn tại xưởng",
  "Sắp xếp & tối ưu lại dây chuyền",
  "Nâng năng suất & cân bằng chuyền",
  "Huấn luyện quản đốc & văn hóa Kaizen",
  "Thiết kế Lean Cell & Layout chữ U",
  "Rút ngắn thời gian đổi mã hàng (SMED)",
  "Quản lý trực quan & 5S hiện trường",
  "Lean 4.0 & vận hành số",
];

const rgpdcaSteps = [
  { name: "Khảo sát", vn: "Xuống tận xưởng quan sát" },
  { name: "Mục tiêu", vn: "Định lượng kết quả cần đạt" },
  { name: "Kế hoạch", vn: "Lập kế hoạch từng tuần" },
  { name: "Làm thử", vn: "Làm mẫu tại 1 chuyền trước" },
  { name: "Đo lường", vn: "So sánh kết quả trước / sau" },
  { name: "Giữ vững", vn: "Viết thành quy trình chuẩn" },
];

const whyWise = [
  {
    title: "Dễ làm & hiệu quả ngay (Workable)",
    desc: "Giải pháp đơn giản, thực tế, công nhân áp dụng được ngay trên sàn xưởng mà không cần công nghệ phức tạp.",
  },
  {
    title: "Cải tiến liên tục mỗi ngày (Improvement)",
    desc: "Tạo thói quen tốt cho công nhân và quản đốc: mỗi ngày sửa một điểm chưa tốt, gom lại thành bước nhảy vọt.",
  },
  {
    title: "Chia sẻ kinh nghiệm thật (Share)",
    desc: "Chuyên gia từng quản lý nhà máy lớn (Nike, Pou Chen) chia sẻ kinh nghiệm xử lý sự cố thực tế.",
  },
  {
    title: "Vận hành gọn gàng, tiết kiệm (Excellence)",
    desc: "Giảm lãng phí tiền bạc, nhân công và thời gian để nhà máy đạt hiệu quả cao nhất với chi phí thấp nhất.",
  },
];

const stats = [
  { value: "12,000+", label: "Cán bộ & quản lý được đào tạo" },
  { value: "30+", label: "Nhà máy đối tác" },
  { value: "+38%", label: "Sản lượng chuyền sau 90 ngày" },
  { value: "-25%", label: "Thời gian chờ đợi & lãng phí" },
];

export default function HomePage() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    need: "Khảo sát & Tìm điểm nghẽn tại xưởng",
    message: "",
  });

  const courses: Course[] = coursesData as Course[];
  const projects: Project[] = projectsData as Project[];
  const experts: Expert[] = expertsData as Expert[];
  const articles: Article[] = articlesData as Article[];

  const featuredCourses = courses.slice(0, 6);
  const featuredArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const activeProject = featuredProjects[activeProjectIdx] || projects[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15 bg-white";

  return (
    <div>
      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={IMG.hero} alt="Nhà máy sản xuất" className="absolute inset-0 -z-20 w-full h-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#001E38]/80 via-[#002F5B]/70 to-[#001E38]/85" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
            Tối ưu vận hành. Tăng năng suất.
            <br className="hidden sm:block" /> <span className="text-[#FF7A30]">Tiết kiệm chi phí</span> bền vững.
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi đào tạo, huấn luyện và cùng doanh nghiệp xuống tận xưởng để loại bỏ lãng phí, nâng cao chất lượng
            và tối đa hóa năng suất.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dao-tao"
              className="inline-flex items-center bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-black/20 transition-colors"
            >
              Chương trình đào tạo
            </Link>
            <Link
              href="/dich-vu-tu-van"
              className="inline-flex items-center bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-black/20 transition-colors"
            >
              Tư vấn cho doanh nghiệp
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CLIENT / PARTNER LOGOS */}
      <PartnerLogos />

      {/* 3. TRAINING PROGRAM */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionBadge title="Đối tác ủy quyền của LSSI Global" />
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B]">Chương trình đào tạo Lean Six Sigma</h2>
            <p className="mt-3 text-sm sm:text-base text-[#486581]">
              Lộ trình đào tạo thực hành theo cấp độ, học xong là áp dụng được ngay trên chuyền sản xuất.
            </p>
          </div>

          {/* LSSI authorized partner */}
          <div className="card-soft !transform-none mb-14 px-6 py-7 sm:px-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <a
              href="https://leansixsigmainstitute.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              aria-label="Lean Six Sigma Institute (LSSI Global)"
            >
              <img src="/images/brand/lssi-logo.png" alt="Lean Six Sigma Institute (LSSI) logo" className="h-16 sm:h-20 w-auto" />
            </a>
            <div className="hidden md:block w-px self-stretch bg-slate-200" />
            <p className="text-sm sm:text-base text-[#486581] leading-relaxed text-center md:text-left">
              <strong className="text-[#002F5B]">WISE Academy là đối tác được ủy quyền (Authorized Partner) của Lean Six Sigma Institute – LSSI Global</strong>{" "}
              tại Việt Nam và châu Á. Học viên được đào tạo theo giáo trình chuẩn quốc tế của LSSI và nhận chứng nhận Lean Six Sigma
              có giá trị toàn cầu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link key={course.id} href={`/dao-tao#${course.id}`} className="card-soft group flex flex-col p-5">
                <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="pt-5 flex flex-col flex-grow">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#102A43]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.accent_color || "#002F5B" }} />
                    {course.badge}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-[#102A43] leading-snug line-clamp-2">{course.title}</h3>
                  <span className="mt-3 text-sm font-medium text-[#C9500E] group-hover:underline">Xem chi tiết khóa học</span>
                  <div className="mt-auto pt-5 flex items-center gap-5 text-xs text-[#486581]">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Layers className="w-3.5 h-3.5 shrink-0 text-[#002F5B]" />
                      <span className="truncate">{course.category}</span>
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-[#002F5B]" />
                      <span className="truncate">{course.duration}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dao-tao"
              className="inline-flex items-center gap-2 border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
            >
              Xem tất cả {courses.length} khóa học <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CONSULTING SOLUTIONS (collage left) */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            <img src={IMG.gemba} alt="Hiện trường nhà máy" className="w-full h-full object-cover row-span-2 aspect-[3/4]" loading="lazy" />
            <img src={IMG.workshop} alt="Workshop thực hành" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.floor} alt="Cải tiến tại chuyền" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight">
              Giải pháp tư vấn cho <span className="text-[#F76011]">mọi nhà máy</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#486581] leading-relaxed">
              Chuyên gia WISE cùng ban giám đốc xuống tận xưởng, quan sát từng công đoạn để chỉ rõ chỗ nào đang tốn thời
              gian, nhân lực và chi phí, rồi cùng đội ngũ nhà máy cải tiến cho đến khi có kết quả đo lường được.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {solutions.map((s) => (
                <li key={s} className="plus-item">
                  {s}
                </li>
              ))}
            </ul>
            <Link
              href="/dich-vu-tu-van"
              className="mt-8 inline-flex items-center gap-2 bg-[#002F5B] hover:bg-[#F76011] text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
            >
              Xem chi tiết giải pháp <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. METHODOLOGY (collage right) */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight">
              Phương pháp <span className="text-[#F76011]">RGPDCA</span>: 6 bước cải tiến rõ ràng
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#486581] leading-relaxed">
              Không mang đến những tập lý thuyết dày cộp. Mọi bước đi đều tập trung vào việc giúp công nhân làm việc dễ
              hơn, năng suất tăng lên và không làm gián đoạn kế hoạch giao hàng.
            </p>
            <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {rgpdcaSteps.map((step, i) => (
                <li key={step.name} className="plus-item">
                  <span>
                    <span className="text-[#F76011] mr-1">{String(i + 1).padStart(2, "0")}.</span> {step.name}
                    <span className="block text-xs font-normal text-[#486581] mt-0.5">{step.vn}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            <img src={IMG.classroom} alt="Đào tạo tại nhà máy" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.chart} alt="Đo lường kết quả" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.lineBalance} alt="Cân bằng chuyền" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.team} alt="Làm việc nhóm" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECT (image left) */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
            <img
              key={activeProject.id}
              src={activeProject.cover || activeProject.gallery?.[0] || IMG.kickoff}
              alt={activeProject.client}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight text-center lg:text-left">
              Dự án thực tế: <span className="text-[#F76011]">kết quả đo lường được</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              {featuredProjects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    activeProjectIdx === idx
                      ? "bg-[#002F5B] border-[#002F5B] text-white"
                      : "bg-white border-slate-300 text-[#486581] hover:border-[#002F5B]"
                  }`}
                >
                  {p.client}
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm sm:text-base text-[#486581] leading-relaxed">
              <strong className="text-[#102A43]">{activeProject.title}.</strong> {activeProject.highlight}
            </p>
            <ul className="mt-5">
              {activeProject.results.map((res) => (
                <li key={res.label} className="plus-item">
                  <span>
                    <span className="text-[#F76011] font-extrabold mr-1.5">{res.metric}</span>
                    {res.label}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/du-an"
              className="mt-8 inline-flex items-center gap-2 bg-[#002F5B] hover:bg-[#F76011] text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
            >
              Xem các dự án khác <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. STATS BAND */}
      <section className="bg-[#F8F9FA] border-y border-slate-200 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-[#002F5B]">{s.value}</div>
              <div className="mt-2 text-xs sm:text-sm text-[#486581]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. WHY WISE */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={IMG.why} alt="Workshop cùng WISE" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] text-center lg:text-left">Vì sao chọn WISE Academy?</h2>
            <ul className="mt-8 space-y-5">
              {whyWise.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#F76011] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#486581] leading-relaxed">
                    <strong className="text-[#102A43]">{item.title}:</strong> {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. EXPERTS */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <SectionBadge title="Đội ngũ chuyên gia" />
              <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight max-w-md">
                Kinh nghiệm thực tế, hiểu đời sống nhà xưởng
              </h2>
            </div>
            <Link
              href="/chuyen-gia"
              className="self-start sm:self-auto shrink-0 border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              Xem toàn bộ chuyên gia
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
            {experts.slice(0, 4).map((expert) => (
              <div key={expert.id} className="card-soft relative pt-14 pb-6 px-6 text-center">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-[#002F5B]">
                  {expert.image ? (
                    <img src={expert.image} alt={expert.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {expert.name.split(" ").pop()?.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[#002F5B]">{expert.name}</h3>
                <p className="mt-1 text-xs font-medium text-[#C9500E]">{expert.role}</p>
                <p className="mt-3 text-xs text-[#486581] leading-relaxed line-clamp-4">{expert.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. ARTICLES */}
      <section className="bg-[#F8F9FA] py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <SectionBadge title="Góc tri thức" />
              <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight max-w-md">
                Kinh nghiệm quản lý & tối ưu hiện trường
              </h2>
            </div>
            <Link
              href="/tri-thuc"
              className="self-start sm:self-auto shrink-0 border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              Xem tất cả bài viết ({articles.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((art) => (
              <Link key={art.id} href={`/tri-thuc/${art.slug || art.id}`} className="card-soft group overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-[#F1F4F8] overflow-hidden">
                  {art.thumbnail ? (
                    <img
                      src={art.thumbnail}
                      alt={art.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#002F5B]">
                      <BookOpen className="w-10 h-10 text-[#FF7A30]" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{art.category}</span>
                  <h3 className="mt-2 text-base font-semibold text-[#102A43] leading-snug line-clamp-2 group-hover:text-[#F76011] transition-colors">
                    {art.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#486581] line-clamp-2">{art.excerpt}</p>
                  <div className="mt-auto pt-5 flex items-center gap-5 text-xs text-[#486581]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#002F5B]" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#002F5B]" /> {art.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CONSULTATION FORM */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6" id="tu-van">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionBadge title="Đặt lịch tư vấn" />
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight">
              Bài toán của nhà máy là <span className="text-[#F76011]">điểm khởi đầu</span> của chúng tôi
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#486581] leading-relaxed">
              Chuyền sản xuất bị tắc nghẽn, hàng lỗi nhiều hay công nhân chưa tự giác? Để lại thông tin, chuyên gia WISE
              sẽ gọi lại trao đổi cụ thể trong vòng 24 giờ làm việc.
            </p>
            <div className="mt-8 space-y-5">
              <a href="tel:+84989002121" className="flex items-center gap-4 group">
                <span className="w-11 h-11 rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-xs text-[#486581]">Gọi trực tiếp</span>
                  <span className="block text-lg font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors">
                    0989 002 121 (Ms. Thủy)
                  </span>
                </span>
              </a>
              <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-4 group">
                <span className="w-11 h-11 rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-xs text-[#486581]">Email</span>
                  <span className="block text-base font-semibold text-[#002F5B] group-hover:text-[#F76011] transition-colors">
                    contact@wisedemy.com.vn
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="card-soft !transform-none p-7 sm:p-10">
              {formSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00BE62]/15 text-[#00BE62] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#002F5B]">Đã nhận yêu cầu thành công!</h3>
                  <p className="text-sm text-[#486581]">
                    Cảm ơn bạn. Chuyên gia tư vấn của WISE sẽ liên hệ lại qua điện thoại trong vòng 24 giờ làm việc.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} className="text-sm font-semibold text-[#F76011] hover:underline pt-2">
                    Gửi thêm yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#002F5B]">Đặt lịch tư vấn nhà máy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="h-name" className="block text-xs font-semibold text-[#102A43] mb-1.5">Họ và tên *</label>
                      <input
                        id="h-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="h-phone" className="block text-xs font-semibold text-[#102A43] mb-1.5">Số điện thoại *</label>
                      <input
                        id="h-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0989 xxx xxx"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="h-email" className="block text-xs font-semibold text-[#102A43] mb-1.5">Email doanh nghiệp *</label>
                      <input
                        id="h-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ten@congty.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="h-company" className="block text-xs font-semibold text-[#102A43] mb-1.5">Tên công ty / nhà máy</label>
                      <input
                        id="h-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Công ty ABC"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="h-need" className="block text-xs font-semibold text-[#102A43] mb-1.5">Nhu cầu cần hỗ trợ</label>
                    <select
                      id="h-need"
                      value={formData.need}
                      onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                      className={inputClass}
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
                    <label htmlFor="h-message" className="block text-xs font-semibold text-[#102A43] mb-1.5">Mô tả vấn đề hiện tại</label>
                    <textarea
                      id="h-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ví dụ: Công nhân hay bị ứ việc ở khâu đóng gói, thời gian đổi mẫu lâu..."
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu đặt lịch tư vấn
                  </button>
                  <p className="text-[11px] text-center text-[#486581]">Thông tin của bạn được cam kết bảo mật 100%.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
