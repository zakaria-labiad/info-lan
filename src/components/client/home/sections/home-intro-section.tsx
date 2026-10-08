import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button, SectionHeading } from "@/components/client/shared";
import { cn } from "@/lib/shared/utils";

import { HOME_FEATURES } from "@/components/client/home/data";
import { homeContainer } from "@/components/client/home/shared/constants";

function HomeIntroSection() {
  const t = useTranslations("pages.home.intro");

  return (
    <section className={cn(homeContainer)} data-home-intro>
      <div className="grid xl:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.82fr)] lg:items-center gap-8">
        <div className="grid gap-8">
          <SectionHeading title={t("title")} data-home-intro-left />

          <div className="grid items-center gap-6 sm:grid-cols-[250px_minmax(0,1fr)]">
            <div
              className="relative max-sm:max-h-50 max-sm:w-full! aspect-250/329 overflow-hidden rounded-md"
              data-home-intro-left
              data-home-intro-image
            >
              <Image
                src="/images/home/info-lan-equipment.webp"
                alt={t("imageAltSmall")}
                fill
                priority
                sizes="(min-width: 1024px) 250px, 45vw"
                className="object-cover w-full"
              />
            </div>

            <div className="grid gap-5">
              <div className="grid gap-4">
                {HOME_FEATURES.map((feature) => (
                  <div
                    key={feature.key}
                    className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4"
                    data-home-intro-left
                  >
                    <feature.icon
                      className="size-12 text-foreground"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-semibold leading-6 text-foreground">
                        {t(`features.${feature.key}.title`)}
                      </h3>
                      <p className="text-[14px] leading-6 text-foreground-muted">
                        {t(`features.${feature.key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sm:w-fit shrink-0" data-home-intro-left>
                <Button href="/entreprise/about" size="lg">
                  {t("cta")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative aspect-453/499 overflow-hidden rounded-md"
          data-home-intro-right
          data-home-intro-image
        >
          <Image
            src="/images/about/info-lan-team.webp"
            alt={t("imageAltLarge")}
            fill
            priority
            sizes="(min-width: 1280px) 453px, (min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export { HomeIntroSection };
