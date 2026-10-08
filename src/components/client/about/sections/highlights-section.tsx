import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/client/shared";

import { ABOUT_HIGHLIGHTS } from "@/components/client/about/data";

function HighlightsSection() {
  const t = useTranslations("pages.about.highlights");

  return (
    <section
      className="container-page grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-10"
      data-home-intro
    >
      <SectionHeading title={t("title")} data-home-intro-left />

      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        data-home-intro-right
      >
        {ABOUT_HIGHLIGHTS.map(({ key, icon: Icon }) => (
          <article
            key={key}
            className="group flex min-h-78 flex-col justify-between rounded-md border bg-white p-6 md:p-8 transition-all duration-400 hover:-translate-y-1 shadow-sm hover:shadow-md gap-y-5"
          >
            <Icon
              className="size-14 text-foreground transition-colors group-hover:text-primary"
              strokeWidth={1.3}
              aria-hidden="true"
            />
            <div className="grid gap-4">
              <h3 className="text-xl lg:text-2xl font-medium leading-snug group-hover:text-primary">
                {t(`items.${key}.title`)}
              </h3>
              <p className="leading-7 text-foreground-muted group-hover:text-primary/80">
                {t(`items.${key}.description`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { HighlightsSection };
