const {
    getKnex,
    itemTables,
    itemColumns,
    userTables,
    userColumns,
    resourcesTables,
    resourcesColumns
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

const findItemsByQuery = async (query) => {
    let matchingItem
    if (query.ingredient)
        matchingItem = await findIngredientByName({name: query.ingredient})

    const items = await getKnex()(itemTables.items)
        .where((builder) => {
            if (query.name) builder.whereILike(itemColumns.items.name, `%${query.name}%`);
            if (query.type) builder.whereILike(itemColumns.items.type, `%${query.type}%`);
            if (query.ingredient) builder.where(itemColumns.items.ingredient, matchingItem.resourceID);
        })
        .rightJoin(userTables.users, itemColumns.items.belongsToUserId, userColumns.users.userId);

    let mappedItems = [];
    for (let i = 0; i < items.length; i++) {
        const matchingItem = await findIngredientById({id: items[i].ingredient_used})
        mappedItems.push(mapItem(items[i], matchingItem));
    }

    return mappedItems;
};

const createItem = async (query) => {
// TODO
};

const findItemsByUserName = async (input) => {

    let items = await getKnex()(userTables.users)
        .whereILike(userColumns.users.userName, `%${input}%`)
        .rightJoin(itemTables.items, userColumns.users.userId, itemColumns.items.belongsToUserId)
        .rightJoin(resourcesTables.resources, itemColumns.items.ingredient, resourcesColumns.resources.id);

    let mappedItems = [];
    for (let i = 0; i < items.length; i++) {
        const matchingItem = await findIngredientByName({name: items[i].name})
        mappedItems.push(mapItem(items[i], matchingItem));
    }

    return mappedItems;
};

module.exports = {
    createItem,
    findItemsByQuery,
    findItemsByUserName
};