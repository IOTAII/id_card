require('dotenv').config();
// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt');
const db = require('./db');
const { saltRounds } = require('./config');
const cors = require('cors');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); 

// Middleware
app.use(bodyParser.json());
app.use(cors());

const port = 8080;
const ipAddress = 'localhost';

// Socket Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  
  // Handle live location updates
  socket.on('updateLocation', async (data) => {
    const { user_id, device_id,latitude, longitude } = data;
  
    try {
      // Get user id based on tenant_id
      const [userResults] = await db.execute('SELECT id FROM tbl_user_tenent WHERE user_id = ?', [user_id]);

      const user = userResults[0];

      if (!user) {
        return io.to(socket.id).emit('error', 'User not found');
      }

      // Store live location in the database
      await db.execute('INSERT INTO tbl_location_data (user_id, device_id, latitude, longitude) VALUES (?, ?, ?, ?)', [
        user_id,
        device_id,
        latitude,
        longitude,
      ]);

      // Broadcast the updated location to all connected clients
      io.emit('locationUpdate', { user_id: user_id, device_id, latitude, longitude });

      // Emit a specific event for the stored location
      io.emit('deviceLocationStored', { user_id: user_id, device_id, latitude, longitude });
    } catch (error) {
      console.error(error.message);
      io.to(socket.id).emit('error', 'Internal Server Error');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

  

// Login endpoint
// Login endpoint
app.post('/login', async (req, res) => {
  console.log('Received login request:', req.body);
  const { user_id, password } = req.body;
  try {
    const [results] = await db.execute('SELECT * FROM tbl_user_tenent WHERE user_id = ?', [user_id]);
    const user = results[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is defined
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
  
    // Compare the passwords directly
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check the role
    if (user.role === 1) {
      // Admin login
      return res.json({ message: 'Admin login successful', role: 'admin' });
    } else {
      // User login (including users with no specified role)
      return res.json({ message: 'User login successful', role: 'user' });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Registration endpoint
app.post('/register', async (req, res) => {
  const { user_id, user_name, tenant_id, password, role } = req.body;

  // Log the SQL query
  console.log('SQL Query:', 'INSERT INTO tbl_user_tenent (user_id,user_name,tenant_id, password, role) VALUES (?, ?, ?, ?, ?)', [
    user_id,
    user_name,
    tenant_id,
    password,
    role,
  ]);

  try {
    // Log the database connection status
    console.log('Database Connection State:', db.pool._ended ? 'closed' : 'open');

    // Execute the query to insert data into the database  
    const [result] = await db.execute('INSERT INTO tbl_user_tenent (user_id, user_name, tenant_id, password, role) VALUES (?, ?, ?, ?, ?)', [
      user_id,
      user_name,
      tenant_id,
      password,
      role,
    ]);

    // Log the result of the query execution
    console.log('Query Result:', result);

    res.json({ message: 'Tenant registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/users', async (req, res) => {
    try {
      const [results] = await db.execute('SELECT * FROM tbl_user_tenent');
      res.json(results);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//device registration endpoint

app.post('/register-device', async (req, res) => {
    const { user_id,name,email_id,mob,address,date_of_purchase,invoice_number, device_id, services_offered } = req.body;
  
    // Validate input data
    if (!user_id || !name || !email_id || !mob || !address || !date_of_purchase || !invoice_number || !device_id || !services_offered) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    // Validate tenant_id, device_id, and device_name format
    // Add more specific validation based on your requirements
  
    try {
      // Get user id based on tenant_id
      const [userResults] = await db.execute('SELECT user_id FROM tbl_user_tenent WHERE user_id = ?', [user_id]);
  
      const user = userResults[0];
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      // Insert device information into the devices table
      const [deviceResult] = await db.execute('INSERT INTO tbl_user_info (user_id, name, email_id,mob,address,date_of_purchase,invoice_number, device_id, services_offered) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)', [
        user_id, name, email_id,mob,address,date_of_purchase,invoice_number, device_id, services_offered
      ]); 
  
      console.log('Device registration result:', deviceResult);
  
      res.json({ message: 'Device registered successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//retrieving devices names

app.get('/devices/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    try {
      // Get user 3id based on tenant_id
      const [userResults] = await db.execute('SELECT user_id FROM tbl_user_tenent WHERE user_id = ?', [user_id]);
  
      const user = userResults[0];
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Retrieve devices associated with the user
      const [devicesResults] = await db.execute('SELECT * FROM tbl_user_info WHERE user_id = ?', [user_id]);
  
      res.json(devicesResults);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//updating user info endpoint

app.put('/update-user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { name, email_id, mob, address, date_of_purchase, invoice_number, device_id, services_offered } = req.body;

  try {
    // Construct the SQL update query dynamically based on provided parameters
    let updateQuery = 'UPDATE tbl_user_info SET ';
    const queryParams = [];
    if (name) {
      updateQuery += 'name=?, ';
      queryParams.push(name);
    }
    if (email_id) {
      updateQuery += 'email_id=?, ';
      queryParams.push(email_id);
    }
    if (mob) {
      updateQuery += 'mob=?, ';
      queryParams.push(mob);
    }
    if (address) {
      updateQuery += 'address=?, ';
      queryParams.push(address);
    }
    if (date_of_purchase) {
      updateQuery += 'date_of_purchase=?, ';
      queryParams.push(date_of_purchase);
    }
    if (invoice_number) {
      updateQuery += 'invoice_number=?, ';
      queryParams.push(invoice_number);
    }
    if (device_id) {
      updateQuery += 'device_id=?, ';
      queryParams.push(device_id);
    }
    if (services_offered) {
      updateQuery += 'services_offered=?, ';
      queryParams.push(services_offered);
    }
    // Remove the last comma and space
    updateQuery = updateQuery.slice(0, -2);

    // Add the WHERE clause
    updateQuery += ' WHERE user_id=?';
    queryParams.push(user_id);

    // Execute the dynamic update query
    const [result] = await db.execute(updateQuery, queryParams);

    console.log('Update user result:', result);

    res.json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//deleting user info endpoint
// Deleting user info endpoint
app.delete('/delete-user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { device_id } = req.query; // Get device_id from query parameters if provided

  try {
    let deleteQuery;
    let queryParams;

    if (device_id) {
      // If device_id is provided, delete rows with the provided device_id
      deleteQuery = 'DELETE FROM tbl_user_info WHERE device_id=?';
      queryParams = [device_id];
    } else {
      // If device_id is not provided, delete all rows associated with the provided user_id
      deleteQuery = 'DELETE FROM tbl_user_info WHERE user_id=?';
      queryParams = [user_id];
    }

    // Execute the delete query
    const [result] = await db.execute(deleteQuery, queryParams);

    console.log('Delete user result:', result);

    res.json({ message: 'User information deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update tbl_user_tenant endpoint
app.put('/update-tenant/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { user_name, tenant_id, password } = req.body;

  try {
    // Construct the SQL update query dynamically based on provided parameters
    let updateQuery = 'UPDATE tbl_user_tenent SET ';
    const queryParams = [];

    // Check if at least one parameter is provided
    if (!user_name && !tenant_id && !password) {
      return res.status(400).json({ error: 'At least one parameter (user_name, tenant_id, password) must be provided' });
    }

    // Add parameters to update query and queryParams array if provided
    if (user_name) {
      updateQuery += 'user_name=?, ';
      queryParams.push(user_name);
    }
    if (tenant_id) {
      updateQuery += 'tenant_id=?, ';
      queryParams.push(tenant_id);
    }
    if (password) {
      updateQuery += 'password=?, ';
      queryParams.push(password);
    }

    // Remove the last comma and space
    updateQuery = updateQuery.slice(0, -2);

    // Add the WHERE clause
    updateQuery += ' WHERE user_id=?';
    queryParams.push(user_id);

    // Execute the dynamic update query
    const [result] = await db.execute(updateQuery, queryParams);

    console.log('Update tenant result:', result);

    res.json({ message: 'Tenant information updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//delete tbl_user_tenent endpoint

app.delete('/delete-tenant/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Delete tenant information from the tbl_user_tenent table
    const [result] = await db.execute('DELETE FROM tbl_user_tenent WHERE user_id=?', [user_id]);

    console.log('Delete tenant result:', result);

    res.json({ message: 'Tenant information deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Store Device Location Endpoint
app.post('/store-location', async (req, res) => {
  const {device_id, latitude, longitude,speed, battery_percentage } = req.body;

  try {
    // Store live location in the database
    await db.execute('INSERT INTO tbl_location_data (device_id, latitude, longitude, speed, battery_percentage ) VALUES (?, ?, ?, ?, ?)', [
      device_id, latitude, longitude, speed, battery_percentage
    ]);

    // Broadcast the updated location to all connected clients
    io.emit('locationUpdate', {  device_id, latitude, longitude, speed, battery_percentage });

    res.json({ message: 'Location stored successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch Device Locations Endpoint
// Fetch Device Locations Endpoint 
// app.get('/fetch-locations/:user_id/:device_id', async (req, res) => {
//   const { user_id, device_id } = req.params;

//   try {
//     // Get user id based on tenant_id
    
//     const [userResults] = await db.execute('SELECT user_id FROM tbl_user_tenent WHERE user_id = ?', [user_id]);

//     const user = userResults[0];

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Retrieve live locations associated with the user and device
//     const [locationsResults] = await db.execute(
//       'SELECT * FROM tbl_location_data WHERE user_id = ? AND device_id = ?',
//       [user_id, device_id]
//     );

//     res.json(locationsResults);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/fetch-locations/:user_id/:device_id', async (req, res) => {
  const { user_id, device_id } = req.params;

  try {
    // Retrieve live locations associated with the device
    const [locationsResults] = await db.execute(
      'SELECT SUBSTRING_INDEX(latitude, "N", 1) AS latitude_numeric, SUBSTRING_INDEX(longitude, "E", 1) AS longitude_numeric FROM tbl_location_data WHERE device_id = ?',
      [device_id]
    );

    // Convert latitude and longitude to numeric format
    const locations = locationsResults.map(location => ({
      latitude: parseFloat(location.latitude_numeric),
      longitude: parseFloat(location.longitude_numeric)
    }));

    res.json(locations);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch Live Locations of All Devices for a Tenant
app.get('/live-locations/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Get user id based on tenant_id
    const [userResults] = await db.execute('SELECT user_id FROM tbl_user_tenant WHERE user_id = ?', [user_id]);

    const user = userResults[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve live locations associated with the user
    const [liveLocationsResults] = await db.execute(
      'SELECT device_id, latitude, longitude,speed, battery_percentage FROM tbl_location_data WHERE user_id = ?',
      [user_id]
    );

    // Group locations by device ID
    const deviceLocations = {};
    liveLocationsResults.forEach((location) => {
      const { device_id, latitude, longitude } = location;
      if (!deviceLocations[device_id]) {
        deviceLocations[device_id] = [];
      }
      deviceLocations[device_id].push({ latitude, longitude });
    });

    res.json(deviceLocations);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// // Fetch Device Location History Endpoint
// app.get('/fetch-location-history/:user_id/:device_id', async (req, res) => {
//   const { user_id, device_id } = req.params;
//   const { filter } = req.query;

//   console.log('Received request with parameters:', { user_id, device_id, filter });

//   try {
//     // Get user id based on tenant_id
//     const [userResults] = await db.execute('SELECT user_id FROM tbl_user_tenent WHERE user_id = ?', [user_id]);

//     const user = userResults[0];

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     let startTime;
//     switch (filter) {
//       case '24hours':
//         startTime = moment().subtract(24, 'hours').toDate();
//         break;
//       case '48hours':
//         startTime = moment().subtract(48, 'hours').toDate();
//         break;
//       case '6months':
//         startTime = moment().subtract(6, 'months').toDate();
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid filter value' });
//     }

//     // Retrieve live locations associated with the user, device, and within the specified time range
//     const [historyResults] = await db.execute(
//       'SELECT * FROM tbl_location_data WHERE user_id = ? AND device_id = ? AND time_stamp >= ?',
//       [user_id, device_id, startTime]
//     );

//     res.json({
//       history: historyResults,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Fetch Device Location History Endpoint
// app.get('/fetch-location-history/:user_id/:device_id', async (req, res) => {
//   const { device_id } = req.params;
//   const { filter } = req.query;

//   console.log('Received request with parameters:', { device_id, filter });

//   try {
//     let startTime;
//     switch (filter) {
//       case '24hours':
//         startTime = moment().subtract(24, 'hours').toDate();
//         break;
//       case '48hours':
//         startTime = moment().subtract(48, 'hours').toDate();
//         break;
//       case '6months':
//         startTime = moment().subtract(6, 'months').toDate();
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid filter value' });
//     }

//     // Retrieve live locations associated with the device and within the specified time range
//     const [historyResults] = await db.execute(
//       'SELECT * FROM tbl_location_data WHERE device_id = ? AND time_stamp >= ?',
//       [device_id, startTime]
//     );

//     res.json({
//       history: historyResults,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.get('/fetch-location-history/:user_id/:device_id', async (req, res) => {
  const { device_id } = req.params;
  const { filter } = req.query;

  console.log('Received request with parameters:', { device_id, filter });

  try {
    let startTime;
    switch (filter) {
      case '24hours':
        startTime = moment().subtract(24, 'hours').toDate();
        break;
      case '48hours':
        startTime = moment().subtract(48, 'hours').toDate();
        break;
      case '6months':
        startTime = moment().subtract(6, 'months').toDate();
        break;
      default:
        return res.status(400).json({ error: 'Invalid filter value' });
    }

    // Retrieve live locations associated with the device and within the specified time range
    const [historyResults] = await db.execute(
      'SELECT CAST(SUBSTRING_INDEX(latitude, "N", 1) AS DECIMAL(10,6)) AS latitude, ' +
      'CAST(SUBSTRING_INDEX(longitude, "E", 1) AS DECIMAL(10,6)) AS longitude ' +
      'FROM tbl_location_data WHERE device_id = ? AND time_stamp >= ?',
      [device_id, startTime]
    );

    res.json({
      history: historyResults,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve Device Information Endpoint
app.get('/device-info/:user_id/:device_id', async (req, res) => {
  const { user_id, device_id } = req.params;

  try {
    // Retrieve device information and battery percentage based on user_id and device_id
    const [deviceInfoResults] = await db.execute(
      'SELECT ui.*, ld.battery_percentage ' +
      'FROM tbl_user_info ui ' +
      'JOIN tbl_location_data ld ON ui.device_id = ld.device_id ' +
      'WHERE ui.user_id = ? AND ui.device_id = ?',
      [user_id, device_id]
    );

    // Check if device information exists
    if (deviceInfoResults.length === 0) {
      return res.status(404).json({ error: 'Device information not found' });
    }

    res.json(deviceInfoResults[0]); // Assuming there's only one device with the given user_id and device_id
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//another device-info
app.get('/another-device-info/:user_id/:device_id', async (req, res) => {
  const { user_id, device_id } = req.params;

  try {
    // Retrieve device information and battery percentage based on user_id and device_id
    const [deviceInfoResults] = await db.execute(
      'SELECT ui.*, ld.battery_percentage ' +
      'FROM tbl_user_info ui ' +
      'JOIN tbl_location_data ld ON ui.device_id = ld.device_id ' +
      'WHERE ui.user_id = ? AND ui.device_id = ?',
      [user_id, device_id]
    );

    // Check if device information exists
    if (deviceInfoResults.length === 0) {
      return res.status(404).json({ error: 'Device information not found' });
    }

    res.json(deviceInfoResults[0]); // Assuming there's only one device with the given user_id and device_id
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/search-users', async (req, res) => {
  const { user_name, tenant_id, user_id } = req.query;
  let query = 'SELECT * FROM tbl_user_tenent WHERE 1';

  // Construct the WHERE clause based on the provided parameters
  const queryParams = [];
  if (user_name) {
    query += ' AND user_name LIKE ?';
    queryParams.push(user_name);
  }
  if (tenant_id) {
    query += ' AND tenant_id LIKE ?';
    queryParams.push(tenant_id);
  }
  if (user_id) {
    query += ' AND user_id = ?';
    queryParams.push(user_id);
  }

  try {
    // Execute the SQL query
    const [searchResults] = await db.execute(query, queryParams);

    // Check if any users were found
    if (searchResults.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the search results
    res.json(searchResults);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// Start the server
app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});

