import test, { expect } from "@playwright/test";

test("should render privacy page elements", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page.locator("h2", { hasText: "Zenntaのプライバシーポリシー" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第1条 個人情報の収集" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第2条 個人情報の使用目的" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第3条 個人情報の共有と揭示" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第4条 個人情報の保守" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第5条 個人情報の開示、修正、削除" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第6条 問い合わせ先" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第7条 改定" })).toBeVisible();
});
