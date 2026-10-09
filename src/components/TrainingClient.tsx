"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock, Download, Search } from "@/components/icons";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import type { Course } from "@/types";
import LeanHouse from "@/components/LeanHouse";

// LSSI programs live on their own page (/dao-tao-lean-six-sigma); this page lists WISE Academy's own programs.
const LSSI_GROUP = "Lean Six Sigma chuẩn quốc tế";
const PRACTITIONER_GROUP = "Chuyên viên thực hành Lean";
// Topic sub-groups of the practitioner programs, in display order (matches `topic` in courses.json).
const PRACTITIONER_TOPICS = [
  "Tổng quan về Lean",
  "Kaizen mindset",
  "Problem solving",
  "Kỹ năng",
  "Chất lượng",
  "Năng suất",
  "TPM - Quản lý năng suất thiết bị toàn phần",
];

// The program groups; `id` matches the `category` value in courses.json.
const GROUPS = [
  {
    id: "Chuyên viên thực hành Lean",
    short: "Chuyên viên thực hành Lean",
    title: "Chương trình dành cho chuyên viên thực hành Lean",
    description: "Kỹ năng cầm tay chỉ việc cho kỹ sư, chuyên viên và quản lý trực tiếp: 5S, TPM, SMED, VSM, cân bằng công việc, giải quyết vấn đề.",
  },
  {
    id: "Chương trình cho lãnh đạo",
    short: "Lãnh đạo Lean",
    title: "Chương trình Lãnh đạo Lean",
    description: "Hoạch định chiến lược, quản trị bằng chỉ số, chẩn đoán vận hành và phát triển năng lực đội ngũ quản lý.",
  },
  {
    id: "Lean 4.0 & tích hợp AI",
    short: "Lean 4.0 và tích hợp AI",
    title: "Chương trình Lean 4.0 và tích hợp AI",
    description: "Kết hợp tư duy tinh gọn với dữ liệu thời gian thực, IoT và AI để vận hành thông minh - từ nhà máy đến chuỗi cung ứng và dịch vụ.",
  },
];

