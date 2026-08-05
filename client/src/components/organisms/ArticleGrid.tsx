"use client";

import * as React from "react";
import { ArticleCard } from "@/components/molecules/ArticleCard";
import { Article } from "@/model/article.schema";
import { articleService } from "@/actions/article";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function ArticleGrid() {
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await articleService.getArticles(1, 3);
                setArticles(response.data);
            } catch (error) {
                console.error("Failed to fetch latest articles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <section id="blog" className="py-24 relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Últimas <span className="text-gradient-blue">Publicaciones</span>
                        </h2>
                        <p className="text-gray-400">
                            Descubre las recientes investigaciones, artículos tecnológicos y proyectos desarrollados por los miembros de la Sociedad Científica.
                        </p>
                    </div>
                    <Link href="/articles" className="text-[#00b4db] hover:text-white font-medium mt-4 md:mt-0 transition-colors">
                        Ver todos los artículos &rarr;
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <div className="flex flex-col items-center text-[#00b4db]">
                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            <p className="text-sm font-medium text-gray-400">Cargando artículos...</p>
                        </div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <p className="text-gray-500">No hay artículos publicados todavía.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.documentId}
                                article={article}
                                readOnly={true}
                                basePath="/articles"
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
