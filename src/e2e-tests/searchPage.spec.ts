import { addTestArticle, deleteAllTestArticles } from "@/e2e-tests/actions";
import {
  articleButtonClick,
  checkFooter,
  checkHeader,
  checkSearchForm,
  getHeaderLocator,
  getQiitaArticlesLocator,
  getZennArticlesLocator,
  paginationActiveCheck,
  paginationDisplayLocator,
  paginationMorePagesCheck,
  searchFormClick,
} from "@/e2e-tests/locator";
import { beforeAction, mockSearchQiitaArticles, mockSearchZennArticles } from "@/e2e-tests/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.describe("search page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });
  test("should display searchpage", async ({ page }) => {
    await page.goto("/search");

    await expect(page.locator("h2", { hasText: "履歴" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "検索" })).toBeVisible();
    await checkSearchForm(page);
    await expect(page.locator("p", { hasText: "なにか入力してください" })).toBeVisible();
  });

  test("Headers and footers are rendered", async ({ page }) => {
    await page.goto("/search");
    await checkHeader(page);
    await checkFooter(page);
  });

  test("Display the search page when you actually search", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
    const testValue = "test";
    await page.goto("/search");

    await searchFormClick(page, testValue);

    const searchInput = await page.locator('input[name="name"]');
    await expect(searchInput).toHaveValue(testValue, { timeout: 30000 });
    expect(page.url()).toBe(`http://localhost:3000/search?query=${testValue}`);
  });

  test("should display Qiita Articles", async ({ page }) => {
    await page.goto("/search?query=test");

    await expect(page.locator("h2", { hasText: "Qiita一覧" })).toBeVisible();
    const qiitaArticles = await getQiitaArticlesLocator(page);
    await expect(qiitaArticles.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
    await expect(qiitaArticles.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
    await expect(qiitaArticles.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
    await expect(qiitaArticles.locator("a", { hasText: "Tag1" })).toHaveCount(15);
    await expect(qiitaArticles.locator("a", { hasText: "Tag2" })).toHaveCount(15);
    await expect(qiitaArticles.locator("button", { hasText: "後で読む" })).toHaveCount(30);
    await expect(qiitaArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(30);
  });

  test("should display Zenn Articles", async ({ page }) => {
    await page.goto("/search?query=test");

    await expect(page.locator("h2", { hasText: "Zenn一覧" })).toBeVisible();
    const zennArticles = await getZennArticlesLocator(page);
    await expect(zennArticles.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
    await expect(zennArticles.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
    await expect(zennArticles.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
    await expect(zennArticles.locator("button", { hasText: "後で読む" })).toHaveCount(30);
    await expect(zennArticles.locator("button", { hasText: "お気に入り登録" })).toHaveCount(30);
  });

  test("should display pagination of Qiita Articles", async ({ page }) => {
    await page.goto("/search?query=test");
    const qiitaArticles = await getQiitaArticlesLocator(page);

    await paginationActiveCheck(qiitaArticles, "1");
    await paginationDisplayLocator(qiitaArticles, ["2", "3", "Go to next page", "Go to the last page"]);
    await paginationMorePagesCheck(qiitaArticles);
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
    expect(page.url()).toBe(`http://localhost:3000/search?query=test&qiitapage=${testPage}&zennpage=1#qiitaarticles`);
  });

  test("The last page of the Qiita article is page 100", async ({ page }) => {
    await page.goto("/search?query=test");
    const testPage = "100";

    const qiitaArticles = await getQiitaArticlesLocator(page);

    await qiitaArticles.getByRole("link", { name: "Go to the last page" }).first().click();
    await page.waitForLoadState();

    await paginationActiveCheck(qiitaArticles, testPage);
    await paginationDisplayLocator(qiitaArticles, ["98", "99", "Go to previous page", "Go to the first page"]);
    await paginationMorePagesCheck(qiitaArticles);
    expect(page.url()).toBe(`http://localhost:3000/search?query=test&qiitapage=${testPage}&zennpage=1#qiitaarticles`);
  });

  test("Testing pagination when there are few Qiita articles", async ({ page, next }) => {
    mockSearchQiitaArticles(next);
    await page.goto("/search?query=test");

    const qiitaArticles = await getQiitaArticlesLocator(page);
    await paginationActiveCheck(qiitaArticles, "1");
    await paginationDisplayLocator(qiitaArticles, ["2", "3", "4", "5"]);
    await expect(qiitaArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
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

  test("Click on a tag to go to the search page", async ({ page, next }) => {
    await page.goto("/search?query=test");

    await page.locator("text=Tag1").first().click();
    await page.waitForLoadState();

    await expect(page.getByPlaceholder("検索ワードを入力")).toHaveValue("Tag1", { timeout: 30000 });
    expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestArticles("readLaters");
      await deleteAllTestArticles("favorites");
    });

    test("Register to read later with the Read Later button", async ({ page }) => {
      await page.goto("/search?query=test");

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
      await page.goto("/search?query=test");

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
      await page.goto("/search?query=test");

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
      await page.goto("/search?query=test");

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
  });
});
