import { Database } from "@/types/database.types";
import { Tag } from "@/types/types";

export type FetchedArticle = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { url: string; id: string } | null;
};

export type FetchedArticles = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { id: string; url: string; tags: Tag[] | null; title: string };
};
