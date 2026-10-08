# Module Boundaries and Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Standardize internal imports and public exports, then implement complete locale-aware metadata, crawl discovery, and factual structured data for every real Chelbab page.

**Architecture:** Internal source imports use the existing `@/*` alias, while explicit `index.ts` files define stable public APIs at reusable module boundaries. Public content moves behind stable `/fr` and `/en` URL prefixes so one shared metadata builder can emit truthful canonicals, reciprocal language alternates, Open Graph/Twitter data, robots directives, sitemap entries, and safely serialized JSON-LD. Next.js convention files keep the default exports the framework requires; ordinary reusable components use named exports.

**Tech Stack:** Next.js 16.3.4 App Router, React 19.2.8, TypeScript 5, next-intl 4.14.2, ESLint 9, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-02-step-4-seo-accessibility-design.md`, extended by the owner's 2026-10-04 requirements for `@/` imports, appropriate `index.ts` barrels, content-based export style, and metadata on every page.

## Global Constraints

- Preserve every pre-existing modified, deleted, and untracked file unless this plan must deliberately update it.
- Treat “all imports from `@/`” as all internal TypeScript/TSX and stylesheet imports; package imports remain bare package specifiers.
- Use explicit barrel exports; do not create barrels for App Router convention folders or single implementation-only files with no public API.
- Keep required Next.js/next-intl default exports in convention files; use named exports for ordinary reusable components, helpers, data, and types.
- Supported locales are exactly `en` and `fr`; `fr` is the default, and public URLs are always locale-prefixed.
- The current canonical origin defaults to `https://www.chelbab.vercel.app` and may be overridden only by a validated absolute `SITE_URL`.
- Do not invent addresses, phone numbers, social profiles, legal claims, prices, ratings, dates, authorship, or other business facts.
- Keep `/admin`, `/api`, redirects, invalid slugs, and the inactive `_quote` source out of the public index.
- Do not add `llms.txt` or AI-only hidden copy; expose real visible content, semantic relationships, and ordinary crawlable links.
- The repository requires Kluster review after edits, but no Kluster tool is exposed in this session; record the limitation and run all available verification.

## Review Focus

- Relative specifiers can remain hidden in dynamic imports, re-exports, or stylesheet imports: the module-boundary test must parse all three forms.
- Barrels can create self-import cycles: implementation files must import direct `@/path/file` modules, while consumers may import a public directory barrel.
- Locale middleware can accidentally intercept assets, metadata routes, admin, or APIs: proxy matcher tests must exercise every excluded family.
- Canonical, hreflang, sitemap, and internal-link paths can drift: all must consume the same locale-path and route-registry helpers.
- Dynamic category/product/domain/blog slugs can emit metadata for nonexistent content: invalid entities must return 404/noindex and never enter the sitemap.

---

### Task 1: Enforce aliased internal imports

**Files:**
- Create: `tests/module-boundaries.test.mjs`
- Modify: `src/**/*.ts`, `src/**/*.tsx`, `eslint.config.mjs`

**Interfaces:**
- Consumes: the `@/* -> ./src/*` TypeScript mapping.
- Produces: a repository invariant that source modules never import another source module with `./` or `../`.

- [x] **Step 1: Write the failing module-boundary test**

  Parse every `src/**/*.ts(x)` file and assert that internal `import`, dynamic `import()`, and stylesheet specifiers do not start with `./` or `../`; assert package specifiers remain allowed.

- [x] **Step 2: Run the focused test and verify the current 128 relative import sites fail**

  Run: `node --test tests/module-boundaries.test.mjs`

- [x] **Step 3: Replace relative imports with direct `@/` aliases and add an ESLint guard**

  Keep package imports unchanged. Use direct aliased implementation paths inside a module to avoid barrel cycles.

- [x] **Step 4: Re-run the focused test and ESLint**

  Run: `node --test tests/module-boundaries.test.mjs && npm run lint`

### Task 2: Define public barrels and export style

**Files:**
- Create/modify: focused `index.ts` files under reusable component, animation, i18n, library, and server module boundaries
- Modify: ordinary components currently using default exports and their consumers
- Modify: `tests/module-boundaries.test.mjs`

**Interfaces:**
- Consumes: direct named exports from leaf modules.
- Produces: explicit public APIs with separate value/type exports and no wildcard value barrels.

- [x] **Step 1: Extend the failing test with the intended public boundaries and export rules**

  Assert that each reusable multi-file directory has an `index.ts`, public barrels enumerate exports explicitly, and ordinary components do not use default exports. Exempt App Router convention files, `next.config.ts`, and the next-intl request-config convention.

- [x] **Step 2: Run the focused test and verify missing barrels/default component exports fail**

  Run: `node --test tests/module-boundaries.test.mjs`

- [x] **Step 3: Add explicit barrels and convert ordinary components to named exports**

  Keep types behind `export type`, preserve leaf imports inside each package, and update external consumers to the nearest stable barrel where doing so cannot create a cycle.

- [x] **Step 4: Run module-boundary tests, typecheck, and lint**

  Run: `node --test tests/module-boundaries.test.mjs && npx tsc --noEmit && npm run lint`

### Task 3: Establish stable locale-prefixed public routes

**Files:**
- Create: `src/proxy.ts`
- Modify: `src/i18n/config.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`
- Move: public route group to `src/app/[locale]/(client)/**`
- Modify: root/public layouts, language switcher, all public internal links, affected tests
- Test: `tests/seo-routing.test.mjs`

