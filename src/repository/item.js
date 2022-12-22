const {
    getKnex,
    itemTables,
    itemColumns,
    userTables,
    userColumns,
} = require('../data');
const {findIngredientByName, findIngredientById} = require("./ingredient");

const mapItem = (object, ingredientUsed) => {
    delete ingredientUsed.resourceID;
    return {
        itemId: object.database_id,
        owner: object.user_name,
        name: object.display_name,
        itemType: object.type,
        ingredientUsed,
    };
}

const findItemsByQuery = async (query, matchingItem) => {

    const items = await getKnex()(itemTables.items)
        .leftJoin(userTables.users, itemColumns.items.belongsToUserId, userColumns.users.userId)
        .where((builder) => {
            if (query.name) builder.whereILike(itemColumns.items.name, `%${query.name}%`);
            if (query.type) builder.whereILike(itemColumns.items.type, `%${query.type}%`);
            if (query.ingredient && matchingItem) builder.where(itemColumns.items.ingredient, matchingItem.resourceID);
            if (query.owner) builder.whereILike(userColumns.users.userName, `%${query.owner}%`)
        })

    let mappedItems = [];
    for (let i = 0; i < items.length; i++) {
        const matchingItem = await findIngredientById({id: items[i].ingredient_used})
        mappedItems.push(mapItem(items[i], matchingItem));
    }

    return mappedItems;
};

const findItemsByIdAndAuth0Id = async (input, auth0id) => {

    const items = await getKnex()(itemTables.items)
        .where(itemColumns.items.belongsToUserId, auth0id)
        .where(itemColumns.items.id, input)
        .rightJoin(userTables.users, itemColumns.items.belongsToUserId, userColumns.users.userId);

    let mappedItems = [];
    for (let i = 0; i < items.length; i++) {
        const matchingItem = await findIngredientById({id: items[i].ingredient_used})
        mappedItems.push(mapItem(items[i], matchingItem));
    }

    return mappedItems;
};

const createItem = async (query, auth0id) => {

    const matchingItem = await findIngredientByName({name: query.ingredient}) // Todo this is being done too much

    await getKnex()(itemTables.items)
        .insert({
            display_name: query.name,
            type: query.type,
            ingredient_used: matchingItem.resourceID,
            owner_auth0id: auth0id,
        });
};

const updateItem = async (query, auth0id) => {

    const matchingIngredient = await findIngredientByName({name: query.ingredient}) // Todo this is being done too much

    await getKnex()(itemTables.items)
        .where(itemColumns.items.databaseId, query.id)
        .where(itemColumns.items.belongsToUserId, auth0id)
        .update({
            display_name: query.name,
            type: query.type,
            ingredient_used: matchingIngredient.resourceID,
            owner_auth0id: auth0id,
        })
};

const deleteItem = async (dbId, auth0id) => {
    const gotDeleted = await getKnex()(itemTables.items)
        .where(itemColumns.items.id, dbId)
        .where(itemColumns.items.belongsToUserId, auth0id)
        .del();
    return gotDeleted;
};


module.exports = {
    createItem,
    findItemsByQuery,
    deleteItem,
    findItemsByIdAndAuth0Id,
    updateItem,
};