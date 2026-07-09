"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

/**
 * Keeps route transitions predictable while preserving native browser scroll.
 *
 * Lenis used to run a requestAnimationFrame loop on every page and smooth every
 * wheel event. On long DOMTEKNIKA pages that made quick scrolling feel choppy,
 * especially while reveal animations were entering the viewport. Native CSS
 * smooth scroll is still allowed for anchors because it does not intercept
 * wheel/touch input.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    let restoreFrameId = 0;
    const frameId = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      const preservedScroll = readPreservedRouteScroll();

      root.style.scrollBehavior = "auto";
      window.scrollTo({
        left: preservedScroll?.left ?? 0,
        top: preservedScroll?.top ?? 0,
        behavior: "auto",
      });
      window.dispatchEvent(new Event("domtek:scroll-resize"));

      restoreFrameId = window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(restoreFrameId);
    };
  }, [pathname]);

  return <>{children}</>;
}

function readPreservedRouteScroll() {
  const rawValue = window.sessionStorage.getItem(
    "domtek:preserve-scroll-on-route",
  );
  if (!rawValue) return null;

  window.sessionStorage.removeItem("domtek:preserve-scroll-on-route");

  try {
    const parsed = JSON.parse(rawValue) as {
      left?: unknown;
      top?: unknown;
    };
    if (
      typeof parsed.left !== "number" ||
      typeof parsed.top !== "number"
    ) {
      return null;
    }

    return { left: parsed.left, top: parsed.top };
  } catch {
    return null;
  }
}
