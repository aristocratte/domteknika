"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

const HOME_PROJECTS_REVEAL_SCROLL_Y = 24;
const PINNED_HOME_PROJECT_ID = "aventor";

function shuffleHomeProjects(projects: Project[]) {
  const pinnedProject = projects.find(
    (project) => project.id === PINNED_HOME_PROJECT_ID,
  );
  const shuffledProjects = projects.filter(
    (project) => project.id !== PINNED_HOME_PROJECT_ID,
  );

  for (let index = shuffledProjects.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledProjects[index], shuffledProjects[randomIndex]] = [
      shuffledProjects[randomIndex],
      shuffledProjects[index],
    ];
  }

  return pinnedProject ? [pinnedProject, ...shuffledProjects] : shuffledProjects;
}

export function ProjectsSection() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projects = useMemo(() => getProjectsForLocale(locale), [locale]);
  const projectsCopy = useMemo(() => getProjectsPageCopy(locale), [locale]);
  const [homeProjects, setHomeProjects] = useState(projects);
  const carouselProjects = useMemo(
    () => [...homeProjects, ...homeProjects],
    [homeProjects],
  );
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setHomeProjects(shuffleHomeProjects(projects));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [projects]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden scroll-mt-24 bg-background pb-10 pt-[88px] md:pb-[116px] md:pt-[clamp(118px,8.5vw,150px)]"
      aria-labelledby="projects-title"
    >
      <Container size="wide">
        <Reveal
          minimumScrollY={HOME_PROJECTS_REVEAL_SCROLL_Y}
          className="relative"
        >
          <div className="mb-5 flex flex-col items-start gap-3 md:mb-[38px] md:gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          </div>

          <div
            data-projects-fade
            className="relative -mx-7 overflow-hidden pb-14 sm:-mx-10 lg:-mx-14 lg:px-14 xl:-mx-20 xl:px-20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-14 left-0 z-20 w-7 bg-gradient-to-r from-background/80 to-transparent backdrop-blur-[1px] [mask-image:linear-gradient(to_right,black_0%,black_42%,transparent_100%)] sm:w-10 md:inset-y-0 md:w-16 md:from-background md:via-background/70 md:backdrop-blur-[3px] lg:w-24"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-14 right-0 z-20 w-7 bg-gradient-to-l from-background/80 to-transparent backdrop-blur-[1px] [mask-image:linear-gradient(to_left,black_0%,black_42%,transparent_100%)] sm:w-10 md:inset-y-0 md:w-16 md:from-background md:via-background/70 md:backdrop-blur-[3px] lg:w-24"
            />
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
                dragFree: false,
              }}
              plugins={[autoplay]}
              className="w-full touch-pan-y"
              onFocus={() => autoplay.stop()}
              onBlur={() => autoplay.reset()}
            >
              <CarouselContent className="-ml-4">
                {carouselProjects.map((project, index) => (
                  <CarouselItem
                    key={`${project.id}-${index}`}
                    className="basis-[min(340px,82vw)] pl-4 md:basis-[274px]"
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
              className="left-[calc(50%-58px)] md:left-2 lg:left-8"
              disabled={!api}
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-8" aria-hidden />
            </ProjectArrow>
            <ProjectArrow
              label={t("next")}
              className="right-[calc(50%-58px)] md:right-14 lg:right-8"
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
        "absolute bottom-0 z-50 grid size-11 place-items-center text-brand transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-40 md:top-1/2 md:size-12 md:-translate-y-1/2 md:hover:-translate-y-1/2",
        className,
      )}
    >
      {children}
    </button>
  );
}
