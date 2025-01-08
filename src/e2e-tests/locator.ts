import { expect, type Page, type Locator } from "next/experimental/testmode/playwright";

export const getSearchFormLocator = async (page: Page) => await page.getByTestId("search-form");
export const getAddArticleFormLocator = async (page: Page) => await page.getByTestId("add-article-form");
export const getFavoriteArticlesLocator = async (page: Page) => await page.getByTestId("favorite-articles");
export const getFirstArticleLocator = async (page: Page) => await page.getByTestId("article-1");
export const getReadLaterArticlesLocator = async (page: Page) => await page.getByTestId("read-later-articles");

export const paginationDisplayLocator = async (page: Locator, names: string[], options: { not?: boolean } = {}) => {
  const { not = false } = options;
  for (const name of names) {
    const expectation = expect(page.getByRole("link", { name, exact: true }));
    if (not) {
      await expectation.not.toBeVisible();
    } else {
      await expectation.toHaveCount(2);
    }
  }
};

export const paginationActiveCheck = async (page: Locator, name: string) => {
  const activeButton = page.getByRole("link", { name, exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");
};

export const paginationMorePagesCheck = async (page: Locator, options: { not?: boolean; double?: boolean } = {}) => {
  const { not = false, double = false } = options;
  const count = double ? 4 : 2;
  const expectation = expect(page.locator(".sr-only", { hasText: "More pages" }));
  if (not) {
    await expectation.not.toBeVisible();
  } else {
    await expectation.toHaveCount(count);
  }
};

export const checkLoading = async (page: Page) => {
  await expect(page.getByRole("button", { name: "loading" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible({ timeout: 30000 });
};

export const articleButtonClickAndReturnDialog = async (
  page: Page,
  text: string,
  h2Text: string,
  options: { alert?: boolean } = {}
) => {
  const { alert = false } = options;
  const dialogName = alert ? "alertdialog" : "dialog";
  await page.locator("button", { hasText: text }).first().click();
  const dialog = await page.getByRole(dialogName);
  await expect(dialog.locator("h2", { hasText: h2Text })).toBeVisible();

  return dialog;
};

export const articleButtonClick = async (page: Page, locator: Locator, text: string) => {
  await locator.locator("button", { hasText: text }).click();
  await checkLoading(page);
};

export const addArticleFormClick = async (page: Page, url: string) => {
  const addArticleForm = await getAddArticleFormLocator(page);
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill(url);
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await checkLoading(page);
};
