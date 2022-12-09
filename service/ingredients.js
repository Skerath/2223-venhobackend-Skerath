const {INGREDIENTS} = require('../data/mock-data');
const {getKnex, tables} = require("../data");
const {getLogger} = require("../core/logging");
const logger = getLogger();

const filterKeys = (listOfObjectsToFilter) => {
    listOfObjectsToFilter.forEach(object => {
        delete object.itemResourceId;
        delete object.consumableResourceId;
        delete object.positionModifierId;
        Object.keys(object).forEach(key => {
            if (object[key] === null)
                delete object[key];
        });
    });
    return listOfObjectsToFilter;
}

const joinIngredientTables = (knex) => {
    return knex.leftJoin('ItemOnlyIdentifiers', 'resourceId', 'itemResourceId')
        .leftJoin('ConsumableOnlyIdentifiers', 'resourceId', 'consumableResourceId')
        .leftJoin('IngredientPositionModifiers', 'resourceId', 'positionModifierId');
}

const getAll = async () => {
    try {
        const results = await joinIngredientTables(getKnex()(tables.resources).select())
            .then(ingredient => {
                return filterKeys(ingredient);
            });
        logger.info(`Successfully handled getAll Ingredients on ${new Date()}`);
        return results;
    } catch (error) {
        logger.error(`Error when trying to getAll Ingredients: ${error}`);
    }
};

const getById = async (input) => {
    if (isNaN(input) || input < 0) {
        logger.info(`Request for getById Ingredients failed on ${new Date()}: '${input}' is not a number.`)
        return 400;
    }

    const result = await joinIngredientTables(getKnex()(tables.resources).select())
        .then(ingredient => {
            return filterKeys(ingredient);
        });
    const selectedIngredient = result.filter(ingredient => ingredient.resourceID === Number.parseInt(input));

    switch (selectedIngredient.length) {
        case 1:
            logger.info(`Successfully handled getById Ingredient on ${new Date()} for input '${input}'.`);
            return selectedIngredient;
        case 0:
            logger.info(`Request for getById Ingredient failed on ${new Date()}: '${input}' could not be found.`)
            return 404;
        default:
            logger.info(`Request for getById Ingredient failed on ${new Date()}: input '${input}' resulted in an internal server error.`)
            return 500;
    }

}

const getByName = (input) => {
    // TODO: redo

    const name = String(input);
    // Collecting all ingredients matching input
    const selectedIngredients = INGREDIENTS.filter(ingredient => ingredient.name.toLowerCase() === (String(name).toLowerCase()));
    switch (selectedIngredients.length) {
        case 0:
            return 404;
        default:
            return selectedIngredients;
    }
}

module.exports = {
    getAll, // All ingredients
    getById, // Ingredient with matching id
    getByName // Ingredient where name includes characters from input
}

