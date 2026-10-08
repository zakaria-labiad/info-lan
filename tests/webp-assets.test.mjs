import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const publicImagesDir = "public/images";
const scannedSourceDirs = ["src", "tests"];

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

test("public image assets and code references use WebP instead of PNG", () => {
  const pngAssets = listFiles(publicImagesDir).filter(
    (file) => path.extname(file).toLowerCase() === ".png",
  );

  assert.deepEqual(pngAssets, []);

  const pngReferences = scannedSourceDirs.flatMap((dir) =>
    listFiles(dir)
      .filter((file) => /\.(tsx?|mjs|json)$/.test(file))
      .filter((file) => path.normalize(file) !== path.normalize("tests/webp-assets.test.mjs"))
      .filter((file) => readFileSync(file, "utf8").includes(".png")),
  );

  assert.deepEqual(pngReferences, []);
  assert.equal(existsSync("public/images/info-lan-logo.webp"), true);
  assert.equal(existsSync("public/images/home/info-lan-hero.webp"), true);
});
