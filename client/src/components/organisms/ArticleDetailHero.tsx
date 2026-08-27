import Link from "next/link";
import { Edit3, Clock, ArrowLeft, Calendar, User as UserIcon } from "lucide-react";
import { Article } from "@/model/article.schema";
import { Badge } from "@/components/ui/badge";
import { getReadingTime } from "@/lib/utils";

interface ArticleDetailHeroProps {
    article: Article;
    /** When true, hides Edit button and changes back link to public route */
    readOnly?: boolean;
    /** Back link URL (defaults based on readOnly) */
    backHref?: string;
}

export function ArticleDetailHero({ article, readOnly = false, backHref }: ArticleDetailHeroProps) {
    const coverUrl = article.cover?.url
        ? (article.cover.url.startsWith('http') ? article.cover.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.cover.url}`)
        : null;

    const avatarUrl = article.author?.avatar?.url
        ? (article.author.avatar.url.startsWith('http') ? article.author.avatar.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${article.author.avatar.url}`)
        : null;

    const readingTimeStr = getReadingTime(article.content || '');
    const isDraft = !article.publishedAt;

    const resolvedBackHref = backHref || (readOnly ? "/articles" : "/dashboard/articles");

    return (
        <section className="relative w-full overflow-hidden rounded-3xl min-h-[500px] flex items-end shadow-2xl mb-12">
            {/* Background Cover Image with Heavy Blur/Gradient */}
            {coverUrl ? (
                <div className="absolute inset-0">
                    <img
                        src={coverUrl}
                        alt={article.title}
                        className="h-full w-full object-cover scale-105" // scale prevents blurry edges when blurring
                    />
                    {/* Gradient overlays to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-[#060609]/80 to-transparent z-0" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#72004c]/30 to-[#006f87]/30 z-0" />
            )}

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link href={resolvedBackHref} className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Edit Button — only shown when not readOnly */}
            {!readOnly && (
                <div className="absolute top-6 right-6 z-20">
                    <Link href={`/dashboard/articles/${article.documentId}/edit`} className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#72004c]/80 hover:bg-[#72004c] backdrop-blur-md text-white transition-colors border border-white/10 gap-2 font-medium">
                        <Edit3 className="w-4 h-4" />
                        Editar
                    </Link>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center">

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {isDraft && (
                        <Badge variant="outline" className="bg-amber-500/20 border-amber-500 text-amber-400 px-3 py-1 text-sm">
                            Borrador
                        </Badge>
                    )}
                    {article.categories?.map(cat => (
                        <Badge key={cat.id} variant="secondary" className="bg-[#00b4db]/20 border-[#00b4db]/50 text-[#00b4db] px-3 py-1 text-sm backdrop-blur-md">
                            {cat.name}
                        </Badge>
                    ))}
                </div>

                {/* Title */}
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl">
                    {article.title}
                </h1>

                {/* Description */}
                {article.description && (
                    <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light">
                        {article.description}
                    </p>
                )}

                {/* Meta Information (Author, Date, Reading Time) */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 bg-black/20 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">

                    {/* Author */}
                    <div className="flex items-center gap-2">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={article.author?.name || 'Autor'} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#72004c]/30 flex items-center justify-center border border-white/20">
                                <UserIcon className="w-4 h-4 text-white/70" />
                            </div>
                        )}
                        <span className="font-medium text-white">{article.author?.name || 'Autor Desconocido'}</span>
                    </div>

                    <div className="w-1 h-1 rounded-full bg-gray-500" />

                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00b4db]" />
                        <span>{new Date(article.createdAt).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="w-1 h-1 rounded-full bg-gray-500" />

                    {/* Reading Time */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00b4db]" />
                        <span>{readingTimeStr}</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
