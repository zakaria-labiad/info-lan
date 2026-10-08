import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

import ts from "typescript";

function loadTypeScriptModule(file, { env = {}, stubs = {} } = {}) {
  const source = readFileSync(file, "utf8");
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
    process: { env },
    URL,
    require: (id) => {
      if (id in stubs) return stubs[id];
      throw new Error(`Unexpected module import: ${id}`);
    },
  };

  vm.runInNewContext(outputText, context);

  return context.module.exports;
}

test("metadata emits reciprocal locale alternates and blocks preview indexing", () => {
  const metadataModule = loadTypeScriptModule("src/lib/client/seo/metadata.ts", {
    env: { VERCEL_ENV: "preview" },
    stubs: {
      "next-intl/server": { getTranslations: async () => () => "" },
      "@/i18n/shared/config": {
        locales: ["en", "fr"],
      },
      "@/lib/shared/site": {
        getSiteUrl: () => new URL("https://example.com"),
      },
    },
  });
  const metadata = metadataModule.buildPageMetadata({
    locale: "en",
    pathname: "/contact",
    title: "Contact",
    description: "Contact INFO-L@N",
  });

  assert.equal(
    metadata.alternates.canonical,
    "https://example.com/en/contact",
  );
  assert.deepEqual(Object.keys(metadata.alternates.languages), ["en", "fr"]);
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, false);
});

test("robots blocks previews and advertises the production sitemap only in production", () => {
  const siteUrlStub = { getSiteUrl: () => new URL("https://example.com") };
  const preview = loadTypeScriptModule("src/app/robots.ts", {
    env: { VERCEL_ENV: "preview" },
    stubs: { "@/lib/shared/site": siteUrlStub },
  }).default();
  const production = loadTypeScriptModule("src/app/robots.ts", {
    env: { VERCEL_ENV: "production" },
    stubs: { "@/lib/shared/site": siteUrlStub },
  }).default();

  assert.equal(preview.rules.disallow, "/");
  assert.equal("sitemap" in preview, false);
  assert.deepEqual(Array.from(production.rules.disallow), ["/admin", "/api"]);
  assert.equal(production.sitemap, "https://example.com/sitemap.xml");
});
