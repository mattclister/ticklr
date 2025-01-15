const sqlite3 = require("sqlite3").verbose();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path")
require('dotenv').config();

const web_token_key = process.env.WEBTOKEN_KEY

const dbLocation = process.env.DB_LOCATION ? path.join(__dirname, process.env.DB_LOCATION) : path.join(__dirname, 'ticklerDB.db');

const db = new sqlite3.Database(dbLocation, (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log(`Connected to the SQLite database at: ${dbLocation}`);
  }
});

// Create User
async function createUser(req, res) {
  const { userEmail, timeZone, createPassword } = req.body;

  // Check if the email is already registered
  const checkEmailQuery = `SELECT pk_user_id FROM users WHERE user_email = ?`;
  db.get(checkEmailQuery, [userEmail], async (err, row) => {
    if (err) {
      console.error("Error checking email:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (row) {
      // Email is already registered:
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Email is not registered:
    try {
      const passwordHash = await bcryptjs.hash(createPassword, 10);
      const createUserQuery = `INSERT INTO users (user_email, user_password, user_timezone) VALUES (?, ?, ?)`;

      db.run(
        createUserQuery,
        [userEmail, passwordHash, timeZone],
        function (err) {
          if (err) {
            console.error("Error inserting user:", err.message);
            return res.status(500).json({ error: "Failed to create user" });
          }

          // Successfully created the user
          res.status(201).json({
            message: "User created successfully",
          });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

// Login User
async function loginUser(req, res) {
  const { user_email, user_Password } = req.body;

  const getUserQuery = `SELECT pk_user_id, user_password FROM users WHERE user_email = ?`;

  db.get(getUserQuery, [user_email], async (err, user) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      // If no user found
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the hashed password stored in the database with the provided password
    const isPasswordMatch = await bcryptjs.compare(
      user_Password,
      user.user_password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.pk_user_id }, web_token_key, {
      expiresIn: "4h",
    });

    // Send the token back to the client
    res.status(200).json({ message: "Login successful", token: token });
  });
}

// Validate a token
async function validateToken(req, res) {
  const token = req.body.token;
  console.log(`Token Validated: ${token}`);

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  jwt.verify(token, web_token_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Token is valid. Return decoded header data
    res.status(200).json({ message: "Token is valid", data: decoded });
  });
}

// Get Reminders

async function getReminders(req, res) {
  const authHeader = req.headers.authorization;
  console.log(`Request recieved. Token: ${authHeader}`);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Verify the token
  jwt.verify(token, web_token_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user id from token
    const tokenUserId = decoded.userId;
    console.log(`Getting Reminders, the decoded userId is: ${tokenUserId}`);

    try {
      // Fetch reminders from the database based on userID
      const reminders = await getRemindersFromDatabase(tokenUserId);
      res
        .status(200)
        .json({ message: "Reminders retrieved successfully", reminders });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Error retrieving reminders" });
    }
  });
}

async function getRemindersFromDatabase(userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT pk_reminder_id, date, fk_user_id, reminder_date, title, body, unit_count, unit_time, fk_trigger_id, files, recurring FROM reminders WHERE fk_user_id = ?`;
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
  console.log("Adding to DB")
  console.log(req.body);
  const { date, reminder_date, title, body, unit_count, unit_time, fk_trigger_id, files, recurring } = req.body;

  // if header missing return error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token is required" });
  }

  // if no token return error
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Verify the token
  jwt.verify(token, web_token_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user id from token
    const tokenUserId = decoded.userId;
    console.log(`Adding Reminders, the decoded userId is: ${tokenUserId}`);

    // if reminder id in request, update. Else add to database.

    if (req.body.pk_reminder_id>0) {
      const pk_reminder_id = req.body.pk_reminder_id;

      const updateReminderQuery = `
      UPDATE reminders
      SET date = ?, title = ?, reminder_date = ?, body = ?, unit_count = ?, unit_time = ?, fk_trigger_id = ?, files = ?, recurring = ? 
      WHERE pk_reminder_id = ?;
    `;

      const values = [date, title, date, body, unit_count, unit_time, fk_trigger_id, files, recurring, pk_reminder_id];

      db.run(updateReminderQuery, values, function (err) {
        if (err) {
          console.error("Error updating reminder:", err.message);
          res.status(500).send("Database error");
        } else {
          console.log("Reminder Updated");
          res.status(200).json({
            message: "Reminder updated successfully",
            pk_reminder_id: this.lastID,
            fk_user_id: tokenUserId
          })
        }
      });
    }

    if (req.body.pk_reminder_id<0) {
      // Add reminder to database
      const createReminderQuery = `INSERT INTO reminders (fk_user_id, date, title, reminder_date, body, unit_count, unit_time, fk_trigger_id, files, recurring) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(
        createReminderQuery,
        [tokenUserId, date, title, date, body, unit_count, unit_time, fk_trigger_id, files, recurring],
        function (err) {
          if (err) {
            console.error("Error inserting user:", err.message);
            return res.status(500).json({ error: "Failed to create user" });
          }

          // Successfully added the reminder
          res.status(201).json({
            message: "Reminder added",
            pk_reminder_id: this.lastID,
            fk_user_id: tokenUserId
          });
          console.log("Reminder Added");
        }
      );
    }
  });
}

// Update Settings

async function updateSettings(req, res) {
  const authHeader = req.headers.authorization;
  const { email } = req.body.data;
   console.log(req.body.data)
   console.log(`Email being updated: ${email}`)

  // if header missing return error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token is required" });
  }

  // if no token return error
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Verify the token
  jwt.verify(token, web_token_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user id from token
    const tokenUserId = decoded.userId;
    
    // Update reminder email

    const updateReminderQuery = `
    UPDATE users
    SET reminder_email = ?
    WHERE pk_user_id = ?;
  `;

  db.run(updateReminderQuery, [email, tokenUserId], function (err) {
    if (err) {
      console.error("Error updating settings:", err.message);
      res.status(500).send("Database error");
    } else {
      console.log("Settings Updated");
      res.status(200).send("Settings updated successfully");
    }
  });
  });
}

