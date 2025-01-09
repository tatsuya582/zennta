import { checkDisplayAuth } from "@/e2e-tests/commonChecks";
import test from "@playwright/test";

test.describe("signup page test", () => {
  test("should render signup page elements", async ({ page }) => {
    await page.goto("/signup");

    await checkDisplayAuth(page, "会員登録");
  });
});
