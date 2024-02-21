const mysql = require('mysql2/promise');
const { dbHost, dbUser, dbPassword, dbDatabase } = require('./config');

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();  
    console.log('Connected to MySQL database');

    //drop table 
    // Drop existing tables if they exist
    // const tbl_user_tenent_table_Query = `
    //   DROP TABLE IF EXISTS tbl_user_tenent;
    // `;  
    


    // const tbl_user_info_table_Query = `
    //   DROP TABLE IF EXISTS tbl_user_info;
    // `;

    // const drop_table_location_data_query = `
    //   DROP TABLE IF EXISTS tbl_location_data;
    // `;
    // await connection.query(tbl_user_tenent_table_Query);
    // await connection.query(tbl_user_info_table_Query);
    // await connection.query(drop_table_location_data_query);
    // await connection.query(dropDevicesTableQuery);

    // console.log('Dropped existing tables successfully');

    // Create users table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tbl_user_tenent (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255),
        tenant_id INT UNIQUE,
        password VARCHAR(255)
      );
    `;

    const [result] = await connection.query(createTableQuery);
    console.log('CREATE TABLE query result:', result);
// tbl_idcard_location  

    // Create tbl_user_info table if not exists
    const createUserInfoTableQuery = `
    CREATE TABLE IF NOT EXISTS tbl_user_info (
      user_id INT,
      name VARCHAR(255),
      email_id VARCHAR(255),
      mob VARCHAR(255),
      address VARCHAR(255),
      date_of_purchase VARCHAR(255),
      invoice_number VARCHAR(255),
      imei VARCHAR(255) UNIQUE,
      services_offered VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES tbl_user_tenent(user_id)
    );
    `;

    const [devicesTableResult] = await connection.query(createUserInfoTableQuery);
    console.log('CREATE TABLE user_info query result:', devicesTableResult);

    //  table if not exists
    const createLiveLocationsTableQuery = `
      CREATE TABLE IF NOT EXISTS tbl_location_data (
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       
        imei VARCHAR(255),
        latitude VARCHAR(255),
        longitude VARCHAR(255),
        speed INT,
        battery_percentage INT,
        FOREIGN KEY (user_id) REFERENCES tbl_user_tenent(user_id),
        FOREIGN KEY (imei) REFERENCES tbl_user_info(imei)
      );
    `;

    const [liveLocationsTableResult] = await connection.query(createLiveLocationsTableQuery);
    console.log('CREATE TABLE tbl_location_data query result:', liveLocationsTableResult);

    
     
    // Release the connection
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
  }
})();

module.exports = pool;
