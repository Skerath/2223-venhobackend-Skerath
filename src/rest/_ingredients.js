const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");
const Joi = require('joi');
const {validateQuery} = require('./_validation');

const INGREDIENT_VALIDATIONS = Object.freeze({
    id: Joi.number().integer().positive().max(999),
    name: Joi.string().max(60).replace('_', ' '),
    tier: Joi.number().integer().positive().valid(0, 1, 2, 3),
    minlevel: Joi.number().integer().positive().allow(0),
    maxlevel: Joi.number().integer().positive(),
    profession: Joi.string().uppercase().max(14),
    modifier: Joi.string().uppercase().max(50),
});


const getAllIngredients = async (ctx) => {
    ctx.body = await ingredientService.getAll();
}

const parseQuery = async (ctx) => {
    const query = ctx.request.query;

    if (Object.keys(query).length === 0)
        return await getAllIngredients(ctx);
    else
        ctx.body = await ingredientService.getByQuery(query);
};

parseQuery.validationScheme = {
    params: Joi.object({
        id: INGREDIENT_VALIDATIONS.id,
        name: INGREDIENT_VALIDATIONS.name,
        tier: INGREDIENT_VALIDATIONS.tier,
        minlevel: INGREDIENT_VALIDATIONS.minlevel,
        maxlevel: INGREDIENT_VALIDATIONS.maxlevel,
        profession: INGREDIENT_VALIDATIONS.profession,
        modifier: INGREDIENT_VALIDATIONS.modifier,
    }),
};

const getIngredientById = async (ctx) => {
    ctx.body = await ingredientService.getById(ctx.params.id);
};

getIngredientById.validationScheme = {
    params: Joi.object({
        id: INGREDIENT_VALIDATIONS.id,
    })
};


const getIngredientsByName = async (ctx) => {
    ctx.body = await ingredientService.getByName(ctx.params.name);
};

getIngredientsByName.validationScheme = {
    params: Joi.object({
        name: INGREDIENT_VALIDATIONS.name,
    })
};

module.exports = (app) => {

    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', validateQuery(parseQuery.validationScheme), parseQuery); // Query based. If no query, will return all ingredients
    router.get('/id/:id', validateQuery(getIngredientById.validationScheme), getIngredientById);
    router.get('/name/:name', validateQuery(getIngredientsByName.validationScheme), getIngredientsByName);

    app
        .use(router.routes())
        .use(router.allowedMethods());
};