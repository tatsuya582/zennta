import { checkDisplayAuth } from "@/e2e-tests/commonChecks";
import test from "@playwright/test";

test.describe("login page test", () => {
  test("should render login page elements", async ({ page }) => {
    await page.goto("/login");
    await checkDisplayAuth(page, "ログイン");
  });
});
