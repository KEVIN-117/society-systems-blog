// /src/extensions/users-permissions/strapi-server.js

module.exports = (plugin: any) => {
    const originalAuthFactory = plugin.controllers.auth;

    plugin.controllers.auth = ({ strapi }: any) => {
        // Resuelve la fábrica original
        const originalAuth = originalAuthFactory({ strapi });

        // Guarda el método original
        const originalRegister = originalAuth.register;

        // Sobreescribe el método register
        originalAuth.register = async (ctx: any) => {
            // Ejecuta el registro normal (escribe en ctx.body)
            await originalRegister(ctx);

            // Si el registro fue exitoso, crea un Author
            if (ctx.body && ctx.body.user) {
                const user = ctx.body.user;

                await strapi.entityService.create('api::author.author', {
                    data: {
                        name: user.username || user.email,
                        email: user.email,
                        avatar: null,
                        user: user.id, // relación con el User
                    },
                });
            }
        };

        return originalAuth;
    };

    return plugin;
};
