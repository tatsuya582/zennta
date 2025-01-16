import { Database } from "@/types/database.types";
import { FetchedItem, type Tag } from "@/types/types";

export type FetchedArticle = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { url: string; id: string } | null;
};

export type FetchedArticles = Database["public"]["Tables"]["readLaters"]["Row"] & {
  id: string;
  column_id: string;
  other_column_id: string | null;
  url: string;
  tags: Tag[] | null;
  custom_tags: Tag[] | null;
  memo: string | null;
  title: string;
  is_in_other_table: boolean;
};

export type FetchedArticlesWithCount = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: FetchedArticles[];
  total_count: number;
};

export type groupByUser = Database["public"]["Tables"]["favoriteGroups"]["Row"] & {
  articles: FetchedItem[];
};
