"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
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
import { PatentDialog } from "@/components/sections/patent-dialog";
import { PATENTS, type PatentFilterKey, type PatentRecord } from "@/data/patents";
import { cn } from "@/lib/utils";
import projectAssetManifest from "../../../public/assets/projects/manifest.json";

type FilterKey = "all" | PatentFilterKey;

const PATENT_ASSET_BASE = "/assets/patent-page";

export type Project = {
  id: string;
  category: string;
  filter?: Exclude<FilterKey, "all">;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  gallery?: string[];
  tags: string[];
  overview: string;
  scope?: string[];
  relatedPatents?: RelatedPatent[];
};

type RelatedPatent = {
  patentId: string;
  publication: string;
  title: string;
  note: string;
};

export type PatentLinkedProject = {
  id: string;
  title: string;
  category: string;
  description: string;
};

type ProjectAssetManifestEntry = {
  slug: string;
  images: Array<{ output: string }>;
};

const RELATED_PATENT_RECORDS = {
  WO2026078588A1: {
    publication: "WO2026078588 (A1)",
    title: "ULTRA-LIGHTWEIGHT AND RECYCLABLE DASHBOARD",
  },
  EP4488027A1: {
    publication: "EP4488027 (A1)",
    title: "REINFORCED ROTOMOLDED BODY",
  },
  EP4705115A1: {
    publication: "EP4705115 (A1)",
    title: "DEFLECTOR FOR RIMS, E.G. CAR RIMS",
  },
  EP4680511A1: {
    publication: "EP4680511 (A1)",
    title: "RECYCLABLE STEERING WHEEL",
  },
  MA68857A1: {
    publication: "MA68857 (A1)",
    title: "ALL-TERRAIN SOLAR TRACTOR VEHICLE WITH INTERCHANGEABLE MODULES",
  },
  US2025129628A1: {
    publication: "US2025129628 (A1)",
    title: "AUTOMOBILE PLANT WITH SMALL CARBON FOOTPRINT",
  },
  US2024326565A1: {
    publication: "US2024326565 (A1)",
    title: "Vehicle door",
  },
  EP3744622A1: {
    publication: "EP3744622 (A1)",
    title: "VEHICLE ARCHITECTURE",
  },
  EP3393889A1: {
    publication: "EP3393889 (A1)",
    title: "VEHICLE ARCHITECTURE",
  },
  EP3261867A2: {
    publication: "EP3261867 (A2)",
    title: "ELECTRIC SINGLE-SEATER VEHICLE",
  },
  US6015022A: {
    publication: "US6015022 (A)",
    title: "Ultra-light road vehicle",
  },
  US5584510A: {
    publication: "US5584510 (A)",
    title: "Motor vehicle chassis",
  },
  US5667030A: {
    publication: "US5667030 (A)",
    title: "Heat exchanger for motor vehicle cooling system",
  },
  FR2757569A1: {
    publication: "FR2757569 (A1)",
    title: "Admission system for automobile electronic fuel injection engines",
  },
  US2011061534A1: {
    publication: "US2011061534 (A1)",
    title: "BEVERAGE PRODUCTION DEVICE",
  },
  EP2745749A1: {
    publication: "EP2745749 (A1)",
    title: "Device for preparing a drink",
  },
  CH700288A2: {
    publication: "CH700288 (A2)",
    title: "Automatic hot beverage preparing machine",
  },
  EP1744653A1: {
    publication: "EP1744653 (A1)",
    title: "DEVICE FOR GENERATING AT LEAST ONE BEVERAGE JET",
  },
  AU2014274521A1: {
    publication: "AU2014274521 (A1)",
    title: "Device and method for producing a frothed liquid from soluble ingredients and diluent",
  },
  EP2000065A1: {
    publication: "EP2000065 (A1)",
    title: "Device and method for producing a beverage by mixing soluble ingredients and a diluent",
  },
  US2010173057A1: {
    publication: "US2010173057 (A1)",
    title: "DEVICE AND METHOD FOR PRODUCING A FROTHED LIQUID FROM SOLUBLE INGREDIENTS AND DILUENT",
  },
  US2009320941A1: {
    publication: "US2009320941 (A1)",
    title: "MULTI-WAY VALVE DEVICE",
  },
  CH701083B1: {
    publication: "CH701083 (B1)",
    title: "Dispositif pour le détartrage et le blanchiment simultané des dents",
  },
  US2015360014A1: {
    publication: "US2015360014 (A1)",
    title: "Applicator and capsule for such applicator",
  },
  FR2999439A1: {
    publication: "FR2999439 (A1)",
    title: "DISPOSITIF DE DISTRIBUTION D'UN PRODUIT ET D'EMISSION D'UN RAYONNEMENT LUMINEUX",
  },
  US2015342657A1: {
    publication: "US2015342657 (A1)",
    title: "BONE FIXATION ASSEMBLY",
  },
  EP3185821A1: {
    publication: "EP3185821 (A1)",
    title: "IMPACTOR BODY FOR ORTHOPAEDIC SURGERY OPERATION",
  },
  US2016000570A1: {
    publication: "US2016000570 (A1)",
    title: "Polymer based joint implants and method of manufacture",
  },
  WO2016004540A1: {
    publication: "WO2016004540 (A1)",
    title: "OPTICAL METHOD FOR MAKING AT LEAST ONE COMPONENT OF A WATCH MOVEMENT INVISIBLE",
  },
  CH707437A1: {
    publication: "CH707437 (A1)",
    title: "Method for making a watch movement component invisible",
  },
  US2022338602A1: {
    publication: "US2022338602 (A1)",
    title: "Frame for bad weather and/or sun protection device",
  },
  WO2021043427A1: {
    publication: "WO2021043427 (A1)",
    title: "HOUSING FOR A DEVICE FOR PROTECTION AGAINST BAD WEATHER AND/OR SUN",
  },
  WO2008017182A1: {
    publication: "WO2008017182 (A1)",
    title: "METHOD AND DEVICE FOR CONTROLLING THE QUALITY OF A FILTRATION CARTRIDGE",
  },
  USD568097S: {
    publication: "USD568097 (S)",
    title: "Filter accessory for carafe",
  },
  USD560092S: {
    publication: "USD560092 (S)",
    title: "Carafe",
  },
} satisfies Record<string, Omit<RelatedPatent, "patentId" | "note">>;

type RelatedPatentId = keyof typeof RELATED_PATENT_RECORDS;

function relatedPatent(patentId: RelatedPatentId, note: string): RelatedPatent {
  const patent = PATENTS.find((item) => item.id === patentId);

  // The visible patent data must come from the patent archive itself, so a
  // project link always matches the card and modal shown on the Patent page.
  if (patent) {
    return {
      patentId,
      publication: patent.publication,
      title: patent.title,
      note,
    };
  }

  return {
    patentId,
    publication: RELATED_PATENT_RECORDS[patentId].publication,
    title: RELATED_PATENT_RECORDS[patentId].title,
    note,
  };
}

type PanelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: string;
};

type ProjectsLocale = "en" | "fr" | "de" | "es" | "ko" | "zh";

type ProjectStat = {
  label: string;
  value: string;
  icon: string;
  width: number;
  height: number;
};

type ProjectFilterOption = {
  key: FilterKey;
  label: string;
  icon?: string;
  width?: number;
  height?: number;
};

