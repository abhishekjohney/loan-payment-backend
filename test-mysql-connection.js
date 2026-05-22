require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('🔌 Attempting to connect to MySQL...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Connected successfully to MySQL!');
    
    // Test database creation
    console.log('\n📊 Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'payment_collection_db'}\``);
    console.log('✅ Database ready');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.error('\n💡 Troubleshooting steps:');
    console.error('1. Ensure MySQL service is running:');
    console.error('   - On Windows: Services > MySQL80 > Start');
    console.error('   - On Mac: brew services start mysql');
    console.error('   - On Linux: sudo systemctl start mysql');
    console.error('\n2. Verify credentials in .env file');
    console.error('\n3. Check if MySQL port 3306 is accessible');
  }
})();
