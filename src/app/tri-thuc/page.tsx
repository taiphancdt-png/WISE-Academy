"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, Search, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import articlesData from "@/data/articles.json";
import type { Article } from "@/types";

const ALL = "Tất cả";

// Lowercase and strip Vietnamese diacritics so "5s quan ly" matches "5S & Quản lý".
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

// Many imported excerpts start by repeating the title (sometimes twice); drop those copies.
// Words are compared without punctuation so "[WISE ACADEMY X LDT]" still matches "WISE ACADEMY X LDT".
function cleanExcerpt(title: string, excerpt: string) {
  const bare = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const titleWords = title.split(/\s+/).map(bare).filter(Boolean);
  let words = excerpt.trim().split(/\s+/);
  const startsWithTitle = () => {
    const head = words.map(bare).filter(Boolean).slice(0, titleWords.length);
    return titleWords.length > 0 && head.length === titleWords.length && head.every((w, i) => w === titleWords[i]);
  };
  while (startsWithTitle()) {
    let matched = 0;
    let i = 0;
    while (matched < titleWords.length && i < words.length) {
      if (bare(words[i])) matched++;
      i++;
    }
    words = words.slice(i);
  }
  return words.join(" ") || excerpt;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

export default function KnowledgePage() {
  const articles: Article[] = articlesData as Article[];

  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(ALL);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  // Restore filters from the URL so a filtered list can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("chu-de");
    const q = params.get("q");
    if (t) setTopic(t);
    if (q) setSearch(q);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (topic !== ALL) params.set("chu-de", topic);
    if (search) params.set("q", search);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [topic, search]);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) counts.set(a.category, (counts.get(a.category) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const searchIndex = useMemo(
    () =>
      new Map(
        articles.map((a) => [a.id, { title: normalize(a.title), body: normalize(`${a.excerpt} ${a.content}`) }])
      ),
    [articles]
  );

  // Match the whole phrase (diacritics ignored); title hits rank above body hits.
  const filtered = useMemo(() => {
    const q = normalize(search).trim().replace(/\s+/g, " ");
    const byTopic = articles.filter((a) => topic === ALL || a.category === topic);
    const byDate = (x: Article, y: Article) =>
      sort === "newest" ? y.date.localeCompare(x.date) : x.date.localeCompare(y.date);
    if (!q) return byTopic.sort(byDate);
    const score = (a: Article) => {
      const idx = searchIndex.get(a.id);
      if (!idx) return 0;
      if (idx.title.includes(q)) return 2;
      if (idx.body.includes(q)) return 1;
      return 0;
    };
    return byTopic
      .map((a) => ({ a, s: score(a) }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s || byDate(x.a, y.a))
      .map((x) => x.a);
  }, [articles, searchIndex, topic, search, sort]);

  const hasFilters = topic !== ALL || search !== "";
  const clearFilters = () => {
    setTopic(ALL);
    setSearch("");
  };

  const topicButton = (name: string, count: number) => {
    const active = topic === name;
    return (
      <button
        key={name}
        type="button"
        onClick={() => setTopic(name)}
        aria-pressed={active}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm text-left transition-colors ${
          active ? "bg-[#002F5B] text-white font-semibold" : "text-[#102A43] hover:bg-[#EBF3FA]"
        }`}
      >
        <span>{name}</span>
        <span className={`text-xs tabular-nums ${active ? "text-white/80" : "text-[#486581]"}`}>{count}</span>
      </button>
    );
  };

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Kinh nghiệm vận hành nhà xưởng"
        image="/images/projects/samho-ag-lean-six-sigma-yellow-belt/photo_10.webp"
        title={<>Góc tri thức: quản lý sản xuất & <span className="text-[#FF7A30]">tối ưu năng suất</span></>}
        description="Bài viết hướng dẫn thực tế về 5S, bảo trì TPM, công cụ chất lượng, giải quyết vấn đề và lãnh đạo thay đổi trong nhà máy."
      >
        <label className="relative w-full max-w-xl">
          <span className="sr-only">Tìm kiếm bài viết</span>
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo từ khóa, ví dụ: pareto, 5S, bảo trì..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-[#102A43] text-sm sm:text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-[#F76011]/30"
          />
        </label>
      </PageHero>

      <section className="py-12 lg:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Topics: sidebar on desktop, swipeable chips on mobile */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <h2 className="hidden lg:block text-xs font-bold uppercase tracking-wider text-[#486581] mb-3 px-4">Chủ đề</h2>
              <nav aria-label="Lọc theo chủ đề" className="hidden lg:flex flex-col gap-1">
                {topicButton(ALL, articles.length)}
                {topics.map(([name, count]) => topicButton(name, count))}
              </nav>
              <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4" role="group" aria-label="Lọc theo chủ đề">
                {[[ALL, articles.length] as [string, number], ...topics].map(([name, count]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setTopic(name)}
                    aria-pressed={topic === name}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                      topic === name
                        ? "bg-[#002F5B] border-[#002F5B] text-white"
                        : "bg-white border-slate-200 text-[#486581]"
                    }`}
                  >
                    {name} <span className="opacity-70">({count})</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-[#486581]" aria-live="polite">
                <strong className="text-[#002F5B]">{filtered.length}</strong> bài viết
                {topic !== ALL && (
                  <>
                    {" "}trong <strong className="text-[#002F5B]">{topic}</strong>
                  </>
                )}
                {search && (
                  <>
                    {" "}cho &ldquo;<strong className="text-[#002F5B]">{search}</strong>&rdquo;
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9500E] hover:underline"
                  >
                    <X className="w-4 h-4" /> Xóa bộ lọc
                  </button>
                )}
                <label className="flex items-center gap-2 text-sm text-[#486581]">
                  <span>Sắp xếp</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-[#102A43] focus:outline-none focus:border-[#F76011]"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                  </select>
                </label>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card-soft !transform-none text-center py-16 px-6">
                <p className="text-base font-semibold text-[#002F5B]">Không tìm thấy bài viết phù hợp</p>
                <p className="mt-2 text-sm text-[#486581]">Thử từ khóa ngắn hơn hoặc chọn chủ đề khác.</p>
                <button onClick={clearFilters} className="mt-5 text-sm font-semibold text-[#C9500E] hover:underline">
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              <ul className="space-y-5">
                {filtered.map((art) => (
                  <li key={art.id}>
                    <Link
                      href={`/tri-thuc/${art.slug || art.id}`}
                      className="card-soft group flex flex-col sm:flex-row overflow-hidden"
                    >
                      <div className="sm:w-60 shrink-0 aspect-[16/9] sm:aspect-auto bg-slate-100 overflow-hidden">
                        {art.thumbnail ? (
                          <img
                            src={art.thumbnail}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full min-h-32 flex items-center justify-center bg-[#002F5B]">
                            <BookOpen className="w-8 h-8 text-[#FF7A30]" />
                          </div>
                        )}
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{art.category}</span>
                        <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-[#102A43] leading-snug group-hover:text-[#C9500E] transition-colors">
                          {art.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-2">{cleanExcerpt(art.title, art.excerpt)}</p>
                        <div className="mt-auto pt-4 flex items-center gap-5 text-xs text-[#486581]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#002F5B]" /> {formatDate(art.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#002F5B]" /> {art.readTime}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
