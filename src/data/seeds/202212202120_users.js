module.exports = {
    seed: async (knex) => {

        await knex('Users').delete();

        await knex('Users').insert([
                {
                    user_name: "Skerath",
                    auth0id: 1,
                },
                {
                    user_name: "Sunder",
                    auth0id: 2,
                },
                {
                    user_name: "Bosjesman",
                    auth0id: 3,
                },
                {
                    user_name: "Sepsy",
                    auth0id: 4,
                },
                {
                    user_name: "Nuc",
                    auth0id: 5,
                },
                {
                    user_name: "Daemi",
                    auth0id: 6,
                },
            ]
        );
    },
}