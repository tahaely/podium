const axios = require('axios');
const db = require('../src/config/db');

const API_URL = 'http://localhost:5001/api';
let adminToken;
let memberToken;
let teamId;
let memberId;
let taskId;

const runTest = async () => {
    try {
        console.log('🚀 Starting Verification Test...');

        // 1. Setup: Create Team and Users directly in DB to ensure clean state
        console.log('1. Setting up test data...');
        const [teamResult] = await db.query("INSERT INTO teams (name) VALUES ('Test Team')");
        teamId = teamResult.insertId;

        // Create Admin
        await db.query("INSERT INTO users (email, password_hash, role) VALUES ('admin@test.com', 'hash', 'admin') ON DUPLICATE KEY UPDATE id=id");
        const [adminUser] = await db.query("SELECT id FROM users WHERE email = 'admin@test.com'");

        // Create Member User
        await db.query("INSERT INTO users (email, password_hash, role) VALUES ('member@test.com', 'hash', 'member') ON DUPLICATE KEY UPDATE id=id");
        const [memberUser] = await db.query("SELECT id FROM users WHERE email = 'member@test.com'");

        // Create Member Profile
        await db.query("INSERT INTO members (team_id, user_id, name) VALUES (?, ?, 'Test Member') ON DUPLICATE KEY UPDATE id=id", [teamId, memberUser[0].id]);
        const [memberProfile] = await db.query("SELECT id FROM members WHERE user_id = ?", [memberUser[0].id]);
        memberId = memberProfile[0].id;

        // Mock Login (Get Tokens) - In a real test we would hit the login endpoint, 
        // but here we can just generate tokens if we had the secret. 
        // Since we don't want to depend on the secret here, let's actually hit the register/login endpoint if the server is running.
        // Assuming server is running on port 5000 as per metadata.

        // Actually, let's just use the service logic directly to avoid HTTP overhead if possible, 
        // BUT the fix is in the API layer (controller), so we MUST use HTTP to test the controller logic.

        // Let's assume the server is running. If not, this test will fail.
        // We need to register/login via API.

        // Register/Login Admin
        try {
            const adminEmail = `admin_${Date.now()}@test.com`;
            await axios.post(`${API_URL}/auth/register`, { email: adminEmail, password: 'password123', role: 'admin' });
            // Register doesn't return token, so we must login
            const res = await axios.post(`${API_URL}/auth/login`, { email: adminEmail, password: 'password123' });
            adminToken = res.data.token;
        } catch (e) {
            console.log('Admin registration failed, trying login...');
            // Try logging in with the known admin email if registration failed (assuming it failed because it exists)
            // But wait, I generated a unique email. If it failed, it might be something else.
            // Let's try to login with the hardcoded admin created in step 1.
            try {
                const res = await axios.post(`${API_URL}/auth/login`, { email: 'admin@test.com', password: 'password123' });
                adminToken = res.data.token;
            } catch (loginError) {
                // Ah, the DB insert used 'hash' as password_hash. The authService.login compares password.
                // We need to insert a real hashed password or use the register flow with a unique email which I did.
                // Why did unique email register fail?
                // Maybe the server is not running? No, it returned 401 later.
                // Let's print the error detail.
                console.error('Registration error details:', e.response ? e.response.data : e.message);

                // If we can't register, we can't easily login because we don't know the hash for 'password123'.
                // Let's try to just use the unique email again, maybe I messed up the unique string?
                // `admin_${Date.now()}@test.com` should be unique.

                // Let's just exit if register fails, to see the error.
                process.exit(1);
            }
        }

        // Register/Login Member
        const memberEmail = `member_${Date.now()}@test.com`;
        try {
            const resMemberReg = await axios.post(`${API_URL}/auth/register`, { email: memberEmail, password: 'password123', role: 'member' });
            const memberUserId = resMemberReg.data.id;

            const resMemberLogin = await axios.post(`${API_URL}/auth/login`, { email: memberEmail, password: 'password123' });
            memberToken = resMemberLogin.data.token;
            // Create Member Profile for this new user
            await db.query("INSERT INTO members (team_id, user_id, name) VALUES (?, ?, 'Test Member API')", [teamId, memberUserId]);
        } catch (e) {
            console.log('Member registration failed, trying login...');
            const res = await axios.post(`${API_URL}/auth/login`, { email: 'member@test.com', password: 'password123' });
            memberToken = res.data.token;
        }


        // 2. Create Task (as Admin)
        console.log('2. Creating Task...');
        const taskRes = await axios.post(`${API_URL}/tasks`, {
            team_id: teamId,
            title: 'Test Task',
            description: 'Test Description',
            points: 100,
            difficulty: 'medium',
            priority: 'medium'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        taskId = taskRes.data.id;
        console.log('✅ Task Created:', taskId);

        // 3. Start Task (as Member) - This should trigger the assignment fix
        console.log('3. Starting Task (Member)...');
        await axios.put(`${API_URL}/tasks/${taskId}`, { status: 'doing' }, { headers: { Authorization: `Bearer ${memberToken}` } });

        // Verify assignment
        const [taskCheck] = await db.query("SELECT member_id, status FROM tasks WHERE id = ?", [taskId]);
        if (taskCheck[0].member_id) {
            console.log('✅ Task successfully assigned to member:', taskCheck[0].member_id);
        } else {
            console.error('❌ Task was NOT assigned to member!');
            process.exit(1);
        }

        // 4. Complete Task (as Member)
        console.log('4. Completing Task...');
        await axios.put(`${API_URL}/tasks/${taskId}`, { status: 'done' }, { headers: { Authorization: `Bearer ${memberToken}` } });

        // 5. Validate Task (as Admin)
        console.log('5. Validating Task...');
        await axios.put(`${API_URL}/tasks/${taskId}/validate`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Task Validated Successfully');

        // 6. Test Unassigned Task Validation (Regression Test for Crash)
        console.log('6. Testing Unassigned Task Validation...');
        const task2Res = await axios.post(`${API_URL}/tasks`, {
            team_id: teamId,
            title: 'Team Task',
            description: 'No one assigned',
            points: 50
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const task2Id = task2Res.data.id;

        // Move to done directly (simulating manual update or team task)
        await db.query("UPDATE tasks SET status = 'done' WHERE id = ?", [task2Id]);

        // Validate
        await axios.put(`${API_URL}/tasks/${task2Id}/validate`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Unassigned Task Validated Successfully (No Crash)');

        console.log('🎉 All Tests Passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTest();
