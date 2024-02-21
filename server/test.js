const express = require('express');
const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Set the IP address and port to listen on
const ip = '193.203.184.7';  // Replace with your desired IP address
const port = 3000;          // Choose a port number

// Start the server
app.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});
