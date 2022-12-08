const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");

const getAllIngredients = async (ctx) => {
    ctx.body = ingredientService.getAll();
}

const parseResult = (result) => {
    if (result === 404)
        return 404;
    if (result === 400)
        return 400;
    if (result === 500)
        return 500;
    else return undefined;
}


const getIngredientById = async (ctx) => {
    const result = ingredientService.getById(ctx.params.id);
    const parsedResult = parseResult(result);
    parsedResult ? ctx.status = parsedResult : ctx.body = result;
}

const getIngredientsByName = async (ctx) => {
    const result = ingredientService.getByName(ctx.params.name);
    const parsedResult = parseResult(result);
    parsedResult ? ctx.status = parsedResult : ctx.body = result;
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

