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
// darker shade of each petal colour for the letter on it
const PETAL_INK = ["#001A33", "#A93D06", "#0F3F6E", "#B35E0A"];
// All four petals grow from one point. Closed: a narrow bud whose petals read W I S E; open: a fanned lotus.
const CLOSED_ANGLE = [-18, -6, 6, 18];
const OPEN_ANGLE = [-74, -25, 25, 74];
const PETAL_W = 124;
const OPEN_MS = 800; // the flower opens in this time while the page holds still
const PETAL_L = 300;
const LETTER_CLOSED = 0.6; // letter size in the closed bud, relative to the open flower, so the letters fit the narrow petals
// Value cards around the open flower: top-left corner of each card, in px from the flower base
// (W lower left, I upper left, S upper right, E lower right, each next to its petal tip).
const CARD_W = 340;
const CARD_H = 300;
const CARD_POS = [
  { x: -690, y: -262 },
  { x: -500, y: -632 },
  { x: 500 - CARD_W, y: -632 },
  { x: 690 - CARD_W, y: -262 },
] as const;
// the flower svg is 520 x 350 with the base of the petals at (260, 330)
const BASE = { x: 260, y: 330 };

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
// petal: the original almond shape, made fuller (plump in the middle, pointed at both ends)
const petalPath = (w: number, l: number) =>
  `M 0 0 C ${-w * 0.65} ${-l * 0.18} ${-w * 0.65} ${-l * 0.8} 0 ${-l} C ${w * 0.65} ${-l * 0.8} ${w * 0.65} ${-l * 0.18} 0 0 Z`;

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
      sticky.style.top = `${h}px`; // header height, used to line the section up under it
      sticky.style.height = `calc(100dvh - ${h}px)`;
    };
    setTop();
    window.addEventListener("resize", setTop);

    // openness follows the scroll through the pinned section: closed -> open -> closed again
    const apply = (t: number) => {
      petalRefs.current.forEach((g, i) => {
        if (!g) return;
        const a = CLOSED_ANGLE[i] + (OPEN_ANGLE[i] - CLOSED_ANGLE[i]) * t;
        g.setAttribute("transform", `rotate(${a.toFixed(2)})`);
        // keep each letter upright; as the flower closes it slides towards the tip and shrinks so letters never touch
        letterRefs.current[i]?.setAttribute("transform", `translate(0 ${(-PETAL_L * (0.9 - 0.3 * t)).toFixed(1)}) rotate(${(-a).toFixed(2)}) scale(${(LETTER_CLOSED + (1 - LETTER_CLOSED) * t).toFixed(3)})`);
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
    // Scrolling down, the page holds still for a moment while the flower opens (constant speed), then lets go.
    // Further down, once the flower rises above the middle of the screen, it closes again with the scroll.
    // Coming back up past the section resets it, so the next pass opens it again.
    let raf = 0;
    let last = 0;
    let openT = 0; // 0..1, time-based opening
    let t = 0; // what is drawn
    let opened = false;
    let locked = false;
    let lockY = 0;
    let lastScroll = window.scrollY;
    const flowerSvg = wrap.querySelector("svg");
    const block = (e: Event) => {
      if (locked) e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (locked && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " ", "Home", "End"].includes(e.key)) e.preventDefault();
    };
    const holdScroll = () => {
      if (locked && Math.abs(window.scrollY - lockY) > 1) window.scrollTo(0, lockY);
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", holdScroll);
    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      const fr = flowerSvg?.getBoundingClientRect();
      const y = fr ? (fr.top + fr.height / 2) / window.innerHeight : 1;
      const down = window.scrollY > lastScroll;
      lastScroll = window.scrollY;
      if (!opened && !locked && down && y <= 0.72 && y > 0.3) {
        locked = true;
        lockY = window.scrollY;
      }
      if (locked) {
        openT = Math.min(1, openT + dt / OPEN_MS);
        if (openT >= 1) {
          locked = false;
          opened = true;
        }
      } else if (!opened && y < 0.3) {
        // jumped past (e.g. an anchor link): just show it open
        openT = 1;
        opened = true;
      }
      if (y > 0.98) {
        // the section is back below the fold: reset for the next pass
        opened = false;
        openT = 0;
      }
      const target = openT * (1 - smooth(0.5, 0.25, y));
      t += (target - t) * (locked ? 1 : 0.2);
      apply(t);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
      else {
        locked = false;
        if (e.boundingClientRect.top > 0) {
          opened = false;
          openT = 0;
          apply((t = 0));
        }
      }
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("scroll", holdScroll);
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
          transform={`rotate(${CLOSED_ANGLE[i]})`}
          style={{ mixBlendMode: "multiply" }}
        >
          <path d={petalPath(PETAL_W, PETAL_L)} fill={PETAL[i]} fillOpacity={0.6} />
          <text
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            transform={`translate(0 ${-PETAL_L * 0.9}) rotate(${-CLOSED_ANGLE[i]}) scale(${LETTER_CLOSED})`}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-extrabold"
            fontSize={45}
            fill={PETAL_INK[i]}
            style={{ mixBlendMode: "normal" }}
          >
            {v.letter}
          </text>
        </g>
      ))}
      {/* the flower's centre: the WISE W mark in white on a navy disc with a white ring */}
      <circle r={18} fill="#002F5B" stroke="#FFFFFF" strokeWidth={7} paintOrder="stroke" />
      <image href="/images/brand/logo-mark-white.png" x={-11} y={-9} width={22} height={18} />
    </svg>
  );

  const card = (v: CoreValue, i: number, extra = "") => (
    <div className={`relative overflow-hidden rounded-2xl bg-white/90 p-4 xl:p-5 shadow-[0_18px_40px_-24px_rgba(0,47,91,0.45)] ring-1 ring-[#002F5B]/[0.06] ${extra}`}>
      {/* big see-through letter in the corner */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-2 -bottom-7 select-none text-[120px] font-extrabold leading-none" style={{ color: PETAL[i], opacity: 0.1 }}>
        {v.letter}
      </span>
      {/* the core value itself, as the card's headline label */}
      <p className="relative text-xl xl:text-2xl font-extrabold uppercase leading-none tracking-[0.06em]" style={{ color: LABEL[i] }}>
        {v.word}
      </p>
      <h3 className="relative mt-3 text-lg font-semibold leading-snug text-[#002F5B] whitespace-pre-line">{v.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-[#486581] [text-wrap:wrap]">{v.desc}</p>
    </div>
  );

  return (
    <section className="relative bg-white">
      {/* desktop: one screen; the flower opens and closes with the scroll */}
      <div ref={wrapRef} className={`${reduce ? "" : "lg:block"} hidden relative pb-20`}>
        <div ref={stickyRef} className="relative h-[100dvh] flex flex-col items-center px-8 pt-12">
          <div className="max-w-3xl text-center">
            <h2 className="text-3xl sm:text-[34px] font-semibold leading-tight text-[#002F5B]">{title}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#486581]">{description}</p>
          </div>
          <div className="relative flex-1 w-full max-w-[1300px]">
            <div className="absolute left-1/2 origin-center" style={{ top: "calc(50% - 60px)", transform: "translateX(-50%) scale(0.85)" }}>
              {flower}
              {values.map((v, i) => {
                const pos = CARD_POS[i];
                return (
                  <div
                    key={v.letter}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="absolute transition-[opacity,transform] duration-300"
                    style={{ left: BASE.x + pos.x, top: BASE.y + pos.y, width: CARD_W, height: CARD_H, opacity: 0 }}
                  >
                    {card(v, i, "h-full")}
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
