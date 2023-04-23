const db = require('../gs/datastore');
async function executeInDB(dbArgs) {
    const result = await db.default(dbArgs);

    return result
}

module.exports = executeInDB