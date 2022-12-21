const {
    createItem,
    findItemsByQuery,
    deleteItem, findItemsByIdAndAuth0Id, updateItem
} = require('../repository/item');
const ServiceError = require("../core/serviceError");
const {findIngredientByName} = require("../repository/ingredient");

const putByQuery = async (query, auth0id) => {

    if (!query.id) {
        await createItem(query, auth0id)
        return true;
    }

    const itemFound = await findItemsByIdAndAuth0Id(query.id, auth0id);

    if (itemFound.length === 0)
        throw ServiceError.notFound('There were no items found of this id belonging to this user.')

    await updateItem(query, auth0id)
    return false;
};

const getByQuery = async (query) => {
    let matchingItem;
    console.log(query.ingredient)

    if (query.ingredient) {
        matchingItem = await findIngredientByName({name: query.ingredient})
        if (matchingItem.length === 0)
            throw ServiceError.notFound(`There are no items matching the query provided in details.`, {query});
    }

    const ingredients = await findItemsByQuery(query, matchingItem);
    if (ingredients.length === 0)
        throw ServiceError.notFound(`There are no items matching the query provided in details.`, {query});
    return ingredients;
};

const deleteById = async (dbId, userId) => {
    const deleteSuccessful = await deleteItem(dbId, userId);

    if (!deleteSuccessful)
        throw ServiceError.notFound(`There is no item with provided id belonging to this user`, {dbId, userId});
}

module.exports = {
    getByQuery,
    putByQuery,
    deleteById
};

