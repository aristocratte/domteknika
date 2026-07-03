"use client";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  PATENTS,
  PATENT_STATS,
  type PatentAsset,
  type PatentDetail,
  type PatentFilterKey,
  type PatentRecord,
  type PatentReferenceRow,
  type PatentSourceLinks,
} from "@/data/patents";

type PatentLocale = "en" | "fr";
type FilterKey = "all" | PatentFilterKey;
type PatentItem = PatentRecord;

type PanelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: string;
};

type PatentStat = {
  icon: string;
  width: number;
  height: number;
  value: string;
  label: string;
};

type PatentFilterOption = {
  key: FilterKey;
  label: string;
  count?: string;
  icon?: string;
  width?: number;
  height?: number;
};

const ASSET_BASE = "/assets/patent-page";

const MODAL_TRANSITION_MS = 320;
const MODAL_CLOSE_FALLBACK_MS = 360;

function centeredPatentPanelRect(): PanelRect {
  const isMobile = window.innerWidth <= 640;
  const pad = isMobile ? 12 : 24;
  const width = Math.min(1180, window.innerWidth - pad * 2);
  const height = Math.min(780, window.innerHeight - pad * 2);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
    radius: isMobile ? "16px" : "22px",
  };
}

const STATS: Record<PatentLocale, PatentStat[]> = {
  en: [
    {
      icon: `${ASSET_BASE}/icon-patent.png`,
      width: 26,
      height: 42,
      value: String(PATENT_STATS.total),
      label: "Patents verified",
    },
    {
      icon: `${ASSET_BASE}/icon-industries.png`,
      width: 43,
      height: 45,
      value: String(PATENT_STATS.categories),
      label: "Core industries",
    },
    {
      icon: `${ASSET_BASE}/icon-calendar.png`,
      width: 49,
      height: 47,
      value: `Since ${PATENT_STATS.since}`,
      label: "+50 Years of innovation",
    },
  ],
  fr: [
    {
      icon: `${ASSET_BASE}/icon-patent.png`,
      width: 26,
      height: 42,
      value: String(PATENT_STATS.total),
      label: "Brevets vérifiés",
    },
    {
      icon: `${ASSET_BASE}/icon-industries.png`,
      width: 43,
      height: 45,
      value: String(PATENT_STATS.categories),
      label: "Industries clés",
    },
    {
      icon: `${ASSET_BASE}/icon-calendar.png`,
      width: 49,
      height: 47,
      value: `Depuis ${PATENT_STATS.since}`,
      label: "+50 ans d'innovation",
    },
  ],
};

const FILTERS: Record<PatentLocale, PatentFilterOption[]> = {
  en: [
    { key: "all", label: "All" },
    {
      key: "mobility",
      label: "Mobility",
      icon: `${ASSET_BASE}/icon-mobility.png`,
      width: 28,
      height: 25,
    },
    {
      key: "industrial",
      label: "Industrial",
      icon: `${ASSET_BASE}/icon-industrial.png`,
      width: 30,
      height: 32,
    },
    {
      key: "medical",
      label: "Medical",
      icon: `${ASSET_BASE}/icon-medical.png`,
      width: 39,
      height: 34,
    },
    {
      key: "energy",
      label: "Energy",
      icon: `${ASSET_BASE}/icon-energy.png`,
      width: 23,
      height: 35,
    },
    {
      key: "materials",
      label: "Materials",
      icon: `${ASSET_BASE}/icon-materials.png`,
      width: 34,
      height: 33,
    },
    {
      key: "digital",
      label: "Digital",
      icon: `${ASSET_BASE}/icon-digital.png`,
      width: 37,
      height: 35,
    },
  ],
  fr: [
    { key: "all", label: "Tous" },
    {
      key: "mobility",
      label: "Mobilité",
      icon: `${ASSET_BASE}/icon-mobility.png`,
      width: 28,
      height: 25,
    },
    {
      key: "industrial",
      label: "Industrie",
      icon: `${ASSET_BASE}/icon-industrial.png`,
      width: 30,
      height: 32,
    },
    {
      key: "medical",
      label: "Médical",
      icon: `${ASSET_BASE}/icon-medical.png`,
      width: 39,
      height: 34,
    },
    {
      key: "energy",
      label: "Énergie",
      icon: `${ASSET_BASE}/icon-energy.png`,
      width: 23,
      height: 35,
    },
    {
      key: "materials",
      label: "Matériaux",
      icon: `${ASSET_BASE}/icon-materials.png`,
      width: 34,
      height: 33,
    },
    {
      key: "digital",
      label: "Digital",
      icon: `${ASSET_BASE}/icon-digital.png`,
      width: 37,
      height: 35,
    },
  ],
};

const CARD_ICON: Record<PatentFilterKey, { src: string; width: number; height: number }> = {
  mobility: { src: `${ASSET_BASE}/icon-mobility.png`, width: 28, height: 25 },
  industrial: { src: `${ASSET_BASE}/icon-industrial.png`, width: 30, height: 32 },
  medical: { src: `${ASSET_BASE}/icon-medical.png`, width: 39, height: 34 },
  energy: { src: `${ASSET_BASE}/icon-energy.png`, width: 23, height: 35 },
  materials: { src: `${ASSET_BASE}/icon-materials.png`, width: 34, height: 33 },
  digital: { src: `${ASSET_BASE}/icon-digital.png`, width: 37, height: 35 },
};
const COPY: Record<
  PatentLocale,
  {
    hero: {
      eyebrow: string;
      title: string;
      leadOne: string;
      leadTwo: string;
    };
    archiveTitle: string;
    filtersLabel: string;
    noResults: string;
    searchPlaceholder: string;
    resultsLabel: string;
    deposited: string;
    details: {
      close: string;
      eyebrow: string;
      overview: string;
      tags: string;
      category: string;
      publication: string;
      publicationDate: string;
      priorityDate: string;
      inventors: string;
      applicants: string;
      application: string;
      classification: string;
      alsoPublishedAs: string;
      images: string;
      openDrawing: string;
      closeDrawing: string;
      previousDrawing: string;
      nextDrawing: string;
      vectorPdf: string;
      sourceLinks: string;
      downloadPdfs: string;
      fullDescription: string;
      claims: string;
      legalStatus: string;
      family: string;
      cited: string;
      citing: string;
      loading: string;
      unavailable: string;
    };
    card: {
      openDetails: string;
    };
    cta: {
      eyebrow: string;
      titlePrefix: string;
      title: string;
      titleQuestion: string;
      body: string;
      button: string;
    };
  }
