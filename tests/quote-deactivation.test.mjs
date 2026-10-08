import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const activeQuotePage = "src/app/(client)/[locale]/quote/page.tsx";
const parkedQuotePage = "src/app/(client)/[locale]/_quote/page.tsx";

function collectSourceFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(entryPath);
    }

    return /\.(?:json|ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

test("quote page is preserved in a private folder and no longer routable", () => {
  assert.equal(existsSync(activeQuotePage), false);
  assert.equal(existsSync(parkedQuotePage), true);

  const parkedSource = readFileSync(parkedQuotePage, "utf8");

  assert.match(parkedSource, /getTranslations\("pages\.quote\.hero"\)/);
  assert.match(parkedSource, /<form/);
  assert.match(parkedSource, /t\("form\.submit"\)/);
});

test("live application CTAs no longer target the inactive quote route", () => {
  const offenders = collectSourceFiles("src")
    .filter((file) => !file.includes(`${path.sep}_quote${path.sep}`))
    .filter((file) => /["']\/quote["']/.test(readFileSync(file, "utf8")));

  assert.deepEqual(offenders, []);
});

test("former quote CTAs use localized contact labels", () => {
  const enHeader = JSON.parse(
    readFileSync("src/messages/en/client/header.json", "utf8"),
  );
  const frHeader = JSON.parse(
    readFileSync("src/messages/fr/client/header.json", "utf8"),
  );
  const enDomain = JSON.parse(
    readFileSync("src/messages/en/client/pages/domain-detail.json", "utf8"),
  );
  const frDomain = JSON.parse(
    readFileSync("src/messages/fr/client/pages/domain-detail.json", "utf8"),
  );
  const enProduct = JSON.parse(
    readFileSync("src/messages/en/client/pages/product-detail.json", "utf8"),
  );
  const frProduct = JSON.parse(
    readFileSync("src/messages/fr/client/pages/product-detail.json", "utf8"),
  );

  assert.equal(enHeader.quote, "Contact us");
  assert.equal(frHeader.quote, "Contactez-nous");
  assert.equal(enDomain.quote, "Contact us");
  assert.equal(frDomain.quote, "Contactez-nous");
  assert.equal(enProduct.requestQuote, "Contact us");
  assert.equal(frProduct.requestQuote, "Contactez-nous");
});
