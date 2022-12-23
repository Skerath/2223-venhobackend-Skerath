module.exports = {
    env: 'NODE_ENV',
    port: 'PORT',
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
    },
    database: {
        hostname: 'DATABASE_HOSTNAME',
        port: 'DATABASE_PORT',
        username: 'DATABASE_USERNAME',
        name: 'DATABASE_NAME',
        password: 'DATABASE_PASSWORD',
        isDevelopment: 'isDevelopment'
    },
};