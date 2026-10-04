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
