import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import test from "node:test";

const protectedRoot = join(process.cwd(), "src", "app", "(admin)", "admin", "(protected)");

async function pageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return pageFiles(path);
    return entry.name === "page.tsx" ? [path] : [];
  }));
  return nested.flat();
}

test("protected admin pages authenticate before database access", async () => {
  const failures = [];

  for (const path of await pageFiles(protectedRoot)) {
    const source = await readFile(path, "utf8");
    const firstQuery = source.search(/\bprisma\./);
    if (firstQuery === -1) continue;

    const guardCall = source.search(/await requireAdminPageUser\s*\(/);
    if (guardCall === -1 || guardCall > firstQuery) {
      failures.push(relative(process.cwd(), path));
    }
  }

  assert.deepEqual(failures, []);
});
