import { addFavorite, addTestArticle, deleteAllTestArticles } from "@/e2e-tests/actions";
import {
  checkDisplay,
  checkDisplayArticles,
  checkDisplayLessPagination,
  checkDisplayPagination,
  checkLastPageOfPaginationCorrectly,
  checkPaginationCorrectly,
  checkSearchFormCorrectly,
  checkTagCorrectly,
} from "@/e2e-tests/commonChecks";
import {
  addArticleFormClick,
  articleButtonClick,
  articleButtonClickAndReturnDialog,
  getFirstArticleLocator,
  getReadLaterArticlesLocator,
  paginationActiveCheck,
  paginationDisplayLocator,
} from "@/e2e-tests/locator";
import { beforeAction, mockStoredArticles } from "@/e2e-tests/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

const path = (page: string) => `readlater?page=${page}`;
test.describe("readlater page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });

  test("should display readlaterpage", async ({ page }) => {
    await page.goto("/readlater");

    await checkDisplay(page, "後で読む", { useAddArticleForm: true });
  });

  test("should display Articles", async ({ page, next }) => {
    mockStoredArticles(next, 30, "readlater");

    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await checkDisplayArticles(readLaterArticles, { readLaterButton: "読了", favoriteButton: "お気に入り登録" });
  });

  test("should display pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "readlater");

    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await checkDisplayPagination(readLaterArticles);
  });

  test("should display pagination when less article", async ({ page, next }) => {
    mockStoredArticles(next, 150, "readlater");

    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await checkDisplayLessPagination(readLaterArticles);
  });

  test("Testing page functionality during pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "readlater");
    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await checkPaginationCorrectly(page, readLaterArticles, path);
  });

  test("Test the last page functionality of pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "readlater");
    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await checkLastPageOfPaginationCorrectly(page, readLaterArticles, path);
  });

  test("Pagination is working correctly when less articles", async ({ page, next }) => {
    mockStoredArticles(next, 150, "readlater");
    await page.goto("/readlater");
    const testPage = "3";

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await readLaterArticles.getByRole("link", { name: testPage, exact: true }).first().click();
    await page.waitForLoadState();

    await paginationActiveCheck(readLaterArticles, testPage);
    await paginationDisplayLocator(readLaterArticles, ["1", "2", "4", "5"]);
    await paginationDisplayLocator(
      readLaterArticles,
      ["Go to next page", "Go to the last page", "Go to previous page", "Go to the first page"],
      { not: true }
    );
    expect(page.url()).toBe(`http://localhost:3000/readlater?page=${testPage}`);
  });

  test("Clicking the Read button will display a dialogue", async ({ page, next }) => {
    mockStoredArticles(next, 150, "readlater");
    await page.goto("/readlater");

    const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });

    await expect(dialog.locator("p", { hasText: "削除するか、お気に入りに登録するか選択してください" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "お気に入り登録" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "削除" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Clicking the Read button will display a dialogue when favorite article", async ({ page, next }) => {
    mockStoredArticles(next, 1, "readlater", true);
    await page.goto("/readlater");

    const readLaterArticles = await getReadLaterArticlesLocator(page);
    await expect(readLaterArticles.locator("button", { hasText: "お気に入り済み" })).toBeVisible();
    const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });

    await expect(dialog.locator("p", { hasText: "削除するか、お気に入りに登録するか選択してください" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "お気に入り登録" })).not.toBeVisible();
    await expect(dialog.locator("button", { hasText: "削除" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Click on a tag to go to the search page", async ({ page, next }) => {
    mockStoredArticles(next, 30, "readlater");
    await page.goto("/readlater");

    await checkTagCorrectly(page);
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestArticles("readLaters");
      await deleteAllTestArticles("favorites");
    });

    test.describe("add test articles", () => {
      test.beforeEach(async ({ page }, testInfo) => {
        await addTestArticle("readLaters");
        if (testInfo.title.includes("お気に入り登録")) {
          await addFavorite();
        }
        await page.goto("/readlater");
      });

      test("Testing the Favorites button in the dialog", async ({ page }) => {
        await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toBeVisible();

        const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });

        await articleButtonClick(page, dialog, "お気に入り登録");

        await expect(page.locator("li", { hasText: "お気に入り登録しました" })).toBeVisible();
        const firstArticle = await getFirstArticleLocator(page);

        await expect(firstArticle.locator("button", { hasText: "お気に入り済み" })).toBeVisible({ timeout: 30000 });
      });

      test("Testing the Cancel button of a dialog", async ({ page }) => {
        const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });
        await dialog.locator("button", { hasText: "キャンセル" }).click();

        const firstArticle = await getFirstArticleLocator(page);

        await expect(firstArticle.locator("button", { hasText: "読了" })).toBeVisible({ timeout: 30000 });
        await expect(dialog).not.toBeVisible();
      });

      test("Testing the Favorites button", async ({ page }) => {
        const firstArticle = await getFirstArticleLocator(page);
        await articleButtonClick(page, firstArticle, "お気に入り登録");

        await expect(firstArticle.locator("button", { hasText: "お気に入り済み" })).toBeVisible({ timeout: 30000 });
      });

      test("Testing the Delete button of the dialog", async ({ page }) => {
        const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });
        await articleButtonClick(page, dialog, "削除");

        await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
        await expect(page.locator("a", { hasText: "Sample Article Title 1" })).not.toBeVisible({ timeout: 30000 });
      });

      test("「お気に入り登録」 does not appear in the dialog when the item is already added to Favorites", async ({
        page,
      }) => {
        const dialog = await articleButtonClickAndReturnDialog(page, "読了", "読み終わりましたか？", { alert: true });
        await expect(dialog.locator("button", { hasText: "お気に入り登録" })).not.toBeVisible();
      });
    });

    test.describe("skip webkit", () => {
      test.beforeEach(async ({ page, browserName }, testInfo) => {
        test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
        if (testInfo.title.includes("登録済みです")) {
          await addTestArticle("readLaters");
        }
        await page.goto("/readlater");
      });

      test("search form is working properly", async ({ page }) => {
        await checkSearchFormCorrectly(page, "readlater");
      });

      test("If the URL is correct, the article can be registered using addArticleForm", async ({ page }) => {
        await addArticleFormClick(page, "https://zennta.vercel.app/");
        await expect(page.locator("li", { hasText: "登録しました" })).toBeVisible();

        const readLaterArticles = await getReadLaterArticlesLocator(page);
        await expect(readLaterArticles.locator("a", { hasText: "Zennta" })).toBeVisible({ timeout: 30000 });
      });

      test("If the URL has already been registered in addArticleForm, the message 「登録済みです」 will be displayed.", async ({
        page,
      }) => {
        await addArticleFormClick(page, "https://example.com/sample-article-1");
        await expect(page.locator("li", { hasText: "登録済みです" })).toBeVisible();
      });

      test("When the URL is incorrect in addArticleForm, it displays 「サイトがありません」", async ({ page }) => {
        await addArticleFormClick(page, "https://nofetch");
        await expect(page.locator("li", { hasText: "サイトがありません" })).toBeVisible();
      });
    });
  });
});
