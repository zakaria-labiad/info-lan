# Step 3 Performance Design

## Purpose

Improve production performance with measured, low-risk changes while preserving the application's intended appearance and behavior. This step targets client JavaScript, hydration, message payloads, animation loading, fonts, and image loading. It does not begin the SEO/GEO, localization-cleanup, accessibility-redesign, or broad visual-design work reserved for later steps.

## Non-negotiable visual constraints

- Do not change layout, colors, copy, imagery intent, responsive layout intent, or interaction semantics.
- Keep Open Sans as the body family and Montserrat as the existing intended heading family.
- Preserve animation sequences, durations, easing intent, and reduced-motion behavior unless a code-only loading change is visually equivalent.
- Do not remove visible sections, controls, navigation entries, or content.
- If an optimization requires a visible compromise, document it as a manual decision instead of applying it.

## Verified baseline

The baseline was captured from the current dirty worktree without overwriting the existing Step 2 changes.

| Area | Baseline |
| --- | --- |
| Lint | Pass |
| Typecheck | Pass |
| Tests | 56 of 59 pass; the three failures are the previously documented visual-contract drift |
| Production build | Pass; 48 pages generated and every route is dynamically rendered |
| Emitted client chunks | 31 JavaScript files, 1,194,165 uncompressed bytes in total |
| Home referenced JavaScript | 934,782 uncompressed bytes, including framework/runtime files |
| About referenced JavaScript | 913,509 uncompressed bytes, including framework/runtime files |
| Contact referenced JavaScript | 899,714 uncompressed bytes, including framework/runtime files |
| Global animation chunk | 135,993 uncompressed bytes containing GSAP and ScrollTrigger |
| Production home HTML | 346,666 UTF-8 bytes and 19 initial script requests |
| Production about HTML | 227,979 UTF-8 bytes and 19 initial script requests |
| Production contact HTML | 216,983 UTF-8 bytes and 19 initial script requests |
| Response caching | Measured pages return private, no-store/no-cache headers |
| French message catalog | 170,133 source bytes; header/footer/side-menu subset is 3,142 serialized bytes |
| Public images | 97 files and 7,399,027 bytes; two files exceed 150 KB |
| Core Web Vitals | Not measured; Lighthouse and field data are unavailable |

Build-artifact byte counts are uncompressed on-disk measurements. They are comparison metrics, not claimed network transfer sizes.

## Approach selection

### Selected: balanced runtime optimization

Apply the highest-confidence changes that remove initial browser work without changing URLs or design: narrow client messages, move static home/about markup back to the server boundary, defer global animation implementation code, correct font wiring, and stop eager loading below-the-fold images.

### Rejected for Step 3: locale-routing and static-generation rewrite

Locale-prefixed URLs could unlock stronger static caching, but they change public routing, canonical behavior, and language semantics. That belongs to Step 4 and is not safe to combine with this performance batch.

### Rejected: image/font hints only

This would be low risk but would leave the largest verified payload and hydration findings unresolved.

## Architecture

### 1. Client message payload — AUDIT-005

The root `NextIntlClientProvider` will receive only namespaces required by global Client Components. Server Components will continue resolving the complete locale catalog through the existing request configuration, so visible content and translation behavior remain unchanged.

The gallery's interactive Client Component will receive a route-scoped provider containing only `pages.resources.galeries`. No full page catalog will be added back to the global provider. Home hero copy will move to server-rendered markup, avoiding a page-specific client message requirement.

Expected impact: reduce serialized locale data in every public response. Static generation and cache headers remain unchanged because cookie-based locale routing is deferred to Step 4; AUDIT-005 will therefore be marked partially fixed.

### 2. Server rendering and hydration — AUDIT-006

`HomeContent` and `AboutContent` will become Server Components. Their existing static sections will be composed on the server and passed as `children` through small Client Component motion shells. Passing server-rendered children through a client shell preserves the DOM and animation selectors without placing the section implementations in the client module graph.

The home hero will use the same composition pattern: translated/static markup remains server-rendered, while a narrow client shell owns the element ref and existing entrance effect. Existing genuinely interactive islands, including rails, menus, galleries, filters, dialogs, and controls, remain client-side.

Expected impact: fewer client modules and less hydration on home/about without changing their rendered markup.

### 3. Animation delivery and interaction

Global motion wrappers will load their existing animation modules with focused dynamic imports inside effects. Header entrance code will be deferred; the scroll shadow will use its existing CSS transition path instead of invoking GSAP on every state change. The side-menu animation module will not load until the menu is first opened, after which its existing GSAP timeline remains responsible for opening and closing.

