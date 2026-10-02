import React from "react";
import { ArrowUpRight, Award, Clock, Laptop, MonitorPlay, Users } from "lucide-react";
import { CSSC_LISTING, LSSI_HOME, LSSI_PROGRAMS } from "@/data/lssi-programs";

// The three ways every LSSI program can be taken.
const FORMATS = [
  { name: "Self-paced", icon: Laptop, desc: "Tự học trực tuyến trên nền tảng của LSSI, chủ động thời gian và tiến độ." },
  { name: "Face to face", icon: Users, desc: "Học trực tiếp cùng giảng viên tại lớp hoặc tại nhà máy (in-house), thực hành trên dữ liệu thật." },
  { name: "Virtual live", icon: MonitorPlay, desc: "Lớp trực tuyến theo lịch cùng giảng viên, tương tác và trao đổi trực tiếp qua video." },
];

export function LssiFormats() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#002F5B]">3 hình thức học cho mỗi chương trình</h3>
      <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FORMATS.map(({ name, icon: Icon, desc }) => (
          <li key={name} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
            <span className="w-10 h-10 rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#102A43]">{name}</span>
              <span className="block mt-0.5 text-sm text-[#486581] leading-relaxed">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// WISE × LSSI partnership intro with the LSSI logo.
export function LssiPartnerIntro() {
  return (
    <div className="card-soft !transform-none px-6 py-7 sm:px-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <div className="shrink-0 flex items-center gap-5">
        <a href={LSSI_HOME} target="_blank" rel="noopener noreferrer" aria-label="Lean Six Sigma Institute (LSSI Global)">
          <img src="/images/brand/lssi-logo.png" alt="Lean Six Sigma Institute (LSSI) logo" width={800} height={323} className="h-14 sm:h-16 w-auto" />
        </a>
        <a href={CSSC_LISTING} target="_blank" rel="noopener noreferrer" aria-label="LSSI trong danh sách đơn vị đào tạo được CSSC công nhận">
          <img src="/images/lssi/cssc.webp" alt="Council for Six Sigma Certification (CSSC)" width={299} height={300} className="h-16 sm:h-20 w-auto" />
        </a>
      </div>
      <div className="hidden md:block w-px self-stretch bg-slate-200" />
      <div className="text-sm sm:text-base text-[#486581] leading-relaxed text-center md:text-left space-y-2">
        <p>
          <strong className="text-[#002F5B]">WISE Academy là đối tác được ủy quyền (Authorized Partner) của Lean Six Sigma Institute – LSSI Global</strong>{" "}
          tại Việt Nam và châu Á. Học viên được đào tạo theo giáo trình chuẩn quốc tế của LSSI, với đội ngũ giảng viên WISE đồng hành và kèm cặp dự án
          thực tế tại nhà máy.
        </p>
        <p>
          LSSI là <strong className="text-[#002F5B]">đơn vị đào tạo chính thức được công nhận bởi CSSC</strong> (The Council for Six Sigma
          Certification) — tổ chức thiết lập chuẩn chứng nhận Six Sigma quốc tế — nên chứng nhận Lean Six Sigma của học viên có giá trị toàn cầu.
        </p>
      </div>
    </div>
  );
}

// LSSI certification programs (highest level first); each card opens the official program page on leansixsigmainstitute.org.
export function LssiProgramGrid() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {LSSI_PROGRAMS.map((p) => (
        <li key={p.id}>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="card-soft group h-full overflow-hidden flex flex-col">
            <div className="aspect-[8/5] bg-[#F1F4F8] overflow-hidden border-t-4" style={{ borderColor: p.color }}>
              <img
                src={p.image}
                alt={p.title}
                width={800}
                height={500}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-[#002F5B] leading-snug group-hover:text-[#C9500E] transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-2">{p.tagline}</p>
              <p className="mt-auto pt-5 flex items-center gap-1.5 text-xs text-[#486581]">
                <Clock className="w-3.5 h-3.5 text-[#002F5B] shrink-0" />
                {p.duration}
                {p.id.endsWith("bundle") && <span className="text-slate-300">·</span>}
                {p.id.endsWith("bundle") && <span>{p.includes.length} cấp độ</span>}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C9500E]">
                Xem chi tiết tại LSSI <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

const INCLUDED = [
  "Tài liệu khóa học đầy đủ",
  "Case study và ví dụ thực tế",
  "Bài tập thực hành và dự án",
  "Kèm cặp dự án để đạt chứng nhận",
  "2 lượt thi chứng nhận cho mỗi cấp độ",
  "Chứng nhận quốc tế LSSI & CSSC, giá trị trọn đời",
  "Truy cập không giới hạn nền tảng học trực tuyến",
];

// Benefits common to every LSSI program.
export function LssiIncluded() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-[#002F5B] flex items-center gap-2">
        <Award className="w-5 h-5 text-[#F76011]" /> Quyền lợi chung của mọi chương trình
      </h3>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {INCLUDED.map((item) => (
          <li key={item} className="plus-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Key message: best pricing for Vietnam & Asia through WISE.
export function LssiPricingCta({ href = "#dang-ky-lssi" }: { href?: string }) {
  return (
    <div className="rounded-2xl bg-[#002F5B] text-white px-6 py-8 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div>
        <p className="text-xl sm:text-2xl font-semibold leading-snug">
          Liên hệ WISE Academy để có <span className="text-[#FF7A30]">chính sách chi phí ưu đãi nhất</span> cho thị trường Việt Nam và châu Á
        </p>
        <p className="mt-2 text-sm text-white/80">Ưu đãi cho cá nhân, nhóm và đào tạo in-house theo doanh nghiệp.</p>
        <p className="mt-3 text-sm text-white">
          <strong className="text-[#FF7A30]">Đặc biệt:</strong> Bạn đã có chứng nhận một cấp độ và muốn học lên cấp cao hơn? Liên hệ WISE Academy
          để được tư vấn lộ trình nâng cấp phù hợp.
        </p>
      </div>
      <a
        href={href}
        className="shrink-0 inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
      >
        Nhận thông tin ưu đãi
      </a>
    </div>
  );
}
