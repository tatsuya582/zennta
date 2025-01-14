import { type Cookie } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
import fs from "fs";

const USER_JSON_PATH = "src/e2e-tests/.auth/user.json";

export async function createClient() {
  const userJson = JSON.parse(fs.readFileSync(USER_JSON_PATH, "utf-8"));

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return userJson.cookies.map((cookie: Cookie) => ({
          name: cookie.name,
          value: cookie.value,
          options: {
            domain: cookie.domain,
            path: cookie.path,
            expires: new Date(cookie.expires * 1000),
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
          },
        }));
      },
    },
  });
}

const sampleArticle = {
  id: "article-1",
  url: "https://example.com/sample-article-1",
  title: "Sample Article Title 1",
  created_at: new Date(Date.now()).toISOString(),
  tags: [{ name: "Tag1" }, { name: "Tag2" }],
};

const testTitle = "テストタイトル";

export const addTestArticle = async (tabelName: "favorites" | "readLaters") => {
  const rpc = tabelName === "favorites" ? "insert_favorite_with_article" : "insert_read_later_with_article";
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(rpc, {
    userid: process.env.NEXT_PUBLIC_TEST_USER_ID!,
    articleurl: sampleArticle.url,
    articletitle: sampleArticle.title,
    articlesourcecreatedat: sampleArticle.created_at,
    tags: sampleArticle.tags,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteAllTestArticles = async (tabelName: "favorites" | "readLaters" | "histories" | "favoriteGroups") => {
  const supabase = await createClient();

  const { error } = await supabase.from(tabelName).delete().eq("userId", process.env.NEXT_PUBLIC_TEST_USER_ID!);

  if (error) {
    console.error("エラー:", error);
  }
};

export const addFavorite = async () => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("favorites")
    .insert({ userId: process.env.NEXT_PUBLIC_TEST_USER_ID!, articleId: process.env.NEXT_PUBLIC_TEST_ARTICLE_ID! });
  if (error) {
    console.error("エラー:", error);
  }
};

export const updateTestFavoriteMemo = async (id: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("favorites").update({ memo: "test" }).eq("id", id);

  if (error) {
    console.error("エラー:", error);
  }
};

export const updateTestUser = async () => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ name: process.env.NEXT_PUBLIC_TEST_USER! })
    .eq("id", process.env.NEXT_PUBLIC_TEST_USER_ID!);

  if (error) {
    console.error("エラー:", error);
  }
};

export const addTestFavoriteGroup = async () => {
  try {
    const supabase = await createClient();

    const articleId = await addTestArticle("favorites");

    const groupArticle = {
      favoriteId: articleId,
      title: sampleArticle.title,
    };

    const { data } = await supabase.rpc("add_favorite_group", {
      user_id: process.env.NEXT_PUBLIC_TEST_USER_ID!,
      group_title: testTitle,
      articles: [groupArticle],
    });

    return data;
  } catch (error) {
    console.error(`Error adding favoriteGroup:`, error);
    throw error;
  }
};
