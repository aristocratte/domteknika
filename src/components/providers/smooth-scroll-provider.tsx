"use client";

import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";

/**
 * Provides smooth, momentum-based scrolling via Lenis.
 *
 * - Honours `prefers-reduced-motion`: skips Lenis entirely when the user
 *   has requested reduced motion (accessibility).
 * - Anchors / data-scroll-to are handled natively; Lenis intercepts wheel,
 *   touch and keyboard scroll for a premium feel.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    }
    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
