import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

function VideoSection() {
  const t = useTranslations("pages.home.video");
  const common = useTranslations("common.media");

  return (
    <section
      className="relative flex items-center justify-center h-65 overflow-hidden sm:h-107 lg:h-156"
      data-home-reveal
    >
      <Image
        src="/images/about/info-lan-team.webp"
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        className="object-cover absolute -z-10"
      />
      <Link
        href="/entreprise/about"
        aria-label={common("companyOverview")}
        className="flex size-16 items-center justify-center rounded-full bg-primary text-foreground-dark shadow-lg transition-transform hover:scale-105 sm:size-20"
        data-home-reveal-child
      >
        <Play className="ml-1 size-6 fill-current" strokeWidth={1.5} />
      </Link>
    </section>
  );
}

export { VideoSection };
