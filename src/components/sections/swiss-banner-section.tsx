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
    <section className="relative min-h-[130px] overflow-hidden bg-alps md:min-h-[160px] lg:min-h-[190px] min-[1800px]:min-h-[300px] min-[2300px]:!min-h-[320px]">
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
        className="relative z-10 flex min-h-[130px] max-w-none items-center justify-start px-5 py-2 text-left sm:px-8 md:min-h-[160px] md:px-10 md:py-3 lg:min-h-[190px] lg:px-12 lg:py-4 min-[1800px]:min-h-[300px] min-[1800px]:max-w-none min-[1800px]:!px-20 min-[1800px]:!py-7 min-[2300px]:!min-h-[320px] min-[2300px]:!px-24 min-[2300px]:!py-8"
      >
        <Reveal className="flex w-full max-w-[980px] flex-col items-start justify-start gap-1.5 text-left md:gap-2 min-[1800px]:!max-w-[1180px] min-[1800px]:!gap-3.5 min-[2300px]:!max-w-[1240px] min-[2300px]:!gap-4">
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={88}
            height={88}
            className="size-7 object-contain md:size-10 lg:size-12 min-[1800px]:size-[72px] min-[2300px]:!size-[76px]"
          />

          <div className="w-full text-left">
            <h2 className="max-w-[500px] text-left text-[14px] font-extrabold uppercase leading-[1.08] tracking-wide text-white [text-wrap:balance] md:text-[17px] md:leading-[1.12] lg:text-[20px] min-[1800px]:!max-w-[760px] min-[1800px]:!text-[32px] min-[2300px]:!max-w-[820px] min-[2300px]:!text-[34px]">
              {t("titleLineOne")}
              <br />
              {t("titleLineTwo")}
            </h2>

            <div className="mt-2 grid max-w-[520px] grid-cols-2 justify-start gap-x-5 gap-y-2 text-left md:mt-3 md:max-w-[600px] md:gap-x-7 md:gap-y-2.5 lg:mt-4 lg:max-w-[680px] min-[1800px]:!mt-4 min-[1800px]:!max-w-[900px] min-[1800px]:!gap-x-10 min-[1800px]:!gap-y-3.5 min-[2300px]:!max-w-[960px]">
              {VALUES.map((value, index) => (
                <div
                  key={value.key}
                  className="flex min-w-0 items-center justify-start gap-2 text-left md:gap-2.5 min-[1800px]:!gap-3"
                >
                  <Image
                    src={`/assets/${value.icon}.png`}
                    alt=""
                    width={46}
                    height={46}
                    className="size-[18px] shrink-0 object-contain opacity-100 brightness-110 saturate-150 md:size-[22px] lg:size-[26px] min-[1800px]:size-[36px] min-[2300px]:!size-[38px]"
                  />
                  <strong className="min-w-0 text-left text-[10px] font-extrabold leading-tight text-white md:text-[12px] lg:text-[13px] lg:leading-none min-[1800px]:text-[18px] min-[2300px]:!text-[19px]">
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
