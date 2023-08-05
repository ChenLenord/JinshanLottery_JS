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

function generateMockData() {
  return new Promise(async (resolve, reject) => {
    try {
      await createDatabaseAndTables(); // Ensure the database and tables are created

      // Generate mock data for Users
      const users = [];
      for (let i = 1; i <= 100; i++) {
        const userId = `U${i.toString().padStart(9, '0')}`;
        users.push({
          ID_number: userId,
          phone_number: `12345678${i}`,
          email: `user${i}@example.com`,
        });
      }

      // Insert users into the User table
      connection.query('INSERT INTO User (ID_number, phone_number, email) VALUES ?', [users.map(u => [u.ID_number, u.phone_number, u.email])]);

      // Generate mock data for Stores
      const stores = [];
      for (let i = 1; i <= 1000; i++) {
        const storeId = generateUUID(); // Function to generate UUID (store_id)
        const pin = generateRandomPin(); // Function to generate random 6-digit PIN
        stores.push({
          store_id: storeId,
          store_name: `Store ${i}`,
          pin: pin,
        });
      }

      // Insert stores into the Store table
      connection.query('INSERT INTO Store (store_id, store_name, pin) VALUES ?', [stores.map(s => [s.store_id, s.store_name, s.pin])]);

      // Generate mock data for Consumption
      const consumptions = [];
      for (let userId = 1; userId <= 100; userId++) {
        for (let storeIndex = 0; storeIndex < 10; storeIndex++) {
          for (let consumptionIndex = 1; consumptionIndex <= 20; consumptionIndex++) {
            consumptions.push({
              user_id: userId,
              amount: Math.floor(Math.random() * 100) + 1,
              store_id: stores[(userId - 1) * 10 + storeIndex].store_id,
            });
          }
        }
      }

      // Insert consumptions into the Consumption table
      connection.query('INSERT INTO Consumption (user_id, amount, store_id) VALUES ?', [consumptions.map(c => [c.user_id, c.amount, c.store_id])]);

      // Generate mock data for Prizes
      const prizes = [];
      for (let i = 1; i <= 20; i++) {
        prizes.push({
          name: `Prize ${i}`,
          remaining_quantity: Math.floor(Math.random() * 10) + 1,
        });
      }

      // Insert prizes into the Prizes table
      connection.query('INSERT INTO Prizes (name, remaining_quantity) VALUES ?', [prizes.map(p => [p.name, p.remaining_quantity])]);

      resolve('Mock data created successfully!');
    } catch (err) {
      reject(`Error generating mock data: ${err}`);
    }
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateRandomPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  createDatabaseAndTables,
  dropDatabase,
  generateMockData,
};

