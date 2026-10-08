import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";
import {
  Cable,
  CircleHelp,
  Database,
  HardDrive,
  Headphones,
  Laptop,
  Monitor,
  Network,
  Package,
  Printer,
  Router,
  ScanLine,
  ShieldCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Hero } from "@/components/client/shared/hero";
import { Cta } from "@/components/client/shared";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.partners.hero",
  pathname: "/entreprise/partners",
});

const SOLUTION_AREAS: { key: string; icon: LucideIcon }[] = [
  { key: "computers", icon: Laptop },
  { key: "workstations", icon: Monitor },
  { key: "printing", icon: Printer },
  { key: "scanning", icon: ScanLine },
  { key: "networking", icon: Network },
  { key: "routers", icon: Router },
  { key: "cabling", icon: Cable },
  { key: "storage", icon: HardDrive },
  { key: "backup", icon: Database },
  { key: "security", icon: ShieldCheck },
  { key: "power", icon: Zap },
  { key: "supplies", icon: Package },
  { key: "installation", icon: Wrench },
  { key: "maintenance", icon: CircleHelp },
  { key: "support", icon: Headphones },
];

export default function PartnersPage() {
  const t = useTranslations("pages.partners");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="content-gap">
          {SOLUTION_AREAS.map(({ key, icon: Icon }) => (
            <article
              key={key}
              data-app-reveal
              className="group flex h-70 flex-col items-center justify-center gap-5 p-2 text-center transition-transform duration-400"
            >
              <div className="flex size-20 items-center justify-center rounded-full bg-primary-extra-light text-primary transition-colors duration-400 group-hover:bg-primary group-hover:text-white">
                <Icon className="size-10" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="max-w-60 space-y-2">
                <h2 className="text-xl font-semibold">{t(`solutions.${key}.title`)}</h2>
                <p className="text-sm text-foreground-muted">
                  {t(`solutions.${key}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <Cta buttonLabel={t("contact")} title={t("becomeTitle")} />
      </main>
    </div>
  );
}
