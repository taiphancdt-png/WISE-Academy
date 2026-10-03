"use client";

import React, { useEffect, useRef, useState } from "react";
import { RefreshCw } from "@/components/icons";
import RunnerFigure, { POSES, blendPose, runPose, type RunnerHandle } from "@/components/RunnerFigure";

export interface RoadmapStage {
  name: string;
  short: string;
  time: string;
  objective: string;
  outcome: string;
}

const START = 4;
const LAP_END = 104; // the runner leaves the track on the right and starts a new lap from the left
const BASE_SPEED = 0.0034; // % of track per ms when nobody scrolls: a calm jog, about 5 s per stage
const MAX_SPEED = 0.026; // flat-out sprint while scrolling fast
const SCROLL_BOOST = 0.006; // extra speed per px/ms of scroll velocity
const BASE_CYCLE_MS = 900; // one gait cycle (two steps) at jogging pace
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

// Zig-zag track: from the start it climbs to stage 1, drops to stage 2, climbs to 3 ... and leaves on the right.
const TRACK_H = 270; // px height of the track area
const Y_LOW = 214;
const Y_HIGH = 128;
const TRACK_W = 34; // px width of the running surface
type Geo = { pts: [number, number][]; cum: number[]; total: number; cp: number[] };
function buildGeo(w: number): Geo {
  const pts = [0, 1, 2, 3, 4, 5, 6].map((k) => [(k / 6) * w, k % 2 ? Y_HIGH : Y_LOW] as [number, number]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  return { pts, cum, total, cp: [1, 2, 3, 4, 5].map((k) => (cum[k] / total) * 100) };
}
// point on the track at pct (% of its length); beyond either end it carries on horizontally
function pointAt(g: Geo, pct: number): [number, number] {
  const L = (pct / 100) * g.total;
  if (L <= 0) return [g.pts[0][0] + L, g.pts[0][1]];
  if (L >= g.total) return [g.pts[6][0] + (L - g.total), g.pts[6][1]];
  let i = 1;
  while (g.cum[i] < L) i++;
  const t = (L - g.cum[i - 1]) / (g.cum[i] - g.cum[i - 1]);
  const a = g.pts[i - 1], b = g.pts[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
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
    <section className="relative bg-gradient-to-b from-[#F3F7FC] via-white to-[#FFF3EA] text-[#002F5B] overflow-clip">
      <Stadium />
      {!reduce && <PinnedRace stages={stages} title={title} description={description} />}
      <StackedRace stages={stages} title={title} description={description} desktop={reduce} />
    </section>
  );
}

// Soft floodlight glow behind the whole section.
function Stadium() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#F76011]/[0.08] blur-3xl" />
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(247,96,17,0.14),transparent_65%)]" />
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
        <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9500E] ring-1 ring-[#F76011]/30 bg-[#F76011]/10">
          Lộ trình chuyển đổi
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl xl:text-[44px] font-semibold leading-[1.1] tracking-tight">{title}</h2>
      </div>
      <p className="lg:col-span-5 text-sm sm:text-base text-[#486581] leading-relaxed">{description}</p>
    </div>
  );
}

