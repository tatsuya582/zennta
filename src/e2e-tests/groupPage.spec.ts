import { addTestFavoriteGroup, deleteAllTestArticles, groupPublished } from "@/e2e-tests/helpers/actions";
import {
  checkDisplay,
  checkDisplayArticles,
  checkDisplayLessPagination,
  checkDisplayPagination,
  checkLastPageOfPaginationCorrectly,
  checkPaginationCorrectly,
} from "@/e2e-tests/helpers/commonChecks";
import { checkLink, getFavoriteGroupLocator } from "@/e2e-tests/helpers/locator";
import { beforeAction, mockGroups, mockStoredArticles } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

test.describe("group page test", () => {
  const path = (page: string) => `group?page=${page}`;
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });

  test("should display group page", async ({ page }) => {
    await page.goto("/group");

    await checkDisplay(page, "公開中のお気に入りグループ", { useSearchForm: false });
    await expect(page.locator("text=公開中のグループがありません")).toBeVisible();
  });

  test("should display Articles", async ({ page, next }) => {
    mockGroups(next, 10);

    await page.goto("/group");

    const favoriteGroup = await getFavoriteGroupLocator(page);

    await expect(favoriteGroup.getByRole("link", { name: "Sample Group Title 1", exact: true })).toBeVisible();
    await expect(page.locator("a", { hasText: "Sample Group Title 10" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Sample Group Title " })).toHaveCount(10);
    await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toHaveCount(10);
    await expect(page.locator("a", { hasText: "Sample Article Title " })).toHaveCount(30);
  });

  test("should display pagination", async ({ page, next }) => {
    mockGroups(next, 1000);

    await page.goto("/group");

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await checkDisplayPagination(favoriteGroup);
  });

  test("should display pagination when less group", async ({ page, next }) => {
    mockGroups(next, 50);

    await page.goto("/group");

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await checkDisplayLessPagination(favoriteGroup);
  });

  test("Testing page functionality during pagination", async ({ page, next }) => {
    mockGroups(next, 1000);

    await page.goto("/group");

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await checkPaginationCorrectly(page, favoriteGroup, path);
  });

  test("Test the last page functionality of pagination", async ({ page, next }) => {
    mockGroups(next, 1000);

    await page.goto("/group");

    const favoriteGroup = await getFavoriteGroupLocator(page);
    await checkLastPageOfPaginationCorrectly(page, favoriteGroup, path);
  });
  test.describe("use acitons", () => {
    let groupId: string;
    test.beforeEach(async () => {
      const group = await addTestFavoriteGroup(true);
      groupId = group.groupId;
      await groupPublished(groupId, group.favoriteId);
    });

    test.afterEach(async () => {
      deleteAllTestArticles("favorites");
      deleteAllTestArticles("favoriteGroups");
    });

    test("The title links to a detail page", async ({ page }) => {
      await page.goto("/group");
      const favoriteGroup = await getFavoriteGroupLocator(page);

      await checkLink(page, favoriteGroup, "テストタイトル", `favorite/${groupId}`);
    });
  });
});
