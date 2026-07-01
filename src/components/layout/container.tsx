import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  default: "max-w-[1040px]",
  wide: "max-w-[1160px]",
  narrow: "max-w-[820px]",
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
        "mx-auto w-full px-7 sm:px-10 lg:px-14 xl:px-16",
        sizes[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
