"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { AnimationItem } from "lottie-web";

// The climber on the consulting roadmap: a Lottie walk cycle ("Traveler" by Maksim Turkov on LottieFiles, free under
// the Lottie Simple License), trimmed to the walker alone and recoloured in WISE Academy navy and orange
// (public/lottie/trekker.json). It does not play on its own: the roadmap sets the step phase every frame, so the
// stride follows the climbing pace.
export interface TrekkerHandle {
  /** position in the walk cycle, in cycles (1 = two steps); only the fraction is used */
  setPhase: (cycles: number) => void;
}

// the part of the 1278 x 996 artboard the walker occupies, feet on the bottom edge
const VIEW = "460 390 346 596";

const TrekkerLottie = forwardRef<TrekkerHandle, { className?: string }>(function TrekkerLottie({ className }, ref) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useImperativeHandle(ref, () => ({
    setPhase(cycles) {
      const a = animRef.current;
      if (!a || !a.totalFrames) return;
      const f = (((cycles % 1) + 1) % 1) * (a.totalFrames - 1);
      a.goToAndStop(f, true);
    },
  }));

  useEffect(() => {
    let dead = false;
    import("lottie-web/build/player/lottie_light").then(({ default: lottie }) => {
      if (dead || !boxRef.current) return;
      const a = lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/lottie/trekker.json",
        rendererSettings: { viewBoxSize: VIEW, preserveAspectRatio: "xMidYMax meet" },
      });
      a.addEventListener("DOMLoaded", () => a.goToAndStop(0, true));
      animRef.current = a;
    });
    return () => {
      dead = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return <div ref={boxRef} className={className} aria-hidden="true" />;
});

export default TrekkerLottie;

/* ---------- The same trekker seen from behind (climbing straight up from stage 4 to the summit) ---------- */
// The Lottie only has a side view, so this is drawn to match it: orange shirt, navy backpack and trousers,
// navy hair, boots with white soles and two trekking poles. setPhase uses the same cycle as the Lottie, so the step rate matches.
const BC = {
  skin: "#F9C1A4",
  ear: "#EDA179",
  shirt: "#F76011",
  shirtDark: "#D24E0C",
  pants: "#002F5B",
  pantsFar: "#0F3F6E",
  pack: "#002F5B",
  packLight: "#1C5690",
  hair: "#002F5B",
  boot: "#001E38",
  sole: "#FFFFFF",
  pole: "#9AA9BC",
};

export const BackTrekker = forwardRef<TrekkerHandle, { className?: string }>(function BackTrekker({ className }, ref) {
  const legRefs = useRef<(SVGGElement | null)[]>([]);
  const armRefs = useRef<(SVGGElement | null)[]>([]);
  const bodyRef = useRef<SVGGElement>(null);

  useImperativeHandle(ref, () => ({
    setPhase(cycles) {
      const a = cycles * Math.PI * 2;
      // one leg lifts while the other pushes; arms swing against the legs; the body bobs twice per cycle
      [0, 1].forEach((i) => {
        const s = Math.sin(a + i * Math.PI);
        const lift = Math.max(0, s) * 9;
        legRefs.current[i]?.setAttribute("transform", `translate(0 ${(-lift).toFixed(2)})`);
        armRefs.current[i]?.setAttribute("transform", `translate(0 ${(-Math.max(0, -s) * 4).toFixed(2)})`);
      });
      bodyRef.current?.setAttribute("transform", `translate(0 ${(-Math.abs(Math.sin(a)) * 2).toFixed(2)})`);
    },
  }));

  const leg = (i: number, x: number) => (
    <g
      key={i}
      ref={(el) => {
        legRefs.current[i] = el;
      }}
    >
      <rect x={x} y={60} width={11} height={34} rx={5} fill={i ? BC.pantsFar : BC.pants} />
      <rect x={x - 1} y={90} width={13} height={9} rx={4} fill={BC.boot} />
      <rect x={x - 1} y={97} width={13} height={3} rx={1.5} fill={BC.sole} />
    </g>
  );
  const arm = (i: number, x: number, dir: number) => (
    <g
      key={i}
      ref={(el) => {
        armRefs.current[i] = el;
      }}
    >
      {/* trekking pole: grip in the hand, tip planted a little outside the boots */}
      <line x1={x + dir * 5} y1={60} x2={x + dir * 9} y2={102} stroke={BC.pole} strokeWidth={2} strokeLinecap="round" />
      <line x1={x + dir * 4.6} y1={52} x2={x + dir * 5.2} y2={60} stroke={BC.boot} strokeWidth={3.4} strokeLinecap="round" />
      <path d={`M ${x} 32 Q ${x + dir * 6} 44 ${x + dir * 5} 56`} stroke={BC.shirtDark} strokeWidth={8} strokeLinecap="round" fill="none" />
      <circle cx={x + dir * 5} cy={57} r={3.6} fill={BC.skin} />
    </g>
  );

  return (
    <svg viewBox="-4 0 68 104" className={className} aria-hidden="true">
      {leg(1, 32)}
      {leg(0, 17)}
      <g ref={bodyRef}>
        {arm(0, 15, -1)}
        {arm(1, 45, 1)}
        {/* shirt */}
        <path d="M 16 30 Q 30 24 44 30 L 45 64 Q 30 68 15 64 Z" fill={BC.shirt} />
        {/* neck, ears and the back of the head */}
        <rect x={26} y={20} width={8} height={9} rx={3} fill={BC.skin} />
        <ellipse cx={20.6} cy={14} rx={2} ry={3} fill={BC.ear} />
        <ellipse cx={39.4} cy={14} rx={2} ry={3} fill={BC.ear} />
        <circle cx={30} cy={13} r={9.5} fill={BC.hair} />
        {/* backpack, with its lid, front pocket and a rolled mat on top */}
        <rect x={13} y={27} width={34} height={40} rx={8} fill={BC.pack} />
        <rect x={13} y={27} width={34} height={11} rx={6} fill={BC.packLight} />
        <rect x={19} y={46} width={22} height={15} rx={4} fill={BC.packLight} />
        <rect x={27.5} y={40} width={5} height={4} rx={1.5} fill={BC.shirt} />
      </g>
    </svg>
  );
});
