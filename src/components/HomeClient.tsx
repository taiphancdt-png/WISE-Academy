"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Send,
  Calendar,
  BookOpen,
} from "@/components/icons";
import SectionBadge from "@/components/SectionBadge";
import PartnerLogos from "@/components/PartnerLogos";
import { LssiPartnerIntro } from "@/components/LssiPrograms";
import CountUp from "@/components/CountUp";
import Honeypot from "@/components/Honeypot";
import { submitLead } from "@/lib/submitLead";
import type { Project, Expert, Article } from "@/types";

// Only the fields the homepage renders; selected on the server in app/page.tsx to keep the client bundle small.
export type HomeProject = Pick<Project, "id" | "client" | "title" | "highlight" | "results" | "cover" | "gallery">;
export type HomeExpert = Pick<Expert, "id" | "name" | "image" | "role" | "bio">;
export type HomeArticle = Pick<Article, "id" | "slug" | "title" | "thumbnail" | "category" | "excerpt" | "date" | "readTime">;

export interface HomeProps {
  courseCount: number;
  featuredProjects: HomeProject[];
  experts: HomeExpert[];
  featuredArticles: HomeArticle[];
  articleCount: number;
}

const IMG = {
  hero: "/images/hero/home-factory.webp",
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
  "Khảo sát & tìm điểm nghẽn tại hiện trường",
  "Sắp xếp & tối ưu lại quy trình",
  "Nâng năng suất & cân bằng công việc",
  "Huấn luyện quản lý cấp trung & văn hóa Kaizen",
  "Thiết kế Lean Cell & Layout chữ U",
  "Rút ngắn thời gian đổi mã hàng (SMED)",
  "Quản lý trực quan & 5S hiện trường",
  "Lean 4.0 & vận hành số",
];

const rgpdcaSteps = [
  { name: "Khảo sát", vn: "Xuống tận hiện trường quan sát" },
  { name: "Mục tiêu", vn: "Định lượng kết quả cần đạt" },
  { name: "Kế hoạch", vn: "Lập kế hoạch từng tuần" },
  { name: "Làm thử", vn: "Thí điểm tại một khu vực trước" },
  { name: "Đo lường", vn: "So sánh kết quả trước / sau" },
  { name: "Giữ vững", vn: "Viết thành quy trình chuẩn" },
];

const whyWise = [
  {
    title: "Dễ làm & hiệu quả ngay (Workable)",
    desc: "Giải pháp đơn giản, thực tế, đội ngũ áp dụng được ngay tại nơi làm việc mà không cần công nghệ phức tạp.",
  },
  {
    title: "Cải tiến liên tục mỗi ngày (Improvement)",
    desc: "Tạo thói quen tốt cho nhân viên và quản lý: mỗi ngày sửa một điểm chưa tốt, gom lại thành bước nhảy vọt.",
  },
  {
    title: "Chia sẻ kinh nghiệm thật (Share)",
    desc: "Chuyên gia từng điều hành vận hành tại các tập đoàn lớn (Nike, Pou Chen) chia sẻ kinh nghiệm xử lý sự cố thực tế.",
  },
  {
    title: "Vận hành gọn gàng, tiết kiệm (Excellence)",
    desc: "Giảm lãng phí tiền bạc, nhân công và thời gian để tổ chức đạt hiệu quả cao nhất với chi phí thấp nhất.",
  },
];

const stats = [
  { value: "12,000+", label: "Cán bộ & quản lý được đào tạo" },
  { value: "30+", label: "Doanh nghiệp đối tác" },
  { value: "+38%", label: "Năng suất tăng sau 90 ngày" },
  { value: "-25%", label: "Thời gian chờ đợi & lãng phí" },
];

