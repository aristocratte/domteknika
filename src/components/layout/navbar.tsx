"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "projects", href: "/#projects" },
  { key: "expertise", href: "/#expertise" },
  { key: "patent", href: "#", disabled: true },
  { key: "story", href: "#", disabled: true },
] as const;

const LIQUID_SURFACE_STYLE = {
  background:
    "radial-gradient(ellipse at 16% -12%, rgb(255 255 255 / 0.82), transparent 33%), radial-gradient(ellipse at 82% 118%, rgb(255 255 255 / 0.34), transparent 46%), linear-gradient(92deg, rgb(227 6 19 / 0.18), transparent 16%, transparent 80%, rgb(0 151 255 / 0.24)), linear-gradient(104deg, rgb(255 255 255 / 0.46), rgb(255 255 255 / 0.12) 46%, rgb(255 255 255 / 0.38)), rgb(255 255 255 / 0.16)",
  boxShadow:
    "inset 0 1px 0 rgb(255 255 255 / 0.92), inset 0 -20px 42px rgb(0 70 145 / 0.10), inset 0 18px 28px rgb(255 255 255 / 0.38), inset 2px 0 0 rgb(227 6 19 / 0.18), inset -2px 0 0 rgb(0 151 255 / 0.20), 0 16px 42px rgb(0 39 61 / 0.18)",
} satisfies CSSProperties;

const LIQUID_CHROMA_STYLE = {
  borderRadius: "inherit",
  background:
    "linear-gradient(90deg, rgb(227 6 19 / 0.35), transparent 18%, transparent 78%, rgb(0 151 255 / 0.38)), radial-gradient(circle at 18% 4%, rgb(227 6 19 / 0.26), transparent 28%), radial-gradient(circle at 84% 8%, rgb(0 151 255 / 0.30), transparent 28%)",
  filter: "blur(18px)",
  opacity: 0.78,
  mixBlendMode: "multiply",
} satisfies CSSProperties;

const LIQUID_SHEEN_STYLE = {
  borderRadius: "inherit",
  background:
    "linear-gradient(104deg, transparent 3%, rgb(255 255 255 / 0.72) 16%, transparent 31%, rgb(255 255 255 / 0.36) 64%, transparent 86%), radial-gradient(ellipse at 50% -18%, rgb(255 255 255 / 0.68), transparent 42%)",
  filter: "blur(0.5px)",
  mixBlendMode: "screen",
} satisfies CSSProperties;

const LIQUID_RIM_STYLE = {
  borderRadius: "inherit",
  border: "1px solid rgb(255 255 255 / 0.54)",
  background:
    "linear-gradient(180deg, rgb(255 255 255 / 0.50), transparent 28%, transparent 66%, rgb(255 255 255 / 0.28))",
  boxShadow:
    "inset 0 -1px 0 rgb(255 255 255 / 0.44), inset 0 0 36px rgb(255 255 255 / 0.34), 0 1px 0 rgb(255 255 255 / 0.38)",
} satisfies CSSProperties;

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
        className="relative isolate mx-auto h-[74px] max-w-[1920px] overflow-hidden rounded-b-[34px] border-b border-white/45 backdrop-blur-[52px] backdrop-brightness-[1.08] backdrop-contrast-[1.24] backdrop-saturate-[320%] md:h-[92px] md:rounded-b-[50px]"
        style={LIQUID_SURFACE_STYLE}
        aria-label="Primary"
      >
        <LiquidGlassLayers />
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
            <div
              className="relative isolate overflow-hidden rounded-[24px] border border-white/45 p-4 shadow-[0_18px_34px_rgba(0,39,61,0.18)] backdrop-blur-[44px] backdrop-brightness-[1.08] backdrop-contrast-[1.22] backdrop-saturate-[280%]"
              style={LIQUID_SURFACE_STYLE}
            >
              <LiquidGlassLayers />
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

function LiquidGlassLayers() {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-x-0 top-[-20%] z-0 h-[140%]"
        style={LIQUID_CHROMA_STYLE}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 z-0"
        style={LIQUID_SHEEN_STYLE}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-px z-0"
        style={LIQUID_RIM_STYLE}
        aria-hidden
      />
    </>
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
