"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      className="relative overflow-hidden pt-36 pb-24 sm:pt-44 lg:pt-52 lg:pb-32"
      aria-labelledby="hero-title"
    >
      {/* Technical drawing background — subtle, low opacity */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/assets/technical-drawing-top.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.06]"
        />
        {/* Radial fade to keep text legible */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.7)_55%,white_100%)]" />
      </div>

      <Container size="wide">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {t("eyebrow")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            {t("title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 rounded-full px-7 text-sm font-semibold shadow-[0_10px_30px_rgba(227,6,19,0.3)] transition-transform hover:-translate-y-0.5"
              render={<Link href="/#projects" />}
            >
              {t("ctaPrimary")}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-border bg-background/60 px-7 text-sm font-semibold backdrop-blur transition-colors hover:bg-muted"
              render={<Link href="/contact" />}
            >
              {t("ctaSecondary")}
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Decorative scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 hidden justify-center lg:flex"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-muted-foreground/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
