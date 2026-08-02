/**
 * auth-profile service
 */

import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Creates an Author profile for a newly registered User.
   * Ensures the One-to-One relationship is properly established.
   */
  async createAuthorForUser(user: any) {
    if (!user || !user.id) {
      return null;
    }

    try {
      // Usamos el Document Service API de Strapi 5
      const newAuthor = await strapi.documents('api::author.author').create({
        data: {
          name: user.username || user.email,
          email: user.email,
          avatar: null,
          user: user.documentId || user.id, // Relación con el User
        },
      });

      return newAuthor;
    } catch (error) {
      strapi.log.error('Error creando el Author para el usuario:', error);
      throw error;
    }
  },
});
