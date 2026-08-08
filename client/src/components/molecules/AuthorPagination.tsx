import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AuthorPaginationProps {
  slug: string;
  currentPage: number;
  pageCount: number;
}

function authorPageHref(slug: string, page: number): string {
  return page === 1 ? `/authors/${slug}` : `/authors/${slug}?page=${page}`;
}

export function AuthorPagination({
  slug,
  currentPage,
  pageCount,
}: AuthorPaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from(
    { length: pageCount },
    (_, index) => index + 1,
  ).filter(
    (page) =>
      page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1,
  );

  return (
    <Pagination className="mt-12" aria-label="Páginas de artículos">
      <PaginationContent className="flex-wrap">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={authorPageHref(slug, currentPage - 1)}
              text="Anterior"
            />
          </PaginationItem>
        )}
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          return (
            <span className="contents" key={page}>
              {previousPage && page - previousPage > 1 && (
                <PaginationItem
                  aria-hidden="true"
                  className="px-2 text-gray-500"
                >
                  …
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={authorPageHref(slug, page)}
                  isActive={page === currentPage}
                  aria-label={`Ir a la página ${page}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </span>
          );
        })}
        {currentPage < pageCount && (
          <PaginationItem>
            <PaginationNext
              href={authorPageHref(slug, currentPage + 1)}
              text="Siguiente"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
