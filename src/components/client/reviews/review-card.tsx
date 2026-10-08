import { CircleCheckBig } from "lucide-react";
import type { ReviewCardProps } from "@/features/client/types/reviews.type";

function ReviewCard({
  name,
  company,
  comment,
  ratingLabel,
  initials,
  imageAlt,
}: ReviewCardProps) {
  return (
    <article
      className="flex flex-col justify-between rounded-md border bg-white shadow-sm p-6 md:p-8 space-y-6 md:space-y-8"
      data-app-reveal
    >
      <div className="space-y-5 md:space-y-6">
        <div className="flex items-center gap-2 text-primary" aria-label={ratingLabel}>
          <CircleCheckBig className="size-6" aria-hidden="true" />
          <span className="text-sm font-semibold">{ratingLabel}</span>
        </div>

        <p className="text-[18px]">{comment}</p>
      </div>

      <div className="flex items-center gap-5">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-extra-light font-semibold text-primary"
          aria-label={imageAlt}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h5 className="font-semibold">{name}</h5>
          <p className="mt-2 text-base text-foreground-muted">{company}</p>
        </div>
      </div>
    </article>
  );
}

export { ReviewCard };
