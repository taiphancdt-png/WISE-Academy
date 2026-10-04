"use client";

import React, { useEffect, useRef, useState } from "react";

export interface VisionMissionItem {
  title: string;
  icon: React.ReactNode;
  body: React.ReactNode;
  className: string; // background, text colour and shadow of the card
}

const D = 168; // the centre circle
const GAP = 130; // room between the two cards; the circle sits in a curved notch cut into both
const NOTCH = D / 2 + 16; // radius of the notch around the circle
const SIDE = Math.round((D * 2) / 3); // the two icon circles, 2/3 of the W circle
const SIDE_NOTCH = SIDE / 2 + 12;
const OUT = SIDE / 2; // the icon circles sit on the cards' outer edges, half outside, inside the section width
const PAD_OUT = SIDE_NOTCH + 22; // text clears the outer notch
// soft tints of each card's colour for its icon circle
const TINT = [
  { bg: "bg-gradient-to-br from-white to-[#E6EFF9]", ring: "border-[#3A78B5]/25", icon: "text-[#3A78B5]" },
  { bg: "bg-gradient-to-br from-white to-[#FDECDF]", ring: "border-[#EC7428]/25", icon: "text-[#EC7428]" },
];
const SHADOW = ["drop-shadow(0 22px 28px rgba(28,86,144,0.3))", "drop-shadow(0 22px 28px rgba(236,116,40,0.3))"];
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// One decorated circle in the middle with the WISE "W" mark. As the section scrolls up into view it splits into
// three circles in a row: the Vision icon slides out to the left edge, the Mission icon to the right edge, and the
// two cards open between them, each notched around the circles it touches.
export default function VisionMission({ items }: { items: [VisionMissionItem, VisionMissionItem] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const circleRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // card width and the height of the taller card
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const w = wrap.clientWidth;
      const cw = (w - GAP - 2 * OUT) / 2;
      let h = D + 48;
      boxRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cw}px`;
        el.style.height = "auto";
        h = Math.max(h, el.scrollHeight);
      });
      boxRefs.current.forEach((el) => el && (el.style.height = `${h}px`));
      setSize({ w, h });
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
    const cw = (size.w - GAP - 2 * OUT) / 2;
    const apply = (t: number) => {
      const sc = 0.7 + 0.3 * t;
      // the cards grow from the W circle: shifted so their inner notch stays centred on it at every scale
      const shift = (cw / 2 + GAP / 2) * (1 - sc);
      boxRefs.current.forEach((box, i) => {
        if (!box) return;
        const dir = i === 0 ? 1 : -1;
        box.style.transform = `translateX(${(dir * shift).toFixed(1)}px) scale(${sc.toFixed(3)})`;
        box.style.opacity = String(smooth(0, 0.35, t));
      });
      if (circleRef.current) circleRef.current.style.transform = `translate(-50%, -50%) scale(${(1.08 - 0.08 * t).toFixed(3)})`;
      sideRefs.current.forEach((c, i) => {
        if (!c) return;
        // slides out of the W circle and lands exactly in the card's outer notch
        const edge = OUT + cw / 2 + shift - (sc * cw) / 2; // distance of the outer edge from the section's side
        const dx = (i === 0 ? -1 : 1) * (size.w / 2 - edge) * t; // starts behind the W circle
        c.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), -50%) scale(${sc.toFixed(3)})`;
        c.style.opacity = String(smooth(0, 0.25, t));
      });
      ringRefs.current.forEach((r) => r && (r.style.transform = `rotate(${(t * 180).toFixed(1)}deg)`));
    };
    if (reduce) {
      apply(1);
      return;
    }
    // Not scrubbed by the scroll: once the section is well in view it plays through to the end (and back when it
    // drops below the fold), so it never rests half-open with the circles out of their notches.
    let raf = 0;
    let p = 0; // linear progress
    let goal = 0;
    let last = 0;
    const DURATION = 900;
    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      const r = wrap.getBoundingClientRect();
      const y = (r.top + r.height / 2) / window.innerHeight; // 0 = top of the screen, 1 = bottom
      if (y < 0.72) goal = 1;
      else if (y > 0.95) goal = 0;
      p = goal ? Math.min(1, p + dt / DURATION) : Math.max(0, p - dt / DURATION);
      apply(smooth(0, 1, p));
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);
    apply(0);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [size]);

  // mirror: each card aligns to its outer edge (left card to the left, right card to the right)
  const content = (it: VisionMissionItem, mirror = false) => (
    <div className={mirror ? "text-right" : ""}>
      <h2 className="text-2xl lg:text-[28px] font-semibold">{it.title}</h2>
      <div className="mt-4 text-sm sm:text-base leading-relaxed">{it.body}</div>
    </div>
  );

  // the decorated circle shared by the W mark and the two icons
  const circle = (children: React.ReactNode, ring: number) => (
    <>
      <div className="absolute -inset-5 rounded-full bg-[radial-gradient(circle,rgba(247,96,17,0.18),transparent_70%)]" />
      <div
        ref={(el) => {
          ringRefs.current[ring] = el;
        }}
        className="absolute inset-0 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#002F5B,#F76011,#FFB27A,#002F5B)]"
      >
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <div className="absolute inset-[10px] rounded-full border border-dashed border-[#002F5B]/20" />
      <div className="absolute inset-[18px] rounded-full bg-white shadow-[0_18px_40px_-16px_rgba(0,47,91,0.45)] flex items-center justify-center">
        {children}
      </div>
    </>
  );
  const notch = (x: string, r = NOTCH) => `radial-gradient(circle ${r}px at ${x} 50%, transparent ${r - 0.5}px, #000 ${r}px)`;

  return (
    <>
      {/* desktop: the circle stays in the middle, the two cards slide out of it */}
      <div ref={wrapRef} className="hidden xl:block relative -mx-12" style={{ height: size.h || 320 }}>
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              boxRefs.current[i] = el;
            }}
            className="absolute top-0 will-change-transform"
            style={{ [i === 0 ? "left" : "right"]: OUT, opacity: 0, filter: SHADOW[i] } as React.CSSProperties}
          >
            {/* the card: soft corners and curved notches that hug the W circle (inner edge) and its icon circle (outer edge) */}
            <div
              className={`h-full rounded-[28px] py-10 ${i === 0 ? "pr-14" : "pl-14"} ${it.className}`}
              style={{
                [i === 0 ? "paddingLeft" : "paddingRight"]: PAD_OUT,
                WebkitMaskImage: `${notch(i === 0 ? `calc(100% + ${GAP / 2}px)` : `${-GAP / 2}px`)}, ${notch(i === 0 ? "0px" : "100%", SIDE_NOTCH)}`,
                maskImage: `${notch(i === 0 ? `calc(100% + ${GAP / 2}px)` : `${-GAP / 2}px`)}, ${notch(i === 0 ? "0px" : "100%", SIDE_NOTCH)}`,
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
              } as React.CSSProperties}
            >
              {content(it, i === 1)}
            </div>
          </div>
        ))}

        {/* the two icon circles start hidden behind the W circle and slide out to the cards' outer edges */}
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              sideRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 z-[5]"
            style={{ width: SIDE, height: SIDE, transform: "translate(-50%, -50%)", opacity: 0 }}
            aria-hidden="true"
          >
            {/* lighter than the W circle: a soft tint of the card's colour, a white rim and a thin tinted line */}
            <div className={`absolute inset-0 rounded-full border-4 border-white shadow-[0_14px_32px_-18px_rgba(0,47,91,0.35)] ${TINT[i].bg}`} />
            <div className={`absolute inset-[12px] rounded-full border ${TINT[i].ring}`} />
            <span className={`absolute inset-0 m-auto w-[44%] h-[44%] ${TINT[i].icon} [&>svg]:w-full [&>svg]:h-full`}>{it.icon}</span>
          </div>
        ))}

        {/* the decorated centre circle with the W mark */}
        <div ref={circleRef} className="absolute left-1/2 top-1/2 z-10" style={{ width: D, height: D, transform: "translate(-50%, -50%)" }} aria-hidden="true">
          {circle(
            /* the W mark with the registered-trademark sign, as on the WISE Academy logo */
            <span className="relative w-[50%]">
              <img src="/images/brand/logo-mark.png" alt="" className="w-full" />
              {/* beside the top of the W's right arm, with a small gap */}
              <span className="absolute left-full top-[16%] ml-[3px] text-[26px] font-bold leading-[0.6] text-[#002F5B]">®</span>
            </span>,
            0,
          )}
        </div>
      </div>

      {/* mobile: the two cards stacked */}
      <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((it) => (
          <div key={it.title} className={`rounded-[28px] p-8 ${it.className}`}>
            <span className="mb-5 w-16 h-16 rounded-full bg-white/15 ring-2 ring-white/40 flex items-center justify-center [&>svg]:w-9 [&>svg]:h-9" aria-hidden="true">
              {it.icon}
            </span>
            {content(it)}
          </div>
        ))}
      </div>
    </>
  );
}
