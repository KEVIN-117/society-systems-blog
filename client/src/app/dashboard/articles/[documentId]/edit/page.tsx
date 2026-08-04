import { ArticleEditTemplate } from "@/components/templates/ArticleEditForm";

export default async function EditArticlePage({ params }: { params: Promise<{ documentId: string }> }) {
    const { documentId } = await params;
    return <ArticleEditTemplate documentId={documentId} />
}