Home/about route animation code may remain route-specific where it is required. Direct module paths will be used instead of the animation barrel where that prevents unrelated animation modules from joining the same initial graph. Async effects must guard against unmounts and clean up requestAnimationFrame handles, observers, timelines, and GSAP contexts.

Expected impact: remove GSAP/ScrollTrigger from initial globally referenced route scripts while retaining the same visible animations after hydration.

### 4. Fonts — AUDIT-011

`next/font` will expose Open Sans and Montserrat through distinct internal CSS variables. Tailwind/global typography tokens will map body text to Open Sans and headings/heading utilities to Montserrat without circular custom-property references.

The duplicate legacy Montserrat `@font-face` declarations will be removed so the browser has one font-loading path. Existing TTF files will remain in `public/fonts` during Step 3; deleting assets is unnecessary for the runtime fix and belongs to later confirmed cleanup.

Expected impact: restore the intended existing typography family, retain `next/font` fallback adjustment, and prevent duplicate legacy font requests. No new font family, size, weight, or typography design will be introduced.

### 5. Images — AUDIT-012

The two below-the-fold home-intro images will stop using priority loading. Their `sizes` values will be corrected to match the existing mobile and desktop layout. Above-the-fold hero images and the visible header logo will keep their current preload intent.

Remote Chelbab domain images will remain on their current raw-image path in this step because the local environment cannot verify that the production image optimizer can fetch them. Product imagery ownership, external durability, and CDN decisions remain manual/deferred.

Expected impact: reduce competition with likely LCP resources without changing image sources, crop, quality, or layout.

### 6. Data, caching, third-party code, and dependencies

The application has no meaningful client/server data-fetch waterfall in the public route tree; most content is local JSON or page-local data. No speculative caching or revalidation interval will be added.

No analytics, chat, map embed, tag manager, or other blocking third-party script was found. No dependency will be removed or moved because the repository-mandated Kluster dependency check is unavailable. AUDIT-015 remains deferred.

## Test strategy

Source-contract tests will be written before implementation to verify:

- Home/about section implementations are not client roots.
- Motion shells contain the client effects while accepting server-rendered children.
- Global animation code uses focused dynamic imports and retains cleanup guards.
- The root provider exposes only approved global client namespaces.
- The gallery receives only its route-specific message namespace.
- Below-the-fold home images are lazy by default and use accurate `sizes`.
- Font variables map to distinct `next/font` variables and legacy font-face declarations are absent.
- Existing quote deactivation and all previously passing tests remain unchanged.

After each meaningful batch, run the relevant tests, ESLint, TypeScript, and a production build. The final pass also repeats client-manifest byte counts and production HTML/script measurements using the same commands and definitions as the baseline.

Production visual smoke checks will cover home and about at 1440×900 and 375×812, plus representative gallery/domain routes. Checks will compare layout, content, imagery, responsive behavior, and animation presence rather than asserting synthetic performance scores.

## Audit documentation

`AUDIT_REPORT.md` will preserve existing history and update:

- AUDIT-005 to `PARTIALLY FIXED IN STEP 3` unless cookie-based dynamic rendering is also safely resolved without changing locale URLs.
- AUDIT-006 to `FIXED IN STEP 3` if home/about static sections leave the client graph and measured route JavaScript decreases.
- AUDIT-011 to `FIXED IN STEP 3` after computed font behavior and build font artifacts are verified.
- AUDIT-012 to `PARTIALLY FIXED IN STEP 3` because remote optimizer behavior remains unverified.

The required Step 3 Performance Summary will include baseline and after measurements, exact files, evidence, validation, explicit `NOT MEASURED` Core Web Vital entries, and deferred work.

## Risks and controls

- **Animation flash or delayed initialization:** keep server markup visible by default, initialize effects after mount, and preserve cleanup/cancellation paths.
- **Missing client translations:** cover every remaining `useTranslations` Client Component with either the global subset or a route-scoped provider.
- **Font appearance drift:** retain the existing Open Sans/Montserrat families and compare production rendering before accepting the batch.
- **Incorrect image candidate selection:** preserve dimensions and crop classes; change only loading priority and verified `sizes` metadata.
- **Dirty-worktree overlap:** edit only Step 3 files, inspect every diff, and do not overwrite the existing Step 2 changes.

## Definition of done

Step 3 is complete when the selected optimizations are implemented in verified batches; lint, typecheck, and production build pass; no new test failures exist; measured before/after artifact and production-response results are documented; visual smoke checks find no design regression; and the audit report contains the required Step 3 summary. Step 4 will not start automatically.
