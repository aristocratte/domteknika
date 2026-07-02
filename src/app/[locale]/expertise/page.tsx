import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Box,
  Cpu,
  Factory,
  Hourglass,
  Lightbulb,
  Monitor,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { TrustedBy } from "@/components/sections/trusted-by";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const EXPERTISE_ITEMS = [
  { key: "creativity", icon: Lightbulb },
  { key: "design", icon: Box },
  { key: "prototyping", icon: Hourglass },
  { key: "simulation", icon: Monitor },
  { key: "polymer", icon: Factory },
  { key: "electronics", icon: Cpu },
] as const;

const VALUE_ITEMS = [
  { key: "partner", icon: "expertise-value-partner", width: 67, height: 52 },
  { key: "agile", icon: "expertise-value-agile", width: 54, height: 57 },
  { key: "confidential", icon: "expertise-value-confidential", width: 45, height: 56 },
  { key: "quality", icon: "expertise-value-quality", width: 55, height: 56 },
] as const;

const STATS = [
  { key: "projects", icon: "expertise-stat-projects", width: 53, height: 60 },
  { key: "years", icon: "expertise-stat-years", width: 53, height: 70 },
  { key: "worldwide", icon: "expertise-stat-worldwide", width: 59, height: 60 },
  { key: "industries", icon: "expertise-stat-industries", width: 60, height: 59 },
] as const;

const TEAM_MEMBERS = [
  { name: "Etienne", image: "/assets/team/etienne.png" },
  { name: "Guillaume", image: "/assets/team/guillaume.png" },
  { name: "Nicole", image: "/assets/team/nicole.png" },
  { name: "Nicolas", image: "/assets/team/nicolas.png" },
  { name: "Hector", image: "/assets/team/hector.png" },
  { name: "Quentin", image: "/assets/team/quentin-c.png" },
  { name: "Robin", image: "/assets/team/robin.png" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ExpertisePage.Meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ExpertiseHero />
      <ExpertiseGrid />
      <ExpertiseSwissBanner />
      <AddedValueSection />
      <TrustedBy />
      <ExpertiseCta />
    </>
  );
}

function ExpertiseHero() {
  const t = useTranslations("ExpertisePage.Hero");

  return (
    <section
      className="relative overflow-visible bg-background pb-[42px] pt-[116px] md:min-h-[376px] md:pb-[46px] md:pt-[134px]"
      aria-labelledby="expertise-hero-title"
    >
      <Image
        src="/assets/technical-drawing-top.png"
        alt=""
        width={1200}
        height={768}
        priority
        sizes="(max-width: 768px) 118vw, 72vw"
        className="pointer-events-none absolute right-[-42vw] top-[98px] z-0 h-auto w-[118vw] max-w-none opacity-[0.58] sm:right-[-30vw] md:right-[-6vw] md:top-[92px] md:w-[72vw] md:max-w-[1040px]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-white/40" />

      <Container size="wide" className="relative z-10">
        <div className="relative grid gap-12 md:block">
          <div>
            <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground">
              <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
              {t("eyebrow")}
            </div>

            <h1
              id="expertise-hero-title"
              className="domtek-text-shadow mt-12 text-[42px] font-extrabold leading-none text-foreground sm:text-[58px] md:mt-14 md:text-[64px]"
            >
              {t("title")}
              <span className="text-brand">.</span>
            </h1>
          </div>

          <div className="min-h-[260px] sm:min-h-[304px] md:absolute md:right-[-18px] md:top-[-32px] md:min-h-0 md:w-[54%] lg:right-[-148px] lg:top-[-48px] lg:w-[60%]">
            <div className="relative mx-auto w-[min(100%,320px)] pt-1 sm:w-[min(100%,460px)] md:ml-auto md:mr-0 md:w-full md:max-w-[540px] lg:max-w-[640px]">
              <div className="mx-auto mb-3 flex w-fit flex-col items-center gap-1">
                <p className="text-center text-[15px] font-medium leading-none text-muted-foreground">
                  {t("team")}
                </p>
                <span className="h-px w-16 bg-brand/55" aria-hidden />
              </div>

              <div
                className="pointer-events-none absolute left-1/2 top-10 h-[218px] w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(227,6,19,0.065),rgba(255,255,255,0)_72%)] sm:h-[250px] md:top-11 md:h-[238px] lg:h-[266px]"
                aria-hidden
              />
              <div className="relative mx-auto flex max-w-[304px] items-start justify-center gap-2 sm:max-w-[460px] sm:gap-3 md:max-w-[500px] lg:max-w-[590px] lg:gap-4 xl:gap-5">
                {TEAM_MEMBERS.slice(0, 4).map((member, index) => (
                  <TeamPortrait
                    key={member.name}
                    member={member}
                    className={cn(
                      index === 0 && "mt-2",
                      index === 1 && "mt-0",
                      index === 2 && "mt-1",
                      index === 3 && "mt-2",
                    )}
                  />
                ))}
              </div>
              <div className="relative mx-auto mt-2 flex max-w-[240px] items-start justify-center gap-3 sm:max-w-[360px] md:max-w-[380px] lg:mt-3 lg:max-w-[440px] lg:gap-5">
                {TEAM_MEMBERS.slice(4).map((member, index) => (
                  <TeamPortrait
                    key={member.name}
                    member={member}
                    className={cn(index === 1 && "mt-1")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TeamPortrait({
  member,
  className,
}: {
  member: (typeof TEAM_MEMBERS)[number];
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative isolate aspect-[196/269] w-[64px] shrink-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.045)_38%,rgba(10,10,10,0.10)_100%)] p-[5px] shadow-[0_14px_30px_rgba(0,0,0,0.16)] backdrop-blur-[12px] transition duration-300 before:pointer-events-none before:absolute before:-inset-[5px] before:-z-10 before:rounded-full before:bg-[radial-gradient(circle_at_24%_12%,rgba(255,255,255,0.46),transparent_28%),radial-gradient(circle_at_78%_92%,rgba(0,0,0,0.10),transparent_34%)] before:blur-[6px] after:pointer-events-none after:absolute after:inset-[1px] after:z-20 after:rounded-full after:shadow-[inset_0_1px_2px_rgba(255,255,255,0.34),inset_0_-10px_16px_rgba(0,0,0,0.13),inset_0_0_0_1px_rgba(255,255,255,0.16)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.19)] sm:w-[88px] md:w-[96px] lg:w-[124px] xl:w-[136px]",
        className,
      )}
    >
      <div className="relative z-10 size-full overflow-hidden rounded-full bg-black">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 76px, (max-width: 768px) 88px, (max-width: 1024px) 108px, (max-width: 1280px) 124px, 136px"
          className="scale-[1.025] object-cover object-center opacity-[0.99] saturate-[0.98] transition duration-300 group-hover:scale-[1.055] group-hover:opacity-100 group-hover:saturate-100"
        />
      </div>
    </figure>
  );
}

