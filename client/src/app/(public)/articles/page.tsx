import { ArticleList } from "@/components/organisms/ArticleList";
import { Search } from "lucide-react";
import * as articleService from "@/actions/article";
import Link from "next/link";

export default async function PublicArticlesPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string; category?: string };
}) {
    const params = await searchParams;

    const currentPage = Number(params.page) || 1;
    const currentSearch = params.search || "";
    const currentCategory = params.category || "";

    const [categoriesRes, articlesRes] = await Promise.all([
        articleService.getCategories(),
        articleService.getArticles(currentPage, 12, {
            search: currentSearch,
            category: currentCategory,
        }),
    ]);

    const categories = categoriesRes.data || [];
    const articles = articlesRes.data || [];
    const totalPages = articlesRes.meta?.pagination?.pageCount || 1;

    return (
        <div className="container mx-auto px-6 py-30">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                    Todas las <span className="text-gradient">Publicaciones</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Descubre las investigaciones, artículos tecnológicos y proyectos de los miembros de SOCITEC.
                </p>
            </div>

            <div className="max-w-4xl mx-auto mb-10 space-y-4">
                <form action="/articles" method="GET" className="relative">
                    {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={currentSearch}
                        placeholder="Buscar artículos por título o descripción..."
                        className="w-full pl-12 pr-12 py-3.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4db]/50 transition-colors"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#00b4db]">
                        Buscar
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/articles?search=${currentSearch}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!currentCategory
                            ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        Todos
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/articles?search=${currentSearch}&category=${cat.slug}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentCategory === cat.slug
                                ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
            <ArticleList
                initialArticles={articles}
                initialTotalPages={totalPages}
                currentPage={currentPage}
                readOnly={true}
                basePath="/articles"
                emptyTitle="No se encontraron artículos"
                emptyDescription="No hay artículos publicados que coincidan con tu búsqueda."
                showCreateButton={false}
            />
        </div>
    );
}
