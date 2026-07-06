import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";

const VALUES = [
  { key: "swissQuality", icon: "swiss-quality" },
  { key: "endToEnd", icon: "end-to-end" },
  { key: "agile", icon: "agile" },
  { key: "confidential", icon: "confidential" },
] as const;

export function SwissBannerSection() {
  const t = useTranslations("SwissBanner");

  return (
    <section className="relative min-h-[142px] overflow-hidden bg-alps md:min-h-[236px]">
      <Image
        src="/assets/alps-background.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div
        className="absolute inset-y-0 left-0 w-2/3"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 58%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 58%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,70,145,0.49) 0%, rgba(0,39,61,0) 100%)",
        }}
        aria-hidden
      />

      <Container
        size="wide"
        className="relative z-10 flex min-h-[142px] max-w-none items-center py-3 md:min-h-[236px] md:py-8"
      >
        <Reveal className="flex flex-col gap-2 md:gap-7 lg:flex-row lg:items-center lg:gap-9">
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={88}
            height={88}
            className="size-[34px] object-contain md:size-[76px]"
          />

          <div>
            <h2 className="max-w-[500px] text-[16px] font-extrabold uppercase leading-[1.08] tracking-wide text-white md:text-[26px] md:leading-[1.16]">
              {t("titleLineOne")}
              <br />
              {t("titleLineTwo")}
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 md:mt-7 md:flex md:items-center md:gap-0">
              {VALUES.map((value, index) => (
                <div
                  key={value.key}
                  className="flex items-center gap-2 md:min-w-[205px] md:gap-3 md:border-l md:border-white/80 md:px-5 first:md:border-l-0 first:md:pl-0"
                >
                  <Image
                    src={`/assets/${value.icon}.png`}
                    alt=""
                    width={46}
                    height={46}
                    className="size-4 object-contain md:size-[34px]"
                  />
                  <strong className="text-[11px] font-extrabold leading-tight text-white md:text-[16px] md:leading-none">
                    {t(`values.${value.key}` as never)}
                  </strong>
                  {index === VALUES.length - 1 && (
                    <span className="sr-only">{t("end")}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
