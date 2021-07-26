const app = require('./server');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();
//accessing DAO Classes
const StudentDAO = require('./models/student.dao');
const ApplicationDAO = require('./models/application.dao');
const AdminDAO = require('./models/admin.dao');
const PORT = process.env.PORT || 5000;

MongoClient.connect(process.env.MONGO_DB_URI)
  .then(async client => {
    await StudentDAO.initCollection(client);
    await ApplicationDAO.initCollection(client);
    await AdminDAO.initCollection(client);
    app.listen(PORT, () => console.log('listening on port: ' + PORT));
  })
  .catch(err => console.log(err));
