const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (email, password, role) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new Error('User already exists');
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertion dans la base de données
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, role || 'member']
        );

        return { id: result.insertId, email, role };
    } catch (error) {
        console.error('Erreur lors de l’inscription :', error.message);
        throw new Error(error.message || 'Impossible de créer l’utilisateur.');
    }
};


const login = async (email, password) => {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        token
    };
};

module.exports = { register, login };
