const {getKnex, userColumns, userTables} = require('../data');

const findByAuth0Id = async (auth0id) => {
    return getKnex()(userTables.users)
        .where(userColumns.users.userId, auth0id)
        .first();
};

const create = async ({name, auth0id}) => {
    await getKnex()(userTables.users)
        .insert({
            user_name: name,
            auth0id: auth0id,
        });

    const user = await findByAuth0Id(auth0id);
    return (user.auth0id);
};

module.exports = {
    findByAuth0Id, create
}