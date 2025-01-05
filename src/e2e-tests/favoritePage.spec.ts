import { beforeAction, mockFavoriteArticles } from "@/e2e-tests/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.beforeEach(async ({ page, next }) => {
  beforeAction(next);
});

test("should display favoritepage", async ({ page }) => {
  await page.goto("/favorite");

  await expect(page.locator('h2:has-text("お気に入り")')).toBeVisible();
  await expect(page.locator("text=履歴")).toBeVisible();

  const searchForm = await page.getByTestId("search-form");
  await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
  await expect(searchForm.locator("button", { hasText: "検索" })).toBeVisible();

  const addArticleForm = await page.getByTestId("add-article-form");
  await expect(addArticleForm.getByPlaceholder("追加したいURLを入力")).toBeVisible();
  await expect(addArticleForm.locator("button", { hasText: "追加" })).toBeVisible();
});

test("should display Articles", async ({ page, next }) => {
  mockFavoriteArticles(next, 40);

  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
  await expect(favoriteArticles.getByRole("link", { name: "Favorite Article Title 1", exact: true })).toBeVisible();
  await expect(favoriteArticles.locator("text=Favorite Article Title 30")).toBeVisible();
  await expect(favoriteArticles.locator("text=Favorite Article Title")).toHaveCount(30);
  await expect(favoriteArticles.locator("text=Tag1")).toHaveCount(15);
  await expect(favoriteArticles.locator("text=Tag2")).toHaveCount(15);
  await expect(favoriteArticles.locator("text=メモを追加")).toHaveCount(30);
  await expect(favoriteArticles.locator("text=削除")).toHaveCount(30);
});

test("should display pagination", async ({ page, next }) => {
  mockFavoriteArticles(next, 3000);

  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
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
  mockFavoriteArticles(next, 120);

  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
  const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).not.toBeVisible();
  await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
  await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).not.toBeVisible();
});

test("Clicking the add memo button will display a dialogue", async ({ page, next }) => {
  mockFavoriteArticles(next, 150);
  await page.goto("/favorite");

  const addMemoButton = await page.locator("button", { hasText: "メモを追加" });
  addMemoButton.first().click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "メモを入力してください" })).toBeVisible();
  await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "追加" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
});

test("Clicking the add memo button will display a dialogue when have a memo", async ({ page, next }) => {
  mockFavoriteArticles(next, 1, true);
  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
  const editButton = favoriteArticles.locator("button", { hasText: "メモを編集" });
  await expect(editButton).toBeVisible();
  await expect(favoriteArticles.locator("button", { hasText: "メモを削除" })).toBeVisible();
  await expect(favoriteArticles.locator("text=test")).toBeVisible();
  editButton.click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "メモを入力してください" })).toBeVisible();
  await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
  await expect(dialog.locator("text=test")).toBeVisible();
  await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
  await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
});

