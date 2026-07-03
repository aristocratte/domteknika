"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "area-1" | "area-2" | "area-3" | "area-4" | "area-5";

type Project = {
  id: string;
  category: string;
  filter?: Exclude<FilterKey, "all"> | "area-6";
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  overview: string;
};

type PanelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: string;
};

type ProjectsLocale = "en" | "fr";

type ProjectStat = {
  label: string;
  value: string;
  icon: string;
  width: number;
  height: number;
};

type ProjectsPageCopy = {
  hero: {
    eyebrow: string;
    title: string;
    strong: string;
    rest: string;
    lead: string;
  };
  filters: Array<{ key: FilterKey; label: string }>;
  featuredProject: Project;
  projects: Project[];
  stats: ProjectStat[];
  statsLabel: string;
  selectedTitle: string;
  filtersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  featuredLabel: string;
  viewCaseStudy: string;
  cardOpenDetails: string;
  modal: {
    close: string;
    overview: string;
    tags: string;
    area: string;
    focus: string;
    output: string;
    design: string;
    prototype: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    bodyStrong: string;
    body: string;
    button: string;
    subject: string;
  };
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All Projects" },
  { key: "area-1", label: "Area 1" },
  { key: "area-2", label: "Area 2" },
  { key: "area-3", label: "Area 3" },
  { key: "area-4", label: "Area 4" },
  { key: "area-5", label: "Area 5" },
];

const FEATURED_PROJECT: Project = {
  id: "project-1",
  category: "Featured project",
  title: "Project 1",
  description: "Description 1",
  image: "/assets/project-page/hero-sketch.png",
  imageAlt: "Technical product sketch",
  tags: ["#tag1", "#tag2", "#tag3"],
  overview: "Description 1",
};

const PROJECTS: Project[] = [
  {
    id: "project-2",
    category: "Area 1",
    filter: "area-1",
    title: "Project 2",
    description: "Description 2",
    image: "/assets/project-page/project-bike-left.png",
    imageAlt: "Grey electric bicycle concept",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 2",
  },
  {
    id: "project-3",
    category: "Area 2",
    filter: "area-2",
    title: "Project 3",
    description: "Description 3",
    image: "/assets/project-page/project-industrial-red.png",
    imageAlt: "Red and black industrial product concept",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 3",
  },
  {
    id: "project-4",
    category: "Area 3",
    filter: "area-3",
    title: "project 4",
    description: "Description 4",
    image: "/assets/project-page/project-blue-tool.png",
    imageAlt: "Blue translucent product concept",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 4",
  },
  {
    id: "project-5",
    category: "Area 4",
    filter: "area-4",
    title: "Project 5",
    description: "Description 5",
    image: "/assets/project-page/project-bike-right.png",
    imageAlt: "Grey electric bicycle side view",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 5",
  },
  {
    id: "project-6",
    category: "Area 5",
    filter: "area-5",
    title: "Project 6",
    description: "Description 6",
    image: "/assets/project-page/project-medical-device.png",
    imageAlt: "White medical device concept",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 6",
  },
  {
    id: "project-7",
    category: "Area 6",
    filter: "area-6",
    title: "Project 7",
    description: "Description 7",
    image: "/assets/project-page/project-gripper.png",
    imageAlt: "White handheld gripper prototype",
    tags: ["#tag1", "#tag2", "#tag3"],
    overview: "Description 7",
  },
];

const STATS: ProjectStat[] = [
  {
    label: "Projects delivered",
    value: "60+",
    icon: "/assets/project-page/stat-projects-delivered.png",
    width: 49,
    height: 55,
  },
  {
    label: "Project support",
    value: "End-to-end",
    icon: "/assets/project-page/stat-project-support.png",
    width: 45,
    height: 52,
  },
  {
    label: "Core industries",
    value: "6 +",
    icon: "/assets/project-page/stat-core-industries.png",
    width: 53,
    height: 50,
  },
  {
    label: "Countries served",
    value: "Worldwide",
    icon: "/assets/project-page/stat-worldwide.png",
    width: 51,
    height: 50,
  },
];

