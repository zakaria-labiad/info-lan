import type { LucideIcon } from "lucide-react";

export type AboutHighlight = {
  key: "delivery" | "technicalAdvice";
  icon: LucideIcon;
};

export type AboutAchievement = {
  key: "experience" | "sectors" | "quality" | "response";
  value: string;
};

export type AboutProfessional = {
  key: "engineering" | "fabrication" | "quality" | "site";
  image: string;
};
