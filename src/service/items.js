const {
    createItem,
    findItemsByQuery,
    findItemsByUserName
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

const getByName = async (input) => {
    const items = await findItemsByUserName(input);
    if (items.length === 0)
        throw ServiceError.notFound(`There are no items matching the input provided in details.`, {input});
    return items;
};

module.exports = {
    getByQuery,
    putByQuery,
    getByName
};