> = {
  en: {
    hero: {
      eyebrow: "Our innovation, protected",
      title: "Patents",
      leadOne:
        "Our patent portfolio reflects years of research, engineering excellence and a commitment to solving complex challenges.",
      leadTwo:
        "Explore our protected innovations shaping the future across multiple industries.",
    },
    archiveTitle: "Innovation archive",
    filtersLabel: "Filter patents",
    noResults: "No patents match this category.",
    searchPlaceholder: "Search title, inventor, applicant, publication...",
    resultsLabel: "patents shown",
    deposited: "Published:",
    details: {
      close: "Close patent details",
      eyebrow: "Protected innovation",
      overview: "Patent overview",
      tags: "Patent tags",
      category: "Category",
      publication: "Publication",
      publicationDate: "Publication date",
      priorityDate: "Priority date",
      inventors: "Inventors",
      applicants: "Applicants",
      application: "Application",
      classification: "Classification",
      alsoPublishedAs: "Also published as",
      images: "Drawings",
      openDrawing: "Open drawing",
      closeDrawing: "Close drawing",
      previousDrawing: "Previous drawing",
      nextDrawing: "Next drawing",
      vectorPdf: "Vector PDF",
      sourceLinks: "Espacenet source",
      downloadPdfs: "Download PDFs",
      fullDescription: "Full description",
      claims: "Claims",
      legalStatus: "Legal status",
      family: "INPADOC family",
      cited: "Cited documents",
      citing: "Citing documents",
      loading: "Loading verified patent record...",
      unavailable: "No local text available for this section.",
    },
    card: {
      openDetails: "Open patent details",
    },
    cta: {
      eyebrow: "Let's build together",
      titlePrefix: ".",
      title: "Anything we can build for you",
      titleQuestion: "?",
      body: "We partner with forward-thinking companies to turn complex challenges into smart, manufacturable solutions.",
      button: "Start your project",
    },
  },
  fr: {
    hero: {
      eyebrow: "Notre innovation, protégée",
      title: "Brevets",
      leadOne:
        "Notre portefeuille de brevets reflète des années de recherche, d'excellence en ingénierie et d'engagement à résoudre des défis complexes.",
      leadTwo:
        "Découvrez nos innovations protégées qui façonnent l'avenir dans de multiples industries.",
    },
    archiveTitle: "Archive d'innovation",
    filtersLabel: "Filtrer les brevets",
    noResults: "Aucun brevet ne correspond à cette catégorie.",
    searchPlaceholder: "Rechercher titre, inventeur, demandeur, publication...",
    resultsLabel: "brevets affichés",
    deposited: "Publié:",
    details: {
      close: "Fermer le détail du brevet",
      eyebrow: "Innovation protégée",
      overview: "Vue du brevet",
      tags: "Tags du brevet",
      category: "Catégorie",
      publication: "Publication",
      publicationDate: "Date de publication",
      priorityDate: "Date de priorité",
      inventors: "Inventeurs",
      applicants: "Demandeurs",
      application: "Demande",
      classification: "Classification",
      alsoPublishedAs: "Également publié",
      images: "Dessins",
      openDrawing: "Ouvrir le dessin",
      closeDrawing: "Fermer le dessin",
      previousDrawing: "Dessin précédent",
      nextDrawing: "Dessin suivant",
      vectorPdf: "PDF vectoriel",
      sourceLinks: "Source Espacenet",
      downloadPdfs: "Télécharger les PDF",
      fullDescription: "Description complète",
      claims: "Revendications",
      legalStatus: "Situation juridique",
      family: "Famille INPADOC",
      cited: "Documents cités",
      citing: "Documents citant",
      loading: "Chargement de la fiche brevet vérifiée...",
      unavailable: "Aucun texte local disponible pour cette section.",
    },
    card: {
      openDetails: "Ouvrir le détail du brevet",
    },
    cta: {
      eyebrow: "Construisons ensemble",
      titlePrefix: ".",
      title: "Un projet que nous pouvons réaliser pour vous",
      titleQuestion: "?",
      body: "Nous accompagnons les entreprises visionnaires pour transformer des défis complexes en solutions intelligentes et fabricables.",
      button: "Démarrer votre projet",
    },
  },
};

function resolveLocale(locale: string): PatentLocale {
  return locale === "fr" ? "fr" : "en";
}

function getPatentCategoryLabel(
  filter: Exclude<FilterKey, "all">,
  locale: PatentLocale,
) {
  return FILTERS[locale].find((item) => item.key === filter)?.label ?? filter;
}

