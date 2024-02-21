// check_table_structure.js
const mysql = require('mysql2/promise');
const { dbHost, dbUser, dbPassword, dbDatabase } = require('./config'); // Adjust the path if needed

async function checkTableStructure() {
  const connection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
  });

  try {
    const [rows, fields] = await connection.execute('DESCRIBE users');
    console.log('Table Structure:', rows);
  } catch (error) {
    console.error('Error checking table structure:', error);
  } finally {
    connection.end();
  }
}

// Run the function to check the table structure
checkTableStructure();
