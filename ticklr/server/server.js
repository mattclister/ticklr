const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle any other requests and send them to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', '/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});