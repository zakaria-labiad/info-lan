import { useTranslations } from "next-intl";

import type { HomeStat } from "@/features/client/types/home.type";

type StatCardProps = {
  stat: HomeStat;
};

function StatCard({ stat }: StatCardProps) {
  const t = useTranslations("pages.home.stats.items");

  return (
    <article
      className="flex flex-col items-center justify-center gap-3 bg-transparent text-center"
      data-home-reveal-child
    >
      <strong className="block text-[28px] font-semibold leading-none sm:text-[44px]">
        {stat.value}
      </strong>
      <span className="block text-[12px] font-medium leading-4 sm:text-base">
        {t(stat.key)}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none aspect-[318/52] w-[min(58%,8.5rem)] bg-primary [mask-image:url('/images/about/about-commitment-wave.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url('/images/about/about-commitment-wave.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] sm:w-[min(60%,10rem)] lg:w-[min(64%,11rem)]"
      />
    </article>
  );
}

export { StatCard };
