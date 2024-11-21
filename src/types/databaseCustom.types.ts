import { Database } from "@/types/database.types";

export type ReadLaterArticle = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { url: string; id: string } | null;
};

export type ReadLaterArticles = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { id: string; url: string; tags: JSON | null; title: string };
};
