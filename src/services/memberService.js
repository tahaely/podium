const db = require('../config/db');

const addMember = async (teamId, userId, name, role, avatarUrl) => {
    const [result] = await db.query(
        'INSERT INTO members (team_id, user_id, name, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [teamId, userId, name, role, avatarUrl]
    );
    return { id: result.insertId, teamId, userId, name, role, avatarUrl };
};

const removeMember = async (id) => {
    await db.query('DELETE FROM members WHERE id = ?', [id]);
};

const updateMember = async (id, name, role, avatarUrl) => {
    await db.query(
        'UPDATE members SET name = ?, role = ?, avatar_url = ? WHERE id = ?',
        [name, role, avatarUrl, id]
    );
    return { id, name, role, avatarUrl };
};

const getAllMembers = async (teamId) => {
    let query = 'SELECT * FROM members';
    let params = [];

    if (teamId) {
        query += ' WHERE team_id = ?';
        params.push(teamId);
    }

    const [members] = await db.query(query, params);
    return members;
};

const getMemberById = async (id) => {
    const [members] = await db.query('SELECT * FROM members WHERE id = ?', [id]);
    return members[0];
};

module.exports = { addMember, removeMember, updateMember, getAllMembers, getMemberById };
