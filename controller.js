const mysql = require('mysql2');
const { createDatabaseAndTables, dropDatabase } = require('./controllers/db.js'); // adjust the path accordingly

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'JinshanLottery'
// });


exports.createDB = (req, res) => {
  console.log("Received POST request for /db");
  createDatabaseAndTables()
      .then(() => {
          console.log("Database and tables created successfully!");
          res.status(200).send("Database and tables created successfully!");
      })
      .catch(err => {
          console.error("Failed to create database and tables:", err);
          res.status(500).send("Failed to create database and tables: " + err);
      });
};

exports.dropDownDB = (req, res) => {
  console.log("Received DELETE request for /db");
  dropDatabase()
      .then(() => {
          console.log("Database JinshanLottery dropped successfully!");
          res.status(200).send("Database JinshanLottery dropped successfully!");
      })
      .catch(err => {
          console.error("Failed to drop the database:", err);
          res.status(500).send("Failed to drop the database: " + err);
      });
};

