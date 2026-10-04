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
        const lift = Math.max(0, s) * 8;
        legRefs.current[i]?.setAttribute("transform", `translate(0 ${(-lift).toFixed(2)})`);
        armRefs.current[i]?.setAttribute("transform", `translate(0 ${(-Math.max(0, -s) * 4).toFixed(2)})`);
      });
      bodyRef.current?.setAttribute("transform", `translate(0 ${(-Math.abs(Math.sin(a)) * 2).toFixed(2)})`);
    },
  }));

  // slim and tall like the side-view walker: narrow shoulders and pack, long thin legs
  const leg = (i: number, x: number) => (
    <g
      key={i}
      ref={(el) => {
        legRefs.current[i] = el;
      }}
    >
      <rect x={x} y={56} width={7.5} height={44} rx={3.5} fill={i ? BC.pantsFar : BC.pants} />
      <rect x={x - 1} y={97} width={9.5} height={7} rx={3} fill={BC.boot} />
      <rect x={x - 1} y={102.5} width={9.5} height={2.5} rx={1.2} fill={BC.sole} />
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
      <line x1={x + dir * 4} y1={55} x2={x + dir * 7} y2={108} stroke={BC.pole} strokeWidth={1.6} strokeLinecap="round" />
      <line x1={x + dir * 3.8} y1={48} x2={x + dir * 4.2} y2={55} stroke={BC.boot} strokeWidth={2.8} strokeLinecap="round" />
      <path d={`M ${x} 29 Q ${x + dir * 4.5} 40 ${x + dir * 4} 51`} stroke={BC.shirtDark} strokeWidth={6} strokeLinecap="round" fill="none" />
      <circle cx={x + dir * 4} cy={52.5} r={2.8} fill={BC.skin} />
    </g>
  );

  return (
    <svg viewBox="-4 0 56 110" className={className} aria-hidden="true">
      {leg(1, 25.5)}
      {leg(0, 15)}
      <g ref={bodyRef}>
        {arm(0, 14.5, -1)}
        {arm(1, 33.5, 1)}
        {/* shirt */}
        <path d="M 15 27 Q 24 23 33 27 L 33.5 58 Q 24 61 14.5 58 Z" fill={BC.shirt} />
        {/* neck, ears and the back of the head */}
        <rect x={21} y={18} width={6} height={7} rx={2.5} fill={BC.skin} />
        <ellipse cx={16.8} cy={12.5} rx={1.6} ry={2.4} fill={BC.ear} />
        <ellipse cx={31.2} cy={12.5} rx={1.6} ry={2.4} fill={BC.ear} />
        <circle cx={24} cy={12} r={7.5} fill={BC.hair} />
        {/* backpack, with its lid and front pocket */}
        <rect x={12.5} y={25} width={23} height={34} rx={6} fill={BC.pack} />
        <rect x={12.5} y={25} width={23} height={9} rx={5} fill={BC.packLight} />
        <rect x={16} y={41} width={16} height={12} rx={3} fill={BC.packLight} />
        <rect x={22} y={35.5} width={4} height={3} rx={1.2} fill={BC.shirt} />
      </g>
    </svg>
  );
});