type ProjectsPageCopy = {
  hero: {
    eyebrow: string;
    title: string;
    strong: string;
    rest: string;
    lead: string;
  };
  filters: ProjectFilterOption[];
  featuredProject: Project;
  projects: Project[];
  stats: ProjectStat[];
  statsLabel: string;
  selectedTitle: string;
  resultsLabel: string;
  filtersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  featuredLabel: string;
  viewCaseStudy: string;
  cardOpenDetails: string;
  modal: {
    close: string;
    gallery: string;
    overview: string;
    scope: string;
    tags: string;
    relatedPatents: string;
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

type ProjectModalCopy = ProjectsPageCopy["modal"];

const FILTERS: ProjectFilterOption[] = [
  { key: "all", label: "All" },
  {
    key: "mobility",
    label: "Mobility",
    icon: `${PATENT_ASSET_BASE}/icon-mobility.png`,
    width: 28,
    height: 25,
  },
  {
    key: "industrial",
    label: "Industrial",
    icon: `${PATENT_ASSET_BASE}/icon-industrial.png`,
    width: 30,
    height: 32,
  },
  {
    key: "medical",
    label: "Medical",
    icon: `${PATENT_ASSET_BASE}/icon-medical.png`,
    width: 39,
    height: 34,
  },
  {
    key: "energy",
    label: "Energy",
    icon: `${PATENT_ASSET_BASE}/icon-energy.png`,
    width: 23,
    height: 35,
  },
  {
    key: "materials",
    label: "Materials",
    icon: `${PATENT_ASSET_BASE}/icon-materials.png`,
    width: 34,
    height: 33,
  },
  {
    key: "digital",
    label: "Digital",
    icon: `${PATENT_ASSET_BASE}/icon-digital.png`,
    width: 37,
    height: 35,
  },
];

export const FEATURED_PROJECT: Project = {
  id: "stajvelo-rv01",
  category: "Mobility",
  filter: "mobility",
  title: "STAJVELO RV01",
  description: "Urban e-bike architecture built around injected composite design, distinctive wheels and premium industrial detailing.",
  image: "/assets/projects/stajvelo-rv01/stajvelo-rv01-01-cover.webp",
  imageAlt: "STAJVELO RV01 electric bicycle render",
  tags: ["#2017", "#E-bike", "#Polymer"],
  overview:
    "DOMTEKNIKA supported the polymer conception and structural development of this urban e-bike, from early architecture and wheel engineering to manufacturable product definition.",
};

const PROJECT_GALLERIES = Object.fromEntries(
  (projectAssetManifest as ProjectAssetManifestEntry[]).map((project) => [
    project.slug,
    project.images.map((image) => image.output),
  ]),
) as Record<string, string[]>;

function getProjectGallery(project: Project) {
  const gallery = PROJECT_GALLERIES[project.id] ?? project.gallery ?? [];
  const images = gallery.includes(project.image)
    ? gallery
    : [project.image, ...gallery];

  return images.length > 0 ? images : [project.image];
}

export const PROJECTS: Project[] = [
  {
    id: "aventor",
    category: "Mobility",
    filter: "mobility",
    title: "Aventor",
    description: "High-performance electric vehicle platform developed around speed, acceleration and lightweight composite bodywork.",
    image: "/assets/projects/aventor/aventor-01-cover.webp",
    imageAlt: "Green Aventor electric vehicle on a road course",
    tags: ["#2013", "#EV", "#Composite"],
    overview:
      "Aventor brings together vehicle packaging, composite design, track testing and structural optimization for a compact electric performance platform.",
    relatedPatents: [
      relatedPatent(
        "EP3261867A2",
        "Direct Aventor SA patent covering the electric single-seater vehicle architecture.",
      ),
    ],
  },
  {
    id: "weebot",
    category: "Mobility",
    filter: "mobility",
    title: "Weebot",
    description: "Compact electric mobility concept explored through CAD, prototype builds and winter-use product studies.",
    image: "/assets/projects/weebot/weebot-01-cover.webp",
    imageAlt: "Weebot compact snow mobility concept",
    tags: ["#2014", "#Mobility", "#Prototype"],
    overview:
      "The project covers product architecture, mechanical packaging and prototype development for a small electric mobility platform intended for demanding outdoor use cases.",
  },
  {
    id: "totalcar-concept",
    category: "Mobility",
    filter: "mobility",
    title: "Total Car",
    description: "Compact electric mobility concept focused on lightweight vehicle architecture and ecological urban transport.",
    image: "/assets/projects/totalcar-concept/totalcar-concept-01-cover.webp",
    imageAlt: "Total Car electric vehicle concept on a road",
    tags: ["#EV", "#Urban", "#EcoDesign"],
    overview:
      "Total Car extends the mobility portfolio with a small electric vehicle study, using lightweight bodywork, clean product integration and a low-footprint urban transport approach.",
  },
  {
    id: "cree",
    category: "Mobility",
    filter: "mobility",
    title: "CREE",
    description: "Ultra-light electric road vehicle concept built around compact packaging, a central chassis beam and reduced urban footprint.",
    image: "/assets/projects/totalcar-concept/totalcar-concept-01-cover.webp",
    imageAlt: "CREE ultra-light electric vehicle concept",
    tags: ["#1996", "#EV", "#Lightweight"],
    overview:
      "CREE brings together the early ultra-light electric road vehicle architecture, with a central beam chassis, compact packaging and component integration focused on efficient urban mobility.",
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Ultra-light electric road-vehicle architecture with central beam chassis and compact wheelbase strategy.",
      ),
      relatedPatent(
        "US5584510A",
        "Motor-vehicle chassis principles for structural packaging and impact-energy management.",
      ),
      relatedPatent(
        "US5667030A",
        "Cooling-system heat exchanger integrated around lightweight vehicle architecture.",
      ),
    ],
  },
  {
    id: "softcar",
    category: "Mobility",
    filter: "mobility",
    title: "SOFTCAR",
    description: "Ultra-low-footprint city EV concept focused on lightweight architecture, compact packaging and ecological urban mobility.",
    image: "/assets/our-story/softcar-v1.png",
    imageAlt: "SOFTCAR compact electric city vehicle concept",
    gallery: [
      "/assets/our-story/softcar-v1.png",
      "/assets/our-story/softcar-concept.png",
    ],
    tags: ["#CityEV", "#EcoDesign", "#Mobility"],
    overview:
      "SOFTCAR extends the mobility work into compact city electric vehicles, combining lightweight body architecture, simplified assemblies and low ecological footprint transport.",
    relatedPatents: [
      relatedPatent(
        "WO2026078588A1",
        "Ultra-light recyclable dashboard integrating molded functions and air circuits.",
      ),
      relatedPatent(
        "EP4488027A1",
        "Reinforced rotomolded body process for lightweight vehicle parts.",
      ),
      relatedPatent(
        "EP4705115A1",
        "SOFTCAR rim deflector work for vehicle wheel airflow and aerodynamic wheel-cover integration.",
      ),
      relatedPatent(
        "EP4680511A1",
        "Recyclable steering wheel architecture aligned with low-impact vehicle interiors.",
      ),
      relatedPatent(
        "US2024326565A1",
        "Vehicle door system for complex body geometry and compact access.",
      ),
      relatedPatent(
        "EP3744622A1",
        "Vehicle architecture patent family for the SOFTCAR platform.",
      ),
      relatedPatent(
        "US2025129628A1",
        "Low-carbon automobile plant concept connected to the industrialization strategy.",
      ),
    ],
  },
  {
    id: "folding-bike-scooter",
    category: "Mobility",
    filter: "mobility",
    title: "Folding bike & scooter",
    description: "Early folding mobility studies combining compact vehicle architecture, ergonomic mechanisms and transportable formats.",
    image: "/assets/projects/folding-bike-scooter/folding-bike-scooter-01-cover.webp",
    imageAlt: "Folding electric bicycle concept render",
    tags: ["#2011", "#Folding", "#Mobility"],
    overview:
      "A set of folding e-bike and scooter concepts focused on hinge mechanisms, compact storage volume, ergonomic riding positions and manufacturable mechanical assemblies.",
  },
  {
    id: "aventor-drone",
    category: "Mobility",
    filter: "mobility",
    title: "Aventor drone",
    description: "Drone platform development with lightweight frame studies, assembled prototypes and field test iterations.",
    image: "/assets/projects/aventor-drone/aventor-drone-01-cover.webp",
    imageAlt: "White Aventor drone prototype",
    tags: ["#2017", "#Drone", "#Prototype"],
    overview:
      "This drone work combines mechanical layout, payload packaging and prototype validation for a lightweight aerial product platform.",
  },
  {
    id: "airsmile",
    category: "Medical",
    filter: "medical",
    title: "AirSmile",
    description: "Dental care device concept developed from product styling through functional packaging and prototype families.",
    image: "/assets/projects/airsmile/airsmile-01-cover.webp",
    imageAlt: "AirSmile handheld dental care device render",
    tags: ["#2026", "#Dental", "#Device"],
    overview:
      "AirSmile required a clean handheld product architecture, removable components and ergonomic detailing for a dental-care use case.",
    relatedPatents: [
      relatedPatent(
        "CH701083B1",
        "Dental treatment cartridge and jet architecture relevant to at-home scaling and whitening devices.",
      ),
    ],
  },
  {
    id: "brossadent",
    category: "Medical",
    filter: "medical",
    title: "O2 Cosmetics toothbrush",
    description: "Dental-care product concept combining a toothbrush body, O2 Cosmetics refill cartridges and internal mechanism packaging.",
    image: "/assets/projects/brossadent/brossadent-01-cover.webp",
    imageAlt: "O2 Cosmetics toothbrush concept with refill cartridges",
    tags: ["#2026", "#Dental", "#Injection"],
    overview:
      "The concept combines an ergonomic toothbrush body, replaceable O2 Cosmetics consumables and internal mechanism packaging for a compact dental-care product.",
    relatedPatents: [
      relatedPatent(
        "CH701083B1",
        "Disposable dental cartridge principle with liquid, gas and active particles in a handheld device.",
      ),
    ],
  },
  {
    id: "insulin-pen",
    category: "Medical",
    filter: "medical",
    title: "Insulin pen",
    description: "Injection pen housing and mechanism packaging studies for a slim, manufacturable medical device.",
    image: "/assets/projects/insulin-pen/insulin-pen-01-cover.webp",
    imageAlt: "Blue insulin pen product render",
    tags: ["#2017", "#Medical", "#Packaging"],
    overview:
      "This project focuses on a compact pen-style medical product, balancing internal mechanism constraints, user handling and clean industrial design.",
  },
  {
    id: "paradigm-spine",
    category: "Medical",
    filter: "medical",
    title: "Paradigm Spine",
    description: "Spinal implant and instrumentation development supported by product rendering and mechanical simulation.",
    image: "/assets/projects/paradigm-spine/paradigm-spine-01-cover.webp",
    imageAlt: "Paradigm Spine implant set render",
    tags: ["#2015", "#Spine", "#Simulation"],
    overview:
      "A medical implant project combining precision part design, kit presentation and finite element analysis for load-critical spinal hardware.",
    relatedPatents: [
      relatedPatent(
        "US2016000570A1",
        "Polymer joint implant manufacturing context for medical implant development.",
      ),
    ],
  },
  {
    id: "flex-drill",
    category: "Medical",
    filter: "medical",
    title: "Flex Drill",
    description: "Flexible drill accessory concept with shaped polymer guide, prototype validation and stress-analysis views.",
    image: "/assets/projects/flex-drill/flex-drill-01-cover.webp",
    imageAlt: "Blue flexible drill guide concept",
    tags: ["#2014", "#Tooling", "#Analysis"],
    overview:
      "Flex Drill explores a curved drill-guide architecture, moving from mechanical stress simulation to physical prototype and product rendering.",
  },
  {
    id: "biome-staple-applicator",
    category: "Medical",
    filter: "medical",
    title: "Biome staple applicator",
    description: "Handheld applicator concept developed through sketches, structural analysis and printed prototypes.",
    image: "/assets/projects/biome-staple-applicator/biome-staple-applicator-01-cover.webp",
    imageAlt: "White and red biomedical staple applicator render",
    tags: ["#2013", "#Medical", "#Prototype"],
    overview:
      "The applicator shows the full loop from ideation sketch and ergonomic layout to finite element checks and prototype parts for a handheld biomedical tool.",
    relatedPatents: [
      relatedPatent(
        "US2015342657A1",
        "Bone fixation assembly context for load-critical biomedical fastening devices.",
      ),
    ],
  },
  {
    id: "cliris",
    category: "Industrial",
    filter: "industrial",
    title: "Cliris",
    description: "Automatic eyeglass cleaning device with a compact drawer architecture and refined consumer-product finish.",
    image: "/assets/projects/cliris/cliris-01-cover.webp",
    imageAlt: "Black Cliris automatic eyeglass cleaner open",
    tags: ["#2014", "#Consumer", "#Hygiene"],
    overview:
      "Cliris combines a compact cleaning chamber, drawer movement and consumer-facing surfaces in a product designed for reliable, hygienic eyeglass care.",
  },
  {
    id: "ikitty",
    category: "Industrial",
    filter: "industrial",
    title: "iKitty",
    description: "Cat enrichment product with refill capsule architecture, feeder mechanism and soft product styling.",
    image: "/assets/projects/ikitty/ikitty-01-cover.webp",
    imageAlt: "iKitty cat enrichment device prototype",
    tags: ["#2023", "#PetTech", "#Mechanism"],
    overview:
      "The iKitty concept packages refill capsules, internal feeding mechanics and a recognizable cat-shaped product language into a manufacturable consumer product.",
  },
  {
    id: "smart-bottle",
    category: "Digital",
    filter: "digital",
    title: "Smart Bottle",
    description: "Portable smart-bottle concept with integrated module, compact electronics bay and product-ready casing.",
    image: "/assets/projects/smart-bottle/smart-bottle-01-cover.webp",
    imageAlt: "Smart bottle concept with blue internal module",
    tags: ["#2014", "#SmartProduct", "#CAD"],
    overview:
      "A compact product architecture study for a connected bottle or dosing module, including casing design and internal component packaging.",
  },
  {
    id: "glove-helmet-dryer",
    category: "Industrial",
    filter: "industrial",
    title: "Glove & helmet dryer",
    description: "Drying dock concept for sports equipment, developed from CAD layout to physical prototype tests.",
    image: "/assets/projects/glove-helmet-dryer/glove-helmet-dryer-01-cover.webp",
    imageAlt: "Prototype glove dryer with gloves mounted",
    tags: ["#2015", "#Consumer", "#Prototype"],
    overview:
      "This consumer product packages airflow paths and stands for gloves and helmets into a compact dock, with both rendered concepts and physical prototypes.",
  },
  {
    id: "folding-umbrella",
    category: "Industrial",
    filter: "industrial",
    title: "Folding umbrella",
    description: "Compact umbrella mechanism with case studies, folding geometry and working prototype details.",
    image: "/assets/projects/folding-umbrella/folding-umbrella-01-cover.webp",
    imageAlt: "Yellow folding umbrella prototype",
    tags: ["#2018", "#Mechanism", "#Consumer"],
    overview:
      "The project explores a new folding umbrella architecture, from case cutaways and mechanism studies to full-scale physical prototypes.",
    relatedPatents: [
      relatedPatent(
        "WO2021043427A1",
        "Housing architecture for a weather-protection device.",
      ),
    ],
  },
  {
    id: "skincare-applicator",
    category: "Medical",
    filter: "medical",
    title: "Skincare applicator",
    description: "Dermocosmetic applicator concept with ergonomic handpiece, internal cartridge layout and product presentation.",
    image: "/assets/projects/skincare-applicator/skincare-applicator-01-cover.webp",
    imageAlt: "White skincare applicator render",
    tags: ["#2012", "#BeautyTech", "#Packaging"],
    overview:
      "A handheld skincare system combining fluid delivery, user ergonomics, product styling and packaging-ready visual development.",
    relatedPatents: [
      relatedPatent(
        "US2015360014A1",
        "Applicator and capsule system directly relevant to refillable dermocosmetic delivery.",
      ),
      relatedPatent(
        "FR2999439A1",
        "Product dispensing and light-emission device related to cosmetic application concepts.",
      ),
    ],
  },
  {
    id: "alicoffee-machine",
    category: "Industrial",
    filter: "industrial",
    title: "Coffee machine",
    description: "Countertop coffee machine concept built around a double-pass capsule circuit, where water makes an out-and-back path through the capsule.",
    image: "/assets/projects/alicoffee-machine/alicoffee-machine-01-cover.webp",
    imageAlt: "Coffee machine countertop concept render",
    tags: ["#2014", "#Coffee", "#Capsule", "#Fluidics"],
    overview:
      "This compact beverage appliance studies a capsule circuit where water does not simply flow straight through the capsule. It follows an out-and-back path inside the capsule, creating a double pass intended to make better use of the dose. This fluidic logic connects the industrial design to related patented work around capsule chambers, portion handling and pressurized beverage flow.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Capsule-based beverage production chamber where liquid interacts with the ingredient inside the capsule.",
      ),
    ],
  },
  {
    id: "instant-coffee-dispenser",
    category: "Industrial",
    filter: "industrial",
    title: "Instant coffee dispenser",
    description: "Prototype appliance for soluble coffee dosing, tested with consumer packaging and physical mockups.",
    image: "/assets/projects/instant-coffee-dispenser/instant-coffee-dispenser-01-cover.webp",
    imageAlt: "Instant coffee dispenser prototype with hand interaction",
    tags: ["#2006", "#Appliance", "#Prototype"],
    overview:
      "A physical prototype project focused on soluble coffee handling, dosing ergonomics and a compact appliance form factor.",
    relatedPatents: [
      relatedPatent(
        "EP2000065A1",
        "Mixing chamber and airflow management for soluble beverage ingredients.",
      ),
      relatedPatent(
        "US2010173057A1",
        "Frothed soluble-ingredient liquid production method and device.",
      ),
      relatedPatent(
        "US2009320941A1",
        "Multi-way valve and dosing logic for solvent and solid-substance preparation systems.",
      ),
    ],
  },
  {
    id: "vacheron-watch-mechanics",
    category: "Materials",
    filter: "materials",
    title: "Vacheron watch mechanics",
    description: "Precision horology studies combining mechanical layouts, rendered assemblies and component analysis.",
    image: "/assets/projects/vacheron-watch-mechanics/vacheron-watch-mechanics-01-cover.webp",
    imageAlt: "Mechanical watch render with visible movement",
    tags: ["#2014", "#Horology", "#Precision"],
    overview:
      "This watch project focuses on precision mechanics, movement visualization and structural evaluation of small, high-value components.",
    relatedPatents: [
      relatedPatent(
        "WO2016004540A1",
        "Optical method for making a watch movement component invisible.",
      ),
    ],
  },
  {
    id: "velum-sky-screen",
    category: "Industrial",
    filter: "industrial",
    title: "Velum SKY screen mechanism",
    description: "Architectural mechanism prototype for a screen or facade element, photographed as a precision mechanical assembly.",
    image: "/assets/projects/velum-sky-screen/velum-sky-screen-01-cover.webp",
    imageAlt: "Velum SKY mechanical screen prototype on a dark studio background",
    tags: ["#2025", "#Architecture", "#Mechanism"],
    overview:
      "Velum SKY is represented here through a high-precision mechanical assembly, suggesting an architectural or environmental screen mechanism requiring robust motion and clean detailing.",
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
    value: "6+",
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
  "stajvelo-rv01": {
    category: "Mobilité",
    description: "Architecture de vélo urbain électrique autour d'une conception composite injectée, de roues distinctives et de détails industriels premium.",
    imageAlt: "Rendu du vélo électrique STAJVELO RV01",
    overview:
      "DOMTEKNIKA a accompagné la conception polymère et le développement structurel de cet e-bike urbain, depuis l'architecture initiale et l'ingénierie des roues jusqu'à la définition industrialisable du produit.",
  },
  aventor: {
    category: "Mobilité",
    description: "Plateforme de véhicule électrique haute performance développée autour de la vitesse, de l'accélération et d'une carrosserie composite légère.",
    imageAlt: "Véhicule électrique vert Aventor sur circuit",
    overview:
      "Aventor combine packaging véhicule, conception composite, essais piste et optimisation structurelle pour une plateforme électrique compacte et performante.",
    relatedPatents: [
      relatedPatent(
        "EP3261867A2",
        "Brevet Aventor SA directement lié à l'architecture de véhicule électrique monoplace.",
      ),
    ],
  },
  weebot: {
    category: "Mobilité",
    description: "Concept de mobilité électrique compacte exploré par CAO, prototypes et études produit pour usage hivernal.",
    imageAlt: "Concept de mobilité neige compact Weebot",
    overview:
      "Le projet couvre l'architecture produit, le packaging mécanique et le développement de prototypes pour une petite plateforme de mobilité électrique destinée à des usages extérieurs exigeants.",
  },
  "totalcar-concept": {
    category: "Mobilité",
    title: "Total Car",
    description: "Concept de mobilité électrique compacte centré sur une architecture véhicule légère et un transport urbain écologique.",
    imageAlt: "Concept de véhicule électrique Total Car sur route",
    overview:
      "Total Car complète le portefeuille mobilité avec une étude de petit véhicule électrique, autour d'une carrosserie légère, d'une intégration produit propre et d'une approche urbaine à faible empreinte.",
  },
  cree: {
    category: "Mobilité",
    description: "Concept de véhicule routier électrique ultra-léger autour d'une architecture compacte, d'un châssis central et d'un encombrement urbain réduit.",
    imageAlt: "Concept de véhicule électrique ultra-léger CREE",
    overview:
      "CREE regroupe les premiers travaux de véhicule routier électrique ultra-léger, avec châssis poutre central, packaging compact et intégration de composants pour une mobilité urbaine efficiente.",
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Architecture de véhicule routier électrique ultra-léger avec châssis poutre central et stratégie d'empattement compact.",
      ),
      relatedPatent(
        "US5584510A",
        "Principes de châssis automobile pour packaging structurel et absorption d'énergie.",
      ),
      relatedPatent(
        "US5667030A",
        "Échangeur thermique de refroidissement intégré à une architecture véhicule légère.",
      ),
    ],
  },
  softcar: {
    category: "Mobilité",
    title: "SOFTCAR",
    description: "Concept de véhicule électrique urbain à très faible empreinte, centré sur une architecture légère, un packaging compact et une mobilité écologique.",
    image: "/assets/our-story/softcar-v1.png",
    imageAlt: "Concept de véhicule électrique urbain compact SOFTCAR",
    gallery: [
      "/assets/our-story/softcar-v1.png",
      "/assets/our-story/softcar-concept.png",
    ],
    overview:
      "SOFTCAR prolonge le travail mobilité vers les véhicules électriques urbains compacts, avec architecture légère, assemblages simplifiés et transport à faible empreinte écologique.",
    relatedPatents: [
      relatedPatent(
        "WO2026078588A1",
        "Tableau de bord ultra-léger et recyclable intégrant fonctions moulées et circuits d'air.",
      ),
      relatedPatent(
        "EP4488027A1",
        "Procédé de carrosserie rotomoulée renforcée pour pièces véhicule légères.",
      ),
      relatedPatent(
        "EP4705115A1",
        "Déflecteur de jante SOFTCAR pour le flux d'air autour des roues et l'intégration aérodynamique.",
      ),
      relatedPatent(
        "EP4680511A1",
        "Volant recyclable aligné avec les intérieurs véhicule à faible impact.",
      ),
      relatedPatent(
        "US2024326565A1",
        "Système de porte pour géométrie de carrosserie complexe et accès compact.",
      ),
      relatedPatent(
        "EP3744622A1",
        "Famille de brevets d'architecture véhicule pour la plateforme SOFTCAR.",
      ),
      relatedPatent(
        "US2025129628A1",
        "Concept d'usine automobile à faible empreinte carbone lié à l'industrialisation.",
      ),
    ],
  },
  "folding-bike-scooter": {
    category: "Mobilité",
    title: "Vélo & scooter pliants",
    description: "Études de mobilité pliante combinant architecture compacte, mécanismes ergonomiques et formats transportables.",
    imageAlt: "Rendu de vélo électrique pliant",
    overview:
      "Une série de concepts vélo électrique et scooter pliants centrés sur les mécanismes de charnière, le volume de rangement, l'ergonomie et les assemblages mécaniques fabricables.",
  },
  "aventor-drone": {
    category: "Mobilité",
    title: "Drone Aventor",
    description: "Développement d'une plateforme drone avec études de châssis léger, prototypes assemblés et itérations terrain.",
    imageAlt: "Prototype de drone blanc Aventor",
    overview:
      "Ce travail drone combine implantation mécanique, packaging de charge utile et validation prototype pour une plateforme aérienne légère.",
  },
  airsmile: {
    category: "Médical",
    description: "Concept de dispositif dentaire développé depuis le style produit jusqu'au packaging fonctionnel et aux familles de prototypes.",
    imageAlt: "Rendu du dispositif dentaire portatif AirSmile",
    overview:
      "AirSmile demandait une architecture produit portative propre, des composants amovibles et un détail ergonomique adapté à un usage de soin dentaire.",
    relatedPatents: [
      relatedPatent(
        "CH701083B1",
        "Architecture de cartouche dentaire et de jets pertinente pour un dispositif de détartrage/blanchiment à domicile.",
      ),
    ],
  },
  brossadent: {
    category: "Médical",
    title: "Brosse à dents O2 Cosmetics",
    description: "Concept de soin dentaire combinant corps de brosse à dents, cartouches O2 Cosmetics et packaging du mécanisme interne.",
    imageAlt: "Concept de brosse à dents O2 Cosmetics avec cartouches",
    overview:
      "Le concept combine un corps de brosse à dents ergonomique, des consommables O2 Cosmetics remplaçables et l'intégration du mécanisme interne dans un produit dentaire compact.",
    relatedPatents: [
      relatedPatent(
        "CH701083B1",
        "Principe de cartouche dentaire jetable avec liquide, gaz et particules actives dans un appareil portatif.",
      ),
    ],
  },
  "insulin-pen": {
    category: "Médical",
    title: "Stylo à insuline",
    description: "Études de boîtier et de packaging mécanisme pour un dispositif médical fin et industrialisable.",
    imageAlt: "Rendu de stylo à insuline bleu",
    overview:
      "Ce projet se concentre sur un produit médical au format stylo, en équilibrant contraintes de mécanisme interne, prise en main et design industriel épuré.",
  },
  "paradigm-spine": {
    category: "Médical",
    description: "Développement d'implant et d'instrumentation rachidienne avec rendu produit et simulation mécanique.",
    imageAlt: "Rendu d'un kit d'implants Paradigm Spine",
    overview:
      "Projet d'implant médical combinant conception de pièces de précision, présentation de kit et analyse par éléments finis pour du matériel spinal chargé mécaniquement.",
    relatedPatents: [
      relatedPatent(
        "US2016000570A1",
        "Contexte de fabrication d'implants articulaires polymères pour le développement médical.",
      ),
    ],
  },
  "flex-drill": {
    category: "Médical",
    description: "Concept d'accessoire de perçage flexible avec guide polymère, validation prototype et vues d'analyse de contraintes.",
    imageAlt: "Concept de guide de perçage flexible bleu",
    overview:
      "Flex Drill explore une architecture de guide de perçage courbe, depuis la simulation mécanique jusqu'au prototype physique et au rendu produit.",
  },
  "biome-staple-applicator": {
    category: "Médical",
    title: "Applicateur d'agrafes biomédicales",
    description: "Concept d'applicateur portatif développé par croquis, analyse structurelle et prototypes imprimés.",
    imageAlt: "Rendu d'applicateur d'agrafes biomédical blanc et rouge",
    overview:
      "L'applicateur montre la boucle complète: idéation, architecture ergonomique, vérifications par éléments finis et pièces prototype pour un outil biomédical portatif.",
    relatedPatents: [
      relatedPatent(
        "US2015342657A1",
        "Contexte d'assemblage de fixation osseuse pour dispositifs biomédicaux soumis à des efforts.",
      ),
    ],
  },
  cliris: {
    category: "Industrie",
    description: "Nettoyeur automatique de lunettes avec architecture compacte à tiroir et finition de produit grand public.",
    imageAlt: "Nettoyeur de lunettes automatique Cliris noir ouvert",
    overview:
      "Cliris combine chambre de nettoyage compacte, mouvement de tiroir et surfaces visibles dans un produit conçu pour un entretien fiable et hygiénique des lunettes.",
  },
  ikitty: {
    category: "Industrie",
    description: "Produit d'enrichissement pour chat avec architecture de capsule rechargeable, mécanisme feeder et design doux.",
    imageAlt: "Prototype de dispositif iKitty pour chat",
    overview:
      "Le concept iKitty intègre capsules rechargeables, mécanique interne de distribution et langage produit reconnaissable dans un objet consumer fabricable.",
  },
  "smart-bottle": {
    category: "Digital",
    title: "Smart Bottle",
    description: "Concept de bouteille intelligente portable avec module intégré, baie électronique compacte et boîtier produit.",
    imageAlt: "Concept Smart Bottle avec module interne bleu",
    overview:
      "Étude d'architecture pour bouteille connectée ou module de dosage, incluant conception de boîtier et intégration des composants internes.",
  },
  "glove-helmet-dryer": {
    category: "Industrie",
    title: "Sèche-gants & casque",
    description: "Concept de station de séchage pour équipement sportif, développé du layout CAO aux essais sur prototype physique.",
    imageAlt: "Prototype de sèche-gants avec gants montés",
    overview:
      "Ce produit intègre les chemins d'air et supports pour gants et casques dans une station compacte, avec concepts rendus et prototypes physiques.",
  },
  "folding-umbrella": {
    category: "Industrie",
    title: "Parapluie pliant",
    description: "Mécanisme de parapluie compact avec études d'étui, géométrie de pliage et détails de prototype fonctionnel.",
    imageAlt: "Prototype de parapluie pliant jaune",
    overview:
      "Le projet explore une nouvelle architecture de parapluie pliant, depuis les coupes d'étui et études mécanisme jusqu'aux prototypes physiques.",
    relatedPatents: [
      relatedPatent(
        "WO2021043427A1",
        "Architecture de boîtier pour dispositif de protection contre les intempéries.",
      ),
    ],
  },
  "skincare-applicator": {
    category: "Médical",
    title: "Applicateur skincare",
    description: "Concept d'applicateur dermocosmétique avec pièce à main ergonomique, layout de cartouche interne et présentation produit.",
    imageAlt: "Rendu d'un applicateur skincare blanc",
    overview:
      "Système skincare portatif combinant distribution de fluide, ergonomie utilisateur, style produit et visuels prêts pour présentation.",
    relatedPatents: [
      relatedPatent(
        "US2015360014A1",
        "Système applicateur et capsule directement lié aux recharges dermocosmétiques.",
      ),
      relatedPatent(
        "FR2999439A1",
        "Dispositif de distribution de produit et d'émission lumineuse lié aux concepts cosmétiques.",
      ),
    ],
  },
  "alicoffee-machine": {
    category: "Industrie",
    title: "Coffee machine",
    description: "Concept de machine à café de comptoir basé sur un circuit capsule double passage, où l'eau fait un aller-retour dans la capsule.",
    imageAlt: "Rendu du concept de machine à café de comptoir",
    overview:
      "Ce projet étudie un appareil de boisson compact où l'eau ne traverse pas simplement la capsule en ligne droite. Elle effectue un aller-retour dans la capsule, avec un double passage pensé pour mieux exploiter la dose. Cette logique fluidique relie le design industriel aux brevets liés aux chambres capsule, à la gestion des portions et au flux de boisson sous pression.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Chambre de production à capsule où le liquide interagit avec l'ingrédient contenu dans la capsule.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "Industrie",
    title: "Distributeur de café soluble",
    description: "Prototype d'appareil pour dosage de café soluble, testé avec packaging consumer et maquettes physiques.",
    imageAlt: "Prototype de distributeur de café soluble en interaction main",
    overview:
      "Projet prototype centré sur la manipulation du café soluble, l'ergonomie de dosage et un format d'appareil compact.",
    relatedPatents: [
      relatedPatent(
        "EP2000065A1",
        "Chambre de mélange et gestion de flux d'air pour ingrédients solubles.",
      ),
      relatedPatent(
        "US2010173057A1",
        "Méthode et dispositif de production de liquide moussé depuis ingrédients solubles.",
      ),
      relatedPatent(
        "US2009320941A1",
        "Vanne multivoies et logique de dosage pour systèmes solvant/substances solides.",
      ),
    ],
  },
  "vacheron-watch-mechanics": {
    category: "Matériaux",
    title: "Mécanique horlogère Vacheron",
    description: "Études horlogères de précision combinant layouts mécaniques, assemblages rendus et analyse de composants.",
    imageAlt: "Rendu de montre mécanique avec mouvement visible",
    overview:
      "Ce projet horloger porte sur la mécanique de précision, la visualisation de mouvement et l'évaluation structurelle de petits composants à forte valeur.",
    relatedPatents: [
      relatedPatent(
        "WO2016004540A1",
        "Méthode optique pour rendre invisible un composant de mouvement horloger.",
      ),
    ],
  },
  "velum-sky-screen": {
    category: "Industrie",
    title: "Mécanisme Velum SKY",
    description: "Prototype de mécanisme architectural pour écran ou élément de façade, photographié comme assemblage mécanique de précision.",
    imageAlt: "Prototype mécanique Velum SKY sur fond studio sombre",
    overview:
      "Velum SKY est représenté ici par un assemblage mécanique de précision, suggérant un mécanisme architectural ou environnemental demandant mouvement robuste et détails propres.",
  },
};

