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
          <Link href="/chuyen-gia" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Tất cả chuyên gia
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

      {/* Story and strengths */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Giới thiệu</h2>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#102A43]">{exp.bio}</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9500E]">Thế mạnh chuyên môn</h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exp.tags.map((t) => (
                <li key={t} className="rounded-xl bg-[#F3F6FA] px-4 py-3 text-sm font-semibold text-[#002F5B] ring-1 ring-[#002F5B]/[0.06]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Projects with the companies named in the bio */}
      {related.length > 0 && (
        <section className="py-16 lg:py-20 px-4 sm:px-6">
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
        <section className="py-16 lg:py-20 px-4 sm:px-6 bg-white">
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

      <CtaBand
        title={<>Làm việc trực tiếp cùng {exp.name}</>}
        description="Chia sẻ bài toán vận hành của doanh nghiệp, WISE Academy sẽ sắp xếp buổi trao đổi với chuyên gia phù hợp."
        href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
      />
    </div>
  );
}
