"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/providers/reveal";
import {
  OurStoryTimelineBlock,
  OurStoryTimelineRail,
  OurStoryTimelineStep,
} from "@/components/sections/our-story-timeline-rail";
import {
  type Project,
  getProjectsForLocale,
  getProjectsPageCopy,
  ProjectDetailsDialog,
} from "@/components/sections/projects-page-content";
import { cn } from "@/lib/utils";

type StoryLocale = "en" | "fr" | "de" | "es" | "ko" | "zh";
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
  cards: Record<CardKey, StoryCard>;
}

type TimelineBlock =
  | { type: "card"; key: CardKey }
  | { type: "media"; key: MediaKey };

interface TimelineRow {
  left?: TimelineBlock;
  right?: TimelineBlock;
}

const STORY_CARD_PROJECT_IDS: Partial<Record<CardKey, string>> = {
  cree: "sam-cree",
  startup: "smart-bottle",
  totalCar: "totalcar-concept",
  aventor: "aventor",
  boneFixation: "biome-staple-applicator",
  softcar: "softcar",
  stajvelo: "stajvelo-rv01",
  softcarReveal: "softcar",
};

const STORY_ICONS = {
  box: {
    src: "/assets/our-story/icons/box.png",
    width: 256,
    height: 256,
  },
  monitor: {
    src: "/assets/our-story/icons/monitor.png",
    width: 256,
    height: 256,
  },
  document: {
    src: "/assets/our-story/icons/document.png",
    width: 256,
    height: 256,
  },
  globe: {
    src: "/assets/our-story/icons/globe.png",
    width: 256,
    height: 256,
  },
} satisfies Record<IconKey, { src: string; width: number; height: number }>;

