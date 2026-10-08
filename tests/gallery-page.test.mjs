import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const galleryPagePath = "src/app/(client)/[locale]/resources/galeries/page.tsx";
const galleryContentPath =
  "src/components/client/gallery/galeries-content.tsx";
const cataloguePagePath = "src/app/(client)/[locale]/resources/catalogue/page.tsx";
const loadMorePath = "src/components/client/shared/load-more-grid.tsx";
const headerPath = "src/components/client/shared/layout/header.tsx";
const frGaleriesPath = "src/messages/fr/client/pages/resources/galeries.json";
const enGaleriesPath = "src/messages/en/client/pages/resources/galeries.json";
const frHeaderPath = "src/messages/fr/client/header.json";
const enHeaderPath = "src/messages/en/client/header.json";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("gallery page replaces catalogue route and uses reusable show-more grid", () => {
  assert.equal(existsSync(galleryPagePath), true, "galeries route is missing");
  assert.equal(existsSync(loadMorePath), true, "load-more grid is missing");

  const page = readFileSync(galleryPagePath, "utf8");
  const content = readFileSync(galleryContentPath, "utf8");
  const loadMore = readFileSync(loadMorePath, "utf8");
  const cataloguePage = readFileSync(cataloguePagePath, "utf8");
  const header = readFileSync(headerPath, "utf8");

  assert.match(page, /pages\.resources\.galeries/);
  assert.match(page, /GaleriesContent/);

  assert.match(content, /"use client"/);
  assert.match(content, /GalleryLoadMoreGrid/);
  assert.match(content, /FilterButton/);
  assert.match(content, /Dialog/);
  assert.match(content, /DialogTrigger/);
  assert.match(content, /DialogContent/);
  assert.match(content, /DialogTitle/);
  assert.match(content, /color={activeCategory === category.key \? "primary" : "white"}/);
  assert.match(content, /data-app-reveal/);
  assert.match(content, /initialCount=\{12\}/);
  assert.match(content, /incrementCount=\{12\}/);
  assert.match(content, /grid-cols-1/);
  assert.match(content, /md:grid-cols-2/);
  assert.match(content, /lg:grid-cols-3/);
  assert.match(content, /2xl:grid-cols-4/);
  assert.match(content, /aria-label=\{t\("openImage"/);
  assert.match(content, /alt=\{t\(`alts\.\$\{item\.altKey\}`\)\}/);
  assert.match(content, /showCloseButton/);
  assert.match(content, /sizes="min\(90vw, 1200px\)"/);

  assert.match(loadMore, /"use client"/);
  assert.match(loadMore, /visibleCount/);
  assert.match(loadMore, /setVisibleCount/);
  assert.match(loadMore, /slice\(0, visibleCount\)/);
  assert.match(loadMore, /Math\.min\(current \+ incrementCount, items\.length\)/);
  assert.match(loadMore, /showMoreLabel/);

  assert.match(cataloguePage, /redirect\(\{ href: "\/resources\/galeries", locale \}\)/);
  assert.match(header, /key: "galeries", href: "\/resources\/galeries"/);
  assert.doesNotMatch(header, /key: "catalogue", href: "\/resources\/catalogue"/);
});

test("gallery messages and approved INFO-L@N assets are present", () => {
  const frGaleries = readJson(frGaleriesPath);
  const enGaleries = readJson(enGaleriesPath);
  const frHeader = readJson(frHeaderPath);
  const enHeader = readJson(enHeaderPath);

  assert.equal(frGaleries.hero.title, "Galeries");
  assert.equal(enGaleries.hero.title, "Galleries");
  assert.equal(frGaleries.showMore, "Afficher plus");
  assert.equal(enGaleries.showMore, "Show more");
  assert.equal(frGaleries.categories.boilermaking, "Installation");
  assert.equal(enGaleries.categories.boilermaking, "Installation");
  assert.equal(frHeader.nav.resources.items.galeries, "Galeries");
  assert.equal(enHeader.nav.resources.items.galeries, "Galleries");

  const approvedAssets = [
    "public/images/home/info-lan-equipment.webp",
    "public/images/home/info-lan-installation.webp",
    "public/images/home/info-lan-maintenance.webp",
    "public/images/about/info-lan-team.webp",
  ];
  const galleryContent = readFileSync(galleryContentPath, "utf8");

  for (const asset of approvedAssets) {
    assert.equal(existsSync(asset), true, `${asset} is missing`);
    assert.match(
      galleryContent,
      new RegExp(asset.split("public")[1].replace(".", "\\.")),
    );
  }
  assert.doesNotMatch(galleryContent, /\/images\/gallery\//);
});
