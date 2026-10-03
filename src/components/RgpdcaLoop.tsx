"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/components/icons";

export interface RgpdcaStep {
  phase: string;
  code: string; // e.g. "R - RESEARCH"
  name: string;
  action: string;
  content: string;
}

// Grid placement on desktop: row 1 = steps 1-3 (left to right), row 2 = the loop track, row 3 = steps 4-6 (right to left).
const PLACE = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-3 lg:row-start-3",
  "lg:col-start-2 lg:row-start-3",
  "lg:col-start-1 lg:row-start-3",
];
// Arrow toward the next step within the same row (desktop). Row changes are carried by the loop track.
const ROW_ARROW: (null | { Icon: typeof ArrowRight; pos: string })[] = [
  { Icon: ArrowRight, pos: "top-1/2 -translate-y-1/2 -right-[52px]" },
  { Icon: ArrowRight, pos: "top-1/2 -translate-y-1/2 -right-[52px]" },
  null,
  { Icon: ArrowLeft, pos: "top-1/2 -translate-y-1/2 -left-[52px]" },
  { Icon: ArrowLeft, pos: "top-1/2 -translate-y-1/2 -left-[52px]" },
  null,
];

const TRACK_ROW = 120; // px height of the middle grid row
const TRACK_Y = 24; // top edge of the track inside that row
const TRACK_H = 72; // track height (fully rounded ends)
const GAP_X = 64; // lg:gap-x-16
const LAP_MS = 9000; // one full lap = six steps

