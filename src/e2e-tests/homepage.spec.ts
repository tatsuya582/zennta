import test, { expect } from "@playwright/test";

test("Header should display the crrect logo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Zennta")).toBeVisible();
});

test("Navigation links should be clickabel", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav a")).toHaveCount(25);
});

test("Sidebar should display the crrect history section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=履歴")).toBeVisible();
});

test("should display Qiita and Zenn sections on the homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Qiita一覧")).toBeVisible();
  await expect(page.locator("text=Zenn一覧")).toBeVisible();
});
