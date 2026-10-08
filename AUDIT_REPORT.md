# Application Audit Report

## Audit State

STEP 1 COMPLETE

ANALYSIS ONLY

NO APPLICATION SOURCE FIXES APPLIED

The audit was performed against the repository state on 2026-10-01. The `main` branch was one commit ahead of `origin/main` and already contained extensive modified, deleted, and untracked files across configuration, application, component, translation, asset, and test areas. Those pre-existing changes were treated as the audit baseline and were not altered. The only intentional file created by this step is `AUDIT_REPORT.md`.

---

## 1. Project Overview

| Area | Observed implementation |
| --- | --- |
| Package manager | npm; `package-lock.json` lockfile version 3 |
| Framework | Next.js 16.3.4, App Router only |
| UI runtime | React 19.2.8 and React DOM 19.2.8 |
| Language | TypeScript 5.9.3 with strict checking enabled |
| Styling | Tailwind CSS 4.3.3, PostCSS 8.5.28, custom global CSS |
| Node.js | No `engines` requirement in `package.json`; Docker and CI use Node 22; this audit ran under Node 25.6.0 |
| Internationalization | `next-intl` 4.14.2; locales `en` and `fr`; default locale `fr`; locale selected by cookie rather than locale-prefixed routes |
| UI/component libraries | Base UI 1.8.0, shadcn-generated components, class-variance-authority, `cn` utility |
| Icons | Lucide React 1.42.0 and Hugeicons React/Icon packages |
| Animation | GSAP 3.15.0 and `@gsap/react` 2.1.2 (the latter is not referenced in source) |
| Validation/forms | Zod 4.5.4 is used for environment validation; no form-management library is configured |
| Data/auth scaffolding | Prisma 7.10.0, SQLite through `@prisma/adapter-better-sqlite3`, `jose`, and `bcryptjs`; these server modules are not connected to the current public/admin route tree |
| Logging | Pino 10.3.1 plus a custom browser-error collection route |
| Tests | Node's built-in test runner with `.mjs` tests; no Jest, Vitest, Playwright, or Cypress dependency |
| Build tooling | Next.js/Turbopack, TypeScript, ESLint 9.39.5, Tailwind/PostCSS |

No Pages Router directory, middleware/proxy file, analytics library, or dedicated form library was found.

---

## 2. Architecture Summary

### Routing and layouts

The application uses `src/app` exclusively. The async root layout (`src/app/layout.tsx`) resolves the locale and all messages, applies the document language, and passes the complete message object to `NextIntlClientProvider`. A `(client)` route group wraps the public site with the header, global frontend log recorder, GSAP route-transition wrapper, and footer. Admin routes use a separate `src/app/admin/layout.tsx`.

Public routes discovered:

- `/`, `/contact`, `/quote`
- `/categories`, `/categories/[category]`, `/categories/[category]/[product]`
- `/domains`, `/domains/[domain]`
- `/entreprise`, `/entreprise/about`, `/entreprise/news`, `/entreprise/partners`, `/entreprise/reviews`
- `/resources/blog`, `/resources/blog/[id]`, `/resources/downloads`, `/resources/faq`, `/resources/galeries`, `/resources/guides`
- `/resources/catalogue`, which redirects to `/resources/galeries`

Admin routes are `/admin`, `/admin/dashboard`, and `/admin/login`. Route handlers are `/api/locale` and `/api/frontend-logs`.

### Rendering and component boundaries

Pages and layouts are Server Components unless marked otherwise. Important Client Component boundaries include the header and side menu, `AppMotion`, `FrontendLogRecorder`, `HomeContent`, `AboutContent`, gallery/filter/tab/FAQ controls, and horizontal scroll rails. The home and about root client components render large mostly-static subtrees so they can attach GSAP effects. Because the root locale resolver reads `cookies()`, the production route table reports every application route as dynamically server-rendered on demand.

### Data flow and application structure

Most visible content comes from the 54 locale JSON files (27 per locale) and page-local arrays/configuration. Dynamic domain and blog detail routes validate their identifiers and use `notFound()`. Category and product routes instead synthesize fallback content for unknown slugs. Prisma, repository, session, and authentication modules exist as scaffolding but are not called by the current route tree. The admin area is static placeholder UI.

### Internationalization and metadata

`src/i18n/request.ts` reads the locale cookie server-side. `src/components/client/language-switcher.tsx` posts to `/api/locale` and reloads the current URL. English and French therefore share identical URLs. Localized title/description generation exists for many detail pages, while root metadata supplies the default template. There is no sitemap, robots file, manifest, canonical/alternate configuration, Open Graph/Twitter configuration, favicon metadata, or JSON-LD implementation.

### Reliability conventions

Root and route-group loading/error/not-found boundaries exist. Dynamic route parameters follow the asynchronous Next.js 16 API. The implementation was compared with the documentation installed under `node_modules/next/dist/docs`, including App Router, Server/Client Components, metadata, route handlers, images, fonts, internationalization, JSON-LD, error handling, and production guidance.

---

## 3. Baseline Validation

| Check | Result | Important details |
| --- | --- | --- |
| Lint | PASS | `node_modules/.bin/eslint.cmd .` exited 0 with no findings. |
| Typecheck | PASS | `node_modules/.bin/tsc.cmd --noEmit --pretty false` exited 0. No `any`, `as any`, `@ts-ignore`, or `@ts-expect-error` was found in application source. |
| Tests | FAIL | `node --test tests/*.test.mjs` ran 56 tests: 53 passed and 3 failed in about 38.3 seconds. The failures assert an older domain-detail height, an older technique image, and an older challenge-section margin. This is confirmed contract drift; the intended behavior cannot be selected from repository evidence alone. |
| Production build | PASS | `node_modules/.bin/next.cmd build` completed under Next.js 16.3.4/Turbopack. Compilation, type checking, and generation of 49 pages succeeded. All 26 route entries were marked dynamic (`ƒ`). |

Additional baseline notes:

- `package.json` has no `test` or `typecheck` script, so safe direct executables were used. No scripts were invented or added.
- `.github/workflows/vercel.yml` runs lint and build but does not run the Node test suite.
- Browser smoke checks used the production build at 1440×900 and 375×812. The home page and five representative mobile routes showed no horizontal document overflow.
- Remote image optimizer requests could not be fully exercised because outbound connections to third-party image hosts were denied by the audit environment. This is recorded as a manual-review limitation, not as an application failure.
- A dependency vulnerability scan was not performed because the repository-mandated `kluster_dependency_check` capability was not available in this session. No dependency installation, update, or force-fix command was run.

---

## 4. Executive Summary

**P0 count:** 0  
**P1 count:** 4  
**P2 count:** 10  
**P3 count:** 4

The application lints, typechecks, and produces a successful production build. Its main product and marketing routes render successfully at desktop and mobile smoke-test sizes. Translation structures are unusually consistent: both locales contain the same 676 flattened keys, and every statically resolved code reference exists in both locales.