// Rounded-rectangle loop between the two rows of steps. A light runs clockwise around it; whichever step it has
// most recently passed is "active": its letter lights up in the centre, its connector and its box are highlighted.
export default function RgpdcaLoop({ steps }: { steps: RgpdcaStep[] }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const [w, setW] = useState(0);
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Track the width of the middle row so the SVG geometry is drawn in real pixels.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Geometry (all in px of the middle row)
  const c1 = (w - 2 * GAP_X) / 6;
  const centers = [c1, w / 2, w - c1];
  const r = TRACK_H / 2;
  const x0 = c1 - 70;
  const x1 = w - c1 + 70;
  const yTop = TRACK_Y;
  const yBot = TRACK_Y + TRACK_H;
  const topLen = x1 - x0 - 2 * r;
  const arc = Math.PI * r;
  const total = 2 * topLen + 2 * arc;
  // Clockwise path starting where the top straight edge begins.
  const d =
    w > 0
      ? `M ${x0 + r} ${yTop} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${yBot} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${yTop} Z`
      : "";
  // Arc length at which the light reaches each step's connector.
  const anchors = [
    centers[0] - (x0 + r),
    centers[1] - (x0 + r),
    centers[2] - (x0 + r),
    topLen + arc + (x1 - r - centers[2]),
    topLen + arc + (x1 - r - centers[1]),
    topLen + arc + (x1 - r - centers[0]),
  ];

  // Drive the light with requestAnimationFrame; respect reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setAnimate(false);
      return;
    }
    if (!w || !pathRef.current) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const s = (((now - start) % LAP_MS) / LAP_MS) * total;
      const p = pathRef.current!.getPointAtLength(s);
      dotRef.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      let idx = 5;
      for (let i = 0; i < 6; i++) if (s >= anchors[i]) idx = i;
      if (s < anchors[0]) idx = 5;
      setActive((prev) => (prev === idx ? prev : idx));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, total]);

  const isOn = (i: number) => !animate || i === active;

  return (
    <ol className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-16 lg:gap-y-0">
      {steps.map((item, i) => {
        const step = i + 1;
        const on = isOn(i);
        const arrow = ROW_ARROW[i];
        return (
          <li
            key={item.phase}
            className={`relative card-soft !transform-none p-7 transition-[box-shadow,outline-color] duration-500 outline outline-2 ${
              on && animate ? "outline-[#F76011] shadow-[0_18px_40px_-12px_rgba(247,96,17,0.35)]" : "outline-transparent"
            } ${PLACE[i]}`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-14 h-14 rounded-xl text-3xl font-extrabold flex items-center justify-center shrink-0 transition-colors duration-500 ${
                  on ? "bg-[#F76011] text-white" : "bg-[#002F5B] text-[#FF7A30]"
                }`}
              >
                {item.code.charAt(0)}
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-semibold text-[#486581]">Bước {String(step).padStart(2, "0")}</span>
                <span className="block text-sm font-bold uppercase tracking-wide text-[#002F5B]">
                  <span className="text-[#F76011]">{item.code.charAt(0)}</span>
                  {item.code.split(" - ")[1].slice(1)}
                </span>
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#002F5B] leading-snug whitespace-pre-line">{item.name}</h3>
            <p className="mt-2 text-xs font-semibold text-[#C9500E]">{item.action}</p>
            <p className="mt-3 text-sm text-[#486581] leading-relaxed">{item.content}</p>

            {arrow && (
              <span
                aria-hidden="true"
                className={`hidden lg:flex absolute w-10 h-10 rounded-full bg-[#F76011] text-white items-center justify-center shadow-md shadow-[#F76011]/30 ${arrow.pos}`}
              >
                <arrow.Icon className="w-5 h-5" />
              </span>
            )}
            {step < 6 && (
              <span aria-hidden="true" className="lg:hidden absolute left-1/2 -translate-x-1/2 -bottom-10 w-8 h-8 rounded-full bg-[#F76011] text-white flex items-center justify-center">
                <ArrowDown className="w-4 h-4" />
              </span>
            )}
          </li>
        );
      })}

      {/* Loop track with connectors to every step (desktop) */}
      <li ref={rowRef} aria-hidden="true" className="hidden lg:block relative lg:col-span-3 lg:row-start-2 list-none" style={{ height: TRACK_ROW }}>
        {w > 0 && (
          <svg width={w} height={TRACK_ROW} className="absolute inset-0 overflow-visible">
            {/* connectors: top row hangs down to the top edge, bottom row rises to the bottom edge */}
            {centers.map((cx, k) => {
              const topOn = isOn(k);
              const botOn = isOn(5 - k);
              return (
                <g key={k}>
                  <line x1={cx} y1={0} x2={cx} y2={yTop} stroke={topOn ? "#F76011" : "#CBD5E1"} strokeWidth={topOn ? 3 : 2} className="transition-all duration-500" />
                  <line x1={cx} y1={yBot} x2={cx} y2={TRACK_ROW} stroke={botOn ? "#F76011" : "#CBD5E1"} strokeWidth={botOn ? 3 : 2} className="transition-all duration-500" />
                  <circle cx={cx} cy={yTop} r={topOn ? 6 : 4} fill={topOn ? "#F76011" : "#fff"} stroke={topOn ? "#F76011" : "#94A3B8"} strokeWidth={2} />
                  <circle cx={cx} cy={yBot} r={botOn ? 6 : 4} fill={botOn ? "#F76011" : "#fff"} stroke={botOn ? "#F76011" : "#94A3B8"} strokeWidth={2} />
                </g>
              );
            })}
            {/* the loop itself */}
            <path d={d} fill="#FFF5EC" stroke="#F76011" strokeOpacity={0.35} strokeWidth={3} />
            <path ref={pathRef} d={d} fill="none" stroke="#F76011" strokeWidth={3} strokeDasharray="14 10" className="rgpdca-dash" />
            {animate && (
              <g ref={dotRef} transform={`translate(${x0 + r} ${yTop})`}>
                <circle r={12} fill="#F76011" fillOpacity={0.25} />
                <circle r={6} fill="#F76011" />
              </g>
            )}
          </svg>
        )}
        {/* letters light up one by one as the cycle passes each step */}
        <div className="absolute inset-x-0 flex items-center justify-center gap-4" style={{ top: TRACK_Y, height: TRACK_H }}>
          {steps.map((item, i) => (
            <span
              key={item.phase}
              className={`text-2xl font-extrabold transition-all duration-500 ${
                isOn(i) ? "text-[#F76011] scale-125 drop-shadow-[0_0_10px_rgba(247,96,17,0.55)]" : "text-[#002F5B]/30"
              }`}
            >
              {item.code.charAt(0)}
            </span>
          ))}
        </div>
      </li>
    </ol>
  );
}
