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
            .whereNotNull('itemResourceId')
            .then(ingredient => {
                return filterKeys(ingredient);
            });
        logger.info(`Successfully handled getAll Ingredients on ${new Date()}`);
        return results;
    } catch (error) {
        logger.error(`Error when trying to getAll Ingredients: ${error}`);
    }
};

const getById = (input) => {
    // TODO: unauthorized/forbidden checking

    // Check if input is correct
    const id = Number.parseInt(input);
    if (isNaN(id) || id < 0)
        return 400;

    // Collecting all ingredients matching input
    const selectedIngredient = INGREDIENTS.filter(ingredient => ingredient.id === id);
    switch (selectedIngredient.length) {
        case 1:
            return selectedIngredient;
        case 0:
            return 404;
        default:
            return 500;
    }

}

const getByName = (input) => {
    // TODO: unauthorized/forbidden checking

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

