const Joi = require('joi');
const itemService = require("../service/items");
const userService = require("../service/users")
const Router = require("@koa/router");
const {validateAsync, validate} = require("./_validation");
const {findIngredientByName} = require("../repository/ingredient");
const {addUserInfo, hasPermission, permissions} = require("../core/auth");

const allowedTypes = {
    "ARMOURING": ["HELMET", "CHESTPLATE"],
    "TAILORING": ["LEGGINGS", "BOOTS"],
    "WEAPONSMITHING": ["SPEAR", "DAGGER"],
    "WOODWORKING": ["BOW", "WAND", "RELIK"],
    "JEWELING": ["RING", "BRACELET", "NECKLACE"],
    "ALCHEMISM": ["POTION"],
    "SCRIBING": ["SCROLL"],
    "COOKING": ["FOOD"],
};

let types = [];
Object.keys(allowedTypes).forEach(key => allowedTypes[key].forEach(type => types.push(type)));

const getUserId = async (ctx) => {
    try {
        const user = await userService.getByAuth0Id(ctx.state.user.sub);
        return user.auth0id;
    } catch (err) {
        await addUserInfo(ctx);
        return await userService.register({
            auth0id: ctx.state.user.sub,
            name: ctx.state.user.name,
        });
    }
}

const postItem = async (ctx) => {
    const userId = await getUserId(ctx);

    await itemService.postByQuery(ctx.request.query, userId);
    ctx.status = 201;
};

const putItem = async (ctx) => {
    const userId = await getUserId(ctx);
    await itemService.putByQuery(ctx.request.query, userId);
    ctx.status = 204;
};

putItem.validationScheme = {
    query: Joi.object({
        id: Joi.number().integer().positive().required(),
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


const deleteItem = async (ctx) => {
    const userId = await getUserId(ctx);
    await itemService.deleteById(ctx.params.id, userId)
    ctx.status = 204
};


deleteItem.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive()
    }),
}

const getItemById = async (ctx) => {
    let userId;
    try {
        const user = await userService.getByAuth0Id(ctx.state.user.sub);
        userId = user.auth0id;
    } catch (err) {
        await addUserInfo(ctx);
        userId = await userService.register({
            auth0id: ctx.state.user.sub,
            name: ctx.state.user.name,
        });
    }
    ctx.body = await itemService.getById(ctx.params.id, userId);
};


getItemById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive()
    }),
}

const getItems = async (ctx) => {
    const query = ctx.query;
    ctx.body = await itemService.getByQuery(query);
};

getItems.validationScheme = {
    query: Joi.object({
        name: Joi.string().max(60).replace('_', ' '),
        type: Joi.string().uppercase().max(20),
        ingredient: Joi.string().max(60).replace('_', ' '), // TODO use custom validations here too
        owner: Joi.string().max(60).replace('_', ' ')
    }),
}

postItem.validationScheme = {
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
    router.get('/id/:id', hasPermission(permissions.read), validate(getItemById.validationScheme), getItemById);
    router.get('/', hasPermission(permissions.read), validate(getItems.validationScheme), getItems);
    router.post('/', hasPermission(permissions.write), await validateAsync(postItem.validationScheme), postItem); // Query based. If no query, will return all ingredients
    router.put('/', hasPermission(permissions.write), await validateAsync(putItem.validationScheme), putItem)
    router.del('/id/:id', hasPermission(permissions.write), validate(deleteItem.validationScheme), deleteItem)
    app
        .use(router.routes())
        .use(router.allowedMethods());
};
