const db = require('../config/db');

const addPoints = async (teamId, memberId, taskId, points, reason) => {
    await db.query(
        'INSERT INTO points_log (team_id, member_id, task_id, points_added, reason) VALUES (?, ?, ?, ?, ?)',
        [teamId, memberId, taskId, points, reason]
    );
};

const checkStreak = async (memberId) => {
    // Check if member completed 3 tasks today
    const today = new Date().toISOString().slice(0, 10);
    const [tasks] = await db.query(
        `SELECT COUNT(*) as count FROM tasks 
         WHERE member_id = ? AND status = 'validated' 
         AND DATE(validated_at) = ?`,
        [memberId, today]
    );

    if (tasks[0].count === 3) {
        // Award streak badge/points if exactly 3rd task
        // Check if already awarded for today
        const [existing] = await db.query(
            `SELECT * FROM points_log 
             WHERE member_id = ? AND reason = 'Daily Streak Badge' 
             AND DATE(created_at) = ?`,
            [memberId, today]
        );

        if (existing.length === 0) {
            // Get team_id for the member
            const [member] = await db.query('SELECT team_id FROM members WHERE id = ?', [memberId]);
            if (member.length > 0) {
                await addPoints(member[0].team_id, memberId, null, 50, 'Daily Streak Badge'); // 50 points for streak
                return true;
            }
        }
    }
    return false;
};

module.exports = { addPoints, checkStreak };
