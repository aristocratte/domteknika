"use client";

import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import {
  type CSSProperties,
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

type PatentLocale = "en" | "fr";
type FilterKey =
  | "all"
  | "mobility"
  | "industrial"
  | "medical"
  | "energy"
  | "materials"
  | "digital";

type PatentItem = {
  id: string;
  filter: Exclude<FilterKey, "all">;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

type PanelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: string;
};

const ASSET_BASE = "/assets/patent-page";

const MODAL_TRANSITION_MS = 320;
const MODAL_CLOSE_FALLBACK_MS = 360;

function centeredPatentPanelRect(): PanelRect {
  const isMobile = window.innerWidth <= 640;
  const pad = isMobile ? 14 : 34;
  const width = Math.min(900, window.innerWidth - pad * 2);
  const height = Math.min(650, window.innerHeight - pad * 2);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
    radius: isMobile ? "16px" : "22px",
  };
}

const STATS = [
  {
    icon: `${ASSET_BASE}/icon-patent.png`,
    width: 26,
    height: 42,
    value: "48+",
    label: "Patents",
  },
  {
    icon: `${ASSET_BASE}/icon-industries.png`,
    width: 43,
    height: 45,
    value: "6",
    label: "Core industries",
  },
  {
    icon: `${ASSET_BASE}/icon-calendar.png`,
    width: 49,
    height: 47,
    value: "Since 1998",
    label: "+25 Years of innovation",
  },
] as const;

const FILTERS: Array<{
  key: FilterKey;
  label: string;
  count?: string;
  icon?: string;
  width?: number;
  height?: number;
}> = [
  { key: "all", label: "All" },
  {
    key: "mobility",
    label: "Mobility",
    count: "12 patents",
    icon: `${ASSET_BASE}/icon-mobility.png`,
    width: 28,
    height: 25,
  },
  {
    key: "industrial",
    label: "Industrial",
    count: "14 patents",
    icon: `${ASSET_BASE}/icon-industrial.png`,
    width: 30,
    height: 32,
  },
  {
    key: "medical",
    label: "Medical",
    count: "8 patents",
    icon: `${ASSET_BASE}/icon-medical.png`,
    width: 39,
    height: 34,
  },
  {
    key: "energy",
    label: "Energy",
    count: "6 patents",
    icon: `${ASSET_BASE}/icon-energy.png`,
    width: 23,
    height: 35,
  },
  {
    key: "materials",
    label: "Materials",
    count: "10 patents",
    icon: `${ASSET_BASE}/icon-materials.png`,
    width: 34,
    height: 33,
  },
  {
    key: "digital",
    label: "Digital",
    count: "5 patents",
    icon: `${ASSET_BASE}/icon-digital.png`,
    width: 37,
    height: 35,
  },
];

const CARD_ICON: Record<Exclude<FilterKey, "all">, { src: string; width: number; height: number }> =
  {
    mobility: { src: `${ASSET_BASE}/icon-mobility.png`, width: 28, height: 25 },
    industrial: { src: `${ASSET_BASE}/icon-industrial.png`, width: 30, height: 32 },
    medical: { src: `${ASSET_BASE}/icon-medical.png`, width: 39, height: 34 },
    energy: { src: `${ASSET_BASE}/icon-energy.png`, width: 23, height: 35 },
    materials: { src: `${ASSET_BASE}/icon-materials.png`, width: 34, height: 33 },
    digital: { src: `${ASSET_BASE}/icon-digital.png`, width: 37, height: 35 },
  };

const PATENT_SCOPE: Record<Exclude<FilterKey, "all">, string[]> = {
  mobility: [
    "Architecture mécanique pensée pour limiter les pertes par friction en mouvement.",
    "Protection des interfaces critiques exposées à des cycles répétés.",
    "Adaptation aux contraintes de mobilité, d'étanchéité et d'endurance.",
  ],
  industrial: [
    "Mécanisme de verrouillage et d'assemblage optimisé pour les cadences élevées.",
    "Réduction de l'usure sur les zones de contact polymère et métal.",
    "Compatibilité avec des environnements industriels répétitifs et exigeants.",
  ],
  medical: [
    "Géométrie fonctionnelle conçue pour améliorer le contrôle des flux.",
    "Optimisation des échanges thermiques dans des ensembles compacts.",
    "Approche biomimétique adaptable à des dispositifs techniques sensibles.",
  ],
  energy: [
    "Structure multicouche capable d'adapter sa réponse aux charges variables.",
    "Absorption d'énergie répartie sur des impacts répétés.",
    "Protection de composants soumis à des contraintes dynamiques fortes.",
  ],
  materials: [
    "Composition polymère fonctionnelle orientée durabilité et résistance.",
    "Protection de surfaces exposées aux microfissures et à l'usure.",
    "Optimisation matière pour prolonger la durée de vie des composants.",
  ],
  digital: [
    "Intégration discrète de capteurs dans des structures techniques.",
    "Suivi continu des contraintes et déformations en conditions d'usage.",
    "Interface compatible avec des systèmes de monitoring embarqués.",
  ],
};