function StageBody({ stage }: { stage: RoadmapStage }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#486581]">Mục tiêu</p>
        <p className="mt-2 text-sm xl:text-[15px] text-[#334E68] leading-relaxed">{stage.objective}</p>
      </div>
      <div className="sm:border-l sm:border-[#002F5B]/10 sm:pl-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9500E]">Kết quả</p>
        <p className="mt-2 text-sm xl:text-[15px] text-[#002F5B] leading-relaxed font-medium">{stage.outcome}</p>
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
  const flipRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const [w, setW] = useState(0);
  const geoRef = useRef<Geo>(buildGeo(1));
  const [reached, setReached] = useState(0);
  const [lap, setLap] = useState(0);
  const curRef = useRef(START);

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
    // redraw the zig-zag in real pixels whenever the track width changes
    const ro = new ResizeObserver(([e]) => {
      geoRef.current = buildGeo(e.contentRect.width);
      setW(e.contentRect.width);
    });
    if (trackRef.current) ro.observe(trackRef.current);

    let raf = 0;
    let last = 0;
    let started = 0; // time the runner first came into view: "on your marks", "set", go
    let lastScroll = window.scrollY;
    let speed = 0;
    let phi = 0;
    let runW = 0; // 0 = in the blocks, 1 = full stride
    let laps = 0;
    figRef.current?.setPose(POSES.marks);
    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      if (!started) started = now;
      const t = now - started;

      // the runner never stops; scrolling (either way) pushes the pace up
      const scrollV = Math.abs(window.scrollY - lastScroll) / dt;
      lastScroll = window.scrollY;
      const inBlocks = laps === 0 && t < 1500;
      const targetSpeed = inBlocks ? 0 : Math.min(MAX_SPEED, BASE_SPEED + scrollV * SCROLL_BOOST);
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt / (targetSpeed > speed ? 220 : 650)));
      let cur = curRef.current + speed * dt;
      if (cur >= LAP_END) {
        cur = -LAP_END + 100; // re-enter from the left
        laps += 1;
        setLap(laps);
      }
      curRef.current = cur;

      // cadence and stride grow with speed but stay smooth and regular
      const pace = speed / BASE_SPEED;
      phi += (dt / (BASE_CYCLE_MS / Math.min(2.2, Math.sqrt(Math.max(pace, 0.01))))) * Math.PI * 2;
      runW += ((inBlocks ? 0 : 1) - runW) * (1 - Math.exp(-dt / 200));

      const base = inBlocks && t < 700 ? POSES.marks : POSES.set;
      const pose = blendPose(base, runPose(phi, Math.min(1.25, 0.85 + 0.12 * pace)), runW);
      figRef.current?.setPose(pose, runW * 2.2 * Math.abs(Math.sin(phi)));

      const geo = geoRef.current;
      const [x, y] = pointAt(geo, cur);
      if (runnerRef.current) runnerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (litRef.current) litRef.current.style.strokeDashoffset = String(geo.total * (1 - Math.max(0, Math.min(100, cur)) / 100));
      if (trailRef.current) trailRef.current.style.opacity = String(Math.max(0, Math.min(0.9, (pace - 1.4) / 3)));
      const n = geo.cp.filter((c) => cur >= c).length;
      setReached((prev) => (prev === n ? prev : n));
      raf = requestAnimationFrame(frame);
    };
    // Only animate while the section is on screen.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", setTop);
    };
  }, []);

  const active = Math.max(0, reached - 1);

  // Clicking a gate brings the runner up to that stage.
  const jumpTo = (i: number) => {
    curRef.current = geoRef.current.cp[i] - 1.5;
  };
  const geo = geoRef.current;
  const d = w ? geo.pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1]}`).join(" ") : "";
  const startPt = pointAt(geo, START);

  return (
    <div ref={wrapRef} className="hidden lg:block relative" style={{ height: "calc(100dvh + 120vh)" }}>
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
                  <div className="rounded-[2rem] p-2 bg-white/60 ring-1 ring-[#002F5B]/[0.08]">
                    <div className="rounded-[calc(2rem-0.5rem)] p-8 bg-white shadow-[0_24px_60px_-28px_rgba(0,47,91,0.35)]">
                      <StageBody stage={stage} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* the zig-zag race track */}
        <div ref={trackRef} className="relative mt-2 -mx-2" style={{ height: TRACK_H }}>
          {w > 0 && (
            <svg width={w} height={TRACK_H} className="absolute inset-0 overflow-visible" aria-hidden="true">
              <path d={d} fill="none" stroke="#C9500E" strokeOpacity={0.12} strokeWidth={TRACK_W + 14} strokeLinejoin="round" strokeLinecap="round" transform="translate(0 8)" />
              <path d={d} fill="none" stroke="#F6C7A9" strokeWidth={TRACK_W} strokeLinejoin="round" strokeLinecap="round" />
              <path
                ref={litRef}
                d={d}
                fill="none"
                stroke="#F76011"
                strokeWidth={TRACK_W}
                strokeLinejoin="round"
                strokeDasharray={geo.total}
                strokeDashoffset={geo.total * (1 - START / 100)}
              />
              {/* lane lines */}
              <path d={d} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={2} strokeLinejoin="round" transform="translate(0 -8)" />
              <path d={d} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={2} strokeLinejoin="round" transform="translate(0 8)" />
              {/* start line */}
              <line x1={startPt[0]} y1={startPt[1] - TRACK_W / 2} x2={startPt[0]} y2={startPt[1] + TRACK_W / 2} stroke="#fff" strokeWidth={5} />
            </svg>
          )}

          {/* checkpoint markers, with their stage name underneath (click to send the runner there) */}
          {w > 0 &&
            geo.pts.slice(1, 6).map((pt, i) => {
              const on = reached > i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="group absolute w-0 h-0 focus-visible:outline-none"
                  style={{ left: pt[0], top: pt[1] }}
                  aria-label={`Giai đoạn ${i + 1}: ${stages[i].short}`}
                >
                  <span
                    className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${EASE} group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-[#F76011] ${
                      on ? "bg-[#002F5B] text-white scale-110 ring-[3px] ring-white" : "bg-white text-[#C9500E] ring-2 ring-[#F76011]/30"
                    }`}
                  >
                    {pad(i + 1)}
                    {on && <span aria-hidden="true" className="gate-pulse absolute inset-0 rounded-full ring-2 ring-[#002F5B]" />}
                  </span>
                  {/* name above the peaks, below the valleys */}
                  <span
                    className={`absolute left-0 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${
                      i % 2 === 0 ? "bottom-[34px]" : "top-[34px]"
                    } ${on ? "text-[#002F5B]" : "text-[#486581]/70 group-hover:text-[#002F5B]"}`}
                  >
                    {stages[i].short}
                  </span>
                </button>
              );
            })}
          {w > 0 && (
            <>
              <span className="absolute -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#486581]" style={{ left: Math.max(40, startPt[0]), top: startPt[1] + 30 }}>
                Xuất phát
              </span>
              <span className="absolute right-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9500E]" style={{ top: Y_LOW + 30 }}>
                <RefreshCw weight="bold" className="w-4 h-4" /> {lap > 0 ? `Vòng ${lap + 1}` : "Liên tục"}
              </span>
            </>
          )}

          {/* runner, positioned by transform only */}
          <div ref={runnerRef} className="absolute left-0 top-0 z-10 will-change-transform pointer-events-none">
            <div className="absolute bottom-[-10px] left-0 -translate-x-1/2 flex flex-col items-center">
              {/* speed lines while running */}
              <div ref={trailRef} className="absolute right-[70%] top-[35%] flex flex-col gap-2 opacity-0" aria-hidden="true">
                <span className="block h-[3px] w-14 rounded-full bg-gradient-to-l from-[#002F5B]/50 to-transparent" />
                <span className="block h-[3px] w-20 rounded-full bg-gradient-to-l from-[#FF8A3D] to-transparent ml-4" />
                <span className="block h-[3px] w-10 rounded-full bg-gradient-to-l from-[#002F5B]/30 to-transparent ml-8" />
              </div>
              <div ref={flipRef} className="relative">
                <RunnerFigure ref={figRef} className="relative w-40 h-[140px] drop-shadow-[0_6px_8px_rgba(0,47,91,0.25)]" />
              </div>
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
              <span aria-hidden="true" className={`absolute left-[19px] top-0 -bottom-6 w-1 rounded-full ${i === stages.length - 1 ? "bg-transparent" : "bg-[#002F5B]/10"} overflow-hidden`}>
                <span className={`block w-full bg-[#F76011] origin-top transition-transform duration-700 ${EASE} ${on && i < stages.length - 1 ? "scale-y-100" : "scale-y-0"}`} style={{ height: "100%" }} />
              </span>
              <span
                aria-hidden="true"
                className={`absolute left-0 top-7 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
                  isActive ? "bg-white ring-2 ring-[#F76011] shadow-md" : on ? "bg-[#F76011] text-white" : "bg-white text-[#C9500E] ring-1 ring-[#F76011]/30"
                }`}
              >
                {isActive ? <JoggingRunner /> : pad(i + 1)}
              </span>
              <div className={`rounded-[1.75rem] p-1.5 ring-1 transition-all duration-700 ${EASE} ${on ? "bg-white/70 ring-[#F76011]/40 opacity-100" : "bg-white/50 ring-[#002F5B]/10 opacity-60"}`}>
                <div className="rounded-[calc(1.75rem-0.375rem)] p-6 bg-white shadow-[0_18px_40px_-24px_rgba(0,47,91,0.35)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold text-[#F76011]">{pad(i + 1)}</span>
                    <span className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-[#FFF1E8] text-[#C9500E]">{stage.time}</span>
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
      const phi = ((now - t0) / 820) * Math.PI * 2;
      ref.current?.setPose(runPose(phi), 2.2 * Math.abs(Math.sin(phi)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <RunnerFigure ref={ref} className="w-10 h-9" />;
}
