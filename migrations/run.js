/**
 * MySQL Database Migration Runner
 * Dynamically creates the target database if it doesn't exist,
 * then runs the SQL migration file using multipleStatements mode.
 * 
 * Usage: npm run migrate
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const runMigration = async () => {
  const dbName = process.env.DB_NAME || 'payment_collection_db';
  const configWithoutDb = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  let rootConn;
  let clientConn;

  try {
    const sqlPath = path.join(__dirname, '001_init.sql');
    const rawSql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('🔗 Connecting to MySQL server to verify database status...');
    rootConn = await mysql.createConnection(configWithoutDb);

    console.log(`🛠️ Creating database "${dbName}" if it does not exist...`);
    await rootConn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await rootConn.end();
    rootConn = null;

    console.log(`🚀 Connecting to database "${dbName}"...`);
    const configWithDb = { ...configWithoutDb, database: dbName, multipleStatements: true };
    clientConn = await mysql.createConnection(configWithDb);

    console.log('🧱 Running database migrations...');
    await clientConn.query(rawSql);

    console.log('\n✅ MySQL Migration completed successfully!');
    console.log('📊 Tables created: customers, payments');
    console.log('🌱 Seed data inserted: 8 customers, 7 payments\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('💡 Please verify that MySQL is running and your .env credentials are correct.');
    process.exit(1);
  } finally {
    if (rootConn) await rootConn.end();
    if (clientConn) await clientConn.end();
  }
};

runMigration();