const DE_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "Mobilität",
    description: "Urbanes E-Bike, entwickelt rund um injizierte Verbundbauweise, markante Räder und hochwertige Industriedetails.",
    imageAlt: "Rendering des elektrischen Fahrrads STAJVELO RV01",
    overview:
      "DOMTEKNIKA unterstützte die Polymerkonzeption und Strukturentwicklung dieses urbanen E-Bikes, von der frühen Architektur und Radentwicklung bis zur herstellbaren Produktdefinition.",
  },
  aventor: {
    category: "Mobilität",
    description: "Elektrische Hochleistungsplattform, entwickelt rund um Geschwindigkeit, Beschleunigung und leichte Verbundkarosserie.",
    imageAlt: "Grünes elektrisches Aventor-Fahrzeug auf einer Teststrecke",
    overview:
      "Aventor verbindet Fahrzeugpackage, Verbunddesign, Streckentests und strukturelle Optimierung für eine kompakte elektrische Performance-Plattform.",
  },
  weebot: {
    category: "Mobilität",
    description: "Kompaktes elektrisches Mobilitätskonzept, untersucht mit CAD, Prototypenaufbauten und Produktstudien für den Wintereinsatz.",
    imageAlt: "Kompaktes Weebot-Schneemobilitätskonzept",
    overview:
      "Das Projekt umfasst Produktarchitektur, mechanisches Packaging und Prototypentwicklung für eine kleine elektrische Mobilitätsplattform für anspruchsvolle Outdoor-Anwendungen.",
  },
  "totalcar-concept": {
    category: "Mobilität",
    description: "Kompaktes Elektromobilitätskonzept mit Fokus auf leichter Fahrzeugarchitektur und ökologischem Stadtverkehr.",
    imageAlt: "Total Car Elektrofahrzeugkonzept auf einer Straße",
    overview:
      "Total Car erweitert das Mobilitätsportfolio um eine kleine Elektrofahrzeugstudie mit leichter Karosserie, sauberer Produktintegration und geringem urbanem Fußabdruck.",
  },
  softcar: {
    category: "Mobilität",
    description: "Städtisches Elektrofahrzeugkonzept mit sehr geringem Fußabdruck, leichter Architektur, kompaktem Packaging und ökologischer Mobilität.",
    imageAlt: "Kompaktes elektrisches Stadtfahrzeug SOFTCAR",
    overview:
      "SOFTCAR führt die Mobilitätsarbeit in kompakte Stadtelektrofahrzeuge weiter und kombiniert leichte Karosseriearchitektur, vereinfachte Baugruppen und Verkehr mit geringem ökologischem Fußabdruck.",
  },
  "folding-bike-scooter": {
    category: "Mobilität",
    title: "Faltfahrrad & Scooter",
    description: "Frühe Studien zu faltbarer Mobilität mit kompakter Fahrzeugarchitektur, ergonomischen Mechanismen und transportfähigen Formaten.",
    imageAlt: "Rendering eines faltbaren Elektrofahrrads",
    overview:
      "Eine Reihe von Falt-E-Bike- und Scooter-Konzepten mit Fokus auf Gelenkmechanismen, kompaktes Stauraumvolumen, ergonomische Fahrpositionen und herstellbare mechanische Baugruppen.",
  },
  "aventor-drone": {
    category: "Mobilität",
    title: "Aventor-Drohne",
    description: "Entwicklung einer Drohnenplattform mit leichten Rahmenstudien, montierten Prototypen und Iterationen im Feldtest.",
    imageAlt: "Weißer Aventor-Drohnenprototyp",
    overview:
      "Diese Drohnenarbeit verbindet mechanisches Layout, Nutzlast-Packaging und Prototypvalidierung für eine leichte Luftplattform.",
  },
  airsmile: {
    category: "Medizin & Dental",
    description: "Konzept für ein Dentalgerät, entwickelt vom Produktstyling bis zum funktionalen Packaging und Prototypfamilien.",
    imageAlt: "Rendering eines handgeführten AirSmile-Dentalgeräts",
    overview:
      "AirSmile erforderte eine saubere handgeführte Produktarchitektur, austauschbare Komponenten und ergonomische Details für eine Dentalanwendung.",
  },
  brossadent: {
    category: "Medizin & Dental",
    title: "O2 Cosmetics Zahnbürste",
    description: "Dentalpflege-Konzept mit Zahnbürstenkörper, O2-Cosmetics-Nachfüllkartuschen und internem Mechanismus-Packaging.",
    imageAlt: "O2 Cosmetics Zahnbürstenkonzept mit Nachfüllkartuschen",
    overview:
      "Das Konzept kombiniert einen ergonomischen Zahnbürstenkörper, austauschbare O2-Cosmetics-Verbrauchsteile und internes Mechanismus-Packaging in einem kompakten Dentalprodukt.",
  },
  "insulin-pen": {
    category: "Medizin & Dental",
    title: "Insulinpen",
    description: "Gehäuse- und Mechanismus-Packaging-Studien für ein schlankes, herstellbares Medizinprodukt im Pen-Format.",
    imageAlt: "Blaues Produkt-Rendering eines Insulinpens",
    overview:
      "Dieses Projekt konzentriert sich auf ein kompaktes medizinisches Pen-Produkt, das interne Mechanik, Nutzerhandhabung und klare Industriegestaltung ausbalanciert.",
  },
  "paradigm-spine": {
    category: "Medizin & Dental",
    description: "Entwicklung von Wirbelsäulenimplantaten und Instrumentierung, unterstützt durch Produktrenderings und mechanische Simulation.",
    imageAlt: "Rendering eines Paradigm-Spine-Implantatsets",
    overview:
      "Ein medizinisches Implantatprojekt, das Präzisionsteiledesign, Kit-Präsentation und Finite-Elemente-Analyse für belastungskritische Wirbelsäulenkomponenten verbindet.",
  },
  "flex-drill": {
    category: "Medizin & Dental",
    description: "Konzept eines flexiblen Bohrzubehörs mit geformter Polymerführung, Prototypvalidierung und Spannungsanalyse-Ansichten.",
    imageAlt: "Blaues Konzept einer flexiblen Bohrführung",
    overview:
      "Flex Drill untersucht eine gekrümmte Bohrführungsarchitektur, von mechanischer Spannungssimulation bis zu physischem Prototyp und Produktrendering.",
  },
  "biome-staple-applicator": {
    category: "Medizin & Dental",
    title: "Biome-Klammerapplikator",
    description: "Handgeführtes Applikatorkonzept, entwickelt durch Skizzen, Strukturanalyse und gedruckte Prototypen.",
    imageAlt: "Weiß-rotes Rendering eines biomedizinischen Klammerapplikators",
    overview:
      "Der Applikator zeigt die gesamte Schleife von Ideenskizze und ergonomischem Layout bis zu Finite-Elemente-Prüfungen und Prototypteilen für ein biomedizinisches Handwerkzeug.",
  },
  cliris: {
    category: "Konsumprodukte",
    description: "Automatisches Brillenreinigungsgerät mit kompakter Schubladenarchitektur und veredelter Consumer-Produktoberfläche.",
    imageAlt: "Geöffneter schwarzer automatischer Cliris-Brillenreiniger",
    overview:
      "Cliris kombiniert eine kompakte Reinigungskammer, Schubladenbewegung und nutzerseitige Oberflächen in einem Produkt für zuverlässige, hygienische Brillenpflege.",
  },
  ikitty: {
    category: "Konsumprodukte",
    description: "Produkt zur Beschäftigung von Katzen mit Nachfüllkapsel-Architektur, Füttermechanismus und weicher Produktsprache.",
    imageAlt: "iKitty-Prototyp für Katzenbeschäftigung",
    overview:
      "Das iKitty-Konzept verpackt Nachfüllkapseln, interne Füttermechanik und eine erkennbare katzenförmige Produktsprache in ein herstellbares Konsumprodukt.",
  },
  "smart-bottle": {
    category: "Konsumprodukte",
    title: "Smart Bottle",
    description: "Tragbares Smart-Bottle-Konzept mit integriertem Modul, kompakter Elektronikbucht und produktreifem Gehäuse.",
    imageAlt: "Smart-Bottle-Konzept mit blauem internem Modul",
    overview:
      "Eine kompakte Produktarchitekturstudie für eine vernetzte Flasche oder ein Dosiermodul, einschließlich Gehäusedesign und internem Komponenten-Packaging.",
  },
  "glove-helmet-dryer": {
    category: "Konsumprodukte",
    title: "Handschuh- & Helmtrockner",
    description: "Trocknungsstation für Sportausrüstung, entwickelt vom CAD-Layout bis zu Tests physischer Prototypen.",
    imageAlt: "Prototyp eines Handschuhtrockners mit montierten Handschuhen",
    overview:
      "Dieses Konsumprodukt integriert Luftführung und Halterungen für Handschuhe und Helme in eine kompakte Dockingstation, mit gerenderten Konzepten und physischen Prototypen.",
  },
  "folding-umbrella": {
    category: "Konsumprodukte",
    title: "Faltbarer Regenschirm",
    description: "Kompakter Regenschirmmechanismus mit Etuistudien, Faltgeometrie und Details funktionsfähiger Prototypen.",
    imageAlt: "Gelber Prototyp eines faltbaren Regenschirms",
    overview:
      "Das Projekt untersucht eine neue Architektur für faltbare Regenschirme, von Etui-Schnitten und Mechanismusstudien bis zu physischen Prototypen in voller Größe.",
  },
  "skincare-applicator": {
    category: "Konsumprodukte",
    title: "Skincare-Applikator",
    description: "Dermokosmetisches Applikatorkonzept mit ergonomischem Handstück, internem Kartuschenlayout und Produktpräsentation.",
    imageAlt: "Rendering eines weißen Skincare-Applikators",
    overview:
      "Ein handgeführtes Skincare-System, das Fluidabgabe, Nutzerergonomie, Produktstyling und präsentationsreife Visualisierung verbindet.",
  },
  "alicoffee-machine": {
    category: "Konsumprodukte",
    title: "Alicoffee-Maschine",
    description: "Kaffeemaschinenkonzept für die Arbeitsplatte mit doppeltem Kapselkreislauf, bei dem Wasser in der Kapsel hin und zurück geführt wird.",
    imageAlt: "Rendering des Alicoffee-Arbeitsplattenmaschinenkonzepts",
    overview:
      "Alicoffee untersucht ein kompaktes Getränkegerät, bei dem Wasser nicht einfach gerade durch die Kapsel fließt. Es folgt in der Kapsel einem Hin-und-zurück-Weg und erzeugt einen doppelten Durchlauf für eine bessere Nutzung der Portion.",
  },
  "instant-coffee-dispenser": {
    category: "Konsumprodukte",
    title: "Instantkaffee-Dispenser",
    description: "Prototypgerät für die Dosierung von löslichem Kaffee, getestet mit Consumer-Packaging und physischen Mockups.",
    imageAlt: "Instantkaffee-Dispenser-Prototyp mit Handinteraktion",
    overview:
      "Ein physisches Prototypenprojekt rund um die Handhabung von löslichem Kaffee, Dosierergonomie und ein kompaktes Geräteformat.",
  },
  "vacheron-watch-mechanics": {
    category: "Industriesysteme",
    title: "Vacheron-Uhrenmechanik",
    description: "Präzisionsstudien in der Uhrmacherei mit mechanischen Layouts, gerenderten Baugruppen und Komponentenanalyse.",
    imageAlt: "Rendering einer mechanischen Uhr mit sichtbarem Werk",
    overview:
      "Dieses Uhrenprojekt konzentriert sich auf Präzisionsmechanik, Werkvisualisierung und strukturelle Bewertung kleiner, hochwertiger Komponenten.",
  },
  "velum-sky-screen": {
    category: "Architektur & Umwelt",
    title: "Velum SKY Bildschirmmechanismus",
    description: "Prototyp eines architektonischen Mechanismus für ein Screen- oder Fassadenelement, als präzise mechanische Baugruppe fotografiert.",
    imageAlt: "Velum SKY mechanischer Screen-Prototyp vor dunklem Studiohintergrund",
    overview:
      "Velum SKY wird hier durch eine hochpräzise mechanische Baugruppe dargestellt und verweist auf einen architektonischen oder umweltbezogenen Screen-Mechanismus mit robuster Bewegung und sauberer Detaillierung.",
  },
};

