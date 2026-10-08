import { createTranslatedMetadata } from "@/lib/client/seo";

import { HomeContent, HomeHero } from "@/components/client/home";

export const generateMetadata = createTranslatedMetadata({
  namespace: "common.metadata",
  pathname: "/",
  titleKey: "homeTitle",
  descriptionKey: "homeDescription",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeContent />
    </>
  );
}
