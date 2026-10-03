"use client";

import React, { useEffect, useRef, useState } from "react";
import { FlagCheckered, Runner } from "@/components/icons";

export interface RoadmapStage {
  name: string;
  time: string;
  objective: string;
  outcome: string;
}

// Desktop layout: cards zig-zag around a running track. Stages 1, 3, 5 sit above it, stages 2 and 4 below,
// each centred on its checkpoint at k/6 of the width.
const PLACE = [
  "lg:col-start-1 lg:row-start-1 lg:self-end",
  "lg:col-start-2 lg:row-start-3 lg:self-start",
  "lg:col-start-3 lg:row-start-1 lg:self-end",
  "lg:col-start-4 lg:row-start-3 lg:self-start",
  "lg:col-start-5 lg:row-start-1 lg:self-end",
];
const CHECKPOINTS = [1, 2, 3, 4, 5].map((k) => (k / 6) * 100);
const START = 3;
const FINISH = 97;
const SPEED = 0.0135; // % of track per ms
const PAUSE_MS = 900; // stop at each checkpoint
const FINISH_HOLD_MS = 2600; // rest at the finish line before the next lap
const TRACK_ROW = 120;

type Segment = { t0: number; t1: number; from: number; to: number };

// Timeline of one lap: run to each checkpoint, pause, run to the finish, hold.
function buildLap() {
  const segs: Segment[] = [];
  let t = 0;
  let pos = START;
  for (const target of [...CHECKPOINTS, FINISH]) {
    const run = (target - pos) / SPEED;
    segs.push({ t0: t, t1: t + run, from: pos, to: target });
    t += run;
    pos = target;
    const hold = target === FINISH ? FINISH_HOLD_MS : PAUSE_MS;
    segs.push({ t0: t, t1: t + hold, from: pos, to: pos });
    t += hold;
  }
  return { segs, total: t };
}

