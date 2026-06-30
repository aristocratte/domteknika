"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * Navbar — fixed at the top, glass effect + very light drop shadow, pill shape
 * (radius 50). Stays visually identical while scrolling, with a subtle density
 * change (slightly stronger glass) once the user scrolls past the hero fold.
 *
 * Reusable across all pages.
 */
const NAV_ITEMS = [
  { key: "projects", href: "/#projects" },
  { key: "values", href: "/#values" },
  { key: "process", href: "/#process" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5">
      <Container size="wide">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-[var(--radius-pill)] px-4 py-2.5 transition-all duration-500 ease-smooth",
            "glass border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
            scrolled && "shadow-[0_10px_40px_rgba(0,0,0,0.10)]",
          )}
          aria-label="Primary"
        >
          {/* Logo */}
          <Link
            href="/"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <NavLink href={item.href}>{t(item.key)}</NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Button
              size="sm"
              className="hidden h-9 rounded-full px-4 text-sm font-semibold sm:inline-flex"
              render={<Link href="/contact" />}
            >
              {t("cta")}
              <ArrowRight data-icon="inline-end" />
            </Button>

            {/* Mobile toggle */}
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <Container size="wide" className="mt-2">
              <div className="glass flex flex-col gap-1 rounded-3xl border border-white/40 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.10)]">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <LanguageSwitcher />
                  <Button
                    size="sm"
                    className="h-10 rounded-full px-5"
                    render={<Link href="/contact" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("cta")}
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as never}
      className="group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 scale-90 rounded-full bg-muted opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
    </Link>
  );
}
