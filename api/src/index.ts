import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const action = 'api::article.article.findMine';

      // Find the authenticated role
      const roles = await strapi.db.query('plugin::users-permissions.role').findMany({
        where: { type: 'authenticated' },
        populate: ['permissions'],
      });

      if (roles && roles.length > 0) {
        const authRole = roles[0];
        const hasPermission = authRole.permissions?.some((p: any) => p.action === action);

        if (!hasPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: authRole.id,
            }
          });
          strapi.log.info(`Granted ${action} permission to authenticated role automatically.`);
        }
      }
    } catch (error) {
      strapi.log.error('Failed to bootstrap permissions for findMine', error);
    }
  },
};
