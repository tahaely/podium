const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const proteger = (req, res, next) => {
    let jeton;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            jeton = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(jeton, process.env.JWT_SECRET);
            req.user = decode;
            next();
        } catch (erreur) {
            console.error(erreur);
            res.status(401).json({ message: 'Non autorisé, jeton invalide' });
        }
    }

    if (!jeton) {
        res.status(401).json({ message: 'Non autorisé, aucun jeton' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Non autorisé en tant qu\'administrateur' });
    }
};

module.exports = { proteger, admin };
