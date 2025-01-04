import test, { expect } from "@playwright/test";

test("should render terms page elements", async ({ page }) => {
  await page.goto("/terms");

  await expect(page.locator("h2", { hasText: "Zenntaの利用規約" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第1条 適用" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第2条 禁止行為" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第3条 責任限界" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第4条 規約変更" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "第5条 法律と対策" })).toBeVisible();
});
