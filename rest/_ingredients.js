const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");

const getAllIngredients = async (ctx) => {
    ctx.body = ingredientService.getAll();
}

// TODO figure a better way out to change status
const getIngredientById = async (ctx) => {
    const result = ingredientService.getById(ctx.params.id);
    if (result === 404)
        ctx.status = 404
    else if (result === 400)
        ctx.status = 400
    else
        ctx.body = result;
}

const getIngredientsByName = async (ctx) => {
    const result = ingredientService.getByName(ctx.params.name);
    if (result === 404)
        ctx.status = 404
    else
        ctx.body = result;
}

module.exports = (app) => {

    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', getAllIngredients);
    router.get('/id/:id', getIngredientById);
    router.get('/name/:name', getIngredientsByName);

    app
        .use(router.routes())
        .use(router.allowedMethods());
}

