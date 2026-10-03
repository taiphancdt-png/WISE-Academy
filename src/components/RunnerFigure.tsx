"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";

// An articulated runner drawn in SVG. Limb angles are absolute, in degrees from straight down,
// positive = toward the running direction (right). Torso is degrees of forward lean from upright.
export interface Pose {
  torso: number;
  thighF: number; shinF: number; // near leg
  thighB: number; shinB: number; // far leg
  armF: number; foreF: number; // near arm
  armB: number; foreB: number; // far arm
}

export const POSES: Record<"stand" | "marks" | "set", Pose> = {
  stand: { torso: 6, thighF: 4, shinF: -2, thighB: -4, shinB: -6, armF: 12, foreF: 66, armB: 8, foreB: 36 },
  // "On your marks": front knee up by the chest, back knee on the ground, hands on the start line
  marks: { torso: 68, thighF: 128, shinF: -18, thighB: 12, shinB: -84, armF: -4, foreF: -4, armB: -8, foreB: -8 },
  // "Set": hips rise above the shoulders, ready to push off
  set: { torso: 98, thighF: 84, shinF: -24, thighB: -4, shinB: -40, armF: -2, foreF: -2, armB: -6, foreB: -6 },
};

// Trekking gait at phase phi: a steady uphill walk, the near hand plants a trekking pole.
export function walkPose(phi: number, stride = 1): Pose {
  const s = Math.sin(phi);
  const leg = (sw: number, ph: number) => {
    const thigh = 4 + 26 * sw * stride;
    // the knee bends a little while the leg swings through, stays nearly straight under load
    const fold = 6 + 40 * Math.pow(Math.max(0, Math.cos(ph + 0.4)), 1.5) * stride;
    return [thigh, thigh - fold];
  };
  const [thighF, shinF] = leg(s, phi);
  const [thighB, shinB] = leg(-s, phi + Math.PI);
  const armF = 14 - 16 * s; // pole hand reaches forward with the far leg
  const armB = 6 + 14 * s;
  return { torso: 12 + 4 * stride, thighF, shinF, thighB, shinB, armF, foreF: armF + 58, armB, foreB: armB + 38 };
}

export function blendPose(a: Pose, b: Pose, t: number): Pose {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = a[k] + (b[k] - a[k]) * t));
  return out;
}

const L = { torso: 23, neck: 3.5, head: 7, thigh: 18, shin: 18, arm: 12.5, fore: 11.5 };
const GROUND = 78;
const rad = (d: number) => (d * Math.PI) / 180;
// vector of a limb of length len at absolute angle deg (0 = down, + = forward)
const limb = (len: number, deg: number): Pt => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];

type Pt = [number, number];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export interface RunnerHandle {
  setPose: (p: Pose, bob?: number) => void;
}

// Flat illustration palette in WISE Academy colours: a trekker with hat, big backpack and pole.
const C = {
  skin: "#F6C79C",
  skinFar: "#E2A574",
  jacket: "#F76011",
  jacketFar: "#D24E0C",
  pants: "#002F5B",
  pantsFar: "#0B2240",
  boot: "#3A2A22",
  bootFar: "#2A1E18",
  sole: "#15100D",
  hat: "#1B4A78",
  hatBand: "#FFB27A",
  hair: "#1E2B3C",
  pack: "#1B4A78",
  packDark: "#002F5B",
  packRoll: "#FFB27A",
  pole: "#CBD5E1",
  grip: "#1E2B3C",
};

// Capsule that tapers from width w1 at a to w2 at b (round ends), as an SVG path.
function taper(a: Pt, b: Pt, w1: number, w2: number, T: (p: Pt) => string) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 0.001;
  const n: Pt = [-dy / len, dx / len];
  const r1 = w1 / 2, r2 = w2 / 2;
  const a1: Pt = [a[0] + n[0] * r1, a[1] + n[1] * r1], a2: Pt = [a[0] - n[0] * r1, a[1] - n[1] * r1];
  const b1: Pt = [b[0] + n[0] * r2, b[1] + n[1] * r2], b2: Pt = [b[0] - n[0] * r2, b[1] - n[1] * r2];
  return `M ${T(a1)} L ${T(b1)} A ${r2} ${r2} 0 0 0 ${T(b2)} L ${T(a2)} A ${r1} ${r1} 0 0 0 ${T(a1)} Z`;
}

