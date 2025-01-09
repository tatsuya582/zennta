import { checkFooter, checkHeader } from "@/e2e-tests/locator";
import test, { expect } from "@playwright/test";

test("should render signup page elements", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.locator("h2", { hasText: "会員登録" })).toBeVisible();
  await expect(page.locator("button", { hasText: "GitHubで会員登録" })).toBeVisible();
  await expect(page.locator("button", { hasText: "Googleで会員登録" })).toBeVisible();
  await expect(page.locator("button", { hasText: "Xで会員登録" })).toBeVisible();
});

test("Headers and footers are rendered", async ({ page }) => {
  await page.goto("/signup");
  await checkHeader(page);
  await checkFooter(page);
});
