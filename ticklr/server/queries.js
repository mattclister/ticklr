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
  console.log(createPassword)

  // Check if the email is already registered
  const checkEmailQuery = `SELECT pk_user_id FROM users WHERE user_email = ?`;
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
  const { user_email, user_Password } = req.body;

  const getUserQuery = `SELECT pk_user_id, user_password FROM users WHERE user_email = ?`;

  db.get(getUserQuery, [user_email], async (err, user) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      // If no user found
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the hashed password stored in the database with the provided password
    const isPasswordMatch = await bcrypt.compare(user_Password, user.user_password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.pk_user_id}, web_token_key, { expiresIn: '4h' });

    // Send the token back to the client
    res.status(200).json({ message: 'Login successful', token: token});
  });
}

// Validate a token
async function validateToken (req, res) {
  const token = req.body.token;
  console.log(`Token Validated: ${token}`)

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  jwt.verify(token, web_token_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Token is valid. Return decoded header data
    res.status(200).json({ message: 'Token is valid', data: decoded });
  });
};

// Get Reminders

async function getReminders(req, res) {
  const authHeader = req.headers.authorization;
  console.log(`Request recieved. Token: ${authHeader}`)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token is required' });
    }
  
    const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // Verify the token
  jwt.verify(token, web_token_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

  // Get user id from token
    const tokenUserId = decoded.userId; 
    console.log(`Getting Reminders, the decoded userId is: ${tokenUserId}`)

    try {
      // Fetch reminders from the database based on userID
      const reminders = await getRemindersFromDatabase(tokenUserId);
      res.status(200).json({ message: 'Reminders retrieved successfully', reminders });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: 'Error retrieving reminders' });
    }
  });
}

async function getRemindersFromDatabase(userId) {
  return new Promise((resolve, reject) => {
  const query = `SELECT pk_reminder_id, date, fk_user_id, recurs, reminder_date, title FROM reminders WHERE fk_user_id = ?`;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error querying reminders:", err.message);
      reject("Error querying reminders");
    } else {
      resolve(rows);
    }
  });
});
}

// Create / Update Reminder

async function addReminder(req, res) {
  const authHeader = req.headers.authorization;
  console.log(req.body)
  const {date, recurs, reminder, reminder_date} = req.body;

  // if header missing return error
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // if no token return error
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

// Verify the token
jwt.verify(token, web_token_key, async (err, decoded) => {
  if (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

// Get user id from token
  const tokenUserId = decoded.userId;
  console.log(`Adding Reminders, the decoded userId is: ${tokenUserId}`) 

  // if user id in request, update. else add to database.

  if (req.body.pk_reminder_id) {
    const pk_reminder_id = req.body.pk_reminder_id;
  
    const updateReminderQuery = `
      UPDATE reminders
      SET date = ?, recurs = ?, title = ?, reminder_date = ?
      WHERE pk_reminder_id = ?;
    `;
  
    const values = [date, recurs, reminder, reminder_date, pk_reminder_id];
  
    db.run(updateReminderQuery, values, function(err) {
      if (err) {
        console.error("Error updating reminder:", err.message);
        res.status(500).send("Database error");
      } else {
        console.log("Reminder Updated")
        res.status(200).send("Reminder updated successfully");
      }
    });
  } 
  
  if (!req.body.pk_reminder_id) {


// Add reminder to database
const createReminderQuery = `INSERT INTO reminders (date, fk_user_id, recurs, title, reminder_date) VALUES (?, ?, ?, ?, ?)`;

db.run(createReminderQuery, [date, tokenUserId, recurs, reminder, reminder_date], function (err) {
  if (err) {
    console.error('Error inserting user:', err.message);
    return res.status(500).json({ error: 'Failed to create user' });
  }
  
  // Successfully added the reminder
  res.status(201).json({
    message: 'Reminder added'
    });
  console.log("Reminder Added")
  });
}
})}

module.exports = {
  createUser,
  loginUser,
  validateToken,
  getReminders,
  addReminder
};
