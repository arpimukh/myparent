const pool = require('../config/database');

async function migrate() {
  try {
    // Check if columns exist first
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('email', 'password')
    `);

    const hasEmail = columns.some(col => col.COLUMN_NAME === 'email');
    const hasPassword = columns.some(col => col.COLUMN_NAME === 'password');

    if (!hasEmail) {
      await pool.execute(`
        ALTER TABLE users 
        ADD COLUMN email VARCHAR(255) UNIQUE AFTER phone
      `);
      console.log('Added email column');
    }

    if (!hasPassword) {
      await pool.execute(`
        ALTER TABLE users 
        ADD COLUMN password VARCHAR(255) AFTER email
      `);
      console.log('Added password column');
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();