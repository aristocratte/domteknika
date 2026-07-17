"use client";

import Image from "next/image";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import { PatentDialog } from "@/components/sections/patent-dialog";
import {
  PATENTS,
  type PatentFilterKey,
  type PatentRecord,
} from "@/data/patents";
import { cn } from "@/lib/utils";
import projectAssetManifest from "../../../public/assets/projects/manifest.json";

type FilterKey = "all" | PatentFilterKey;
type ProjectSortKey =
  "default" | "date-desc" | "date-asc" | "title-asc" | "title-desc";

const PATENT_ASSET_BASE = "/assets/patent-page";
const PROJECT_LIGHTBOX_FRAME_CLASS =
  "relative h-[min(82vh,620px)] w-[min(92vw,900px)] touch-pan-y md:h-[min(70vh,560px)] md:w-[min(74vw,840px)] lg:w-[min(64vw,820px)]";
const PROJECT_LIGHTBOX_IMAGE_SIZES =
  "(max-width: 768px) 92vw, (max-width: 1024px) 74vw, 820px";
const PROJECT_IMAGE_ZOOM_SELECTOR = "[data-project-image-zoom]";

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
    title:
      "Device and method for producing a frothed liquid from soluble ingredients and diluent",
  },
  EP2000065A1: {
    publication: "EP2000065 (A1)",
    title:
      "Device and method for producing a beverage by mixing soluble ingredients and a diluent",
  },
  US2010173057A1: {
    publication: "US2010173057 (A1)",
    title:
      "DEVICE AND METHOD FOR PRODUCING A FROTHED LIQUID FROM SOLUBLE INGREDIENTS AND DILUENT",
  },
  US2009320941A1: {
    publication: "US2009320941 (A1)",
    title: "MULTI-WAY VALVE DEVICE",
  },
  CH701083B1: {
    publication: "CH701083 (B1)",
    title:
      "Dispositif pour le détartrage et le blanchiment simultané des dents",
  },
  US2015360014A1: {
    publication: "US2015360014 (A1)",
    title: "Applicator and capsule for such applicator",
  },
  FR2999439A1: {
    publication: "FR2999439 (A1)",
    title:
      "DISPOSITIF DE DISTRIBUTION D'UN PRODUIT ET D'EMISSION D'UN RAYONNEMENT LUMINEUX",
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
    title:
      "OPTICAL METHOD FOR MAKING AT LEAST ONE COMPONENT OF A WATCH MOVEMENT INVISIBLE",
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
    title:
      "METHOD AND DEVICE FOR CONTROLLING THE QUALITY OF A FILTRATION CARTRIDGE",
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

const RELATED_PATENT_NOTE_TRANSLATIONS: Partial<
  Record<ProjectsLocale, Partial<Record<RelatedPatentId, string>>>
> = {
  de: {
    CH701083B1:
      "Patentkontext für die Zahnreinigung und Aufhellung über eine Kartuschen- und Strahlarchitektur.",
    EP2000065A1:
      "Mischkammer- und Luftführungsprinzipien für Getränke aus löslichen Zutaten.",
    EP3185821A1:
      "Patentkontext für orthopädische Chirurgiewerkzeuge rund um Impaktor- und Reamer-Instrumente.",
    EP3261867A2:
      "Direkter Aventor-SA-Patentkontext für die Architektur eines elektrischen Einsitzers.",
    EP3744622A1: "Patentfamilie zur Fahrzeugarchitektur der SOFTCAR-Plattform.",
    EP3393889A1:
      "Frühere SOFTCAR-Fahrzeugarchitektur mit leichtem Struktur- und Karosseriekonzept.",
    EP4488027A1:
      "Verstärktes Rotomolding-Verfahren für leichte Fahrzeugkarosserieteile.",
    EP4680511A1:
      "Recycelbare Lenkradarchitektur für Fahrzeuginterieurs mit geringer Umweltwirkung.",
    EP4705115A1:
      "SOFTCAR-Felgendeflektor für Radluftführung und aerodynamische Radabdeckung.",
    FR2999439A1:
      "Spende- und Lichtemissionsprinzipien für eine präzise kosmetische Anwendung.",
    US2009320941A1:
      "Mehrwegeventil- und Dosierlogik für kompakte Getränkesysteme.",
    US2010173057A1:
      "Herstellung einer aufgeschäumten Flüssigkeit aus löslichen Zutaten und Verdünnungsmittel.",
    US2011061534A1:
      "Kapselbasierter Getränkekontext für den doppelten Wasserweg durch die Kapsel.",
    US2015342657A1:
      "Fixierungs- und Lastübertragungskontext für belastungskritische biomedizinische Baugruppen.",
    US2015360014A1:
      "Applikator- und Kapselsystem für austauschbare Produktzufuhr.",
    US2016000570A1:
      "Fertigungsrahmen für polymerbasierte Gelenkimplantate und biomedizinische Präzisionsteile.",
    US2022338602A1:
      "Ausklappbarer Rahmen für ein Wetter- und Sonnenschutzsystem.",
    US2024326565A1:
      "Türsystem für komplexe Fahrzeuggeometrie und kompakten Zugang.",
    US2025129628A1:
      "Konzept einer Automobilfabrik mit kleiner CO2-Bilanz, verbunden mit der Industrialisierungsstrategie.",
    US5584510A:
      "Chassisprinzipien für Strukturintegration und Energieaufnahme in einem kompakten Fahrzeug.",
    US5667030A:
      "Wärmetauscher für die Kühlung, integriert in eine leichte Fahrzeugarchitektur.",
    US6015022A:
      "Ultraleichte elektrische Straßenfahrzeugarchitektur mit zentralem Träger und kompakter Radstandsstrategie.",
    USD560092S: "Designpatent für die Form der Karaffe.",
    USD568097S: "Designpatent für das Filterzubehör der Karaffe.",
    WO2008017182A1:
      "Qualitätskontrolle für eine Filterkartusche in einem Gefäß für gefiltertes Wasser.",
    WO2016004540A1:
      "Optisches Verfahren, um Komponenten eines Uhrwerks unsichtbar oder sehr diskret erscheinen zu lassen.",
    WO2021043427A1: "Gehäusekontext für Wetter- und Sonnenschutzsysteme.",
    WO2026078588A1:
      "Ultraleichtes, recycelbares Armaturenbrett mit integrierten geformten Funktionen und Luftkanälen.",
  },
  es: {
    CH701083B1:
      "Contexto de patente para limpieza y blanqueamiento dental mediante arquitectura de cartucho y chorro.",
    EP2000065A1:
      "Principios de cámara de mezcla y gestión de aire para bebidas a partir de ingredientes solubles.",
    EP3185821A1:
      "Contexto de patente de instrumental ortopédico para instrumentos relacionados con impactores y fresas.",
    EP3261867A2:
      "Contexto directo de patente de Aventor SA para la arquitectura de un vehículo eléctrico monoplaza.",
    EP3744622A1:
      "Familia de patentes de arquitectura de vehículo para la plataforma SOFTCAR.",
    EP3393889A1:
      "Arquitectura de vehículo SOFTCAR anterior, centrada en estructura ligera y carrocería.",
    EP4488027A1:
      "Proceso de carrocería rotomoldeada reforzada para piezas ligeras de vehículo.",
    EP4680511A1:
      "Arquitectura de volante reciclable alineada con interiores de bajo impacto.",
    EP4705115A1:
      "Deflector de llanta SOFTCAR para flujo de aire en la rueda e integración aerodinámica.",
    FR2999439A1:
      "Principios de dosificación y emisión luminosa para una aplicación cosmética precisa.",
    US2009320941A1:
      "Lógica de válvula multivía y dosificación para sistemas compactos de bebida.",
    US2010173057A1:
      "Producción de líquido espumado a partir de ingredientes solubles y diluyente.",
    US2011061534A1:
      "Contexto de preparación de bebida en cápsula para el recorrido doble del agua dentro de la cápsula.",
    US2015342657A1:
      "Contexto de fijación y transferencia de carga para conjuntos biomédicos sometidos a esfuerzo.",
    US2015360014A1:
      "Sistema de aplicador y cápsula para alimentación reemplazable de producto.",
    US2016000570A1:
      "Marco de fabricación para implantes articulares poliméricos y piezas biomédicas de precisión.",
    US2022338602A1:
      "Estructura desplegable para un sistema de protección contra lluvia y sol.",
    US2024326565A1:
      "Sistema de puerta para geometría compleja de carrocería y acceso compacto.",
    US2025129628A1:
      "Concepto de planta automotriz de baja huella de carbono conectado con la estrategia de industrialización.",
    US5584510A:
      "Principios de chasis para integración estructural y absorción de energía en un vehículo compacto.",
    US5667030A:
      "Intercambiador térmico de refrigeración integrado en una arquitectura de vehículo ligera.",
    US6015022A:
      "Arquitectura de vehículo eléctrico ultraligero con viga central y estrategia de distancia entre ejes compacta.",
    USD560092S: "Patente de diseño de la forma de la jarra.",
    USD568097S: "Patente de diseño del accesorio filtrante de la jarra.",
    WO2008017182A1:
      "Control de calidad de un cartucho de filtración integrado en una jarra de agua filtrada.",
    WO2016004540A1:
      "Método óptico para hacer que componentes de un movimiento relojero sean invisibles o muy discretos.",
    WO2021043427A1:
      "Contexto de carcasa para sistemas de protección contra lluvia y sol.",
    WO2026078588A1:
      "Salpicadero ultraligero y reciclable que integra funciones moldeadas y circuitos de aire.",
  },
  ko: {
    CH701083B1:
      "카트리지와 분사 구조를 이용한 치아 세정 및 미백 장치의 특허 맥락입니다.",
    EP2000065A1:
      "용해성 원료 기반 음료를 위한 혼합 챔버와 공기 흐름 설계 원리입니다.",
    EP3185821A1:
      "임팩터와 리머 계열 수술 기구에 관련된 정형외과 수술 도구 특허 맥락입니다.",
    EP3261867A2:
      "전기 단좌 차량 아키텍처에 관한 Aventor SA의 직접 특허 맥락입니다.",
    EP3744622A1: "SOFTCAR 플랫폼에 연결된 차량 아키텍처 특허군입니다.",
    EP3393889A1:
      "경량 구조와 차체 콘셉트에 초점을 둔 초기 SOFTCAR 차량 아키텍처입니다.",
    EP4488027A1: "경량 차량 부품을 위한 보강 회전성형 차체 공정입니다.",
    EP4680511A1:
      "저영향 차량 인테리어에 맞춘 재활용 가능 스티어링 휠 아키텍처입니다.",
    EP4705115A1:
      "휠 주변 공기 흐름과 공력 휠 커버 통합을 위한 SOFTCAR 림 디플렉터 작업입니다.",
    FR2999439A1: "정밀한 화장품 도포를 위한 제품 분배와 광 방출 원리입니다.",
    US2009320941A1:
      "소형 음료 시스템을 위한 다방향 밸브와 정량 제어 로직입니다.",
    US2010173057A1:
      "용해성 원료와 희석액으로 거품 액체를 만드는 제조 원리입니다.",
    US2011061534A1:
      "캡슐 내부를 왕복하는 물의 이중 경로와 관련된 캡슐 음료 제조 맥락입니다.",
    US2015342657A1:
      "하중이 중요한 생체의료 조립체의 고정과 하중 전달 맥락입니다.",
    US2015360014A1:
      "교체 가능한 제품 공급을 위한 애플리케이터와 캡슐 시스템입니다.",
    US2016000570A1:
      "폴리머 기반 관절 임플란트와 정밀 생체의료 부품의 제조 맥락입니다.",
    US2022338602A1:
      "비와 햇빛 보호 시스템을 위한 전개식 프레임 특허 맥락입니다.",
    US2024326565A1:
      "복잡한 차체 형상과 컴팩트한 접근성을 위한 차량 도어 시스템입니다.",
    US2025129628A1: "산업화 전략과 연결된 저탄소 자동차 공장 개념입니다.",
    US5584510A:
      "소형 차량의 구조 패키징과 충격 에너지 관리를 위한 섀시 원리입니다.",
    US5667030A: "경량 차량 아키텍처에 통합된 냉각용 열교환기입니다.",
    US6015022A:
      "중앙 빔 섀시와 짧은 휠베이스 전략을 갖춘 초경량 전기 도로 차량 아키텍처입니다.",
    USD560092S: "카라프 형태에 관한 디자인 특허입니다.",
    USD568097S: "카라프 필터 액세서리에 관한 디자인 특허입니다.",
    WO2008017182A1:
      "정수 용기에 통합된 필터 카트리지 품질 관리 방법과 장치입니다.",
    WO2016004540A1:
      "시계 무브먼트 부품을 보이지 않거나 매우 절제되어 보이게 하는 광학 방법입니다.",
    WO2021043427A1: "비와 햇빛 보호 시스템을 위한 하우징 특허 맥락입니다.",
    WO2026078588A1:
      "성형 기능과 공기 회로를 통합한 초경량 재활용 가능 대시보드입니다.",
  },
  zh: {
    CH701083B1: "通过胶囊和喷射结构实现牙齿清洁与美白的专利背景。",
    EP2000065A1: "用于可溶性原料饮品的混合腔和气流管理原理。",
    EP3185821A1: "与冲击器和铰刀类外科器械相关的骨科手术工具专利背景。",
    EP3261867A2: "Aventor SA 关于电动单座车辆架构的直接专利背景。",
    EP3744622A1: "面向 SOFTCAR 平台的车辆架构专利族。",
    EP3393889A1: "早期 SOFTCAR 车辆架构，聚焦轻量结构和车身概念。",
    EP4488027A1: "用于轻量化车辆部件的增强滚塑车身工艺。",
    EP4680511A1: "面向低影响车辆内饰的可回收方向盘架构。",
    EP4705115A1: "SOFTCAR 轮辋导流件，用于车轮气流和空气动力轮罩集成。",
    FR2999439A1: "用于精准化妆品施用的产品分配和发光原理。",
    US2009320941A1: "用于紧凑饮品系统的多路阀和定量控制逻辑。",
    US2010173057A1: "由可溶性原料和稀释液制备发泡液体的原理。",
    US2011061534A1: "与水在胶囊内往返双通道流动相关的胶囊饮品制备背景。",
    US2015342657A1: "面向承载关键生物医疗组件的固定和载荷传递背景。",
    US2015360014A1: "用于可替换产品供给的施用器和胶囊系统。",
    US2016000570A1: "聚合物关节植入物和精密生物医疗部件的制造背景。",
    US2022338602A1: "用于防雨和遮阳保护系统的可展开框架专利背景。",
    US2024326565A1: "适用于复杂车身几何和紧凑出入空间的车门系统。",
    US2025129628A1: "与工业化策略相关的低碳汽车工厂概念。",
    US5584510A: "紧凑车辆中用于结构集成和能量吸收的底盘原理。",
    US5667030A: "集成在轻量化车辆架构中的冷却热交换器。",
    US6015022A: "采用中央梁底盘和紧凑轴距策略的超轻电动道路车辆架构。",
    USD560092S: "覆盖滤水壶外形的设计专利。",
    USD568097S: "覆盖滤水壶过滤附件的设计专利。",
    WO2008017182A1: "用于滤水容器中滤芯质量控制的方法和装置。",
    WO2016004540A1: "使手表机芯部件不可见或非常低调的光学方法。",
    WO2021043427A1: "用于防雨和遮阳保护系统的外壳专利背景。",
    WO2026078588A1: "集成成型功能和空气回路的超轻可回收仪表板。",
  },
};

type ProjectStat = {
  label: string;
  value: string;
  detail?: string;
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

type ProjectSortOption = {
  key: ProjectSortKey;
  label: string;
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
  sort: {
    label: string;
    options: ProjectSortOption[];
  };
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  featuredLabel: string;
  viewCaseStudy: string;
  cardOpenDetails: string;
  modal: {
    close: string;
    openImage: string;
    closeImage: string;
    previousImage: string;
    nextImage: string;
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
    width: 32,
    height: 28,
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

function projectFiltersWithLabels(
  labels: Partial<Record<FilterKey, string>>,
): ProjectFilterOption[] {
  return FILTERS.map((filter) => ({
    ...filter,
    label: labels[filter.key] ?? filter.label,
  }));
}

export const FEATURED_PROJECT: Project = {
  id: "stajvelo-rv01",
  category: "Mobility",
  filter: "mobility",
  title: "STAJVELO RV01",
  description:
    "Urban e-bike architecture built around injected composite design, distinctive wheels and premium industrial detailing.",
  image: "/assets/projects/stajvelo-rv01/stajvelo-rv01-01.webp",
  imageAlt: "STAJVELO RV01 electric bicycle on a road circuit",
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
    description:
      "High-performance electric vehicle platform developed around speed, acceleration and lightweight composite bodywork.",
    image: "/assets/projects/aventor/aventor-01.webp",
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
    description:
      "Compact electric mobility concept explored through CAD, prototype builds and winter-use product studies.",
    image: "/assets/projects/weebot/weebot-01.webp",
    imageAlt: "Weebot compact snow mobility concept",
    tags: ["#2014", "#Mobility", "#Prototype"],
    overview:
      "The project covers product architecture, mechanical packaging and prototype development for a small electric mobility platform intended for demanding outdoor use cases.",
  },
  {
    id: "sam-cree",
    category: "Mobility",
    filter: "mobility",
    title: "SAM CREE",
    description:
      "Swiss ultra-light electric three-wheeler built around tandem seating, a central chassis beam and compact urban autonomy.",
    image: "/assets/projects/sam-cree/sam-cree-01.webp",
    imageAlt: "Orange SAM CREE electric three-wheeler with open canopy",
    tags: ["#1996", "#EV", "#ThreeWheeler"],
    overview:
      "SAM CREE brings together early ultra-light electric road-vehicle architecture, with a central beam chassis, tandem packaging and component integration focused on efficient urban mobility.",
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
    id: "angel-interceptor",
    category: "Mobility",
    filter: "mobility",
    title: "Angel Interceptor",
    description:
      "High-performance electric three-wheel concept developed through CAD architecture, cockpit packaging and protective body studies.",
    image: "/assets/projects/angel-interceptor/angel-interceptor-01.webp",
    imageAlt: "Angel Interceptor three-wheel vehicle side-section CAD study",
    tags: ["#2012", "#Vehicle", "#CAD"],
    overview:
      "Angel Interceptor explores a high-performance electric three-wheel architecture, balancing tandem seating, body protection, wheel layout and mechanical packaging through CAD and prototype-oriented studies.",
  },
  {
    id: "softcar",
    category: "Mobility",
    filter: "mobility",
    title: "SOFTCAR",
    description:
      "Ultra-low-footprint city EV concept focused on lightweight architecture, compact packaging and ecological urban mobility.",
    image: "/assets/projects/softcar/softcar-01.webp",
    imageAlt: "Yellow SOFTCAR compact city vehicle with open door",
    tags: ["#2015", "#CityEV", "#Circular"],
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
        "EP3393889A1",
        "Earlier SOFTCAR vehicle architecture covering the lightweight structural and body concept.",
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
    description:
      "Early folding mobility studies combining compact vehicle architecture, ergonomic mechanisms and transportable formats.",
    image:
      "/assets/projects/folding-bike-scooter/folding-bike-scooter-01.webp",
    imageAlt: "Folding electric bicycle concept render",
    tags: ["#2011", "#Folding", "#Mobility"],
    overview:
      "A set of folding e-bike and scooter concepts focused on hinge mechanisms, compact storage volume, ergonomic riding positions and manufacturable mechanical assemblies.",
  },
  {
    id: "instant-coffee-dispenser",
    category: "Industrial",
    filter: "industrial",
    title: "Instant coffee dispenser",
    description:
      "Prototype appliance for soluble coffee dosing, tested with consumer packaging and physical mockups.",
    image:
      "/assets/projects/instant-coffee-dispenser/instant-coffee-dispenser-01.webp",
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
    id: "totalcar-concept",
    category: "Mobility",
    filter: "mobility",
    title: "Total Car",
    description:
      "Green electric vehicle prototype work focused on lightweight packaging, cabin access and compact urban mobility.",
    image:
      "/assets/projects/totalcar-concept/total-car-01.webp",
    imageAlt: "Green Total Car electric vehicle prototype on display",
    tags: ["#2011", "#EV", "#Urban", "#EcoDesign"],
    overview:
      "Total Car extends the mobility portfolio with a compact electric vehicle study, combining lightweight bodywork, prototype assembly and practical cabin-access validation for low-footprint transport.",
  },
  {
    id: "airsmile",
    category: "Medical",
    filter: "medical",
    title: "AirSmile",
    description:
      "Dental care device concept developed from product styling through functional packaging and prototype families.",
    image: "/assets/projects/airsmile/airsmile-01.webp",
    imageAlt: "AirSmile handheld dental care device render",
    tags: ["#2007", "#Dental", "#Device"],
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
    description:
      "Dental-care product concept combining a toothbrush body, O2 Cosmetics refill cartridges and internal mechanism packaging.",
    image: "/assets/projects/brossadent/o2-cosmetics-toothbrush-01.webp",
    imageAlt: "O2 Cosmetics toothbrush concept with refill cartridges",
    tags: ["#2007", "#Dental", "#Injection"],
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
    description:
      "Injection pen housing and mechanism packaging studies for a slim, manufacturable medical device.",
    image: "/assets/projects/insulin-pen/insulin-pen-01.webp",
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
    description:
      "Spinal implant and instrumentation development supported by product rendering and mechanical simulation.",
    image: "/assets/projects/paradigm-spine/paradigm-spine-01.webp",
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
    description:
      "Flexible drill accessory concept with shaped polymer guide, prototype validation and stress-analysis views.",
    image: "/assets/projects/flex-drill/flex-drill-01.webp",
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
    description:
      "Handheld applicator concept developed through sketches, structural analysis and printed prototypes.",
    image:
      "/assets/projects/biome-staple-applicator/biome-staple-applicator-01.webp",
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
    description:
      "Automatic eyeglass cleaning device with a compact drawer architecture and refined consumer-product finish.",
    image: "/assets/projects/cliris/cliris-01.webp",
    imageAlt: "Black Cliris automatic eyeglass cleaner open",
    tags: ["#2014", "#Consumer", "#Hygiene"],
    overview:
      "Cliris combines a compact cleaning chamber, drawer movement and consumer-facing surfaces in a product designed for reliable, hygienic eyeglass care.",
  },
  {
    id: "filter-carafe",
    category: "Industrial",
    filter: "industrial",
    title: "Filter Carafe",
    description:
      "Filtered-water carafe system combining product design, cartridge-accessory work and electronic cartridge-quality monitoring.",
    image: "/assets/projects/filter-carafe/filter-carafe-01.webp",
    imageAlt: "Filtered-water carafe concept with cartridge accessories",
    tags: ["#2008", "#Filtration", "#ProductDesign"],
    overview:
      "The carafe project combines the visible vessel and filter accessory design with a control principle for monitoring the quality and use state of the filtration cartridge inside the lid assembly.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Quality-control method and device for a filtration cartridge integrated into a filtered-water vessel.",
      ),
      relatedPatent("USD560092S", "Design patent covering the carafe form."),
      relatedPatent(
        "USD568097S",
        "Design patent covering the filter accessory for the carafe.",
      ),
    ],
  },
  {
    id: "ikitty",
    category: "Industrial",
    filter: "industrial",
    title: "iKitty",
    description:
      "Cat enrichment product with refill capsule architecture, feeder mechanism and soft product styling.",
    image: "/assets/projects/ikitty/ikitty-01.webp",
    imageAlt: "iKitty cat enrichment device prototype",
    tags: ["#2023", "#PetTech", "#Mechanism"],
    overview:
      "The iKitty concept packages refill capsules, internal feeding mechanics and a recognizable cat-shaped product language into a manufacturable consumer product.",
  },
  {
    id: "smart-bottle",
    category: "Medical",
    filter: "medical",
    title: "Smart Bottle",
    description:
      "Secure medical dispensing bottle for controlled opioid delivery, with biometric access, compact internal packaging and anti-tamper casing.",
    image: "/assets/projects/smart-bottle/smart-bottle-01.webp",
    imageAlt:
      "Smart Bottle medical dispenser concept with blue internal module",
    tags: ["#2014", "#Medical", "#Dosing"],
    overview:
      "A compact medical-device architecture study for a controlled drug dispenser, including dose-access logic, biometric-use constraints, casing design and internal component packaging.",
  },
  {
    id: "personal-injector",
    category: "Medical",
    filter: "medical",
    title: "Personal Injector",
    description:
      "Connected personal-injection device concept focused on compatibility, no needle handling, compact kinematics and a single-use syringe.",
    image: "/assets/projects/personal-injector/personal-injector-01.webp",
    imageAlt: "Personal injector medical device concept",
    tags: ["#2013", "#Medical", "#Connected"],
    overview:
      "Presented in the medical portfolio as a SwissMedDev Start Up Prize 2013 project, the Personal Injector addresses safer self-injection through compact mechanics, connected-device logic, compatibility constraints and no direct needle handling.",
  },
  {
    id: "acetabular-reamer-holder",
    category: "Medical",
    filter: "medical",
    title: "Acetabular Reamer Holder",
    description:
      "PEEK surgical reamer handle and cover development for acetabular surgery, supported by design, FEA and injection-molding constraints.",
    image:
      "/assets/projects/acetabular-reamer-holder/acetabular-reamer-holder-01.webp",
    imageAlt: "Acetabular reamer holder prototype in orange and black PEEK",
    tags: ["#2014", "#PEEK", "#SurgicalTool"],
    overview:
      "This medical tooling project covers a PEEK handle and protective cover for an acetabular reamer, combining detailed design, finite-element analysis, injection-molding feasibility and high-stiffness requirements for a hygienic surgical instrument.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Orthopaedic surgery tooling patent context for impactor and reamer-related surgical instruments.",
      ),
    ],
  },
  {
    id: "single-use-turbine",
    category: "Medical",
    filter: "medical",
    title: "Single Use Turbine",
    description:
      "Single-use medical turbine concept developed to reduce size, weight and cost through material and geometry optimization.",
    image:
      "/assets/projects/single-use-turbine/single-use-turbine-01.webp",
    imageAlt: "Transparent single-use turbine medical component",
    tags: ["#2011", "#SingleUse", "#Medical"],
    overview:
      "The Single Use Turbine is documented in the medical portfolio as a compact disposable device, with development priorities around reduced size, reduced weight, reduced cost and innovative materials.",
  },
  {
    id: "glove-helmet-dryer",
    category: "Industrial",
    filter: "industrial",
    title: "Glove & helmet dryer",
    description:
      "Drying dock concept for sports equipment, developed from CAD layout to physical prototype tests.",
    image:
      "/assets/projects/glove-helmet-dryer/glove-helmet-dryer-01.webp",
    imageAlt: "Prototype glove dryer with gloves mounted",
    tags: ["#2015", "#Consumer", "#Prototype"],
    overview:
      "This consumer product packages airflow paths and stands for gloves and helmets into a compact dock, with both rendered concepts and physical prototypes.",
  },
  {
    id: "folding-umbrella",
    category: "Industrial",
    filter: "industrial",
    title: "Pocket folding umbrella",
    description:
      "Phone-sized folding umbrella concept with compact case studies, folding geometry and working prototype details.",
    image: "/assets/projects/folding-umbrella/pocket-folding-umbrella-01.webp",
    imageAlt: "Yellow pocket folding umbrella prototype",
    tags: ["#2018", "#Mechanism", "#Consumer"],
    overview:
      "The project explores a new folding umbrella architecture designed to fit in a pocket once closed, close to the footprint of a smartphone. The work runs from case cutaways and mechanism studies to full-scale physical prototypes.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Deployable frame architecture for a weather and sun-protection device.",
      ),
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
    description:
      "Dermocosmetic applicator concept with ergonomic handpiece, internal cartridge layout and product presentation.",
    image:
      "/assets/projects/skincare-applicator/skincare-applicator-01.webp",
    imageAlt:
      "IDlab skincare applicator with cosmetic cartridges and packaging",
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
    title: "Coffee Machine",
    description:
      "Coffee machine concept built around a double-pass capsule circuit, where water makes an out-and-back path through the capsule.",
    image: "/assets/projects/alicoffee-machine/coffee-machine-01.webp",
    imageAlt: "Coffee machine countertop concept render",
    tags: ["#2014", "#Coffee", "#Capsule", "#Fluidics"],
    overview:
      "This project is limited to the coffee-machine capsule principle: water does not simply flow straight through the capsule. It follows an out-and-back path inside the capsule, creating a double pass during extraction.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Capsule-based beverage-production context for the double-pass water path through the capsule.",
      ),
    ],
  },
  {
    id: "special-t-machine",
    category: "Industrial",
    filter: "industrial",
    title: "Tea Machine",
    description:
      "Tea-capsule brewing-unit development, from capsule handling and ejection to beverage flow and pilot-series readiness.",
    image:
      "/assets/projects/special-t-machine/tea-machine-01.webp",
    imageAlt: "Tea-machine brewing unit prototype",
    tags: ["#2008", "#Tea", "#BrewingUnit"],
    overview:
      "DOMTEKNIKA worked on the brewing unit: capsule holding, opening, detection, cinematics, ejection, beverage flow in the cup and industrial-design integration. The work supported the first pilot series of the brewing head and a vortex-based component patented to reduce vapor accumulation in the capsule.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Beverage-production device for a tea-capsule machine, also published as WO2009135899.",
      ),
    ],
  },
  {
    id: "aventor-drone",
    category: "Mobility",
    filter: "mobility",
    title: "Aventor drone",
    description:
      "Drone platform development with lightweight frame studies, assembled prototypes and field test iterations.",
    image: "/assets/projects/aventor-drone/aventor-drone-01.webp",
    imageAlt: "White Aventor drone prototype",
    tags: ["#2017", "#Drone", "#Prototype"],
    overview:
      "This drone work combines mechanical layout, payload packaging and prototype validation for a lightweight aerial product platform.",
  },
  {
    id: "vacheron-watch-mechanics",
    category: "Industrial",
    filter: "industrial",
    title: "Watch mechanics",
    description:
      "Precision horology studies combining mechanical layouts, rendered assemblies and component analysis.",
    image:
      "/assets/projects/vacheron-watch-mechanics/watch-mechanics-01.webp",
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
    description:
      "Architectural mechanism prototype for a screen or facade element, photographed as a precision mechanical assembly.",
    image: "/assets/projects/velum-sky-screen/velum-sky-screen-mechanism-01.webp",
    imageAlt:
      "Velum SKY mechanical screen prototype on a dark studio background",
    tags: ["#2025", "#Architecture", "#Mechanism"],
    overview:
      "Velum SKY is represented here through a high-precision mechanical assembly, suggesting an architectural or environmental screen mechanism requiring robust motion and clean detailing.",
  },
];

