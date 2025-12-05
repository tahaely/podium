const db = require('../config/db');

const ajouterPoints = async (idEquipe, idMembre, idTache, points, raison) => {
    await db.query(
        'INSERT INTO points_log (team_id, member_id, task_id, points_added, reason) VALUES (?, ?, ?, ?, ?)',
        [idEquipe, idMembre, idTache, points, raison]
    );
};

const verifierSerie = async (idMembre) => {
    // Vérifier si le membre a complété 3 tâches aujourd'hui
    const aujourdhui = new Date().toISOString().slice(0, 10);
    const [taches] = await db.query(
        `SELECT COUNT(*) as count FROM tasks 
         WHERE member_id = ? AND status = 'validated' 
         AND DATE(validated_at) = ?`,
        [idMembre, aujourdhui]
    );

    if (taches[0].count === 3) {
        // Attribuer le badge de série si c'est exactement la 3ème tâche
        // Vérifier si déjà attribué aujourd'hui
        const [existant] = await db.query(
            `SELECT * FROM points_log 
             WHERE member_id = ? AND reason = 'Badge Série Quotidienne' 
             AND DATE(created_at) = ?`,
            [idMembre, aujourdhui]
        );

        if (existant.length === 0) {
            // Obtenir l'équipe du membre
            const [membre] = await db.query('SELECT team_id FROM members WHERE id = ?', [idMembre]);
            if (membre.length > 0) {
                await ajouterPoints(membre[0].team_id, idMembre, null, 50, 'Badge Série Quotidienne'); // 50 points pour la série
                return true;
            }
        }
    }
    return false;
};

module.exports = { ajouterPoints, verifierSerie };
