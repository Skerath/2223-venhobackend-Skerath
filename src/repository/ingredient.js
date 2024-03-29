const {resourcesTables, resourcesColumns, getKnex} = require('../data');

const removeUnneededKeys = (object) => {
    delete object.itemResourceId;
    delete object.consumableResourceId;
    delete object.positionModifierId;
    Object.keys(object).forEach(key => {
        if (object[key] === null) delete object[key];
    });
    return object;
};

const findIngredientModifiers = async () => {
    const knexResults = await getKnex()(resourcesTables.resources)
        .distinct('results')
        .crossJoin(getKnex().raw('JSON_TABLE(JSON_KEYS(modifiers), "$[*]" COLUMNS (results VARCHAR(50) PATH "$")) t'))
        .orderBy('results');
    return knexResults.map(result => result.results);
};

const findIngredientByName = async (query) => {
    const ingredients = (await getKnex()(resourcesTables.resources)
        .leftJoin(resourcesTables.itemIdentifiers, resourcesColumns.resources.id, resourcesColumns.itemOnlyIdentifiers.id)
        .leftJoin(resourcesTables.consumableIdentifiers, resourcesColumns.resources.id, resourcesColumns.consumableOnlyIdentifiers.id)
        .leftJoin(resourcesTables.ingredientPositionModifier, resourcesColumns.resources.id, resourcesColumns.ingredientPositionModifiers.id)
        .whereILike(resourcesColumns.resources.name, `%${query.name}%`))[0];

    if (ingredients)
        return removeUnneededKeys(ingredients);
    else
        return [];
}

const findIngredientById = async (query) => {
    const ingredients = (await getKnex()(resourcesTables.resources)
        .leftJoin(resourcesTables.itemIdentifiers, resourcesColumns.resources.id, resourcesColumns.itemOnlyIdentifiers.id)
        .leftJoin(resourcesTables.consumableIdentifiers, resourcesColumns.resources.id, resourcesColumns.consumableOnlyIdentifiers.id)
        .leftJoin(resourcesTables.ingredientPositionModifier, resourcesColumns.resources.id, resourcesColumns.ingredientPositionModifiers.id)
        .where(resourcesColumns.resources.id, query.id))[0];
    if (ingredients)
        return removeUnneededKeys(ingredients);
    else
        return [];
}

const findIngredientNames = async () => {
    let knexResults = await getKnex()(resourcesTables.resources)
        .distinct('name');
    return knexResults.map(result => result.name);
};

const findIngredientProfessions = async () => {
    const knexResults = await getKnex()(resourcesTables.resources)
        .distinct('results')
        .crossJoin(getKnex().raw('JSON_TABLE(professions, "$[*]" COLUMNS (results VARCHAR(50) PATH "$")) t'))
        .orderBy('results');
    return knexResults.map(result => result.results);
};

const findIngredientsByQuery = async (query) => {
    const ingredients = await getKnex()(resourcesTables.resources)
        .leftJoin(resourcesTables.itemIdentifiers, resourcesColumns.resources.id, resourcesColumns.itemOnlyIdentifiers.id)
        .leftJoin(resourcesTables.consumableIdentifiers, resourcesColumns.resources.id, resourcesColumns.consumableOnlyIdentifiers.id)
        .leftJoin(resourcesTables.ingredientPositionModifier, resourcesColumns.resources.id, resourcesColumns.ingredientPositionModifiers.id)
        .where((builder) => {
            if (query.name) builder.whereILike(resourcesColumns.resources.name, `%${query.name}%`);
            if (query.tier !== undefined) builder.where(resourcesColumns.resources.tier, query.tier);
            if (query.minlevel !== undefined) builder.where(resourcesColumns.resources.level, '>=', query.minlevel);
            if (query.maxlevel !== undefined) builder.where(resourcesColumns.resources.level, '<=', query.maxlevel);
            if (query.profession) builder.whereRaw(`? MEMBER OF(??)`, [query.profession, resourcesColumns.resources.professions]);
            if (query.modifier) builder.whereRaw(`? MEMBER OF(JSON_KEYS(??))`, [query.modifier, resourcesColumns.resources.modifiers]);
        });
    return ingredients.map(ingredient => removeUnneededKeys(ingredient));
}

module.exports = {
    findIngredientsByQuery,
    findIngredientModifiers,
    findIngredientNames,
    findIngredientProfessions,
    findIngredientByName,
    findIngredientById,
    removeUnneededKeys
};