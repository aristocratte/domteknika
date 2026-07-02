import Image from "next/image";
import {
  Box,
  FileChartColumnIncreasing,
  Globe2,
  MonitorCog,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import {
  OurStoryTimelineBlock,
  OurStoryTimelineRail,
  OurStoryTimelineStep,
} from "@/components/sections/our-story-timeline-rail";
import { cn } from "@/lib/utils";

type StoryLocale = "en" | "fr";
type CardKey =
  | "founded"
  | "cree"
  | "swissbiomed"
  | "startup"
  | "totalCar"
  | "aventor"
  | "boneFixation"
  | "softcar"
  | "stajvelo"
  | "softcarReveal"
  | "today";
type IconKey = "box" | "monitor" | "document" | "globe";
type MediaKey =
  | "lake"
  | "cree"
  | "startupProducts"
  | "startupCar"
  | "totalCar"
  | "boneFixation"
  | "softcar"
  | "stajvelo"
  | "softcarReveal";

interface StoryCard {
  year: string;
  title: string;
  description: string;
  icon: IconKey;
  awards?: boolean;
}

interface StoryCopy {
  eyebrow: string;
  title: string;
  intro: string;
  timelineTitlePrefix: string;
  timelineTitleSuffix: string;
  cards: Record<CardKey, StoryCard>;
}

type TimelineBlock =
  | { type: "card"; key: CardKey }
  | { type: "media"; key: MediaKey };

interface TimelineRow {
  left?: TimelineBlock;
  right?: TimelineBlock;
}

const STORY_COPY: Record<StoryLocale, StoryCopy> = {
  en: {
    eyebrow: "Our journey since 1998",
    title: "Our Story",
    intro:
      "For more than 25 years, DOMTEKNIKA has turned complex technical challenges into reliable engineered solutions. From early concepts and prototypes to simulation, electronics and industrial development, we help ideas become products that work. Explore a selection of projects that reflect our expertise and long-standing experience.",
    timelineTitlePrefix: "DOMTEKNIKA",
    timelineTitleSuffix: "timeline",
    cards: {
      founded: {
        year: "1998",
        title: "Founded in La Neuveville - Switzerland",
        description:
          "DOMTEKNIKA was born in La Neuveville with a clear ambition: combining creativity, mechanical engineering and polymer expertise to turn ideas into real-world solutions.",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - Early electric mobility",
        description:
          "The CREE project opened an early chapter in electric mobility, exploring compact, lightweight urban vehicles long before e-mobility became mainstream.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - a dedicated medtech chapter",
        description:
          "With the creation of SwissBiomed, DOMTEKNIKA expanded its engineering know-how into medical-device development, combining precision mechanics, materials expertise and prototyping for healthcare innovation.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "Award-winning startup innovations 3 years in a row",
        description:
          "From Smart Bottle to Skin Care and Personal Injector, DOMTEKNIKA turned ambitious startup concepts into award-winning innovations across smart products, beauty-tech and medtech.",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "With The Total Car, the team explored new vehicle architectures using bio-based polymers and recyclable structures, pushing mobility toward a cleaner production model.",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - performance as a testbed",
        description:
          "Aventor pushed electric mobility into a high-performance format, using speed and acceleration to validate new materials, architectures and technical solutions.",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "A polymer-based medical fixation concept developed for DePuy Synthes, designed to simplify surgical use while ensuring precise, reliable bone stabilization.",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar brought years of research together in a lightweight, recyclable urban vehicle concept designed around low-impact mobility and simplified production.",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - polymer innovation on two wheels",
        description:
          "DOMTEKNIKA applied its polymer design expertise to Stajvelo, an urban e-bike built around integrated structures, comfort, design and riding pleasure.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Softcar V1 Reveal",
        description:
          "The Softcar V1 revealed a new generation of clean urban vehicle, bringing decades of lightweight engineering and circular mobility research into a tangible product.",
        icon: "globe",
      },
      today: {
        year: "Today",
        title: "Engineering what comes next",
        description:
          "DOMTEKNIKA continues to support industrial, medtech and mobility innovators from idea to prototype, combining design, simulation, electronics and manufacturing know-how.",
        icon: "document",
      },
    },
  },
  fr: {
    eyebrow: "Notre parcours depuis 1998",
    title: "Notre histoire",
    intro:
      "Depuis plus de 25 ans, DOMTEKNIKA transforme des défis techniques complexes en solutions fiables. Des premiers concepts aux prototypes, de la simulation à l'electronique et au développement industriel, nous aidons les idées à devenir des produits qui fonctionnent. Découvrez une sélection de projets qui reflètent notre expertise et notre expérience.",
    timelineTitlePrefix: "DOMTEKNIKA",
    timelineTitleSuffix: "timeline",
    cards: {
      founded: {
        year: "1998",
        title: "Création à La Neuveville - Suisse",
        description:
          "DOMTEKNIKA est née à La Neuveville avec une ambition claire: combiner créativité, ingénierie mécanique et expertise polymère pour transformer les idées en solutions concrètes.",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - Premiers pas en mobilité électrique",
        description:
          "Le projet CREE a ouvert un chapitre précoce de la mobilité électrique, avec des véhicules urbains compacts et légers bien avant l'essor de l'e-mobilité.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - un chapitre medtech dédié",
        description:
          "Avec SwissBiomed, DOMTEKNIKA a étendu son savoir-faire au développement de dispositifs médicaux, en combinant mécanique de précision, matériaux et prototypage.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "Innovations startup primées 3 ans de suite",
        description:
          "De Smart Bottle à Skin Care et Personal Injector, DOMTEKNIKA a transformé des concepts ambitieux en innovations récompensées dans les produits intelligents, la beauty-tech et la medtech.",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "Avec The Total Car, l'équipe a exploré de nouvelles architectures de véhicule utilisant des polymères biosourcés et des structures recyclables.",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - la performance comme banc d'essai",
        description:
          "Aventor a poussé la mobilité électrique vers un format haute performance, en utilisant vitesse et accélération pour valider matériaux et architectures.",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "Un concept de fixation médicale polymère développé pour DePuy Synthes, conçu pour simplifier l'usage chirurgical tout en assurant une stabilisation précise.",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar a rassemblé des années de recherche dans un concept urbain léger et recyclable, pensé pour une mobilité à faible impact.",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - innovation polymère sur deux roues",
        description:
          "DOMTEKNIKA a appliqué son expertise polymère à Stajvelo, un e-bike urbain construit autour de structures intégrées, du confort et du design.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Softcar V1 Reveal",
        description:
          "Softcar V1 révèle une nouvelle génération de véhicule urbain propre, concrétisant des décennies d'ingénierie légère et de mobilité circulaire.",
        icon: "globe",
      },
      today: {
        year: "Aujourd'hui",
        title: "Ingénierie pour ce qui vient ensuite",
        description:
          "DOMTEKNIKA continue d'accompagner les innovateurs industriels, medtech et mobilité, de l'idée au prototype.",
        icon: "document",
      },
    },
  },
};

const MEDIA: Record<
  MediaKey,
  {
    images: Array<{
      src: string;
      alt: string;
      width: number;
      height: number;
      className?: string;
    }>;
    className?: string;
  }
> = {
  lake: {
    className: "md:pt-5",
    images: [
      {
        src: "/assets/our-story/lake-workshop.png",
        alt: "Lake Biel landscape near La Neuveville",
        width: 382,
        height: 170,
        className: "w-[280px] sm:w-[340px]",
      },
    ],
  },
  cree: {
    images: [
      {
        src: "/assets/our-story/cree.png",
        alt: "Green CREE electric vehicle prototype",
        width: 338,
        height: 223,
        className: "w-[260px] sm:w-[330px]",
      },
    ],
  },
  startupProducts: {
    className: "gap-4 sm:flex-row",
    images: [
      {
        src: "/assets/our-story/smart-bottle.png",
        alt: "Smart Bottle concept render",
        width: 290,
        height: 268,
        className: "w-[150px] sm:w-[170px] rotate-[-5deg]",
      },
      {
        src: "/assets/our-story/personal-injector.png",
        alt: "Personal injector product render",
        width: 265,
        height: 142,
        className: "w-[210px] sm:w-[250px]",
      },
    ],
  },
  startupCar: {
    images: [
      {
        src: "/assets/our-story/aventor.png",
        alt: "Green startup mobility prototype",
        width: 274,
        height: 181,
        className: "w-[235px] sm:w-[270px]",
      },
    ],
  },
  totalCar: {
    images: [
      {
        src: "/assets/our-story/total-car.png",
        alt: "Aventor performance vehicle on track",
        width: 452,
        height: 202,
        className: "w-[300px] sm:w-[390px]",
      },
    ],
  },
  boneFixation: {
    images: [
      {
        src: "/assets/our-story/bone-fixation.png",
        alt: "Bone fixation system prototype",
        width: 315,
        height: 237,
        className: "w-[245px] sm:w-[300px]",
      },
    ],
  },
  softcar: {
    images: [
      {
        src: "/assets/our-story/softcar-concept.png",
        alt: "White Softcar concept vehicle",
        width: 249,
        height: 184,
        className: "w-[220px] sm:w-[248px]",
      },
    ],
  },
  stajvelo: {
    images: [
      {
        src: "/assets/our-story/stajvelo.png",
        alt: "Stajvelo e-bike against a concrete wall",
        width: 359,
        height: 204,
        className: "w-[285px] sm:w-[355px]",
      },
    ],
  },
  softcarReveal: {
    images: [
      {
        src: "/assets/our-story/softcar-v1.png",
        alt: "Yellow Softcar V1 reveal vehicle",
        width: 275,
        height: 183,
        className: "w-[245px] sm:w-[275px]",
      },
    ],
  },
};

const TIMELINE_ROWS: TimelineRow[] = [
  { left: { type: "card", key: "founded" }, right: { type: "media", key: "lake" } },
  { left: { type: "media", key: "cree" }, right: { type: "card", key: "cree" } },
  { left: { type: "card", key: "swissbiomed" } },
  { left: { type: "media", key: "startupProducts" }, right: { type: "card", key: "startup" } },
  { left: { type: "card", key: "totalCar" }, right: { type: "media", key: "startupCar" } },
  { left: { type: "media", key: "totalCar" }, right: { type: "card", key: "aventor" } },
  { left: { type: "card", key: "boneFixation" }, right: { type: "media", key: "boneFixation" } },
  { left: { type: "media", key: "softcar" }, right: { type: "card", key: "softcar" } },
  { left: { type: "card", key: "stajvelo" }, right: { type: "media", key: "stajvelo" } },
  { left: { type: "media", key: "softcarReveal" }, right: { type: "card", key: "softcarReveal" } },
  { left: { type: "card", key: "today" } },
];

const metaCopy = {
  en: {
    title: "DOMTEKNIKA - Our Story",
    description:
      "Discover DOMTEKNIKA's journey from La Neuveville since 1998 through product engineering, mobility, medtech and prototyping milestones.",
  },
  fr: {
    title: "DOMTEKNIKA - Notre histoire",
    description:
      "Découvrez le parcours de DOMTEKNIKA depuis 1998 à travers ses jalons en ingénierie produit, mobilité, medtech et prototypage.",
  },
} satisfies Record<StoryLocale, { title: string; description: string }>;

export function getOurStoryCopy(locale: string) {
  return STORY_COPY[locale === "fr" ? "fr" : "en"];
}

export function getOurStoryMeta(locale: string) {
  return metaCopy[locale === "fr" ? "fr" : "en"];
}

export function OurStoryPageContent({ locale }: { locale: string }) {
  const copy = getOurStoryCopy(locale);

  return (
    <section
      className="relative overflow-hidden bg-background pt-[92px] md:pt-[98px]"
      aria-labelledby="our-story-title"
    >
      <Image
        src="/assets/our-story/technical-sketch-top.png"
        alt=""
        width={954}
        height={706}
        priority
        sizes="(max-width: 768px) 94vw, 58vw"
        className="pointer-events-none absolute right-[-18vw] top-[66px] z-0 w-[92vw] max-w-none opacity-[0.24] sm:right-[-10vw] md:right-[-2vw] md:top-[68px] md:w-[58vw] md:max-w-[820px]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[430px] bg-gradient-to-r from-white via-white/82 to-white/35" />

      <Container size="wide" className="relative z-10 pb-14 md:pb-[72px]">
        <div className="max-w-[540px] md:pl-2">
          <Reveal>
            <div className="flex items-center gap-3 text-[14px] font-medium leading-none text-muted-foreground">
              <span className="h-[2px] w-[26px] bg-brand" aria-hidden />
              {copy.eyebrow}
            </div>
            <h1
              id="our-story-title"
              className="domtek-text-shadow mt-7 text-[38px] font-extrabold leading-none text-foreground sm:text-[46px] md:text-[50px]"
            >
              {copy.title}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-5 max-w-[500px] text-[13px] font-medium leading-[1.4] text-muted-foreground sm:text-[14px]">
              {copy.intro}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-10 text-[19px] font-extrabold leading-tight text-foreground sm:text-[21px] md:mt-12">
              <span className="text-brand">{copy.timelineTitlePrefix}</span>{" "}
              {copy.timelineTitleSuffix}
            </h2>
          </Reveal>
        </div>

        <OurStoryTimelineRail>
          {TIMELINE_ROWS.map((row, index) => (
            <TimelineRow key={index} row={row} copy={copy} />
          ))}
        </OurStoryTimelineRail>
      </Container>
    </section>
  );
}

function TimelineRow({
  row,
  copy,
}: {
  row: TimelineRow;
  copy: StoryCopy;
}) {
  return (
    <OurStoryTimelineStep
      className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 gap-y-5 md:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)] md:gap-x-6"
      dotClassName="relative z-10 col-start-1 row-span-2 flex justify-center pt-8 md:col-start-2 md:pt-10"
    >
      {row.left ? (
        <OurStoryTimelineBlock className="col-start-2 row-start-1 md:col-start-1">
          <StoryBlock block={row.left} copy={copy} side="left" />
        </OurStoryTimelineBlock>
      ) : (
        <div className="hidden md:block" />
      )}

      {row.right ? (
        <OurStoryTimelineBlock
          className={cn(
            "col-start-2 md:col-start-3 md:row-start-1",
            row.left ? "row-start-2" : "row-start-1",
          )}
        >
          <StoryBlock block={row.right} copy={copy} side="right" />
        </OurStoryTimelineBlock>
      ) : (
        <div className="hidden md:block" />
      )}
    </OurStoryTimelineStep>
  );
}

