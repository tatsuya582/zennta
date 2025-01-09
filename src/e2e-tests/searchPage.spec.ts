import { addTestArticle, deleteAllTestArticles } from "@/e2e-tests/helpers/actions";
import {
  checkDafaultButtonCorrectly,
  checkDisplay,
  checkDisplayArticles,
  checkDisplayLessPagination,
  checkDisplayPagination,
  checkLastPageOfPaginationCorrectly,
  checkPaginationCorrectly,
  checkSearchFormCorrectly,
  checkTagCorrectly,
} from "@/e2e-tests/helpers/commonChecks";
import {
  getQiitaArticlesLocator,
  getZennArticlesLocator,
  paginationActiveCheck,
  paginationDisplayLocator,
} from "@/e2e-tests/helpers/locator";
import { beforeAction, mockSearchQiitaArticles, mockSearchZennArticles } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

const qiitaPath = (page: string) => `search?query=test&qiitapage=${page}&zennpage=1#qiitaarticles`;

test.describe("search page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });
  test("should display searchpage", async ({ page }) => {
    await page.goto("/search");

    await checkDisplay(page, "検索");
    await expect(page.locator("p", { hasText: "なにか入力してください" })).toBeVisible();
  });

  test("Display the search page when you actually search", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
    await page.goto("/search");
    await checkSearchFormCorrectly(page, "search");
  });

  test("should display Qiita Articles", async ({ page }) => {
    await page.goto("/search?query=test");

    await expect(page.locator("h2", { hasText: "Qiita一覧" })).toBeVisible();
    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkDisplayArticles(qiitaArticles);
  });

  test("should display Zenn Articles", async ({ page }) => {
    await page.goto("/search?query=test");

    const zennArticles = await getZennArticlesLocator(page);
    await checkDisplayArticles(zennArticles, { hasTags: false });
  });

  test("should display pagination of Qiita Articles", async ({ page }) => {
    await page.goto("/search?query=test");
    const qiitaArticles = await getQiitaArticlesLocator(page);

    await checkDisplayPagination(qiitaArticles);
  });

  test("should display pagination of Zenn Articles", async ({ page }) => {
    await page.goto("/search?query=test");
    const zennArticles = await getZennArticlesLocator(page);

    await paginationActiveCheck(zennArticles, "1");

    await expect(zennArticles.getByRole("link", { name: "2", exact: true })).not.toBeVisible();
    await expect(zennArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  });

  test("Qiita article pagination is working correctly", async ({ page }) => {
    await page.goto("/search?query=test");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkPaginationCorrectly(page, qiitaArticles, qiitaPath);
  });

  test("The last page of the Qiita article is page 100", async ({ page }) => {
    await page.goto("/search?query=test");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkLastPageOfPaginationCorrectly(page, qiitaArticles, qiitaPath);
  });

  test("Testing pagination when there are less Qiita articles", async ({ page, next }) => {
    mockSearchQiitaArticles(next);
    await page.goto("/search?query=test");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkDisplayLessPagination(qiitaArticles);
  });

  test("Zenn article pagination is working correctly", async ({ page }) => {
    await page.goto("/search?query=test");

    const zennArticles = await getZennArticlesLocator(page);
    await zennArticles.getByRole("link", { name: "Go to next page" }).first().click();
    await page.waitForLoadState();

    await expect(zennArticles.locator("a", { hasText: "Sample Article Title 31" })).toBeVisible();
    await paginationActiveCheck(zennArticles, "2");
    await paginationDisplayLocator(zennArticles, ["1", "2", "Go to next page"]);
  });

  test("Testing Zenn article pagination when next_page is null", async ({ page, next }) => {
    mockSearchZennArticles(next);
    await page.goto("/search?query=test");

    const zennArticles = await getZennArticlesLocator(page);
    await expect(zennArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
    await paginationActiveCheck(zennArticles, "1");
  });

  test("Click on a tag to go to the search page", async ({ page }) => {
    await page.goto("/search?query=test");

    await checkTagCorrectly(page);
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestArticles("readLaters");
      await deleteAllTestArticles("favorites");
    });

    test("Register to read later with the Read Later button", async ({ page }) => {
      await page.goto("/search?query=test");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "後で読む", "登録済み");
    });

    test("Delete read later with read later button", async ({ page }) => {
      addTestArticle("readLaters");
      await page.goto("/search?query=test");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "登録済み", "後で読む", { isDelete: true });
    });

    test("Register to favorite with the Favorite button", async ({ page }) => {
      await page.goto("/search?query=test");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "お気に入り登録", "お気に入り済み", {
        linkPage: "お気に入り",
      });
    });

    test("Delete favorite with Favorite button", async ({ page }) => {
      addTestArticle("favorites");
      await page.goto("/search?query=test");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "お気に入り済み", "お気に入り登録", {
        isDelete: true,
        linkPage: "お気に入り",
      });
    });
  });
});
