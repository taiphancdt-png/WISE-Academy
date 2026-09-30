"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import type { Course } from "@/types";

export default function TrainingClient({ courses }: { courses: Course[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  const categories = [
    { id: "all", name: `Tất cả chuyên đề (${courses.length})` },
    { id: "Lean Six Sigma", name: "Lean Six Sigma Belts" },
    { id: "Quản trị Hiện trường", name: "5S & Quản trị Hiện trường" },
    { id: "Bảo trì & Kỹ thuật", name: "TPM & Kỹ thuật Sản xuất" },
    { id: "Workshop Thực chiến", name: "Simulation Game" },
    { id: "Chuyển đổi số", name: "Lean 4.0 & Số hóa" },
    { id: "Chuyên đề Nâng cao", name: "Đào tạo In-house Khác" },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Chương trình đào tạo thực chiến"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp"
        title={<>Đào tạo nâng cao năng suất & <span className="text-[#FF7A30]">tối ưu vận hành</span> nhà xưởng</>}
        description="Hơn 35 chuyên đề đào tạo dễ hiểu, cầm tay chỉ việc ngay trên chuyền sản xuất. Giúp quản đốc, tổ trưởng và kỹ sư biết cách phát hiện lãng phí, giảm phế phẩm và làm chủ quy trình."
      />

      {/* Filter and search */}
      <section className="sticky top-[61px] z-30 bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto" role="tablist" aria-label="Lọc theo chủ đề">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#002F5B] border-[#002F5B] text-white"
                    : "bg-white border-slate-200 text-[#486581] hover:border-[#002F5B] hover:text-[#002F5B]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <label className="relative w-full md:w-72">
            <span className="sr-only">Tìm kiếm chuyên đề đào tạo</span>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chuyên đề đào tạo..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8F9FA] border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15"
            />
          </label>
        </div>
      </section>

      {/* Courses grid */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="mb-8 text-sm text-[#486581]" aria-live="polite">
            Đang hiển thị <strong className="text-[#002F5B]">{filteredCourses.length}</strong> chuyên đề
          </p>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-[#486581]">
              <p className="text-base font-semibold text-[#002F5B]">Không tìm thấy chuyên đề phù hợp</p>
              <p className="mt-2 text-sm">Thử từ khóa khác hoặc chọn &ldquo;Tất cả chuyên đề&rdquo;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <article key={course.id} id={course.id} className="card-soft flex flex-col p-5 scroll-mt-40">
                  {course.image && (
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="pt-5 flex flex-col flex-grow">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#102A43]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.accent_color || "#002F5B" }} />
                      {course.badge}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-[#002F5B] leading-snug">{course.title}</h3>
                    <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-3">{course.summary}</p>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#002F5B]">Đối tượng</dt>
                        <dd className="mt-1 text-[#486581]">{course.target}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#002F5B]">Kết quả đạt được</dt>
                        <dd>
                          <ul className="mt-1">
                            {course.outcomes.slice(0, 3).map((out) => (
                              <li key={out} className="plus-item !py-1.5 !border-0 !font-normal !text-[#486581]">
                                {out}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-[#486581] min-w-0">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#002F5B]" />
                        <span className="truncate">{course.duration}</span>
                      </span>
                      <Link href="/lien-he" className="shrink-0 text-sm font-semibold text-[#C9500E] hover:underline">
                        Tư vấn khóa học
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Bạn cần khóa học thiết kế riêng cho nhà máy của mình?"
        description="Chúng tôi khảo sát thực tế tại phân xưởng, lấy ví dụ từ chính sản phẩm và dữ liệu của nhà máy để xây dựng giáo trình đào tạo riêng cho đội ngũ của bạn."
        label="Liên hệ thiết kế khóa học in-house"
      />
    </div>
  );
}
