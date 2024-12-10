const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ticklerDB.db");
require('dotenv').config();

// Mailgun modules and constants
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_SENDING_API_KEY,
  url: 'https://api.eu.mailgun.net'
});

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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
              to: [records.reminder_email],
              subject: records.title,
              text: "Sent via tickler"
            })
            .then((msg) => console.log(msg))
            .catch((err) => console.error("Mailgun error:", err.message));
            await delay(1000)
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

module.exports = {
  sendEmails,
};
