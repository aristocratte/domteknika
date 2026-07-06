"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import GlassSurface from "@/components/ui/glass-surface";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "expertise", href: "/expertise" },
  { key: "patent", href: "/patent" },
  { key: "story", href: "/our-story" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(true);
  const [hoveredNavKey, setHoveredNavKey] = useState<
    (typeof NAV_ITEMS)[number]["key"] | null
  >(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const currentNavKey =
    pathname === "/projects"
      ? "projects"
      : pathname === "/expertise"
        ? "expertise"
        : pathname === "/patent"
          ? "patent"
          : pathname === "/our-story"
            ? "story"
            : pathname === "/"
              ? "home"
              : null;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(window.scrollY, 0);

        if (mobileOpen || currentScrollY <= 2) {
          setMobileNavVisible(true);
        } else if (currentScrollY > lastScrollYRef.current) {
          setMobileNavVisible(false);
        } else if (currentScrollY < lastScrollYRef.current) {
          setMobileNavVisible(true);
        }

        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tickingRef.current = false;
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[900]">
      <nav
        className="relative isolate mx-auto hidden h-[80px] w-[calc(100%-32px)] max-w-[1760px] rounded-b-[50px] md:block"
        aria-label="Primary"
      >
        <div
          className="absolute inset-0 rounded-b-[50px] bg-white/75 shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
          aria-hidden
        />
        <div className="domtek-glass-surface absolute inset-x-px top-0 bottom-px z-0 overflow-hidden rounded-b-[49px] border-b border-white/55 bg-white/[0.015] backdrop-blur-[10px] backdrop-saturate-[180%]">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={0}
              backgroundOpacity={0.018}
              saturation={1.8}
              distortionScale={0}
              redOffset={0}
              greenOffset={0}
              blueOffset={0}
              className="[&>div:last-child]:p-0"
            />
          </div>
        </div>
        <Container
          size="wide"
          className="relative z-10 grid h-full max-w-none grid-cols-[118px_minmax(0,1fr)_178px] items-center gap-4 px-8 sm:px-10 lg:grid-cols-[150px_minmax(0,1fr)_230px] lg:px-14 2xl:grid-cols-[190px_minmax(0,1fr)_250px] 2xl:px-20"
        >
          <Link
            href="/"
            className="inline-flex w-fit rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="DOMTEKNIKA home"
          >
            <Logo className="w-[120px] md:w-[118px] lg:w-[132px] 2xl:w-[158px]" />
          </Link>

          <ul
            className="hidden min-w-0 items-center justify-center gap-3 md:flex min-[960px]:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10"
            onMouseLeave={() => setHoveredNavKey(null)}
          >
            {NAV_ITEMS.map((item) => {
              const disabled = "disabled" in item ? Boolean(item.disabled) : false;
              const activeNavKey = hoveredNavKey ?? currentNavKey;

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

          <div className="flex min-w-0 items-center justify-end gap-2 lg:gap-4 xl:gap-7">
            <Button
              nativeButton={false}
              size="lg"
              className="hidden h-10 rounded-[7px] border-0 px-3 text-[12px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform has-data-[icon=inline-end]:gap-2 hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35 md:inline-flex lg:px-[14px] lg:text-[13px] 2xl:px-4 2xl:text-[14px]"
              render={<Link href="/contact" />}
            >
              {t("cta")}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <LanguageSwitcher className="hidden md:inline-flex" />
          </div>
        </Container>
      </nav>

      <motion.div
        className={cn(
          "fixed inset-x-4 top-3 z-[910] transform-gpu will-change-transform md:hidden",
          !mobileNavVisible && !mobileOpen && "pointer-events-none",
        )}
        initial={false}
        animate={{
          y: mobileNavVisible || mobileOpen ? 0 : -88,
          opacity: mobileNavVisible || mobileOpen ? 1 : 0,
        }}
        transition={{
          y: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <div className="flex h-[68px] items-center justify-between gap-3 rounded-[18px] border border-border/80 bg-white px-3.5 pl-5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] ring-1 ring-black/5">
          <Link
            href="/"
            className="inline-flex min-w-0 rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="DOMTEKNIKA home"
            onClick={() => setMobileOpen(false)}
          >
            <Logo className="w-[142px]" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher className="[&>button]:h-[52px] [&>button]:min-w-[56px] [&>button]:rounded-[12px] [&>button]:border-border [&>button]:bg-white [&>button]:px-2.5 [&>button]:shadow-[0_6px_18px_rgba(0,0,0,0.10)]" />
            <button
              type="button"
              className="grid size-[52px] shrink-0 place-items-center rounded-[12px] border border-border bg-white text-foreground shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[920] md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.button
              type="button"
              className="absolute inset-0 cursor-default bg-black/20 backdrop-blur-[5px]"
              aria-label={t("closeMenu")}
              onClick={() => setMobileOpen(false)}
              variants={{
                closed: { opacity: 0 },
                open: { opacity: 1 },
              }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              className="absolute inset-y-0 right-0 isolate flex w-[min(84vw,360px)] flex-col overflow-hidden border-l border-border bg-white shadow-[-18px_0_42px_rgba(0,0,0,0.12)]"
              aria-label={t("openMenu")}
              variants={{
                closed: { x: "100%", opacity: 0.98 },
                open: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative z-10 flex h-full flex-col px-6 pb-7 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="/"
                    className="inline-flex rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                    aria-label="DOMTEKNIKA home"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Logo className="w-[126px]" />
                  </Link>
                  <button
                    type="button"
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-brand/30 bg-white text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
                    aria-label={t("closeMenu")}
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>

                <div className="mt-10 flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.key}
                      href={item.href}
                      disabled={"disabled" in item ? Boolean(item.disabled) : false}
                      active={
                        !("disabled" in item ? Boolean(item.disabled) : false) &&
                        currentNavKey === item.key
                      }
                      mobile
                      onNavigate={() => setMobileOpen(false)}
                    >
                      {t(item.key)}
                    </NavLink>
                  ))}
                </div>

                <div className="mt-auto border-t border-border/70 pt-5">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      nativeButton={false}
                      className="h-11 rounded-[7px] border-0 px-5 font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
                      render={<Link href="/contact" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("cta")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
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
    "relative inline-flex whitespace-nowrap text-[13px] font-bold text-foreground transition-colors duration-300 hover:text-brand focus-visible:text-brand lg:text-[14px] 2xl:text-[16px]",
    disabled && "cursor-not-allowed opacity-80 hover:text-foreground",
    mobile &&
      "w-full items-center rounded-[7px] px-4 py-3 text-[18px] hover:bg-muted",
    mobile && active && "bg-muted text-brand",
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
