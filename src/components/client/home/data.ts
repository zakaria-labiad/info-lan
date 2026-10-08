import {
  Cable,
  CircleCheckBig,
  ClipboardCheck,
  Headset,
  Monitor,
  MonitorCog,
  Network,
  Wrench,
} from "lucide-react";

import type {
  HomeBlogPost,
  HomeBuild,
  HomeFeature,
  HomeProcess,
  HomeService,
  HomeStat,
  HomeTestimonial,
} from "@/features/client/types/home.type";

export const HOME_FEATURES: HomeFeature[] = [
  {
    key: "technicalAdvice",
    icon: CircleCheckBig,
  },
  {
    key: "qualityControl",
    icon: Headset,
  },
];

export const HOME_SERVICES: HomeService[] = [
  {
    key: "industrialPiping",
    icon: Monitor,
    href: "/domains/tuyauterie-industrielle",
  },
  {
    key: "boilermaking",
    icon: Cable,
    href: "/domains/chaudronnerie-industrielle",
  },
  {
    key: "conveyors",
    icon: Wrench,
    href: "/domains/convoyeurs",
  },
  {
    key: "loadingDocks",
    icon: Network,
    href: "/domains/quais-de-chargement",
  },
];

export const HOME_BUILDS: HomeBuild[] = [
  {
    key: "piping",
    image: "/images/home/info-lan-equipment.webp",
  },
  {
    key: "boilermaking",
    image: "/images/home/info-lan-installation.webp",
  },
  {
    key: "conveyors",
    image: "/images/home/info-lan-maintenance.webp",
  },
  {
    key: "loadingDocks",
    image: "/images/about/info-lan-team.webp",
  },
];

export const HOME_STATS: HomeStat[] = [
  {
    key: "founded",
    value: "2005",
  },
  {
    key: "experience",
    value: "20+",
  },
  {
    key: "services",
    value: "3",
  },
  {
    key: "customers",
    value: "2",
  },
];

export const HOME_PROCESSES: HomeProcess[] = [
  {
    key: "survey",
    icon: ClipboardCheck,
  },
  {
    key: "fabrication",
    icon: MonitorCog,
  },
];

export const HOME_TESTIMONIALS: HomeTestimonial[] = [
  {
    key: "foodIndustry",
  },
  {
    key: "industrialMaintenance",
  },
  {
    key: "logistics",
  },
];

export const HOME_BLOG_POSTS: HomeBlogPost[] = [
  {
    key: "industrialPiping",
    image: "/images/home/info-lan-equipment.webp",
    href: "/resources/blog/preparing-industrial-site-steel-installation",
  },
  {
    key: "loadingDock",
    image: "/images/home/info-lan-installation.webp",
    href: "/resources/blog/choosing-heavy-handling-equipment",
  },
  {
    key: "qualityTraceability",
    image: "/images/home/info-lan-maintenance.webp",
    href: "/resources/blog/quality-controls-welded-assemblies",
  },
  {
    key: "conveyorFlow",
    image: "/images/about/info-lan-team.webp",
    href: "/resources/blog/conveyor-layout-production-flow",
  },
];

export const HOME_SKILLS = [
  {
    key: "customFabrication",
    value: 80,
  },
  {
    key: "siteInstallation",
    value: 70,
  },
] as const;

export const HOME_MARQUEE_ITEMS = [
  "piping",
  "boilermaking",
  "conveyors",
  "loadingDocks",
  "shelving",
] as const;
