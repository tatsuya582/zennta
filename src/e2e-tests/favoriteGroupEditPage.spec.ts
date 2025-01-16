import { addTestArticle, addTestFavoriteGroup, deleteAllTestArticles } from "@/e2e-tests/helpers/actions";
import { checkDisplay } from "@/e2e-tests/helpers/commonChecks";
import {
  articleButtonClick,
  checkLink,
  checkSearchForm,
  getAddArticlesLocator,
  getDeletedArticlesLocator,
  getNotSelectedArticlesLocator,
  getSelectedArticlesLocator,
} from "@/e2e-tests/helpers/locator";
import { beforeAction } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.describe("favoriteGroupEdit page test", () => {
  let groupId: string;
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
    groupId = await addTestFavoriteGroup();
    addTestArticle("favorites", 2);
  });

  test.afterEach(async () => {
    deleteAllTestArticles("favorites");
    deleteAllTestArticles("favoriteGroups");
  });

  test("should display favoriteGroupEditpage", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);

    await checkDisplay(page, "テストタイトル 編集", { useSearchForm: false });
    const selectedArticles = await getSelectedArticlesLocator(page);
    await expect(selectedArticles.locator("h3", { hasText: "選択中の記事" })).toBeVisible();
    await expect(selectedArticles.getByPlaceholder("グループ名")).toBeVisible();
    await expect(selectedArticles.locator("button", { hasText: "編集" })).toBeVisible();

    await expect(selectedArticles.locator("text=Sample Article Title 1")).toBeVisible();
    await expect(selectedArticles.locator("button", { hasText: "削除" })).toBeVisible();

    const deletedArticles = await getDeletedArticlesLocator(page);
    await expect(deletedArticles.locator("h3", { hasText: "削除選択中の記事" })).toBeVisible();
    await expect(deletedArticles.locator("text=記事が選択されていません")).toBeVisible();

    await expect(page.locator("button", { hasText: "記事を追加" })).toBeVisible();
  });

  test("test back button", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);

    const button = await page.locator("button", { hasText: "戻る" });
    await checkLink(page, button, "戻る", "favorite", { h2Text: "お気に入り" });
  });

  test("Test whether the article moves when you press the button", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);
    const selectedArticles = await getSelectedArticlesLocator(page);
    await selectedArticles.locator("button", { hasText: "削除" }).click();
    await expect(selectedArticles.locator("text=記事が選択されていません")).toBeVisible();

    const deletedArticles = await getDeletedArticlesLocator(page);
    await expect(deletedArticles.locator("text=Sample Article Title 1")).toBeVisible();
    await deletedArticles.locator("button", { hasText: "選択" }).click();
    await expect(deletedArticles.locator("text=記事が選択されていません")).toBeVisible();

    await expect(selectedArticles.locator("text=Sample Article Title 1")).toBeVisible();
  });

  test("Click Add article to display unselected articles", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);

    const button = await getAddArticlesLocator(page);
    await articleButtonClick(page, button, "記事を追加");
    await checkSearchForm(page);

    const notSelectedArticles = await getNotSelectedArticlesLocator(page);
    await expect(notSelectedArticles.locator("button", { hasText: "クリア" })).toBeVisible();
    await expect(notSelectedArticles.locator("text=Sample Article Title 2")).toBeVisible();
    await expect(notSelectedArticles.locator("button", { hasText: "選択" })).toBeVisible();
    await expect(notSelectedArticles.locator("text=1ページ")).toHaveCount(2);
  });

  test("Test whether the article moves when you press the button after click button", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);

    const button = await getAddArticlesLocator(page);
    await articleButtonClick(page, button, "記事を追加");

    const notSelectedArticles = await getNotSelectedArticlesLocator(page);
    await notSelectedArticles.locator("button", { hasText: "選択" }).click();
    await expect(notSelectedArticles.locator("text=Sample Article Title 2")).not.toBeVisible();

    const selectedArticles = await getSelectedArticlesLocator(page);
    await expect(selectedArticles.locator("text=Sample Article Title 2")).toBeVisible();
    await selectedArticles.locator("button", { hasText: "削除" }).last().click();
    await expect(selectedArticles.locator("text=Sample Article Title 2")).not.toBeVisible();

    await expect(notSelectedArticles.locator("text=Sample Article Title 2")).toBeVisible();

    await selectedArticles.locator("button", { hasText: "削除" }).click();
    const deletedArticles = await getDeletedArticlesLocator(page);
    await expect(deletedArticles.locator("text=Sample Article Title 1")).toBeVisible();
  });

  test("If the title and article are the same, you cannot click the edit button", async ({ page }) => {
    await page.goto(`/favorite/${groupId}/edit`);

    const selectedArticles = await getSelectedArticlesLocator(page);
    await selectedArticles.locator("button", { hasText: "編集" }).click();
    await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();
  });

  test("Groups can be edited", async ({ page }) => {
    const newTitle = "テストタイトル改";
    await page.goto(`/favorite/${groupId}/edit`);

    const button = await getAddArticlesLocator(page);
    await articleButtonClick(page, button, "記事を追加");

    const selectedArticles = await getSelectedArticlesLocator(page);
    const notSelectedArticles = await getNotSelectedArticlesLocator(page);
    await selectedArticles.getByPlaceholder("グループ名").fill(newTitle);
    await notSelectedArticles.locator("button", { hasText: "選択" }).click();

    await articleButtonClick(page, selectedArticles, "編集");
    await expect(page.locator("li", { hasText: "お気に入りグループを編集しました" })).toBeVisible({ timeout: 30000 });

    await expect(page.getByRole("heading", { name: newTitle, level: 2, exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.locator("text=Sample Article Title 2")).toBeVisible();
    expect(page.url()).toBe(`http://localhost:3000/favorite/${groupId}`);
  });
});
