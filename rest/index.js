const Router = require('@koa/router');
const installIngredientRouters = require('./_ingredients');


module.exports = (app) => {
    const router = new Router();
    installIngredientRouters(app);

    app.use(router.routes());
    app.use(router.allowedMethods);
}