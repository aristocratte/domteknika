import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Container — centers content and adds the lateral margins missing from the
 * Figma (which is full-bleed). This keeps the layout readable on large screens
 * and provides a single source of truth for the content max-width.
 *
 * Max width ~1200px keeps the design centered rather than stretched to edges.
 */
const sizes = {
  default: "max-w-[1200px]",
  wide: "max-w-[1400px]",
  narrow: "max-w-[960px]",
} as const;

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: keyof typeof sizes;
}

export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-10",
        sizes[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
