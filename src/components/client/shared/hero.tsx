"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { createMediaHeroEntrance } from "@/animations/client";

type HeroProps = {
  title: string;
  description: string;
};
function Hero({ title = "", description = "" }: HeroProps) {
  const t = useTranslations("common.media");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    return createMediaHeroEntrance({
      section,
      image: imageRef.current,
      content: contentRef.current,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -top-20 -mb-20 h-130 w-full overflow-hidden"
    >
      <Image
        ref={imageRef}
        src="/images/home/info-lan-hero.webp"
        alt={t("heroAlt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />

      <div className="pointer-events-none absolute inset-0 bg-primary/20 backdrop-blur-xs" />

      <div
        ref={contentRef}
        className="container-page absolute inset-x-0 bottom-30 z-10 flex flex-col gap-y-4"
      >
        <h1 className="text-header-2 font-medium text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.6)] md:text-header-1">
          {title}
        </h1>

        <p className="text-lg font-light text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]">
          {description}
        </p>
      </div>
    </section>
  );
}

Hero.displayName = "Hero";
export { Hero };
