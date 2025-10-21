const mysql = require('mysql2/promise')

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'parent_care_services',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

const pool = mysql.createPool(dbConfig)

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Connected to MySQL successfully')
    console.log('Using database:', dbConfig.database)
    
    // Create tables if they don't exist (using IF NOT EXISTS to avoid errors)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role ENUM('parent', 'daughter', 'vendor') NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        address TEXT NOT NULL,
        aadhar VARCHAR(14) NOT NULL,
        voter_id VARCHAR(50),
        pan VARCHAR(10),
        photo_path VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_phone (phone)
      )
    `)
    console.log('✓ Users table ready')

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS parents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        medical_conditions TEXT,
        emergency_contact VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✓ Parents table ready')

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS daughters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        parent_name VARCHAR(255) NOT NULL,
        relationship ENUM('daughter', 'son', 'daughter-in-law', 'son-in-law', 'other') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✓ Daughters table ready')

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        business_name VARCHAR(255),
        services JSON,
        service_description TEXT,
        gst_number VARCHAR(15),
        identity_doc_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✓ Vendors table ready')

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS parent_daughter_relationships (
        id INT PRIMARY KEY AUTO_INCREMENT,
        parent_id INT NOT NULL,
        daughter_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (daughter_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_relationship (parent_id, daughter_id)
      )
    `)
    console.log('✓ Parent-Daughter relationships table ready')

    // =====================================================
    // NEW: Vendor Registrations Table (for new-vendor page)
    // =====================================================
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vendor_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(10) NOT NULL,
        email VARCHAR(255) NULL,
        service_description TEXT NOT NULL,
        status ENUM('pending', 'contacted', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_contact_number (contact_number),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✓ Vendor Registrations table ready')
    // =====================================================

    connection.release()
    console.log('✅ Database tables initialized successfully')
    
  } catch (error) {
    console.error('❌ Database initialization error:', error)
  }
}

// Migration to add email and password columns (for existing databases)
const migrateAddEmailPassword = async () => {
  try {
    const connection = await pool.getConnection()
    
    // Check if email column exists
    const [emailCheck] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'email'
    `)
    
    if (emailCheck.length === 0) {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN email VARCHAR(255) UNIQUE AFTER phone,
        ADD INDEX idx_email (email)
      `)
      console.log('✅ Added email column to users table')
    } else {
      console.log('✓ Email column already exists')
    }
    
    // Check if password column exists
    const [passwordCheck] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'password'
    `)
    
    if (passwordCheck.length === 0) {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN password VARCHAR(255) AFTER email
      `)
      console.log('✅ Added password column to users table')
    } else {
      console.log('✓ Password column already exists')
    }
    
    connection.release()
    console.log('✅ Migration completed successfully')
  } catch (error) {
    console.error('❌ Migration error:', error)
  }
}

// Migration to add identity_doc_path to vendors table
const migrateAddVendorIdentityDoc = async () => {
  try {
    const connection = await pool.getConnection()
    
    // Check if identity_doc_path column exists in vendors table
    const [identityDocCheck] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'vendors' 
      AND COLUMN_NAME = 'identity_doc_path'
    `)
    
    if (identityDocCheck.length === 0) {
      await connection.execute(`
        ALTER TABLE vendors 
        ADD COLUMN identity_doc_path VARCHAR(255) AFTER gst_number
      `)
      console.log('✅ Added identity_doc_path column to vendors table')
    } else {
      console.log('✓ Identity document path column already exists in vendors table')
    }
    
    connection.release()
    console.log('✅ Vendor details migration completed successfully')
  } catch (error) {
    console.error('❌ Vendor migration error:', error)
  }
}

// Initialize database and run migrations
const init = async () => {
  await initializeDatabase()
  await migrateAddEmailPassword()
  await migrateAddVendorIdentityDoc()
}

init()

module.exports = { pool }