const STATS: ProjectStat[] = [
  {
    label: "Projects delivered",
    value: "100+",
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
    label: "Engineering expertise",
    value: "Multi-sector",
    icon: "/assets/project-page/stat-core-industries.png",
    width: 53,
    height: 50,
  },
  {
    label: "International projects",
    value: "Worldwide",
    icon: "/assets/project-page/stat-worldwide.png",
    width: 51,
    height: 50,
  },
  {
    label: "Swiss engineering",
    value: "Since 1998",
    icon: "/assets/patent-page/icon-calendar.png",
    width: 49,
    height: 47,
  },
];

const FR_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "Mobilité",
    description:
      "Architecture de vélo urbain électrique fondée sur une structure composite injectée, des roues distinctives et un niveau de finition haut de gamme.",
    imageAlt: "Vélo électrique STAJVELO RV01 sur circuit",
    overview:
      "DOMTEKNIKA a accompagné la conception polymère et le développement structurel de ce vélo électrique urbain, depuis l'architecture initiale et l'ingénierie des roues jusqu'à la définition industrialisable du produit.",
  },
  aventor: {
    category: "Mobilité",
    description:
      "Plateforme de véhicule électrique haute performance développée autour de la vitesse, de l'accélération et d'une carrosserie composite légère.",
    imageAlt: "Véhicule électrique vert Aventor sur circuit",
    overview:
      "Aventor associe implantation véhicule, conception composite, essais sur piste et optimisation structurelle pour une plateforme électrique compacte et performante.",
    relatedPatents: [
      relatedPatent(
        "EP3261867A2",
        "Brevet Aventor SA directement lié à l'architecture de véhicule électrique monoplace.",
      ),
    ],
  },
  weebot: {
    category: "Mobilité",
    description:
      "Concept de mobilité électrique compacte exploré par CAO, prototypes et études produit pour usage hivernal.",
    imageAlt: "Concept de mobilité neige compact Weebot",
    overview:
      "Le projet couvre l'architecture produit, l'intégration mécanique et le développement de prototypes pour une petite plateforme de mobilité électrique destinée à des usages extérieurs exigeants.",
  },
  "totalcar-concept": {
    category: "Mobilité",
    title: "Total Car",
    description:
      "Prototype de véhicule électrique vert centré sur une structure légère, l'accès à l'habitacle et la mobilité urbaine compacte.",
    imageAlt: "Prototype de véhicule électrique vert Total Car exposé",
    overview:
      "Total Car complète le portefeuille mobilité avec une étude de véhicule électrique compact, associant carrosserie légère, assemblage prototype et validation concrète de l'accès habitacle.",
  },
  "sam-cree": {
    category: "Mobilité",
    title: "SAM CREE",
    description:
      "Trois-roues électrique suisse ultra-léger autour de sièges en tandem, d'un châssis central et d'une autonomie urbaine compacte.",
    imageAlt: "Véhicule électrique à trois roues SAM CREE avec verrière ouverte",
    overview:
      "SAM CREE regroupe les premiers travaux de véhicule routier électrique ultra-léger, avec châssis poutre central, implantation des sièges en tandem et intégration des composants pour une mobilité urbaine efficiente.",
    relatedPatents: [
      relatedPatent(
        "US6015022A",
        "Architecture de véhicule routier électrique ultra-léger avec châssis poutre central et stratégie d'empattement compact.",
      ),
      relatedPatent(
        "US5584510A",
        "Principes de châssis automobile pour intégration structurelle et absorption d'énergie.",
      ),
      relatedPatent(
        "US5667030A",
        "Échangeur thermique de refroidissement intégré à une architecture véhicule légère.",
      ),
    ],
  },
  "angel-interceptor": {
    category: "Mobilité",
    description:
      "Concept électrique trois-roues haute performance développé par architecture CAO, aménagement du poste de conduite et études de carrosserie protectrice.",
    imageAlt:
      "Étude CAO en coupe latérale du véhicule trois-roues Angel Interceptor",
    overview:
      "Angel Interceptor explore une architecture électrique trois-roues haute performance, en équilibrant sièges tandem, protection de carrosserie, implantation des roues et intégration mécanique par études CAO.",
  },
  softcar: {
    category: "Mobilité",
    title: "SOFTCAR",
    description:
      "Concept de véhicule électrique urbain à très faible empreinte, centré sur une architecture légère, une intégration compacte et une mobilité écologique.",
    imageAlt: "Véhicule urbain compact jaune SOFTCAR avec porte ouverte",
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
        "EP3393889A1",
        "Architecture véhicule SOFTCAR antérieure, centrée sur la structure légère et le concept de carrosserie.",
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
    description:
      "Études de mobilité pliante combinant architecture compacte, mécanismes ergonomiques et formats transportables.",
    imageAlt: "Rendu de vélo électrique pliant",
    overview:
      "Une série de concepts vélo électrique et scooter pliants centrés sur les mécanismes de charnière, le volume de rangement, l'ergonomie et les assemblages mécaniques fabricables.",
  },
  "aventor-drone": {
    category: "Mobilité",
    title: "Drone Aventor",
    description:
      "Développement d'une plateforme drone avec études de châssis léger, prototypes assemblés et itérations terrain.",
    imageAlt: "Prototype de drone blanc Aventor",
    overview:
      "Ce travail drone combine implantation mécanique, intégration de la charge utile et validation prototype pour une plateforme aérienne légère.",
  },
  airsmile: {
    category: "Médical",
    description:
      "Concept de dispositif dentaire développé de la définition esthétique à l'intégration fonctionnelle, puis décliné en plusieurs prototypes.",
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
    description:
      "Concept de soin dentaire combinant corps de brosse à dents, cartouches O2 Cosmetics et intégration du mécanisme interne.",
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
    description:
      "Études de boîtier et d'intégration du mécanisme pour un dispositif médical fin et industrialisable.",
    imageAlt: "Rendu de stylo à insuline bleu",
    overview:
      "Ce projet se concentre sur un produit médical au format stylo, en équilibrant contraintes de mécanisme interne, prise en main et design industriel épuré.",
  },
  "paradigm-spine": {
    category: "Médical",
    description:
      "Développement d'implant et d'instrumentation rachidienne avec rendu produit et simulation mécanique.",
    imageAlt: "Rendu d'un kit d'implants Paradigm Spine",
    overview:
      "Projet d'implant rachidien combinant conception de pièces de précision, présentation du kit et analyse par éléments finis de composants soumis à de fortes contraintes mécaniques.",
    relatedPatents: [
      relatedPatent(
        "US2016000570A1",
        "Contexte de fabrication d'implants articulaires polymères pour le développement médical.",
      ),
    ],
  },
  "flex-drill": {
    category: "Médical",
    description:
      "Concept d'accessoire de perçage flexible avec guide polymère, validation prototype et vues d'analyse de contraintes.",
    imageAlt: "Concept de guide de perçage flexible bleu",
    overview:
      "Flex Drill explore une architecture de guide de perçage courbe, depuis la simulation mécanique jusqu'au prototype physique et au rendu produit.",
  },
  "biome-staple-applicator": {
    category: "Médical",
    title: "Applicateur d'agrafes biomédicales",
    description:
      "Concept d'applicateur portatif développé par croquis, analyse structurelle et prototypes imprimés.",
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
    description:
      "Nettoyeur automatique de lunettes avec architecture compacte à tiroir et finition de produit grand public.",
    imageAlt: "Nettoyeur de lunettes automatique Cliris noir ouvert",
    overview:
      "Cliris combine chambre de nettoyage compacte, mouvement de tiroir et surfaces visibles dans un produit conçu pour un entretien fiable et hygiénique des lunettes.",
  },
  "filter-carafe": {
    category: "Industrie",
    title: "Carafe filtrante",
    description:
      "Système de carafe filtrante combinant design produit, accessoire de cartouche et contrôle électronique de l'état du filtre.",
    imageAlt: "Concept de carafe filtrante avec accessoires de cartouche",
    overview:
      "Le projet associe la carafe visible et son accessoire filtrant à un principe de contrôle intégré dans le couvercle, capable de suivre l'état d'utilisation de la cartouche de filtration.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Méthode et dispositif de contrôle qualité pour cartouche de filtration intégrés à une carafe filtrante.",
      ),
      relatedPatent(
        "USD560092S",
        "Brevet de design portant sur la forme de la carafe.",
      ),
      relatedPatent(
        "USD568097S",
        "Brevet de design portant sur l'accessoire filtrant de la carafe.",
      ),
    ],
  },
  ikitty: {
    category: "Industrie",
    description:
      "Produit d'enrichissement pour chat avec capsule rechargeable, mécanisme de distribution et forme douce.",
    imageAlt: "Prototype de dispositif iKitty pour chat",
    overview:
      "Le concept iKitty intègre capsules rechargeables, mécanique interne de distribution et langage produit reconnaissable dans un objet grand public industrialisable.",
  },
  "smart-bottle": {
    category: "Médical",
    title: "Smart Bottle",
    description:
      "Distributeur médical sécurisé pour opioïdes, avec accès biométrique, architecture interne compacte et boîtier anti-effraction.",
    imageAlt:
      "Concept de distributeur médical Smart Bottle avec module interne bleu",
    overview:
      "Étude d'architecture de dispositif médical pour distribution contrôlée de médicaments, incluant logique d'accès aux doses, contraintes biométriques, conception de boîtier et intégration des composants internes.",
  },
  "personal-injector": {
    category: "Médical",
    title: "Personal Injector",
    description:
      "Concept d'injecteur personnel connecté, centré sur la compatibilité, l'absence de manipulation d'aiguille, une cinématique compacte et une seringue à usage unique.",
    imageAlt: "Concept de dispositif médical Personal Injector",
    overview:
      "Présenté dans le portfolio médical comme projet SwissMedDev Start Up Prize 2013, Personal Injector vise une auto-injection plus sûre grâce à une mécanique compacte, une logique d'objet connecté, des contraintes de compatibilité et l'absence de manipulation directe de l'aiguille.",
  },
  "acetabular-reamer-holder": {
    category: "Médical",
    title: "Porte-fraise acétabulaire",
    description:
      "Développement d'un porte-fraise et d'un capot en PEEK pour chirurgie acétabulaire, avec design, calculs éléments finis et contraintes d'injection.",
    imageAlt: "Prototype de porte-fraise acétabulaire orange et noir en PEEK",
    overview:
      "Ce projet d'outillage médical couvre un porte-fraise en PEEK et un capot de protection pour chirurgie acétabulaire, en combinant conception détaillée, analyse éléments finis, faisabilité injection et exigence de rigidité pour un instrument chirurgical hygiénique.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Brevet MPS Precimed lié aux instruments orthopédiques d'impaction et de fraisage pour chirurgie acétabulaire.",
      ),
    ],
  },
  "single-use-turbine": {
    category: "Médical",
    title: "Turbine à usage unique",
    description:
      "Concept de turbine médicale jetable développé pour réduire taille, poids et coût grâce à l'optimisation des matériaux et de la géométrie.",
    imageAlt: "Composant médical transparent de turbine à usage unique",
    overview:
      "La turbine à usage unique est documentée dans le portfolio médical comme un dispositif jetable compact, avec des priorités de développement centrées sur la réduction de taille, de poids, de coût et l'emploi de matériaux innovants.",
  },
  "glove-helmet-dryer": {
    category: "Industrie",
    title: "Sèche-gants & casque",
    description:
      "Concept de station de séchage pour équipement sportif, développé des plans CAO aux essais sur prototype physique.",
    imageAlt: "Prototype de sèche-gants avec gants montés",
    overview:
      "Ce produit intègre les chemins d'air et supports pour gants et casques dans une station compacte, avec rendus conceptuels et prototypes physiques.",
  },
  "folding-umbrella": {
    category: "Industrie",
    title: "Parapluie pliant de poche",
    description:
      "Concept de parapluie pliant au format téléphone, avec études d'étui, géométrie de pliage et détails de prototype fonctionnel.",
    imageAlt: "Prototype de parapluie pliant de poche jaune",
    overview:
      "Le projet explore une nouvelle architecture de parapluie pliant conçue pour tenir dans une poche une fois fermé, avec un encombrement proche de celui d'un smartphone. Le travail couvre les études en coupe de l'étui, la conception du mécanisme et les prototypes physiques.",
    relatedPatents: [
      relatedPatent(
        "US2022338602A1",
        "Architecture de structure déployable pour dispositif de protection contre les intempéries et le soleil.",
      ),
      relatedPatent(
        "WO2021043427A1",
        "Architecture de boîtier pour dispositif de protection contre les intempéries.",
      ),
    ],
  },
  "skincare-applicator": {
    category: "Médical",
    title: "Applicateur soin de la peau",
    description:
      "Concept d'applicateur dermocosmétique avec pièce à main ergonomique, architecture interne de cartouche et présentation produit.",
    imageAlt: "Rendu d'un applicateur dermocosmétique blanc",
    overview:
      "Système portatif de soin de la peau combinant distribution de fluide, ergonomie utilisateur, style produit et visuels prêts pour présentation.",
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
    title: "Machine à café",
    description:
      "Concept de machine à café basé sur un circuit capsule double passage, où l'eau fait un aller-retour dans la capsule.",
    imageAlt: "Rendu du concept de machine à café de comptoir",
    overview:
      "Ce projet se limite au principe capsule de la machine à café: l'eau ne traverse pas simplement la capsule en ligne droite. Elle effectue un aller-retour dans la capsule, créant un double passage pendant l'extraction.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Contexte de production de boisson à capsule pour le chemin d'eau double passage dans la capsule.",
      ),
    ],
  },
  "special-t-machine": {
    category: "Industrie",
    title: "Machine à thé",
    description:
      "Développement d'une unité d'extraction pour capsules de thé, de la gestion capsule et l'éjection jusqu'au flux boisson et à la présérie.",
    imageAlt: "Prototype d'unité d'extraction pour machine à thé",
    overview:
      "DOMTEKNIKA a travaillé sur l'unité d'extraction: maintien, ouverture, détection, cinématique et éjection de la capsule, flux boisson dans la tasse et intégration design industriel. Le projet a soutenu la première série pilote de la tête d'extraction et un composant à vortex breveté pour limiter l'accumulation de vapeur dans la capsule.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Dispositif de production de boisson pour machine à capsules de thé, également publié sous WO2009135899.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "Industrie",
    title: "Distributeur de café soluble",
    description:
      "Prototype d'appareil pour dosage de café soluble, testé avec emballages grand public et maquettes physiques.",
    imageAlt: "Prototype de distributeur de café soluble manipulé à la main",
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
    category: "Industrie",
    title: "Mécanique horlogère",
    description:
      "Études horlogères de précision combinant implantation mécanique, assemblages rendus et analyse de composants.",
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
    description:
      "Prototype de mécanisme architectural pour écran ou élément de façade, photographié comme assemblage mécanique de précision.",
    imageAlt: "Prototype mécanique Velum SKY sur fond studio sombre",
    overview:
      "Velum SKY est représenté ici par un assemblage mécanique de précision, suggérant un mécanisme architectural ou environnemental demandant mouvement robuste et détails propres.",
  },
};

const DE_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "Mobilität",
    description:
      "Urbanes Elektrofahrrad, entwickelt rund um injizierte Verbundbauweise, markante Räder und hochwertige Industriedetails.",
    imageAlt: "STAJVELO RV01 Elektrofahrrad auf einer Rennstrecke",
    overview:
      "DOMTEKNIKA unterstützte die Polymerkonzeption und Strukturentwicklung dieses urbanen Elektrofahrrads, von der frühen Architektur und Radentwicklung bis zur herstellbaren Produktdefinition.",
  },
  aventor: {
    category: "Mobilität",
    description:
      "Elektrische Hochleistungsplattform, entwickelt rund um Geschwindigkeit, Beschleunigung und leichte Verbundkarosserie.",
    imageAlt: "Grünes elektrisches Aventor-Fahrzeug auf einer Teststrecke",
    overview:
      "Aventor verbindet Fahrzeugintegration, Verbunddesign, Streckentests und strukturelle Optimierung für eine kompakte elektrische Hochleistungsplattform.",
  },
  weebot: {
    category: "Mobilität",
    description:
      "Kompaktes elektrisches Mobilitätskonzept, untersucht mit CAD, Prototypenaufbauten und Produktstudien für den Wintereinsatz.",
    imageAlt: "Kompaktes Weebot-Schneemobilitätskonzept",
    overview:
      "Das Projekt umfasst Produktarchitektur, mechanische Integration und Prototypentwicklung für eine kleine elektrische Mobilitätsplattform für anspruchsvolle Outdoor-Anwendungen.",
  },
  "totalcar-concept": {
    category: "Mobilität",
    description:
      "Kompaktes Elektromobilitätskonzept mit Fokus auf leichter Fahrzeugarchitektur und ökologischem Stadtverkehr.",
    imageAlt: "Ausgestellter grüner Total Car Elektrofahrzeug-Prototyp",
    overview:
      "Total Car erweitert das Mobilitätsportfolio um eine kleine Elektrofahrzeugstudie mit leichter Karosserie, sauberer Produktintegration und geringem urbanem Fußabdruck.",
  },
  "sam-cree": {
    category: "Mobilität",
    title: "SAM CREE",
    description:
      "Schweizer ultraleichter elektrischer Dreiradwagen mit Tandemsitzen, zentralem Trägerchassis und kompakter urbaner Reichweite.",
    imageAlt:
      "Orangefarbener elektrischer SAM CREE Dreiradwagen mit geöffnetem Dach",
    overview:
      "SAM CREE bündelt frühe Arbeiten an ultraleichten Elektrostraßenfahrzeugen: zentraler Träger, Tandem-Anordnung und Komponentenintegration für effiziente Stadtmobilität.",
  },
  "angel-interceptor": {
    category: "Mobilität",
    title: "Angel Interceptor",
    description:
      "Elektrisches Hochleistungs-Dreiradkonzept, entwickelt über CAD-Architektur, Cockpit-Package und schützende Karosseriestudien.",
    imageAlt: "CAD-Seitenstudie des dreirädrigen Angel Interceptor",
    overview:
      "Angel Interceptor untersucht eine elektrische Hochleistungs-Dreiradarchitektur und balanciert Tandemsitze, Karosserieschutz, Radlayout und mechanische Integration in CAD-Studien.",
  },
  softcar: {
    category: "Mobilität",
    description:
      "Städtisches Elektrofahrzeugkonzept mit sehr geringem Fußabdruck, leichter Architektur, kompakter Integration und ökologischer Mobilität.",
    imageAlt: "Kompaktes elektrisches Stadtfahrzeug SOFTCAR",
    overview:
      "SOFTCAR führt die Mobilitätsarbeit in kompakte Stadtelektrofahrzeuge weiter und kombiniert leichte Karosseriearchitektur, vereinfachte Baugruppen und Verkehr mit geringem ökologischem Fußabdruck.",
  },
  "folding-bike-scooter": {
    category: "Mobilität",
    title: "Faltfahrrad & Scooter",
    description:
      "Frühe Studien zu faltbarer Mobilität mit kompakter Fahrzeugarchitektur, ergonomischen Mechanismen und transportfähigen Formaten.",
    imageAlt: "Rendering eines faltbaren Elektrofahrrads",
    overview:
      "Eine Reihe von Falt-Elektrofahrrad- und Scooter-Konzepten mit Fokus auf Gelenkmechanismen, kompaktes Stauraumvolumen, ergonomische Fahrpositionen und herstellbare mechanische Baugruppen.",
  },
  "aventor-drone": {
    category: "Mobilität",
    title: "Aventor-Drohne",
    description:
      "Entwicklung einer Drohnenplattform mit leichten Rahmenstudien, montierten Prototypen und Iterationen im Feldtest.",
    imageAlt: "Weißer Aventor-Drohnenprototyp",
    overview:
      "Diese Drohnenarbeit verbindet mechanische Anordnung, Nutzlastintegration und Prototypvalidierung für eine leichte Luftplattform.",
  },
  airsmile: {
    category: "Medizin",
    description:
      "Konzept für ein Dentalgerät, entwickelt vom Produktstyling bis zur funktionalen Integration und Prototypfamilien.",
    imageAlt: "Rendering eines handgeführten AirSmile-Dentalgeräts",
    overview:
      "AirSmile erforderte eine saubere handgeführte Produktarchitektur, austauschbare Komponenten und ergonomische Details für eine Dentalanwendung.",
  },
  brossadent: {
    category: "Medizin",
    title: "O2 Cosmetics Zahnbürste",
    description:
      "Dentalpflege-Konzept mit Zahnbürstenkörper, O2-Cosmetics-Nachfüllkartuschen und Integration des internen Mechanismus.",
    imageAlt: "O2 Cosmetics Zahnbürstenkonzept mit Nachfüllkartuschen",
    overview:
      "Das Konzept kombiniert einen ergonomischen Zahnbürstenkörper, austauschbare O2-Cosmetics-Verbrauchsteile und den internen Mechanismus in einem kompakten Dentalprodukt.",
  },
  "insulin-pen": {
    category: "Medizin",
    title: "Insulinpen",
    description:
      "Studien zu Gehäuse und Mechanismusintegration für ein schlankes, herstellbares Medizinprodukt im Pen-Format.",
    imageAlt: "Blaues Produkt-Rendering eines Insulinpens",
    overview:
      "Dieses Projekt konzentriert sich auf ein kompaktes medizinisches Pen-Produkt, das interne Mechanik, Nutzerhandhabung und klare Industriegestaltung ausbalanciert.",
  },
  "paradigm-spine": {
    category: "Medizin",
    description:
      "Entwicklung von Wirbelsäulenimplantaten und Instrumentierung, unterstützt durch Produktrenderings und mechanische Simulation.",
    imageAlt: "Rendering eines Paradigm-Spine-Implantatsets",
    overview:
      "Ein medizinisches Implantatprojekt, das Präzisionsteiledesign, Kit-Präsentation und Finite-Elemente-Analyse für belastungskritische Wirbelsäulenkomponenten verbindet.",
  },
  "flex-drill": {
    category: "Medizin",
    description:
      "Konzept eines flexiblen Bohrzubehörs mit geformter Polymerführung, Prototypvalidierung und Spannungsanalyse-Ansichten.",
    imageAlt: "Blaues Konzept einer flexiblen Bohrführung",
    overview:
      "Flex Drill untersucht eine gekrümmte Bohrführungsarchitektur, von mechanischer Spannungssimulation bis zu physischem Prototyp und Produktrendering.",
  },
  "biome-staple-applicator": {
    category: "Medizin",
    title: "Biome-Klammerapplikator",
    description:
      "Handgeführtes Applikatorkonzept, entwickelt durch Skizzen, Strukturanalyse und gedruckte Prototypen.",
    imageAlt: "Weiß-rotes Rendering eines biomedizinischen Klammerapplikators",
    overview:
      "Der Applikator zeigt die gesamte Schleife von Ideenskizze und ergonomischem Layout bis zu Finite-Elemente-Prüfungen und Prototypteilen für ein biomedizinisches Handwerkzeug.",
  },
  cliris: {
    category: "Industrie",
    description:
      "Automatisches Brillenreinigungsgerät mit kompakter Schubladenarchitektur und veredelter Produktoberfläche für Endnutzer.",
    imageAlt: "Geöffneter schwarzer automatischer Cliris-Brillenreiniger",
    overview:
      "Cliris kombiniert eine kompakte Reinigungskammer, Schubladenbewegung und nutzerseitige Oberflächen in einem Produkt für zuverlässige, hygienische Brillenpflege.",
  },
  "filter-carafe": {
    category: "Industrie",
    title: "Filterkaraffe",
    description:
      "System für gefiltertes Wasser mit Karaffendesign, Filterzubehör und elektronischer Überwachung des Kartuschenzustands.",
    imageAlt: "Konzept einer Filterkaraffe mit Kartuschenzubehör",
    overview:
      "Das Projekt verbindet die sichtbare Karaffe und das Filterzubehör mit einem im Deckel integrierten Kontrollprinzip, das den Zustand und die Nutzung der Filterkartusche überwacht.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Qualitätskontrolle für eine Filterkartusche in einem Gefäß für gefiltertes Wasser.",
      ),
      relatedPatent("USD560092S", "Designpatent für die Form der Karaffe."),
      relatedPatent(
        "USD568097S",
        "Designpatent für das Filterzubehör der Karaffe.",
      ),
    ],
  },
  ikitty: {
    category: "Industrie",
    description:
      "Produkt zur Beschäftigung von Katzen mit Nachfüllkapsel-Architektur, Füttermechanismus und weicher Produktsprache.",
    imageAlt: "iKitty-Prototyp für Katzenbeschäftigung",
    overview:
      "Das iKitty-Konzept verpackt Nachfüllkapseln, interne Füttermechanik und eine erkennbare katzenförmige Produktsprache in ein herstellbares Konsumprodukt.",
  },
  "smart-bottle": {
    category: "Medizin",
    title: "Smart Bottle",
    description:
      "Gesicherter medizinischer Spender für kontrollierte Opioidabgabe mit biometrischem Zugang, kompaktem Innenaufbau und manipulationsgeschütztem Gehäuse.",
    imageAlt:
      "Medizinisches Smart-Bottle-Spenderkonzept mit blauem internem Modul",
    overview:
      "Eine kompakte Medizingeräte-Architekturstudie für kontrollierte Medikamentenabgabe, einschließlich Dosiszugang, biometrischer Nutzung, Gehäusedesign und interner Komponentenintegration.",
  },
  "personal-injector": {
    category: "Medizin",
    title: "Personal Injector",
    description:
      "Vernetztes persönliches Injektionsgerät mit Fokus auf Kompatibilität, keine Nadelhandhabung, kompakte Kinematik und Einwegspritze.",
    imageAlt: "Konzept eines Personal-Injector-Medizinprodukts",
    overview:
      "Im medizinischen Portfolio als SwissMedDev Start Up Prize 2013 Projekt vorgestellt, adressiert der Personal Injector sicherere Selbstinjektion durch kompakte Mechanik, vernetzte Gerätefunktion, Kompatibilitätsanforderungen und keine direkte Nadelhandhabung.",
  },
  "acetabular-reamer-holder": {
    category: "Medizin",
    title: "Acetabulum-Reamer-Halter",
    description:
      "PEEK-Griff und Schutzabdeckung für acetabuläre Reamer, entwickelt mit Design, FEM und Spritzgussanforderungen.",
    imageAlt:
      "Orange-schwarzer PEEK-Prototyp eines acetabulären Reamer-Halters",
    overview:
      "Dieses medizinische Werkzeugprojekt umfasst einen PEEK-Griff und eine Schutzabdeckung für einen acetabulären Reamer, mit Detaildesign, Finite-Elemente-Analyse, Spritzgussmachbarkeit und hoher Steifigkeit für ein hygienisches chirurgisches Instrument.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Patentkontext für orthopädische Chirurgiewerkzeuge rund um Impaktor- und Reamer-Instrumente.",
      ),
    ],
  },
  "single-use-turbine": {
    category: "Medizin",
    title: "Single-Use-Turbine",
    description:
      "Einweg-Medizinturbine, entwickelt zur Reduktion von Größe, Gewicht und Kosten durch Material- und Geometrieoptimierung.",
    imageAlt: "Transparente medizinische Einweg-Turbinenkomponente",
    overview:
      "Die Single-Use-Turbine ist im medizinischen Portfolio als kompaktes Einweggerät dokumentiert, mit Entwicklungszielen rund um reduzierte Größe, reduziertes Gewicht, geringere Kosten und innovative Materialien.",
  },
  "glove-helmet-dryer": {
    category: "Industrie",
    title: "Handschuh- & Helmtrockner",
    description:
      "Trocknungsstation für Sportausrüstung, entwickelt von der CAD-Auslegung bis zu Tests physischer Prototypen.",
    imageAlt: "Prototyp eines Handschuhtrockners mit montierten Handschuhen",
    overview:
      "Dieses Konsumprodukt integriert Luftführung und Halterungen für Handschuhe und Helme in eine kompakte Dockingstation, mit gerenderten Konzepten und physischen Prototypen.",
  },
  "folding-umbrella": {
    category: "Industrie",
    title: "Taschen-Regenschirm",
    description:
      "Telefonformatiger Faltregenschirm mit Etuistudien, Faltgeometrie und Details funktionsfähiger Prototypen.",
    imageAlt: "Gelber Prototyp eines Taschen-Regenschirms",
    overview:
      "Das Projekt untersucht eine neue Architektur für einen faltbaren Regenschirm, der geschlossen in eine Tasche passt und ungefähr die Grundfläche eines Smartphones einnimmt. Die Arbeit reicht von Etui-Schnitten und Mechanismusstudien bis zu physischen Prototypen.",
  },
  "skincare-applicator": {
    category: "Medizin",
    title: "Hautpflege-Applikator",
    description:
      "Dermokosmetisches Applikatorkonzept mit ergonomischem Handstück, internem Kartuschenaufbau und Produktpräsentation.",
    imageAlt: "Rendering eines weißen Hautpflege-Applikators",
    overview:
      "Ein handgeführtes Hautpflegesystem, das Fluidabgabe, Nutzerergonomie, Produktgestaltung und präsentationsreife Visualisierung verbindet.",
  },
  "alicoffee-machine": {
    category: "Industrie",
    title: "Kaffeemaschine",
    description:
      "Kaffeemaschinenkonzept mit doppeltem Kapselkreislauf, bei dem Wasser in der Kapsel hin und zurück geführt wird.",
    imageAlt: "Rendering des Kaffeemaschinenkonzepts",
    overview:
      "Dieses Projekt beschränkt sich auf das Kapselprinzip der Kaffeemaschine: Das Wasser fließt nicht einfach gerade durch die Kapsel, sondern folgt innen einem Hin-und-zurück-Weg mit doppeltem Durchlauf bei der Extraktion.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Kapselbasierter Getränkezubereitungskontext für den doppelten Wasserweg durch die Kapsel.",
      ),
    ],
  },
  "special-t-machine": {
    category: "Industrie",
    title: "Teemaschine",
    description:
      "Entwicklung der Brüheinheit für Teekapseln, von Kapselhandling und Auswurf bis zu Getränkefluss und Pilotserie.",
    imageAlt: "Prototyp der Brüheinheit für eine Teemaschine",
    overview:
      "DOMTEKNIKA arbeitete an der Brüheinheit: Kapselhalten, Öffnen, Erkennen, Kinematik, Auswurf, Getränkefluss in der Tasse und Industriedesign-Integration. Die Arbeit unterstützte die erste Pilotserie des Brühkopfs und eine patentierte Vortex-Komponente gegen Dampfansammlung in der Kapsel.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Getränkezubereitungsvorrichtung für eine Teekapselmaschine, auch als WO2009135899 veröffentlicht.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "Industrie",
    title: "Instantkaffee-Dispenser",
    description:
      "Prototypgerät für die Dosierung von löslichem Kaffee, getestet mit Endkundenverpackungen und physischen Modellen.",
    imageAlt: "Instantkaffee-Dispenser-Prototyp mit Handinteraktion",
    overview:
      "Ein physisches Prototypenprojekt rund um die Handhabung von löslichem Kaffee, Dosierergonomie und ein kompaktes Geräteformat.",
  },
  "vacheron-watch-mechanics": {
    category: "Industrie",
    title: "Uhrenmechanik",
    description:
      "Präzisionsstudien in der Uhrmacherei mit mechanischen Anordnungen, gerenderten Baugruppen und Komponentenanalyse.",
    imageAlt: "Rendering einer mechanischen Uhr mit sichtbarem Werk",
    overview:
      "Dieses Uhrenprojekt konzentriert sich auf Präzisionsmechanik, Werkvisualisierung und strukturelle Bewertung kleiner, hochwertiger Komponenten.",
  },
  "velum-sky-screen": {
    category: "Industrie",
    title: "Velum SKY Bildschirmmechanismus",
    description:
      "Prototyp eines architektonischen Mechanismus für ein Screen- oder Fassadenelement, als präzise mechanische Baugruppe fotografiert.",
    imageAlt:
      "Velum SKY mechanischer Screen-Prototyp vor dunklem Studiohintergrund",
    overview:
      "Velum SKY wird hier durch eine hochpräzise mechanische Baugruppe dargestellt und verweist auf einen architektonischen oder umweltbezogenen Screen-Mechanismus mit robuster Bewegung und sauberer Detaillierung.",
  },
};

