import { expect, test } from "@playwright/test";

test("home keeps the original hero proof row and presents trustworthy IT service cues", async ({
  page,
}) => {
  await page.goto("/en");

  const hero = page.locator("main section").first();
  await expect(
    hero.getByRole("heading", {
      level: 1,
      name: "Your IT, supplied, installed and maintained.",
    }),
  ).toBeVisible();
  await expect(hero.locator('img[src*="info-lan-hero.webp"]')).toHaveCount(1);
  await expect(hero.locator("[data-hero-avatar]")).toHaveCount(3);
  await expect(hero).toContainText("Equipment, installation");
  await expect(hero).toContainText("and IT maintenance");
  await expect(hero.getByText("Equipment & supplies")).toHaveCount(0);

  const process = page
    .locator("section")
    .filter({ hasText: "From need to maintenance" });
  const processCards = process.locator("article");
  await expect(processCards).toHaveCount(2);
  await expect(processCards.locator("svg")).toHaveCount(2);
  await expect(processCards.locator("img")).toHaveCount(0);

  const stats = page.locator("section").filter({ hasText: "year founded" });
  await expect(stats).toContainText("2005");
  await expect(stats).toContainText("20+");
  await expect(stats).toContainText("3");
  await expect(stats).toContainText("2");
  await expect(stats.locator("article")).toHaveCount(4);

  const reviews = page
    .locator("section")
    .filter({ hasText: "Practical answers to real needs" });
  const firstReview = reviews.locator("article").first();
  await expect(firstReview.locator("svg.lucide-star")).toHaveCount(5);
  await expect(firstReview.locator('[data-slot="avatar"]')).toHaveText("EW");

  const footer = page.locator("footer");
  await expect(footer).toHaveCSS("background-color", "rgb(255, 255, 255)");
});
