module.exports = {
    seed: async (knex) => {

        await knex('Items').delete();

        await knex('Items').insert([
                {
                    display_name: "Helmet w Accursed Effigy",
                    type: "HELMET",
                    ingredient_used: 1,
                    owner_auth0id: 1,
                },
                {
                    display_name: "Boots w 7-Yottabyte",
                    type: "BOOTS",
                    ingredient_used: 3,
                    owner_auth0id: 1,
                },
                {
                    display_name: "Leggings w Accursed Effigy",
                    type: "LEGGINGS",
                    ingredient_used: 1,
                    owner_auth0id: 2,
                },
                {
                    display_name: "Dish w Blessed Heart",
                    type: "COOKING",
                    ingredient_used: 63,
                    owner_auth0id: 3
                },
            ]
        );
    },
}