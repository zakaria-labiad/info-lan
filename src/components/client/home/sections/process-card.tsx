import { useTranslations } from "next-intl";
import { cn } from "@/lib/shared/utils";

import type { HomeProcess } from "@/features/client/types/home.type";

type ProcessCardProps = {
  process: HomeProcess;
  className?: string;
};

function ProcessCard({ process, className = "" }: ProcessCardProps) {
  const t = useTranslations("pages.home.process.items");
  const Icon = process.icon;

  return (
    <article
      className={cn(
        "flex flex-col min-h-fit! lg:min-h-78 w-full max-w-full xl:w-77.25 gap-3 rounded-md bg-white p-6 lg:p-8",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        focusable="false"
        className="size-16 text-primary"
        strokeWidth={1.5}
      />
      <div className="grid gap-4">
        <h3 className="font-medium">{t(`${process.key}.title`)}</h3>
        <p className="text-sm text-foreground-muted sm:text-[16px] md:text-base">
          {t(`${process.key}.description`)}
        </p>
      </div>
    </article>
  );
}

export { ProcessCard };
