module.exports = {

    seed: async (knex) => {

        await knex('ConsumableOnlyIdentifiers').delete();
        await knex('ItemOnlyIdentifiers').delete();
        await knex('IngredientPositionModifiers').delete();
        await knex('Resources').delete();

        await knex('Resources').insert([
                {
                    resourceID: 1,
                    name: "Accursed Effigy",
                    tier: 2,
                    level: 76,
                    modifiers: `{
                        "SPEED": {"maximum": -10, "minimum": -12},
                        "MANASTEAL": {"maximum": 4, "minimum": 4},
                        "FIREDAMAGEBONUS": {"maximum": 14, "minimum": 8}
                    }`,
                    professions: `["ARMOURING", "TAILORING"]`
                },
                {
                    resourceID: 2,
                    name: "Acidic Solution",
                    tier: 2,
                    level: 60,
                    modifiers: `{"POISON": {"maximum": 290, "minimum": 260}}`,
                    professions: `["WEAPONSMITHING", "WOODWORKING"]`
                },
                {
                    resourceID: 3,
                    name: "7-Yottabyte Storage Component",
                    tier: 2,
                    level: 90,
                    modifiers: `{}`,
                    professions: `["ARMOURING", "WEAPONSMITHING", "WOODWORKING"]`
                },
                {
                    resourceID: 4,
                    name: "Acidic Remains",
                    tier: 1,
                    level: 102,
                    modifiers: `{
                        "HEALTHREGENRAW": {"maximum": -50, "minimum": -60},
                        "FIREDAMAGEBONUS": {"maximum": 12, "minimum": 9}
                    }`, professions: `["WEAPONSMITHING", "WOODWORKING"]`
                },
                {
                    resourceID: 5,
                    name: "Acid Magma",
                    tier: 0,
                    level: 91,
                    modifiers: `{
                        "POISON": {"maximum": 100, "minimum": 90},
                        "WATERDEFENSE": {"maximum": -8, "minimum": -10}
                    }`,
                    professions: `["TAILORING", "ALCHEMISM"]`
                },
                {
                    resourceID: 36,
                    name: "Aspect of the Void",
                    tier: 3,
                    level: 100,
                    modifiers: `{}`,
                    professions: `["WEAPONSMITHING", "SCRIBING"]`
                },
                {
                    resourceID: 63,
                    name: "Blessed Heart",
                    tier: 3,
                    level: 77,
                    modifiers: `{}`,
                    professions: `["COOKING"]`
                }
            ]
        );

        await knex('ItemOnlyIdentifiers').insert([
            {
                itemResourceId: 1,
                durability_modifier: -87,
                strength_requirement: 0,
                dexterity_requirement: 0,
                intelligence_requirement: 0,
                defence_requirement: 15,
                agility_requirement: 0
            },
            {
                itemResourceId: 2,
                durability_modifier: -77,
                strength_requirement: 0,
                dexterity_requirement: 0,
                intelligence_requirement: 0,
                defence_requirement: 0,
                agility_requirement: 0
            },
            {
                itemResourceId: 3,
                durability_modifier: -98,
                strength_requirement: 0,
                dexterity_requirement: -12,
                intelligence_requirement: 0,
                defence_requirement: -12,
                agility_requirement: -12
            },
            {
                itemResourceId: 4,
                durability_modifier: -74,
                strength_requirement: 0,
                dexterity_requirement: 0,
                intelligence_requirement: 0,
                defence_requirement: 0,
                agility_requirement: 0
            },
            {
                itemResourceId: 5,
                durability_modifier: -49,
                strength_requirement: 0,
                dexterity_requirement: 0,
                intelligence_requirement: 0,
                defence_requirement: 8,
                agility_requirement: 0
            },
            {
                itemResourceId: 36,
                durability_modifier: -175,
                strength_requirement: 0,
                dexterity_requirement: 0,
                intelligence_requirement: 0,
                defence_requirement: 0,
                agility_requirement: 0
            }
        ]);

        await knex('ConsumableOnlyIdentifiers').insert([
            {
                consumableResourceId: 5,
                duration: -90,
                charges: 0
            },
            {
                consumableResourceId: 36,
                duration: -300,
                charges: 0
            },
            {
                consumableResourceId: 63,
                duration: -550,
                charges: 2
            }
        ]);

        await knex('IngredientPositionModifiers').insert([
            {
                positionModifierId: 36,
                left: 110,
                right: 110,
                above: 110,
                under: 110,
                touching: -110,
                not_touching: 15
            },
            {
                positionModifierId: 63,
                left: 0,
                right: 0,
                above: 0,
                under: 0,
                touching: -40,
                not_touching: 0
            }
        ]);
    }
}