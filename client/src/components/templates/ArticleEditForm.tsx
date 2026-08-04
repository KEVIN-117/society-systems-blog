"use client";

import { useState, useEffect } from "react";
import { ArticleForm } from "@/components/organisms/ArticleForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/model/article.schema";
import { PenTool, Loader2 } from "lucide-react";
import { articleService } from "@/actions/article";

interface Props {
    documentId: string;
}

export function ArticleEditTemplate({ documentId }: Props) {
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getArticleById(documentId);
                setArticle(response.data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo cargar el artículo para editar.",
                });
                router.push("/dashboard/articles");
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
                <p className="text-gray-400 font-medium">Cargando datos del artículo...</p>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="flex-1 w-full p-4 md:p-8 pt-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#72004c] to-[#006f87] p-[1px]">
                        <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <PenTool className="text-white w-5 h-5" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-white">
                        Editar <span className="text-gradient">Artículo</span>
                    </h1>
                </div>
                <p className="text-gray-400">
                    Estás editando: <strong className="text-white">{article.title}</strong>
                </p>
            </div>

            <div className="relative z-10">
                <ArticleForm initialData={article} />
            </div>
        </div>
    );
}