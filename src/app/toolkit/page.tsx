import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import toolsData from "@/data/tools.json";
import type { LeanTool } from "@/types";

export const metadata = {
  title: "Toolkit — Công cụ Lean thực hành — WISE Academy",
  description: "Bộ công cụ Lean tương tác do WISE Academy xây dựng từ các dự án thực tế: tính toán, biểu mẫu và mô phỏng dùng ngay trên trình duyệt.",
  alternates: { canonical: "/toolkit" },
};

export default function ToolkitPage() {
  const tools = toolsData as LeanTool[];
  const categories = [...new Set(tools.map((t) => t.category))];

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Toolkit"
        image="/images/projects/ty-bach-chuong-trinh-dao-tao-lean-cell-layout/photo_1.webp"
        title={<>Bộ công cụ <span className="text-[#FF7A30]">Lean thực hành</span></>}
        description="Các công cụ tương tác WISE Academy xây dựng từ chính các dự án tại nhà máy: dùng ngay trên trình duyệt, không cần cài đặt."
      />

      <section className="py-14 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {tools.length === 0 ? (
            <div className="card-soft !transform-none text-center py-16 px-6 max-w-2xl mx-auto">
              <span className="w-14 h-14 mx-auto rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center">
                <Wrench className="w-7 h-7" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-[#002F5B]">Bộ công cụ đang được cập nhật</h2>
              <p className="mt-2 text-sm text-[#486581]">
                Các công cụ Lean tương tác sẽ sớm có mặt tại đây. Liên hệ WISE nếu bạn cần công cụ cho dự án của mình.
              </p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="mb-14 last:mb-0">
                <h2 className="text-2xl font-semibold text-[#002F5B] mb-6">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tools
                    .filter((t) => t.category === cat)
                    .map((tool) => (
                      <Link key={tool.slug} href={`/toolkit/${tool.slug}`} className="card-soft group overflow-hidden flex flex-col">
                        <div className="aspect-[16/10] bg-[#002F5B] overflow-hidden">
                          {tool.thumbnail ? (
                            <img
                              src={tool.thumbnail}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Wrench className="w-10 h-10 text-[#FF7A30]" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{tool.category}</span>
                          <h3 className="mt-2 text-lg font-semibold text-[#102A43] leading-snug group-hover:text-[#C9500E] transition-colors">
                            {tool.title}
                          </h3>
                          <p className="mt-2 text-sm text-[#486581] leading-relaxed line-clamp-3">{tool.summary}</p>
                          <span className="mt-auto pt-5 text-sm font-semibold text-[#C9500E]">Mở công cụ →</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <CtaBand
        title="Cần công cụ riêng cho nhà máy của bạn?"
        description="WISE thiết kế công cụ tính toán, biểu mẫu và bảng theo dõi theo đúng quy trình và dữ liệu của doanh nghiệp."
        label="Trao đổi với chuyên gia"
      />
    </div>
  );
}
