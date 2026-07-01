"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LiquidGlass = dynamic(() => import("liquid-glass-react"), {
  ssr: false,
});

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "projects", href: "/#projects" },
  { key: "expertise", href: "/#expertise" },
  { key: "patent", href: "#", disabled: true },
  { key: "story", href: "#", disabled: true },
] as const;

const LIQUID_GLASS_INSET_SHADOW =
  "inset 0 1px 0 rgb(255 255 255 / 0.88), " +
  "inset 0 -1px 0 rgb(255 255 255 / 0.22), " +
  "inset 0 0 0 1px rgb(255 255 255 / 0.30)";
const LIQUID_GLASS_RIM_SHADOW =
  "inset 0 0 0 0.5px rgb(255 255 255 / 0.50), " +
  "inset 0 1px 3px rgb(255 255 255 / 0.25)";

export function Navbar() {
  const t = useTranslations("Nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNavKey, setHoveredNavKey] = useState<
    (typeof NAV_ITEMS)[number]["key"] | null
  >(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className="domtek-glass-surface relative isolate mx-auto h-[74px] max-w-[1920px] overflow-hidden rounded-b-[34px] border-b border-white/55 bg-white/[0.015] backdrop-blur-[10px] backdrop-saturate-[180%] md:h-[92px] md:rounded-b-[50px]"
        aria-label="Primary"
      >
        <NavbarLiquidGlass cornerRadius={0} removeDropShadow />
        <Container
          size="wide"
          className="relative z-10 grid h-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[150px_1fr_190px] 2xl:grid-cols-[190px_1fr_230px]"
        >
          <Link
            href="/"
            className="inline-flex w-fit rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="DOMTEKNIKA home"
          >
            <Logo className="w-[120px] md:w-[132px] 2xl:w-[158px]" />
          </Link>

          <ul
            className="hidden items-center justify-center gap-6 2xl:gap-10 md:flex"
            onMouseLeave={() => setHoveredNavKey(null)}
          >
            {NAV_ITEMS.map((item) => {
              const disabled = "disabled" in item && item.disabled;
              const activeNavKey = hoveredNavKey ?? NAV_ITEMS[0].key;

              return (
                <li
                  key={item.key}
                  onFocus={() => {
                    if (!disabled) setHoveredNavKey(item.key);
                  }}
                  onMouseEnter={() => {
                    if (!disabled) setHoveredNavKey(item.key);
                  }}
                >
                  <NavLink
                    href={item.href}
                    disabled={disabled}
                    active={!disabled && activeNavKey === item.key}
                  >
                    {t(item.key)}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-7">
            <Button
              nativeButton={false}
              size="lg"
              className="hidden h-10 rounded-[7px] px-[14px] text-[13px] font-bold shadow-[0_3px_7px_rgba(227,6,19,0.28)] transition-transform hover:-translate-y-0.5 md:inline-flex 2xl:px-4 2xl:text-[14px]"
              render={<Link href="/#contact" />}
            >
              {t("cta")}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <LanguageSwitcher className="hidden md:inline-flex" />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-[7px] border border-border bg-white/55 text-foreground backdrop-blur-xl md:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </nav>

      {mobileOpen && (
        <div className="md:hidden">
          <Container size="wide" className="pt-2">
            <div className="domtek-glass-surface relative isolate overflow-hidden rounded-[24px] border border-white/55 bg-white/[0.025] p-4 shadow-[0_12px_22px_rgba(0,39,61,0.08)] backdrop-blur-[12px] backdrop-saturate-[180%]">
              <NavbarLiquidGlass cornerRadius={24} displacementScale={20} />
              <div className="relative z-10 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.key}
                    href={item.href}
                    disabled={"disabled" in item && item.disabled}
                    mobile
                    onNavigate={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                  </NavLink>
                ))}
                <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-4">
                  <LanguageSwitcher />
                  <Button
                    nativeButton={false}
                    className="h-11 rounded-[7px] px-5 font-bold"
                    render={<Link href="/#contact" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("cta")}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function NavbarLiquidGlass({
  cornerRadius,
  displacementScale = 30,
  removeDropShadow = false,
}: {
  cornerRadius: number;
  displacementScale?: number;
  removeDropShadow?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!removeDropShadow) return;

    const root = rootRef.current;
    if (!root) return;

    const applyShadowReset = () => {
      root
        .querySelector<HTMLElement>(".glass")
        ?.style.setProperty("box-shadow", LIQUID_GLASS_INSET_SHADOW, "important");

      root.querySelectorAll<HTMLElement>("span[style]").forEach((layer) => {
        if (layer.style.boxShadow.includes("rgba(0, 0, 0")) {
          layer.style.setProperty("box-shadow", LIQUID_GLASS_RIM_SHADOW, "important");
        }
      });
    };

    applyShadowReset();
    const frameId = requestAnimationFrame(applyShadowReset);
    const timeoutId = window.setTimeout(applyShadowReset, 250);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [removeDropShadow]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <LiquidGlass
        aberrationIntensity={0}
        blurAmount={0.025}
        className="domtek-liquid-glass domtek-navbar-liquid-glass h-full w-full"
        cornerRadius={cornerRadius}
        displacementScale={displacementScale}
        elasticity={0.06}
        mode="standard"
        padding="0"
        saturation={170}
        style={{
          height: "100%",
          left: "50%",
          position: "absolute",
          top: "50%",
          width: "100%",
        }}
      >
        <span className="block h-full w-full" />
      </LiquidGlass>
    </div>
  );
}

function NavLink({
  href,
  children,
  disabled,
  active,
  mobile,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const className = cn(
    "relative inline-flex text-[14px] font-bold text-foreground transition-colors duration-300 hover:text-brand focus-visible:text-brand 2xl:text-[16px]",
    disabled && "cursor-not-allowed opacity-80 hover:text-foreground",
    mobile && "w-full rounded-[7px] px-3 py-3 text-[16px] hover:bg-white/50",
  );
  const indicator = !disabled && !mobile && (
    <span
      className={cn(
        "pointer-events-none absolute -bottom-[8px] left-0 h-px w-full origin-left bg-brand transition-transform duration-300 ease-smooth",
        active ? "scale-x-100" : "scale-x-0",
      )}
      aria-hidden
    />
  );

  if (disabled) {
    return (
      <a
        href="#"
        className={className}
        aria-disabled="true"
        onClick={(event) => event.preventDefault()}
      >
        {children}
        {indicator}
      </a>
    );
  }

  return (
    <Link href={href as never} className={className} onClick={onNavigate}>
      {children}
      {indicator}
    </Link>
  );
}