const ES_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "Movilidad",
    description: "E-bike urbana desarrollada alrededor de diseño composite inyectado, ruedas distintivas y detalles industriales premium.",
    imageAlt: "Render de la bicicleta eléctrica STAJVELO RV01",
    overview:
      "DOMTEKNIKA acompañó la concepción polimérica y el desarrollo estructural de esta e-bike urbana, desde la arquitectura inicial y la ingeniería de ruedas hasta la definición fabricable del producto.",
  },
  aventor: {
    category: "Movilidad",
    description: "Plataforma de vehículo eléctrico de alto rendimiento desarrollada en torno a velocidad, aceleración y carrocería ligera de composite.",
    imageAlt: "Vehículo eléctrico Aventor verde en circuito",
    overview:
      "Aventor combina packaging de vehículo, diseño composite, pruebas en pista y optimización estructural para una plataforma eléctrica compacta de alto rendimiento.",
  },
  weebot: {
    category: "Movilidad",
    description: "Concepto compacto de movilidad eléctrica explorado mediante CAD, prototipos y estudios de producto para uso invernal.",
    imageAlt: "Concepto compacto de movilidad sobre nieve Weebot",
    overview:
      "El proyecto cubre arquitectura de producto, packaging mecánico y desarrollo de prototipos para una pequeña plataforma eléctrica destinada a usos exteriores exigentes.",
  },
  "totalcar-concept": {
    category: "Movilidad",
    description: "Concepto compacto de movilidad eléctrica centrado en arquitectura ligera de vehículo y transporte urbano ecológico.",
    imageAlt: "Concepto de vehículo eléctrico Total Car en carretera",
    overview:
      "Total Car amplía el portafolio de movilidad con un estudio de pequeño vehículo eléctrico, usando carrocería ligera, integración limpia y un enfoque urbano de baja huella.",
  },
  softcar: {
    category: "Movilidad",
    description: "Concepto de city EV de muy baja huella, centrado en arquitectura ligera, packaging compacto y movilidad urbana ecológica.",
    imageAlt: "Concepto SOFTCAR de vehículo eléctrico urbano compacto",
    overview:
      "SOFTCAR extiende el trabajo de movilidad hacia vehículos eléctricos urbanos compactos, combinando arquitectura ligera, ensamblajes simplificados y transporte de baja huella ecológica.",
  },
  "folding-bike-scooter": {
    category: "Movilidad",
    title: "Bicicleta y scooter plegables",
    description: "Primeros estudios de movilidad plegable que combinan arquitectura compacta, mecanismos ergonómicos y formatos transportables.",
    imageAlt: "Render de bicicleta eléctrica plegable",
    overview:
      "Conjunto de conceptos de e-bike y scooter plegables centrados en bisagras, volumen compacto de guardado, posiciones ergonómicas y ensamblajes mecánicos fabricables.",
  },
  "aventor-drone": {
    category: "Movilidad",
    title: "Drone Aventor",
    description: "Desarrollo de plataforma drone con estudios de chasis ligero, prototipos ensamblados e iteraciones de prueba en campo.",
    imageAlt: "Prototipo de drone blanco Aventor",
    overview:
      "Este trabajo drone combina layout mecánico, packaging de carga útil y validación de prototipo para una plataforma aérea ligera.",
  },
  airsmile: {
    category: "Médico y dental",
    description: "Concepto de dispositivo dental desarrollado desde el estilo de producto hasta el packaging funcional y familias de prototipos.",
    imageAlt: "Render del dispositivo dental portátil AirSmile",
    overview:
      "AirSmile requería una arquitectura limpia de producto portátil, componentes removibles y detalles ergonómicos para un uso de cuidado dental.",
  },
  brossadent: {
    category: "Médico y dental",
    title: "Cepillo O2 Cosmetics",
    description: "Concepto de cuidado dental que combina cuerpo de cepillo, cartuchos O2 Cosmetics y packaging del mecanismo interno.",
    imageAlt: "Concepto de cepillo O2 Cosmetics con cartuchos",
    overview:
      "El concepto combina un cuerpo ergonómico de cepillo, consumibles O2 Cosmetics reemplazables y packaging de mecanismo interno en un producto dental compacto.",
  },
  "insulin-pen": {
    category: "Médico y dental",
    title: "Pluma de insulina",
    description: "Estudios de carcasa y packaging de mecanismo para un dispositivo médico delgado y fabricable.",
    imageAlt: "Render de producto de pluma de insulina azul",
    overview:
      "Este proyecto se centra en un producto médico compacto tipo pluma, equilibrando restricciones de mecanismo interno, manejo por el usuario y diseño industrial limpio.",
  },
  "paradigm-spine": {
    category: "Médico y dental",
    description: "Desarrollo de implante e instrumentación espinal apoyado por renderizado de producto y simulación mecánica.",
    imageAlt: "Render de kit de implantes Paradigm Spine",
    overview:
      "Proyecto de implante médico que combina diseño de piezas de precisión, presentación de kit y análisis por elementos finitos para hardware espinal sometido a carga.",
  },
  "flex-drill": {
    category: "Médico y dental",
    description: "Concepto de accesorio de taladro flexible con guía polimérica, validación de prototipo y vistas de análisis de tensiones.",
    imageAlt: "Concepto azul de guía de taladro flexible",
    overview:
      "Flex Drill explora una arquitectura de guía de taladro curvada, desde simulación de esfuerzo mecánico hasta prototipo físico y render de producto.",
  },
  "biome-staple-applicator": {
    category: "Médico y dental",
    title: "Aplicador de grapas Biome",
    description: "Concepto de aplicador portátil desarrollado mediante bocetos, análisis estructural y prototipos impresos.",
    imageAlt: "Render blanco y rojo de aplicador biomédico de grapas",
    overview:
      "El aplicador muestra el ciclo completo desde boceto de ideación y layout ergonómico hasta verificaciones por elementos finitos y piezas prototipo para una herramienta biomédica portátil.",
  },
  cliris: {
    category: "Productos de consumo",
    description: "Dispositivo automático de limpieza de gafas con arquitectura compacta de cajón y acabado refinado de producto de consumo.",
    imageAlt: "Limpiador automático de gafas Cliris negro abierto",
    overview:
      "Cliris combina cámara de limpieza compacta, movimiento de cajón y superficies orientadas al usuario en un producto para cuidado higiénico y fiable de gafas.",
  },
  ikitty: {
    category: "Productos de consumo",
    description: "Producto de enriquecimiento para gatos con arquitectura de cápsula recargable, mecanismo feeder y estilo suave.",
    imageAlt: "Prototipo de dispositivo iKitty para gatos",
    overview:
      "El concepto iKitty integra cápsulas recargables, mecánica interna de alimentación y un lenguaje de producto reconocible en un producto de consumo fabricable.",
  },
  "smart-bottle": {
    category: "Productos de consumo",
    title: "Smart Bottle",
    description: "Concepto de botella inteligente portátil con módulo integrado, bahía electrónica compacta y carcasa lista para producto.",
    imageAlt: "Concepto Smart Bottle con módulo interno azul",
    overview:
      "Estudio de arquitectura compacta para una botella conectada o módulo de dosificación, incluyendo diseño de carcasa y packaging de componentes internos.",
  },
  "glove-helmet-dryer": {
    category: "Productos de consumo",
    title: "Secador de guantes y casco",
    description: "Concepto de estación de secado para equipamiento deportivo, desarrollado desde layout CAD hasta pruebas con prototipo físico.",
    imageAlt: "Prototipo de secador de guantes con guantes montados",
    overview:
      "Este producto integra rutas de aire y soportes para guantes y cascos en una estación compacta, con conceptos renderizados y prototipos físicos.",
  },
  "folding-umbrella": {
    category: "Productos de consumo",
    title: "Paraguas plegable",
    description: "Mecanismo compacto de paraguas con estudios de funda, geometría de plegado y detalles de prototipo funcional.",
    imageAlt: "Prototipo amarillo de paraguas plegable",
    overview:
      "El proyecto explora una nueva arquitectura de paraguas plegable, desde cortes de funda y estudios de mecanismo hasta prototipos físicos a escala real.",
  },
  "skincare-applicator": {
    category: "Productos de consumo",
    title: "Aplicador skincare",
    description: "Concepto de aplicador dermocosmético con pieza de mano ergonómica, layout interno de cartucho y presentación de producto.",
    imageAlt: "Render de aplicador skincare blanco",
    overview:
      "Sistema skincare portátil que combina entrega de fluido, ergonomía de usuario, estilo de producto y desarrollo visual listo para packaging.",
  },
  "alicoffee-machine": {
    category: "Productos de consumo",
    title: "Máquina Alicoffee",
    description: "Concepto de cafetera de sobremesa basado en un circuito de cápsula de doble paso, donde el agua hace ida y vuelta dentro de la cápsula.",
    imageAlt: "Render del concepto de máquina de sobremesa Alicoffee",
    overview:
      "Alicoffee estudia un aparato compacto de bebida donde el agua no atraviesa simplemente la cápsula en línea recta: sigue un recorrido de ida y vuelta dentro de la cápsula para aprovechar mejor la dosis.",
  },
  "instant-coffee-dispenser": {
    category: "Productos de consumo",
    title: "Dispensador de café soluble",
    description: "Prototipo de aparato para dosificación de café soluble, probado con packaging de consumo y maquetas físicas.",
    imageAlt: "Prototipo de dispensador de café soluble con interacción manual",
    overview:
      "Proyecto de prototipo físico centrado en la manipulación de café soluble, ergonomía de dosificación y un formato compacto de aparato.",
  },
  "vacheron-watch-mechanics": {
    category: "Sistemas industriales",
    title: "Mecánica relojera Vacheron",
    description: "Estudios de relojería de precisión que combinan layouts mecánicos, ensamblajes renderizados y análisis de componentes.",
    imageAlt: "Render de reloj mecánico con movimiento visible",
    overview:
      "Este proyecto relojero se centra en mecánica de precisión, visualización de movimiento y evaluación estructural de pequeños componentes de alto valor.",
  },
  "velum-sky-screen": {
    category: "Arquitectura y medio ambiente",
    title: "Mecanismo Velum SKY",
    description: "Prototipo de mecanismo arquitectónico para pantalla o elemento de fachada, fotografiado como ensamblaje mecánico de precisión.",
    imageAlt: "Prototipo mecánico Velum SKY sobre fondo de estudio oscuro",
    overview:
      "Velum SKY se representa aquí mediante un ensamblaje mecánico de alta precisión, sugiriendo un mecanismo arquitectónico o ambiental que requiere movimiento robusto y detalles limpios.",
  },
};

