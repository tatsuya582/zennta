import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

const authFile = path.join(__dirname, "../.auth/user.json");
dotenv.config({ path: [".env.local", ".env"] });

setup("authenticate", async ({ page }) => {
  await page.goto("/signup");
  await page.locator('button:has-text("GitHubで会員登録")').click();
  await expect(page.locator("text=continue to Zennta_local")).toBeVisible();
  await page.fill('input[name="login"]', process.env.NEXT_PUBLIC_TEST_USER!);
  await page.fill('input[name="password"]', process.env.NEXT_PUBLIC_TEST_PASSWORD!);
  await page.click('input[name="commit"]');

  await page
    .waitForSelector('button:has-text("Authorize")', { timeout: 5000 })
    .then(async () => {
      await page.click('button:has-text("Authorize")');
    })
    .catch(() => {
      // ボタンがなければ何もしない
    });
  const header = await page.getByTestId("header");
  await expect(header.locator("text=Zennta")).toBeVisible({ timeout: 30000 });

  await page.context().storageState({ path: authFile });
});
