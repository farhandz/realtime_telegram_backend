const connection = require('mysql2')
require('dotenv').config()

const conn = connection.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = conn 


