const serviceAuth = require('../services/authService');

const inscrire = async (req, res) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
        return res.status(400).json({ erreurs: erreurs.array() });
    }

    try {
        const { email, password, role } = req.body;
        const utilisateur = await serviceAuth.inscrire(email, password, role);
        res.status(201).json(utilisateur);
    } catch (erreur) {
        res.status(400).json({ message: erreur.message });
    }
};

const connecter = async (req, res) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
        return res.status(400).json({ erreurs: erreurs.array() });
    }

    try {
        const { email, password } = req.body;
        const utilisateur = await serviceAuth.connecter(email, password);
        res.json(utilisateur);
    } catch (erreur) {
        res.status(401).json({ message: erreur.message });
    }
};

const obtenirTousLesUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await serviceAuth.obtenirTousLesUtilisateurs();
        res.json(utilisateurs);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const { validationResult } = require('express-validator');

module.exports = { inscrire, connecter, obtenirTousLesUtilisateurs };
