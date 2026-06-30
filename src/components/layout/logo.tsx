import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "nav" | "footer";
}

export function Logo({ className, variant = "nav" }: LogoProps) {
  const size =
    variant === "footer"
      ? { width: 150, height: 57 }
      : { width: 176, height: 67 };

  return (
    <Image
      src="/assets/domteknika-logo.png"
      alt="DOMTEKNIKA"
      width={size.width}
      height={size.height}
      priority={variant === "nav"}
      className={cn("h-auto w-auto shrink-0", className)}
      sizes={variant === "footer" ? "150px" : "176px"}
    />
  );
}
