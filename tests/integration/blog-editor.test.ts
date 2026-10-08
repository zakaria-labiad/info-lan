import assert from "node:assert/strict";
import test from "node:test";

import {
  isLocaleReady,
  isPostPubliclyVisible,
  slugifyBlogTitle,
} from "../../src/server/blog/publication";
import { blogPostInputSchema } from "../../src/server/blog/validation";
import { blogCategoryInputSchema, blogTagInputSchema } from "../../src/server/blog/taxonomy";

const document = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Body" }] }] };

test("blog locale readiness requires a title, slug, excerpt, and non-empty document", () => {
  assert.equal(isLocaleReady({ title: "Article", slug: "article", excerpt: "Summary", content: document }), true);
  assert.equal(isLocaleReady({ title: "Article", slug: "article", excerpt: "", content: document }), false);
  assert.equal(isLocaleReady({ title: "Article", slug: "article", excerpt: "Summary", content: { type: "doc", content: [] } }), false);
});

test("publication visibility respects status, locale readiness, and time", () => {
  const now = new Date("2026-10-07T12:00:00.000Z");
  assert.equal(isPostPubliclyVisible({ status: "PUBLISHED", publishedAt: new Date("2026-10-07T11:00:00.000Z"), scheduledAt: null, isReady: true }, now), true);
  assert.equal(isPostPubliclyVisible({ status: "SCHEDULED", publishedAt: null, scheduledAt: new Date("2026-10-07T13:00:00.000Z"), isReady: true }, now), false);
  assert.equal(isPostPubliclyVisible({ status: "SCHEDULED", publishedAt: null, scheduledAt: new Date("2026-10-07T11:00:00.000Z"), isReady: true }, now), true);
  assert.equal(isPostPubliclyVisible({ status: "PUBLISHED", publishedAt: now, scheduledAt: null, isReady: false }, now), false);
});

test("slug creation is stable for French titles", () => {
  assert.equal(slugifyBlogTitle("  L’été à l’atelier — édition 2026  "), "l-ete-a-l-atelier-edition-2026");
});

test("blog input validates both translations and optimistic revision", () => {
  const result = blogPostInputSchema.safeParse({
    revision: 1,
    status: "DRAFT",
    scheduledAt: null,
    translations: {
      FR: { title: "Titre", slug: "titre", subtitle: "", excerpt: "Résumé", content: document, seoTitle: "", seoDescription: "", isReady: true },
      EN: { title: "Title", slug: "title", subtitle: "", excerpt: "Summary", content: document, seoTitle: "", seoDescription: "", isReady: true },
    },
    categoryIds: [],
    tagIds: [],
    mediaIds: [7, 9],
    coverMediaId: 7,
  });
  assert.equal(result.success, true);
  assert.equal(blogPostInputSchema.safeParse({
    ...result.data,
    mediaIds: [9],
    coverMediaId: 7,
  }).success, false);
  assert.equal(blogPostInputSchema.safeParse({ revision: 0 }).success, false);
});

test("blog taxonomies require bilingual names and stable slugs", () => {
  assert.equal(blogCategoryInputSchema.safeParse({ nameFr: "Conseils", nameEn: "Tips", slugFr: "conseils", slugEn: "tips", descriptionFr: "", descriptionEn: "", sortOrder: 0, isActive: true }).success, true);
  assert.equal(blogTagInputSchema.safeParse({ nameFr: "Énergie", nameEn: "Energy", slugFr: "énergie", slugEn: "energy" }).success, false);
});