export default function LeanRoadmapRace({ stages }: { stages: RoadmapStage[] }) {
  const rootRef = useRef<HTMLOListElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0); // number of checkpoints the runner has passed
  const [moving, setMoving] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
      setReached(stages.length);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const { segs, total } = buildLap();
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      const t = (now - start) % total;
      const seg = segs.find((s) => t < s.t1) ?? segs[segs.length - 1];
      const k = seg.t1 > seg.t0 ? (t - seg.t0) / (seg.t1 - seg.t0) : 1;
      const pos = seg.from + (seg.to - seg.from) * k;
      if (runnerRef.current) runnerRef.current.style.left = `${pos}%`;
      if (fillRef.current) fillRef.current.style.width = `${pos}%`;
      const n = CHECKPOINTS.filter((c) => pos >= c - 0.01).length;
      setReached((prev) => (prev === n ? prev : n));
      const m = seg.to !== seg.from;
      setMoving((prev) => (prev === m ? prev : m));
      raf = requestAnimationFrame(tick);
    };

    // Start the race only once the roadmap scrolls into view, so it is seen from stage 1.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        start = performance.now();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stages.length]);

  const lit = (i: number) => reached > i;
  const active = animate ? reached - 1 : -1;

  return (
    <ol ref={rootRef} className="relative grid grid-cols-1 lg:grid-cols-6 gap-y-6 lg:gap-x-6 lg:gap-y-0">
      {stages.map((stage, i) => {
        const on = lit(i);
        const isActive = i === active;
        return (
          <li key={stage.name} className={`relative pl-12 lg:pl-0 lg:col-span-2 ${PLACE[i]}`}>
            {/* mobile rail */}
            <span aria-hidden="true" className="lg:hidden absolute left-[15px] top-0 bottom-[-24px] w-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <span className={`block w-full bg-[#F76011] transition-[height] duration-700 ${on ? "h-full" : "h-0"}`} />
            </span>
            <span
              aria-hidden="true"
              className={`lg:hidden absolute left-0 top-6 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-500 ${
                on ? "bg-[#F76011] border-[#F76011] text-white" : "bg-white border-[#CBD5E1] text-[#002F5B]"
              }`}
            >
              {isActive ? <Runner weight="fill" className={`w-5 h-5 ${moving ? "runner-bob" : ""}`} /> : String(i + 1).padStart(2, "0")}
            </span>

            <div
              className={`card-soft !transform-none p-6 outline outline-2 transition-all duration-700 ${
                on ? "opacity-100 outline-[#F76011]/70" : "opacity-50 outline-transparent"
              } ${isActive ? "shadow-[0_18px_40px_-12px_rgba(247,96,17,0.4)] !outline-[#F76011]" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`text-3xl font-bold transition-colors duration-500 ${on ? "text-[#F76011]" : "text-[#002F5B]/40"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full text-right transition-colors duration-500 ${
                    on ? "bg-[#FFF1E8] text-[#C9500E]" : "bg-[#EBF3FA] text-[#002F5B]"
                  }`}
                >
                  {stage.time}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#002F5B] leading-snug">{stage.name}</h3>
              <p className="mt-3 text-sm text-[#486581] leading-relaxed">
                <span className="font-semibold text-[#002F5B]">Mục tiêu: </span>
                {stage.objective}
              </p>
              <p className="mt-2 text-sm text-[#486581] leading-relaxed">
                <span className="font-semibold text-[#C9500E]">Kết quả: </span>
                {stage.outcome}
              </p>
            </div>
          </li>
        );
      })}

      {/* Running track (desktop) */}
      <li aria-hidden="true" className="hidden lg:block relative col-span-6 row-start-2 list-none" style={{ height: TRACK_ROW }}>
        {/* connectors from each card to its checkpoint */}
        {CHECKPOINTS.map((c, i) => (
          <span
            key={c}
            className={`absolute w-0.5 transition-colors duration-500 ${lit(i) ? "bg-[#F76011]" : "bg-[#CBD5E1]"} ${
              i % 2 === 0 ? "top-0 h-1/2" : "bottom-0 h-1/2"
            }`}
            style={{ left: `calc(${c}% - 1px)` }}
          />
        ))}

        {/* the track: navy lanes, lit in orange up to the runner */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 rounded-full bg-[#002F5B] overflow-hidden shadow-inner">
          <div ref={fillRef} className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9500E] to-[#F76011]" style={{ width: animate ? `${START}%` : "100%" }} />
          <div className="absolute inset-x-0 top-[30%] border-t border-dashed border-white/40" />
          <div className="absolute inset-x-0 top-[70%] border-t border-dashed border-white/40" />
        </div>

        {/* start and finish */}
        <span className="absolute left-0 -bottom-1 text-[11px] font-bold uppercase tracking-wider text-[#486581]">Xuất phát</span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#002F5B] flex items-center justify-center text-[#002F5B]">
          <FlagCheckered weight="fill" className="w-5 h-5" />
        </span>

        {/* checkpoints */}
        {CHECKPOINTS.map((c, i) => (
          <span
            key={c}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-[3px] flex items-center justify-center text-sm font-bold transition-all duration-500 ${
              lit(i) ? "bg-[#F76011] border-white text-white shadow-[0_0_0_6px_rgba(247,96,17,0.25)]" : "bg-white border-[#CBD5E1] text-[#002F5B]"
            } ${i === active ? "scale-110" : ""}`}
            style={{ left: `${c}%` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}

        {/* the runner, feet on the track */}
        <div
          ref={runnerRef}
          className="absolute -translate-x-1/2 z-10"
          style={{ left: animate ? `${START}%` : `${FINISH}%`, bottom: TRACK_ROW / 2 + 12 }}
        >
          <div className={`relative ${moving ? "runner-bob" : ""}`}>
            <Runner weight="fill" className="w-14 h-14 text-[#F76011] drop-shadow-[0_4px_6px_rgba(0,47,91,0.35)]" />
          </div>
        </div>
      </li>
    </ol>
  );
}
