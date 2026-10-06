import React from "react";

// The five consulting services laid out as a Lean House: foundation (01), the two pillars (02 delivery, 03 quality),
// the roof (04 strategy, culture & involvement) and the digital layer under the whole house (05).
// Every part links to its service further down the page.
export type HousePart = { id: string; label: string; title: string; tools: string[] };

function Tools({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${
            light ? "bg-white/15 text-white" : "bg-[#002F5B]/[0.06] text-[#002F5B]"
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

const Num = ({ id, light = false }: { id: string; light?: boolean }) => (
  <span className={`text-2xl font-extrabold leading-none ${light ? "text-[#FF9A5C]" : "text-[#F76011]"}`}>{id}</span>
);

export default function ServiceHouse({
  roof,
  delivery,
  quality,
  foundation,
  digital,
  centre,
}: {
  roof: HousePart;
  delivery: HousePart;
  quality: HousePart;
  foundation: HousePart;
  digital: HousePart;
  centre: string;
}) {
  const pillar = (p: HousePart) => (
    <a
      href={`#dich-vu-${p.id}`}
      className="group flex flex-col rounded-t-xl bg-[#F76011] text-white text-center shadow-[0_18px_40px_-24px_rgba(201,80,14,0.9)] transition-transform hover:-translate-y-1"
    >
      <div className="px-4 pt-5 pb-4">
        <Num id={p.id} light />
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">{p.label}</p>
        <h3 className="mt-1 text-base sm:text-lg font-semibold leading-snug text-balance">{p.title}</h3>
      </div>
      <div className="mt-auto bg-white/95 text-[#002F5B] px-3 pb-4 pt-1 border-x-4 border-[#F76011] flex-grow">
        <Tools items={p.tools} />
      </div>
    </a>
  );

  return (
    <figure className="max-w-4xl mx-auto" aria-label="Năm dịch vụ tư vấn theo Ngôi nhà Lean">
      {/* roof */}
      <a href={`#dich-vu-${roof.id}`} className="group block transition-transform hover:-translate-y-1">
        <div
          className="bg-[#002F5B] text-white text-center px-6 pt-16 sm:pt-20 pb-6"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        >
          <Num id={roof.id} light />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">{roof.label}</p>
          <h3 className="mt-1 text-base sm:text-xl font-semibold leading-snug">{roof.title}</h3>
          <div className="max-w-md mx-auto">
            <Tools items={roof.tools} light />
          </div>
        </div>
      </a>

      {/* pillars, with people at the centre */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr_1fr] gap-4 md:gap-6 px-2 sm:px-6 pt-4 bg-gradient-to-b from-[#F1F4F8] to-white">
        {pillar(delivery)}
        <a
          href={`#dich-vu-${roof.id}`}
          className="self-center rounded-xl border border-dashed border-[#002F5B]/30 bg-white/80 px-4 py-5 text-center text-sm font-semibold leading-relaxed text-[#002F5B] transition-colors hover:border-[#F76011]"
        >
          {centre}
        </a>
        {pillar(quality)}
      </div>

      {/* foundation */}
      <a
        href={`#dich-vu-${foundation.id}`}
        className="block rounded-md bg-[#002F5B] text-white text-center px-5 py-5 shadow-sm transition-transform hover:-translate-y-0.5"
      >
        <div className="flex items-baseline justify-center gap-3">
          <Num id={foundation.id} light />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">{foundation.label}</p>
        </div>
        <h3 className="mt-1 text-base sm:text-lg font-semibold">{foundation.title}</h3>
        <Tools items={foundation.tools} light />
      </a>

      {/* digital layer under the whole house */}
      <a
        href={`#dich-vu-${digital.id}`}
        className="mt-3 block rounded-md border-2 border-dashed border-[#2F6BA8]/50 bg-[#EEF4FB] text-center px-5 py-4 transition-colors hover:border-[#F76011]"
      >
        <div className="flex items-baseline justify-center gap-3">
          <Num id={digital.id} />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2F6BA8]">{digital.label}</p>
        </div>
        <h3 className="mt-1 text-base sm:text-lg font-semibold text-[#002F5B]">{digital.title}</h3>
        <Tools items={digital.tools} />
      </a>
      <figcaption className="mt-3 text-center text-xs text-[#486581]">Bấm vào từng phần của ngôi nhà để xem chi tiết dịch vụ</figcaption>
    </figure>
  );
}
