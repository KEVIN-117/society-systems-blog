import ArticleDetailPage from "@/components/templates/ArticleDetails";

export default async function ArticlePage({ params }: { params: Promise<{ documentId: string }> }) {
    const { documentId } = await params;

    return <ArticleDetailPage documentId={documentId} />
}
