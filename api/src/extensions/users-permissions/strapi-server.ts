module.exports = (plugin: any) => {
    // Conserva las referencias originales
    const originalAuth = plugin.controllers.auth;
    const originalUser = plugin.controllers.user;

    // Helper para resolver el controlador (puede ser factory o un objeto directo)
    const resolveController = (controller: any, options: any) => {
        return typeof controller === 'function' ? controller(options) : controller;
    };

    // Extender auth.register
    plugin.controllers.auth = (options: any) => {
        const authController = resolveController(originalAuth, options);
        const originalRegister = authController.register;

        authController.register = async (ctx: any) => {
            // Ejecuta el registro original
            await originalRegister(ctx);

            // Delega la creación del perfil al servicio
            if (ctx.body && ctx.body.user) {
                await options.strapi
                    .service('api::author.auth-profile')
                    .createAuthorForUser(ctx.body.user);
            }
        };

        return authController;
    };

    // Extender user.me
    plugin.controllers.user = (options: any) => {
        const userController = resolveController(originalUser, options);

        userController.me = async (ctx: any) => {
            const currentUser = ctx.state.user;

            if (!currentUser) {
                return ctx.unauthorized();
            }

            // Delega la obtención del perfil al servicio
            const profile = await options.strapi
                .service('api::author.current-user')
                .getProfile(currentUser.id);

            ctx.body = profile;
        };

        return userController;
    };

    return plugin;
};
