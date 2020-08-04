const mysql = require('mysql');
require('dotenv').config();

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

let connection;

function handleConnectDB() {
  connection = mysql.createConnection(db_config);

  connection.connect((err) => {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleConnectDB, 2000);
    }
    console.log('Mysql Database Connected...');
  });
  connection.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnectDB();
    }
    else {
      throw err;
    }
  });
}

handleConnectDB();

module.exports = connection;