import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { SectionHeading } from "./section-heading";

const VALUES = [
  { key: "agile", src: "agile" },
  { key: "endToEnd", src: "end-to-end" },
  { key: "swissQuality", src: "swiss-quality" },
  { key: "confidential", src: "confidential" },
] as const;

export function ValuesSection() {
  const t = useTranslations("Values");

  return (
    <section
      id="values"
      className="scroll-mt-28 bg-muted/40 py-20 sm:py-28"
      aria-labelledby="values-title"
    >
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.key} delay={i * 0.1}>
              <ValueCard
                src={value.src}
                title={t(`items.${value.key}.title` as never)}
                description={t(`items.${value.key}.description` as never)}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ValueCard({
  src,
  title,
  description,
}: {
  src: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      {/* Icon */}
      <div className="relative grid size-14 place-items-center overflow-hidden rounded-xl bg-brand/5 transition-colors duration-500 group-hover:bg-brand/10">
        <Image
          src={`/assets/${src}.png`}
          alt=""
          width={28}
          height={28}
          className="size-7 object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Hover accent line */}
      <span className="mt-auto block h-0.5 w-0 bg-brand transition-all duration-500 group-hover:w-full" />
    </article>
  );
}
