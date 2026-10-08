import { createTranslatedMetadata } from "@/lib/client/seo";

import { AboutContent, AboutHero } from "@/components/client/about";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.about.hero",
  pathname: "/entreprise/about",
});

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <AboutHero />
      <AboutContent />
    </div>
  );
}
