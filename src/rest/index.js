const Router = require('@koa/router');
const installIngredientRouters = require('./_ingredients');
const installItemRouters = require('./_items');


module.exports = async (app) => {
    const router = new Router();
    installIngredientRouters(app);
        await installItemRouters(app);

    app.use(router.routes());
    app.use(router.allowedMethods);
}