import Image from "next/image";
import { useTranslations } from "next-intl";

import type { HomeBuild } from "@/features/client/types/home.type";

type BuildCardProps = {
  build: HomeBuild;
};

function BuildCard({ build }: BuildCardProps) {
  const t = useTranslations("pages.home.builds.items");

  return (
    <article className="relative h-85 w-full overflow-hidden rounded-md">
      <Image
        src={build.image}
        alt={t(`${build.key}.alt`)}
        fill
        sizes="340px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
        <h3 className="text-xl font-semibold text-white">{t(`${build.key}.title`)}</h3>
      </div>
    </article>
  );
}

export { BuildCard };
