const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'payment_collection_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection
pool.getConnection()
  .then((conn) => {
    console.log('✅ Connected to MySQL database');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MySQL database:', err.message);
  });

/**
 * Execute an SQL query against the MySQL pool.
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Array of parameters to bind
 * @returns {Promise<any>} Query results (rows for SELECT, metadata for modifications)
 */
const query = async (sql, params) => {
  const start = Date.now();
  const [results] = await pool.execute(sql, params);
  const duration = Date.now() - start;
  console.log('📊 Query executed:', { sql: sql.substring(0, 80), duration: `${duration}ms`, rows: Array.isArray(results) ? results.length : undefined });
  return results;
};

module.exports = {
  query,
  pool,
};
