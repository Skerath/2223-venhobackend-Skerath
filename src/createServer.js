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
const {serializeError} = require("serialize-error");
const ServiceError = require("./core/serviceError");
const {ValidationError} = require("joi");

const logger = getLogger();

async function createServer() {
    const app = new Koa();

    logger.info(`\n---------\n Environment: ${NODE_ENV},\n log level: ${LOG_LEVEL},\n logs enabled: ${!LOG_DISABLED}\n ---------`);

    // CORS
    app.use(koaCors({
        origin: (ctx) => {
            if (CORS_ORIGIN.indexOf(ctx.request.header.origin) !== -1) return ctx.request.header.origin; else return CORS_ORIGIN[0];
        },
        allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
        maxAge: CORS_AGE,
    }));

    // Start database
    await initKnex();

    // Logging middleware
    app.use(async (ctx, next) => {
        const logger = getLogger();
        logger.info(`Received request ${ctx.method} ${ctx.url}`);


        try {
            await next();
            logger.info(`Result was [${ctx.status}] for ${ctx.method} ${ctx.url}`,
            );
        } catch (error) {
            logger.error(`Result was [${ctx.status}] for ${ctx.method}  ${ctx.url}`, {
                error,
            });

            throw error;
        }
    });

    // Error handling
    app.use(async (ctx, next) => {
        try {
            await next();

            if (ctx.status === 404) {
                ctx.body = {
                    code: 'NOT_FOUND',
                    message: `Unknown resource: ${ctx.url}`,
                };
                ctx.status = 404;
            }
        } catch (error) {
            const logger = getLogger();


            if (!error instanceof ValidationError)
                logger.error('Error occured while handling a request', {
                    error: serializeError(error),
                });

            let statusCode = error.status || 500;
            let errorBody = {
                code: error.code || ((error.details) ? error.details[0].context.error : 'INTERNAL_SERVER_ERROR'),
                message: error.message,
                details: error.details || {},
                stack: NODE_ENV !== 'production' ? error.stack : undefined,
            };

            if (error instanceof ValidationError) {
                if (error.details) {

                    if (error.details[0].context.error === "VALIDATION_FAILED") {
                        statusCode = 404;
                    }
                }
            }

            if (error instanceof ServiceError) {
                if (error.isNotFound)
                    statusCode = 404;

                if (error.isValidationFailed)
                    statusCode = 400;

                if (error.isUnauthorized)
                    statusCode = 401;

                if (error.isForbidden)
                    statusCode = 403;
            }
            ctx.status = statusCode;
            ctx.body = errorBody;
        }
    });

    // Rest layer
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