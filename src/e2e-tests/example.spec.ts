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

test("Sidebar should display the crrect history section", async ({ page }) => {
  await page.goto("/");
  const historySection = await page.locator("text=履歴");
  await expect(historySection).toBeVisible();
});

test("should display Qiita and Zenn sections on the homepage", async ({ page }) => {
  await page.goto("/");
  const qiitaSection = await page.locator("text=Qiita一覧");
  const zennSection = await page.locator("text=Zenn一覧");
  await expect(qiitaSection).toBeVisible();
  await expect(zennSection).toBeVisible();
});

test("should render signup page elements", async ({ page }) => {
  await page.goto("/signup");
  const gitHubBottun = await page.locator('button:has-text("GitHubで会員登録")');
  const googleBottun = await page.locator('button:has-text("Googleで会員登録")');
  const xBottun = await page.locator('button:has-text("Xで会員登録")');
  await expect(gitHubBottun).toBeVisible();
  await expect(googleBottun).toBeVisible();
  await expect(xBottun).toBeVisible();
});
