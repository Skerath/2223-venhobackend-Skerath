const {
    createItem,
    findItemsByQuery
} = require('../repository/item');
const ServiceError = require("../core/serviceError");

const putByQuery = async () => {
    return await createItem();
};

const getByQuery = async (query) => {
    const ingredients = await findItemsByQuery(query);
    if (ingredients.length === 0)
        throw ServiceError.notFound(`There are no items matching the query provided in details.`, {query});
    return ingredients;
};

module.exports = {
    getByQuery,
    putByQuery
};