export default function HomeClient({
  courseCount,
  featuredProjects,
  experts,
  featuredArticles,
  articleCount,
}: HomeProps) {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [trap, setTrap] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    need: "Khảo sát & Tìm điểm nghẽn tại hiện trường",
    message: "",
  });

  const activeProject = featuredProjects[activeProjectIdx] || featuredProjects[0];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    const ok = await submitLead(
      "home",
      [
        { label: "Họ và tên", value: formData.name },
        { label: "Số điện thoại", value: formData.phone },
        { label: "Email", value: formData.email },
        { label: "Công ty", value: formData.company },
        { label: "Nhu cầu", value: formData.need },
        { label: "Mô tả vấn đề", value: formData.message },
      ],
      trap
    );
    setSending(false);
    if (ok) setFormSubmitted(true);
    else setFailed(true);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15 bg-white";

  return (
    <div>
      {/* 1. HERO: left-aligned copy over the photo, the scene stays visible on the right */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={IMG.hero} alt="Hiện trường vận hành doanh nghiệp" className="hero-zoom absolute inset-0 -z-20 w-full h-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#001E38]/95 via-[#002F5B]/80 to-[#002F5B]/25" />
        <div className="hero-enter max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pb-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
              Tối ưu vận hành, tăng năng suất, <span className="text-[#FF7A30]">tiết kiệm chi phí</span> bền vững.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
              Chúng tôi đào tạo, huấn luyện và cùng doanh nghiệp xuống tận hiện trường để loại bỏ lãng phí, nâng cao chất lượng
              và tối đa hóa năng suất.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/dao-tao"
                className="inline-flex items-center bg-[#F76011] hover:bg-[#C9500E] active:translate-y-px text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors"
              >
                Chương trình đào tạo
              </Link>
              <Link
                href="/dich-vu-tu-van"
                className="group inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base hover:text-[#FF7A30] transition-colors"
              >
                Tư vấn cho doanh nghiệp
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLIENT / PARTNER LOGOS */}
      <PartnerLogos />

      {/* 3. CONSULTING SOLUTIONS (collage left) */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            <img src={IMG.gemba} alt="Cải tiến tại hiện trường" className="w-full h-full object-cover row-span-2 aspect-[3/4]" loading="lazy" />
            <img src={IMG.workshop} alt="Workshop thực hành" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.floor} alt="Cải tiến quy trình" className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight">
              Nâng cao năng suất, chất lượng và <span className="text-[#F76011]">phát triển đội ngũ</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#486581] leading-relaxed">
              Từ nhà máy sản xuất, kho vận đến văn phòng dịch vụ, chuyên gia WISE Academy cùng ban lãnh đạo xuống tận hiện trường, quan sát
              từng bước để chỉ rõ chỗ nào đang tốn thời gian, nhân lực và chi phí, rồi cùng đội ngũ cải tiến cho đến khi có kết quả đo lường được.
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

      {/* 4. TRAINING PROGRAM (Lean Six Sigma) */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionBadge title="Đối tác ủy quyền của LSSI Global" />
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B]">Chương trình đào tạo Lean Six Sigma</h2>
            <p className="mt-3 text-sm sm:text-base text-[#486581]">
              Chương trình chứng nhận quốc tế của LSSI Global, từ Yellow Belt đến Master Black Belt, học theo 3 hình thức: self-paced, face to face và virtual live.
            </p>
          </div>

          <LssiPartnerIntro />

          <div className="text-center mt-12">
            <Link
              href="/dao-tao"
              className="inline-flex items-center gap-2 border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
            >
              Xem tất cả {courseCount} chương trình đào tạo <ArrowRight className="w-4 h-4" />
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
              Không mang đến những tập lý thuyết dày cộp. Mọi bước đi đều tập trung vào việc giúp đội ngũ làm việc dễ
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
            <img src={IMG.classroom} alt="Đào tạo tại doanh nghiệp" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.chart} alt="Đo lường kết quả" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <img src={IMG.lineBalance} alt="Cân bằng công việc tại hiện trường" className="w-full aspect-[4/3] object-cover" loading="lazy" />
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
              <div className="text-3xl sm:text-4xl font-bold text-[#002F5B]">
                <CountUp value={s.value} />
              </div>
              <div className="mt-2 text-xs sm:text-sm text-[#486581]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. WHY WISE */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={IMG.why} alt="Workshop cùng WISE Academy" className="w-full h-full object-cover" loading="lazy" />
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
              <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight max-w-md">
                Kinh nghiệm thực tế, hiểu rõ hiện trường vận hành
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
            {experts.map((expert) => (
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
              <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight max-w-md">
                Kinh nghiệm quản lý & tối ưu hiện trường
              </h2>
            </div>
            <Link
              href="/tri-thuc"
              className="self-start sm:self-auto shrink-0 border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              Xem tất cả bài viết ({articleCount})
            </Link>
          </div>

          {/* One featured article on the left, the next two stacked on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-8">
            {featuredArticles.map((art, i) => {
              const featured = i === 0;
              return (
                <Link
                  key={art.id}
                  href={`/tri-thuc/${art.slug || art.id}`}
                  className={`card-soft group overflow-hidden flex ${featured ? "flex-col lg:row-span-2" : "flex-col sm:flex-row"}`}
                >
                  <div className={`bg-[#F1F4F8] overflow-hidden shrink-0 ${featured ? "aspect-[16/10]" : "aspect-[4/3] sm:aspect-auto sm:w-44 lg:w-48"}`}>
                    {art.thumbnail ? (
                      <img
                        src={art.thumbnail}
                        alt={art.title}
                        className={`w-full h-full ${featured ? "object-contain" : "object-cover"} group-hover:scale-[1.03] transition-transform duration-500`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-32 flex items-center justify-center bg-[#002F5B]">
                        <BookOpen className="w-10 h-10 text-[#FF7A30]" />
                      </div>
                    )}
                  </div>
                  <div className={`flex flex-col flex-grow ${featured ? "p-7" : "p-5"}`}>
                    <span className="text-xs font-semibold text-[#C9500E]">{art.category}</span>
                    <h3
                      className={`mt-2 font-semibold text-[#102A43] leading-snug group-hover:text-[#C9500E] transition-colors ${
                        featured ? "text-xl sm:text-2xl line-clamp-3" : "text-base line-clamp-2"
                      }`}
                    >
                      {art.title}
                    </h3>
                    <p className={`mt-2 text-sm text-[#486581] ${featured ? "line-clamp-3" : "line-clamp-2"}`}>{art.excerpt}</p>
                    <div className="mt-auto pt-4 flex items-center gap-5 text-xs text-[#486581]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#002F5B]" /> {art.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#002F5B]" /> {art.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. CONSULTATION FORM */}
      <section className="bg-white py-16 lg:py-24 px-4 sm:px-6" id="tu-van">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-[34px] font-semibold text-[#002F5B] leading-tight">
              Bài toán của doanh nghiệp là <span className="text-[#F76011]">điểm khởi đầu</span> của chúng tôi
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#486581] leading-relaxed">
              Quy trình tắc nghẽn, lỗi lặp lại hay đội ngũ chưa chủ động cải tiến? Để lại thông tin, chuyên gia WISE Academy
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
                    Cảm ơn bạn. Chuyên gia tư vấn của WISE Academy sẽ liên hệ lại qua điện thoại trong vòng 24 giờ làm việc.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} className="text-sm font-semibold text-[#F76011] hover:underline pt-2">
                    Gửi thêm yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="relative space-y-4">
                  <Honeypot value={trap} onChange={setTrap} />
                  <h3 className="text-xl font-semibold text-[#002F5B]">Đặt lịch tư vấn cho doanh nghiệp</h3>
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
                      <label htmlFor="h-company" className="block text-xs font-semibold text-[#102A43] mb-1.5">Tên doanh nghiệp / tổ chức</label>
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
                      <option value="Khảo sát & Tìm điểm nghẽn tại hiện trường">Khảo sát & Tìm điểm nghẽn trực tiếp tại hiện trường</option>
                      <option value="Tăng năng suất quy trình / dây chuyền">Tăng năng suất quy trình / dây chuyền</option>
                      <option value="5S & quản lý trực quan nơi làm việc">5S & quản lý trực quan nơi làm việc</option>
                      <option value="Đào tạo kỹ năng cho quản lý cấp trung">Đào tạo kỹ năng cho quản lý cấp trung</option>
                      <option value="Giảm tỷ lệ lỗi, phế phẩm">Giảm tỷ lệ lỗi, phế phẩm</option>
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
                      placeholder="Ví dụ: Công việc hay bị ứ đọng ở một khâu, thời gian xử lý đơn hàng kéo dài, lỗi lặp lại..."
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 rounded-full bg-[#F76011] hover:bg-[#C9500E] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Đang gửi…" : "Gửi yêu cầu đặt lịch tư vấn"}
                  </button>
                  {failed && (
                    <p className="text-sm text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg px-4 py-3" role="alert">
                      Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline{" "}
                      <a href="tel:+84989002121" className="font-semibold underline">0989 002 121</a>.
                    </p>
                  )}
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
