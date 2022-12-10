const {tables, getKnex} = require('../data/index');
const {getLogger} = require("../core/logging");
const {loggers} = require("winston");

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
    return getKnex()(tables.resources).leftJoin(tables.itemIdentifiers, 'resourceId', 'itemResourceId')
        .leftJoin(tables.consumableIdentifiers, 'resourceId', 'consumableResourceId')
        .leftJoin(tables.ingredientPositionModifier, 'resourceId', 'positionModifierId');
}

const findAllIngredients = async () => {
    return joinIngredientTables()
        .then(ingredient => {
            return filterKeys(ingredient);
        });
}

const findIngredientsById = async (id) => {
    return joinIngredientTables()
        .where('resourceID', Number.parseInt(id))
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
            if (query.id) builder.where('resourceID', query.id);
            if (query.name) builder.whereILike('name', `%${query.name}%`);
            if (query.tier) builder.where('tier', query.tier);
            if (query.minlevel) builder.where('level', '>=', query.minlevel);
            if (query.maxlevel) builder.where('level', '<=', query.maxlevel);
            // if (query.profession) builder.whereRaw(`'${query.profession}' in (select JSON_EXTRACT(Resources.professions))`);
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