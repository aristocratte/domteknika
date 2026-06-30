"use client";

import Image from "next/image";
import { useState } from "react";
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

export function ProjectsSection() {
  const t = useTranslations("Projects");
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section
      id="projects"
      className="relative scroll-mt-24 bg-background pb-[88px] pt-[24px]"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <div className="mb-[31px] flex items-center justify-between">
          <h2
            id="projects-title"
            className="text-[22px] font-extrabold leading-none text-foreground"
          >
            {t("title")}
          </h2>
          <Link
            href="#"
            aria-disabled="true"
            onClick={(event) => event.preventDefault()}
            className="inline-flex items-center gap-7 text-[18px] font-extrabold text-foreground transition-colors hover:text-brand"
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
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {PROJECTS.map((project) => (
              <CarouselItem
                key={project.id}
                className="basis-[min(336px,82vw)] pl-4"
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
        className="left-[clamp(22px,5vw,96px)]"
        disabled={!api}
        onClick={() => api?.scrollPrev()}
      >
        <ChevronLeft className="size-10" aria-hidden />
      </ProjectArrow>
      <ProjectArrow
        label={t("next")}
        className="right-[clamp(22px,5vw,96px)]"
        disabled={!api}
        onClick={() => api?.scrollNext()}
      >
        <ChevronRight className="size-10" aria-hidden />
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
    <article className="group h-[326px] overflow-hidden rounded-[7px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <div className="relative h-[185px] bg-muted">
        <Image
          src={image}
          alt=""
          fill
          sizes="372px"
          className="object-contain p-4 transition-transform duration-500 ease-smooth group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex h-[141px] flex-col px-5 pb-5 pt-4">
        <h3 className="text-[15px] font-extrabold leading-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-[14px] font-medium leading-tight text-muted-foreground">
          {description}
        </p>
        <p className="mt-auto text-[13px] font-extrabold leading-none text-brand">
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
        "absolute top-[232px] grid size-14 place-items-center text-brand transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
