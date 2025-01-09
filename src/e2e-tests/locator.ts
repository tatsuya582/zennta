import { expect, type Page, type Locator } from "next/experimental/testmode/playwright";

export const getSearchFormLocator = async (page: Page) => await page.getByTestId("search-form");
export const getAddArticleFormLocator = async (page: Page) => await page.getByTestId("add-article-form");
export const getFavoriteArticlesLocator = async (page: Page) => await page.getByTestId("favorite-articles");
export const getReadLaterArticlesLocator = async (page: Page) => await page.getByTestId("read-later-articles");
export const getQiitaArticlesLocator = async (page: Page) => await page.getByTestId("qiita-articles");
export const getZennArticlesLocator = async (page: Page) => await page.getByTestId("zenn-articles");
export const getFirstArticleLocator = async (page: Page) => await page.getByTestId("article-1");
export const getHeaderLocator = async (page: Page) => await page.getByTestId("header");
export const getFooterLocator = async (page: Page) => await page.getByTestId("footer");
export const getSidebarLocator = async (page: Page) => await page.getByTestId("sidebar");

export const checkHeader = async (page: Page, options: { login?: boolean } = {}) => {
  const { login = true } = options;
  const header = await getHeaderLocator(page);
  await checkLink(page, header, "後で読む", "readlater");
  await checkLink(page, header, "お気に入り", "favorite");
  await checkLink(page, header, "検索", "search");
  await checkLink(page, header, "Zennta", "", { h2Text: "Qiita一覧", useElement: "h1" });
  if (login) {
    await checkLink(page, header, "マイページ", "profile");
    await expect(header.locator("button", { hasText: "ログアウト" })).toBeVisible();
  } else {
    await checkLink(page, header, "ログイン", "login");
    await checkLink(page, header, "会員登録", "signup");
  }
};

export const checkFooter = async (page: Page) => {
  const footer = await page.getByTestId("footer");
  await checkLink(page, footer, "利用規約", "terms");
  await checkLink(page, footer, "プライバシーポリシー", "privacy");
  await expect(footer.locator("a", { hasText: "お問い合わせフォーム" })).toBeVisible();
};

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
  await locator.locator("button", { hasText: text }).first().click();
  await checkLoading(page);
};

export const addArticleFormClick = async (page: Page, url: string) => {
  const addArticleForm = await getAddArticleFormLocator(page);
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill(url);
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await checkLoading(page);
};

export const checkLink = async (
  page: Page,
  locator: Locator,
  text: string,
  url: string,
  options: { h2Text?: string; useElement?: string } = {}
) => {
  const { h2Text = text, useElement = "a" } = options;
  await locator.locator(useElement, { hasText: text }).first().click();
  await page.waitForLoadState();
  await expect(page.locator("h2", { hasText: h2Text })).toBeVisible({ timeout: 30000 });
  expect(page.url()).toBe(`http://localhost:3000/${url}`);
};
