# Chelbab Admin CMS and Full Remediation Implementation Plan

**Goal:** Deliver the approved secure bilingual CMS and admin application while
preserving the existing public-client UI.

**Reference UI:** `D:\carrier\work\docs\future-engineer\fleet\fleet-dashboard`.
Reuse its general-purpose login, shell, navigation, table, form, dialog,
responsive, color, spacing, and typography patterns; exclude fleet-specific
features and dependencies.

**Workspace:** Implement in the current dirty working tree. Preserve all
pre-existing changes and never use destructive Git operations.

**Verification:** Kluster has been retired. Follow `AGENTS.md`: TDD for behavior
changes, dependency metadata and advisory review, focused and full tests,
diff/security review, lint, type-check, production build, E2E, accessibility,
route crawl, and visual regression.

## Global constraints

- The public client design is frozen. Backend wiring, accessibility, metadata,
  security, performance, and broken behavior may change without redesigning it.
- Public blog comments are flat and moderated; remove reply controls and nested
  replies.
- Admin defaults to French and supports English.
- SQLite is required for local development and tests; PostgreSQL is required in
  production with automated schema parity.
- Use Resend for email and Cloudinary for new media.
- All admin authorization is enforced server-side; redirects are convenience
  only.

## Tasks

1. **Baseline, dependencies, security, and CI**
   - Freeze current public behavior with contract and visual baselines.
   - Resolve the three stale source-contract tests without changing client UI.
   - Upgrade Next.js and add only the approved admin, editor, email, media,
     sanitization, testing, and accessibility dependencies.
   - Add complete test/typecheck/database-parity scripts and CI gates.

2. **Dual database platform and content migration**
   - Add structurally equivalent SQLite and PostgreSQL Prisma schemas,
     migrations, protocol-based generation, and schema-parity tests.
   - Replace polymorphic content ownership with explicit relations.
   - Add idempotent importers for existing bilingual blog and catalog content.

3. **Fleet-style admin shell and authentication**
   - Port the reference login, inset sidebar, navbar, breadcrumb, menus,
     language switcher, loading, empty, and responsive patterns under an
     isolated `.admin-theme`.
   - Implement secure password auth, short-lived access sessions, rotated
     refresh tokens, revocation, origin checks, throttling, reset flow, account
     bootstrap, and ADMIN/EMPLOYEE permissions.

4. **Contact capture and admin inbox**
   - Wire the unchanged public contact form to validated, rate-limited storage.
   - Add message list/detail, filters, assignments, notes, archive/bulk actions,
     Resend replies, idempotent delivery logging, and verified webhooks.

5. **Blog, Medium-style editor, and comments**
   - Add bilingual post/category/tag/comment management.
   - Store Tiptap JSON canonically with autosave revisions, preview, scheduling,
     SEO, locale readiness, and publication revalidation.
   - Render database posts through current public components and moderate only
     top-level visitor comments.

6. **Products, categories, and Cloudinary media**
   - Add bilingual catalog editing, relationships, ordering, publishing, and
     galleries while preserving every public URL and client component contract.
   - Add signed restricted uploads and referenced-media deletion protection.

7. **Users, settings, audit, remaining fixes, and final acceptance**
   - Add dashboard, users, account, audit, settings, legal documents, SEO,
     accessibility, security headers, caching, payload splitting, and docs.
   - Complete unit, integration, contract, auth, E2E, accessibility, visual,
     route-crawl, performance, lint, typecheck, build, and security gates.

## Shared interfaces

- Admin list APIs return `{data, meta}` and item APIs return `{data}`; failures
  return `{error: {code, message, fieldErrors?}}`.
- Editorial records use integer revisions for optimistic concurrency.
- Bilingual content uses shared entity state plus explicit French and English
  translation records with locale-specific slugs and readiness.
- Recoverable business records use soft deletion; audit records are immutable.

