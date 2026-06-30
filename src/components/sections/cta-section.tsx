"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * CTA Section — Chasseral / Alps background image with two layered effects
 * (per the design spec):
 *
 * 1. GAUSSIAN BLUR — a rectangle overlaid on the LEFT side, covering from 0 to
 *    2/3 of the image width, applying a backdrop blur. The blur intensity is
 *    strongest at the left edge and fades out toward the 2/3 mark.
 *
 * 2. GRADIENT OVERLAY — on top of (and wider than) the blur, a left-to-right
 *    linear gradient: #004691 at 49% opacity (left) fading to #00273D at 0%
 *    opacity (invisible, right). This gives the text legibility while keeping
 *    the right portion of the photo crisp.
 *
 * The CTA text sits on the left where both effects combine.
 */
export function CtaSection() {
  const t = useTranslations("Cta");

  return (
    <section className="px-4 pb-4 pt-8 sm:px-6" aria-labelledby="cta-title">
      <Container size="wide" className="px-0">
        <div className="relative h-[560px] overflow-hidden rounded-3xl sm:h-[480px] lg:h-[560px]">
          {/* 1. Background photo — Swiss Alps / Chasseral */}
          <Image
            src="/assets/alps-background.png"
            alt="Alpes suisses, massif du Chasseral"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* 2. GAUSSIAN BLUR rectangle — left → 2/3 width, strongest at left */}
          <div
            className="absolute inset-y-0 left-0 w-2/3"
            style={{
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              // Soften the right edge of the blur zone with a mask
              WebkitMaskImage:
                "linear-gradient(to right, black 55%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 55%, transparent 100%)",
            }}
            aria-hidden
          />

          {/* 3. GRADIENT overlay — #004691 @ 49% → #00273D @ 0% (invisible) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,70,145,0.49) 0%, rgba(0,39,61,0) 100%)",
            }}
            aria-hidden
          />

          {/* Subtle bottom gradient for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,39,61,0.35) 0%, transparent 40%)",
            }}
            aria-hidden
          />

          {/* 4. Content — left aligned, on the blurred/darkened zone */}
          <Container className="relative z-10 flex h-full items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg text-white"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <span className="h-1 w-1 rounded-full bg-brand" />
                {t("eyebrow")}
              </span>

              <h2
                id="cta-title"
                className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]"
              >
                {t("title")}
              </h2>

              <p className="mt-4 max-w-md text-balance text-base leading-relaxed text-white/85 sm:text-lg">
                {t("subtitle")}
              </p>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground shadow-[0_10px_30px_rgba(227,6,19,0.4)] transition-transform hover:-translate-y-0.5"
                  render={<Link href="/contact" />}
                >
                  {t("cta")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </motion.div>
          </Container>
        </div>
      </Container>
    </section>
  );
}
