import { checkDisplayFooter } from "@/e2e-tests/helpers/commonChecks";
import test from "@playwright/test";

test.describe("privacy page test", () => {
  test("should render privacy page elements", async ({ page }) => {
    await page.goto("/privacy");

    await checkDisplayFooter(page, "プライバシーポリシー", [
      "第1条 個人情報の収集",
      "第2条 個人情報の使用目的",
      "第3条 個人情報の共有と揭示",
      "第4条 個人情報の保守",
      "第5条 個人情報の開示、修正、削除",
      "第6条 問い合わせ先",
      "第7条 改定",
    ]);
  });
});
