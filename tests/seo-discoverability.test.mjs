import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(file) {
  return readFileSync(file, "utf8");
}

test("robots exposes public content and protects private application routes", () => {
  const robots = read("src/app/robots.ts");

  assert.match(robots, /userAgent:\s*["']\*["']/);
  assert.match(robots, /allow:\s*["']\/["']/);
  assert.match(robots, /["']\/admin["']/);
  assert.match(robots, /["']\/api["']/);
  assert.match(robots, /sitemap/);
  assert.match(robots, /VERCEL_ENV\s*===\s*["']preview["']/);
  assert.match(robots, /disallow:\s*["']\/["']/);
});

test("sitemap derives localized URLs and alternates from shared route data", () => {
  const sitemap = read("src/app/sitemap.ts");

  for (const token of [
    "PUBLIC_STATIC_PATHS",
    "CATEGORY_ROUTES",
    "domainSlugs",
    "staticBlogMessages.posts",
    "locales",
    "alternates",
  ]) {
    assert.equal(sitemap.includes(token), true, `missing ${token}`);
  }
  assert.doesNotMatch(sitemap, /x-default/);
});

test("JSON-LD is escaped and exposes factual organization and website entities", () => {
  const component = read("src/components/client/seo/json-ld.tsx");
  const layout = read("src/app/(client)/[locale]/layout.tsx");

  assert.match(component, /replace\(\/<\/g,\s*["']\\\\u003c["']\)/);
  assert.match(layout, /<JsonLd/);
  assert.match(layout, /["']Organization["']/);
  assert.match(layout, /["']WebSite["']/);
  assert.match(layout, /["']PostalAddress["']/);
  assert.match(layout, /20 rue Banafsaj/);
  assert.match(layout, /\+212522398484/);
  assert.doesNotMatch(
    layout,
    /aggregateRating|reviewCount|priceRange|areaServed|knowsAbout/,
  );
});
