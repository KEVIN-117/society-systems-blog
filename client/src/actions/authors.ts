import {
  findArticlesByAuthor,
  findAuthorBySlug,
} from "@/datasource/remote/authors";
import type { AuthorArticlesPage } from "@/model/author.schema";

export const ARTICLES_PER_PAGE = 6;

export async function getAuthorArticlesPage(
  slug: string,
  page: number,
): Promise<AuthorArticlesPage | null> {
  const author = await findAuthorBySlug(slug);
  if (!author) return null;

  const { articles, pagination } = await findArticlesByAuthor(
    author.documentId,
    page,
    ARTICLES_PER_PAGE,
  );

  return { author, articles, pagination };
}