function getFilterCount(filter: FilterKey) {
  if (filter === "all") return PATENTS.length;
  return PATENT_STATS.byCategory[filter] ?? 0;
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function patentMatchesSearch(patent: PatentItem, query: string) {
  if (!query) return true;

  return normalizeSearch(
    [
      patent.title,
      patent.id,
      patent.publication,
      patent.inventors,
      patent.applicants,
    ].join(" "),
  ).includes(query);
}

export function PatentPageContent({ locale }: { locale: string }) {
  const resolvedLocale = resolveLocale(locale);
  const copy = COPY[resolvedLocale];
  const stats = STATS[resolvedLocale];
  const filters = FILTERS[resolvedLocale];
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatent, setSelectedPatent] = useState<PatentItem | null>(null);
  const [selectedPatentDetails, setSelectedPatentDetails] =
    useState<PatentDetail | null>(null);
  const [detailError, setDetailError] = useState(false);
  const [dialogState, setDialogState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const [activeDrawingIndex, setActiveDrawingIndex] = useState<number | null>(null);
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef(0);

  const normalizedSearchTerm = useMemo(
    () => normalizeSearch(searchTerm),
    [searchTerm],
  );

  const visiblePatents = useMemo(() => {
    return PATENTS.filter((patent) => {
      const matchesFilter = activeFilter === "all" || patent.filter === activeFilter;
      return matchesFilter && patentMatchesSearch(patent, normalizedSearchTerm);
    });
  }, [activeFilter, normalizedSearchTerm]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimer();
    setSelectedPatent(null);
    setPanelRect(null);
    setActiveDrawingIndex(null);
    setDialogState("closed");
    previousFocusRef.current?.focus?.({ preventScroll: true });
    previousFocusRef.current = null;
  }, [clearCloseTimer]);

  const openPatent = useCallback(
    (patent: PatentItem) => {
      clearCloseTimer();
      lockedScrollYRef.current = window.scrollY;
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setSelectedPatent(patent);
      setSelectedPatentDetails(null);
      setDetailError(false);
      setActiveDrawingIndex(null);
      setPanelRect(centeredPatentPanelRect());
      setDialogState("opening");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setDialogState("open");
        });
      });
    },
    [clearCloseTimer],
  );

  const closePatent = useCallback(() => {
    if (!selectedPatent || dialogState === "closing") return;

    clearCloseTimer();
    setActiveDrawingIndex(null);
    setDialogState("closing");

    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose, selectedPatent]);

  const closeDrawing = useCallback(() => {
    setActiveDrawingIndex(null);
  }, []);

  const showDrawing = useCallback((index: number) => {
    setActiveDrawingIndex(index);
  }, []);

  const cycleDrawing = useCallback(
    (direction: -1 | 1) => {
      setActiveDrawingIndex((current) => {
        const count = selectedPatent?.images.length ?? 0;
        if (!count) return null;
        const safeCurrent = current ?? 0;
        return (safeCurrent + direction + count) % count;
      });
    },
    [selectedPatent],
  );

  useEffect(() => {
    if (!selectedPatent) return;

    let cancelled = false;

    fetch(selectedPatent.detailPath)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${selectedPatent.detailPath}`);
        return response.json() as Promise<PatentDetail>;
      })
      .then((detail) => {
        if (!cancelled) setSelectedPatentDetails(detail);
      })
      .catch(() => {
        if (!cancelled) setDetailError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedPatent]);

  useEffect(() => {
    if (!selectedPatent) return;

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
          ? event.target.closest<HTMLElement>("[data-patent-dialog-scroll]")
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
      const restoreScrollY = lockedScrollYRef.current;
      window.scrollTo(window.scrollX, restoreScrollY);
      window.dispatchEvent(
        new CustomEvent("domtek:scroll-lock", {
          detail: { locked: false, scrollY: restoreScrollY },
        }),
      );
    };
  }, [selectedPatent]);

  useEffect(() => {
    if (dialogState !== "open") return;

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true });
    }, MODAL_TRANSITION_MS);

    return () => window.clearTimeout(focusTimer);
  }, [dialogState]);

  useEffect(() => {
    if (!selectedPatent) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (activeDrawingIndex !== null) {
        if (event.key === "Escape") {
          closeDrawing();
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          cycleDrawing(-1);
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          cycleDrawing(1);
          return;
        }
      }

      if (event.key === "Escape") {
        closePatent();
        return;
      }

      const focusRoot = modalRootRef.current ?? panelRef.current;
      if (event.key !== "Tab" || !focusRoot) return;

      const focusable = Array.from(
        focusRoot.querySelectorAll<HTMLElement>(
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
  }, [activeDrawingIndex, closeDrawing, closePatent, cycleDrawing, selectedPatent]);

  useEffect(() => {
    if (!selectedPatent || dialogState !== "open") return;

    const onResize = () => setPanelRect(centeredPatentPanelRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dialogState, selectedPatent]);

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
  const selectedPatentCategory = selectedPatent
    ? getPatentCategoryLabel(selectedPatent.filter, resolvedLocale)
    : "";
  return (
    <>
      <section
        className="relative min-h-[560px] overflow-hidden border-b border-border bg-background pt-[112px] md:min-h-[620px] md:pt-[126px]"
        aria-labelledby="patent-page-title"
      >
        <Image
          src={`${ASSET_BASE}/hero-sketch.png`}
          alt=""
          width={897}
          height={738}
          priority
          quality={100}
          unoptimized
          sizes="(max-width: 768px) 92vw, 800px"
          className="pointer-events-none absolute right-[-250px] top-[66px] z-0 hidden w-[61vw] max-w-[800px] opacity-[0.82] md:block lg:right-[-54px] xl:right-0"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white via-white/42 to-transparent" />

        <Container size="wide" className="relative z-10 grid min-h-[440px] items-start">
          <Reveal className="max-w-[515px] pt-3 md:pt-8">
            <div className="flex items-center gap-3 text-[13px] font-extrabold leading-none text-muted-foreground">
              <span className="h-[2px] w-[22px] bg-brand" aria-hidden />
              {copy.hero.eyebrow}
            </div>
            <h1
              id="patent-page-title"
              className="domtek-text-shadow mt-9 text-[48px] font-extrabold leading-none text-foreground sm:text-[64px] md:text-[68px]"
            >
              {copy.hero.title}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-10 max-w-[430px] text-[15px] font-medium leading-[1.15] text-muted-foreground sm:text-[16px]">
              {copy.hero.leadOne}
            </p>
            <p className="mt-5 max-w-[430px] text-[15px] font-medium leading-[1.15] text-muted-foreground sm:text-[16px]">
              {copy.hero.leadTwo}
            </p>
          </Reveal>

          <PatentStatsBar stats={stats} />
        </Container>
      </section>

      <section
        className="bg-background py-[48px] md:py-[58px]"
        aria-labelledby="patent-archive-title"
      >
        <Container size="wide">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2
                  id="patent-archive-title"
                  className="text-[22px] font-extrabold leading-none text-foreground"
                >
                  {copy.archiveTitle}
                </h2>
                <p className="mt-3 text-[12px] font-medium text-muted-foreground">
                  {visiblePatents.length} / {PATENTS.length} {copy.resultsLabel}
                </p>
              </div>
              <label className="relative block w-full max-w-[360px]">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="h-11 w-full rounded-[4px] border border-border bg-white pl-11 pr-4 text-[13px] font-medium text-foreground outline-none shadow-[0_2px_7px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/75 focus:border-brand/50 focus:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                  type="search"
                />
              </label>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-7" as="div">
            <div
              className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[82px_repeat(6,minmax(0,1fr))]"
              role="group"
              aria-label={copy.filtersLabel}
            >
              {filters.map((filter) => {
                const active = activeFilter === filter.key;
                const count = getFilterCount(filter.key);
                return (
                  <button
                    key={filter.key}
                    type="button"
                    className={cn(
                      "group/filter grid h-[48px] min-w-0 items-center gap-3 rounded-[4px] border border-border bg-white px-4 text-left shadow-[0_2px_6px_rgba(0,0,0,0.05)] outline-none transition-[translate,background-color,border-color,box-shadow,color] duration-500 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_12px_26px_rgba(0,0,0,0.09)] focus-visible:ring-2 focus-visible:ring-brand/35 [transition-timing-function:var(--ease-smooth)]",
                      filter.icon
                        ? "grid-cols-[auto_1fr]"
                        : "place-items-center text-center",
                      active &&
                        "border-brand bg-brand text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_12px_26px_rgba(0,0,0,0.18)]",
                    )}
                    aria-pressed={active}
                    onClick={() => setActiveFilter(filter.key)}
                  >
                    {filter.icon && (
                      <Image
                        src={filter.icon}
                        alt=""
                        width={filter.width}
                        height={filter.height}
                        unoptimized
                        className={cn(
                          "object-contain transition-[filter,transform] duration-500 group-hover/filter:-translate-y-0.5 group-hover/filter:scale-105 [transition-timing-function:var(--ease-smooth)]",
                          active && "brightness-0 invert",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "grid min-w-0",
                        !filter.icon && "place-items-center text-center",
                      )}
                    >
                      <strong className="text-[12px] font-extrabold leading-none">
                        {filter.label}
                      </strong>
                      {filter.key !== "all" && (
                        <span
                          className={cn(
                            "mt-1 text-[9px] font-medium leading-none text-muted-foreground",
                            active && "text-white/85",
                          )}
                        >
                          {count} {resolvedLocale === "fr" ? "brevets" : "patents"}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {visiblePatents.length > 0 ? (
            <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {visiblePatents.map((patent, index) => (
                <Reveal key={patent.id} delay={(index % 3) * 0.04}>
                  <PatentCard
                    patent={patent}
                    depositedLabel={copy.deposited}
                    openDetailsLabel={copy.card.openDetails}
                    onOpen={openPatent}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mt-8 rounded-[5px] border border-border bg-white px-5 py-10 text-center text-[14px] font-medium text-muted-foreground">
              {copy.noResults}
            </Reveal>
          )}
        </Container>
      </section>

      {selectedPatent && (
        <div
          ref={modalRootRef}
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
            aria-label={copy.details.close}
            onClick={closePatent}
          />

          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="patent-dialog-title"
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
              aria-label={copy.details.close}
              onClick={closePatent}
            >
              <X className="size-4" aria-hidden />
            </button>

            <div
              className={cn(
                "grid h-full md:grid-cols-[44%_56%]",
                !contentVisible && "pointer-events-none",
              )}
            >
              <div className="relative min-h-[240px] overflow-hidden bg-[#f7f7f7] md:min-h-0">
                {selectedPatent.coverImage ? (
                  <Image
                    src={selectedPatent.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    quality={100}
                    unoptimized
                    className="object-contain object-center p-5 md:p-8"
                  />
                ) : (
                  <Image
                    src={`${ASSET_BASE}/hero-sketch.png`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 390px"
                    quality={100}
                    unoptimized
                    className="object-cover object-center opacity-20"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-black/50" />
                <div className="absolute left-6 top-6 grid size-12 place-items-center rounded-[6px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                  <Image
                    src={CARD_ICON[selectedPatent.filter].src}
                    alt=""
                    width={CARD_ICON[selectedPatent.filter].width}
                    height={CARD_ICON[selectedPatent.filter].height}
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                    {selectedPatentCategory}
                  </span>
                  <strong className="mt-2 block max-w-[360px] text-[25px] font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                    {selectedPatent.publication}
                  </strong>
                </div>
              </div>

              <div
                data-patent-dialog-scroll
                data-lenis-prevent
                className="min-w-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-10 md:py-10 lg:px-12"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                  {copy.details.eyebrow}
                </span>
                <h2
                  id="patent-dialog-title"
                  className="mt-3 max-w-[680px] break-words text-[27px] font-extrabold leading-[1.04] text-foreground md:text-[34px] lg:text-[36px]"
                >
                  {selectedPatent.title}
                </h2>
                <p className="mt-4 max-w-[680px] text-[14px] font-medium leading-[1.55] text-muted-foreground md:text-[15px]">
                  {selectedPatent.abstract || copy.details.unavailable}
                </p>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.details.overview}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium leading-[1.65] text-muted-foreground">
                      {selectedPatent.abstract || copy.details.unavailable}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.details.tags}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[selectedPatentCategory, ...selectedPatent.tags].map((tag) => (
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

                <div className="mt-8 grid border border-border sm:grid-cols-2">
                  <PatentFact label={copy.details.publication} value={selectedPatent.publication} />
                  <PatentFact label={copy.details.publicationDate} value={selectedPatent.date} />
                  <PatentFact label={copy.details.priorityDate} value={selectedPatent.priorityDate} />
                  <PatentFact label={copy.details.category} value={selectedPatentCategory} />
                  <PatentFact label={copy.details.inventors} value={selectedPatent.inventors} wide />
                  <PatentFact label={copy.details.applicants} value={selectedPatent.applicants} wide />
                  <PatentFact label={copy.details.application} value={selectedPatent.applicationNumber} wide />
                  <PatentFact label={copy.details.classification} value={selectedPatent.classification} wide />
                  <PatentFact label={copy.details.alsoPublishedAs} value={selectedPatent.alsoPublishedAs} wide />
                </div>

                {selectedPatent.images.length > 0 && (
                  <PatentDrawingGallery
                    title={copy.details.images}
                    images={selectedPatent.images}
                    copy={copy.details}
                    onOpen={showDrawing}
                  />
                )}

                <section className="mt-8 grid gap-3 sm:grid-cols-2">
                  <PatentLinkGroup title={copy.details.sourceLinks} links={selectedPatent.links} />
                  <PatentPdfGroup title={copy.details.downloadPdfs} pdfs={selectedPatent.pdfs} />
                </section>

                <section className="mt-8 grid gap-4">
                  {detailError ? (
                    <p className="rounded-[4px] border border-border bg-muted px-4 py-3 text-[13px] font-medium text-muted-foreground">
                      {copy.details.unavailable}
                    </p>
                  ) : selectedPatentDetails ? (
                    <PatentDetailSections
                      copy={copy.details}
                      detail={selectedPatentDetails}
                    />
                  ) : (
                    <p className="rounded-[4px] border border-border bg-muted px-4 py-3 text-[13px] font-medium text-muted-foreground">
                      {copy.details.loading}
                    </p>
                  )}
                </section>
              </div>
            </div>
          </section>
          {activeDrawingIndex !== null && selectedPatent.images[activeDrawingIndex] && (
            <PatentDrawingLightbox
              images={selectedPatent.images}
              activeIndex={activeDrawingIndex}
              copy={copy.details}
              onClose={closeDrawing}
              onPrevious={() => cycleDrawing(-1)}
              onNext={() => cycleDrawing(1)}
            />
          )}
        </div>
      )}
    </>
  );
}

function PatentStatsBar({ stats }: { stats: PatentStat[] }) {
  return (
    <Reveal
      delay={0.1}
      className="relative z-20 mx-auto mt-10 w-full max-w-[720px] md:absolute md:bottom-9 md:left-1/2 md:mt-0 md:-translate-x-1/2"
    >
      <div className="grid overflow-hidden rounded-[9px] border border-border/80 bg-white shadow-[0_7px_14px_rgba(0,0,0,0.20)] sm:grid-cols-3">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={cn(
              "group/stat grid min-h-[74px] grid-cols-[34px_1fr] items-center gap-3 px-5 py-3 transition-shadow duration-500 hover:z-10 hover:shadow-[0_18px_42px_rgba(0,0,0,0.08)] [transition-timing-function:var(--ease-smooth)]",
              index < stats.length - 1 && "border-b border-border sm:border-b-0 sm:border-r",
            )}
          >
            <span className="grid size-8 place-items-center transition-transform duration-500 group-hover/stat:-translate-y-1 [transition-timing-function:var(--ease-smooth)]">
              <Image
                src={stat.icon}
                alt=""
                width={stat.width}
                height={stat.height}
                unoptimized
                className="object-contain"
              />
            </span>
            <div className="min-w-0">
              <strong className="block text-[24px] font-extrabold leading-none text-foreground">
                {stat.value}
              </strong>
              <span className="mt-1 block text-[10px] font-extrabold leading-none text-foreground/80">
                {stat.label}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

function PatentFact({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  if (!value) return null;

  return (
    <div
      className={cn(
        "border-b border-border p-4 last:border-b-0 sm:border-r sm:[&:nth-child(even)]:border-r-0",
        wide && "sm:col-span-2 sm:border-r-0",
      )}
    >
      <strong className="block text-[13px] font-extrabold leading-tight text-foreground">
        {value}
      </strong>
      <span className="mt-2 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function PatentLinkGroup({
  title,
  links,
}: {
  title: string;
  links: PatentSourceLinks;
}) {
  const entries = [
    ["Biblio", links.biblio],
    ["Description", links.description],
    ["Claims", links.claims],
    ["Mosaics", links.mosaics],
    ["Original", links.originalDocument],
    ["Legal", links.legalStatus],
    ["Family", links.inpadocFamily],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (!entries.length) return null;

  return (
    <div className="rounded-[4px] border border-border p-4">
      <h3 className="text-[12px] font-extrabold uppercase tracking-wide">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {entries.map(([label, href]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-full bg-muted px-3 text-[11px] font-extrabold text-foreground transition-colors hover:bg-brand hover:text-white"
          >
            {label}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

function PatentPdfGroup({
  title,
  pdfs,
}: {
  title: string;
  pdfs: PatentAsset[];
}) {
  if (!pdfs.length) return null;

  return (
    <div className="rounded-[4px] border border-border p-4">
      <h3 className="text-[12px] font-extrabold uppercase tracking-wide">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {pdfs.slice(0, 8).map((pdf, index) => (
          <a
            key={pdf.href}
            href={pdf.href}
            download
            className="inline-flex h-8 items-center gap-2 rounded-full bg-muted px-3 text-[11px] font-extrabold text-foreground transition-colors hover:bg-brand hover:text-white"
          >
            PDF {index + 1}
            <Download className="size-3" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

function PatentDetailSections({
  copy,
  detail,
}: {
  copy: (typeof COPY)["en"]["details"];
  detail: PatentDetail;
}) {
  return (
    <>
      <PatentTextSection
        title={copy.fullDescription}
        paragraphs={detail.descriptionParagraphs}
        fallback={copy.unavailable}
        defaultOpen
      />
      <PatentClaimsSection
        title={copy.claims}
        claims={detail.claims}
        fallback={copy.unavailable}
      />
      <PatentLegalSection
        title={copy.legalStatus}
        events={detail.legalEvents}
        fallback={copy.unavailable}
      />
      <PatentReferenceSection
        title={copy.family}
        rows={detail.familyRows}
        fallback={copy.unavailable}
        defaultOpen
      />
      <PatentReferenceSection
        title={copy.cited}
        rows={detail.citedRows}
        fallback={copy.unavailable}
      />
      <PatentReferenceSection
        title={copy.citing}
        rows={detail.citingRows}
        fallback={copy.unavailable}
      />
    </>
  );
}

function PatentSectionShell({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-[5px] border border-border bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide text-foreground marker:hidden">
        {title}
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[15px] leading-none text-brand transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-border px-5 py-5">{children}</div>
    </details>
  );
}

function PatentTextSection({
  title,
  paragraphs,
  fallback,
  defaultOpen = false,
}: {
  title: string;
  paragraphs: string[];
  fallback: string;
  defaultOpen?: boolean;
}) {
  return (
    <PatentSectionShell title={title} defaultOpen={defaultOpen}>
      {paragraphs.length ? (
        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2 text-[13px] font-medium leading-[1.65] text-muted-foreground">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 28)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <PatentEmptyText>{fallback}</PatentEmptyText>
      )}
    </PatentSectionShell>
  );
}

function PatentClaimsSection({
  title,
  claims,
  fallback,
}: {
  title: string;
  claims: string[];
  fallback: string;
}) {
  return (
    <PatentSectionShell title={title}>
      {claims.length ? (
        <div className="max-h-[360px] space-y-2 overflow-y-auto pr-2">
          {claims.map((claim, index) => (
            <p
              key={`${claim.slice(0, 28)}-${index}`}
              className="rounded-[4px] bg-muted px-4 py-3 text-[12px] font-medium leading-[1.55] text-muted-foreground"
            >
              {claim}
            </p>
          ))}
        </div>
      ) : (
        <PatentEmptyText>{fallback}</PatentEmptyText>
      )}
    </PatentSectionShell>
  );
}

function PatentLegalSection({
  title,
  events,
  fallback,
}: {
  title: string;
  events: string[];
  fallback: string;
}) {
  return (
    <PatentSectionShell title={title}>
      {events.length ? (
        <div className="grid gap-3">
          {events.map((event, index) => {
            const [headline, ...details] = event.split("\n").filter(Boolean);
            return (
              <article
                key={`${headline}-${index}`}
                className="rounded-[4px] border border-border bg-muted/45 px-4 py-3"
              >
                <strong className="block text-[13px] font-extrabold leading-tight text-foreground">
                  {headline}
                </strong>
                {details.length > 0 && (
                  <p className="mt-2 whitespace-pre-line text-[12px] font-medium leading-[1.55] text-muted-foreground">
                    {details.join("\n")}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <PatentEmptyText>{fallback}</PatentEmptyText>
      )}
    </PatentSectionShell>
  );
}

function PatentReferenceSection({
  title,
  rows,
  fallback,
  defaultOpen = false,
}: {
  title: string;
  rows: PatentReferenceRow[];
  fallback: string;
  defaultOpen?: boolean;
}) {
  return (
    <PatentSectionShell title={title} defaultOpen={defaultOpen}>
      {rows.length ? (
        <div className="grid gap-3">
          {rows.map((row) => (
            <PatentReferenceCard key={`${row.idx}-${row.title}`} row={row} />
          ))}
        </div>
      ) : (
        <PatentEmptyText>{fallback}</PatentEmptyText>
      )}
    </PatentSectionShell>
  );
}

function PatentReferenceCard({ row }: { row: PatentReferenceRow }) {
  const entries = Object.entries(row.sections);

  return (
    <article className="rounded-[4px] border border-border bg-muted/35 p-4">
      <div className="flex items-start justify-between gap-4">
        <strong className="text-[13px] font-extrabold leading-tight text-foreground">
          {row.idx ? `${row.idx}. ` : ""}
          {row.title}
        </strong>
        {row.link && (
          <a
            href={row.link}
            target="_blank"
            rel="noreferrer"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-muted-foreground shadow-[0_3px_8px_rgba(0,0,0,0.08)] transition-colors hover:bg-brand hover:text-white"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            <span className="sr-only">Open patent source</span>
          </a>
        )}
      </div>
      {entries.length > 0 && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {entries.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-[9px] font-extrabold uppercase tracking-wide text-brand">
                {label}
              </dt>
              <dd className="mt-1 break-words text-[11px] font-medium leading-[1.45] text-muted-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function PatentEmptyText({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[4px] bg-muted px-4 py-3 text-[12px] font-medium text-muted-foreground">
      {children}
    </p>
  );
}

function PatentDrawingGallery({
  title,
  images,
  copy,
  onOpen,
}: {
  title: string;
  images: PatentAsset[];
  copy: (typeof COPY)["en"]["details"];
  onOpen: (index: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = images[activeIndex] ? activeIndex : 0;
  const activeImage = images[safeActiveIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const cycle = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  if (!activeImage) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
          {title}
        </h3>
        {hasMultiple && (
          <span className="text-[10px] font-extrabold text-muted-foreground">
            {safeActiveIndex + 1} / {images.length}
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px] border border-border bg-white">
          <button
            type="button"
            className="absolute inset-0 z-10"
            aria-label={`${copy.openDrawing} ${safeActiveIndex + 1}`}
            onClick={() => onOpen(safeActiveIndex)}
          />
          <Image
            src={activeImage.href}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            quality={100}
            unoptimized
            className="object-contain p-3 transition-transform duration-700 hover:scale-[1.025] [transition-timing-function:var(--ease-smooth)]"
          />
          {hasMultiple && (
            <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 justify-between">
              <button
                type="button"
                className="pointer-events-auto grid size-8 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white [transition-timing-function:var(--ease-smooth)]"
                aria-label={copy.previousDrawing}
                onClick={(event) => {
                  event.stopPropagation();
                  cycle(-1);
                }}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                className="pointer-events-auto grid size-8 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white [transition-timing-function:var(--ease-smooth)]"
                aria-label={copy.nextDrawing}
                onClick={(event) => {
                  event.stopPropagation();
                  cycle(1);
                }}
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>

        {hasMultiple && (
          <div className="grid max-h-[260px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {images.map((image, index) => (
              <button
                key={image.href}
                type="button"
                className={cn(
                  "relative aspect-[3/4] overflow-hidden rounded-[4px] border bg-white transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_10px_20px_rgba(0,0,0,0.10)] [transition-timing-function:var(--ease-smooth)]",
                  index === safeActiveIndex
                    ? "border-brand shadow-[0_9px_18px_rgba(0,0,0,0.12)]"
                    : "border-border",
                )}
                aria-label={`${copy.openDrawing} ${index + 1}`}
                aria-pressed={index === safeActiveIndex}
                onClick={() => setActiveIndex(index)}
                onDoubleClick={() => onOpen(index)}
              >
                <Image
                  src={image.href}
                  alt=""
                  fill
                  sizes="80px"
                  quality={100}
                  unoptimized
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeImage.pdfHref && (
        <a
          href={activeImage.pdfHref}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-8 items-center gap-2 rounded-full bg-muted px-3 text-[11px] font-extrabold text-foreground transition-colors duration-300 hover:bg-brand hover:text-white"
        >
          {copy.vectorPdf}
          <ExternalLink className="size-3" aria-hidden />
        </a>
      )}
    </section>
  );
}

function PatentDrawingLightbox({
  images,
  activeIndex,
  copy,
  onClose,
  onPrevious,
  onNext,
}: {
  images: PatentAsset[];
  activeIndex: number;
  copy: (typeof COPY)["en"]["details"];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const image = images[activeIndex];
  const hasMultiple = images.length > 1;

  if (!image) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/70 px-4 py-5 backdrop-blur-[4px]">
      <div className="relative h-full w-full max-w-[980px] overflow-hidden rounded-[12px] bg-white shadow-[0_26px_90px_rgba(0,0,0,0.32)]">
        <button
          type="button"
          className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-border bg-white text-foreground transition duration-300 hover:rotate-6 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand/30"
          aria-label={copy.closeDrawing}
          onClick={onClose}
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="absolute left-5 top-5 z-20 rounded-full bg-white/95 px-3 py-2 text-[11px] font-extrabold text-foreground shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
          {activeIndex + 1} / {images.length}
        </div>

        <div className="relative h-full bg-[#f8f8f8]">
          <Image
            src={image.href}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 980px"
            quality={100}
            unoptimized
            className="object-contain p-6 md:p-10"
          />
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              className="absolute left-5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand/30 [transition-timing-function:var(--ease-smooth)]"
              aria-label={copy.previousDrawing}
              onClick={onPrevious}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className="absolute right-5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand/30 [transition-timing-function:var(--ease-smooth)]"
              aria-label={copy.nextDrawing}
              onClick={onNext}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}

        {image.pdfHref && (
          <a
            href={image.pdfHref}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-5 left-1/2 z-20 inline-flex h-9 -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 text-[11px] font-extrabold text-foreground shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition-colors duration-300 hover:bg-brand hover:text-white"
          >
            {copy.vectorPdf}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}

function PatentCard({
  patent,
  depositedLabel,
  openDetailsLabel,
  onOpen,
}: {
  patent: PatentItem;
  depositedLabel: string;
  openDetailsLabel: string;
  onOpen: (patent: PatentItem) => void;
}) {
  const icon = CARD_ICON[patent.filter];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const safeActiveImageIndex = patent.images[activeImageIndex] ? activeImageIndex : 0;
  const activeImage = patent.images[safeActiveImageIndex] ?? patent.images[0];
  const hasMultipleImages = patent.images.length > 1;

  const cycleCardImage = (direction: -1 | 1) => {
    setActiveImageIndex((current) => {
      const count = patent.images.length;
      if (!count) return 0;
      return (current + direction + count) % count;
    });
  };

  return (
    <article className="group/patent relative z-0 flex h-[392px] w-full origin-center transform-gpu flex-col overflow-hidden rounded-[5px] border border-border bg-white text-left shadow-[0_4px_7px_rgba(0,0,0,0.18)] outline-none transition-[scale,box-shadow,border-color] duration-[1100ms] will-change-transform hover:z-10 hover:scale-[1.035] hover:border-brand/25 hover:shadow-[0_16px_34px_rgba(0,0,0,0.15)] focus-within:z-10 focus-within:scale-[1.035] focus-within:border-brand/25 focus-within:shadow-[0_16px_34px_rgba(0,0,0,0.15)] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]">
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
        aria-haspopup="dialog"
        aria-label={`${openDetailsLabel}: ${patent.id}`}
        onClick={() => onOpen(patent)}
      />

      <span className="relative block h-[126px] bg-[#f7f7f7]">
        {activeImage ? (
          <Image
            src={activeImage.href}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            quality={100}
            unoptimized
            className="object-contain p-4 transition-transform duration-700 group-hover/patent:scale-105 [transition-timing-function:var(--ease-smooth)]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <Image
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              unoptimized
              className="object-contain opacity-55"
            />
          </span>
        )}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="pointer-events-auto absolute left-3 top-1/2 z-30 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_6px_16px_rgba(0,0,0,0.13)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand/35 [transition-timing-function:var(--ease-smooth)]"
              aria-label="Previous drawing"
              onClick={(event) => {
                event.stopPropagation();
                cycleCardImage(-1);
              }}
            >
              <ChevronLeft className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              className="pointer-events-auto absolute right-3 top-1/2 z-30 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_6px_16px_rgba(0,0,0,0.13)] transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand/35 [transition-timing-function:var(--ease-smooth)]"
              aria-label="Next drawing"
              onClick={(event) => {
                event.stopPropagation();
                cycleCardImage(1);
              }}
            >
              <ChevronRight className="size-3.5" aria-hidden />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-extrabold text-muted-foreground shadow-[0_5px_12px_rgba(0,0,0,0.08)]">
              {safeActiveImageIndex + 1} / {patent.images.length}
            </span>
          </>
        )}
      </span>

      <span className="pointer-events-none relative z-20 flex flex-1 flex-col px-5 pb-4 pt-5">
        <span className="grid grid-cols-[28px_1fr_auto] items-start gap-4">
          <span className="grid size-7 place-items-center" aria-hidden>
            <Image
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              unoptimized
              className="object-contain transition-transform duration-500 group-hover/patent:scale-110 group-focus-within/patent:scale-110 [transition-timing-function:var(--ease-smooth)]"
            />
          </span>
          <span className="max-w-[270px] text-[15px] font-extrabold leading-none text-brand">
            {patent.publication}
            <span className="ml-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-brand" />
          </span>
          <ArrowUpRight
            className="size-[16px] text-muted-foreground transition-transform duration-500 group-hover/patent:translate-x-0.5 group-hover/patent:-translate-y-0.5 group-focus-within/patent:translate-x-0.5 group-focus-within/patent:-translate-y-0.5 [transition-timing-function:var(--ease-smooth)]"
            aria-hidden
          />
        </span>

        <span className="mt-5 max-w-[300px] overflow-hidden text-[14px] font-extrabold leading-[1.08] text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {patent.title}
        </span>
        <span className="mt-3 h-[68px] max-w-[310px] overflow-hidden text-[10px] font-medium leading-[1.35] text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
          {patent.abstract}
        </span>

        <span className="mt-auto block pt-5">
          <span className="mb-4 block border-t border-border" />
          <span className="flex items-end justify-between gap-5">
            <span className="flex h-[20px] min-w-0 flex-wrap gap-x-6 gap-y-2 overflow-hidden">
              {patent.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="flex max-w-[96px] items-center gap-3 truncate text-[7px] font-extrabold leading-none text-muted-foreground"
                >
                  {tag}
                  {index < patent.tags.length - 1 && (
                    <span className="size-1 rounded-full bg-brand" aria-hidden />
                  )}
                </span>
              ))}
            </span>
            <span className="shrink-0 text-[9px] font-medium leading-none text-muted-foreground">
              {depositedLabel} {patent.date}
            </span>
          </span>
        </span>
      </span>
    </article>
  );
}

export function PatentPageCta({ locale }: { locale: string }) {
  const copy = COPY[resolveLocale(locale)].cta;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white pb-[112px] pt-[72px] md:min-h-[430px] md:pb-[126px] md:pt-[86px]"
      aria-labelledby="patent-cta-title"
    >
      <Image
        src={`${ASSET_BASE}/cta-sketch.png`}
        alt=""
        width={665}
        height={415}
        quality={100}
        unoptimized
        sizes="(max-width: 1024px) 100vw, 620px"
        className="pointer-events-none absolute bottom-[70px] right-[6%] hidden w-[43vw] max-w-[620px] opacity-35 md:block"
      />

      <Container size="wide" className="relative z-10">
        <Reveal className="max-w-[620px] md:pl-[72px]">
          <div className="flex items-center gap-3 text-[13px] font-extrabold leading-none text-foreground">
            <span className="h-[3px] w-[34px] bg-brand" aria-hidden />
            {copy.eyebrow}
          </div>
          <h2
            id="patent-cta-title"
            className="domtek-text-shadow mt-10 text-[38px] font-extrabold leading-[1.02] text-foreground sm:text-[54px]"
          >
            <span className="text-brand">{copy.titlePrefix}</span>
            {copy.title}
            <span className="whitespace-nowrap text-brand">&nbsp;{copy.titleQuestion}</span>
          </h2>
          <p className="mt-8 max-w-[560px] text-[15px] font-medium leading-[1.35] text-muted-foreground sm:text-[16px]">
            {copy.body}
          </p>
          <Button
            nativeButton={false}
            className="mt-8 h-11 rounded-[4px] border-0 px-7 text-[14px] font-extrabold shadow-[0_4px_10px_rgba(0,0,0,0.28)] outline-none ring-0 transition-transform hover:-translate-y-0.5 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/35"
            render={<Link href="/contact" />}
          >
            {copy.button}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