const KO_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "모빌리티",
    description: "사출 복합재 설계, 독특한 휠, 프리미엄 산업 디테일을 중심으로 한 도심형 e-bike 아키텍처.",
    imageAlt: "STAJVELO RV01 전기자전거 렌더",
    overview:
      "DOMTEKNIKA는 초기 아키텍처와 휠 엔지니어링부터 제조 가능한 제품 정의까지 이 도심형 e-bike의 폴리머 설계와 구조 개발을 지원했습니다.",
  },
  aventor: {
    category: "모빌리티",
    description: "속도, 가속, 경량 복합재 차체를 중심으로 개발된 고성능 전기차 플랫폼.",
    imageAlt: "트랙 위의 초록색 Aventor 전기차",
    overview:
      "Aventor는 차량 패키징, 복합재 설계, 트랙 테스트, 구조 최적화를 결합한 컴팩트 전기 퍼포먼스 플랫폼입니다.",
  },
  weebot: {
    category: "모빌리티",
    description: "CAD, 프로토타입 제작, 겨울 사용 제품 연구를 통해 탐구한 소형 전기 모빌리티 콘셉트.",
    imageAlt: "Weebot 소형 눈길 모빌리티 콘셉트",
    overview:
      "이 프로젝트는 까다로운 야외 사용을 위한 소형 전기 모빌리티 플랫폼의 제품 아키텍처, 기계 패키징, 프로토타입 개발을 다룹니다.",
  },
  "totalcar-concept": {
    category: "모빌리티",
    description: "경량 차량 아키텍처와 친환경 도시 교통에 초점을 둔 소형 전기 모빌리티 콘셉트.",
    imageAlt: "도로 위 Total Car 전기차 콘셉트",
    overview:
      "Total Car는 가벼운 차체, 깔끔한 제품 통합, 저영향 도시 교통 접근법을 활용한 소형 전기차 연구입니다.",
  },
  softcar: {
    category: "모빌리티",
    description: "경량 아키텍처, 컴팩트 패키징, 친환경 도심 모빌리티에 초점을 둔 초저영향 city EV 콘셉트.",
    imageAlt: "SOFTCAR 소형 도심 전기차 콘셉트",
    overview:
      "SOFTCAR는 경량 차체 아키텍처, 단순화된 조립, 낮은 환경 발자국의 교통을 결합해 소형 도심 전기차 작업을 확장합니다.",
  },
  "folding-bike-scooter": {
    category: "모빌리티",
    title: "접이식 자전거와 스쿠터",
    description: "컴팩트 차량 아키텍처, 인체공학적 메커니즘, 휴대 가능한 형식을 결합한 초기 접이식 모빌리티 연구.",
    imageAlt: "접이식 전기자전거 콘셉트 렌더",
    overview:
      "힌지 메커니즘, 작은 보관 부피, 인체공학적 주행 자세, 제조 가능한 기계 조립에 집중한 접이식 e-bike와 스쿠터 콘셉트입니다.",
  },
  "aventor-drone": {
    category: "모빌리티",
    title: "Aventor 드론",
    description: "경량 프레임 연구, 조립 프로토타입, 현장 테스트 반복을 포함한 드론 플랫폼 개발.",
    imageAlt: "흰색 Aventor 드론 프로토타입",
    overview:
      "이 드론 작업은 경량 항공 제품 플랫폼을 위해 기계 레이아웃, 페이로드 패키징, 프로토타입 검증을 결합합니다.",
  },
  airsmile: {
    category: "의료 및 치과",
    description: "제품 스타일링부터 기능 패키징과 프로토타입 제품군까지 개발한 치과 케어 장치 콘셉트.",
    imageAlt: "AirSmile 휴대형 치과 장치 렌더",
    overview:
      "AirSmile은 치과 케어 사용 사례에 맞는 깔끔한 휴대형 제품 아키텍처, 탈착식 구성품, 인체공학적 디테일이 필요했습니다.",
  },
  brossadent: {
    category: "의료 및 치과",
    title: "O2 Cosmetics 칫솔",
    description: "칫솔 본체, O2 Cosmetics 리필 카트리지, 내부 메커니즘 패키징을 결합한 치과 케어 제품 콘셉트.",
    imageAlt: "리필 카트리지가 있는 O2 Cosmetics 칫솔 콘셉트",
    overview:
      "이 콘셉트는 인체공학적 칫솔 본체, 교체 가능한 O2 Cosmetics 소모품, 내부 메커니즘 패키징을 컴팩트한 치과 제품 안에 결합합니다.",
  },
  "insulin-pen": {
    category: "의료 및 치과",
    title: "인슐린 펜",
    description: "슬림하고 제조 가능한 의료기기를 위한 주사 펜 하우징과 메커니즘 패키징 연구.",
    imageAlt: "파란색 인슐린 펜 제품 렌더",
    overview:
      "이 프로젝트는 내부 메커니즘 제약, 사용자 조작성, 깔끔한 산업 디자인을 균형 있게 다룬 컴팩트 펜형 의료 제품에 집중합니다.",
  },
  "paradigm-spine": {
    category: "의료 및 치과",
    description: "제품 렌더링과 기계 시뮬레이션으로 지원한 척추 임플란트 및 수술 기구 개발.",
    imageAlt: "Paradigm Spine 임플란트 세트 렌더",
    overview:
      "정밀 부품 설계, 키트 프레젠테이션, 하중이 중요한 척추 기구를 위한 유한요소해석을 결합한 의료 임플란트 프로젝트입니다.",
  },
  "flex-drill": {
    category: "의료 및 치과",
    description: "형상화된 폴리머 가이드, 프로토타입 검증, 응력 분석 뷰를 포함한 유연 드릴 액세서리 콘셉트.",
    imageAlt: "파란색 유연 드릴 가이드 콘셉트",
    overview:
      "Flex Drill은 곡선형 드릴 가이드 아키텍처를 탐구하며, 기계 응력 시뮬레이션에서 물리 프로토타입과 제품 렌더링까지 이어집니다.",
  },
  "biome-staple-applicator": {
    category: "의료 및 치과",
    title: "Biome 스테이플 애플리케이터",
    description: "스케치, 구조 분석, 출력 프로토타입을 통해 개발된 휴대형 애플리케이터 콘셉트.",
    imageAlt: "흰색과 빨간색 바이오메디컬 스테이플 애플리케이터 렌더",
    overview:
      "이 애플리케이터는 아이디어 스케치와 인체공학 레이아웃에서 유한요소 검토와 프로토타입 부품까지의 전체 루프를 보여 줍니다.",
  },
  cliris: {
    category: "소비자 제품",
    description: "컴팩트한 서랍식 아키텍처와 정제된 소비자 제품 마감을 갖춘 자동 안경 세척 장치.",
    imageAlt: "열린 검은색 Cliris 자동 안경 세척기",
    overview:
      "Cliris는 안경을 위생적이고 안정적으로 관리하기 위해 컴팩트 세척 챔버, 서랍 동작, 사용자에게 보이는 표면을 결합합니다.",
  },
  ikitty: {
    category: "소비자 제품",
    description: "리필 캡슐 아키텍처, 급식 메커니즘, 부드러운 제품 스타일을 갖춘 고양이용 제품.",
    imageAlt: "iKitty 고양이 장치 프로토타입",
    overview:
      "iKitty 콘셉트는 리필 캡슐, 내부 급식 메커니즘, 알아보기 쉬운 고양이 형태 제품 언어를 제조 가능한 소비자 제품으로 패키징합니다.",
  },
  "smart-bottle": {
    category: "소비자 제품",
    title: "Smart Bottle",
    description: "통합 모듈, 컴팩트 전자 베이, 제품화 가능한 케이스를 갖춘 휴대형 스마트 보틀 콘셉트.",
    imageAlt: "파란색 내부 모듈이 있는 Smart Bottle 콘셉트",
    overview:
      "연결형 병 또는 투입 모듈을 위한 컴팩트 제품 아키텍처 연구로, 케이스 디자인과 내부 부품 패키징을 포함합니다.",
  },
  "glove-helmet-dryer": {
    category: "소비자 제품",
    title: "장갑 및 헬멧 건조기",
    description: "CAD 레이아웃부터 물리 프로토타입 테스트까지 개발한 스포츠 장비용 건조 도크 콘셉트.",
    imageAlt: "장갑이 장착된 장갑 건조기 프로토타입",
    overview:
      "공기 흐름 경로와 장갑/헬멧 지지 구조를 컴팩트 도크에 통합한 제품으로, 렌더 콘셉트와 물리 프로토타입을 모두 포함합니다.",
  },
  "folding-umbrella": {
    category: "소비자 제품",
    title: "접이식 우산",
    description: "케이스 연구, 접힘 기하, 작동 프로토타입 디테일을 포함한 컴팩트 우산 메커니즘.",
    imageAlt: "노란색 접이식 우산 프로토타입",
    overview:
      "이 프로젝트는 케이스 단면과 메커니즘 연구부터 실물 크기 물리 프로토타입까지 새로운 접이식 우산 아키텍처를 탐구합니다.",
  },
  "skincare-applicator": {
    category: "소비자 제품",
    title: "스킨케어 애플리케이터",
    description: "인체공학적 핸드피스, 내부 카트리지 레이아웃, 제품 프레젠테이션을 갖춘 더모코스메틱 애플리케이터 콘셉트.",
    imageAlt: "흰색 스킨케어 애플리케이터 렌더",
    overview:
      "유체 전달, 사용자 인체공학, 제품 스타일링, 패키징 준비가 된 시각 개발을 결합한 휴대형 스킨케어 시스템입니다.",
  },
  "alicoffee-machine": {
    category: "소비자 제품",
    title: "Alicoffee 머신",
    description: "캡슐 안에서 물이 왕복 경로를 만드는 이중 통과 캡슐 회로 기반의 탁상형 커피 머신 콘셉트.",
    imageAlt: "Alicoffee 탁상형 머신 콘셉트 렌더",
    overview:
      "Alicoffee는 물이 캡슐을 단순히 직선으로 통과하지 않고 내부에서 왕복 경로를 따라가며, 용량을 더 잘 활용하기 위한 이중 통과를 만드는 컴팩트 음료 장치를 연구합니다.",
  },
  "instant-coffee-dispenser": {
    category: "소비자 제품",
    title: "인스턴트 커피 디스펜서",
    description: "소비자 패키징과 물리 목업으로 테스트한 용해성 커피 투입용 프로토타입 장치.",
    imageAlt: "손으로 조작하는 인스턴트 커피 디스펜서 프로토타입",
    overview:
      "용해성 커피 처리, 투입 인체공학, 컴팩트한 기기 형태에 집중한 물리 프로토타입 프로젝트입니다.",
  },
  "vacheron-watch-mechanics": {
    category: "산업 시스템",
    title: "Vacheron 시계 메커니즘",
    description: "기계 레이아웃, 렌더 조립체, 부품 분석을 결합한 정밀 시계공학 연구.",
    imageAlt: "무브먼트가 보이는 기계식 시계 렌더",
    overview:
      "이 시계 프로젝트는 정밀 기계, 무브먼트 시각화, 작은 고가치 부품의 구조 평가에 집중합니다.",
  },
  "velum-sky-screen": {
    category: "건축 및 환경",
    title: "Velum SKY 스크린 메커니즘",
    description: "스크린 또는 파사드 요소를 위한 건축 메커니즘 프로토타입으로, 정밀 기계 조립체로 촬영되었습니다.",
    imageAlt: "어두운 스튜디오 배경의 Velum SKY 기계식 스크린 프로토타입",
    overview:
      "Velum SKY는 고정밀 기계 조립체로 표현되며, 견고한 움직임과 깔끔한 디테일이 필요한 건축 또는 환경 스크린 메커니즘을 보여 줍니다.",
  },
};