Production readiness is nevertheless blocked by four high-priority findings. Three visible forms have no submission implementation and fall back to browser GET behavior; English and French share the same URLs and therefore cannot be indexed as distinct localized pages; a public, globally enabled browser-log endpoint accepts arbitrary JSON and attempts unbounded local filesystem writes; and category/product routes return plausible 200 pages for arbitrary slugs. The most important medium-priority work concerns test/CI drift, incomplete metadata and structured data, excessive dynamic rendering/client payload, broken or placeholder customer links, accessibility gaps, and a font configuration that never applies the intended Montserrat face.

---

## 5. Confirmed Issues

### AUDIT-001 — Public forms do not submit data safely

**Priority:** P1  
**Status:** PARTIALLY FIXED IN STEP 2  
**Category:** Correctness / forms / privacy  
**File(s):** `src/app/(client)/contact/page.tsx:91`, `src/app/(client)/contact/page.tsx:129`, `src/app/(client)/_quote/page.tsx`, `src/components/client/blog/blog-detail.tsx:333`, `src/components/client/blog/blog-detail.tsx:370`  
**Evidence:** The contact, quote, and blog-comment forms define neither `action`/`method` nor an `onSubmit` handler. Runtime inspection confirmed that the contact form resolves to the current `/contact` URL with method `GET`. No backing route handler or server action for these forms exists.  
**Impact:** Submissions are not persisted or delivered. Entered names, email addresses, phone numbers, and message text can be serialized into URLs, browser history, referrers, analytics, and server logs. Users receive no reliable success, failure, loading, or duplicate-submission behavior.  
**Recommended correction:** Establish the intended delivery/storage contract, then use validated Server Actions or protected POST route handlers. Add server-side validation, anti-abuse controls, explicit success/error states, pending/disabled behavior, and safe logging. Use valid autocomplete tokens.  
**Step 2 resolution:** The quote page was preserved unchanged under the private `_quote` route folder, which opts it out of routing without adding redirect behavior. Every live CTA that previously targeted `/quote` now targets `/contact`, with localized `Contact us` / `Contactez-nous` labels. The unsafe quote form is therefore no longer publicly routable; the contact and blog-comment submission paths remain unresolved, so this finding stays open.  
**Validation:** A focused regression suite verifies that the original quote page remains present under `_quote`, no active source outside that private subtree links to `/quote`, and the affected English/French CTA labels use the contact wording.  
**Implementation step:** Step 2 — correctness and runtime blockers.

### AUDIT-002 — Locale selection is cookie-only and not indexable as localized content

**Priority:** P1  
**Status:** OPEN AFTER STEP 5 — the approved Step 4 locale-URL migration remains unimplemented.  
**Category:** Internationalization / SEO  
**File(s):** `src/i18n/config.ts:1`, `src/i18n/config.ts:5`, `src/i18n/request.ts:199`, `src/app/layout.tsx:36`, `src/components/client/language-switcher.tsx:40`, `src/app/api/locale/route.ts`  
**Evidence:** Both supported locales render at the same path. The server chooses a locale from a cookie; the language switcher POSTs the cookie and reloads the unchanged URL. There are no locale path segments, locale-aware proxy redirects, canonical URLs, `alternates.languages`, or hreflang output. With no cookie, crawlers receive default French.  
**Impact:** English content has no stable crawlable URL, localized pages cannot be shared or cached independently, search engines may treat language variants as duplicate/unstable representations, and language discovery depends on client interaction.  
**Recommended correction:** Define the desired URL strategy, preferably stable locale-prefixed routes, then implement locale-aware navigation, canonical/alternate metadata, hreflang, sitemap entries, cookie fallback, and redirects consistently.  
**Implementation step:** Step 4 — SEO/GEO and localized routing, after route contracts are settled.

### AUDIT-003 — Public frontend-log ingestion is unbounded and deployment-incompatible

**Priority:** P1  
**Category:** Security / reliability / observability  
**File(s):** `src/app/(client)/layout.tsx:6`, `src/app/(client)/layout.tsx:12`, `src/components/client/frontend-log-recorder.tsx:17`, `src/components/client/frontend-log-recorder.tsx:75`, `src/app/api/frontend-logs/route.ts:19`, `src/app/api/frontend-logs/route.ts:38`, `Dockerfile`  
**Evidence:** `FrontendLogRecorder` is mounted globally, records error messages, URLs, and stacks, and sends them to a public endpoint. The route calls `request.json()` before applying field truncation, has no authentication, origin policy, rate limit, or request-size limit, and appends to a `logs` directory beneath `process.cwd()`. Vercel-style runtimes do not provide durable application-local storage; the Docker image runs as `nextjs` while `/app` and no declared log volume are prepared for this write path.  
**Impact:** Anonymous traffic can consume parsing, CPU, and disk resources; repeated writes can fail in deployed environments; log data can be lost; and URLs/stacks may capture sensitive query data. This also creates a noisy failure loop if browser logging itself fails.  
**Recommended correction:** Replace local file ingestion with a bounded observability transport or remove the endpoint. Enforce body limits before JSON parsing where supported, schema validation, rate limiting, origin/auth policy as appropriate, redaction, retention rules, sampling, and failure isolation.  
**Implementation step:** Step 2 — security and production reliability.

### AUDIT-004 — Arbitrary category and product slugs return plausible 200 pages

**Priority:** P1  
**Category:** Routing / correctness / SEO  
**File(s):** `src/app/(client)/categories/[category]/page.tsx:253`, `src/app/(client)/categories/[category]/page.tsx:267`, `src/app/(client)/categories/[category]/page.tsx:271`, `src/app/(client)/categories/[category]/[product]/page.tsx:343`, `src/app/(client)/categories/[category]/[product]/page.tsx:371`  
**Evidence:** Unknown category slugs fall back to a generated label and fallback products. Unknown product/category pairs fall back to generated labels and an image without validating the category, product, or their relationship. Neither route calls `notFound()` for invalid input. By contrast, the domain and blog detail routes enumerate valid parameters and use `notFound()`.  
**Impact:** An unbounded number of fabricated URLs can return indexable 200 responses with duplicate or inaccurate product content. This weakens crawl quality, canonical signals, analytics, and user trust and makes malformed links appear valid.  
**Recommended correction:** Establish authoritative category/product datasets, validate both slugs and their relationship, call `notFound()` for invalid combinations, and generate metadata/static parameters only from valid records.  
**Implementation step:** Step 2 — routing correctness.

### AUDIT-005 — Cookie locale resolution makes every route dynamic and sends the full message catalog

