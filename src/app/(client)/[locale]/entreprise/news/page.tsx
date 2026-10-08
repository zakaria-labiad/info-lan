import { createTranslatedMetadata } from "@/lib/client/seo";
import { CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/client/shared/hero";
import { Cta } from "@/components/client/shared";
import type { NewsArticle } from "@/features/client/types/news.type";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.news.hero",
  pathname: "/entreprise/news",
});

export default async function NewsPage() {
  const t = await getTranslations("pages.news");
  const articles = t.raw("articles") as NewsArticle[];

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="content-gap">
          {articles.map((article) => (
            <article
              key={article.title}
              data-app-reveal
              className="grid min-h-80 gap-5 rounded-md border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex shrink-0 items-center w-full gap-3">
                <div
                  className="
              flex
              size-8
              shrink-0
              items-center
              justify-center
              group-hover:text-primary
            "
                >
                  <CalendarDays
                    className="size-full"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </div>
                <h5>{article.date}</h5>
              </div>

              <div className="grid gap-3">
                <h3 className="">{article.title}</h3>
                <p className="text-foreground-muted">{article.summary}</p>
              </div>
            </article>
          ))}
        </div>

        <Cta title={t("ctaTitle")} buttonLabel={t("ctaButton")} />
      </main>
    </div>
  );
}