const ZH_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "出行",
    description: "围绕注塑复合材料设计、独特车轮和高端工业细节打造的城市电动自行车架构。",
    imageAlt: "STAJVELO RV01 电动自行车渲染图",
    overview:
      "DOMTEKNIKA 支持了这款城市电动自行车的聚合物构思和结构开发，从早期架构、车轮工程到可制造的产品定义。",
  },
  aventor: {
    category: "出行",
    description: "围绕速度、加速和轻量化复合材料车身开发的高性能电动车平台。",
    imageAlt: "赛道上的绿色 Aventor 电动车",
    overview:
      "Aventor 将车辆布局、复合材料设计、赛道测试和结构优化结合起来，形成紧凑的电动性能平台。",
  },
  weebot: {
    category: "出行",
    description: "通过 CAD、原型制作和冬季使用产品研究探索的紧凑电动出行概念。",
    imageAlt: "Weebot 紧凑雪地出行概念",
    overview:
      "该项目涵盖产品架构、机械包装和原型开发，面向要求较高的户外使用场景的小型电动出行平台。",
  },
  "totalcar-concept": {
    category: "出行",
    description: "聚焦轻量化车辆架构和生态城市交通的紧凑电动出行概念。",
    imageAlt: "道路上的 Total Car 电动车概念",
    overview:
      "Total Car 以小型电动车研究扩展出行组合，使用轻量车身、清晰产品集成和低足迹城市交通方法。",
  },
  softcar: {
    category: "出行",
    description: "超低足迹城市电动车概念，聚焦轻量架构、紧凑包装和生态城市出行。",
    imageAlt: "SOFTCAR 紧凑城市电动车概念",
    overview:
      "SOFTCAR 将出行工作延伸到紧凑城市电动车，结合轻量车身架构、简化组件和低生态足迹交通。",
  },
  "folding-bike-scooter": {
    category: "出行",
    title: "折叠自行车与滑板车",
    description: "早期折叠出行研究，结合紧凑车辆架构、人体工学机构和便携形式。",
    imageAlt: "折叠电动自行车概念渲染图",
    overview:
      "一组折叠电动自行车和滑板车概念，聚焦铰链机构、紧凑收纳体积、人体工学骑行姿态和可制造机械组件。",
  },
  "aventor-drone": {
    category: "出行",
    title: "Aventor 无人机",
    description: "无人机平台开发，包括轻量框架研究、组装原型和现场测试迭代。",
    imageAlt: "白色 Aventor 无人机原型",
    overview:
      "该无人机工作将机械布局、载荷包装和原型验证结合起来，形成轻量化空中产品平台。",
  },
  airsmile: {
    category: "医疗与牙科",
    description: "牙科护理设备概念，从产品造型到功能包装和原型系列开发。",
    imageAlt: "AirSmile 手持牙科护理设备渲染图",
    overview:
      "AirSmile 需要清晰的手持产品架构、可拆卸组件，以及适合牙科护理使用的人体工学细节。",
  },
  brossadent: {
    category: "医疗与牙科",
    title: "O2 Cosmetics 牙刷",
    description: "牙科护理产品概念，结合牙刷主体、O2 Cosmetics 替换胶囊和内部机构包装。",
    imageAlt: "带替换胶囊的 O2 Cosmetics 牙刷概念",
    overview:
      "该概念将人体工学牙刷主体、可替换 O2 Cosmetics 消耗件和内部机构包装整合到紧凑牙科产品中。",
  },
  "insulin-pen": {
    category: "医疗与牙科",
    title: "胰岛素笔",
    description: "面向纤薄、可制造医疗器械的注射笔外壳和机构包装研究。",
    imageAlt: "蓝色胰岛素笔产品渲染图",
    overview:
      "该项目聚焦紧凑笔形医疗产品，在内部机构限制、用户操作和清晰工业设计之间取得平衡。",
  },
  "paradigm-spine": {
    category: "医疗与牙科",
    description: "脊柱植入物和器械开发，并由产品渲染和机械仿真支持。",
    imageAlt: "Paradigm Spine 植入套件渲染图",
    overview:
      "这是一个医疗植入物项目，结合精密零件设计、套件展示和用于承载关键脊柱硬件的有限元分析。",
  },
  "flex-drill": {
    category: "医疗与牙科",
    description: "柔性钻孔附件概念，包含成型聚合物导向件、原型验证和应力分析视图。",
    imageAlt: "蓝色柔性钻孔导向概念",
    overview:
      "Flex Drill 探索弯曲钻孔导向架构，从机械应力仿真走向实体原型和产品渲染。",
  },
  "biome-staple-applicator": {
    category: "医疗与牙科",
    title: "Biome 缝合钉施用器",
    description: "通过草图、结构分析和打印原型开发的手持施用器概念。",
    imageAlt: "白红色生物医学缝合钉施用器渲染图",
    overview:
      "该施用器展示了从创意草图和人体工学布局，到有限元检查和原型零件的完整循环。",
  },
  cliris: {
    category: "消费产品",
    description: "自动眼镜清洁设备，采用紧凑抽屉式架构和精致消费产品表面。",
    imageAlt: "打开状态的黑色 Cliris 自动眼镜清洁器",
    overview:
      "Cliris 将紧凑清洁腔、抽屉运动和面向用户的表面结合在一起，用于可靠、卫生的眼镜护理。",
  },
  ikitty: {
    category: "消费产品",
    description: "猫咪互动产品，采用可替换胶囊架构、喂食机构和柔和产品造型。",
    imageAlt: "iKitty 猫咪互动设备原型",
    overview:
      "iKitty 概念将替换胶囊、内部喂食机构和具有识别度的猫形产品语言整合为可制造的消费产品。",
  },
  "smart-bottle": {
    category: "消费产品",
    title: "Smart Bottle",
    description: "便携智能瓶概念，带集成模块、紧凑电子舱和可产品化外壳。",
    imageAlt: "带蓝色内部模块的 Smart Bottle 概念",
    overview:
      "面向联网瓶或计量模块的紧凑产品架构研究，包括外壳设计和内部组件包装。",
  },
  "glove-helmet-dryer": {
    category: "消费产品",
    title: "手套与头盔烘干器",
    description: "运动装备烘干底座概念，从 CAD 布局开发到实体原型测试。",
    imageAlt: "装有手套的手套烘干器原型",
    overview:
      "该消费产品将手套和头盔的气流路径与支架整合到紧凑底座中，并包含渲染概念与实体原型。",
  },
  "folding-umbrella": {
    category: "消费产品",
    title: "折叠伞",
    description: "紧凑伞机构，包含伞套研究、折叠几何和工作原型细节。",
    imageAlt: "黄色折叠伞原型",
    overview:
      "该项目探索新的折叠伞架构，从伞套剖面和机构研究到全尺寸实体原型。",
  },
  "skincare-applicator": {
    category: "消费产品",
    title: "护肤施用器",
    description: "皮肤美容施用器概念，带人体工学手柄、内部胶囊布局和产品展示。",
    imageAlt: "白色护肤施用器渲染图",
    overview:
      "一套手持护肤系统，结合流体输送、用户人体工学、产品造型和面向包装展示的视觉开发。",
  },
  "alicoffee-machine": {
    category: "消费产品",
    title: "Alicoffee 咖啡机",
    description: "台式咖啡机概念，基于双通道胶囊回路，水在胶囊内形成往返路径。",
    imageAlt: "Alicoffee 台式机器概念渲染图",
    overview:
      "Alicoffee 研究一种紧凑饮品设备，水并非直线穿过胶囊，而是在胶囊内部往返流动，形成双通道以更充分利用剂量。",
  },
  "instant-coffee-dispenser": {
    category: "消费产品",
    title: "速溶咖啡分配器",
    description: "用于速溶咖啡计量的原型设备，并通过消费包装和实体模型进行测试。",
    imageAlt: "带手部交互的速溶咖啡分配器原型",
    overview:
      "一个实体原型项目，聚焦速溶咖啡处理、计量人体工学和紧凑设备形态。",
  },
  "vacheron-watch-mechanics": {
    category: "工业系统",
    title: "Vacheron 钟表机械",
    description: "精密钟表研究，结合机械布局、渲染装配和组件分析。",
    imageAlt: "可见机芯的机械腕表渲染图",
    overview:
      "该钟表项目聚焦精密机械、机芯可视化，以及小型高价值组件的结构评估。",
  },
  "velum-sky-screen": {
    category: "建筑与环境",
    title: "Velum SKY 屏幕机构",
    description: "用于屏幕或幕墙元素的建筑机构原型，以精密机械组件形式拍摄。",
    imageAlt: "深色工作室背景下的 Velum SKY 机械屏幕原型",
    overview:
      "Velum SKY 通过高精度机械组件呈现，指向一种需要稳健运动和清晰细节的建筑或环境屏幕机构。",
  },
};

const PROJECT_OVERRIDES: Record<ProjectsLocale, Record<string, Partial<Project>>> = {
  en: {},
  fr: FR_PROJECT_OVERRIDES,
  de: DE_PROJECT_OVERRIDES,
  es: ES_PROJECT_OVERRIDES,
  ko: KO_PROJECT_OVERRIDES,
  zh: ZH_PROJECT_OVERRIDES,
};

export function localizeProject(
  project: Project,
  overrides: Record<string, Partial<Project>>,
) {
  return {
    ...project,
    ...(overrides[project.id] ?? {}),
  };
}

export function resolveProjectsLocale(locale: string): ProjectsLocale {
  return locale in PROJECT_OVERRIDES ? (locale as ProjectsLocale) : "en";
}

const PINNED_PROJECT_IDS = [
  "aventor",
  "totalcar-concept",
  "cree",
  "stajvelo-rv01",
  "softcar",
];

export const ALL_PROJECTS = [FEATURED_PROJECT, ...PROJECTS].sort((a, b) => {
  const aIndex = PINNED_PROJECT_IDS.indexOf(a.id);
  const bIndex = PINNED_PROJECT_IDS.indexOf(b.id);

  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  }

  return 0;
});

const PROJECT_SCOPES: Record<string, Partial<Record<ProjectsLocale, string[]>>> = {
  "stajvelo-rv01": {
    en: [
      "Polymer and injected-composite architecture for a premium urban e-bike.",
      "Wheel, frame and component integration studies for a distinctive product identity.",
      "CAD refinement toward manufacturable surfaces and robust mechanical interfaces.",
    ],
    fr: [
      "Architecture polymère et composite injecté pour un e-bike urbain premium.",
      "Études roues, cadre et intégration composants pour une identité produit distinctive.",
      "Affinage CAO vers des surfaces industrialisables et interfaces mécaniques robustes.",
    ],
  },
  aventor: {
    en: [
      "Electric vehicle packaging around lightweight bodywork and driver ergonomics.",
      "Composite body and structural studies for a compact performance platform.",
      "Prototype and test-track feedback loop to refine proportions and mechanical layout.",
    ],
    fr: [
      "Packaging véhicule électrique autour d'une carrosserie légère et de l'ergonomie conducteur.",
      "Études composite et structurelles pour une plateforme compacte performante.",
      "Boucle prototype et essais piste pour affiner proportions et implantation mécanique.",
    ],
  },
  weebot: {
    en: [
      "Compact snow-mobility product architecture with mechanical and user constraints.",
      "Prototype iterations to test traction, stance and outdoor handling.",
      "CAD and visual studies to move from rough proof of concept to coherent product form.",
    ],
    fr: [
      "Architecture de mobilité neige compacte avec contraintes mécaniques et utilisateur.",
      "Itérations prototype pour tester traction, posture et usage extérieur.",
      "Études CAO et visuelles pour passer du principe brut à une forme produit cohérente.",
    ],
  },
  "totalcar-concept": {
    en: [
      "Compact urban EV concept work around light structure and simple assembly.",
      "Vehicle layout studies for cabin access, packaging and small footprint.",
      "Mobility strategy connected to low-impact production and recyclable architecture.",
    ],
    fr: [
      "Concept de petit véhicule électrique urbain autour d'une structure légère et d'un assemblage simple.",
      "Études d'implantation véhicule pour accès habitacle, packaging et encombrement réduit.",
      "Stratégie mobilité reliée à une production à faible impact et une architecture recyclable.",
    ],
  },
  cree: {
    en: [
      "Ultra-light electric road vehicle architecture centered on a structural central beam.",
      "Compact packaging strategy for batteries, drivetrain and reduced urban footprint.",
      "Vehicle chassis and cooling-system patent context gathered under the CREE project.",
    ],
    fr: [
      "Architecture de véhicule routier électrique ultra-léger centrée sur une poutre structurelle centrale.",
      "Stratégie de packaging compact pour batteries, chaîne de traction et encombrement urbain réduit.",
      "Contexte brevets châssis et refroidissement regroupé sous le projet CREE.",
    ],
  },
  softcar: {
    en: [
      "Low-footprint city EV architecture with recyclable body and interior systems.",
      "Subsystem thinking across dashboard, door, steering wheel and rotomolded body parts.",
      "Industrialization logic tied to simplified assembly and low-carbon vehicle production.",
    ],
    fr: [
      "Architecture de véhicule urbain à faible empreinte avec carrosserie et systèmes intérieurs recyclables.",
      "Travail sous-systèmes sur tableau de bord, porte, volant et pièces rotomoulées.",
      "Logique d'industrialisation liée à l'assemblage simplifié et à la production bas carbone.",
    ],
  },
  "folding-bike-scooter": {
    en: [
      "Folding geometry studies for compact storage and transport.",
      "Hinge, frame and riding-position concepts for small electric mobility.",
      "Visual and mechanical iterations across bike and scooter formats.",
    ],
    fr: [
      "Études de géométrie pliante pour rangement et transport compacts.",
      "Concepts charnières, cadre et position de conduite pour petite mobilité électrique.",
      "Itérations visuelles et mécaniques sur formats vélo et scooter.",
    ],
  },
  "aventor-drone": {
    en: [
      "Lightweight drone frame and component packaging studies.",
      "Prototype assembly work to validate proportions, arms and payload placement.",
      "Field-test iterations connecting CAD intent with physical behavior.",
    ],
    fr: [
      "Études de châssis drone léger et de packaging composants.",
      "Assemblage prototype pour valider proportions, bras et positionnement charge utile.",
      "Itérations terrain reliant intention CAO et comportement physique.",
    ],
  },
  airsmile: {
    en: [
      "Handheld dental-device form factor with clean, approachable styling.",
      "Internal packaging for removable components and consumable interfaces.",
      "Prototype-family thinking for testing ergonomics and visual variants.",
    ],
    fr: [
      "Format de dispositif dentaire portatif avec style propre et accessible.",
      "Packaging interne pour composants amovibles et interfaces consommables.",
      "Famille de prototypes pour tester ergonomie et variantes visuelles.",
    ],
  },
  brossadent: {
    en: [
      "Toothbrush body architecture with O2 Cosmetics cartridge integration.",
      "Mechanism and consumable packaging inside a compact dental-care product.",
      "Product visualization for presentation, validation and design alignment.",
    ],
    fr: [
      "Architecture de corps de brosse à dents avec intégration de cartouches O2 Cosmetics.",
      "Packaging mécanisme et consommable dans un produit dentaire compact.",
      "Visualisation produit pour présentation, validation et alignement design.",
    ],
  },
  "insulin-pen": {
    en: [
      "Slim medical pen housing with precise internal mechanism envelope.",
      "Human-factor work around grip, readability and controlled handling.",
      "Clean industrial design language suitable for medical-device presentation.",
    ],
    fr: [
      "Boîtier de stylo médical fin avec enveloppe mécanisme interne précise.",
      "Travail facteurs humains sur prise en main, lisibilité et manipulation contrôlée.",
      "Langage design industriel propre adapté à la présentation d'un dispositif médical.",
    ],
  },
  "paradigm-spine": {
    en: [
      "Spinal implant and instrument kit visualization for technical presentation.",
      "Load-case and finite-element analysis support for critical mechanical parts.",
      "Precision component layout connecting engineering validation and medical usability.",
    ],
    fr: [
      "Visualisation de kit implant et instrumentation rachidienne pour présentation technique.",
      "Support cas de charge et éléments finis pour pièces mécaniques critiques.",
      "Implantation de composants de précision reliant validation ingénierie et usage médical.",
    ],
  },
  "flex-drill": {
    en: [
      "Curved drill-guide concept for constrained access and controlled tool direction.",
      "Mechanical stress checks to support geometry and material choices.",
      "Prototype and render iterations to communicate the working principle clearly.",
    ],
    fr: [
      "Concept de guide de perçage courbe pour accès contraint et direction d'outil contrôlée.",
      "Vérifications de contraintes mécaniques pour soutenir géométrie et choix matière.",
      "Itérations prototype et rendu pour communiquer clairement le principe.",
    ],
  },
  "biome-staple-applicator": {
    en: [
      "Handheld applicator ergonomics from sketch to CAD layout.",
      "Structural checks and printed prototype work for a biomedical mechanism.",
      "Product refinement around grip, actuation and clean medical presentation.",
    ],
    fr: [
      "Ergonomie d'applicateur portatif depuis le croquis jusqu'au layout CAO.",
      "Vérifications structurelles et prototypes imprimés pour mécanisme biomédical.",
      "Affinage produit autour de la prise, de l'actionnement et de la présentation médicale.",
    ],
  },
  cliris: {
    en: [
      "Compact consumer appliance architecture with drawer-based cleaning chamber.",
      "Surface, opening and product-language studies for a refined visible object.",
      "Functional packaging around hygienic eyeglass-cleaning use cases.",
    ],
    fr: [
      "Architecture d'appareil consumer compact avec chambre de nettoyage à tiroir.",
      "Études surfaces, ouverture et langage produit pour un objet visible raffiné.",
      "Packaging fonctionnel autour des usages de nettoyage hygiénique des lunettes.",
    ],
  },
  ikitty: {
    en: [
      "Pet-product architecture around capsule insertion and feeding mechanics.",
      "Soft, recognizable product language balanced with internal functional packaging.",
      "Cutaway and prototype views to validate refills, access and product behavior.",
    ],
    fr: [
      "Architecture produit animal autour de l'insertion capsule et de la mécanique feeder.",
      "Langage produit doux et reconnaissable équilibré avec le packaging fonctionnel interne.",
      "Vues coupe et prototypes pour valider recharges, accès et comportement produit.",
    ],
  },
  "smart-bottle": {
    en: [
      "Bottle and module layout for a compact smart-product architecture.",
      "Internal electronic or dosing bay integration without losing product clarity.",
      "Vessel and accessory thinking connected to filtration and user feedback.",
    ],
    fr: [
      "Layout bouteille et module pour une architecture smart-product compacte.",
      "Intégration baie électronique ou dosage sans perdre la clarté produit.",
      "Logique récipient et accessoire reliée à la filtration et au feedback utilisateur.",
    ],
  },
  "glove-helmet-dryer": {
    en: [
      "Airflow and support architecture for drying sports equipment.",
      "CAD-to-prototype loop for glove, helmet and dock proportions.",
      "Physical testing to evaluate usability, stability and drying layout.",
    ],
    fr: [
      "Architecture de flux d'air et supports pour sécher l'équipement sportif.",
      "Boucle CAO-prototype pour proportions gants, casque et station.",
      "Tests physiques pour évaluer usage, stabilité et implantation de séchage.",
    ],
  },
  "folding-umbrella": {
    en: [
      "Folding and case mechanism studies for a compact umbrella system.",
      "Cutaway and physical prototype work to clarify the opening sequence.",
      "Weather-protection product thinking linked to portable storage and robustness.",
    ],
    fr: [
      "Études mécanisme pliage et étui pour système de parapluie compact.",
      "Coupes et prototypes physiques pour clarifier la séquence d'ouverture.",
      "Logique produit de protection météo liée au rangement portable et à la robustesse.",
    ],
  },
  "skincare-applicator": {
    en: [
      "Ergonomic handpiece and cartridge packaging for a dermocosmetic applicator.",
      "Fluid-delivery concept work balanced with beauty-product visual codes.",
      "Prototype and principle views to explain use, refill and internal layout.",
    ],
    fr: [
      "Pièce à main ergonomique et packaging cartouche pour applicateur dermocosmétique.",
      "Concept de distribution fluide équilibré avec les codes visuels beauté.",
      "Vues prototype et principe pour expliquer usage, recharge et layout interne.",
    ],
  },
  "alicoffee-machine": {
    en: [
      "Countertop appliance architecture around a double-pass capsule fluid path.",
      "Industrial design and internal routing for water moving out and back through the dose.",
      "Patent-context alignment around capsule chambers, portion handling and pressurized flow.",
    ],
    fr: [
      "Architecture d'appareil de comptoir autour d'un chemin fluidique capsule double passage.",
      "Design industriel et routage interne pour une eau qui fait l'aller-retour dans la dose.",
      "Alignement brevet autour des chambres capsule, de la gestion portion et du flux sous pression.",
    ],
  },
  "instant-coffee-dispenser": {
    en: [
      "Soluble-coffee dosing architecture with physical user-interaction prototypes.",
      "Compact appliance format balancing powder handling and consumer ergonomics.",
      "Fluid, airflow and mixing patent context for soluble beverage preparation.",
    ],
    fr: [
      "Architecture de dosage café soluble avec prototypes physiques d'interaction utilisateur.",
      "Format d'appareil compact équilibrant manipulation poudre et ergonomie consumer.",
      "Contexte brevet flux, air et mélange pour préparation de boissons solubles.",
    ],
  },
  "vacheron-watch-mechanics": {
    en: [
      "Precision horology visualization for complex small-scale mechanisms.",
      "Mechanical layout and component studies for movement presentation.",
      "Optical and structural patent context around hidden or refined watch movement elements.",
    ],
    fr: [
      "Visualisation horlogère de précision pour mécanismes complexes à petite échelle.",
      "Études layout mécanique et composants pour présentation de mouvement.",
      "Contexte brevet optique et structurel autour d'éléments de mouvement cachés ou raffinés.",
    ],
  },
  "velum-sky-screen": {
    en: [
      "Architectural mechanism presentation for a screen or protection system.",
      "Precision assembly thinking around motion, frame stiffness and clean detailing.",
      "Patent context connected to bad-weather and sun-protection housings and frames.",
    ],
    fr: [
      "Présentation de mécanisme architectural pour écran ou système de protection.",
      "Logique d'assemblage de précision autour du mouvement, de la rigidité cadre et du détail propre.",
      "Contexte brevet lié aux boîtiers et cadres de protection pluie/soleil.",
    ],
  },
};