**Priority:** P2  
**Category:** Next.js architecture / performance  
**File(s):** `src/app/layout.tsx:36`, `src/app/layout.tsx:46`, `src/i18n/request.ts:199`, `src/messages/en`, `src/messages/fr`  
**Evidence:** The root layout reads request cookies and supplies the entire locale message object to a root `NextIntlClientProvider`. The production build marks all 26 route entries dynamic. The raw locale catalogs total approximately 162,606 bytes for English and 170,217 bytes for French before serialization/compression.  
**Impact:** Pages that are otherwise static lose static generation/cacheability, incur request-time rendering, and serialize far more translations into the React Server Component/client payload than individual pages need. This is a code-level TTFB, FCP, hydration, and bandwidth risk; no field Core Web Vitals were available.  
**Recommended correction:** Coordinate with the locale-URL decision in AUDIT-002. Keep translation work server-side where possible, provide only client-required message subsets, and restore static generation/revalidation for content that does not need per-request data.  
**Implementation step:** Step 3 — rendering and payload optimization.

### AUDIT-006 — Large mostly-static page trees are hydrated for root-level animation

**Priority:** P2  
**Category:** React / Server and Client Components / performance  
**File(s):** `src/components/client/home/home-content.tsx`, `src/components/client/about/about-content.tsx`, `src/components/client/app-motion.tsx`, `src/app/(client)/page.tsx`, `src/app/(client)/entreprise/about/page.tsx`  
**Evidence:** `HomeContent` and `AboutContent` are client roots that import and render most of their pages, including static sections, primarily so a root effect can attach GSAP behavior. A global `AppMotion` boundary adds another route-level client animation layer.  
**Impact:** More JavaScript, props, component code, and hydration work are delivered than the interactive portions require. The likely effects are higher Total Blocking Time and poorer Interaction to Next Paint on lower-end devices; bundle measurement is still required before quantifying the gain.  
**Recommended correction:** Preserve static sections as Server Components and isolate animation/interaction into the narrowest client islands or progressive-enhancement wrappers. Measure route bundles and interaction timings before and after.  
**Implementation step:** Step 3 — React architecture and performance.

### AUDIT-007 — Test expectations have drifted and CI does not run the suite

**Priority:** P2  
**Category:** Testing / CI / maintainability  
**File(s):** `tests/*.test.mjs`, `.github/workflows/vercel.yml`, `package.json`, `src/app/(client)/domains/[domain]/page.tsx`, `src/components/client/home/technique-section.tsx`, `src/components/client/home/challenge-section.tsx`  
**Evidence:** Three of 56 tests fail: a domain-detail assertion expects the earlier `h-240 ... lg:h-145` classes while source uses `h-120`; a technique assertion expects `home-techniques.webp` while source uses `technique-primary-texture.webp` and `home-hero-planning.webp`; and a challenge assertion expects `-mx-4`, which source no longer contains. The CI workflow runs lint/build only, and `package.json` exposes neither test nor typecheck scripts.  
**Impact:** The repository has no green test baseline and CI can ship changes that violate the intended source contracts. It is not possible to determine from tests alone whether the implementation or assertions represent the desired design.  
**Recommended correction:** Resolve each assertion with the product/design owner, update only the incorrect side, add explicit `test` and `typecheck` scripts, and run both in CI before deployment.  
**Implementation step:** Step 2 for contract resolution; Step 6 for final CI hardening.

### AUDIT-008 — Customer-facing navigation contains broken routes and placeholder destinations

**Priority:** P2  
**Category:** Routing / content integrity  
**File(s):** `src/components/client/footer.tsx:15`, `src/components/client/footer.tsx:152`, `src/components/client/footer.tsx:230`, `src/components/client/footer.tsx:241`, `src/components/client/side-menu.tsx:36`, `src/components/client/side-menu.tsx:41`, `src/app/(client)/contact/page.tsx`, `src/components/client/blog/blog-detail.tsx`  
**Evidence:** Footer social links use `href="#"`; `/privacy-policy` and `/terms` links have no matching routes; phone links include `tel:+123256856858` and other placeholder-looking numbers; side-menu social icons map to phone, mail, and maps rather than named social profiles; blog author social icons also use `#`. Runtime inspection confirmed four footer `#` links and both missing legal-route links.  
**Impact:** Users encounter no-op or 404 navigation, business contact signals are unreliable, and legal/privacy expectations for forms and logging are unmet. Placeholder links also reduce accessibility and search trust.  
**Recommended correction:** Obtain verified business/legal destinations, create the required legal pages or remove links until content exists, and render only valid contact/social actions with descriptive accessible names.  
**Implementation step:** Step 2 for broken route/contact blockers; Step 4 for final content and semantics.

### AUDIT-009 — Metadata, crawl-control, social, and structured-data coverage is incomplete

**Priority:** P2  
**Status:** PARTIALLY FIXED IN STEP 5 — root/home/admin descriptions are localized and the metadata origin is the owner-supplied current host; locale URLs and remaining crawl architecture are still open.  
**Category:** SEO / GEO  
**File(s):** `src/app/layout.tsx:23`, `src/app/(client)/categories/page.tsx`, `src/app/(client)/domains/page.tsx`, `src/app`  
**Evidence:** `metadataBase` is the placeholder `https://chelbab.example.com`. No sitemap, robots file, manifest, canonical/alternate definitions, Open Graph/Twitter configuration, or JSON-LD was found. Category and domain index pages inherit generic root metadata instead of having page-specific metadata. Many other public pages do generate localized title/description metadata, and organization/product/service copy is generally clear.  
**Impact:** Production URLs and share previews may be wrong or generic; crawlers lack canonical, sitemap, and locale signals; and search/generative systems cannot consume explicit organization/service relationships.  
**Recommended correction:** Confirm the production origin and organization facts, then implement route-specific localized metadata, canonical/alternate URLs, sitemap/robots, social metadata, app icons/manifest as required, and factually supported Organization/Product/Service/Breadcrumb/Article schema. Never fabricate ratings, prices, authors, or addresses.  
**Implementation step:** Step 4 — SEO/GEO after localized URL design.

### AUDIT-010 — Dialog and form semantics leave important accessibility gaps

**Priority:** P2  
**Category:** Accessibility  
**File(s):** `src/components/client/side-menu.tsx`, `src/app/(client)/quote/page.tsx:78`, `src/components/ui/dialog.tsx:75`, `src/components/ui/dialog.tsx:113`  
**Evidence:** The rendered side-menu dialog declares `aria-labelledby="side-menu-title"`, but no element with that ID exists. The custom overlay implementation does not establish a complete focus trap, background inertness, and return-focus contract. Runtime accessibility inspection found five icon-only links without accessible names. The quote form groups fields with `<fieldset>` but uses an `<h6>` instead of `<legend>`. Generic dialog controls also contain hardcoded English labels.  
**Impact:** Screen-reader users may encounter an unnamed dialog and unnamed actions; keyboard focus can escape or be lost; and grouped form fields lack their programmatic group label.  
**Recommended correction:** Use the accessible Base UI dialog primitives consistently or implement the complete modal interaction pattern, connect a real title/description, label icon-only links, use `legend`, and test keyboard/focus/screen-reader behavior in both locales.  
**Implementation step:** Step 4 — accessibility remediation.