const ES_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "Movilidad",
    description:
      "Bicicleta eléctrica urbana desarrollada alrededor de diseño composite inyectado, ruedas distintivas y detalles industriales premium.",
    imageAlt: "Bicicleta eléctrica STAJVELO RV01 en circuito",
    overview:
      "DOMTEKNIKA acompañó la concepción polimérica y el desarrollo estructural de esta bicicleta eléctrica urbana, desde la arquitectura inicial y la ingeniería de ruedas hasta la definición fabricable del producto.",
  },
  aventor: {
    category: "Movilidad",
    description:
      "Plataforma de vehículo eléctrico de alto rendimiento desarrollada en torno a velocidad, aceleración y carrocería ligera de composite.",
    imageAlt: "Vehículo eléctrico Aventor verde en circuito",
    overview:
      "Aventor combina implantación del vehículo, diseño composite, pruebas en pista y optimización estructural para una plataforma eléctrica compacta de alto rendimiento.",
  },
  weebot: {
    category: "Movilidad",
    description:
      "Concepto compacto de movilidad eléctrica explorado mediante CAD, prototipos y estudios de producto para uso invernal.",
    imageAlt: "Concepto compacto de movilidad sobre nieve Weebot",
    overview:
      "El proyecto cubre arquitectura de producto, integración mecánica y desarrollo de prototipos para una pequeña plataforma eléctrica destinada a usos exteriores exigentes.",
  },
  "totalcar-concept": {
    category: "Movilidad",
    description:
      "Concepto compacto de movilidad eléctrica centrado en arquitectura ligera de vehículo y transporte urbano ecológico.",
    imageAlt: "Prototipo eléctrico verde Total Car en exposición",
    overview:
      "Total Car amplía el portafolio de movilidad con un estudio de pequeño vehículo eléctrico, usando carrocería ligera, integración limpia y un enfoque urbano de baja huella.",
  },
  "sam-cree": {
    category: "Movilidad",
    title: "SAM CREE",
    description:
      "Triciclo eléctrico suizo ultraligero con asientos en tándem, viga central de chasis y autonomía urbana compacta.",
    imageAlt: "Triciclo eléctrico naranja SAM CREE con techo abierto",
    overview:
      "SAM CREE reúne trabajos tempranos sobre vehículos eléctricos ultraligeros: viga central, disposición en tándem e integración de componentes para una movilidad urbana eficiente.",
  },
  "angel-interceptor": {
    category: "Movilidad",
    title: "Angel Interceptor",
    description:
      "Concepto eléctrico de tres ruedas de alto rendimiento desarrollado mediante arquitectura CAD, paquete de cockpit y estudios de carrocería protectora.",
    imageAlt:
      "Estudio CAD lateral del vehículo de tres ruedas Angel Interceptor",
    overview:
      "Angel Interceptor explora una arquitectura eléctrica de tres ruedas de alto rendimiento, equilibrando asientos en tándem, protección de carrocería, implantación de ruedas e integración mecánica.",
  },
  softcar: {
    category: "Movilidad",
    description:
      "Concepto de vehículo eléctrico urbano de muy baja huella, centrado en arquitectura ligera, integración compacta y movilidad urbana ecológica.",
    imageAlt: "Concepto SOFTCAR de vehículo eléctrico urbano compacto",
    overview:
      "SOFTCAR extiende el trabajo de movilidad hacia vehículos eléctricos urbanos compactos, combinando arquitectura ligera, ensamblajes simplificados y transporte de baja huella ecológica.",
  },
  "folding-bike-scooter": {
    category: "Movilidad",
    title: "Bicicleta y scooter plegables",
    description:
      "Primeros estudios de movilidad plegable que combinan arquitectura compacta, mecanismos ergonómicos y formatos transportables.",
    imageAlt: "Render de bicicleta eléctrica plegable",
    overview:
      "Conjunto de conceptos de bicicleta eléctrica y scooter plegables centrados en bisagras, volumen compacto de guardado, posiciones ergonómicas y ensamblajes mecánicos fabricables.",
  },
  "aventor-drone": {
    category: "Movilidad",
    title: "Drone Aventor",
    description:
      "Desarrollo de plataforma drone con estudios de chasis ligero, prototipos ensamblados e iteraciones de prueba en campo.",
    imageAlt: "Prototipo de drone blanco Aventor",
    overview:
      "Este trabajo con drones combina implantación mecánica, integración de la carga útil y validación de prototipo para una plataforma aérea ligera.",
  },
  airsmile: {
    category: "Médico",
    description:
      "Concepto de dispositivo dental desarrollado desde el estilo de producto hasta la integración funcional y familias de prototipos.",
    imageAlt: "Render del dispositivo dental portátil AirSmile",
    overview:
      "AirSmile requería una arquitectura limpia de producto portátil, componentes removibles y detalles ergonómicos para un uso de cuidado dental.",
  },
  brossadent: {
    category: "Médico",
    title: "Cepillo O2 Cosmetics",
    description:
      "Concepto de cuidado dental que combina cuerpo de cepillo, cartuchos O2 Cosmetics e integración del mecanismo interno.",
    imageAlt: "Concepto de cepillo O2 Cosmetics con cartuchos",
    overview:
      "El concepto combina un cuerpo ergonómico de cepillo, consumibles O2 Cosmetics reemplazables e integración del mecanismo interno en un producto dental compacto.",
  },
  "insulin-pen": {
    category: "Médico",
    title: "Pluma de insulina",
    description:
      "Estudios de carcasa e integración del mecanismo para un dispositivo médico delgado y fabricable.",
    imageAlt: "Render de producto de pluma de insulina azul",
    overview:
      "Este proyecto se centra en un producto médico compacto tipo pluma, equilibrando restricciones de mecanismo interno, manejo por el usuario y diseño industrial limpio.",
  },
  "paradigm-spine": {
    category: "Médico",
    description:
      "Desarrollo de implante e instrumentación espinal apoyado por renderizado de producto y simulación mecánica.",
    imageAlt: "Render de kit de implantes Paradigm Spine",
    overview:
      "Proyecto de implante médico que combina diseño de piezas de precisión, presentación de kit y análisis por elementos finitos para hardware espinal sometido a carga.",
  },
  "flex-drill": {
    category: "Médico",
    description:
      "Concepto de accesorio de taladro flexible con guía polimérica, validación de prototipo y vistas de análisis de tensiones.",
    imageAlt: "Concepto azul de guía de taladro flexible",
    overview:
      "Flex Drill explora una arquitectura de guía de taladro curvada, desde simulación de esfuerzo mecánico hasta prototipo físico y render de producto.",
  },
  "biome-staple-applicator": {
    category: "Médico",
    title: "Aplicador de grapas Biome",
    description:
      "Concepto de aplicador portátil desarrollado mediante bocetos, análisis estructural y prototipos impresos.",
    imageAlt: "Render blanco y rojo de aplicador biomédico de grapas",
    overview:
      "El aplicador muestra el ciclo completo desde boceto de ideación y planteamiento ergonómico hasta verificaciones por elementos finitos y piezas prototipo para una herramienta biomédica portátil.",
  },
  cliris: {
    category: "Industrial",
    description:
      "Dispositivo automático de limpieza de gafas con arquitectura compacta de cajón y acabado refinado de producto de consumo.",
    imageAlt: "Limpiador automático de gafas Cliris negro abierto",
    overview:
      "Cliris combina cámara de limpieza compacta, movimiento de cajón y superficies orientadas al usuario en un producto para cuidado higiénico y fiable de gafas.",
  },
  "filter-carafe": {
    category: "Industrial",
    title: "Jarra filtrante",
    description:
      "Sistema de jarra filtrante que combina diseño de producto, accesorio de cartucho y control electrónico del estado del filtro.",
    imageAlt: "Concepto de jarra filtrante con accesorios de cartucho",
    overview:
      "El proyecto combina la jarra visible y su accesorio filtrante con un principio de control integrado en la tapa, capaz de supervisar el estado y el uso del cartucho de filtración.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "Método y dispositivo de control de calidad para un cartucho de filtración integrado en una jarra filtrante.",
      ),
      relatedPatent("USD560092S", "Patente de diseño de la forma de la jarra."),
      relatedPatent(
        "USD568097S",
        "Patente de diseño del accesorio filtrante de la jarra.",
      ),
    ],
  },
  ikitty: {
    category: "Industrial",
    description:
      "Producto de enriquecimiento para gatos con cápsula recargable, mecanismo de alimentación y estilo suave.",
    imageAlt: "Prototipo de dispositivo iKitty para gatos",
    overview:
      "El concepto iKitty integra cápsulas recargables, mecánica interna de alimentación y un lenguaje de producto reconocible en un producto de consumo fabricable.",
  },
  "smart-bottle": {
    category: "Médico",
    title: "Smart Bottle",
    description:
      "Dispensador médico seguro para entrega controlada de opioides, con acceso biométrico, arquitectura interna compacta y carcasa anti-manipulación.",
    imageAlt:
      "Concepto de dispensador médico Smart Bottle con módulo interno azul",
    overview:
      "Estudio de arquitectura de dispositivo médico para dispensación controlada de medicamentos, incluyendo acceso a dosis, uso biométrico, diseño de carcasa e integración interna.",
  },
  "personal-injector": {
    category: "Médico",
    title: "Personal Injector",
    description:
      "Concepto de inyector personal conectado, centrado en compatibilidad, sin manipulación de aguja, cinemática compacta y jeringa de un solo uso.",
    imageAlt: "Concepto de dispositivo médico Personal Injector",
    overview:
      "Presentado en el portafolio médico como proyecto SwissMedDev Start Up Prize 2013, Personal Injector busca una autoinyección más segura mediante mecánica compacta, lógica de dispositivo conectado, requisitos de compatibilidad y sin manipulación directa de la aguja.",
  },
  "acetabular-reamer-holder": {
    category: "Médico",
    title: "Soporte de fresa acetabular",
    description:
      "Desarrollo de mango y cubierta en PEEK para fresa acetabular, con diseño, análisis FEM y requisitos de inyección.",
    imageAlt:
      "Prototipo naranja y negro de soporte de fresa acetabular en PEEK",
    overview:
      "Este proyecto de instrumental médico cubre un mango de PEEK y una cubierta protectora para una fresa acetabular, combinando diseño detallado, análisis por elementos finitos, viabilidad de inyección y alta rigidez para un instrumento quirúrgico higiénico.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "Contexto de patente de instrumental ortopédico para instrumentos quirúrgicos relacionados con impactores y fresas.",
      ),
    ],
  },
  "single-use-turbine": {
    category: "Médico",
    title: "Turbina de un solo uso",
    description:
      "Concepto de turbina médica desechable desarrollado para reducir tamaño, peso y coste mediante optimización de materiales y geometría.",
    imageAlt: "Componente médico transparente de turbina de un solo uso",
    overview:
      "La turbina de un solo uso aparece en el portafolio médico como un dispositivo compacto desechable, con prioridades de desarrollo centradas en reducir tamaño, peso y coste mediante materiales innovadores.",
  },
  "glove-helmet-dryer": {
    category: "Industrial",
    title: "Secador de guantes y casco",
    description:
      "Concepto de estación de secado para equipamiento deportivo, desarrollado desde planos CAD hasta pruebas con prototipo físico.",
    imageAlt: "Prototipo de secador de guantes con guantes montados",
    overview:
      "Este producto integra rutas de aire y soportes para guantes y cascos en una estación compacta, con conceptos renderizados y prototipos físicos.",
  },
  "folding-umbrella": {
    category: "Industrial",
    title: "Paraguas plegable de bolsillo",
    description:
      "Concepto de paraguas plegable en formato teléfono, con estudios de funda, geometría de plegado y detalles de prototipo funcional.",
    imageAlt: "Prototipo amarillo de paraguas plegable de bolsillo",
    overview:
      "El proyecto explora una nueva arquitectura de paraguas plegable diseñada para caber en un bolsillo una vez cerrada, con una huella cercana a la de un smartphone. El trabajo va desde cortes de funda y estudios de mecanismo hasta prototipos físicos.",
  },
  "skincare-applicator": {
    category: "Médico",
    title: "Aplicador para el cuidado de la piel",
    description:
      "Concepto de aplicador dermocosmético con pieza de mano ergonómica, arquitectura interna del cartucho y presentación de producto.",
    imageAlt: "Render de aplicador dermocosmético blanco",
    overview:
      "Sistema portátil para el cuidado de la piel que combina entrega de fluido, ergonomía de usuario, estilo de producto y desarrollo visual listo para presentación.",
  },
  "alicoffee-machine": {
    category: "Industrial",
    title: "Máquina de café",
    description:
      "Concepto de máquina de café basado en un circuito de cápsula de doble paso, donde el agua hace ida y vuelta dentro de la cápsula.",
    imageAlt: "Render del concepto de máquina de café",
    overview:
      "Este proyecto se limita al principio de cápsula de la máquina de café: el agua no atraviesa simplemente la cápsula en línea recta, sino que realiza un recorrido de ida y vuelta dentro de ella durante la extracción.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Contexto de producción de bebida con cápsula para el recorrido de agua de doble paso dentro de la cápsula.",
      ),
    ],
  },
  "special-t-machine": {
    category: "Industrial",
    title: "Máquina de té",
    description:
      "Desarrollo de la unidad de extracción para cápsulas de té, desde el manejo y la expulsión de la cápsula hasta el flujo de bebida y la preserie.",
    imageAlt: "Prototipo de unidad de extracción para máquina de té",
    overview:
      "DOMTEKNIKA trabajó en la unidad de extracción: sujeción, apertura, detección, cinemática y expulsión de la cápsula, flujo de bebida en taza e integración de diseño industrial. El trabajo apoyó la primera serie piloto del cabezal y un componente con vórtice patentado para reducir la acumulación de vapor en la cápsula.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "Dispositivo de producción de bebida para máquina de cápsulas de té, publicado también como WO2009135899.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "Industrial",
    title: "Dispensador de café soluble",
    description:
      "Prototipo de aparato para dosificación de café soluble, probado con envases de consumo y maquetas físicas.",
    imageAlt: "Prototipo de dispensador de café soluble con interacción manual",
    overview:
      "Proyecto de prototipo físico centrado en la manipulación de café soluble, ergonomía de dosificación y un formato compacto de aparato.",
  },
  "vacheron-watch-mechanics": {
    category: "Industrial",
    title: "Mecánica relojera",
    description:
      "Estudios de relojería de precisión que combinan implantación mecánica, ensamblajes renderizados y análisis de componentes.",
    imageAlt: "Render de reloj mecánico con movimiento visible",
    overview:
      "Este proyecto relojero se centra en mecánica de precisión, visualización de movimiento y evaluación estructural de pequeños componentes de alto valor.",
  },
  "velum-sky-screen": {
    category: "Industrial",
    title: "Mecanismo Velum SKY",
    description:
      "Prototipo de mecanismo arquitectónico para pantalla o elemento de fachada, fotografiado como ensamblaje mecánico de precisión.",
    imageAlt: "Prototipo mecánico Velum SKY sobre fondo de estudio oscuro",
    overview:
      "Velum SKY se representa aquí mediante un ensamblaje mecánico de alta precisión, sugiriendo un mecanismo arquitectónico o ambiental que requiere movimiento robusto y detalles limpios.",
  },
};

