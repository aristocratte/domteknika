import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";

export function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <section
      id="expertise"
      className="scroll-mt-28 bg-white py-10 md:py-[112px] canvas-lg:py-[210px] canvas-xl:py-[246px]"
      aria-labelledby="process-title"
    >
      <Container
        size="wide"
        className="max-w-[1560px] px-4 py-0 sm:px-6 lg:px-4 xl:px-4 canvas-lg:max-w-[1880px] canvas-mid:max-w-[2200px] canvas-mid:px-1 canvas-xl:max-w-[2520px] canvas-xl:px-3"
      >
        <div className="grid gap-6 lg:grid-cols-[1.08fr_1.58fr_1.52fr] lg:items-stretch canvas-lg:gap-9 canvas-xl:gap-11">
          <Reveal
            as="article"
            className="group flex min-h-[248px] flex-col justify-start rounded-[15px] border border-border bg-white p-5 pt-6 transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] md:min-h-[304px] md:p-6 md:pt-[42px] canvas-lg:min-h-[680px] canvas-lg:rounded-[22px] canvas-lg:p-16 canvas-lg:pt-20 canvas-xl:min-h-[760px] canvas-xl:p-[72px]"
          >
            <AccentLine />
            <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground canvas-lg:text-[40px] canvas-xl:text-[46px]">
              {t("ideaTitle")}
            </h2>
            <div className="mt-7 max-w-[390px] text-[16px] font-medium leading-[1.24] text-foreground canvas-lg:max-w-[680px] canvas-lg:text-[25px] canvas-xl:text-[28px]">
              <p>{t("ideaIntro")}</p>
              <p className="mt-7">
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
            className="group relative z-20 my-0 min-h-[260px] rounded-[15px] bg-brand px-5 py-6 text-white shadow-[0_24px_42px_rgba(0,0,0,0.24)] transition-shadow duration-300 hover:shadow-[0_34px_70px_rgba(0,0,0,0.28)] md:min-h-[304px] md:px-7 md:pb-7 md:pt-[42px] canvas-lg:min-h-[720px] canvas-lg:rounded-[22px] canvas-lg:px-16 canvas-lg:pb-16 canvas-lg:pt-20 canvas-xl:min-h-[800px] canvas-xl:px-[72px]"
          >
            <div className="grid h-full gap-5 md:grid-cols-[0.82fr_1.38fr] md:items-stretch">
              <div>
                <AccentLine light />
                <h2
                  id="process-title"
                  className="mt-4 text-[24px] font-extrabold leading-tight canvas-lg:text-[42px] canvas-xl:text-[48px]"
                >
                  {t("processTitle")}
                </h2>
                <p className="mt-7 text-[17px] font-medium leading-[1.22] canvas-lg:text-[26px] canvas-xl:text-[29px]">
                  {t("processBody")}
                </p>
              </div>

              <div className="relative h-full min-h-[190px] border-white/70 md:min-h-[250px] md:border-l canvas-lg:min-h-[600px] canvas-xl:min-h-[680px]">
                <div className="absolute inset-y-0 left-7 right-0 md:left-8">
                  <Image
                    src="/assets/schema-process.png"
                    alt=""
                    fill
                    sizes="(min-width: 2400px) 660px, (min-width: 2200px) 560px, (min-width: 1800px) 500px, 430px"
                    className="scale-[1.12] object-contain object-center md:scale-[1.2] lg:scale-[1.24] xl:scale-[1.28]"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            as="article"
            delay={0.16}
            className="group flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[15px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] md:min-h-[304px] canvas-lg:min-h-[680px] canvas-lg:rounded-[22px] canvas-xl:min-h-[760px]"
          >
            <div className="px-5 pb-0 pt-6 md:px-6 md:pt-[42px] canvas-lg:px-12 canvas-lg:pt-16">
              <AccentLine />
              <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground canvas-lg:text-[40px] canvas-xl:text-[46px]">
                {t("productTitle")}
              </h2>
              <p className="mt-6 max-w-[760px] text-[16px] font-medium leading-[1.24] text-foreground canvas-lg:text-[25px] canvas-xl:text-[28px]">
                {t("productBody")}
              </p>
            </div>

            <div className="relative mt-6 grid bg-white before:absolute before:left-6 before:right-6 before:top-0 before:h-px before:bg-border lg:grid-cols-3">
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
      className={`relative min-h-[66px] px-4 py-3 lg:min-h-[92px] lg:border-t-0 lg:px-3 lg:py-4 xl:px-4 canvas-lg:min-h-[150px] canvas-lg:px-9 canvas-lg:py-7 canvas-xl:min-h-[170px] ${
        divider
          ? "border-t border-border lg:border-t-0 lg:before:absolute lg:before:bottom-4 lg:before:left-0 lg:before:top-4 lg:before:w-px lg:before:bg-border"
          : "pt-4"
      }`}
    >
      <div className={withFlag ? "flex items-start justify-between gap-2" : undefined}>
        <strong className="block text-[22px] font-extrabold leading-[1.08] text-brand lg:text-[20px] xl:text-[21px] canvas-lg:text-[42px] canvas-xl:text-[48px]">
          {value}
        </strong>
        {withFlag && (
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={37}
            height={37}
            className="size-6 shrink-0 lg:size-[26px] canvas-lg:size-[50px] canvas-xl:size-[56px]"
          />
        )}
      </div>
      <span className="mt-2 block text-[15px] font-normal leading-[1.12] text-brand lg:text-[14px] xl:text-[15px] canvas-lg:text-[26px] canvas-xl:text-[29px]">
        {label}
      </span>
    </div>
  );
}
