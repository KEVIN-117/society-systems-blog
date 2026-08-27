import ArticleDetailPage from "@/components/templates/ArticleDetails";
import * as articleService from "@/actions/article";

export default async function ExploreArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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

    return <ArticleDetailPage initialArticle={article} readOnly={true} backHref="/dashboard/articles/explore" />;
}
