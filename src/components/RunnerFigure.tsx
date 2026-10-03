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

const RunnerFigure = forwardRef<RunnerHandle, { className?: string; color?: string; far?: string }>(function RunnerFigure(
  { className = "", color = "#ffffff", far = "#FFB98A" },
  ref
) {
  const g = useRef<Record<string, SVGElement | null>>({});
  const set = (k: string) => (el: SVGElement | null) => {
    g.current[k] = el;
  };

  useImperativeHandle(ref, () => ({
    setPose(p, bob = 0) {
      // build joints relative to the hip, then drop the figure so the lowest point touches the ground
      const [tx, ty] = [Math.sin(rad(p.torso)) * L.torso, -Math.cos(rad(p.torso)) * L.torso];
      const sh = [tx, ty];
      const [nx, ny] = [Math.sin(rad(p.torso)) * (L.neck + L.head), -Math.cos(rad(p.torso)) * (L.neck + L.head)];
      const head = [sh[0] + nx, sh[1] + ny];
      const knee = (th: number) => limb(L.thigh, th);
      const kF = knee(p.thighF), kB = knee(p.thighB);
      const sF = limb(L.shin, p.shinF), sB = limb(L.shin, p.shinB);
      const fF = [kF[0] + sF[0], kF[1] + sF[1]], fB = [kB[0] + sB[0], kB[1] + sB[1]];
      const eF = limb(L.arm, p.armF), eB = limb(L.arm, p.armB);
      const hF0 = limb(L.fore, p.foreF), hB0 = limb(L.fore, p.foreB);
      const elF = [sh[0] + eF[0], sh[1] + eF[1]], elB = [sh[0] + eB[0], sh[1] + eB[1]];
      const hF = [elF[0] + hF0[0], elF[1] + hF0[1]], hB = [elB[0] + hB0[0], elB[1] + hB0[1]];
      const lowest = Math.max(fF[1], fB[1], kF[1], kB[1], hF[1], hB[1], head[1] + L.head);
      const ox = 50 - tx * 0.35;
      const oy = GROUND - lowest - bob;
      const P = (pt: number[]) => `${(ox + pt[0]).toFixed(2)} ${(oy + pt[1]).toFixed(2)}`;
      const hip = [0, 0];
      const d = {
        legF: `M ${P(hip)} L ${P(kF)} L ${P(fF)} l ${(5).toFixed(0)} 0`,
        legB: `M ${P(hip)} L ${P(kB)} L ${P(fB)} l 5 0`,
        armF: `M ${P(sh)} L ${P(elF)} L ${P(hF)}`,
        armB: `M ${P(sh)} L ${P(elB)} L ${P(hB)}`,
        torso: `M ${P(hip)} L ${P(sh)}`,
      };
      (Object.keys(d) as (keyof typeof d)[]).forEach((k) => g.current[k]?.setAttribute("d", d[k]));
      g.current.head?.setAttribute("cx", (ox + head[0]).toFixed(2));
      g.current.head?.setAttribute("cy", (oy + head[1]).toFixed(2));
    },
  }));

  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path ref={set("armB")} stroke={far} strokeWidth={4.5} />
      <path ref={set("legB")} stroke={far} strokeWidth={5.5} />
      <path ref={set("torso")} stroke={color} strokeWidth={7} />
      <path ref={set("legF")} stroke={color} strokeWidth={5.5} />
      <path ref={set("armF")} stroke={color} strokeWidth={4.5} />
      <circle ref={set("head")} r={L.head} fill={color} />
    </svg>
  );
});

export default RunnerFigure;
