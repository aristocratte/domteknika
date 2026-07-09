import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";

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

export function TrustedBy() {
  const t = useTranslations("TrustedBy");
  const logos = [...LOGOS, ...LOGOS];

  return (
    <section className="bg-background py-8 md:py-[72px] min-[1800px]:py-[160px] min-[2400px]:py-[184px]" aria-label={t("label")}>
      <Container size="wide" className="mb-4 md:mb-8 min-[1800px]:mb-20">
        <Reveal>
          <h2 className="text-[14px] font-normal uppercase leading-none tracking-normal text-foreground md:text-[18px] min-[1800px]:text-[46px] min-[2400px]:text-[54px]">
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
              const ultraLogoBoxWidth = Math.min(Math.round(logo.width * 2.35), 530);
              const ultraLogoBoxHeight = Math.min(Math.round(logo.height * 2.35), 210);

              return (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex h-[64px] w-[150px] shrink-0 items-center justify-center md:h-[100px] md:w-[230px] min-[1800px]:h-[220px] min-[1800px]:w-[520px] min-[2400px]:h-[250px] min-[2400px]:w-[590px]"
                >
                  <div
                    className="relative h-[var(--logo-height-mobile)] w-[var(--logo-width-mobile)] md:h-[var(--logo-height)] md:w-[var(--logo-width)] min-[1800px]:h-[var(--logo-height-wide)] min-[1800px]:w-[var(--logo-width-wide)] min-[2400px]:h-[var(--logo-height-ultra)] min-[2400px]:w-[var(--logo-width-ultra)]"
                    style={{
                      "--logo-width-mobile": `${mobileLogoBoxWidth}px`,
                      "--logo-height-mobile": `${mobileLogoBoxHeight}px`,
                      "--logo-width": `${logoBoxWidth}px`,
                      "--logo-height": `${logoBoxHeight}px`,
                      "--logo-width-wide": `${wideLogoBoxWidth}px`,
                      "--logo-height-wide": `${wideLogoBoxHeight}px`,
                      "--logo-width-ultra": `${ultraLogoBoxWidth}px`,
                      "--logo-height-ultra": `${ultraLogoBoxHeight}px`,
                    } as CSSProperties}
                  >
                    <Image
                      src={`/assets/${logo.src}.png`}
                      alt={logo.name}
                      fill
                      sizes={`${logoBoxWidth}px`}
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
