// Libraries
const Koa = require('koa');
const Router = require('@koa/router'); // Routing for Rest API
const config = require('config'); // Configuration library
const {getLogger} = require('./core/logging'); // Winston logging
const bodyParser = require('koa-bodyparser'); // Parsing requests for Rest API


// Logging
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

// Rest API
const installRestRoutes = require('./rest');

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`)

const app = new Koa();
const logger = getLogger();
const router = new Router();

app.use(bodyParser());
installRestRoutes(app);
app
    .use(router.routes())
    .use(router.allowedMethods());

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