function withProjectScope(project: Project, locale: ProjectsLocale): Project {
  const localizedScope = PROJECT_SCOPES[project.id]?.[locale];

  return {
    ...project,
    scope:
      localizedScope ??
      (locale === "en" ? PROJECT_SCOPES[project.id]?.en : undefined),
  };
}

export function getProjectsForLocale(locale: string) {
  const resolvedLocale = resolveProjectsLocale(locale);
  const overrides = PROJECT_OVERRIDES[resolvedLocale];

  return ALL_PROJECTS.map((project) => {
    const localizedProject = localizeProject(project, overrides);

    if (
      resolvedLocale !== "en" &&
      resolvedLocale !== "fr" &&
      !overrides[project.id]?.relatedPatents
    ) {
      localizedProject.relatedPatents = undefined;
    }

    return withProjectScope(localizedProject, resolvedLocale);
  });
}

export function getPatentLinkedProjectsForLocale(
  patentId: string,
  locale: string,
): PatentLinkedProject[] {
  return getProjectsForLocale(locale).flatMap((project) => {
    const isLinked = project.relatedPatents?.some(
      (patent) => patent.patentId === patentId,
    );

    if (!isLinked) return [];

    return [
      {
        id: project.id,
        title: project.title,
        category: project.category,
        description: project.description,
      },
    ];
  });
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
    featuredProject: withProjectScope(FEATURED_PROJECT, "en"),
    projects: getProjectsForLocale("en"),
    stats: STATS,
    statsLabel: "Project statistics",
    selectedTitle: "Selected projects",
    resultsLabel: "projects shown",
    filtersLabel: "Filter projects",
    searchLabel: "Search projects",
    searchPlaceholder: "Search...",
    noResults: "No projects match your search.",
    featuredLabel: "Featured project",
    viewCaseStudy: "View project",
    cardOpenDetails: "Open project details",
    modal: {
      close: "Close project details",
      gallery: "Project images",
      overview: "Project overview",
      scope: "What we handled",
      tags: "Project tags",
      relatedPatents: "Related patents",
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
      { key: "all", label: "Tous" },
      {
        key: "mobility",
        label: "Mobilité",
        icon: `${PATENT_ASSET_BASE}/icon-mobility.png`,
        width: 28,
        height: 25,
      },
      {
        key: "industrial",
        label: "Industrie",
        icon: `${PATENT_ASSET_BASE}/icon-industrial.png`,
        width: 30,
        height: 32,
      },
      {
        key: "medical",
        label: "Médical",
        icon: `${PATENT_ASSET_BASE}/icon-medical.png`,
        width: 39,
        height: 34,
      },
      {
        key: "energy",
        label: "Énergie",
        icon: `${PATENT_ASSET_BASE}/icon-energy.png`,
        width: 23,
        height: 35,
      },
      {
        key: "materials",
        label: "Matériaux",
        icon: `${PATENT_ASSET_BASE}/icon-materials.png`,
        width: 34,
        height: 33,
      },
      {
        key: "digital",
        label: "Digital",
        icon: `${PATENT_ASSET_BASE}/icon-digital.png`,
        width: 37,
        height: 35,
      },
    ],
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, FR_PROJECT_OVERRIDES),
      "fr",
    ),
    projects: getProjectsForLocale("fr"),
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
    resultsLabel: "projets affichés",
    filtersLabel: "Filtrer les projets",
    searchLabel: "Rechercher des projets",
    searchPlaceholder: "Rechercher...",
    noResults: "Aucun projet ne correspond à votre recherche.",
    featuredLabel: "Projet phare",
    viewCaseStudy: "Voir le projet",
    cardOpenDetails: "Ouvrir le détail du projet",
    modal: {
      close: "Fermer le détail du projet",
      gallery: "Images du projet",
      overview: "Vue d'ensemble du projet",
      scope: "Travail réalisé",
      tags: "Tags du projet",
      relatedPatents: "Brevets liés",
      area: "Domaine",
      focus: "Focus",
      output: "Livrable",
      design: "Design",
      prototype: "Prototype",
    },
    cta: {
      eyebrow: "Construisons ensemble",
      title: "Let's build what's next",
      bodyStrong: "Vous avez un défi en tête ?",
      body: "Nous accompagnons les entreprises visionnaires pour concevoir, prototyper et livrer des solutions à impact réel.",
      button: "Démarrer un projet",
      subject: "Demande de projet",
    },
  },
  de: {
    hero: {
      eyebrow: "Unsere Arbeit in der Praxis",
      title: "Projekte",
      strong: "Schweizer Präzisionstechnik",
      rest: "für Ergebnisse in der realen Welt.",
      lead: "Entdecken Sie eine Auswahl von Projekten, in denen wir komplexe Herausforderungen in leistungsfähige Produkte verwandeln.",
    },
    filters: [
      { key: "all", label: "Alle Projekte" },
      { key: "mobility", label: "Mobilität" },
      { key: "medical", label: "Medizin & Dental" },
      { key: "materials", label: "Konsumprodukte" },
      { key: "industrial", label: "Industriesysteme" },
      { key: "energy", label: "Architektur & Umwelt" },
    ],
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, DE_PROJECT_OVERRIDES),
      "de",
    ),
    projects: getProjectsForLocale("de"),
    stats: [
      { ...STATS[0], label: "Gelieferte Projekte", value: "60+" },
      { ...STATS[1], label: "Projektbegleitung", value: "End-to-end" },
      { ...STATS[2], label: "Kernbranchen", value: "6+" },
      { ...STATS[3], label: "Bediente Länder", value: "Weltweit" },
    ],
    statsLabel: "Projektstatistiken",
    selectedTitle: "Ausgewählte Projekte",
    resultsLabel: "Projekte angezeigt",
    filtersLabel: "Projekte filtern",
    searchLabel: "Projekte suchen",
    searchPlaceholder: "Suchen...",
    noResults: "Keine Projekte entsprechen Ihrer Suche.",
    featuredLabel: "Ausgewähltes Projekt",
    viewCaseStudy: "Case Study ansehen",
    cardOpenDetails: "Projektdetails öffnen",
    modal: {
      close: "Projektdetails schließen",
      gallery: "Projektbilder",
      overview: "Projektübersicht",
      scope: "Unser Beitrag",
      tags: "Projekt-Tags",
      relatedPatents: "Verwandte Patente",
      area: "Bereich",
      focus: "Fokus",
      output: "Ergebnis",
      design: "Design",
      prototype: "Prototyp",
    },
    cta: {
      eyebrow: "Lassen Sie uns bauen",
      title: "Bauen wir, was als Nächstes kommt",
      bodyStrong: "Haben Sie eine Herausforderung im Kopf?",
      body: "Wir arbeiten mit zukunftsorientierten Unternehmen zusammen, um Lösungen zu entwerfen, zu prototypisieren und zu liefern, die echte Wirkung entfalten.",
      button: "Projekt starten",
      subject: "Projektanfrage",
    },
  },
  es: {
    hero: {
      eyebrow: "Nuestro trabajo en acción",
      title: "Proyectos",
      strong: "Ingeniería suiza de precisión",
      rest: "para resultados reales.",
      lead: "Explora una selección de proyectos en los que convertimos retos complejos en productos de alto rendimiento.",
    },
    filters: [
      { key: "all", label: "Todos los proyectos" },
      { key: "mobility", label: "Movilidad" },
      { key: "medical", label: "Médico y dental" },
      { key: "materials", label: "Productos de consumo" },
      { key: "industrial", label: "Sistemas industriales" },
      { key: "energy", label: "Arquitectura y medio ambiente" },
    ],
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, ES_PROJECT_OVERRIDES),
      "es",
    ),
    projects: getProjectsForLocale("es"),
    stats: [
      { ...STATS[0], label: "Proyectos entregados", value: "60+" },
      { ...STATS[1], label: "Acompañamiento de proyecto", value: "End-to-end" },
      { ...STATS[2], label: "Industrias clave", value: "6+" },
      { ...STATS[3], label: "Países atendidos", value: "Internacional" },
    ],
    statsLabel: "Estadísticas de proyectos",
    selectedTitle: "Proyectos seleccionados",
    resultsLabel: "proyectos mostrados",
    filtersLabel: "Filtrar proyectos",
    searchLabel: "Buscar proyectos",
    searchPlaceholder: "Buscar...",
    noResults: "Ningún proyecto coincide con tu búsqueda.",
    featuredLabel: "Proyecto destacado",
    viewCaseStudy: "Ver caso",
    cardOpenDetails: "Abrir detalles del proyecto",
    modal: {
      close: "Cerrar detalles del proyecto",
      gallery: "Imágenes del proyecto",
      overview: "Resumen del proyecto",
      scope: "Trabajo realizado",
      tags: "Etiquetas del proyecto",
      relatedPatents: "Patentes relacionadas",
      area: "Área",
      focus: "Foco",
      output: "Resultado",
      design: "Diseño",
      prototype: "Prototipo",
    },
    cta: {
      eyebrow: "Construyamos juntos",
      title: "Construyamos lo que viene",
      bodyStrong: "¿Tienes un reto en mente?",
      body: "Colaboramos con empresas visionarias para diseñar, prototipar y entregar soluciones con impacto real.",
      button: "Iniciar un proyecto",
      subject: "Consulta de proyecto",
    },
  },
  ko: {
    hero: {
      eyebrow: "실제로 구현된 작업",
      title: "프로젝트",
      strong: "스위스 정밀 엔지니어링",
      rest: "으로 현실적인 결과를 만듭니다.",
      lead: "복잡한 과제를 고성능 제품으로 바꾼 프로젝트를 살펴보세요.",
    },
    filters: [
      { key: "all", label: "전체 프로젝트" },
      { key: "mobility", label: "모빌리티" },
      { key: "medical", label: "의료 및 치과" },
      { key: "materials", label: "소비자 제품" },
      { key: "industrial", label: "산업 시스템" },
      { key: "energy", label: "건축 및 환경" },
    ],
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, KO_PROJECT_OVERRIDES),
      "ko",
    ),
    projects: getProjectsForLocale("ko"),
    stats: [
      { ...STATS[0], label: "완료한 프로젝트", value: "60+" },
      { ...STATS[1], label: "프로젝트 지원", value: "End-to-end" },
      { ...STATS[2], label: "핵심 산업", value: "6+" },
      { ...STATS[3], label: "서비스 국가", value: "전 세계" },
    ],
    statsLabel: "프로젝트 통계",
    selectedTitle: "선정 프로젝트",
    resultsLabel: "개 프로젝트 표시",
    filtersLabel: "프로젝트 필터",
    searchLabel: "프로젝트 검색",
    searchPlaceholder: "검색...",
    noResults: "검색 조건에 맞는 프로젝트가 없습니다.",
    featuredLabel: "추천 프로젝트",
    viewCaseStudy: "사례 보기",
    cardOpenDetails: "프로젝트 상세 열기",
    modal: {
      close: "프로젝트 상세 닫기",
      gallery: "프로젝트 이미지",
      overview: "프로젝트 개요",
      scope: "담당 범위",
      tags: "프로젝트 태그",
      relatedPatents: "관련 특허",
      area: "분야",
      focus: "초점",
      output: "결과물",
      design: "디자인",
      prototype: "프로토타입",
    },
    cta: {
      eyebrow: "함께 만들어 갑시다",
      title: "다음을 함께 만듭시다",
      bodyStrong: "구상 중인 과제가 있으신가요?",
      body: "저희는 미래지향적인 기업과 함께 실제 영향을 만드는 솔루션을 설계하고 프로토타입으로 검증하며 전달합니다.",
      button: "프로젝트 시작",
      subject: "프로젝트 문의",
    },
  },
  zh: {
    hero: {
      eyebrow: "我们的实践成果",
      title: "项目",
      strong: "瑞士精密工程",
      rest: "带来真实结果。",
      lead: "探索一组选定项目，了解我们如何把复杂挑战转化为高性能产品。",
    },
    filters: [
      { key: "all", label: "全部项目" },
      { key: "mobility", label: "出行" },
      { key: "medical", label: "医疗与牙科" },
      { key: "materials", label: "消费产品" },
      { key: "industrial", label: "工业系统" },
      { key: "energy", label: "建筑与环境" },
    ],
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, ZH_PROJECT_OVERRIDES),
      "zh",
    ),
    projects: getProjectsForLocale("zh"),
    stats: [
      { ...STATS[0], label: "交付项目", value: "60+" },
      { ...STATS[1], label: "项目支持", value: "端到端" },
      { ...STATS[2], label: "核心行业", value: "6+" },
      { ...STATS[3], label: "服务国家", value: "全球" },
    ],
    statsLabel: "项目统计",
    selectedTitle: "精选项目",
    resultsLabel: "个项目显示",
    filtersLabel: "筛选项目",
    searchLabel: "搜索项目",
    searchPlaceholder: "搜索...",
    noResults: "没有符合搜索条件的项目。",
    featuredLabel: "重点项目",
    viewCaseStudy: "查看案例",
    cardOpenDetails: "打开项目详情",
    modal: {
      close: "关闭项目详情",
      gallery: "项目图片",
      overview: "项目概览",
      scope: "我们负责的工作",
      tags: "项目标签",
      relatedPatents: "相关专利",
      area: "领域",
      focus: "重点",
      output: "成果",
      design: "设计",
      prototype: "原型",
    },
    cta: {
      eyebrow: "一起打造",
      title: "一起打造下一步",
      bodyStrong: "有想解决的挑战吗？",
      body: "我们与具有前瞻性的企业合作，设计、原型验证并交付真正产生影响的解决方案。",
      button: "启动项目",
      subject: "项目咨询",
    },
  },
};

