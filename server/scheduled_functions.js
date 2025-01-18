const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const path = require("path")
const dbLocation = process.env.DB_LOCATION ? path.join(__dirname, process.env.DB_LOCATION) : path.join(__dirname, 'ticklerDB.db');
const db = new sqlite3.Database(dbLocation);
const dayjs = require ("./node_modules/dayjs")
require("dotenv").config();

// Mailgun modules and constants
const { FormData } = require("undici");
const Mailgun = require("mailgun.js");
const { Console } = require("console");
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_SENDING_API_KEY,
  url: "https://api.eu.mailgun.net",
});

// Mark a reminder as sent
const marksent = (record, sentDate) => {
  const updateQuery = `UPDATE reminders 
  SET last_sent = ?, reminder_date = ? 
  WHERE pk_reminder_id = ?;`;

  const newReminderDate = null

  if (record.recurring) {
  const reminder_date = dayjs(record.reminder_date)
  newReminderDate = reminder_date.add(unit_count, unit_time);
  } else {newReminderDate = null}

console.log("Marking as Sent")
console.log(`New reminder date: ${newReminderDate}, sentDate: ${sentDate}, recordID: ${record.pk_reminder_id}`)
  db.run(updateQuery, [sentDate, newReminderDate, record.pk_reminder_id]);
};

const sendEmails = async () => {
  // Function to get records to email from db with reminder date older than NOW
  const getRecordsToEmail = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT reminders.*, users.reminder_email
        FROM reminders
        JOIN users ON reminders.fk_user_id = users.pk_user_id
        WHERE reminder_date < DATETIME('now');
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          console.error("Database query failed:", err.message);
          reject(err);
        } else {
          console.log("Rows found:", rows);
          resolve(rows);
        }
      });
    });
  };

  // Delay function

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Get records and send emails
  try {
    const records = await getRecordsToEmail();

    if (records.length > 0) {
      console.log(`Found ${records.length} records to email:`);

      for (const record of records) {
        try {
          await mg.messages
            .create("ticklr.app", {
              from: "Reminders <reminders@ticklr.app>",
              to: record.reminder_email,
              subject: record.title,
              text: `${record.body}
              Sent via tickler`,
            })
            .then((msg) => {
              console.log(msg);
              marksent(record, new Date().toISOString());
            })
            .catch((err) => console.error("Mailgun error:", err.message));
          await delay(1000);
        } catch (error) {
          console.error("Error sending email:", error.message);
        }
      }
    } else {
      console.log("No records found to email.");
    }
  } catch (error) {
    console.error("Error retrieving records:", error.message);
  }
};

const sendValidationEmail = async (req, res) => {
  console.log(req.body?.email);
  const authHeader = req.headers?.authorization;
  console.log(`Request recieved. Token: ${authHeader}`);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token is required" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const reminder_email = req.body?.email;
  if (!reminder_email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Verify the token
  jwt.verify(token, process.env.WEBTOKEN_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const tokenUserId = decoded.userId;

    // Update Reminder_Email

    const updateReminderQuery =
      "UPDATE users SET reminder_email = ? WHERE pk_user_id = ?";
    db.run(updateReminderQuery, [reminder_email, tokenUserId], function (err) {
      if (err) {
        console.error("Failed to update reminder email:", err.message);
        return res
          .status(500)
          .json({ error: "Failed to update reminder email" });
      }
    });

    // Generate Validation Link

    const validationCode = jwt.sign({ userId: tokenUserId, email: reminder_email}, process.env.EMAIL_VALIDATION_KEY, {
          expiresIn: "10m",
        });
    
    try {
      await mg.messages
        .create("ticklr.app", {
          from: "Reminders <reminders@ticklr.app>",
          to: reminder_email,
          subject: "Validate your email",
          text: `Please click here to validate your email. Link: http://localhost:3000/validate/${validationCode}`,
        })
        .catch((err) => console.error("Mailgun error:", err.message));
    } catch (error) {
      console.error("Error sending email:", error.message);
    }
  });
  return res.status(200).json({ message: "Reminder email updated and validation email sent" });
};

module.exports = {
  sendEmails,
  sendValidationEmail,
};