function ExpertiseGrid() {
  const t = useTranslations("ExpertisePage.Services");

  return (
    <section className="bg-background pb-[118px]" aria-labelledby="expertise-services">
      <Container size="wide">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-center gap-3 text-[15px] font-medium text-muted-foreground">
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            {t("eyebrow")}
          </div>

          <h2
            id="expertise-services"
            className="domtek-text-shadow mt-8 max-w-[320px] text-[30px] font-extrabold leading-[1.06] text-foreground sm:max-w-[560px] sm:text-[44px] md:text-[52px]"
          >
            {t("title")}
            <span className="text-brand">.</span>
          </h2>

          <p className="mt-7 max-w-[320px] text-[15px] font-medium leading-[1.42] text-muted-foreground sm:max-w-[610px]">
            {t("intro")}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERTISE_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.key}
                  className="group flex min-h-[246px] flex-col items-center justify-center rounded-[7px] border border-border bg-white px-6 py-8 text-center transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)]"
                >
                  <Icon
                    className="size-10 stroke-[1.8] text-brand transition-transform duration-300 group-hover:-translate-y-1"
                    aria-hidden
                  />
                  <h3 className="mt-8 text-[16px] font-extrabold leading-tight text-foreground">
                    {t(`items.${item.key}.title` as never)}
                  </h3>
                  <p className="mt-8 max-w-[250px] text-[14px] font-medium leading-[1.28] text-muted-foreground">
                    {t(`items.${item.key}.description` as never)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ExpertiseSwissBanner() {
  const t = useTranslations("ExpertisePage.Swiss");
  const titleParts = t("title").split(". ");

  return (
    <section className="relative h-[190px] overflow-hidden bg-alps md:h-[236px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/assets/expertise-alps-cows.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-[60%]"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 42%, transparent 100%)",
          maskImage:
            "linear-gradient(to left, black 0%, black 42%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-[60%]"
        style={{
          background:
            "linear-gradient(to left, rgba(4,91,39,0.49) 0%, rgba(4,91,39,0.32) 42%, rgba(4,91,39,0) 100%)",
        }}
        aria-hidden
      />

      <Container
        size="wide"
        className="relative z-10 flex h-full max-w-none items-center justify-end px-5 sm:px-8 lg:px-10 xl:px-11"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <h2
            className="max-w-[500px] text-[24px] font-extrabold uppercase leading-[1.16] tracking-wide text-white md:text-[26px]"
            aria-label={t("title")}
          >
            {titleParts.map((part, index) => (
              <span key={`${part}-${index}`} className="block" aria-hidden>
                {part}
                {index === 0 && titleParts.length > 1 ? "." : ""}
              </span>
            ))}
          </h2>
          <Image
            src="/assets/flag-switzerland.webp"
            alt=""
            width={88}
            height={88}
            className="size-[42px] shrink-0 object-contain sm:size-[46px] md:size-[52px] lg:size-[58px]"
          />
        </div>
      </Container>
    </section>
  );
}

function AddedValueSection() {
  const t = useTranslations("ExpertisePage.AddedValue");

  return (
    <section className="bg-background py-[78px] md:py-[92px]">
      <Container
        size="wide"
        className="max-w-[1440px] px-4 sm:px-6 lg:px-4 xl:px-6"
      >
        <div className="grid gap-7 lg:grid-cols-[1.4fr_0.95fr] lg:items-stretch">
          <div className="transform-gpu rounded-[7px] border border-border bg-white px-6 py-7 transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] md:px-9 md:py-8">
            <div className="flex items-center gap-4 text-[16px] font-extrabold leading-none text-foreground">
              <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
              {t("eyebrow")}
            </div>

            <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {VALUE_ITEMS.map((item) => {
                return (
                  <article
                    key={item.key}
                    className="group transform-gpu rounded-[7px] px-0 py-1 transition-transform duration-300 hover:-translate-y-1 sm:px-2 lg:border-l lg:border-border lg:px-7 first:lg:border-l-0 first:lg:pl-0"
                  >
                    <Image
                      src={`/assets/${item.icon}.png`}
                      alt=""
                      width={item.width}
                      height={item.height}
                      className="h-11 w-11 object-contain transition-transform duration-300 group-hover:-translate-y-1"
                    />
                    <h3 className="mt-5 min-h-[2.5em] text-[15px] font-extrabold leading-tight text-foreground lg:text-[16px]">
                      {t(`values.${item.key}.title` as never)}
                    </h3>
                    <p className="mt-4 text-[14px] font-medium leading-[1.38] text-muted-foreground">
                      {t(`values.${item.key}.description` as never)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative transform-gpu overflow-hidden rounded-[7px] bg-brand px-6 py-6 text-white shadow-[0_18px_38px_rgba(0,0,0,0.16)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_24px_50px_rgba(0,0,0,0.22)] md:px-7 md:py-7 motion-safe:hover:-translate-y-1">
            <div
              className="pointer-events-none absolute left-7 right-7 top-1/2 hidden h-px -translate-y-1/2 bg-white/28 sm:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-7 left-1/2 top-7 hidden w-px -translate-x-1/2 bg-white/28 sm:block"
              aria-hidden
            />

            <div className="relative grid h-full gap-y-8 sm:grid-cols-2 sm:grid-rows-2 sm:gap-y-0">
              {STATS.map((stat, index) => {
                return (
                  <div
                    key={stat.key}
                    className={`group flex min-h-[96px] items-center gap-4 border-white/25 first:border-t-0 sm:min-h-[112px] sm:border-t-0 ${
                      index > 0 ? "border-t pt-8 sm:pt-0" : ""
                    } ${index % 2 === 0 ? "sm:pr-6" : "sm:pl-6"}`}
                  >
                    <Image
                      src={`/assets/${stat.icon}.png`}
                      alt=""
                      width={stat.width}
                      height={stat.height}
                      className="size-[42px] shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-1 md:size-[48px]"
                    />
                    <div className="min-w-0">
                      <strong className="block whitespace-nowrap text-[24px] font-extrabold leading-none tracking-normal md:text-[28px] xl:text-[30px]">
                        {t(`stats.${stat.key}.value` as never)}
                      </strong>
                      <span className="mt-2 block text-[12px] font-medium leading-tight text-white/88 md:text-[13px]">
                        {t(`stats.${stat.key}.label` as never)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ExpertiseCta() {
  const t = useTranslations("ExpertisePage.Cta");

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-brand/35 bg-white py-20 md:min-h-[360px] md:py-24"
      aria-labelledby="expertise-cta-title"
    >
      <Image
        src="/assets/technical-drawing-bottom.png"
        alt=""
        width={1123}
        height={301}
        quality={100}
        sizes="(max-width: 1024px) 100vw, 720px"
        unoptimized
        className="pointer-events-none absolute right-[-120px] top-12 hidden w-[52vw] max-w-[760px] opacity-60 md:block"
      />

      <Container size="wide" className="relative z-10">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-3 text-[14px] font-medium text-muted-foreground">
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            {t("eyebrow")}
          </div>

          <h2
            id="expertise-cta-title"
            className="domtek-text-shadow mt-8 text-[34px] font-extrabold leading-[1.05] text-foreground sm:text-[46px] md:text-[52px]"
          >
            <span className="text-brand">.</span>
            {t("title")}
            {" "}
            <span className="text-brand">?</span>
          </h2>

          <p className="mt-5 max-w-[450px] text-[14px] font-medium leading-[1.4] text-muted-foreground">
            {t("subtitle")}
          </p>

          <Button
            nativeButton={false}
            className="mt-8 h-10 rounded-[7px] border-0 px-5 text-[13px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform has-data-[icon=inline-end]:pr-5 hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
            render={<Link href="/contact" />}
          >
            {t("button")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
