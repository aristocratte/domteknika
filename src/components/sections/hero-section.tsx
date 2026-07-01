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
        sizes="(max-width: 768px) 108vw, 54vw"
        className="pointer-events-none absolute right-[-30vw] top-[106px] z-0 h-auto w-[108vw] max-w-none opacity-95 sm:right-[-18vw] md:right-0 md:top-[112px] md:w-[54vw] md:max-w-[820px]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-white/24" />

      <Container size="wide" className="relative z-10">
        <motion.div
          variants={group}
          initial={false}
          animate="visible"
          className="max-w-[620px]"
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
            <Image
              src="/assets/arrow-left.png"
              alt=""
              width={250}
              height={250}
              priority
              className="pointer-events-none absolute left-[218px] top-[-9px] hidden w-[108px] md:block"
              aria-hidden
            />
            <Image
              src="/assets/arrow-right.png"
              alt=""
              width={197}
              height={197}
              priority
              className="pointer-events-none absolute -left-[58px] top-[124px] hidden w-[108px] md:block"
              aria-hidden
            />

            <motion.h1
              id="hero-title"
              variants={rise}
              className="domtek-text-shadow max-w-full text-[29px] font-medium leading-[1.12] tracking-normal text-foreground sm:text-[42px] lg:text-[46px] 2xl:text-[48px]"
            >
              <span className="block">
                {t("engineering")}
                <span className="text-brand">.</span>
              </span>
              <span className="block">
                {t("prototyping")}
                <span className="text-brand">.</span>
              </span>
              <span className="block">
                {t("producing")}
                <span className="text-brand">.</span>
              </span>
              <span className="mt-6 block pl-0 text-[22px] font-extrabold leading-none sm:text-[42px] lg:mt-7 lg:pl-[52px] lg:text-[48px] 2xl:pl-[58px] 2xl:text-[50px]">
                <span className="text-brand">.</span>
                {t("shape")}
                <span className="text-brand">.</span>
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={rise}
            className="mt-9 max-w-[340px] text-[14px] font-medium leading-[1.34] text-muted-foreground sm:max-w-[390px]"
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
              render={<Link href="/#contact" />}
            >
              {t("ctaPrimary")}
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Link
              href="/#expertise"
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
