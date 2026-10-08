import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/client/shared";
import { Hero } from "@/components/client/shared/hero";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.company.hero",
  pathname: "/entreprise",
});

export default function AboutPage() {
  const t = useTranslations("pages.company");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main
        className="container-page flex w-full flex-col gap-4 py-12"
        data-app-reveal
      >
        <SectionHeading title={t("title")} />
        <p className="max-w-2xl text-foreground-soft">{t("description")}</p>
      </main>
    </div>
  );
}
