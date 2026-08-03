"use client";

import * as React from "react";
import { ArticleCard } from "@/components/molecules/ArticleCard";
import { Article } from "@/model/article.schema";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { articleService } from "@/actions/article";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ArticleListProps {
    initialArticles: Article[];
    initialTotalPages: number;
    currentPage: number;
    /** When true, hides delete and edit actions */
    readOnly?: boolean;
    /** Base path for pagination and card links */
    basePath?: string;
    /** Label for the empty state */
    emptyTitle?: string;
    /** Description for the empty state */
    emptyDescription?: string;
    /** Whether to show the "Create Article" button in the empty state */
    showCreateButton?: boolean;
}

export function ArticleList({
    initialArticles,
    initialTotalPages,
    currentPage,
    readOnly = false,
    basePath = "/dashboard/articles",
    emptyTitle = "No hay artículos",
    emptyDescription = "Aún no has publicado ningún artículo. ¡Comienza a escribir tu primera entrada en el blog!",
    showCreateButton = true,
}: ArticleListProps) {
    const [articles, setArticles] = React.useState<Article[]>(initialArticles);
    const [articleToDelete, setArticleToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (!articleToDelete) return;

        try {
            setIsDeleting(true);
            await articleService.deleteArticle(articleToDelete);

            setArticles(articles.filter(a => a.documentId !== articleToDelete));

            toast({
                title: "Artículo eliminado",
                description: "El artículo ha sido eliminado correctamente.",
            });

            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error al intentar eliminar el artículo.",
            });
        } finally {
            setIsDeleting(false);
            setArticleToDelete(null);
        }
    };

    if (articles.length === 0) {
        return (
            <div className="py-12 flex justify-center">
                <Empty className="border-white/10 bg-black/20 max-w-lg">
                    <EmptyMedia variant="icon" className="bg-[#72004c]/20 text-[#00b4db]">
                        <PlusCircle className="w-8 h-8" />
                    </EmptyMedia>
                    <EmptyTitle className="text-white text-lg">{emptyTitle}</EmptyTitle>
                    <EmptyDescription className="text-gray-400">
                        {emptyDescription}
                    </EmptyDescription>
                    {showCreateButton && !readOnly && (
                        <EmptyContent>
                            <Link href="/dashboard/articles/create">
                                <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#72004c] to-[#00b4db] hover:opacity-90 text-white rounded-xl transition-all font-medium">
                                    Crear Artículo
                                </button>
                            </Link>
                        </EmptyContent>
                    )}
                </Empty>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map(article => (
                    <ArticleCard
                        key={article.documentId}
                        article={article}
                        onDelete={readOnly ? undefined : setArticleToDelete}
                        readOnly={readOnly}
                        basePath={basePath}
                    />
                ))}
            </div>

            {initialTotalPages > 1 && (
                <div className="flex justify-center pt-8 border-t border-white/5">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                {currentPage > 1 ? (
                                    <PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} />
                                ) : (
                                    <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                                )}
                            </PaginationItem>

                            {Array.from({ length: initialTotalPages }).map((_, i) => {
                                const page = i + 1;

                                // Show first, last, current, and adjacent pages
                                if (
                                    page === 1 ||
                                    page === initialTotalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href={`${basePath}?page=${page}`}
                                                isActive={page === currentPage}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }

                                // Show ellipses for gaps
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return null;
                            })}

                            <PaginationItem>
                                {currentPage < initialTotalPages ? (
                                    <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
                                ) : (
                                    <PaginationNext href="#" className="pointer-events-none opacity-50" />
                                )}
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {!readOnly && (
                <AlertDialog open={!!articleToDelete} onOpenChange={(open) => !open && !isDeleting && setArticleToDelete(null)}>
                    <AlertDialogContent className="bg-[#0a0a0f] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de eliminar este artículo?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo de los servidores de SOCITEC.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting} className="bg-transparent border-white/10 hover:bg-white/5 hover:text-white">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={isDeleting}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
