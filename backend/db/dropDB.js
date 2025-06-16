const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const dropScript = fs.readFileSync(path.join(__dirname, 'drop.sql'), 'utf8');
    await connection.query(dropScript);
    console.log('🗑️ Entire database dropped successfully.');
    await connection.end();
  } catch (err) {
    console.error('❌ Error dropping database:', err);
  }
})();
