import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";

const LOGOS = [
  "logo-logitech",
  "logo-nespresso",
  "logo-nestle",
  "logo-total",
  "logo-softcar",
  "logo-gin",
  "logo-stagvelo",
  "logo-aventor",
] as const;

/**
 * Trusted By — infinite horizontal marquee of client/partner logos.
 *
 * The track is duplicated (two copies side by side) and translated by -50%
 * over the animation duration, producing a seamless infinite loop.
 * Pauses on hover. Respects prefers-reduced-motion (see globals.css).
 *
 * Reusable on other pages.
 */
export function TrustedBy() {
  const t = useTranslations("TrustedBy");

  return (
    <section className="py-14 sm:py-16" aria-label={t("label")}>
      <Container size="wide">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {t("label")}
        </p>
      </Container>

      {/* Full-bleed marquee with soft edge fades */}
      <div className="marquee-pause relative mt-8 overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />

        <div
          className="flex w-max animate-marquee items-center gap-16 pr-16"
          style={{ ["--marquee-duration" as string]: "42s" }}
        >
          {/* Copy 1 */}
          {LOGOS.map((logo) => (
            <LogoItem key={logo} src={logo} />
          ))}
          {/* Copy 2 — identical, for seamless loop */}
          {LOGOS.map((logo) => (
            <LogoItem key={`${logo}-dup`} src={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoItem({ src }: { src: string }) {
  return (
    <div className="relative h-7 w-28 shrink-0 grayscale transition-all duration-500 hover:grayscale-0 sm:h-8 sm:w-32">
      <Image
        src={`/assets/${src}.png`}
        alt={`${src.replace("logo-", "")} logo`}
        fill
        sizes="128px"
        className="object-contain"
      />
    </div>
  );
}
