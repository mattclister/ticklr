const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bcrypt = require('bcrypt');
const {createUser, loginUser, validateToken, getReminders, addReminder, updateSettings} = require('./queries')
const cron = require('node-cron');
const {sendEmails} = require('./scheduled_functions')


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