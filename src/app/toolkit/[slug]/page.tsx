import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "@/components/icons";
import toolsData from "@/data/tools.json";
import type { LeanTool } from "@/types";

const tools = toolsData as LeanTool[];

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  return tool
    ? { title: `${tool.title} | Toolkit | WISE Academy`, description: tool.summary, alternates: { canonical: `/toolkit/${tool.slug}` } }
    : {};
}

export default async function LeanToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const src = tool.file || tool.url;

  return (
    <div className="bg-[#F8F9FA]">
      <section className="bg-white border-b border-slate-200 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/toolkit" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9500E] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Toolkit
          </Link>
          <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{tool.category}</span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-[#002F5B]">{tool.title}</h1>
              <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{tool.summary}</p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-3">
              {tool.playerUrl && (
                <a
                  href={tool.playerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#C9500E] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  Trang học viên <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {src && (
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#002F5B] text-[#002F5B] hover:bg-[#002F5B] hover:text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  {tool.playerUrl ? "Mở màn hình người dẫn" : "Mở toàn màn hình"} <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {src ? (
            // Tools are self-contained HTML from this repo, sandboxed without same-origin access to the site;
            // a tool that keeps its data in the browser (saves) gets same-origin so its localStorage works.
            <iframe
              src={src}
              title={tool.title}
              className={`w-full ${tool.playerUrl ? "h-[calc(100vh-120px)] min-h-[680px]" : "h-[80vh] min-h-[600px]"} bg-white rounded-2xl shadow-[0_10px_40px_-8px_rgba(0,30,56,0.10)]`}
              sandbox={`allow-scripts allow-forms allow-downloads allow-popups allow-modals${tool.saves ? " allow-same-origin" : ""}`}
              allow="autoplay; fullscreen; clipboard-write"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <p className="text-sm text-[#486581]">Công cụ này đang được cập nhật.</p>
          )}
        </div>
      </section>
    </div>
  );
}
