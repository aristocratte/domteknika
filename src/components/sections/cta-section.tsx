"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("Cta");

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-white py-20 md:min-h-[320px] md:py-24"
      aria-labelledby="cta-title"
    >
      <Image
        src="/assets/technical-drawing-bottom.png"
        alt=""
        width={1123}
        height={301}
        quality={100}
        sizes="(max-width: 1024px) 100vw, 1123px"
        unoptimized
        className="pointer-events-none absolute right-0 top-8 hidden w-[50vw] max-w-[960px] opacity-60 md:block"
      />

      <Container size="wide" className="relative z-10">
        <Reveal className="max-w-[920px]">
          <div className="flex items-center gap-3 text-[16px] font-medium text-muted-foreground">
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            {t("eyebrow")}
          </div>

          <h2
            id="cta-title"
            className="domtek-text-shadow mt-6 max-w-[860px] text-[32px] font-extrabold leading-[1.08] text-foreground sm:text-[42px] lg:text-[48px]"
          >
            <span className="text-brand">.</span>
            {t("title")}
            <span className="whitespace-nowrap text-brand">&nbsp;?</span>
          </h2>

          <p className="mt-5 max-w-[500px] text-[15px] font-medium leading-[1.34] text-muted-foreground">
            {t("subtitle")}
          </p>

          <Button
            nativeButton={false}
            className="mt-8 h-10 rounded-[7px] border-0 px-5 text-[13px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
            render={<Link href="/contact" />}
          >
            {t("cta")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