const KO_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "모빌리티",
    description:
      "사출 복합재 설계, 독특한 휠, 프리미엄 산업 디테일을 중심으로 한 도심형 전기자전거 아키텍처.",
    imageAlt: "도로 서킷 위의 STAJVELO RV01 전기자전거",
    overview:
      "DOMTEKNIKA는 초기 아키텍처와 휠 엔지니어링부터 제조 가능한 제품 정의까지 이 도심형 전기자전거의 폴리머 설계와 구조 개발을 지원했습니다.",
  },
  aventor: {
    category: "모빌리티",
    description:
      "속도, 가속, 경량 복합재 차체를 중심으로 개발된 고성능 전기차 플랫폼.",
    imageAlt: "트랙 위의 초록색 Aventor 전기차",
    overview:
      "Aventor는 차량 구성, 복합재 설계, 트랙 테스트, 구조 최적화를 결합한 컴팩트 고성능 전기 플랫폼입니다.",
  },
  weebot: {
    category: "모빌리티",
    description:
      "CAD, 프로토타입 제작, 겨울 사용 제품 연구를 통해 탐구한 소형 전기 모빌리티 콘셉트.",
    imageAlt: "Weebot 소형 눈길 모빌리티 콘셉트",
    overview:
      "이 프로젝트는 까다로운 야외 사용을 위한 소형 전기 모빌리티 플랫폼의 제품 아키텍처, 기계 통합, 프로토타입 개발을 다룹니다.",
  },
  "totalcar-concept": {
    category: "모빌리티",
    description:
      "경량 차량 아키텍처와 친환경 도시 교통에 초점을 둔 소형 전기 모빌리티 콘셉트.",
    imageAlt: "전시된 녹색 Total Car 전기차 프로토타입",
    overview:
      "Total Car는 가벼운 차체, 깔끔한 제품 통합, 저영향 도시 교통 접근법을 활용한 소형 전기차 연구입니다.",
  },
  "sam-cree": {
    category: "모빌리티",
    title: "SAM CREE",
    description:
      "탠덤 좌석, 중앙 빔 섀시, 도심형 컴팩트 주행 거리를 중심으로 한 스위스 초경량 전기 삼륜차입니다.",
    imageAlt: "캐노피가 열린 주황색 SAM CREE 전기 삼륜차",
    overview:
      "SAM CREE는 중앙 빔 섀시, 탠덤 패키징, 효율적인 도심 이동성을 위한 부품 통합을 중심으로 한 초기 초경량 전기 도로 차량 작업을 모읍니다.",
  },
  "angel-interceptor": {
    category: "모빌리티",
    title: "Angel Interceptor",
    description:
      "CAD 아키텍처, 조종석 패키징, 보호 차체 연구를 통해 개발한 고성능 전기 삼륜 콘셉트입니다.",
    imageAlt: "Angel Interceptor 삼륜 차량 측면 CAD 연구",
    overview:
      "Angel Interceptor는 탠덤 좌석, 차체 보호, 휠 배치, 기계 통합을 CAD 연구 안에서 균형 있게 검토한 고성능 전기 삼륜 아키텍처입니다.",
  },
  softcar: {
    category: "모빌리티",
    description:
      "경량 아키텍처, 컴팩트한 구성, 친환경 도심 모빌리티에 초점을 둔 초저영향 도심형 전기차 콘셉트.",
    imageAlt: "SOFTCAR 소형 도심 전기차 콘셉트",
    overview:
      "SOFTCAR는 경량 차체 아키텍처, 단순화된 조립, 낮은 환경 발자국의 교통을 결합해 소형 도심 전기차 작업을 확장합니다.",
  },
  "folding-bike-scooter": {
    category: "모빌리티",
    title: "접이식 자전거와 스쿠터",
    description:
      "컴팩트 차량 아키텍처, 인체공학적 메커니즘, 휴대 가능한 형식을 결합한 초기 접이식 모빌리티 연구.",
    imageAlt: "접이식 전기자전거 콘셉트 렌더",
    overview:
      "힌지 메커니즘, 작은 보관 부피, 인체공학적 주행 자세, 제조 가능한 기계 조립에 집중한 접이식 전기자전거와 스쿠터 콘셉트입니다.",
  },
  "aventor-drone": {
    category: "모빌리티",
    title: "Aventor 드론",
    description:
      "경량 프레임 연구, 조립 프로토타입, 현장 테스트 반복을 포함한 드론 플랫폼 개발.",
    imageAlt: "흰색 Aventor 드론 프로토타입",
    overview:
      "이 드론 작업은 경량 항공 제품 플랫폼을 위해 기계 배치, 탑재물 통합, 프로토타입 검증을 결합합니다.",
  },
  airsmile: {
    category: "의료",
    description:
      "제품 스타일링부터 기능 통합과 프로토타입 제품군까지 개발한 치과 케어 장치 콘셉트.",
    imageAlt: "AirSmile 휴대형 치과 장치 렌더",
    overview:
      "AirSmile은 치과 케어 사용 사례에 맞는 깔끔한 휴대형 제품 아키텍처, 탈착식 구성품, 인체공학적 디테일이 필요했습니다.",
  },
  brossadent: {
    category: "의료",
    title: "O2 Cosmetics 칫솔",
    description:
      "칫솔 본체, O2 Cosmetics 리필 카트리지, 내부 메커니즘 통합을 결합한 치과 케어 제품 콘셉트.",
    imageAlt: "리필 카트리지가 있는 O2 Cosmetics 칫솔 콘셉트",
    overview:
      "이 콘셉트는 인체공학적 칫솔 본체, 교체 가능한 O2 Cosmetics 소모품, 내부 메커니즘 통합을 컴팩트한 치과 제품 안에 결합합니다.",
  },
  "insulin-pen": {
    category: "의료",
    title: "인슐린 펜",
    description:
      "슬림하고 제조 가능한 의료기기를 위한 주사 펜 하우징과 메커니즘 통합 연구.",
    imageAlt: "파란색 인슐린 펜 제품 렌더",
    overview:
      "이 프로젝트는 내부 메커니즘 제약, 사용자 조작성, 깔끔한 산업 디자인을 균형 있게 다룬 컴팩트 펜형 의료 제품에 집중합니다.",
  },
  "paradigm-spine": {
    category: "의료",
    description:
      "제품 렌더링과 기계 시뮬레이션으로 지원한 척추 임플란트 및 수술 기구 개발.",
    imageAlt: "Paradigm Spine 임플란트 세트 렌더",
    overview:
      "정밀 부품 설계, 키트 프레젠테이션, 하중이 중요한 척추 기구를 위한 유한요소해석을 결합한 의료 임플란트 프로젝트입니다.",
  },
  "flex-drill": {
    category: "의료",
    description:
      "형상화된 폴리머 가이드, 프로토타입 검증, 응력 분석 뷰를 포함한 유연 드릴 액세서리 콘셉트.",
    imageAlt: "파란색 유연 드릴 가이드 콘셉트",
    overview:
      "Flex Drill은 곡선형 드릴 가이드 아키텍처를 탐구하며, 기계 응력 시뮬레이션에서 물리 프로토타입과 제품 렌더링까지 이어집니다.",
  },
  "biome-staple-applicator": {
    category: "의료",
    title: "Biome 스테이플 애플리케이터",
    description:
      "스케치, 구조 분석, 출력 프로토타입을 통해 개발된 휴대형 애플리케이터 콘셉트.",
    imageAlt: "흰색과 빨간색 바이오메디컬 스테이플 애플리케이터 렌더",
    overview:
      "이 애플리케이터는 아이디어 스케치와 인체공학적 배치에서 유한요소 검토와 프로토타입 부품까지의 전체 과정을 보여 줍니다.",
  },
  cliris: {
    category: "산업",
    description:
      "컴팩트한 서랍식 아키텍처와 정제된 소비자 제품 마감을 갖춘 자동 안경 세척 장치.",
    imageAlt: "열린 검은색 Cliris 자동 안경 세척기",
    overview:
      "Cliris는 안경을 위생적이고 안정적으로 관리하기 위해 컴팩트 세척 챔버, 서랍 동작, 사용자에게 보이는 표면을 결합합니다.",
  },
  "filter-carafe": {
    category: "산업",
    title: "필터 카라프",
    description:
      "제품 디자인, 필터 카트리지 액세서리, 전자식 카트리지 상태 확인 기능을 결합한 정수 카라프 시스템.",
    imageAlt: "필터 카트리지 액세서리가 포함된 정수 카라프 콘셉트",
    overview:
      "이 프로젝트는 눈에 보이는 카라프와 필터 액세서리 디자인을 뚜껑에 통합된 제어 원리와 결합해, 필터 카트리지의 상태와 사용량을 추적합니다.",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "정수 용기에 통합된 필터 카트리지 품질 관리 방법과 장치.",
      ),
      relatedPatent("USD560092S", "카라프 형태에 관한 디자인 특허."),
      relatedPatent("USD568097S", "카라프 필터 액세서리에 관한 디자인 특허."),
    ],
  },
  ikitty: {
    category: "산업",
    description:
      "리필 캡슐 아키텍처, 급식 메커니즘, 부드러운 제품 스타일을 갖춘 고양이용 제품.",
    imageAlt: "iKitty 고양이 장치 프로토타입",
    overview:
      "iKitty 콘셉트는 리필 캡슐, 내부 급식 메커니즘, 알아보기 쉬운 고양이 형태 제품 언어를 제조 가능한 소비자 제품으로 구성합니다.",
  },
  "smart-bottle": {
    category: "의료",
    title: "Smart Bottle",
    description:
      "생체인식 접근, 컴팩트한 내부 구성, 변조 방지 케이스를 갖춘 오피오이드 제어 투여용 의료 디스펜서.",
    imageAlt: "파란색 내부 모듈이 있는 Smart Bottle 의료 디스펜서 콘셉트",
    overview:
      "제어된 약물 투여를 위한 컴팩트 의료기기 아키텍처 연구로, 투여 접근 로직, 생체인식 사용 조건, 케이스 디자인과 내부 부품 구성을 포함합니다.",
  },
  "personal-injector": {
    category: "의료",
    title: "Personal Injector",
    description:
      "호환성, 바늘 직접 취급 방지, 컴팩트한 기구 구조, 일회용 주사기를 중심으로 한 연결형 개인 주사기 콘셉트.",
    imageAlt: "Personal Injector 의료기기 콘셉트",
    overview:
      "의료 포트폴리오에서 SwissMedDev Start Up Prize 2013 프로젝트로 소개된 Personal Injector는 컴팩트한 기구, 연결형 장치 로직, 호환성 조건, 바늘 직접 취급 방지를 통해 더 안전한 자가 주사를 목표로 합니다.",
  },
  "acetabular-reamer-holder": {
    category: "의료",
    title: "비구 리머 홀더",
    description:
      "비구 수술용 PEEK 리머 핸들과 커버 개발로, 디자인, 유한요소해석, 사출 성형 조건을 함께 다룹니다.",
    imageAlt: "오렌지와 검정색 PEEK 비구 리머 홀더 프로토타입",
    overview:
      "이 의료 공구 프로젝트는 비구 리머용 PEEK 핸들과 보호 커버를 다루며, 상세 설계, 유한요소해석, 사출 성형 가능성, 위생적인 수술 기구에 필요한 높은 강성을 함께 검토합니다.",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "임팩터와 리머 계열 수술 기구에 관련된 정형외과 수술 도구 특허 맥락입니다.",
      ),
    ],
  },
  "single-use-turbine": {
    category: "의료",
    title: "일회용 터빈",
    description:
      "재료와 형상 최적화를 통해 크기, 무게, 비용을 줄이도록 개발한 일회용 의료 터빈 콘셉트.",
    imageAlt: "투명한 일회용 의료 터빈 부품",
    overview:
      "Single Use Turbine은 의료 포트폴리오에서 컴팩트한 일회용 장치로 소개되며, 크기 축소, 무게 절감, 비용 절감, 혁신 소재를 개발 우선순위로 삼았습니다.",
  },
  "glove-helmet-dryer": {
    category: "산업",
    title: "장갑 및 헬멧 건조기",
    description:
      "CAD 설계부터 물리 프로토타입 테스트까지 개발한 스포츠 장비용 건조 도크 콘셉트.",
    imageAlt: "장갑이 장착된 장갑 건조기 프로토타입",
    overview:
      "공기 흐름 경로와 장갑/헬멧 지지 구조를 컴팩트 도크에 통합한 제품으로, 렌더 콘셉트와 물리 프로토타입을 모두 포함합니다.",
  },
  "folding-umbrella": {
    category: "산업",
    title: "포켓 접이식 우산",
    description:
      "휴대폰 크기에 가까운 포켓형 접이식 우산 콘셉트로, 케이스 연구와 접힘 기하, 작동 프로토타입 디테일을 포함합니다.",
    imageAlt: "노란색 포켓 접이식 우산 프로토타입",
    overview:
      "이 프로젝트는 접었을 때 주머니에 들어가고 스마트폰에 가까운 크기를 목표로 한 새로운 접이식 우산 구조를 탐구합니다. 케이스 단면과 메커니즘 연구부터 실물 크기 물리 프로토타입까지 포함합니다.",
  },
  "skincare-applicator": {
    category: "의료",
    title: "피부 관리 애플리케이터",
    description:
      "인체공학적 핸드피스, 내부 카트리지 구성, 제품 프레젠테이션을 갖춘 더모코스메틱 애플리케이터 콘셉트.",
    imageAlt: "흰색 피부 관리 애플리케이터 렌더",
    overview:
      "유체 전달, 사용자 인체공학, 제품 스타일링, 발표에 적합한 시각 개발을 결합한 휴대형 피부 관리 시스템입니다.",
  },
  "alicoffee-machine": {
    category: "산업",
    title: "커피 머신",
    description:
      "캡슐 안에서 물이 왕복 경로를 만드는 이중 통과 캡슐 회로 기반의 커피 머신 콘셉트.",
    imageAlt: "커피 머신 콘셉트 렌더",
    overview:
      "이 프로젝트는 커피 머신의 캡슐 원리에만 초점을 둡니다. 물은 캡슐을 직선으로 통과하는 대신 내부에서 왕복하며, 추출 중 두 번 지나가는 흐름을 만듭니다.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "캡슐 내부를 두 번 지나는 물길과 관련된 캡슐 기반 음료 제조 맥락입니다.",
      ),
    ],
  },
  "special-t-machine": {
    category: "산업",
    title: "차 머신",
    description:
      "차 캡슐용 브루잉 유닛 개발로, 캡슐 취급과 배출부터 음료 흐름, 파일럿 생산 준비까지 다룹니다.",
    imageAlt: "차 머신 브루잉 유닛 프로토타입",
    overview:
      "DOMTEKNIKA는 캡슐 고정, 개봉, 감지, 운동 구조, 배출, 컵 안의 음료 흐름, 산업 디자인 통합까지 브루잉 유닛을 개발했습니다. 이 작업은 첫 브루잉 헤드 파일럿 시리즈와 캡슐 내부 증기 축적을 줄이는 특허받은 와류 부품으로 이어졌습니다.",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "차 캡슐 머신용 음료 제조 장치로, WO2009135899로도 공개되었습니다.",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "산업",
    title: "인스턴트 커피 디스펜서",
    description:
      "소비자용 포장과 물리 목업으로 테스트한 용해성 커피 투입용 프로토타입 장치.",
    imageAlt: "손으로 조작하는 인스턴트 커피 디스펜서 프로토타입",
    overview:
      "용해성 커피 처리, 투입 인체공학, 컴팩트한 기기 형태에 집중한 물리 프로토타입 프로젝트입니다.",
  },
  "vacheron-watch-mechanics": {
    category: "산업",
    title: "시계 메커니즘",
    description:
      "기계 배치, 렌더 조립체, 부품 분석을 결합한 정밀 시계공학 연구.",
    imageAlt: "무브먼트가 보이는 기계식 시계 렌더",
    overview:
      "이 시계 프로젝트는 정밀 기계, 무브먼트 시각화, 작은 고가치 부품의 구조 평가에 집중합니다.",
  },
  "velum-sky-screen": {
    category: "산업",
    title: "Velum SKY 스크린 메커니즘",
    description:
      "스크린 또는 파사드 요소를 위한 건축 메커니즘 프로토타입으로, 정밀 기계 조립체로 촬영되었습니다.",
    imageAlt: "어두운 스튜디오 배경의 Velum SKY 기계식 스크린 프로토타입",
    overview:
      "Velum SKY는 고정밀 기계 조립체로 표현되며, 견고한 움직임과 깔끔한 디테일이 필요한 건축 또는 환경 스크린 메커니즘을 보여 줍니다.",
  },
};

const ZH_PROJECT_OVERRIDES: Record<string, Partial<Project>> = {
  "stajvelo-rv01": {
    category: "出行",
    description:
      "围绕注塑复合材料设计、独特车轮和高端工业细节打造的城市电动自行车架构。",
    imageAlt: "赛道上的 STAJVELO RV01 电动自行车",
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
      "该项目涵盖产品架构、机械集成和原型开发，面向要求较高的户外使用场景的小型电动出行平台。",
  },
  "totalcar-concept": {
    category: "出行",
    description: "聚焦轻量化车辆架构和生态城市交通的紧凑电动出行概念。",
    imageAlt: "展出的绿色 Total Car 电动车原型",
    overview:
      "Total Car 以小型电动车研究扩展出行组合，使用轻量车身、清晰产品集成和低足迹城市交通方法。",
  },
  "sam-cree": {
    category: "出行",
    title: "SAM CREE",
    description:
      "瑞士超轻电动三轮车，围绕串列座椅、中央梁底盘和紧凑城市续航设计。",
    imageAlt: "打开车顶的橙色 SAM CREE 电动三轮车",
    overview:
      "SAM CREE 汇集了早期超轻电动道路车辆工作：中央梁底盘、串列布局，以及面向高效城市出行的组件集成。",
  },
  "angel-interceptor": {
    category: "出行",
    title: "Angel Interceptor",
    description:
      "高性能电动三轮概念，通过 CAD 架构、驾驶舱布局和防护车身研究开发。",
    imageAlt: "Angel Interceptor 三轮车辆侧面 CAD 研究",
    overview:
      "Angel Interceptor 探索高性能电动三轮架构，在 CAD 研究中平衡串列座椅、车身防护、车轮布局和机械集成。",
  },
  softcar: {
    category: "出行",
    description:
      "超低足迹城市电动车概念，聚焦轻量架构、紧凑集成和生态城市出行。",
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
      "该无人机工作将机械布局、载荷集成和原型验证结合起来，形成轻量化空中产品平台。",
  },
  airsmile: {
    category: "医疗",
    description: "牙科护理设备概念，从产品造型到功能集成和原型系列开发。",
    imageAlt: "AirSmile 手持牙科护理设备渲染图",
    overview:
      "AirSmile 需要清晰的手持产品架构、可拆卸组件，以及适合牙科护理使用的人体工学细节。",
  },
  brossadent: {
    category: "医疗",
    title: "O2 Cosmetics 牙刷",
    description:
      "牙科护理产品概念，结合牙刷主体、O2 Cosmetics 替换胶囊和内部机构集成。",
    imageAlt: "带替换胶囊的 O2 Cosmetics 牙刷概念",
    overview:
      "该概念将人体工学牙刷主体、可替换 O2 Cosmetics 消耗件和内部机构整合到紧凑牙科产品中。",
  },
  "insulin-pen": {
    category: "医疗",
    title: "胰岛素笔",
    description: "面向纤薄、可制造医疗器械的注射笔外壳和机构集成研究。",
    imageAlt: "蓝色胰岛素笔产品渲染图",
    overview:
      "该项目聚焦紧凑笔形医疗产品，在内部机构限制、用户操作和清晰工业设计之间取得平衡。",
  },
  "paradigm-spine": {
    category: "医疗",
    description: "脊柱植入物和器械开发，并由产品渲染和机械仿真支持。",
    imageAlt: "Paradigm Spine 植入套件渲染图",
    overview:
      "这是一个医疗植入物项目，结合精密零件设计、套件展示和用于承载关键脊柱硬件的有限元分析。",
  },
  "flex-drill": {
    category: "医疗",
    description:
      "柔性钻孔附件概念，包含成型聚合物导向件、原型验证和应力分析视图。",
    imageAlt: "蓝色柔性钻孔导向概念",
    overview:
      "Flex Drill 探索弯曲钻孔导向架构，从机械应力仿真走向实体原型和产品渲染。",
  },
  "biome-staple-applicator": {
    category: "医疗",
    title: "Biome 缝合钉施用器",
    description: "通过草图、结构分析和打印原型开发的手持施用器概念。",
    imageAlt: "白红色生物医学缝合钉施用器渲染图",
    overview:
      "该施用器展示了从创意草图和人体工学布置，到有限元检查和原型零件的完整循环。",
  },
  cliris: {
    category: "工业",
    description: "自动眼镜清洁设备，采用紧凑抽屉式架构和精致消费产品表面。",
    imageAlt: "打开状态的黑色 Cliris 自动眼镜清洁器",
    overview:
      "Cliris 将紧凑清洁腔、抽屉运动和面向用户的表面结合在一起，用于可靠、卫生的眼镜护理。",
  },
  "filter-carafe": {
    category: "工业",
    title: "滤水壶",
    description: "滤水壶系统，结合产品外观、滤芯附件和电子滤芯状态监测。",
    imageAlt: "带滤芯附件的滤水壶概念",
    overview:
      "该项目将可见的壶身与滤芯附件设计结合，并在壶盖组件中集成控制原理，用于监测滤芯质量和使用状态。",
    relatedPatents: [
      relatedPatent(
        "WO2008017182A1",
        "用于滤水容器中滤芯质量控制的方法和装置。",
      ),
      relatedPatent("USD560092S", "覆盖滤水壶外形的设计专利。"),
      relatedPatent("USD568097S", "覆盖滤水壶过滤附件的设计专利。"),
    ],
  },
  ikitty: {
    category: "工业",
    description: "猫咪互动产品，采用可替换胶囊架构、喂食机构和柔和产品造型。",
    imageAlt: "iKitty 猫咪互动设备原型",
    overview:
      "iKitty 概念将替换胶囊、内部喂食机构和具有识别度的猫形产品语言整合为可制造的消费产品。",
  },
  "smart-bottle": {
    category: "医疗",
    title: "Smart Bottle",
    description:
      "用于受控阿片类药物给药的安全医疗分配器，包含生物识别访问、紧凑内部集成和防拆外壳。",
    imageAlt: "带蓝色内部模块的 Smart Bottle 医疗分配器概念",
    overview:
      "面向受控药物分配的紧凑医疗设备架构研究，包括剂量访问逻辑、生物识别使用约束、外壳设计和内部组件集成。",
  },
  "personal-injector": {
    category: "医疗",
    title: "Personal Injector",
    description:
      "联网个人注射器概念，聚焦兼容性、无需直接接触针头、紧凑运动机构和一次性注射器。",
    imageAlt: "Personal Injector 医疗设备概念",
    overview:
      "Personal Injector 在医疗作品集中作为 SwissMedDev Start Up Prize 2013 项目展示，目标是通过紧凑机械、联网设备逻辑、兼容性约束和避免直接接触针头，实现更安全的自我注射。",
  },
  "acetabular-reamer-holder": {
    category: "医疗",
    title: "髋臼铰刀支架",
    description:
      "用于髋臼手术的 PEEK 铰刀手柄和保护盖开发，结合设计、有限元分析和注塑约束。",
    imageAlt: "橙黑色 PEEK 髋臼铰刀支架原型",
    overview:
      "该医疗工具项目涵盖用于髋臼铰刀的 PEEK 手柄和保护盖，结合详细设计、有限元分析、注塑可行性，以及卫生手术器械所需的高刚度要求。",
    relatedPatents: [
      relatedPatent(
        "EP3185821A1",
        "与冲击器和铰刀类外科器械相关的骨科手术工具专利背景。",
      ),
    ],
  },
  "single-use-turbine": {
    category: "医疗",
    title: "一次性涡轮",
    description: "一次性医疗涡轮概念，通过材料和几何优化降低尺寸、重量和成本。",
    imageAlt: "透明一次性医疗涡轮部件",
    overview:
      "Single Use Turbine 在医疗作品集中作为紧凑一次性装置记录，开发重点是减小尺寸、降低重量、降低成本并使用创新材料。",
  },
  "glove-helmet-dryer": {
    category: "工业",
    title: "手套与头盔烘干器",
    description: "运动装备烘干底座概念，从 CAD 布置开发到实体原型测试。",
    imageAlt: "装有手套的手套烘干器原型",
    overview:
      "该消费产品将手套和头盔的气流路径与支架整合到紧凑底座中，并包含渲染概念与实体原型。",
  },
  "folding-umbrella": {
    category: "工业",
    title: "口袋折叠伞",
    description:
      "接近手机尺寸的口袋折叠伞概念，包含伞套研究、折叠几何和工作原型细节。",
    imageAlt: "黄色口袋折叠伞原型",
    overview:
      "该项目探索一种新的折叠伞架构，收起后可放入口袋，占用空间接近智能手机。从伞套剖面和机构研究到实体原型均有覆盖。",
  },
  "skincare-applicator": {
    category: "医疗",
    title: "护肤施用器",
    description: "皮肤美容施用器概念，带人体工学手柄、内部胶囊布置和产品展示。",
    imageAlt: "白色护肤施用器渲染图",
    overview:
      "一套手持护肤系统，结合流体输送、用户人体工学、产品造型和面向产品展示的视觉开发。",
  },
  "alicoffee-machine": {
    category: "工业",
    title: "咖啡机",
    description: "咖啡机概念，基于双通道胶囊回路，水在胶囊内形成往返路径。",
    imageAlt: "咖啡机概念渲染图",
    overview:
      "该项目只围绕咖啡机的胶囊原理：水并非直线穿过胶囊，而是在胶囊内部往返流动，在萃取过程中形成双通道。",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "与水在胶囊内双通道流动相关的胶囊饮品制备背景。",
      ),
    ],
  },
  "special-t-machine": {
    category: "工业",
    title: "茶机",
    description: "茶胶囊冲泡单元开发，从胶囊处理和排出到饮品流动与试生产准备。",
    imageAlt: "茶机冲泡单元原型",
    overview:
      "DOMTEKNIKA 负责冲泡单元工作：胶囊保持、开启、检测、运动机构、排出、杯中饮品流动和工业设计集成。该工作支持了第一批冲泡头试生产，并形成用于减少胶囊内蒸汽积聚的专利涡流部件。",
    relatedPatents: [
      relatedPatent(
        "US2011061534A1",
        "茶胶囊机饮品制备装置，也以 WO2009135899 公开。",
      ),
    ],
  },
  "instant-coffee-dispenser": {
    category: "工业",
    title: "速溶咖啡分配器",
    description:
      "用于速溶咖啡计量的原型设备，并通过终端用户包装和实体模型进行测试。",
    imageAlt: "带手部交互的速溶咖啡分配器原型",
    overview:
      "一个实体原型项目，聚焦速溶咖啡处理、计量人体工学和紧凑设备形态。",
  },
  "vacheron-watch-mechanics": {
    category: "工业",
    title: "钟表机械",
    description: "精密钟表研究，结合机械布置、渲染装配和组件分析。",
    imageAlt: "可见机芯的机械腕表渲染图",
    overview:
      "该钟表项目聚焦精密机械、机芯可视化，以及小型高价值组件的结构评估。",
  },
  "velum-sky-screen": {
    category: "工业",
    title: "Velum SKY 屏幕机构",
    description: "用于屏幕或幕墙元素的建筑机构原型，以精密机械组件形式拍摄。",
    imageAlt: "深色工作室背景下的 Velum SKY 机械屏幕原型",
    overview:
      "Velum SKY 通过高精度机械组件呈现，指向一种需要稳健运动和清晰细节的建筑或环境屏幕机构。",
  },
};

const PROJECT_OVERRIDES: Record<
  ProjectsLocale,
  Record<string, Partial<Project>>
> = {
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

function localizeRelatedPatents(
  relatedPatents: Project["relatedPatents"],
  locale: ProjectsLocale,
): Project["relatedPatents"] {
  if (!relatedPatents?.length) return relatedPatents;

  const noteTranslations = RELATED_PATENT_NOTE_TRANSLATIONS[locale];
  if (!noteTranslations) return relatedPatents;

  return relatedPatents.map((patent) => ({
    ...patent,
    note: noteTranslations[patent.patentId as RelatedPatentId] ?? patent.note,
  }));
}

const PINNED_PROJECT_IDS = [
  "aventor",
  "special-t-machine",
  "stajvelo-rv01",
  "softcar",
  "sam-cree",
];

const PROJECT_SORT_YEARS: Partial<Record<string, number>> = {
  "totalcar-concept": 2011,
  softcar: 2015,
};

const FILTER_PROJECT_PRIORITY_IDS: Partial<
  Record<Exclude<FilterKey, "all">, string[]>
> = {
  mobility: ["aventor"],
  medical: ["airsmile"],
};

const PROJECT_SOURCE_POSITIONS = new Map(
  [FEATURED_PROJECT, ...PROJECTS].map((project, index) => [project.id, index]),
);

const PROJECT_INITIAL_POSITION_OVERRIDES: Partial<Record<string, number>> = {
  "folding-bike-scooter": PROJECT_SOURCE_POSITIONS.get("ikitty"),
  ikitty: PROJECT_SOURCE_POSITIONS.get("folding-bike-scooter"),
  weebot: PROJECT_SOURCE_POSITIONS.get("angel-interceptor"),
  "angel-interceptor": PROJECT_SOURCE_POSITIONS.get("vacheron-watch-mechanics"),
  "vacheron-watch-mechanics": PROJECT_SOURCE_POSITIONS.get("weebot"),
};

function getInitialProjectPosition(projectId: string) {
  return (
    PROJECT_INITIAL_POSITION_OVERRIDES[projectId] ??
    PROJECT_SOURCE_POSITIONS.get(projectId) ??
    Number.MAX_SAFE_INTEGER
  );
}

export const ALL_PROJECTS = [FEATURED_PROJECT, ...PROJECTS].sort((a, b) => {
  const aIndex = PINNED_PROJECT_IDS.indexOf(a.id);
  const bIndex = PINNED_PROJECT_IDS.indexOf(b.id);

  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  }

  return getInitialProjectPosition(a.id) - getInitialProjectPosition(b.id);
});

const PROJECT_SCOPES: Record<
  string,
  Partial<Record<ProjectsLocale, string[]>>
