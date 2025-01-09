import { checkFooter, checkHeader } from "@/e2e-tests/locator";
import test, { expect } from "@playwright/test";

test("should render login page elements", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("h2", { hasText: "ログイン" })).toBeVisible();
  await expect(page.locator("button", { hasText: "GitHubでログイン" })).toBeVisible();
  await expect(page.locator("button", { hasText: "Googleでログイン" })).toBeVisible();
  await expect(page.locator("button", { hasText: "Xでログイン" })).toBeVisible();
});

test("Headers and footers are rendered", async ({ page }) => {
  await page.goto("/login");
  await checkHeader(page);
  await checkFooter(page);
});
