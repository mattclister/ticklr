const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const web_token_key = 'abc123';

const db = new sqlite3.Database('./ticklerDB.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create User
async function createUser(req, res) {
  const { userEmail, timeZone, createPassword } = req.body;

  // Check if the email is already registered
  const checkEmailQuery = `SELECT user_id FROM users WHERE user_email = ?`;
  db.get(checkEmailQuery, [userEmail], async (err, row) => {
    if (err) {
      console.error('Error checking email:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (row) {
      // Email is already registered:
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Email is not registered:
    try {
      const passwordHash = await bcrypt.hash(createPassword, 10);
      const createUserQuery = `INSERT INTO users (user_email, user_password, user_timezone) VALUES (?, ?, ?)`;

      db.run(createUserQuery, [userEmail, passwordHash, timeZone], function (err) {
        if (err) {
          console.error('Error inserting user:', err.message);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Successfully created the user
        res.status(201).json({
          message: 'User created successfully',
        });
      });
    } catch (error) {
      console.error('Error hashing password:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// Login User
async function loginUser(req, res) {
  const { userEmail, loginPassword } = req.body;

  const getUserQuery = `SELECT user_id, user_password FROM users WHERE user_email = ?`;

  db.get(getUserQuery, [userEmail], async (err, user) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      // If no user found
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the hashed password stored in the database with the provided password
    const isPasswordMatch = await bcrypt.compare(loginPassword, user.user_password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '4h' });

    // Send the token back to the client
    res.status(200).json({ message: 'Login successful', token });
  });
}

module.exports = {
  createUser,
  loginUser
};
