const userApi = require('../../repository/user')
const {initKnex} = require("../../data");

describe('findByAuth0Id', function () {
    test.each([
        1,
        2,
        3,
    ])('should return user object with auth0id', async (input) => {
        await initKnex();

        const result = await userApi.findByAuth0Id(input);

        expect(result.auth0id).toBe(String(input));
    });
});

describe('create', function () {
    it('should create a user and return it', async () => {
        await initKnex();
        const auth0id = Math.floor(Math.random() * 41 + 10); // random id ranging from 10 to 50
        const name = "Test User";

        await userApi.create({name: name, auth0id: auth0id});
        const result = await userApi.findByAuth0Id(auth0id);


        expect(result.user_name).toBe(name);
    });
})