'use client';

import { useEffect, useState } from 'react';
import { getRelatedArticles } from '@/actions/article';
import { Article } from '@/model/article.schema';
import { ArticleCard } from '@/components/molecules/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedArticlesProps {
    categorySlug: string;
    currentDocumentId: string;
}

export function RelatedArticles({ categorySlug, currentDocumentId }: RelatedArticlesProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getRelatedArticles(categorySlug, currentDocumentId)
            .then((res) => {
                if (isMounted) {
                    setArticles(res.data || []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });
        
        return () => {
            isMounted = false;
        };
    }, [categorySlug, currentDocumentId]);

    if (!loading && articles.length === 0) {
        return null; // Don't show the section if there are no related articles
    }

    return (
        <div className="w-full mt-16 pt-10 border-t border-border">
            <h3 className="text-2xl font-semibold tracking-tight mb-8">Quizás te interese...</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    // Skeleton placeholders
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-[90%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                        </div>
                    ))
                ) : (
                    articles.map((article) => (
                        <ArticleCard 
                            key={article.documentId} 
                            article={article} 
                            basePath="/articles" 
                        />
                    ))
                )}
            </div>
        </div>
    );
}
