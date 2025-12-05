const serviceMembre = require('../services/memberService');

const ajouterMembre = async (req, res) => {
    try {
        const { team_id, user_id, name, role, avatar_url } = req.body;
        const membre = await serviceMembre.ajouterMembre(team_id, user_id, name, role, avatar_url);
        res.status(201).json(membre);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const obtenirMembres = async (req, res) => {
    try {
        const membres = await serviceMembre.obtenirTousLesMembres(req.query.team_id);
        res.json(membres);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const obtenirMembre = async (req, res) => {
    try {
        const membre = await serviceMembre.obtenirMembreParId(req.params.id);
        if (!membre) return res.status(404).json({ message: 'Membre non trouvé' });
        res.json(membre);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const modifierMembre = async (req, res) => {
    try {
        const { name, role, avatar_url } = req.body;
        const membre = await serviceMembre.modifierMembre(req.params.id, name, role, avatar_url);
        res.json(membre);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const supprimerMembre = async (req, res) => {
    try {
        await serviceMembre.retirerMembre(req.params.id);
        res.json({ message: 'Membre supprimé' });
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

module.exports = { ajouterMembre, obtenirMembres, obtenirMembre, modifierMembre, supprimerMembre };
