import { createTranslatedMetadata } from "@/lib/client/seo";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/client/shared/hero";
import { GaleriesContent } from "@/components/client/gallery/galeries-content";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.galeries.hero",
  pathname: "/resources/galeries",
});

export default async function GaleriesPage() {
  const t = await getTranslations("pages.resources.galeries");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <GaleriesContent showMoreLabel={t("showMore")} />
      </main>
    </div>
  );
}
