const {getKnex, userColumns, userTables} = require('../data');

const findByAuth0Id = async (auth0id) => {
    return await getKnex()(userTables.users)
        .where(userColumns.users.userId, auth0id)
        .first();
};

const create = async ({name, auth0id}) => {
    return await getKnex()(userTables.users)
        .insert({
            user_name: name,
            auth0id: auth0id,
        });
};

module.exports = {
    findByAuth0Id, create
}