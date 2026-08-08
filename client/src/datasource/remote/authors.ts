import { getStrapiUrl } from "@/lib/strapi";
import type {
  ArticleSummary,
  PaginationMeta,
  PublicAuthor,
} from "@/model/author.schema";

interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination?: PaginationMeta };
}

export class StrapiRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Strapi request failed with status ${status}`);
    this.name = "StrapiRequestError";
  }
}

async function getFromStrapi<T>(
  path: string,
  params: URLSearchParams,
): Promise<T> {
  const response = await fetch(`${getStrapiUrl(path)}?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new StrapiRequestError(response.status);

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Strapi returned an invalid JSON response");
  }
}

export async function findAuthorBySlug(
  slug: string,
): Promise<PublicAuthor | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "fields[0]": "name",
    "fields[1]": "slug",
    "fields[2]": "bio",
    "populate[avatar][fields][0]": "url",
    "populate[avatar][fields][1]": "alternativeText",
    "pagination[pageSize]": "1",
  });
  const result = await getFromStrapi<StrapiListResponse<PublicAuthor>>(
    "/api/authors",
    params,
  );

  if (!Array.isArray(result.data))
    throw new Error("Strapi returned an invalid authors response");
  return result.data[0] ?? null;
}

export async function findArticlesByAuthor(
  authorDocumentId: string,
  page: number,
  pageSize: number,
): Promise<{ articles: ArticleSummary[]; pagination: PaginationMeta }> {
  const params = new URLSearchParams({
    "filters[author][documentId][$eq]": authorDocumentId,

    "fields[0]": "title",
    "fields[1]": "description",
    "fields[2]": "content",
    "fields[3]": "slug",
    "fields[4]": "publishedAt",
    "fields[5]": "createdAt",

    "populate[cover][fields][0]": "url",

    "populate[categories][fields][0]": "name",

    "populate[author][fields][0]": "name",

    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
    "pagination[withCount]": "true",

    "sort[0]": "publishedAt:desc",
  });
  const result = await getFromStrapi<StrapiListResponse<ArticleSummary>>(
    "/api/articles",
    params,
  );

  if (!Array.isArray(result.data) || !result.meta?.pagination) {
    throw new Error("Strapi returned an invalid articles response");
  }

  return { articles: result.data, pagination: result.meta.pagination };
}
