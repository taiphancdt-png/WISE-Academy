"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  Filter, 
  Search,
  BookOpen,
  Award,
  Sparkles
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import PageHero from "@/components/PageHero";
import coursesData from "@/data/courses.json";
import type { Course } from "@/types";

export default function TrainingPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const courses: Course[] = coursesData as Course[];

  const categories = [
    { id: "all", name: "Tất cả chuyên đề (35)" },
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
      {/* Page Header */}
      <PageHero
        eyebrow="CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHIẾN"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-green-belt/photo_2.webp"
        title={<>Chương Trình Đào Tạo Nâng Cao Năng Suất & <span className="text-[#FF7A30]">Tối Ưu Vận Hành</span> Nhà Xưởng.</>}
        description="Hơn 35 chuyên đề đào tạo dễ hiểu, cầm tay chỉ việc ngay trên chuyền sản xuất. Giúp quản đốc, tổ trưởng và kỹ sư biết cách phát hiện lãng phí, giảm phế phẩm và làm chủ quy trình."
      />

      {/* Filter and Search Bar */}
      <section className="sticky top-[61px] z-30 bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 xl:px-12 shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#002F5B] text-white shadow-sm"
                    : "bg-[#F8F9FA] text-[#486581] hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chuyên đề đào tạo..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-slate-200 text-xs focus:outline-none focus:border-[#F76011]"
            />
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs uppercase font-bold tracking-wider text-[#486581]">
            Đang hiển thị <strong className="text-[#002F5B]">{filteredCourses.length}</strong> chuyên đề đào tạo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              id={course.id}
              className="growth-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#002F5B] transition-all"
            >
              <div>
                {/* Course Cover Image */}
                {course.image && (
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span
                      className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-sm"
                      style={{ backgroundColor: course.accent_color || "#002F5B" }}
                    >
                      {course.badge}
                    </span>
                  </div>
                )}

                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    {!course.image && (
                      <span
                        className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                        style={{ backgroundColor: course.accent_color || "#002F5B" }}
                      >
                        {course.badge}
                      </span>
                    )}
                    {course.image && (
                      <span className="text-[10px] font-bold text-[#002F5B] uppercase tracking-wider">
                        CHƯƠNG TRÌNH THỰC CHIẾN
                      </span>
                    )}
                    <span className="text-xs text-[#486581] flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#F76011]" /> {course.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#002F5B] group-hover:text-[#F76011] transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#486581] leading-relaxed">
                    {course.summary}
                  </p>

                  {/* Target */}
                  <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#002F5B] tracking-wider block">
                      Đối tượng tham gia:
                    </span>
                    <p className="text-xs text-[#486581]">{course.target}</p>
                  </div>

                  {/* Outcomes */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#002F5B] tracking-wider block">
                      Mục tiêu & Kết quả đạt được:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#486581]">
                      {course.outcomes.slice(0, 3).map((out, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00BE62] shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action bottom */}
              <div className="p-7 pt-0">
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    href="/lien-he"
                    className="growth-arrow inline-flex items-center gap-1.5 text-xs font-bold text-[#F76011] hover:text-[#002F5B] transition-colors"
                  >
                    <span>Yêu cầu tư vấn khóa học</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    WISE CERTIFIED
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In-house Training Banner */}
      <section className="bg-[#001E38] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <SectionBadge number="CUSTOM" title="ĐÀO TẠO IN-HOUSE MAY ĐO" light={true} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Bạn Cần Thiết Kế Khóa Học Riêng <br />
            Cho <span className="text-[#F76011]">Nhà Máy Của Mình?</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi trực tiếp khảo sát thực tế tại phân xưởng, lấy ví dụ từ chính sản phẩm lỗi và dữ liệu của nhà máy để xây dựng giáo trình đào tạo riêng cho đội ngũ của bạn.
          </p>
          <div className="pt-2">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#F76011]/30 transition-all"
            >
              <span>Liên hệ thiết kế khóa học In-house</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
