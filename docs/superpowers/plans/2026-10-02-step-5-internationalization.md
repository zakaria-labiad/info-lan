# Step 5 Internationalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current English and French message system complete, consistent, and free of confirmed unused copy without changing the site's visual design.

**Architecture:** Keep the current next-intl 4.14.2 cookie locale contract while the approved Step 4 locale-URL design is unimplemented. Reuse the existing message namespaces, add focused shared/admin messages where necessary, and test the complete locale trees plus dynamic families before any deletion.

**Tech Stack:** Next.js 16.3.4, React 19, TypeScript, next-intl 4.14.2, Node test runner.

**Spec:** The owner's Step 5 audit brief at `C:\Users\User\.codex\attachments\5755811a-b79b-414c-8df7-250c74b1a162\Pasted text.txt` and `AUDIT_REPORT.md`.

## Global Constraints

- Supported locales are `en` and `fr`; `fr` is the configured default.
- Preserve visual layout, typography, colors, animation, and existing meaning.
- Do not invent company, product, price, address, legal, or other business claims.
- Preserve the inactive `_quote` page and its translations.
- Preserve pre-existing dirty changes and the committed Step 4 design.
- Do not implement Step 4 locale URL or SEO architecture here.
- Run the mandatory Kluster review after edits if that tool becomes available; currently no Kluster tool is exposed.

## Review Focus

- Dynamic keys built from product/category/domain IDs must remain resolvable in both locales: cover representative full families in Task 1.
- Arrays of blog and gallery content can match top-level shape while differing by index: compare paths including array indexes in Task 1.
- ICU interpolation names can drift while JSON structure stays equal: compare parsed argument signatures in Task 1.
- Root/global error boundaries have different provider availability: verify each localization path in Task 2.
- Cookie locale switches should preserve the current URL and active `<html lang>`: exercise both locales in Task 3.

---

### Task 1: Message integrity and usage inventory

**Files:**
- Create: `tests/i18n-integrity.test.mjs`
- Inspect: `src/messages/**`, `src/i18n/request.ts`, all translation call sites

**Interfaces:**
- Consumes: current JSON files and next-intl namespace assembly.
- Produces: repeatable parity, ICU, and dynamic-family checks; verified inventory for cleanup.

- [ ] Write a failing test for newly required shared UI keys and inspect its expected failure.
- [ ] Add parity checks across every locale file, including array indexes, ICU argument/tag signatures, and empty values.
- [ ] Inventory static translation calls and data-derived dynamic key families; classify uncertain keys for preservation.
- [ ] Run `node --test tests/i18n-integrity.test.mjs` and the full suite; record the three existing failures separately.

### Task 2: Localize verified user-facing literals

**Files:**
- Modify: `src/messages/en/common.json`, `src/messages/fr/common.json`, selected existing page messages, `src/i18n/request.ts`
- Modify: root/client/admin error/loading/not-found/page components, shared controls, relevant alt/ARIA strings, and page metadata where strings are confirmed user-facing
- Create only if needed: `src/messages/{en,fr}/admin/pages.json`

**Interfaces:**
- Consumes: `getTranslations` for Server Components and `useTranslations` under the existing provider for Client Components.
- Produces: matching en/fr UI labels with unchanged DOM behavior and visual classes.

- [ ] Confirm each literal is user-facing and locate an existing equivalent key before adding one.
- [ ] Extend the failing message test with exact required keys and locale parity.
- [ ] Implement the smallest translation changes, preserving semantic context and interpolation names.
- [ ] Verify both locale outputs and run lint, typecheck, relevant tests, and build.

### Task 3: Locale behavior and metadata correctness

**Files:**
- Inspect/modify as needed: `src/components/shared/language-switcher.tsx`, `src/app/api/locale/route.ts`, `src/app/layout.tsx`, current metadata pages
- Test: `tests/i18n-integrity.test.mjs` and production HTTP checks

**Interfaces:**
- Consumes: `locales`, `defaultLocale`, existing locale cookie, and page messages.
- Produces: correct current-locale presentation, translated metadata strings within the current routing contract, and documented Step 4 URL dependency.

- [ ] Write a failing test only for a confirmed current behavior defect.
- [ ] Apply targeted correction without changing public URL architecture.
- [ ] Verify `/` with `locale=fr` and `locale=en`, direct invalid locale paths, current URL preservation, and `<html lang>`.

### Task 4: High-confidence unused key cleanup

**Files:**
- Modify only verified obsolete locale JSON groups and `src/i18n/request.ts` imports; adjust tests that assert obsolete files if deletion is proven.
- Test: `tests/i18n-integrity.test.mjs`

**Interfaces:**
- Consumes: Task 1 usage inventory, all source/config references, dynamic key ranges, and Step 2 quote preservation rule.
- Produces: exact removed-key list with evidence; no missing code-used key.

- [ ] Recheck each candidate namespace against literal, dynamic, server, metadata, route, and configuration use.
- [ ] Write a failing test expressing the desired absence or retained dynamic coverage.
- [ ] Remove only high-confidence unused groups in both locales and update assembly/tests accordingly.
- [ ] Rebuild inventory and run full validation.

### Task 5: Audit documentation and final verification

**Files:**
- Modify: `AUDIT_REPORT.md`

**Interfaces:**
- Consumes: recorded before/after inventory, edits, unresolved Step 4 routing state, and validation results.
- Produces: Step 5 summary with exact added/removed keys and preserved dynamic families.

- [ ] Update existing AUDIT IDs and add only verified new findings.
- [ ] Record before/after counts, all added/removed keys, limitations, and manual review items.
- [ ] Review the complete diff for meaning/style/URL changes.
- [ ] Run lint, `tsc --noEmit`, `node --test`, production build, and final i18n checks; report any pre-existing failures by name.
