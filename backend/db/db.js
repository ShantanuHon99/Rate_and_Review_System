const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const initScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await connection.query(initScript);
    console.log('✅ Database and tables initialized');
    await connection.end();
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
  }
};

initDB();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;
