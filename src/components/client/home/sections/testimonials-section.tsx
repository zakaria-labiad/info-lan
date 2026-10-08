import { useTranslations } from "next-intl";

import { ReviewCard } from "@/components/client/reviews";

import { HOME_TESTIMONIALS } from "@/components/client/home/data";
import { reviewRailItemClassName } from "@/components/client/home/shared/constants";
import { ScrollRail } from "@/components/client/home/shared/scroll-rail";

function TestimonialsSection() {
  const t = useTranslations("pages.home.testimonials");

  return (
    <ScrollRail
      title={t("title")}
      itemClassName={reviewRailItemClassName}
    >
      {HOME_TESTIMONIALS.map((testimonial, index) => (
        <ReviewCard
          key={`${testimonial.key}-${index}`}
          name={t(`items.${testimonial.key}.name`)}
          company={t(`items.${testimonial.key}.company`)}
          comment={t(`items.${testimonial.key}.quote`)}
          rating={5}
          ratingLabel={t("ratingLabel")}
          imageAlt={t(`items.${testimonial.key}.imageAlt`)}
        />
      ))}
    </ScrollRail>
  );
}

export { TestimonialsSection };
