"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { motion, useAnimationControls, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealState = "hidden" | "visible";
type ScrollDirection = "down" | "up";

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
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<ScrollDirection>("down");

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollYRef.current) > 1) {
        scrollDirectionRef.current =
          scrollY > lastScrollYRef.current ? "down" : "up";
        lastScrollYRef.current = scrollY;
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
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
      onViewportEnter={() => {
        if (scrollDirectionRef.current === "down") {
          requestState("visible");
          return;
        }

        setStateImmediately("visible");
      }}
      onViewportLeave={() => {
        if (scrollDirectionRef.current === "up") {
          requestState("hidden");
        }
      }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
