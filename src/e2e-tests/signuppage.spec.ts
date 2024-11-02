import test, { expect } from "@playwright/test";

test("should render signup page elements", async ({ page }) => {
  await page.goto("/signup");
  const gitHubBottun = await page.locator('button:has-text("GitHubで会員登録")');
  const googleBottun = await page.locator('button:has-text("Googleで会員登録")');
  const xBottun = await page.locator('button:has-text("Xで会員登録")');
  await expect(gitHubBottun).toBeVisible();
  await expect(googleBottun).toBeVisible();
  await expect(xBottun).toBeVisible();
});
