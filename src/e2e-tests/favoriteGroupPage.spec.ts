import { addTestFavoriteGroup, deleteAllTestArticles } from "@/e2e-tests/helpers/actions";
import { checkDisplay } from "@/e2e-tests/helpers/commonChecks";
import { checkLink, getFavoriteGroupLocator } from "@/e2e-tests/helpers/locator";
import { beforeAction } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.describe("favorite group page test", () => {
  let groupId: string;

  test.beforeEach(async ({ next }) => {
    beforeAction(next);
    groupId = await addTestFavoriteGroup();
  });

  test.afterEach(async () => {
    deleteAllTestArticles("favorites");
    deleteAllTestArticles("favoriteGroups");
  });

  test("should display favorite group page", async ({ page }) => {
    await page.goto(`/favorite/${groupId}`);

    await checkDisplay(page, "テストタイトル", { useSearchForm: false });
  });

  test("links are set correctly", async ({ page }) => {
    await page.goto(`/favorite/${groupId}`);

    const button = await page.locator("button", { hasText: "戻る" });
    await checkLink(page, button, "戻る", "favorite", { h2Text: "お気に入り" });
  });

  test("should display Articles", async ({ page }) => {
    await page.goto(`/favorite/${groupId}`);

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await expect(favoriteGroup.locator("a", { hasText: "Sample Article Title" })).toBeVisible();
    await expect(favoriteGroup.locator("a", { hasText: "Tag1" })).toBeVisible();
    await expect(favoriteGroup.locator("a", { hasText: "Tag2" })).toBeVisible();
  });
});