function StoryBlock({
  block,
  copy,
  side,
}: {
  block: TimelineBlock;
  copy: StoryCopy;
  side: "left" | "right";
}) {
  if (block.type === "card") {
    return <TimelineCard card={copy.cards[block.key]} />;
  }

  return <TimelineMedia media={MEDIA[block.key]} side={side} />;
}

function TimelineCard({ card }: { card: StoryCard }) {
  return (
    <article
      className={cn(
        "group/card grid min-h-[112px] grid-cols-1 gap-3 rounded-[7px] border border-border bg-white px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.035)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] [transition-timing-function:var(--ease-smooth)] sm:grid-cols-[minmax(0,1fr)_48px] sm:items-center sm:gap-5 md:min-h-[116px] md:grid-cols-[minmax(0,1fr)_52px] md:px-5 md:py-4",
        card.awards && "sm:grid-cols-[minmax(0,1fr)_88px_52px]",
      )}
    >
      <div className="min-w-0">
        <span className="block text-[13px] font-extrabold leading-none text-brand md:text-[14px]">
          {card.year}
        </span>
        <h3 className="mt-3 text-[16px] font-extrabold leading-tight text-foreground md:text-[17px]">
          {card.title}
        </h3>
        <p className="mt-2.5 text-[12px] font-medium leading-[1.5] text-muted-foreground md:text-[13px]">
          {card.description}
        </p>
      </div>

      {card.awards && (
        <Image
          src="/assets/our-story/awards.png"
          alt=""
          width={218}
          height={76}
          className="hidden w-[82px] self-start justify-self-end invert hue-rotate-180 sm:block"
        />
      )}
      <span
        className={cn(
          "grid size-[44px] place-items-center justify-self-end rounded-full border-2 border-brand bg-white text-foreground transition-transform duration-500 group-hover/card:scale-105 [transition-timing-function:var(--ease-smooth)] sm:justify-self-center",
          card.awards && "sm:col-start-3",
        )}
      >
        <StoryIcon icon={card.icon} />
      </span>
    </article>
  );
}

function TimelineMedia({
  media,
  side,
}: {
  media: (typeof MEDIA)[MediaKey];
  side: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-2",
        side === "left" ? "md:items-end md:pr-4" : "md:items-start md:pl-4",
        media.className,
      )}
    >
      {media.images.map((image) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 76vw, 390px"
          className={cn("h-auto object-contain", image.className)}
        />
      ))}
    </div>
  );
}

function StoryIcon({ icon }: { icon: IconKey }) {
  const className = "size-5 stroke-[2.4]";

  switch (icon) {
    case "monitor":
      return <MonitorCog className={className} aria-hidden />;
    case "document":
      return <FileChartColumnIncreasing className={className} aria-hidden />;
    case "globe":
      return <Globe2 className={className} aria-hidden />;
    case "box":
    default:
      return <Box className={className} aria-hidden />;
  }
}
