const db = require('../config/db');

const creerEquipe = async (nom, couleur) => {
    const [resultat] = await db.query(
        'INSERT INTO teams (name, color) VALUES (?, ?)',
        [nom, couleur]
    );
    return { id: resultat.insertId, nom, couleur };
};

const obtenirToutesLesEquipes = async () => {
    const [equipes] = await db.query('SELECT * FROM teams');
    return equipes;
};

const obtenirEquipeParId = async (id) => {
    const [equipes] = await db.query('SELECT * FROM teams WHERE id = ?', [id]);
    if (equipes.length === 0) return null;

    const equipe = equipes[0];

    // Obtenir les membres
    const [membres] = await db.query('SELECT * FROM members WHERE team_id = ?', [id]);
    equipe.membres = membres;

    // Calculer le score total (somme des points_log pour cette équipe)
    const [resultatScore] = await db.query('SELECT SUM(points_added) as total_score FROM points_log WHERE team_id = ?', [id]);
    equipe.score = resultatScore[0].total_score || 0;

    return equipe;
};

const modifierEquipe = async (id, nom, couleur) => {
    await db.query('UPDATE teams SET name = ?, color = ? WHERE id = ?', [nom, couleur, id]);
    return { id, nom, couleur };
};

const supprimerEquipe = async (id) => {
    await db.query('DELETE FROM teams WHERE id = ?', [id]);
};

module.exports = { creerEquipe, obtenirToutesLesEquipes, obtenirEquipeParId, modifierEquipe, supprimerEquipe };
