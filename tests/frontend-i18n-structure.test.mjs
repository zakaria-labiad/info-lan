import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const pageMessageFiles = [
  "home.json",
  "company.json",
  "about.json",
  "news.json",
  "partners.json",
  "reviews.json",
  "categories.json",
  "category-detail.json",
  "product-detail.json",
  "domains.json",
  "domain-detail.json",
  "quote.json",
  "devis.json",
  "contact.json",
  "resources/blog.json",
  "resources/blog-detail.json",
  "resources/faq.json",
  "resources/guides.json",
  "resources/downloads.json",
  "resources/galeries.json",
];

test("frontend page messages are split into per-page locale files", () => {
  for (const locale of ["en", "fr"]) {
    for (const file of pageMessageFiles) {
      const path = `src/messages/${locale}/client/pages/${file}`;
      assert.equal(existsSync(path), true, `${path} is missing`);
    }
  }

  assert.equal(
    existsSync("src/messages/en/client/pages.json"),
    false,
    "English page copy should be moved out of pages.json",
  );
  assert.equal(
    existsSync("src/messages/fr/client/pages.json"),
    false,
    "French page copy should be moved out of pages.json",
  );
});

test("frontend blog data no longer depends on the removed feature/blog file", () => {
  assert.equal(
    existsSync("src/features/blog/posts.ts"),
    false,
    "src/features/blog/posts.ts should be removed",
  );

  const checkedFiles = [
    "src/app/(client)/[locale]/resources/blog/page.tsx",
    "src/app/(client)/[locale]/resources/blog/[id]/page.tsx",
    "src/components/client/blog/blog-card.tsx",
    "src/components/client/blog/blog-detail.tsx",
    "src/components/client/blog/blog-sidebar.tsx",
    "src/components/client/blog/blog-pagination.tsx",
  ];

  for (const file of checkedFiles) {
    const source = readFileSync(file, "utf8");
    assert.equal(
      source.includes("@/features/blog/posts"),
      false,
      `${file} still imports the removed blog feature file`,
    );
  }
});
