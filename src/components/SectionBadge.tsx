import React from "react";

interface SectionBadgeProps {
  number?: string;
  title: string;
  light?: boolean;
}

// Small uppercase eyebrow label shown above section headings.
// `number` is kept for backward compatibility but no longer rendered.
export default function SectionBadge({ title, light = false }: SectionBadgeProps) {
  return (
    <span
      className={`block text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3 ${
        light ? "text-[#FF7A30]" : "text-[#C9500E]"
      }`}
    >
      {title}
    </span>
  );
}
