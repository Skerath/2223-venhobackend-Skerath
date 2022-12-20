const {getKnex, itemTables, itemColumns} = require('../data');

const findItemsByQuery = async (query) => {
    const items = await getKnex()(itemTables.items)
        .where((builder) => {
            if (query.name) builder.whereILike(itemColumns.items.name, `%${query.name}%`);
            if (query.type) builder.whereILike(itemColumns.items.type, `%${query.type}%`);
            if (query.ingredient) builder.whereILike(itemColumns.items.ingredient, `%${query.ingredient}%`);
        });
    return items;
};

const createItem = async (query) => {

};

module.exports = {
    createItem,
    findItemsByQuery
};