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
      className="relative scroll-mt-24 bg-background pb-[116px] pt-[84px]"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <div className="mb-[38px] flex items-center justify-between">
          <h2
            id="projects-title"
            className="text-[20px] font-extrabold leading-none text-foreground"
          >
            {t("title")}
          </h2>
          <Link
            href="#"
            aria-disabled="true"
            onClick={(event) => event.preventDefault()}
            className="inline-flex items-center gap-6 text-[15px] font-extrabold text-foreground transition-colors hover:text-brand"
          >
            {t("viewAll")}
            <ArrowRight className="size-5 text-brand" aria-hidden />
          </Link>
        </div>

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
          <CarouselContent className="-ml-5">
            {CAROUSEL_PROJECTS.map((project, index) => (
              <CarouselItem
                key={`${project.id}-${index}`}
                className="basis-[min(274px,78vw)] pl-5"
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
      </Container>

      <ProjectArrow
        label={t("previous")}
        className="left-[clamp(20px,3vw,72px)]"
        disabled={!api}
        onClick={() => api?.scrollPrev()}
      >
        <ChevronLeft className="size-8" aria-hidden />
      </ProjectArrow>
      <ProjectArrow
        label={t("next")}
        className="right-[clamp(20px,3vw,72px)]"
        disabled={!api}
        onClick={() => api?.scrollNext()}
      >
        <ChevronRight className="size-8" aria-hidden />
      </ProjectArrow>
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
        "absolute top-[262px] grid size-12 place-items-center text-brand transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
