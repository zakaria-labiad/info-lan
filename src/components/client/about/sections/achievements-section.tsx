import Image from "next/image";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/client/shared";

import { ABOUT_ACHIEVEMENTS } from "@/components/client/about/data";

function AchievementsSection() {
  const t = useTranslations("pages.about.achievements");

  return (
    <section className="bg-white py-15">
      <div className="container-page space-y-15">
        <div
          className="grid items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-10"
          data-home-intro
        >
          <div className="grid gap-4">
            <SectionHeading title={t("title")} data-home-intro-left />
            <p
              className="max-w-2xl leading-7 text-foreground-muted"
              data-home-intro-left
            >
              {t("description")}
            </p>
          </div>

          <div
            className="relative h-80 w-full overflow-hidden rounded-md lg:h-100 2xl:h-110"
            data-home-intro-right
            data-home-intro-image
          >
            <Image
              src="/images/home/info-lan-maintenance.webp"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4" data-home-intro>
          {ABOUT_ACHIEVEMENTS.map(({ key, value }) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center text-center rounded-full gap-3"
              data-home-intro-right
            >
              <p className="text-header-2 font-medium leading-tight lg:text-header-1">
                {value}
              </p>
              <p className="leading-7 text-foreground-muted">
                {t(`items.${key}`)}
              </p>
              <span
                aria-hidden="true"
                className="pointer-events-none aspect-[318/52] w-[min(58%,8.5rem)] bg-primary [mask-image:url('/images/about/about-commitment-wave.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url('/images/about/about-commitment-wave.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] sm:w-[min(60%,10rem)] lg:w-[min(64%,11rem)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { AchievementsSection };
