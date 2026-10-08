import type { LocalePageProps } from "@/i18n/shared/config";
import { redirect } from "@/i18n/client/navigation";
import { createTranslatedMetadata } from "@/lib/client/seo";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.galeries.hero",
  pathname: "/resources/galeries",
  index: false,
});

async function CataloguePage({ params }: LocalePageProps) {
  const { locale } = await params;

  redirect({ href: "/resources/galeries", locale });
}

export default CataloguePage;