const FR_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "project-1": {
    category: "Projet phare",
    title: "Projet 1",
    imageAlt: "Croquis technique de produit",
  },
  "project-2": {
    category: "Domaine 1",
    title: "Projet 2",
    imageAlt: "Concept de vélo électrique gris",
  },
  "project-3": {
    category: "Domaine 2",
    title: "Projet 3",
    imageAlt: "Concept de produit industriel rouge et noir",
  },
  "project-4": {
    category: "Domaine 3",
    title: "Projet 4",
    imageAlt: "Concept de produit translucide bleu",
  },
  "project-5": {
    category: "Domaine 4",
    title: "Projet 5",
    imageAlt: "Vélo électrique gris de profil",
  },
  "project-6": {
    category: "Domaine 5",
    title: "Projet 6",
    imageAlt: "Concept de dispositif médical blanc",
  },
  "project-7": {
    category: "Domaine 6",
    title: "Projet 7",
    imageAlt: "Prototype de préhenseur blanc",
  },
};

function localizeProject(
  project: Project,
  overrides: Record<string, Partial<Project>>,
) {
  return {
    ...project,
    ...(overrides[project.id] ?? {}),
  };
}

function resolveProjectsLocale(locale: string): ProjectsLocale {
  return locale === "fr" ? "fr" : "en";
}

const PROJECTS_COPY: Record<ProjectsLocale, ProjectsPageCopy> = {
  en: {
    hero: {
      eyebrow: "Our work in action",
      title: "Projects",
      strong: "Swiss precision engineering",
      rest: "for real-world results.",
      lead: "Explore a selection of projects where we turn complex challenges into high-performance products.",
    },
    filters: FILTERS,
    featuredProject: FEATURED_PROJECT,
    projects: PROJECTS,
    stats: STATS,
    statsLabel: "Project statistics",
    selectedTitle: "Selected projects",
    filtersLabel: "Filter projects",
    searchLabel: "Search projects",
    searchPlaceholder: "Search...",
    noResults: "No projects match your search.",
    featuredLabel: "Featured project",
    viewCaseStudy: "View case study",
    cardOpenDetails: "Open project details",
    modal: {
      close: "Close project details",
      overview: "Project overview",
      tags: "Project tags",
      area: "Area",
      focus: "Focus",
      output: "Output",
      design: "Design",
      prototype: "Prototype",
    },
    cta: {
      eyebrow: "Let's build together",
      title: "Let's build what's next",
      bodyStrong: "Have a challenge in mind ?",
      body: "We partner with forward-thinking companies to design, prototype and deliver solutions that make a real impact.",
      button: "Start a project",
      subject: "Project enquiry",
    },
  },
  fr: {
    hero: {
      eyebrow: "Nos réalisations en action",
      title: "Projets",
      strong: "Ingénierie suisse de précision",
      rest: "pour des résultats concrets.",
      lead: "Découvrez une sélection de projets où nous transformons des défis complexes en produits performants.",
    },
    filters: [
      { key: "all", label: "Tous les projets" },
      { key: "area-1", label: "Domaine 1" },
      { key: "area-2", label: "Domaine 2" },
      { key: "area-3", label: "Domaine 3" },
      { key: "area-4", label: "Domaine 4" },
      { key: "area-5", label: "Domaine 5" },
    ],
    featuredProject: localizeProject(FEATURED_PROJECT, FR_PROJECT_OVERRIDES),
    projects: PROJECTS.map((project) =>
      localizeProject(project, FR_PROJECT_OVERRIDES),
    ),
    stats: [
      {
        ...STATS[0],
        label: "Projets livrés",
        value: "60+",
      },
      {
        ...STATS[1],
        label: "Accompagnement projet",
        value: "End-to-end",
      },
      {
        ...STATS[2],
        label: "Industries clés",
        value: "6+",
      },
      {
        ...STATS[3],
        label: "Pays servis",
        value: "International",
      },
    ],
    statsLabel: "Statistiques des projets",
    selectedTitle: "Projets sélectionnés",
    filtersLabel: "Filtrer les projets",
    searchLabel: "Rechercher des projets",
    searchPlaceholder: "Rechercher...",
    noResults: "Aucun projet ne correspond à votre recherche.",
    featuredLabel: "Projet phare",
    viewCaseStudy: "Voir le cas",
    cardOpenDetails: "Ouvrir le détail du projet",
    modal: {
      close: "Fermer le détail du projet",
      overview: "Vue d'ensemble du projet",
      tags: "Tags du projet",
      area: "Domaine",
      focus: "Focus",
      output: "Livrable",
      design: "Design",
      prototype: "Prototype",
    },
    cta: {
      eyebrow: "Construisons ensemble",
      title: "Construisons la suite",
      bodyStrong: "Vous avez un défi en tête ?",
      body: "Nous accompagnons les entreprises visionnaires pour concevoir, prototyper et livrer des solutions à impact réel.",
      button: "Démarrer un projet",
      subject: "Demande de projet",
    },
  },
};

