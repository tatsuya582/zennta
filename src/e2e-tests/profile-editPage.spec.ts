import test, { expect } from "@playwright/test";

test("Profile edit page UI elements and functionality", async ({ page }) => {
  await page.goto("/profile/edit");

  await expect(page.getByRole("heading", { name: "マイページ編集" })).toBeVisible();

  const profileImage = page.locator('img[alt="user image"]');
  await expect(profileImage).toBeVisible();
  await expect(profileImage).toHaveAttribute("src", /avatars\.githubusercontent\.com/);

  const nameInput = page.locator('input[name="name"]');
  await expect(nameInput).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
  await expect(nameInput).toBeEnabled();

  const descriptionText = page.locator('p:has-text("名前は2文字以上、50文字以下にしてください")');
  await expect(descriptionText).toBeVisible();

  const backButton = page.locator("button:has-text('戻る')");
  await expect(backButton).toBeVisible();

  const editButton = page.locator("button:has-text('編集')");
  await expect(editButton).toBeVisible();

  await backButton.click();
  await page.waitForTimeout(5000);
  expect(page.getByRole("heading", { name: "マイページ" })).toBeVisible();
});

test("should show error for name shorter than minimum length", async ({ page }) => {
  await page.goto("/profile/edit");

  const editButton = await page.locator("button:has-text('編集')");
  await editButton.scrollIntoViewIfNeeded();

  await page.fill('input[name="name"]', "a");

  await editButton.click();

  const errorLocator = await page.locator("p.text-destructive", { hasText: "名前は2文字以上にしてください" });
  await expect(errorLocator).toBeVisible();
});

test("should show error for name exceeding maximum length", async ({ page }) => {
  await page.goto("/profile/edit");

  const editButton = await page.locator("button:has-text('編集')");
  await editButton.scrollIntoViewIfNeeded();

  const longName = "a".repeat(51); // 51文字入力
  await page.fill('input[name="name"]', longName);

  await editButton.click();
  const errorLocator = await page.locator("p.text-destructive", { hasText: "名前は50文字以下にしてください" });
  await expect(errorLocator).toBeVisible();
});

test("should do nothing when NEXT_PUBLIC_TEST_USER is entered and edit button is clicked", async ({ page }) => {
  await page.goto("/profile/edit");

  const testUser = process.env.NEXT_PUBLIC_TEST_USER!;

  await page.fill('input[name="name"]', testUser);

  const editButton = await page.locator("button:has-text('編集')");
  await editButton.scrollIntoViewIfNeeded();

  await editButton.click();

  // エラーメッセージが表示されないことを確認
  const errorLocator = page.locator("p.text-destructive");
  await expect(errorLocator).not.toBeVisible();

  // ページが変化していないことを確認
  const nameFieldValue = await page.inputValue('input[name="name"]');
  await expect(nameFieldValue).toBe(testUser);
});

// 安定しません
// test("should update name to NEXT_PUBLIC_TEST_USER + 'update' and redirect to /profile", async ({ page }) => {
//   await page.goto("/profile/edit");
//   const updatedName = new Date().toISOString().replace(/[:.]/g, "-");

//   const editButton = page.locator("button:has-text('編集')");
//   await editButton.scrollIntoViewIfNeeded();

//   await page.fill('input[name="name"]', updatedName);

//   await editButton.click();
//   await page.waitForTimeout(5000);
//   await page.waitForURL("/profile", { timeout: 30000 });

//   const nameFieldValue = await page.locator('input[name="name"]').inputValue();
//   expect(nameFieldValue).toBe(updatedName);

//   await page.goto("/profile/edit");
//   await editButton.scrollIntoViewIfNeeded();

//   await page.fill('input[name="name"]', process.env.NEXT_PUBLIC_TEST_USER!);

//   await page.waitForTimeout(5000);
//   await editButton.click();
//   await page.waitForTimeout(10000);
//   await page.waitForURL("/profile", { timeout: 30000 });
// });
