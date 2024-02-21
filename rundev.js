const { exec } = require('child_process');

// Build client
exec('cd client && npm install && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Client build error: ${error}`);
    return;
  }
  console.log(`Client build stdout: ${stdout}`);
  console.error(`Client build stderr: ${stderr}`);

  // Start server with nodemon
  const serverProcess = exec('cd server && npm install && nodemon server.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Server process error: ${error}`);
      return;
    }
    console.log(`Server process stdout: ${stdout}`);
    console.error(`Server process stderr: ${stderr}`);
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  // Open a new terminal tab or window to run the client
  exec('cd client && npm start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Client process error: ${error}`);
      return;
    }
    console.log(`Client process stdout: ${stdout}`);
    console.error(`Client process stderr: ${stderr}`);
  });
  

  // Handle Ctrl+C to kill both processes
  process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit();
  });
});
