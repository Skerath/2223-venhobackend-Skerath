// Logger
const {getLogger} = require("../core/logging");
const logger = getLogger();

// MySQL DB
const config = require('config'); // Configuration library
const retryConnection = 5000;
const knex = require('knex');
const NODE_ENV = config.get('env');

// Connection
let databaseConnection;
const knexConfig = {
    client: 'mysql2',
    connection: {
        host: 'vichogent.be',
        port: 40043,
        user: '181905mc',
        database: '181905mc',
        password: 'jRIPQ74Qw1EoZwjT9BPx',
        insecureAuth: NODE_ENV === 'development',
    }
}

const getKnex = async function () {
    if (databaseConnection)
        return databaseConnection;
}

const initKnex = async function () {
    try {
        databaseConnection = knex(knexConfig);
        await databaseConnection.raw('SELECT 1+1 AS result');
        logger.info(`Connected to MySQL on '${knexConfig.connection.host}'`);
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

module.exports = {
    initKnex, // Connects to database
    getKnex, // Returns database connection
    tables, // Object containing Database tables
}