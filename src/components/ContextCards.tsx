"use client";

import React, { useState } from "react";
import { ChevronDown, Download } from "@/components/icons";

// "Chúng tôi có thể giúp gì?": the typical situations customers come with. Only the name shows; the context,
// the services that fit it and the brochure open below.
export type CustomerContext = {
  title: string;
  hook: string;
  context: string;
  services: { id: string; name: string }[];
  brochure?: string;
};

export default function ContextCards({ items }: { items: CustomerContext[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {items.map((c, i) => {
        const on = open === i;
        const panelId = `context-${i}`;
        return (
          <li key={c.title} className={`card-soft !transform-none overflow-hidden ${on ? "ring-2 ring-[#F76011]/60" : ""}`}>
            <button
              type="button"
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
              aria-controls={panelId}
              className="w-full flex items-center gap-4 px-6 py-5 text-left"
            >
              <span className="text-2xl font-extrabold text-[#F76011] leading-none">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-base sm:text-lg font-semibold text-[#002F5B] leading-snug">{c.title}</span>
                <span className="mt-1 block text-xs sm:text-sm font-medium text-[#C9500E]">{c.hook}</span>
              </span>
              <ChevronDown className={`w-5 h-5 shrink-0 text-[#002F5B] transition-transform duration-300 ${on ? "rotate-180" : ""}`} />
            </button>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C9500E]">Bối cảnh</p>
                  <p className="mt-2 text-sm text-[#486581] leading-relaxed">{c.context}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#C9500E]">Dịch vụ phù hợp</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.services.map((s) => (
                      <a
                        key={s.id}
                        href={`#dich-vu-${s.id}`}
                        className="rounded-full border border-[#002F5B]/20 px-3 py-1.5 text-xs font-semibold text-[#002F5B] transition-colors hover:border-[#F76011] hover:text-[#C9500E]"
                      >
                        {s.id} · {s.name}
                      </a>
                    ))}
                  </div>
                  {c.brochure && (
                    <a
                      href={c.brochure}
                      download
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#002F5B] hover:text-[#C9500E]"
                    >
                      <Download className="w-4 h-4" /> Tải brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
