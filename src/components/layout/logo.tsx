import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show the brand wordmark next to the mark. */
  showWordmark?: boolean;
}

/**
 * Domteknika logo — a geometric "D" mark inside a rounded square using the
 * brand red, followed by the wordmark with the accent dot in red.
 *
 * Purely typographic/SVG so it stays crisp at any size and needs no asset.
 */
export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 shrink-0" />
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Domtek
          <span className="text-brand">nika</span>
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-[10px] bg-brand text-brand-foreground shadow-sm",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-1/2"
        aria-hidden
      >
        <path
          d="M7 5h6a6 6 0 0 1 0 12H7V5Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="17.5" r="1.6" fill="currentColor" />
      </svg>
    </span>
  );
}
