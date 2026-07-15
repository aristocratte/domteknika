import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";

export function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <section
      id="expertise"
      className="scroll-mt-28 bg-white py-7 md:py-16 min-[1800px]:!py-16 min-[2300px]:!py-20"
      aria-labelledby="process-title"
    >
      <Container
        size="wide"
        className="max-w-[1400px] px-4 py-0 sm:px-6 lg:px-4 xl:px-4 min-[1800px]:!max-w-[1680px] min-[1800px]:!px-5 min-[2200px]:max-[2299px]:!max-w-[1800px] min-[2200px]:max-[2299px]:!px-4 min-[2300px]:!max-w-[1900px] min-[2300px]:!px-4"
      >
        <div className="grid gap-3 lg:grid-cols-[1.08fr_1.58fr_1.52fr] lg:items-stretch min-[1800px]:!gap-4 min-[2300px]:!gap-5">
          <Reveal
            as="article"
            className="group flex min-h-[200px] flex-col justify-start rounded-[15px] border border-border bg-white p-4 transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] md:min-h-[220px] md:p-5 md:pt-6 min-[1800px]:!min-h-[260px] min-[1800px]:!rounded-[18px] min-[1800px]:!p-6 min-[2300px]:!min-h-[300px] min-[2300px]:!p-7"
          >
            <AccentLine />
            <h2 className="mt-3 text-[18px] font-extrabold leading-tight text-foreground md:text-[19px] min-[1800px]:!text-[24px] min-[2300px]:!text-[27px]">
              {t("ideaTitle")}
            </h2>
            <div className="mt-4 max-w-[390px] text-[13px] font-medium leading-[1.3] text-foreground md:text-[14px] min-[1800px]:!mt-3 min-[1800px]:max-w-[520px] min-[1800px]:!text-[16px] min-[2300px]:!text-[17px]">
              <p>{t("ideaIntro")}</p>
              <p className="mt-4 min-[1800px]:!mt-3 min-[2300px]:!mt-4">
                {t.rich("ideaBody", {
                  strong: (chunks) => (
                    <strong className="font-extrabold">{chunks}</strong>
                  ),
                })}
              </p>
            </div>
          </Reveal>

          <Reveal
            as="article"
            delay={0.08}
            className="group relative z-20 my-0 min-h-[210px] overflow-hidden rounded-[15px] bg-brand p-4 text-white transition-shadow duration-300 md:min-h-[250px] md:p-6 lg:min-h-[220px] lg:p-5 lg:pt-6 lg:shadow-[0_24px_42px_rgba(0,0,0,0.24)] lg:hover:shadow-[0_34px_70px_rgba(0,0,0,0.28)] xl:min-h-[290px] min-[1800px]:!min-h-[310px] min-[1800px]:!rounded-[18px] min-[1800px]:!p-6 min-[2300px]:!min-h-[350px] min-[2300px]:!p-7"
          >
            <div className="grid h-full gap-3 md:grid-cols-[0.72fr_1.28fr] md:items-stretch lg:grid-cols-[0.82fr_1.38fr] min-[1800px]:!gap-3 min-[2300px]:!gap-4">
              <div>
                <AccentLine light />
                <h2
                  id="process-title"
                  className="mt-3 text-[20px] font-extrabold leading-tight md:text-[22px] lg:text-[20px] min-[1800px]:!text-[26px] min-[2300px]:!text-[29px]"
                >
                  {t("processTitle")}
                </h2>
                <p className="mt-4 text-[13px] font-medium leading-[1.28] md:text-[15px] lg:text-[13px] min-[1800px]:!mt-3 min-[1800px]:!text-[16px] min-[2300px]:!mt-4 min-[2300px]:!text-[17px]">
                  {t("processBody")}
                </p>
              </div>

              <div className="relative h-full min-h-[150px] border-white/70 md:min-h-[190px] md:border-l lg:min-h-[150px] min-[1800px]:!min-h-[180px] min-[2300px]:!min-h-[200px]">
                <div className="absolute inset-y-0 left-7 right-0 md:left-2 lg:left-8 xl:left-3">
                  <Image
                    src="/assets/schema-process.png"
                    alt=""
                    fill
                    sizes="(min-width: 2300px) 400px, (min-width: 1800px) 360px, 320px"
                    className="scale-100 object-contain object-center md:scale-[1.2] lg:scale-[1.1] xl:scale-[1.2] min-[1800px]:scale-[1.22] min-[2300px]:scale-[1.24]"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            as="article"
            delay={0.16}
            className="group flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[15px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] md:min-h-[220px] min-[1800px]:!min-h-[260px] min-[1800px]:!rounded-[18px] min-[2300px]:!min-h-[300px]"
          >
            <div className="px-4 pb-0 pt-4 md:px-5 md:pt-6 min-[1800px]:!px-6 min-[1800px]:!pt-6 min-[2300px]:!px-7 min-[2300px]:!pt-7">
              <AccentLine />
              <h2 className="mt-3 text-[18px] font-extrabold leading-tight text-foreground md:text-[19px] min-[1800px]:!text-[24px] min-[2300px]:!text-[27px]">
                {t("productTitle")}
              </h2>
              <p className="mt-3 max-w-[760px] text-[13px] font-medium leading-[1.3] text-foreground md:text-[14px] min-[1800px]:!mt-3 min-[1800px]:!text-[16px] min-[2300px]:!mt-4 min-[2300px]:!text-[17px]">
                {t("productBody")}
              </p>
            </div>

            <div className="relative mt-3 grid bg-white before:absolute before:left-4 before:right-4 before:top-0 before:h-px before:bg-border sm:before:left-5 sm:before:right-5 lg:grid-cols-3">
              <Stat label={t("stats.years.label")} value={t("stats.years.value")} />
              <Stat
                label={t("stats.sectors.label")}
                value={t("stats.sectors.value")}
                divider
              />
              <Stat
                label={t("stats.swiss.label")}
                value={t("stats.swiss.value")}
                withFlag
                divider
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function AccentLine({ light }: { light?: boolean }) {
  return (
    <span
      aria-hidden
      className={`block h-[3px] w-8 transition-[width] duration-300 group-hover:w-16 ${
        light ? "bg-white" : "bg-brand"
      }`}
    />
  );
}

