import { z } from 'zod';
import { UserProfile } from './user.schema';

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

export interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string | null;
    content: string | null;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    cover?: Media | null;
    categories?: Category[];
    author?: {
        id: number;
        documentId: string;
        name: string;
        bio: string | null;
        avatar?: Media | null;
    };
}

export interface ArticleListResponse {
    data: Article[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface ArticleResponse {
    data: Article;
    meta: any;
}

export interface CategoryListResponse {
    data: Category[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

// Validation schemas for forms
export const createArticleSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "El título no puede exceder 100 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(200, "La descripción no puede exceder 200 caracteres"),
    content: z.string().min(50, "El contenido es muy corto"),
    slug: z.string().min(3).optional(),
    categories: z.array(z.string()).min(1, "Debes seleccionar al menos una categoría"),
    cover: z.number().nullable().optional(),
    publishedAt: z.string().nullable().optional(), // If null, it's a Draft
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
