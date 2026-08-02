/**
 * current-user service
 */

import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Retrieves the full profile for the currently authenticated user,
   * including the associated Author entity and other necessary relations.
   */
  async getProfile(userId: string | number) {
    if (!userId) {
      return null;
    }

    try {
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            id: userId,
          },
          populate: {
            author: {
              populate: {
                avatar: true,
                articles: false,
              },
            },
          },
        });

      return user;
    } catch (error) {
      strapi.log.error('Error fetching current user profile:', error);
      throw error;
    }
  },
});
