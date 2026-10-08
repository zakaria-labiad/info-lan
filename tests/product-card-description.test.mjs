import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

import ts from "typescript";

async function loadProductCardExports() {
  const source = await readFile(
    "src/components/client/categories/product-card.tsx",
    "utf8",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const exports = {};
  const context = {
    exports,
    module: { exports },
    require: (id) => {
      if (id === "next/link") {
        return { __esModule: true, default: "Link" };
      }
      if (id === "@/i18n/client/navigation") {
        return { Link: "Link" };
      }
      if (id === "next/image") {
        return { __esModule: true, default: "Image" };
      }
      if (id === "lucide-react") {
        return {
          ArrowUpRight: "ArrowUpRight",
        };
      }
      if (id === "@/components/client/shared/button") {
        return {
          Button: "Button",
        };
      }
      if (id === "@/components/client/ui/badge") {
        return {
          Badge: "Badge",
        };
      }
      if (id === "@/lib/shared/utils") {
        return {
          cn: (...classes) => classes.flat().filter(Boolean).join(" "),
        };
      }
      if (id === "react/jsx-runtime") {
        return {
          jsx: () => null,
          jsxs: () => null,
        };
      }
      throw new Error(`Unexpected module import: ${id}`);
    },
  };

  vm.runInNewContext(outputText, context);
  return context.module.exports;
}

test("truncateProductDescription limits long copy without splitting words", async () => {
  const { truncateProductDescription } = await loadProductCardExports();
  const description =
    "Fabricated industrial storage tanks designed for demanding production environments and easy on-site maintenance.";

  assert.equal(typeof truncateProductDescription, "function");
  assert.equal(
    truncateProductDescription(description, 64),
    "Fabricated industrial storage tanks designed for demanding...",
  );
});

test("truncateProductDescription leaves short copy unchanged", async () => {
  const { truncateProductDescription } = await loadProductCardExports();

  assert.equal(
    truncateProductDescription("Compact welded assembly.", 64),
    "Compact welded assembly.",
  );
});
