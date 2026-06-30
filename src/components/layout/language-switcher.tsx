"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Compact FR / EN language switcher. Switches the locale prefix while keeping
 * the current path.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === current) return;
    startTransition(() => {
      // Replace the leading /xx (locale segment) of the current pathname.
      const segments = pathname.split("/");
      // pathname starts with "/<locale>/..." → segments[1] is the locale
      if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
        segments[1] = next;
      } else {
        segments.splice(1, 0, next);
      }
      router.push(segments.join("/") || `/${next}`);
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-background/60 p-0.5 text-xs font-semibold backdrop-blur",
        className,
      )}
      role="group"
      aria-label={t("switch")}
    >
      <Globe className="ml-1.5 mr-0.5 size-3.5 text-muted-foreground" />
      {locales.map((lc) => (
        <button
          key={lc}
          type="button"
          onClick={() => switchTo(lc)}
          aria-current={lc === current}
          disabled={isPending}
          className={cn(
            "rounded-full px-2 py-0.5 uppercase tracking-wide transition-colors",
            lc === current
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {lc}
        </button>
      ))}
    </div>
  );
}