> = {
  "stajvelo-rv01": {
    en: [
      "Polymer and injected-composite architecture for a premium urban e-bike.",
      "Wheel, frame and component integration studies for a distinctive product identity.",
      "CAD refinement toward manufacturable surfaces and robust mechanical interfaces.",
    ],
    fr: [
      "Architecture polymère et composite injecté pour un vélo électrique urbain premium.",
      "Études roues, cadre et intégration composants pour une identité produit distinctive.",
      "Affinage CAO vers des surfaces industrialisables et interfaces mécaniques robustes.",
    ],
    de: [
      "Polymer- und Spritzverbundarchitektur für ein hochwertiges urbanes E-Bike.",
      "Studien zur Integration von Rädern, Rahmen und Komponenten für eine eigenständige Produktidentität.",
      "CAD-Verfeinerung hin zu fertigbaren Oberflächen und robusten mechanischen Schnittstellen.",
    ],
    es: [
      "Arquitectura en polímero y composite inyectado para una bicicleta eléctrica urbana de gama alta.",
      "Estudios de integración de ruedas, cuadro y componentes para una identidad de producto propia.",
      "Perfeccionamiento CAD orientado a superficies industrializables e interfaces mecánicas robustas.",
    ],
    ko: [
      "고급 도심형 전기자전거를 위한 폴리머 및 사출 복합재 구조 설계.",
      "차별화된 제품 정체성을 위한 휠, 프레임, 부품 통합 연구.",
      "양산 가능한 표면과 견고한 기계 인터페이스를 위한 CAD 정교화.",
    ],
    zh: [
      "为高端城市电动自行车开发聚合物与注塑复合材料架构。",
      "研究车轮、车架与组件集成，建立鲜明的产品识别度。",
      "深化 CAD 设计，使表面可工业化制造并确保机械接口可靠。",
    ],
  },
  aventor: {
    en: [
      "Electric vehicle packaging around lightweight bodywork and driver ergonomics.",
      "Composite body and structural studies for a compact performance platform.",
      "Prototype and test-track feedback loop to refine proportions and mechanical layout.",
    ],
    fr: [
      "Implantation du véhicule électrique autour d'une carrosserie légère et de l'ergonomie conducteur.",
      "Études composite et structurelles pour une plateforme compacte performante.",
      "Boucle prototype et essais piste pour affiner proportions et implantation mécanique.",
    ],
    de: [
      "Fahrzeuglayout rund um eine leichte Karosserie und eine ergonomische Fahrerposition.",
      "Verbundwerkstoff- und Strukturstudien für eine kompakte Hochleistungsplattform.",
      "Iterationen aus Prototypen und Streckentests zur Optimierung von Proportionen und Mechaniklayout.",
    ],
    es: [
      "Arquitectura del vehículo eléctrico en torno a una carrocería ligera y a la ergonomía del conductor.",
      "Estudios estructurales y de composite para una plataforma compacta de alto rendimiento.",
      "Iteraciones entre prototipo y pruebas en pista para afinar proporciones e implantación mecánica.",
    ],
    ko: [
      "경량 차체와 운전자 인체공학을 중심으로 한 전기차 패키징 설계.",
      "컴팩트 고성능 플랫폼을 위한 복합재 및 구조 연구.",
      "프로토타입과 주행 시험을 반복해 비례와 기계 배치를 최적화.",
    ],
    zh: [
      "围绕轻量化车身与驾驶者人体工学完成电动车总体布置。",
      "为紧凑型高性能平台开展复合材料与结构研究。",
      "结合原型与赛道测试反馈，优化比例和机械布局。",
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
    de: [
      "Kompakte Schneemobilitätsarchitektur unter Berücksichtigung mechanischer Anforderungen und der Nutzung.",
      "Prototypeniterationen zur Prüfung von Traktion, Fahrposition und Outdoor-Handling.",
      "CAD- und Designstudien vom ersten Funktionsnachweis bis zu einer schlüssigen Produktform.",
    ],
    es: [
      "Arquitectura compacta de movilidad sobre nieve considerando requisitos mecánicos y de uso.",
      "Iteraciones de prototipo para evaluar tracción, postura y comportamiento en exteriores.",
      "Estudios CAD y visuales para evolucionar desde la prueba de concepto hasta una forma de producto coherente.",
    ],
    ko: [
      "기계적 요구와 사용자 조건을 반영한 컴팩트 설상 모빌리티 구조.",
      "구동력, 탑승 자세, 야외 조작성을 검증하기 위한 프로토타입 반복.",
      "초기 개념을 일관된 제품 형태로 발전시키는 CAD 및 디자인 연구.",
    ],
    zh: [
      "在机械与用户需求约束下设计紧凑型雪地出行架构。",
      "通过多轮原型测试牵引力、姿态与户外操控表现。",
      "利用 CAD 与造型研究，将初步概念发展为完整产品形态。",
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
      "Études d'implantation du véhicule pour faciliter l'accès à l'habitacle et réduire l'encombrement.",
      "Stratégie mobilité reliée à une production à faible impact et une architecture recyclable.",
    ],
    de: [
      "Konzept eines kompakten urbanen Elektrofahrzeugs mit leichter Struktur und einfacher Montage.",
      "Layoutstudien für guten Kabinenzugang und einen möglichst kleinen Platzbedarf.",
      "Mobilitätskonzept für ressourcenschonende Produktion und eine recyclingfähige Architektur.",
    ],
    es: [
      "Concepto de vehículo eléctrico urbano compacto con estructura ligera y montaje simplificado.",
      "Estudios de implantación para facilitar el acceso al habitáculo y reducir el espacio ocupado.",
      "Estrategia de movilidad vinculada a una producción de bajo impacto y una arquitectura reciclable.",
    ],
    ko: [
      "경량 구조와 단순 조립을 중심으로 한 컴팩트 도심형 전기차 콘셉트.",
      "실내 접근성을 높이고 차량 점유 공간을 줄이기 위한 레이아웃 연구.",
      "저환경부하 생산과 재활용 가능한 구조를 연계한 모빌리티 전략.",
    ],
    zh: [
      "围绕轻量化结构与简化装配开发紧凑型城市电动车概念。",
      "研究整车布局，改善座舱进出并减小车辆占用空间。",
      "将低影响生产方式与可回收架构纳入整体出行策略。",
    ],
  },
  "sam-cree": {
    en: [
      "Ultra-light electric road vehicle architecture centered on a structural central beam.",
      "Tandem-seat packaging strategy for batteries, drivetrain and reduced urban footprint.",
      "Vehicle chassis and cooling-system patent context gathered under the SAM CREE project.",
    ],
    fr: [
      "Architecture de véhicule routier électrique ultra-léger centrée sur une poutre structurelle centrale.",
      "Implantation en tandem des passagers, des batteries et de la chaîne de traction pour réduire l'encombrement urbain.",
      "Contexte brevets châssis et refroidissement regroupé sous le projet SAM CREE.",
    ],
    de: [
      "Ultraleichte elektrische Straßenfahrzeugarchitektur mit zentralem Strukturträger.",
      "Tandemlayout für Insassen, Batterien und Antrieb zur Reduzierung des Platzbedarfs im Stadtverkehr.",
      "Patentrelevante Arbeiten an Fahrgestell und Kühlsystem im Rahmen des SAM-CREE-Projekts.",
    ],
    es: [
      "Arquitectura de vehículo eléctrico ultraligero basada en una viga estructural central.",
      "Disposición en tándem de ocupantes, baterías y cadena cinemática para reducir la huella urbana.",
      "Trabajos patentados sobre chasis y refrigeración reunidos en el proyecto SAM CREE.",
    ],
    ko: [
      "중앙 구조 빔을 중심으로 한 초경량 전기 도로 차량 아키텍처.",
      "도심 점유 공간을 줄이기 위한 탑승자, 배터리, 구동계의 탠덤 배치.",
      "SAM CREE 프로젝트에 포함된 섀시 및 냉각 시스템 관련 특허 기술.",
    ],
    zh: [
      "以中央结构梁为核心的超轻量电动道路车辆架构。",
      "采用乘员、电池和动力系统纵向布置，减少城市道路占用空间。",
      "SAM CREE 项目涵盖底盘与冷却系统相关专利技术。",
    ],
  },
  "angel-interceptor": {
    en: [
      "Three-wheel vehicle architecture and cockpit package exploration.",
      "CAD studies for body protection, tandem seating and wheel layout.",
      "Prototype-oriented visualization to clarify proportions and mechanical interfaces.",
    ],
    fr: [
      "Exploration d'architecture trois-roues et d'aménagement du poste de conduite.",
      "Études CAO pour protection de carrosserie, sièges tandem et implantation roues.",
      "Visualisation orientée prototype pour clarifier proportions et interfaces mécaniques.",
    ],
    de: [
      "Untersuchung der Dreiradarchitektur und des Cockpitlayouts.",
      "CAD-Studien zu Karosserieschutz, Tandemsitzen und Radanordnung.",
      "Prototypenorientierte Visualisierung zur Klärung von Proportionen und mechanischen Schnittstellen.",
    ],
    es: [
      "Exploración de la arquitectura de tres ruedas y de la disposición del puesto de conducción.",
      "Estudios CAD de protección de carrocería, asientos en tándem y posición de las ruedas.",
      "Visualización orientada al prototipo para definir proporciones e interfaces mecánicas.",
    ],
    ko: [
      "삼륜 차량 구조와 운전석 패키징 탐구.",
      "차체 보호, 탠덤 시트, 휠 배치를 위한 CAD 연구.",
      "비례와 기계 인터페이스를 명확히 하기 위한 프로토타입 중심 시각화.",
    ],
    zh: [
      "探索三轮车辆架构与驾驶舱布置。",
      "通过 CAD 研究车身防护、纵列座椅与车轮布局。",
      "面向原型进行可视化，明确比例与机械接口。",
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
    de: [
      "Städtische Elektrofahrzeugarchitektur mit geringem Ressourcenbedarf und recyclingfähigen Karosserie- und Innenraumsystemen.",
      "Subsystementwicklung für Armaturenbrett, Tür, Lenkrad und rotationsgeformte Karosserieteile.",
      "Industrialisierung mit vereinfachter Montage und CO₂-armer Fahrzeugproduktion.",
    ],
    es: [
      "Arquitectura de vehículo urbano de bajo impacto con carrocería y sistemas interiores reciclables.",
      "Desarrollo de subsistemas para salpicadero, puerta, volante y piezas rotomoldeadas.",
      "Industrialización orientada al montaje simplificado y a una producción de vehículos con bajas emisiones.",
    ],
    ko: [
      "재활용 가능한 차체와 실내 시스템을 갖춘 저환경부하 도심형 전기차 구조.",
      "대시보드, 도어, 스티어링 휠, 회전성형 차체 부품의 하위 시스템 개발.",
      "단순 조립과 저탄소 차량 생산을 고려한 산업화 설계.",
    ],
    zh: [
      "采用可回收车身与内饰系统的低环境负荷城市电动车架构。",
      "开发仪表板、车门、方向盘及滚塑车身部件等子系统。",
      "围绕简化装配与低碳车辆生产制定工业化方案。",
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
    de: [
      "Studien zur Faltgeometrie für kompakte Lagerung und einfachen Transport.",
      "Konzepte für Gelenke, Rahmen und Fahrposition bei kleinen Elektrofahrzeugen.",
      "Gestalterische und mechanische Iterationen für Fahrrad- und Scooterformate.",
    ],
    es: [
      "Estudios de geometría plegable para facilitar el almacenamiento y el transporte.",
      "Conceptos de bisagras, cuadro y posición de conducción para micromovilidad eléctrica.",
      "Iteraciones visuales y mecánicas en formatos de bicicleta y patinete.",
    ],
    ko: [
      "컴팩트한 보관과 운반을 위한 폴딩 지오메트리 연구.",
      "소형 전기 모빌리티를 위한 힌지, 프레임, 주행 자세 콘셉트.",
      "자전거와 스쿠터 형식에 대한 디자인 및 기계 구조 반복 개발.",
    ],
    zh: [
      "研究折叠几何结构，实现紧凑收纳与便捷运输。",
      "为小型电动出行工具开发铰链、车架与骑行姿态方案。",
      "针对自行车与滑板车形态进行造型和机械结构迭代。",
    ],
  },
  "aventor-drone": {
    en: [
      "Lightweight drone frame and component packaging studies.",
      "Prototype assembly work to validate proportions, arms and payload placement.",
      "Field-test iterations connecting CAD intent with physical behavior.",
    ],
    fr: [
      "Études de châssis drone léger et d'intégration des composants.",
      "Assemblage prototype pour valider proportions, bras et positionnement charge utile.",
      "Itérations terrain reliant intention CAO et comportement physique.",
    ],
    de: [
      "Studien zu leichtem Drohnenrahmen und Komponentenintegration.",
      "Prototypenmontage zur Prüfung von Proportionen, Auslegern und Nutzlastposition.",
      "Feldtestiterationen zur Abstimmung von CAD-Konzept und realem Flugverhalten.",
    ],
    es: [
      "Estudios de bastidor ligero e integración de componentes para una plataforma dron.",
      "Montaje de prototipos para validar proporciones, brazos y posición de la carga útil.",
      "Iteraciones de campo para relacionar la intención CAD con el comportamiento físico.",
    ],
    ko: [
      "경량 드론 프레임과 부품 통합 연구.",
      "비례, 암, 탑재물 위치를 검증하기 위한 프로토타입 조립.",
      "CAD 설계 의도와 실제 거동을 연결하는 현장 시험 반복.",
    ],
    zh: [
      "研究轻量化无人机机架与组件集成。",
      "组装原型，验证比例、机臂与载荷位置。",
      "通过现场测试迭代，使 CAD 设计与实际表现相匹配。",
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
      "Intégration interne des composants amovibles et des consommables.",
      "Famille de prototypes pour tester ergonomie et variantes visuelles.",
    ],
    de: [
      "Handliches Dentalgerät mit klarer, vertrauenswürdiger Formensprache.",
      "Interne Integration von abnehmbaren Komponenten und Verbrauchsteilen.",
      "Prototypenfamilie zur Prüfung von Ergonomie und Gestaltungsvarianten.",
    ],
    es: [
      "Formato portátil para un dispositivo dental con un diseño claro y accesible.",
      "Integración interna de componentes extraíbles y consumibles.",
      "Familia de prototipos para evaluar la ergonomía y distintas variantes visuales.",
    ],
    ko: [
      "깔끔하고 친근한 디자인의 휴대형 치과 기기 폼팩터.",
      "분리형 부품과 소모품 인터페이스의 내부 패키징.",
      "인체공학과 디자인 변형을 검증하기 위한 프로토타입 제품군.",
    ],
    zh: [
      "打造外观简洁、亲和的手持式口腔护理设备。",
      "完成可拆卸组件与耗材接口的内部集成。",
      "通过系列原型验证人体工学与不同造型方案。",
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
      "Intégration du mécanisme et des consommables dans un produit dentaire compact.",
      "Visualisation produit pour présentation, validation et alignement design.",
    ],
    de: [
      "Zahnbürstenarchitektur mit integrierten O2-Cosmetics-Kartuschen.",
      "Integration von Mechanik und Verbrauchsteilen in ein kompaktes Zahnpflegeprodukt.",
      "Produktvisualisierung für Präsentation, Validierung und Designabstimmung.",
    ],
    es: [
      "Arquitectura del cuerpo del cepillo con integración de cartuchos O2 Cosmetics.",
      "Integración del mecanismo y los consumibles en un producto dental compacto.",
      "Visualización de producto para presentación, validación y coherencia de diseño.",
    ],
    ko: [
      "O2 Cosmetics 카트리지를 통합한 칫솔 본체 구조.",
      "컴팩트 구강 관리 제품 내부에 메커니즘과 소모품을 통합.",
      "프레젠테이션, 검증, 디자인 정합성을 위한 제품 시각화.",
    ],
    zh: [
      "开发集成 O2 Cosmetics 替换胶囊的牙刷主体架构。",
      "在紧凑型口腔护理产品中整合机构与耗材。",
      "通过产品可视化支持展示、验证与设计统一。",
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
    de: [
      "Schlankes Gehäuse für einen medizinischen Pen mit präzise definiertem Bauraum der Mechanik.",
      "Human-Factors-Arbeit zu Griff, Ablesbarkeit und kontrollierter Handhabung.",
      "Klare industrielle Formensprache für die Präsentation eines Medizinprodukts.",
    ],
    es: [
      "Carcasa esbelta para un dispositivo médico tipo pluma con un volumen interno definido con precisión.",
      "Estudio de factores humanos en agarre, legibilidad y manipulación controlada.",
      "Lenguaje de diseño industrial limpio y adecuado para un dispositivo médico.",
    ],
    ko: [
      "정밀한 내부 메커니즘 공간을 갖춘 슬림형 의료용 펜 하우징.",
      "그립, 가독성, 안정적인 조작을 고려한 휴먼팩터 설계.",
      "의료기기에 적합한 깔끔한 산업 디자인 언어.",
    ],
    zh: [
      "为医疗注射笔设计纤细外壳，并精确定义内部机构空间。",
      "围绕握持、可读性与受控操作开展人因研究。",
      "建立适合医疗器械呈现的简洁工业设计语言。",
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
    de: [
      "Visualisierung von Wirbelsäulenimplantaten und Instrumentensets für die technische Präsentation.",
      "Lastfall- und Finite-Elemente-Analysen für mechanisch kritische Komponenten.",
      "Präzises Komponentenlayout als Verbindung zwischen technischer Validierung und medizinischer Anwendung.",
    ],
    es: [
      "Visualización de implantes e instrumental de columna para presentación técnica.",
      "Análisis de casos de carga y elementos finitos para componentes mecánicos críticos.",
      "Disposición precisa de componentes que une validación de ingeniería y uso médico.",
    ],
    ko: [
      "기술 검토를 위한 척추 임플란트 및 수술 기구 세트 시각화.",
      "핵심 기계 부품의 하중 조건 및 유한요소해석 지원.",
      "엔지니어링 검증과 의료 사용성을 연결하는 정밀 부품 배치.",
    ],
    zh: [
      "为技术展示完成脊柱植入物与器械套件可视化。",
      "针对关键机械部件开展载荷工况与有限元分析。",
      "通过精密组件布局连接工程验证与临床使用需求。",
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
    de: [
      "Gebogenes Bohrführungskonzept für schwer zugängliche Bereiche und kontrollierte Werkzeugrichtung.",
      "Mechanische Spannungsanalysen zur Absicherung von Geometrie und Materialwahl.",
      "Prototypen- und Renderingiterationen zur verständlichen Darstellung des Funktionsprinzips.",
    ],
    es: [
      "Concepto de guía de perforación curva para accesos limitados y dirección controlada de la herramienta.",
      "Verificaciones de tensiones mecánicas para respaldar la geometría y la elección del material.",
      "Iteraciones de prototipo y render para comunicar con claridad el principio de funcionamiento.",
    ],
    ko: [
      "제한된 접근 공간과 공구 방향 제어를 위한 곡선형 드릴 가이드 콘셉트.",
      "형상과 소재 선택을 뒷받침하는 기계 응력 검토.",
      "작동 원리를 명확히 전달하기 위한 프로토타입 및 렌더링 반복.",
    ],
    zh: [
      "为受限操作空间与可控工具方向开发弯曲钻孔导向概念。",
      "通过机械应力校核支持几何结构与材料选择。",
      "迭代原型与渲染图，清晰呈现工作原理。",
    ],
  },
  "biome-staple-applicator": {
    en: [
      "Handheld applicator ergonomics from sketch to CAD layout.",
      "Structural checks and printed prototype work for a biomedical mechanism.",
      "Product refinement around grip, actuation and clean medical presentation.",
    ],
    fr: [
      "Ergonomie d'applicateur portatif depuis le croquis jusqu'à la conception CAO.",
      "Vérifications structurelles et prototypes imprimés pour mécanisme biomédical.",
      "Affinage produit autour de la prise, de l'actionnement et de la présentation médicale.",
    ],
    de: [
      "Ergonomie eines Handapplikators vom ersten Entwurf bis zum CAD-Layout.",
      "Strukturprüfungen und gedruckte Prototypen für einen biomedizinischen Mechanismus.",
      "Produktverfeinerung bei Griff, Betätigung und medizintechnischer Gestaltung.",
    ],
    es: [
      "Ergonomía de un aplicador manual desde el boceto hasta la definición CAD.",
      "Verificaciones estructurales y prototipos impresos para un mecanismo biomédico.",
      "Perfeccionamiento del producto en agarre, accionamiento y presentación médica.",
    ],
    ko: [
      "스케치부터 CAD 레이아웃까지 이어진 휴대형 어플리케이터 인체공학 설계.",
      "바이오메디컬 메커니즘을 위한 구조 검토와 3D 프린팅 프로토타입.",
      "그립, 작동 방식, 의료 제품 표현을 중심으로 한 제품 정교화.",
    ],
    zh: [
      "从草图到 CAD 布局完善手持式施用器的人体工学设计。",
      "通过结构校核与打印原型验证生物医疗机构。",
      "围绕握持、驱动方式与医疗产品表达深化设计。",
    ],
  },
  cliris: {
    en: [
      "Compact consumer appliance architecture with drawer-based cleaning chamber.",
      "Surface, opening and product-language studies for a refined visible object.",
      "Functional packaging around hygienic eyeglass-cleaning use cases.",
    ],
    fr: [
      "Architecture d'appareil grand public compact avec chambre de nettoyage à tiroir.",
      "Études surfaces, ouverture et langage produit pour un objet visible raffiné.",
      "Intégration fonctionnelle autour du nettoyage hygiénique des lunettes.",
    ],
    de: [
      "Kompakte Konsumgerätearchitektur mit schubladenbasierter Reinigungskammer.",
      "Studien zu Oberflächen, Öffnungsbewegung und Formensprache für ein hochwertiges sichtbares Produkt.",
      "Funktionale Integration für eine hygienische und zuverlässige Brillenreinigung.",
    ],
    es: [
      "Arquitectura compacta de electrodoméstico con cámara de limpieza tipo cajón.",
      "Estudios de superficies, apertura y lenguaje formal para un producto visible y cuidado.",
      "Integración funcional orientada a una limpieza higiénica y fiable de las gafas.",
    ],
    ko: [
      "서랍형 세척 챔버를 적용한 컴팩트 소비자 가전 구조.",
      "정제된 외관을 위한 표면, 개폐 방식, 제품 디자인 언어 연구.",
      "안전하고 위생적인 안경 세척을 위한 기능 통합.",
    ],
    zh: [
      "采用抽屉式清洁腔体的紧凑型消费电器架构。",
      "研究表面、开启方式与产品语言，打造精致的可视化产品。",
      "围绕卫生、可靠的眼镜清洁体验完成功能集成。",
    ],
  },
  "filter-carafe": {
    en: [
      "Filtered-water vessel and accessory design for a coherent consumer product system.",
      "Lid-integrated cartridge monitoring principle linked to filtered-water use state.",
      "Design-patent context around both the carafe body and filter accessory.",
    ],
    fr: [
      "Design de carafe filtrante et d'accessoire pour un système produit cohérent.",
      "Principe de suivi de cartouche intégré au couvercle et lié à l'état d'utilisation du filtre.",
      "Contexte brevets de design autour du corps de carafe et de l'accessoire filtrant.",
    ],
    de: [
      "Entwicklung einer Filterkaraffe und ihres Zubehörs als stimmiges Produktsystem.",
      "Im Deckel integriertes Prinzip zur Überwachung der Filterkartusche anhand ihres Nutzungszustands.",
      "Berücksichtigung des Designschutzes für Karaffenkörper und Filterzubehör.",
    ],
    es: [
      "Diseño de una jarra filtrante y sus accesorios como un sistema de producto coherente.",
      "Principio de control del cartucho integrado en la tapa y vinculado al estado de uso del filtro.",
      "Desarrollo respaldado por la protección de diseño de la jarra y del accesorio filtrante.",
    ],
    ko: [
      "필터 카라페와 액세서리를 하나의 일관된 제품 시스템으로 설계.",
      "필터 사용 상태를 확인할 수 있도록 뚜껑에 카트리지 모니터링 원리를 통합.",
      "카라페 본체와 필터 액세서리의 디자인 권리를 고려한 제품 개발.",
    ],
    zh: [
      "将滤水壶与配套附件设计为协调统一的产品系统。",
      "在壶盖中集成滤芯状态监测原理，直观反映使用情况。",
      "在开发中统筹考虑壶体与过滤附件的外观设计保护。",
    ],
  },
  ikitty: {
    en: [
      "Pet-product architecture around capsule insertion and feeding mechanics.",
      "Soft, recognizable product language balanced with internal functional packaging.",
      "Cutaway and prototype views to validate refills, access and product behavior.",
    ],
    fr: [
      "Architecture de produit animalier autour de l'insertion de capsules et du mécanisme de distribution.",
      "Langage produit doux et reconnaissable équilibré avec l'intégration fonctionnelle interne.",
      "Vues coupe et prototypes pour valider recharges, accès et comportement produit.",
    ],
    de: [
      "Produktarchitektur für ein Tierwohl-System mit Kapselaufnahme und Ausgabemechanik.",
      "Freundliche, eigenständige Formensprache in Einklang mit der internen Funktionstechnik.",
      "Schnittmodelle und Prototypen zur Prüfung von Nachfüllung, Zugang und Produktverhalten.",
    ],
    es: [
      "Arquitectura de producto para mascotas basada en la inserción de cápsulas y el mecanismo de dispensación.",
      "Lenguaje formal amable y reconocible, equilibrado con la integración funcional interna.",
      "Vistas en sección y prototipos para validar las recargas, el acceso y el funcionamiento del producto.",
    ],
    ko: [
      "캡슐 삽입과 급여 메커니즘을 중심으로 한 반려동물 제품 구조 설계.",
      "내부 기능 통합과 조화를 이루는 부드럽고 인지하기 쉬운 제품 디자인.",
      "리필, 접근성, 제품 작동을 검증하기 위한 단면 모델과 프로토타입.",
    ],
    zh: [
      "围绕胶囊装载与定量投放机构构建宠物产品架构。",
      "在内部功能集成的基础上，塑造亲和且易于识别的产品语言。",
      "通过剖面图与原型验证补充方式、操作路径和产品运行逻辑。",
    ],
  },
  "smart-bottle": {
    en: [
      "Medical dispenser layout for controlled opioid dosing and secure patient access.",
      "Biometric-use and anti-tamper constraints integrated into a compact product casing.",
      "Internal pouch, module and component packaging shaped around safe drug delivery.",
    ],
    fr: [
      "Architecture de distributeur médical pour dosage contrôlé d'opioïdes et accès patient sécurisé.",
      "Contraintes biométriques et anti-effraction intégrées dans un boîtier produit compact.",
      "Organisation de la poche, du module et des composants autour d'une distribution sûre du médicament.",
    ],
    de: [
      "Architektur eines medizinischen Spenders für kontrollierte Opioiddosierung und sicheren Patientenzugang.",
      "Biometrische Zugangs- und Manipulationsschutzfunktionen in einem kompakten Gehäuse integriert.",
      "Anordnung von Medikamentenbeutel, Modul und Komponenten für eine sichere Ausgabe.",
    ],
    es: [
      "Arquitectura de un dispensador médico para dosificación controlada de opioides y acceso seguro del paciente.",
      "Funciones biométricas y antimanipulación integradas en una carcasa compacta.",
      "Disposición de la bolsa, el módulo y los componentes orientada a una administración segura del medicamento.",
    ],
    ko: [
      "오피오이드 용량을 제어하고 환자 접근을 보호하는 의료용 디스펜서 구조.",
      "컴팩트한 하우징에 생체 인증과 무단 조작 방지 조건을 통합.",
      "안전한 약물 투여를 중심으로 약물 파우치, 모듈, 부품을 배치.",
    ],
    zh: [
      "构建医疗给药设备架构，实现阿片类药物的剂量控制与患者安全访问。",
      "在紧凑外壳中集成生物识别与防篡改功能。",
      "围绕安全给药合理布置药袋、功能模块与内部组件。",
    ],
  },
  "personal-injector": {
    en: [
      "Compact self-injection architecture with connected-device constraints.",
      "Reduced-size kinematics intended to avoid direct needle handling.",
      "Single-use syringe integration around compatibility and safer patient use.",
    ],
    fr: [
      "Architecture d'auto-injection compacte avec contraintes d'objet connecté.",
      "Cinématique réduite pour éviter la manipulation directe de l'aiguille.",
      "Intégration d'une seringue à usage unique autour de la compatibilité et d'un usage patient plus sûr.",
    ],
    de: [
      "Kompakte Architektur für einen Selbstinjektor unter Berücksichtigung vernetzter Funktionen.",
      "Reduzierte Kinematik, damit die Nadel nicht direkt gehandhabt werden muss.",
      "Integration einer Einwegspritze mit Fokus auf Kompatibilität und sichere Anwendung durch Patienten.",
    ],
    es: [
      "Arquitectura compacta de autoinyección compatible con las necesidades de un dispositivo conectado.",
      "Cinemática simplificada para evitar la manipulación directa de la aguja.",
      "Integración de una jeringa desechable centrada en la compatibilidad y la seguridad del paciente.",
    ],
    ko: [
      "연결형 기기 요구사항을 반영한 컴팩트 자가 주사기 구조.",
      "바늘을 직접 다루지 않도록 단순화한 구동 메커니즘.",
      "호환성과 환자 안전을 중심으로 일회용 주사기를 통합.",
    ],
    zh: [
      "结合联网设备需求，构建紧凑型自助注射器架构。",
      "简化运动机构，避免患者直接接触和操作针头。",
      "以兼容性与患者安全为核心，集成一次性注射器。",
    ],
  },
  "acetabular-reamer-holder": {
    en: [
      "PEEK handle and cover design for acetabular reamer instrumentation.",
      "Finite-element checks and material decisions around stiffness and surgical handling.",
      "Injection-molding feasibility connected to a hygienic surgical tool architecture.",
    ],
    fr: [
      "Conception d'une poignée et d'un capot en PEEK pour instrumentation de fraise acétabulaire.",
      "Calculs éléments finis et choix matière autour de la rigidité et de la manipulation chirurgicale.",
      "Faisabilité injection liée à une architecture d'outil chirurgical hygiénique.",
    ],
    de: [
      "Entwicklung von Griff und Abdeckung aus PEEK für ein Instrument zur Hüftpfannenbearbeitung.",
      "Finite-Elemente-Berechnungen und Materialwahl im Hinblick auf Steifigkeit und chirurgische Handhabung.",
      "Bewertung der Spritzgießbarkeit für eine hygienegerechte Instrumentenarchitektur.",
    ],
    es: [
      "Diseño de una empuñadura y una cubierta de PEEK para instrumental de fresado acetabular.",
      "Cálculos por elementos finitos y selección de material según la rigidez y la manipulación quirúrgica.",
      "Estudio de viabilidad de inyección para una arquitectura de instrumental higiénica.",
    ],
    ko: [
      "비구 리머 기구용 PEEK 손잡이와 커버 설계.",
      "강성과 수술 조작성을 고려한 유한요소해석 및 소재 선정.",
      "위생적인 수술 기구 구조를 위한 사출 성형 가능성 검토.",
    ],
    zh: [
      "为髋臼铰刀器械设计 PEEK 手柄与护盖。",
      "结合刚度与手术操作需求开展有限元分析和材料选择。",
      "针对卫生型手术器械架构评估注塑成型可行性。",
    ],
  },
  "single-use-turbine": {
    en: [
      "Disposable medical turbine concept focused on compact geometry.",
      "Development priorities around reduced size, reduced weight and lower cost.",
      "Material and shape exploration for a single-use medical component.",
    ],
    fr: [
      "Concept de turbine médicale jetable centré sur une géométrie compacte.",
      "Priorités de développement autour de la réduction de taille, de poids et de coût.",
      "Exploration matière et forme pour un composant médical à usage unique.",
    ],
    de: [
      "Konzept einer medizinischen Einwegturbine mit besonders kompakter Geometrie.",
      "Entwicklung mit Fokus auf geringere Abmessungen, weniger Gewicht und niedrigere Kosten.",
      "Material- und Formstudien für eine medizinische Einwegkomponente.",
    ],
    es: [
      "Concepto de turbina médica desechable con una geometría especialmente compacta.",
      "Desarrollo centrado en reducir el tamaño, el peso y el coste.",
      "Exploración de materiales y formas para un componente médico de un solo uso.",
    ],
    ko: [
      "컴팩트한 형상에 초점을 맞춘 일회용 의료용 터빈 콘셉트.",
      "크기, 무게, 비용 절감을 중심으로 한 개발.",
      "일회용 의료 부품을 위한 소재와 형상 연구.",
    ],
    zh: [
      "开发以紧凑结构为核心的一次性医疗涡轮概念。",
      "围绕减小尺寸、降低重量与控制成本推进设计。",
      "针对一次性医疗组件探索合适的材料与形态。",
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
      "Tests physiques pour évaluer l'usage, la stabilité et l'efficacité du séchage.",
    ],
    de: [
      "Luftführungs- und Halterungsarchitektur zum Trocknen von Sportausrüstung.",
      "CAD- und Prototypeniterationen zur Abstimmung von Handschuh-, Helm- und Stationsproportionen.",
      "Physische Tests zu Bedienbarkeit, Stabilität und Trocknungsleistung.",
    ],
    es: [
      "Arquitectura de circulación de aire y soportes para secar equipamiento deportivo.",
      "Iteraciones CAD y de prototipo para ajustar las proporciones de guantes, casco y estación.",
      "Pruebas físicas para evaluar el uso, la estabilidad y la eficacia de secado.",
    ],
    ko: [
      "스포츠 장비 건조를 위한 공기 흐름과 지지 구조 설계.",
      "장갑, 헬멧, 스테이션 비례를 조정하는 CAD 및 프로토타입 반복.",
      "사용성, 안정성, 건조 성능을 평가하는 실물 시험.",
    ],
    zh: [
      "为运动装备烘干设计气流路径与支撑结构。",
      "通过 CAD 与原型迭代调整手套、头盔和底座的比例。",
      "利用实物测试评估易用性、稳定性与烘干效率。",
    ],
  },
  "folding-umbrella": {
    en: [
      "Folding and case mechanism studies for a phone-sized umbrella system.",
      "Cutaway and physical prototype work to clarify the opening sequence.",
      "Weather-protection product thinking linked to pocket storage and robustness.",
    ],
    fr: [
      "Études mécanisme pliage et étui pour un parapluie au format téléphone.",
      "Coupes et prototypes physiques pour clarifier la séquence d'ouverture.",
      "Logique produit de protection météo liée au rangement de poche et à la robustesse.",
    ],
    de: [
      "Studien zu Faltmechanik und Hülle für einen Regenschirm im Smartphone-Format.",
      "Schnittdarstellungen und physische Prototypen zur Klärung der Öffnungssequenz.",
      "Wetterschutzkonzept mit Fokus auf Taschentauglichkeit und Robustheit.",
    ],
    es: [
      "Estudio del mecanismo plegable y del estuche para un paraguas del tamaño de un teléfono.",
      "Secciones y prototipos físicos para definir con claridad la secuencia de apertura.",
      "Diseño orientado a la protección frente al clima, el almacenamiento en el bolsillo y la robustez.",
    ],
    ko: [
      "스마트폰 크기로 수납되는 우산의 접이식 메커니즘과 케이스 연구.",
      "개방 순서를 명확히 하기 위한 단면 설계와 실물 프로토타입.",
      "휴대성과 내구성을 함께 고려한 날씨 보호 제품 설계.",
    ],
    zh: [
      "研究可收纳至手机大小的雨伞折叠机构与外壳。",
      "通过剖面方案和实物原型明确展开顺序。",
      "兼顾防风雨性能、口袋收纳与产品耐用性。",
    ],
  },
  "skincare-applicator": {
    en: [
      "Ergonomic handpiece and cartridge packaging for a dermocosmetic applicator.",
      "Fluid-delivery concept work balanced with beauty-product visual codes.",
      "Prototype and principle views to explain use, refill and internal layout.",
    ],
    fr: [
      "Pièce à main ergonomique et intégration de la cartouche pour applicateur dermocosmétique.",
      "Concept de distribution fluide équilibré avec les codes visuels beauté.",
      "Vues prototype et principe pour expliquer usage, recharge et architecture interne.",
    ],
    de: [
      "Ergonomisches Handstück und Kartuschenintegration für einen dermokosmetischen Applikator.",
      "Entwicklung der Flüssigkeitsabgabe im Einklang mit der Formensprache hochwertiger Kosmetikprodukte.",
      "Prototypen und Prinzipdarstellungen zur Erklärung von Anwendung, Nachfüllung und Innenaufbau.",
    ],
    es: [
      "Pieza de mano ergonómica e integración del cartucho para un aplicador dermocosmético.",
      "Concepto de dispensación de fluido en armonía con los códigos visuales del sector de la belleza.",
      "Prototipos y vistas de principio para explicar el uso, la recarga y la arquitectura interna.",
    ],
    ko: [
      "더모코스메틱 어플리케이터를 위한 인체공학적 핸드피스와 카트리지 통합.",
      "뷰티 제품의 시각적 언어와 조화를 이루는 유체 토출 콘셉트.",
      "사용, 리필, 내부 구조를 설명하는 프로토타입과 원리 시각화.",
    ],
    zh: [
      "为皮肤护理施用器设计符合人体工学的手持部件并集成料盒。",
      "在实现稳定流体输送的同时，延续美容产品的视觉语言。",
      "通过原型与原理图说明使用方式、补充流程和内部架构。",
    ],
  },
  "alicoffee-machine": {
    en: [
      "Coffee-machine capsule circuit based on a double-pass water path.",
      "Water moves out and back through the capsule during extraction.",
      "The project description is intentionally limited to this fluidic principle.",
    ],
    fr: [
      "Circuit capsule de machine à café basé sur un chemin d'eau double passage.",
      "L'eau fait un aller-retour dans la capsule pendant l'extraction.",
      "La description du projet reste volontairement limitée à ce principe fluidique.",
    ],
    de: [
      "Kapselsystem einer Kaffeemaschine mit zweifachem Wasserdurchlauf.",
      "Während der Extraktion wird das Wasser durch die Kapsel hin- und zurückgeführt.",
      "Die Projektbeschreibung beschränkt sich bewusst auf dieses Strömungsprinzip.",
    ],
    es: [
      "Circuito de cápsula para cafetera basado en un doble paso del agua.",
      "Durante la extracción, el agua recorre la cápsula en ambos sentidos.",
      "La descripción del proyecto se limita deliberadamente a este principio de circulación.",
    ],
    ko: [
      "물이 두 번 통과하는 캡슐 유로를 적용한 커피 머신 구조.",
      "추출 과정에서 물이 캡슐 내부를 왕복하도록 설계.",
      "프로젝트 설명은 이 유체 원리에 한정해 제공합니다.",
    ],
    zh: [
      "开发采用双程水路的咖啡机胶囊系统。",
      "萃取过程中，水流在胶囊内完成往返循环。",
      "项目介绍有意仅聚焦于这一流体原理。",
    ],
  },
  "special-t-machine": {
    en: [
      "Brewing-unit development for a tea-capsule machine.",
      "Capsule holding, opening, detection, ejection and beverage-flow validation.",
      "Pilot-series support and vortex component work linked to WO2009135899.",
    ],
    fr: [
      "Développement de l'unité d'extraction pour une machine à capsules de thé.",
      "Validation du maintien, de l'ouverture, de la détection, de l'éjection et du flux boisson.",
      "Support présérie et composant à vortex relié au brevet WO2009135899.",
    ],
    de: [
      "Entwicklung der Brüheinheit für eine Teekapselmaschine.",
      "Validierung von Kapselaufnahme, Öffnung, Erkennung, Auswurf und Getränkefluss.",
      "Unterstützung der Vorserie und Entwicklung einer Wirbelkomponente im Zusammenhang mit WO2009135899.",
    ],
    es: [
      "Desarrollo de la unidad de infusión para una máquina de cápsulas de té.",
      "Validación de la sujeción, apertura, detección y expulsión de la cápsula, así como del flujo de bebida.",
      "Apoyo a la preserie y desarrollo de un componente de vórtice relacionado con WO2009135899.",
    ],
    ko: [
      "티 캡슐 머신의 추출 유닛 개발.",
      "캡슐 고정, 개방, 감지, 배출과 음료 흐름 검증.",
      "WO2009135899와 관련된 와류 부품 개발 및 파일럿 생산 지원.",
    ],
    zh: [
      "开发茶胶囊机的冲泡单元。",
      "验证胶囊固定、开启、识别、弹出以及饮品流动过程。",
      "支持试生产，并开发与 WO2009135899 相关的涡流部件。",
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
      "Format d'appareil compact équilibrant manipulation de la poudre et ergonomie grand public.",
      "Contexte brevet flux, air et mélange pour préparation de boissons solubles.",
    ],
    de: [
      "Dosierarchitektur für löslichen Kaffee mit physischen Prototypen zur Prüfung der Bedienung.",
      "Kompaktes Geräteformat, das Pulverhandling und intuitive Nutzung miteinander verbindet.",
      "Patentkontext zu Strömung, Luftführung und Mischung bei der Zubereitung löslicher Getränke.",
    ],
    es: [
      "Arquitectura de dosificación para café soluble con prototipos físicos de interacción.",
      "Formato compacto que combina la manipulación del polvo con una ergonomía intuitiva.",
      "Contexto de patentes sobre flujo, aire y mezcla para preparar bebidas solubles.",
    ],
    ko: [
      "사용자 조작을 검증하는 실물 프로토타입을 포함한 인스턴트 커피 정량 공급 구조.",
      "분말 취급과 직관적인 사용성을 조화시킨 컴팩트 기기 형식.",
      "분말 음료 제조를 위한 유동, 공기, 혼합 관련 특허 기술 반영.",
    ],
    zh: [
      "开发速溶咖啡定量供给架构，并通过实物原型验证人机交互。",
      "以紧凑设备形态兼顾粉料处理与直观操作体验。",
      "结合速溶饮品制备中的流体、空气与混合相关专利技术。",
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
      "Études d'implantation mécanique et de composants pour présentation de mouvement.",
      "Contexte brevet optique et structurel autour d'éléments de mouvement cachés ou raffinés.",
    ],
    de: [
      "Präzise Visualisierung komplexer Uhrwerksmechanismen auf kleinstem Raum.",
      "Studien zu mechanischer Anordnung und Komponenten für die Präsentation des Uhrwerks.",
      "Optischer und konstruktiver Patentkontext für verborgene oder besonders fein ausgeführte Uhrwerkselemente.",
    ],
    es: [
      "Visualización relojera de precisión para mecanismos complejos a pequeña escala.",
      "Estudios de disposición mecánica y componentes para presentar el movimiento.",
      "Contexto de patentes ópticas y estructurales para elementos ocultos o refinados del mecanismo.",
    ],
    ko: [
      "소형 복합 메커니즘을 위한 정밀 시계 구조 시각화.",
      "무브먼트 표현을 위한 기계 배치와 부품 연구.",
      "숨겨지거나 정교하게 구현된 무브먼트 요소의 광학 및 구조 특허 기술 반영.",
    ],
    zh: [
      "为微型复杂机构提供精密制表可视化。",
      "研究机械布局与组件关系，清晰呈现机芯结构。",
      "结合隐藏式或精细化机芯部件的光学与结构专利背景。",
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
    de: [
      "Darstellung eines architektonischen Mechanismus für ein Sichtschutz- oder Schutzsystem.",
      "Präzisionsmontage mit Fokus auf Bewegung, Rahmensteifigkeit und saubere Detaillierung.",
      "Patentkontext für Gehäuse und Rahmen zum Schutz vor Witterung und Sonne.",
    ],
    es: [
      "Presentación de un mecanismo arquitectónico para una pantalla o sistema de protección.",
      "Montaje de precisión centrado en el movimiento, la rigidez del marco y la calidad de los detalles.",
      "Contexto de patentes para carcasas y marcos de protección frente al clima y al sol.",
    ],
    ko: [
      "스크린 또는 차양 시스템을 위한 건축용 메커니즘 설계 표현.",
      "움직임, 프레임 강성, 깔끔한 디테일을 고려한 정밀 조립 설계.",
      "비와 햇빛을 막는 하우징 및 프레임 관련 특허 기술 반영.",
    ],
    zh: [
      "呈现用于遮挡或防护系统的建筑机械结构。",
      "围绕运动方式、框架刚度与细节品质开展精密装配设计。",
      "结合防雨与遮阳外壳、框架相关的专利背景。",
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
    const projectOverride = overrides[project.id];
    const projectWithLocalizedPatents =
      projectOverride?.relatedPatents || resolvedLocale === "en"
        ? localizedProject
        : {
            ...localizedProject,
            relatedPatents: localizeRelatedPatents(
              localizedProject.relatedPatents,
              resolvedLocale,
            ),
          };

    return withProjectScope(projectWithLocalizedPatents, resolvedLocale);
  });
}

export function getPatentLinkedProjectsForLocale(
  patentId: string,
  locale: string,
): Project[] {
  return getProjectsForLocale(locale).flatMap((project) => {
    const isLinked = project.relatedPatents?.some(
      (patent) => patent.patentId === patentId,
    );

    if (!isLinked) return [];

    return [project];
  });
}

function isProjectCategoryFilter(
  key: FilterKey,
): key is Exclude<FilterKey, "all"> {
  return key !== "all";
}

const ACTIVE_PROJECT_FILTER_KEYS = new Set<Exclude<FilterKey, "all">>(
  ALL_PROJECTS.flatMap((project) => (project.filter ? [project.filter] : [])),
);

function withActiveProjectFilters(filters: ProjectFilterOption[]) {
  return filters.filter(
    (filter) =>
      !isProjectCategoryFilter(filter.key) ||
      ACTIVE_PROJECT_FILTER_KEYS.has(filter.key),
  );
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
    filters: withActiveProjectFilters(FILTERS),
    featuredProject: withProjectScope(FEATURED_PROJECT, "en"),
    projects: getProjectsForLocale("en"),
    stats: STATS,
    statsLabel: "Project statistics",
    selectedTitle: "Selected projects",
    resultsLabel: "projects shown",
    filtersLabel: "Filter projects",
    sort: {
      label: "Sort",
      options: [
        { key: "default", label: "Default" },
        { key: "date-desc", label: "Newest first" },
        { key: "date-asc", label: "Oldest first" },
        { key: "title-asc", label: "Title A-Z" },
        { key: "title-desc", label: "Title Z-A" },
      ],
    },
    searchLabel: "Search projects",
    searchPlaceholder: "Search...",
    noResults: "No projects match your search.",
    featuredLabel: "Featured project",
    viewCaseStudy: "View project",
    cardOpenDetails: "Open project details",
    modal: {
      close: "Close project details",
      openImage: "View image larger",
      closeImage: "Close enlarged image",
      previousImage: "Previous image",
      nextImage: "Next image",
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
      eyebrow: "Our work in action",
      title: "Projets",
      strong: "Ingénierie suisse de précision",
      rest: "pour des résultats concrets.",
      lead: "Découvrez une sélection de projets où nous transformons des défis complexes en produits performants.",
    },
    filters: withActiveProjectFilters(
      projectFiltersWithLabels({
        all: "Tous",
        mobility: "Mobilité",
        industrial: "Industrie",
        medical: "Médical",
        energy: "Énergie",
        materials: "Matériaux",
        digital: "Digital",
      }),
    ),
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, FR_PROJECT_OVERRIDES),
      "fr",
    ),
    projects: getProjectsForLocale("fr"),
    stats: [
      {
        ...STATS[0],
        label: "Projets livrés",
        value: "100+",
      },
      { ...STATS[1] },
      { ...STATS[2] },
      {
        ...STATS[3],
        label: "Projets internationaux",
        value: "International",
      },
      {
        ...STATS[4],
        label: "Ingénierie suisse",
        value: "Depuis 1998",
      },
    ],
    statsLabel: "Statistiques des projets",
    selectedTitle: "Projets sélectionnés",
    resultsLabel: "projets affichés",
    filtersLabel: "Filtrer les projets",
    sort: {
      label: "Trier",
      options: [
        { key: "default", label: "Initial" },
        { key: "date-desc", label: "Plus récents" },
        { key: "date-asc", label: "Plus anciens" },
        { key: "title-asc", label: "Titre A-Z" },
        { key: "title-desc", label: "Titre Z-A" },
      ],
    },
    searchLabel: "Rechercher des projets",
    searchPlaceholder: "Rechercher...",
    noResults: "Aucun projet ne correspond à votre recherche.",
    featuredLabel: "Projet phare",
    viewCaseStudy: "Voir le projet",
    cardOpenDetails: "Ouvrir le détail du projet",
    modal: {
      close: "Fermer le détail du projet",
      openImage: "Voir l'image en grand",
      closeImage: "Fermer l'image agrandie",
      previousImage: "Image précédente",
      nextImage: "Image suivante",
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
      eyebrow: "Let's build together",
      title: "Let's build what's next",
      bodyStrong: "Vous avez un défi en tête ?",
      body: "Nous accompagnons les entreprises visionnaires pour concevoir, prototyper et concrétiser des solutions à fort impact.",
      button: "Démarrer un projet",
      subject: "Demande de projet",
    },
  },
  de: {
    hero: {
      eyebrow: "Our work in action",
      title: "Projekte",
      strong: "Schweizer Präzisionstechnik",
      rest: "für messbare Ergebnisse.",
      lead: "Entdecken Sie eine Auswahl von Projekten, in denen wir komplexe Herausforderungen in leistungsfähige Produkte verwandeln.",
    },
    filters: withActiveProjectFilters(
      projectFiltersWithLabels({
        all: "Alle",
        mobility: "Mobilität",
        medical: "Medizin",
        industrial: "Industrie",
        energy: "Energie",
        materials: "Materialien",
        digital: "Digital",
      }),
    ),
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, DE_PROJECT_OVERRIDES),
      "de",
    ),
    projects: getProjectsForLocale("de"),
    stats: [
      { ...STATS[0], label: "Gelieferte Projekte", value: "100+" },
      { ...STATS[1] },
      { ...STATS[2] },
      { ...STATS[3], label: "Internationale Projekte", value: "Weltweit" },
      {
        ...STATS[4],
        label: "Schweizer Ingenieurskunst",
        value: "Seit 1998",
      },
    ],
    statsLabel: "Projektstatistiken",
    selectedTitle: "Ausgewählte Projekte",
    resultsLabel: "Projekte angezeigt",
    filtersLabel: "Projekte filtern",
    sort: {
      label: "Sortieren",
      options: [
        { key: "default", label: "Standard" },
        { key: "date-desc", label: "Neueste zuerst" },
        { key: "date-asc", label: "Älteste zuerst" },
        { key: "title-asc", label: "Titel A-Z" },
        { key: "title-desc", label: "Titel Z-A" },
      ],
    },
    searchLabel: "Projekte suchen",
    searchPlaceholder: "Suchen...",
    noResults: "Keine Projekte entsprechen Ihrer Suche.",
    featuredLabel: "Ausgewähltes Projekt",
    viewCaseStudy: "Projekt ansehen",
    cardOpenDetails: "Projektdetails öffnen",
    modal: {
      close: "Projektdetails schließen",
      openImage: "Bild vergrößern",
      closeImage: "Vergrößertes Bild schließen",
      previousImage: "Vorheriges Bild",
      nextImage: "Nächstes Bild",
      gallery: "Projektbilder",
      overview: "Projektübersicht",
      scope: "Unser Beitrag",
      tags: "Projekt-Tags",
      relatedPatents: "Verknüpfte Patente",
      area: "Bereich",
      focus: "Fokus",
      output: "Ergebnis",
      design: "Design",
      prototype: "Prototyp",
    },
    cta: {
      eyebrow: "Let's build together",
      title: "Entwickeln wir die nächste Lösung",
      bodyStrong: "Haben Sie eine Herausforderung im Kopf?",
      body: "Wir arbeiten mit zukunftsorientierten Unternehmen zusammen, um Lösungen zu entwerfen, zu prototypisieren und zu liefern, die echte Wirkung entfalten.",
      button: "Projekt starten",
      subject: "Projektanfrage",
    },
  },
  es: {
    hero: {
      eyebrow: "Our work in action",
      title: "Proyectos",
      strong: "Ingeniería suiza de precisión",
      rest: "para resultados reales.",
      lead: "Explora una selección de proyectos en los que convertimos retos complejos en productos de alto rendimiento.",
    },
    filters: withActiveProjectFilters(
      projectFiltersWithLabels({
        all: "Todos",
        mobility: "Movilidad",
        medical: "Médico",
        industrial: "Industrial",
        energy: "Energía",
        materials: "Materiales",
        digital: "Digital",
      }),
    ),
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, ES_PROJECT_OVERRIDES),
      "es",
    ),
    projects: getProjectsForLocale("es"),
    stats: [
      { ...STATS[0], label: "Proyectos entregados", value: "100+" },
      { ...STATS[1] },
      { ...STATS[2] },
      { ...STATS[3], label: "Proyectos globales", value: "Internacional" },
      {
        ...STATS[4],
        label: "Ingeniería suiza",
        value: "Desde 1998",
      },
    ],
    statsLabel: "Estadísticas de proyectos",
    selectedTitle: "Proyectos seleccionados",
    resultsLabel: "proyectos mostrados",
    filtersLabel: "Filtrar proyectos",
    sort: {
      label: "Ordenar",
      options: [
        { key: "default", label: "Inicial" },
        { key: "date-desc", label: "Más recientes" },
        { key: "date-asc", label: "Más antiguos" },
        { key: "title-asc", label: "Título A-Z" },
        { key: "title-desc", label: "Título Z-A" },
      ],
    },
    searchLabel: "Buscar proyectos",
    searchPlaceholder: "Buscar...",
    noResults: "Ningún proyecto coincide con tu búsqueda.",
    featuredLabel: "Proyecto destacado",
    viewCaseStudy: "Ver proyecto",
    cardOpenDetails: "Abrir detalles del proyecto",
    modal: {
      close: "Cerrar detalles del proyecto",
      openImage: "Ver imagen ampliada",
      closeImage: "Cerrar imagen ampliada",
      previousImage: "Imagen anterior",
      nextImage: "Imagen siguiente",
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
      eyebrow: "Let's build together",
      title: "Demos forma al próximo proyecto",
      bodyStrong: "¿Tienes un reto en mente?",
      body: "Colaboramos con empresas visionarias para diseñar, prototipar y entregar soluciones con impacto real.",
      button: "Iniciar un proyecto",
      subject: "Consulta de proyecto",
    },
  },
  ko: {
    hero: {
      eyebrow: "Our work in action",
      title: "프로젝트",
      strong: "스위스 정밀 엔지니어링",
      rest: "으로 실질적인 성과를 만듭니다.",
      lead: "복잡한 과제를 고성능 제품으로 바꾼 프로젝트를 살펴보세요.",
    },
    filters: withActiveProjectFilters(
      projectFiltersWithLabels({
        all: "전체",
        mobility: "모빌리티",
        medical: "의료",
        industrial: "산업",
        energy: "에너지",
        materials: "소재",
        digital: "디지털",
      }),
    ),
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, KO_PROJECT_OVERRIDES),
      "ko",
    ),
    projects: getProjectsForLocale("ko"),
    stats: [
      { ...STATS[0], label: "완료한 프로젝트", value: "100+" },
      { ...STATS[1] },
      { ...STATS[2] },
      { ...STATS[3], label: "글로벌 프로젝트", value: "전 세계" },
      {
        ...STATS[4],
        label: "스위스 엔지니어링",
        value: "1998년부터",
      },
    ],
    statsLabel: "프로젝트 통계",
    selectedTitle: "선정 프로젝트",
    resultsLabel: "개 프로젝트",
    filtersLabel: "프로젝트 필터",
    sort: {
      label: "정렬",
      options: [
        { key: "default", label: "기본 순서" },
        { key: "date-desc", label: "최신순" },
        { key: "date-asc", label: "오래된순" },
        { key: "title-asc", label: "제목 A-Z" },
        { key: "title-desc", label: "제목 Z-A" },
      ],
    },
    searchLabel: "프로젝트 검색",
    searchPlaceholder: "검색...",
    noResults: "검색 조건에 맞는 프로젝트가 없습니다.",
    featuredLabel: "추천 프로젝트",
    viewCaseStudy: "프로젝트 보기",
    cardOpenDetails: "프로젝트 상세 열기",
    modal: {
      close: "프로젝트 상세 닫기",
      openImage: "이미지 크게 보기",
      closeImage: "확대 이미지 닫기",
      previousImage: "이전 이미지",
      nextImage: "다음 이미지",
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
      eyebrow: "Let's build together",
      title: "다음 솔루션을 함께 개발합니다",
      bodyStrong: "구상 중인 과제가 있으신가요?",
      body: "미래지향적인 기업과 함께 실질적인 가치를 만드는 솔루션을 설계하고 프로토타입으로 검증해 실현합니다.",
      button: "프로젝트 시작",
      subject: "프로젝트 문의",
    },
  },
  zh: {
    hero: {
      eyebrow: "Our work in action",
      title: "项目",
      strong: "瑞士精密工程",
      rest: "成就可靠成果。",
      lead: "探索一组选定项目，了解我们如何把复杂挑战转化为高性能产品。",
    },
    filters: withActiveProjectFilters(
      projectFiltersWithLabels({
        all: "全部",
        mobility: "出行",
        medical: "医疗",
        industrial: "工业",
        energy: "能源",
        materials: "材料",
        digital: "数字化",
      }),
    ),
    featuredProject: withProjectScope(
      localizeProject(FEATURED_PROJECT, ZH_PROJECT_OVERRIDES),
      "zh",
    ),
    projects: getProjectsForLocale("zh"),
    stats: [
      { ...STATS[0], label: "交付项目", value: "100+" },
      { ...STATS[1] },
      { ...STATS[2] },
      { ...STATS[3], label: "国际项目", value: "全球" },
      {
        ...STATS[4],
        label: "瑞士工程",
        value: "始于 1998",
      },
    ],
    statsLabel: "项目统计",
    selectedTitle: "精选项目",
    resultsLabel: "个项目",
    filtersLabel: "筛选项目",
    sort: {
      label: "排序",
      options: [
        { key: "default", label: "默认顺序" },
        { key: "date-desc", label: "最新优先" },
        { key: "date-asc", label: "最早优先" },
        { key: "title-asc", label: "标题 A-Z" },
        { key: "title-desc", label: "标题 Z-A" },
      ],
    },
    searchLabel: "搜索项目",
    searchPlaceholder: "搜索...",
    noResults: "没有符合搜索条件的项目。",
    featuredLabel: "重点项目",
    viewCaseStudy: "查看项目",
    cardOpenDetails: "打开项目详情",
    modal: {
      close: "关闭项目详情",
      openImage: "放大查看图片",
      closeImage: "关闭放大图片",
      previousImage: "上一张图片",
      nextImage: "下一张图片",
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
      eyebrow: "Let's build together",
      title: "共同开发下一项解决方案",
      bodyStrong: "有想解决的挑战吗？",
      body: "我们与具有前瞻性的企业合作，设计、原型验证并交付真正产生影响的解决方案。",
      button: "启动项目",
      subject: "项目咨询",
    },
  },
};

