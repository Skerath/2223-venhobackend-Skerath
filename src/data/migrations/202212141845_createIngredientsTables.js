const {
    resourcesTables,
    resourcesColumns
} = require("../index");

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('Resources', (table) => {
            table.increments(resourcesColumns.resources.id);
            table.string(resourcesColumns.resources.name, 60);
            table.integer(resourcesColumns.resources.tier);
            table.integer(resourcesColumns.resources.level);
            table.json(resourcesColumns.resources.professions);
            table.json(resourcesColumns.resources.modifiers);
        });

        await knex.schema.createTable('ItemOnlyIdentifiers', (table) => {
            table.integer(resourcesColumns.itemOnlyIdentifiers.id).unsigned();
            table.foreign(resourcesColumns.itemOnlyIdentifiers.id).references(`${resourcesTables.resources}.${resourcesColumns.resources.id}`);
            table.integer(resourcesColumns.itemOnlyIdentifiers.durability);
            table.integer(resourcesColumns.itemOnlyIdentifiers.strength);
            table.integer(resourcesColumns.itemOnlyIdentifiers.dexterity);
            table.integer(resourcesColumns.itemOnlyIdentifiers.intelligence);
            table.integer(resourcesColumns.itemOnlyIdentifiers.defence);
            table.integer(resourcesColumns.itemOnlyIdentifiers.agility);
        });

        await knex.schema.createTable('ConsumableOnlyIdentifiers', (table) => {
            table.integer(resourcesColumns.consumableOnlyIdentifiers.id).unsigned();
            table.foreign(resourcesColumns.consumableOnlyIdentifiers.id).references(`${resourcesTables.resources}.${resourcesColumns.resources.id}`);
            table.integer(resourcesColumns.consumableOnlyIdentifiers.duration);
            table.integer(resourcesColumns.consumableOnlyIdentifiers.charges);
        });

        await knex.schema.createTable('IngredientPositionModifiers', (table) => {
            table.integer(resourcesColumns.ingredientPositionModifiers.id).unsigned();
            table.foreign(resourcesColumns.ingredientPositionModifiers.id).references(`${resourcesTables.resources}.${resourcesColumns.resources.id}`);
            table.integer(resourcesColumns.ingredientPositionModifiers.left);
            table.integer(resourcesColumns.ingredientPositionModifiers.right);
            table.integer(resourcesColumns.ingredientPositionModifiers.above);
            table.integer(resourcesColumns.ingredientPositionModifiers.under);
            table.integer(resourcesColumns.ingredientPositionModifiers.touching);
            table.integer(resourcesColumns.ingredientPositionModifiers.notTouching);
        });
    },
    down: (knex) => {
        let droppedTables = [];
        for (let table in resourcesTables)
            droppedTables.push(knex.schema.dropTableIfExists(table));
        return droppedTables;
    },
};