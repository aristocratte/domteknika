"use client";

import { useEffect, useState } from "react";
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

export function Navbar() {
  const t = useTranslations("Nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className="nav-glass mx-auto h-[82px] max-w-[1920px] rounded-b-[34px] border-b border-white/45 shadow-[0_5px_12px_rgba(0,0,0,0.22)] md:h-[104px] md:rounded-b-[50px]"
        aria-label="Primary"
      >
        <Container
          size="wide"
          className="grid h-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[170px_1fr_210px] 2xl:grid-cols-[220px_1fr_260px]"
        >
          <Link
            href="/"
            className="inline-flex w-fit rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="DOMTEKNIKA home"
          >
            <Logo className="w-[132px] md:w-[150px] 2xl:w-[176px]" />
          </Link>

          <ul className="hidden items-center justify-center gap-8 2xl:gap-[54px] md:flex">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.key}>
                <NavLink
                  href={item.href}
                  disabled={"disabled" in item && item.disabled}
                  active={index === 0}
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-9">
            <Button
              nativeButton={false}
              size="lg"
              className="hidden h-12 rounded-[7px] px-[16px] text-[14px] font-bold shadow-[0_3px_7px_rgba(227,6,19,0.28)] transition-transform hover:-translate-y-0.5 md:inline-flex 2xl:px-[18px] 2xl:text-[15px]"
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
            <div className="nav-glass flex flex-col gap-1 rounded-[24px] border border-white/45 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
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
          </Container>
        </div>
      )}
    </header>
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
    "relative inline-flex text-[16px] font-bold text-foreground transition-colors hover:text-brand 2xl:text-[18px]",
    active &&
      "after:absolute after:-bottom-[8px] after:left-0 after:h-px after:w-full after:bg-brand",
    disabled && "cursor-not-allowed opacity-80 hover:text-foreground",
    mobile && "w-full rounded-[7px] px-3 py-3 text-[16px] hover:bg-white/50",
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
      </a>
    );
  }

  return (
    <Link href={href as never} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
