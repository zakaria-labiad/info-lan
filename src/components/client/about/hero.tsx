import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";

function AboutHero() {
  const t = useTranslations("pages.about.hero");

  return <Hero title={t("title")} description={t("description")} />;
}

export { AboutHero };
