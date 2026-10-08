import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import test from "node:test";

const sourceRoots = ["src/components/client", "src/app/(client)"];
const sourceExtensions = new Set([".css", ".js", ".jsx", ".ts", ".tsx"]);
const allowedRadiusClasses = new Set([
  "rounded-md",
  "rounded-md!",
  "rounded-full",
  "rounded-full!",
]);

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }

    return sourceExtensions.has(extname(entry.name)) ? [entryPath] : [];
  });
}

test("public client radius utilities use rounded-md except rounded-full", () => {
  const invalidRadiusClasses = sourceRoots.flatMap(sourceFiles).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    const radiusClasses = source.match(/\brounded(?:-[\w[\]./%()-]+)?!?/g) ?? [];

    return radiusClasses
      .filter((radiusClass) => !allowedRadiusClasses.has(radiusClass))
      .map((radiusClass) => `${relative(".", file)}: ${radiusClass}`);
  });

  assert.deepEqual(invalidRadiusClasses, []);
});
