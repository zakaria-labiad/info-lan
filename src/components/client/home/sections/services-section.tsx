import { useTranslations } from "next-intl";

import { Card } from "@/components/client/shared/card";

import { HOME_SERVICES } from "@/components/client/home/data";
import { ensureRailMinimum } from "@/components/client/home/shared/home-utils";
import { ScrollRail } from "@/components/client/home/shared/scroll-rail";

function ServicesSection() {
  const t = useTranslations("pages.home.services");
  const services = ensureRailMinimum(HOME_SERVICES, 8);

  return (
    <ScrollRail title={t("title")}>
      {services.map((service, index) => (
        <Card
          key={`${service.key}-${index}`}
          icon={service.icon}
          title={t(`items.${service.key}`)}
          actionLabel={t("readMore")}
          href={service.href}
        />
      ))}
    </ScrollRail>
  );
}

export { ServicesSection };
