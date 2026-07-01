"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";

import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    minWidth: number;
    top: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateMenuPosition = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    const minWidth = Math.max(144, rect.width);
    setMenuPosition({
      left: Math.max(12, rect.right - minWidth),
      minWidth,
      top: rect.bottom + 8,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  function switchTo(next: Locale) {
    setOpen(false);
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

  const menu =
    typeof document !== "undefined" && open && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[80] rounded-[10px] border border-white/80 bg-white/90 p-1 shadow-[0_16px_34px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
            style={{
              left: menuPosition.left,
              minWidth: menuPosition.minWidth,
              top: menuPosition.top,
            }}
          >
            {locales.map((locale) => {
              const active = locale === current;

              return (
                <button
                  key={locale}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  disabled={isPending}
                  onClick={() => switchTo(locale)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-[7px] px-3 py-2 text-left text-[13px] font-bold text-foreground transition-colors hover:bg-brand/10 focus-visible:bg-brand/10 focus-visible:outline-none disabled:opacity-60",
                    active && "bg-brand text-white hover:bg-brand",
                  )}
                >
                  <span>{LANGUAGE_NAMES[locale]}</span>
                  <span className="text-[11px] uppercase">{locale}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={isPending}
        className="inline-flex h-[42px] min-w-[64px] items-center justify-center gap-1.5 rounded-[10px] border border-white/75 bg-white/[0.72] px-3 text-[13px] font-extrabold uppercase text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-colors hover:bg-white/[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("switch")}
      >
        {current}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}
