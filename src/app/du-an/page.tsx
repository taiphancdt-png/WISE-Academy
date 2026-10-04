import React from "react";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import ProjectDetails from "@/components/ProjectDetails";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

export const metadata = {
  title: "Dự Án & Câu Chuyện Chuyển Đổi Thực Tế | WISE Academy",
  description: "Tổng hợp các case study dự án tư vấn Lean Six Sigma, chuẩn hóa 5S, Work Engineering và cải tiến năng suất tại các tập đoàn sản xuất và logistics lớn.",
  alternates: { canonical: "/du-an" },
};

export default function ProjectsPage() {
  // Entries marked "(bỏ)" in the data are retired and must not be shown.
  const projects: Project[] = (projectsData as Project[]).filter((p) => !p.client.includes("(bỏ)"));

  return (
    <div>
      <PageHero
        eyebrow="Case studies & kết quả thực tế"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_1.webp"
        title={<>Dự án đã triển khai: <span className="text-[#FF7A30]">kết quả đo lường được</span> tại doanh nghiệp</>}
        description="Mỗi dự án là một sự đồng hành sát sao giữa chuyên gia WISE Academy và ban lãnh đạo doanh nghiệp, giúp tăng năng suất, giảm lỗi và tiết kiệm chi phí lãng phí."
      />

      {/* Every project: a short summary with photos; "Xem chi tiết dự án" opens the full case study */}
      {projects.map((proj, idx) => (
        <section key={proj.id} id={proj.id} className={`${idx % 2 ? "bg-[#F8F9FA]" : "bg-white"} py-16 lg:py-20 px-4 sm:px-6 scroll-mt-24`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 items-start">
            <div className={idx % 2 ? "lg:order-2" : "lg:order-1"}>
              {/* shown at the photo's own proportions, so wide group photos are never cut at the sides */}
              <div className="rounded-2xl overflow-hidden bg-slate-100">
                <img src={proj.cover || proj.gallery?.[0]} alt={`Dự án ${proj.client}`} className="block w-full h-auto" loading="lazy" />
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
            <ProjectDetails project={proj} textClass={`${idx % 2 ? "lg:order-1" : "lg:order-2"} lg:self-center`}>
              <span className="text-sm font-semibold text-[#C9500E]">{proj.industry}</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#002F5B] leading-tight">{proj.client}</h2>
              <p className="mt-1 text-base font-medium text-[#102A43]">{proj.title}</p>
              <blockquote className="mt-5 border-l-4 border-[#F76011] pl-4 italic text-sm sm:text-base text-[#486581] leading-relaxed">
                “{proj.highlight}”
              </blockquote>
              <p className="mt-4 text-sm text-[#486581] leading-relaxed">{proj.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {proj.tags.map((t) => (
                  <span key={t} className="text-xs bg-[#EBF3FA] text-[#002F5B] px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </ProjectDetails>
          </div>
        </section>
      ))}

      <CtaBand
        title="Muốn đạt kết quả tương tự tại doanh nghiệp của bạn?"
        description="Chia sẻ bài toán hiện tại, chuyên gia WISE Academy sẽ đề xuất cách triển khai phù hợp với quy mô và ngành hàng của bạn."
      />
    </div>
  );
}
