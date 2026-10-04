import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/ui";
import ExpertActionBar from "@/components/ExpertActionBar";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from "@/components/icons";
import expertsData from "@/data/experts.json";
import projectsData from "@/data/projects.json";
import type { Expert, Project } from "@/types";

const experts = expertsData as Expert[];
const projects = projectsData as Project[];

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = experts.find((e) => e.id === id);
  if (!exp) return {};
  return {
    title: `${exp.name} | Chuyên gia WISE Academy`,
    description: exp.bio,
    alternates: { canonical: `/chuyen-gia/${exp.id}` },
  };
}

// One section of the profile body: a sticky left rail with an outlined number and the section name.
function Rail({
  no,
  label,
  id,
  photo,
  below,
  children,
}: {
  no: string;
  label: string;
  id?: string;
  photo?: { src: string; caption: string };
  below?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-4 sm:px-8 xl:px-12 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 lg:gap-12 py-14 lg:py-20 border-t border-[#002F5B]/10 first:border-t-0">
        <div className="lg:sticky lg:top-28 self-start">
          <span
            className="block text-5xl font-extrabold leading-none"
            style={{ color: "transparent", WebkitTextStroke: "1.2px #F76011" }}
          >
            {no}
          </span>
          <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#002F5B]">
            {label}
          </h2>
        </div>
        {photo ? (
          // a landscape photo of the expert at work beside the content, keeping the section in one piece
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] gap-10 items-start">
            <div>{children}</div>
            <figure>
              <div className="overflow-hidden rounded-3xl aspect-[4/3] bg-slate-100 shadow-[0_30px_60px_-35px_rgba(0,47,91,0.55)]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex gap-2 text-xs text-[#486581] leading-snug">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-px w-5 shrink-0 bg-[#F76011]"
                />
                {photo.caption}
              </figcaption>
            </figure>
            {below && <div className="md:col-span-2">{below}</div>}
          </div>
        ) : (
          <div>
            {children}
            {below}
          </div>
        )}
      </div>
    </section>
  );
}

// The cut-out portrait ends in a soft wave instead of a straight or faded edge (two gentle crests).
const WAVE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0H100V90C88 84 76 84 63 90S38 97 25 91 6 86 0 89Z'/%3E%3C/svg%3E\")";
const WAVE_MASK: React.CSSProperties = {
  WebkitMaskImage: WAVE_SVG,
  maskImage: WAVE_SVG,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
};

// order of the themed columns of further training
const GROUP_ORDER = [
  "Lean Six Sigma",
  "Lean & Năng suất",
  "Đào tạo & Coaching",
  "Bền vững & Số hóa",
  "An toàn & Số hóa",
  "Khác",
];

// Projects whose client is named in the expert's bio (e.g. "Pou Chen", "Geodis", "Samho").
function relatedProjects(exp: Expert) {
  const bio = exp.bio.toLowerCase();
  const seen = new Set<string>();
  return projects
    .filter((p) => {
      const name = p.client.toLowerCase();
      const keys = [name, name.split(" ")[0], name.replace("an giang ", "")];
      const hit = keys.some((k) => k.length > 2 && bio.includes(k));
      if (!hit || seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .slice(0, 3);
}

// One landing page per expert: photo and credentials, their story, strengths, projects and other experts.
export default async function ExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = experts.find((e) => e.id === id);
  if (!exp) notFound();

  const credentials = exp.title
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);
  const related = relatedProjects(exp);
  const others = experts
    .filter((e) => e.id !== exp.id && e.group === exp.group)
    .slice(0, 3);
  const initial = exp.name.split(" ").pop()?.charAt(0);
  // name with the given name (and nickname) highlighted, e.g. "Nguyễn Thị" + "Thủy (Kate)"
  const words = exp.name.split(" ");
  const cut = exp.name.includes("(") ? words.length - 2 : words.length - 1;
  const firstPart = words.slice(0, cut).join(" ");
  const lastPart = words.slice(cut).join(" ");
  // the first sentence of the bio as a short lead
  const lead = exp.bio.split(/(?<=\.)\s/)[0];
  const rest = exp.bio.slice(lead.length).trim();
  // training beyond the six core credentials, listed by theme
  const coreCerts = exp.certifications?.filter((c) => c.core) ?? [];
  const moreCerts = exp.certifications?.filter((c) => !c.core) ?? [];

  // education, languages and international experience run full width under the intro and its photo
  const introBelow = (
    <>
      {(exp.education || exp.languages) && (
        <div className="mt-10 pt-8 border-t border-[#002F5B]/10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {exp.education && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">
                Học vấn
              </p>
              <ul className="mt-4 space-y-4">
                {exp.education.map((e) => (
                  <li
                    key={e.degree}
                    className="pl-4 border-l-2 border-[#F76011]"
                  >
                    <p className="font-semibold text-[#002F5B]">{e.degree}</p>
                    <p className="mt-0.5 text-sm text-[#486581]">{e.school}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {exp.languages && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">
                Ngoại ngữ
              </p>
              <p className="mt-4 pl-4 border-l-2 border-[#F76011] text-[15px] text-[#102A43] leading-relaxed">
                {exp.languages}
              </p>
            </div>
          )}
        </div>
      )}
      {exp.regions && (
        <div className="mt-10 pt-8 border-t border-[#002F5B]/10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">
            Kinh nghiệm quốc tế
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
            {exp.regions.map((r) => (
              <li key={r.country} className="py-3 border-b border-[#002F5B]/10">
                <p className="text-sm font-bold text-[#002F5B]">{r.country}</p>
                <p className="mt-0.5 text-xs text-[#486581] leading-relaxed">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    // data-no-reveal: the whole profile is shown at once, without the site-wide fade-in on scroll
    <div className="bg-[#F8F9FA]" data-no-reveal>
      {/* Hero: light and playful; copy on the left, an arch portrait with floating stat cards on the right */}
      <section className="relative isolate overflow-hidden bg-[#FFF7F0]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(#F7601126_1.2px,transparent_1.2px)] [background-size:22px_22px]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-40 -z-10 w-[520px] h-[520px] rounded-full bg-[#FFD9BF] blur-3xl opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 -z-10 w-[460px] h-[460px] rounded-full bg-[#CFE2F5] blur-3xl opacity-70"
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 pt-12 lg:pt-16 pb-16 lg:pb-24">
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-14 lg:gap-12 items-center lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#002F5B] px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white">
                <span className="w-2 h-2 rounded-full bg-[#F76011] animate-pulse" />
                {exp.role}
              </span>
              <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#002F5B]">
                {firstPart}{" "}
                <span className="bg-gradient-to-r from-[#F76011] to-[#FF9F43] bg-clip-text text-transparent">
                  {lastPart}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#486581]">
                {lead}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {credentials.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-[#002F5B] shadow-[0_8px_20px_-14px_rgba(0,47,91,0.5)] ring-1 ring-[#002F5B]/[0.08]"
                  >
                    <CheckCircle2
                      weight="fill"
                      className="w-4 h-4 shrink-0 text-[#F76011]"
                    />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F76011] hover:bg-[#C9500E] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(247,96,17,0.7)] transition"
                >
                  <Calendar className="w-4 h-4" /> Đặt lịch tư vấn với chuyên
                  gia
                </Link>
                {exp.career && (
                  <a
                    href="#qua-trinh"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-[#002F5B] hover:text-[#C9500E] transition-colors"
                  >
                    Xem hành trình <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] aspect-square">
              {/* an organic blob instead of a frame: soft blue fill, an offset orange outline and a few sparks */}
              <svg
                viewBox="0 0 400 400"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full overflow-visible origin-bottom translate-y-[3%] scale-[1.2]"
              >
                <defs>
                  <linearGradient id="blobFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E3EFFB" />
                    <stop offset="100%" stopColor="#B9D5F0" />
                  </linearGradient>
                </defs>
                <path
                  d="M300 70c44 22 78 70 74 128-3 44-34 66-38 108-5 48-58 82-112 78-46-3-70-30-118-40-52-11-80-58-74-110 5-46 40-62 46-106 7-52 48-86 104-88 46-2 76 8 118 30Z"
                  fill="url(#blobFill)"
                />
                <path
                  d="M330 110c30 40 34 100 8 146-26 46-82 78-140 76-58-2-118-38-140-90S54 128 96 92s104-52 154-44 50 22 80 62Z"
                  fill="none"
                  stroke="#F76011"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="2 12"
                  className="origin-center spin-slow"
                  style={{ transformBox: "fill-box" }}
                />
                <circle cx="70" cy="96" r="9" fill="#F76011" />
                <circle cx="350" cy="300" r="6" fill="#002F5B" />
                <circle cx="330" cy="70" r="4" fill="#FF9F43" />
                <path
                  d="M52 250l6 14 14 6-14 6-6 14-6-14-14-6 14-6z"
                  fill="#FF9F43"
                />
              </svg>
              {/* cut-out portrait, its lower edge fading into the page */}
              {exp.cutout ? (
                <img
                  src={exp.cutout}
                  alt={exp.name}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[104%] max-w-none  drop-shadow-[0_18px_30px_rgba(0,30,56,0.18)]"
                 style={WAVE_MASK} />
              ) : (
                <div className="absolute inset-[12%] rounded-full overflow-hidden bg-[#B9D5F0]">
                  {exp.image ? (
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-7xl font-bold text-[#002F5B]">
                      {initial}
                    </span>
                  )}
                </div>
              )}
              {/* floating stat cards: kept clear of the face (top card above the forehead line, bottom card below the chin); hidden on phones, where the stats strip shows the same figures */}
              {exp.highlights?.[0] && (
                <div className="float-y absolute hidden sm:block -left-4 sm:-left-8 -top-[3%] max-w-[10.5rem] rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,47,91,0.5)] ring-1 ring-[#002F5B]/[0.06]">
                  <p className="text-2xl font-extrabold text-[#F76011] leading-none">
                    {exp.highlights[0].value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#486581]">
                    {exp.highlights[0].label}
                  </p>
                </div>
              )}
              {exp.highlights?.[3] && (
                <div className="float-y-slow absolute hidden sm:block -right-2 sm:-right-6 bottom-[22%] max-w-[10.5rem] rounded-2xl bg-[#002F5B] px-4 py-3 text-white shadow-[0_18px_40px_-18px_rgba(0,30,56,0.7)]">
                  <p className="text-2xl font-extrabold leading-none">
                    {exp.highlights[3].value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-white/75">
                    {exp.highlights[3].label}
                  </p>
                </div>
              )}
              <span className="absolute left-1/2 bottom-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#002F5B] shadow-md ring-1 ring-[#002F5B]/10">
                WISE Academy Expert
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key numbers: an editorial strip, big figures between hairlines */}
      {exp.highlights && (
        <section className="bg-white border-y border-[#002F5B]/10 px-4 sm:px-8 xl:px-12">
          <dl className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {exp.highlights.map((h, i) => {
              const plus = h.value.endsWith("+");
              const num = plus ? h.value.slice(0, -1) : h.value;
              return (
                <div
                  key={h.label}
                  className={`py-8 px-4 ${i % 2 ? "border-l" : "sm:border-l"} ${i === 0 ? "sm:border-l-0" : ""} border-[#002F5B]/10`}
                >
                  <dd className="text-3xl lg:text-[34px] font-extrabold tracking-tight text-[#002F5B] leading-none">
                    {num}
                    {plus && <span className="text-[#F76011]">+</span>}
                  </dd>
                  <dt className="mt-3 text-xs uppercase tracking-[0.12em] text-[#486581] leading-snug">
                    {h.label}
                  </dt>
                </div>
              );
            })}
          </dl>
        </section>
      )}

      {/* Profile body: a numbered left rail with the section name, content on the right (consulting-firm bio style) */}
      <div className="bg-white">
        <Rail
          no="01"
          label="Giới thiệu"
          photo={exp.photos?.[0]}
          below={introBelow}
        >
          {/* the hero already shows the first sentence of the bio; here the rest, set large */}
          <p className="text-2xl sm:text-[30px] leading-[1.4] font-medium tracking-tight text-[#002F5B]">
            {rest || exp.bio}
          </p>
          <p className="mt-8 text-sm text-[#486581]">
            {exp.tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="mx-2 text-[#F76011]">/</span>}
                <span className="font-semibold text-[#002F5B]">{t}</span>
              </span>
            ))}
          </p>
        </Rail>

        {exp.certifications && (
          <Rail no="02" label="Chứng nhận & đào tạo">
            {/* the core credentials, large; the rest as a compact list of further training */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] border-t border-l border-[#002F5B]/10"
              style={{ "--n": coreCerts.length } as React.CSSProperties}>
              {coreCerts.map((c, i) => (
                <li
                  key={`${c.name}-${c.org}`}
                  className="relative p-5 xl:p-6 border-r border-b border-[#002F5B]/10 group"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-0.5 w-0 bg-[#F76011] transition-all duration-500 group-hover:w-full"
                  />
                  <span className="text-xs font-bold tabular-nums text-[#F76011]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-base xl:text-[17px] font-bold leading-snug text-[#002F5B]">
                    {c.name}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#486581]">
                    {c.org}
                  </p>
                </li>
              ))}
            </ul>
            {moreCerts.length > 0 && (
              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">
                  Các khóa đào tạo chuyên sâu khác
                </p>
                {/* further training grouped by theme, in tidy columns */}
                <div
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:[grid-template-columns:repeat(var(--g),minmax(0,1fr))] gap-x-10 gap-y-8"
                  style={{ "--g": new Set(moreCerts.map((c) => c.group || "Khác")).size } as React.CSSProperties}
                >
                  {Array.from(new Set(moreCerts.map((c) => c.group || "Khác")))
                    .sort(
                      (a, b) => GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b),
                    )
                    .map((g) => (
                      <div key={g}>
                        <h3 className="pb-3 border-b-2 border-[#002F5B] text-sm font-bold text-[#002F5B]">
                          {g}
                        </h3>
                        <ul>
                          {moreCerts
                            .filter((c) => (c.group || "Khác") === g)
                            .map((c) => (
                              <li
                                key={`${c.name}-${c.org}`}
                                className="py-3 border-b border-[#002F5B]/10"
                              >
                                <p className="text-sm font-semibold text-[#102A43] leading-snug">
                                  {c.name}
                                </p>
                                <p className="mt-0.5 text-xs text-[#486581]">
                                  {c.org}
                                </p>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Rail>
        )}

        {exp.expertise && (
          <Rail no="03" label="Thế mạnh chuyên môn" photo={exp.photos?.[1]}>
            <ol
              className={`grid grid-cols-1 ${exp.photos?.[1] ? "" : "md:grid-cols-2"} gap-x-12 border-t border-[#002F5B]/10`}
            >
              {exp.expertise.map((t, i) => (
                <li
                  key={t}
                  className="group flex gap-5 py-5 border-b border-[#002F5B]/10"
                >
                  <span className="shrink-0 w-8 text-sm font-bold tabular-nums text-[#F76011]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-relaxed text-[#102A43] group-hover:text-[#002F5B] transition-colors">
                    {t}
                  </span>
                </li>
              ))}
            </ol>
          </Rail>
        )}

        {exp.career && (
          <Rail
            no="04"
            label="Quá trình công tác"
            id="qua-trinh"
            photo={exp.photos?.[2]}
          >
            <ol className="border-t border-[#002F5B]/10">
              {exp.career.map((c, i) => (
                <li
                  key={`${c.period}-${c.org}`}
                  className="grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-2 sm:gap-8 py-7 border-b border-[#002F5B]/10"
                >
                  <span
                    className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-none whitespace-nowrap"
                    style={
                      i === 0
                        ? { color: "#F76011" }
                        : {
                            color: "transparent",
                            WebkitTextStroke: "1.2px #002F5B",
                          }
                    }
                  >
                    {c.period}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[#002F5B]">
                      {c.org}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-[#486581] leading-relaxed">
                      {c.role}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Rail>
        )}

        {exp.experience && (
          <Rail no="05" label="Dự án tiêu biểu">
            <ul className="border-t border-[#002F5B]/10">
              {exp.experience.map((e) => (
                <li
                  key={`${e.client}-${e.period}`}
                  className="group grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-2 md:gap-10 py-6 border-b border-[#002F5B]/10"
                >
                  <div>
                    <h3 className="font-bold text-[#002F5B] group-hover:text-[#C9500E] transition-colors">
                      {e.client}
                    </h3>
                    {e.period && (
                      <p className="mt-0.5 text-xs font-semibold text-[#C9500E]">
                        {e.period}
                      </p>
                    )}
                  </div>
                  <p className="text-[15px] text-[#486581] leading-relaxed">
                    {e.text}
                  </p>
                </li>
              ))}
            </ul>
          </Rail>
        )}
      </div>

      {/* What clients say (quotes translated from the trainer profiles) */}
      {exp.testimonials && exp.testimonials.length > 0 && (
        <section className="relative isolate overflow-hidden bg-[#002F5B] text-white px-4 sm:px-8 xl:px-12 py-16 lg:py-24">
          <div aria-hidden="true" className="absolute -left-32 -top-32 -z-10 w-[460px] h-[460px] rounded-full bg-[#F76011]/15 blur-3xl" />
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFB27A]">Khách hàng nói gì</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold">Đối tác đánh giá về {exp.name.split(" (")[0]}</h2>
            <div className="mt-10 columns-1 md:columns-2 xl:columns-3 gap-6">
              {exp.testimonials.map((t) => (
                <figure key={t.name} className="mb-6 break-inside-avoid rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <span aria-hidden="true" className="block text-5xl leading-none font-serif text-[#F76011]">&ldquo;</span>
                  <blockquote className="mt-1 text-[15px] leading-relaxed text-white/90">{t.quote}</blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-white/10">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-white/60">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects with the companies named in the bio */}
      {related.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-8 xl:px-12 bg-white">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">
              Dự án tiêu biểu đã đồng hành
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/du-an#${p.id}`}
                  className="group card-soft overflow-hidden flex flex-col"
                >
                  {p.cover && (
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={p.cover}
                        alt={p.client}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">
                      {p.client}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-[#002F5B] leading-snug">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other experts */}
      {others.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-8 xl:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">
                Chuyên gia khác
              </h2>
              <Link
                href="/chuyen-gia"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9500E] hover:text-[#F76011]"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((o) => (
                <Link
                  key={o.id}
                  href={`/chuyen-gia/${o.id}`}
                  className="group card-soft flex items-center gap-4 p-5"
                >
                  <span className="w-16 h-16 shrink-0 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow">
                    {o.image && (
                      <img
                        src={o.image}
                        alt={o.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    )}
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C9500E] leading-snug">
                      {o.role}
                    </span>
                    <span className="mt-1 block font-semibold text-[#002F5B] group-hover:text-[#F76011] transition-colors">
                      {o.name}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* always at hand while reading the profile: back to the list, or book a session */}
      <ExpertActionBar
        bookHref={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
      />

      <CtaBand
        title={<>Làm việc trực tiếp cùng {exp.name}</>}
        description="Chia sẻ bài toán vận hành của doanh nghiệp, WISE Academy sẽ sắp xếp buổi trao đổi với chuyên gia phù hợp."
        href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
      />
    </div>
  );
}
