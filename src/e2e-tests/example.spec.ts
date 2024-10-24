import test, { expect } from "@playwright/test";

test("Header should display the crrect logo", async ({ page }) => {
  await page.goto("/");
  const logo = await page.locator("text=Zennta");
  await expect(logo).toBeVisible();
});

test("Navigation links should be clickabel", async ({ page }) => {
  await page.goto("/");
  const navLinks = page.locator("nav a");
  await expect(navLinks).toHaveCount(5);
});
