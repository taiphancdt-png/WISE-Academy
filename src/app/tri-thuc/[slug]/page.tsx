import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  Share2, 
  BookOpen, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import articlesData from "@/data/articles.json";
import type { Article } from "@/types";
import MarkdownArticle from "@/components/MarkdownArticle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles: Article[] = articlesData as Article[];
  return articles.map((art) => ({
    slug: art.slug || art.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const articles: Article[] = articlesData as Article[];
  const article = articles.find((a) => (a.slug || a.id) === slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết — WISE Academy",
    };
  }

  return {
    title: `${article.title} — Góc Tri Thức WISE Academy`,
    description: article.excerpt.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 160),
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const articles: Article[] = articlesData as Article[];
  const article = articles.find((a) => (a.slug || a.id) === slug);

  if (!article) {
    notFound();
  }

  // Related articles (other articles)
  const relatedArticles = articles
    .filter((a) => (a.slug || a.id) !== slug)
    .slice(0, 3);

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Breadcrumb Header */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between text-xs text-[#486581]">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-[#002F5B] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/tri-thuc" className="hover:text-[#002F5B] transition-colors">Góc Tri Thức</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#002F5B] font-semibold truncate max-w-[200px] sm:max-w-md">{article.title}</span>
          </div>

          <Link
            href="/tri-thuc"
            className="hidden sm:inline-flex items-center gap-1 font-bold text-[#C9500E] hover:text-[#002F5B] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tất cả bài viết</span>
          </Link>
        </div>
      </section>

      {/* Main Article Container */}
      <article className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-[0_10px_40px_-8px_rgba(0,30,56,0.10)] space-y-8">
            
            {/* Header Details */}
            <div className="space-y-4 border-b border-slate-100 pb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#C9500E] bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#F76011]/20">
                  {article.category}
                </span>
                <span className="text-[#486581] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.date}
                </span>
                <span className="text-[#486581] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C9500E]" /> {article.readTime}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[#002F5B] font-semibold">{article.author || "WISE Academy"}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-4xl font-semibold text-[#002F5B] leading-tight">
                {article.title}
              </h1>

              {/* Excerpt Lead */}
              {article.excerpt && (
                <p className="text-base sm:text-lg text-[#486581] leading-relaxed italic bg-[#F8F9FA] p-5 rounded-2xl border-l-4 border-[#002F5B]">
                  “{article.excerpt}”
                </p>
              )}
            </div>

            {/* Featured Image if available */}
            {article.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>
            )}

            {/* Rendered Markdown Body */}
            <div className="pt-2">
              <MarkdownArticle content={article.content} />
            </div>

            {/* Post CTA Box */}
            <div className="mt-12 bg-[#002F5B] rounded-2xl p-6 sm:p-8 text-white space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF7A30]">
                <Sparkles className="w-4 h-4" />
                <span>Ứng Dụng Thực Tế Tại Nhà Xưởng</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Bạn Muốn Chuyên Gia Khảo Sát & Tư Vấn Giải Pháp Này Cho Doanh Nghiệp?
              </h3>
              <p className="text-xs sm:text-sm text-[#C7D8E4] leading-relaxed">
                Đội ngũ chuyên gia của WISE trực tiếp đến phân xưởng để đo lường số liệu, tìm điểm nghẽn và xây dựng lộ trình cải tiến riêng cho nhà máy của bạn.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/lien-he"
                  className="w-full sm:w-auto text-center bg-[#F76011] hover:bg-[#C9500E] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md"
                >
                  Đặt lịch tư vấn miễn phí
                </Link>
                <a
                  href="tel:0989002121"
                  className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#FF7A30]" />
                  <span>Hotline: 0989 002 121</span>
                </a>
              </div>
            </div>

            {/* Navigation back */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/tri-thuc"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#002F5B] hover:text-[#C9500E] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách bài viết</span>
              </Link>
              <span className="text-xs text-slate-400">
                Nguồn: Viện Đào Tạo & Tư Vấn WISE Academy
              </span>
            </div>
          </div>

          {/* Sticky Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            
            {/* Table of Contents Box */}
            {article.toc && article.toc.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-8px_rgba(0,30,56,0.10)] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <BookOpen className="w-4 h-4 text-[#C9500E]" />
                  <h3 className="text-sm font-semibold text-[#002F5B] uppercase tracking-wider">
                    Mục Lục Bài Viết
                  </h3>
                </div>
                <nav className="space-y-2 max-h-[400px] overflow-y-auto pr-2 text-xs">
                  {article.toc.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.anchor}`}
                      className={`block py-1 text-[#486581] hover:text-[#C9500E] transition-colors leading-snug ${
                        item.level === 3 ? "pl-4 text-[11px]" : "font-semibold text-xs"
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Fast Consultation Box */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-8px_rgba(0,30,56,0.10)] space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9500E] bg-[#FFF5EC] px-2.5 py-0.5 rounded">
                TƯ VẤN TRỰC TIẾP
              </span>
              <h4 className="text-base font-semibold text-[#002F5B]">
                Cần Giải Đáp Vấn Đề Nhà Xưởng?
              </h4>
              <p className="text-xs text-[#486581] leading-relaxed">
                Trao đổi 1:1 trực tiếp cùng các chuyên gia từng điều hành nhà máy của Nike, Pou Chen, AG Samho.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:0989002121"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F9FA] hover:bg-slate-100 text-xs font-bold text-[#002F5B] transition-colors border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-[#C9500E]" />
                  <span>0989 002 121 (Hotline / Zalo)</span>
                </a>
                <Link
                  href="/lien-he"
                  className="growth-arrow flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#002F5B] hover:bg-[#F76011] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Đặt lịch trao đổi</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Related Articles Mini List */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-8px_rgba(0,30,56,0.10)] space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#002F5B] border-b border-slate-100 pb-3">
                Bài Viết Cùng Chuyên Mục
              </h4>
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/tri-thuc/${rel.slug || rel.id}`}
                    className="group flex gap-3 items-start"
                  >
                    {rel.thumbnail ? (
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <img
                          src={rel.thumbnail}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-[#002F5B]/10 flex items-center justify-center shrink-0 text-[#002F5B]">
                        <BookOpen className="w-5 h-5 text-[#C9500E]" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-[#002F5B] group-hover:text-[#C9500E] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 block">{rel.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </article>

      {/* Bottom Section: Related Articles Grid */}
      <section className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-[#C9500E]">KHÁM PHÁ THÊM</span>
              <h2 className="text-2xl font-semibold text-[#002F5B] mt-1">Bài Viết Chuyên Đề Khác</h2>
            </div>
            <Link
              href="/tri-thuc"
              className="text-xs font-bold text-[#C9500E] hover:text-[#002F5B] transition-colors flex items-center gap-1"
            >
              <span>Xem tất cả ({articles.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                href={`/tri-thuc/${art.slug || art.id}`}
                className="growth-card bg-[#F8F9FA] rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group hover:border-[#002F5B] transition-all"
              >
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative">
                  {art.thumbnail ? (
                    <img
                      src={art.thumbnail}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#002F5B] text-white">
                      <BookOpen className="w-8 h-8 text-[#FF7A30]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#001E38]/85 text-[#FF7A30] text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#002F5B] group-hover:text-[#C9500E] transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-[#486581] pt-2 border-t border-slate-200">
                    <span>{art.date}</span>
                    <span className="font-semibold text-[#C9500E] flex items-center gap-0.5">
                      Đọc tiếp <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
