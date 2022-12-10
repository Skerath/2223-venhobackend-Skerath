const {getLogger} = require("../core/logging");
const logger = getLogger();
const {
    findAllIngredients,
    findIngredientsById,
    findIngredientsByName,
    findIngredientsByQuery
} = require('../repository/ingredient');

const getAll = async () => {
    try {
        const results = findAllIngredients();
        logger.info(`[${new Date()}] Successfully handled getAll Ingredients`);
        return results;
    } catch (error) {
        logger.error(`[${new Date()}] Error when trying to getAll Ingredients: ${error}`);
        return 500;
    }
};

const getById = async (input) => {
    if (isNaN(input) || input < 0) {
        logger.info(`[${new Date()}] Request for getById Ingredients failed: '${input}' is not a number.`);
        return 400;
    }

    const selectedIngredient = await findIngredientsById(input);
    switch (selectedIngredient.length) {
        case 1:
            logger.info(`[${new Date()}] Successfully handled getById Ingredient for input '${input}'.`);
            return selectedIngredient;
        case 0:
            logger.info(`[${new Date()}] Request for getById Ingredient failed: input '${input}' could not be found.`)
            return 404;
        default:
            logger.info(`[${new Date()}] Request for getById Ingredient failed: input '${input}' resulted in an internal server error.`)
            return 500;
    }

}

const getByName = async (input) => {
    const selectedIngredients = await findIngredientsByName(input);
    switch (selectedIngredients.length) {
        case 0:
            logger.info(`[${new Date()}] Request for getByName Ingredient failed: input '${input}' could not be found.`)
            return 404;
        default:
            logger.info(`[${new Date()}] Successfully handled getByName Ingredient for input '${input}'.`);
            return selectedIngredients;
    }
}

const getByQuery = async (query) => {
    const selectedIngredients = await findIngredientsByQuery(query);
    if (selectedIngredients.length === 0) {
        logger.info(`[${new Date()}] Request for getByQuery Ingredient failed: query ingredient with query '${JSON.stringify(query)}' could not be found.`);
        return 404;
    } else {
        logger.info(`[${new Date()}] Successfully handled getByQuery Ingredient for query '${JSON.stringify(query)}'.`);
        return selectedIngredients;
    }

}

module.exports = {
    getAll,
    getById,
    getByName,
    getByQuery,
}

