// Logger
const {getLogger} = require("../core/logging");
const logger = getLogger();

// MySQL DB
const config = require('config'); // Configuration library
const retryConnection = 5000;
const knex = require('knex');
const NODE_ENV = config.get('env');
const DATABASE_HOSTNAME = 'vichogent.be',
    DATABASE_PORT = 40043,
    DATABASE_USERNAME = '181905mc',
    DATABASE_NAME = '181905mc',
    DATABASE_PASSWORD = 'jRIPQ74Qw1EoZwjT9BPx',
    isDevelopment = NODE_ENV === 'development';

// Connection
let databaseConnection;
const knexConfig = {
    client: 'mysql2',
    connection: {
        host: DATABASE_HOSTNAME,
        port: DATABASE_PORT,
        user: DATABASE_USERNAME,
        database: DATABASE_NAME,
        password: DATABASE_PASSWORD,
        insecureAuth: isDevelopment,
    }
}

function getKnex() {
    if (!databaseConnection)
        throw new Error(`Error: cannot invoke database as it has not been initialized.`);
    return databaseConnection;
}

async function initKnex() {
    try {
        databaseConnection = knex(knexConfig);
        await databaseConnection.raw('SELECT 1+1 AS result');
        logger.info(`Connected to MySQL on '${DATABASE_HOSTNAME}:${DATABASE_PORT}'`);
    } catch
        (error) {
        logger.error(`Error when connecting to MySQL: ${error}`);
        logger.info(`Retrying in... ${retryConnection / 1000} seconds`);
        databaseConnection = undefined;
        setTimeout(initKnex, retryConnection);
    }
}

// Tables
const tables = Object.freeze({
    resources: 'Resources',
    consumableIdentifiers: 'ConsumableOnlyIdentifiers',
    itemIdentifiers: 'ItemOnlyIdentifiers',
    ingredientPositionModifier: 'IngredientPositionModifiers',
})

const ingredientDatabaseColumns = Object.freeze({
    resourceId: 'resourceID',
    consumableOnlyIdentifiersId: 'consumableResourceId',
    itemOnlyIdentifiersId: 'itemResourceId',
    ingredientPositionModifierId: 'positionModifierId',
    name: 'name',
    tier: 'tier',
    level: 'level',
    professions: 'professions',
    modifiers: 'modifiers',
})

module.exports = {
    initKnex,
    getKnex,
    tables,
    ingredientDatabaseColumns,
}