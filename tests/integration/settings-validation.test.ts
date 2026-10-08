import assert from "node:assert/strict";
import test from "node:test";
import { siteSettingsInputSchema } from "../../src/server/settings/validation";

test("site settings accept empty optional destinations but reject unsafe URLs", () => {
  const base = { companyName: "INFO-L@N", contactEmail: "", contactPhone: "", addressFr: "", addressEn: "", publicSiteUrl: "", emailFromName: "", emailFromAddress: "", facebookUrl: "", instagramUrl: "", linkedinUrl: "", youtubeUrl: "", seoTitleFr: "", seoTitleEn: "", seoDescriptionFr: "", seoDescriptionEn: "", mapLatitude: null, mapLongitude: null };
  assert.equal(siteSettingsInputSchema.safeParse(base).success, true);
  assert.equal(siteSettingsInputSchema.safeParse({ ...base, facebookUrl: "javascript:alert(1)" }).success, false);
});
