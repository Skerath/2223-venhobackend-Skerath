const ingredientsApi = require('../../src/repository/ingredient')
const {initKnex} = require("../../src/data");

describe('removeUnneededKeys', function () {

    it('should return the item object without excess keys', async () => {
        await initKnex();
        const originalItem = {
            resourceID: 3,
            name: '7-Yottabyte Storage Component',
            tier: 2,
            level: 90,
            professions: ['ARMOURING', 'WEAPONSMITHING', 'WOODWORKING'],
            modifiers: {},
            itemResourceId: 3,
            durability_modifier: -98,
            strength_requirement: 0,
            dexterity_requirement: -12,
            intelligence_requirement: 0,
            defence_requirement: -12,
            agility_requirement: -12,
            consumableResourceId: null,
            duration: null,
            charges: null,
            positionModifierId: null,
            left: null,
            right: null,
            above: null,
            under: null,
            touching: null,
            not_touching: null
        };
        const expectedItem = {
            resourceID: 3,
            name: '7-Yottabyte Storage Component',
            tier: 2,
            level: 90,
            professions: ['ARMOURING', 'WEAPONSMITHING', 'WOODWORKING'],
            modifiers: {},
            durability_modifier: -98,
            strength_requirement: 0,
            dexterity_requirement: -12,
            intelligence_requirement: 0,
            defence_requirement: -12,
            agility_requirement: -12
        };

        const result = ingredientsApi.removeUnneededKeys(originalItem);

        expect(result).toEqual(expectedItem)
    });
});


describe('findIngredientModifiers', function () {

    it('should return 6 items', async () => {
        await initKnex();
        const expectedSize = 6;

        const modifiers = await ingredientsApi.findIngredientModifiers();

        expect(modifiers.length).toBe(expectedSize)
    });

    it('contains modifier names', async () => {
        await initKnex();
        const expectedProfessions = ["FIREDAMAGEBONUS", "WATERDEFENSE", "POISON", "MANASTEAL"];

        const result = await ingredientsApi.findIngredientModifiers();

        expect(result).toEqual(expect.arrayContaining(expectedProfessions));
    });
});

describe('findIngredientByName', function () {
    test.each([
        ["Accursed Effigy", "Accursed Effigy"],
        ["Acidic Remains", "Acidic Remains"],
        ["Aspect of the Void", "Aspect of the Void"],
        ["7-Yottabyte Storage Component", "7-Yottabyte Storage Component"],
    ])('should return object with name property "%s"', async (input, expected) => {
        await initKnex();
        const query = {name: input};

        const result = await ingredientsApi.findIngredientByName(query);

        expect(result.name).toBe(expected);
    });

    it('returns an empty array when no item has been found', async () => {
        await initKnex();
        const query = {name: "IMPOSSIBLE TO HAVE AN INGREDIENT WITH THIS NAME"};
        const expected = [];

        const result = await ingredientsApi.findIngredientByName(query);

        expect(result).toEqual(expected);
    });
});

describe('findIngredientById', function () {

    test.each([
        [1, "Accursed Effigy"],
        [3, "7-Yottabyte Storage Component"],
        [36, "Aspect of the Void"],
        [63, "Blessed Heart"],
    ])('should return object with name property "%s"', async (input, expected) => {
        await initKnex();
        const query = {id: input};

        const result = await ingredientsApi.findIngredientById(query);

        expect(result.name).toEqual(expected);
    });

    it('returns an empty array when no item has been found', async () => {
        await initKnex();
        const query = {id: 9999999999};
        const expected = [];

        const result = await ingredientsApi.findIngredientById(query);

        expect(result).toEqual(expected);
    });
});

describe('findIngredientNames', function () {

    it('should return 7 items', async () => {
        await initKnex();
        let ingredientsReturnedSize = 7;

        const ingredients = await ingredientsApi.findIngredientNames();

        expect(ingredients.length).toBe(ingredientsReturnedSize)
    });

    it('contains ingredient names', async () => {
        await initKnex();
        const expectedIngredientNames = ["Accursed Effigy", "Blessed Heart", "Acid Magma", "Aspect of the Void"];

        const result = await ingredientsApi.findIngredientNames();

        expect(result).toEqual(expect.arrayContaining(expectedIngredientNames))
    });
});

describe('findIngredientProfessions', function () {

    it('should return 7 items', async () => {
        await initKnex();
        let expectedReturnSize = 7;

        const ingredients = await ingredientsApi.findIngredientProfessions();

        expect(ingredients.length).toBe(expectedReturnSize)
    });

    it('contains profession names', async () => {
        await initKnex();
        const expectedProfessionNames = ["WOODWORKING", "ALCHEMISM", "COOKING", "SCRIBING"];

        const result = await ingredientsApi.findIngredientProfessions();

        expect(result).toEqual(expect.arrayContaining(expectedProfessionNames))
    });
});

describe('findIngredientsByQuery', function () {

    test.each([
        [{name: "Acidic Solution"}, "Acidic Solution"],
        [{tier: 0}, "Acid Magma"],
        [{minlevel: 101}, "Acidic Remains"],
        [{maxlevel: 61}, "Acidic Solution"],
        [{profession: "COOKING"}, "Blessed Heart"],
        [{modifier: "SPEED"}, "Accursed Effigy"],
    ])('should return object with property "%s"', async (input, expected) => {
        await initKnex();

        const results = await ingredientsApi.findIngredientsByQuery(input);

        expect(results[0].name).toEqual(expected);
    });
});