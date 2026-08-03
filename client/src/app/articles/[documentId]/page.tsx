import ArticleDetailPage from "@/components/templates/ArticleDetails";

export default async function PublicArticlePage({ params }: { params: Promise<{ documentId: string }> }) {
    const { documentId } = await params;

    return <ArticleDetailPage documentId={documentId} readOnly={true} backHref="/articles" />;
}
