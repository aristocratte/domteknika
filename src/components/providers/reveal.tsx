"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { motion, useAnimationControls, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const isVisibleRef = useRef(false);
  const isInViewportRef = useRef(false);

  const reveal = useCallback(() => {
    if (isVisibleRef.current || window.scrollY < minimumScrollY) return;

    isVisibleRef.current = true;
    void controls.start("visible");
  }, [controls, minimumScrollY]);

  useEffect(() => {
    const revealIfAlreadyVisible = () => {
      const element = elementRef.current;
      if (!element || isVisibleRef.current) return;
      if (window.scrollY < minimumScrollY) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < viewportHeight + 120 && rect.bottom > -120) {
        reveal();
      }
    };

    const frameId = window.requestAnimationFrame(revealIfAlreadyVisible);
    const timerId = window.setTimeout(revealIfAlreadyVisible, 450);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [minimumScrollY, reveal]);

  useEffect(() => {
    if (!minimumScrollY) return;

    const revealAfterScrollStarts = () => {
      if (isInViewportRef.current) reveal();
    };

    window.addEventListener("scroll", revealAfterScrollStarts, { passive: true });
    return () => window.removeEventListener("scroll", revealAfterScrollStarts);
  }, [minimumScrollY, reveal]);

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
        isInViewportRef.current = true;
        reveal();
      }}
      onViewportLeave={() => {
        isInViewportRef.current = false;
      }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
