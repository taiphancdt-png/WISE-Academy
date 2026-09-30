"use client";

import React, { useEffect, useRef, useState } from "react";

// Animates the number inside a label like "12,000+", "+38%" or "-25%" once it scrolls into view.
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numText = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numText.replace(/,/g, ""));
  const useComma = numText.includes(",");

  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setCurrent(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setCurrent(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!match || Number.isNaN(target)) return <span>{value}</span>;
  const shown = current === null ? numText : useComma ? current.toLocaleString("en-US") : String(current);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
