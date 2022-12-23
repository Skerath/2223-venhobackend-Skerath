module.exports = {
    env: 'NODE_ENV',
    port: 'PORT',
    auth: {
        jwksUri: 'AUTH_JWKS_URI',
        audience: 'AUTH_AUDIENCE',
        issuer: 'AUTH_ISSUER',
        userInfo: 'AUTH_USER_INFO',
    },
    database: {
        hostname: 'DATABASE_HOSTNAME',
        port: 'DATABASE_PORT',
        username: 'DATABASE_USERNAME',
        name: 'DATABASE_NAME',
        password: 'DATABASE_PASSWORD',
        isDevelopment: 'isDevelopment'
    }

}