const MODAL_TRANSITION_MS = 320;
const MODAL_CLOSE_FALLBACK_MS = 360;
const PROJECT_HORIZONTAL_SCROLL_SELECTOR =
  "[data-project-dialog-horizontal-scroll]";
export const PROJECT_DETAIL_HASH_PREFIX = "project-";

function canScrollHorizontally(container: HTMLElement, deltaX: number) {
  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (maxScrollLeft <= 0) return false;
  if (deltaX < 0) return container.scrollLeft > 0;
  if (deltaX > 0) return container.scrollLeft < maxScrollLeft - 1;
  return true;
}

function scrollHorizontalTrackFromWheel(
  event: WheelEvent,
  container: HTMLElement,
) {
  const delta =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  if (!delta || !canScrollHorizontally(container, delta)) return false;

  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  container.scrollLeft = Math.max(
    0,
    Math.min(container.scrollLeft + delta, maxScrollLeft),
  );

  return true;
}

export function getProjectsPageCopy(locale: string) {
  return PROJECTS_COPY[resolveProjectsLocale(locale)];
}

function getProjectSortYear(project: Project) {
  const explicitYear = PROJECT_SORT_YEARS[project.id];
  if (explicitYear) return explicitYear;

  const yearTag = project.tags.find((tag) => /^#(?:19|20)\d{2}$/.test(tag));
  return yearTag ? Number(yearTag.slice(1)) : 0;
}

function compareProjectTitles(a: Project, b: Project, locale: ProjectsLocale) {
  return new Intl.Collator(locale, {
    numeric: true,
    sensitivity: "base",
  }).compare(a.title, b.title);
}

function sortProjectsByTitle(
  projects: Project[],
  locale: ProjectsLocale,
  filter?: Exclude<FilterKey, "all">,
) {
  const priorityIds = filter ? (FILTER_PROJECT_PRIORITY_IDS[filter] ?? []) : [];

  return projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const aPriority = priorityIds.indexOf(a.project.id);
      const bPriority = priorityIds.indexOf(b.project.id);

      if (aPriority !== -1 || bPriority !== -1) {
        return (
          (aPriority === -1 ? 999 : aPriority) -
          (bPriority === -1 ? 999 : bPriority)
        );
      }

      const titleOrder = compareProjectTitles(a.project, b.project, locale);
      return titleOrder !== 0 ? titleOrder : a.index - b.index;
    })
    .map(({ project }) => project);
}

