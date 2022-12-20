const {
    itemColumns,
    resourcesTables, resourcesColumns,
    userTables, userColumns
} = require("../index");

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('Items', (table) => {
            table.string(itemColumns.items.name, 60);
            table.string(itemColumns.items.type);
            table.integer(itemColumns.items.ingredient).unsigned();
            table.foreign(itemColumns.items.ingredient).references(`${resourcesTables.resources}.${resourcesColumns.resources.id}`);
            table.string(itemColumns.items.belongsToUserId, 255);
            table.foreign(itemColumns.items.belongsToUserId).references(`${userTables.users}.${userColumns.users.userId}`);
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists('Items');
    },
};