function Stat({
  value,
  label,
  withFlag,
  divider,
}: {
  value: string;
  label: string;
  withFlag?: boolean;
  divider?: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[58px] items-center px-4 py-2.5 lg:block lg:min-h-[64px] lg:border-t-0 lg:px-3 lg:py-2 xl:px-3 min-[1800px]:min-h-[84px] min-[1800px]:px-5 min-[1800px]:py-3 min-[2300px]:!min-h-[88px] min-[2300px]:!px-5 min-[2300px]:!py-3 ${
        divider
          ? "border-t border-border lg:border-t-0 lg:before:absolute lg:before:bottom-4 lg:before:left-0 lg:before:top-4 lg:before:w-px lg:before:bg-border"
          : "pt-3 lg:pt-4"
      }`}
    >
      <div className="flex w-full items-center justify-between gap-4 lg:block">
        <div>
          <strong className="block text-[18px] font-extrabold leading-[1.08] text-brand lg:text-[18px] xl:text-[19px] min-[1800px]:text-[27px] min-[2300px]:!text-[29px]">
            {value}
          </strong>
          <span className="mt-0.5 block text-[12px] font-normal leading-[1.12] text-brand lg:mt-1 lg:text-[11px] xl:text-[12px] min-[1800px]:text-[15px] min-[2300px]:!text-[16px]">
            {label}
          </span>
        </div>
        {withFlag && (
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={37}
            height={37}
            className="size-7 shrink-0 lg:absolute lg:right-3 lg:top-1/2 lg:size-5 lg:-translate-y-1/2 min-[1800px]:right-5 min-[1800px]:size-[32px] min-[2300px]:!right-5 min-[2300px]:!size-[34px]"
          />
        )}
      </div>
    </div>
  );
}