### AUDIT-011 — The intended Montserrat typography is not applied

**Priority:** P2  
**Category:** Fonts / performance / visual correctness  
**File(s):** `src/app/layout.tsx:3`, `src/app/layout.tsx:10`, `src/app/layout.tsx:18`, `src/app/globals.css:808`, `src/app/globals.css:846`, `public/fonts`  
**Evidence:** `next/font` exposes Montserrat through `--font-heading`, while global CSS and the `.font-montserrat` utility expect `--font-montserrat`. The production CSS contains no effective `.font-heading` rule. Runtime computed styles showed body, headings, `.font-heading`, and `.font-montserrat` resolving to Open Sans; `--font-heading` contained Montserrat while `--font-montserrat` was empty. Five locally declared TTF weights total about 1.66 MB, and four additional TTF files totaling about 1.35 MB are not referenced by the font declarations.  
**Impact:** The shipped visual hierarchy does not match the intended typography, while multiple font-loading paths and unused weights increase asset and maintenance cost and can worsen font timing/layout behavior.  
**Recommended correction:** Choose a single loading strategy and variable name for each family, map heading/button utilities to the loaded Montserrat face, keep only actually used weights/formats, and verify computed fonts plus CLS after the change.  
**Implementation step:** Step 3 — font and performance correction.

### AUDIT-012 — Some image paths bypass optimization or are loaded too eagerly

**Priority:** P2  
**Category:** Images / performance / operational risk  
**File(s):** `src/app/(client)/domains/[domain]/page.tsx:54`, `src/app/(client)/domains/[domain]/page.tsx:176`, `src/components/client/home/home-intro.tsx:29`, `src/components/client/home/home-intro.tsx:78`, `next.config.ts`  
**Evidence:** Domain-detail media from `www.chelbab.com` uses raw `<img>` elements because the host is absent from the Next image configuration, including an eagerly loaded intro image. Home hero images are prioritized as expected, but two below-the-fold home-intro images are also marked priority. Product data hotlinks images from 11 third-party domains. Most local images otherwise use WebP, `next/image`, dimensions/fill, `sizes`, and useful alt text.  
**Impact:** Raw/hotlinked images miss Next.js resizing, format selection, and controlled caching; eager below-fold downloads can compete with LCP resources; and external availability, licensing, and optimizer allowlisting are outside repository control.  
**Recommended correction:** Confirm ownership/licensing and availability, host stable product media locally or on an approved image CDN, configure only trusted remote patterns, use `next/image`, and reserve priority/preload for measured above-the-fold LCP candidates.  
**Implementation step:** Step 3 — image delivery and Core Web Vitals.

### AUDIT-013 — User-facing fallback and control text bypasses i18n

**Priority:** P2  
**Status:** PARTIALLY FIXED IN STEP 5 — the identified literals now resolve from English/French messages; fatal global-error localization is client-reconciled because that boundary replaces the provider-bearing root layout.  
**Category:** Internationalization / accessibility  
**File(s):** `src/app/error.tsx:17`, `src/app/error.tsx:23`, `src/app/global-error.tsx:32`, `src/app/loading.tsx:4`, `src/app/not-found.tsx:4`, `src/app/(client)/error.tsx:17`, `src/app/(client)/loading.tsx:4`, `src/app/admin`, `src/components/client/common/hero.tsx:39`, `src/components/ui/carousel.tsx:21`, `src/components/ui/carousel.tsx:31`, `src/components/ui/dialog.tsx:75`, `src/components/client/language-switcher.tsx`  
**Evidence:** Error/loading/not-found/admin screens, generic dialog and carousel labels, language labels, and some alt/ARIA strings are hardcoded in English rather than resolved from the active locale. Brand names, URLs, developer strings, and non-visible identifiers were excluded from this finding.  
**Impact:** French users can encounter English recovery screens and assistive labels during failures or interaction, producing an incomplete locale experience even though the main page copy is translated.  
**Recommended correction:** Define shared fallback/accessibility namespaces that are safe for root error contexts, translate visible strings in both locales, and retain product/brand proper nouns where appropriate.  
**Implementation step:** Step 5 — internationalization completion.

### AUDIT-014 — Admin routes are public while authentication code is disconnected

**Priority:** P2  
**Category:** Security architecture / readiness  
**File(s):** `src/app/admin/page.tsx`, `src/app/admin/dashboard/page.tsx`, `src/app/admin/login/page.tsx`, `src/server/auth`, `src/server/session`, `src/server/repositories`  
**Evidence:** `/admin`, `/admin/dashboard`, and `/admin/login` render without a server-side authorization guard. Authentication/session/repository modules exist but are not imported into the route tree. Current admin pages contain placeholder content and no sensitive records or mutations.  
**Impact:** There is no current sensitive-data exposure, so this is not a P0/P1 incident. However, adding real data or controls to these routes before server-enforced authorization would create an immediate access-control vulnerability.  
**Recommended correction:** Before connecting admin data or mutations, define authentication/session behavior and enforce authorization in the server layout/page/data layer. Do not rely on client redirects or hidden controls. Add unauthorized and expired-session tests.  
**Implementation step:** Step 2 — secure the boundary before admin functionality grows.

### AUDIT-015 — Runtime dependencies include apparently unused or misplaced packages

**Priority:** P3  
**Category:** Dependencies / maintenance  
**File(s):** `package.json`, `package-lock.json`, application source  
**Evidence:** Repository-wide source inspection found no import of `@gsap/react`, `@prisma/adapter-pg`, or `tw-animate-css`. `shadcn` appears to be a development/code-generation tool but is listed in runtime dependencies. `@prisma/adapter-pg` appears only in generated/internal Prisma material, while the configured schema uses SQLite. React DOM, PostCSS, and `better-sqlite3` have valid framework/config/adapter roles despite few or no direct application imports.  
**Impact:** Unnecessary runtime dependencies increase installation surface, lockfile churn, supply-chain exposure, and maintenance ambiguity. This is not proof that removal is safe because planned/generated workflows may exist outside import graphs.  
**Recommended correction:** Confirm intended database and styling workflows, run the mandated dependency/security review when available, then move tooling to development dependencies or remove packages only after build/test verification.  
**Implementation step:** Step 6 — dependency cleanup and final validation.

### AUDIT-016 — Several modules and assets are high-confidence or possible dead-code candidates

