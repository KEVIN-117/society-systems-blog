/**
 * article router
 *
 * Custom routes separating public and private article endpoints.
 * IMPORTANT: /me must be declared BEFORE /:documentId to avoid being
 * interpreted as a documentId parameter by Strapi's router.
 */

export default {
    routes: [
        // ─── Public routes (no authentication required) ───
        {
            method: 'GET',
            path: '/articles',
            handler: 'article.find',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

        // ─── Private routes (authentication required) ───
        // This MUST come before /articles/:documentId
        {
            method: 'GET',
            path: '/articles/me',
            handler: 'article.findMine',
            config: {
                policies: [],
                middlewares: [],
            },
        },

        // Public: single article detail
        {
            method: 'GET',
            path: '/articles/:documentId',
            handler: 'article.findOne',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

        // Private: create article
        {
            method: 'POST',
            path: '/articles',
            handler: 'article.create',
            config: {
                policies: [],
                middlewares: [],
            },
        },

        // Private: update article (with ownership check in service)
        {
            method: 'PUT',
            path: '/articles/:documentId',
            handler: 'article.update',
            config: {
                policies: [],
                middlewares: [],
            },
        },

        // Private: delete article (with ownership check in service)
        {
            method: 'DELETE',
            path: '/articles/:documentId',
            handler: 'article.delete',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
