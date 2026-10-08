# Step 4 SEO, GEO, and Accessibility Design

## Purpose and constraints

Make the existing Chelbab site understandable to crawlers and assistive technology while preserving its current visual design. Step 4 covers public URL identity, crawl and share metadata, factual machine-readable information, semantic structure, keyboard and focus behavior, form accessibility, and confirmed responsive defects. It does not implement the Step 3 performance design or Step 5 translation cleanup.

The current canonical origin supplied by the owner is `https://www.chelbab.vercel.app`. The planned future origin is `https://www.chelbab.com`. English and French are existing supported locales; French is the current default. No business address, telephone number, social account, legal text, rating, price, publication fact, or other claim may be invented. Existing user changes, including the inactive `_quote` folder, must be preserved.

## Verified starting state

The working tree is dirty with the existing Step 2 quote deactivation and related content/test changes; `AUDIT_REPORT.md` is untracked. The Step 3 performance design was committed, but its implementation was not performed. Step 4 must not describe Step 3 as complete or attribute its outstanding findings to Step 4.

| Check | Before Step 4 |
| --- | --- |
| ESLint | Pass |
| TypeScript `--noEmit` | Pass |
| Node tests | 56 pass, 3 fail out of 59; the failures assert earlier visual asset/spacing/height contracts |
| Next.js production build | Pass, Next.js 16.3.4; 48 pages generated; public routes are request rendered |

Current public route families are home, categories and category/product details, domains and domain details, contact, company/about/news/partners/reviews, blog and article details, downloads, FAQ, galleries, and guides. `/resources/catalogue` redirects to galleries and is not a separate index entry. `/admin`, `/admin/login`, `/admin/dashboard`, API routes, and the inactive `_quote` folder are not indexable public content. `/quote` must remain absent.

The root metadata currently uses `https://chelbab.example.com`; many pages have localized titles and descriptions, but category and domain indexes do not. No sitemap, robots route, canonical/hreflang strategy, Open Graph/Twitter metadata, or JSON-LD exists. A shared hero image exists at `/images/common/HeroImage.webp` (1122×842). No dedicated favicon, app icon, or manifest asset exists. The current locale is selected by cookie on shared URLs.

## Approach

### Selected: stable locale URLs and one metadata contract

Expose each public page at `/fr/...` and `/en/...`, with locale derived from the path. Redirect old unprefixed public paths to the French equivalent, preserving the path and query. Keep admin, API, framework assets, metadata files, and the inactive quote path outside public locale routing. Change the language switcher and all public internal navigation to retain the equivalent page when changing locale. A single site-origin setting defaults to the currently supplied Vercel origin and can be changed to the future custom domain at deployment.

This gives each localized page a stable canonical and reciprocal language alternate without inventing a language URL. The installed Next.js 16 guide documents locale segments and `proxy.ts`; the installed next-intl package supports `localePrefix: "always"`. Exact integration with the existing root layout and request configuration will be proven by a production build and rendered-route checks before the remaining SEO batch proceeds.

### Alternatives considered

- **Keep cookie-only URLs:** smaller routing diff, but English and French would still compete at the same URL. Canonical and hreflang signals could not truthfully describe both versions, leaving AUDIT-002 open.
- **Rebuild the full translation and routing system together:** could consolidate architecture, but it reaches into the Step 5 translation cleanup and creates unnecessary visual/content regression risk.

## Route and metadata architecture

Public pages live under a locale segment while their existing route meaning and page components remain intact. A locale-aware navigation layer generates public links, including dynamic detail links, blog pagination and filters, and the gallery redirect. Unsupported locale segments and invalid slugs return 404. Category records and category/product relationships become one shared authoritative source for page validation and sitemap generation; domain and blog entries are read from their existing real data. A product URL is valid only when the product belongs to that category. The current fallback that renders arbitrary category/product slugs must end.

The site-origin module accepts a validated absolute `SITE_URL` override and otherwise uses `https://www.chelbab.vercel.app`. The deployment owner can later set `SITE_URL=https://www.chelbab.com` without editing page metadata. Generated canonical, sitemap, Open Graph, and JSON-LD URLs all use this same origin. A deployment check will confirm the configured origin matches the intended production host. When `VERCEL_ENV` is `preview`, robots and page-level metadata block indexing; a missing `VERCEL_ENV` does not silently block a non-Vercel production deployment.

A shared server-side metadata helper takes the locale, route path, existing visible title/description, and optional existing image. It generates a self canonical, reciprocal `en`/`fr` alternates for actual counterpart pages, Open Graph URL/title/description/locale/site name, and corresponding Twitter card metadata. Next.js title templating adds `Chelbab` once. Route-level metadata must use the same content as the visible page, including dynamic article/category/domain/product data. Query-based blog filters and pagination canonicalize to the base blog listing unless a distinct indexable page is deliberately established. Unknown or private pages never receive indexable public metadata. No speculative `x-default` is added.

