const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bcrypt = require('bcrypt');
const {createUser, loginUser, validateToken, getReminders, addReminder, updateSettings} = require('./queries')
const cron = require('node-cron');
const {sendEmails} = require('./scheduled_functions')
const readline = require('readline');


// Command Console Connection
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.on('line', (input) => {
    if (input.trim() === 'send-emails') {
      console.log('Manual email trigger received via CLI.');
      sendEmails();
    } else {
      console.log(`Unknown command: ${input}`);
    }
  });

// Tell express to parse json when request header says body is json
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// -- Requests --

// Create User
app.post('/users', createUser)

// Login User
app.post('/login', loginUser);

// Authenticate User
app.post('/authenticate', validateToken);

// Get reminders
app.get("/reminders", getReminders);

// Add reminder
app.post("/reminders", addReminder);

// Update settings
app.post("/settings", updateSettings);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Scheduled Operations

cron.schedule('0 * * * *', () => {
    console.log('Preparing emails...');
    sendEmails();
  });
