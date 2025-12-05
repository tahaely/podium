const db = require('../src/config/db');

const fixSchema = async () => {
    try {
        console.log('Altering points_log table...');
        await db.query('ALTER TABLE points_log MODIFY member_id INT NULL');
        console.log('✅ Successfully altered points_log table to allow NULL member_id');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error altering table:', error);
        process.exit(1);
    }
};

fixSchema();
