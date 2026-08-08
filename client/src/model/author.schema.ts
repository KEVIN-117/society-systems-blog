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

export interface ArticleSummary {
  documentId: string;
  title: string;
  description: string | null;
  content: string | null;
  slug: string;
  publishedAt: string | null;
  createdAt: string;
  cover?: {
    url: string;
  } | null;
  categories: Array<{
    id: number;
    name: string;
  }>;
  author?: {
    name: string;
  };
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
