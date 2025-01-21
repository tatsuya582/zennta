import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import { getHeaderLocator } from "@/e2e-tests/helpers/locator";

const authFile = path.join(__dirname, "../.auth/user.json");
dotenv.config({ path: [".env.local", ".env"] });

setup("authenticate", async ({ page }) => {
  await page.goto("/testlogin");
  await page.locator("button", { hasText: "ログイン" }).click();

  const header = await getHeaderLocator(page);
  await expect(header.locator("button", { hasText: "ログアウト" })).toBeVisible({ timeout: 30000 });

  await page.context().storageState({ path: authFile });
});