**Priority:** P3  
**Category:** Dead code / maintainability  
**File(s):** `src/components/admin/navbar.tsx`, `src/components/admin/sidebar.tsx`, `src/lib/constants.ts`, `src/components/client/common/scroll-to-top.tsx`, `src/components/admin/button.tsx`, `src/components/ui/breadcrumb.tsx`, `src/components/ui/checkbox.tsx`, `src/features/types/index.ts`, `src/i18n/navigation.ts`, `src/server`, `public`  
**Evidence:** A TypeScript import graph found no circular dependency and no incoming imports for the listed modules. The admin navbar/sidebar and constants module are empty or inert. The other modules may be planned scaffolding. Static asset references also leave some old home/hero files and unused Montserrat weights without consumers; dynamically constructed blog/partner asset names prevent safe blanket conclusions.  
**Impact:** Inert and abandoned code obscures the live architecture and increases review/search cost, but deleting planned scaffolding or dynamically referenced assets without owner confirmation could cause regressions.  
**Recommended correction:** Use the classifications in Section 11, confirm ownership and dynamic conventions, then remove only high-confidence items in isolated commits with build, route, and asset checks.  
**Implementation step:** Step 6 — conservative cleanup.

### AUDIT-017 — Legacy translation namespaces remain after route/content changes

**Priority:** P3  
**Status:** PARTIALLY FIXED IN STEP 5 — confirmed obsolete groups were removed; quote/devis content was deliberately retained under the earlier preservation request.  
**Category:** Internationalization / dead content  
**File(s):** `src/messages/en`, `src/messages/fr`, application translation call sites  
**Evidence:** Both locales have exact structural parity, but reverse-usage analysis identified high-confidence legacy groups including `pages.devis` (the former route is deleted), `pages.domainCategory`, admin/navigation strings not used by the hardcoded placeholder admin, and a legacy `sideMenu` navigation group. A broader static candidate set includes dynamically addressed product/category/domain keys and therefore cannot be treated as unused.  
**Impact:** Stale keys raise translator workload and make content ownership unclear. Removing dynamic keys through exact-string search would break valid runtime lookups.  
**Recommended correction:** Preserve everything during Step 1. In Step 5, document dynamic key families, confirm deleted feature ownership, and remove only mirrored high-confidence legacy keys from both locales with translation and route tests.  
**Implementation step:** Step 5 — translation inventory cleanup.

### AUDIT-018 — Runtime/tooling contracts and repository documentation are incomplete

**Priority:** P3  
**Category:** Developer experience / reproducibility  
**File(s):** `package.json`, `Dockerfile`, `.github/workflows/vercel.yml`, `README.md`  
**Evidence:** Docker and CI use Node 22 but `package.json` declares no Node/package-manager requirement; the audit host used Node 25.6.0. The package scripts omit test and typecheck commands. README content still references a generic create-next-app structure (`app/page.tsx`) and Geist fonts rather than `src/app` and the actual font/i18n/data architecture.  
**Impact:** Contributors can validate under different runtimes, omit important checks, and follow stale setup guidance. Passing under Node 25 does not prove identical Node 22 behavior.  
**Recommended correction:** Declare and document the supported Node/npm versions, add canonical validation scripts, align CI/local/Docker commands, refresh architecture/setup documentation, and rerun the full baseline on Node 22.  
**Implementation step:** Step 6 — reproducibility and final verification.

---

## 6. Performance Findings

### Measured results

- The production build succeeded and reported every route as dynamically server-rendered.
- Raw translation JSON totals approximately 162.6 KB for English and 170.2 KB for French. This is source size, not measured transfer size.
- Five declared local font files total approximately 1.66 MB; four additional unreferenced Montserrat TTF files total approximately 1.35 MB.
- At 1440×900 on `/` and 375×812 on `/`, `/categories/tuyauterie`, `/contact`, `/quote`, `/domains/tuyauterie-industrielle`, and `/resources/blog`, the document width did not exceed the viewport.
- No Lighthouse, Web Vitals field data, JavaScript bundle analyzer, network-throttled trace, or production CDN trace was available. No LCP/INP/CLS number is claimed.

### Code-level performance risks

**Server/Client architecture and rendering:** Root cookie access prevents static generation across the application. Full catalogs are supplied to a root client provider. `HomeContent` and `AboutContent` hydrate broad mostly-static subtrees, while global animation and logging clients run on every public route.

**Bundle/dependencies:** GSAP is used, but `@gsap/react` appears unused. Two icon ecosystems and a sizable UI layer are present; bundle cost needs measurement before consolidation. Prisma/auth/database packages are server-side scaffolding and must remain out of client graphs. No server-only module was found imported by a client component.

**Images:** Most local images use `next/image`, dimensions or fill, `sizes`, WebP, and alt text. Risks are concentrated in raw remote domain images, 11 third-party hotlink origins, and below-fold priority images. Remote optimizer behavior needs a network-enabled staging check.

**Fonts:** Duplicate/misaligned font mechanisms currently deliver Open Sans where Montserrat is intended and retain multiple TTF weights. Correctness should be fixed before measuring preload, transfer, and CLS improvements.

**Scripts and animations:** No third-party analytics or advertising scripts were found. GSAP scroll/entrance effects and global listeners generally include cleanup, but their route-level scope makes TBT/INP measurement important after client-boundary reduction.

**Probable Core Web Vitals impact:** AUDIT-005 and AUDIT-006 primarily risk TTFB/FCP/TBT/INP; AUDIT-012 can affect LCP and bandwidth; AUDIT-011 can affect font timing and CLS. These are code-level risks, not measured regressions.

---

## 7. SEO / GEO

- **Localized discovery:** English and French share URLs and have no canonical/hreflang strategy (AUDIT-002).
- **Crawl correctness:** Arbitrary category/product slugs return 200 content rather than 404 responses (AUDIT-004). Domain and blog detail routes correctly use `notFound()` and valid parameter lists.
- **Metadata coverage:** Many content/detail pages provide localized title/description metadata, but index routes are inconsistent and the root uses a placeholder production origin (AUDIT-009).
- **Technical discovery:** No sitemap, robots route/file, manifest, explicit canonical/alternates, Open Graph/Twitter metadata, or complete app-icon configuration was found.
- **Structured data:** No JSON-LD is present. The site has clear organization, service, product, article, and breadcrumb concepts that could support factual Schema.org markup once verified business data and URL strategy are available.
- **GEO:** Page copy usually states the subject and product/service relationships clearly, which is positive. Entity identity, authorship/publication data, and relationships are not exposed in structured form. Recommendations must remain factual and must not invent reviews, ratings, addresses, prices, or authors.
- **Internal links:** Placeholder social/legal/contact links reduce crawl and trust quality (AUDIT-008).

---

## 8. Accessibility / Responsive

### Accessibility bugs

- The side-menu dialog references a missing label ID and lacks a fully demonstrated modal focus contract.
- Five icon-only links were unnamed in the runtime accessibility view.
- The quote form's field group has no programmatic `legend`.
- Generic dialog/carousel accessible labels and error/loading content are hardcoded in English.
- `href="#"` controls create ambiguous/no-op destinations.

Positive observations include widespread native labels and required attributes on forms, semantic landmarks, descriptive image alt text in most content, and existing screen-reader-only text in several UI primitives. `autoComplete="subject"` is not a standard autocomplete token and should be corrected with the form implementation.

### Responsive review

