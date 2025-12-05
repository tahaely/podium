const serviceTache = require('../services/taskService');

const creerTache = async (req, res) => {
    try {
        const tache = await serviceTache.creerTache(req.body);
        res.status(201).json(tache);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const modifierTache = async (req, res) => {
    try {
        const misesAJour = { ...req.body };

        // Si le statut change à 'doing', assigner l'utilisateur actuel
        if (misesAJour.status === 'doing' && req.user && req.user.id) {
            // Nous devons obtenir le member_id associé à cet utilisateur
            // Cela suppose que l'utilisateur est un membre. Idéalement, nous devrions rechercher le member_id.
            // Cependant, en regardant le schéma, la table members lie user_id.
            // Passons le user_id au service pour gérer la recherche.
            misesAJour.user_id = req.user.id;
        }

        const tache = await serviceTache.modifierTache(req.params.id, misesAJour);
        res.json(tache);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const televerserPreuve = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléversé' });
        }
        const urlPreuve = `/uploads/${req.file.filename}`;
        const tache = await serviceTache.televerserPreuve(req.params.id, urlPreuve);
        res.json(tache);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const validerTache = async (req, res) => {
    try {
        const resultat = await serviceTache.validerTache(req.params.id);
        res.json(resultat);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const obtenirTaches = async (req, res) => {
    try {
        const taches = await serviceTache.obtenirTaches(req.query);
        res.json(taches);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

module.exports = { creerTache, modifierTache, televerserPreuve, validerTache, obtenirTaches };
