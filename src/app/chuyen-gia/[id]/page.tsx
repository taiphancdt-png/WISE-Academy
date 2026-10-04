import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/ui";
import ExpertActionBar from "@/components/ExpertActionBar";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2 } from "@/components/icons";
import expertsData from "@/data/experts.json";
import projectsData from "@/data/projects.json";
import type { Expert, Project } from "@/types";

const experts = expertsData as Expert[];
const projects = projectsData as Project[];

export function generateStaticParams() {
  return experts.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = experts.find((e) => e.id === id);
  if (!exp) return {};
  return {
    title: `${exp.name} | Chuyên gia WISE Academy`,
    description: exp.bio,
    alternates: { canonical: `/chuyen-gia/${exp.id}` },
  };
}

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
export default async function ExpertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = experts.find((e) => e.id === id);
  if (!exp) notFound();

  const credentials = exp.title.split(" · ").map((s) => s.trim()).filter(Boolean);
  const related = relatedProjects(exp);
  const others = experts.filter((e) => e.id !== exp.id && e.group === exp.group).slice(0, 3);
  const initial = exp.name.split(" ").pop()?.charAt(0);
  // name with the given name (and nickname) highlighted, e.g. "Nguyễn Thị" + "Thủy (Kate)"
  const words = exp.name.split(" ");
  const cut = exp.name.includes("(") ? words.length - 2 : words.length - 1;
  const firstPart = words.slice(0, cut).join(" ");
  const lastPart = words.slice(cut).join(" ");
  // the first sentence of the bio as a short lead
  const lead = exp.bio.split(/(?<=\.)\s/)[0];

  return (
    <div className="bg-[#F8F9FA]">
      {/* Hero: light and playful; copy on the left, an arch portrait with floating stat cards on the right */}
      <section className="relative isolate overflow-hidden bg-[#FFF7F0]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(#F7601126_1.2px,transparent_1.2px)] [background-size:22px_22px]" />
        <div aria-hidden="true" className="absolute -left-40 -top-40 -z-10 w-[520px] h-[520px] rounded-full bg-[#FFD9BF] blur-3xl opacity-70" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 w-[460px] h-[460px] rounded-full bg-[#CFE2F5] blur-3xl opacity-70" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 lg:pt-16 pb-16 lg:pb-24">
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-14 lg:gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#002F5B] px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white">
                <span className="w-2 h-2 rounded-full bg-[#F76011] animate-pulse" />
                {exp.role}
              </span>
              <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#002F5B]">
                {firstPart}{" "}
                <span className="bg-gradient-to-r from-[#F76011] to-[#FF9F43] bg-clip-text text-transparent">{lastPart}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#486581]">{lead}</p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {credentials.map((c) => (
                  <li key={c} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-[#002F5B] shadow-[0_8px_20px_-14px_rgba(0,47,91,0.5)] ring-1 ring-[#002F5B]/[0.08]">
                    <CheckCircle2 weight="fill" className="w-4 h-4 shrink-0 text-[#F76011]" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F76011] hover:bg-[#C9500E] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(247,96,17,0.7)] transition"
                >
                  <Calendar className="w-4 h-4" /> Đặt lịch tư vấn với chuyên gia
                </Link>
                {exp.career && (
                  <a href="#qua-trinh" className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-[#002F5B] hover:text-[#C9500E] transition-colors">
                    Xem hành trình <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
              {/* shapes behind the portrait */}
              <div aria-hidden="true" className="absolute -inset-6 rounded-full border-2 border-dashed border-[#F76011]/35 spin-slow" />
              <div aria-hidden="true" className="absolute -right-5 top-10 w-full h-[88%] rounded-t-full rounded-b-[44px] bg-[#002F5B] rotate-6" />
              {/* arch portrait; a cut-out photo rises above the top of the arch */}
              {exp.cutout ? (
                <div className="relative aspect-[4/5]">
                  <div className="absolute inset-x-0 bottom-0 top-[12%] rounded-t-full rounded-b-[44px] bg-gradient-to-b from-[#FFB27A] to-[#F76011] shadow-[0_30px_60px_-25px_rgba(0,47,91,0.55)]" />
                  <div className="absolute inset-0 rounded-b-[44px] overflow-hidden">
                    <img src={exp.cutout} alt={exp.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[108%] max-w-none drop-shadow-[0_12px_24px_rgba(0,30,56,0.25)]" />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/5] rounded-t-full rounded-b-[44px] overflow-hidden bg-gradient-to-b from-[#FFB27A] to-[#F76011] shadow-[0_30px_60px_-25px_rgba(0,47,91,0.55)]">
                  {exp.image ? (
                    <img src={exp.image} alt={exp.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-7xl font-bold text-white">{initial}</span>
                  )}
                </div>
              )}
              {/* floating stat cards */}
              {exp.highlights?.[0] && (
                <div className="float-y absolute -left-6 sm:-left-12 top-16 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,47,91,0.5)] ring-1 ring-[#002F5B]/[0.06]">
                  <p className="text-2xl font-extrabold text-[#F76011] leading-none">{exp.highlights[0].value}</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#486581]">{exp.highlights[0].label}</p>
                </div>
              )}
              {exp.highlights?.[3] && (
                <div className="float-y-slow absolute -right-4 sm:-right-10 bottom-16 rounded-2xl bg-[#002F5B] px-4 py-3 text-white shadow-[0_18px_40px_-18px_rgba(0,30,56,0.7)]">
                  <p className="text-2xl font-extrabold leading-none">{exp.highlights[3].value}</p>
                  <p className="mt-1 text-[11px] font-semibold text-white/75">{exp.highlights[3].label}</p>
                </div>
              )}
              <span className="absolute left-1/2 -bottom-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#002F5B] shadow-md ring-1 ring-[#002F5B]/10">
                WISE Academy Expert
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key numbers */}
      {exp.highlights && (
        <section className="bg-white border-b border-slate-200 px-4 sm:px-6">
          <dl className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 py-8">
            {exp.highlights.map((h) => (
              <div key={h.label} className="px-4 py-3 text-center">
                <dd className="text-2xl sm:text-3xl font-bold text-[#002F5B]">{h.value}</dd>
                <dt className="mt-1 text-xs text-[#486581] leading-snug">{h.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Story and strengths */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Giới thiệu</h2>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#102A43]">{exp.bio}</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Thế mạnh chuyên môn</h2>
            {exp.expertise && (
              <ul className="mt-4 space-y-2.5">
                {exp.expertise.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm text-[#102A43] leading-relaxed">
                    <CheckCircle2 weight="fill" className="w-4 h-4 shrink-0 mt-0.5 text-[#F76011]" />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <ul className={`${exp.expertise ? "mt-6" : "mt-4"} grid grid-cols-1 sm:grid-cols-2 gap-3`}>
              {exp.tags.map((t) => (
                <li key={t} className="rounded-xl bg-[#F3F6FA] px-4 py-3 text-sm font-semibold text-[#002F5B] ring-1 ring-[#002F5B]/[0.06]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Career path and education */}
      {exp.career && (
        <section id="qua-trinh" className="py-16 lg:py-20 px-4 sm:px-6 scroll-mt-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">Quá trình công tác</h2>
              <ol className="mt-8 relative border-l-2 border-[#F76011]/30 ml-2 space-y-8">
                {exp.career.map((c) => (
                  <li key={c.org} className="pl-7 relative">
                    <span aria-hidden="true" className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#F76011] ring-4 ring-[#F8F9FA]" />
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C9500E]">{c.period}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#002F5B]">{c.org}</h3>
                    <p className="mt-1 text-sm text-[#486581] leading-relaxed">{c.role}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-10">
              {exp.education && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Học vấn</h2>
                  <ul className="mt-4 space-y-3">
                    {exp.education.map((e) => (
                      <li key={e.degree} className="rounded-xl bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,47,91,0.4)] ring-1 ring-[#002F5B]/[0.06]">
                        <p className="font-semibold text-[#002F5B]">{e.degree}</p>
                        <p className="mt-0.5 text-sm text-[#486581]">{e.school}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exp.languages && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Ngoại ngữ</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#486581]">{exp.languages}</p>
                </div>
              )}
              {exp.regions && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Kinh nghiệm quốc tế</h2>
                  <ul className="mt-4 space-y-2.5">
                    {exp.regions.map((r) => (
                      <li key={r.country} className="text-sm leading-relaxed text-[#486581]">
                        <strong className="text-[#002F5B]">{r.country}:</strong> {r.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Selected engagements */}
      {exp.experience && (
        <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">Kinh nghiệm dự án tiêu biểu</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exp.experience.map((e) => (
                <article key={e.client} className="rounded-2xl bg-[#F8F9FA] p-6 ring-1 ring-[#002F5B]/[0.06]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-[#002F5B] leading-snug">{e.client}</h3>
                    {e.period && <span className="shrink-0 text-[11px] font-bold text-[#C9500E]">{e.period}</span>}
                  </div>
                  <p className="mt-2.5 text-sm text-[#486581] leading-relaxed">{e.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {exp.certifications && (
        <section className="py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">Chứng nhận & đào tạo chuyên sâu</h2>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exp.certifications.map((c) => (
                <li key={c.name} className="flex gap-3 rounded-xl bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,47,91,0.45)] ring-1 ring-[#002F5B]/[0.06]">
                  <CheckCircle2 weight="duotone" className="w-6 h-6 shrink-0 text-[#F76011]" />
                  <span>
                    <span className="block text-sm font-semibold text-[#002F5B]">{c.name}</span>
                    <span className="block mt-0.5 text-xs text-[#486581]">{c.org}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Projects with the companies named in the bio */}
      {related.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">Dự án tiêu biểu đã đồng hành</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/du-an#${p.id}`} className="group card-soft overflow-hidden flex flex-col">
                  {p.cover && (
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={p.cover} alt={p.client} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{p.client}</p>
                    <h3 className="mt-1.5 text-base font-semibold text-[#002F5B] leading-snug">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other experts */}
      {others.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">Chuyên gia khác</h2>
              <Link href="/chuyen-gia" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9500E] hover:text-[#F76011]">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((o) => (
                <Link key={o.id} href={`/chuyen-gia/${o.id}`} className="group card-soft flex items-center gap-4 p-5">
                  <span className="w-16 h-16 shrink-0 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow">
                    {o.image && <img src={o.image} alt={o.name} className="w-full h-full object-cover object-top" loading="lazy" />}
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C9500E] leading-snug">{o.role}</span>
                    <span className="mt-1 block font-semibold text-[#002F5B] group-hover:text-[#F76011] transition-colors">{o.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* always at hand while reading the profile: back to the list, or book a session */}
      <ExpertActionBar bookHref={`/lien-he?expert=${encodeURIComponent(exp.name)}`} />

      <CtaBand
        title={<>Làm việc trực tiếp cùng {exp.name}</>}
        description="Chia sẻ bài toán vận hành của doanh nghiệp, WISE Academy sẽ sắp xếp buổi trao đổi với chuyên gia phù hợp."
        href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
      />
    </div>
  );
}
