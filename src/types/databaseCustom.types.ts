import { Database } from "@/types/database.types";
import { Tag } from "@/types/types";

export type FetchedArticle = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { url: string; id: string } | null;
};

export type FetchedArticles = Database["public"]["Tables"]["readLaters"]["Row"] & {
  id: string;
  url: string;
  tags: Tag[] | null;
  title: string;
  is_in_other_table: boolean;
};

export type FetchedArticlesWithCount = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: FetchedArticles[];
  total_count: number;
};
