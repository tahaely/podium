const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const initDb = async () => {
    try {
        // Create connection without database selected to create it if needed
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gamification_db'}`);
        console.log(`✅ Database ${process.env.DB_NAME || 'gamification_db'} created or already exists.`);

        await connection.end();

        // Now connect to the database
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'gamification_db',
            multipleStatements: true
        });

        const schemaPath = path.join(__dirname, '../config/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await db.query(schemaSql);
        console.log('✅ Tables created successfully.');

        // Create a default admin user if not exists
        // Note: Password hashing is handled in authService, but for init we might want a quick seed.
        // For now, let's just leave it empty or create a raw insert if really needed.
        // Better to let the user register via API or use a seed script.

        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
};

initDb();
