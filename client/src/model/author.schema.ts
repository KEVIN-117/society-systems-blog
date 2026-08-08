import type { ArticleCardArticle } from "@/model/article.schema";

export interface StrapiMedia {
  url: string;
  alternativeText: string | null;
}

export interface PublicAuthor {
  documentId: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar: StrapiMedia | null;
}

export interface ArticleSummary extends ArticleCardArticle {
  slug: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface AuthorArticlesPage {
  author: PublicAuthor;
  articles: ArticleSummary[];
  pagination: PaginationMeta;
}
