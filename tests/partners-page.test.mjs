import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const pagePath = "src/app/(client)/[locale]/entreprise/partners/page.tsx";

test("legacy partners route presents verified INFO-L@N solution areas", () => {
  const source = readFileSync(pagePath, "utf8");
  const fr = JSON.parse(
    readFileSync("src/messages/fr/client/pages/partners.json", "utf8"),
  );
  const en = JSON.parse(
    readFileSync("src/messages/en/client/pages/partners.json", "utf8"),
  );

  assert.match(source, /SOLUTION_AREAS/);
  assert.match(source, /pages\.partners/);
  assert.doesNotMatch(source, /PARTNERS|partner-\$\{assetId\}|Mondelez|Lisi Aerospace/);
  assert.equal(fr.hero.title, "Nos solutions");
  assert.equal(en.hero.title, "Our solutions");
  assert.match(fr.hero.description, /INFO-L@N/);
  assert.match(en.hero.description, /INFO-L@N/);
});
