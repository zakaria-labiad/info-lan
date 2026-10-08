# Admin/Client Frontend Separation Implementation Plan

**Goal:** Separate the admin and public-client frontend into strict ownership boundaries without changing URLs, behavior, translations, metadata, or backend code.

**Architecture:** Route groups own the admin and client route trees. Components, animations, types, frontend libraries, and i18n helpers live below explicit `admin`, `client`, or neutral `shared` boundaries. Admin and client frontend modules may use neutral shared helpers but may not import from each other.

**Verification:** Add the architecture contract first, migrate paths atomically, update path-sensitive tests without changing behavior assertions, then run lint, TypeScript, the full Node test suite, and the production build. The three known visual-contract failures remain out of scope.

## Tasks

1. Add a failing module-boundary contract for the target paths and import rules.
2. Move and merge the client/admin App Router trees while preserving public URLs.
3. Separate admin and client component systems and public barrels.
4. Move client-only animations, types, libraries, and i18n helpers.
5. Update imports and path-sensitive tests, then run complete verification and review.

## Constraints

- Preserve the existing dirty working tree and do not reset or overwrite unrelated work.
- Do not change `src/server`, `src/generated`, database interfaces, or dependencies.
- Keep required Next.js and next-intl convention files at their framework-defined locations.
- Do not add compatibility shims at obsolete import paths.
- Run Kluster after file changes if its tool is available; otherwise report that it was unavailable.
