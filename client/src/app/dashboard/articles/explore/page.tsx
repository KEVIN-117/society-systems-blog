"use client";

import * as React from "react";
import { ArticleList } from "@/components/organisms/ArticleList";
import { BookOpen, Loader2, Search, X } from "lucide-react";
import { articleService } from "@/actions/article";
import { Article, Category } from "@/model/article.schema";
import { useSearchParams, useRouter } from "next/navigation";

export default function ExploreArticlesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await articleService.getCategories();
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    React.useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const filters: { search?: string; category?: string } = {};
                if (currentSearch) filters.search = currentSearch;
                if (currentCategory) filters.category = currentCategory;

                const response = await articleService.getArticles(currentPage, 8, filters);
                setArticles(response.data);
                setTotalPages(response.meta.pagination.pageCount);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage, currentSearch, currentCategory]);

    const updateFilters = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        if (!updates.page) {
            params.set('page', '1');
        }
        router.push(`/dashboard/articles/explore?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchInput });
    };

    const clearSearch = () => {
        setSearchInput('');
        updateFilters({ search: '' });
    };

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
                <form onSubmit={handleSearch} className="relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Buscar artículos..."
                        className="w-full pl-12 pr-12 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4db]/50 transition-colors text-sm"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => updateFilters({ category: '' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!currentCategory
                                ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilters({ category: cat.slug })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currentCategory === cat.slug
                                    ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center text-[#00b4db]">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="text-sm font-medium">Cargando artículos...</p>
                        </div>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
