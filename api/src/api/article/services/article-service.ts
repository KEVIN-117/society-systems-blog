/**
 * article-service - Custom service for Article business logic.
 *
 * All database access and business rules for articles live here.
 * Controllers must delegate to this service and never query the DB directly.
 */

import { Core } from '@strapi/strapi';

// Shared populate configuration to avoid duplication
const ARTICLE_POPULATE = {
    cover: true,
    categories: true,
    author: {
        populate: {
            avatar: true,
        },
    },
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    /**
     * Returns all published articles with optional filters, pagination, and sorting.
     * Used by public routes (visitors) and the "Explore" dashboard view.
     */
    async getPublishedArticles(params: {
        page?: number;
        pageSize?: number;
        sort?: string;
        search?: string;
        category?: string;
    }) {
        const { page = 1, pageSize = 10, sort = 'createdAt:desc', search, category } = params;

        const filters: any = {};

        // Full-text search on title and description
        if (search) {
            filters.$or = [
                { title: { $containsi: search } },
                { description: { $containsi: search } },
            ];
        }

        // Filter by category slug
        if (category) {
            filters.categories = {
                slug: { $eq: category },
            };
        }

        const results = await strapi.documents('api::article.article').findMany({
            status: 'published',
            filters,
            populate: ARTICLE_POPULATE,
            sort: sort as any,
            limit: pageSize,
            start: (page - 1) * pageSize,
        });

        // Count total for pagination
        const total = await strapi.documents('api::article.article').count({
            status: 'published',
            filters,
        });

        return {
            data: results,
            meta: {
                pagination: {
                    page,
                    pageSize,
                    pageCount: Math.ceil(total / pageSize),
                    total,
                },
            },
        };
    },

    /**
     * Returns a single article by documentId.
     * Available to both visitors (public) and authenticated users.
     */
    async getArticle(documentId: string) {
        const article = await strapi.documents('api::article.article').findOne({
            documentId,
            populate: ARTICLE_POPULATE,
        });

        return article;
    },

    /**
     * Returns articles belonging to a specific author.
     * Used by the "My Articles" dashboard view.
     * Includes drafts (all statuses) since the author manages their own content.
     */
    async getArticlesByAuthor(authorDocumentId: string, params: {
        page?: number;
        pageSize?: number;
        sort?: string;
        search?: string;
        category?: string;
    }) {
        const { page = 1, pageSize = 10, sort = 'createdAt:desc', search, category } = params;

        const filters: any = {
            author: {
                documentId: { $eq: authorDocumentId },
            },
        };

        if (search) {
            filters.$or = [
                { title: { $containsi: search } },
                { description: { $containsi: search } },
            ];
        }

        if (category) {
            filters.categories = {
                slug: { $eq: category },
            };
        }

        const results = await strapi.documents('api::article.article').findMany({
            filters,
            populate: ARTICLE_POPULATE,
            sort: sort as any,
            limit: pageSize,
            start: (page - 1) * pageSize,
        });

        const total = await strapi.documents('api::article.article').count({
            filters,
        });

        return {
            data: results,
            meta: {
                pagination: {
                    page,
                    pageSize,
                    pageCount: Math.ceil(total / pageSize),
                    total,
                },
            },
        };
    },

    /**
     * Creates a new article for the given author.
     * The authorDocumentId is always injected server-side from ctx.state.user.
     */
    async createArticle(authorDocumentId: string, dto: any) {
        const article = await strapi.documents('api::article.article').create({
            data: {
                ...dto,
                author: authorDocumentId,
            },
            populate: ARTICLE_POPULATE,
        });

        return article;
    },

    /**
     * Updates an existing article.
     * Validates that the article belongs to the authenticated author before updating.
     */
    async updateArticle(authorDocumentId: string, documentId: string, dto: any) {
        // Ownership check
        const existing = await strapi.documents('api::article.article').findOne({
            documentId,
            populate: { author: true },
        });

        if (!existing) {
            return { error: 'Article not found', status: 404 };
        }

        if (!existing.author || existing.author.documentId !== authorDocumentId) {
            return { error: 'Forbidden: you do not own this article', status: 403 };
        }

        const updated = await strapi.documents('api::article.article').update({
            documentId,
            data: dto,
            populate: ARTICLE_POPULATE,
        });

        return { data: updated };
    },

    /**
     * Deletes an article.
     * Validates that the article belongs to the authenticated author before deleting.
     */
    async deleteArticle(authorDocumentId: string, documentId: string) {
        // Ownership check
        const existing = await strapi.documents('api::article.article').findOne({
            documentId,
            populate: { author: true },
        });

        if (!existing) {
            return { error: 'Article not found', status: 404 };
        }

        if (!existing.author || existing.author.documentId !== authorDocumentId) {
            return { error: 'Forbidden: you do not own this article', status: 403 };
        }

        const deleted = await strapi.documents('api::article.article').delete({
            documentId,
        });

        return { data: deleted };
    },
});
