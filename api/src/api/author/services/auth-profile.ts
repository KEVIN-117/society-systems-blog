/**
 * auth-profile service
 */

import { Core } from "@strapi/strapi";

function createAuthorSlug(name: string, userId: number | string) {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedName || "author"}-${userId}`;
}

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
      const name = user.username || user.email || `author-${user.id}`;

      const newAuthor = await strapi.documents("api::author.author").create({
        data: {
          name,
          slug: createAuthorSlug(name, user.id),
          email: user.email,
          avatar: null,
          user: user.documentId || user.id,
        },
      });

      return newAuthor;
    } catch (error) {
      strapi.log.error("Error creando el Author para el usuario:", error);
      throw error;
    }
  },
});
