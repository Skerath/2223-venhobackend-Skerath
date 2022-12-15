// Logger
const {getLogger} = require("../core/logging");
const logger = getLogger();

// MySQL DB
const config = require('config'); // Configuration library
const retryConnection = 5000;
const knex = require('knex');
const NODE_ENV = config.get('env');

// const DATABASE_HOSTNAME = 'vichogent.be',
//     DATABASE_PORT = 40043,
//     DATABASE_USERNAME = '181905mc',
//     DATABASE_NAME = '181905mc',
//     DATABASE_PASSWORD = 'jRIPQ74Qw1EoZwjT9BPx',
//     isDevelopment = NODE_ENV === 'development';

const DATABASE_HOSTNAME = 'ID373401_venhodev.db.webhosting.be',
    DATABASE_PORT = 3306,
    DATABASE_USERNAME = 'ID373401_venhodev',
    DATABASE_NAME = 'ID373401_venhodev',
    DATABASE_PASSWORD = '7B1wkqv3BP9W09e912TX',
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
    },
    migrations: {
        tableName: 'knex_meta',
        directory: 'src/data/migrations',
    },

    seeds: {
        directory: 'src/data/seeds',
    },
};

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

    try {
        await getKnex().migrate.latest();
    } catch (error) {
        logger.error('Error while migrating database', {
            error,
        });
        throw new Error('Migrations failed, check the logs');
    }

    if (isDevelopment) {
        try {
            await getKnex().seed.run();
            logger.info(`Successfully loaded latest seed on '${DATABASE_HOSTNAME}:${DATABASE_PORT}'`);
        } catch (error) {
            console.log(error);
            logger.error('Error while seeding database', {error,});
        }
    }

}

// Tables
const resourcesTables = Object.freeze({
    resources: 'Resources',
    consumableIdentifiers: 'ConsumableOnlyIdentifiers',
    itemIdentifiers: 'ItemOnlyIdentifiers',
    ingredientPositionModifier: 'IngredientPositionModifiers',
})

const resourcesColumns = Object.freeze({
    resources: {
        id: 'resourceID',
        name: 'name',
        tier: 'tier',
        level: 'level',
        professions: 'professions',
        modifiers: 'modifiers',
    },
    itemOnlyIdentifiers: {
        id: 'itemResourceId',
        durability: 'durability_modifier',
        strength: 'strength_requirement',
        dexterity: 'dexterity_requirement',
        intelligence: 'intelligence_requirement',
        defence: 'defence_requirement',
        agility: 'agility_requirement',
    },
    consumableOnlyIdentifiers: {
        id: 'consumableResourceId',
        duration: 'duration',
        charges: 'charges',
    },
    ingredientPositionModifiers: {
        id: 'positionModifierId',
        left: 'left',
        right: 'right',
        above: 'above',
        under: 'under',
        touching: 'touching',
        notTouching: 'not_touching',
    }
});

module.exports = {
    initKnex,
    getKnex,
    resourcesTables,
    resourcesColumns,
}