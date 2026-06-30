"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: 1, src: "product-1", titleKey: "1" },
  { id: 2, src: "product-2", titleKey: "2" },
  { id: 3, src: "product-3", titleKey: "3" },
  { id: 4, src: "product-4", titleKey: "4" },
] as const;

export function ProjectsSection() {
  const t = useTranslations("Projects");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  function onSelect(a: CarouselApi) {
    setCount(a?.scrollSnapList().length ?? 0);
    setCurrent(a?.selectedScrollSnap() ?? 0);
  }

  return (
    <section
      id="projects"
      className="scroll-mt-28 py-20 sm:py-28"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
          </Reveal>

          {/* Custom nav arrows */}
          <div className="flex items-center gap-3">
            <ArrowButton
              direction="prev"
              disabled={!api?.canScrollPrev()}
              onClick={() => api?.scrollPrev()}
              label={t("previous")}
            />
            <ArrowButton
              direction="next"
              disabled={!api?.canScrollNext()}
              onClick={() => api?.scrollNext()}
              label={t("next")}
            />
          </div>
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <Carousel
            setApi={(a) => {
              setApi(a);
              if (a) {
                onSelect(a);
                a.on("select", () => onSelect(a));
                a.on("reInit", () => onSelect(a));
              }
            }}
            opts={{
              align: "start",
              loop: false,
              dragFree: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-5">
              {PRODUCTS.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
                >
                  <ProductCard
                    src={product.src}
                    title={t(`items.${product.titleKey}.title` as never)}
                    category={t(`items.${product.titleKey}.category` as never)}
                    index={product.id}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Pagination dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-6 bg-brand" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function ProductCard({
  src,
  title,
  category,
  index,
}: {
  src: string;
  title: string;
  category: string;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={`/assets/${src}.png`}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
        />
        {/* Index badge */}
        <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-background/80 text-xs font-bold text-foreground backdrop-blur">
          {String(index).padStart(2, "0")}
        </span>
        {/* Bottom gradient + label */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 pt-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            {category}
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
        </div>
      </div>
    </article>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid size-12 place-items-center rounded-full border border-border bg-background transition-all duration-300",
        "hover:border-brand hover:bg-brand hover:text-brand-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      <Image
        src={
          direction === "prev"
            ? "/assets/arrow-left.png"
            : "/assets/arrow-right.png"
        }
        alt=""
        width={18}
        height={18}
        className={cn("size-[18px]", direction === "next" && "rotate-0")}
      />
    </button>
  );
}