**Interfaces:**
- Consumes: `Locale`, `locales`, `defaultLocale`, and next-intl routing.
- Produces: `routing`, locale-aware `Link`/navigation helpers, `/fr/**` and `/en/**` pages, and permanent redirects from legacy unprefixed public paths to French counterparts.

- [x] **Step 1: Write failing proxy and locale-path tests**

  Cover `/ -> /fr`, `/contact?x=1 -> /fr/contact?x=1`, already-prefixed paths, invalid locales, `/admin`, `/api`, framework assets, `robots.txt`, and `sitemap.xml`.

- [x] **Step 2: Run the focused test and verify the locale routing contract is missing**

  Run: `node --test tests/seo-routing.test.mjs`

- [x] **Step 3: Implement locale routing and move public convention files**

  Set `localePrefix: "always"` and deterministic French fallback, validate locale params in request config, and keep private/admin/API routes outside locale routing.

- [x] **Step 4: Update all public links and language switching**

  Use next-intl navigation so a locale change preserves the equivalent pathname and query without the legacy locale POST/reload flow.

- [x] **Step 5: Run focused tests, typecheck, lint, and route build checks**

  Run: `node --test tests/seo-routing.test.mjs && npx tsc --noEmit && npm run lint && npm run build`

### Task 4: Centralize route identity and page metadata

**Files:**
- Create: `src/lib/seo/site.ts`, `src/lib/seo/metadata.ts`, `src/lib/seo/routes.ts`, `src/lib/seo/index.ts`
- Extract/modify: category, product, domain, and blog route data used by pages
- Modify: every public `page.tsx`, admin metadata, root metadata, locale messages
- Test: `tests/seo-metadata.test.mjs`

**Interfaces:**
- Produces: `getSiteUrl(): URL`, `getLocalizedPath(locale, pathname): string`, `buildPageMetadata(input): Metadata`, and a validated indexable route registry shared by pages and the sitemap.

- [x] **Step 1: Write failing metadata-helper tests**

  Assert validated origin fallback/override, one title suffix, localized self-canonical, reciprocal `en`/`fr` alternates, Open Graph/Twitter parity, preview `noindex`, admin `noindex,nofollow`, and representative dynamic-page metadata.

- [x] **Step 2: Run the focused test and verify the shared contract is absent**

  Run: `node --test tests/seo-metadata.test.mjs`

- [x] **Step 3: Implement the route registry and metadata builder**

  Reuse the actual category-product relationships, domain slugs, and localized blog records; reject invalid relationships rather than generating fallback labels.

- [x] **Step 4: Apply metadata to every real page**

  Add missing category/domain index metadata, route all existing page metadata through the helper, keep the gallery redirect non-indexable, and ensure every admin page inherits explicit noindex behavior.

- [x] **Step 5: Run metadata tests, locale integrity tests, typecheck, and lint**

  Run: `node --test tests/seo-metadata.test.mjs tests/i18n-integrity.test.mjs && npx tsc --noEmit && npm run lint`

### Task 5: Add crawl discovery and factual structured data

**Files:**
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/seo/json-ld.tsx`, `src/components/seo/index.ts`
- Modify: locale home layout/page and eligible content pages
- Test: `tests/seo-discovery.test.mjs`

**Interfaces:**
- Produces: `robots(): MetadataRoute.Robots`, `sitemap(): MetadataRoute.Sitemap`, `JsonLd`, and factual `Organization`/`WebSite` graphs.

- [x] **Step 1: Write failing discovery and serializer tests**

  Assert production crawl allowance, preview blocking, admin/API exclusions, sitemap location, one URL per real localized public entity, matching language alternates, no fabricated timestamps/priorities, and `<` escaping in JSON-LD.

- [x] **Step 2: Run the focused test and verify robots/sitemap/JSON-LD are absent**

  Run: `node --test tests/seo-discovery.test.mjs`

- [x] **Step 3: Implement robots and sitemap from shared route data**

  Allow normal search and AI search crawlers through the ordinary wildcard policy, exclude private routes, and keep training/search crawler policy neutral unless the owner supplies an opt-out preference.

- [x] **Step 4: Add only verified structured data**

  Render `Organization` and root-home `WebSite` identity using `Chelbab` and the configured canonical origin. Do not add Product offers, aggregate ratings, LocalBusiness details, or unverified article facts.

- [x] **Step 5: Run discovery tests, typecheck, lint, and build**

  Run: `node --test tests/seo-discovery.test.mjs && npx tsc --noEmit && npm run lint && npm run build`

### Task 6: Verify rendered output and document the result

**Files:**
- Modify: `AUDIT_REPORT.md`
- Inspect: complete working-tree diff

**Interfaces:**
- Consumes: all focused tests and generated production output.
- Produces: evidence for the implemented module, metadata, SEO, and GEO contracts plus explicit remaining deployment/manual work.

- [x] **Step 1: Run the complete verification suite**

  Run: `npm run lint`, `npx tsc --noEmit`, `node --test`, and `npm run build` separately; record every pass/failure without hiding the three known visual-contract baseline failures if they remain.

- [x] **Step 2: Verify production HTTP output**

  Check representative French/English static and dynamic pages, invalid slugs, unprefixed redirects, admin noindex, `robots.txt`, `sitemap.xml`, canonical/hreflang, Open Graph/Twitter tags, JSON-LD, and language-switch links.

- [x] **Step 3: Audit module boundaries and diff**

  Confirm zero relative source imports, no accidental barrel cycles, no changed business claims, and no lost pre-existing edits.

- [x] **Step 4: Update the audit report**

  Record implemented behavior, official-guidance rationale, verification results, the unavailable Kluster review, production-origin migration work, and remaining browser/Search Console/schema-validator checks.

