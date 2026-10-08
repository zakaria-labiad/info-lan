import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

import ts from "typescript";

function loadCatalogRoutes() {
  const source = readFileSync("src/lib/client/routes/catalog.ts", "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const exports = {};
  const context = { exports, module: { exports } };

  vm.runInNewContext(outputText, context);

  return context.module.exports;
}

test("every product-detail recommendation resolves through the catalog registry", () => {
  const { getProductCategory } = loadCatalogRoutes();
  const page = readFileSync(
    "src/app/(client)/[locale]/categories/[category]/[product]/page.tsx",
    "utf8",
  );
  const ids = page
    .match(/const SIMILAR_PRODUCT_IDS = \[([\s\S]*?)\]/)?.[1]
    ?.match(/"[^"]+"/g)
    ?.map((value) => value.slice(1, -1)) ?? [];

  assert.ok(ids.length > 0);
  for (const id of ids) {
    assert.equal(
      typeof getProductCategory(id),
      "string",
      `${id} has no registered category`,
    );
  }
});

test("every domain category link resolves to a registered product relationship", () => {
  const { hasCatalogProduct } = loadCatalogRoutes();

  for (const locale of ["en", "fr"]) {
    const messages = JSON.parse(
      readFileSync(
        `src/messages/${locale}/client/pages/domain-detail.json`,
        "utf8",
      ),
    );
    const hrefs = JSON.stringify(messages).match(/\/categories\/[^"\\]+/g) ?? [];

    assert.ok(hrefs.length > 0);
    for (const href of hrefs) {
      const [, , category, product] = href.split("/");
      assert.equal(
        hasCatalogProduct(category, product),
        true,
        `${locale}: ${href} is not registered`,
      );
    }
  }
});
