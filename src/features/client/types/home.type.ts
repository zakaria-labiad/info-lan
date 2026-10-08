import type { LucideIcon } from "lucide-react";

export type HomeFeature = {
  key: "technicalAdvice" | "qualityControl";
  icon: LucideIcon;
};

export type HomeService = {
  key:
    | "industrialPiping"
    | "boilermaking"
    | "conveyors"
    | "loadingDocks";
  icon: LucideIcon;
  href: string;
};

export type HomeBuild = {
  key: "piping" | "boilermaking" | "conveyors" | "loadingDocks";
  image: string;
};

export type HomeStat = {
  key: "founded" | "experience" | "services" | "customers";
  value: string;
};

export type HomeProcess = {
  key: "survey" | "fabrication";
  icon: LucideIcon;
};

export type HomeTestimonial = {
  key: "foodIndustry" | "industrialMaintenance" | "logistics";
};

export type HomeBlogPost = {
  key: "industrialPiping" | "loadingDock" | "qualityTraceability" | "conveyorFlow";
  image: string;
  href: string;
};
