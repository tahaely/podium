const db = require('../config/db');

const createTeam = async (name, color) => {
    const [result] = await db.query(
        'INSERT INTO teams (name, color) VALUES (?, ?)',
        [name, color]
    );
    return { id: result.insertId, name, color };
};

const getAllTeams = async () => {
    const [teams] = await db.query('SELECT * FROM teams');
    return teams;
};

const getTeamById = async (id) => {
    const [teams] = await db.query('SELECT * FROM teams WHERE id = ?', [id]);
    if (teams.length === 0) return null;

    const team = teams[0];

    // Get members
    const [members] = await db.query('SELECT * FROM members WHERE team_id = ?', [id]);
    team.members = members;

    // Calculate total score (sum of points_log for this team)
    const [scoreResult] = await db.query('SELECT SUM(points_added) as total_score FROM points_log WHERE team_id = ?', [id]);
    team.score = scoreResult[0].total_score || 0;

    return team;
};

const updateTeam = async (id, name, color) => {
    await db.query('UPDATE teams SET name = ?, color = ? WHERE id = ?', [name, color, id]);
    return { id, name, color };
};

const deleteTeam = async (id) => {
    await db.query('DELETE FROM teams WHERE id = ?', [id]);
};

module.exports = { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam };
