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
      className="relative min-h-[360px] overflow-hidden bg-background pb-[54px] pt-[116px] md:min-h-[430px] md:pb-[70px] md:pt-[134px]"
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
        <div className="grid gap-12 md:grid-cols-[1fr_0.9fr] md:items-start">
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

          <div className="hidden min-h-[250px] md:block">
            <div className="mx-auto flex h-[250px] w-px flex-col items-center bg-brand/45">
              <span className="mt-1 size-[6px] rounded-full bg-brand" aria-hidden />
            </div>
            <p className="mt-[-244px] text-center text-[15px] font-medium text-muted-foreground">
              {t("team")}
            </p>
          </div>
        </div>
      </Container>
    </section>
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
            className="domtek-text-shadow mt-8 max-w-[610px] text-[34px] font-extrabold leading-[1.06] text-foreground sm:text-[44px] md:text-[52px]"
          >
            {t("title")}
            <span className="text-brand">.</span>
          </h2>

          <p className="mt-7 max-w-[610px] text-[15px] font-medium leading-[1.42] text-muted-foreground">
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
        <div className="grid gap-7 lg:grid-cols-[1.55fr_0.95fr] lg:items-stretch">
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
                    <h3 className="mt-5 text-[15px] font-extrabold leading-tight text-foreground lg:text-[16px]">
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

          <div className="transform-gpu rounded-[7px] bg-brand px-6 py-6 text-white shadow-[0_18px_38px_rgba(0,0,0,0.16)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_24px_50px_rgba(0,0,0,0.22)] md:px-7 md:py-7 motion-safe:hover:-translate-y-1">
            <div className="grid h-full gap-5 sm:grid-cols-2">
              {STATS.map((stat) => {
                return (
                  <div
                    key={stat.key}
                    className="group flex min-h-[82px] items-start gap-4 border-white/25 sm:border-t sm:pt-5 sm:nth-[1]:border-t-0 sm:nth-[2]:border-t-0 sm:nth-[1]:pt-0 sm:nth-[2]:pt-0"
                  >
                    <Image
                      src={`/assets/${stat.icon}.png`}
                      alt=""
                      width={stat.width}
                      height={stat.height}
                      className="mt-0.5 size-11 shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-1"
                    />
                    <div>
                      <strong className="block text-[23px] font-extrabold leading-none">
                        {t(`stats.${stat.key}.value` as never)}
                      </strong>
                      <span className="mt-2 block text-[12px] font-medium leading-tight text-white/88">
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
            <span className="text-brand">?</span>
          </h2>

          <p className="mt-5 max-w-[450px] text-[14px] font-medium leading-[1.4] text-muted-foreground">
            {t("subtitle")}
          </p>

          <Button
            nativeButton={false}
            className="mt-8 h-10 rounded-[7px] border-0 px-5 text-[13px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform has-data-[icon=inline-end]:pr-5 hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
            render={<Link href="/#contact" />}
          >
            {t("button")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
