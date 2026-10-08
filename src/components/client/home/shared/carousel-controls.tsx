import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/components/client/shared";
import { cn } from "@/lib/shared/utils";

type CarouselControlsProps = {
  className?: string;
  onPrevious: () => void;
  onNext: () => void;
};

function CarouselControls({
  className,
  onPrevious,
  onNext,
}: CarouselControlsProps) {
  const t = useTranslations("common.navigation");
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <IconButton
        type="button"
        aria-label={t("previous")}
        color="transparent"
        icon={ArrowLeft}
        iconSize="xl"
        iconClassName="size-8!"
        onClick={onPrevious}
        className="size-9! sm:size-10!"
      />
      <IconButton
        type="button"
        aria-label={t("next")}
        color="transparent"
        icon={ArrowRight}
        iconSize="xl"
        iconClassName="size-8!"
        onClick={onNext}
        className="size-9! sm:size-10!"
      />
    </div>
  );
}

export { CarouselControls };