// Delete Reminder

async function deleteReminder(req, res) {
  console.log("Request made for deletion")
  const authHeader = req.headers?.authorization;
  const { reminderId } = req?.params;
  console.log(reminderId)

  // if header missing return error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token is required" });
  }

  // if no token return error
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  if (!reminderId){
    return res.status(400).json({ message: "Reminder ID is required" });
  }

  // Verify the token
  jwt.verify(token, web_token_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    

    // Get user id from token
    const tokenUserId = decoded.userId;
    console.log(`Deleting Reminders, the decoded userId is: ${tokenUserId}`);
  
    // Check user id of reminder matches decoded userId and delete

    const deleteReminderQuery = `
    DELETE FROM reminders
    WHERE pk_reminder_id = ? AND fk_user_id = ?
  `

  db.run(deleteReminderQuery, [reminderId, tokenUserId], function (err) {
    if (this.changes === 0) {
      return res.status(404).json({ message: "No reminder found to delete" });
    }
    if (err) {
      console.error("Error deleting reminder:", err.message);
      res.status(500).send("Reminder deletion Failed. Database error");
    } else {
      console.log("Reminder deleted");
      res.status(200).send("Reminder deleted");
    }
  })
  })
}


// Verify Email

async function validateEmailLink(req,res) {
  const { validationCode: token } = req?.params;
  console.log(token)
  if (!token) {return res.redirect("http://localhost:3000/docs/validate_failure/")}

  jwt.verify(token, process.env.EMAIL_VALIDATION_KEY, async (err, decoded) => {
      if (err) {
        return res.redirect("http://localhost:3000/docs/validate_failure/");
      } else {
        const tokenUserId = decoded.userId;
        const validatedEmail = decoded.email;
        const emailMatchQuery = `SELECT reminder_email FROM users WHERE pk_user_id = ?`;

        db.get(emailMatchQuery, [tokenUserId], async (err, row) => {
          if (err) {
            console.error("Error fetching email from database:", err.message);
            return res.redirect("http://localhost:3000/docs/validate_failure/");
          } 
          
          if (!row) {
            return res.redirect("http://localhost:3000/docs/validate_failure/");
          } else if (validatedEmail === row.reminder_email) {
            // Proceed with validation

      try {
        const updateValidEmailQuery = `UPDATE users SET valid_email = ? WHERE pk_user_id = ?`
        db.run(
          updateValidEmailQuery,
          [validatedEmail,tokenUserId],
          function (err) {
            if (err) {
              console.error("Error validating email:", err.message);
              return res.redirect("http://localhost:3000/docs/validate_failure/");
            }

          // Redirect user to the desired URL
            return res.redirect("http://localhost:3000/docs/validate_success/");
          }
        )
      } catch (error) {
        console.error("Error validating email:", error.message);
        return res.redirect("http://localhost:3000/docs/validate_failure/");
      }
    }
          
      }
  )}
  })}

  async function getSettingsFromDatabase(userId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT valid_email FROM users WHERE pk_user_id = ?`;
      db.get(query, [userId], (err, row) => {
        if (err) {
          console.error("Error querying settings:", err.message);
          reject("Error querying settings");
        } else {
          if (!row) {
            resolve({ email: null });
          } else {
            const settings = { email: row.valid_email };
            resolve(settings);
          }
        }
      });
    });
  }  

  async function getSettings(req, res) {
    const authHeader = req.headers.authorization;
    console.log(`Request received. Token: ${authHeader}`);
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    const token = authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    // Verify the token
    jwt.verify(token, web_token_key, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
        const tokenUserId = decoded.userId;
      console.log(`Getting settings, the decoded userId is: ${tokenUserId}`);
  
      try {
        const settings = await getSettingsFromDatabase(tokenUserId);
        console.log(settings)
        
        if (settings.email) {
          res.status(200).json({ message: "Settings retrieved successfully", settings });
        } else {
          res.status(404).json({ message: "No settings found for this user" });
        }
        
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error retrieving settings" });
      }
    });
  }

module.exports = {
  createUser,
  loginUser,
  validateToken,
  getReminders,
  addReminder,
  updateSettings,
  deleteReminder,
  validateEmailLink,
  getSettings
};
