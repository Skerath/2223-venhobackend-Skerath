const {INGREDIENTS} = require('../data/mock-data');

const getAll = () => {
    return INGREDIENTS;
};

const getById = (id) => {
    // TODO error checking
    return INGREDIENTS.filter(ingredient => ingredient.id === Number(id));
}

const getByModifiers = () => {
    // TODO implement
    throw new Error("Not implemented yet");
}

const getByMaxLevel = (max_level) => {
    // TODO error checking
    return INGREDIENTS.filter(ingredient => ingredient.level_requirement <= Number(max_level));
}

const getByUseType = () => {
    // TODO implement
    throw new Error("Not implemented yet");
}

module.exports = {
    // Get
    getAll, // All ingredients
    getById, // Ingredient with matching id
    getByModifiers, // All ingredients containing specified modifier(s)
    getByMaxLevel, // All ingredients up to max level specified
    getByUseType // All ingredients allowed to be used in specified use type
}