function sortProjects(
  projects: Project[],
  sortKey: ProjectSortKey,
  locale: ProjectsLocale,
) {
  const withIndex = projects.map((project, index) => ({ project, index }));

  return withIndex
    .sort((a, b) => {
      switch (sortKey) {
        case "date-desc": {
          const yearOrder =
            getProjectSortYear(b.project) - getProjectSortYear(a.project);
          if (yearOrder !== 0) return yearOrder;

          return a.index - b.index;
        }
        case "date-asc": {
          const yearOrder =
            getProjectSortYear(a.project) - getProjectSortYear(b.project);
          if (yearOrder !== 0) return yearOrder;

          return a.index - b.index;
        }
        case "title-asc":
          return compareProjectTitles(a.project, b.project, locale);
        case "title-desc":
          return compareProjectTitles(b.project, a.project, locale);
        case "default":
        default:
          return a.index - b.index;
      }
    })
    .map(({ project }) => project);
}

function centeredPanelRect(): PanelRect {
  const isMobile = window.innerWidth <= 640;
  const pad = isMobile ? 14 : 34;
  const maxWidth =
    window.innerWidth >= 2400 ? 2040 : window.innerWidth >= 1800 ? 1680 : 880;
  const maxHeight =
    window.innerWidth >= 2400 ? 1180 : window.innerWidth >= 1800 ? 980 : 720;
  const width = Math.min(maxWidth, window.innerWidth - pad * 2);
  const height = Math.min(maxHeight, window.innerHeight - pad * 2);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
    radius: isMobile ? "16px" : window.innerWidth >= 1800 ? "26px" : "22px",
  };
}

