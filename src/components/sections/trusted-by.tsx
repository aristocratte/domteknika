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
    <section className="bg-background pt-[56px]" aria-label={t("label")}>
      <Container size="wide" className="mb-7">
        <h2 className="text-[21px] font-normal uppercase leading-none tracking-normal text-foreground">
          {t("label")}
        </h2>
      </Container>

      <div className="marquee-pause overflow-hidden bg-muted py-[26px]">
        <div
          className="flex w-max animate-marquee items-center gap-[132px] pr-[132px]"
          style={{ ["--marquee-duration" as string]: "44s" }}
        >
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex h-[158px] w-[330px] shrink-0 items-center justify-center"
            >
              <Image
                src={`/assets/${logo.src}.png`}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                sizes="330px"
                className="h-auto max-h-[158px] w-auto max-w-[330px] origin-center scale-[1.42] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
