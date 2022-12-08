// Koa
const Koa = require('koa');
const app = new Koa();

const config = require('config'); // Configuration library
const NODE_ENV = config.get('env');
const CORS_ORIGIN = config.get('cors.origins');
const CORS_AGE = config.get('cors.maxAge')
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const {getLogger} = require('./core/logging'); // Winston logging
const koaCors = require('@koa/cors'); // Authentication
const installRestRoutes = require('./rest');
const {initKnex} = require("./data");

async function main() {
    const logger = getLogger();
    console.log(` ---------\n Environment: ${NODE_ENV},\n log level: ${LOG_LEVEL},\n logs enabled: ${!LOG_DISABLED}\n ---------`);

    app.use(koaCors({
        origin: (ctx) => {
            if (CORS_ORIGIN.indexOf(ctx.request.header.origin) !== -1) return ctx.request.header.origin; else return CORS_ORIGIN[0];
        },
        allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
        maxAge: CORS_AGE,
    }));

    await initKnex();

    installRestRoutes(app);

    logger.info(`Server listening on http://localhost:9000`);
    app.listen(9000);
}

main();