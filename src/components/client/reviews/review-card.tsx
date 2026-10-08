import { Star } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/client/ui/avatar";
import { getInitials } from "@/components/client/reviews/review-utils";
import type { ReviewCardProps } from "@/features/client/types/reviews.type";

function ReviewCard({
  name,
  company,
  comment,
  rating,
  ratingLabel,
  imageAlt,
}: ReviewCardProps) {
  const initials = getInitials(name);

  return (
    <article
      className="flex flex-col justify-between rounded-md border bg-white shadow-sm p-6 md:p-8 space-y-6 md:space-y-8"
      data-app-reveal
    >
      <div className="space-y-5 md:space-y-6">
        <div className="flex gap-2" aria-label={ratingLabel} role="img">
          {Array.from({ length: rating }).map((_, index) => (
            <Star
              key={index}
              className="size-5 fill-gold text-gold"
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="text-[18px]">{comment}</p>
      </div>

      <div className="flex items-center gap-5">
        <Avatar className="size-16" size="default" aria-label={imageAlt}>
          <AvatarFallback className="bg-primary-extra-light font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h5 className="font-semibold">{name}</h5>
          <p className="mt-2 text-base text-foreground-muted">{company}</p>
        </div>
      </div>
    </article>
  );
}

export { ReviewCard };
