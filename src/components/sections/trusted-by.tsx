import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { cn } from "@/lib/utils";

const LOGOS = [
  { name: "Aventor", src: "logo-aventor", width: 251, height: 42 },
  { name: "Logitech", src: "logo-logitech", width: 148, height: 48 },
  { name: "Nestle", src: "logo-nestle", width: 78, height: 81 },
  { name: "Nespresso", src: "logo-nespresso", width: 172, height: 108 },
  { name: "Softcar", src: "logo-softcar", width: 222, height: 125 },
  { name: "TotalEnergies", src: "logo-total", width: 117, height: 85 },
  { name: "Stajvelo", src: "logo-stagvelo", width: 218, height: 73 },
  { name: "GIN Kiteboarding", src: "logo-gin", width: 169, height: 113 },
] as const;

const TRUSTED_BY_ENABLED = false;

type TrustedByProps = {
  density?: "default" | "compact";
};

export function TrustedBy(props: TrustedByProps) {
  return TRUSTED_BY_ENABLED ? <TrustedByContent {...props} /> : null;
}

function TrustedByContent({ density = "default" }: TrustedByProps) {
  const t = useTranslations("TrustedBy");
  const logos = [...LOGOS, ...LOGOS];
  const compact = density === "compact";

  return (
    <section
      className={cn(
        "bg-background py-8 md:py-[72px]",
        compact
          ? "min-[1800px]:!py-[96px] min-[2300px]:!py-[112px]"
          : "min-[1800px]:py-[160px] min-[2300px]:!py-[120px]",
      )}
      aria-label={t("label")}
    >
      <Container
        size="wide"
        className={cn(
          "mb-4 md:mb-8",
          compact
            ? "min-[1800px]:!mb-10 min-[1800px]:!max-w-[1600px] min-[2300px]:!mb-12"
            : "min-[1800px]:mb-20 min-[2300px]:!mb-14 min-[2300px]:!max-w-[1900px]",
        )}
      >
        <Reveal>
          <h2
            className={cn(
              "text-[14px] font-normal uppercase leading-none tracking-normal text-foreground md:text-[18px]",
              compact
                ? "min-[1800px]:!text-[22px] min-[2300px]:!text-[24px]"
                : "min-[1800px]:text-[46px] min-[2300px]:!text-[40px]",
            )}
          >
            {t("label")}
          </h2>
        </Reveal>
      </Container>

      <Reveal delay={0.08}>
        <div data-marquee-rail className="relative overflow-hidden bg-muted py-1 md:py-2">
          <div
            className="flex w-max animate-marquee items-center gap-6 pr-6 md:gap-11 md:pr-11"
            style={{ ["--marquee-duration" as string]: "36s" }}
          >
            {logos.map((logo, index) => {
              const logoBoxWidth = Math.min(Math.round(logo.width * 1.08), 230);
              const logoBoxHeight = Math.min(Math.round(logo.height * 1.08), 86);
              const mobileLogoBoxWidth = Math.min(
                Math.round(logo.width * 0.72),
                150,
              );
              const mobileLogoBoxHeight = Math.min(
                Math.round(logo.height * 0.72),
                56,
              );
              const wideLogoBoxWidth = Math.min(Math.round(logo.width * 2.05), 460);
              const wideLogoBoxHeight = Math.min(Math.round(logo.height * 2.05), 180);
              const ultraLogoBoxWidth = Math.min(Math.round(logo.width * 1.75), 390);
              const ultraLogoBoxHeight = Math.min(Math.round(logo.height * 1.75), 150);
              const compactLogoBoxWidth = Math.min(
                Math.round(logo.width * 1.45),
                320,
              );
              const compactLogoBoxHeight = Math.min(
                Math.round(logo.height * 1.45),
                120,
              );

              return (
                <div
                  key={`${logo.name}-${index}`}
                  className={cn(
                    "flex h-[64px] w-[150px] shrink-0 items-center justify-center md:h-[100px] md:w-[230px]",
                    compact
                      ? "min-[1800px]:!h-[150px] min-[1800px]:!w-[360px] min-[2300px]:!h-[160px] min-[2300px]:!w-[380px]"
                      : "min-[1800px]:h-[220px] min-[1800px]:w-[520px] min-[2300px]:!h-[190px] min-[2300px]:!w-[440px]",
                  )}
                >
                  <div
                    className={cn(
                      "relative h-[var(--logo-height-mobile)] w-[var(--logo-width-mobile)] md:h-[var(--logo-height)] md:w-[var(--logo-width)]",
                      compact
                        ? "min-[1800px]:!h-[var(--logo-height-compact)] min-[1800px]:!w-[var(--logo-width-compact)]"
                        : "min-[1800px]:h-[var(--logo-height-wide)] min-[1800px]:w-[var(--logo-width-wide)] min-[2300px]:!h-[var(--logo-height-ultra)] min-[2300px]:!w-[var(--logo-width-ultra)]",
                    )}
                    style={{
                      "--logo-width-mobile": `${mobileLogoBoxWidth}px`,
                      "--logo-height-mobile": `${mobileLogoBoxHeight}px`,
                      "--logo-width": `${logoBoxWidth}px`,
                      "--logo-height": `${logoBoxHeight}px`,
                      "--logo-width-wide": `${wideLogoBoxWidth}px`,
                      "--logo-height-wide": `${wideLogoBoxHeight}px`,
                      "--logo-width-ultra": `${ultraLogoBoxWidth}px`,
                      "--logo-height-ultra": `${ultraLogoBoxHeight}px`,
                      "--logo-width-compact": `${compactLogoBoxWidth}px`,
                      "--logo-height-compact": `${compactLogoBoxHeight}px`,
                    } as CSSProperties}
                  >
                    <Image
                      src={`/assets/${logo.src}.png`}
                      alt={logo.name}
                      fill
                      sizes={`${compact ? compactLogoBoxWidth : logoBoxWidth}px`}
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[min(15vw,190px)]"
            style={{
              background:
                "linear-gradient(90deg, var(--muted) 0%, rgb(247 247 247 / 0.92) 30%, rgb(247 247 247 / 0.54) 64%, rgb(247 247 247 / 0) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              maskImage:
                "linear-gradient(90deg, black 0%, black 34%, rgb(0 0 0 / 0.72) 58%, rgb(0 0 0 / 0.24) 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, black 0%, black 34%, rgb(0 0 0 / 0.72) 58%, rgb(0 0 0 / 0.24) 82%, transparent 100%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[min(15vw,190px)]"
            style={{
              background:
                "linear-gradient(270deg, var(--muted) 0%, rgb(247 247 247 / 0.92) 30%, rgb(247 247 247 / 0.54) 64%, rgb(247 247 247 / 0) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              maskImage:
                "linear-gradient(270deg, black 0%, black 34%, rgb(0 0 0 / 0.72) 58%, rgb(0 0 0 / 0.24) 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(270deg, black 0%, black 34%, rgb(0 0 0 / 0.72) 58%, rgb(0 0 0 / 0.24) 82%, transparent 100%)",
            }}
            aria-hidden
          />
        </div>
      </Reveal>
    </section>
  );
}
