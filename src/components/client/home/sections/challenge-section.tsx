import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button, SectionHeading } from "@/components/client/shared";
import { cn } from "@/lib/shared/utils";

import { HOME_SKILLS } from "@/components/client/home/data";
import { homeContainer } from "@/components/client/home/shared/constants";
import { SkillBar } from "@/components/client/home/sections/skill-bar";

function ChallengeSection() {
  const t = useTranslations("pages.home.challenge");

  return (
    <section
      className={cn(homeContainer, "overflow-hidden lg:overflow-visible")}
      data-home-intro
    >
      <div className="grid justify-center w-full gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10 lg:grid-cols-[minmax(330px,0.82fr)_minmax(0,1fr)] lg:items-center">
        <div
          className="relative w-full h-120 lg:h-130 aspect-16/10 overflow-hidden lg:aspect-440/531 lg:overflow-visible rounded-md"
          data-home-intro-left
          data-home-intro-image
        >
          <Image
            src="/images/home/info-lan-maintenance.webp"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 440px, 100vw"
            className="object-cover object-center rounded-md"
          />
          <div className="absolute bottom-4 left-4 flex size-36 max-w-[calc(100vw-2rem)] items-center justify-center rounded-full border-[6px] border-primary bg-white text-center shadow-lg lg:bottom-auto lg:left-0 lg:top-1/2 lg:max-w-none lg:-translate-x-1/3 lg:-translate-y-1/2">
            <div>
              <strong className="block text-[26px] font-semibold leading-none text-foreground sm:text-[32px] lg:text-[36px]">
                {t("badgeValue")}
              </strong>
              <span className="mt-1 block text-[12px] leading-4 text-foreground">
                {t("badgeLine1")}
                <br />
                {t("badgeLine2")}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-8 lg:max-w-none lg:space-y-10">
          <div className="grid w-full gap-6">
            <div className="grid w-full gap-4" data-home-intro-left>
              <SectionHeading title={t("title")} data-home-intro-left />
              <p
                className="leading-7 text-foreground-muted text-base sm:text-lg"
                data-home-intro-left
              >
                {t("description")}
              </p>
            </div>

            <div className="grid gap-4" data-home-intro-left>
              {HOME_SKILLS.map((skill) => (
                <SkillBar
                  key={skill.key}
                  label={t(`skills.${skill.key}`)}
                  value={skill.value}
                />
              ))}
            </div>
          </div>

          <div className="sm:w-fit" data-home-intro-left>
            <Button href="/domains" size="lg">
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { ChallengeSection };
