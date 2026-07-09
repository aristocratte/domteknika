"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";

import { locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LANGUAGE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  ko: "한국어",
  zh: "中文",
};

const LANGUAGE_BADGES: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  es: "ES",
  ko: "KO",
  zh: "ZH",
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

    const viewportWidth = window.innerWidth;
    const minWidth = Math.max(
      viewportWidth >= 2400 ? 340 : viewportWidth >= 2200 ? 360 : 144,
      rect.width,
    );
    setMenuPosition({
      left: Math.max(12, rect.right - minWidth),
      minWidth,
      top: rect.bottom + (viewportWidth >= 2200 ? 14 : 8),
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
    window.sessionStorage.setItem(
      "domtek:preserve-scroll-on-route",
      JSON.stringify({
        left: window.scrollX,
        top: window.scrollY,
      }),
    );
    startTransition(() => {
      router.push(pathname, { locale: next });
    });
  }

  const menu =
    typeof document !== "undefined" && open && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[950] rounded-[10px] border border-white/80 bg-white/90 p-1 shadow-[0_16px_34px_rgba(0,0,0,0.14)] backdrop-blur-2xl min-[2200px]:max-[2399px]:rounded-[22px] min-[2200px]:max-[2399px]:p-3 min-[2400px]:rounded-[18px] min-[2400px]:p-2"
            style={{
              left: menuPosition.left,
              minWidth: menuPosition.minWidth,
              top: menuPosition.top,
            }}
          >
            {locales.map((locale) => {
              const active = locale === current;
              const badge = LANGUAGE_BADGES[locale];
              const showBadge = badge !== LANGUAGE_NAMES[locale];

              return (
                <button
                  key={locale}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  disabled={isPending}
                  onClick={() => switchTo(locale)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-[7px] px-3 py-2 text-left text-[13px] font-bold text-foreground transition-colors hover:bg-brand/10 focus-visible:bg-brand/10 focus-visible:outline-none disabled:opacity-60 min-[2200px]:max-[2399px]:gap-10 min-[2200px]:max-[2399px]:rounded-[15px] min-[2200px]:max-[2399px]:px-7 min-[2200px]:max-[2399px]:py-5 min-[2200px]:max-[2399px]:text-[26px] min-[2400px]:gap-8 min-[2400px]:rounded-[13px] min-[2400px]:px-6 min-[2400px]:py-4 min-[2400px]:text-[24px]",
                    active && "bg-brand text-white hover:bg-brand",
                  )}
                >
                  <span>{LANGUAGE_NAMES[locale]}</span>
                  {showBadge ? (
                    <span className="text-[11px] min-[2200px]:max-[2399px]:text-[21px] min-[2400px]:text-[19px]">{badge}</span>
                  ) : null}
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
        className="inline-flex h-[42px] min-w-[64px] items-center justify-center gap-1.5 rounded-[10px] border border-white/75 bg-white/[0.72] px-3 text-[13px] font-extrabold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-colors hover:bg-white/[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60 min-[2200px]:max-[2399px]:h-[80px] min-[2200px]:max-[2399px]:min-w-[138px] min-[2200px]:max-[2399px]:gap-4 min-[2200px]:max-[2399px]:rounded-[20px] min-[2200px]:max-[2399px]:px-8 min-[2200px]:max-[2399px]:text-[28px] min-[2400px]:h-[70px] min-[2400px]:min-w-[138px] min-[2400px]:gap-3 min-[2400px]:rounded-[18px] min-[2400px]:px-6 min-[2400px]:text-[26px]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("switch")}
      >
        {LANGUAGE_BADGES[current]}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200 min-[2200px]:max-[2399px]:size-7 min-[2400px]:size-6",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}
