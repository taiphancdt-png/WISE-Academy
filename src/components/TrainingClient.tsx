"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock, Download, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import type { Course } from "@/types";
import { LssiClients, LssiIncluded, LssiPartnerIntro, LssiPricingCta, LssiProgramGrid } from "@/components/LssiPrograms";
import LssiInterestForm from "@/components/LssiInterestForm";
import LeanHouse from "@/components/LeanHouse";
import { LSSI_PROGRAMS } from "@/data/lssi-programs";

const ALL = "all";
const LSSI_GROUP = "Lean Six Sigma chuẩn quốc tế";
const PRACTITIONER_GROUP = "Chuyên viên thực hành Lean";

// The four program groups; `id` matches the `category` value in courses.json.
const GROUPS = [
  {
    id: "Lean Six Sigma chuẩn quốc tế",
    short: "LSS chuẩn quốc tế",
    title: "Chương trình Lean Six Sigma chuẩn quốc tế",
    description: "Chương trình chứng nhận của Lean Six Sigma Institute (LSSI Global) — từ Yellow Belt đến Master Black Belt và bằng thạc sĩ, do WISE Academy triển khai tại Việt Nam.",
  },
  {
    id: "Chuyên viên thực hành Lean",
    short: "Chuyên viên thực hành Lean",
    title: "Chương trình dành cho chuyên viên thực hành Lean",
    description: "Kỹ năng cầm tay chỉ việc cho kỹ sư, chuyên viên và quản lý trực tiếp: 5S, TPM, SMED, VSM, cân bằng công việc, giải quyết vấn đề.",
  },
  {
    id: "Chương trình cho lãnh đạo",
    short: "Lãnh đạo",
    title: "Chương trình cho lãnh đạo",
    description: "Hoạch định chiến lược, quản trị bằng chỉ số, chẩn đoán vận hành và phát triển năng lực đội ngũ quản lý.",
  },
  {
    id: "Lean 4.0 & tích hợp AI",
    short: "Lean 4.0 & AI",
    title: "Chương trình Lean 4.0, tích hợp AI",
    description: "Kết hợp tư duy tinh gọn với dữ liệu thời gian thực, IoT và AI để vận hành thông minh — từ nhà máy đến chuỗi cung ứng và dịch vụ.",
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
            <p className="text-sm text-[#486581] leading-relaxed">{course.summary}</p>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                Tư vấn khóa học
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
      <ul className="space-y-3">
        {courses.map((c) => (
          <CourseAccordionItem key={c.id} course={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
        ))}
      </ul>
    </div>
  );
}

// International group: LSSI partnership, formats, pricing message, programs, benefits and interest form.
function LssiSection() {
  return (
    <div className="space-y-8">
      <LssiPartnerIntro />
      <LssiPricingCta />
      <LssiProgramGrid />
      <LssiIncluded />
      <div id="dang-ky-lssi" className="scroll-mt-40">
        <LssiInterestForm />
      </div>
      <LssiClients />
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
  // The international group is served by LSSI programs, so WISE's own belt entries in that group are not listed.
  const courses = allCourses.filter((c) => c.category !== LSSI_GROUP);
  const [activeGroup, setActiveGroup] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState("");

  const countOf = (id: string) => (id === LSSI_GROUP ? LSSI_PROGRAMS.length : courses.filter((c) => c.category === id).length);
  const chips = [{ id: ALL, name: `Tất cả (${courses.length + LSSI_PROGRAMS.length})` }, ...GROUPS.map((g) => ({ id: g.id, name: `${g.short} (${countOf(g.id)})` }))];

  const q = searchQuery.trim().toLowerCase();
  const filteredCourses = courses.filter(
    (c) =>
      (activeGroup === ALL || c.category === activeGroup) &&
      (!q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))
  );
  const showGrouped = activeGroup === ALL && !q;

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Chương trình đào tạo thực chiến"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp"
        title={<>Đào tạo nâng cao năng suất & <span className="text-[#FF7A30]">tối ưu vận hành</span> doanh nghiệp</>}
        description="4 nhóm chương trình với hơn 35 chuyên đề: từ chứng nhận Lean Six Sigma quốc tế, kỹ năng thực hành tại hiện trường, năng lực lãnh đạo đến Lean 4.0 tích hợp AI."
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
          {showGrouped ? (
            <div className="space-y-20">
              {GROUPS.map((g, i) => {
                const isLssi = g.id === LSSI_GROUP;
                const list = courses.filter((c) => c.category === g.id);
                if (!isLssi && list.length === 0) return null;
                return (
                  <div key={g.id} id={`nhom-${i + 1}`} className="scroll-mt-40">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-5">
                      <div className="max-w-3xl">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9500E]">
                          Nhóm {String(i + 1).padStart(2, "0")} · {isLssi ? LSSI_PROGRAMS.length : list.length} chương trình
                        </span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#002F5B]">{g.title}</h2>
                        <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{g.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveGroup(g.id)}
                        className="self-start sm:self-auto shrink-0 text-sm font-semibold text-[#C9500E] hover:underline"
                      >
                        Chỉ xem nhóm này
                      </button>
                    </div>
                    {isLssi ? (
                      <LssiSection />
                    ) : g.id === PRACTITIONER_GROUP ? (
                      <PractitionerSection courses={list} />
                    ) : (
                      <CourseGrid courses={list} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : activeGroup === LSSI_GROUP ? (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">{GROUPS[0].title}</h2>
                <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{GROUPS[0].description}</p>
              </div>
              <LssiSection />
            </div>
          ) : activeGroup === PRACTITIONER_GROUP && !q ? (
            <div className="space-y-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#002F5B]">{GROUPS[1].title}</h2>
                <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{GROUPS[1].description}</p>
              </div>
              <PractitionerSection courses={filteredCourses} />
            </div>
          ) : (
            <>
              <p className="mb-8 text-sm text-[#486581]" aria-live="polite">
                Đang hiển thị <strong className="text-[#002F5B]">{filteredCourses.length}</strong> chương trình
                {activeGroup !== ALL && (
                  <>
                    {" "}trong nhóm <strong className="text-[#002F5B]">{GROUPS.find((g) => g.id === activeGroup)?.title}</strong>
                  </>
                )}
              </p>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-20 text-[#486581]">
                  <p className="text-base font-semibold text-[#002F5B]">Không tìm thấy chương trình phù hợp</p>
                  <p className="mt-2 text-sm">Thử từ khóa khác hoặc chọn &ldquo;Tất cả&rdquo;.</p>
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
        label="Liên hệ thiết kế khóa học in-house"
      />
    </div>
  );
}
