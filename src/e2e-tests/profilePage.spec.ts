import test, { expect } from "@playwright/test";

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

test("Clicking the Edit button will display a dialogue", async ({ page }) => {
  await page.goto("/profile");

  await page.locator("button", { hasText: "編集" }).click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "名前を変更しますか？" })).toBeVisible();
  await expect(dialog.locator("p", { hasText: "2文字以上50文字以内で入力してください。" })).toBeVisible();
  await expect(dialog.locator('input[name="name"]')).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
  await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
});

test("Clicking the Cancel button will dismiss the dialog", async ({ page }) => {
  await page.goto("/profile");

  await page.locator("button", { hasText: "編集" }).click();

  const dialog = await page.getByRole("dialog");
  await dialog.locator("button", { hasText: "キャンセル" }).click();
  await expect(dialog).not.toBeVisible();
});

test("Test the rename feature", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
  const editName = "edit name";

  await page.goto("/profile");

  const editButton = await page.locator("button", { hasText: "編集" });
  editButton.click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "名前を変更しますか？" })).toBeVisible();
  const nameInput = await dialog.locator('input[name="name"]');
  nameInput.fill(editName);
  await dialog.locator("button", { hasText: "編集" }).click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "名前を変更しました" })).toBeVisible();

  await expect(page.locator("input[disabled]")).toHaveValue(editName);
  editButton.click();

  await expect(dialog.locator("h2", { hasText: "名前を変更しますか？" })).toBeVisible();
  nameInput.fill(process.env.NEXT_PUBLIC_TEST_USER!);
  await dialog.locator("button", { hasText: "編集" }).click();
  await page.waitForLoadState();

  await expect(dialog).not.toBeVisible({ timeout: 60000 });
  await expect(page.locator("li", { hasText: "名前を変更しました" })).toBeVisible();

  await expect(page.locator("input[disabled]")).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
});
