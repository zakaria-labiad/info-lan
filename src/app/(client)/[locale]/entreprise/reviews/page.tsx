import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";
import { Cta } from "@/components/client/shared";
import { ReviewCard } from "@/components/client/reviews";
import type { ReviewTranslation } from "@/features/client/types/reviews.type";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.reviews.hero",
  pathname: "/entreprise/reviews",
});

export default function ReviewsPage() {
  const t = useTranslations("pages.reviews");
  const reviews = t.raw("items") as ReviewTranslation[];

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-y-6 lg:gap-y-8 xl:gap-y-10 gap-x-4 lg:gap-x-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review.name}
              {...review}
              ratingLabel={t("ratingLabel", { rating: review.rating })}
            />
          ))}
        </div>

        <Cta title={t("ctaTitle")} buttonLabel={t("ctaButton")} />
      </main>
    </div>
  );
}
