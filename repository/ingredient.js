const {resourcesTables, resourcesColumns, getKnex} = require('../data/index');

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
};

const joinIngredientTables = () => {
    return getKnex()(resourcesTables.resources).leftJoin(resourcesTables.itemIdentifiers, resourcesColumns.resources.id, resourcesColumns.itemOnlyIdentifiers.id)
        .leftJoin(resourcesTables.consumableIdentifiers, resourcesColumns.resources.id, resourcesColumns.consumableOnlyIdentifiers.id)
        .leftJoin(resourcesTables.ingredientPositionModifier, resourcesColumns.resources.id, resourcesColumns.ingredientPositionModifiers.id);
};

const findAllIngredients = async () => {
    return joinIngredientTables()
        .then(ingredient => {
            return filterKeys(ingredient);
        });
};

const findIngredientsById = async (id) => {
    return joinIngredientTables()
        .where(resourcesColumns.resources.id, Number.parseInt(id))
        .then(ingredient => {
            return filterKeys(ingredient);
        });
};

const findIngredientsByName = async (name) => {
    return joinIngredientTables()
        .where('name', name)
        .then(ingredient => {
            return filterKeys(ingredient);
        });
};

const findIngredientsByQuery = async (query) => {
    return joinIngredientTables()
        .where((builder) => {
            if (query.id) builder.where(resourcesColumns.resources.id, query.id);
            if (query.name) builder.whereILike(resourcesColumns.resources.name, `%${query.name}%`);
            if (query.tier) builder.where(resourcesColumns.resources.tier, query.tier);
            if (query.minlevel) builder.where(resourcesColumns.resources.level, '>=', query.minlevel);
            if (query.maxlevel) builder.where(resourcesColumns.resources.level, '<=', query.maxlevel);
            if (query.profession) builder.whereRaw(`? MEMBER OF(??)`, [query.profession.toUpperCase(), resourcesColumns.resources.professions]);
            if (query.modifier) builder.whereRaw(`? MEMBER OF(JSON_KEYS(??))`, [query.modifier.toUpperCase(), resourcesColumns.resources.modifiers]);
        }).then(ingredient => {
            return filterKeys(ingredient);
        });
}

module.exports = {
    findAllIngredients,
    findIngredientsById,
    findIngredientsByName,
    findIngredientsByQuery,
};