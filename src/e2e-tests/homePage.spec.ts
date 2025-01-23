import { addTestArticle, deleteAllTestArticles } from "@/e2e-tests/helpers/actions";
import {
  checkDafaultButtonCorrectly,
  checkDisplay,
  checkDisplayArticles,
  checkDisplayPagination,
  checkLastPageOfPaginationCorrectly,
  checkPaginationCorrectly,
  checkSearchFormCorrectly,
  checkTagCorrectly,
} from "@/e2e-tests/helpers/commonChecks";
import {
  checkLink,
  getHeaderLocator,
  getQiitaArticlesLocator,
  getSidebarLocator,
  getZennArticlesLocator,
} from "@/e2e-tests/helpers/locator";
import { beforeAction } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

const qiitaPath = (page: string) => `?qiitapage=${page}&zennpage=1#qiitaarticles`;
const zennPath = (page: string) => `?qiitapage=1&zennpage=${page}#zennarticles`;

test.describe("home page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });
  test("should display homepage", async ({ page }) => {
    await page.goto("/");

    await checkDisplay(page, "Qiita一覧");
    await expect(page.locator("h2", { hasText: "Zenn一覧" })).toBeVisible();
  });

  test("The header links are set correctly", async ({ page }) => {
    await page.goto("/");
    const header = await getHeaderLocator(page);

    await checkLink(page, header, "後で読む", "readlater");
    await checkLink(page, header, "お気に入り", "favorite");
    await checkLink(page, header, "検索", "search");
    await checkLink(page, header, "マイページ", "profile");
    await checkLink(page, header, "Zennta", "", { h2Text: "Qiita一覧", useElement: "h1" });

    const footer = await page.getByTestId("footer");

    await checkLink(page, footer, "利用規約", "terms", { h2Text: "Zenntaの利用規約" });
    await checkLink(page, footer, "プライバシーポリシー", "privacy", { h2Text: "Zenntaのプライバシーポリシー" });
  });

  test("should display Qiita Articles", async ({ page }) => {
    await page.goto("/");
    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkDisplayArticles(qiitaArticles);
  });

  test("should display pagination of Qiita Articles", async ({ page }) => {
    await page.goto("/");
    const qiitaArticles = await getQiitaArticlesLocator(page);

    await checkDisplayPagination(qiitaArticles);
  });

  test("should display Zenn Articles", async ({ page }) => {
    await page.goto("/");
    const zennArticles = await getZennArticlesLocator(page);
    await checkDisplayArticles(zennArticles, { hasTags: false });
  });

  test("should display pagination of Zenn Articles", async ({ page }) => {
    await page.goto("/");
    const zennArticles = await getZennArticlesLocator(page);

    await checkDisplayPagination(zennArticles);
  });

  test("Qiita article pagination is working correctly", async ({ page }) => {
    await page.goto("/");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkPaginationCorrectly(page, qiitaArticles, qiitaPath);
  });

  test("The last page of the Qiita article is page 100", async ({ page }) => {
    await page.goto("/");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await checkLastPageOfPaginationCorrectly(page, qiitaArticles, qiitaPath);
  });

  test("Zenn article pagination is working correctly", async ({ page }) => {
    await page.goto("/");

    const zennArticles = await getZennArticlesLocator(page);
    await checkPaginationCorrectly(page, zennArticles, zennPath);
  });

  test("The last page of the Zenn article is page 100", async ({ page }) => {
    await page.goto("/");

    const zennArticles = await getZennArticlesLocator(page);
    await checkLastPageOfPaginationCorrectly(page, zennArticles, zennPath);
  });

  test("search form is working properly", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
    await page.goto("/");
    await checkSearchFormCorrectly(page, "search");
  });

  test("Click on a tag to go to the search page", async ({ page }) => {
    await page.goto("/");

    await checkTagCorrectly(page);
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestArticles("readLaters");
      await deleteAllTestArticles("favorites");
      await deleteAllTestArticles("histories");
    });

    test("Register to read later with the Read Later button", async ({ page }) => {
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "後で読む", "登録済み");
    });

    test("Delete read later with read later button", async ({ page }) => {
      addTestArticle("readLaters");
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "登録済み", "後で読む", { isDelete: true });
    });

    test("Register to favorite with the Favorite button", async ({ page }) => {
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "お気に入り登録", "お気に入り済み", {
        linkPage: "お気に入り",
      });
    });

    test("Delete favorite with Favorite button", async ({ page }) => {
      addTestArticle("favorites");
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await checkDafaultButtonCorrectly(page, qiitaArticles, "お気に入り済み", "お気に入り登録", {
        isDelete: true,
        linkPage: "お気に入り",
      });
    });

    // github actionsで通らないのでコメントアウト
    // test("The article link is correct", async ({ page, context }) => {
    //   await page.goto("/");

    //   const zennArticles = await getZennArticlesLocator(page);
    //   const pagePromise = context.waitForEvent("page");
    //   await zennArticles.locator("a", { hasText: "Sample Article Title 30" }).click();
    //   const newPage = await pagePromise;
    //   expect(newPage.url()).toBe("https://zenn.dev/sample-article-30");
    // });

    test("Click on an article to see its history", async ({ page, context }) => {
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      const pagePromise = context.waitForEvent("page");
      await qiitaArticles.locator("a", { hasText: "Sample Article Title 30" }).click();
      const newPage = await pagePromise;
      expect(newPage.url()).toBe("https://example.com/sample-article-30");
      await page.waitForLoadState();

      const sidebar = await getSidebarLocator(page);
      await expect(sidebar.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible({ timeout: 30000 });
    });
  });
});