function CourseCard({ course }: { course: Course }) {
  return (
      <article id={course.id} className="card-soft flex flex-col p-5 scroll-mt-40">
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
          {course.summary && <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-3">{course.summary}</p>}

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
              Đặt lịch tư vấn
            </Link>
          </div>
          {course.brochure && (
            <a
              href={course.brochure}
              download={`WISE-Academy-${course.id}-brochure.pdf`}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#002F5B] hover:bg-[#073866] text-white text-xs font-semibold px-4 py-2.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Tải brochure
            </a>
          )}
        </div>
      </article>
  );
}

// One expandable row of the practitioner list; the open row shows the full course details.
function CourseAccordionItem({ course, open, onToggle }: { course: Course; open: boolean; onToggle: () => void }) {
  return (
    <li id={course.id} className="scroll-mt-40 bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors"
      >
        {course.image && (
          <img src={course.image} alt="" className="hidden sm:block w-20 h-12 rounded-md object-cover shrink-0" loading="lazy" />
        )}
        <span className="flex-grow min-w-0">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#486581]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.accent_color || "#002F5B" }} />
            {course.badge}
          </span>
          <span className="mt-0.5 block text-sm sm:text-base font-semibold text-[#002F5B] leading-snug">{course.title}</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5 text-xs text-[#486581] shrink-0 max-w-[220px]">
          <Clock className="w-3.5 h-3.5 text-[#002F5B] shrink-0" />
          <span className="truncate">{course.duration}</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-[#C9500E] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 sm:px-5 py-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {course.image && <img src={course.image} alt={course.title} className="w-full aspect-[16/10] rounded-lg object-cover" loading="lazy" />}
          <div>
            {course.summary && <p className="mb-4 text-sm text-[#486581] leading-relaxed">{course.summary}</p>}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[#002F5B]">Đối tượng</dt>
                <dd className="mt-1 text-[#486581]">{course.target}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[#002F5B]">Thời lượng</dt>
                <dd className="mt-1 text-[#486581]">{course.duration}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#002F5B]">Kết quả đạt được</p>
            <ul className="mt-1">
              {course.outcomes.map((out) => (
                <li key={out} className="plus-item !py-1.5 !border-0 !font-normal !text-[#486581]">
                  {out}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {course.brochure && (
                <a
                  href={course.brochure}
                  download={`WISE-Academy-${course.id}-brochure.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#002F5B] hover:bg-[#073866] text-white text-xs font-semibold px-4 py-2.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Tải brochure
                </a>
              )}
              <Link
                href="/lien-he"
                className="inline-flex items-center rounded-full border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white text-xs font-semibold px-4 py-2.5 transition-colors"
              >
                Đặt lịch tư vấn
              </Link>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

// Practitioner group: the Lean House first, then the courses as an expandable list.
function PractitionerSection({ courses }: { courses: Course[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-10">
      <LeanHouse />
      {[...PRACTITIONER_TOPICS, "Chương trình khác"].map((topic, ti) => {
        const list = courses.filter((c) => (PRACTITIONER_TOPICS.includes(c.topic || "") ? c.topic : "Chương trình khác") === topic);
        if (list.length === 0) return null;
        return (
          <section key={topic} aria-label={topic}>
            <h3 className="mb-3 flex items-center gap-3 text-lg sm:text-xl font-semibold text-[#002F5B]">
              <span className="w-8 h-8 rounded-full bg-[#F76011] text-white text-sm font-bold flex items-center justify-center shrink-0">
                {ti + 1}
              </span>
              {topic}
              <span className="text-xs font-medium text-[#829AB1]">{list.length} chương trình</span>
            </h3>
            <ul className="space-y-3">
              {list.map((c) => (
                <CourseAccordionItem key={c.id} course={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export default function TrainingClient({ courses: allCourses }: { courses: Course[] }) {
  // International LSS certification is covered on /dao-tao-lean-six-sigma, so that group is not listed here.
  const courses = allCourses.filter((c) => c.category !== LSSI_GROUP);
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const countOf = (id: string) => courses.filter((c) => c.category === id).length;
  const chips = GROUPS.map((g) => ({ id: g.id, name: `${g.short} (${countOf(g.id)})` }));

  const q = searchQuery.trim().toLowerCase();
  const activeInfo = GROUPS.find((g) => g.id === activeGroup) ?? GROUPS[0];
  // three groups, one shown at a time; a search looks across all of them
  const filteredCourses = courses.filter((c) =>
    q ? c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) : c.category === activeGroup
  );

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Chương trình đào tạo thực chiến"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp"
        title={<>Đào tạo nâng cao năng suất & <span className="text-[#FF7A30]">tối ưu vận hành</span> doanh nghiệp</>}
        description="3 nhóm chương trình với hơn 35 chuyên đề: kỹ năng thực hành Lean tại hiện trường, năng lực lãnh đạo và Lean 4.0 tích hợp AI."
      />

      {/* Group filter and search */}
      <section className="sticky top-[61px] z-30 bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full xl:w-auto" role="tablist" aria-label="Lọc theo nhóm chương trình">
            {chips.map((chip) => (
              <button
                key={chip.id}
                role="tab"
                aria-selected={activeGroup === chip.id}
                onClick={() => setActiveGroup(chip.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeGroup === chip.id
                    ? "bg-[#002F5B] border-[#002F5B] text-white"
                    : "bg-white border-slate-200 text-[#486581] hover:border-[#002F5B] hover:text-[#002F5B]"
                }`}
              >
                {chip.name}
              </button>
            ))}
          </div>
          <label className="relative w-full xl:w-64 shrink-0">
            <span className="sr-only">Tìm kiếm chuyên đề đào tạo</span>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chuyên đề..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8F9FA] border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15"
            />
          </label>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {!q ? (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">{activeInfo.title}</h2>
                <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{activeInfo.description}</p>
              </div>
              {activeGroup === PRACTITIONER_GROUP ? <PractitionerSection courses={filteredCourses} /> : <CourseGrid courses={filteredCourses} />}
            </div>
          ) : (
            <>
              <p className="mb-8 text-sm text-[#486581]" aria-live="polite">
                Đang hiển thị <strong className="text-[#002F5B]">{filteredCourses.length}</strong> chương trình phù hợp với từ khóa tìm kiếm
              </p>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-20 text-[#486581]">
                  <p className="text-base font-semibold text-[#002F5B]">Không tìm thấy chương trình phù hợp</p>
                  <p className="mt-2 text-sm">Thử từ khóa khác.</p>
                </div>
              ) : (
                <CourseGrid courses={filteredCourses} />
              )}
            </>
          )}
        </div>
      </section>

      <CtaBand
        title="Bạn cần khóa học thiết kế riêng cho doanh nghiệp của mình?"
        description="Chúng tôi khảo sát thực tế tại hiện trường, lấy ví dụ từ chính quy trình và dữ liệu của doanh nghiệp để xây dựng giáo trình đào tạo riêng cho đội ngũ của bạn."
      />
    </div>
  );
}
