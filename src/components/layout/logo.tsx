import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "nav" | "footer";
}

export function Logo({ className, variant = "nav" }: LogoProps) {
  return (
    <Image
      src="/assets/logo_DOMTEKNIKA_2023-alpha.png"
      alt="DOMTEKNIKA"
      width={246}
      height={99}
      priority={variant === "nav"}
      className={cn("h-auto w-auto shrink-0", className)}
      sizes={variant === "footer" ? "132px" : "158px"}
    />
  );
}
