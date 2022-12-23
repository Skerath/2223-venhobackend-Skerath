module.exports = {
    apps: [{
        name: "Venho",
        script: "./src/index.js",
        env_development: {
            NODE_ENV: 'development',
            AUTH_JWKS_URI: 'https://dev-0zesadwtf74rit5f.us.auth0.com/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://wsproject.mauricec.be',
            AUTH_ISSUER: 'https://dev-0zesadwtf74rit5f.us.auth0.com/',
            AUTH_USER_INFO: 'https://dev-0zesadwtf74rit5f.us.auth0.com/userinfo',
            DATABASE_HOSTNAME: 'localhost',
            DATABASE_PORT: 3306,
            DATABASE_USERNAME: 'dbdev',
            DATABASE_NAME: 'venho_dev',
            DATABASE_PASSWORD: 'dbdev',
            isDevelopment: 'true',
        },
        env_production: {
            NODE_ENV: 'production',
            AUTH_JWKS_URI: 'https://dev-0zesadwtf74rit5f.us.auth0.com/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://wsproject.mauricec.be',
            AUTH_ISSUER: 'https://dev-0zesadwtf74rit5f.us.auth0.com/',
            AUTH_USER_INFO: 'https://dev-0zesadwtf74rit5f.us.auth0.com/userinfo',
            DATABASE_HOSTNAME: 'vichogent.be',
            DATABASE_PORT: 40043,
            DATABASE_USERNAME: '181905mc',
            DATABASE_NAME: '181905mc',
            DATABASE_PASSWORD: 'jRIPQ74Qw1EoZwjT9BPx',
            isDevelopment: 'false',
        }
    }]
};