const {INGREDIENTS} = require('../data/mock-data');

const getAll = () => {
    return INGREDIENTS;
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
    // Get
    getAll, // All ingredients
    getById, // Ingredient with matching id
    getByName // Ingredient where name includes characters from input
}

