const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");
const Joi = require('joi');
const {validateQuery} = require('./_validation');
const {getLogger} = require("../core/logging");
const logger = getLogger();

const INGREDIENT_VALIDATIONS = Object.freeze({
    id: Joi.number().integer().positive().max(999),
    name: Joi.string().max(60).replace('_', ' '),
    tier: Joi.number().integer().positive().valid(0, 1, 2, 3),
    minlevel: Joi.number().integer().positive().allow(0),
    maxlevel: Joi.number().integer().positive(),
    profession: Joi.string().uppercase().max(14),
    modifier: Joi.string().uppercase().max(50),
});

const parseQuery = async (ctx) => {
    const query = ctx.request.query;
    logger.info(`[${new Date()}] Successfully handled query for Ingredient by Query: '${JSON.stringify(ctx.request.query)}'`);
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

const getIngredientNames = async (ctx) => {
    logger.info(`[${new Date()}] Successfully handled query for Ingredient Names`);
    ctx.body = await ingredientService.getNames();
};

const getIngredientModifiers = async (ctx) => {
    logger.info(`[${new Date()}] Successfully handled query for Ingredient Modifiers`);

    ctx.body = await ingredientService.getModifiers();
};

const getIngredientProfessions = async (ctx) => {
    logger.info(`[${new Date()}] Successfully handled query for Ingredient Positions`);
    ctx.body = await ingredientService.getProfessions();
};


module.exports = (app) => {

    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', validateQuery(parseQuery.validationScheme), parseQuery); // Query based. If no query, will return all ingredients
    router.get('/names', getIngredientNames);
    router.get('/modifiers', getIngredientModifiers);
    router.get('/professions', getIngredientProfessions);

    app
        .use(router.routes())
        .use(router.allowedMethods());
};