"use client";

import React, { useState } from "react";
import { ChevronDown } from "@/components/icons";
import type { Project } from "@/types";

// Text column of a project row (the short summary, passed as children, plus "Xem chi tiết dự án") and the
// panel below the row that opens the full case study: partner, challenge, solution, goals, info, outcome and
// the rest of the photos.
export default function ProjectDetails({
  project,
  textClass,
  children,
}: {
  project: Project;
  textClass: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `project-${project.id}-details`;
  const photos = project.gallery?.slice(4) ?? [];

  const block = (title: string, body: React.ReactNode) => (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#C9500E]">
        {title}
      </h3>
      <div className="mt-2 text-sm sm:text-[15px] text-[#486581] leading-relaxed">
        {body}
      </div>
    </div>
  );

  return (
    <>
      <div className={textClass}>
        {children}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#002F5B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F76011]"
        >
          {open ? "Thu gọn" : "Xem chi tiết dự án"}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* expanding panel (grid-rows trick animates the height); spans both columns of the project row */}
      <div
        id={panelId}
        className={`lg:col-span-2 lg:order-3 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-8 border-t border-slate-200 mt-2">
            <div className="space-y-7">
              {project.partner && block("Đối tác", <p>{project.partner}</p>)}
              {project.challenge &&
                block("Thách thức", <p>{project.challenge}</p>)}
              {project.solution &&
                block(
                  "Giải pháp của WISE Academy",
                  <>
                    <p>{project.solution}</p>
                    {project.steps && (
                      <ol className="mt-4 space-y-2.5">
                        {project.steps.map((s, i) => (
                          <li key={s.name} className="flex gap-3">
                            <span className="shrink-0 w-7 h-7 rounded-full bg-[#F76011] text-white text-xs font-bold flex items-center justify-center">
                              {s.name[0]}
                            </span>
                            <span>
                              <strong className="text-[#002F5B]">
                                {s.name}
                              </strong>
                              : {s.text}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </>,
                )}
            </div>
            <div className="space-y-7">
              {project.goals &&
                block(
                  "Mục tiêu dự án",
                  <ul className="space-y-2">
                    {project.goals.map((g) => (
                      <li key={g} className="plus-item !font-medium">
                        {g}
                      </li>
                    ))}
                  </ul>,
                )}
              {project.info &&
                block(
                  "Thông tin chương trình",
                  <dl className="rounded-xl bg-[#F3F6FA] p-4 space-y-2">
                    {project.info.map((it) => (
                      <div
                        key={it.label}
                        className="flex flex-col sm:flex-row sm:gap-2"
                      >
                        <dt className="font-semibold text-[#002F5B] shrink-0">
                          {it.label}:
                        </dt>
                        <dd>{it.value}</dd>
                      </div>
                    ))}
                  </dl>,
                )}
              {project.outcome &&
                block("Kết quả dự án", <p>{project.outcome}</p>)}
            </div>
          </div>
          {photos.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pb-2">
              {photos.map((src) => (
                <div
                  key={src}
                  className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100"
                >
                  <img
                    src={src}
                    alt={`Hình ảnh dự án ${project.client}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
