import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function collectPages(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name.startsWith("_") ? [] : collectPages(entryPath);
    }

    return entry.name === "page.tsx" ? [entryPath] : [];
  });
}

test("every public page declares metadata", () => {
  const pages = collectPages("src/app/(client)/[locale]");

  assert.ok(pages.length > 0);
  for (const page of pages) {
    const source = readFileSync(page, "utf8");
    assert.match(
      source,
      /export (?:async function generateMetadata|const generateMetadata|const metadata)/,
      `${page} has no metadata export`,
    );
  }
});

test("shared metadata includes canonical, language alternates, social cards, and robots", () => {
  const source = readFileSync("src/lib/client/seo/metadata.ts", "utf8");

  for (const token of [
    "canonical",
    "languages",
    "openGraph",
    "twitter",
    "robots",
  ]) {
    assert.equal(source.includes(token), true, `missing ${token}`);
  }
  assert.doesNotMatch(source, /x-default/);
});

test("dynamic metadata does not emit indexable empty fallbacks", () => {
  const dynamicPages = collectPages("src/app/(client)/[locale]").filter((page) =>
    page.includes("["),
  );

  for (const page of dynamicPages) {
    const source = readFileSync(page, "utf8");
    assert.doesNotMatch(source, /return\s+\{\s*\};/);
  }
});
