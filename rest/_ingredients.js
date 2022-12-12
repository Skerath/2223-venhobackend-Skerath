const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");

const parseResult = (result) => {
    if (result === 404)
        return 404;
    if (result === 400)
        return 400;
    if (result === 500)
        return 500;
    else return undefined;
}

const getAllIngredients = async (ctx) => {
    ctx.body = await ingredientService.getAll();
}

const parseQuery = async (ctx) => {
    const query = ctx.request.query;

    if (Object.keys(query).length === 0)
        return await getAllIngredients(ctx);
    else {
        const result = await ingredientService.getByQuery(query);
        const parsedResult = parseResult(result);
        parsedResult ? ctx.status = parsedResult : ctx.body = result;
    }
}

const getIngredientById = async (ctx) => {
    const result = await ingredientService.getById(ctx.params.id);
    const parsedResult = parseResult(result);
    parsedResult ? ctx.status = parsedResult : ctx.body = result;
}

const getIngredientsByName = async (ctx) => {
    const result = await ingredientService.getByName(ctx.params.name);
    const parsedResult = parseResult(result);
    parsedResult ? ctx.status = parsedResult : ctx.body = result;
}

module.exports = (app) => {

    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', parseQuery); // Query based. If no query, will return all ingredients
    router.get('/id/:id', getIngredientById);
    router.get('/name/:name', getIngredientsByName);

    app
        .use(router.routes())
        .use(router.allowedMethods());
}

