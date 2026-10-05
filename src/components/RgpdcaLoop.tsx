"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/components/icons";
import TrekkerLottie, { BackTrekker, type TrekkerHandle } from "@/components/TrekkerLottie";

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
  { Icon: ArrowRight, pos: "top-1/2 -translate-y-1/2 -right-[46px]" },
  { Icon: ArrowRight, pos: "top-1/2 -translate-y-1/2 -right-[46px]" },
  null,
  { Icon: ArrowLeft, pos: "top-1/2 -translate-y-1/2 -left-[46px]" },
  { Icon: ArrowLeft, pos: "top-1/2 -translate-y-1/2 -left-[46px]" },
  null,
];

const TRACK_ROW = 102; // px height of the middle grid row
const TRACK_Y = 42; // top edge of the road inside that row (room above it for the walker on the far side)
const TRACK_H = 52; // road loop height (fully rounded ends)
const GAP_X = 56; // lg:gap-x-14
const LAP_MS = 24000; // one full lap = six steps, about 4 s each
const WALKER_H = 36; // px, the walker's height
const SIDE_W = Math.round((WALKER_H * 346) / 596); // side view keeps the Lottie crop's proportions
const STRIDE_PX = 30; // road length per walk cycle (two steps)

// What the walker carries at each step, drawn in the Lottie hand layer's own units (about 10 units per screen px),
// held where the trekking pole's grip used to be.
const HAND = { x: 25, y: 127 };
function StepTool({ step }: { step: number }) {
  const { x, y } = HAND;
  const navy = "#002F5B";
  const orange = "#F76011";
  const paper = "#FFF5EC";
  switch (step) {
    case 0: // Research: a folded map
      return (
        <g transform={`translate(${x - 46} ${y - 70})`}>
          <path d="M0 8 L30 0 L62 8 L92 0 L92 64 L62 72 L30 64 L0 72 Z" fill={paper} stroke={navy} strokeWidth={5} strokeLinejoin="round" />
          <path d="M30 0 V64 M62 8 V72" stroke={navy} strokeWidth={4} />
          <path d="M10 40 Q24 26 40 38 T78 30" stroke="#94A3B8" strokeWidth={5} fill="none" />
        </g>
      );
    case 1: // Goals: a compass
      return (
        <g transform={`translate(${x} ${y - 30})`}>
          <circle r={40} fill="#FFFFFF" stroke={navy} strokeWidth={8} />
          <path d="M0 -30 L9 0 L0 30 L-9 0 Z" fill={navy} />
          <path d="M0 -30 L9 0 L-9 0 Z" fill={orange} />
          <circle r={5} fill={navy} />
        </g>
      );
    case 2: // Plan: the map with the route drawn on it
      return (
        <g transform={`translate(${x - 46} ${y - 70})`}>
          <path d="M0 8 L30 0 L62 8 L92 0 L92 64 L62 72 L30 64 L0 72 Z" fill={paper} stroke={navy} strokeWidth={5} strokeLinejoin="round" />
          <path d="M12 58 Q30 50 34 34 T70 22" stroke={orange} strokeWidth={6} strokeDasharray="10 7" fill="none" strokeLinecap="round" />
          <path d="M70 26 V4 L86 10 L70 16" fill={orange} stroke={orange} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={12} cy={58} r={6} fill={navy} />
        </g>
      );
    case 3: // Do: a wrench
      return (
        <g transform={`translate(${x} ${y}) rotate(-35)`}>
          <rect x={-7} y={-96} width={14} height={86} rx={6} fill={navy} />
          <path d="M-22 -112 a24 24 0 1 0 44 0 l-10 0 l0 14 l-24 0 l0 -14 Z" fill={navy} />
        </g>
      );
    case 4: // Check: a clipboard with ticks
      return (
        <g transform={`translate(${x - 36} ${y - 92})`}>
          <rect x={0} y={6} width={72} height={92} rx={8} fill={navy} />
          <rect x={8} y={16} width={56} height={74} rx={4} fill="#FFFFFF" />
          <rect x={22} y={0} width={28} height={14} rx={5} fill="#94A3B8" />
          <path d="M16 34 l7 7 l12 -14 M16 62 l7 7 l12 -14" stroke={orange} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 36 H56 M42 64 H56" stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    default: // Act: the flag that marks the new standard
      return (
        <g transform={`translate(${x} ${y})`}>
          <rect x={-4} y={-150} width={8} height={170} rx={4} fill={navy} />
          <path d="M4 -148 L74 -128 L4 -106 Z" fill={orange} />
        </g>
      );
  }
}

// A looping road between the two rows of steps. A walker goes round it clockwise, carrying the tool of the step he has
// most recently passed (that step is "active": its letter lights up in the centre, its connector and its box are
// highlighted). He walks in profile along the straights and turns at the bends: towards the viewer at the right end,
// away from the viewer at the left end.
export default function RgpdcaLoop({ steps }: { steps: RgpdcaStep[] }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<TrekkerHandle>(null);
  const turnRef = useRef<TrekkerHandle>(null);
  const [leg, setLeg] = useState<"top" | "right" | "bottom" | "left">("top");
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
      if (!pathRef.current) return; // unmounted
      const p = pathRef.current.getPointAtLength(s);
      const part = s < topLen ? "top" : s < topLen + arc ? "right" : s < 2 * topLen + arc ? "bottom" : "left";
      // feet on the road; on the near side he walks back to the left, so the profile is mirrored
      const flip = part === "bottom" ? " scaleX(-1)" : "";
      if (walkerRef.current) walkerRef.current.style.transform = `translate(${p.x - SIDE_W / 2}px, ${p.y - WALKER_H}px)${flip}`;
      setLeg((prev) => (prev === part ? prev : part));
      const cycles = s / STRIDE_PX;
      sideRef.current?.setPhase(cycles);
      turnRef.current?.setPhase(cycles);
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
    <ol className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-14 lg:gap-y-0">
      {steps.map((item, i) => {
        const step = i + 1;
        const on = isOn(i);
        const arrow = ROW_ARROW[i];
        return (
          <li
            key={item.phase}
            className={`relative card-soft !transform-none p-6 lg:px-6 lg:py-4 transition-[box-shadow,outline-color] duration-500 outline outline-2 ${
              on && animate ? "outline-[#F76011] shadow-[0_18px_40px_-12px_rgba(247,96,17,0.35)]" : "outline-transparent"
            } ${PLACE[i]}`}
          >
            <div className="flex items-center gap-4">
              <span
                translate="no"
                className={`w-14 h-14 lg:w-11 lg:h-11 rounded-xl text-3xl lg:text-2xl font-extrabold flex items-center justify-center shrink-0 transition-colors duration-500 ${
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
            <h3 className="mt-4 lg:mt-3 text-lg lg:text-base font-semibold text-[#002F5B] leading-snug">{item.name}</h3>
            <p className="mt-2 lg:mt-1 text-xs font-semibold text-[#C9500E]">{item.action}</p>
            <p className="mt-3 lg:mt-2 text-sm lg:text-[13px] text-[#486581] leading-relaxed lg:leading-[1.55]">{item.content}</p>

            {arrow && (
              <span
                aria-hidden="true"
                className={`hidden lg:flex absolute w-9 h-9 rounded-full bg-[#F76011] text-white items-center justify-center shadow-md shadow-[#F76011]/30 ${arrow.pos}`}
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
            {/* the road: asphalt band with a dashed centre line, the inside of the loop left light */}
            <path d={d} fill="#FFF5EC" stroke="#3E5068" strokeWidth={9} strokeLinejoin="round" />
            <path ref={pathRef} d={d} fill="none" stroke="#FFFFFF" strokeWidth={1.4} strokeDasharray="7 7" />
          </svg>
        )}
        {/* the walker (drawn over the road and the letters); both views stay mounted, only one shows */}
        {w > 0 && (
          <div
            ref={walkerRef}
            className="absolute left-0 top-0 z-10 will-change-transform"
            style={{ width: SIDE_W, height: WALKER_H, transform: `translate(${x0 + r - SIDE_W / 2}px, ${yTop - WALKER_H}px)` }}
          >
            <TrekkerLottie
              ref={sideRef}
              src="/lottie/trekker-walk.json"
              className={`w-full h-full ${leg === "top" || leg === "bottom" ? "" : "invisible"}`}
              inHand={<StepTool step={animate ? active : 0} />}
            />
            <BackTrekker
              ref={turnRef}
              poles={false}
              facing={leg === "right" ? "front" : "back"}
              className={`absolute top-0 left-1/2 -translate-x-1/2 h-full ${leg === "top" || leg === "bottom" ? "invisible" : ""}`}
            />
          </div>
        )}
        {/* letters light up one by one as the cycle passes each step */}
        <div className="absolute inset-x-0 flex items-center justify-center gap-4" style={{ top: TRACK_Y, height: TRACK_H }}>
          {steps.map((item, i) => (
            <span
              key={item.phase}
              className={`text-xl font-extrabold transition-all duration-500 ${
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
