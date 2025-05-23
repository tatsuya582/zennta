import {
  addTestArticle,
  addTestFavoriteGroup,
  deleteAllTestArticles,
  updateTestFavoriteMemo,
} from "@/e2e-tests/helpers/actions";
import {
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
  addArticleFormClick,
  articleButtonClickAndReturnDialog,
  articleButtonClick,
  getFavoriteArticlesLocator,
  getFirstArticleLocator,
  checkLink,
  getFavoriteGroupLocator,
  getLinkButtonLocator,
} from "@/e2e-tests/helpers/locator";
import { beforeAction, mockStoredArticles } from "@/e2e-tests/helpers/mockHandlers";
import { test, expect } from "next/experimental/testmode/playwright";

const path = (page: string) => `favorite?page=${page}`;
test.describe("favorite page test", () => {
  test.beforeEach(async ({ next }) => {
    beforeAction(next);
  });

  test("should display favoritepage", async ({ page }) => {
    await page.goto("/favorite");

    await checkDisplay(page, "お気に入り", { useAddArticleForm: true });
    await expect(page.locator("a", { hasText: "お気に入りグループ作成" })).toBeVisible();
  });

  test("links are set correctly", async ({ page }) => {
    await page.goto("/favorite");

    const linkButton = await getLinkButtonLocator(page);
    await checkLink(page, linkButton, "お気に入りグループ作成", "favorite/create");
  });

  test("should display Articles", async ({ page, next }) => {
    mockStoredArticles(next, 30, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await checkDisplayArticles(favoriteArticles, { readLaterButton: "メモを追加", favoriteButton: "削除" });
  });

  test("should display pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await checkDisplayPagination(favoriteArticles);
  });

  test("should display pagination when less article", async ({ page, next }) => {
    mockStoredArticles(next, 150, "favorite");

    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await checkDisplayLessPagination(favoriteArticles);
  });

  test("Testing page functionality during pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "favorite");
    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await checkPaginationCorrectly(page, favoriteArticles, path);
  });

  test("Test the last page functionality of pagination", async ({ page, next }) => {
    mockStoredArticles(next, 3000, "favorite");
    await page.goto("/favorite");

    const favoriteArticles = await getFavoriteArticlesLocator(page);
    await checkLastPageOfPaginationCorrectly(page, favoriteArticles, path);
  });

  test("Clicking the add memo button will display a dialogue", async ({ page, next }) => {
    mockStoredArticles(next, 150, "favorite");
    await page.goto("/favorite");

    const dialog = await articleButtonClickAndReturnDialog(page, "メモを追加", "メモを入力してください");
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

    const dialog = await articleButtonClickAndReturnDialog(page, "メモを編集", "メモを入力してください");
    await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
    await expect(dialog.locator("text=test")).toBeVisible();
    await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
    await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
    await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
  });

  test("Click on a tag to go to the search page", async ({ page, next }) => {
    mockStoredArticles(next, 40, "favorite");
    await page.goto("/favorite");

    await checkTagCorrectly(page);
  });

  test.describe("use test actions", () => {
    test.afterEach(async () => {
      await deleteAllTestArticles("favorites");
    });

    test.describe("add test articles", () => {
      test.beforeEach(async ({ page }) => {
        await addTestArticle("favorites");
        await page.goto("/favorite");
      });

      test("Testing the Add Mome feature", async ({ page }) => {
        await expect(page.locator("a", { hasText: "Sample Article Title 1" })).toBeVisible();

        const dialog = await articleButtonClickAndReturnDialog(page, "メモを追加", "メモを入力してください");
        await page.fill('textarea[name="value"]', "test");

        await articleButtonClick(page, dialog, "追加");

        await expect(page.locator("li", { hasText: "メモを追加しました" })).toBeVisible();
        const firstArticle = await getFirstArticleLocator(page);

        await expect(firstArticle.locator("text=test")).toBeVisible({ timeout: 30000 });
      });

      test("Testing the Cancel button of a dialog", async ({ page }) => {
        const dialog = await articleButtonClickAndReturnDialog(page, "メモを追加", "メモを入力してください");
        await dialog.locator("button", { hasText: "キャンセル" }).click();
        await expect(dialog).not.toBeVisible();
      });

      test("Testing the Delete Post Button", async ({ page }) => {
        const favoriteArticles = await getFavoriteArticlesLocator(page);
        const dialog = await articleButtonClickAndReturnDialog(page, "削除", "お気に入りを削除", { alert: true });
        await expect(dialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
        await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

        await articleButtonClick(page, dialog, "削除");

        await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible({ timeout: 30000 });
        await expect(favoriteArticles.locator("text=記事がありません")).toBeVisible({ timeout: 30000 });
      });
    });

    test.describe("add test memos", () => {
      test.beforeEach(async ({ page }) => {
        const articleId = await addTestArticle("favorites");
        await updateTestFavoriteMemo(articleId);
        await page.goto("/favorite");
      });

      test("Testing the editing feature of memos", async ({ page }) => {
        const firstArticle = await getFirstArticleLocator(page);
        await expect(firstArticle.locator("text=test")).toBeVisible();

        const dialog = await articleButtonClickAndReturnDialog(page, "メモを編集", "メモを入力してください");
        await expect(dialog.locator("text=test")).toBeVisible();
        await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
        await page.fill('textarea[name="value"]', "edit");

        await articleButtonClick(page, dialog, "編集");

        await expect(page.locator("li", { hasText: "メモを編集しました" })).toBeVisible();

        await expect(firstArticle.locator("text=edit")).toBeVisible({ timeout: 30000 });
      });

      test("Testing the deleting feature of memos", async ({ page }) => {
        const firstArticle = await getFirstArticleLocator(page);

        const dialog = await articleButtonClickAndReturnDialog(page, "メモを削除", "メモを削除", { alert: true });
        await expect(dialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
        await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

        await articleButtonClick(page, dialog, "削除");

        await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
        await expect(firstArticle.locator("text=test")).not.toBeVisible({ timeout: 30000 });
      });
    });

    test.describe("skip webkit", () => {
      test.beforeEach(async ({ page, browserName }, testInfo) => {
        test.skip(browserName === "webkit", "This test is skipped on WebKit browsers.");
        if (testInfo.title.includes("登録済みです")) {
          await addTestArticle("favorites");
        }
        await page.goto("/favorite");
      });

      test("search form is working properly", async ({ page }) => {
        await checkSearchFormCorrectly(page, "favorite");
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

  test.describe("favorite group", () => {
    let groupId: string;
    test.beforeEach(async () => {
      groupId = await addTestFavoriteGroup();
    });

    test.afterEach(async () => {
      await deleteAllTestArticles("favorites");
      await deleteAllTestArticles("favoriteGroups");
    });

    test("should display favoritepage", async ({ page }) => {
      await page.goto("/favorite");

      await checkDisplay(page, "お気に入り", { useAddArticleForm: true });
      await expect(page.locator("a", { hasText: "お気に入りグループ作成" })).toBeVisible();

      const favoriteGroup = await getFavoriteGroupLocator(page);
      await expect(favoriteGroup.locator("h2", { hasText: "お気に入りグループ" })).toBeVisible();
      await expect(favoriteGroup.locator("button", { hasText: "削除" })).toBeVisible();
      await expect(favoriteGroup.locator("a", { hasText: "編集" })).toBeVisible();
      await checkLink(page, favoriteGroup, "テストタイトル", `favorite/${groupId}`);
    });

    test("test group edit button", async ({ page }) => {
      await page.goto("/favorite");

      const favoriteGroup = await getFavoriteGroupLocator(page);
      await checkLink(page, favoriteGroup, "編集", `favorite/${groupId}/edit`, { h2Text: "テストタイトル 編集" });
    });

    test("test group delete button", async ({ page }) => {
      await page.goto("/favorite");

      const favoriteGroup = await getFavoriteGroupLocator(page);
      const dialog = await articleButtonClickAndReturnDialog(page, "削除", "グループを削除", {
        alert: true,
        locator: favoriteGroup,
      });
      await articleButtonClick(page, dialog, "削除");
      await expect(favoriteGroup.locator("h2", { hasText: "お気に入りグループ" })).not.toBeVisible();
    });
  });
});
