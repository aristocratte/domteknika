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
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  const controls = useAnimationControls();
  const elementRef = useRef<HTMLElement | null>(null);
  const currentStateRef = useRef<RevealState>("hidden");
  const targetStateRef = useRef<RevealState>("hidden");
  const isAnimatingRef = useRef(false);
  const leaveTimerRef = useRef<number | null>(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

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
      clearLeaveTimer();
      targetStateRef.current = state;
      void runAnimationQueue();
    },
    [clearLeaveTimer, runAnimationQueue],
  );

  const requestLeave = useCallback(() => {
    clearLeaveTimer();

    let checksLeft = 8;
    const resetWhenSafelyBelow = () => {
      const node = elementRef.current;
      if (!node) {
        leaveTimerRef.current = null;
        return;
      }

      const rect = node.getBoundingClientRect();
      const outsideBuffer = 120;
      const safelyBelowViewport = rect.top > window.innerHeight + outsideBuffer;

      if (safelyBelowViewport) {
        targetStateRef.current = "hidden";
        leaveTimerRef.current = null;
        void runAnimationQueue();
        return;
      }

      checksLeft -= 1;
      if (checksLeft > 0) {
        leaveTimerRef.current = window.setTimeout(resetWhenSafelyBelow, 120);
      } else {
        leaveTimerRef.current = null;
      }
    };

    leaveTimerRef.current = window.setTimeout(resetWhenSafelyBelow, 120);
  }, [clearLeaveTimer, runAnimationQueue]);

  useEffect(() => clearLeaveTimer, [clearLeaveTimer]);

  return (
    <MotionTag
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      data-reveal
      variants={variants}
      initial="hidden"
      animate={controls}
      viewport={{ once: false, margin: "-80px" }}
      onViewportEnter={() => requestState("visible")}
      onViewportLeave={requestLeave}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
