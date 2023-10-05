const mysql = require('mysql2/promise');
const { config } = require('./index');

const createDatabaseConnection = async () => {
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });
  return connection;
};

module.exports = {
  createDatabaseConnection,
};