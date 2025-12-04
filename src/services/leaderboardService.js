const db = require('../config/db');

const getLeaderboard = async (period) => {
    let dateCondition = '';
    if (period === 'daily') {
        dateCondition = 'AND DATE(pl.created_at) = CURDATE()';
    } else if (period === 'weekly') {
        dateCondition = 'AND YEARWEEK(pl.created_at, 1) = YEARWEEK(CURDATE(), 1)';
    }

    const query = `
        SELECT t.id, t.name, t.color, COALESCE(SUM(pl.points_added), 0) as total_score
        FROM teams t
        LEFT JOIN points_log pl ON t.id = pl.team_id ${dateCondition}
        GROUP BY t.id
        ORDER BY total_score DESC
    `;

    const [leaderboard] = await db.query(query);
    return leaderboard;
};

module.exports = { getLeaderboard };
