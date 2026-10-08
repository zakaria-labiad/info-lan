import {
  HardDrive,
  Keyboard,
  Monitor,
  MonitorUp,
  Network,
  Package,
  Printer,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";
import { Card } from "@/components/client/shared/card";
import type { CategoryCard } from "@/features/client/types/categories.type";
import { createTranslatedMetadata } from "@/lib/client/seo";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.categories.hero",
  pathname: "/categories",
});

const CATEGORIES: CategoryCard[] = [
  {
    key: "piping",
    icon: Monitor,
    href: "/categories/tuyauterie",
  },
  {
    key: "tanks",
    icon: HardDrive,
    href: "/categories/cuves",
  },
  {
    key: "boilermaking",
    icon: Printer,
    href: "/categories/chaudronnerie",
  },
  {
    key: "conveyors",
    icon: Network,
    href: "/categories/convoyeurs",
  },
  {
    key: "docks",
    icon: ShieldCheck,
    href: "/categories/quais",
  },
  {
    key: "structures",
    icon: Keyboard,
    href: "/categories/structures",
  },
  {
    key: "shelving",
    icon: HardDrive,
    href: "/categories/rayonnage",
  },
  {
    key: "safety",
    icon: ShieldCheck,
    href: "/categories/securite",
  },
  {
    key: "workshop",
    icon: Wrench,
    href: "/categories/atelier",
  },
  {
    key: "display",
    icon: MonitorUp,
    href: "/categories/affichage",
  },
  {
    key: "specials",
    icon: Package,
    href: "/categories/speciaux",
  },
];

export default function Categories() {
  const t = useTranslations("pages.categories");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <main className="container-page container-section w-full">
        <div className="content-gap">
          {CATEGORIES.map((category) => (
            <Card
              key={category.href}
              title={t(`categories.${category.key}`)}
              icon={category.icon}
              actionLabel={t("viewProducts")}
              href={category.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
