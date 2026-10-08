import assert from "node:assert/strict";
import test from "node:test";

import { canDeleteMedia, isAllowedMediaUpload, productInputSchema } from "../../src/server/products/validation";

test("product input supports bilingual drafts and structured details", () => {
  const translation = { title: "Pump", slug: "pump", shortDescription: "Short", description: "Long", seoTitle: "", seoDescription: "", isReady: true };
  const result = productInputSchema.safeParse({ revision: 1, status: "DRAFT", family: "Pumps", availability: "in-stock", isBestSeller: false, sortOrder: 0, specifications: [{ name: "Power", value: "10 kW" }], options: ["Steel"], translations: { FR: translation, EN: translation }, categoryIds: [1], relatedProductIds: [], mediaIds: [] });
  assert.equal(result.success, true);
  assert.equal(productInputSchema.safeParse({ revision: 0 }).success, false);
});

test("media uploads restrict MIME type and file size", () => {
  assert.equal(isAllowedMediaUpload({ type: "image/webp", size: 1024 }), true);
  assert.equal(isAllowedMediaUpload({ type: "image/svg+xml", size: 1024 }), false);
  assert.equal(isAllowedMediaUpload({ type: "image/png", size: 9 * 1024 * 1024 }), false);
});

test("referenced media cannot be deleted", () => {
  assert.equal(canDeleteMedia({ blogPosts: 0, products: 0 }), true);
  assert.equal(canDeleteMedia({ blogPosts: 1, products: 0 }), false);
  assert.equal(canDeleteMedia({ blogPosts: 0, products: 2 }), false);
});
