import * as React from "react";
import { ArticleList } from "@/components/organisms/ArticleList";
import { BookOpen, Search } from "lucide-react";
import * as articleService from "@/actions/article";
import Link from "next/link";

export default async function ExploreArticlesPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string; category?: string };
}) {
    const params = await searchParams;

    const currentPage = Number(params.page) || 1;
    const currentSearch = params.search || '';
    const currentCategory = params.category || '';

    const [categoriesRes, articlesRes] = await Promise.all([
        articleService.getCategories(),
        articleService.getArticles(currentPage, 8, { search: currentSearch, category: currentCategory })
    ]);

    const categories = categoriesRes.data || [];
    const articles = articlesRes.data || [];
    const totalPages = articlesRes.meta?.pagination?.pageCount || 1;

    return (
        <div className="flex-1 w-full p-4 md:p-8 pt-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-white">
                        Explorar <span className="text-gradient-blue">Artículos</span>
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Lee las publicaciones de todos los autores de SOCITEC.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-gray-400 text-sm">
                    <BookOpen className="w-4 h-4 text-[#00b4db]" />
                    Solo lectura
                </div>
            </div>

            <div className="relative z-10 mb-8 space-y-4">
                <form action="/dashboard/articles/explore" method="GET" className="relative max-w-xl">
                    {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={currentSearch}
                        placeholder="Buscar artículos..."
                        className="w-full pl-12 pr-12 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4db]/50 transition-colors text-sm"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#00b4db]">
                        Buscar
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/dashboard/articles/explore?search=${currentSearch}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!currentCategory
                            ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        Todos
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/dashboard/articles/explore?search=${currentSearch}&category=${cat.slug}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentCategory === cat.slug
                                ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <ArticleList
                    initialArticles={articles}
                    initialTotalPages={totalPages}
                    currentPage={currentPage}
                    readOnly={true}
                    basePath="/dashboard/articles/explore"
                    emptyTitle="No se encontraron artículos"
                    emptyDescription="Aún no hay artículos publicados por otros autores."
                    showCreateButton={false}
                />
            </div>
        </div>
    );
}
