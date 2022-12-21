const jwksrsa = require('jwks-rsa');
const config = require('config');
const {getLogger} = require('./logging');
const jwt = require("koa-jwt"); // Winston logging
const logger = getLogger();

function getJwtSecret() {
    try {
        let secretFunction = jwksrsa.koaJwtSecret({
            jwksUri: config.get('auth.jwksUri'), // 👈
            cache: true,
            cacheMaxEntries: 5,
        });
        return secretFunction;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function checkJwtToken() {
    try {
        let secretFunction = getJwtSecret();
        return jwt({
            secret: secretFunction,
            audience: config.get('auth.audience'),
            issuer: config.get('auth.issuer'),
            algorithms: ['RS256'],
            passthrough: true,
        });
        // .unless({
        //   path: [], // whitelist urls
        // }),
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

module.exports = {
    checkJwtToken,
};