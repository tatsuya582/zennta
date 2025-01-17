import {
  articleButtonClick,
  checkAddArticleForm,
  checkFooter,
  checkHeader,
  checkSearchForm,
  getHeaderLocator,
  paginationActiveCheck,
  paginationDisplayLocator,
  paginationMorePagesCheck,
  searchFormClick,
} from "@/e2e-tests/helpers/locator";
import { expect, type Page, type Locator } from "next/experimental/testmode/playwright";

export const checkDisplay = async (
  page: Page,
  name: string,
  options: { useAddArticleForm?: boolean; useSearchForm?: boolean } = {}
) => {
  const { useAddArticleForm = false, useSearchForm = true } = options;

  await expect(page.getByRole("heading", { name, exact: true, level: 2 })).toBeVisible();
  await expect(page.locator("h2", { hasText: "履歴" })).toBeVisible();

  if (useSearchForm) {
    await checkSearchForm(page);
  }
  if (useAddArticleForm) {
    await checkAddArticleForm(page);
  }

  await checkHeader(page);
  await checkFooter(page);
};

export const checkDisplayArticles = async (
  page: Locator,
  options: { readLaterButton?: string; favoriteButton?: string; hasTags?: boolean } = {}
) => {
  const { readLaterButton = "後で読む", favoriteButton = "お気に入り登録", hasTags = true } = options;
  await expect(page.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
  await expect(page.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
  await expect(page.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
  await expect(page.locator("button", { hasText: readLaterButton })).toHaveCount(30);
  await expect(page.locator("button", { hasText: favoriteButton })).toHaveCount(30);
  if (hasTags) {
    await expect(page.locator("a", { hasText: "Tag1" })).toHaveCount(15);
    await expect(page.locator("a", { hasText: "Tag2" })).toHaveCount(15);
  }
};

export const checkDisplayPagination = async (page: Locator) => {
  await paginationActiveCheck(page, "1");
  await paginationDisplayLocator(page, ["2", "3", "Go to next page", "Go to the last page"]);
  await paginationMorePagesCheck(page);
};

export const checkDisplayLessPagination = async (page: Locator) => {
  await paginationActiveCheck(page, "1");
  await paginationDisplayLocator(page, ["2", "3", "4", "5"]);
  await paginationDisplayLocator(page, ["Go to next page", "Go to the last page"], { not: true });
  await paginationMorePagesCheck(page, { not: true });
};

export const checkPaginationCorrectly = async (page: Page, locator: Locator, path: (page: string) => string) => {
  const testPage = "3";
  const url = `http://localhost:3000/${path(testPage)}`;

  await locator.getByRole("link", { name: testPage, exact: true }).first().click({ timeout: 30000 });
  await page.waitForLoadState();

  await paginationActiveCheck(locator, testPage);
  await paginationDisplayLocator(locator, [
    "2",
    "3",
    "4",
    "Go to next page",
    "Go to the last page",
    "Go to previous page",
    "Go to the first page",
  ]);
  await paginationMorePagesCheck(locator, { double: true });
  expect(page.url()).toBe(url);
};

export const checkLastPageOfPaginationCorrectly = async (
  page: Page,
  locator: Locator,
  path: (page: string) => string
) => {
  const testPage = "100";
  const url = `http://localhost:3000/${path(testPage)}`;

  await locator.getByRole("link", { name: "Go to the last page" }).first().click({ timeout: 30000 });
  await page.waitForLoadState();

  await paginationActiveCheck(locator, testPage);
  await paginationDisplayLocator(locator, ["98", "99", "Go to previous page", "Go to the first page"]);
  await paginationMorePagesCheck(locator);
  expect(page.url()).toBe(url);
};

export const checkSearchFormCorrectly = async (page: Page, linkUrl: "favorite" | "readlater" | "search") => {
  const testValue = "test";
  await searchFormClick(page, testValue);
  expect(page.url()).toBe(`http://localhost:3000/${linkUrl}?query=${testValue}`);
  await expect(page.getByPlaceholder("検索ワードを入力")).toHaveValue(testValue, { timeout: 30000 });
};

export const checkTagCorrectly = async (page: Page) => {
  await page.locator("a", { hasText: "Tag1" }).first().click({ timeout: 30000 });
  await page.waitForLoadState();

  await expect(page.getByPlaceholder("検索ワードを入力")).toHaveValue("Tag1", { timeout: 30000 });
  expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
};

export const checkDafaultButtonCorrectly = async (
  page: Page,
  locator: Locator,
  clickButton: string,
  afterButton: string,
  options: { isDelete?: boolean; linkPage?: "後で読む" | "お気に入り" } = {}
) => {
  const { isDelete = false, linkPage = "後で読む" } = options;
  await articleButtonClick(page, locator, clickButton);

  if (isDelete) {
    await expect(locator.locator("button", { hasText: clickButton })).not.toBeVisible({ timeout: 30000 });
    await expect(locator.locator("button", { hasText: afterButton })).toHaveCount(30);
  } else {
    await expect(locator.locator("button", { hasText: afterButton })).toBeVisible({ timeout: 30000 });
    await expect(locator.locator("button", { hasText: clickButton })).toHaveCount(29);
  }

  const header = await getHeaderLocator(page);
  await header.locator("a", { hasText: linkPage }).first().click({ timeout: 30000 });

  await page.waitForLoadState();
  await expect(page.locator("h2", { hasText: linkPage })).toBeVisible({ timeout: 30000 });
  const expectation = expect(page.locator("a", { hasText: "Sample Article Title 1" }));
  if (isDelete) {
    await expectation.not.toBeVisible();
  } else {
    await expectation.toBeVisible();
  }
};

export const checkDisplayAuth = async (page: Page, hasText: "会員登録" | "ログイン") => {
  await expect(page.locator("h2", { hasText })).toBeVisible();
  await expect(page.locator("button", { hasText: `GitHubで${hasText}` })).toBeVisible();
  await expect(page.locator("button", { hasText: `Googleで${hasText}` })).toBeVisible();
  await expect(page.locator("button", { hasText: `Xで${hasText}` })).toBeVisible();

  await checkHeader(page);
  await checkFooter(page);
};

export const checkDisplayFooter = async (
  page: Page,
  h2Text: "プライバシーポリシー" | "利用規約",
  h3Texts: string[]
) => {
  await expect(page.locator("h2", { hasText: h2Text })).toBeVisible();

  for (const h3Text of h3Texts) {
    await expect(page.locator("h3", { hasText: h3Text })).toBeVisible();
  }

  await checkHeader(page);
  await checkFooter(page);
};