const PARTS = [
  // far side (behind the body)
  ["armUB", C.jacketFar], ["armLB", C.jacketFar], ["handB", C.skinFar],
  ["thighB", C.pantsFar], ["shinB", C.pantsFar], ["bootB", C.bootFar], ["soleB", C.sole],
  // body
  ["pack", C.pack], ["packFlap", C.packDark], ["packPocket", C.packDark], ["packRoll", C.packRoll],
  ["neck", C.skinFar], ["torso", C.jacket], ["hips", C.pants], ["strap", C.packDark],
  ["hair", C.hair], ["face", C.skin], ["nose", C.skin], ["ear", C.skinFar],
  ["hatCrown", C.hat], ["hatBand", C.hatBand], ["hatBrim", C.hat],
  // near side
  ["thighF", C.pants], ["shinF", C.pants], ["bootF", C.boot], ["soleF", C.sole],
  ["pole", C.pole], ["armUF", C.jacket], ["armLF", C.jacket], ["grip", C.grip], ["handF", C.skin],
] as const;

const RunnerFigure = forwardRef<RunnerHandle, { className?: string }>(function RunnerFigure({ className = "" }, ref) {
  const g = useRef<Record<string, SVGPathElement | null>>({});

  useImperativeHandle(ref, () => ({
    setPose(p, bob = 0) {
      const up = (deg: number, len: number): Pt => [Math.sin(rad(deg)) * len, -Math.cos(rad(deg)) * len];
      const hip: Pt = [0, 0];
      const sh = up(p.torso, L.torso);
      const head = add(sh, up(p.torso, L.neck + L.head));
      const kF = limb(L.thigh, p.thighF), kB = limb(L.thigh, p.thighB);
      const aF = add(kF, limb(L.shin, p.shinF)), aB = add(kB, limb(L.shin, p.shinB));
      const elF = add(sh, limb(L.arm, p.armF)), elB = add(sh, limb(L.arm, p.armB));
      const hF = add(elF, limb(L.fore, p.foreF)), hB = add(elB, limb(L.fore, p.foreB));
      const lowest = Math.max(aF[1] + 4, aB[1] + 4, kF[1] + 5, kB[1] + 5, hF[1] + 3, hB[1] + 3, head[1] + L.head);
      const ox = 50 - sh[0] * 0.35;
      const oy = GROUND - lowest - bob;
      const T = (pt: Pt) => `${(ox + pt[0]).toFixed(2)} ${(oy + pt[1]).toFixed(2)}`;

      // hiking boot: chunky, points forward roughly at right angles to the shin
      const shoe = (ankle: Pt, shinDeg: number) => {
        const f = limb(1, shinDeg + 90);
        const heel: Pt = [ankle[0] - f[0] * 2, ankle[1] - f[1] * 2 + 1.4];
        const toe: Pt = [ankle[0] + f[0] * 7.5, ankle[1] + f[1] * 7.5 + 1.4];
        const down = limb(1, shinDeg);
        const sole = (pt: Pt): Pt => [pt[0] + down[0] * 3, pt[1] + down[1] * 3];
        return { upper: taper(heel, toe, 7, 5.6, T), sole: taper(sole(heel), sole(toe), 2.4, 2.4, T) };
      };
      const shoeF = shoe(aF, p.shinF), shoeB = shoe(aB, p.shinB);
      const fwd = limb(1, p.torso + 90); // facing direction of the head
      const upDir = up(p.torso, 1);

      // backpack rides on the back, behind the torso
      const back: Pt = [-fwd[0], -fwd[1]];
      const onBack = (t: number, off: number): Pt => {
        const q = lerp(hip, sh, t);
        return [q[0] + back[0] * off, q[1] + back[1] * off];
      };

      const hatC = add(head, [upDir[0] * 4.2, upDir[1] * 4.2]);
      const brimA = add(head, [upDir[0] * 2.6 - fwd[0] * 9.5, upDir[1] * 2.6 - fwd[1] * 9.5]);
      const brimB = add(head, [upDir[0] * 2.6 + fwd[0] * 10.5, upDir[1] * 2.6 + fwd[1] * 10.5]);
      // trekking pole from the near hand to the ground ahead of the feet
      const poleTip: Pt = [hF[0] + 9 + Math.max(0, (p.armF - 6) * 0.25), Math.max(aF[1], aB[1]) + 3];

      const d: Record<string, string> = {
        armUB: taper(sh, elB, 6.4, 5.6, T),
        armLB: taper(elB, hB, 5.6, 5.2, T),
        handB: taper(hB, add(hB, limb(1.2, p.foreB)), 4.6, 4.6, T),
        thighB: taper(hip, kB, 11, 8.6, T),
        shinB: taper(kB, aB, 8.4, 6.6, T),
        bootB: shoeB.upper,
        soleB: shoeB.sole,
        pack: taper(onBack(0.18, 8), onBack(1.02, 8), 15, 13.5, T),
        packFlap: taper(onBack(0.86, 8.4), onBack(1.08, 8.4), 13.5, 13, T),
        packPocket: taper(onBack(0.3, 13.6), onBack(0.6, 13.6), 5, 5, T),
        packRoll: taper(onBack(1.18, 3), onBack(1.18, 13), 6.5, 6.5, T),
        neck: taper(lerp(hip, sh, 0.85), add(sh, up(p.torso, L.neck + 1.5)), 5.5, 5, T),
        torso: taper(lerp(hip, sh, 0.02), lerp(hip, sh, 0.96), 15.5, 14.5, T),
        hips: taper(lerp(hip, sh, -0.06), lerp(hip, sh, 0.12), 15, 15, T),
        strap: taper(lerp(hip, sh, 0.97), add(lerp(hip, sh, 0.45), [fwd[0] * 3, fwd[1] * 3]), 2.6, 2.4, T),
        hair: taper(add(head, [-fwd[0] * 1.6, -fwd[1] * 1.6]), add(head, [-fwd[0] * 1.2, -fwd[1] * 1.2]), 13.6, 13.6, T),
        face: taper(head, add(head, [fwd[0] * 0.6, fwd[1] * 0.6]), 12.6, 12.6, T),
        nose: taper(add(head, [fwd[0] * 5.6, fwd[1] * 5.6]), add(head, [fwd[0] * 7.2 - upDir[0] * 0.8, fwd[1] * 7.2 - upDir[1] * 0.8]), 2.6, 1.6, T),
        ear: taper(add(head, [-fwd[0] * 1.3, -fwd[1] * 1.3]), add(head, [-fwd[0] * 1.3 - upDir[0] * 1.2, -fwd[1] * 1.3 - upDir[1] * 1.2]), 2.8, 2.6, T),
        hatCrown: taper(add(hatC, [-fwd[0] * 3.5, -fwd[1] * 3.5]), add(hatC, [fwd[0] * 3.5, fwd[1] * 3.5]), 8.5, 8.5, T),
        hatBand: taper(add(head, [upDir[0] * 3 - fwd[0] * 5.6, upDir[1] * 3 - fwd[1] * 5.6]), add(head, [upDir[0] * 3 + fwd[0] * 5.6, upDir[1] * 3 + fwd[1] * 5.6]), 2.4, 2.4, T),
        hatBrim: taper(brimA, brimB, 2.6, 2.2, T),
        thighF: taper(hip, kF, 11.6, 9, T),
        shinF: taper(kF, aF, 8.8, 7, T),
        bootF: shoeF.upper,
        soleF: shoeF.sole,
        pole: taper(add(hF, [0, -4]), poleTip, 2, 1.6, T),
        armUF: taper(sh, elF, 6.8, 6, T),
        armLF: taper(elF, hF, 6, 5.4, T),
        grip: taper(add(hF, [0, -5]), add(hF, [0.6, 3]), 3.4, 3.4, T),
        handF: taper(hF, add(hF, limb(1.2, p.foreF)), 5, 5, T),
      };

      Object.entries(d).forEach(([k, v]) => g.current[k]?.setAttribute("d", v));
    },
  }));

  return (
    <svg viewBox="0 -8 100 88" className={className} aria-hidden="true">
      {PARTS.map(([k, fill]) => (
        <path
          key={k}
          ref={(el) => {
            g.current[k] = el;
          }}
          fill={fill}
        />
      ))}
    </svg>
  );
});

