const serviceEquipe = require('../services/teamService');

const creerEquipe = async (req, res) => {
    try {
        const { name, color } = req.body;
        const equipe = await serviceEquipe.creerEquipe(name, color);
        res.status(201).json(equipe);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const obtenirEquipes = async (req, res) => {
    try {
        const equipes = await serviceEquipe.obtenirToutesLesEquipes();
        res.json(equipes);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const obtenirEquipe = async (req, res) => {
    try {
        const equipe = await serviceEquipe.obtenirEquipeParId(req.params.id);
        if (!equipe) return res.status(404).json({ message: 'Équipe non trouvée' });
        res.json(equipe);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const modifierEquipe = async (req, res) => {
    try {
        const { name, color } = req.body;
        const equipe = await serviceEquipe.modifierEquipe(req.params.id, name, color);
        res.json(equipe);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

const supprimerEquipe = async (req, res) => {
    try {
        await serviceEquipe.supprimerEquipe(req.params.id);
        res.json({ message: 'Équipe supprimée' });
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

module.exports = { creerEquipe, obtenirEquipes, obtenirEquipe, modifierEquipe, supprimerEquipe };
