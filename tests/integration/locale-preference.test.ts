import assert from "node:assert/strict";
import test from "node:test";

import {
  INFO_LAN_LOCALE_STORAGE_KEY,
  resolvePreferredLocale,
} from "../../src/i18n/client/locale-preference";

test("saved INFO-L@N locale overrides the browser preference", () => {
  assert.equal(INFO_LAN_LOCALE_STORAGE_KEY, "info-lan-locale");
  assert.equal(resolvePreferredLocale("fr", "en-GB"), "fr");
  assert.equal(resolvePreferredLocale("en", "fr-MA"), "en");
});

test("English browser preferences select English when no choice is saved", () => {
  assert.equal(resolvePreferredLocale(null, "en"), "en");
  assert.equal(resolvePreferredLocale(undefined, "en-US"), "en");
});

test("unsupported, absent, or invalid preferences fall back safely", () => {
  assert.equal(resolvePreferredLocale(null, "fr-MA"), "fr");
  assert.equal(resolvePreferredLocale(null, "ar-MA"), "fr");
  assert.equal(resolvePreferredLocale(null, undefined), "fr");
  assert.equal(resolvePreferredLocale("de", "en-US"), "en");
});
