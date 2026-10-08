import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function filesBelow(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(root, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  });
}

function collectVisibleStrings(value, key = "") {
  if (typeof value === "string") {
    return ["slug", "href"].includes(key) ? [] : [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectVisibleStrings(item));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([childKey, child]) =>
      collectVisibleStrings(child, childKey),
    );
  }
  return [];
}

test("all localized public copy belongs to INFO-L@N and avoids unverified claims", () => {
  const localeFiles = ["fr", "en"].flatMap((locale) =>
    filesBelow(path.join("src", "messages", locale, "client")).filter((file) =>
      file.endsWith(".json"),
    ),
  );
  const visibleCopy = localeFiles.flatMap((file) =>
    collectVisibleStrings(JSON.parse(readFileSync(file, "utf8"))),
  );
  const combined = visibleCopy.join("\n");

  for (const legacy of [
    /Chelbab/i,
    /contact@chelbab\.com/i,
    /\+123\s*\(256\)/,
    /California 62639/i,
    /tuyauterie industrielle/i,
    /chaudronnerie/i,
    /convoyeur/i,
    /industrial piping/i,
    /boilermaking/i,
    /conveyor/i,
  ]) {
    assert.doesNotMatch(combined, legacy);
  }

  for (const unverified of [
    /ISO\s*9001/i,
    /ISO\s*3834/i,
    /24\s*\/\s*7/i,
    /dans tout le Maroc/i,
    /across Morocco/i,
    /128 avis/i,
    /128 reviews/i,
  ]) {
    assert.doesNotMatch(combined, unverified);
  }
});

test("public contact surfaces use verified phone and address without inventing email", () => {
  const contactPage = readFileSync(
    "src/app/(client)/[locale]/contact/page.tsx",
    "utf8",
  );
  const sideMenu = readFileSync(
    "src/components/client/shared/layout/side-menu.tsx",
    "utf8",
  );

  assert.doesNotMatch(contactPage, /mailto:/);
  assert.doesNotMatch(sideMenu, /mailto:/);
  assert.match(sideMenu, /tel:\+212522398484/);
  assert.match(sideMenu, /info-lan-logo\.webp/);
});

test("bundled public imagery is local and uses the approved INFO-L@N asset set", () => {
  const roots = [
    "src/app/(client)",
    "src/components/client",
    "src/lib/client",
    "src/server/public",
  ];
  const source = roots
    .flatMap(filesBelow)
    .filter((file) => /\.(?:ts|tsx|json)$/.test(file))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");

  assert.doesNotMatch(
    source,
    /https?:\/\/[^\s"'\x60]+\.(?:jpe?g|png|webp)(?:\?[^\s"'\x60]*)?/i,
  );

  for (const legacyAssetGroup of [
    /\/images\/gallery\//,
    /\/images\/blog\//,
    /\/images\/reviews\//,
    /\/images\/common\/HeroImage\.webp/,
    /\/images\/home\/home-(?:blog|challenge|hero|process|video)/,
    /\/images\/home\/technique-primary-texture\.webp/,
  ]) {
    assert.doesNotMatch(source, legacyAssetGroup);
  }
});
