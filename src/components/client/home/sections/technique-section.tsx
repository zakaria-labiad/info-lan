import Image from "next/image";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/client/shared";

import { HOME_PROCESSES } from "@/components/client/home/data";
import { homeContainer } from "@/components/client/home/shared/constants";
import { ProcessCard } from "@/components/client/home/sections/process-card";

function TechniqueSection() {
  const t = useTranslations("pages.home.process");

  return (
    <section
      className="relative isolate overflow-hidden bg-primary py-16 sm:py-20 lg:py-24"
      data-home-reveal
    >
      <Image
        src="/images/home/info-lan-installation.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/35" aria-hidden="true" />

      <div className={`${homeContainer} relative z-10`}>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.74fr)] lg:items-center gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10">
          <div className="space-y-10 lg:space-y-15">
            <SectionHeading
              title={t("title")}
              titleClassName="max-w-150 text-foreground-dark"
              data-home-reveal-child
            />

            <div
              className="grid gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10 xl:grid-cols-2 lg:max-w-160"
              data-home-reveal-child
            >
              {HOME_PROCESSES.map((process) => (
                <ProcessCard
                  key={process.key}
                  process={process}
                  className="sm:max-w-full"
                />
              ))}
            </div>
          </div>

          <div
            className="relative mx-auto aspect-484/656 max-h-150 lg:max-h-auto w-full lg:max-w-140 overflow-hidden rounded-md"
            data-home-reveal-child
          >
            <Image
              src="/images/home/info-lan-equipment.webp"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1280px) 484px, (min-width: 1024px) 36vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export { TechniqueSection };
