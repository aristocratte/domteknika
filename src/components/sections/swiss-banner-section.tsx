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
    <section className="relative min-h-[142px] overflow-hidden bg-alps md:min-h-[190px] lg:min-h-[236px] min-[1800px]:min-h-[500px] min-[2300px]:!min-h-[580px]">
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
        className="relative z-10 flex min-h-[142px] max-w-none items-center py-3 md:min-h-[190px] md:py-5 lg:min-h-[236px] lg:py-8 min-[1800px]:min-h-[500px] min-[1800px]:max-w-none min-[1800px]:px-[120px] min-[1800px]:py-20 min-[2300px]:!min-h-[580px] min-[2300px]:!px-[170px]"
      >
        <Reveal className="flex flex-col gap-2 md:gap-5 xl:flex-row xl:items-center xl:gap-9 min-[1800px]:gap-14">
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={88}
            height={88}
            className="size-[34px] object-contain md:size-[54px] lg:size-[76px] min-[1800px]:size-[170px] min-[2300px]:!size-[196px]"
          />

          <div>
            <h2 className="max-w-[500px] text-[16px] font-extrabold uppercase leading-[1.08] tracking-wide text-white md:text-[22px] md:leading-[1.12] lg:text-[26px] lg:leading-[1.16] min-[1800px]:max-w-[1120px] min-[1800px]:text-[64px] min-[2300px]:!text-[74px]">
              {t("titleLineOne")}
              <br />
              {t("titleLineTwo")}
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 md:mt-5 md:max-w-[620px] md:gap-x-8 md:gap-y-3 xl:mt-7 xl:flex xl:max-w-none xl:items-center xl:gap-0 min-[1800px]:mt-12">
              {VALUES.map((value, index) => (
                <div
                  key={value.key}
                  className="flex min-w-0 items-center gap-2 md:gap-3 xl:min-w-[205px] xl:border-l xl:border-white/80 xl:px-5 first:xl:border-l-0 first:xl:pl-0 min-[1800px]:min-w-[430px] min-[1800px]:px-12"
                >
                  <span className="relative grid size-5 shrink-0 place-items-center md:size-7 lg:size-9 min-[1800px]:size-[74px] min-[2300px]:!size-[84px]">
                    <span
                      aria-hidden
                      className="absolute inset-[12%] rounded-full bg-white/80 blur-[3px] md:blur-[4px]"
                    />
                    <Image
                      src={`/assets/${value.icon}.png`}
                      alt=""
                      width={46}
                      height={46}
                      className="relative z-10 size-full object-contain opacity-100 brightness-110 saturate-150"
                    />
                  </span>
                  <strong className="min-w-0 text-[11px] font-extrabold leading-tight text-white md:text-[14px] lg:text-[16px] lg:leading-none min-[1800px]:text-[35px] min-[2300px]:!text-[40px]">
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