test("Test the button behavior", async ({ page }) => {
  await page.goto("/");

  // テスト用の記事をお気に入りに追加
  const qiitaArticles = await page.getByTestId("qiita-articles");
  await qiitaArticles.locator("text=お気に入り登録").first().click();
  await page.waitForLoadState();

  await expect(qiitaArticles.getByRole("button", { name: "loading" })).toBeVisible();
  await page.waitForLoadState();

  await expect(qiitaArticles.locator("text=お気に入り済み")).toBeVisible();

  const header = await page.getByTestId("header");
  await header.locator("text=お気に入り").first().click();
  await page.waitForLoadState();

  await expect(page.locator("h2", { hasText: "お気に入り" })).toBeVisible();
  await expect(page.locator("text=Sample Qiita Article Title 1")).toBeVisible();

  // メモを追加の挙動をテスト
  const addMemoButton = await page.getByRole("button", { name: "メモを追加" }).first();
  addMemoButton.click();

  const dialog = await page.getByRole("dialog");
  await page.fill('textarea[name="value"]', "test");

  const addButton = await dialog.locator("button", { hasText: "追加" });
  addButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "メモを追加しました" })).toBeVisible();
  const firstArticle = await page.getByTestId("article-1");

  await expect(firstArticle.locator("text=test")).toBeVisible({ timeout: 60000 });
  await page.waitForLoadState();

  // メモを編集の挙動をテスト
  const editMemoButton = await page.getByRole("button", { name: "メモを編集" }).first();
  await expect(editMemoButton).toBeVisible();

  editMemoButton.click();
  await page.waitForLoadState();
  await expect(dialog.locator("text=test")).toBeVisible();
  await expect(addButton).not.toBeVisible();
  await page.fill('textarea[name="value"]', "edit");
  await dialog.locator("button", { hasText: "編集" }).click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "メモを編集しました" })).toBeVisible();
  await page.waitForLoadState();

  editMemoButton.click();
  await page.waitForLoadState();
  await expect(dialog.locator("h2", { hasText: "メモを入力してください" })).toBeVisible();
  await expect(dialog.locator("text=edit")).toBeVisible();

  // キャンセルの挙動をテスト
  await dialog.locator("button", { hasText: "キャンセル" }).click();
  await page.waitForLoadState();
  await expect(dialog).not.toBeVisible();

  const daleteMemoButton = await page.getByRole("button", { name: "メモを削除" }).first();

  // メモの削除ボタンの挙動をテスト
  daleteMemoButton.click();
  const alertDialog = await page.getByRole("alertdialog");

  await expect(alertDialog.locator("h2", { hasText: "メモを削除" })).toBeVisible();
  await expect(alertDialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();

  const deleteButton = alertDialog.locator("button", { hasText: "削除" });
  await expect(deleteButton).toBeVisible();
  await expect(alertDialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

  deleteButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
  await expect(firstArticle.locator("text=edit")).not.toBeVisible();

  // 記事の削除ボタンの挙動をテスト
  await page.locator("button", { hasText: "削除" }).first().click();
  await expect(alertDialog.locator("h2", { hasText: "お気に入りを削除" })).toBeVisible();
  await expect(alertDialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
  await expect(deleteButton).toBeVisible();
  await expect(alertDialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

  deleteButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
  await page.waitForLoadState();
  await expect(page.locator("text=Sample Qiita Article Title 1")).not.toBeVisible({ timeout: 60000 });
});

test("search form is working properly", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
  await page.goto("/favorite");

  const searchForm = await page.getByTestId("search-form");
  await searchForm.getByPlaceholder("検索ワードを入力").fill("Tag");
  await searchForm.locator("button", { hasText: "検索" }).click();
  await page.waitForLoadState();

  await expect(searchForm.getByRole("button", { name: "loading" })).toBeVisible();
  await expect(searchForm.getByRole("button", { name: "loading" })).not.toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/favorite?query=Tag");
});

test("Test the behavior of addArticleForm", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
  await page.goto("/favorite");

  const addArticleForm = await page.getByTestId("add-article-form");
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill("https://zennta.vercel.app/");
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await page.waitForLoadState();

  await expect(page.getByRole("button", { name: "loading" })).toBeVisible();
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();

  await expect(page.locator("li", { hasText: "登録しました" })).toBeVisible();
  const favoriteArticles = await page.getByTestId("favorite-articles");

  await expect(favoriteArticles.locator("text=Zennta")).toBeVisible({ timeout: 60000 });
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill("https://zennta.vercel.app/");
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await page.waitForLoadState();

  await expect(page.getByRole("button", { name: "loading" })).toBeVisible();
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();

  await expect(page.locator("li", { hasText: "登録済みです" })).toBeVisible();

  await favoriteArticles.locator("button", { hasText: "削除" }).first().click();
  const alertDialog = await page.getByRole("alertdialog");

  await alertDialog.locator("button", { hasText: "削除" }).click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
});

test("サイトがありませんmessage appears when URL is incorrect", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
  await page.goto("/favorite");

  const addArticleForm = await page.getByTestId("add-article-form");
  await addArticleForm.getByPlaceholder("追加したいURLを入力").fill("https://nofetch");
  await addArticleForm.locator("button", { hasText: "追加" }).click();

  await page.waitForLoadState();

  await expect(page.getByRole("button", { name: "loading" })).toBeVisible({ timeout: 60000 });
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible({ timeout: 60000 });

  await expect(page.locator("li", { hasText: "サイトがありません" })).toBeVisible();
});

test("Click on a tag to go to the search page", async ({ page, next }) => {
  mockFavoriteArticles(next, 40);
  await page.goto("/favorite");

  const tagsbutton = await page.locator("text=Tag1");
  tagsbutton.first().click();
  await page.waitForLoadState();

  const searchInput = await page.locator('input[name="name"]');
  await expect(searchInput).toHaveValue("Tag1", { timeout: 50000 });
  expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
});
