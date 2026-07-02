"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
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
  return (
    <MotionTag
      data-reveal
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-80px" }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
