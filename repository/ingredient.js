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
    let sqlQuery = joinIngredientTables();
    if (query.name)
        sqlQuery = sqlQuery.where('name', query.name);
    if (query.id)
        sqlQuery = sqlQuery.where('resourceID', query.id);
    return sqlQuery.then(ingredient => {
        return filterKeys(ingredient);
    });
}

module.exports = {
    findAllIngredients,
    findIngredientsById,
    findIngredientsByName,
    findIngredientsByQuery,

}