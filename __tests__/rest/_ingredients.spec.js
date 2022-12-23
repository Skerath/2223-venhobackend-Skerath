const {withServer} = require("../helpers");
describe('Ingredients', () => {
    let request;
    let knex;
    let authHeader;
    const url = '/api/ingredients';

    withServer(({knex: k, request: r, authHeader: a}) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    describe('GET /api/ingredients/', () => {
        test('it should be 200 and return all ingredients', async () => {
            const response = await request.get(url)
                .set('Authorization', authHeader);
            expect(response.status).toBe(200);
        });
    });

    describe('GET /api/ingredients/names', () => {
        test('it should be 200 and return all ingredient names', async () => {
            const response = await request.get(`${url}/names`)
                .set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(7);
        });
    });

    describe('GET /api/ingredients/modifiers', () => {
        it('it should be 200 and return all ingredient modifiers', async () => {
            const response = await request.get(`${url}/modifiers`)
                .set('Authorization', authHeader);
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(6);
        });

        it('contains modifier names', async () => {
            const response = await request.get(`${url}/modifiers`)
                .set('Authorization', authHeader);
            const expectedProfessions = ["FIREDAMAGEBONUS", "WATERDEFENSE", "POISON", "MANASTEAL"];
            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.arrayContaining(expectedProfessions));
        });
    });

    describe('GET /api/ingredients/professions', () => {
        it('it should be 200 and return all ingredient professions', async () => {
            const response = await request.get(`${url}/professions`)
                .set('Authorization', authHeader);
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(7);
        });

        it('contains profession names', async () => {
            const response = await request.get(`${url}/professions`)
                .set('Authorization', authHeader);
            const expectedProfessionNames = ["WOODWORKING", "ALCHEMISM", "COOKING", "SCRIBING"];
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining(expectedProfessionNames));
        });
    });

    describe('GET /api/ingredients/?=', () => {
        test.each([
            ["name", "Acidic Solution", "Acidic Solution"],
            ["tier", 0, "Acid Magma"],
            ["minlevel", 101, "Acidic Remains"],
            ["maxlevel", 61, "Acidic Solution"],
            ["profession", "COOKING", "Blessed Heart"],
            ["modifier", "SPEED", "Accursed Effigy"],
        ])('should return object with property "%s"', async (inputType, input, expected) => {

            const response = await request.get(`${url}?${inputType}=${input}`)
                .set('Authorization', authHeader)
            expect(response.body[0].name).toEqual(expected);
        });

        it('should return a validation error 404 when none were found', async () => {
            const response = await request.get(`${url}/?name=THIS_SHOULD_BE_AN_IMPOSSIBLE_TO_HAVE_NAME`)
                .set('Authorization', authHeader);
            expect(response.status).toBe(404);
        });
    });
});