const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });
    console.log('✅ Connection successful!');
    await conn.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.code || err.message);
  }
}

testConnection();
