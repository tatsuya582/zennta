import { checkDisplay } from "@/e2e-tests/helpers/commonChecks";
import {
  checkLink,
  getFavoriteGroupLocator,
  getLinkButtonLocator,
  getNotSelectedArticlesLocator,
  getSelectedArticlesLocator,
} from "@/e2e-tests/helpers/locator";
import { beforeAction, mockStoredArticles } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.describe("favorite group create page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });

  test("should display favorite group create page", async ({ page, next }) => {
    mockStoredArticles(next, 30, "group");
    await page.goto("/favorite/create");

    await checkDisplay(page, "お気に入りグループ作成");
    await expect(page.locator("button", { hasText: "クリア" })).toBeVisible();
    await expect(page.locator("a", { hasText: "戻る" })).toBeVisible();
    await expect(page.locator("text=1ページ")).toHaveCount(2);

    await expect(page.locator("h3", { hasText: "選択中の記事" })).toBeVisible();
    await expect(page.locator("label", { hasText: "グループ名" })).toBeVisible();
    await expect(page.locator("button", { hasText: "作成" })).toBeVisible();
    await expect(page.locator("text=記事が選択されていません")).toBeVisible();
    await expect(page.getByPlaceholder("グループ名")).toBeVisible();
  });

  test("links are set correctly", async ({ page, next }) => {
    mockStoredArticles(next, 30, "group");
    await page.goto("/favorite/create");

    const linkButton = await getLinkButtonLocator(page);
    await checkLink(page, linkButton, "戻る", "favorite", { h2Text: "お気に入り" });
  });

  test("should display Articles", async ({ page, next }) => {
    mockStoredArticles(next, 30, "group");

    await page.goto("/favorite/create");

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await expect(favoriteGroup.locator("text=Sample Article Title 30")).toBeVisible();
    await expect(favoriteGroup.locator("text=Sample Article Title ")).toHaveCount(30);
    await expect(favoriteGroup.locator("button", { hasText: "選択" })).toHaveCount(30);
  });

  test("Test whether an article can be selected", async ({ page, next }) => {
    mockStoredArticles(next, 30, "group");

    await page.goto("/favorite/create");
    const notSelectedArticles = await getNotSelectedArticlesLocator(page);
    const selectedArticles = await getSelectedArticlesLocator(page);

    await notSelectedArticles.locator("button", { hasText: "選択" }).first().click();
    await expect(notSelectedArticles.locator("text=Sample Article Title ")).toHaveCount(29);

    await expect(selectedArticles.locator("text=Sample Article Title 1")).toBeVisible();
    const deleteButton = await selectedArticles.locator("button", { hasText: "削除" });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(selectedArticles.locator("text=Sample Article Title 1")).not.toBeVisible();
    await expect(notSelectedArticles.locator("text=Sample Article Title ")).toHaveCount(30);
  });
});
