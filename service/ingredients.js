const {getLogger} = require("../core/logging");
const logger = getLogger();
const {
    findAllIngredients, findIngredientsById, findIngredientsByName, findIngredientsByQuery
} = require('../repository/ingredient');

const getAll = async () => {
    return findAllIngredients();
};

const getById = async (input) => {
    return await findIngredientsById(input);
};

const getByName = async (input) => {
    return await findIngredientsByName(input);
};

const getByQuery = async (query) => {
    return await findIngredientsByQuery(query);
};

module.exports = {
    getAll, getById, getByName, getByQuery,
};

