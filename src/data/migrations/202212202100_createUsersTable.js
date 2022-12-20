const {
    userColumns
} = require("../index");

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('Users', (table) => {
            table.string(userColumns.users.userName, 60);
            table.string(userColumns.users.userId, 255).unique();
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists('Users');
    },
};