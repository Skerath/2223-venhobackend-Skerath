// Koa
const Koa = require('koa');

const config = require('config'); // Configuration library
const NODE_ENV = config.get('env');
const CORS_ORIGIN = config.get('cors.origins');
const CORS_AGE = config.get('cors.maxAge')
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const {getLogger} = require('./core/logging'); // Winston logging
const koaCors = require('@koa/cors'); // Authentication
const installRestRoutes = require('./rest');
const {initKnex, shutdownKnex} = require("./data");

const logger = getLogger();

async function createServer() {
    const app = new Koa();

    logger.info(`\n---------\n Environment: ${NODE_ENV},\n log level: ${LOG_LEVEL},\n logs enabled: ${!LOG_DISABLED}\n ---------`);

    app.use(koaCors({
        origin: (ctx) => {
            if (CORS_ORIGIN.indexOf(ctx.request.header.origin) !== -1) return ctx.request.header.origin; else return CORS_ORIGIN[0];
        },
        allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
        maxAge: CORS_AGE,
    }));

    await initKnex();

    installRestRoutes(app);

    return {
        getApp() {
            return app;
        },

        start() {
            return new Promise((resolve) => {
                const port = config.get('port');
                app.listen(port);
                logger.info(`Server listening on http://localhost:${port}`);
                resolve();
            });
        },

        async stop() {
            {
                app.removeAllListeners();
                await shutdownKnex();
                logger.info('Tschüss');
            }
        },
    };
}

module.exports = createServer;