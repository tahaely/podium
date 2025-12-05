const db = require('../config/db');

const obtenirClassement = async (periode) => {
    let conditionDate = '';
    if (periode === 'quotidien' || periode === 'daily') {
        conditionDate = 'AND DATE(pl.created_at) = CURDATE()';
    } else if (periode === 'hebdomadaire' || periode === 'weekly') {
        conditionDate = 'AND YEARWEEK(pl.created_at, 1) = YEARWEEK(CURDATE(), 1)';
    }

    const requete = `
        SELECT 
            t.id, 
            t.name as nom_equipe, 
            t.color as couleur_equipe, 
            COALESCE(SUM(pl.points_added), 0) as total_points,
            COUNT(DISTINCT CASE WHEN pl.task_id IS NOT NULL THEN pl.task_id END) as taches_completees
        FROM teams t
        LEFT JOIN points_log pl ON t.id = pl.team_id ${conditionDate}
        GROUP BY t.id
        ORDER BY total_points DESC
    `;

    const [classement] = await db.query(requete);
    return classement;
};

module.exports = { obtenirClassement };
