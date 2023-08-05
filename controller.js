const mysql = require('mysql2');
const { createDatabaseAndTables, dropDatabase, generateMockData } = require('./controllers/db.js'); // adjust the path accordingly


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

exports.generateMockData = (req, res) => {
  console.log("Received GET request for /db");
  generateMockData()
    .then(() => {
      console.log("Mock data generated successfully!");
      res.status(200).send("Mock data generated successfully!");
    })
    .catch(err => {
      console.error("Failed to generate mock data:", err);
      res.status(500).send("Failed to generate mock data: " + err);
    });
};