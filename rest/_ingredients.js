const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");


const getAllIngredients = async (ctx) => {
    ctx.body = ingredientService.getAll();
}

const getIngredientById = async (ctx) => {
    ctx.body = ingredientService.getById(ctx.params.id);
}

const getIngredientsByModifiers = async (ctx) => {
    ctx.body = ingredientService.getByModifiers(ctx.params.modifiers);
}

const getIngredientsByMaxLevel = async (ctx) => {
    ctx.body = ingredientService.getByMaxLevel(ctx.params.max_level);
}

const getIngredientsByUseType = async (ctx) => {
    ctx.body = ingredientService.getByUseType(ctx.params.usetype);
}

module.exports = (app) => {
    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', getAllIngredients);
    router.get('/:id', getIngredientById);
    router.get('/modifiers', getIngredientsByModifiers);
    router.get('/level/:max_level', getIngredientsByMaxLevel);
    router.get('/:usetype', getIngredientsByUseType);

    app
        .use(router.routes())
        .use(router.allowedMethods());
}

