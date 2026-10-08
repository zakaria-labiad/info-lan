import { Link } from "@/i18n/client/navigation";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/shared/utils";

interface CardProps {
  title: string;
  icon: LucideIcon;
  actionLabel: string;
  href?: string;
  className?: string;
}

function Card({
  title,
  icon: Icon,
  actionLabel,
  href = "#",
  className = "",
}: CardProps) {
  return (
    <Link
      href={href}
      data-app-reveal
      className={cn(
        "group block h-78 w-full rounded-md shadow-sm",
        "focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
    >
      <article
        className="
          flex
          h-full
          w-full
          flex-col
          items-start
          justify-between
          rounded-md
          border
          bg-white
          p-10
          transition-all
          duration-400
          hover:-translate-y-1
          hover:shadow-md
        "
      >
        {/* Icon */}
        <div className="flex shrink-0 items-center justify-center">
          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              group-hover:text-primary
            "
          >
            <Icon className="size-full" strokeWidth={1} aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h3
          className="
            w-full
            text-2xl
            font-medium
            leading-snug
            text-foreground
            lg:text-3xl
            group-hover:text-primary
          "
        >
          {title}
        </h3>

        {/* Button */}
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
      </article>
    </Link>
  );
}

Card.displayName = "Card";

export { Card };
