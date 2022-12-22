const {getLogger} = require('../core/logging');
const userRepository = require('../repository/user')
const ServiceError = require("../core/serviceError");
const logger = getLogger();

const register = async ({
                            name,
                            auth0id,
                        }) => {
    logger.info('Creating a new user', {
        name,
        auth0id,
    });
    return await userRepository.create({
        name,
        auth0id,
    });
};

const getByAuth0Id = async (auth0id) => {
    logger.info(`Fetching user with auth0id ${auth0id}`);
    const user = await userRepository.findByAuth0Id(auth0id);

    if (!user) {
        throw ServiceError.notFound(`No user with id ${auth0id} exists`, {
            auth0id,
        });
    }

    return user;
};

module.exports = {register, getByAuth0Id}