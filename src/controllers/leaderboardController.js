const serviceClassement = require('../services/leaderboardService');

const obtenirClassement = async (req, res) => {
    try {
        const periode = req.query.period || req.query.periode;
        const classement = await serviceClassement.obtenirClassement(periode);
        res.json(classement);
    } catch (erreur) {
        res.status(500).json({ message: erreur.message });
    }
};

module.exports = { obtenirClassement };