const STORY_COPY: Record<StoryLocale, StoryCopy> = {
  en: {
    eyebrow: "Our journey since 1998",
    title: "Our Story",
    intro:
      "Founded in 1998 by Jean-Luc Thuliez, a visionary engineer, DOMTEKNIKA has spent more than 25 years turning complex technical challenges into reliable engineered solutions. From early concepts and prototypes to simulation, electronics and industrial development, we help ideas become products that work. Explore a selection of projects that reflect our expertise and long-standing experience.",
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
      "Fondée en 1998 par Jean-Luc Thuliez, ingénieur visionnaire, DOMTEKNIKA transforme depuis plus de 25 ans des défis techniques complexes en solutions fiables. Des premiers concepts aux prototypes, de la simulation à l'électronique et au développement industriel, nous aidons les idées à devenir des produits qui fonctionnent. Découvrez une sélection de projets qui reflètent notre expertise et notre expérience.",
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
          "Le projet CREE a ouvert un chapitre précoce de la mobilité électrique, avec des véhicules urbains compacts et légers bien avant l'essor de la mobilité électrique.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - un chapitre dédié aux dispositifs médicaux",
        description:
          "Avec SwissBiomed, DOMTEKNIKA a étendu son savoir-faire au développement de dispositifs médicaux, en combinant mécanique de précision, matériaux et prototypage.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "Innovations startup primées 3 ans de suite",
        description:
          "De Smart Bottle à Skin Care et Personal Injector, DOMTEKNIKA a transformé des concepts startup ambitieux en innovations récompensées dans les produits intelligents, les technologies beauté et les dispositifs médicaux.",
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
        title: "Aventor - la haute performance comme banc d'essai",
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
          "DOMTEKNIKA a appliqué son expertise polymère à Stajvelo, un vélo électrique urbain construit autour de structures intégrées, du confort et du design.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Présentation de Softcar V1",
        description:
          "Softcar V1 révèle une nouvelle génération de véhicule urbain propre, concrétisant des décennies d'ingénierie légère et de mobilité circulaire.",
        icon: "globe",
      },
      today: {
        year: "Aujourd'hui",
        title: "Ingénierie pour ce qui vient ensuite",
        description:
          "DOMTEKNIKA continue d'accompagner les innovateurs industriels, médicaux et mobilité, de l'idée au prototype.",
        icon: "document",
      },
    },
  },
  de: {
    eyebrow: "Unser Weg seit 1998",
    title: "Unsere Geschichte",
    intro:
      "1998 vom visionären Ingenieur Jean-Luc Thuliez gegründet, verwandelt DOMTEKNIKA seit mehr als 25 Jahren komplexe technische Herausforderungen in zuverlässige Engineering-Lösungen. Von ersten Konzepten und Prototypen bis zu Simulation, Elektronik und industrieller Entwicklung helfen wir Ideen, zu funktionierenden Produkten zu werden. Entdecken Sie eine Auswahl von Projekten, die unsere Expertise und Erfahrung zeigen.",
    cards: {
      founded: {
        year: "1998",
        title: "Gründung in La Neuveville - Schweiz",
        description:
          "DOMTEKNIKA entstand in La Neuveville mit einer klaren Ambition: Kreativität, Maschinenbau und Polymerkompetenz zu verbinden, um Ideen in konkrete Lösungen zu verwandeln.",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - frühe Schritte in der Elektromobilität",
        description:
          "Das CREE-Projekt eröffnete ein frühes Kapitel der Elektromobilität mit kompakten, leichten Stadtfahrzeugen, lange bevor Elektromobilität allgemein verbreitet war.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - ein eigenes Medizintechnik-Kapitel",
        description:
          "Mit SwissBiomed erweiterte DOMTEKNIKA sein Engineering-Know-how in die Medizintechnik und verband Präzisionsmechanik, Materialien und Prototyping.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "Prämierte Startup-Innovationen in drei aufeinanderfolgenden Jahren",
        description:
          "Von Smart Bottle bis Skin Care und Personal Injector verwandelte DOMTEKNIKA ambitionierte Startup-Konzepte in ausgezeichnete Innovationen für smarte Produkte, Beauty-Technologie und Medizintechnik.",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "Mit The Total Car erforschte das Team neue Fahrzeugarchitekturen mit biobasierten Polymeren und recycelbaren Strukturen.",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - Leistung als Prüfstand",
        description:
          "Aventor führte Elektromobilität in ein Hochleistungsformat und nutzte Geschwindigkeit und Beschleunigung, um Materialien und Architekturen zu validieren.",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "Ein polymerbasiertes medizinisches Fixationskonzept für DePuy Synthes, entwickelt für einfachere chirurgische Anwendung und präzise Stabilisierung.",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar bündelte jahrelange Forschung in einem leichten, recycelbaren Stadtauto-Konzept für Mobilität mit geringer Umweltbelastung.",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - Polymerinnovation auf zwei Rädern",
        description:
          "DOMTEKNIKA übertrug seine Polymerexpertise auf Stajvelo, ein urbanes Elektrofahrrad mit integrierten Strukturen, Komfort und Design.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Vorstellung des Softcar V1",
        description:
          "Softcar V1 zeigte eine neue Generation sauberer urbaner Fahrzeuge und machte Jahrzehnte leichter Ingenieurarbeit und Kreislaufmobilität greifbar.",
        icon: "globe",
      },
      today: {
        year: "Heute",
        title: "Entwicklung für das, was als Nächstes kommt",
        description:
          "DOMTEKNIKA begleitet weiterhin Innovatoren aus Industrie, Medizintechnik und Mobilität von der Idee bis zum Prototyp.",
        icon: "document",
      },
    },
  },
  es: {
    eyebrow: "Nuestro recorrido desde 1998",
    title: "Nuestra historia",
    intro:
      "Fundada en 1998 por Jean-Luc Thuliez, ingeniero visionario, DOMTEKNIKA lleva más de 25 años convirtiendo retos técnicos complejos en soluciones de ingeniería fiables. De los primeros conceptos y prototipos a la simulación, la electrónica y el desarrollo industrial, ayudamos a que las ideas se conviertan en productos que funcionan. Descubre una selección de proyectos que reflejan nuestra experiencia.",
    cards: {
      founded: {
        year: "1998",
        title: "Fundación en La Neuveville - Suiza",
        description:
          "DOMTEKNIKA nació en La Neuveville con una ambición clara: combinar creatividad, ingeniería mecánica y experiencia en polímeros para transformar ideas en soluciones concretas.",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - primeros pasos en movilidad eléctrica",
        description:
          "El proyecto CREE abrió un capítulo temprano de movilidad eléctrica con vehículos urbanos compactos y ligeros mucho antes del auge de la movilidad eléctrica.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - un capítulo dedicado a la tecnología médica",
        description:
          "Con SwissBiomed, DOMTEKNIKA amplió su saber hacer hacia el desarrollo de dispositivos médicos, combinando mecánica de precisión, materiales y prototipado.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "Innovaciones startup premiadas durante tres años seguidos",
        description:
          "De Smart Bottle a Skin Care y Personal Injector, DOMTEKNIKA convirtió conceptos startup ambiciosos en innovaciones premiadas en productos inteligentes, tecnología de belleza y tecnología médica.",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "Con The Total Car, el equipo exploró nuevas arquitecturas de vehículo basadas en polímeros de origen biológico y estructuras reciclables.",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - el rendimiento como banco de pruebas",
        description:
          "Aventor llevó la movilidad eléctrica a un formato de alto rendimiento, utilizando velocidad y aceleración para validar materiales y arquitecturas.",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "Concepto de fijación médica polimérica desarrollado para DePuy Synthes, diseñado para simplificar el uso quirúrgico y asegurar una estabilización precisa.",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar reunió años de investigación en un concepto urbano ligero y reciclable, pensado para una movilidad de bajo impacto.",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - innovación polimérica sobre dos ruedas",
        description:
          "DOMTEKNIKA aplicó su experiencia en polímeros a Stajvelo, una bicicleta eléctrica urbana construida alrededor de estructuras integradas, confort y diseño.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Presentación de Softcar V1",
        description:
          "Softcar V1 reveló una nueva generación de vehículo urbano limpio, materializando décadas de ingeniería ligera y movilidad circular.",
        icon: "globe",
      },
      today: {
        year: "Hoy",
        title: "Ingeniería para lo que viene",
        description:
          "DOMTEKNIKA sigue acompañando a innovadores industriales, de tecnología médica y de movilidad desde la idea hasta el prototipo.",
        icon: "document",
      },
    },
  },
  ko: {
    eyebrow: "1998년부터 이어진 여정",
    title: "회사 이야기",
    intro:
      "1998년 비전 있는 엔지니어 Jean-Luc Thuliez가 설립한 DOMTEKNIKA는 25년 넘게 복잡한 기술 과제를 신뢰할 수 있는 엔지니어링 솔루션으로 바꿔 왔습니다. 초기 콘셉트와 프로토타입부터 시뮬레이션, 전자, 산업 개발까지 아이디어가 작동하는 제품이 되도록 돕습니다. 우리의 전문성과 경험을 보여 주는 프로젝트를 살펴보세요.",
    cards: {
      founded: {
        year: "1998",
        title: "스위스 La Neuveville에서 창립",
        description:
          "DOMTEKNIKA는 창의성, 기계공학, 폴리머 전문성을 결합해 아이디어를 구체적인 솔루션으로 바꾸겠다는 명확한 목표로 La Neuveville에서 시작되었습니다.",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - 전기 모빌리티의 초기 도전",
        description:
          "CREE 프로젝트는 전기 모빌리티가 대중화되기 훨씬 전, 작고 가벼운 도심형 차량으로 초기 전기차 개발의 장을 열었습니다.",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - 의료기기 개발의 새로운 장",
        description:
          "SwissBiomed를 통해 DOMTEKNIKA는 정밀 기계, 소재, 프로토타이핑을 결합해 의료기기 개발 분야로 전문성을 확장했습니다.",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "3년 연속 수상한 startup 혁신",
        description:
          "Smart Bottle, Skin Care, Personal Injector까지 DOMTEKNIKA는 스마트 제품, 뷰티 기술, 의료기술 분야의 야심찬 startup 콘셉트를 수상 혁신으로 발전시켰습니다.",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "The Total Car를 통해 팀은 바이오 기반 폴리머와 재활용 가능한 구조를 활용한 새로운 차량 아키텍처를 탐구했습니다.",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - 성능을 검증 무대로",
        description:
          "Aventor는 전기 모빌리티를 고성능 형식으로 확장하며 속도와 가속을 통해 소재와 아키텍처를 검증했습니다.",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "DePuy Synthes를 위해 개발한 폴리머 기반 의료 고정 콘셉트로, 수술 사용성을 단순화하면서 정밀한 안정화를 목표로 했습니다.",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar는 저영향 모빌리티를 위해 가볍고 재활용 가능한 도시형 차량 콘셉트에 수년간의 연구를 담았습니다.",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - 두 바퀴 위의 폴리머 혁신",
        description:
          "DOMTEKNIKA는 통합 구조, 편안함, 디자인을 갖춘 도심형 전기자전거 Stajvelo에 폴리머 설계 전문성을 적용했습니다.",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Softcar V1 공개",
        description:
          "Softcar V1은 경량 엔지니어링과 순환 모빌리티 연구를 실제 제품으로 보여 주는 새로운 세대의 깨끗한 도시형 차량입니다.",
        icon: "globe",
      },
      today: {
        year: "오늘",
        title: "다음을 위한 엔지니어링",
        description:
          "DOMTEKNIKA는 산업, 의료기술, 모빌리티 혁신가가 아이디어에서 프로토타입으로 나아가도록 계속 지원합니다.",
        icon: "document",
      },
    },
  },
  zh: {
    eyebrow: "自 1998 年以来的历程",
    title: "我们的故事",
    intro:
      "DOMTEKNIKA 于 1998 年由富有远见的工程师 Jean-Luc Thuliez 创立。25 年多来，我们一直把复杂技术挑战转化为可靠的工程解决方案。从早期概念和原型，到仿真、电子和工业开发，我们帮助想法成为真正可运行的产品。探索一组选定项目，了解我们的专业能力和长期经验。",
    cards: {
      founded: {
        year: "1998",
        title: "创立于瑞士 La Neuveville",
        description:
          "DOMTEKNIKA 诞生于 La Neuveville，目标明确：把创意、机械工程和聚合物专长结合起来，将想法转化为具体方案。",
        icon: "box",
      },
      cree: {
        year: "2001",
        title: "CREE - 电动出行的早期探索",
        description:
          "CREE 项目开启了电动出行的早期篇章，在电动化成为主流之前就探索了紧凑、轻量的城市车辆。",
        icon: "box",
      },
      swissbiomed: {
        year: "2009",
        title: "SwissBiomed - 专注医疗技术的新篇章",
        description:
          "借助 SwissBiomed，DOMTEKNIKA 将工程能力扩展到医疗器械开发，结合精密机械、材料和原型开发。",
        icon: "monitor",
      },
      startup: {
        year: "2011-2013",
        title: "连续三年获奖的 startup 创新",
        description:
          "从 Smart Bottle 到 Skin Care 和 Personal Injector，DOMTEKNIKA 将智能产品、美妆科技和医疗技术领域的雄心 startup 概念转化为获奖创新。",
        icon: "document",
        awards: true,
      },
      totalCar: {
        year: "2013",
        title: "The Total Car",
        description:
          "通过 The Total Car，团队探索了使用生物基聚合物和可回收结构的新型车辆架构。",
        icon: "globe",
      },
      aventor: {
        year: "2014",
        title: "Aventor - 以性能作为试验场",
        description:
          "Aventor 将电动出行推向高性能形态，通过速度和加速度验证材料与架构。",
        icon: "document",
      },
      boneFixation: {
        year: "2014",
        title: "Bone Fixation System",
        description:
          "为 DePuy Synthes 开发的聚合物医疗固定概念，旨在简化外科使用并实现精确稳定。",
        icon: "document",
      },
      softcar: {
        year: "2015",
        title: "Softcar Concept",
        description:
          "Softcar 将多年研究凝聚为轻量、可回收的城市车辆概念，面向低影响出行。",
        icon: "globe",
      },
      stajvelo: {
        year: "2018",
        title: "Stajvelo - 两轮上的聚合物创新",
        description:
          "DOMTEKNIKA 将聚合物设计专长应用于 Stajvelo，这是一款围绕集成结构、舒适性和设计打造的城市电动自行车。",
        icon: "document",
      },
      softcarReveal: {
        year: "2024",
        title: "Softcar V1 发布",
        description:
          "Softcar V1 展示了新一代清洁城市车辆，把数十年的轻量化工程和循环出行研究变成具体产品。",
        icon: "globe",
      },
      today: {
        year: "今天",
        title: "面向未来的工程",
        description:
          "DOMTEKNIKA 继续支持工业、医疗技术和出行领域的创新者，从想法走向原型。",
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

export function getOurStoryCopy(locale: string) {
  return STORY_COPY[isStoryLocale(locale) ? locale : "en"];
}

function isStoryLocale(locale: string): locale is StoryLocale {
  return locale in STORY_COPY;
}

export function OurStoryPageContent({ locale }: { locale: string }) {
  const copy = getOurStoryCopy(locale);
  const projects = useMemo(() => getProjectsForLocale(locale), [locale]);
  const projectModalCopy = useMemo(
    () => getProjectsPageCopy(locale).modal,
    [locale],
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openProject = useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);
      if (!project) return;

      setSelectedProject(project);
    },
    [projects],
  );

  return (
    <section
      className="relative overflow-hidden bg-background pt-[132px] md:pt-[152px]"
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
        <div className="max-w-[540px]">
          <Reveal>
            <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground md:text-[16px]">
              <span className="h-[3px] w-[34px] shrink-0 bg-brand" aria-hidden />
              {copy.eyebrow}
            </div>
            <h1
              id="our-story-title"
              className="domtek-text-shadow mt-[38px] text-[42px] font-extrabold leading-none text-foreground sm:text-[60px] md:mt-[52px] md:text-[66px]"
            >
              {copy.title}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-5 max-w-[500px] text-[13px] font-medium leading-[1.4] text-muted-foreground sm:text-[14px]">
              {copy.intro}
            </p>
          </Reveal>

        </div>

        <OurStoryTimelineRail>
          {TIMELINE_ROWS.map((row, index) => (
            <TimelineRow
              key={index}
              row={row}
              copy={copy}
              onOpenProject={openProject}
            />
          ))}
        </OurStoryTimelineRail>
      </Container>

      {selectedProject && (
        <ProjectDetailsDialog
          locale={locale}
          modal={projectModalCopy}
          project={selectedProject}
          onClosed={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function TimelineRow({
  row,
  copy,
  onOpenProject,
}: {
  row: TimelineRow;
  copy: StoryCopy;
  onOpenProject: (projectId: string) => void;
}) {
  return (
    <OurStoryTimelineStep
      className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 gap-y-5 md:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)] md:gap-x-6"
      dotClassName="relative z-10 col-start-1 row-span-2 flex justify-center pt-8 md:col-start-2 md:pt-10"
    >
      {row.left ? (
        <OurStoryTimelineBlock className="col-start-2 row-start-1 md:col-start-1">
          <StoryBlock
            block={row.left}
            copy={copy}
            side="left"
            onOpenProject={onOpenProject}
          />
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
          <StoryBlock
            block={row.right}
            copy={copy}
            side="right"
            onOpenProject={onOpenProject}
          />
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
  onOpenProject,
}: {
  block: TimelineBlock;
  copy: StoryCopy;
  side: "left" | "right";
  onOpenProject: (projectId: string) => void;
}) {
  if (block.type === "card") {
    return (
      <TimelineCard
        card={copy.cards[block.key]}
        projectId={STORY_CARD_PROJECT_IDS[block.key]}
        onOpenProject={onOpenProject}
      />
    );
  }

  return <TimelineMedia media={MEDIA[block.key]} side={side} />;
}

function TimelineCard({
  card,
  projectId,
  onOpenProject,
}: {
  card: StoryCard;
  projectId?: string;
  onOpenProject: (projectId: string) => void;
}) {
  const className = cn(
    "group/card relative grid min-h-[112px] w-full grid-cols-1 gap-3 rounded-[7px] border border-border bg-white px-4 py-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.035)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] [transition-timing-function:var(--ease-smooth)] sm:grid-cols-[minmax(0,1fr)_48px] sm:items-center sm:gap-5 md:min-h-[116px] md:grid-cols-[minmax(0,1fr)_52px] md:px-5 md:py-4",
    projectId &&
      "cursor-pointer pr-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 sm:pr-4",
    card.awards &&
      "sm:pr-[154px] lg:pr-[168px] xl:grid-cols-[minmax(0,1fr)_136px_52px] xl:pr-0",
  );

  const content = (
    <>
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
          className="pointer-events-none absolute right-[72px] top-4 hidden w-[108px] self-start justify-self-end invert hue-rotate-180 sm:block md:w-[122px] xl:static xl:w-[130px]"
        />
      )}
      <span
        className={cn(
          "grid size-[44px] place-items-center justify-self-end rounded-full border-2 border-brand bg-white text-foreground transition-transform duration-500 group-hover/card:scale-105 [transition-timing-function:var(--ease-smooth)] sm:justify-self-center",
          card.awards && "xl:col-start-3",
        )}
      >
        <StoryIcon icon={card.icon} />
      </span>
      {projectId && (
        <span
          className="absolute right-3 top-3 grid size-6 place-items-center text-muted-foreground/70 transition-[color,transform] duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-muted-foreground"
          aria-hidden
        >
          <ArrowUpRight className="size-4" />
        </span>
      )}
    </>
  );

  if (projectId) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => onOpenProject(projectId)}
      >
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
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
  const asset = STORY_ICONS[icon];

  return (
    <Image
      src={asset.src}
      alt=""
      width={asset.width}
      height={asset.height}
      sizes="30px"
      className="size-[30px] object-contain"
    />
  );
}
