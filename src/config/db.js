const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gamification_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fonction pour vérifier la connexion à la base de données
const verifyDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        connection.release();
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        process.exit(1); // Stop le serveur si DB non connectée
    }
};

module.exports = { pool, verifyDbConnection };
