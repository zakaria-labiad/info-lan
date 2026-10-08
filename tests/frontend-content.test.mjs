import { existsSync, statSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const sourceFiles = [
  "src/components/client/home/data.ts",
  "src/components/client/home/hero.tsx",
  "src/components/client/home/sections/home-intro-section.tsx",
  "src/components/client/home/sections/services-section.tsx",
  "src/components/client/home/sections/challenge-section.tsx",
  "src/components/client/home/sections/builds-section.tsx",
  "src/components/client/home/sections/technique-section.tsx",
  "src/components/client/home/sections/testimonials-section.tsx",
  "src/components/client/home/sections/blog-section.tsx",
  "src/components/client/gallery/galeries-content.tsx",
  "src/app/(client)/[locale]/categories/page.tsx",
  "src/app/(client)/[locale]/domains/page.tsx",
  "src/app/(client)/[locale]/entreprise/about/page.tsx",
];

const bannedTemplateTerms = [
  "Fleet Management",
  "Interior Design",
  "House Renovation",
  "Top Mistakes to Avoid During Home Renovation",
  "Residential",
  "Dedicated to Delivering Value and Excellence",
  "Trusted Partner in Construction",
  "Client Feed backend Success Store",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("visible frontend content is INFO-L@N-specific and localized", () => {
  const combinedSource = sourceFiles
    .filter((path) => existsSync(path))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  for (const term of bannedTemplateTerms) {
    assert.equal(
      combinedSource.includes(term),
      false,
      `${term} should not remain in frontend source`,
    );
  }

  const frHome = readJson("src/messages/fr/client/pages/home.json");
  const enHome = readJson("src/messages/en/client/pages/home.json");
  const frAbout = readJson("src/messages/fr/client/pages/about.json");
  const enAbout = readJson("src/messages/en/client/pages/about.json");
  const frGaleries = readJson("src/messages/fr/client/pages/resources/galeries.json");
  const enGaleries = readJson("src/messages/en/client/pages/resources/galeries.json");

  assert.equal(frHome.hero.title, "Votre informatique, équipée, installée et maintenue.");
  assert.equal(enHome.hero.title, "Your IT, supplied, installed and maintained.");
  assert.equal(frHome.services.title, "Des services informatiques de proximité");
  assert.equal(enHome.services.title, "Local IT services");
  assert.equal(frAbout.story.title, "À vos côtés depuis 2005");
  assert.equal(enAbout.story.title, "At your side since 2005");
  assert.equal(frGaleries.categories.boilermaking, "Installation");
  assert.equal(enGaleries.categories.boilermaking, "Installation");
});

test("public pages do not write browser errors to the application filesystem", () => {
  const routePath = "src/app/api/frontend-logs/route.ts";
  const recorderPath = "src/components/client/shared/layout/frontend-log-recorder.tsx";
  const layoutPath = "src/app/(client)/[locale]/layout.tsx";

  assert.equal(existsSync(routePath), false, "unsafe frontend log route must stay removed");
  assert.equal(existsSync(recorderPath), false, "frontend log recorder must stay removed");

  const layout = readFileSync(layoutPath, "utf8");
  assert.doesNotMatch(layout, /FrontendLogRecorder/);
});

test("new frontend photos are WebP and stay below 150 KB", () => {
  const imagePaths = [
    "public/images/home/info-lan-hero.webp",
    "public/images/home/info-lan-equipment.webp",
    "public/images/home/info-lan-installation.webp",
    "public/images/home/info-lan-maintenance.webp",
    "public/images/about/info-lan-team.webp",
  ];

  for (const imagePath of imagePaths) {
    assert.equal(existsSync(imagePath), true, `${imagePath} is missing`);
    assert.equal(statSync(imagePath).size <= 150 * 1024, true, `${imagePath} is over 150 KB`);
  }
});

test("home technique section uses approved installation and equipment imagery", () => {
  const techniqueSource = readFileSync(
    "src/components/client/home/sections/technique-section.tsx",
    "utf8",
  );

  assert.match(techniqueSource, /src="\/images\/home\/info-lan-installation\.webp"/);
  assert.match(techniqueSource, /src="\/images\/home\/info-lan-equipment\.webp"/);
  assert.doesNotMatch(techniqueSource, /home-techniques\.webp/);
  assert.doesNotMatch(techniqueSource, /home-process-badge\.webp/);
  assert.doesNotMatch(techniqueSource, /abstract-background-with-silver-metal-texture\.webp/);
});

test("home challenge section keeps the current responsive grid and image frame", () => {
  const challengeSource = readFileSync(
    "src/components/client/home/sections/challenge-section.tsx",
    "utf8",
  );

  assert.match(
    challengeSource,
    /gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10/,
  );
  assert.match(challengeSource, /overflow-hidden lg:overflow-visible/);
  assert.match(challengeSource, /relative w-full h-120 lg:h-130 aspect-16\/10/);
  assert.match(challengeSource, /lg:aspect-440\/531/);
  assert.match(challengeSource, /lg:overflow-visible/);
  assert.match(challengeSource, /sizes="\(min-width: 1024px\) 440px, 100vw"/);
  assert.match(challengeSource, /className="object-cover object-center rounded-md"/);
  assert.match(challengeSource, /bottom-4 left-4/);
  assert.match(challengeSource, /lg:left-0 lg:top-1\/2/);
  assert.match(challengeSource, /max-w-\[calc\(100vw-2rem\)\]/);
  assert.match(challengeSource, /lg:max-w-none/);
});

test("home stat cards include primary wave marks without circular borders", () => {
  const statCardSource = readFileSync(
    "src/components/client/home/sections/stat-card.tsx",
    "utf8",
  );

  assert.match(statCardSource, /about-commitment-wave\.svg/);
  assert.match(statCardSource, /bg-primary/);
  assert.doesNotMatch(statCardSource, /rounded-full/);
  assert.doesNotMatch(statCardSource, /border-black\/20/);
});
