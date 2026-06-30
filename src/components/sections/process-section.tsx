import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { SectionHeading } from "./section-heading";

export function ProcessSection() {
  const t = useTranslations("Process");

  return (
    <section
      id="process"
      className="scroll-mt-28 py-20 sm:py-28"
      aria-labelledby="process-title"
    >
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            align="center"
            className="mx-auto items-center"
          />
        </Reveal>

        <Reveal className="mt-14" delay={0.15}>
          <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <Image
                src="/assets/schema-process.png"
                alt={t("title")}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
