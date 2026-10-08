import type { LucideIcon } from "lucide-react";

import type { LocaleRouteParams } from "@/i18n/shared/config";

export type CategoryCard = {
  key: string;
  icon: LucideIcon;
  href: string;
};

export type CategoryRouteParams = LocaleRouteParams & {
  category: string;
};

export type CategoryProductRouteParams = CategoryRouteParams & {
  product: string;
};

export type ProductDetailSpec = {
  title: string;
  description: string;
  icon: LucideIcon;
};
