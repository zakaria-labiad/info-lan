import {
  Building2,
  ClipboardCheck,
  MonitorCog,
  ShieldCheck,
} from "lucide-react";

import type {
  AboutAchievement,
  AboutHighlight,
  AboutProfessional,
} from "@/features/client/types/about.type";

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    key: "delivery",
    icon: ClipboardCheck,
  },
  {
    key: "technicalAdvice",
    icon: MonitorCog,
  },
];

export const ABOUT_ACHIEVEMENTS: AboutAchievement[] = [
  {
    key: "experience",
    value: "2005",
  },
  {
    key: "sectors",
    value: "Casablanca",
  },
  {
    key: "quality",
    value: "3",
  },
];

export const ABOUT_PROFESSIONALS: AboutProfessional[] = [
  {
    key: "engineering",
    image: "/images/home/info-lan-equipment.webp",
  },
  {
    key: "fabrication",
    image: "/images/home/info-lan-installation.webp",
  },
  {
    key: "quality",
    image: "/images/home/info-lan-maintenance.webp",
  },
  {
    key: "site",
    image: "/images/about/info-lan-team.webp",
  },
];

export const ABOUT_SECTION_ICONS = {
  story: Building2,
  achievements: ShieldCheck,
};


export const ABOUT_MARQUEE_ITEMS = [
  "trust",
  "quality",
  "reliability",
  "integrity",
  "commitment",
  "precision",
  "innovation",
  "excellence",
] as const;
