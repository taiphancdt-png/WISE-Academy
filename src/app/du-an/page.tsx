import React from "react";
import PageHero from "@/components/PageHero";
import { CtaBand, Section, SectionHeader } from "@/components/ui";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

export const metadata = {
  title: "Dự Án & Câu Chuyện Chuyển Đổi Thực Tế — WISE Academy",
  description: "Tổng hợp các case study dự án tư vấn Lean Six Sigma, chuẩn hóa 5S, Work Engineering và cải tiến năng suất tại các tập đoàn sản xuất và logistics lớn.",
  alternates: { canonical: "/du-an" },
};

export default function ProjectsPage() {
  // Entries marked "(bỏ)" in the data are retired and must not be shown.
  const projects: Project[] = (projectsData as Project[]).filter((p) => !p.client.includes("(bỏ)"));
  const featured = projects.slice(0, 3);
  const others = projects.slice(3);

  return (
    <div>
      <PageHero
        eyebrow="Case studies & kết quả thực tế"
        image="/images/projects/project-lean-six-sigma-yellow-belt-pouchen-group/photo_1.webp"
        title={<>Dự án đã triển khai: <span className="text-[#FF7A30]">kết quả đo lường được</span> tại doanh nghiệp</>}
        description="Mỗi dự án là một sự đồng hành sát sao giữa chuyên gia WISE và ban lãnh đạo doanh nghiệp, giúp tăng năng suất, giảm lỗi và tiết kiệm chi phí lãng phí."
      />

      {/* Featured projects */}
      {featured.map((proj, idx) => (
        <section key={proj.id} className={`${idx % 2 ? "bg-[#F8F9FA]" : "bg-white"} py-16 lg:py-20 px-4 sm:px-6`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={idx % 2 ? "lg:order-2" : ""}>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                <img src={proj.cover || proj.gallery?.[0]} alt={`Dự án ${proj.client}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {proj.gallery && proj.gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {proj.gallery.slice(1, 4).map((imgUrl) => (
                    <div key={imgUrl} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                      <img src={imgUrl} alt={`Hiện trường dự án ${proj.client}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9500E]">
                Dự án {String(idx + 1).padStart(2, "0")} · {proj.industry}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#002F5B] leading-tight">{proj.client}</h2>
              <p className="mt-1 text-base font-medium text-[#102A43]">{proj.title}</p>
              <blockquote className="mt-5 border-l-4 border-[#F76011] pl-4 italic text-sm sm:text-base text-[#486581] leading-relaxed">
                “{proj.highlight}”
              </blockquote>
              <p className="mt-4 text-sm text-[#486581] leading-relaxed">{proj.description}</p>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-slate-200 py-5">
                {proj.results.map((res) => (
                  <div key={res.label}>
                    <dt className="sr-only">{res.label}</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-[#002F5B]">{res.metric}</dd>
                    <dd className="mt-1 text-xs text-[#486581] leading-snug">{res.label}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {proj.tags.map((t) => (
                  <span key={t} className="text-xs bg-[#EBF3FA] text-[#002F5B] px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Other projects */}
      {others.length > 0 && (
        <Section tone="muted">
          <SectionHeader
            eyebrow="Dự án khác"
            title="Các chương trình tư vấn & đào tạo đã hoàn thành"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((p) => (
              <article key={p.id} className="card-soft overflow-hidden flex flex-col">
                {p.cover && (
                  <div className="aspect-[16/9] bg-slate-100">
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{p.industry}</span>
                  <h3 className="mt-2 text-base font-semibold text-[#002F5B] leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#486581] line-clamp-3 leading-relaxed">{p.description}</p>
                  {p.results[0] && (
                    <p className="mt-auto pt-5 text-sm text-[#486581]">
                      <strong className="text-lg font-bold text-[#002F5B] mr-1.5">{p.results[0].metric}</strong>
                      {p.results[0].label}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      <CtaBand
        title="Muốn đạt kết quả tương tự tại doanh nghiệp của bạn?"
        description="Chia sẻ bài toán hiện tại, chuyên gia WISE sẽ đề xuất cách triển khai phù hợp với quy mô và ngành hàng của bạn."
        label="Yêu cầu tư vấn triển khai"
      />
    </div>
  );
}
