import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function read(path) {
  return readFileSync(path, "utf8");
}

const standaloneSectionHeadingFiles = [
  "src/app/(client)/[locale]/contact/page.tsx",
  "src/app/(client)/[locale]/entreprise/page.tsx",
  "src/components/client/domains/domain-detail-sections.tsx",
  "src/components/client/about/sections/achievements-section.tsx",
  "src/components/client/about/sections/highlights-section.tsx",
  "src/components/client/about/sections/professionals-section.tsx",
  "src/components/client/about/sections/story-section.tsx",
  "src/components/client/home/sections/challenge-section.tsx",
  "src/components/client/home/sections/home-intro-section.tsx",
];

test("shared SectionHeading is exported for client title reuse", () => {
  const indexSource = read("src/components/client/shared/index.ts");
  const componentSource = read("src/components/client/shared/section-heading.tsx");

  assert.match(indexSource, /export \{ SectionHeading \} from "@\/components\/client\/shared\/section-heading"/);
  assert.match(componentSource, /title\?: string/);
  assert.match(componentSource, /children\?: ReactNode/);
  assert.match(componentSource, /titleClassName\?: string/);
});

test("standalone client section titles reuse SectionHeading", () => {
  for (const file of standaloneSectionHeadingFiles) {
    const source = read(file);

    assert.match(
      source,
      /SectionHeading/,
      `${file} should use the shared SectionHeading component`,
    );
  }

  const homeIntro = read("src/components/client/home/sections/home-intro-section.tsx");
  assert.doesNotMatch(homeIntro, /<h1[\s\S]*?\{t\("title"\)\}[\s\S]*?<\/h1>/);
  assert.match(homeIntro, /<SectionHeading\s+title=\{t\("title"\)\}/);
});
