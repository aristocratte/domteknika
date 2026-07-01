import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";

export function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <section
      id="expertise"
      className="scroll-mt-28 border-y border-border bg-white py-[96px] md:py-[112px]"
      aria-labelledby="process-title"
    >
      <Container size="wide" className="max-w-[1200px] py-0">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1.12fr_1.05fr] lg:items-stretch lg:gap-0">
          <article className="flex min-h-[292px] flex-col justify-center rounded-[15px] border border-border bg-white p-6">
            <AccentLine />
            <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground">
              {t("ideaTitle")}
            </h2>
            <div className="mt-4 max-w-[340px] text-[16px] font-medium leading-[1.24] text-foreground">
              <p>{t("ideaIntro")}</p>
              <p className="mt-7">
                {t.rich("ideaBody", {
                  strong: (chunks) => (
                    <strong className="font-extrabold">{chunks}</strong>
                  ),
                })}
              </p>
            </div>
          </article>

          <article className="relative z-20 my-0 min-h-[292px] rounded-[15px] bg-brand px-6 py-7 text-white shadow-[0_24px_42px_rgba(0,0,0,0.24)] md:px-7 lg:-mx-2">
            <div className="grid h-full gap-6 md:grid-cols-[0.82fr_1fr] md:items-center">
              <div>
                <AccentLine light />
                <h2
                  id="process-title"
                  className="mt-4 text-[24px] font-extrabold leading-tight"
                >
                  {t("processTitle")}
                </h2>
                <p className="mt-4 text-[17px] font-medium leading-[1.22]">
                  {t("processBody")}
                </p>
              </div>

              <div className="relative h-full min-h-[210px] border-white/70 md:border-l">
                <Image
                  src="/assets/schema-process.png"
                  alt=""
                  fill
                  sizes="334px"
                  className="object-contain object-center md:object-right"
                />
              </div>
            </div>
          </article>

          <article className="flex min-h-[292px] flex-col justify-between overflow-hidden rounded-[15px] border border-border bg-white">
            <div className="p-6 pb-0">
              <AccentLine />
              <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground">
                {t("productTitle")}
              </h2>
              <p className="mt-3 max-w-[540px] text-[16px] font-medium leading-[1.24] text-foreground">
                {t("productBody")}
              </p>
            </div>

            <div className="mt-6 grid border-t border-border bg-white lg:grid-cols-3">
              <Stat label={t("stats.years.label")} value={t("stats.years.value")} />
              <Stat
                label={t("stats.sectors.label")}
                value={t("stats.sectors.value")}
              />
              <Stat
                label={t("stats.swiss.label")}
                value={t("stats.swiss.value")}
                withFlag
              />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

function AccentLine({ light }: { light?: boolean }) {
  return (
    <span
      className={light ? "block h-[3px] w-8 bg-white" : "block h-[3px] w-8 bg-brand"}
      aria-hidden
    />
  );
}

function Stat({
  value,
  label,
  withFlag,
}: {
  value: string;
  label: string;
  withFlag?: boolean;
}) {
  return (
    <div className="min-h-[66px] border-t border-border px-4 py-3 first:border-t-0 lg:min-h-[92px] lg:border-l lg:border-t-0 lg:px-3 lg:py-4 lg:first:border-l-0 xl:px-4">
      <div className={withFlag ? "flex items-start justify-between gap-2" : undefined}>
        <strong className="block text-[22px] font-extrabold leading-[1.08] text-brand lg:text-[20px] xl:text-[21px]">
          {value}
        </strong>
        {withFlag && (
          <Image
            src="/assets/swiss-flag.png"
            alt=""
            width={37}
            height={37}
            className="size-6 shrink-0 lg:size-[26px]"
          />
        )}
      </div>
      <span className="mt-1 block text-[15px] font-normal leading-[1.12] text-brand lg:text-[14px] xl:text-[15px]">
        {label}
      </span>
    </div>
  );
}
