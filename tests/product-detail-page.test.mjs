import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function read(path) {
  return readFileSync(path, "utf8");
}

function extractConstArrayItems(source, constName) {
  const match = source.match(
    new RegExp(`const ${constName} = \\[([\\s\\S]*?)\\] as const;`),
  );

  assert.notEqual(match, null, `${constName} should be declared`);

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith('"'))
    .map((line) => line.replace(/[",]/g, ""));
}

test("product detail page is a no-hero industrial PDP with zoomable gallery", () => {
  const page = read("src/app/(client)/[locale]/categories/[category]/[product]/page.tsx");
  const globals = read("src/app/globals.css");

  assert.doesNotMatch(page, /@\/components\/client\/shared\/hero/);
  assert.match(page, /productShow/);
  assert.match(page, /productDetails/);
  assert.match(page, /similarProducts/);
  assert.match(page, /ProductImageGallery/);
  assert.match(page, /ratingSummary/);
  assert.match(page, /PRODUCT_SHOW_DATA/);
  assert.match(page, /productShowData/);
  assert.match(page, /colorOptions/);
  assert.match(page, /sizeOptions/);
  assert.match(page, /configurationOptions/);
  assert.match(page, /serviceNotes/);
  assert.match(page, /productShowData\.colors/);
  assert.match(page, /productShowData\.sizes/);
  assert.match(page, /productShowData\.extraOptions/);
  assert.match(page, /productShowData\.services/);
  assert.match(page, /technicalSpecifications/);
  assert.match(page, /requestQuote/);
  assert.match(page, /contactExpert/);
  assert.match(page, /@\/components\/client\/categories\/product-card/);
  assert.match(page, /@\/components\/client\/categories\/product-detail-tabs/);
  assert.match(page, /@\/components\/client\/home\/shared\/scroll-rail/);
  assert.match(page, /<ScrollRail[\s\S]+title=\{t\("similarProducts\.title"\)\}/);
  assert.match(page, /scrollStep=\{3\}/);
  assert.match(
    page,
    /itemClassName="product-suggestion-rail-card"/,
  );
  assert.match(globals, /flex-basis: calc\(\(100% - 2\.5rem\) \/ 3\)/);
  assert.match(page, /<ProductCard[\s\S]+actionLabel=\{t\("similarProducts\.actionLabel"\)\}/);
  assert.match(page, /data-product-section="similarProducts"/);
  assert.doesNotMatch(page, /data-app-reveal/);

  assert.equal(extractConstArrayItems(page, "SIMILAR_PRODUCT_IDS").length, 12);
});

test("product show area renders optional product data from the active product", () => {
  const page = read("src/app/(client)/[locale]/categories/[category]/[product]/page.tsx");

  assert.match(page, /const PRODUCT_SHOW_DATA/);
  assert.match(page, /const PRODUCT_CONTENT_DATA/);
  assert.match(page, /const productContent = PRODUCT_CONTENT_DATA\[product\] \?\? PRODUCT_CONTENT_DATA\.default/);
  assert.match(page, /productContent\.showDescription/);
  assert.match(page, /productContent\.detailsDescription/);
  assert.match(page, /productContent\.technicalSpecifications/);
  assert.match(page, /productContent\.similarProductIds/);
  assert.match(page, /const PRODUCT_IMAGE_BY_ID/);
  assert.match(page, /const primaryProductImage = databaseProduct\?\.images\[0\]\?\.src \?\? PRODUCT_IMAGE_BY_ID\[product\] \?\? PRODUCT_IMAGES\[0\]/);
  assert.match(page, /const similarImage = PRODUCT_IMAGE_BY_ID\[id\]/);
  assert.match(page, /src: index === 0 \? primaryProductImage : PRODUCT_IMAGES/);
  assert.match(page, /"storage-tank":/);
  assert.match(page, /"belt-conveyor":/);
  assert.match(page, /"guardrail":/);
  assert.match(page, /colors: \[/);
  assert.match(page, /sizes: \[/);
  assert.match(page, /extraOptions: \[/);
  assert.match(page, /const productShowData = PRODUCT_SHOW_DATA\[product\] \?\? PRODUCT_SHOW_DATA\.default/);
  assert.match(page, /\{productShowData\.colors \? \(/);
  assert.match(page, /\{productShowData\.sizes \? \(/);
  assert.match(page, /\{productShowData\.extraOptions \? \(/);
  assert.match(page, /\{productShowData\.services\.length > 0 && \(/);
  assert.doesNotMatch(page, /active\?: boolean/);
  assert.doesNotMatch(page, /active: true/);
  assert.doesNotMatch(page, /option\.active/);
  assert.doesNotMatch(page, /ring-2 ring-primary ring-offset-2/);
  assert.doesNotMatch(
    page,
    /rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-white/,
  );
  assert.doesNotMatch(page, /const materialOptions = \[/);
});

test("product detail sections stack cleanly before two-column desktop layouts", () => {
  const page = read("src/app/(client)/[locale]/categories/[category]/[product]/page.tsx");
  const tabs = read("src/components/client/categories/product-detail-tabs.tsx");

  assert.match(page, /className="grid gap-8 lg:grid-cols-2 lg:items-start"/);
  assert.match(
    tabs,
    /className="[^"]*lg:grid-cols-2[^"]*"[\s\S]+data-product-section="productDetails"/,
  );
  assert.doesNotMatch(tabs, /className="flex gap-8" data-product-section="productDetails"/);
});

test("product detail second section image has fixed responsive dimensions", () => {
  const tabs = read("src/components/client/categories/product-detail-tabs.tsx");

  assert.match(tabs, /h-\[420px\]/);
  assert.match(tabs, /w-full/);
  assert.match(tabs, /lg:h-\[520px\]/);
  assert.match(tabs, /lg:w-\[520px\]/);
  assert.match(tabs, /lg:justify-self-end/);
  assert.doesNotMatch(tabs, /min-h-96/);
});

test("product detail tabs are a client nav that switches views", () => {
  const page = read("src/app/(client)/[locale]/categories/[category]/[product]/page.tsx");
  const tabs = read("src/components/client/categories/product-detail-tabs.tsx");

  assert.match(page, /<ProductDetailTabs[\s\S]+tabs=\{detailTabs\}[\s\S]+image=\{/);
  assert.match(tabs, /"use client"/);
  assert.match(tabs, /useState/);
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /aria-selected=\{activeTab\.id === tab\.id\}/);
  assert.match(tabs, /role="tabpanel"/);
  assert.match(tabs, /onClick=\{\(\) => setActiveTabId\(tab\.id\)\}/);
  assert.match(page, /id: "details"/);
  assert.match(page, /id: "materials"/);
  assert.match(page, /id: "dimensions"/);
  assert.match(page, /id: "quote"/);
  assert.match(page, /id: "process"/);
});

test("product gallery supports Amazon-style thumbnails and hover zoom inspection", () => {
  const gallery = read(
    "src/components/client/categories/product-image-gallery.tsx",
  );

  assert.match(gallery, /"use client"/);
  assert.match(gallery, /onMouseMove/);
  assert.match(gallery, /backgroundPosition/);
  assert.match(gallery, /selectedImage/);
  assert.match(gallery, /aria-label=\{image\.label\}/);
  assert.match(gallery, /max-w-\[45vw\]/);
  assert.match(gallery, /max-w-full/);
  assert.match(gallery, /overflow-x-auto/);
  assert.match(gallery, /gap-x-2/);
  assert.match(gallery, /flex-nowrap/);
  assert.match(gallery, /bg-white\/40/);
  assert.doesNotMatch(gallery, /flex-wrap/);
  assert.doesNotMatch(gallery, /lg:grid-cols-\[88px_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(gallery, /lg:flex-col/);
  assert.doesNotMatch(gallery, /object-fill/);
});

test("category product detail route keeps the approved white INFO-L@N header", () => {
  const header = read("src/components/client/shared/layout/header.tsx");
  const languageSwitcher = read("src/components/client/shared/language-switcher.tsx");

  assert.match(header, /isProductDetailPage/);
  assert.match(header, /productDetailHeaderBackground = "bg-white"/);
  assert.match(header, /initialHeaderTextClass/);
  assert.match(header, /text-primary/);
  assert.match(header, /headerLogoSrc/);
  assert.match(header, /headerLogoSrc = "\/images\/info-lan-logo\.webp"/);
  assert.match(header, /src=\{headerLogoSrc\}/);
  assert.match(header, /<LanguageSwitcher color=\{headerControlColor\} \/>/);
  assert.match(languageSwitcher, /color\?: "white" \| "primary"/);
  assert.match(languageSwitcher, /primary: "text-primary"/);
});
