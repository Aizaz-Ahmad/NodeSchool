const session = require('express-session');
require('dotenv').config();
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore(
  {
    databaseName: process.env.MONGO_DB,
    collection: 'user_session',
    uri: process.env.MONGO_DB_URI,
  },
  err => (err ? console.log(err) : '')
);

module.exports = store;
