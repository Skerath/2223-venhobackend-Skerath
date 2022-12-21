const Router = require('@koa/router');
const ingredientService = require("../service/ingredients");
const Joi = require('joi');
const {validate} = require('./_validation');
const {hasPermission, permissions} = require("../core/auth");

const INGREDIENT_VALIDATIONS = Object.freeze({
    id: Joi.number().integer().positive(),
    name: Joi.string().max(60).replace('_', ' '),
    tier: Joi.number().integer().positive().valid(0, 1, 2, 3),
    minlevel: Joi.number().integer().positive().allow(0),
    maxlevel: Joi.number().integer().positive(),
    profession: Joi.string().uppercase().max(14),
    modifier: Joi.string().uppercase().max(50),
});

const getByQuery = async (ctx) => {
    const query = ctx.query;
    ctx.body = await ingredientService.getByQuery(query);
};

getByQuery.validationScheme = {
    query: Joi.object({
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
    ctx.body = await ingredientService.getNames();
};

const getIngredientModifiers = async (ctx) => {

    ctx.body = await ingredientService.getModifiers();
};

const getIngredientProfessions = async (ctx) => {
    ctx.body = await ingredientService.getProfessions();
};


module.exports = (app) => {

    const router = new Router({prefix: '/api/ingredients'});
    router.get('/', hasPermission(permissions.read), validate(getByQuery.validationScheme), getByQuery); // Query based. If no query, will return all ingredients
    router.get('/names', hasPermission(permissions.read), getIngredientNames);
    router.get('/modifiers', hasPermission(permissions.read), getIngredientModifiers);
    router.get('/professions', hasPermission(permissions.read), getIngredientProfessions);

    app
        .use(router.routes())
        .use(router.allowedMethods());
};