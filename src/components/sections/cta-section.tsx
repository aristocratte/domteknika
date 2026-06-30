"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("Cta");

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-b border-brand/35 bg-white py-12 md:min-h-[304px]"
      aria-labelledby="cta-title"
    >
      <Image
        src="/assets/technical-drawing-bottom.png"
        alt=""
        width={1123}
        height={301}
        sizes="(max-width: 1024px) 100vw, 1123px"
        className="pointer-events-none absolute right-0 top-6 hidden w-[58vw] max-w-[1123px] opacity-60 md:block"
      />

      <Container size="wide" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[740px]"
        >
          <div className="flex items-center gap-3 text-[18px] font-medium text-muted-foreground">
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            {t("eyebrow")}
          </div>

          <h2
            id="cta-title"
            className="domtek-text-shadow mt-6 text-[36px] font-extrabold leading-[1.08] text-foreground sm:text-[48px] lg:text-[56px]"
          >
            <span className="text-brand">.</span>
            {t("title")}
            <span className="text-brand"> ?</span>
          </h2>

          <p className="mt-5 max-w-[540px] text-[16px] font-medium leading-[1.3] text-muted-foreground">
            {t("subtitle")}
          </p>

          <Button
            nativeButton={false}
            className="mt-7 h-10 rounded-[7px] px-6 text-[14px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5"
            render={<Link href="/#contact" />}
          >
            {t("cta")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
