module.exports = {
    env: 'test',
    port: 9000,
    log: {
        level: 'silly',
        disabled: true,
    },
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    },
    database: {
        hostname: "localhost",
        port: "3306",
        username: "dbdev",
        name: "venho_dev",
        password: "dbdev",
        isDevelopment: "false",
    },
    auth: {
        jwksUri: 'https://dev-0zesadwtf74rit5f.us.auth0.com/.well-known/jwks.json',
        audience: 'https://wsproject.mauricec.be',
        issuer: 'https://dev-0zesadwtf74rit5f.us.auth0.com/',
        userInfo: 'https://dev-0zesadwtf74rit5f.us.auth0.com/userinfo',
        tokenUrl: 'https://dev-0zesadwtf74rit5f.us.auth0.com/oauth/token',
        clientId: 'wJznJLgDubQ5Hdysbu8dMR9n6atrUy4s',
        clientSecret: 'jcjepTGhlxQD4KurNaMO6huyMPI4DG0FBDGPH9uxEPGi5CyIxTvNdcVNDYPUckI7',
        testUser: {
            userId: 'auth0|63a576d74e7c4abd8841200e',
            username: 'e2e@test-hogent.be',
            password: 'testAccount789$',
        },

    }
};