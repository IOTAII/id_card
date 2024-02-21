// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
};
