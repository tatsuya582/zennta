import { type Provider } from "@supabase/supabase-js";
import { type ReactNode } from "react";

export type SigninButtonProps = {
  provider: Provider;
  children: ReactNode;
};

export type ProfilePageLayoutProps = {
  title: string;
  isEdit: boolean;
};

export type QiitaSearchPagiNationProps = {
  query: string;
  qiitaPage: number;
  zennPage: number;
  totalPage: number;
};

export type ZennSearchPagiNationProps = {
  query: string;
  qiitaPage: number;
  zennPage: number;
  next: number | null;
};

export type SearchPagiNationProps = {
  query: string;
  qiitaPage: number;
  zennPage: number;
};

export type ArticleSearchProps = {
  query: string;
  currentPage: string;
  otherPage: string;
  currentSite: "Qiita" | "Zenn";
};

export type StoredItem = {
  id: string;
  url: string;
  tags: Tag[] | null;
  title: string;
};

export type FetchedItem = {
  id: string;
  title: string;
  url: string;
  tags: Tag[] | null;
  created_at: string;
};

export type QiitaItem = {
  id: string;
  title: string;
  url: string;
  tags: Tag[] | null;
  created_at: string; // ISO 8601 format, e.g., "2000-01-01T00:00:00+00:00"
};

export type Tag = {
  name: string;
};

export type QiitaArticlesResponse = {
  articles: FetchedItem[];
  totalPage: number;
};

export type ZennItem = {
  id: number;
  title: string;
  path: string;
  published_at: string;
};

export type ZennArticlesResponse = {
  articles: FetchedItem[];
  next_page: number | null;
};

export type History = {
  updatedAt: string;
  articles: StoredItem;
};
