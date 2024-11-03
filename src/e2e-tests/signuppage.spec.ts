import test, { expect } from "@playwright/test";

test("should render signup page elements", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.locator('button:has-text("GitHubで会員登録")')).toBeVisible();
  await expect(page.locator('button:has-text("Googleで会員登録")')).toBeVisible();
  await expect(page.locator('button:has-text("Xで会員登録")')).toBeVisible();
});

test("should link", async ({ page }) => {
  await page.goto("/signup");
  await page.locator("text=Zennta").click();
  await expect(page.locator("text=Qiita一覧")).toBeVisible();
});
