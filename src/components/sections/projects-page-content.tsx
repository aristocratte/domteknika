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
import { PatentDialog } from "@/components/sections/patent-dialog";
import { PATENTS, type PatentRecord } from "@/data/patents";
import { cn } from "@/lib/utils";
import projectAssetManifest from "../../../public/assets/projects/manifest.json";

type FilterKey = "all" | "area-1" | "area-2" | "area-3" | "area-4" | "area-5";

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

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All Projects" },
  { key: "area-1", label: "Mobility" },
  { key: "area-2", label: "Medical & Dental" },
  { key: "area-3", label: "Consumer Products" },
  { key: "area-4", label: "Industrial Systems" },
  { key: "area-5", label: "Architecture & Environment" },
];

export const FEATURED_PROJECT: Project = {
  id: "stajvelo-rv01",
  category: "Mobility",
  filter: "area-1",
  title: "STAJVELO RV01",
  description: "Urban e-bike architecture built around injected composite design, distinctive wheels and premium industrial detailing.",
  image: "/assets/projects/stajvelo-rv01/stajvelo-rv01-01-cover.webp",
  imageAlt: "STAJVELO RV01 electric bicycle render",
  tags: ["#2017", "#E-bike", "#Polymer"],
  overview:
    "DOMTEKNIKA supported the polymer conception and structural development of this urban e-bike, from early architecture and wheel engineering to manufacturable product definition.",
  relatedPatents: [
    relatedPatent(
      "EP4705115A1",
      "Rim and wheel-airflow work that connects with lightweight mobility wheel development.",
    ),
  ],
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
    filter: "area-1",
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
    filter: "area-1",
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
    filter: "area-1",
    title: "Total Car",
    description: "Compact electric mobility concept focused on lightweight vehicle architecture and ecological urban transport.",
    image: "/assets/projects/totalcar-concept/totalcar-concept-01-cover.webp",
    imageAlt: "Total Car electric vehicle concept on a road",
    tags: ["#EV", "#Urban", "#EcoDesign"],
    overview:
      "Total Car extends the mobility portfolio with a small electric vehicle study, using lightweight bodywork, clean product integration and a low-footprint urban transport approach.",
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Historic ultra-light road vehicle architecture linked to compact electric mobility.",
      ),
      relatedPatent(
        "US5584510A",
        "Motor vehicle chassis principles for light structural vehicle packaging.",
      ),
      relatedPatent(
        "US5667030A",
        "Vehicle thermal-management work connected to the early lightweight road-vehicle platform.",
      ),
    ],
  },
  {
    id: "softcar",
    category: "Mobility",
    filter: "area-1",
    title: "SOFTCAR",
    description: "Ultra-low-footprint city EV concept focused on lightweight architecture, compact packaging and ecological urban mobility.",
    image: "/assets/our-story/softcar-concept.png",
    imageAlt: "SOFTCAR compact electric city vehicle concept",
    gallery: [
      "/assets/our-story/softcar-concept.png",
      "/assets/our-story/softcar-v1.png",
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
    filter: "area-1",
    title: "Folding bike & scooter",
    description: "Early folding mobility studies combining compact vehicle architecture, ergonomic mechanisms and transportable formats.",
    image: "/assets/projects/folding-bike-scooter/folding-bike-scooter-01-cover.webp",
    imageAlt: "Folding electric bicycle concept render",
    tags: ["#2011", "#Folding", "#Mobility"],
    overview:
      "A set of folding e-bike and scooter concepts focused on hinge mechanisms, compact storage volume, ergonomic riding positions and manufacturable mechanical assemblies.",
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Compact road-vehicle transformation principle used as historical lightweight mobility context.",
      ),
    ],
  },
  {
    id: "aventor-drone",
    category: "Mobility",
    filter: "area-1",
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
    category: "Medical & Dental",
    filter: "area-2",
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
    category: "Medical & Dental",
    filter: "area-2",
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
    category: "Medical & Dental",
    filter: "area-2",
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
    category: "Medical & Dental",
    filter: "area-2",
    title: "Paradigm Spine",
    description: "Spinal implant and instrumentation development supported by product rendering and mechanical simulation.",
    image: "/assets/projects/paradigm-spine/paradigm-spine-01-cover.webp",
    imageAlt: "Paradigm Spine implant set render",
    tags: ["#2015", "#Spine", "#Simulation"],
    overview:
      "A medical implant project combining precision part design, kit presentation and finite element analysis for load-critical spinal hardware.",
    relatedPatents: [
      relatedPatent(
        "US2015342657A1",
        "Bone fixation assembly connected to spinal implant and fixation-system development.",
      ),
      relatedPatent(
        "EP3185821A1",
        "Orthopaedic impactor body relevant to surgical instrumentation mechanics.",
      ),
      relatedPatent(
        "US2016000570A1",
        "Polymer joint implant manufacturing context for medical implant development.",
      ),
    ],
  },
  {
    id: "flex-drill",
    category: "Medical & Dental",
    filter: "area-2",
    title: "Flex Drill",
    description: "Flexible drill accessory concept with shaped polymer guide, prototype validation and stress-analysis views.",
    image: "/assets/projects/flex-drill/flex-drill-01-cover.webp",
    imageAlt: "Blue flexible drill guide concept",
    tags: ["#2014", "#Tooling", "#Analysis"],
    overview:
      "Flex Drill explores a curved drill-guide architecture, moving from mechanical stress simulation to physical prototype and product rendering.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Orthopaedic instrument patent context for precision surgical-tool mechanics.",
      ),
    ],
  },
  {
    id: "biome-staple-applicator",
    category: "Medical & Dental",
    filter: "area-2",
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
    category: "Consumer Products",
    filter: "area-3",
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
    category: "Consumer Products",
    filter: "area-3",
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
    category: "Consumer Products",
    filter: "area-3",
    title: "Smart Bottle",
    description: "Portable smart-bottle concept with integrated module, compact electronics bay and product-ready casing.",
    image: "/assets/projects/smart-bottle/smart-bottle-01-cover.webp",
    imageAlt: "Smart bottle concept with blue internal module",
    tags: ["#2014", "#SmartProduct", "#CAD"],
    overview:
      "A compact product architecture study for a connected bottle or dosing module, including casing design and internal component packaging.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Filtration cartridge quality-control logic for a vessel with integrated sensing.",
      ),
      relatedPatent(
        "USD560092S",
        "Carafe design reference connected to vessel and drinking-product form studies.",
      ),
      relatedPatent(
        "USD568097S",
        "Filter accessory design reference for carafe and vessel systems.",
      ),
    ],
  },
  {
    id: "glove-helmet-dryer",
    category: "Consumer Products",
    filter: "area-3",
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
    category: "Consumer Products",
    filter: "area-3",
    title: "Folding umbrella",
    description: "Compact umbrella mechanism with case studies, folding geometry and working prototype details.",
    image: "/assets/projects/folding-umbrella/folding-umbrella-01-cover.webp",
    imageAlt: "Yellow folding umbrella prototype",
    tags: ["#2018", "#Mechanism", "#Consumer"],
    overview:
      "The project explores a new folding umbrella architecture, from case cutaways and mechanism studies to full-scale physical prototypes.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Bad-weather and sun-protection frame patent connected to deployable protection mechanisms.",
      ),
      relatedPatent(
        "WO2021043427A1",
        "Housing architecture for a weather-protection device.",
      ),
    ],
  },
  {
    id: "skincare-applicator",
    category: "Consumer Products",
    filter: "area-3",
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
    category: "Consumer Products",
    filter: "area-3",
    title: "Alicoffee machine",
    description: "Countertop coffee machine concept built around a double-pass capsule circuit, where water makes an out-and-back path through the capsule.",
    image: "/assets/projects/alicoffee-machine/alicoffee-machine-01-cover.webp",
    imageAlt: "Alicoffee countertop machine concept render",
    tags: ["#2014", "#Coffee", "#Capsule", "#Fluidics"],
    overview:
      "Alicoffee studies a compact beverage appliance where water does not simply flow straight through the capsule. It follows an out-and-back path inside the capsule, creating a double pass intended to make better use of the dose. This fluidic logic connects the industrial design to related patented work around capsule chambers, portion handling and pressurized beverage flow.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Capsule-based beverage production chamber where liquid interacts with the ingredient inside the capsule.",
      ),
      relatedPatent(
        "EP2745749A1",
        "Drink-preparation device with capsule or pad chamber, supply line and discharge line.",
      ),
      relatedPatent(
        "CH700288A2",
        "Automatic hot-beverage machine with portion chamber handling and ejection after extraction.",
      ),
      relatedPatent(
        "EP1744653A1",
        "DOMTEKNIKA beverage jet device using pressurized water through a permeable pouch.",
      ),
    ],
  },
  {
    id: "instant-coffee-dispenser",
    category: "Consumer Products",
    filter: "area-3",
    title: "Instant coffee dispenser",
    description: "Prototype appliance for soluble coffee dosing, tested with consumer packaging and physical mockups.",
    image: "/assets/projects/instant-coffee-dispenser/instant-coffee-dispenser-01-cover.webp",
    imageAlt: "Instant coffee dispenser prototype with hand interaction",
    tags: ["#2006", "#Appliance", "#Prototype"],
    overview:
      "A physical prototype project focused on soluble coffee handling, dosing ergonomics and a compact appliance form factor.",
    relatedPatents: [
      relatedPatent(
        "AU2014274521A1",
        "Frothed liquid preparation from soluble ingredients and diluent.",
      ),
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
    category: "Industrial Systems",
    filter: "area-4",
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
      relatedPatent(
        "CH707437A1",
        "Anti-reflective treatment principle for visible-spectrum watch movement invisibility.",
      ),
    ],
  },
  {
    id: "velum-sky-screen",
    category: "Architecture & Environment",
    filter: "area-5",
    title: "Velum SKY screen mechanism",
    description: "Architectural mechanism prototype for a screen or facade element, photographed as a precision mechanical assembly.",
    image: "/assets/projects/velum-sky-screen/velum-sky-screen-01-cover.webp",
    imageAlt: "Velum SKY mechanical screen prototype on a dark studio background",
    tags: ["#2025", "#Architecture", "#Mechanism"],
    overview:
      "Velum SKY is represented here through a high-precision mechanical assembly, suggesting an architectural or environmental screen mechanism requiring robust motion and clean detailing.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Frame architecture for bad-weather and sun-protection systems.",
      ),
      relatedPatent(
        "WO2021043427A1",
        "Protective device housing relevant to screen and environmental-protection mechanisms.",
      ),
    ],
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
    relatedPatents: [
      relatedPatent(
        "EP4705115A1",
        "Travail sur jante et flux d'air relié au développement de roues légères pour la mobilité.",
      ),
    ],
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
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Architecture historique de véhicule routier ultra-léger liée à la mobilité électrique compacte.",
      ),
      relatedPatent(
        "US5584510A",
        "Principe de châssis automobile pour packaging structurel léger.",
      ),
      relatedPatent(
        "US5667030A",
        "Travail de gestion thermique véhicule lié à la plateforme routière légère.",
      ),
    ],
  },
  softcar: {
    category: "Mobilité",
    title: "SOFTCAR",
    description: "Concept de véhicule électrique urbain à très faible empreinte, centré sur une architecture légère, un packaging compact et une mobilité écologique.",
    imageAlt: "Concept de véhicule électrique urbain compact SOFTCAR",
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
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Principe historique de véhicule compact transformable utilisé comme contexte mobilité légère.",
      ),
    ],
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
    category: "Médical & dentaire",
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
    category: "Médical & dentaire",
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
    category: "Médical & dentaire",
    title: "Stylo à insuline",
    description: "Études de boîtier et de packaging mécanisme pour un dispositif médical fin et industrialisable.",
    imageAlt: "Rendu de stylo à insuline bleu",
    overview:
      "Ce projet se concentre sur un produit médical au format stylo, en équilibrant contraintes de mécanisme interne, prise en main et design industriel épuré.",
  },
  "paradigm-spine": {
    category: "Médical & dentaire",
    description: "Développement d'implant et d'instrumentation rachidienne avec rendu produit et simulation mécanique.",
    imageAlt: "Rendu d'un kit d'implants Paradigm Spine",
    overview:
      "Projet d'implant médical combinant conception de pièces de précision, présentation de kit et analyse par éléments finis pour du matériel spinal chargé mécaniquement.",
    relatedPatents: [
      relatedPatent(
        "US2015342657A1",
        "Assemblage de fixation osseuse lié au développement d'implants et systèmes de fixation rachidiens.",
      ),
      relatedPatent(
        "EP3185821A1",
        "Corps impacteur orthopédique pertinent pour la mécanique d'instrumentation chirurgicale.",
      ),
      relatedPatent(
        "US2016000570A1",
        "Contexte de fabrication d'implants articulaires polymères pour le développement médical.",
      ),
    ],
  },
  "flex-drill": {
    category: "Médical & dentaire",
    description: "Concept d'accessoire de perçage flexible avec guide polymère, validation prototype et vues d'analyse de contraintes.",
    imageAlt: "Concept de guide de perçage flexible bleu",
    overview:
      "Flex Drill explore une architecture de guide de perçage courbe, depuis la simulation mécanique jusqu'au prototype physique et au rendu produit.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Contexte brevet d'instrument orthopédique pour la mécanique d'outils chirurgicaux de précision.",
      ),
    ],
  },
  "biome-staple-applicator": {
    category: "Médical & dentaire",
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
    category: "Produits consumer",
    description: "Nettoyeur automatique de lunettes avec architecture compacte à tiroir et finition de produit grand public.",
    imageAlt: "Nettoyeur de lunettes automatique Cliris noir ouvert",
    overview:
      "Cliris combine chambre de nettoyage compacte, mouvement de tiroir et surfaces visibles dans un produit conçu pour un entretien fiable et hygiénique des lunettes.",
  },
  ikitty: {
    category: "Produits consumer",
    description: "Produit d'enrichissement pour chat avec architecture de capsule rechargeable, mécanisme feeder et design doux.",
    imageAlt: "Prototype de dispositif iKitty pour chat",
    overview:
      "Le concept iKitty intègre capsules rechargeables, mécanique interne de distribution et langage produit reconnaissable dans un objet consumer fabricable.",
  },
  "smart-bottle": {
    category: "Produits consumer",
    title: "Smart Bottle",
    description: "Concept de bouteille intelligente portable avec module intégré, baie électronique compacte et boîtier produit.",
    imageAlt: "Concept Smart Bottle avec module interne bleu",
    overview:
      "Étude d'architecture pour bouteille connectée ou module de dosage, incluant conception de boîtier et intégration des composants internes.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Logique de contrôle de qualité d'une cartouche filtrante dans un récipient avec détection intégrée.",
      ),
      relatedPatent(
        "USD560092S",
        "Référence de design de carafe liée aux études de récipients et produits de boisson.",
      ),
      relatedPatent(
        "USD568097S",
        "Référence de design d'accessoire filtrant pour systèmes de carafe et récipient.",
      ),
    ],
  },
  "glove-helmet-dryer": {
    category: "Produits consumer",
    title: "Sèche-gants & casque",
    description: "Concept de station de séchage pour équipement sportif, développé du layout CAO aux essais sur prototype physique.",
    imageAlt: "Prototype de sèche-gants avec gants montés",
    overview:
      "Ce produit intègre les chemins d'air et supports pour gants et casques dans une station compacte, avec concepts rendus et prototypes physiques.",
  },
  "folding-umbrella": {
    category: "Produits consumer",
    title: "Parapluie pliant",
    description: "Mécanisme de parapluie compact avec études d'étui, géométrie de pliage et détails de prototype fonctionnel.",
    imageAlt: "Prototype de parapluie pliant jaune",
    overview:
      "Le projet explore une nouvelle architecture de parapluie pliant, depuis les coupes d'étui et études mécanisme jusqu'aux prototypes physiques.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Brevet de cadre pour protection pluie/soleil lié aux mécanismes de protection déployables.",
      ),
      relatedPatent(
        "WO2021043427A1",
        "Architecture de boîtier pour dispositif de protection contre les intempéries.",
      ),
    ],
  },
  "skincare-applicator": {
    category: "Produits consumer",
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
    category: "Produits consumer",
    description: "Concept de machine à café de comptoir basé sur un circuit capsule double passage, où l'eau fait un aller-retour dans la capsule.",
    imageAlt: "Rendu du concept de machine de comptoir Alicoffee",
    overview:
      "Alicoffee étudie un appareil de boisson compact où l'eau ne traverse pas simplement la capsule en ligne droite. Elle effectue un aller-retour dans la capsule, avec un double passage pensé pour mieux exploiter la dose. Cette logique fluidique relie le design industriel aux brevets liés aux chambres capsule, à la gestion des portions et au flux de boisson sous pression.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Chambre de production à capsule où le liquide interagit avec l'ingrédient contenu dans la capsule.",
      ),
      relatedPatent(
        "EP2745749A1",
        "Dispositif de préparation de boisson avec chambre capsule/pad, ligne d'alimentation et ligne de sortie.",
      ),
      relatedPatent(
        "CH700288A2",
        "Machine automatique à boisson chaude avec gestion de chambre de portion et éjection après extraction.",
      ),
      relatedPatent(
        "EP1744653A1",
        "Dispositif DOMTEKNIKA de jet de boisson utilisant de l'eau sous pression à travers une pochette perméable.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "Produits consumer",
    title: "Distributeur de café soluble",
    description: "Prototype d'appareil pour dosage de café soluble, testé avec packaging consumer et maquettes physiques.",
    imageAlt: "Prototype de distributeur de café soluble en interaction main",
    overview:
      "Projet prototype centré sur la manipulation du café soluble, l'ergonomie de dosage et un format d'appareil compact.",
    relatedPatents: [
      relatedPatent(
        "AU2014274521A1",
        "Préparation de liquide moussé depuis ingrédients solubles et diluant.",
      ),
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
    category: "Systèmes industriels",
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
      relatedPatent(
        "CH707437A1",
        "Principe de traitement antireflet pour invisibilité dans le spectre visible.",
      ),
    ],
  },
  "velum-sky-screen": {
    category: "Architecture & environnement",
    title: "Mécanisme Velum SKY",
    description: "Prototype de mécanisme architectural pour écran ou élément de façade, photographié comme assemblage mécanique de précision.",
    imageAlt: "Prototype mécanique Velum SKY sur fond studio sombre",
    overview:
      "Velum SKY est représenté ici par un assemblage mécanique de précision, suggérant un mécanisme architectural ou environnemental demandant mouvement robuste et détails propres.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Architecture de cadre pour systèmes de protection pluie/soleil.",
      ),
      relatedPatent(
        "WO2021043427A1",
        "Boîtier de dispositif de protection pertinent pour mécanismes d'écran et de protection environnementale.",
      ),
    ],
  },
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
  return locale === "fr" ? "fr" : "en";
}

