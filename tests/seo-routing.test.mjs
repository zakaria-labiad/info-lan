import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("public pages live under a required locale segment", () => {
  assert.equal(existsSync("src/app/(client)/[locale]/page.tsx"), true);
  assert.equal(existsSync("src/app/(client)/[locale]/contact/page.tsx"), true);
  assert.equal(existsSync("src/app/(client)/[locale]/categories/[category]/page.tsx"), true);
  assert.equal(existsSync("src/app/(client)/[locale]/domains/[domain]/page.tsx"), true);
  assert.equal(existsSync("src/app/(client)/page.tsx"), false);
});

test("next-intl routing always prefixes locales with deterministic French fallback", () => {
  const navigation = read("src/i18n/client/navigation.ts");

  assert.match(navigation, /localePrefix:\s*["']always["']/);
  assert.match(navigation, /localeDetection:\s*false/);
  assert.match(navigation, /localeCookie:\s*false/);
  assert.match(navigation, /alternateLinks:\s*false/);
});

test("proxy localizes public routes without intercepting private or framework paths", () => {
  const proxy = read("src/proxy.ts");

  assert.match(proxy, /createMiddleware\(routing\)/);
  for (const excluded of [
    "api",
    "admin",
    "_next",
    "_vercel",
    "robots\\\\.txt",
    "sitemap\\\\.xml",
  ]) {
    assert.equal(proxy.includes(excluded), true);
  }
});

test("language switching changes the locale in the current pathname", () => {
  const switcher = read("src/components/client/shared/language-switcher.tsx");

  assert.match(switcher, /usePathname\(\)/);
  assert.match(switcher, /useRouter\(\)/);
  assert.match(switcher, /useSearchParams\(\)/);
  assert.match(switcher, /router\.replace\(href,\s*\{\s*locale\s*\}\)/);
  assert.match(switcher, /INFO_LAN_LOCALE_STORAGE_KEY/);
  assert.match(switcher, /localStorage\.setItem/);
  assert.match(switcher, /resolvePreferredLocale/);
  assert.doesNotMatch(switcher, /fetch\(["']\/api\/locale/);
  assert.doesNotMatch(switcher, /window\.location\.reload/);
});

test("public link components use locale-aware navigation", () => {
  const publicLinkFiles = [
    "src/components/client/shared/button.tsx",
    "src/components/client/shared/card.tsx",
    "src/components/client/shared/layout/header.tsx",
    "src/components/client/shared/layout/footer.tsx",
    "src/components/client/shared/layout/side-menu.tsx",
    "src/components/client/blog/blog-card.tsx",
    "src/components/client/categories/product-card.tsx",
  ];

  for (const file of publicLinkFiles) {
    const source = read(file);
    assert.match(source, /import \{ Link \} from ["']@\/i18n\/client\/navigation["']/);
    assert.doesNotMatch(source, /from ["']next\/link["']/);
  }
});

test("CMS routes accept database slugs while registry-only domains remain closed", () => {
  const cmsPages = [
    "src/app/(client)/[locale]/categories/[category]/page.tsx",
    "src/app/(client)/[locale]/categories/[category]/[product]/page.tsx",
    "src/app/(client)/[locale]/resources/blog/[id]/page.tsx",
  ];

  for (const file of cmsPages) {
    const source = read(file);
    assert.match(source, /export const dynamicParams = true/);
    assert.match(source, /database|Published/);
    assert.match(source, /notFound\(\)/);
  }

  assert.match(read("src/app/(client)/[locale]/domains/[domain]/page.tsx"), /export const dynamicParams = false/);
});

test("legacy localized catalogue URLs use permanent route redirects", () => {
  const config = read("next.config.ts");

  assert.match(config, /\/fr\/resources\/catalogue/);
  assert.match(config, /\/en\/resources\/catalogue/);
  assert.match(config, /permanent:\s*true/);
});

test("the global error boundary derives locale from the localized URL", () => {
  const globalError = read("src/app/global-error.tsx");

  assert.match(globalError, /window\.location\.pathname/);
  assert.doesNotMatch(globalError, /fetch\(["']\/api\/locale/);
});
