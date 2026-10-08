import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const layoutPath = "src/app/(client)/[locale]/layout.tsx";
const footerPath = "src/components/client/shared/layout/footer.tsx";
const footerMotionPath = "src/components/client/shared/layout/footer-motion.tsx";
const scrollRevealPath = "src/animations/client/scroll-reveal.ts";

test("client footer owns its scroll reveal animation", () => {
  assert.equal(
    existsSync(footerMotionPath),
    true,
    "footer motion wrapper is missing",
  );

  const layout = readFileSync(layoutPath, "utf8");
  const footer = readFileSync(footerPath, "utf8");
  const footerMotion = readFileSync(footerMotionPath, "utf8");
  const scrollReveal = readFileSync(scrollRevealPath, "utf8");

  assert.match(layout, /<Footer\s*\/>/);
  assert.match(footer, /<FooterMotion\b/);
  assert.match(footer, /<\/FooterMotion>/);
  assert.match(footer, /data-footer-intro/);
  assert.match(footer, /data-footer-reveal/);
  assert.doesNotMatch(footer, /data-home-(?:intro|reveal)/);

  assert.match(footerMotion, /"use client"/);
  assert.match(footerMotion, /createFooterScrollReveal/);
  assert.match(footerMotion, /usePathname/);

  assert.match(scrollReveal, /export function createFooterScrollReveal/);
  assert.match(scrollReveal, /\[data-footer-intro\]/);
  assert.match(scrollReveal, /\[data-footer-reveal-child\]/);
});