const PATENTS: PatentItem[] = [
  {
    id: "CH-712345-A2",
    filter: "industrial",
    title: "Mécanisme de verrouillage polymère à friction réduite",
    description:
      "Système innovant permettant une réduction de 40% de l'usure dans les environnements industriels à haute cadence.",
    date: "12.04.2021",
    tags: ["Polymères", "Mécanisme", "Industrial"],
  },
  {
    id: "WO-2022-082295-A1",
    filter: "materials",
    title: "Revêtement polymère auto-réparant haute performance",
    description:
      "Revêtement fonctionnel capable de réparation autonome des microfissures pour prolonger la durée de vie des composants.",
    date: "17.05.2022",
    tags: ["Polymères", "Coating", "Durabilité"],
  },
  {
    id: "EP-3739166-B1",
    filter: "energy",
    title: "Système d'absorption d'énergie multicouche adaptatif",
    description:
      "Structure composite adaptative optimisant l'absorption d'énergie sous charges variables et impacts répétés.",
    date: "05.11.2019",
    tags: ["Aérospatiale", "Sécurité", "Automobile"],
  },
  {
    id: "US-2023-0146859-A1",
    filter: "mobility",
    title: "Dispositif d'étanchéité dynamique à faible friction",
    description:
      "Joint dynamique nouvelle génération réduisant les pertes par friction et améliorant la durée de vie des systèmes.",
    date: "22.02.2023",
    tags: ["Étanchéité", "Tribologie", "Efficience"],
  },
  {
    id: "PCT/IB2023/053321-A1",
    filter: "materials",
    title: "Matériau polymère biosourcé haute résistance",
    description:
      "Composition polymère biosourcée offrant une haute résistance mécanique et un impact environnemental réduit.",
    date: "19.05.2023",
    tags: ["Sustainability", "Bio-based", "Materials"],
  },
  {
    id: "JP-2021-194321-B2",
    filter: "industrial",
    title: "Système modulaire de fixation rapide sans outil",
    description:
      "Mécanisme modulaire permettant un assemblage et démontage rapide sans outil avec verrouillage sécurisé.",
    date: "03.03.2021",
    tags: ["Fixation", "Mécanique", "Modulaire"],
  },
  {
    id: "CN-2023-107654-B",
    filter: "digital",
    title: "Capteur flexible intégré pour structures intelligentes",
    description:
      "Capteur flexible et discret pour la surveillance continue des contraintes et déformations dans les structures.",
    date: "29.01.2023",
    tags: ["Sensors", "IoT", "Monitoring"],
  },
  {
    id: "EP-2020-2467890-A2",
    filter: "industrial",
    title: "Procédé de moulage par friction assistée pour polymères",
    description:
      "Procédé innovant combinant friction contrôlée et moulage pour améliorer la résistance mécanique des polymères.",
    date: "16.05.2020",
    tags: ["Manufacturing", "Polymers", "Process"],
  },
  {
    id: "US-2022-0032844-B2",
    filter: "medical",
    title: "Architecture de ventilation biomimétique optimisée",
    description:
      "Conception biomimétique améliorant les échanges thermiques et réduisant la consommation énergétique.",
    date: "08.04.2022",
    tags: ["Ventilation", "Biomimicry", "Energy"],
  },
];

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
    deposited: string;
    details: {
      close: string;
      eyebrow: string;
      overview: string;
      scope: string;
      tags: string;
      category: string;
      depositDate: string;
      status: string;
      statusValue: string;
      family: string;
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
    deposited: "Dépôt:",
    details: {
      close: "Close patent details",
      eyebrow: "Protected innovation",
      overview: "Patent overview",
      scope: "Protected scope",
      tags: "Patent tags",
      category: "Category",
      depositDate: "Filed",
      status: "Status",
      statusValue: "Protected",
      family: "Family",
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
    deposited: "Dépôt:",
    details: {
      close: "Fermer le détail du brevet",
      eyebrow: "Innovation protégée",
      overview: "Vue du brevet",
      scope: "Périmètre protégé",
      tags: "Tags du brevet",
      category: "Catégorie",
      depositDate: "Dépôt",
      status: "Statut",
      statusValue: "Protégé",
      family: "Famille",
    },
    cta: {
      eyebrow: "Construisons ensemble",
      titlePrefix: ".",
      title: "Anything we can build for you",
      titleQuestion: "?",
      body: "Nous accompagnons les entreprises visionnaires pour transformer des défis complexes en solutions intelligentes et fabricables.",
      button: "Start your project",
    },
  },
};

