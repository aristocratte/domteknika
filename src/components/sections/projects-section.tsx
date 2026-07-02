"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PROJECTS = [
  { id: 2, src: "product-1", tag: "Tag1" },
  { id: 3, src: "product-2", tag: "Tag2" },
  { id: 4, src: "product-3", tag: "Tag3" },
  { id: 5, src: "product-4", tag: "Tag5" },
] as const;

const CAROUSEL_PROJECTS = [...PROJECTS, ...PROJECTS];

export function ProjectsSection() {
  const t = useTranslations("Projects");
  const [api, setApi] = useState<CarouselApi>();
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  return (
    <section
      id="projects"
      className="relative overflow-hidden scroll-mt-24 bg-background pb-[116px] pt-[84px]"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <div className="mb-[38px] flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="projects-title"
            className="text-[20px] font-extrabold leading-none text-foreground"
          >
            {t("title")}
          </h2>
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-foreground transition-colors hover:text-brand sm:gap-6 sm:text-[15px]"
          >
            {t("viewAll")}
            <ArrowRight className="size-5 text-brand" aria-hidden />
          </Link>
        </div>

        <div
          data-projects-fade
          className="relative -mx-4 overflow-hidden px-4 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14 xl:-mx-20 xl:px-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-background via-background/80 to-transparent backdrop-blur-[5px] [mask-image:linear-gradient(to_right,black_0%,black_58%,transparent_100%)] sm:w-24 lg:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-background via-background/80 to-transparent backdrop-blur-[5px] [mask-image:linear-gradient(to_left,black_0%,black_58%,transparent_100%)] sm:w-24 lg:w-32"
          />
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            plugins={[autoplay]}
            className="w-full"
            onFocus={() => autoplay.stop()}
            onBlur={() => autoplay.reset()}
          >
            <CarouselContent className="-ml-7">
              {CAROUSEL_PROJECTS.map((project, index) => (
                <CarouselItem
                  key={`${project.id}-${index}`}
                  className="basis-[min(274px,78vw)] pl-7"
                >
                  <ProjectCard
                    image={`/assets/${project.src}.png`}
                    title={t(`items.${project.id}.title` as never)}
                    description={t(`items.${project.id}.description` as never)}
                    tag={project.tag}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <ProjectArrow
            label={t("previous")}
            className="left-2 sm:left-4 lg:left-8"
            disabled={!api}
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="size-8" aria-hidden />
          </ProjectArrow>
          <ProjectArrow
            label={t("next")}
            className="right-14 sm:right-14 lg:right-8"
            disabled={!api}
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="size-8" aria-hidden />
          </ProjectArrow>
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({
  image,
  title,
  description,
  tag,
}: {
  image: string;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <article className="group h-[286px] overflow-hidden rounded-[7px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <div className="relative h-[160px] bg-muted">
        <Image
          src={image}
          alt=""
          fill
          sizes="274px"
          className="object-contain p-4 transition-transform duration-500 ease-smooth group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex h-[126px] flex-col px-4 pb-4 pt-4">
        <h3 className="text-[14px] font-extrabold leading-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-[13px] font-medium leading-tight text-muted-foreground">
          {description}
        </p>
        <p className="mt-auto text-[12px] font-extrabold leading-none text-brand">
          #{tag}
        </p>
      </div>
    </article>
  );
}

function ProjectArrow({
  children,
  label,
  className,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-50 grid size-12 -translate-y-1/2 place-items-center text-brand transition-transform hover:-translate-y-1/2 hover:scale-110 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
