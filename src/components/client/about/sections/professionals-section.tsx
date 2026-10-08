import Image from "next/image";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/client/shared";

import { ABOUT_PROFESSIONALS } from "@/components/client/about/data";

function ProfessionalsSection() {
  const t = useTranslations("pages.about.professionals");

  return (
    <section className="container-page space-y-15">
      <SectionHeading title={t("title")} centered data-home-reveal />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_PROFESSIONALS.map(({ key, image }) => (
          <article
            key={key}
            className="grid gap-4 text-center"
            data-home-reveal
          >
            <div className="relative aspect-312/370 overflow-hidden rounded-md">
              <Image
                src={image}
                alt={t(`items.${key}.alt`)}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold">{t(`items.${key}.name`)}</h4>
              <p className="text-foreground-muted">{t(`items.${key}.role`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { ProfessionalsSection };
