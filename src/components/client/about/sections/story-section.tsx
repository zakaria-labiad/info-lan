import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button, SectionHeading } from "@/components/client/shared";

function StorySection() {
  const t = useTranslations("pages.about.story");

  return (
    <section
      className="container-page grid items-center gap-8 lg:grid-cols-[minmax(330px,0.82fr)_minmax(0,1fr)] lg:gap-10"
      data-home-intro
    >
      <div
        className="relative h-120 w-full overflow-hidden rounded-md lg:h-145"
        data-home-intro-left
        data-home-intro-image
      >
        <Image
          src="/images/about/info-lan-team.webp"
          alt={t("imageAlt")}
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <SectionHeading title={t("title")} data-home-intro-right />

          <div
            className="relative min-h-36 overflow-hidden rounded-md sm:min-h-42"
            data-home-intro-right
            data-home-intro-image
          >
            <Image
              src="/images/home/info-lan-equipment.webp"
              alt={t("bannerAlt")}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <h3 className="absolute left-5 top-1/2 max-w-sm -translate-y-1/2 font-medium leading-tight text-white">
              {t("banner")}
            </h3>
          </div>

          <p
            className="font-medium leading-7 text-foreground-muted"
            data-home-intro-right
          >
            {t("description")}
          </p>
        </div>

        <div data-home-intro-right>
          <Button href="/resources/galeries" className="w-fit">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}

export { StorySection };