const MODAL_TRANSITION_MS = 320;
const MODAL_CLOSE_FALLBACK_MS = 360;

function centeredPanelRect(): PanelRect {
  const isMobile = window.innerWidth <= 640;
  const pad = isMobile ? 14 : 34;
  const width = Math.min(880, window.innerWidth - pad * 2);
  const height = Math.min(720, window.innerHeight - pad * 2);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
    radius: isMobile ? "16px" : "22px",
  };
}

export function ProjectsPageContent({ locale }: { locale: string }) {
  const copy = PROJECTS_COPY[resolveProjectsLocale(locale)];
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogState, setDialogState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const [filterIndicatorStyle, setFilterIndicatorStyle] =
    useState<CSSProperties>({ left: 0, width: 0 });
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const dialogStateRef = useRef(dialogState);
  const lockedScrollYRef = useRef(0);
  const filterTrackRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRefs = useRef<Record<FilterKey, HTMLButtonElement | null>>({
    all: null,
    "area-1": null,
    "area-2": null,
    "area-3": null,
    "area-4": null,
    "area-5": null,
  });

  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredProjects =
      activeFilter === "all"
        ? copy.projects
        : copy.projects.filter((project) => project.filter === activeFilter);

    if (!query) return filteredProjects;

    return filteredProjects.filter((project) =>
      [
        project.category,
        project.title,
        project.description,
        project.overview,
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [activeFilter, copy.projects, searchQuery]);

  const updateFilterIndicator = useCallback(() => {
    const track = filterTrackRef.current;
    const button = filterButtonRefs.current[activeFilter];
    if (!track || !button) return;

    const trackRect = track.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setFilterIndicatorStyle({
      left: buttonRect.left - trackRect.left + track.scrollLeft,
      width: buttonRect.width,
    });
  }, [activeFilter]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimer();
    setSelectedProject(null);
    setPanelRect(null);
    setDialogState("closed");
    previousFocusRef.current?.focus?.({ preventScroll: true });
    previousFocusRef.current = null;
  }, [clearCloseTimer]);

  const openProject = useCallback(
    (project: Project) => {
      clearCloseTimer();
      lockedScrollYRef.current = window.scrollY;
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setSelectedProject(project);
      setPanelRect(centeredPanelRect());
      setDialogState("opening");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setDialogState("open");
        });
      });
    },
    [clearCloseTimer],
  );

  const closeProject = useCallback(() => {
    if (!selectedProject || dialogState === "closing") return;

    clearCloseTimer();
    setDialogState("closing");

    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose, selectedProject]);

  useEffect(() => {
    dialogStateRef.current = dialogState;
  }, [dialogState]);

  useEffect(() => {
    if (!selectedProject) return;

    const { body, documentElement } = document;
    const previousBodyStyles = {
      overscrollBehavior: body.style.overscrollBehavior,
    };
    const previousDocumentStyles = {
      overflowY: documentElement.style.overflowY,
      overscrollBehavior: documentElement.style.overscrollBehavior,
    };
    const scrollEventOptions = {
      capture: true,
      passive: false,
    } satisfies AddEventListenerOptions;
    let touchStartY = 0;

    const canScrollWithin = (container: HTMLElement, deltaY: number) => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      if (maxScrollTop <= 0) return false;
      if (deltaY < 0) return container.scrollTop > 0;
      if (deltaY > 0) return container.scrollTop < maxScrollTop - 1;
      return true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const preventBackgroundScroll = (event: Event) => {
      const scrollContainer =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-project-dialog-scroll]")
          : null;
      const deltaY =
        event instanceof WheelEvent
          ? event.deltaY
          : event instanceof TouchEvent
            ? touchStartY - (event.touches[0]?.clientY ?? touchStartY)
            : 0;

      if (scrollContainer && canScrollWithin(scrollContainer, deltaY)) {
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    window.dispatchEvent(
      new CustomEvent("domtek:scroll-lock", { detail: { locked: true } }),
    );
    body.style.overscrollBehavior = "none";
    documentElement.style.overflowY = "scroll";
    documentElement.style.overscrollBehavior = "none";
    window.addEventListener("touchstart", onTouchStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("wheel", preventBackgroundScroll, scrollEventOptions);
    window.addEventListener(
      "touchmove",
      preventBackgroundScroll,
      scrollEventOptions,
    );

    return () => {
      window.removeEventListener("touchstart", onTouchStart, {
        capture: true,
      });
      window.removeEventListener(
        "wheel",
        preventBackgroundScroll,
        scrollEventOptions,
      );
      window.removeEventListener(
        "touchmove",
        preventBackgroundScroll,
        scrollEventOptions,
      );
      body.style.overscrollBehavior = previousBodyStyles.overscrollBehavior;
      documentElement.style.overflowY = previousDocumentStyles.overflowY;
      documentElement.style.overscrollBehavior =
        previousDocumentStyles.overscrollBehavior;
      const restoreScrollY = window.scrollY || lockedScrollYRef.current;
      window.scrollTo(window.scrollX, restoreScrollY);
      window.dispatchEvent(
        new CustomEvent("domtek:scroll-lock", {
          detail: { locked: false, scrollY: restoreScrollY },
        }),
      );
    };
  }, [selectedProject]);

  useEffect(() => {
    if (dialogState !== "open") return;

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true });
    }, MODAL_TRANSITION_MS);

    return () => window.clearTimeout(focusTimer);
  }, [dialogState]);

  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") && element.getClientRects().length > 0,
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeProject, selectedProject]);

  useEffect(() => {
    if (!selectedProject || dialogState !== "open") return;

    const onResize = () => setPanelRect(centeredPanelRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dialogState, selectedProject]);

  useLayoutEffect(() => {
    updateFilterIndicator();
  }, [updateFilterIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateFilterIndicator);
    return () => window.removeEventListener("resize", updateFilterIndicator);
  }, [updateFilterIndicator]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const panelStyle = panelRect
    ? ({
        left: panelRect.left,
        top: panelRect.top,
        width: Math.max(panelRect.width, 1),
        height: Math.max(panelRect.height, 1),
        borderRadius: panelRect.radius,
        transformOrigin: "50% 50%",
      } satisfies CSSProperties)
    : undefined;

  const contentVisible = dialogState !== "closing";
  const backdropVisible = dialogState === "open";
  const panelVisible = dialogState === "open";

  return (
    <>
      <section
        className="relative min-h-[520px] overflow-hidden border-b border-border bg-background pt-[104px] md:min-h-[560px] md:pt-[112px]"
        aria-labelledby="projects-page-title"
      >
        <Image
          src="/assets/project-page/image-fond-top.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 z-0 object-contain object-right-top opacity-[0.82]"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/55 via-white/15 to-transparent" />

        <Container
          size="wide"
          className="relative z-10 grid min-h-[390px] items-center gap-10 pb-10 md:grid-cols-[0.8fr_1fr]"
        >
          <Reveal className="pb-5 md:pb-0 md:pl-4">
            <div className="flex items-center gap-3 text-[15px] font-normal text-foreground md:text-[16px]">
              <span className="h-[2px] w-[26px] bg-brand" aria-hidden />
              {copy.hero.eyebrow}
            </div>
            <h1
              id="projects-page-title"
              className="domtek-text-shadow mt-14 max-w-full text-[42px] font-extrabold leading-none text-foreground sm:text-[60px] md:mt-16 md:text-[66px]"
            >
              {copy.hero.title}<span className="text-brand">.</span>
            </h1>
            <p className="mt-8 max-w-[500px] text-[16px] leading-[1.35] text-muted-foreground sm:text-[17px]">
              <strong className="font-extrabold">
                {copy.hero.strong}
              </strong>{" "}
              {copy.hero.rest}
            </p>
            <p className="mt-5 max-w-[470px] text-[16px] leading-[1.35] text-muted-foreground sm:text-[17px] sm:leading-[1.32]">
              {copy.hero.lead}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="relative z-20 hidden min-h-[340px] md:block">
            <button
              type="button"
              data-project-origin
              className="absolute bottom-0 right-4 z-20 grid w-[250px] gap-2 rounded-[7px] border border-border/80 bg-white/80 px-5 py-5 text-left shadow-[0_16px_34px_rgba(0,0,0,0.12)] backdrop-blur-sm outline-none transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)] focus-visible:ring-2 focus-visible:ring-brand/30"
              aria-haspopup="dialog"
              onClick={() => openProject(copy.featuredProject)}
            >
              <span className="text-[10px] font-extrabold text-brand">
                {copy.featuredLabel}
              </span>
              <strong className="text-[17px] font-extrabold leading-tight">
                {copy.featuredProject.title}
              </strong>
              <span className="text-[12px] font-medium text-muted-foreground">
                {copy.featuredProject.description}
              </span>
              <span className="mt-5 inline-flex items-center gap-5 text-[11px] font-extrabold">
                {copy.viewCaseStudy}
                <ArrowRight className="size-4 text-brand" aria-hidden />
              </span>
              <span
                className="absolute inset-y-0 right-0 w-[3px] rounded-r-[7px] bg-brand"
                aria-hidden
              />
            </button>
          </Reveal>
        </Container>
      </section>

      <ProjectsStatsSection stats={copy.stats} ariaLabel={copy.statsLabel} />

      <section
        id="projects"
        className="bg-background py-[48px] md:py-[56px]"
        aria-labelledby="selected-projects"
      >
        <Container size="wide">
          <Reveal className="mb-4 flex min-w-0 flex-col items-stretch gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h2
                id="selected-projects"
                className="text-[22px] font-extrabold leading-none text-foreground"
              >
                {copy.selectedTitle}
              </h2>
              <div
                ref={filterTrackRef}
                className="group/filters relative mt-4 flex w-full max-w-full items-center gap-7 overflow-x-auto pb-2 sm:gap-9 md:gap-10"
                role="group"
                aria-label={copy.filtersLabel}
                onScroll={updateFilterIndicator}
              >
                <span
                  className="pointer-events-none absolute bottom-0 h-[2px] bg-brand transition-[left,width,opacity] duration-300 group-hover/filters:opacity-0 [transition-timing-function:var(--ease-smooth)]"
                  style={filterIndicatorStyle}
                  aria-hidden
                />
                {copy.filters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    ref={(node) => {
                      filterButtonRefs.current[filter.key] = node;
                    }}
                    className={cn(
                      "group/filterButton relative whitespace-nowrap py-1 text-[16px] font-extrabold leading-none text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand md:text-[17px]",
                      activeFilter === filter.key && "text-brand",
                    )}
                    aria-pressed={activeFilter === filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                  >
                    {filter.label}
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full origin-left bg-brand transition-transform duration-300 group-hover/filterButton:scale-x-100 group-focus-visible/filterButton:scale-x-100 [transition-timing-function:var(--ease-smooth)]",
                        activeFilter === filter.key
                          ? "scale-x-100 group-hover/filters:scale-x-0 group-hover/filterButton:scale-x-100 group-focus-visible/filterButton:scale-x-100"
                          : "scale-x-0",
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="relative mb-1 block md:w-[300px] lg:w-[340px]">
              <span className="sr-only">{copy.searchLabel}</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-9 w-full rounded-[4px] border border-transparent bg-muted pl-9 pr-4 text-[13px] font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-brand/40 focus:bg-white focus:shadow-[0_10px_26px_rgba(0,0,0,0.06)]"
              />
            </label>
          </Reveal>

          {visibleProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleProjects.map((project, index) => (
                <Reveal
                  key={project.id}
                  delay={(index % 2) * 0.06}
                >
                  <ProjectCard
                    project={project}
                    onOpen={openProject}
                    ctaLabel={copy.viewCaseStudy}
                    openDetailsLabel={copy.cardOpenDetails}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="rounded-[7px] border border-border bg-white px-5 py-12 text-center text-[14px] font-medium text-muted-foreground">
              {copy.noResults}
            </Reveal>
          )}
        </Container>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[1000]"
          aria-hidden={dialogState === "closed"}
        >
          <button
            type="button"
            tabIndex={-1}
            className={cn(
              "absolute inset-0 cursor-default bg-black/55 backdrop-blur-[7px] transition-opacity duration-200 ease-out",
              backdropVisible ? "opacity-100" : "opacity-0",
            )}
            aria-label={copy.modal.close}
            onClick={closeProject}
          />

          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            tabIndex={-1}
            style={panelStyle}
            className={cn(
              "fixed transform-gpu overflow-hidden bg-white shadow-[0_34px_110px_rgba(0,0,0,0.26)] outline-none transition-[opacity,transform] duration-300 ease-out will-change-transform",
              panelVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-[0.975] opacity-0",
            )}
          >
            <button
              type="button"
              className={cn(
                "absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-border bg-white/95 text-foreground transition duration-200 hover:rotate-6 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand/30",
                contentVisible ? "opacity-100" : "opacity-0",
              )}
              aria-label={copy.modal.close}
              onClick={closeProject}
            >
              <X className="size-4" aria-hidden />
            </button>

            <div
              className={cn(
                "grid h-full md:grid-cols-[46%_54%]",
                !contentVisible && "pointer-events-none",
              )}
            >
              <div className="relative min-h-[210px] overflow-hidden bg-muted md:min-h-0">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-contain p-7"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />
                <div className="absolute bottom-6 left-6 right-6 hidden text-white md:block">
                  <span className="text-[12px] font-extrabold uppercase tracking-wide">
                    {selectedProject.category}
                  </span>
                  <strong className="mt-2 block text-[26px] font-extrabold leading-tight">
                    {selectedProject.title}
                  </strong>
                </div>
              </div>

              <div
                data-project-dialog-scroll
                data-lenis-prevent
                className="min-h-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-9 md:py-10"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                  {selectedProject.category}
                </span>
                <h2
                  id="project-dialog-title"
                  className="mt-3 max-w-[500px] text-[34px] font-extrabold leading-[0.98] tracking-[-0.02em] text-foreground md:text-[48px]"
                >
                  {selectedProject.title}
                </h2>
                <p className="mt-4 max-w-[500px] text-[16px] font-medium leading-[1.45] text-muted-foreground md:text-[17px]">
                  {selectedProject.description}
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.modal.overview}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium leading-[1.65] text-muted-foreground">
                      {selectedProject.overview}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.modal.tags}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="mt-8 grid border border-border md:grid-cols-3">
                  {[
                    [copy.modal.area, selectedProject.category],
                    [copy.modal.focus, copy.modal.design],
                    [copy.modal.output, copy.modal.prototype],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={cn(
                        "p-4",
                        index < 2 && "border-b border-border md:border-b-0 md:border-r",
                      )}
                    >
                      <strong className="block text-[22px] font-extrabold leading-none text-brand">
                        {value}
                      </strong>
                      <span className="mt-2 block text-[11px] font-medium text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ProjectsStatsSection({
  stats,
  ariaLabel,
}: {
  stats: ProjectStat[];
  ariaLabel: string;
}) {
  return (
    <section className="bg-background py-[28px]" aria-label={ariaLabel}>
      <Container size="wide">
        <div className="grid border border-border bg-white sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              as="article"
              key={stat.label}
              delay={index * 0.05}
              className={cn(
                "group/stat relative grid min-h-[94px] transform-gpu grid-cols-[46px_1fr] items-center gap-4 bg-white px-5 py-4 transition-shadow duration-500 hover:z-10 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]",
                index < stats.length - 1 && "border-b border-border lg:border-b-0 lg:border-r",
              )}
            >
              <Image
                src={stat.icon}
                alt=""
                width={stat.width}
                height={stat.height}
                className="h-[42px] w-[46px] object-contain transition-transform duration-500 group-hover/stat:-translate-y-1 motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
              />
              <div>
                <strong className="block text-[25px] font-extrabold leading-none text-foreground">
                  {stat.value}
                </strong>
                <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
  ctaLabel,
  openDetailsLabel,
}: {
  project: Project;
  onOpen: (project: Project) => void;
  ctaLabel: string;
  openDetailsLabel: string;
}) {
  return (
    <article
      data-project-origin
      className="group overflow-hidden rounded-[7px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(0,0,0,0.07)]"
    >
      <button
        type="button"
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        aria-haspopup="dialog"
        aria-label={`${openDetailsLabel}: ${project.title}`}
        onClick={() => onOpen(project)}
      >
        <span className="relative block h-[220px] overflow-hidden bg-muted">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <span
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-foreground/80 text-white transition-colors duration-300 group-hover:bg-brand"
            aria-hidden
          >
            <ArrowUpRight className="size-4" />
          </span>
        </span>

        <span className="flex min-h-[150px] flex-col px-5 pb-5 pt-5">
          <span className="text-[11px] font-extrabold text-brand">
            {project.category}
          </span>
          <strong className="mt-2 text-[19px] font-extrabold leading-tight text-foreground">
            {project.title}
          </strong>
          <span className="mt-2 text-[13px] font-medium leading-[1.4] text-muted-foreground">
            {project.description}
          </span>

          <span className="mt-auto flex items-end justify-between gap-4 pt-6">
            <span className="inline-flex items-center gap-5 text-[12px] font-extrabold text-foreground">
              {ctaLabel}
              <ArrowRight
                className="size-4 text-brand transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
            <span className="text-right text-[10px] font-medium text-muted-foreground">
              {project.tags.join(" ")}
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

export function ProjectsPageCta({ locale }: { locale: string }) {
  const copy = PROJECTS_COPY[resolveProjectsLocale(locale)].cta;
  const mailSubject = encodeURIComponent(copy.subject);

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border bg-white py-16 md:min-h-[310px] md:py-20"
      aria-labelledby="projects-cta-title"
    >
      <Image
        src="/assets/project-page/cta-sketch.png"
        alt=""
        width={874}
        height={398}
        quality={100}
        sizes="(max-width: 1024px) 100vw, 700px"
        unoptimized
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[46vw] max-w-[700px] opacity-35 md:block"
      />

      <Container size="wide" className="relative z-10">
        <Reveal className="max-w-[590px]">
          <div className="flex items-center gap-3 text-[15px] font-medium text-muted-foreground">
            <span className="h-[2px] w-[26px] bg-brand" aria-hidden />
            {copy.eyebrow}
          </div>
          <h2
            id="projects-cta-title"
            className="domtek-text-shadow mt-8 text-[36px] font-extrabold leading-[1.05] text-foreground sm:text-[48px]"
          >
            <span className="text-brand">.</span>
            {copy.title}
            {" "}
            <span className="text-brand">?</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] font-medium leading-[1.35] text-muted-foreground">
            <strong className="font-extrabold">{copy.bodyStrong}</strong>{" "}
            {copy.body}
          </p>
          <a
            href={`mailto:info@domteknika.ch?subject=${mailSubject}`}
            className="mt-8 inline-flex h-10 items-center justify-center gap-6 rounded-[7px] bg-brand px-5 text-[14px] font-extrabold text-white shadow-[0_4px_10px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/35"
          >
            {copy.button}
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
