import type { LucideIcon } from "lucide-react";

import type { LocaleRouteParams } from "@/i18n/shared/config";

export type DomainCard = {
  key: string;
  icon: LucideIcon;
  href: string;
};

export type DomainDetailRouteParams = LocaleRouteParams & {
  domain: string;
};

export type DomainDetailItem = {
  key: string;
  title: string;
  description: string;
  icon?: LucideIcon;
};