Source inspection covered fixed/sticky navigation, modals, grids, images, wrapping, and viewport-sized sections. Production browser smoke tests at 1440×900 and 375×812 found no document-level horizontal overflow on the six representative routes listed in Section 6. The mobile menu opened as a viewport overlay and major grids collapsed as intended.

This is not a complete device/browser matrix. Tablet breakpoints, zoom/reflow at 200–400%, long translated strings, keyboard-only modal use, Safari viewport behavior, and third-party image failure states still require manual staging checks.

---

## 9. Dependency Findings

### Confirmed used

- Next.js, React, React DOM, TypeScript, Tailwind/PostCSS, `next-intl`, GSAP, Base UI, Lucide, Hugeicons, class-variance-authority, `clsx`/Tailwind merge utilities, Zod, Pino, Prisma Client, SQLite adapter, `jose`, and `bcryptjs` have source/config/generated roles.
- Database/auth packages are currently used by disconnected server scaffolding rather than live routes; classify them as planned architecture, not automatically removable.

### Apparently unused

- `@gsap/react`
- `@prisma/adapter-pg` while the configured datasource is SQLite
- `tw-animate-css`

### Duplicated functionality

- Lucide and Hugeicons both provide icon sets. This is a consistency/bundle review opportunity, not proof that either dependency is redundant.
- `next/font` Montserrat and local CSS Montserrat declarations duplicate font-loading responsibilities and are currently miswired.

### Potentially heavy

- GSAP, two icon libraries, the full client translation message object, Prisma/database drivers, and local TTF sets deserve bundle/server artifact measurement. Their presence alone is not a defect.

### Compatibility concern

- Next.js 16.3.4 and React 19.2.8 compile successfully together in this repository.
- The supported Node runtime is implicit: Docker/CI use 22, while no `engines` field prevents unsupported or unverified local versions.
- No deprecated Pages Router or `middleware.ts` convention is present; Next.js 16 calls the request-boundary feature `proxy`, but the application currently has no need implemented there.

### Security concern

- A package vulnerability result is **NOT AVAILABLE**. The mandated Kluster dependency-check tool was not exposed in this session, and no network/package-manager audit was substituted. A future read-only audit must avoid automatic fixes.

### Manual review

- Confirm whether PostgreSQL support, shadcn CLI availability at runtime, and the apparently unused animation stylesheet are planned requirements before changing dependencies.

---

## 10. Internationalization Findings

**Supported locales:** `en`, `fr`  
**Default locale:** `fr`  
**Library:** `next-intl` 4.14.2  
**Architecture:** 27 JSON namespace files per locale; cookie-based request locale; server and client translation APIs; full messages passed through the root provider.

**Missing translation keys:** None found. Each locale has 676 flattened keys with exact key/shape parity. All 245 uniquely resolved static code references exist in both locales.

**Extra/empty/null/malformed values:** No locale-only keys, empty values, null values, or structural mismatches were found.

**Potentially unused keys:** High-confidence legacy groups include `pages.devis`, `pages.domainCategory`, unused admin/navigation strings, and a legacy `sideMenu` navigation group. Additional candidates cannot be confirmed because product, category, domain, statistics, marquee, and similar-product keys are dynamically constructed.

**Dynamic keys requiring care:** Product/category slugs, domain raw objects, home/about arrays, profile sections, marquees, statistics, and related-product lookups derive keys from configuration or route data. Exact-text search is unsafe for removal.

**Hardcoded UI text:** English error/loading/not-found/admin copy, generic carousel/dialog labels, language names, and selected alt/ARIA strings bypass the active locale (AUDIT-013).

**Interpolation/plural/rich-text mismatches:** None confirmed. A heuristic match on the ordinary English word “select” was inspected and dismissed; it was not a placeholder mismatch.

**Localized SEO problems:** Locale variants lack distinct URLs, canonical/alternate metadata, hreflang, and localized sitemap entries. The `<html lang>` value does correctly reflect the cookie-selected locale.

**Removal warning:** Do not remove any key until dynamic families and feature ownership are documented and both locale trees are validated together.

---

## 11. Dead Code Candidates

### HIGH CONFIDENCE UNUSED

- `src/components/admin/navbar.tsx` — empty/inert and no incoming imports.
- `src/components/admin/sidebar.tsx` — empty/inert and no incoming imports.
- `src/lib/constants.ts` — empty and no incoming imports.
- Four unreferenced Montserrat TTF weights in `public/fonts` — no CSS/`next/font` reference found.
- Legacy message groups `pages.devis` and `pages.domainCategory` — corresponding live routes/call sites were not found.

### POSSIBLY UNUSED

- `src/components/admin/button.tsx`
- `src/components/client/common/scroll-to-top.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/checkbox.tsx`
- `src/features/types/index.ts`
- `src/i18n/navigation.ts`
- Auth/session/repository modules under `src/server`
- Old common/home image candidates such as `common/HeroImage1.webp`
- Unreferenced admin/navigation/side-menu translation groups

These may be planned scaffolding, external entry points, or artifacts of the current uncommitted refactor. Confirm intent before deletion.

### DYNAMIC / UNSAFE TO REMOVE

- Blog photo and partner-logo assets whose filenames are assembled from data.
- Product/category/domain translations selected from route slugs or configuration.
- Similar-product, product-profile, marquee, and statistics keys addressed through dynamic paths.
- Framework convention files, generated Prisma material, and public files that may be referenced outside the TypeScript import graph.

The import graph found zero circular dependencies. No broken imports or path-casing failures surfaced in lint, typecheck, or production build.

---

## 12. Manual Review

The following cannot be established reliably from repository evidence alone:

1. Which side is correct for each of the three failing visual/markup contract tests.
2. Verified production domain, organization address/contact details, legal text, social profiles, author identities, publication/update dates, and any factual structured-data values.
3. The intended storage/delivery and retention policy for contact, quote, comment, and frontend-log submissions.
4. Whether PostgreSQL support, unused UI modules, server auth scaffolding, and candidate assets are planned work in the existing refactor.
5. Licensing, ownership, durability, and caching permission for product images hotlinked from 11 third-party domains.
6. Remote image optimizer behavior in a network-enabled production-like environment.
7. Real-user or throttled LCP, INP, CLS, FCP, TBT, JavaScript bundle, and translation-payload measurements.
8. Full accessibility conformance using keyboard, zoom/reflow, high contrast, reduced motion, and screen readers in both languages.
9. Cross-browser/device behavior beyond the desktop/mobile smoke tests performed here.
10. Dependency vulnerabilities; the required read-only dependency-check capability was unavailable.

---

## 13. Recommended Fix Order

