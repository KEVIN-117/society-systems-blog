import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorArticlesPage } from "@/actions/authors";
import { ArticleCard } from "@/components/molecules/ArticleCard";
import { AuthorPagination } from "@/components/molecules/AuthorPagination";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getStrapiUrl } from "@/lib/strapi";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

function parsePage(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (Array.isArray(value) || !/^\d+$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : null;
}

function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "A"
  );
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;

  return { title: `Perfil de autor | ${decodeURIComponent(slug)}` };
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = parsePage(query.page);
  if (page === null) notFound();

  const result = await getAuthorArticlesPage(slug, page);
  if (!result) notFound();
  if (page > 1 && page > result.pagination.pageCount) notFound();

  const { author, articles, pagination } = result;
  const avatarUrl = author.avatar?.url
    ? getStrapiUrl(author.avatar.url)
    : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex-grow pt-28 pb-12">
        <div className="container mx-auto px-6">
          <section className="glass-card relative overflow-hidden p-6 sm:p-8 md:p-12">
            <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[#006f87]/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <Avatar className="size-28 border-2 border-white/15 shadow-2xl sm:size-36">
                {avatarUrl && (
                  <AvatarImage
                    src={avatarUrl}
                    alt={
                      author.avatar?.alternativeText ||
                      `Avatar de ${author.name}`
                    }
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-[#72004c] to-[#006f87] text-3xl font-bold text-white">
                  {initials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 max-w-3xl">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#66d9ff]">
                  Autor
                </p>
                <h1 className="break-words text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  {author.name}
                </h1>
                <p className="mt-4 whitespace-pre-line break-words leading-relaxed text-gray-300">
                  {author.bio?.trim() ||
                    "Este autor todavía no ha añadido una biografía."}
                </p>
              </div>
            </div>
          </section>

          <section className="py-16" aria-labelledby="author-articles-heading">
            <div className="mb-10">
              <h2
                id="author-articles-heading"
                className="break-words text-3xl font-bold text-white md:text-4xl"
              >
                Artículos de{" "}
                <span className="text-gradient-blue">{author.name}</span>
              </h2>
              {pagination.total > 0 && (
                <p className="mt-3 text-gray-400">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "publicación" : "publicaciones"}
                </p>
              )}
            </div>

            {articles.length === 0 ? (
              <Empty className="glass-card min-h-64 border-white/10">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookOpen />
                  </EmptyMedia>
                  <EmptyTitle className="text-lg text-white">
                    Aún no hay artículos
                  </EmptyTitle>
                  <EmptyDescription>
                    {author.name} todavía no ha publicado ningún artículo.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.documentId}
                    article={article}
                    readOnly
                    basePath="/articles"
                  />
                ))}
              </div>
            )}

            <AuthorPagination
              slug={author.slug}
              currentPage={pagination.page}
              pageCount={pagination.pageCount}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
