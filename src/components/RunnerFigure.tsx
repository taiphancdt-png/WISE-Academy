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
  stand: { torso: 4, thighF: 4, shinF: -2, thighB: -4, shinB: -6, armF: -6, foreF: 25, armB: 8, foreB: 40 },
  // "On your marks": front knee up by the chest, back knee on the ground, hands on the start line
  marks: { torso: 68, thighF: 128, shinF: -18, thighB: 12, shinB: -84, armF: -4, foreF: -4, armB: -8, foreB: -8 },
  // "Set": hips rise above the shoulders, ready to push off
  set: { torso: 98, thighF: 84, shinF: -24, thighB: -4, shinB: -40, armF: -2, foreF: -2, armB: -6, foreB: -6 },
};

// Running gait at phase phi (radians). One full cycle = two strides.
// stride > 1 lengthens the swing and leans further forward (faster running).
export function runPose(phi: number, stride = 1): Pose {
  const s = Math.sin(phi);
  const leg = (sw: number, ph: number) => {
    // knee drives further forward than the leg extends behind
    const thigh = 8 + 40 * sw * stride;
    // knee folds while the leg recovers forward and stays almost straight while it pushes back on the ground
    const fold = 14 + 96 * Math.pow(Math.max(0, Math.cos(ph + 0.35)), 1.3);
    return [thigh, thigh - fold];
  };
  const [thighF, shinF] = leg(s, phi);
  const [thighB, shinB] = leg(-s, phi + Math.PI);
  // arms swing opposite the legs with the elbows held near 90 degrees
  const armF = -4 - 34 * s * stride;
  const armB = -4 + 34 * s * stride;
  return { torso: 20 + 8 * stride, thighF, shinF, thighB, shinB, armF, foreF: armF + 88, armB, foreB: armB + 88 };
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

// Flat illustration palette in WISE Academy colours.
const C = {
  skin: "#F6C79C",
  skinFar: "#E2A574",
  kit: "#F76011", // singlet
  kitShade: "#D9500B",
  shorts: "#002F5B",
  shortsFar: "#0B2240",
  sock: "#FFFFFF",
  sockFar: "#E6ECF3",
  shoe: "#E9EEF4",
  shoeFar: "#CBD5E1",
  sole: "#002F5B",
  hair: "#1E2B3C",
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
  ["armUB", C.skinFar], ["armLB", C.skinFar],
  ["thighB", C.skinFar], ["shortB", C.shortsFar], ["calfB", C.skinFar], ["shinB", C.skinFar], ["sockB", C.sockFar], ["shoeB", C.shoeFar], ["soleB", C.sole],
  // body
  ["neck", C.skinFar], ["torso", C.kit], ["hips", C.shorts],
  ["hair", C.hair], ["face", C.skin], ["nose", C.skin], ["ear", C.skinFar], ["hairTop", C.hair],
  // near side
  ["thighF", C.skin], ["shortF", C.shorts], ["calfF", C.skin], ["shinF", C.skin], ["sockF", C.sock], ["shoeF", C.shoe], ["soleF", C.sole],
  ["armUF", C.skin], ["armLF", C.skin],
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

      // shoe: points forward, roughly at right angles to the shin
      const shoe = (ankle: Pt, shinDeg: number) => {
        const f = limb(1, shinDeg + 90);
        const heel: Pt = [ankle[0] - f[0] * 1.5, ankle[1] - f[1] * 1.5 + 1.2];
        const toe: Pt = [ankle[0] + f[0] * 7, ankle[1] + f[1] * 7 + 1.2];
        const down = limb(1, shinDeg);
        const sole = (pt: Pt): Pt => [pt[0] + down[0] * 2.2, pt[1] + down[1] * 2.2];
        return { upper: taper(heel, toe, 5.2, 4.2, T), sole: taper(sole(heel), sole(toe), 1.8, 1.8, T) };
      };
      const sF = shoe(aF, p.shinF), sB = shoe(aB, p.shinB);
      const fwd = limb(1, p.torso + 90); // facing direction of the head
      const upDir = up(p.torso, 1);

      const d: Record<string, string> = {
        armUB: taper(sh, elB, 6, 5, T),
        armLB: taper(elB, hB, 5, 5.6, T),
        thighB: taper(hip, kB, 11, 7.5, T),
        shortB: taper(hip, lerp(hip, kB, 0.5), 12.5, 11, T),
        calfB: taper(kB, lerp(kB, aB, 0.42), 7.5, 8, T),
        shinB: taper(lerp(kB, aB, 0.3), aB, 7.5, 4.8, T),
        sockB: taper(lerp(kB, aB, 0.78), aB, 5.6, 5.2, T),
        shoeB: sB.upper,
        soleB: sB.sole,
        neck: taper(lerp(hip, sh, 0.85), add(sh, up(p.torso, L.neck + 1.5)), 5.5, 5, T),
        torso: taper(lerp(hip, sh, 0.05), lerp(hip, sh, 0.95), 15, 14, T),
        hips: taper(lerp(hip, sh, -0.06), lerp(hip, sh, 0.16), 15.5, 15.5, T),
        hair: taper(add(head, [-fwd[0] * 1.6 + upDir[0] * 0.6, -fwd[1] * 1.6 + upDir[1] * 0.6]), add(head, [-fwd[0] * 1.2, -fwd[1] * 1.2]), 14, 14, T),
        face: taper(head, add(head, [fwd[0] * 0.6, fwd[1] * 0.6]), 12.6, 12.6, T),
        nose: taper(add(head, [fwd[0] * 5.6 + upDir[0] * 0.2, fwd[1] * 5.6 + upDir[1] * 0.2]), add(head, [fwd[0] * 7.2 - upDir[0] * 0.6, fwd[1] * 7.2 - upDir[1] * 0.6]), 2.6, 1.6, T),
        ear: taper(add(head, [-fwd[0] * 1.3, -fwd[1] * 1.3]), add(head, [-fwd[0] * 1.3 - upDir[0] * 1.2, -fwd[1] * 1.3 - upDir[1] * 1.2]), 2.8, 2.6, T),
        hairTop: taper(add(head, [upDir[0] * 4.6 - fwd[0] * 1.5, upDir[1] * 4.6 - fwd[1] * 1.5]), add(head, [upDir[0] * 4.4 + fwd[0] * 2.8, upDir[1] * 4.4 + fwd[1] * 2.8]), 5, 3.4, T),
        thighF: taper(hip, kF, 11.5, 8, T),
        shortF: taper(hip, lerp(hip, kF, 0.5), 13, 11.5, T),
        calfF: taper(kF, lerp(kF, aF, 0.42), 8, 8.6, T),
        shinF: taper(lerp(kF, aF, 0.3), aF, 8, 5, T),
        sockF: taper(lerp(kF, aF, 0.78), aF, 6, 5.4, T),
        shoeF: sF.upper,
        soleF: sF.sole,
        armUF: taper(sh, elF, 6.6, 5.4, T),
        armLF: taper(elF, hF, 5.2, 6, T),
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
