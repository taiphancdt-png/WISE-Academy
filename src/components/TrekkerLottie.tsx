"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

// `src` picks the animation file; `inHand` is SVG drawn in the front hand's layer (it swings with the arm). It needs a
// file whose hand layer carries the id "wise-walker-hand" (public/lottie/trekker-walk.json: the walker without poles).
const TrekkerLottie = forwardRef<
  TrekkerHandle,
  { className?: string; src?: string; inHand?: React.ReactNode }
>(function TrekkerLottie({ className, src = "/lottie/trekker.json", inHand }, ref) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [hand, setHand] = useState<SVGGElement | null>(null);

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
        path: src,
        rendererSettings: { viewBoxSize: VIEW, preserveAspectRatio: "xMidYMax meet" },
      });
      a.addEventListener("DOMLoaded", () => {
        a.goToAndStop(0, true);
        setHand(boxRef.current?.querySelector<SVGGElement>("#wise-walker-hand") ?? null);
      });
      animRef.current = a;
    });
    return () => {
      dead = true;
      animRef.current?.destroy();
      animRef.current = null;
      setHand(null);
    };
  }, [src]);

  return (
    <div ref={boxRef} className={className} aria-hidden="true">
      {hand && inHand ? createPortal(inHand, hand) : null}
    </div>
  );
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

// `poles={false}` drops the trekking poles; `facing="front"` turns the walker towards the viewer (face, shirt front and
// backpack straps instead of the pack).
export const BackTrekker = forwardRef<
  TrekkerHandle,
  { className?: string; poles?: boolean; facing?: "back" | "front"; holding?: React.ReactNode }
>(function BackTrekker({ className, poles = true, facing = "back", holding }, ref) {
  // facing the viewer with something in hand: both hands bring it in front of the chest
  const carry = facing === "front" && !!holding;
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
      {poles && (
        <>
          <line x1={x + dir * 4} y1={55} x2={x + dir * 7} y2={108} stroke={BC.pole} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={x + dir * 3.8} y1={48} x2={x + dir * 4.2} y2={55} stroke={BC.boot} strokeWidth={2.8} strokeLinecap="round" />
        </>
      )}
      {carry ? (
        <>
          <path d={`M ${x} 29 Q ${x + dir * 2} 42 ${24 + dir * 4} 43`} stroke={BC.shirtDark} strokeWidth={6} strokeLinecap="round" fill="none" />
          <circle cx={24 + dir * 4} cy={43} r={2.8} fill={BC.skin} />
        </>
      ) : (
        <>
          <path d={`M ${x} 29 Q ${x + dir * 4.5} 40 ${x + dir * 4} 51`} stroke={BC.shirtDark} strokeWidth={6} strokeLinecap="round" fill="none" />
          <circle cx={x + dir * 4} cy={52.5} r={2.8} fill={BC.skin} />
        </>
      )}
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
        {facing === "back" ? (
          <>
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
          </>
        ) : (
          <>
            {/* backpack straps over the shoulders */}
            <path d="M 18 27 L 19.5 50" stroke={BC.pack} strokeWidth={3} strokeLinecap="round" />
            <path d="M 30 27 L 28.5 50" stroke={BC.pack} strokeWidth={3} strokeLinecap="round" />
            {/* neck, ears, face and the hair on top */}
            <rect x={21} y={18} width={6} height={7} rx={2.5} fill={BC.skin} />
            <ellipse cx={16.8} cy={12.5} rx={1.6} ry={2.4} fill={BC.ear} />
            <ellipse cx={31.2} cy={12.5} rx={1.6} ry={2.4} fill={BC.ear} />
            <circle cx={24} cy={12} r={7.5} fill={BC.skin} />
            <path d="M 16.5 11.5 Q 17 3.6 24 3.8 Q 31 3.6 31.5 11.5 Q 28 7.5 24 8 Q 20 7.5 16.5 11.5 Z" fill={BC.hair} />
            <circle cx={21.3} cy={12.6} r={0.95} fill={BC.boot} />
            <circle cx={26.7} cy={12.6} r={0.95} fill={BC.boot} />
            <path d="M 21.8 15.8 Q 24 17.4 26.2 15.8" stroke={BC.ear} strokeWidth={0.9} strokeLinecap="round" fill="none" />
          </>
        )}
        {/* the tool held in front of the chest (drawn in the side view's hand units, about 0.3 here) */}
        {carry && (
          <g transform="translate(24 40) scale(0.3) translate(-25 -127)">
            {holding}
          </g>
        )}
      </g>
    </svg>
  );
});