function resolveLocale(locale: string): PatentLocale {
  return locale === "fr" ? "fr" : "en";
}

function getPatentCategoryLabel(filter: Exclude<FilterKey, "all">) {
  return FILTERS.find((item) => item.key === filter)?.label ?? filter;
}

export function PatentPageContent({ locale }: { locale: string }) {
  const copy = COPY[resolveLocale(locale)];
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedPatent, setSelectedPatent] = useState<PatentItem | null>(null);
  const [dialogState, setDialogState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef(0);

  const visiblePatents = useMemo(() => {
    if (activeFilter === "all") return PATENTS;
    return PATENTS.filter((patent) => patent.filter === activeFilter);
  }, [activeFilter]);

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
    setDialogState("closing");

    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose, selectedPatent]);

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
      if (event.key === "Escape") {
        closePatent();
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
  }, [closePatent, selectedPatent]);

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
    ? getPatentCategoryLabel(selectedPatent.filter)
    : "";
  const selectedPatentScope = selectedPatent
    ? PATENT_SCOPE[selectedPatent.filter]
    : [];

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

          <PatentStatsBar />
        </Container>
      </section>

      <section
        className="bg-background py-[48px] md:py-[58px]"
        aria-labelledby="patent-archive-title"
      >
        <Container size="wide">
          <Reveal>
            <h2
              id="patent-archive-title"
              className="text-[22px] font-extrabold leading-none text-foreground"
            >
              {copy.archiveTitle}
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-7" as="div">
            <div
              className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[82px_repeat(6,minmax(0,1fr))]"
              role="group"
              aria-label={copy.filtersLabel}
            >
              {FILTERS.map((filter) => {
                const active = activeFilter === filter.key;
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
                          "h-[24px] w-[28px] object-contain transition-[filter,transform] duration-500 group-hover/filter:-translate-y-0.5 group-hover/filter:scale-105 [transition-timing-function:var(--ease-smooth)]",
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
                      {filter.count && (
                        <span
                          className={cn(
                            "mt-1 text-[9px] font-medium leading-none text-muted-foreground",
                            active && "text-white/85",
                          )}
                        >
                          {filter.count}
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
                "grid h-full md:grid-cols-[42%_58%]",
                !contentVisible && "pointer-events-none",
              )}
            >
              <div className="relative min-h-[220px] overflow-hidden bg-muted md:min-h-0">
                <Image
                  src={`${ASSET_BASE}/hero-sketch.png`}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 390px"
                  quality={100}
                  unoptimized
                  className="object-cover object-center opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/78 to-muted/70" />
                <div className="absolute left-6 top-6 grid size-12 place-items-center rounded-[6px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                  <Image
                    src={CARD_ICON[selectedPatent.filter].src}
                    alt=""
                    width={CARD_ICON[selectedPatent.filter].width}
                    height={CARD_ICON[selectedPatent.filter].height}
                    unoptimized
                    className="h-[26px] w-[30px] object-contain"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                    {selectedPatentCategory}
                  </span>
                  <strong className="mt-2 block max-w-[360px] text-[25px] font-extrabold leading-tight text-foreground">
                    {selectedPatent.id}
                  </strong>
                </div>
              </div>

              <div
                data-patent-dialog-scroll
                data-lenis-prevent
                className="min-h-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-9 md:py-10"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                  {copy.details.eyebrow}
                </span>
                <h2
                  id="patent-dialog-title"
                  className="mt-3 max-w-[540px] text-[30px] font-extrabold leading-[1.02] text-foreground md:text-[38px]"
                >
                  {selectedPatent.title}
                </h2>
                <p className="mt-4 max-w-[520px] text-[15px] font-medium leading-[1.45] text-muted-foreground md:text-[16px]">
                  {selectedPatent.description}
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.details.overview}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium leading-[1.65] text-muted-foreground">
                      {selectedPatent.description}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {copy.details.tags}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPatent.tags.map((tag) => (
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

                <section className="mt-8">
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                    {copy.details.scope}
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {selectedPatentScope.map((item) => (
                      <li
                        key={item}
                        className="grid grid-cols-[7px_1fr] gap-3 text-[13px] font-medium leading-[1.45] text-muted-foreground"
                      >
                        <span
                          className="mt-[0.45em] size-1.5 rounded-full bg-brand"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="mt-8 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    [copy.details.category, selectedPatentCategory],
                    [copy.details.depositDate, selectedPatent.date],
                    [copy.details.status, copy.details.statusValue],
                    [copy.details.family, selectedPatent.id],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={cn(
                        "p-4",
                        index < 3 && "border-b border-border lg:border-b-0 lg:border-r",
                        (index === 0 || index === 2) && "sm:border-r",
                        index === 2 && "sm:border-b-0",
                      )}
                    >
                      <strong className="block text-[18px] font-extrabold leading-tight text-brand">
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

function PatentStatsBar() {
  return (
    <Reveal
      delay={0.1}
      className="relative z-20 mx-auto mt-10 w-full max-w-[720px] md:absolute md:bottom-9 md:left-1/2 md:mt-0 md:-translate-x-1/2"
    >
      <div className="grid overflow-hidden rounded-[9px] border border-border/80 bg-white shadow-[0_7px_14px_rgba(0,0,0,0.20)] sm:grid-cols-3">
        {STATS.map((stat, index) => (
          <article
            key={stat.label}
            className={cn(
              "group/stat grid min-h-[74px] grid-cols-[34px_1fr] items-center gap-3 px-5 py-3 transition-shadow duration-500 hover:z-10 hover:shadow-[0_18px_42px_rgba(0,0,0,0.08)] [transition-timing-function:var(--ease-smooth)]",
              index < STATS.length - 1 && "border-b border-border sm:border-b-0 sm:border-r",
            )}
          >
            <Image
              src={stat.icon}
              alt=""
              width={stat.width}
              height={stat.height}
              unoptimized
              className="h-[32px] w-[34px] object-contain transition-transform duration-500 group-hover/stat:-translate-y-1 [transition-timing-function:var(--ease-smooth)]"
            />
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

function PatentCard({
  patent,
  depositedLabel,
  onOpen,
}: {
  patent: PatentItem;
  depositedLabel: string;
  onOpen: (patent: PatentItem) => void;
}) {
  const icon = CARD_ICON[patent.filter];

  return (
    <button
      type="button"
      className="group/patent relative z-0 flex min-h-[174px] w-full origin-center transform-gpu flex-col rounded-[5px] border border-border bg-white px-5 pb-4 pt-5 text-left shadow-[0_4px_7px_rgba(0,0,0,0.18)] outline-none transition-[scale,box-shadow,border-color] duration-[1100ms] will-change-transform hover:z-10 hover:scale-[1.045] hover:border-brand/25 hover:shadow-[0_16px_34px_rgba(0,0,0,0.15)] focus-visible:z-10 focus-visible:scale-[1.045] focus-visible:border-brand/25 focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:shadow-[0_16px_34px_rgba(0,0,0,0.15)] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
      aria-haspopup="dialog"
      aria-label={`Open ${patent.id} details`}
      onClick={() => onOpen(patent)}
    >
        <span className="grid grid-cols-[28px_1fr_auto] items-start gap-4">
          <span className="grid size-7 place-items-center bg-muted" aria-hidden>
            <Image
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              unoptimized
              className="h-[16px] w-[18px] object-contain transition-transform duration-500 group-hover/patent:scale-110 group-focus-within/patent:scale-110 [transition-timing-function:var(--ease-smooth)]"
            />
          </span>
          <span className="max-w-[270px] text-[15px] font-extrabold leading-none text-brand">
            {patent.id}
            <span className="ml-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-brand" />
          </span>
          <ArrowUpRight
            className="size-[16px] text-muted-foreground transition-transform duration-500 group-hover/patent:translate-x-0.5 group-hover/patent:-translate-y-0.5 group-focus-within/patent:translate-x-0.5 group-focus-within/patent:-translate-y-0.5 [transition-timing-function:var(--ease-smooth)]"
            aria-hidden
          />
        </span>

        <span className="mt-5 max-w-[300px] text-[14px] font-extrabold leading-[1.05] text-foreground">
          {patent.title}
        </span>
        <span className="mt-3 max-w-[310px] text-[10px] font-medium leading-[1.35] text-muted-foreground">
          {patent.description}
        </span>

        <span className="mt-auto block pt-5">
          <span className="mb-4 block border-t border-border" />
          <span className="flex items-end justify-between gap-5">
            <span className="flex min-w-0 flex-wrap gap-x-6 gap-y-2">
              {patent.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="flex items-center gap-3 text-[7px] font-extrabold leading-none text-muted-foreground"
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
    </button>
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
