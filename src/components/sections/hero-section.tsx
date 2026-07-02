"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const group = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  const t = useTranslations("Hero");
  const shapeWords = t("shape").split(" ");
  const shapeLastWord = shapeWords.pop();
  const shapeFirstLine = shapeWords.join(" ");

  return (
    <section
      id="top"
      className="relative min-h-[680px] overflow-hidden bg-background pb-[84px] pt-[132px] md:min-h-[720px] md:pb-[96px] md:pt-[152px]"
      aria-labelledby="hero-title"
    >
      <Image
        src="/assets/technical-drawing-top.png"
        alt=""
        width={1200}
        height={768}
        priority
        sizes="(max-width: 768px) 108vw, 66vw"
        className="pointer-events-none absolute right-[-30vw] top-[106px] z-0 h-auto w-[108vw] max-w-none opacity-75 sm:right-[-18vw] md:right-0 md:top-[86px] md:w-[66vw] md:max-w-[1040px]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/76 to-white/16" />
      <div
        className="pointer-events-none absolute bottom-[-22px] right-[-38px] z-[1] h-[238px] w-[360px] max-w-none opacity-[0.28] min-[390px]:right-[-36px] min-[390px]:h-[270px] min-[390px]:w-[430px] sm:bottom-[-34px] sm:right-[-70px] sm:h-[320px] sm:w-[520px] sm:opacity-[0.36] md:bottom-[28px] md:right-[-25vw] md:h-[520px] md:w-[74vw] md:max-w-[1040px] md:opacity-100 lg:right-[-18vw] xl:right-[-12vw] 2xl:right-[-6vw]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.12) 5%, black 16%, black 83%, rgb(0 0 0 / 0.18) 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.12) 5%, black 16%, black 83%, rgb(0 0 0 / 0.18) 94%, transparent 100%)",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgb(0 0 0 / 0.42) 92%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgb(0 0 0 / 0.42) 92%, transparent 100%)",
          }}
        >
          <Image
            src="/assets/rv01-hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 82vw, 1040px"
            className="object-contain object-bottom"
          />
          <div
            className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-white via-white/80 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-white via-white/75 to-transparent"
            aria-hidden
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[170px] bg-gradient-to-t from-background via-background/90 to-transparent md:hidden"
        aria-hidden
      />

      <Container size="wide" className="relative z-10">
        <motion.div
          variants={group}
          initial={false}
          animate="visible"
          className="w-full max-w-[620px]"
        >
          <motion.div
            variants={rise}
            className="mb-[44px] flex items-start gap-2 text-[15px] font-normal text-muted-foreground md:mb-[52px] md:items-center md:text-[16px]"
          >
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            <span className="min-w-0 max-w-[230px] leading-[1.2] md:max-w-none">
              {t("eyebrow")}
            </span>
          </motion.div>

          <div className="relative">
            <motion.h1
              id="hero-title"
              variants={rise}
              className="domtek-text-shadow max-w-[calc(100vw-56px)] text-[clamp(26px,6.5vw,42px)] font-medium leading-[1.12] tracking-normal text-foreground sm:max-w-full lg:text-[46px] 2xl:text-[48px]"
            >
              <span className="relative block w-fit">
                {t("engineering")}
                <span className="text-brand">.</span>
                <Image
                  src="/assets/arrow-left-hero.png"
                  alt=""
                  width={62}
                  height={92}
                  priority
                  className="pointer-events-none absolute left-[calc(100%+0.04em)] top-[-0.02em] block w-[0.78em] max-w-none rotate-[3deg] sm:w-[0.88em] md:top-[-0.08em] md:w-[0.98em] lg:left-[calc(100%+0.08em)] lg:top-[-0.16em] lg:w-[1.08em]"
                  aria-hidden
                />
              </span>
              <span className="block">
                {t("prototyping")}
                <span className="text-brand">.</span>
              </span>
              <span className="block">
                {t("producing")}
                <span className="text-brand">.</span>
              </span>
              <span className="relative mt-6 block w-full max-w-[calc(100vw-56px)] whitespace-normal pl-0 text-[clamp(26px,6.5vw,42px)] font-extrabold leading-[1.04] sm:max-w-full md:pl-[52px] lg:mt-7 lg:text-[48px] 2xl:pl-[58px] 2xl:text-[50px]">
                <Image
                  src="/assets/arrow-right-hero.png"
                  alt=""
                  width={61}
                  height={98}
                  priority
                  className="pointer-events-none absolute left-[-0.64em] top-[-0.92em] block w-[0.82em] max-w-none rotate-[6deg] sm:w-[0.9em] md:left-[-0.72em] md:top-[-1.04em] md:w-[1.02em] lg:top-[calc(-0.84em-10px)] lg:w-[1.14em]"
                  aria-hidden
                />
                <span className="text-brand">.</span>
                {shapeFirstLine}
                {shapeLastWord ? (
                  <>
                    <span className="hidden md:inline"> </span>
                    <span className="block md:inline">
                      {shapeLastWord}
                      <span className="text-brand">.</span>
                    </span>
                  </>
                ) : (
                  <span className="text-brand">.</span>
                )}
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={rise}
            className="mt-9 max-w-[240px] text-[14px] font-medium leading-[1.34] text-muted-foreground min-[360px]:max-w-[300px] sm:max-w-[390px]"
          >
            {t.rich("lead", {
              brand: (chunks) => (
                <strong className="font-extrabold text-foreground underline decoration-brand decoration-[2px] underline-offset-[3px]">
                  {chunks}
                </strong>
              ),
              strong: (chunks) => (
                <strong className="font-extrabold text-foreground">
                  {chunks}
                </strong>
              ),
            })}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8"
          >
            <Button
              nativeButton={false}
              size="lg"
              className="h-10 rounded-[7px] border-0 px-5 text-[14px] font-bold leading-none shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform has-data-[icon=inline-end]:pr-5 hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
              render={<Link href="/contact" />}
            >
              {t("ctaPrimary")}
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Link
              href="/expertise"
              className="inline-flex items-center gap-6 text-[15px] font-extrabold text-foreground transition-colors hover:text-brand"
            >
              {t("ctaSecondary")}
              <ArrowRight className="size-5 text-brand" aria-hidden />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
