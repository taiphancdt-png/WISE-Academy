"use client";

import React, { useEffect, useRef, useState } from "react";

export interface VisionMissionItem {
  title: string;
  icon: React.ReactNode;
  body: React.ReactNode;
  className: string; // background, text colour and shadow of the card
}

const D = 132; // circle diameter
const GAP = 32;
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Two circles side by side in the middle, each showing only the WISE "W" mark. As the section scrolls up into
// view they grow into the Vision card (sliding left) and the Mission card (sliding right).
export default function VisionMission({ items }: { items: [VisionMissionItem, VisionMissionItem] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // card width and the height of the taller card's content
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const w = wrap.clientWidth;
      const cw = (w - GAP) / 2;
      let h = 0;
      innerRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cw}px`;
        h = Math.max(h, el.scrollHeight);
      });
      setSize({ w, h: Math.max(h, D) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !size.w) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cw = (size.w - GAP) / 2;
    const H = size.h;
    const apply = (t: number) => {
      boxRefs.current.forEach((box, i) => {
        if (!box) return;
        const x0 = size.w / 2 + (i === 0 ? -D * 0.9 : -D * 0.1); // circles overlap a little in the middle
        const x1 = i === 0 ? 0 : cw + GAP;
        box.style.left = `${lerp(x0, x1, t)}px`;
        box.style.top = `${lerp((H - D) / 2, 0, t)}px`;
        box.style.width = `${lerp(D, cw, t)}px`;
        box.style.height = `${lerp(D, H, t)}px`;
        box.style.borderRadius = `${lerp(D / 2, 16, t)}px`;
        const inner = innerRefs.current[i];
        if (inner) inner.style.opacity = String(smooth(0.6, 1, t));
        const mark = markRefs.current[i];
        if (mark) mark.style.opacity = String(1 - smooth(0.05, 0.45, t));
      });
    };
    if (reduce) {
      apply(1);
      return;
    }
    let raf = 0;
    let t = 0;
    const frame = () => {
      const r = wrap.getBoundingClientRect();
      const y = (r.top + r.height / 2) / window.innerHeight; // 0 = top of the screen, 1 = bottom
      const target = smooth(0.75, 0.5, y);
      t += (target - t) * 0.18;
      if (Math.abs(target - t) < 0.001) t = target;
      apply(t);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);
    apply(0);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [size]);

  const content = (it: VisionMissionItem) => (
    <>
      <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">{it.icon}</span>
      <h2 className="mt-5 text-2xl font-semibold">{it.title}</h2>
      <div className="mt-3 text-sm sm:text-base leading-relaxed">{it.body}</div>
    </>
  );

  return (
    <>
      {/* desktop: circles that open into the two cards */}
      <div ref={wrapRef} className="hidden md:block relative" style={{ height: size.h || 320 }}>
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              boxRefs.current[i] = el;
            }}
            className={`absolute overflow-hidden ${it.className}`}
            style={{ left: "50%", top: 0, width: D, height: D, borderRadius: D / 2 }}
          >
            <img
              ref={(el) => {
                markRefs.current[i] = el;
              }}
              src="/images/brand/logo-mark-white.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
            />
            <div
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 p-8 sm:p-10"
              style={{ opacity: 0 }}
            >
              {content(it)}
            </div>
          </div>
        ))}
      </div>

      {/* mobile: the two cards stacked */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {items.map((it) => (
          <div key={it.title} className={`rounded-2xl p-8 ${it.className}`}>
            {content(it)}
          </div>
        ))}
      </div>
    </>
  );
}
