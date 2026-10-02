import React from "react";

// The Lean House (Toyota Production System house) in WISE colours: roof = customer focus,
// pillars = Just-in-Time and Jidoka, centre = involvement, foundation = standardization and stability.
const ROOF = ["Hoshin planning, takt, heijunka", "Involvement, Lean design, A3 thinking"];
const JIT = ["Flow", "Heijunka", "Takt time", "Pull system", "Kanban", "Visual order (5S)", "Robust process", "Involvement"];
const JIDOKA = [
  "Poka-yoke",
  "Zone control",
  "Visual order (5S)",
  "Problem solving",
  "Abnormality control",
  "Separate human and machine work",
  "Involvement",
];
const INVOLVEMENT = ["Standardized work", "5S", "TPM", "Kaizen circles", "Suggestions", "Safety activities", "Hoshin planning"];
const STANDARDIZATION = [
  ["Standardized work", "Kanban, A3 thinking"],
  ["Visual order (5S)", "Hoshin planning"],
];
const STABILITY = ["Standardized work, 5S, Jidoka", "TPM, Heijunka, Kanban"];

function Dots({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-1.5 text-sm text-[#102A43] ${className}`}>
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#F76011] shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Pillar({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col">
      <div className="bg-[#F76011] text-white text-center font-semibold py-2.5 rounded-t-md shadow-sm">{title}</div>
      <div className="flex-grow bg-white border-x-4 border-[#F76011]/80 px-5 py-4">
        <Dots items={items} />
      </div>
      <div className="h-3 bg-[#F76011]/80 rounded-b-sm" />
    </div>
  );
}

export default function LeanHouse() {
  return (
    <figure className="max-w-4xl mx-auto" aria-label="Ngôi nhà Lean">
      {/* Roof */}
      <div className="relative">
        <div
          className="bg-[#002F5B] text-white text-center px-6 pt-14 sm:pt-16 pb-6 sm:pb-7"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        >
          <p className="font-bold text-base sm:text-xl text-[#FF7A30]">Customer focus</p>
          <ul className="mt-1 text-[11px] sm:text-sm leading-relaxed text-white/90">
            {ROOF.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pillars + involvement */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr_1fr] gap-4 md:gap-6 px-2 sm:px-8 pt-4 pb-0 bg-gradient-to-b from-[#F1F4F8] to-white">
        <Pillar title="Just-in-Time" items={JIT} />
        <div className="self-center rounded-xl border border-dashed border-[#002F5B]/30 bg-white/70 px-5 py-4">
          <p className="font-semibold text-[#002F5B] mb-2">Involvement</p>
          <Dots items={INVOLVEMENT} />
        </div>
        <Pillar title="Jidoka" items={JIDOKA} />
      </div>

      {/* Foundation */}
      <div className="mt-0 rounded-md overflow-hidden border border-[#002F5B]/20 shadow-sm">
        <div className="bg-[#FFF5EC] grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 border-b border-[#F76011]/30">
          <Dots items={STANDARDIZATION[0]} />
          <p className="font-bold text-[#002F5B] text-lg text-center order-first sm:order-none">Standardization</p>
          <Dots items={STANDARDIZATION[1]} className="sm:justify-self-end" />
        </div>
        <div className="bg-[#002F5B] text-white grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4">
          <p className="text-sm flex gap-2">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#FF7A30] shrink-0" />
            {STABILITY[0]}
          </p>
          <p className="font-bold text-lg text-center text-[#FF7A30] order-first sm:order-none">Stability</p>
          <p className="text-sm flex gap-2 sm:justify-self-end">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#FF7A30] shrink-0" />
            {STABILITY[1]}
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-[#829AB1]">
        Ngôi nhà Lean: nền tảng cho các chương trình thực hành của WISE Academy
      </figcaption>
    </figure>
  );
}
