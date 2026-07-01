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
      <Container size="wide" className="py-0">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.22fr_1.02fr] lg:items-stretch">
          <article className="flex min-h-[292px] flex-col justify-center py-6 lg:pr-6">
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

          <article className="relative z-10 my-0 min-h-[292px] rounded-[7px] bg-brand px-6 py-7 text-white shadow-[0_12px_26px_rgba(0,0,0,0.2)] md:px-7">
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

          <article className="flex min-h-[292px] flex-col justify-between py-6 lg:pl-2">
            <div>
              <AccentLine />
              <h2 className="mt-4 text-[22px] font-extrabold leading-tight text-foreground">
                {t("productTitle")}
              </h2>
              <p className="mt-3 max-w-[540px] text-[16px] font-medium leading-[1.24] text-foreground">
                {t("productBody")}
              </p>
            </div>

            <div className="mt-6 grid overflow-hidden rounded-[7px] border border-border bg-white shadow-[0_8px_25px_rgba(0,0,0,0.04)] min-[1500px]:grid-cols-3">
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
    <div className="relative min-h-[66px] border-t border-border px-4 py-3 first:border-t-0 min-[1500px]:min-h-[96px] min-[1500px]:border-l min-[1500px]:border-t-0 min-[1500px]:py-5 min-[1500px]:first:border-l-0 xl:px-5 min-[1800px]:px-6">
      <strong className="block max-w-[180px] pr-10 text-[22px] font-extrabold leading-[1.08] text-brand min-[1500px]:max-w-[108px] min-[1500px]:pr-0 min-[1500px]:text-[24px] min-[1800px]:max-w-none min-[1800px]:text-[28px]">
        {value}
      </strong>
      <span className="mt-1 block pr-10 text-[15px] font-normal leading-[1.12] text-brand min-[1500px]:mt-2 min-[1500px]:pr-0 min-[1500px]:text-[17px] min-[1800px]:text-[22px]">
        {label}
      </span>
      {withFlag && (
        <Image
          src="/assets/swiss-flag.png"
          alt=""
          width={37}
          height={37}
          className="absolute right-4 top-1/2 size-6 -translate-y-1/2 min-[1500px]:right-3 min-[1500px]:top-5 min-[1500px]:size-7 min-[1500px]:translate-y-0 min-[1800px]:right-5 min-[1800px]:size-8"
        />
      )}
    </div>
  );
}
