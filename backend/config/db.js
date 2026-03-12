// config/db.js
// ============================================================
// MySQL Database Connection Pool
// Uses mysql2/promise for async/await support
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Creates a MySQL connection pool.
 * Pooling reuses connections and avoids per-request overhead.
 */
const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            parseInt(process.env.DB_PORT) || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || 'Aditya@123',
  database:        process.env.DB_NAME     || 'task_manager_db',
  waitForConnections: true,
  connectionLimit: 10,      // Max simultaneous connections
  queueLimit:      0,       // Unlimited queued requests
  charset:         'utf8mb4',
  timezone:        '+00:00', // Store/retrieve in UTC
});

/**
 * Tests the database connection on startup.
 * Logs success or exits the process on failure.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅  MySQL connected → ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    connection.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    process.exit(1); // Fatal – cannot run without a database
  }
};

module.exports = { pool, testConnection };
