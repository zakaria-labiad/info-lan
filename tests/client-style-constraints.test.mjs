import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const checkedFiles = [
  "src/app/(client)/[locale]/resources/downloads/page.tsx",
  "src/app/(client)/[locale]/resources/galeries/page.tsx",
  "src/app/(client)/[locale]/resources/guides/page.tsx",
  "src/app/(client)/[locale]/entreprise/news/page.tsx",
  "src/app/(client)/[locale]/entreprise/partners/page.tsx",
  "src/components/client/gallery/galeries-content.tsx",
  "src/app/(client)/[locale]/domains/[domain]/page.tsx",
  "src/app/(client)/[locale]/categories/[category]/[product]/page.tsx",
  "src/components/client/shared/cta.tsx",
  "src/components/client/shared/load-more-grid.tsx",
  "src/components/client/shared/hero.tsx",
  "src/components/client/shared/card.tsx",
  "src/components/client/shared/variants.ts",
  "src/components/client/categories/category-detail-content.tsx",
  "src/components/client/blog/blog-card.tsx",
  "src/components/client/blog/blog-detail.tsx",
  "src/components/client/blog/blog-pagination.tsx",
];

const forbiddenPatterns = [
  {
    name: "arbitrary Tailwind text size",
    pattern: /(?:^|[\s"`'])\w*:?(?:[a-z]+:)*text-\[[^\]]+\]/,
  },
  {
    name: "arbitrary Tailwind color",
    pattern: /(?:^|[\s"`'])\w*:?(?:[a-z]+:)*(?:text|bg|border|from|to|via)-\[#(?:[0-9a-fA-F]{3,8})\]/,
  },
  {
    name: "inline font family",
    pattern: /fontFamily\s*:/,
  },
  {
    name: "arbitrary Tailwind sizing",
    pattern: /(?:^|[\s"`'])\w*:?(?:[a-z]+:)*(?:h|w|size|min-h|min-w|max-h|max-w)-\[[^\]]+\]/,
  },
];

test("client target pages use semantic Tailwind typography and color utilities", () => {
  const failures = [];

  for (const file of checkedFiles) {
    const source = readFileSync(file, "utf8");

    for (const { name, pattern } of forbiddenPatterns) {
      if (pattern.test(source)) {
        failures.push(`${file}: ${name}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
