const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");


const getAllIngredients = async (ctx) => {
    ctx.body = ingredientService.getAll();
}

const getIngredientById = async (ctx) => {
    ctx.body = ingredientService.getById(ctx.params.id);
}

const getIngredientsByName = async (ctx) => {
    ctx.body = ingredientService.getByName(ctx.params.name);
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

