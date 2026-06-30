import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  default: "max-w-[1200px]",
  wide: "max-w-[1536px]",
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
        "mx-auto w-full px-5 sm:px-8 xl:px-10 2xl:px-0",
        sizes[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
