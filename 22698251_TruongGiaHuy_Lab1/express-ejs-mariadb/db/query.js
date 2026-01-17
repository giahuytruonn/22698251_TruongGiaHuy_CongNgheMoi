const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sa',
    database: 'shopdb'
})

module.exports = pool;