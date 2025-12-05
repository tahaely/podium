const express = require('express');
const { check } = require('express-validator');
const controleurAuth = require('../controllers/authController');

const routeur = express.Router();

routeur.post(
    '/inscrire',
    [
        check('email', 'Veuillez inclure un email valide').isEmail(),
        check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
    ],
    controleurAuth.inscrire
);

routeur.post(
    '/connecter',
    [
        check('email', 'Veuillez inclure un email valide').isEmail(),
        check('password', 'Le mot de passe est requis').exists()
    ],
    controleurAuth.connecter
);

routeur.get('/utilisateurs', require('../middleware/authMiddleware').proteger, controleurAuth.obtenirTousLesUtilisateurs);

module.exports = routeur;
