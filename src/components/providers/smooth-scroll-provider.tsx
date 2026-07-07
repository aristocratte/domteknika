"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Provides smooth, momentum-based scrolling via Lenis.
 *
 * - Honours `prefers-reduced-motion`: skips Lenis entirely when the user
 *   has requested reduced motion (accessibility).
 * - Keeps native scroll on touch/coarse pointer devices, where Lenis can
 *   fight the browser's own momentum scrolling.
 * - Anchors / data-scroll-to are handled natively; Lenis smooths wheel scroll
 *   on pointer devices for a premium feel.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const prefersNativeTouchScroll =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || prefersNativeTouchScroll) {
      return () => {
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let cancelQueuedResize: (() => void) | null = null;
    const queueResize = (immediate = false) => {
      cancelQueuedResize?.();

      let frame = 0;
      let timer = 0;
      const resize = () => lenis.resize();

      if (immediate) {
        resize();
      }
      frame = window.requestAnimationFrame(() => {
        resize();
        timer = window.setTimeout(resize, 260);
      });

      cancelQueuedResize = () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
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
    const handleResizeRequest = () => queueResize(true);
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
    queueResize(true);

    return () => {
      cancelQueuedResize?.();
      window.removeEventListener("domtek:scroll-lock", handleScrollLock);
      window.removeEventListener("domtek:scroll-resize", handleResizeRequest);
      window.removeEventListener("load", handleAssetLoad);
      document.removeEventListener("load", handleAssetLoad, true);
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
      window.dispatchEvent(new Event("domtek:scroll-resize"));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return <>{children}</>;
}