The root sitemap contains one entry per actual indexable locale URL, including real category/product, domain, and blog entities; it excludes admin/API, redirects, invalid slugs, and quote. Language alternates mirror page metadata. It omits guessed `lastModified`, priority, and change frequency. `robots.txt` allows production public pages, disallows admin and API paths, and points to the sitemap. Admin metadata is `noindex, nofollow`; production and preview output are checked separately where the environment permits. The existing hero image may serve as the common social preview with its verified dimensions; route-specific images are used only when locally valid and representative. Dedicated icons and a manifest are deferred until a suitable approved asset and application intent exist.

## Structured data and GEO

Add small, safely serialized JSON-LD for `Organization` and `WebSite` using only the confirmed name and configured origin. Additional `WebPage` or `Article` data is added only where visible content and its fields can be matched without guesswork. The existing blog dates, author profiles, and reviews require provenance review before they become structured claims. Do not emit Product offers, aggregate ratings, LocalBusiness address/phone, social profiles, fabricated breadcrumbs, or AI-targeted hidden copy. Escaping `<` in serialized JSON-LD follows the installed Next.js guidance.

GEO work consists of making real page topics, headings, entity relationships, and existing internal navigation explicit in ordinary semantic markup and consistent metadata. It makes no ranking or citation promise and adds no `llms.txt` by default.

## Semantics and accessibility

Make each public page expose one meaningful main landmark with a working skip link. The global animation wrapper must retain its behavior without creating a nested `<main>` around page-level landmarks; home and any other pages relying on that wrapper receive an explicit main region. Maintain the existing visual typography while correcting the blog detail hierarchy so the actual article title is the page H1. Replace headings used solely for dates or contact labels with appropriate text elements while retaining their CSS appearance. Preserve existing sections, content, and imagery.

The side menu uses the existing Base UI dialog primitives with a controlled open state: a real accessible title, initial focus, trapped focus, Escape/backdrop close, background inertness, and focus return to its trigger. Its current animation and visual dimensions remain. Name icon-only actions from their real purpose, remove incorrect ARIA, preserve native link/button roles, and ensure keyboard focus remains visible. Any placeholder social, phone, or legal destination without verified target must not be exposed as a misleading interactive link; keep its visible presentation where feasible and record required business input.

Review informative/decorative/functional image alternatives, mobile navigation, gallery/dialog controls, product tabs, menus, filters, carousels, and reduced-motion behavior. Correct only confirmed barriers. Keep the current palette, spacing, imagery, typography, and animation design; a needed focus or overflow correction should use the smallest visible change.

Contact and blog-comment controls receive correct labels, autocomplete values, input types, and perceivable validation relationships where the existing form flow supports them. Their missing submission backend remains AUDIT-001 until a delivery and storage contract is supplied; Step 4 must not claim those forms submit successfully or invent a destination. The inactive quote form remains preserved unchanged inside `_quote`.

## Responsive and verification strategy

Inspect representative public pages and the menu/gallery/form interactions at small mobile, normal mobile, tablet, desktop, and large desktop widths, including French and English text expansion. Check horizontal overflow, clipped controls, touch targets, fixed/sticky overlap, dialog height, zoom/reflow, and reduced motion. Apply only reproducible fixes with no design change. Browser/automated accessibility checks are evidence for specific behavior, not proof of full WCAG conformance; screen-reader and real-device checks remain manual if unavailable.

Work in the brief's A–G batch order. Before each fix, reopen the source and confirm the audit finding still applies. After each meaningful batch, inspect the diff and run relevant tests, ESLint, TypeScript, and a production build where metadata/routing changes warrant it. Verify rendered HTML, status codes, robots, sitemap, canonical/hreflang, social metadata, JSON-LD, and both locale paths in a production server. Compare final lint/typecheck/test/build results to the recorded baseline; no new failures are acceptable.

`AUDIT_REPORT.md` retains all existing IDs and evidence, updates only findings actually resolved, and gains the requested Step 4 summary and before/after validation table. Likely tracked items are AUDIT-002, AUDIT-004, AUDIT-008, AUDIT-009, AUDIT-010, and AUDIT-013; their final statuses depend on evidence. Record production-origin migration, unverified business/legal links, form delivery, icon/manifest asset, and any incomplete manual browser or screen-reader checks as explicit remaining work. Stop after Step 4; do not begin Step 5.

## Risks and controls

- **Locale migration:** exercise every public route, unprefixed redirect, existing query, language switch, and private/API exclusion before considering URL migration complete.
- **Metadata drift:** derive all absolute URLs from one origin helper and all dynamic paths from the same validated content data used by the page.
- **Unsupported structured claims:** omit any schema field whose source cannot be matched to verified visible content.
- **Modal or responsive visual drift:** compare before/after browser rendering and keyboard behavior; retain existing CSS layout and motion intent.
- **Dirty worktree:** stage and commit only the Step 4 specification now. During implementation, do not overwrite the existing Step 2 changes or imply the Step 3 design is implemented.

## Definition of done

Step 4 is complete only after all public and private route families have been classified, approved URL/metadata architecture is implemented, confirmed SEO and accessibility barriers are fixed, generated output and interactive behavior are checked, no new lint/type/test/build regressions remain, and the audit report documents fixes, deferrals, manual checks, and the current origin. Step 5 begins only on a later request.
