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
import {
  type Project,
  getProjectsPageCopy,
  getProjectsForLocale,
  ProjectDetailsDialog,
} from "@/components/sections/projects-page-content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const PINNED_HOME_PROJECT_ID = "aventor";
const HOME_PROJECTS_IMAGE_WARMUP_COUNT = 8;

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

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

function warmProjectImages(projects: Project[]) {
  projects
    .slice(0, HOME_PROJECTS_IMAGE_WARMUP_COUNT)
    .forEach((project) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = project.image;
    });
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

  useEffect(() => {
    const scheduleWarmup = () => warmProjectImages(homeProjects);
    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(scheduleWarmup, {
        timeout: 2400,
      });

      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timerId = idleWindow.setTimeout(scheduleWarmup, 1800);
    return () => idleWindow.clearTimeout(timerId);
  }, [homeProjects]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden scroll-mt-24 bg-background pb-10 pt-9 md:pb-[116px] md:pt-[clamp(118px,8.5vw,150px)] min-[1800px]:pb-[178px] min-[1800px]:pt-[146px] min-[2300px]:!pb-[210px] min-[2300px]:!pt-[172px]"
      aria-labelledby="projects-title"
    >
      <Container size="wide" className="min-[2300px]:!max-w-[1900px]">
        <div className="relative">
          <div className="mb-5 flex flex-col items-start gap-3 md:mb-[38px] md:gap-4 lg:flex-row lg:items-center lg:justify-between min-[1800px]:mb-[70px] min-[2300px]:!mb-[82px]">
            <h2
              id="projects-title"
              className="text-[20px] font-extrabold leading-none text-foreground min-[1800px]:text-[40px] min-[2300px]:!text-[46px]"
            >
              {t("title")}
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[13px] font-extrabold text-foreground transition-colors hover:text-brand sm:gap-6 sm:text-[15px] min-[1800px]:text-[25px] min-[2300px]:!text-[28px]"
            >
              {t("viewAll")}
              <ArrowRight className="size-5 text-brand" aria-hidden />
            </Link>
          </div>

          <div
            data-projects-carousel
            className="relative -mx-7 overflow-hidden pb-14 sm:-mx-10 lg:-mx-14 lg:px-14 xl:-mx-20 xl:px-20 min-[1800px]:pb-[104px] min-[2300px]:!pb-[122px]"
          >
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
                    className="basis-[min(340px,82vw)] pl-4 md:basis-[274px] min-[1800px]:!basis-[560px] min-[2300px]:!basis-[650px]"
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
              className="left-[calc(50%-58px)]"
              disabled={!api}
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-8" aria-hidden />
            </ProjectArrow>
            <ProjectArrow
              label={t("next")}
              className="right-[calc(50%-58px)]"
              disabled={!api}
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="size-8" aria-hidden />
            </ProjectArrow>
          </div>
        </div>
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
      className="group block h-[334px] w-full overflow-hidden rounded-[7px] border border-border bg-white text-left outline-none transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:h-[630px] min-[2300px]:!h-[730px]"
      aria-haspopup="dialog"
      aria-label={`${openDetailsLabel}: ${project.title}`}
      onClick={() => onOpen(project)}
    >
      <article className="h-full">
        <div className="relative h-[148px] bg-muted min-[1800px]:h-[300px] min-[2300px]:!h-[350px]">
          <Image
            src={project.image}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            sizes="(min-width: 2300px) 450px, (min-width: 1800px) 390px, 274px"
            className="object-contain p-4 transition-transform duration-500 ease-smooth group-hover:scale-[1.035] min-[1800px]:p-8 min-[2300px]:!p-10"
          />
        </div>
        <div className="flex h-[186px] flex-col px-4 pb-4 pt-4 min-[1800px]:h-[330px] min-[1800px]:px-10 min-[1800px]:pb-10 min-[1800px]:pt-9 min-[2300px]:!h-[380px] min-[2300px]:!px-11">
          <h3 className="text-[14px] font-extrabold leading-tight text-foreground min-[1800px]:text-[26px] min-[2300px]:!text-[30px]">
            {project.title}
          </h3>
          <p className="mt-2 text-[12.5px] font-medium leading-[1.24] text-muted-foreground min-[1800px]:mt-5 min-[1800px]:text-[20px] min-[1800px]:leading-[1.34] min-[2300px]:!text-[23px]">
            {project.description}
          </p>
          <p className="mt-auto text-[12px] font-extrabold leading-none text-brand min-[1800px]:text-[20px] min-[2300px]:!text-[23px]">
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
        "absolute bottom-0 z-50 grid size-11 place-items-center rounded-[4px] text-brand transition-[background-color,transform] hover:scale-110 hover:bg-brand/5 disabled:pointer-events-none disabled:opacity-40 md:size-12 min-[1800px]:size-14",
        className,
      )}
    >
      {children}
    </button>
  );
}
