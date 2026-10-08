import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

import ts from "typescript";

async function loadFilterExports() {
  const source = await readFile(
    "src/components/client/categories/category-product-filters.ts",
    "utf8",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const exports = {};
  const context = {
    exports,
    module: { exports },
  };

  vm.runInNewContext(outputText, context);
  return context.module.exports;
}

const products = [
  {
    id: "storage-tank",
    title: "Storage tank",
    description: "Large welded tank",
    availability: "active",
    isBestSeller: true,
  },
  {
    id: "metal-silo",
    title: "Metal silo",
    description: "Tall storage equipment",
    availability: "unavailable",
    isBestSeller: false,
  },
  {
    id: "belt-conveyor",
    title: "Belt conveyor",
    description: "Handling line",
    availability: "active",
    isBestSeller: false,
  },
];

test("filterCategoryProducts filters by debounced query, availability, and best seller", async () => {
  const { filterCategoryProducts } = await loadFilterExports();

  const filtered = filterCategoryProducts(products, {
    query: "tank",
    availability: "active",
    bestSellerOnly: true,
  });

  assert.deepEqual(
    filtered.map((product) => product.id),
    ["storage-tank"],
  );
});

test("filterCategoryProducts supports all availability option", async () => {
  const { filterCategoryProducts } = await loadFilterExports();

  const filtered = filterCategoryProducts(products, {
    query: "",
    availability: "all",
    bestSellerOnly: false,
  });

  assert.deepEqual(
    filtered.map((product) => product.id),
    ["storage-tank", "metal-silo", "belt-conveyor"],
  );
});

test("filterCategoryProducts excludes unavailable products when only active is selected", async () => {
  const { filterCategoryProducts } = await loadFilterExports();

  const filtered = filterCategoryProducts(products, {
    query: "",
    availability: "active",
    bestSellerOnly: false,
  });

  assert.deepEqual(
    filtered.map((product) => product.id),
    ["storage-tank", "belt-conveyor"],
  );
});

test("search debounce is 700ms", async () => {
  const { SEARCH_DEBOUNCE_MS } = await loadFilterExports();

  assert.equal(SEARCH_DEBOUNCE_MS, 700);
});
