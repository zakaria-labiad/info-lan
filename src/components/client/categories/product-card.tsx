import { Link } from "@/i18n/client/navigation";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";

import type { ProductAvailability } from "@/components/client/categories/category-product-filters";
import { Badge } from "@/components/client/ui/badge";
import { cn } from "@/lib/shared/utils";

interface ProductCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  isBestSeller: boolean;
  availability: ProductAvailability;
  labels: {
    bestSellerProduct: string;
    active: string;
    unavailable: string;
  };
  actionLabel: string;
  href?: string;
  className?: string;
}

function truncateProductDescription(description: string, maxLength = 92) {
  const trimmedDescription = description.trim();

  if (trimmedDescription.length <= maxLength) {
    return trimmedDescription;
  }

  const cutoff = trimmedDescription.slice(0, Math.max(0, maxLength - 3));
  const wordBoundary = cutoff.lastIndexOf(" ");
  const safeCutoff = wordBoundary > 0 ? cutoff.slice(0, wordBoundary) : cutoff;

  return `${safeCutoff.trimEnd()}...`;
}

function ProductCard({
  title,
  description,
  imageSrc,
  imageAlt,
  isBestSeller,
  availability,
  labels,
  actionLabel,
  href = "#",
  className = "",
}: ProductCardProps) {
  const shortDescription = truncateProductDescription(description);
  const available = availability === "active";

  return (
    <Link
      href={href}
      className={cn(
        "group block h-full min-h-110 w-full rounded-md shadow-sm",
        "focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
    >
      <article
        className="
          grid
          h-full
          w-full
          grid-rows-[auto_minmax(0,1fr)]
          overflow-hidden
          rounded-md
          border
          bg-white
          transition-all
          duration-400
          hover:-translate-y-1
          hover:shadow-md
        "
      >
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.72)_100%)]
            "
            aria-hidden="true"
          />

          <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap justify-between gap-2">
            {isBestSeller && (
              <Star
                  className="size-7 fill-gold text-gold"
                  strokeWidth={2}
                  aria-hidden="true"
                />
            )}

            <Badge
              variant={available ? "success" : "muted"}
              className={cn(!isBestSeller && "ml-auto", "backdrop-blur")}
            >
              {available ? labels.active : labels.unavailable}
            </Badge>
          </div>
        </div>

        <div
          className="
            flex
            flex-col
            items-start
            justify-between
            gap-6
            p-6
            sm:p-7
          "
        >
          <div className="grid gap-3">
            <h3
              className="
                w-full
                text-xl
                font-medium
                leading-snug
                text-foreground
                transition-colors
                group-hover:text-primary
                lg:text-2xl
              "
            >
              {title}
            </h3>

            <p
              className="
                min-h-13
                overflow-hidden
                text-sm
                leading-6
                text-foreground-muted
                [display:-webkit-box]
                [-webkit-box-orient:vertical]
                [-webkit-line-clamp:2]
              "
            >
              {shortDescription}
            </p>
          </div>

          <div
            className="
                              flex
                              h-7
                              items-center
                              gap-1
                              text-foreground
                            "
          >
            <span
              className="
                                text-base
                                font-semibold
                                uppercase
                                leading-6
                                group-hover:text-primary
                              "
            >
              {actionLabel}
            </span>

            <ArrowUpRight
              className="
                                size-6
                                shrink-0
                                transition-transform
                                duration-400
                                group-hover:rotate-45
                                group-hover:text-primary
                              "
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

ProductCard.displayName = "ProductCard";

export { ProductCard, truncateProductDescription };
