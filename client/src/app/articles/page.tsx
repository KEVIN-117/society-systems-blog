"use client";

import * as React from "react";
import { ArticleList } from "@/components/organisms/ArticleList";
import { Loader2, Search, X } from "lucide-react";
import { articleService } from "@/actions/article";
import { Article, Category } from "@/model/article.schema";
import { useSearchParams, useRouter } from "next/navigation";

export default function PublicArticlesPage() {
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

    // Fetch categories for filters
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

    // Fetch articles with filters
    React.useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const filters: { search?: string; category?: string } = {};
                if (currentSearch) filters.search = currentSearch;
                if (currentCategory) filters.category = currentCategory;

                const response = await articleService.getArticles(currentPage, 12, filters);
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
        // Reset to page 1 when filters change
        if (!updates.page) {
            params.set('page', '1');
        }
        router.push(`/articles?${params.toString()}`);
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
        <div className="container mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                    Todas las <span className="text-gradient">Publicaciones</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Descubre las investigaciones, artículos tecnológicos y proyectos de los miembros de SOCITEC.
                </p>
            </div>

            {/* Search & Filters */}
            <div className="max-w-4xl mx-auto mb-10 space-y-4">
                {/* Search bar */}
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Buscar artículos por título o descripción..."
                        className="w-full pl-12 pr-12 py-3.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00b4db]/50 transition-colors"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </form>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => updateFilters({ category: '' })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            !currentCategory
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentCategory === cat.slug
                                    ? 'bg-gradient-to-r from-[#72004c] to-[#00b4db] text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles */}
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
                    basePath="/articles"
                    emptyTitle="No se encontraron artículos"
                    emptyDescription="No hay artículos publicados que coincidan con tu búsqueda."
                    showCreateButton={false}
                />
            )}
        </div>
    );
}
