import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const rootLayoutPath = "src/app/layout.tsx";
const appMotionPath = "src/components/client/shared/layout/app-motion.tsx";
const homeVideoSectionPath =
  "src/components/client/home/sections/video-section.tsx";

test("root html declares intentional smooth scroll behavior for Next navigation", () => {
  const layout = readFileSync(rootLayoutPath, "utf8");

  assert.match(layout, /data-scroll-behavior="smooth"/);
});

test("home video reveal animation is owned by home scroll reveals", () => {
  const videoSection = readFileSync(homeVideoSectionPath, "utf8");

  assert.match(videoSection, /data-home-reveal/);
  assert.match(videoSection, /data-home-reveal-child/);
  assert.doesNotMatch(videoSection, /data-app-reveal/);
});

test("app-wide reveal animation waits until after nested route hydration", () => {
  const appMotion = readFileSync(appMotionPath, "utf8");

  assert.match(appMotion, /requestAnimationFrame/);
  assert.match(appMotion, /cancelAnimationFrame/);
  assert.match(appMotion, /createAppScrollReveal\(root\)/);
});
