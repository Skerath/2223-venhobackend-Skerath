const {tables, getKnex} = require('../data/index');
const {ingredientDatabaseColumns} = require("../data");

const filterKeys = (listOfObjectsToFilter) => {
    listOfObjectsToFilter.forEach(object => {
        delete object.itemResourceId;
        delete object.consumableResourceId;
        delete object.positionModifierId;
        Object.keys(object).forEach(key => {
            if (object[key] === null)
                delete object[key];
        });
    });
    return listOfObjectsToFilter;
}

const joinIngredientTables = () => {
    return getKnex()(tables.resources).leftJoin(tables.itemIdentifiers, ingredientDatabaseColumns.resourceId, ingredientDatabaseColumns.itemOnlyIdentifiersId)
        .leftJoin(tables.consumableIdentifiers, ingredientDatabaseColumns.resourceId, ingredientDatabaseColumns.consumableOnlyIdentifiersId)
        .leftJoin(tables.ingredientPositionModifier, ingredientDatabaseColumns.resourceId, ingredientDatabaseColumns.ingredientPositionModifierId);
}

const findAllIngredients = async () => {
    return joinIngredientTables()
        .then(ingredient => {
            return filterKeys(ingredient);
        });
}

const findIngredientsById = async (id) => {
    return joinIngredientTables()
        .where(ingredientDatabaseColumns.resourceId, Number.parseInt(id))
        .then(ingredient => {
            return filterKeys(ingredient);
        });
}

const findIngredientsByName = async (name) => {
    return joinIngredientTables()
        .where('name', name)
        .then(ingredient => {
            return filterKeys(ingredient);
        });
}

const findIngredientsByQuery = async (query) => {
    return joinIngredientTables()
        .where((builder) => {
            if (query.id) builder.where(ingredientDatabaseColumns.resourceId, query.id);
            if (query.name) builder.whereILike('name', `%${query.name}%`);
            if (query.tier) builder.where('tier', query.tier);
            if (query.minlevel) builder.where('level', '>=', query.minlevel);
            if (query.maxlevel) builder.where('level', '<=', query.maxlevel);
            if (query.profession) builder.whereRaw(`? MEMBER OF(??)`, [query.profession.toUpperCase(), ingredientDatabaseColumns.professions]);
            if (query.modifier) builder.whereRaw(`? MEMBER OF(JSON_KEYS(??))`, [query.modifier.toUpperCase(), ingredientDatabaseColumns.modifiers]);
        }).then(ingredient => {
            return filterKeys(ingredient);
        });
}

module.exports = {
    findAllIngredients,
    findIngredientsById,
    findIngredientsByName,
    findIngredientsByQuery,

}