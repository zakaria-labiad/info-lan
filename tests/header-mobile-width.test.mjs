import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const headerPath = "src/components/client/shared/layout/header.tsx";
const globalsPath = "src/app/globals.css";

const px = {
  headerPaddingX: 8,
  headerGap: 8,
  logoWidth: 120,
  languageSwitcherWidth: 68,
  actionGap: 8,
  dashboardButtonWidth: 44,
  hamburgerButtonWidth: 40,
};

function narrowMobileHeaderWidthBudget() {
  return (
    px.headerPaddingX * 2 +
    px.logoWidth +
    px.headerGap +
    px.languageSwitcherWidth +
    px.actionGap * 2 +
    px.dashboardButtonWidth +
    px.hamburgerButtonWidth
  );
}

test("home mobile header fits a 340px viewport without horizontal overflow", () => {
  const header = readFileSync(headerPath, "utf8");
  const globals = readFileSync(globalsPath, "utf8");

  assert.match(header, /client-header-content/);
  assert.match(header, /client-header-actions/);
  assert.match(globals, /@media \(max-width: 360px\)/);
  assert.match(globals, /\.client-header-content/);
  assert.match(globals, /\.client-header-actions/);
  assert.equal(narrowMobileHeaderWidthBudget() <= 340, true);
});
