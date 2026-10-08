import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const pagePath = "src/app/(client)/[locale]/entreprise/about/page.tsx";
const aboutRoot = "src/components/client/about";
const imageDir = "public/images/about";
const scrollRevealPath = "src/animations/client/scroll-reveal.ts";

test("about page composes the exported design through about components", () => {
  const source = readFileSync(pagePath, "utf8");
  const scrollRevealSource = readFileSync(scrollRevealPath, "utf8");

  assert.match(
    source,
    /import \{ AboutContent, AboutHero \} from "@\/components\/client\/about"/,
  );
  assert.match(source, /<AboutHero\s*\/>/);
  assert.match(source, /<AboutContent\s*\/>/);
  assert.doesNotMatch(source, /Dedicated to Delivering Value and Excellence/);
  assert.doesNotMatch(source, /data-app-reveal/);

  for (const file of [
    "about-content.tsx",
    "hero.tsx",
    "index.ts",
    "data.ts",
    "sections/highlights-section.tsx",
    "sections/story-section.tsx",
    "sections/video-section.tsx",
    "sections/achievements-section.tsx",
    "sections/professionals-section.tsx",
    "sections/index.ts",
  ]) {
    assert.equal(existsSync(`${aboutRoot}/${file}`), true, `${file} is missing`);
  }

  const contentSource = readFileSync(`${aboutRoot}/about-content.tsx`, "utf8");
  const marqueeSource = readFileSync(
    `${aboutRoot}/sections/about-marquee.tsx`,
    "utf8",
  );

  assert.match(contentSource, /"use client"/);
  assert.match(contentSource, /createHomeSectionReveals/);
  assert.match(contentSource, /createHorizontalMarqueeLoop/);
  assert.match(contentSource, /cleanupSectionReveals\(\)/);
  assert.match(contentSource, /cleanupMarqueeLoop\(\)/);
  assert.doesNotMatch(contentSource, /createAppScrollReveal/);

  assert.match(marqueeSource, /useTranslations\("pages\.about\.marquee"\)/);
  assert.doesNotMatch(marqueeSource, /pages\.home\.marquee/);
  assert.match(marqueeSource, /data-home-marquee/);
  assert.match(marqueeSource, /data-home-marquee-group/);

  for (const sectionFile of [
    "sections/highlights-section.tsx",
    "sections/story-section.tsx",
    "sections/video-section.tsx",
    "sections/achievements-section.tsx",
    "sections/professionals-section.tsx",
  ]) {
    const sectionSource = readFileSync(`${aboutRoot}/${sectionFile}`, "utf8");

    assert.doesNotMatch(sectionSource, /data-app-reveal/);
    assert.match(sectionSource, /data-home-(?:reveal|intro)/);

    if (/data-home-intro-(?:left|right|image)/.test(sectionSource)) {
      assert.match(sectionSource, /data-home-intro/);
      assert.doesNotMatch(sectionSource, /data-home-reveal/);
    }
  }

  for (const asset of [
    "public/images/about/info-lan-team.webp",
    "public/images/home/info-lan-equipment.webp",
    "public/images/home/info-lan-installation.webp",
    "public/images/home/info-lan-maintenance.webp",
  ]) {
    assert.equal(existsSync(asset), true, `${asset} is missing`);
  }

  assert.equal(
    existsSync(`${imageDir}/about-commitment-wave.svg`),
    true,
    "about commitment wave icon is missing",
  );

  const achievementsSource = readFileSync(
    `${aboutRoot}/sections/achievements-section.tsx`,
    "utf8",
  );
  const achievementsMapStart = achievementsSource.indexOf(
    "ABOUT_ACHIEVEMENTS.map",
  );
  const achievementsMapEnd = achievementsSource.indexOf("))}", achievementsMapStart);
  const achievementItemMarkup = achievementsSource.slice(
    achievementsMapStart,
    achievementsMapEnd,
  );
  const afterAchievementItems = achievementsSource.slice(achievementsMapEnd + 3);

  assert.match(achievementsSource, /about-commitment-wave\.svg/);
  assert.match(achievementsSource, /bg-primary/);
  assert.match(achievementItemMarkup, /about-commitment-wave\.svg/);
  assert.doesNotMatch(afterAchievementItems, /about-commitment-wave\.svg/);

  assert.match(
    scrollRevealSource,
    /if \(introImageItems\.length > 0\) \{\s+gsap\.set\(introImageItems,/,
  );
  assert.match(
    scrollRevealSource,
    /if \(sectionIntroImageItems\.length > 0\) \{[\s\S]+\.to\(sectionIntroImageItems,/,
  );
  assert.match(
    scrollRevealSource,
    /const sectionIntroRightItems = selectMotionElements\([\s\S]+\.to\(\s+sectionIntroRightItems,/,
  );
});
