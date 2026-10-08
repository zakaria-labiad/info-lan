import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const readJson = (path) => JSON.parse(read(path));

test("the public brand foundation uses the approved INFO-L@N identity", () => {
  const layout = read("src/app/layout.tsx");
  const manifest = read("src/app/manifest.ts");
  const metadata = read("src/lib/client/seo/metadata.ts");
  const styles = read("src/app/globals.css");

  for (const source of [layout, manifest, metadata]) {
    assert.match(source, /INFO-L@N/);
    assert.doesNotMatch(source, /Chelbab/i);
  }

  assert.match(styles, /--primary:\s*#006bb6/i);
  assert.match(styles, /--primary-dark:\s*#004a80/i);
  assert.match(styles, /--primary-extra-light:\s*#eaf4fb/i);
  assert.match(styles, /--white:\s*#ffffff/i);
  assert.match(styles, /--foreground:\s*#102033/i);
  assert.match(styles, /--accent:\s*#e30613/i);
  assert.match(styles, /--primary-20:\s*rgba\(0,\s*107,\s*182,\s*0\.20\)/i);
});

test("generated identity, structured data, and visible application chrome are rebranded", () => {
  const sources = [
    "src/app/icon.tsx",
    "src/app/opengraph-image.tsx",
    "src/app/(client)/[locale]/layout.tsx",
    "src/components/client/shared/layout/header.tsx",
    "src/components/client/shared/layout/footer.tsx",
    "src/components/client/shared/layout/side-menu.tsx",
    "src/components/admin/auth/login-form.tsx",
    "src/components/admin/layout/app-sidebar.tsx",
    "src/components/admin/shared/admin-header.tsx",
    "src/app/(admin)/admin/(protected)/dashboard/page.tsx",
  ].map(read);

  for (const source of sources) {
    assert.doesNotMatch(source, /Chelbab/i);
  }

  assert.match(sources.join("\n"), /INFO-L@N/);
  assert.match(read("src/app/icon.tsx"), /#006BB6/);
  assert.match(read("src/app/opengraph-image.tsx"), /#004A80/);
});

test("the bilingual home and footer use approved verified content", () => {
  const frHome = readJson("src/messages/fr/client/pages/home.json");
  const enHome = readJson("src/messages/en/client/pages/home.json");
  const frFooter = readJson("src/messages/fr/client/footer.json");
  const enFooter = readJson("src/messages/en/client/footer.json");

  assert.equal(frHome.hero.title, "Votre informatique, équipée, installée et maintenue.");
  assert.equal(enHome.hero.title, "Your IT, supplied, installed and maintained.");
  assert.match(frHome.hero.supportingText, /Depuis 2005/);
  assert.match(enHome.hero.supportingText, /Since 2005/);
  assert.equal(frFooter.address.phone, "05 22 39 84 84");
  assert.equal(enFooter.address.phone, "05 22 39 84 84");
  assert.match(frFooter.address.lineOne, /20 rue Banafsaj/);
  assert.match(enFooter.address.lineOne, /20 rue Banafsaj/);
  assert.equal(frFooter.copyright.owner, "INFO-L@N");
  assert.equal(enFooter.copyright.owner, "INFO-L@N");
});

test("INFO-L@N visual assets are local, optimized, and attributed", () => {
  const requiredAssets = [
    "public/images/info-lan-logo.webp",
    "public/images/home/info-lan-hero.webp",
    "public/images/home/info-lan-equipment.webp",
    "public/images/home/info-lan-installation.webp",
    "public/images/home/info-lan-maintenance.webp",
    "public/images/about/info-lan-team.webp",
    "public/images/INFO-LAN-ASSET-SOURCES.md",
  ];

  for (const path of requiredAssets) {
    assert.equal(existsSync(path), true, path + " is missing");
  }

  const sources = read("public/images/INFO-LAN-ASSET-SOURCES.md");
  assert.match(sources, /pexels\.com\/photo\/it-technician-working-in-data-center-server-room-37605911/);
  assert.match(sources, /Photographer/i);
  assert.match(sources, /Pexels License/i);
  assert.match(sources, /2026-10-08/);
});

test("the home page uses only the approved IT imagery and verified badge facts", () => {
  const files = [
    "src/components/client/home/sections/home-intro-section.tsx",
    "src/components/client/home/sections/video-section.tsx",
    "src/components/client/home/sections/challenge-section.tsx",
    "src/components/client/home/sections/technique-section.tsx",
    "src/components/client/home/data.ts",
  ];
  const source = files.map(read).join("\n");
  const frHome = readJson("src/messages/fr/client/pages/home.json");
  const enHome = readJson("src/messages/en/client/pages/home.json");

  for (const legacyAsset of [
    "home-video-meeting.webp",
    "home-challenge.webp",
    "technique-primary-texture.webp",
    "home-hero-planning.webp",
  ]) {
    assert.doesNotMatch(source, new RegExp(legacyAsset.replace(".", "\\.")));
  }

  assert.doesNotMatch(source, /48h/i);
  assert.equal(frHome.challenge.badgeValue, "2005");
  assert.equal(enHome.challenge.badgeValue, "2005");
  assert.match(source, /info-lan-(equipment|installation|maintenance)\.webp/);
  assert.match(source, /info-lan-team\.webp/);
});

test("the About page exposes only the three verified reference points", () => {
  const aboutData = read("src/components/client/about/data.ts");
  const frAbout = readJson("src/messages/fr/client/pages/about.json");
  const enAbout = readJson("src/messages/en/client/pages/about.json");

  assert.doesNotMatch(aboutData, /7\+|100%|48h/);
  assert.match(aboutData, /value: "2005"/);
  assert.match(aboutData, /value: "Casablanca"/);
  assert.match(aboutData, /value: "3"/);
  assert.deepEqual(Object.keys(frAbout.achievements.items), [
    "experience",
    "sectors",
    "quality",
  ]);
  assert.deepEqual(
    Object.keys(enAbout.achievements.items),
    Object.keys(frAbout.achievements.items),
  );
});
