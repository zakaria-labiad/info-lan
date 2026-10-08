import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("header product menu links to all categories in every locale", () => {
  const enHeader = readJson("src/messages/en/client/header.json");
  const frHeader = readJson("src/messages/fr/client/header.json");

  assert.equal(enHeader.nav.products.allTitle, "All categories");
  assert.equal(frHeader.nav.products.allTitle, "Toutes les catégories");
});

test("product category page exposes localized searchable product grid content", () => {
  const page = readFileSync("src/app/(client)/[locale]/categories/[category]/page.tsx", "utf8");
  const content = readFileSync(
    "src/components/client/categories/category-detail-content.tsx",
    "utf8",
  );
  const productCard = readFileSync(
    "src/components/client/categories/product-card.tsx",
    "utf8",
  );
  const enMessages = readJson("src/messages/en/client/pages/category-detail.json");
  const frMessages = readJson("src/messages/fr/client/pages/category-detail.json");

  assert.match(page, /@\/components\/client\/shared\/hero/);
  assert.match(page, /@\/components\/client\/categories\/category-detail-content/);
  assert.doesNotMatch(page, /animate-pulse/);

  for (const source of [content]) {
    assert.match(source, /@\/components\/client\/shared\/input/);
    assert.match(source, /@\/components\/client\/ui\/dropdown-menu/);
    assert.match(source, /@\/components\/client\/categories\/product-card/);
    assert.match(source, /@\/components\/client\/shared\/load-more-grid/);
    assert.match(source, /CATEGORY_PRODUCTS_PAGE_SIZE = 12/);
    assert.match(source, /initialCount=\{CATEGORY_PRODUCTS_PAGE_SIZE\}/);
    assert.match(source, /incrementCount=\{CATEGORY_PRODUCTS_PAGE_SIZE\}/);
    assert.match(source, /reveal=\{false\}/);
    assert.doesNotMatch(source, /animate-pulse/);
  }

  assert.doesNotMatch(productCard, /data-app-reveal/);

  for (const messages of [enMessages, frMessages]) {
    assert.equal(typeof messages.search.label, "string");
    assert.equal(typeof messages.filters.all, "string");
    assert.equal(typeof messages.showMore, "string");
    assert.equal(Object.keys(messages.categories).length, 11);
    assert.ok(Object.keys(messages.products).length >= 12);
  }
});

test("category index exposes the short enterprise product taxonomy", () => {
  const categoriesPage = readFileSync("src/app/(client)/[locale]/categories/page.tsx", "utf8");
  const enMessages = readJson("src/messages/en/client/pages/categories.json");
  const frMessages = readJson("src/messages/fr/client/pages/categories.json");

  const expectedKeys = [
    "piping",
    "tanks",
    "boilermaking",
    "conveyors",
    "docks",
    "structures",
    "shelving",
    "safety",
    "workshop",
    "display",
    "specials",
  ];

  const expectedFrenchLabels = [
    "Ordinateurs",
    "Serveurs & stockage",
    "Impression",
    "Réseau",
    "Sécurité informatique",
    "Équipement de bureau",
    "Sauvegarde",
    "Logiciels & protection",
    "Maintenance",
    "Écrans",
    "Accessoires & solutions",
  ];

  assert.deepEqual(Object.keys(frMessages.categories), expectedKeys);
  assert.deepEqual(Object.values(frMessages.categories), expectedFrenchLabels);
  assert.deepEqual(Object.keys(enMessages.categories), expectedKeys);
  assert.equal([...categoriesPage.matchAll(/key: "([^"]+)"/g)].length, 11);

  for (const label of Object.values(frMessages.categories)) {
    assert.ok(label.split(/\s+/).length <= 3, `${label} should stay short`);
  }
});

test("category browsing routes and frontend files are named as categories", () => {
  const categoriesPage = readFileSync("src/app/(client)/[locale]/categories/page.tsx", "utf8");
  const categoryPage = readFileSync("src/app/(client)/[locale]/categories/[category]/page.tsx", "utf8");
  const productPage = readFileSync(
    "src/app/(client)/[locale]/categories/[category]/[product]/page.tsx",
    "utf8",
  );
  const header = readFileSync("src/components/client/shared/layout/header.tsx", "utf8");

  assert.match(categoriesPage, /useTranslations\("pages\.categories"\)/);
  assert.match(categoryPage, /getTranslations\("pages\.categoryDetail"\)/);
  assert.match(productPage, /params: Promise<CategoryProductRouteParams>/);
  assert.match(header, /href: "\/categories\//);
  assert.doesNotMatch(header, /href: "\/products/);
});

test("header product dropdown keeps unique React keys for repeated category hrefs", () => {
  const header = readFileSync("src/components/client/shared/layout/header.tsx", "utf8");

  assert.match(header, /key=\{`\$\{product\.href\}-\$\{product\.key\}`\}/);
  assert.match(header, /key=\{`\$\{item\.href\}-\$\{item\.key\}`\}/);
  assert.doesNotMatch(header, /<li key=\{product\.href\}>/);
});

test("each product category has related products without repeated products", () => {
  const routes = readFileSync("src/lib/client/routes/catalog.ts", "utf8");
  const productGroups = routes.match(/products: \[[\s\S]*?\]/g) ?? [];
  const expectedSlugs = [
    "tuyauterie",
    "cuves",
    "chaudronnerie",
    "convoyeurs",
    "quais",
    "structures",
    "rayonnage",
    "securite",
    "atelier",
    "affichage",
    "speciaux",
  ];

  for (const slug of expectedSlugs) {
    assert.match(routes, new RegExp(`"?${slug}"?: \\{`));
  }

  assert.equal(productGroups.length, expectedSlugs.length);

  for (const group of productGroups) {
    const ids = [...group.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);

    assert.ok(ids.length >= 3, `${ids.join(", ")} should include related products`);
    assert.equal(new Set(ids).size, ids.length, `${ids.join(", ")} should not repeat products`);
  }
});

test("category products use the approved local INFO-L@N image set", () => {
  const page = readFileSync("src/app/(client)/[locale]/categories/[category]/page.tsx", "utf8");
  const nextConfig = readFileSync("next.config.ts", "utf8");

  assert.match(page, /const PRODUCT_IMAGE_BY_ID/);
  assert.match(page, /PRODUCT_IMAGE_BY_ID\[product\.id\] \?\? PRODUCT_IMAGES/);
  for (const asset of [
    "info-lan-equipment.webp",
    "info-lan-installation.webp",
    "info-lan-maintenance.webp",
    "info-lan-team.webp",
  ]) {
    assert.match(page, new RegExp(asset.replace(".", "\\.")));
  }
  assert.doesNotMatch(page, /https?:\/\/[^\s"']+\.(?:jpe?g|png|webp)/i);
  assert.doesNotMatch(nextConfig, /temachchina|liquipsalesnq|troyboiler|made-in-china|machinio|saferack/i);
  assert.match(nextConfig, /hostname: "res\.cloudinary\.com"/);
});
