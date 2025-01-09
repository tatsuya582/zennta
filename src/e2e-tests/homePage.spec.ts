import { addTestArticle, deleteAllTestArticles } from "@/e2e-tests/actions";
import {
  articleButtonClick,
  checkFooter,
  checkHeader,
  checkLink,
  checkSearchForm,
  getHeaderLocator,
  getQiitaArticlesLocator,
  getSidebarLocator,
  getZennArticlesLocator,
  paginationActiveCheck,
  paginationDisplayLocator,
  paginationMorePagesCheck,
  searchFormClick,
} from "@/e2e-tests/locator";
import { beforeAction } from "@/e2e-tests/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.beforeEach(async ({ next }) => {
  beforeAction(next);
});

test.describe("home page test", () => {
  test("should display homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h2", { hasText: "履歴" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "Qiita一覧" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "Zenn一覧" })).toBeVisible();

    await checkSearchForm(page);
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

    await checkLink(page, footer, "利用規約", "terms");
    await checkLink(page, footer, "プライバシーポリシー", "privacy");
  });

  test("Headers and footers are rendered", async ({ page }) => {
    await page.goto("/");
    await checkHeader(page);
    await checkFooter(page);
  });

  test("should display Qiita Articles", async ({ page }) => {
    await page.goto("/");
    const qiitaArticles = await getQiitaArticlesLocator(page);
    await expect(qiitaArticles.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
    await expect(qiitaArticles.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
    await expect(qiitaArticles.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
    await expect(qiitaArticles.locator("a", { hasText: "Tag1" })).toHaveCount(15);
    await expect(qiitaArticles.locator("a", { hasText: "Tag2" })).toHaveCount(15);
    await expect(qiitaArticles.locator("button", { hasText: "後で読む" })).toHaveCount(30);
    await expect(qiitaArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(30);
  });

  test("should display pagination of Qiita Articles", async ({ page }) => {
    await page.goto("/");
    const qiitaArticles = await getQiitaArticlesLocator(page);

    await paginationActiveCheck(qiitaArticles, "1");
    await paginationDisplayLocator(qiitaArticles, ["2", "3", "Go to next page", "Go to the last page"]);
    await paginationMorePagesCheck(qiitaArticles);
  });

  test("should display Zenn Articles", async ({ page }) => {
    await page.goto("/");
    const zennArticles = await getZennArticlesLocator(page);
    await expect(zennArticles.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
    await expect(zennArticles.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
    await expect(zennArticles.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
    await expect(zennArticles.locator("button", { hasText: "後で読む" })).toHaveCount(30);
    await expect(zennArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(30);
  });

  test("should display pagination of Zenn Articles", async ({ page }) => {
    await page.goto("/");
    const zennArticles = await getZennArticlesLocator(page);

    await paginationActiveCheck(zennArticles, "1");
    await paginationDisplayLocator(zennArticles, ["2", "3", "Go to next page", "Go to the last page"]);
    await paginationMorePagesCheck(zennArticles);
  });

  test("Qiita article pagination is working correctly", async ({ page }) => {
    await page.goto("/");
    const testPage = "3";

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await qiitaArticles.getByRole("link", { name: testPage, exact: true }).first().click();
    await page.waitForLoadState();

    await expect(qiitaArticles.locator("a", { hasText: "Sample Article Title 61" })).toBeVisible();
    await paginationActiveCheck(qiitaArticles, testPage);
    await paginationDisplayLocator(qiitaArticles, [
      "2",
      "3",
      "4",
      "Go to next page",
      "Go to the last page",
      "Go to previous page",
      "Go to the first page",
    ]);
    await paginationMorePagesCheck(qiitaArticles, { double: true });
    expect(page.url()).toBe(`http://localhost:3000/?qiitapage=${testPage}&zennpage=1#qiitaarticles`);
  });

  test("The last page of the Qiita article is page 100", async ({ page }) => {
    await page.goto("/");
    const testPage = "100";

    const qiitaArticles = await getQiitaArticlesLocator(page);

    await qiitaArticles.getByRole("link", { name: "Go to the last page" }).first().click();
    await page.waitForLoadState();

    await paginationActiveCheck(qiitaArticles, testPage);
    await paginationDisplayLocator(qiitaArticles, ["98", "99", "Go to previous page", "Go to the first page"]);
    await paginationMorePagesCheck(qiitaArticles);
    expect(page.url()).toBe(`http://localhost:3000/?qiitapage=${testPage}&zennpage=1#qiitaarticles`);
  });

  test("Zenn article pagination is working correctly", async ({ page }) => {
    await page.goto("/");
    const testPage = "3";

    const zennArticles = await getZennArticlesLocator(page);
    await zennArticles.getByRole("link", { name: testPage, exact: true }).first().click();
    await page.waitForLoadState();

    await expect(zennArticles.locator("a", { hasText: "Sample Article Title 61" })).toBeVisible();
    await paginationActiveCheck(zennArticles, testPage);
    await paginationDisplayLocator(zennArticles, [
      "2",
      "3",
      "4",
      "Go to next page",
      "Go to the last page",
      "Go to previous page",
      "Go to the first page",
    ]);
    await paginationMorePagesCheck(zennArticles, { double: true });
    expect(page.url()).toBe(`http://localhost:3000/?qiitapage=1&zennpage=${testPage}#zennarticles`);
  });

  test("The last page of the Zenn article is page 100", async ({ page }) => {
    await page.goto("/");
    const testPage = "100";

    const zennArticles = await getZennArticlesLocator(page);

    await zennArticles.getByRole("link", { name: "Go to the last page" }).first().click();
    await page.waitForLoadState();

    await paginationActiveCheck(zennArticles, testPage);
    await paginationDisplayLocator(zennArticles, ["98", "99", "Go to previous page", "Go to the first page"]);
    await paginationMorePagesCheck(zennArticles);
    expect(page.url()).toBe(`http://localhost:3000/?qiitapage=1&zennpage=${testPage}#zennarticles`);
  });

  test("search form is working properly", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
    const testValue = "test";
    await page.goto("/");
    await searchFormClick(page, testValue);

    expect(page.url()).toBe(`http://localhost:3000/search?query=${testValue}`);
  });

  test("Click on a tag to go to the search page", async ({ page, next }) => {
    await page.goto("/");

    await page.locator("text=Tag1").first().click();
    await page.waitForLoadState();

    await expect(page.getByPlaceholder("検索ワードを入力")).toHaveValue("Tag1", { timeout: 30000 });
    expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
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
      await articleButtonClick(page, qiitaArticles, "後で読む");

      await expect(qiitaArticles.locator("button", { hasText: "登録済み" })).toBeVisible({ timeout: 30000 });
      await expect(qiitaArticles.locator("button", { hasText: "後で読む" })).toHaveCount(29);

      const header = await getHeaderLocator(page);
      await header.locator("text=後で読む").first().click();

      await page.waitForLoadState();
      await expect(page.locator("h2", { hasText: "後で読む" })).toBeVisible({ timeout: 30000 });
      await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toBeVisible();
    });

    test("Delete read later with read later button", async ({ page }) => {
      addTestArticle("readLaters");
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await articleButtonClick(page, qiitaArticles, "登録済み");

      await expect(qiitaArticles.locator("button", { hasText: "登録済み" })).not.toBeVisible({ timeout: 30000 });
      await expect(qiitaArticles.locator("button", { hasText: "後で読む" })).toHaveCount(30);

      const header = await getHeaderLocator(page);
      await header.locator("text=後で読む").first().click();

      await page.waitForLoadState();
      await expect(page.locator("h2", { hasText: "後で読む" })).toBeVisible({ timeout: 30000 });
      await expect(page.locator("a", { hasText: "Sample Article Title 1" })).not.toBeVisible();
    });

    test("Register to favorite with the Favorite button", async ({ page }) => {
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await articleButtonClick(page, qiitaArticles, "お気に入り登録");

      await expect(qiitaArticles.locator("button", { hasText: "お気に入り済み" })).toBeVisible({ timeout: 30000 });
      await expect(qiitaArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(29);

      const header = await getHeaderLocator(page);
      await header.locator("text=お気に入り").first().click();

      await page.waitForLoadState();
      await expect(page.locator("h2", { hasText: "お気に入り" })).toBeVisible({ timeout: 30000 });
      await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toBeVisible();
    });

    test("Delete favorite with Favorite button", async ({ page }) => {
      addTestArticle("favorites");
      await page.goto("/");

      const qiitaArticles = await getQiitaArticlesLocator(page);
      await articleButtonClick(page, qiitaArticles, "お気に入り済み");

      await expect(qiitaArticles.locator("button", { hasText: "お気に入り済み" })).not.toBeVisible({ timeout: 30000 });
      await expect(qiitaArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(30);

      const header = await getHeaderLocator(page);
      await header.locator("text=お気に入り").first().click();

      await page.waitForLoadState();
      await expect(page.locator("h2", { hasText: "お気に入り" })).toBeVisible({ timeout: 30000 });
      await expect(page.locator("a", { hasText: "Sample Article Title 1" })).not.toBeVisible();
    });

    test("The article link is correct", async ({ page, context }) => {
      await page.goto("/");

      const zennArticles = await getZennArticlesLocator(page);
      const pagePromise = context.waitForEvent("page");
      await zennArticles.locator("a", { hasText: "Sample Article Title 30" }).click();
      const newPage = await pagePromise;
      expect(newPage.url()).toBe("https://zenn.dev/sample-article-30");
    });

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