const MODAL_TRANSITION_MS = 320;
const MODAL_CLOSE_FALLBACK_MS = 360;
export const PROJECT_DETAIL_HASH_PREFIX = "project-";

export function getProjectsPageCopy(locale: string) {
  return PROJECTS_COPY[resolveProjectsLocale(locale)];
}

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

export function ProjectDetailsDialog({
  locale,
  modal,
  onClosed,
  project,
}: {
  locale: string;
  modal: ProjectModalCopy;
  onClosed: () => void;
  project: Project;
}) {
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [dialogState, setDialogState] = useState<
    "opening" | "open" | "closing"
  >("opening");
  const [panelRect, setPanelRect] = useState<PanelRect>(() =>
    centeredPanelRect(),
  );
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef(0);

  const projectGallery = useMemo(() => getProjectGallery(project), [project]);
  const activeGalleryImage =
    projectGallery[
      Math.min(activeGalleryIndex, Math.max(projectGallery.length - 1, 0))
    ] ?? project.image;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimer();
    setSelectedPatent(null);
    previousFocusRef.current?.focus?.({ preventScroll: true });
    previousFocusRef.current = null;
    onClosed();
  }, [clearCloseTimer, onClosed]);

  const closeProject = useCallback(() => {
    if (dialogState === "closing") return;

    clearCloseTimer();
    setDialogState("closing");
    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose]);

  const openRelatedPatent = useCallback((patentId: string) => {
    const patent = PATENTS.find((item) => item.id === patentId);
    if (!patent) return;

    setSelectedPatent(patent);
  }, []);

  useEffect(() => {
    lockedScrollYRef.current = window.scrollY;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setDialogState("open");
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
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
          ? event.target.closest<HTMLElement>(
              "[data-project-dialog-scroll], [data-patent-dialog-scroll]",
            )
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
  }, []);

  useEffect(() => {
    if (dialogState !== "open") return;

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true });
    }, MODAL_TRANSITION_MS);

    return () => window.clearTimeout(focusTimer);
  }, [dialogState]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selectedPatent) return;

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
  }, [closeProject, selectedPatent]);

  useEffect(() => {
    if (dialogState !== "open") return;

    const onResize = () => setPanelRect(centeredPanelRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dialogState]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const panelStyle = {
    left: panelRect.left,
    top: panelRect.top,
    width: Math.max(panelRect.width, 1),
    height: Math.max(panelRect.height, 1),
    borderRadius: panelRect.radius,
    transformOrigin: "50% 50%",
  } satisfies CSSProperties;

  const contentVisible = dialogState !== "closing";
  const backdropVisible = dialogState === "open";
  const panelVisible = dialogState === "open";

  return (
    <>
      <div className="fixed inset-0 z-[1000]">
        <button
          type="button"
          tabIndex={-1}
          className={cn(
            "absolute inset-0 cursor-default bg-black/55 backdrop-blur-[7px] transition-opacity duration-200 ease-out",
            backdropVisible ? "opacity-100" : "opacity-0",
          )}
          aria-label={modal.close}
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
            aria-label={modal.close}
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
            <div className="flex min-h-[280px] flex-col overflow-hidden bg-muted md:min-h-0">
              <div className="relative min-h-[210px] flex-1">
                <Image
                  src={activeGalleryImage}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-contain p-6 md:p-7"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </div>

              {projectGallery.length > 1 && (
                <div
                  className="border-t border-border bg-white/[0.92] p-3"
                  aria-label={modal.gallery}
                >
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {projectGallery.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        className={cn(
                          "relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[4px] border bg-muted transition-[border-color,opacity,transform] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/30",
                          activeGalleryIndex === index
                            ? "border-brand opacity-100"
                            : "border-border opacity-70 hover:opacity-100",
                        )}
                        aria-label={`${modal.gallery} ${index + 1}`}
                        aria-current={activeGalleryIndex === index}
                        onClick={() => setActiveGalleryIndex(index)}
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          sizes="76px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              data-project-dialog-scroll
              data-lenis-prevent
              className="min-h-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-9 md:py-10"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                {project.category}
              </span>
              <h2
                id="project-dialog-title"
                className="mt-3 max-w-[500px] text-[34px] font-extrabold leading-[0.98] tracking-[-0.02em] text-foreground md:text-[48px]"
              >
                {project.title}
              </h2>
              <p className="mt-4 max-w-[500px] text-[16px] font-medium leading-[1.45] text-muted-foreground md:text-[17px]">
                {project.description}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section>
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                    {modal.overview}
                  </h3>
                  <p className="mt-3 text-[14px] font-medium leading-[1.65] text-muted-foreground">
                    {project.overview}
                  </p>
                </section>
                {project.scope?.length ? (
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {modal.scope}
                    </h3>
                    <ul className="mt-3 grid gap-2 text-[13px] font-medium leading-[1.45] text-muted-foreground">
                      {project.scope.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span
                            className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                <section>
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                    {modal.tags}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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

              {project.relatedPatents?.length ? (
                <section className="mt-8 border border-border bg-white">
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                      {modal.relatedPatents}
                    </h3>
                  </div>
                  <div className="grid divide-y divide-border">
                    {project.relatedPatents.map((patent) => (
                      <button
                        key={patent.publication}
                        type="button"
                        className="group/patentLink grid gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                        aria-haspopup="dialog"
                        onClick={() => openRelatedPatent(patent.patentId)}
                      >
                        <span className="text-[11px] font-extrabold text-brand">
                          {patent.publication}
                        </span>
                        <span className="text-[14px] font-extrabold leading-tight text-foreground transition-colors group-hover/patentLink:text-brand">
                          {patent.title}
                        </span>
                        <span className="text-[12px] font-medium leading-[1.45] text-muted-foreground">
                          {patent.note}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="mt-8 grid border border-border md:grid-cols-3">
                {[
                  [modal.area, project.category],
                  [modal.focus, modal.design],
                  [modal.output, modal.prototype],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={cn(
                      "p-4",
                      index < 2 &&
                        "border-b border-border md:border-b-0 md:border-r",
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
      {selectedPatent && (
        <PatentDialog
          key={selectedPatent.id}
          locale={locale}
          patent={selectedPatent}
          onClosed={() => setSelectedPatent(null)}
        />
      )}
    </>
  );
}

export function ProjectsPageContent({ locale }: { locale: string }) {
  const resolvedLocale = resolveProjectsLocale(locale);
  const copy = PROJECTS_COPY[resolvedLocale];
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [dialogState, setDialogState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const dialogStateRef = useRef(dialogState);
  const lockedScrollYRef = useRef(0);

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
        ...(project.scope ?? []),
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [activeFilter, copy.projects, searchQuery]);

  const selectedProjectGallery = useMemo(
    () => (selectedProject ? getProjectGallery(selectedProject) : []),
    [selectedProject],
  );
  const activeGalleryImage =
    selectedProjectGallery[
      Math.min(activeGalleryIndex, Math.max(selectedProjectGallery.length - 1, 0))
    ] ?? selectedProject?.image;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimer();
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("project")) {
      searchParams.delete("project");
      const nextSearch = searchParams.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`,
      );
    }

    setSelectedPatent(null);
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
      setActiveGalleryIndex(0);
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

  useEffect(() => {
    const openProjectFromUrl = () => {
      const projectId = new URLSearchParams(window.location.search).get("project");
      if (!projectId || selectedProject?.id === projectId) return;

      const project = copy.projects.find((item) => item.id === projectId);
      if (!project) return;

      setActiveFilter(project.filter ?? "all");
      openProject(project);
    };

    openProjectFromUrl();
    window.addEventListener("popstate", openProjectFromUrl);
    return () => window.removeEventListener("popstate", openProjectFromUrl);
  }, [copy.projects, openProject, selectedProject?.id]);

  const closeProject = useCallback(() => {
    if (!selectedProject || dialogState === "closing") return;

    if (window.location.hash.startsWith(`#${PROJECT_DETAIL_HASH_PREFIX}`)) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    clearCloseTimer();
    setDialogState("closing");

    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose, selectedProject]);

  const openProjectFromHash = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (!hash.startsWith(PROJECT_DETAIL_HASH_PREFIX)) return;

    const projectId = decodeURIComponent(
      hash.slice(PROJECT_DETAIL_HASH_PREFIX.length),
    );
    if (!projectId || selectedProject?.id === projectId) return;

    const project =
      copy.featuredProject.id === projectId
        ? copy.featuredProject
        : copy.projects.find((item) => item.id === projectId);
    if (!project) return;

    openProject(project);
  }, [copy.featuredProject, copy.projects, openProject, selectedProject?.id]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(openProjectFromHash);
    window.addEventListener("hashchange", openProjectFromHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openProjectFromHash);
    };
  }, [openProjectFromHash]);

  const openRelatedPatent = useCallback((patentId: string) => {
    const patent = PATENTS.find((item) => item.id === patentId);
    if (!patent) return;

    setSelectedPatent(patent);
  }, []);

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
          ? event.target.closest<HTMLElement>(
              "[data-project-dialog-scroll], [data-patent-dialog-scroll]",
            )
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
      if (selectedPatent) return;

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
  }, [closeProject, selectedPatent, selectedProject]);

  useEffect(() => {
    if (!selectedProject || dialogState !== "open") return;

    const onResize = () => setPanelRect(centeredPanelRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dialogState, selectedProject]);

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
          <Reveal className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h2
                id="selected-projects"
                className="text-[22px] font-extrabold leading-none text-foreground"
              >
                {copy.selectedTitle}
              </h2>
              <p className="mt-3 text-[12px] font-medium text-muted-foreground">
                {visibleProjects.length} / {copy.projects.length} {copy.resultsLabel}
              </p>
            </div>

            <label className="relative block w-full max-w-[360px]">
              <span className="sr-only">{copy.searchLabel}</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-11 w-full rounded-[4px] border border-border bg-white pl-11 pr-4 text-[13px] font-medium text-foreground outline-none shadow-[0_2px_7px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/75 focus:border-brand/50 focus:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
              />
            </label>
          </Reveal>

          <Reveal delay={0.06} className="mb-7 mt-7" as="div">
            <div
              className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[82px_repeat(6,minmax(0,1fr))]"
              role="group"
              aria-label={copy.filtersLabel}
            >
              {copy.filters.map((filter) => {
                const active = activeFilter === filter.key;
                const count =
                  filter.key === "all"
                    ? copy.projects.length
                    : copy.projects.filter((project) => project.filter === filter.key)
                        .length;

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
                          {count} {resolvedLocale === "fr" ? "projets" : "projects"}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
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
              <div className="flex min-h-[280px] flex-col overflow-hidden bg-muted md:min-h-0">
                <div className="relative min-h-[210px] flex-1">
                  <Image
                    src={activeGalleryImage ?? selectedProject.image}
                    alt={selectedProject.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-contain p-6 md:p-7"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                </div>

                {selectedProjectGallery.length > 1 && (
                  <div
                    className="border-t border-border bg-white/[0.92] p-3"
                    aria-label={copy.modal.gallery}
                  >
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProjectGallery.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          className={cn(
                            "relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[4px] border bg-muted transition-[border-color,opacity,transform] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/30",
                            activeGalleryIndex === index
                              ? "border-brand opacity-100"
                              : "border-border opacity-70 hover:opacity-100",
                          )}
                          aria-label={`${copy.modal.gallery} ${index + 1}`}
                          aria-current={activeGalleryIndex === index}
                          onClick={() => setActiveGalleryIndex(index)}
                        >
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="76px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                  {selectedProject.scope?.length ? (
                    <section>
                      <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                        {copy.modal.scope}
                      </h3>
                      <ul className="mt-3 grid gap-2 text-[13px] font-medium leading-[1.45] text-muted-foreground">
                        {selectedProject.scope.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span
                              className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
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

                {selectedProject.relatedPatents?.length ? (
                  <section className="mt-8 border border-border bg-white">
                    <div className="border-b border-border px-4 py-3">
                      <h3 className="text-[12px] font-extrabold uppercase tracking-wide">
                        {copy.modal.relatedPatents}
                      </h3>
                    </div>
                    <div className="grid divide-y divide-border">
                      {selectedProject.relatedPatents.map((patent) => (
                        <button
                          key={patent.publication}
                          type="button"
                          className="group/patentLink grid gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                          aria-haspopup="dialog"
                          onClick={() => openRelatedPatent(patent.patentId)}
                        >
                          <span className="text-[11px] font-extrabold text-brand">
                            {patent.publication}
                          </span>
                          <span className="text-[14px] font-extrabold leading-tight text-foreground transition-colors group-hover/patentLink:text-brand">
                            {patent.title}
                          </span>
                          <span className="text-[12px] font-medium leading-[1.45] text-muted-foreground">
                            {patent.note}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

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
      {selectedPatent && (
        <PatentDialog
          key={selectedPatent.id}
          locale={locale}
          patent={selectedPatent}
          onClosed={() => setSelectedPatent(null)}
        />
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
