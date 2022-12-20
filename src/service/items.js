const {
    checkPosibility, findIngredientsByQuery, findIngredientModifiers, findIngredientProfessions
} = require('../repository/ingredient');
const ServiceError = require("../core/serviceError");

const getCheckPosibility = async () => {
    return await findIngredientNames();
};

const getModifiers = async () => {
    return await findIngredientModifiers();
};

const getProfessions = async () => {
    return await findIngredientProfessions();
};

const getByQuery = async (query) => {
    const ingredients = await findIngredientsByQuery(query);
    if (ingredients.length === 0)
        throw ServiceError.notFound(`There are no ingredients matching the query provided in details.`, {query});
    return ingredients;
};

module.exports = {
    getByQuery, getModifiers, getProfessions
};

