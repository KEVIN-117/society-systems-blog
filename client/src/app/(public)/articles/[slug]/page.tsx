import ArticleDetailPage from "@/components/templates/ArticleDetails";
import { Metadata } from "next";
import * as articleService from "@/actions/article";

// Desactivamos la caché para que los cambios se reflejen inmediatamente (SSR)
// En producción estricta con mucho tráfico, se recomienda configurar un Webhook de Strapi hacia Next.js para revalidar bajo demanda.
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const articleRes = await articleService.getArticleBySlug(slug);
    const article = articleRes?.data;

    if (!article) {
        return {
            title: 'Artículo no encontrado',
        };
    }

    const coverUrl = article.cover?.url
        ? (article.cover.url.startsWith('http') ? article.cover.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.cover.url}`)
        : undefined;

    return {
        title: `${article.title} | Society Systems Blog`,
        description: article.description || undefined,
        openGraph: {
            title: article.title,
            description: article.description || undefined,
            type: 'article',
            images: coverUrl ? [{ url: coverUrl }] : [],
            authors: article.author ? [article.author.name] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.description || undefined,
            images: coverUrl ? [coverUrl] : [],
        }
    };
}

export default async function PublicArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const articleRes = await articleService.getArticleBySlug(slug);
    const article = articleRes?.data;

    if (!article) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[600px]">
                <h1 className="text-2xl font-bold text-white mb-4">Artículo no encontrado</h1>
                <p className="text-gray-400">El artículo que buscas no existe o ha sido eliminado.</p>
            </div>
        );
    }

    return <ArticleDetailPage initialArticle={article} readOnly={true} backHref="/articles" />;
}
