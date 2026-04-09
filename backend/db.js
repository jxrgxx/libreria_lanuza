const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'biblioteca_juandelanuza',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar al Pool de MariaDB:', err.message);
    return;
  }
  console.log('✅ Pool de MariaDB conectado como: ' + process.env.DB_USER);
  connection.release();
});

module.exports = pool;
