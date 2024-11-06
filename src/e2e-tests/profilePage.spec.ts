import test, { expect } from "@playwright/test";

test("Profile page UI elements and functionality", async ({ page }) => {
  await page.goto("/profile");

  await expect(page.getByRole('heading', { name: 'マイページ' })).toBeVisible();

  const profileImage = page.locator('img[alt="user image"]');
  await expect(profileImage).toBeVisible();
  await expect(profileImage).toHaveAttribute('src', /avatars\.githubusercontent\.com/);

  const nameInput = page.locator('input[name="name"]');
  await expect(nameInput).toHaveValue(process.env.NEXT_PUBLIC_TEST_USER!);
  await expect(nameInput).toBeDisabled();

  const editButton = page.locator("button:has-text('編集')");
  await expect(editButton).toBeVisible();

  await editButton.click();
  await expect(page.locator("text=マイページ編集")).toBeVisible();
});