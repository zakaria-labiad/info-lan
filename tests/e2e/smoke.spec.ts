import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public client keeps its localized shell and has no serious accessibility violations", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("contact form and legal destinations are functional", async ({ page }) => {
  await page.goto("/fr/contact");
  await expect(page.getByRole("textbox", { name: /nom/i })).toBeVisible();
  await page.goto("/fr/privacy-policy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/confidentialité/i);
  await page.goto("/en/terms");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/terms/i);
});

test("fleet-style administrator login remains responsive and private", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: /connectez-vous|sign in/i })).toBeVisible();
  await expect(page.getByLabel(/e-?mail/i)).toBeVisible();
  await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/);
});
