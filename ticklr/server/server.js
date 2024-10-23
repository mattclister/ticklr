const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bcrypt = require('bcrypt');
const {createUser, loginUser, validateToken} = require('./queries')

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


// Handles other requests and send them to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', '/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});