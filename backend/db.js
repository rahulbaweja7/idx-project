const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+00:00',
  connectionLimit: 10,
  multipleStatements: false,
});

pool.on('connection', (connection) => {
  connection.query("SET SESSION sql_mode = ''");
});

module.exports = pool;