// Update with your config settings.
require('dotenv').config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    database: process.env.NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    charset: "utf8",
  },

};
