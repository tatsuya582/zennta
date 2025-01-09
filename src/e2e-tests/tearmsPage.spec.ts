import { checkDisplayFooter } from "@/e2e-tests/commonChecks";
import test from "@playwright/test";

test.describe("tearms page test", () => {
  test("should render terms page elements", async ({ page }) => {
    await page.goto("/terms");

    await checkDisplayFooter(page, "利用規約", [
      "第1条 適用",
      "第2条 禁止行為",
      "第3条 責任限界",
      "第4条 規約変更",
      "第5条 法律と対策",
    ]);
  });
});
