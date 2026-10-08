import { useTranslations } from "next-intl";

import { cn } from "@/lib/shared/utils";
import { Loader } from "lucide-react";

import { ABOUT_MARQUEE_ITEMS } from "@/components/client/about/data";

function AboutMarquee() {
  const t = useTranslations("pages.about.marquee");

  return (
    <section className="overflow-hidden" data-home-reveal>
      <div
        className="flex w-max items-center whitespace-nowrap"
        data-home-marquee
      >
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            className="flex items-center gap-10 py-4 sm:gap-12 pl-10 sm:pl-12"
            data-home-marquee-group
          >
            {ABOUT_MARQUEE_ITEMS.map((item, index) => (
              <div
                key={`${groupIndex}-${item}`}
                className="flex items-center gap-6"
              >
                <Loader className="size-24 text-primary" />
                <span
                  className={cn(
                    "font-semibold uppercase leading-none text-[50px] sm:text-[68px] lg:text-[76px]",
                    index % 2 === 0
                      ? "text-primary"
                      : "text-transparent [-webkit-text-stroke:1px_#006BB6]",
                  )}
                >
                  {t(item)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export { AboutMarquee };
