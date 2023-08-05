const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

function createDatabaseAndTables() {
  return new Promise((resolve, reject) => {
    // Create database if it doesn't exist
    const dbName = 'JinshanLottery';
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
      if (err) return reject(`Error creating database: ${err}`);

      connection.query(`USE ${dbName}`, (err) => {
        if (err) return reject(`Error selecting database: ${err}`);

        // Create User table
        const createUserTable = `
          CREATE TABLE IF NOT EXISTS User (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ID_number VARCHAR(20) NOT NULL,
            phone_number VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        connection.query(createUserTable, (err) => {
          if (err) return reject(`Error creating User table: ${err}`);

          // Create Store table
          const createStoreTable = `
            CREATE TABLE IF NOT EXISTS Store (
              id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              store_id VARCHAR(100) NOT NULL,
              store_name VARCHAR(100) NOT NULL,
              pin VARCHAR(6) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX (store_id)
            )
          `;

          connection.query(createStoreTable, (err) => {
            if (err) return reject(`Error creating Store table: ${err}`);

            // Create Consumption table
            const createConsumptionTable = `
              CREATE TABLE IF NOT EXISTS Consumption (
                id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id INT(11) UNSIGNED NOT NULL,
                amount INT(11) NOT NULL,
                store_id VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE
              )
            `;

            connection.query(createConsumptionTable, (err) => {
              if (err) return reject(`Error creating Consumption table: ${err}`);

              // Create Prizes table
              const createPrizesTable = `
                CREATE TABLE IF NOT EXISTS Prizes (
                  id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  remaining_quantity INT(11) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
              `;

              connection.query(createPrizesTable, (err) => {
                if (err) return reject(`Error creating Prizes table: ${err}`);

                // Create User_Prizes join table
                const createUserPrizesTable = `
                  CREATE TABLE IF NOT EXISTS User_Prizes (
                    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    user_id INT(11) UNSIGNED NOT NULL,
                    prize_id INT(11) UNSIGNED NOT NULL,
                    redeem BOOLEAN DEFAULT FALSE,
                    won_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
                    FOREIGN KEY (prize_id) REFERENCES Prizes(id) ON DELETE CASCADE
                  )
                `;

                connection.query(createUserPrizesTable, (err) => {
                  if (err) return reject(`Error creating User_Prizes table: ${err}`);

                  resolve('All tables created successfully!');
                });
              });
            });
          });
        });
      });
    });
  });
}

function dropDatabase() {
  return new Promise((resolve, reject) => {
    connection.query(`DROP DATABASE IF EXISTS JinshanLottery`, (err) => {
      if (err) return reject(`Error dropping database: ${err}`);
      resolve('Database JinshanLottery dropped successfully!');
    });
  });
}

module.exports = {
  createDatabaseAndTables,
  dropDatabase
};


