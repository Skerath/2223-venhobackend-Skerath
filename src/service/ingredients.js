const {
    findAllIngredients, findIngredientNames, findIngredientsByQuery, findIngredientModifiers, findIngredientProfessions
} = require('../repository/ingredient');

const getAll = async () => {
    return findAllIngredients();
};

const getNames = async () => {
    return await findIngredientNames();
};

const getModifiers = async () => {
    return await findIngredientModifiers();
};

const getProfessions = async () => {
    return await findIngredientProfessions();
};

const getByQuery = async (query) => {
    return await findIngredientsByQuery(query);
};

module.exports = {
    getAll, getNames, getByQuery, getModifiers, getProfessions
};

