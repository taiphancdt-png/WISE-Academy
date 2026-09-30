"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Blocks that fade/slide in when scrolled into view: each section's top-level content,
// plus every item of a grid so cards appear one after another.
const SELECTOR = [
  "main section > div > *:not(.grid)",
  "main section .grid > *",
  "main section > div > .grid > *",
].join(",");

const STAGGER_MS = 90;
const MAX_STAGGER = 5;

/**
 * Site-wide scroll reveal. Uses a data attribute (not className) so React re-renders never fight it,
 * and removes the attribute after the transition so hover transitions on cards keep working.
 * Content already on screen at load is left untouched (no flash), and it is skipped entirely
 * for prefers-reduced-motion, inside [data-no-reveal] (article bodies), and inside the marquee.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.setAttribute("data-reveal", "shown");
          const delay = parseInt(el.style.transitionDelay || "0", 10) || 0;
          window.setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.style.transitionDelay = "";
          }, 800 + delay);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const scan = () => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
        (el) =>
          !el.dataset.revealDone &&
          !el.closest("[data-no-reveal]") &&
          !el.closest(".logo-marquee")
      );
      const viewportBottom = window.innerHeight;
      const siblingIndex = new Map<Element, number>();
      // Document order: a block whose ancestor is already animating is skipped (no double animation),
      // but children of an on-screen container still get their own reveal (e.g. article cards in a long list).
      for (const el of candidates) {
        if (el.parentElement?.closest('[data-reveal="hidden"]')) {
          el.dataset.revealDone = "1";
          continue;
        }
        el.dataset.revealDone = "1";
        // Leave anything already visible alone to avoid a hide-then-show flash.
        if (el.getBoundingClientRect().top < viewportBottom * 0.92) continue;
        const parent = el.parentElement;
        const idx = parent ? siblingIndex.get(parent) ?? 0 : 0;
        if (parent) siblingIndex.set(parent, idx + 1);
        el.style.transitionDelay = `${Math.min(idx, MAX_STAGGER) * STAGGER_MS}ms`;
        el.setAttribute("data-reveal", "hidden");
        observer.observe(el);
      }
    };

    // Wait a frame so the new route has rendered.
    const raf = window.requestAnimationFrame(scan);

    // Pick up content added later (load more, filters).
    let timer: number | undefined;
    const main = document.querySelector("main");
    const mutations = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 120);
    });
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
