let { Client } = require('pg');

async function executeQuery(query,vals) {
    const client = new Client({
        user: 'postgres',
        password: 'harris',
        host: 'localhost',
        port: 5432,
        database: 'FinanceApp',
    })
    await client.connect();
    const result = await client.query(query,vals);
    await client.end()
    return result
    
}

module.exports = executeQuery