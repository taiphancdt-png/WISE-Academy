"use client";

import React, { useState } from "react";
import { Maximize2, X } from "@/components/icons";

interface MarkdownArticleProps {
  content: string;
}

export default function MarkdownArticle({ content }: MarkdownArticleProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Parse lines into structured blocks
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inBlockquote = false;
  let quoteBuffer: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-5 space-y-2.5 pl-2">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#102A43] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F76011] mt-2.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
      listType = null;
    }
  };

  const flushQuote = () => {
    if (quoteBuffer.length > 0) {
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-6 border-l-4 border-[#F76011] bg-[#FFF5EC]/60 p-4 sm:p-5 rounded-r-2xl italic text-sm sm:text-base text-[#102A43] leading-relaxed"
        >
          {quoteBuffer.join(" ")}
        </blockquote>
      );
      quoteBuffer = [];
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushQuote();
      continue;
    }

    // Ignore top-level title duplicate
    if (line.startsWith("# ") && i < 5) {
      continue;
    }

    // Markdown Image: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList();
      flushQuote();
      const altText = imgMatch[1] || "Hình ảnh bài viết";
      const imgUrl = imgMatch[2];
      elements.push(
        <figure key={`img-${elements.length}`} className="my-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group relative">
          <div className="relative aspect-auto max-h-[500px] overflow-hidden bg-slate-50 flex items-center justify-center">
            <img
              src={imgUrl}
              alt={altText}
              className="max-h-[500px] w-auto max-w-full object-contain mx-auto cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
              onClick={() => setZoomImage(imgUrl)}
              loading="lazy"
            />
            <button
              onClick={() => setZoomImage(imgUrl)}
              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              title="Phóng to ảnh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {altText && !altText.toLowerCase().endsWith(".webp") && !altText.toLowerCase().endsWith(".jpg") && !altText.toLowerCase().endsWith(".png") && (
            <figcaption className="text-center text-xs text-[#486581] italic py-2.5 px-4 bg-slate-50 border-t border-slate-100">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Blockquote: > text
    if (line.startsWith("> ")) {
      flushList();
      inBlockquote = true;
      quoteBuffer.push(line.replace(/^>\s*/, ""));
      continue;
    } else if (inBlockquote) {
      flushQuote();
    }

    // Heading H2: ## Title
    if (line.startsWith("## ")) {
      flushList();
      flushQuote();
      const title = line.replace(/^##\s+/, "");
      if (title.toLowerCase().includes("hình ảnh bài viết")) continue;
      const anchor = title.toLowerCase().replace(/[^a-z0-9\u00C0-\u1EF9]+/g, "-").replace(/^-+|-+$/g, "");
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={anchor}
          className="text-xl sm:text-2xl font-semibold text-[#002F5B] mt-10 mb-4 pt-4 border-t border-slate-100 scroll-mt-24"
        >
          {title}
        </h2>
      );
      continue;
    }

    // Heading H3: ### Title
    if (line.startsWith("### ")) {
      flushList();
      flushQuote();
      const title = line.replace(/^###\s+/, "");
      if (title.toLowerCase().includes("hình ảnh bài viết")) continue;
      const anchor = title.toLowerCase().replace(/[^a-z0-9\u00C0-\u1EF9]+/g, "-").replace(/^-+|-+$/g, "");
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          id={anchor}
          className="text-lg sm:text-xl font-bold text-[#002F5B] mt-8 mb-3 scroll-mt-24 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#F76011]" />
          <span>{title}</span>
        </h3>
      );
      continue;
    }

    // Unordered List: - text or * text
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushQuote();
      listType = "ul";
      currentList.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Numbered List: 1. text
    if (/^\d+\.\s+/.test(line)) {
      flushQuote();
      listType = "ol";
      currentList.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    // Normal Paragraph
    flushList();
    flushQuote();
    elements.push(
      <p key={`p-${elements.length}`} className="my-4 text-sm sm:text-base text-[#102A43] leading-relaxed">
        {line}
      </p>
    );
  }

  flushList();
  flushQuote();

  return (
    <div className="article-rendered-content">
      {elements}

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-10 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Phóng to"
              className="max-h-[85vh] max-w-full rounded-xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
