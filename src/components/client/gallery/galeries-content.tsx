"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { FilterButton, GalleryLoadMoreGrid } from "@/components/client/shared";
import type { GalleryCategory, GalleryItem } from "@/features/client/types/gallery.type";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/client/ui/dialog";

const CATEGORIES: { key: GalleryCategory }[] = [
  { key: "all" },
  { key: "boilermaking" },
  { key: "piping" },
  { key: "handling" },
] as const;

const SOURCE_IMAGES = [
  {
    src: "/images/home/info-lan-equipment.webp",
    altKey: "boilermaking",
  },
  {
    src: "/images/home/info-lan-installation.webp",
    altKey: "piping",
  },
  {
    src: "/images/home/info-lan-maintenance.webp",
    altKey: "handling",
  },
  {
    src: "/images/about/info-lan-team.webp",
    altKey: "boilermaking",
  },
  {
    src: "/images/home/info-lan-equipment.webp",
    altKey: "piping",
  },
  {
    src: "/images/home/info-lan-installation.webp",
    altKey: "handling",
  },
] as const;

const GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 24 }, (_, index) => {
  const source = SOURCE_IMAGES[index % SOURCE_IMAGES.length];
  const categoryCycle: GalleryItem["category"][] = [
    "boilermaking",
    "piping",
    "handling",
  ];

  return {
    ...source,
    id: `gallery-${String(index + 1).padStart(2, "0")}`,
    category: categoryCycle[index % categoryCycle.length],
  };
});

type GaleriesContentProps = {
  showMoreLabel: string;
};

function GaleriesContent({ showMoreLabel }: GaleriesContentProps) {
  const t = useTranslations("pages.resources.galeries");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="grid gap-10">
      <div
        className="flex flex-wrap justify-center gap-4 max-sm:justify-start"
        data-app-reveal
      >
        {CATEGORIES.map((category) => (
          <FilterButton
            key={category.key}
            type="button"
            active={activeCategory === category.key}
            color={activeCategory === category.key ? "primary" : "white"}
            onClick={() => setActiveCategory(category.key)}
          >
            {t(`categories.${category.key}`)}
          </FilterButton>
        ))}
      </div>

      <GalleryLoadMoreGrid
        items={filteredItems}
        initialCount={12}
        incrementCount={12}
        showMoreLabel={showMoreLabel}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        renderItem={(item) => (
          <div key={item.id} data-app-reveal-child>
            <Dialog>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    aria-label={t("openImage", {
                      label: t(`alts.${item.altKey}`),
                    })}
                    className="group relative aspect-[309/278] w-full overflow-hidden rounded-md outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                }
              >
                <Image
                  src={item.src}
                  alt={t(`alts.${item.altKey}`)}
                  fill
                  sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </DialogTrigger>

              <DialogContent
                showCloseButton
                className="mx-4 max-w-full gap-3 p-2 sm:max-w-6xl"
              >
                <DialogTitle className="sr-only">
                  {t(`alts.${item.altKey}`)}
                </DialogTitle>
                <div className="relative aspect-[309/278] w-full overflow-hidden rounded-md">
                  <Image
                    src={item.src}
                    alt={t(`alts.${item.altKey}`)}
                    fill
                    sizes="min(90vw, 1200px)"
                    className="object-cover"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      />
    </div>
  );
}

export { GaleriesContent };
