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
export function runPose(phi: number, intensity = 1): Pose {
  const s = Math.sin(phi);
  const leg = (sw: number, ph: number) => {
    const thigh = 42 * sw * intensity;
    // knee folds while the leg recovers forward and stays almost straight while it pushes back on the ground
    const fold = 12 + 100 * Math.pow(Math.max(0, Math.cos(ph + 0.35)), 1.3) * intensity;
    return [thigh, thigh - fold];
  };
  const [thighF, shinF] = leg(s, phi);
  const [thighB, shinB] = leg(-s, phi + Math.PI);
  const armF = -38 * s * intensity;
  const armB = 38 * s * intensity;
  return { torso: 10 + 6 * intensity, thighF, shinF, thighB, shinB, armF, foreF: armF + 95, armB, foreB: armB + 95 };
}

export function blendPose(a: Pose, b: Pose, t: number): Pose {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = a[k] + (b[k] - a[k]) * t));
  return out;
}

const L = { torso: 24, neck: 4, head: 6, thigh: 18, shin: 18, arm: 13, fore: 12 };
const GROUND = 78;
const rad = (d: number) => (d * Math.PI) / 180;
// vector of a limb of length len at absolute angle deg (0 = down, + = forward)
const limb = (len: number, deg: number) => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];

export interface RunnerHandle {
  setPose: (p: Pose, bob?: number) => void;
}

const SKIN = "#EDB48C";
const SKIN_FAR = "#C98A61";
const KIT = "#F76011"; // singlet
const SHORTS = "#002F5B";
const SHOE = "#002F5B";

type Pt = [number, number];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Athletic build: tapered thighs and calves, singlet, shorts and shoes, drawn as round-capped strokes.
const RunnerFigure = forwardRef<RunnerHandle, { className?: string }>(function RunnerFigure({ className = "" }, ref) {
  const g = useRef<Record<string, SVGElement | null>>({});
  const set = (k: string) => (el: SVGElement | null) => {
    g.current[k] = el;
  };

  useImperativeHandle(ref, () => ({
    setPose(p, bob = 0) {
      const up = (deg: number, len: number): Pt => [Math.sin(rad(deg)) * len, -Math.cos(rad(deg)) * len];
      const hip: Pt = [0, 0];
      const sh = up(p.torso, L.torso);
      const neckTop = add(sh, up(p.torso, L.neck));
      const head = add(sh, up(p.torso, L.neck + L.head));
      const kF = limb(L.thigh, p.thighF) as Pt, kB = limb(L.thigh, p.thighB) as Pt;
      const aF = add(kF, limb(L.shin, p.shinF) as Pt), aB = add(kB, limb(L.shin, p.shinB) as Pt);
      const elF = add(sh, limb(L.arm, p.armF) as Pt), elB = add(sh, limb(L.arm, p.armB) as Pt);
      const hF = add(elF, limb(L.fore, p.foreF) as Pt), hB = add(elB, limb(L.fore, p.foreB) as Pt);
      const lowest = Math.max(aF[1] + 3, aB[1] + 3, kF[1] + 4, kB[1] + 4, hF[1] + 3, hB[1] + 3, head[1] + L.head);
      const ox = 50 - sh[0] * 0.35;
      const oy = GROUND - lowest - bob;
      const P = (pt: Pt) => `${(ox + pt[0]).toFixed(2)} ${(oy + pt[1]).toFixed(2)}`;
      const line = (a: Pt, b: Pt) => `M ${P(a)} L ${P(b)}`;
      // shoe points forward from the ankle
      const foot = (ankle: Pt) => line(ankle, [ankle[0] + 6, ankle[1] + 0.5]);
      const d: Record<string, string> = {
        armB: `M ${P(sh)} L ${P(elB)} L ${P(hB)}`,
        thighB: line(hip, kB),
        shortsB: line(hip, lerp(hip, kB, 0.5)),
        calfB: line(kB, lerp(kB, aB, 0.45)),
        shinB: line(kB, aB),
        shoeB: foot(aB),
        torso: line(lerp(hip, sh, 0.12), lerp(hip, sh, 0.92)),
        neck: line(lerp(hip, sh, 0.9), neckTop),
        hips: line(lerp(hip, sh, -0.02), lerp(hip, sh, 0.18)),
        thighF: line(hip, kF),
        shortsF: line(hip, lerp(hip, kF, 0.5)),
        calfF: line(kF, lerp(kF, aF, 0.45)),
        shinF: line(kF, aF),
        shoeF: foot(aF),
        upperF: line(sh, elF),
        foreF: line(elF, hF),
      };
      Object.entries(d).forEach(([k, v]) => g.current[k]?.setAttribute("d", v));
      const c = (k: string, pt: Pt) => {
        g.current[k]?.setAttribute("cx", (ox + pt[0]).toFixed(2));
        g.current[k]?.setAttribute("cy", (oy + pt[1]).toFixed(2));
      };
      // hair sits on the back and top of the head, the face looks forward
      c("hair", add(head, [-1.1, -1.1]));
      c("face", add(head, [0.9, 0.5]));
      c("handF", hF);
      c("handB", hB);
    },
  }));

  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* far side */}
      <path ref={set("armB")} stroke={SKIN_FAR} strokeWidth={5} />
      <circle ref={set("handB")} r={2.6} fill={SKIN_FAR} />
      <path ref={set("thighB")} stroke={SKIN_FAR} strokeWidth={9} />
      <path ref={set("shortsB")} stroke={SHORTS} strokeWidth={10.5} />
      <path ref={set("shinB")} stroke={SKIN_FAR} strokeWidth={5} />
      <path ref={set("calfB")} stroke={SKIN_FAR} strokeWidth={7.5} />
      <path ref={set("shoeB")} stroke={SHOE} strokeWidth={4.5} />
      {/* body */}
      <path ref={set("neck")} stroke={SKIN} strokeWidth={5} />
      <path ref={set("torso")} stroke={KIT} strokeWidth={13} />
      <path ref={set("hips")} stroke={SHORTS} strokeWidth={12} />
      <circle ref={set("hair")} r={6.6} fill={SHORTS} />
      <circle ref={set("face")} r={5.8} fill={SKIN} />
      {/* near side */}
      <path ref={set("thighF")} stroke={SKIN} strokeWidth={9.5} />
      <path ref={set("shortsF")} stroke={SHORTS} strokeWidth={11} />
      <path ref={set("shinF")} stroke={SKIN} strokeWidth={5.5} />
      <path ref={set("calfF")} stroke={SKIN} strokeWidth={8} />
      <path ref={set("shoeF")} stroke={SHOE} strokeWidth={5} />
      <path ref={set("upperF")} stroke={SKIN} strokeWidth={6} />
      <path ref={set("foreF")} stroke={SKIN} strokeWidth={5} />
      <circle ref={set("handF")} r={2.8} fill={SKIN} />
    </svg>
  );
});

export default RunnerFigure;
