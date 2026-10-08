import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const pagePath = "src/app/(client)/[locale]/domains/[domain]/page.tsx";
const sectionsPath = "src/components/client/domains/domain-detail-sections.tsx";
const frMessagesPath = "src/messages/fr/client/pages/domain-detail.json";
const enMessagesPath = "src/messages/en/client/pages/domain-detail.json";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("domain detail page renders repeated source-content sections through dedicated components", () => {
  assert.equal(existsSync(sectionsPath), true, "domain detail sections component is missing");

  const page = readFileSync(pagePath, "utf8");
  const sections = readFileSync(sectionsPath, "utf8");

  assert.match(page, /DomainDetailIntroSection/);
  assert.match(page, /DomainDetailContentSection/);
  assert.match(page, /content\.detailSections\.map/);
  assert.match(page, /reversed=\{index % 2 === 0\}/);
  assert.match(sections, /function DomainDetailIntroSection/);
  assert.match(sections, /function DomainDetailContentSection/);
  assert.match(sections, /lg:grid-cols-\[minmax\(330px,0\.82fr\)_minmax\(0,1fr\)\]/);
  assert.match(sections, /reversed\s+\?\s+"lg:grid-cols-\[minmax\(0,1fr\)_minmax\(330px,0\.82fr\)\]"/);
  assert.match(sections, /reversed && "lg:order-2"/);
  assert.match(sections, /hasMedia && reversed && "lg:order-1"/);
  assert.match(sections, /section\.action \? \(/);
  assert.match(sections, /<Button href=\{section\.action\.href\}>/);
  assert.match(
    sections,
    /const domainDetailImageFrameClass =\s+"relative h-120 w-full overflow-hidden rounded-md"/,
  );
  assert.match(sections, /className=\{domainDetailImageFrameClass\}/);
});

test("domain detail page keeps the original base structure around added source sections", () => {
  const page = readFileSync(pagePath, "utf8");

  assert.match(page, /content\.capabilities\.map/);
  assert.match(page, /content\.process\.map/);
  assert.match(page, /content\.relatedProducts\.map/);
  assert.match(page, /content\.relatedPosts\.map/);
  assert.match(page, /content\.faqs\.map/);
  assert.match(page, /<ScrollRail title=\{t\("sections\.products"\)\}>/);
  assert.match(page, /<ArticleGridSection title=\{t\("sections\.blog"\)\}>/);
  assert.match(page, /<Accordion[\s\S]*?defaultValue=\{\["item-0"\]\}[\s\S]*?keepMounted[\s\S]*?className="grid gap-4"/);
});

test("French domain detail messages expose INFO-L@N services with polished copy", () => {
  const fr = readJson(frMessagesPath);
  const domains = fr.domains;

  assert.equal(
    domains.industrialPiping.heroDescription,
    "Choisir les ordinateurs, périphériques et consommables adaptés aux usages professionnels.",
  );
  assert.equal(domains.industrialPiping.detailSections[0].title, "Accompagnement");
  assert.match(
    domains.industrialPiping.detailSections[0].paragraphs.join(" "),
    /INFO-L@N relie le choix, la mise en service et la maintenance/,
  );
  assert.equal(
    domains.industrialPiping.detailSections[0].action.label,
    "Contactez-nous",
  );
  assert.deepEqual(domains.industrialPiping.detailSections[1].groups[0].items, [
    "Ordinateurs",
    "Périphériques",
    "Réseau",
    "Stockage",
  ]);
  assert.deepEqual(domains.industrialPiping.detailSections[1].groups[1].items, [
    "Bureautique",
    "Collaboration",
    "Sauvegarde",
    "Impression",
  ]);

  assert.equal(domains.boilermaking.detailSections[1].title, "Conseil pratique");
  assert.equal(domains.conveyors.detailSections.length, 5);
  assert.deepEqual(
    domains.conveyors.detailSections.map((section) => section.title),
    ["Accompagnement", "Conseil pratique", "Continuité", "Accompagnement", "Conseil pratique"],
  );
  assert.equal(domains.loadingDocks.detailSections[0].groups[0].items[0], "Ordinateurs");
  for (const domain of Object.values(domains)) {
    for (const section of domain.detailSections) {
      assert.equal(
        section.images?.length,
        1,
        `${domain.title} / ${section.title} should show exactly one image`,
      );
    }
  }

  assert.equal(domains.shelving.detailSections[0].images.length, 1);
  assert.equal(domains.workshopDisplay.detailSections[1].title, "Conseil pratique");
});

test("English domain detail messages keep the same structured section contract", () => {
  const fr = readJson(frMessagesPath);
  const en = readJson(enMessagesPath);

  for (const key of Object.keys(fr.domains)) {
    assert.equal(
      en.domains[key].detailSections.length,
      fr.domains[key].detailSections.length,
      `${key} should keep the same section count in English`,
    );
  }

  assert.equal(en.domains.conveyors.detailSections[0].title, "Support");
  assert.equal(en.domains.workshopDisplay.detailSections[0].title, "Support");
});

test("domain detail messages provide CTA actions and semantic card icons", () => {
  const fr = readJson(frMessagesPath);
  const en = readJson(enMessagesPath);

  for (const messages of [fr, en]) {
    for (const domain of Object.values(messages.domains)) {
      for (const capability of domain.capabilities) {
        assert.equal(typeof capability.icon, "string");
      }

      for (const product of domain.relatedProducts) {
        assert.equal(typeof product.icon, "string");
      }

      for (const section of domain.detailSections) {
        assert.equal(typeof section.action?.label, "string");
        assert.ok(section.action.href.startsWith("/"));
        assert.equal(section.images?.length, 1);
        assert.equal(typeof section.images[0].alt, "string");
      }
    }
  }
});