export default RunnerFigure;

// The same trekker seen from behind (climbing away up the last stretch): backpack in view, legs stepping up.
export interface BackHandle {
  setPhase: (phi: number, walk: number) => void;
}

export const BackFigure = forwardRef<BackHandle, { className?: string }>(function BackFigure({ className = "" }, ref) {
  const g = useRef<Record<string, SVGElement | null>>({});
  const set = (k: string) => (el: SVGElement | null) => {
    g.current[k] = el;
  };

  useImperativeHandle(ref, () => ({
    setPhase(phi, walk) {
      const s = Math.sin(phi);
      const liftL = 5 * Math.max(0, s) * walk;
      const liftR = 5 * Math.max(0, -s) * walk;
      const bob = 1.2 * Math.abs(Math.cos(phi)) * walk;
      const swing = 3 * s * walk;
      const move = (k: string, dx: number, dy: number) => g.current[k]?.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
      move("legL", 0, -liftL);
      move("legR", 0, -liftR);
      move("body", 0, -bob);
      move("armL", 0, -bob + swing);
      move("armR", 0, -bob - swing);
    },
  }));

  return (
    <svg viewBox="0 -8 100 88" className={className} aria-hidden="true">
      {/* legs (lift alternately as the trekker steps up) */}
      <g ref={set("legL")}>
        <path d="M 44 50 L 43.5 72" stroke={C.pants} strokeWidth={8} strokeLinecap="round" />
        <path d="M 39.5 75.5 L 47.5 75.5" stroke={C.boot} strokeWidth={6} strokeLinecap="round" />
        <path d="M 39 78.2 L 48 78.2" stroke={C.sole} strokeWidth={2} strokeLinecap="round" />
      </g>
      <g ref={set("legR")}>
        <path d="M 56 50 L 56.5 72" stroke={C.pantsFar} strokeWidth={8} strokeLinecap="round" />
        <path d="M 52.5 75.5 L 60.5 75.5" stroke={C.bootFar} strokeWidth={6} strokeLinecap="round" />
        <path d="M 52 78.2 L 61 78.2" stroke={C.sole} strokeWidth={2} strokeLinecap="round" />
      </g>
      {/* arms and pole */}
      <g ref={set("armL")}>
        <path d="M 40 30 L 37 41 L 38 50" stroke={C.jacketFar} strokeWidth={5.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={38} cy={51.5} r={2.6} fill={C.skinFar} />
      </g>
      <g ref={set("armR")}>
        <path d="M 66 46 L 70 79" stroke={C.pole} strokeWidth={2} strokeLinecap="round" />
        <path d="M 60 30 L 63.5 40 L 65.5 47" stroke={C.jacket} strokeWidth={5.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={65.8} cy={48} r={2.7} fill={C.skin} />
      </g>
      {/* torso, backpack, head and hat */}
      <g ref={set("body")}>
        <path d="M 41 28 L 59 28 L 58 52 L 42 52 Z" fill={C.jacket} strokeLinejoin="round" />
        <path d="M 42.5 48 L 57.5 48 L 57.5 54 L 42.5 54 Z" fill={C.pants} />
        <rect x={40.5} y={24} width={19} height={27} rx={4} fill={C.pack} />
        <rect x={40.5} y={23} width={19} height={7} rx={3.5} fill={C.packDark} />
        <rect x={44} y={37} width={12} height={9} rx={2.5} fill={C.packDark} />
        <rect x={38.5} y={18.5} width={23} height={5.5} rx={2.75} fill={C.packRoll} />
        <circle cx={50} cy={13} r={5.6} fill={C.hair} />
        <ellipse cx={50} cy={9.6} rx={10.5} ry={2.2} fill={C.hat} />
        <path d="M 44.5 9.6 Q 45 3.4 50 3.2 Q 55 3.4 55.5 9.6 Z" fill={C.hat} />
        <path d="M 44.8 8.2 L 55.2 8.2" stroke={C.hatBand} strokeWidth={1.4} />
      </g>
    </svg>
  );
});
