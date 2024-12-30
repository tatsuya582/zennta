import test, { expect } from "@playwright/test";

test("should render login page elements", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator('button:has-text("GitHubでログイン")')).toBeVisible();
  await expect(page.locator('button:has-text("Googleでログイン")')).toBeVisible();
  await expect(page.locator('button:has-text("Xでログイン")')).toBeVisible();
});

test("should link main page", async ({ page }) => {
  await page.goto("/login");
  await page.locator("text=Zennta").click();
  await expect(page.locator("text=Qiita一覧")).toBeVisible();
});
