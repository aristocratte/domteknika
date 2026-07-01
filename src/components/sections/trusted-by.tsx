import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";

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
    <section className="bg-background py-[72px]" aria-label={t("label")}>
      <Container size="wide" className="mb-8">
        <h2 className="text-[18px] font-normal uppercase leading-none tracking-normal text-foreground">
          {t("label")}
        </h2>
      </Container>

      <div data-marquee-rail className="relative overflow-hidden bg-muted py-2">
        <div
          className="flex w-max animate-marquee items-center gap-11 pr-11"
          style={{ ["--marquee-duration" as string]: "36s" }}
        >
          {logos.map((logo, index) => {
            const logoBoxWidth = Math.min(Math.round(logo.width * 1.08), 230);
            const logoBoxHeight = Math.min(Math.round(logo.height * 1.08), 86);

            return (
              <div
                key={`${logo.name}-${index}`}
                className="flex h-[100px] w-[230px] shrink-0 items-center justify-center"
              >
                <div
                  className="relative"
                  style={{
                    width: `${logoBoxWidth}px`,
                    height: `${logoBoxHeight}px`,
                  }}
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
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[min(18vw,230px)]"
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
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[min(18vw,230px)]"
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
    </section>
  );
}
