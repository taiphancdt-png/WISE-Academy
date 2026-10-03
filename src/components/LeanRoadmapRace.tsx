"use client";

import React, { useEffect, useRef, useState } from "react";
import { FlagCheckered } from "@/components/icons";
import RunnerFigure, { POSES, blendPose, runPose, type RunnerHandle } from "@/components/RunnerFigure";

export interface RoadmapStage {
  name: string;
  short: string;
  time: string;
  objective: string;
  outcome: string;
}

const CHECKPOINTS = [1, 2, 3, 4, 5].map((k) => (k / 6) * 100);
const START = 4;
const FINISH = 98;
const RUN_SHARE = 0.4; // share of each stage's scroll spent running to its checkpoint; the rest is reading time
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

const START_SHARE = 0.2; // first part of stage 1: "on your marks", then "set", before the runner pushes off
const STRIDE_PX = 74; // ground covered by one full gait cycle

// Scroll progress (0..1) through the pinned section -> runner position on the track (% of width).
// Each stage owns 1/5 of the scroll: run to its checkpoint, then hold so the panel can be read.
// Returns startT (0..1) while the runner is still in the blocks.
function raceAt(p: number): { pos: number; startT: number | null } {
  const n = CHECKPOINTS.length;
  const seg = Math.min(n - 1, Math.floor(p * n));
  const k = p * n - seg;
  const to = CHECKPOINTS[seg];
  if (seg === 0) {
    if (k < START_SHARE) return { pos: START, startT: k / START_SHARE };
    const run = (k - START_SHARE) / RUN_SHARE;
    return { pos: run < 1 ? START + (to - START) * run : to, startT: null };
  }
  const from = CHECKPOINTS[seg - 1];
  if (k < RUN_SHARE) return { pos: from + (to - from) * (k / RUN_SHARE), startT: null };
  if (seg < n - 1) return { pos: to, startT: null };
  // last stage: hold, then sprint to the finish line
  const tail = (k - RUN_SHARE) / (1 - RUN_SHARE);
  return { pos: tail < 0.5 ? to : to + (FINISH - to) * ((tail - 0.5) / 0.5), startT: null };
}

export default function LeanRoadmapRace({
  stages,
  title,
  description,
}: {
  stages: RoadmapStage[];
  title: React.ReactNode;
  description: string;
}) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  return (
    <section className="relative bg-[#001E38] text-white overflow-clip">
      <Stadium />
      {!reduce && <PinnedRace stages={stages} title={title} description={description} />}
      <StackedRace stages={stages} title={title} description={description} desktop={reduce} />
    </section>
  );
}

// Floodlight glow and faint lane lines behind the whole section.
function Stadium() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#F76011]/[0.07] blur-3xl" />
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(247,96,17,0.12),transparent_65%)]" />
      <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_120px)]" />
    </div>
  );
}

