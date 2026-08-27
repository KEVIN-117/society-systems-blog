/**
 * article controller
 *
 * Thin controller that validates requests and delegates to ArticleService.
 * Never queries the database directly.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
    /**
     * GET /api/articles — Public: returns all published articles.
     */
    async find(ctx) {
        const { page, pageSize, sort, search, category, filters } = ctx.query;

        // Extraer el slug de los filtros estándar de Strapi si viene (ej: filters[slug][$eq]=...)
        const slug = (filters as any)?.slug?.$eq || (filters as any)?.slug;
        const excludeId = (filters as any)?.documentId?.$ne || (filters as any)?.documentId?.$not;

        const result = await strapi
            .service('api::article.article-service')
            .getPublishedArticles({
                page: page ? Number(page) : 1,
                pageSize: pageSize ? Number(pageSize) : 10,
                sort: sort as string || 'createdAt:desc',
                search: search as string,
                category: category as string,
                slug: slug as string,
                excludeId: excludeId as string,
            });

        ctx.body = result;
    },

    /*
     * GET /api/articles/:documentId — Public: returns a single published article.
    */
    async findOne(ctx) {
        const { documentId } = ctx.params;

        const article = await strapi
            .service('api::article.article-service')
            .getArticle(documentId);

        if (!article) {
            return ctx.notFound('Article not found');
        }

        ctx.body = { data: article };
    },

    /**
     * GET /api/articles/:documentId — Public: returns a single published article.
     * If the article is a draft, it requires authentication and owner verification.
     */
    /*async findOne(ctx) {
        const { documentId } = ctx.params;

        const article = await strapi
            .service('api::article.article-service')
            .getArticle(documentId);

        console.log("Article:", article);


        if (!article) {
            return ctx.notFound('Article not found');
        }

        // If the article is published, it's public
        if (article.createdAt) {
            ctx.body = { data: article };
            return;
        }

        // If the article is a draft, we must manually verify ownership
        // because the route is configured with `auth: false`(bypassing middleware).
        const authHeader = ctx.request.header.authorization;
        if (!authHeader) {
            return ctx.forbidden('You cannot view this unpublished article');
        }

        try {
            const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
            if (!id) {
                return ctx.forbidden('Invalid token');
            }

            const profile = await strapi
                .service('api::author.current-user')
                .getProfile(id);

            if (!profile?.author?.documentId || article.author?.documentId !== profile.author.documentId) {
                return ctx.forbidden('You are not the owner of this draft');
            }

            ctx.body = { data: article };
        } catch (error) {
            return ctx.forbidden('You cannot view this unpublished article');
        }
    },*/

    /**
     * GET /api/articles/me — Private: returns articles belonging to the authenticated user.
     */
    async findMine(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized();
        }

        // Resolve the author documentId from the authenticated user
        const profile = await strapi
            .service('api::author.current-user')
            .getProfile(user.id);


        if (!profile?.author?.documentId) {
            return ctx.badRequest('User does not have an associated author profile');
        }

        const { page, pageSize, sort, search, category } = ctx.query;

        const result = await strapi
            .service('api::article.article-service')
            .getArticlesByAuthor(profile.author.documentId, {
                page: page ? Number(page) : 1,
                pageSize: pageSize ? Number(pageSize) : 10,
                sort: sort as string || 'createdAt:desc',
                search: search as string,
                category: category as string,
            });

        ctx.body = result;
    },

    /**
     * POST /api/articles — Private: creates a new article for the authenticated author.
     */
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        const profile = await strapi
            .service('api::author.current-user')
            .getProfile(user.id);

        if (!profile?.author?.documentId) {
            return ctx.badRequest('User does not have an associated author profile');
        }

        const { data } = ctx.request.body as { data: any };
        if (!data) {
            return ctx.badRequest('Missing "data" in request body');
        }

        const article = await strapi
            .service('api::article.article-service')
            .createArticle(profile.author.documentId, data);

        ctx.status = 201;
        ctx.body = { data: article };
    },

    /**
     * PUT /api/articles/:documentId — Private: updates an article owned by the authenticated author.
     */
    async update(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        const profile = await strapi
            .service('api::author.current-user')
            .getProfile(user.id);

        if (!profile?.author?.documentId) {
            return ctx.badRequest('User does not have an associated author profile');
        }

        const { documentId } = ctx.params;
        const { data } = ctx.request.body as { data: any };

        if (!data) {
            return ctx.badRequest('Missing "data" in request body');
        }

        const result = await strapi
            .service('api::article.article-service')
            .updateArticle(profile.author.documentId, documentId, data);

        if (result.error) {
            ctx.status = result.status;
            ctx.body = { error: result.error };
            return;
        }

        ctx.body = result;
    },

    /**
     * DELETE /api/articles/:documentId — Private: deletes an article owned by the authenticated author.
     */
    async delete(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        const profile = await strapi
            .service('api::author.current-user')
            .getProfile(user.id);

        if (!profile?.author?.documentId) {
            return ctx.badRequest('User does not have an associated author profile');
        }

        const { documentId } = ctx.params;

        const result = await strapi
            .service('api::article.article-service')
            .deleteArticle(profile.author.documentId, documentId);

        if (result.error) {
            ctx.status = result.status;
            ctx.body = { error: result.error };
            return;
        }

        ctx.body = result;
    },
}));
