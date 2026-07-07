"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { motion, useAnimationControls, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealState = "hidden" | "visible";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the reveal animation starts. */
  delay?: number;
  /** Keep the reveal hidden until the page has been scrolled by this amount. */
  minimumScrollY?: number;
  /** Render as a different element. */
  as?: "article" | "div" | "section" | "li" | "span";
}

/**
 * Reveal — fades + slides content up once it enters the viewport.
 * Respects prefers-reduced-motion via Framer Motion's default behavior
 * (motion is disabled when the user opts out).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  minimumScrollY = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  const controls = useAnimationControls();
  const elementRef = useRef<HTMLElement | null>(null);
  const currentStateRef = useRef<RevealState>("hidden");
  const targetStateRef = useRef<RevealState>("hidden");
  const isAnimatingRef = useRef(false);

  const runAnimationQueue = useCallback(async () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    try {
      while (targetStateRef.current !== currentStateRef.current) {
        const nextState = targetStateRef.current;
        await controls.start(nextState);
        currentStateRef.current = nextState;
      }
    } finally {
      isAnimatingRef.current = false;
    }
  }, [controls]);

  const requestState = useCallback(
    (state: RevealState) => {
      targetStateRef.current = state;
      void runAnimationQueue();
    },
    [runAnimationQueue],
  );

  const setStateImmediately = useCallback(
    (state: RevealState) => {
      controls.stop();
      targetStateRef.current = state;
      currentStateRef.current = state;
      controls.set(state);
    },
    [controls],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const shouldStartVisible =
      window.scrollY >= minimumScrollY &&
      rect.top < viewportHeight + 120 &&
      rect.bottom > -120;

    setStateImmediately(shouldStartVisible ? "visible" : "hidden");
  }, [minimumScrollY, setStateImmediately]);

  useEffect(() => {
    const revealIfAlreadyVisible = () => {
      const element = elementRef.current;
      if (!element || currentStateRef.current === "visible") return;
      if (window.scrollY < minimumScrollY) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < viewportHeight + 120 && rect.bottom > -120) {
        requestState("visible");
      }
    };

    const frameId = window.requestAnimationFrame(revealIfAlreadyVisible);
    const timerId = window.setTimeout(revealIfAlreadyVisible, 450);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [minimumScrollY, requestState]);

  useEffect(() => {
    if (!minimumScrollY) return;

    const revealAfterScrollStarts = () => {
      const element = elementRef.current;
      if (!element || currentStateRef.current === "visible") return;
      if (window.scrollY < minimumScrollY) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < viewportHeight + 120 && rect.bottom > -120) {
        requestState("visible");
      }
    };

    window.addEventListener("scroll", revealAfterScrollStarts, { passive: true });
    return () => window.removeEventListener("scroll", revealAfterScrollStarts);
  }, [minimumScrollY, requestState]);

  return (
    <MotionTag
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      data-reveal
      variants={variants}
      initial={false}
      animate={controls}
      viewport={{ once: true, margin: "-80px" }}
      onViewportEnter={() => {
        if (window.scrollY < minimumScrollY) return;
        requestState("visible");
      }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