function Header({ title, description }: { title: React.ReactNode; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-12 gap-4 lg:gap-10 items-end transition-all duration-1000 ${EASE} motion-reduce:transition-none ${
        seen ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-sm motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:blur-0"
      }`}
    >
      <div className="lg:col-span-7">
        <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF9A5C] ring-1 ring-[#F76011]/40 bg-[#F76011]/10">
          Lộ trình chuyển đổi
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl xl:text-[44px] font-semibold leading-[1.1] tracking-tight">{title}</h2>
      </div>
      <p className="lg:col-span-5 text-sm sm:text-base text-white/65 leading-relaxed">{description}</p>
    </div>
  );
}

function StageBody({ stage }: { stage: RoadmapStage }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Mục tiêu</p>
        <p className="mt-2 text-sm xl:text-[15px] text-white/80 leading-relaxed">{stage.objective}</p>
      </div>
      <div className="sm:border-l sm:border-white/10 sm:pl-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF9A5C]">Kết quả</p>
        <p className="mt-2 text-sm xl:text-[15px] text-white leading-relaxed font-medium">{stage.outcome}</p>
      </div>
    </div>
  );
}

/* ---------- Desktop: the section pins while scrolling and the runner covers the track ---------- */

function PinnedRace({ stages, title, description }: { stages: RoadmapStage[]; title: React.ReactNode; description: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<RunnerHandle>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;

    // Pin just below the sticky site header.
    const header = document.querySelector("header");
    const setTop = () => {
      const h = header?.getBoundingClientRect().height ?? 0;
      sticky.style.top = `${h}px`;
      sticky.style.height = `calc(100dvh - ${h}px)`;
    };
    setTop();
    window.addEventListener("resize", setTop);

    let raf = 0;
    let lastPx = -1;
    let phi = 0;
    let runW = 0; // 0 = standing / in the blocks, 1 = full stride
    figRef.current?.setPose(POSES.marks);
    const frame = () => {
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - sticky.offsetHeight;
      const p = Math.min(1, Math.max(0, -(rect.top - (parseFloat(sticky.style.top) || 0)) / span));
      const { pos, startT } = raceAt(p);
      const w = trackRef.current?.offsetWidth ?? 0;
      const px = (pos / 100) * w;
      const dx = lastPx < 0 ? 0 : px - lastPx;
      lastPx = px;

      // legs move with the ground covered, so the stride always matches the speed (also when scrolling back)
      phi += (dx / STRIDE_PX) * Math.PI * 2;
      const moving = Math.abs(dx) > 0.05;
      runW += ((moving ? 1 : 0) - runW) * (moving ? 0.22 : 0.07);

      // base pose: in the blocks ("on your marks" -> "set") or standing at a checkpoint
      let base = POSES.stand;
      if (startT !== null) base = startT < 0.45 ? POSES.marks : blendPose(POSES.marks, POSES.set, Math.min(1, (startT - 0.45) / 0.4));
      else if (pos <= START + 0.01) base = POSES.set;
      const pose = blendPose(base, runPose(phi, Math.min(1, 0.55 + Math.abs(dx) / 6)), runW);
      figRef.current?.setPose(pose, runW * 2.6 * Math.abs(Math.sin(phi)));

      if (runnerRef.current) runnerRef.current.style.transform = `translateX(${px}px)`;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pos / 100})`;
      if (trailRef.current) trailRef.current.style.opacity = String(Math.min(1, runW * Math.min(1, Math.abs(dx) / 2)));
      const n = CHECKPOINTS.filter((c) => pos >= c - 0.01).length;
      setReached((prev) => (prev === n ? prev : n));
      const f = pos >= FINISH - 0.2;
      setFinished((prev) => (prev === f ? prev : f));
      raf = requestAnimationFrame(frame);
    };
    // Only animate while the section is on screen.
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

  const active = Math.max(0, reached - 1);

  // Clicking a gate scrolls to the moment that stage is fully read.
  const jumpTo = (i: number) => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;
    const span = wrap.offsetHeight - sticky.offsetHeight;
    const p = (i + RUN_SHARE + 0.2) / stages.length;
    const top = wrap.getBoundingClientRect().top + window.scrollY - (parseFloat(sticky.style.top) || 0);
    window.scrollTo({ top: top + p * span, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} className="hidden lg:block relative" style={{ height: "calc(100dvh + 300vh)" }}>
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] flex flex-col max-w-7xl mx-auto px-8 pt-12 pb-10">
        <Header title={title} description={description} />

        {/* the stage being run: big number, name and the two outcome columns */}
        <div className="relative flex-1 min-h-0 mt-8">
          {stages.map((stage, i) => {
            const on = i === active;
            return (
              <article
                key={stage.name}
                aria-hidden={!on}
                className={`absolute inset-0 grid grid-cols-12 gap-10 items-center transition-all duration-700 ${EASE} ${
                  on ? "opacity-100 translate-y-0 blur-0" : i < active ? "opacity-0 -translate-y-10 blur-md pointer-events-none" : "opacity-0 translate-y-10 blur-md pointer-events-none"
                }`}
              >
                <div className="col-span-5 relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -top-16 -left-2 text-[200px] xl:text-[240px] font-bold leading-none select-none [-webkit-text-stroke:1.5px_rgba(247,96,17,0.45)] transition-colors duration-[1200ms] ${EASE} ${on ? "text-[#F76011]/[0.12]" : "text-transparent"}`}
                  >
                    {pad(i + 1)}
                  </span>
                  <div className="relative">
                    <span className="inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#F76011] text-white">{stage.time}</span>
                    <h3 className="mt-5 text-3xl xl:text-[40px] font-semibold leading-[1.12] tracking-tight [text-wrap:balance]">{stage.name}</h3>
                  </div>
                </div>
                <div className="col-span-7">
                  <div className="rounded-[2rem] p-2 bg-white/[0.04] ring-1 ring-white/10">
                    <div className="rounded-[calc(2rem-0.5rem)] p-8 bg-[#002F5B]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <StageBody stage={stage} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* the race track */}
        <div className="relative mt-6 pt-24">
          <div ref={trackRef} className="relative h-14 rounded-2xl bg-[#0A3A66] ring-1 ring-white/10 overflow-hidden">
            {/* lit part of the track, up to the runner */}
            <div ref={fillRef} className="absolute inset-0 origin-left bg-gradient-to-r from-[#C9500E] via-[#F76011] to-[#FF8A3D]" style={{ transform: `scaleX(${START / 100})` }} />
            {/* lane lines */}
            <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-white/25" />
            <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-white/25" />
            {/* start line and checkered finish */}
            <div className="absolute inset-y-0 left-[4%] w-1 bg-white/70" />
            <div className={`absolute inset-y-0 right-0 w-[2%] bg-[repeating-conic-gradient(#fff_0_25%,#001E38_0_50%)] bg-[length:12px_12px] transition-opacity duration-500 ${finished ? "opacity-100" : "opacity-60"}`} />
            {/* checkpoint markers */}
            {CHECKPOINTS.map((c, i) => (
              <span
                key={c}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${EASE} ${
                  reached > i ? "bg-white text-[#C9500E] scale-110" : "bg-[#002F5B] text-white/60 ring-1 ring-white/20"
                }`}
                style={{ left: `${c}%` }}
              >
                {pad(i + 1)}
                {reached > i && <span aria-hidden="true" className="gate-pulse absolute inset-0 rounded-full ring-2 ring-white" />}
              </span>
            ))}
          </div>

          {/* below the track: start, the five gates (click to jump), finish */}
          <div className="relative mt-2 h-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            <span className="absolute left-0 top-3">Xuất phát</span>
            {CHECKPOINTS.map((c, i) => {
              const on = reached > i;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="group absolute top-0 -translate-x-1/2 flex flex-col items-center gap-1 rounded-md px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F76011]"
                  style={{ left: `${c}%` }}
                >
                  <span className={`w-px h-2.5 transition-colors duration-500 ${on ? "bg-[#F76011]" : "bg-white/20"}`} />
                  <span className={`uppercase tracking-[0.16em] transition-colors duration-500 ${on ? "text-white" : "text-white/40 group-hover:text-white/75"}`}>{stages[i].short}</span>
                </button>
              );
            })}
            <span className={`absolute right-0 top-3 flex items-center gap-1.5 transition-colors duration-500 ${finished ? "text-[#FF9A5C]" : ""}`}>
              <FlagCheckered weight="fill" className={`w-4 h-4 ${finished ? "finish-wave" : ""}`} /> Về đích
            </span>
          </div>

          {/* runner, positioned by transform only */}
          <div ref={runnerRef} className="absolute left-0 bottom-[92px] will-change-transform" style={{ transform: "translateX(0px)" }}>
            <div className="-translate-x-1/2 flex flex-col items-center">
              {/* speed lines while running */}
              <div ref={trailRef} className="absolute right-[70%] top-[35%] flex flex-col gap-2 opacity-0" aria-hidden="true">
                <span className="block h-[3px] w-14 rounded-full bg-gradient-to-l from-white/70 to-transparent" />
                <span className="block h-[3px] w-20 rounded-full bg-gradient-to-l from-[#FF8A3D] to-transparent ml-4" />
                <span className="block h-[3px] w-10 rounded-full bg-gradient-to-l from-white/50 to-transparent ml-8" />
              </div>
              <RunnerFigure ref={figRef} className="relative w-36 h-[116px] drop-shadow-[0_6px_10px_rgba(247,96,17,0.4)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile and reduced motion: stacked stages, the rail fills as each one scrolls past ---------- */

function StackedRace({
  stages,
  title,
  description,
  desktop,
}: {
  stages: RoadmapStage[];
  title: React.ReactNode;
  description: string;
  desktop: boolean;
}) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = refs.current.indexOf(e.target as HTMLLIElement);
          setReached((prev) => Math.max(prev, i + 1));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${desktop ? "" : "lg:hidden"} relative max-w-7xl mx-auto px-4 sm:px-6 py-20`}>
      <Header title={title} description={description} />
      <ol className="mt-12 space-y-6">
        {stages.map((stage, i) => {
          const on = desktop || reached > i;
          const isActive = !desktop && reached - 1 === i;
          return (
            <li key={stage.name} ref={(el) => { refs.current[i] = el; }} className="relative pl-14">
              <span aria-hidden="true" className={`absolute left-[19px] top-0 -bottom-6 w-1 rounded-full ${i === stages.length - 1 ? "bg-transparent" : "bg-white/10"} overflow-hidden`}>
                <span className={`block w-full bg-[#F76011] origin-top transition-transform duration-700 ${EASE} ${on && i < stages.length - 1 ? "scale-y-100" : "scale-y-0"}`} style={{ height: "100%" }} />
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-0 top-7 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
                  on ? "bg-[#F76011] text-white" : "bg-[#0A3A66] text-white/60 ring-1 ring-white/20"
                }`}
              >
                {isActive ? <JoggingRunner /> : pad(i + 1)}
              </span>
              <div className={`rounded-[1.75rem] p-1.5 ring-1 transition-all duration-700 ${EASE} ${on ? "bg-white/[0.05] ring-[#F76011]/40 opacity-100" : "bg-white/[0.03] ring-white/10 opacity-50"}`}>
                <div className="rounded-[calc(1.75rem-0.375rem)] p-6 bg-[#002F5B]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold text-[#FF8A3D]">{pad(i + 1)}</span>
                    <span className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-white/10 text-white/85">{stage.time}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug">{stage.name}</h3>
                  <div className="mt-4">
                    <StageBody stage={stage} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Small runner jogging on the spot (marks the current stage on mobile).
function JoggingRunner() {
  const ref = useRef<RunnerHandle>(null);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const phi = ((now - t0) / 620) * Math.PI * 2;
      ref.current?.setPose(runPose(phi), 2.4 * Math.abs(Math.sin(phi)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <RunnerFigure ref={ref} className="w-9 h-8" />;
}
