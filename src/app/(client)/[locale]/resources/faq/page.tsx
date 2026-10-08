import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";
import { FaqContent } from "@/components/client/faq/faq-content";
import type { FaqItem } from "@/features/client/types/faq.type";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.faq.hero",
  pathname: "/resources/faq",
});

export default function FaqPage() {
  const t = useTranslations("pages.resources.faq");
  const faqItems = t.raw("items") as FaqItem[];

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page w-full">
        <FaqContent
          ctaButton={t("ctaButton")}
          ctaTitle={t("ctaTitle")}
          items={faqItems}
        />
      </main>
    </div>
  );
}
