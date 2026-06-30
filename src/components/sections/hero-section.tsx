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
      className="relative min-h-[700px] overflow-hidden bg-background pt-[126px] md:min-h-[760px] md:pt-[138px]"
      aria-labelledby="hero-title"
    >
      <Image
        src="/assets/technical-drawing-top.png"
        alt=""
        width={1200}
        height={768}
        priority
        sizes="(max-width: 768px) 118vw, 62vw"
        className="pointer-events-none absolute right-[-32vw] top-[88px] z-0 h-auto w-[118vw] max-w-none opacity-95 sm:right-[-18vw] md:right-0 md:top-[88px] md:w-[62vw] md:max-w-[980px]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-white/24" />

      <Container size="wide" className="relative z-10">
        <motion.div
          variants={group}
          initial={false}
          animate="visible"
          className="max-w-[760px]"
        >
          <motion.div
            variants={rise}
            className="mb-[52px] flex items-start gap-2 text-[16px] font-normal text-muted-foreground md:mb-[60px] md:items-center md:text-[18px]"
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
              className="pointer-events-none absolute left-[266px] top-[-11px] hidden w-[126px] md:block"
              aria-hidden
            />
            <Image
              src="/assets/arrow-right.png"
              alt=""
              width={197}
              height={197}
              priority
              className="pointer-events-none absolute -left-[66px] top-[150px] hidden w-[126px] md:block"
              aria-hidden
            />

            <motion.h1
              id="hero-title"
              variants={rise}
              className="domtek-text-shadow max-w-full text-[32px] font-medium leading-[1.12] tracking-normal text-foreground sm:text-[48px] lg:text-[54px] 2xl:text-[58px]"
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
              <span className="mt-6 block pl-0 text-[24px] font-extrabold leading-none sm:text-[50px] lg:mt-7 lg:pl-[66px] lg:text-[58px] 2xl:pl-[78px] 2xl:text-[62px]">
                <span className="text-brand">.</span>
                {t("shape")}
                <span className="text-brand">.</span>
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={rise}
            className="mt-10 max-w-[450px] text-[16px] font-medium leading-[1.3] text-muted-foreground"
          >
            {t.rich("lead", {
              strong: (chunks) => (
                <strong className="font-extrabold text-foreground">
                  {chunks}
                </strong>
              ),
            })}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-[44px] flex flex-wrap items-center gap-9"
          >
            <Button
              nativeButton={false}
              size="lg"
              className="h-10 rounded-[7px] px-6 text-[16px] font-bold shadow-[0_3px_8px_rgba(227,6,19,0.36)] transition-transform hover:-translate-y-0.5"
              render={<Link href="/#contact" />}
            >
              {t("ctaPrimary")}
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Link
              href="/#expertise"
              className="inline-flex items-center gap-7 text-[16px] font-extrabold text-foreground transition-colors hover:text-brand"
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
