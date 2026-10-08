import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

function read(path) {
  return readFileSync(path, "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("domain detail page exposes the expected industrial service sections", () => {
  const page = read("src/app/(client)/[locale]/domains/[domain]/page.tsx");

  assert.match(page, /params: Promise<DomainDetailRouteParams>/);
  assert.match(page, /@\/components\/client\/shared\/hero/);
  assert.match(page, /getDomainRoute/);
  assert.match(page, /domainSlugs/);
  assert.match(page, /DomainDetailIntroSection/);
  assert.match(page, /DomainDetailContentSection/);
  assert.match(page, /detailSections: DomainDetailSectionData\[\]/);
  assert.match(page, /content\.detailSections\.map/);
  assert.match(page, /relatedProducts/);
  assert.match(page, /relatedPosts/);
  assert.match(page, /faqs/);
  assert.match(page, /\/contact/);
  assert.match(page, /post=\{previewPost\}/);
  assert.match(page, /href=\{product\.href\}/);
  assert.match(page, /notFound\(\)/);
  assert.doesNotMatch(page, /pages\.domainCategory/);
  assert.doesNotMatch(page, /text-\[/);
});

test("domain detail localization includes accurate content for every domain", () => {
  const frMessages = readJson("src/messages/fr/client/pages/domain-detail.json");
  const enMessages = readJson("src/messages/en/client/pages/domain-detail.json");

  for (const messages of [frMessages, enMessages]) {
    assert.equal(typeof messages.sections.overview, "string");
    assert.equal(typeof messages.sections.products, "string");
    assert.equal(typeof messages.sections.blog, "string");
    assert.equal(typeof messages.sections.faq, "string");
    assert.equal(typeof messages.contactCta.href, "string");
    assert.ok(messages.contactCta.href.endsWith("/contact"));
    assert.equal(Object.keys(messages.domains).length, 6);

    for (const domain of Object.values(messages.domains)) {
      assert.equal(typeof domain.title, "string");
      assert.equal(typeof domain.heroDescription, "string");
      assert.ok(domain.capabilities.length >= 3);
      assert.ok(domain.process.length >= 3);
      assert.ok(domain.relatedProducts.length >= 3);
      assert.equal(domain.relatedPosts.length, 4);
      assert.equal(domain.faqs.length, 4);

      for (const product of domain.relatedProducts) {
        assert.ok(product.href.startsWith("/categories/"));
      }

      for (const post of domain.relatedPosts) {
        assert.ok(post.href.startsWith("/resources/blog/"));
      }
    }
  }
});

test("header domain menu links to every implemented domain detail route", () => {
  const header = read("src/components/client/shared/layout/header.tsx");
  const frHeader = readJson("src/messages/fr/client/header.json");
  const enHeader = readJson("src/messages/en/client/header.json");
  const expectedDomains = [
    ["industrialPiping", "/domains/tuyauterie-industrielle"],
    ["industrialBoilermaking", "/domains/chaudronnerie-industrielle"],
    ["conveyors", "/domains/convoyeurs"],
    ["loadingDocks", "/domains/quais-de-chargement"],
    ["shelving", "/domains/rayonnage"],
    ["workshopDisplay", "/domains/affichage-atelier"],
  ];

  for (const [key, href] of expectedDomains) {
    assert.match(
      header,
      new RegExp(`key:\\s*"${key}"[\\s\\S]*?href:\\s*"${escapeRegExp(href)}"`),
    );
    assert.equal(typeof frHeader.nav.domains.items[key], "string");
    assert.equal(typeof enHeader.nav.domains.items[key], "string");
  }

  assert.doesNotMatch(header, /\/domains\/industrial-boilermaking/);
  assert.doesNotMatch(header, /\/domains\/conveyors/);
  assert.doesNotMatch(header, /\/domains\/loading-docks/);
  assert.doesNotMatch(header, /\/domains\/shelving/);
  assert.doesNotMatch(header, /\/domains\/workshop-display/);
});

test("domain detail page keeps base primitives and adds source-content sections", () => {
  const page = read("src/app/(client)/[locale]/domains/[domain]/page.tsx");
  const sections = read("src/components/client/domains/domain-detail-sections.tsx");
  const homeBlogSection = read("src/components/client/home/sections/blog-section.tsx");
  const articleGrid = read("src/components/client/home/sections/article-grid-section.tsx");

  assert.match(page, /@\/components\/client\/shared\/card/);
  assert.match(page, /@\/components\/client\/domains\/domain-blog-preview-card/);
  assert.match(page, /@\/components\/client\/shared\/section-heading/);
  assert.match(page, /@\/components\/client\/home\/shared\/scroll-rail/);
  assert.match(page, /@\/components\/client\/domains\/domain-detail-sections/);
  assert.match(sections, /@\/components\/client\/shared\/section-heading/);
  assert.match(sections, /@\/components\/client\/shared\/button/);
  assert.match(
    sections,
    /container-page grid items-center gap-8 lg:grid-cols-\[minmax\(330px,0\.82fr\)_minmax\(0,1fr\)\] lg:gap-10/,
  );
  assert.match(sections, /function DomainDetailImageGrid/);
  assert.match(sections, /function DomainDetailGroups/);
  assert.match(sections, /<SectionHeading title=\{section\.title\}/);
  assert.match(sections, /<Button href=\{section\.action\.href\}>/);
  assert.match(sections, /<Button href="\/contact">/);
  assert.match(page, /<SectionHeading title=\{t\("sections\.overview"\)\}/);
  assert.match(page, /<ScrollRail title=\{t\("sections\.products"\)\}/);
  assert.match(page, /<ArticleGridSection title=\{t\("sections\.blog"\)\}>/);
  assert.match(homeBlogSection, /<ArticleGridSection title=\{t\("title"\)\}>/);
  assert.match(articleGrid, /cn\(homeContainer, "space-y-10 lg:space-y-15"\)/);
  assert.match(articleGrid, /<SectionHeading title=\{title\} centered \/>/);
  assert.match(articleGrid, /grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 lg:gap-y-10 gap-x-4 lg:gap-x-5/);
  assert.match(page, /<Card[\s\S]+actionLabel=\{t\("productAction"\)\}/);
  assert.match(page, /<DomainBlogPreviewCard[\s\S]+actionLabel=\{t\("blogAction"\)\}/);
});

test("domain detail overview and product cards use content-specific icons", () => {
  const page = read("src/app/(client)/[locale]/domains/[domain]/page.tsx");

  assert.match(page, /const CARD_ICONS/);
  assert.match(page, /type DomainCardIconKey = keyof typeof CARD_ICONS/);
  assert.match(page, /const CapabilityIcon = CARD_ICONS\[capability\.icon\]/);
  assert.match(page, /const ProductIcon = CARD_ICONS\[product\.icon\]/);
  assert.match(page, /icon=\{ProductIcon\}/);
});

test("domain detail FAQ keeps the base animated accordion", () => {
  const page = read("src/app/(client)/[locale]/domains/[domain]/page.tsx");
  const sections = read("src/components/client/domains/domain-detail-sections.tsx");

  assert.match(sections, /<DomainDetailParagraphs paragraphs=\{section\.paragraphs\}/);
  assert.match(sections, /<DomainDetailGroups groups=\{section\.groups\}/);
  assert.match(sections, /<DomainDetailImageGrid images=\{section\.images\}/);
  assert.match(page, /@\/components\/client\/ui\/accordion/);
  assert.match(page, /<Accordion[\s\S]*?defaultValue=\{\["item-0"\]\}[\s\S]*?keepMounted[\s\S]*?className="grid gap-4"/);
  assert.match(page, /<AccordionItem[\s\S]+value=\{`item-\$\{index\}`\}/);
  assert.match(page, /<AccordionTrigger/);
  assert.match(page, /<AccordionContent/);
  assert.doesNotMatch(page, /<details/);
  assert.doesNotMatch(page, /<summary/);
});

test("domain blog preview card is a local copy of the home preview pattern", () => {
  const card = read("src/components/client/domains/domain-blog-preview-card.tsx");

  assert.match(card, /"use client"/);
  assert.match(card, /next\/image/);
  assert.match(card, /href=\{post\.href\}/);
  assert.match(card, /ArrowUpRight, CalendarDays/);
  assert.match(card, /aspect-200\/156/);
  assert.match(card, /data-home-reveal-child/);
  assert.match(card, /rounded-md shadow-sm border/);
  assert.match(card, /group-hover:rotate-45/);
});
