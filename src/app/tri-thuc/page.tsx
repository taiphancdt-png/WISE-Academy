"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, Search } from "lucide-react";
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
      <PageHero
        eyebrow="Kinh nghiệm vận hành nhà xưởng"
        image="/images/projects/samho-ag-lean-six-sigma-yellow-belt/photo_10.webp"
        title={<>Góc tri thức: quản lý sản xuất & <span className="text-[#FF7A30]">tối ưu năng suất</span></>}
        description="Tổng hợp các bài viết hướng dẫn thực tế, dễ hiểu về cách sắp xếp nhà xưởng gọn gàng (5S), bảo trì máy móc tránh hỏng đột xuất, cân bằng chuyền và giảm tỷ lệ hàng lỗi."
      />

      {/* Search */}
      <section className="sticky top-[61px] z-30 bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#486581]" aria-live="polite">
            Đang hiển thị <strong className="text-[#002F5B]">{filtered.length}</strong> bài viết
          </p>
          <label className="relative w-full sm:w-80">
            <span className="sr-only">Tìm kiếm bài viết</span>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8F9FA] border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15"
            />
          </label>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-base font-semibold text-[#002F5B]">Không tìm thấy bài viết phù hợp</p>
              <p className="mt-2 text-sm text-[#486581]">Thử một từ khóa khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((art) => (
                <Link key={art.id} href={`/tri-thuc/${art.slug || art.id}`} className="card-soft group overflow-hidden flex flex-col">
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    {art.thumbnail ? (
                      <img
                        src={art.thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#002F5B]">
                        <BookOpen className="w-10 h-10 text-[#FF7A30]" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{art.category}</span>
                    <h2 className="mt-2 text-base font-semibold text-[#102A43] leading-snug line-clamp-2 group-hover:text-[#C9500E] transition-colors">
                      {art.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#486581] line-clamp-3 leading-relaxed">{art.excerpt}</p>
                    <div className="mt-auto pt-5 flex items-center gap-5 text-xs text-[#486581]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#002F5B]" /> {art.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#002F5B]" /> {art.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
