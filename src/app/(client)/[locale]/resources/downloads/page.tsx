import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";
import { Download, FileText } from "lucide-react";

import { Hero } from "@/components/client/shared/hero";
import { Cta } from "@/components/client/shared";
import { IconButton } from "@/components/client/shared/icon-button";
import type { DownloadSection } from "@/features/client/types/downloads.type";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.downloads.hero",
  pathname: "/resources/downloads",
});

export default function DownloadsPage() {
  const t = useTranslations("pages.resources.downloads");
  const downloads = t.raw("sections") as DownloadSection[];

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="grid gap-8">
          {downloads.map((section) => (
            <section
              key={section.category}
              className="grid gap-5"
              data-app-reveal
            >
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex shrink-0 items-center justify-center">
                  <div
                    className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              group-hover:text-primary
            "
                  >
                    <FileText
                      className="size-full"
                      strokeWidth={1}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3>{section.category}</h3>
              </div>

              <div className="grid gap-4">
                {section.items.map((file) => (
                  <article
                    key={file.name}
                    data-app-reveal-child
                    className="grid gap-4 rounded-md border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <h3 className="text-xl font-semibold text-foreground">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap items-center h-fit gap-2 text-sm text-foreground-muted">
                        <span className="rounded-md bg-error-extra-light px-2 py-1 font-semibold text-error">
                          PDF
                        </span>
                        <span>{file.size}</span>
                      </div>

                      <IconButton
                        href={file.href}
                        color="transparent"
                        icon={Download}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Cta title={t("ctaTitle")} buttonLabel={t("ctaButton")} href="/contact" />
      </main>
    </div>
  );
}
