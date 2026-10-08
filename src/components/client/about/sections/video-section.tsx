import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/client/navigation";

function VideoSection() {
  const t = useTranslations("pages.about.video");
  const common = useTranslations("common.media");

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden h-170 lg:h-156"
      data-home-reveal
    >
      <Image
        src="/images/about/info-lan-team.webp"
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        className="object-cover absolute -z-10"
      />
      <div className="absolute -z-9 inset-0 bg-primary/10" />
      <Link
        href="/entreprise/about"
        aria-label={common("companyOverview")}
        className="flex items-center justify-center rounded-full bg-primary shadow-md transition-transform hover:scale-105 size-20 sm:size-24"
        data-home-reveal-child
      >
        <Play className="size-8 fill-white text-white" strokeWidth={1.5} />
      </Link>
    </section>
  );
}

export { VideoSection };
