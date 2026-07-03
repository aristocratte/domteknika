"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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

    let cancelQueuedResize: (() => void) | null = null;
    const queueResize = () => {
      cancelQueuedResize?.();

      let firstFrame = 0;
      let secondFrame = 0;
      const timers: number[] = [];
      const resize = () => lenis.resize();

      resize();
      firstFrame = window.requestAnimationFrame(() => {
        resize();
        secondFrame = window.requestAnimationFrame(resize);
      });
      timers.push(window.setTimeout(resize, 140));
      timers.push(window.setTimeout(resize, 520));

      cancelQueuedResize = () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
        timers.forEach((timer) => window.clearTimeout(timer));
        cancelQueuedResize = null;
      };
    };

    const handleScrollLock = (event: Event) => {
      const { locked, scrollY } =
        (event as CustomEvent<{ locked?: boolean; scrollY?: number }>).detail ??
        {};
      if (locked) {
        lenis.stop();
      } else {
        if (typeof scrollY === "number") {
          lenis.scrollTo(scrollY, { immediate: true, force: true });
        }
        lenis.start();
      }
    };
    const handleResizeRequest = () => queueResize();
    const handleAssetLoad = (event: Event) => {
      if (
        event.target === window ||
        event.target instanceof HTMLImageElement ||
        event.target instanceof HTMLVideoElement ||
        event.target instanceof HTMLIFrameElement
      ) {
        queueResize();
      }
    };

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    }
    frameId = window.requestAnimationFrame(raf);
    window.addEventListener("domtek:scroll-lock", handleScrollLock);
    window.addEventListener("domtek:scroll-resize", handleResizeRequest);
    window.addEventListener("load", handleAssetLoad);
    document.addEventListener("load", handleAssetLoad, true);
    queueResize();

    return () => {
      cancelQueuedResize?.();
      window.removeEventListener("domtek:scroll-lock", handleScrollLock);
      window.removeEventListener("domtek:scroll-resize", handleResizeRequest);
      window.removeEventListener("load", handleAssetLoad);
      document.removeEventListener("load", handleAssetLoad, true);
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("domtek:scroll-resize"));
  }, [pathname]);

  return <>{children}</>;
}
