"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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
    <button
      type="button"
      onClick={() => switchTo(current === "en" ? "fr" : "en")}
      disabled={isPending}
      className={cn(
        "inline-flex h-[38px] min-w-[50px] items-center justify-center rounded-[7px] border border-border bg-white/55 px-3 text-[13px] font-bold uppercase text-foreground backdrop-blur-xl transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60",
        className,
      )}
      aria-label={t("switch")}
    >
      {current}
    </button>
  );
}
