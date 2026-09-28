import React from "react";

interface SectionBadgeProps {
  number?: string;
  title: string;
  light?: boolean;
}

export default function SectionBadge({ number, title, light = false }: SectionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3 ${
      light 
        ? "bg-white/10 text-white border border-white/20" 
        : "bg-[#FFF5EC] text-[#F76011] border border-[#F76011]/20"
    }`}>
      {number && (
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
          light ? "bg-[#F76011] text-white" : "bg-[#F76011] text-white"
        }`}>
          {number}
        </span>
      )}
      <span>{title}</span>
    </div>
  );
}
