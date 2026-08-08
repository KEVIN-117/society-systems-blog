import * as React from "react";
import Link from "next/link";
import { Eye, Edit3, Trash2, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface ArticleCardArticle {
  documentId: string;
  title: string;
  description: string | null;
  content: string | null;
  publishedAt: string | null;
  cover?: {
    url: string;
  } | null;
  categories?: Array<{
    id: number;
    name: string;
  }>;
  author?: {
    name: string;
  };
}

interface ArticleCardProps {
  article: ArticleCardArticle;
  onDelete?: (id: string) => void;
  /** When true, hides Edit and Delete buttons */
  readOnly?: boolean;
  /** Base path for links (default: "/dashboard/articles") */
  basePath?: string;
}

export function ArticleCard({
  article,
  onDelete,
  readOnly = false,
  basePath = "/dashboard/articles",
}: ArticleCardProps) {
  const coverUrl = article.cover?.url
    ? article.cover.url.startsWith("http")
      ? article.cover.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${article.cover.url}`
    : null;

  // Estimate reading time (rough estimation: 200 words per minute)
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const isDraft = !article.publishedAt;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#060609] border border-white/5 hover:border-[#72004c]/40 transition-all duration-500 h-[420px] shadow-lg hover:shadow-2xl hover:shadow-[#72004c]/10">
      {/* Image Container with Hover Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-[#0a0a0f] flex-shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#72004c]/20 to-[#006f87]/20 flex items-center justify-center">
            <span className="text-white/20 font-heading text-2xl font-bold tracking-widest">
              SOCITEC
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {isDraft && (
            <Badge
              variant="outline"
              className="bg-black/60 backdrop-blur-md border-amber-500/50 text-amber-500"
            >
              Borrador
            </Badge>
          )}
        </div>

        {/* Categories */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5">
          {article.categories?.slice(0, 3).map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="bg-black/60 backdrop-blur-md border-[#00b4db]/30 text-xs text-gray-200"
            >
              {cat.name}
            </Badge>
          ))}
          {article.categories && article.categories.length > 3 && (
            <Badge
              variant="secondary"
              className="bg-black/60 backdrop-blur-md border-[#00b4db]/30 text-xs text-gray-200"
            >
              +{article.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <Link
            href={`${basePath}/${article.documentId}`}
            className="p-3 rounded-full bg-white/10 hover:bg-[#00b4db] text-white transition-all transform hover:scale-110"
            title="Ver Artículo"
            aria-label="Ver Artículo"
          >
            <Eye className="w-5 h-5" />
          </Link>
          {!readOnly && (
            <Link
              href={`${basePath}/${article.documentId}/edit`}
              className="p-3 rounded-full bg-white/10 hover:bg-[#72004c] text-white transition-all transform hover:scale-110"
              title="Editar Artículo"
              aria-label="Editar Artículo"
            >
              <Edit3 className="w-5 h-5" />
            </Link>
          )}
          {!readOnly && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(article.documentId);
              }}
              className="p-3 rounded-full bg-white/10 hover:bg-red-500 text-white transition-all transform hover:scale-110"
              title="Eliminar Artículo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#00b4db] transition-colors leading-tight">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
          {article.description || "Sin descripción"}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5 mt-auto">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {article.author?.name || "Desconocido"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </span>
        </div>
      </div>
    </div>
  );
}
