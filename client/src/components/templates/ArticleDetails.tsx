"use client";
import * as React from "react";
import { ArticleDetailHero } from "@/components/organisms/ArticleDetailHero";
import Post from "@/components/molecules/Post";
import { articleService } from "@/actions/article";
import { Article } from "@/model/article.schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ArticleDetailPageProps {
    documentId: string;
    /** When true, hides edit actions and adjusts navigation */
    readOnly?: boolean;
    /** Where to redirect on error or back navigation */
    backHref?: string;
}

export default function ArticleDetailPage({ documentId, readOnly = false, backHref }: ArticleDetailPageProps) {
    const [article, setArticle] = React.useState<Article | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fallbackRedirect = backHref || (readOnly ? "/articles" : "/dashboard/articles");

    React.useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getArticleById(documentId);

                setArticle(response.data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo cargar el artículo.",
                });
                router.push(fallbackRedirect);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [documentId]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[600px]">
                <Loader2 className="w-12 h-12 animate-spin text-[#00b4db] mb-4" />
                <p className="text-gray-400 font-medium">Cargando artículo...</p>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="flex-1 w-full p-4 md:p-8 pt-6 mt-20">
            <ArticleDetailHero article={article} readOnly={readOnly} backHref={backHref} />

            <div className="w-full mx-auto mt-12 bg-[#060609] rounded-2xl p-6 md:p-10 border border-white/5 shadow-xl">
                <Post content={article.content || ""} />
            </div>
        </div>
    );
}