const PINNED_PROJECT_IDS = [
  "aventor",
  "totalcar-concept",
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

const PROJECT_SCOPES: Record<string, Record<ProjectsLocale, string[]>> = {
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
  return {
    ...project,
    scope: PROJECT_SCOPES[project.id]?.[locale],
  };
}

export function getProjectsForLocale(locale: string) {
  const resolvedLocale = resolveProjectsLocale(locale);
  return resolvedLocale === "fr"
    ? ALL_PROJECTS.map((project) =>
        withProjectScope(localizeProject(project, FR_PROJECT_OVERRIDES), "fr"),
      )
    : ALL_PROJECTS.map((project) => withProjectScope(project, "en"));
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
    filtersLabel: "Filter projects",
    searchLabel: "Search projects",
    searchPlaceholder: "Search...",
    noResults: "No projects match your search.",
    featuredLabel: "Featured project",
    viewCaseStudy: "View case study",
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
      { key: "all", label: "Tous les projets" },
      { key: "area-1", label: "Mobilité" },
      { key: "area-2", label: "Médical & dentaire" },
      { key: "area-3", label: "Produits consumer" },
      { key: "area-4", label: "Systèmes industriels" },
      { key: "area-5", label: "Architecture & environnement" },
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
    filtersLabel: "Filtrer les projets",
    searchLabel: "Rechercher des projets",
    searchPlaceholder: "Rechercher...",
    noResults: "Aucun projet ne correspond à votre recherche.",
    featuredLabel: "Projet phare",
    viewCaseStudy: "Voir le cas",
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
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
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

  const closeProject = useCallback(() => {
    if (!selectedProject || dialogState === "closing") return;

    clearCloseTimer();
    setDialogState("closing");

    closeTimerRef.current = window.setTimeout(
      finishClose,
      MODAL_CLOSE_FALLBACK_MS,
    );
  }, [clearCloseTimer, dialogState, finishClose, selectedProject]);

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
