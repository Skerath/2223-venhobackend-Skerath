module.exports = {
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
        jwksUri: 'AUTH_JWKS_URI',
        audience: 'AUTH_AUDIENCE',
        issuer: 'AUTH_ISSUER',
        userInfo: 'AUTH_USER_INFO',
        tokenUrl: 'AUTH_TOKEN_URL',
        clientId: 'AUTH_CLIENT_ID',
        clientSecret: 'AUTH_CLIENT_SECRET',
        testUser: {
            userId: 'AUTH_TEST_USER_USER_ID',
            username: 'AUTH_TEST_USER_USERNAME',
            password: 'AUTH_TEST_USER_PASSWORD',
        },

    }
};