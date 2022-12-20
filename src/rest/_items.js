const Joi = require('joi');
const ingredientService = require("../service/ingredients");
const Router = require("@koa/router");
const {getLogger} = require("../core/logging");
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

const checkPossibility = async (ctx) => {
    const query = ctx.query;
    ctx.body = await ingredientService.getByQuery(query);
};

checkPossibility.validationScheme = {
    query: Joi.object({
        id: Joi.number().integer().positive().max(999),
        name: Joi.string().max(60).replace('_', ' '),
        type: Joi.string()
            .uppercase()
            .max(20)
            .custom((value, helper) => { // if itemtype is of a valid type from allowedTypes

                if (!types.includes(value.toUpperCase()))
                    return helper.error("any.invalid", {error: "VALIDATION_FAILED"});
                return value;
            })
            .messages({
                "any.invalid": `This item is of invalid type! Must be one of: ${types}`,
            }),
        ingredient: Joi.string()
            .max(60)
            .replace('_', ' ')
    }).external(async (obj) => {
        const {
            type,
            ingredient // accursed effigy
        } = obj;

        const matchingIngredient = await findIngredientByName({name: ingredient})

        if (matchingIngredient.length === 0) {
            throw new Joi.ValidationError(`Validation failed, please check details.`, [{
                message: `There was no ingredient found with name ${ingredient}!`,
                context: {error: "VALIDATION_FAILED", label: "ingredient", value: `${ingredient}`, key: "ingredient"}
            }], undefined)
        }// there was none
        else {
            const professions = matchingIngredient.professions;

            let isMatching = false;
            professions.forEach(profession => { // use .some ? else if (!ismatching) =
                if (allowedTypes[profession].includes(type)) {
                    isMatching = true;
                }
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
    }).messages({
        "any.invalid": `This ingredient is not suited for this item type's profession`,
    }),
}


// async (obj, helper) => {
//         const {
//             id,
//             name,
//             type, // SCROLLS
//             ingredient
//         } = obj;
//
//
//         console.log("Checking ingredient")
//         const ingredients = await getKnex()(resourcesTables.resources)
//             .leftJoin(resourcesTables.itemIdentifiers, resourcesColumns.resources.id, resourcesColumns.itemOnlyIdentifiers.id)
//             .leftJoin(resourcesTables.consumableIdentifiers, resourcesColumns.resources.id, resourcesColumns.consumableOnlyIdentifiers.id)
//             .leftJoin(resourcesTables.ingredientPositionModifier, resourcesColumns.resources.id, resourcesColumns.ingredientPositionModifiers.id)
//         const matchingIngredient = ingredients.find(dbingredient => dbingredient.name === ingredient); // find ingredient from db matching with name
//
//         console.log("Matching ingredient length: " + matchingIngredient);
//         console.log(matchingIngredient === undefined)
//
//         if (matchingIngredient === undefined) // there was none
//             return helper.message({custom: `No ingredient with name ${ingredient} was found!`})
//         else {
//
//             const professions = matchingIngredient.professions;
//
//             Object.keys(allowedTypes).find(key => {
//                 const professionList = allowedTypes[key];
//                 return professionList.includes(type);
//             })
//
//
//             let isMatching = false;
//             professions.forEach(profession => {
//                 console.log(profession);
//                 console.log(allowedTypes[profession] + " = " + type);
//                 if (allowedTypes[profession].includes(type)) {
//                     isMatching = true;
//                 }
//             })
//
//             if (!isMatching) // if the ingredient is not for type of item
//                 return helper.message({custom: `Ingredient with name ${ingredient} is not suited for this type of item!`});
//
//             return obj;
//         }
//     }),

module.exports = async (app) => {

    getLogger().info("added item router")

    const router = new Router({prefix: '/api/items'});
    router.get('/', await validateAsync(checkPossibility.validationScheme), checkPossibility); // Query based. If no query, will return all ingredients

    app
        .use(router.routes())
        .use(router.allowedMethods());
};
