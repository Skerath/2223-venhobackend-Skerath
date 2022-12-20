const {
    createItem,
} = require('../repository/ingredient');

const putByQuery = async () => {
    return await createItem();
};

// const getByQuery = async (query) => {
//     const ingredients = await findIngredientsByQuery(query);
//     if (ingredients.length === 0)
//         throw ServiceError.notFound(`There are no ingredients matching the query provided in details.`, {query});
//     return ingredients;
// };

module.exports = {
    putByQuery
};

