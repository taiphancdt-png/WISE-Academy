"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CoreValue {
  letter: string;
  word: string;
  title: string;
  desc: string;
}

// Petal colours (translucent, so overlaps mix like a Venn diagram) and label colours readable on white.
const PETAL = ["#002F5B", "#F76011", "#1F64A6", "#FF9F43"];
const LABEL = ["#002F5B", "#C9500E", "#1F64A6", "#B85F0B"];
// Closed: four upright petals side by side reading W I S E. Open: fanned out like a flower.
const OPEN_ANGLE = [-62, -21, 21, 62];
const CLOSED_X = [-1.5, -0.5, 0.5, 1.5]; // in petal widths
const PETAL_W = 118;
const PETAL_L = 290;
// Value cards around the open flower: top-left corner of each card, in px from the flower base
// (W lower left, I upper left, S upper right, E lower right, each next to its petal tip).
const CARD_POS = [
  { x: -615, y: -190 },
  { x: -535, y: -490 },
  { x: 235, y: -490 },
  { x: 315, y: -190 },
] as const;
// the flower svg is 520 x 350 with the base of the petals at (260, 330)
const BASE = { x: 260, y: 330 };

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const petalPath = (w: number, l: number) =>
  `M 0 0 C ${-w * 0.62} ${-l * 0.2} ${-w * 0.62} ${-l * 0.78} 0 ${-l} C ${w * 0.62} ${-l * 0.78} ${w * 0.62} ${-l * 0.2} 0 0 Z`;

export default function CoreValuesBloom({
  values,
  title,
  description,
}: {
  values: CoreValue[];
  title: React.ReactNode;
  description: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<(SVGGElement | null)[]>([]);
  const letterRefs = useRef<(SVGTextElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;

    const header = document.querySelector("header");
    const setTop = () => {
      const h = header?.getBoundingClientRect().height ?? 0;
      sticky.style.top = `${h}px`;
      sticky.style.height = `calc(100dvh - ${h}px)`;
    };
    setTop();
    window.addEventListener("resize", setTop);

    // openness follows the scroll through the pinned section: closed -> open -> closed again
    const apply = (t: number) => {
      petalRefs.current.forEach((g, i) => {
        if (!g) return;
        const x = CLOSED_X[i] * PETAL_W * 0.78 * (1 - t);
        const a = OPEN_ANGLE[i] * t;
        g.setAttribute("transform", `translate(${x.toFixed(1)} 0) rotate(${a.toFixed(2)})`);
        // keep each letter upright and slide it towards the tip as the petal opens
        letterRefs.current[i]?.setAttribute("transform", `translate(0 ${(-PETAL_L * (0.42 + 0.18 * t)).toFixed(1)}) rotate(${(-a).toFixed(2)})`);
      });
      const show = smooth(0.55, 0.95, t);
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        c.style.opacity = String(show);
        c.style.transform = `translateY(${((1 - show) * 24).toFixed(1)}px) scale(${(0.96 + 0.04 * show).toFixed(3)})`;
        c.style.transitionDelay = `${i * 40}ms`;
      });
    };
    if (r) {
      apply(1);
      return () => window.removeEventListener("resize", setTop);
    }
    let raf = 0;
    let shown = -1;
    const frame = () => {
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - sticky.offsetHeight;
      const p = Math.min(1, Math.max(0, -(rect.top - (parseFloat(sticky.style.top) || 0)) / span));
      const target = smooth(0.08, 0.38, p) * (1 - smooth(0.68, 0.95, p));
      shown = shown < 0 ? target : shown + (target - shown) * 0.12; // a little easing on top of the scroll
      apply(shown);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setTop);
    };
  }, []);

  const flower = (
    <svg viewBox="-260 -330 520 350" width={520} height={350} className="block overflow-visible" aria-hidden="true">
      {values.map((v, i) => (
        <g
          key={v.letter}
          ref={(el) => {
            petalRefs.current[i] = el;
          }}
          transform={`translate(${CLOSED_X[i] * PETAL_W * 0.78} 0)`}
          style={{ mixBlendMode: "multiply" }}
        >
          <path d={petalPath(PETAL_W, PETAL_L)} fill={PETAL[i]} fillOpacity={0.88} />
          <text
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            transform={`translate(0 ${-PETAL_L * 0.42})`}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-extrabold"
            fontSize={64}
            fill="#fff"
            style={{ mixBlendMode: "normal" }}
          >
            {v.letter}
          </text>
        </g>
      ))}
      <circle r={16} fill="#fff" stroke="#002F5B" strokeWidth={3} />
    </svg>
  );

  const card = (v: CoreValue, i: number, extra = "") => (
    <div className={`rounded-2xl bg-white/90 p-4 xl:p-5 shadow-[0_18px_40px_-24px_rgba(0,47,91,0.45)] ring-1 ring-[#002F5B]/[0.06] ${extra}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white" style={{ backgroundColor: PETAL[i] }}>
          {v.letter}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: LABEL[i] }}>
          {v.word}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-[#002F5B] whitespace-pre-line">{v.title}</h3>
      <p className="mt-2 text-[13px] xl:text-sm leading-relaxed text-[#486581]">{v.desc}</p>
    </div>
  );

  return (
    <section className="relative bg-white">
      {/* desktop: pinned, the flower opens and closes with the scroll */}
      <div ref={wrapRef} className={`${reduce ? "" : "lg:block"} hidden relative`} style={{ height: "calc(100dvh + 160vh)" }}>
        <div ref={stickyRef} className="sticky top-0 h-[100dvh] flex flex-col items-center px-8 pt-12">
          <div className="max-w-3xl text-center">
            <h2 className="text-3xl sm:text-[34px] font-semibold leading-tight text-[#002F5B]">{title}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#486581]">{description}</p>
          </div>
          <div className="relative flex-1 w-full max-w-[1300px]">
            <div className="absolute left-1/2 bottom-16 -translate-x-1/2">
              {flower}
              {values.map((v, i) => {
                const pos = CARD_POS[i];
                return (
                  <div
                    key={v.letter}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="absolute w-[300px] transition-[opacity,transform] duration-300"
                    style={{ left: BASE.x + pos.x, top: BASE.y + pos.y, opacity: 0 }}
                  >
                    {card(v, i)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* mobile and reduced motion: the open flower and the four values in a list */}
      <div className={`${reduce ? "" : "lg:hidden"} py-16 px-4 sm:px-6`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[#002F5B]">{title}</h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#486581]">{description}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">{values.map((v, i) => <div key={v.letter}>{card(v, i)}</div>)}</div>
      </div>
    </section>
  );
}