1. **Step 2 — correctness, routing, and security blockers.** Preserve or commit the current dirty baseline first. Resolve the three failing-test contracts; implement safe POST/server-action flows for contact and comments while keeping the quote route private unless it is intentionally reactivated; replace or harden frontend logging; reject invalid category/product slugs; remove or resolve broken/placeholder customer links; and enforce server-side admin authorization before connecting real functionality.
2. **Step 3 — architecture and performance.** After the locale URL contract is chosen, restore static rendering where appropriate, narrow client translation payloads, split broad home/about client roots into interactive islands, correct the font pipeline, and optimize/own remote imagery and priority loading. Capture bundle and Web Vitals measurements before and after.
3. **Step 4 — SEO, GEO, and accessibility.** Implement locale-aware URLs, canonical/hreflang/sitemap/robots behavior, correct production metadata, social metadata, factual structured data, and accessible dialog/form/icon behavior. Complete keyboard, focus, reflow, reduced-motion, and screen-reader checks.
4. **Step 5 — internationalization.** Translate shared errors, loading/not-found states, admin/fallback UI, and accessible control text. Document dynamic key families and remove only confirmed mirrored legacy keys after automated parity/reference checks.
5. **Step 6 — conservative cleanup and final verification.** Confirm and remove only high-confidence dead code/assets/dependencies; declare Node/npm requirements; add canonical lint/typecheck/test/build scripts to CI; update README; perform a read-only dependency/security audit; validate under Node 22; and rerun lint, typecheck, all tests, production build, route/404/form/browser/accessibility/image checks, and performance measurements.

Step 2 is in progress. The quote route has been deactivated by moving its unchanged source into the private `_quote` folder, and former quote CTAs now lead to the contact page. The three unrelated ambiguous visual test expectations and the remaining Step 2 findings still require separate resolution.

---

# Step 5 Internationalization Summary

This section records the current Step 5 implementation and verification. The earlier Step 1 observations above remain historical baseline evidence; Steps 2–4 were not retroactively marked complete. The Step 4 locale-URL design is committed, but its route migration is not implemented.

## I18n Architecture

- `next-intl` 4.14.2; configured locales `en` and `fr`; default locale `fr` from `src/i18n/config.ts`. A separate translation-authoring source locale is not declared, so none is assumed.
- Messages are split by namespace into JSON files under `src/messages/{en,fr}` and assembled in `src/i18n/request.ts`. Server Components use `getTranslations`; Client Components use `useTranslations` under the root `NextIntlClientProvider`.
- The current route strategy remains cookie-selected content on shared URLs. `/api/locale` sets the httpOnly locale cookie; its new read-only GET operation exposes the validated locale to the provider-less global error boundary. The switcher reloads the same URL only after a successful POST. `<html lang>` tracks the validated cookie locale. Invalid cookie values fall back to French.
- There is no RTL locale. No RTL layout or direction change is applicable. Dates in the existing locale catalogs are literal localized text; no user-visible date, number, currency, or relative-time formatter was found to correct.

## Translation Inventory

| Measure, per locale | Before Step 5 | After Step 5 |
| --- | ---: | ---: |
| JSON files | 27 | 25 |
| Recursive string values (including array items) | 2,165 | 2,176 |
| String keys added | 0 | 28 |
| String keys removed | 0 | 17 |
| Missing code-used keys found/fixed | 0 | 0 |

The exact recursive catalog shape, including array indexes, matches in both locales. No empty string, null value, JSON parse error, ICU parse error, or interpolation/tag signature mismatch was found. The `@formatjs/icu-messageformat-parser` check found literal and simple argument messages only; there are no plural/select/selectordinal or rich-tag constructs to repair. Literal `useTranslations` and `getTranslations` calls are checked against both catalogs with a TypeScript AST-based test; dynamic families below are checked from source arrays. No translatable hardcoded JSX/alt/ARIA/metadata string remains in the final targeted source scan; proper names, identifiers, product codes, endpoints, and developer strings were excluded.

## Translation Keys Added

All listed keys were added in both `en` and `fr`. They are faithful UI translations derived from existing visible English text, except the French wording, which was translated for Step 5 and should receive native review.

- `common.errors.{unexpected,retry,notFound,notFoundDescription}` — root, public, and admin recovery/404 text.
- `common.loading` — root, public, and admin loading text.
- `common.navigation.{previous,next,backToTop}` — carousel and scroll control names.
- `common.media.{heroAlt,companyOverview,homeHeroAlt}` — image alternative text and video-link accessible names.
- `common.languages.{en,fr}` — switcher option labels.
- `common.metadata.{description,homeTitle,homeDescription}` — root and home metadata.
- `common.controls.{close,breadcrumb,more}` — shared dialog and breadcrumb accessible text.
- `admin.overview.{title,description,metadataDescription}`, `admin.login.{title,description,metadataDescription}`, and `admin.dashboardPage.{description,metadataDescription}` — admin placeholder UI and metadata.
- `pages.partners.logoAlt` — localized partner-logo alternative with an unchanged `{partner}` interpolation.

## Translation Keys Removed

The following were removed identically in both locale files after inspecting route ownership, imports, literal and dynamic calls, configuration, and runtime data flow. The quote-related `pages.devis` and `pages.quote` groups were *not* deleted.

- `pages.domainCategory.{metadataTitle,metadataDescription,title,description}` — four strings from `client/pages/domain-category.json`; there is no live domain-category route or caller. Both files and their request-config assembly/imports were removed.
- `sideMenu.title`, `sideMenu.navigationLabel`, and `sideMenu.links.{products,domains,company,resources,contact}` — seven strings never read by the active side-menu component or a dynamic key family.
- `admin.{users,products,categories,orders,messages,settings}` — six placeholder navigation strings with no rendered admin navigation or dynamic caller.
- Empty `shared.json` files — zero strings; the unused namespace and imports were removed.

## Dynamic Keys Preserved

The test resolves values from the actual header and home/about data arrays for `header.nav.*.items`, `pages.home.intro.features`, `services.items`, `builds.items`, `stats.items`, `process.items`, `testimonials.items`, `blog.items`, `challenge.skills`, and `marquee`, plus `pages.about.highlights.items`, `achievements.items`, `professionals.items`, and `marquee`. It also checks side-menu contact links, footer social/quick links, gallery categories/alts, category/product and domain identifiers, similar products, and the inactive `_quote` form services. Product option/specification families were inspected and preserved. No key in a dynamic family was removed.

## Hardcoded UI Text Fixed

Translated root/public/admin error, loading, not-found, and placeholder screens; language names; carousel, scroll, dialog, and breadcrumb accessible names; the shared/home hero alternatives; home/about video link names; partner-logo alt text; and root/home/admin metadata. Product thumbnail controls now reuse their existing localized view labels, and the duplicate color-swap logo image is decorative. The product-detail `Sur mesure` display sentinel was replaced by a machine key while retaining the existing translated display label. No CSS class, layout, animation, image asset, or visual design was intentionally changed.

## Interpolation / ICU Fixes

None were required. Every English/French message parses and has the same argument and rich-tag signature. The parser found no plural/select/rich messages in the current catalog.

## Locale Routing

