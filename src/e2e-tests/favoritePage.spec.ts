import { addTestFavoriteArticle, deleteAllTestFavoriteArticles, updateTestFavoriteMemo } from "@/e2e-tests/actions";
import { beforeAction, mockStoredArticles } from "@/e2e-tests/mockHandlers";
import { test, expect, type Page, type Locator } from "next/experimental/testmode/playwright";

const getSearchFormLocator = async (page: Page) => await page.getByTestId("search-form");
const getAddArticleFormLocator = async (page: Page) => await page.getByTestId("add-article-form");
const getFavoriteArticlesLocator = async (page: Page) => await page.getByTestId("favorite-articles");
const getFirstArticleLocator = async (page: Page) => await page.getByTestId("article-1");

const checkLoading = async (page: Page) => {
  await expect(page.getByRole("button", { name: "loading" })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible({ timeout: 30000 });
};

const memoButtonClick = async (page: Page, text: string) => {
  const dialogName = text === "削除" ? "alertdialog" : "dialog";
  const h2Text = text === "削除" ? "メモを削除" : "メモを入力してください";
  await page
    .locator("button", { hasText: `メモを${text}` })
    .first()
    .click();
  const dialog = await page.getByRole(dialogName);
  await expect(dialog.locator("h2", { hasText: h2Text })).toBeVisible();

  return dialog;
};

const articleButtonClick = async (page: Page, text: string) => {
  await page.locator("button", { hasText: text }).first().click();
  const dialog = await page.getByRole("alertdialog");
  await expect(dialog.locator("h2", { hasText: "お気に入りを削除" })).toBeVisible();

  return dialog;
};

const dialogButtonClick = async (page: Page, dialog: Locator, text: string) => {
  await dialog.locator("button", { hasText: text }).click();
  await checkLoading(page);
};

const addArticleFormClick = async (page: Page, url: string) => {
  const addArticleForm = await getAddArticleFormLocator(page);
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill(url);
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await checkLoading(page);
};

test.describe("favorite page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });

  test("should display favoritepage", async ({ page }) => {
    await page.goto("/favorite");

    await expect(page.locator("h2", { hasText: "お気に入り" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "履歴" })).toBeVisible();

    const searchForm = await getSearchFormLocator(page);
    await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
    await expect(searchForm.locator("button", { hasText: "検索" })).toBeVisible();

    const addArticleForm = await getAddArticleFormLocator(page);
    await expect(addArticleForm.getByPlaceholder("追加したいURLを入力")).toBeVisible();
    await expect(addArticleForm.locator("button", { hasText: "追加" })).toBeVisible();
  });

  test("should display Articles", async ({ page, next }) => {
    mockStoredArticles(next, 30, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await expect(favoriteArticles.getByRole("link", { name: "Sample Article Title 1", exact: true })).toBeVisible();
    await expect(favoriteArticles.locator("a", { hasText: "Sample Article Title 30" })).toBeVisible();
    await expect(favoriteArticles.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
    await expect(favoriteArticles.locator("a", { hasText: "Tag1" })).toHaveCount(15);
    await expect(favoriteArticles.locator("a", { hasText: "Tag2" })).toHaveCount(15);
    await expect(favoriteArticles.locator("button", { hasText: "メモを追加" })).toHaveCount(30);
    await expect(favoriteArticles.locator("button", { hasText: "削除" })).toHaveCount(30);
  });

  test("should display pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
    await expect(activeButton).toHaveCount(2);
    await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

    await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
  });

  test("should display pagination when less article", async ({ page, next }) => {
    mockStoredArticles(next, 150, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
    await expect(activeButton).toHaveCount(2);
    await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

    await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.getByRole("link", { name: "5", exact: true })).toHaveCount(2);
    await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).not.toBeVisible();
    await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
    await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).not.toBeVisible();
  });

  test("Clicking the add memo button will display a dialogue", async ({ page, next }) => {
    mockStoredArticles(next, 150, "favorite");
    await page.goto("/favorite");

    const dialog = await memoButtonClick(page, "追加");
    await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "追加" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Clicking the add memo button will display a dialogue when have a memo", async ({ page, next }) => {
    mockStoredArticles(next, 1, "favorite", true);
    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);

    await expect(favoriteArticles.locator("button", { hasText: "メモを削除" })).toBeVisible();
    await expect(favoriteArticles.locator("text=test")).toBeVisible();

    const dialog = await memoButtonClick(page, "編集");
    await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
    await expect(dialog.locator("text=test")).toBeVisible();
    await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
    await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Click on a tag to go to the search page", async ({ page, next }) => {
    mockStoredArticles(next, 40, "favorite");
    await page.goto("/favorite");

    await page.locator("text=Tag1").first().click();
    await page.waitForLoadState();

    await expect(page.locator('input[name="name"]')).toHaveValue("Tag1", { timeout: 30000 });
    expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestFavoriteArticles();
    });

    test.describe("add test articles", () => {
      test.beforeEach(async ({ page }) => {
        await addTestFavoriteArticle();
        await page.goto("/favorite");
      });

      test("Testing the Add Mome feature", async ({ page }) => {
        await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toBeVisible();

        const dialog = await await memoButtonClick(page, "追加");
        await page.fill('textarea[name="value"]', "test");

        await dialogButtonClick(page, dialog, "追加");

        await expect(page.locator("li", { hasText: "メモを追加しました" })).toBeVisible();
        const firstArticle = await getFirstArticleLocator(page);

        await expect(firstArticle.locator("text=test")).toBeVisible({ timeout: 30000 });
      });

      test("Testing the Cancel button of a dialog", async ({ page }) => {
        const dialog = await memoButtonClick(page, "追加");
        await dialog.locator("button", { hasText: "キャンセル" }).click();
        await expect(dialog).not.toBeVisible();
      });

      test("Testing the Delete Post Button", async ({ page }) => {
        const favoriteArticles = await getFavoriteArticlesLocator(page);
        const dialog = await articleButtonClick(page, "削除");
        await expect(dialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
        await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

        await dialogButtonClick(page, dialog, "削除");

        await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible({ timeout: 30000 });
        await expect(favoriteArticles.locator("text=記事がありません")).not.toBeVisible({ timeout: 30000 });
      });
    });

    test.describe("add test memos", () => {
      test.beforeEach(async ({ page }) => {
        const articleId = await addTestFavoriteArticle();
        await updateTestFavoriteMemo(articleId);
        await page.goto("/favorite");
      });

      test("Testing the editing feature of memos", async ({ page }) => {
        const firstArticle = await getFirstArticleLocator(page);
        await expect(firstArticle.locator("text=test")).toBeVisible();

        const dialog = await memoButtonClick(page, "編集");
        await expect(dialog.locator("text=test")).toBeVisible();
        await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
        await page.fill('textarea[name="value"]', "edit");

        await dialogButtonClick(page, dialog, "編集");

        await expect(page.locator("li", { hasText: "メモを編集しました" })).toBeVisible();

        await expect(firstArticle.locator("text=edit")).toBeVisible({ timeout: 30000 });
      });

      test("Testing the deleting feature of memos", async ({ page }) => {
        const firstArticle = await getFirstArticleLocator(page);

        const dialog = await memoButtonClick(page, "削除");
        await expect(dialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
        await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

        await dialogButtonClick(page, dialog, "削除");

        await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
        await expect(firstArticle.locator("text=test")).not.toBeVisible({ timeout: 30000 });
      });
    });

    test.describe("skip webkit", () => {
      test.beforeEach(async ({ page, browserName }, testInfo) => {
        test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
        if (testInfo.title.includes("登録済みです")) {
          await addTestFavoriteArticle();
        }
        await page.goto("/favorite");
      });

      test("search form is working properly", async ({ page }) => {
        const searchForm = await getSearchFormLocator(page);
        await searchForm.getByPlaceholder("検索ワードを入力").fill("test");
        await searchForm.locator("button", { hasText: "検索" }).click();

        await checkLoading(page);
        expect(page.url()).toBe("http://localhost:3000/favorite?query=test");
      });

      test("If the URL is correct, the article can be registered using addArticleForm", async ({ page }) => {
        await addArticleFormClick(page, "https://zennta.vercel.app/");
        await expect(page.locator("li", { hasText: "登録しました" })).toBeVisible();

        const favoriteArticles = await getFavoriteArticlesLocator(page);
        await expect(favoriteArticles.locator("a", { hasText: "Zennta" })).toBeVisible({ timeout: 30000 });
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
