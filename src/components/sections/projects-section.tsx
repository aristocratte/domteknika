"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import {
  type Project,
  getProjectsPageCopy,
  getProjectsForLocale,
  ProjectDetailsDialog,
} from "@/components/sections/projects-page-content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projects = useMemo(() => getProjectsForLocale(locale), [locale]);
  const projectsCopy = useMemo(() => getProjectsPageCopy(locale), [locale]);
  const carouselProjects = useMemo(() => [...projects, ...projects], [projects]);
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
      className="relative overflow-hidden scroll-mt-24 bg-background pb-[116px] pt-[clamp(96px,8.7vw,150px)]"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <Reveal className="mb-[38px] flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="projects-title"
            className="text-[20px] font-extrabold leading-none text-foreground"
          >
            {t("title")}
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-foreground transition-colors hover:text-brand sm:gap-6 sm:text-[15px]"
          >
            {t("viewAll")}
            <ArrowRight className="size-5 text-brand" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
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
                {carouselProjects.map((project, index) => (
                  <CarouselItem
                    key={`${project.id}-${index}`}
                    className="basis-[min(274px,78vw)] pl-7"
                  >
                    <ProjectCard
                      project={project}
                      tag={project.tags[1] ?? project.tags[0] ?? project.category}
                      openDetailsLabel={projectsCopy.cardOpenDetails}
                      onOpen={(nextProject) => {
                        autoplay.stop();
                        setSelectedProject(nextProject);
                      }}
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
        </Reveal>
      </Container>
      {selectedProject ? (
        <ProjectDetailsDialog
          locale={locale}
          modal={projectsCopy.modal}
          project={selectedProject}
          onClosed={() => setSelectedProject(null)}
        />
      ) : null}
    </section>
  );
}

function ProjectCard({
  project,
  tag,
  onOpen,
  openDetailsLabel,
}: {
  project: Project;
  tag: string;
  onOpen: (project: Project) => void;
  openDetailsLabel: string;
}) {
  return (
    <button
      type="button"
      className="group block h-[286px] w-full overflow-hidden rounded-[7px] border border-border bg-white text-left outline-none transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-brand/30"
      aria-haspopup="dialog"
      aria-label={`${openDetailsLabel}: ${project.title}`}
      onClick={() => onOpen(project)}
    >
      <article className="h-full">
        <div className="relative h-[160px] bg-muted">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="274px"
            className="object-contain p-4 transition-transform duration-500 ease-smooth group-hover:scale-[1.035]"
          />
        </div>
        <div className="flex h-[126px] flex-col px-4 pb-4 pt-4">
          <h3 className="text-[14px] font-extrabold leading-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-2 text-[13px] font-medium leading-tight text-muted-foreground">
            {project.description}
          </p>
          <p className="mt-auto text-[12px] font-extrabold leading-none text-brand">
            {tag}
          </p>
        </div>
      </article>
    </button>
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
