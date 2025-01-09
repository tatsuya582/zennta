import { updateTestUser } from "@/e2e-tests/actions";
import { articleButtonClick, articleButtonClickAndReturnDialog, checkFooter, checkHeader } from "@/e2e-tests/locator";
import test, { expect } from "@playwright/test";

test.describe("profile page test", () => {
  test("should display profile page", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.locator("h2", { hasText: "マイページ" })).toBeVisible();

    const profileImage = page.locator('img[alt="user image"]');
    await expect(profileImage).toBeVisible();
    await expect(profileImage).toHaveAttribute("src", /avatars\.githubusercontent\.com/);

    const nameInput = page.locator("input[disabled]");
    await expect(nameInput).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
    await expect(nameInput).toBeDisabled();

    await expect(page.locator("button", { hasText: "編集" })).toBeVisible();
  });

  test("Headers and footers are rendered", async ({ page }) => {
    await page.goto("/profile");
    await checkHeader(page);
    await checkFooter(page);
  });

  test("Clicking the Edit button will display a dialogue", async ({ page }) => {
    await page.goto("/profile");
    const dialog = await articleButtonClickAndReturnDialog(page, "編集", "名前を変更しますか？");

    await expect(dialog.locator("p", { hasText: "2文字以上50文字以内で入力してください。" })).toBeVisible();
    await expect(dialog.locator('input[name="name"]')).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
    await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Clicking the Cancel button will dismiss the dialog", async ({ page }) => {
    await page.goto("/profile");
    const dialog = await articleButtonClickAndReturnDialog(page, "編集", "名前を変更しますか？");

    await dialog.locator("button", { hasText: "キャンセル" }).click();
    await expect(dialog).not.toBeVisible();
  });

  test.describe("use actions", () => {
    test.afterEach(async () => {
      await updateTestUser();
    });
    test("Test whether the user name can be changed", async ({ page }) => {
      const editName = "edit name";

      await page.goto("/profile");
      const dialog = await articleButtonClickAndReturnDialog(page, "編集", "名前を変更しますか？");

      await dialog.locator('input[name="name"]').fill(editName);
      await articleButtonClick(page, dialog, "編集");

      await expect(page.locator("li", { hasText: "名前を変更しました" })).toBeVisible();

      await expect(page.locator("input[disabled]")).toHaveValue(editName);
    });
  });
});
