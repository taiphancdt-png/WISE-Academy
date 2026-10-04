import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/ui";
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

  return (
    <div className="bg-[#F8F9FA]">
      {/* Hero: portrait and credentials */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#001E38] via-[#002F5B] to-[#0B4A82] text-white">
        <div aria-hidden="true" className="absolute -right-32 -top-32 -z-10 w-[520px] h-[520px] rounded-full bg-[#F76011]/20 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pb-20">
          <Link
            href="/chuyen-gia"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách chuyên gia
          </Link>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
            <div className="mx-auto w-full max-w-sm">
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden ring-4 ring-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] bg-[#0B4A82]">
                {exp.image ? (
                  <img src={exp.image} alt={exp.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-7xl font-bold">{initial}</span>
                )}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#F76011] to-[#FFB27A]" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#FFB27A]">{exp.role}</p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">{exp.name}</h1>
              <ul className="mt-7 space-y-3">
                {credentials.map((c) => (
                  <li key={c} className="flex gap-3 text-sm sm:text-base text-white/90">
                    <CheckCircle2 weight="fill" className="w-5 h-5 shrink-0 mt-0.5 text-[#F76011]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F76011] hover:bg-[#C9500E] px-7 py-3 text-sm font-semibold transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Đặt lịch tư vấn với chuyên gia
                </Link>
              </div>
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
        <section className="py-16 lg:py-20 px-4 sm:px-6">
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
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 backdrop-blur p-1.5 shadow-[0_18px_40px_-12px_rgba(0,30,56,0.45)] ring-1 ring-[#002F5B]/10">
          <Link
            href="/chuyen-gia"
            className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-sm font-semibold text-[#002F5B] hover:bg-[#EBF3FA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Link>
          <Link
            href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#F76011] hover:bg-[#C9500E] px-4 sm:px-6 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <Calendar className="w-4 h-4" /> Đặt lịch tư vấn
          </Link>
        </div>
      </div>

      <CtaBand
        title={<>Làm việc trực tiếp cùng {exp.name}</>}
        description="Chia sẻ bài toán vận hành của doanh nghiệp, WISE Academy sẽ sắp xếp buổi trao đổi với chuyên gia phù hợp."
        href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
      />
    </div>
  );
}
