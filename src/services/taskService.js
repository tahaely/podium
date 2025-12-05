const db = require('../config/db');
const scoringService = require('./scoringService');
const { broadcast } = require('../config/socket');

const createTask = async (data) => {
    const { team_id, member_id, title, description, points, difficulty, priority, deadline } = data;
    const [result] = await db.query(
        `INSERT INTO tasks (team_id, member_id, title, description, points, difficulty, priority, deadline) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [team_id, member_id, title, description, points, difficulty, priority, deadline]
    );
    return { id: result.insertId, ...data };
};

const updateTask = async (id, data) => {
    const fields = [];
    const values = [];

    // Handle member assignment if user_id is provided
    if (data.user_id) {
        // Find member_id for this user
        const [members] = await db.query('SELECT id FROM members WHERE user_id = ?', [data.user_id]);
        if (members.length > 0) {
            data.member_id = members[0].id;
        }
        delete data.user_id; // Remove from data to avoid column error
    }

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(id);

    if (fields.length > 0) {
        await db.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return { id, ...data };
};

const uploadProof = async (id, proofUrl) => {
    await db.query('UPDATE tasks SET proof_url = ?, status = ? WHERE id = ?', [proofUrl, 'done', id]);
    return { id, proof_url: proofUrl, status: 'done' };
};

const validateTask = async (id) => {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) throw new Error('Task not found');
    const task = tasks[0];

    if (task.status === 'validated') throw new Error('Task already validated');
    if (task.status !== 'done') throw new Error('Task must be in done status to validate');

    let pointsAwarded = task.points;
    let reason = `Task completion: ${task.title}`;

    // Bonus: +20% if finished before deadline
    if (task.deadline && new Date() < new Date(task.deadline)) {
        pointsAwarded += Math.round(task.points * 0.2);
        reason += ' (Early Bonus)';
    }

    // Update task status
    await db.query('UPDATE tasks SET status = ?, validated_at = NOW() WHERE id = ?', ['validated', id]);

    // Log points (only if member_id exists)
    if (task.member_id) {
        await scoringService.addPoints(task.team_id, task.member_id, id, pointsAwarded, reason);

        // Check streak
        const streakAwarded = await scoringService.checkStreak(task.member_id);

        // Broadcast update
        broadcast({ type: 'TASK_VALIDATED', taskId: id, teamId: task.team_id, points: pointsAwarded, streak: streakAwarded });

        return { id, status: 'validated', pointsAwarded, streakAwarded };
    } else {
        // No member assigned, just award points to team
        await scoringService.addPoints(task.team_id, null, id, pointsAwarded, reason);

        // Broadcast update
        broadcast({ type: 'TASK_VALIDATED', taskId: id, teamId: task.team_id, points: pointsAwarded });

        return { id, status: 'validated', pointsAwarded };
    }
};

const getTasks = async (filters) => {
    let query = `
        SELECT t.*, m.name as member_name, m.avatar_url as member_avatar, tm.name as team_name
        FROM tasks t
        LEFT JOIN members m ON t.member_id = m.id
        LEFT JOIN teams tm ON t.team_id = tm.id
    `;
    const params = [];
    const conditions = [];

    if (filters.team_id) {
        conditions.push('t.team_id = ?');
        params.push(filters.team_id);
    }
    if (filters.member_id) {
        conditions.push('t.member_id = ?');
        params.push(filters.member_id);
    }
    if (filters.status) {
        conditions.push('t.status = ?');
        params.push(filters.status);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    const [tasks] = await db.query(query, params);
    return tasks;
};

module.exports = { createTask, updateTask, uploadProof, validateTask, getTasks };
