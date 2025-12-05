const axios = require('axios');
const db = require('../src/config/db');

const API_URL = 'http://localhost:5001/api';
let adminToken;
let teamId;

const runTest = async () => {
    try {
        console.log('🚀 Starting Team Deletion Test...');

        // 1. Setup: Create Admin
        const adminEmail = `admin_del_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: adminEmail, password: 'password123', role: 'admin' });
        const res = await axios.post(`${API_URL}/auth/login`, { email: adminEmail, password: 'password123' });
        adminToken = res.data.token;

        // 2. Create Team
        console.log('2. Creating Team...');
        const teamRes = await axios.post(`${API_URL}/teams`, {
            name: 'Team To Delete',
            color: '#ff0000'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        teamId = teamRes.data.id;
        console.log('✅ Team Created:', teamId);

        // 3. Add dependencies (Member, Task, Points) to test constraints
        console.log('3. Adding dependencies...');

        // Add Member
        const memberEmail = `member_del_${Date.now()}@test.com`;
        const resMemberReg = await axios.post(`${API_URL}/auth/register`, { email: memberEmail, password: 'password123', role: 'member' });
        const memberUserId = resMemberReg.data.id;
        await db.query("INSERT INTO members (team_id, user_id, name) VALUES (?, ?, 'Member To Delete')", [teamId, memberUserId]);
        const [memberProfile] = await db.query("SELECT id FROM members WHERE user_id = ?", [memberUserId]);
        const memberId = memberProfile[0].id;

        // Add Task
        const taskRes = await axios.post(`${API_URL}/tasks`, {
            team_id: teamId,
            title: 'Task To Delete',
            description: 'Desc',
            points: 10,
            difficulty: 'easy',
            priority: 'low'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const taskId = taskRes.data.id;

        // Add Points Log
        await db.query("INSERT INTO points_log (team_id, member_id, task_id, points_added, reason) VALUES (?, ?, ?, 10, 'Test')", [teamId, memberId, taskId]);

        // 4. Delete Team
        console.log('4. Deleting Team...');
        await axios.delete(`${API_URL}/teams/${teamId}`, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Team Deleted Successfully');

        // 5. Verify Deletion
        const [teamCheck] = await db.query("SELECT * FROM teams WHERE id = ?", [teamId]);
        if (teamCheck.length === 0) {
            console.log('✅ Team verified as deleted in DB');
        } else {
            console.error('❌ Team still exists in DB!');
            process.exit(1);
        }

        console.log('🎉 Test Passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTest();
