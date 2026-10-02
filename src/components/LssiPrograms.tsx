import React from "react";
import { ArrowUpRight, Award, CheckCircle2, Clock, Download, Laptop, MonitorPlay, Users } from "lucide-react";
import { CSSC_LISTING, LSSI_HOME, LSSI_PROGRAMS } from "@/data/lssi-programs";

// The three ways every LSSI program can be taken.
const FORMATS = [
  { name: "Self-paced", icon: Laptop, desc: "Tự học trực tuyến, chủ động thời gian." },
  { name: "Face to face", icon: Users, desc: "Học trực tiếp tại lớp hoặc in-house tại doanh nghiệp." },
  { name: "Virtual live", icon: MonitorPlay, desc: "Lớp trực tuyến theo lịch cùng giảng viên." },
];

const TRUST_POINTS = [
  "Đối tác ủy quyền chính thức (Authorized Partner) tại Việt Nam & châu Á",
  "LSSI là đơn vị đào tạo được CSSC công nhận",
  "Chứng nhận Lean Six Sigma quốc tế, giá trị trọn đời",
];

// Highlighted WISE × LSSI partnership band: message, trust points, logos and the three learning formats.
export function LssiPartnerIntro() {
  return (
    <div className="rounded-3xl overflow-hidden bg-[#002F5B] text-white shadow-[0_20px_50px_-15px_rgba(0,30,56,0.45)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-7 sm:p-10 lg:p-12 items-center">
        <div className="lg:col-span-7">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF7A30]">Đối tác ủy quyền</span>
          <h3 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-semibold leading-tight">
            WISE Academy <span className="text-[#FF7A30]">×</span> LSSI Global
          </h3>
          <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
            Học theo giáo trình chuẩn quốc tế của Lean Six Sigma Institute, cùng giảng viên WISE đồng hành và kèm cặp dự án thực tế tại doanh nghiệp.
          </p>
          <ul className="mt-6 space-y-3">
            {TRUST_POINTS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-[#FF7A30] shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              <a href={LSSI_HOME} target="_blank" rel="noopener noreferrer" aria-label="Lean Six Sigma Institute (LSSI Global)">
                <img src="/images/brand/lssi-logo.png" alt="Lean Six Sigma Institute (LSSI) logo" width={800} height={323} className="h-14 sm:h-16 w-auto" />
              </a>
              <span className="w-px h-16 bg-slate-200" />
              <a href={CSSC_LISTING} target="_blank" rel="noopener noreferrer" aria-label="LSSI trong danh sách đơn vị đào tạo được CSSC công nhận">
                <img src="/images/lssi/cssc.webp" alt="Council for Six Sigma Certification (CSSC)" width={299} height={300} className="h-20 sm:h-24 w-auto" />
              </a>
            </div>
            <p className="mt-5 text-xs sm:text-sm text-[#486581] leading-relaxed">
              Chứng nhận do <strong className="text-[#002F5B]">LSSI</strong> và <strong className="text-[#002F5B]">CSSC</strong> (The Council for Six
              Sigma Certification) đồng cấp, được công nhận toàn cầu.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#00264A] px-7 sm:px-10 lg:px-12 py-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">3 hình thức học cho mỗi chương trình</p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FORMATS.map(({ name, icon: Icon, desc }) => (
            <li key={name} className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-[#F76011] text-white flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm sm:text-base font-semibold">{name}</span>
                <span className="block text-xs sm:text-sm text-white/70">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// LSSI certification programs (highest level first); each card opens the official program page on leansixsigmainstitute.org.
export function LssiProgramGrid() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {LSSI_PROGRAMS.map((p) => (
        <li key={p.id} className="card-soft group h-full overflow-hidden flex flex-col">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow">
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
            <div className="p-6 pb-0 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-[#002F5B] leading-snug group-hover:text-[#C9500E] transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-2">{p.tagline}</p>
              <p className="mt-auto pt-5 flex items-center gap-1.5 text-xs text-[#486581]">
                <Clock className="w-3.5 h-3.5 text-[#002F5B] shrink-0" />
                {p.duration}
                {p.id.endsWith("bundle") && <span className="text-slate-300">·</span>}
                {p.id.endsWith("bundle") && <span>{p.includes.length} cấp độ</span>}
              </p>
            </div>
          </a>
          <div className="p-6 pt-4 flex items-center justify-between gap-3">
            <a
              href={`/brochures/${p.id}.pdf`}
              download={`WISE-Academy-${p.id}-brochure.pdf`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#002F5B] hover:bg-[#073866] text-white text-xs font-semibold px-4 py-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Tải brochure
            </a>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9500E] hover:underline">
              Chi tiết tại LSSI <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
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
    <div className="rounded-2xl bg-[#FFF5EC] border border-[#F76011]/25 px-6 py-8 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div>
        <p className="text-xl sm:text-2xl font-semibold leading-snug text-[#002F5B]">
          Liên hệ WISE Academy để có <span className="text-[#C9500E]">chính sách chi phí ưu đãi nhất</span> cho thị trường Việt Nam và châu Á
        </p>
        <p className="mt-2 text-sm text-[#486581]">Ưu đãi cho cá nhân, nhóm và đào tạo in-house theo doanh nghiệp.</p>
        <p className="mt-3 text-sm text-[#102A43]">
          <strong className="text-[#C9500E]">Đặc biệt:</strong> Bạn đã có chứng nhận một cấp độ và muốn học lên cấp cao hơn? Liên hệ WISE Academy
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
