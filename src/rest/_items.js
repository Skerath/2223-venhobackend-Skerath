const Joi = require('joi');
const itemService = require("../service/items");
const Router = require("@koa/router");
const {validateAsync} = require("./_validation");
const {findIngredientByName} = require("../repository/ingredient");

const allowedTypes = {
    "ARMOURING": ["HELMET", "CHESTPLATE"],
    "TAILORING": ["LEGGINGS", "BOOTS"],
    "WEAPONSMITHING": ["SPEAR", "DAGGER"],
    "WOODWORKING": ["BOW", "WAND", "RELIK"],
    "JEWELING": ["RINGS", "BRACELETS", "NECKLACES"],
    "ALCHEMISM": ["POTIONS"],
    "SCRIBING": ["SCROLLS"],
    "COOKING": ["FOOD"],
};

let types = [];
Object.keys(allowedTypes).forEach(key => allowedTypes[key].forEach(type => types.push(type)));

const putItem = async (ctx) => {
    const query = ctx.query;
    ctx.body = await itemService.putByQuery(query);
};

putItem.validationScheme = {
    query: Joi.object({
        name: Joi.string().required().max(60).replace('_', ' '),
        type: Joi.string()
            .required()
            .uppercase()
            .max(20)
            .custom((value) => { // if itemtype is of a valid type from allowedTypes

                if (!types.includes(value.toUpperCase()))
                    throw new Joi.ValidationError(`type is invalid`, [{
                        message: `This item is of invalid type! Must be one of: ${types}`,
                        context: {
                            error: "VALIDATION_FAILED",
                        }
                    }], undefined)

                return value;
            })
            .messages({
                "any.invalid": `This item is of invalid type! Must be one of: ${types}`,
            }),
        ingredient: Joi.string()
            .required()
            .max(60)
            .replace('_', ' ')
    }).external(async (obj) => {
        const {
            type,
            ingredient
        } = obj;

        const matchingIngredient = await findIngredientByName({name: ingredient})
        if (matchingIngredient.length === 0)
            throw new Joi.ValidationError(`Validation failed, please check details.`, [{
                message: `There was no ingredient found with name ${ingredient}!`,
                context: {error: "VALIDATION_FAILED", label: "ingredient", value: `${ingredient}`, key: "ingredient"}
            }], undefined)

        else {
            const professions = matchingIngredient.professions;

            let isMatching = false;
            professions.some(profession => {
                if (allowedTypes[profession].includes(type))
                    isMatching = true;
            })

            if (!isMatching) // if the ingredient is not for type of item
                throw new Joi.ValidationError(`Validation failed, please check details.`, [{
                    message: `Ingredient with name ${ingredient} is not suited for this type of item!`,
                    context: {
                        error: "VALIDATION_FAILED",
                        label: "ingredient",
                        value: `${ingredient}`,
                        key: "ingredient"
                    }
                }], undefined)

            return obj;
        }
    }),
};

module.exports = async (app) => {
    const router = new Router({prefix: '/api/items'});
    router.get('/', await validateAsync(putItem.validationScheme,), putItem); // Query based. If no query, will return all ingredients

    app
        .use(router.routes())
        .use(router.allowedMethods());
};
