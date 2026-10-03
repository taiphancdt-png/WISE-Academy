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

const START = 2;
const SUMMIT_HOLD_MS = 2800; // celebrate on the summit, then start a new climb from the foot
const BASE_SPEED = 0.0034; // % of track per ms when nobody scrolls: a calm jog, about 5 s per stage
const MAX_SPEED = 0.026; // flat-out sprint while scrolling fast
const SCROLL_BOOST = 0.006; // extra speed per px/ms of scroll velocity
const BASE_CYCLE_MS = 900; // one gait cycle (two steps) at jogging pace
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

// One jagged peak with snow down its left ridge; a road winds up from the foot in an S, wide in front and
// narrowing with height, with the 5 stages at its bends and stage 5 on the summit.
// Points are fractions of the mountain box (x of width, y of height).
const PEAK: [number, number] = [0.493, 0.035];
const MOUNTAIN: [number, number][] = [
  [0.04, 1], [0.12, 0.88], [0.17, 0.8], [0.22, 0.68], [0.26, 0.56], [0.27, 0.535], [0.3, 0.547],
  [0.36, 0.35], [0.4, 0.31], PEAK, [0.52, 0.1], [0.53, 0.16], [0.564, 0.215], [0.584, 0.31],
  [0.628, 0.38], [0.64, 0.45], [0.678, 0.49], [0.705, 0.575], [0.738, 0.61], [0.79, 0.755],
  [0.846, 0.815], [0.92, 0.9], [1, 1],
];
// snow: the left ridge from the peak down, with a ragged inner edge
const SNOW: [number, number][] = [
  PEAK, [0.4, 0.31], [0.36, 0.35], [0.3, 0.547], [0.35, 0.49], [0.385, 0.455], [0.41, 0.44], [0.418, 0.39],
  [0.445, 0.395], [0.468, 0.345], [0.49, 0.31], [0.508, 0.26], [0.488, 0.205], [0.505, 0.13],
];
const TRAIL: [number, number][] = [
  [0.6, 1],
  [0.4, 0.64],
  [0.56, 0.48],
  [0.47, 0.38],
  [0.525, 0.25],
  [PEAK[0], PEAK[1] + 0.03],
];
const ROAD_W = 0.085; // road width at the foot, as a share of the box width
type Geo = { w: number; h: number; ox: number; oy: number; mw: number; mh: number; bends: [number, number][]; pts: [number, number][]; cum: number[]; total: number; cp: number[] };
const SAMPLES = 24; // per bend, to follow the smooth curve
const ASPECT = 1.5; // mountain width : height, as in the reference silhouette
function buildGeo(w: number, h: number): Geo {
  const mw = Math.min(w, h * ASPECT), mh = mw / ASPECT;
  const ox = (w - mw) / 2, oy = h - mh;
  const bends = TRAIL.map(([x, y]) => [ox + x * mw, oy + y * mh] as [number, number]);
  // Catmull-Rom spline through the bends, sampled into a fine polyline
  const pts: [number, number][] = [];
  const at = (i: number) => bends[Math.max(0, Math.min(bends.length - 1, i))];
  for (let i = 0; i < bends.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 0; k < SAMPLES; k++) {
      const t = k / SAMPLES, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(bends[bends.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1] || 1;
  return { w, h, ox, oy, mw, mh, bends, pts, cum, total, cp: [1, 2, 3, 4, 5].map((k) => (cum[k * SAMPLES] / total) * 100) };
}
// point on the trail at pct (% of its length) and whether that stretch heads left
function pointAt(g: Geo, pct: number): { x: number; y: number; left: boolean } {
  const L = Math.max(0, Math.min(1, pct / 100)) * g.total;
  let i = 1;
  while (i < g.pts.length - 1 && g.cum[i] < L) i++;
  const t = (L - g.cum[i - 1]) / (g.cum[i] - g.cum[i - 1] || 1);
  const a = g.pts[i - 1], b = g.pts[i];
  // only face left on clearly leftward stretches, so gentle wiggles do not flip the climber
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, left: b[0] - a[0] < -0.4 * Math.abs(b[1] - a[1]) };
}

// Road as a filled shape that narrows with height (perspective), drawn up to pct of its length.
function roadPath(g: Geo, pct = 100) {
  const L = (Math.max(0, Math.min(100, pct)) / 100) * g.total;
  const pts: [number, number, number][] = [];
  for (let i = 0; i < g.pts.length; i++) {
    if (g.cum[i] > L) {
      const t = (L - g.cum[i - 1]) / (g.cum[i] - g.cum[i - 1] || 1);
      const a = g.pts[i - 1], b = g.pts[i];
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, L]);
      break;
    }
    pts.push([g.pts[i][0], g.pts[i][1], g.cum[i]]);
  }
  if (pts.length < 2) return "";
  const width = (len: number) => g.mw * ROAD_W * Math.pow(1 - len / g.total, 1.35) + 3;
  const left: string[] = [], right: string[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const n = Math.hypot(dx, dy) || 1;
    const hw = width(p[2]) / 2;
    left.push(`${(p[0] - (dy / n) * hw).toFixed(1)} ${(p[1] + (dx / n) * hw).toFixed(1)}`);
    right.push(`${(p[0] + (dy / n) * hw).toFixed(1)} ${(p[1] - (dx / n) * hw).toFixed(1)}`);
  });
  return `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;
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

function StageBody({ stage, stacked = false }: { stage: RoadmapStage; stacked?: boolean }) {
  return (
    <div className={`grid gap-5 ${stacked ? "" : "sm:grid-cols-2 sm:gap-8"}`}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#486581]">Mục tiêu</p>
        <p className="mt-2 text-sm xl:text-[15px] text-[#334E68] leading-relaxed">{stage.objective}</p>
      </div>
      <div className={stacked ? "border-t border-[#002F5B]/10 pt-5" : "sm:border-l sm:border-[#002F5B]/10 sm:pl-8"}>
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
  const boxRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<RunnerHandle>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const geoRef = useRef<Geo>(buildGeo(1, 1));
  const curRef = useRef(START);
  const [reached, setReached] = useState(0);
  const [summit, setSummit] = useState(false);
  const [climb, setClimb] = useState(1);

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
    // redraw the mountain in real pixels whenever its box changes
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      geoRef.current = buildGeo(width, height);
      setSize({ w: width, h: height });
    });
    if (boxRef.current) ro.observe(boxRef.current);

    let raf = 0;
    let last = 0;
    let started = 0; // first time in view: "on your marks", "set", go
    let lastScroll = window.scrollY;
    let speed = 0;
    let phi = 0;
    let runW = 0;
    let holdUntil = 0; // resting on the summit until this time
    let climbs = 1;
    figRef.current?.setPose(POSES.marks);

    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      if (!started) started = now;
      const t = now - started;

      // always climbing; scrolling (either way) pushes the pace up
      const scrollV = Math.abs(window.scrollY - lastScroll) / dt;
      lastScroll = window.scrollY;
      const inBlocks = climbs === 1 && t < 1500;
      const resting = now < holdUntil;
      const targetSpeed = inBlocks || resting ? 0 : Math.min(MAX_SPEED, BASE_SPEED + scrollV * SCROLL_BOOST);
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt / (targetSpeed > speed ? 220 : 400)));
      let cur = curRef.current + speed * dt;
      if (cur >= 100 && !resting && holdUntil === 0) {
        cur = 100;
        holdUntil = now + SUMMIT_HOLD_MS;
        setSummit(true);
      }
      if (holdUntil && now >= holdUntil) {
        // back to the foot of the mountain for the next climb
        holdUntil = 0;
        cur = START;
        speed = 0;
        climbs += 1;
        setClimb(climbs);
        setSummit(false);
      }
      cur = Math.min(100, cur);
      curRef.current = cur;

      const pace = speed / BASE_SPEED;
      phi += (dt / (BASE_CYCLE_MS / Math.min(2.2, Math.sqrt(Math.max(pace, 0.01))))) * Math.PI * 2;
      const moving = !inBlocks && !resting;
      runW += ((moving ? 1 : 0) - runW) * (1 - Math.exp(-dt / 220));

      const base = inBlocks ? (t < 700 ? POSES.marks : POSES.set) : POSES.stand;
      const pose = blendPose(base, runPose(phi, Math.min(1.25, 0.9 + 0.1 * pace)), runW);
      pose.torso += 10 * runW; // lean into the slope
      figRef.current?.setPose(pose, runW * 2 * Math.abs(Math.sin(phi)));

      const geo = geoRef.current;
      const pt = pointAt(geo, cur);
      // smaller as the climber gets higher (further away)
      if (runnerRef.current) runnerRef.current.style.transform = `translate(${pt.x}px, ${pt.y}px) scale(${1.1 - 0.55 * (cur / 100)})`;
      if (flipRef.current && moving) flipRef.current.style.transform = pt.left ? "scaleX(-1)" : "scaleX(1)";
      litRef.current?.setAttribute("d", roadPath(geo, cur));
      const n = geo.cp.filter((c) => cur >= c - 0.01).length;
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
  // Clicking a bend sends the climber up to that stage.
  const jumpTo = (i: number) => {
    curRef.current = geoRef.current.cp[i] - 1;
  };

  const geo = geoRef.current;
  const { w, h } = size;
  const X = (f: number) => geo.ox + f * geo.mw;
  const Y = (f: number) => geo.oy + f * geo.mh;
  const poly = (list: [number, number][]) => "M " + list.map(([x, y]) => `${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(" L ") + " Z";
  const peak = [X(PEAK[0]), Y(PEAK[1])];

  return (
    <div ref={wrapRef} className="hidden lg:block relative" style={{ height: "calc(100dvh + 120vh)" }}>
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] flex flex-col max-w-7xl mx-auto px-8 pt-10 pb-8">
        <Header title={title} description={description} />

        <div className="flex-1 min-h-0 mt-6 grid grid-cols-12 gap-10">
          {/* the stage being climbed */}
          <div className="col-span-5 relative">
            {stages.map((stage, i) => {
              const on = i === active;
              return (
                <article
                  key={stage.name}
                  aria-hidden={!on}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${EASE} ${
                    on ? "opacity-100 translate-y-0 blur-0" : i < active ? "opacity-0 -translate-y-10 blur-md pointer-events-none" : "opacity-0 translate-y-10 blur-md pointer-events-none"
                  }`}
                >
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -top-24 -left-2 text-[170px] xl:text-[200px] font-bold leading-none select-none [-webkit-text-stroke:1.5px_rgba(247,96,17,0.45)] transition-colors duration-[1200ms] ${EASE} ${on ? "text-[#F76011]/[0.1]" : "text-transparent"}`}
                    >
                      {pad(i + 1)}
                    </span>
                    <div className="relative">
                      <span className="inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#F76011] text-white">{stage.time}</span>
                      <h3 className="mt-4 text-[28px] xl:text-[34px] font-semibold leading-[1.15] tracking-tight [text-wrap:balance]">{stage.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6 rounded-[2rem] p-2 bg-white/60 ring-1 ring-[#002F5B]/[0.08]">
                    <div className="rounded-[calc(2rem-0.5rem)] p-6 bg-white shadow-[0_24px_60px_-28px_rgba(0,47,91,0.35)]">
                      <StageBody stage={stage} stacked />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* the mountain */}
          <div ref={boxRef} className="col-span-7 relative">
            {w > 0 && (
              <svg width={w} height={h} className="absolute inset-0 overflow-visible" aria-hidden="true">
                <defs>
                  <clipPath id="mtClip">
                    <path d={poly(MOUNTAIN)} />
                  </clipPath>
                  <linearGradient id="mtBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1B4A78" />
                    <stop offset="1" stopColor="#002F5B" />
                  </linearGradient>
                  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#FFB27A" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#FFB27A" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* sun */}
                <circle cx={X(0.84)} cy={Y(0.2)} r={geo.mh * 0.3} fill="url(#sun)" />
                <circle cx={X(0.84)} cy={Y(0.2)} r={geo.mh * 0.08} fill="#FFC9A3" />
                {/* the mountain */}
                <path d={poly(MOUNTAIN)} fill="url(#mtBody)" />
                <path d={poly(SNOW)} fill="#F4F8FC" />
                {/* the road, and the part already climbed */}
                <g clipPath="url(#mtClip)">
                  <path d={roadPath(geo)} fill="#FDCBA6" />
                  <path ref={litRef} d={roadPath(geo, START)} fill="#F76011" />
                </g>
                {/* summit flag */}
                <g transform={`translate(${peak[0]} ${peak[1] + geo.mh * 0.01})`}>
                  <line x1={0} y1={0} x2={0} y2={-46} stroke="#002F5B" strokeWidth={3} strokeLinecap="round" />
                  <path d="M 1.5 -46 L 30 -38 L 1.5 -30 Z" fill="#F76011" className={summit ? "summit-flag" : ""} style={{ transformOrigin: "1.5px -38px" }} />
                </g>
              </svg>
            )}

            {/* bends of the trail: stage number and name (click to send the climber there) */}
            {w > 0 &&
              geo.bends.slice(1).map((pt, i) => {
                const on = reached > i;
                // labels sit outside each bend of the S: left bends to the left, right bends and the summit to the right
                const right = i % 2 === 1 || i === 4;
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
                      className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${EASE} group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-[#F76011] ${
                        on ? "bg-[#F76011] text-white scale-110 ring-[3px] ring-white" : "bg-white text-[#002F5B] ring-2 ring-white/60"
                      }`}
                    >
                      {pad(i + 1)}
                      {on && <span aria-hidden="true" className="gate-pulse absolute inset-0 rounded-full ring-2 ring-white" />}
                    </span>
                    <span
                      className={`absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                        right ? "left-6" : "right-6"
                      } ${on ? "bg-white text-[#002F5B] shadow-sm" : "bg-white/70 text-[#486581] group-hover:text-[#002F5B]"}`}
                    >
                      {stages[i].short}
                    </span>
                  </button>
                );
              })}
            {w > 0 && (
              <span className="absolute translate-x-14 -translate-y-full whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-[#486581]" style={{ left: geo.bends[0][0], top: geo.bends[0][1] - 6 }}>
                Chân núi
              </span>
            )}
            {climb > 1 && (
              <span className="absolute right-0 bottom-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9500E]">
                <RefreshCw weight="bold" className="w-4 h-4" /> Chinh phục lần {climb}
              </span>
            )}

            {/* the climber, feet on the trail */}
            <div ref={runnerRef} className="absolute left-0 top-0 z-10 will-change-transform pointer-events-none">
              <div className="absolute bottom-[-6px] left-0 -translate-x-1/2">
                <div ref={flipRef}>
                  <RunnerFigure ref={figRef} className="w-[120px] h-[106px] drop-shadow-[0_4px_6px_rgba(0,30,56,0.35)]" />
                </div>
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
