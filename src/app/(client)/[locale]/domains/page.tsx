import {
  Boxes,
  ClipboardList,
  Factory,
  PackageOpen,
  PanelsTopLeft,
  Pipette,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";
import { Card } from "@/components/client/shared/card";
import type { DomainCard } from "@/features/client/types/domains.type";
import { createTranslatedMetadata } from "@/lib/client/seo";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.domains.hero",
  pathname: "/domains",
});

const DOMAIN_CARDS: DomainCard[] = [
  {
    key: "industrialPiping",
    icon: Pipette,
    href: "/domains/tuyauterie-industrielle",
  },
  {
    key: "boilermaking",
    icon: Factory,
    href: "/domains/chaudronnerie-industrielle",
  },
  {
    key: "conveyors",
    icon: Boxes,
    href: "/domains/convoyeurs",
  },
  {
    key: "loadingDocks",
    icon: PackageOpen,
    href: "/domains/quais-de-chargement",
  },
  {
    key: "shelving",
    icon: PanelsTopLeft,
    href: "/domains/rayonnage",
  },
  {
    key: "workshopDisplay",
    icon: ClipboardList,
    href: "/domains/affichage-atelier",
  },
];

export default function Domains() {
  const t = useTranslations("pages.domains");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="content-gap">
          {DOMAIN_CARDS.map((domain) => (
            <Card
              key={domain.href}
              title={t(`cards.${domain.key}`)}
              icon={domain.icon}
              actionLabel={t("viewDomain")}
              href={domain.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