function ProjectImageLightbox({
  image,
  alt,
  closeLabel,
  previousLabel,
  nextLabel,
  hasMultiple,
  onClose,
  onPrevious,
  onNext,
}: {
  image: string;
  alt: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  hasMultiple: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [viewerState, setViewerState] = useState({
    image,
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
  });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(
    new Map(),
  );
  const panRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const pinchRef = useRef<{
    distance: number;
    centerX: number;
    centerY: number;
    offsetX: number;
    offsetY: number;
    zoom: number;
  } | null>(null);
  const swipeRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    used: boolean;
  } | null>(null);

  const currentViewerState =
    viewerState.image === image
      ? viewerState
      : { image, offsetX: 0, offsetY: 0, zoom: 1 };
  const { offsetX, offsetY, zoom } = currentViewerState;
  const imageStyle = {
    transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoom})`,
  } satisfies CSSProperties;

  const updateViewerState = useCallback(
    (nextState: Omit<typeof viewerState, "image">) => {
      setViewerState({
        image,
        ...nextState,
      });
    },
    [image],
  );

  const clampZoom = useCallback(
    (value: number) => Math.min(3, Math.max(1, Number(value.toFixed(2)))),
    [],
  );

  const getPinchGesture = useCallback(() => {
    const [first, second] = Array.from(activePointersRef.current.values());
    if (!first || !second) return null;

    const deltaX = second.x - first.x;
    const deltaY = second.y - first.y;

    return {
      centerX: (first.x + second.x) / 2,
      centerY: (first.y + second.y) / 2,
      distance: Math.hypot(deltaX, deltaY),
    };
  }, []);

  const getZoomedOffset = useCallback(
    (
      element: HTMLDivElement,
      clientX: number,
      clientY: number,
      startZoom: number,
      nextZoom: number,
      startOffsetX: number,
      startOffsetY: number,
    ) => {
      if (nextZoom <= 1) return { offsetX: 0, offsetY: 0 };

      const rect = element.getBoundingClientRect();
      const focalX = clientX - rect.left;
      const focalY = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const zoomRatio = nextZoom / Math.max(startZoom, 0.01);

      return {
        offsetX:
          startOffsetX + (focalX - centerX - startOffsetX) * (1 - zoomRatio),
        offsetY:
          startOffsetY + (focalY - centerY - startOffsetY) * (1 - zoomRatio),
      };
    },
    [],
  );

  const handleWheelZoom = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();
      event.stopPropagation();

      const normalizedDelta = Math.max(-18, Math.min(18, event.deltaY));
      const nextZoom = clampZoom(zoom * Math.exp(-normalizedDelta * 0.01));
      if (nextZoom === zoom) return;

      updateViewerState({
        ...getZoomedOffset(
          event.currentTarget,
          event.clientX,
          event.clientY,
          zoom,
          nextZoom,
          offsetX,
          offsetY,
        ),
        zoom: nextZoom,
      });
    },
    [clampZoom, getZoomedOffset, offsetX, offsetY, updateViewerState, zoom],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      event.currentTarget.setPointerCapture(event.pointerId);

      if (activePointersRef.current.size >= 2) {
        event.preventDefault();
        panRef.current = null;
        swipeRef.current = null;
        const pinch = getPinchGesture();
        if (pinch) {
          pinchRef.current = {
            ...pinch,
            offsetX,
            offsetY,
            zoom,
          };
        }
        return;
      }

      swipeRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        used: false,
      };

      if (zoom <= 1) return;

      event.preventDefault();
      panRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    },
    [getPinchGesture, offsetX, offsetY, zoom],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activePointersRef.current.has(event.pointerId)) {
        activePointersRef.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
      }

      const pinch = getPinchGesture();
      if (activePointersRef.current.size >= 2 && pinch) {
        event.preventDefault();
        if (!pinchRef.current) {
          pinchRef.current = {
            ...pinch,
            offsetX,
            offsetY,
            zoom,
          };
          return;
        }

        const start = pinchRef.current;
        if (start.distance <= 0) return;

        const nextZoom = clampZoom(
          start.zoom * (pinch.distance / start.distance),
        );
        const rect = event.currentTarget.getBoundingClientRect();
        const startFocalX = start.centerX - rect.left;
        const startFocalY = start.centerY - rect.top;
        const focalX = pinch.centerX - rect.left;
        const focalY = pinch.centerY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const zoomRatio = nextZoom / Math.max(start.zoom, 0.01);

        updateViewerState({
          offsetX:
            nextZoom === 1
              ? 0
              : focalX -
                centerX -
                zoomRatio * (startFocalX - centerX - start.offsetX),
          offsetY:
            nextZoom === 1
              ? 0
              : focalY -
                centerY -
                zoomRatio * (startFocalY - centerY - start.offsetY),
          zoom: nextZoom,
        });
        return;
      }

      const pan = panRef.current;
      if (!pan || pan.pointerId !== event.pointerId) return;

      event.preventDefault();
      const deltaX = event.clientX - pan.x;
      const deltaY = event.clientY - pan.y;
      panRef.current = {
        ...pan,
        x: event.clientX,
        y: event.clientY,
      };
      setViewerState((current) => {
        const base =
          current.image === image
            ? current
            : { image, offsetX: 0, offsetY: 0, zoom: 1 };

        return {
          ...base,
          offsetX: base.offsetX + deltaX,
          offsetY: base.offsetY + deltaY,
        };
      });
    },
    [
      clampZoom,
      getPinchGesture,
      image,
      offsetX,
      offsetY,
      updateViewerState,
      zoom,
    ],
  );

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      activePointersRef.current.delete(event.pointerId);
      if (activePointersRef.current.size < 2) {
        pinchRef.current = null;
      }

      const pan = panRef.current;
      if (pan?.pointerId === event.pointerId) {
        panRef.current = null;
      }

      const swipe = swipeRef.current;
      if (
        swipe?.pointerId === event.pointerId &&
        !swipe.used &&
        zoom <= 1 &&
        hasMultiple &&
        event.pointerType === "touch"
      ) {
        const deltaX = swipe.x - event.clientX;
        const deltaY = swipe.y - event.clientY;
        if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY)) {
          swipeRef.current = { ...swipe, used: true };
          if (deltaX > 0) {
            onNext();
          } else {
            onPrevious();
          }
        }
      }

      if (swipe?.pointerId === event.pointerId) {
        swipeRef.current = null;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [hasMultiple, onNext, onPrevious, zoom],
  );

  return (
    <div
      className="fixed inset-0 z-[40] grid place-items-center bg-black/82 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={closeLabel}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-white/25 bg-white text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <X className="size-5" aria-hidden />
      </button>
      {hasMultiple && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:left-6 md:size-12"
            aria-label={previousLabel}
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:right-6 md:size-12"
            aria-label={nextLabel}
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </>
      )}
      <div
        data-project-image-zoom
        data-lenis-prevent
        className={cn(
          PROJECT_LIGHTBOX_FRAME_CLASS,
          "overflow-hidden select-none",
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
        style={{ touchAction: "none" }}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const nextZoom = zoom > 1 ? 1 : 2;
          updateViewerState({
            ...getZoomedOffset(
              event.currentTarget,
              event.clientX,
              event.clientY,
              zoom,
              nextZoom,
              offsetX,
              offsetY,
            ),
            zoom: nextZoom,
          });
        }}
        onWheel={handleWheelZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <Image
          src={image}
          alt={alt}
          fill
          draggable={false}
          sizes={PROJECT_LIGHTBOX_IMAGE_SIZES}
          style={imageStyle}
          className="object-contain"
        />
      </div>
    </div>
  );
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
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(
    null,
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null,
  );
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
  const expandedImage =
    expandedImageIndex === null
      ? null
      : (projectGallery[expandedImageIndex] ?? activeGalleryImage);

  const showExpandedImageAt = useCallback(
    (index: number) => {
      if (!projectGallery.length) return;

      const nextIndex =
        ((index % projectGallery.length) + projectGallery.length) %
        projectGallery.length;
      setActiveGalleryIndex(nextIndex);
      setExpandedImageIndex(nextIndex);
    },
    [projectGallery.length],
  );

  const showPreviousExpandedImage = useCallback(() => {
    if (expandedImageIndex === null) return;
    showExpandedImageAt(expandedImageIndex - 1);
  }, [expandedImageIndex, showExpandedImageAt]);

  const showNextExpandedImage = useCallback(() => {
    if (expandedImageIndex === null) return;
    showExpandedImageAt(expandedImageIndex + 1);
  }, [expandedImageIndex, showExpandedImageAt]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimer();
    setSelectedPatent(null);
    setExpandedImageIndex(null);
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
    let touchStartX = 0;
    let touchStartY = 0;

    const canScrollWithin = (container: HTMLElement, deltaY: number) => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      if (maxScrollTop <= 0) return false;
      if (deltaY < 0) return container.scrollTop > 0;
      if (deltaY > 0) return container.scrollTop < maxScrollTop - 1;
      return true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const preventBackgroundScroll = (event: Event) => {
      const horizontalScrollContainer =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              PROJECT_HORIZONTAL_SCROLL_SELECTOR,
            )
          : null;
      const zoomContainer =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(PROJECT_IMAGE_ZOOM_SELECTOR)
          : null;
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

      if (zoomContainer) return;

      if (horizontalScrollContainer) {
        if (
          event instanceof WheelEvent &&
          scrollHorizontalTrackFromWheel(event, horizontalScrollContainer)
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event instanceof TouchEvent) {
          const currentX = event.touches[0]?.clientX ?? touchStartX;
          const currentY = event.touches[0]?.clientY ?? touchStartY;
          const deltaX = touchStartX - currentX;
          const touchDeltaY = touchStartY - currentY;

          if (
            Math.abs(deltaX) > Math.abs(touchDeltaY) &&
            canScrollHorizontally(horizontalScrollContainer, deltaX)
          ) {
            event.stopPropagation();
            return;
          }
        }
      }

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
    window.addEventListener(
      "wheel",
      preventBackgroundScroll,
      scrollEventOptions,
    );
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
      if (expandedImageIndex !== null) {
        if (event.key === "Escape") {
          setExpandedImageIndex(null);
          return;
        }

        if (projectGallery.length > 1 && event.key === "ArrowLeft") {
          event.preventDefault();
          showPreviousExpandedImage();
          return;
        }

        if (projectGallery.length > 1 && event.key === "ArrowRight") {
          event.preventDefault();
          showNextExpandedImage();
        }

        return;
      }

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
          !element.hasAttribute("disabled") &&
          element.getClientRects().length > 0,
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
  }, [
    closeProject,
    expandedImageIndex,
    projectGallery.length,
    selectedPatent,
    showNextExpandedImage,
    showPreviousExpandedImage,
  ]);

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
              "absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-border bg-white/95 text-foreground transition duration-200 hover:rotate-6 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:right-8 min-[1800px]:top-8 min-[1800px]:size-14 min-[2400px]:size-16",
              contentVisible ? "opacity-100" : "opacity-0",
            )}
            aria-label={modal.close}
            onClick={closeProject}
          >
            <X className="size-4 min-[1800px]:size-6 min-[2400px]:size-7" aria-hidden />
          </button>

          <div
            className={cn(
              "grid h-full md:grid-cols-[46%_54%] min-[1800px]:grid-cols-[48%_52%]",
              !contentVisible && "pointer-events-none",
            )}
          >
            <div className="flex min-h-[280px] flex-col overflow-hidden bg-muted md:min-h-0">
              <button
                type="button"
                className="relative min-h-[210px] flex-1 cursor-zoom-in overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/35 min-[1800px]:min-h-[620px] min-[2400px]:min-h-[740px]"
                aria-label={modal.openImage}
                onClick={() =>
                  setExpandedImageIndex(
                    Math.min(
                      activeGalleryIndex,
                      Math.max(projectGallery.length - 1, 0),
                    ),
                  )
                }
              >
                <Image
                  src={activeGalleryImage}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 2400px) 980px, (min-width: 1800px) 820px, (max-width: 768px) 100vw, 460px"
                  className="object-contain p-6 md:p-7 min-[1800px]:p-12 min-[2400px]:p-14"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </button>

              {projectGallery.length > 1 && (
                <div
                  className="border-t border-border bg-white/[0.92] p-3 min-[1800px]:p-6 min-[2400px]:p-7"
                  aria-label={modal.gallery}
                >
                  <div
                    data-project-dialog-horizontal-scroll
                    data-lenis-prevent
                    className="flex touch-pan-x gap-2 overflow-x-auto overscroll-x-contain pb-1 min-[1800px]:gap-4"
                  >
                    {projectGallery.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        className={cn(
                          "relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[4px] border bg-muted transition-[border-color,opacity,transform] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:h-[92px] min-[1800px]:w-[132px] min-[2400px]:h-[108px] min-[2400px]:w-[156px]",
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
                          sizes="(min-width: 2400px) 156px, (min-width: 1800px) 132px, 76px"
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
              className="min-h-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-9 md:py-10 min-[1800px]:px-16 min-[1800px]:py-16 min-[2400px]:px-20 min-[2400px]:py-[72px]"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand min-[1800px]:text-[17px] min-[2400px]:text-[19px]">
                {project.category}
              </span>
              <h2
                id="project-dialog-title"
                className="mt-4 max-w-[500px] text-[34px] font-extrabold leading-[0.98] tracking-[-0.02em] text-foreground md:text-[48px] min-[1800px]:max-w-[840px] min-[1800px]:text-[78px] min-[2400px]:max-w-[980px] min-[2400px]:text-[92px]"
              >
                {project.title}
              </h2>
              <p className="mt-6 max-w-[500px] text-[16px] font-medium leading-[1.45] text-muted-foreground md:text-[17px] min-[1800px]:max-w-[860px] min-[1800px]:text-[26px] min-[2400px]:max-w-[980px] min-[2400px]:text-[30px]">
                {project.description}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2 min-[1800px]:mt-14 min-[1800px]:gap-12 min-[2400px]:mt-16">
                <section>
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                    {modal.overview}
                  </h3>
                  <p className="mt-4 text-[14px] font-medium leading-[1.65] text-muted-foreground min-[1800px]:text-[21px] min-[2400px]:text-[24px]">
                    {project.overview}
                  </p>
                </section>
                {project.scope?.length ? (
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                      {modal.scope}
                    </h3>
                    <ul className="mt-4 grid gap-2 text-[13px] font-medium leading-[1.45] text-muted-foreground min-[1800px]:gap-4 min-[1800px]:text-[20px] min-[2400px]:text-[23px]">
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
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                    {modal.tags}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground min-[1800px]:px-5 min-[1800px]:py-2.5 min-[1800px]:text-[17px] min-[2400px]:text-[19px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {project.relatedPatents?.length ? (
                <section className="mt-8 border border-border bg-white min-[1800px]:mt-14">
                  <div className="border-b border-border px-4 py-3 min-[1800px]:px-7 min-[1800px]:py-6">
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                      {modal.relatedPatents}
                    </h3>
                  </div>
                  <div className="grid divide-y divide-border">
                    {project.relatedPatents.map((patent) => (
                      <button
                        key={patent.publication}
                        type="button"
                        className="group/patentLink grid gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:gap-3 min-[1800px]:px-7 min-[1800px]:py-6"
                        aria-haspopup="dialog"
                        onClick={() => openRelatedPatent(patent.patentId)}
                      >
                        <span className="text-[11px] font-extrabold text-brand min-[1800px]:text-[17px] min-[2400px]:text-[19px]">
                          {patent.publication}
                        </span>
                        <span className="text-[14px] font-extrabold leading-tight text-foreground transition-colors group-hover/patentLink:text-brand min-[1800px]:text-[22px] min-[2400px]:text-[25px]">
                          {patent.title}
                        </span>
                        <span className="text-[12px] font-medium leading-[1.45] text-muted-foreground min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                          {patent.note}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </section>

        {expandedImage && (
          <ProjectImageLightbox
            image={expandedImage}
            alt={project.imageAlt}
            closeLabel={modal.closeImage}
            previousLabel={modal.previousImage}
            nextLabel={modal.nextImage}
            hasMultiple={projectGallery.length > 1}
            onClose={() => setExpandedImageIndex(null)}
            onPrevious={showPreviousExpandedImage}
            onNext={showNextExpandedImage}
          />
        )}
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
  const [sortKey, setSortKey] = useState<ProjectSortKey>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord | null>(
    null,
  );
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

  useEffect(() => {
    const closeSortOnOutsidePointer = (event: PointerEvent) => {
      const sortDetails = Array.from(
        document.querySelectorAll<HTMLDetailsElement>(
          "[data-project-sort-details]",
        ),
      );
      const openSortDetails = sortDetails.filter((details) => details.open);
      if (openSortDetails.length === 0) return;
      if (
        event.target instanceof Node &&
        openSortDetails.some((details) =>
          details.contains(event.target as Node),
        )
      ) {
        return;
      }

      openSortDetails.forEach((details) => details.removeAttribute("open"));
    };

    document.addEventListener("pointerdown", closeSortOnOutsidePointer);

    return () => {
      document.removeEventListener("pointerdown", closeSortOnOutsidePointer);
    };
  }, []);

  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredProjects =
      activeFilter === "all"
        ? copy.projects
        : copy.projects.filter((project) => project.filter === activeFilter);

    const matchedProjects = query
      ? filteredProjects.filter((project) =>
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
        )
      : filteredProjects;

    if (activeFilter !== "all" && sortKey === "default") {
      return sortProjectsByTitle(matchedProjects, resolvedLocale, activeFilter);
    }

    return sortProjects(matchedProjects, sortKey, resolvedLocale);
  }, [activeFilter, copy.projects, resolvedLocale, searchQuery, sortKey]);
  const handleFilterChange = useCallback((filter: FilterKey) => {
    setActiveFilter(filter);
    setSortKey("default");
  }, []);
  const activeSortLabel =
    copy.sort.options.find((option) => option.key === sortKey)?.label ??
    copy.sort.options[0]?.label ??
    copy.sort.label;

  const renderProjectControls = ({
    wrapperClassName,
    sortClassName,
    searchClassName,
  }: {
    wrapperClassName: string;
    sortClassName: string;
    searchClassName: string;
  }) => (
    <div className={wrapperClassName}>
      <details data-project-sort-details className={sortClassName}>
        <summary
          className="flex h-12 w-full cursor-pointer list-none items-center justify-between gap-2 rounded-[4px] border border-border bg-white px-4 text-[13px] font-extrabold text-foreground shadow-[0_2px_7px_rgba(0,0,0,0.05)] outline-none transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 focus-visible:ring-2 focus-visible:ring-brand/35 min-[520px]:px-2 md:px-3 xl:px-4 min-[1800px]:!h-[58px] min-[2400px]:!h-[64px] min-[2400px]:!gap-4 min-[2400px]:!rounded-[7px] min-[2400px]:!px-6 min-[2400px]:!text-[20px] [&::-webkit-details-marker]:hidden"
          aria-label={copy.sort.label}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <ArrowDownUp className="size-4 shrink-0 text-brand min-[2400px]:!size-6" aria-hidden />
            <span className="shrink-0">{copy.sort.label}</span>
          </span>
          <span className="max-w-[110px] truncate text-[12px] font-medium text-muted-foreground min-[520px]:max-w-[48px] md:max-w-[74px] xl:max-w-[110px] min-[2400px]:!max-w-[190px] min-[2400px]:!text-[18px]">
            {activeSortLabel}
          </span>
        </summary>
        <div className="absolute left-0 top-[calc(100%+8px)] grid min-w-[220px] rounded-[7px] border border-border bg-white p-1 shadow-[0_16px_34px_rgba(0,0,0,0.14)] min-[2400px]:top-[calc(100%+14px)] min-[2400px]:min-w-[360px] min-[2400px]:rounded-[12px] min-[2400px]:p-2">
          {copy.sort.options.map((option) => {
            const active = option.key === sortKey;

            return (
              <button
                key={option.key}
                type="button"
                className={cn(
                  "flex items-center justify-between gap-4 rounded-[5px] px-3 py-2 text-left text-[13px] font-bold text-foreground transition-colors hover:bg-brand/10 focus-visible:bg-brand/10 focus-visible:outline-none min-[2400px]:rounded-[8px] min-[2400px]:px-5 min-[2400px]:py-4 min-[2400px]:text-[20px]",
                  active && "bg-brand text-white hover:bg-brand",
                )}
                aria-pressed={active}
                onClick={(event) => {
                  setSortKey(option.key);
                  event.currentTarget
                    .closest("details")
                    ?.removeAttribute("open");
                }}
              >
                <span>{option.label}</span>
                {active ? (
                  <Check className="size-4 shrink-0 min-[2400px]:size-6" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      </details>

      <label className={searchClassName}>
        <span className="sr-only">{copy.searchLabel}</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground min-[2400px]:!left-6 min-[2400px]:!size-6"
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-12 w-full rounded-[4px] border border-border bg-white pl-11 pr-4 text-[13px] font-medium text-foreground outline-none shadow-[0_2px_7px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/75 focus:border-brand/50 focus:shadow-[0_10px_24px_rgba(0,0,0,0.08)] min-[1800px]:!h-[58px] min-[2400px]:!h-[64px] min-[2400px]:!rounded-[7px] min-[2400px]:!pl-[58px] min-[2400px]:!pr-6 min-[2400px]:!text-[20px]"
        />
      </label>
    </div>
  );
  const [expandedGalleryIndex, setExpandedGalleryIndex] = useState<
    number | null
  >(null);

  const selectedProjectGallery = useMemo(
    () => (selectedProject ? getProjectGallery(selectedProject) : []),
    [selectedProject],
  );
  const activeGalleryImage =
    selectedProjectGallery[
      Math.min(
        activeGalleryIndex,
        Math.max(selectedProjectGallery.length - 1, 0),
      )
    ] ?? selectedProject?.image;
  const expandedGalleryImage =
    expandedGalleryIndex === null
      ? null
      : (selectedProjectGallery[expandedGalleryIndex] ??
        activeGalleryImage ??
        selectedProject?.image ??
        null);

  const showExpandedGalleryImageAt = useCallback(
    (index: number) => {
      if (!selectedProjectGallery.length) return;

      const nextIndex =
        ((index % selectedProjectGallery.length) +
          selectedProjectGallery.length) %
        selectedProjectGallery.length;
      setActiveGalleryIndex(nextIndex);
      setExpandedGalleryIndex(nextIndex);
    },
    [selectedProjectGallery.length],
  );

  const showPreviousExpandedGalleryImage = useCallback(() => {
    if (expandedGalleryIndex === null) return;
    showExpandedGalleryImageAt(expandedGalleryIndex - 1);
  }, [expandedGalleryIndex, showExpandedGalleryImageAt]);

  const showNextExpandedGalleryImage = useCallback(() => {
    if (expandedGalleryIndex === null) return;
    showExpandedGalleryImageAt(expandedGalleryIndex + 1);
  }, [expandedGalleryIndex, showExpandedGalleryImageAt]);

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
    setExpandedGalleryIndex(null);
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
      setExpandedGalleryIndex(null);
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
      const projectId = new URLSearchParams(window.location.search).get(
        "project",
      );
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
    let touchStartX = 0;
    let touchStartY = 0;

    const canScrollWithin = (container: HTMLElement, deltaY: number) => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      if (maxScrollTop <= 0) return false;
      if (deltaY < 0) return container.scrollTop > 0;
      if (deltaY > 0) return container.scrollTop < maxScrollTop - 1;
      return true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const preventBackgroundScroll = (event: Event) => {
      const horizontalScrollContainer =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              PROJECT_HORIZONTAL_SCROLL_SELECTOR,
            )
          : null;
      const zoomContainer =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(PROJECT_IMAGE_ZOOM_SELECTOR)
          : null;
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

      if (zoomContainer) return;

      if (horizontalScrollContainer) {
        if (
          event instanceof WheelEvent &&
          scrollHorizontalTrackFromWheel(event, horizontalScrollContainer)
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event instanceof TouchEvent) {
          const currentX = event.touches[0]?.clientX ?? touchStartX;
          const currentY = event.touches[0]?.clientY ?? touchStartY;
          const deltaX = touchStartX - currentX;
          const touchDeltaY = touchStartY - currentY;

          if (
            Math.abs(deltaX) > Math.abs(touchDeltaY) &&
            canScrollHorizontally(horizontalScrollContainer, deltaX)
          ) {
            event.stopPropagation();
            return;
          }
        }
      }

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
    window.addEventListener(
      "wheel",
      preventBackgroundScroll,
      scrollEventOptions,
    );
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
      if (expandedGalleryIndex !== null) {
        if (event.key === "Escape") {
          setExpandedGalleryIndex(null);
          return;
        }

        if (selectedProjectGallery.length > 1 && event.key === "ArrowLeft") {
          event.preventDefault();
          showPreviousExpandedGalleryImage();
          return;
        }

        if (selectedProjectGallery.length > 1 && event.key === "ArrowRight") {
          event.preventDefault();
          showNextExpandedGalleryImage();
        }

        return;
      }

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
          !element.hasAttribute("disabled") &&
          element.getClientRects().length > 0,
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
  }, [
    closeProject,
    expandedGalleryIndex,
    selectedPatent,
    selectedProject,
    selectedProjectGallery.length,
    showNextExpandedGalleryImage,
    showPreviousExpandedGalleryImage,
  ]);

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
        className="relative overflow-hidden border-b border-border bg-background pt-[132px] md:min-h-[590px] md:pt-[152px] min-[2400px]:!min-h-[1060px] min-[2400px]:!pt-[152px]"
        aria-labelledby="projects-page-title"
      >
        <Image
          src="/assets/project-page/image-fond-top.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 z-0 object-contain object-right-top opacity-[0.82] min-[2400px]:scale-[1.18] min-[2400px]:opacity-90"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/55 via-white/15 to-transparent" />
        <div
          className="pointer-events-none absolute bottom-[-22px] right-[-44vw] z-[1] hidden h-[430px] w-[96vw] max-w-none opacity-95 md:block lg:bottom-[-36px] lg:right-[-31vw] lg:h-[520px] lg:w-[86vw] xl:right-[-24vw] 2xl:right-[-15vw] min-[1800px]:!right-[calc((100vw-1680px)/2-170px)] min-[1800px]:!w-[min(72vw,1640px)] min-[2400px]:!bottom-[-64px] min-[2400px]:!right-[calc((100vw-1900px)/2-330px)] min-[2400px]:!h-[860px] min-[2400px]:!w-[1900px]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.18) 7%, black 18%, black 82%, rgb(0 0 0 / 0.24) 93%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.18) 7%, black 18%, black 82%, rgb(0 0 0 / 0.24) 93%, transparent 100%)",
          }}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 0.72) 7%, black 18%, black 78%, rgb(0 0 0 / 0.35) 91%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 0.72) 7%, black 18%, black 78%, rgb(0 0 0 / 0.35) 91%, transparent 100%)",
            }}
          >
            <div
              className="absolute bottom-[14%] left-[18%] right-[5%] z-[1] h-[18%] rotate-[-1deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.3)_34%,rgba(0,0,0,0.13)_62%,transparent_80%)] opacity-85 blur-[20px] mix-blend-multiply lg:bottom-[12%] lg:left-[15%] lg:right-[4%] lg:h-[20%] lg:blur-[26px]"
              aria-hidden
            />
            <div
              className="absolute left-[18%] right-[5%] top-[17%] z-[1] h-[17%] rotate-[1deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.26)_34%,rgba(0,0,0,0.12)_62%,transparent_80%)] opacity-78 blur-[22px] mix-blend-multiply lg:left-[14%] lg:right-[4%] lg:top-[15%] lg:h-[18%] lg:blur-[28px]"
              aria-hidden
            />
            <Image
              src="/assets/projects/aventor/aventor-hero.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 96vw, 1180px"
              className="z-[2] object-contain object-center"
            />
            <div
              className="absolute inset-y-0 left-0 z-[3] w-[36%] bg-gradient-to-r from-background via-background/90 to-transparent xl:w-[38%]"
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 z-[3] h-[24%] bg-gradient-to-t from-background via-background/86 to-transparent"
              aria-hidden
            />
            <div
              className="absolute inset-y-0 right-0 z-[3] w-[18%] bg-gradient-to-l from-background/90 via-background/52 to-transparent"
              aria-hidden
            />
          </div>
        </div>

        <Container
          size="wide"
          className="relative z-10 flex items-start pb-14 md:min-h-[410px] md:pb-10 min-[2400px]:!min-h-[780px] min-[2400px]:!pb-20"
        >
          <Reveal className="max-w-[560px] pb-5 md:pb-0 min-[1800px]:!max-w-[720px] min-[2400px]:!max-w-[900px]">
            <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground md:text-[16px] min-[2400px]:!gap-5 min-[2400px]:!text-[26px]">
              <span className="h-[3px] w-[34px] shrink-0 bg-brand min-[2400px]:!h-1 min-[2400px]:!w-[74px]" aria-hidden />
              {copy.hero.eyebrow}
            </div>
            <h1
              id="projects-page-title"
              className="domtek-text-shadow mt-[38px] max-w-full text-[42px] font-extrabold leading-none text-foreground sm:text-[60px] md:mt-[52px] md:text-[66px] min-[1800px]:!text-[74px] min-[2400px]:!mt-[82px] min-[2400px]:!text-[96px]"
            >
              {copy.hero.title}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-8 max-w-[430px] text-[15px] font-medium leading-[1.35] text-muted-foreground sm:text-[16px] min-[1800px]:!max-w-[620px] min-[1800px]:!text-[18px] min-[2400px]:!max-w-[760px] min-[2400px]:!text-[21px]">
              <strong className="font-extrabold">{copy.hero.strong}</strong>{" "}
              {copy.hero.rest}
            </p>
            <p className="mt-5 max-w-[430px] text-[15px] font-medium leading-[1.35] text-muted-foreground sm:text-[16px] min-[1800px]:!max-w-[620px] min-[1800px]:!text-[18px] min-[2400px]:!max-w-[760px] min-[2400px]:!text-[21px]">
              {copy.hero.lead}
            </p>
          </Reveal>
        </Container>
      </section>

      <ProjectsStatsSection stats={copy.stats} ariaLabel={copy.statsLabel} />

      <section
        id="projects"
        className="bg-background py-[48px] md:py-[56px] min-[2400px]:!py-[96px]"
        aria-labelledby="selected-projects"
      >
        <Container size="wide">
          <Reveal className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between min-[2400px]:gap-8">
            <div className="min-w-0 shrink-0">
              <h2
                id="selected-projects"
                className="text-[22px] font-extrabold leading-none text-foreground min-[2400px]:!text-[40px]"
              >
                {copy.selectedTitle}
              </h2>
              <p className="mt-3 text-[12px] font-medium text-muted-foreground min-[2400px]:!mt-5 min-[2400px]:!text-[20px]">
                {visibleProjects.length} / {copy.projects.length}{" "}
                {copy.resultsLabel}
              </p>
            </div>
            {renderProjectControls({
              wrapperClassName:
                "grid w-full min-w-0 gap-3 min-[520px]:grid-cols-[minmax(138px,180px)_minmax(0,1fr)] md:w-auto md:flex lg:hidden",
              sortClassName: "relative z-30 min-w-0 md:w-[180px]",
              searchClassName: "relative block min-w-0 md:w-[320px]",
            })}
          </Reveal>

          <Reveal delay={0.06} className="mb-7 mt-7 min-[2400px]:mb-12 min-[2400px]:mt-12" as="div">
              <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-[82px_repeat(3,minmax(0,1fr))] lg:grid-cols-[82px_repeat(3,136px)_160px_200px] xl:grid-cols-[82px_repeat(3,152px)_180px_254px] min-[2400px]:!grid-cols-[136px_repeat(3,236px)_280px_420px] min-[2400px]:!gap-5">
              <div
                className="contents"
                role="group"
                aria-label={copy.filtersLabel}
              >
                {copy.filters.map((filter) => {
                  const active = activeFilter === filter.key;
                  const count =
                    filter.key === "all"
                      ? copy.projects.length
                      : copy.projects.filter(
                          (project) => project.filter === filter.key,
                        ).length;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      className={cn(
                        "group/filter grid h-[48px] min-w-0 items-center gap-3 rounded-[4px] border border-border bg-white px-4 text-left shadow-[0_2px_6px_rgba(0,0,0,0.05)] outline-none transition-[translate,background-color,border-color,box-shadow,color] duration-500 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_12px_26px_rgba(0,0,0,0.09)] focus-visible:ring-2 focus-visible:ring-brand/35 min-[520px]:gap-2 min-[520px]:px-2 md:px-3 xl:px-4 min-[1800px]:!h-[58px] min-[1800px]:!gap-3 min-[1800px]:!px-5 min-[2400px]:!h-[64px] min-[2400px]:!gap-4 min-[2400px]:!px-6 [transition-timing-function:var(--ease-smooth)]",
                        filter.icon
                          ? "grid-cols-[auto_1fr]"
                          : "place-items-center text-center",
                        active &&
                          "border-brand bg-brand text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_12px_26px_rgba(0,0,0,0.18)]",
                      )}
                      aria-pressed={active}
                      onClick={() => handleFilterChange(filter.key)}
                    >
                      {filter.icon && (
                        <Image
                          src={filter.icon}
                          alt=""
                          width={filter.width}
                          height={filter.height}
                          unoptimized
                          className={cn(
                            "object-contain transition-[filter,transform] duration-500 group-hover/filter:-translate-y-0.5 group-hover/filter:scale-105 min-[520px]:max-h-7 min-[520px]:max-w-7 md:max-h-none md:max-w-none min-[2400px]:!max-h-11 min-[2400px]:!max-w-11 [transition-timing-function:var(--ease-smooth)]",
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
                        <strong className="truncate text-[12px] font-extrabold leading-none min-[520px]:text-[11px] md:text-[12px] min-[2400px]:!text-[20px]">
                          {filter.label}
                        </strong>
                        {filter.key !== "all" && (
                          <span
                            className={cn(
                              "mt-1 truncate text-[9px] font-medium leading-none text-muted-foreground min-[2400px]:!mt-2 min-[2400px]:!text-[15px]",
                              active && "text-white/85",
                            )}
                          >
                            {count}{" "}
                            {resolvedLocale === "fr" ? "projets" : "projects"}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {renderProjectControls({
                wrapperClassName: "hidden lg:contents",
                sortClassName: "relative z-30 min-w-0",
                searchClassName: "relative block w-full min-w-0",
              })}
            </div>
          </Reveal>

          {visibleProjects.length > 0 ? (
            <div className="grid items-stretch gap-4 md:grid-cols-2 min-[2400px]:!grid-cols-3 min-[2400px]:!gap-6">
              {visibleProjects.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard
                    project={project}
                    onOpen={openProject}
                    ctaLabel={copy.viewCaseStudy}
                    openDetailsLabel={copy.cardOpenDetails}
                  />
                </div>
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
                "absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-border bg-white/95 text-foreground transition duration-200 hover:rotate-6 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:right-8 min-[1800px]:top-8 min-[1800px]:size-14 min-[2400px]:size-16",
                contentVisible ? "opacity-100" : "opacity-0",
              )}
              aria-label={copy.modal.close}
              onClick={closeProject}
            >
              <X className="size-4 min-[1800px]:size-6 min-[2400px]:size-7" aria-hidden />
            </button>

            <div
              className={cn(
                "grid h-full md:grid-cols-[46%_54%] min-[1800px]:grid-cols-[48%_52%]",
                !contentVisible && "pointer-events-none",
              )}
            >
              <div className="flex min-h-[280px] flex-col overflow-hidden bg-muted md:min-h-0">
                <button
                  type="button"
                  className="relative min-h-[210px] flex-1 cursor-zoom-in overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/35 min-[1800px]:min-h-[620px] min-[2400px]:min-h-[740px]"
                  aria-label={copy.modal.openImage}
                  onClick={() =>
                    setExpandedGalleryIndex(
                      Math.min(
                        activeGalleryIndex,
                        Math.max(selectedProjectGallery.length - 1, 0),
                      ),
                    )
                  }
                >
                  <Image
                    src={activeGalleryImage ?? selectedProject.image}
                    alt={selectedProject.imageAlt}
                    fill
                    sizes="(min-width: 2400px) 980px, (min-width: 1800px) 820px, (max-width: 768px) 100vw, 460px"
                    className="object-contain p-6 md:p-7 min-[1800px]:p-12 min-[2400px]:p-14"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                </button>

                {selectedProjectGallery.length > 1 && (
                  <div
                    className="border-t border-border bg-white/[0.92] p-3 min-[1800px]:p-6 min-[2400px]:p-7"
                    aria-label={copy.modal.gallery}
                  >
                    <div
                      data-project-dialog-horizontal-scroll
                      data-lenis-prevent
                      className="flex touch-pan-x gap-2 overflow-x-auto overscroll-x-contain pb-1 min-[1800px]:gap-4"
                    >
                      {selectedProjectGallery.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          className={cn(
                            "relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[4px] border bg-muted transition-[border-color,opacity,transform] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:h-[92px] min-[1800px]:w-[132px] min-[2400px]:h-[108px] min-[2400px]:w-[156px]",
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
                            sizes="(min-width: 2400px) 156px, (min-width: 1800px) 132px, 76px"
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
                className="min-h-0 overflow-y-auto overscroll-contain px-5 py-7 md:px-9 md:py-10 min-[1800px]:px-16 min-[1800px]:py-16 min-[2400px]:px-20 min-[2400px]:py-[72px]"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand min-[1800px]:text-[17px] min-[2400px]:text-[19px]">
                  {selectedProject.category}
                </span>
                <h2
                  id="project-dialog-title"
                  className="mt-4 max-w-[500px] text-[34px] font-extrabold leading-[0.98] tracking-[-0.02em] text-foreground md:text-[48px] min-[1800px]:max-w-[840px] min-[1800px]:text-[78px] min-[2400px]:max-w-[980px] min-[2400px]:text-[92px]"
                >
                  {selectedProject.title}
                </h2>
                <p className="mt-6 max-w-[500px] text-[16px] font-medium leading-[1.45] text-muted-foreground md:text-[17px] min-[1800px]:max-w-[860px] min-[1800px]:text-[26px] min-[2400px]:max-w-[980px] min-[2400px]:text-[30px]">
                  {selectedProject.description}
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2 min-[1800px]:mt-14 min-[1800px]:gap-12 min-[2400px]:mt-16">
                  <section>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                      {copy.modal.overview}
                    </h3>
                    <p className="mt-4 text-[14px] font-medium leading-[1.65] text-muted-foreground min-[1800px]:text-[21px] min-[2400px]:text-[24px]">
                      {selectedProject.overview}
                    </p>
                  </section>
                  {selectedProject.scope?.length ? (
                    <section>
                      <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                        {copy.modal.scope}
                      </h3>
                      <ul className="mt-4 grid gap-2 text-[13px] font-medium leading-[1.45] text-muted-foreground min-[1800px]:gap-4 min-[1800px]:text-[20px] min-[2400px]:text-[23px]">
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
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                      {copy.modal.tags}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground min-[1800px]:px-5 min-[1800px]:py-2.5 min-[1800px]:text-[17px] min-[2400px]:text-[19px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {selectedProject.relatedPatents?.length ? (
                  <section className="mt-8 border border-border bg-white min-[1800px]:mt-14">
                    <div className="border-b border-border px-4 py-3 min-[1800px]:px-7 min-[1800px]:py-6">
                      <h3 className="text-[12px] font-extrabold uppercase tracking-wide min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                        {copy.modal.relatedPatents}
                      </h3>
                    </div>
                    <div className="grid divide-y divide-border">
                      {selectedProject.relatedPatents.map((patent) => (
                        <button
                          key={patent.publication}
                          type="button"
                          className="group/patentLink grid gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 min-[1800px]:gap-3 min-[1800px]:px-7 min-[1800px]:py-6"
                          aria-haspopup="dialog"
                          onClick={() => openRelatedPatent(patent.patentId)}
                        >
                          <span className="text-[11px] font-extrabold text-brand min-[1800px]:text-[17px] min-[2400px]:text-[19px]">
                            {patent.publication}
                          </span>
                          <span className="text-[14px] font-extrabold leading-tight text-foreground transition-colors group-hover/patentLink:text-brand min-[1800px]:text-[22px] min-[2400px]:text-[25px]">
                            {patent.title}
                          </span>
                          <span className="text-[12px] font-medium leading-[1.45] text-muted-foreground min-[1800px]:text-[18px] min-[2400px]:text-[20px]">
                            {patent.note}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
            {expandedGalleryImage && (
              <ProjectImageLightbox
                image={expandedGalleryImage}
                alt={selectedProject.imageAlt}
                closeLabel={copy.modal.closeImage}
                previousLabel={copy.modal.previousImage}
                nextLabel={copy.modal.nextImage}
                hasMultiple={selectedProjectGallery.length > 1}
                onClose={() => setExpandedGalleryIndex(null)}
                onPrevious={showPreviousExpandedGalleryImage}
                onNext={showNextExpandedGalleryImage}
              />
            )}
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
    <section className="bg-background py-[28px] min-[1180px]:pb-5 min-[1180px]:pt-[52px] min-[2400px]:!pb-6 min-[2400px]:!pt-14" aria-label={ariaLabel}>
      <Container size="wide">
        <div className="grid grid-cols-2 overflow-hidden rounded-[7px] border border-border bg-white min-[1180px]:grid-cols-5">
          {stats.map((stat, index) => {
            return (
              <Reveal
                as="article"
                key={`${index}-${stat.label}`}
                delay={index * 0.05}
                className={cn(
                  "group/stat relative flex min-h-[116px] transform-gpu flex-col items-center justify-center gap-1 bg-white px-5 py-2.5 text-center transition-shadow duration-500 hover:z-10 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] sm:min-h-[92px] sm:px-7 sm:py-1.5 min-[1180px]:grid min-[1180px]:min-h-[76px] min-[1180px]:grid-cols-[32px_minmax(0,1fr)] min-[1180px]:items-center min-[1180px]:gap-2 min-[1180px]:px-3 min-[1180px]:py-2 min-[1180px]:text-left min-[2400px]:!min-h-[90px] min-[2400px]:!grid-cols-[48px_1fr] min-[2400px]:!gap-3 min-[2400px]:!px-5 min-[2400px]:!py-3 motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]",
                  index % 2 === 0 && index < stats.length - 1 &&
                    "border-r border-border min-[1180px]:border-r-0",
                  index < stats.length - 1 &&
                    "border-b border-border min-[1180px]:border-b-0",
                  index < stats.length - 1 &&
                    "min-[1180px]:border-r min-[1180px]:border-border",
                  index === stats.length - 1 &&
                    "col-span-2 min-[1180px]:col-span-1",
                )}
              >
                <Image
                  src={stat.icon}
                  alt=""
                  width={stat.width}
                  height={stat.height}
                  className="h-[36px] w-[40px] object-contain transition-transform duration-500 group-hover/stat:-translate-y-1 sm:h-[40px] sm:w-[44px] min-[1180px]:h-[30px] min-[1180px]:w-[32px] min-[2400px]:!h-[46px] min-[2400px]:!w-[48px] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
                />
                <div className="min-w-0 min-[1180px]:grid min-[1180px]:h-[48px] min-[1180px]:grid-rows-[22px_26px] min-[1180px]:content-center min-[2400px]:!h-[60px] min-[2400px]:!grid-rows-[28px_32px]">
                  <strong className="block max-w-full whitespace-nowrap text-[18px] font-extrabold leading-none text-foreground sm:text-[19px] min-[1180px]:flex min-[1180px]:h-[22px] min-[1180px]:items-center min-[1180px]:text-[17px] min-[1180px]:leading-[22px] 2xl:text-[18px] min-[2400px]:!h-[28px] min-[2400px]:!text-[22px] min-[2400px]:!leading-[28px]">
                    {stat.value}
                  </strong>
                  <span className="mt-0.5 block max-w-full break-words text-[12px] font-medium leading-tight text-muted-foreground [hyphens:auto] min-[1180px]:mt-0 min-[1180px]:flex min-[1180px]:h-[26px] min-[1180px]:items-start min-[1180px]:text-[11px] min-[1180px]:leading-[14px] 2xl:text-[12px] min-[2400px]:!h-[32px] min-[2400px]:!text-[15px] min-[2400px]:!leading-[17px]">
                    {stat.label}
                    {stat.detail ? ` ${stat.detail}` : null}
                  </span>
                </div>
              </Reveal>
            );
          })}
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
      className="group h-full overflow-hidden rounded-[7px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(0,0,0,0.07)] min-[2400px]:rounded-[8px]"
    >
      <button
        type="button"
        className="flex h-full w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        aria-haspopup="dialog"
        aria-label={`${openDetailsLabel}: ${project.title}`}
        onClick={() => onOpen(project)}
      >
        <span className="relative block h-[220px] overflow-hidden bg-muted min-[2400px]:!h-[260px]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 2400px) 580px, (max-width: 768px) 100vw, 560px"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <span
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-foreground/80 text-white transition-colors duration-300 group-hover:bg-brand min-[2400px]:!right-5 min-[2400px]:!top-5 min-[2400px]:!size-10"
            aria-hidden
          >
            <ArrowUpRight className="size-4 min-[2400px]:!size-5" />
          </span>
        </span>

        <span className="flex min-h-[150px] flex-1 flex-col px-5 pb-5 pt-5 min-[2400px]:!min-h-[210px] min-[2400px]:!px-6 min-[2400px]:!pb-6 min-[2400px]:!pt-6">
          <span className="text-[11px] font-extrabold text-brand min-[2400px]:!text-[14px]">
            {project.category}
          </span>
          <strong className="mt-2 text-[19px] font-extrabold leading-tight text-foreground min-[2400px]:!mt-3 min-[2400px]:!text-[24px]">
            {project.title}
          </strong>
          <span className="mt-2 text-[13px] font-medium leading-[1.4] text-muted-foreground min-[2400px]:!mt-3 min-[2400px]:!text-[16px]">
            {project.description}
          </span>

          <span className="mt-auto flex items-end justify-between gap-4 pt-6 min-[2400px]:!gap-5 min-[2400px]:!pt-7">
            <span className="inline-flex items-center gap-5 text-[12px] font-extrabold text-foreground min-[2400px]:!gap-5 min-[2400px]:!text-[15px]">
              {ctaLabel}
              <ArrowRight
                className="size-4 text-brand transition-transform duration-300 group-hover:translate-x-1 min-[2400px]:!size-5"
                aria-hidden
              />
            </span>
            <span className="text-right text-[10px] font-medium text-muted-foreground min-[2400px]:!text-[12px]">
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
      className="relative overflow-hidden border-t border-border bg-white py-16 md:min-h-[310px] md:py-20 min-[2400px]:!min-h-[650px] min-[2400px]:!py-[192px]"
      aria-labelledby="projects-cta-title"
    >
      <Image
        src="/assets/project-page/cta-sketch.png"
        alt=""
        width={874}
        height={398}
        quality={100}
        sizes="(min-width: 2400px) 70vw, (max-width: 1024px) 100vw, 700px"
        unoptimized
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[46vw] max-w-[700px] opacity-35 md:block min-[2400px]:bottom-[-40px] min-[2400px]:right-[-6vw] min-[2400px]:w-[70vw] min-[2400px]:max-w-[1640px] min-[2400px]:opacity-45"
      />

      <Container size="wide" className="relative z-10">
        <Reveal className="max-w-[590px] min-[2400px]:!max-w-[1160px]">
          <div className="flex items-center gap-3 text-[15px] font-medium text-muted-foreground min-[2400px]:!gap-5 min-[2400px]:!text-[26px]">
            <span className="h-[2px] w-[26px] bg-brand min-[2400px]:!h-1 min-[2400px]:!w-[74px]" aria-hidden />
            {copy.eyebrow}
          </div>
          <h2
            id="projects-cta-title"
            className="domtek-text-shadow mt-8 text-[36px] font-extrabold leading-[1.05] text-foreground sm:text-[48px] min-[2400px]:!mt-[82px] min-[2400px]:!max-w-[1100px] min-[2400px]:!text-[96px]"
          >
            <span className="text-brand">.</span>
            {copy.title} <span className="text-brand">?</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] font-medium leading-[1.35] text-muted-foreground min-[2400px]:!mt-10 min-[2400px]:!max-w-[900px] min-[2400px]:!text-[29px]">
            <strong className="font-extrabold">{copy.bodyStrong}</strong>{" "}
            {copy.body}
          </p>
          <a
            href={`mailto:contact@domteknika.ch?subject=${mailSubject}`}
            className="mt-8 inline-flex h-10 items-center justify-center gap-6 rounded-[7px] bg-brand px-5 text-[14px] font-extrabold text-white shadow-[0_4px_10px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand/35 min-[2400px]:!mt-14 min-[2400px]:!h-[82px] min-[2400px]:!gap-8 min-[2400px]:!rounded-[10px] min-[2400px]:!px-14 min-[2400px]:!text-[29px]"
          >
            {copy.button}
            <ArrowRight className="size-4 min-[2400px]:!size-9" aria-hidden />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
