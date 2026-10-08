"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { createLayeredHeroEntrance } from "@/animations/client";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/client/ui/avatar";

function ServiceProofGroup() {
  const t = useTranslations("pages.home.hero.proofBadges");

  return (
    <AvatarGroup>
      {(["equipment", "network", "support"] as const).map((badge) => (
        <Avatar
          key={badge}
          data-hero-avatar
          className="bg-primary text-white ring-white"
        >
          <AvatarFallback className="bg-primary text-xs font-semibold text-white">
            {t(badge)}
          </AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

function HomeHero() {
  const t = useTranslations("pages.home.hero");
  const common = useTranslations("common.media");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    return createLayeredHeroEntrance(hero);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate -top-20 -mb-20 flex min-h-dvh w-full justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        data-hero-background
        className="pointer-events-none absolute inset-0 z-0 bg-primary"
      >
        <Image
          src="/images/home/info-lan-hero.webp"
          alt={common("homeHeroAlt")}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/30" />
      </div>

      {/* Foreground */}
      <div
        data-hero-foreground
        className="absolute inset-0 z-10 flex h-135 sm:h-130 w-full items-center overflow-hidden pb-14"
      >
        {/* Preserve the established foreground silhouette with the INFO-L@N palette. */}
        <Image
          src="/images/home/HeroElement.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-[38%_100%] brightness-0 invert"
        />

        {/* Content */}
        <div className="container-page relative z-20 flex w-full flex-col gap-8 pt-8 sm:pt-14 md:pt-18">
          {/* Title */}
          <h1
            data-hero-left-item
            className="max-w-4xl text-4xl font-medium text-primary-dark sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("title")}
          </h1>

          <div
            data-hero-left-item
            className="flex items-center gap-3 pt-4"
          >
            <ServiceProofGroup />

            <p className="text-lg! text-primary-dark sm:text-xl!">
              {t("proofLine1")}
              <br />
              {t("proofLine2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

HomeHero.displayName = "HomeHero";

export { HomeHero };
