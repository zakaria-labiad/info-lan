<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:local-verification-rules -->

# Local verification rules

Kluster is retired and must not be used as a development gate. Use the
repository's local verification workflow instead.

## Code and content changes

- Use test-driven development for behavior changes: add a focused failing test,
  confirm the expected failure, implement the smallest fix, then confirm the
  focused test and the full relevant suite pass.
- After each logical implementation slice, inspect the complete diff for
  correctness, security, accidental client UI changes, secrets, debug output,
  and unrelated edits.
- Run `git diff --check` after edits and resolve every whitespace or conflict
  marker error.
- Never hide, delete, weaken, or skip a failing test to make a verification gate
  pass. Diagnose the root cause and report any pre-existing failure explicitly.

## Dependency changes

- Before adding or upgrading a dependency, verify its official package
  metadata, supported Node.js range, license, maintenance status, and known
  security advisories.
- Prefer the smallest supported dependency set and preserve the lockfile.
- After dependency changes, run the package manager's audit command and the
  project's lint, type-check, tests, and production build.

## Completion gate

Before claiming a task is complete, run the relevant focused tests followed by
the repository-wide lint, type-check, test, production build, and required E2E
checks. Record exact commands and results; a passing build never substitutes for
tests or review.

<!-- END:local-verification-rules -->
