"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Search, 
  ChevronRight
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import PageHero from "@/components/PageHero";
import articlesData from "@/data/articles.json";
import type { Article } from "@/types";

export default function KnowledgePage() {
  const [search, setSearch] = useState("");

  const articles: Article[] = articlesData as Article[];

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F8F9FA]">
      {/* Header */}
      <PageHero
        eyebrow="KINH NGHIỆM VẬN HÀNH NHÀ XƯỞNG"
        image="/images/projects/samho-ag-lean-six-sigma-yellow-belt/photo_10.webp"
        title={<>Góc Chia Sẻ Kinh Nghiệm Quản Lý Sản Xuất & <span className="text-[#FF7A30]">Tối Ưu Năng Suất</span> Thực Tế.</>}
        description="Tổng hợp các bài viết hướng dẫn thực tế, dễ hiểu về cách sắp xếp nhà xưởng gọn gàng (5S), bảo trì máy móc tránh hỏng đột xuất, cân bằng chuyền và giảm tỷ lệ hàng lỗi."
      />

      {/* Search and Count */}
      <section className="sticky top-[61px] z-30 bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 xl:px-12 shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#486581]">
            Đang hiển thị <strong className="text-[#002F5B]">{filtered.length}</strong> bài viết chia sẻ
          </p>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết kinh nghiệm..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#F8F9FA] border border-slate-200 text-xs focus:outline-none focus:border-[#F76011]"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((art) => (
            <article
              key={art.id}
              className="growth-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#002F5B] transition-all"
            >
              <div>
                {/* Thumbnail Image */}
                <Link
                  href={`/tri-thuc/${art.slug || art.id}`}
                  className="block aspect-[16/9] bg-slate-100 overflow-hidden relative"
                >
                  {art.thumbnail ? (
                    <img
                      src={art.thumbnail}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#002F5B] to-[#073866] text-white p-6 text-center">
                      <BookOpen className="w-10 h-10 text-[#FF7A30] mb-2" />
                      <span className="text-xs font-semibold text-white/80">WISE KNOWLEDGE</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#001E38]/85 text-[#FF7A30] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {art.category}
                  </span>
                </Link>

                {/* Article Info */}
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#486581]">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#F76011]" /> {art.readTime}
                    </span>
                  </div>

                  <Link href={`/tri-thuc/${art.slug || art.id}`} className="block">
                    <h2 className="text-lg font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-[#486581] line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="p-6 sm:p-7 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {art.author || "WISE Academy"}
                  </span>
                  <Link
                    href={`/tri-thuc/${art.slug || art.id}`}
                    className="growth-arrow inline-flex items-center gap-1.5 text-xs font-bold text-[#F76011] group-hover:text-[#002F5B] transition-colors"
                  >
                    <span>Đọc bài viết</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
