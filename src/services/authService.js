const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const inscrire = async (email, motDePasse, role) => {
    const [utilisateurExistant] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (utilisateurExistant.length > 0) {
        throw new Error('Cet utilisateur existe déjà');
    }

    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    const [resultat] = await db.query(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, motDePasseHash, role || 'member']
    );

    return { id: resultat.insertId, email, role };
};

const connecter = async (email, motDePasse) => {
    const [utilisateurs] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (utilisateurs.length === 0) {
        throw new Error('Identifiants invalides');
    }

    const utilisateur = utilisateurs[0];
    const correspondance = await bcrypt.compare(motDePasse, utilisateur.password_hash);

    if (!correspondance) {
        throw new Error('Identifiants invalides');
    }

    const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    return {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        token
    };
};

const obtenirTousLesUtilisateurs = async () => {
    const [utilisateurs] = await db.query('SELECT id, email, role FROM users');
    return utilisateurs;
};

module.exports = { inscrire, connecter, obtenirTousLesUtilisateurs };
