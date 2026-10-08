import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";
import { BookOpen, Download } from "lucide-react";

import { Hero } from "@/components/client/shared/hero";
import { Cta } from "@/components/client/shared";
import { IconButton } from "@/components/client/shared/icon-button";
import type { GuideItem } from "@/features/client/types/guides.type";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.guides.hero",
  pathname: "/resources/guides",
});

export default function GuidesPage() {
  const t = useTranslations("pages.resources.guides");
  const guides = t.raw("items") as GuideItem[];

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="content-gap">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="group block min-h-78 w-full rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-0"
              data-app-reveal
            >
              <div
                className="flex
          h-full
          w-full
          flex-col
          items-start
          justify-between
          rounded-md
          border
          bg-white
          p-10
          transition-all
          duration-400
          hover:-translate-y-1
          hover:shadow-md"
              >
                <div className="grid gap-5">
                  <div>
                    <div className="flex size-14 shrink-0 items-center group-hover:text-primary">
                      <BookOpen
                        className="size-full"
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <h2
                      className="w-full
            text-2xl
            font-medium
            leading-snug
            text-foreground
            lg:text-3xl
            group-hover:text-primary"
                    >
                      {guide.title}
                    </h2>
                  </div>
                </div>
                <div className="flex justify-between items-center h-fit w-full">
                  <div className="flex flex-wrap items-center h-fit gap-2 text-sm text-foreground-muted">
                    <span className="rounded-md bg-error-extra-light px-2 py-1 font-semibold text-error">
                      {guide.format}
                    </span>
                    <span>{guide.pages}</span>
                  </div>

                  <IconButton
                    href={guide.href}
                    color="transparent"
                    icon={Download}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
        <Cta title={t("ctaTitle")} buttonLabel={t("ctaButton")} href="/contact" />
      </main>
    </div>
  );
}
