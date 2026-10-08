import { useTranslations } from "next-intl";

import { HOME_BUILDS } from "@/components/client/home/data";
import { ensureRailMinimum } from "@/components/client/home/shared/home-utils";
import { ScrollRail } from "@/components/client/home/shared/scroll-rail";
import { BuildCard } from "@/components/client/home/sections/build-card";

function BuildsSection() {
  const t = useTranslations("pages.home.builds");
  const builds = ensureRailMinimum(HOME_BUILDS, 8);

  return (
    <ScrollRail title={t("title")}>
      {builds.map((build, index) => (
        <BuildCard key={`${build.key}-${index}`} build={build} />
      ))}
    </ScrollRail>
  );
}

export { BuildsSection };