Cookie routing remains the current application contract; language switching keeps the current path and query. The read-only locale endpoint supports the global fatal boundary. Production HTTP checks confirmed `/` renders `Accueil | Chelbab` with `lang=fr` and `Home | Chelbab` with `lang=en`; invalid cookies fall back to French. Contact, blog, and a domain detail were checked in both locales. `/fr` and `/en` remain 404: stable locale-prefixed URLs, canonical/hreflang, and localized sitemap URLs are the outstanding AUDIT-002/Step 4 work and must not be claimed as finished by this i18n batch.

## Localized Metadata

Root description, home title/description, and admin title/descriptions now use messages. The root `metadataBase` was corrected from the `.example.com` placeholder to the owner-supplied current origin, `https://www.chelbab.vercel.app`; the future `https://www.chelbab.com` migration remains a deployment decision. Category/domain index metadata and the wider canonical/social/robots/sitemap strategy remain open under AUDIT-009/Step 4.

## Manual Review

- Native French review of newly translated recovery, accessibility, and admin placeholder wording; no business facts were invented.
- Fatal `global-error.tsx` initially renders the French default until its client-side locale fetch resolves; if that endpoint is also unavailable, French remains the fallback even for an English cookie. This boundary cannot access the normal root provider.
- Browser/assistive-technology checks for error boundaries, menus, dialogs, and long French labels were not completed. The production checks here inspected HTTP output, not interactive browser behavior.
- `pages.devis` is currently unreferenced but is retained alongside the inactive quote page under the owner's no-deletion request. Other uncertain and data-derived families remain preserved.
- Complete locale-prefixed routing and SEO alternates depend on the unimplemented Step 4 design; the current shared-URL strategy is not independently indexable by locale.
- The repository-mandated Kluster review and dependency-check tools were not exposed in this environment; neither result is claimed.

## Validation

| Check | Before Step 5 | After Step 5 |
| --- | --- | --- |
| Lint | Pass | Pass (`eslint .`) |
| Typecheck | Pass | Pass (`tsc --noEmit`) |
| Tests | 56 pass / 3 fail of 59 | 65 pass / 3 fail of 68 (`node --test`) |
| Production build | Pass | Pass with network access for existing Google Fonts; first two sandboxed retries failed only while fetching those fonts |
| I18n validation | No dedicated script | Nine targeted tests pass: structural parity, ICU/interpolation parity, literal and raw code references, data-derived families, required UI/admin keys, and obsolete-group absence |

The three full-suite failures remain the same pre-existing visual-contract assertions: domain-detail image height, home technique image choice, and home challenge spacing. They were not altered because the owner requested no design change. A review-found stale gallery source assertion was updated to check the localized accessible label, and the final production HTTP check confirmed `Vue 1`/`View 1` plus localized partner-logo alternatives.

---

# Step 4 Module Boundaries, SEO, and GEO Completion

This 2026-10-04 section supersedes the earlier statements that cookie-only locale routing and Step 4 SEO work remain open.

## Module and Export Boundaries

- All authored `src/**/*.ts(x)` static imports, re-exports, dynamic imports, and the global stylesheet import use `@/` aliases. Prisma-owned `src/generated/**` remains excluded from authored-source rules.
- ESLint and an AST-based regression test reject new `./` or `../` source imports and non-portable backslash aliases.
- Reusable multi-file modules now expose explicit `index.ts` APIs. Barrels use named value exports and `export type`; wildcard barrels are rejected. Required framework convention defaults remain defaults, while ordinary components use named exports.

## Locale Routing and Metadata

- Public pages now live under required `/fr` and `/en` segments. `/` redirects to `/fr`; public links and language switching use next-intl navigation, preserve the current route/query, and no longer depend on the locale POST/reload flow.
- One metadata builder supplies localized self-canonicals, reciprocal `en`/`fr` alternates, Open Graph, Twitter, and preview-safe robots directives. Every routable public page declares metadata; admin inherits `noindex,nofollow`. No `x-default` alternate is emitted because there is no locale-neutral selector URL.
- Category-product and domain relationships were extracted into shared route registries. Dynamic pages, static parameter generation, metadata validation, and the sitemap consume those registries; unknown entities render the not-found UI with `noindex` instead of indexable fallback copy.
- `SITE_URL` accepts only an absolute HTTP(S) origin and otherwise falls back to the owner-supplied current origin, `https://www.chelbab.vercel.app`.

## Crawl and AI Discovery

- Production `/robots.txt` allows ordinary public crawling and excludes `/admin` and `/api`. Preview deployments disallow all crawling and omit the sitemap. The wildcard production policy applies equally to conventional search engines and AI search crawlers; no unrequested training-specific opt-out was inferred.
- `/sitemap.xml` contains only real localized static, category, product, domain, and blog URLs, with matching language alternates and no fabricated modification dates or priorities.
- Safely escaped JSON-LD exposes only verified `Organization` and `WebSite` facts. No offers, ratings, review counts, prices, social profiles, or unsupported legal/business claims were added.
- No `llms.txt`, hidden AI-only copy, or special “AI ranking” markup was added. The implementation relies on crawlable localized URLs, consistent metadata, factual visible content, and standard structured data.
- Final review removed unsupported Organization claims, removed the unapproved `x-default` alternate, made preview crawl blocking explicit, and repaired every related-product and domain-category link against the shared route registries. Executable route-integrity and runtime SEO tests now cover these regressions.

## Final Validation

| Check | Result |
| --- | --- |
| Module-boundary/routing/metadata/discovery tests | 19/19 pass in final independent review |
| Route-integrity/runtime SEO tests | 4/4 pass in final independent review |
| Lint | Pass, zero warnings |
| Typecheck | Pass |
| Full tests | 88 pass / 3 pre-existing visual-contract failures of 91 |
| Production build | Pass; 263 pages generated, plus static `robots.txt` and `sitemap.xml` |
| Production HTTP | `/` 307 to `/fr`; catalogue 308 to localized galleries; representative localized pages and repaired product URLs return 200; canonicals, reciprocal alternates, localized links, robots, sitemap, and factual JSON-LD verified |
| Diff check | Pass; line-ending notices only |

The three failures are unchanged and outside this refactor: domain-detail image-height expectations, home technique image selection, and home challenge spacing. Next's streamed not-found response uses a 200 shell but includes the 404 UI and `<meta name="robots" content="noindex">`; this is retained rather than replacing the user-facing not-found page with an empty proxy response.

The final focused re-review confirmed all four earlier findings are closed and found no new Critical or Important regression in the requested scope.

## Remaining Deployment and Manual Work

- Set `SITE_URL` to the final production origin before deployment if it changes from the current Vercel URL, then resubmit the generated sitemap in Google Search Console.
- Validate deployed structured data and rich-result eligibility with Google's validators, and perform browser/assistive-technology checks in both languages.
- The mandatory Kluster review could not be run because no Kluster tool was exposed in this environment. No Kluster result is claimed.
