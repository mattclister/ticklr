const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ticklerDB.db");
require('dotenv').config();

const sendEmails = async () => {

    // Function to get records to email from db

  const getRecordsToEmail = () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT reminders.*, users.reminder_email 
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

      // Get records to email from db

              // for (const record of records) {
        //     console.log(
        //       `Sending email to: ${record.pk_reminder_id} ${record.reminder_email} ${record.title}`
        //     );

  try {
    const records = await getRecordsToEmail();
    if (records.length > 0) {
      console.log(`Found ${records.length} records to email:`);

        const formData = require("form-data");
        const Mailgun = require("mailgun.js");
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
          username: "api",
          key: process.env.MAILGUN_SENDING_API_KEY,
          url: 'https://api.eu.mailgun.net'
        });

        mg.messages
          .create("ticklr.app", {
            from: "Reminders <reminders@ticklr.app>",
            to: ["Inbox <add.task.axvv0puffgurtyvk@todoist.net>"],
            subject: "New Test Task",
            text: "Testing adding a task to todoist",
            html: "<p>Testing adding a task to todoist html</p>",
          })
          .then((msg) => console.log(msg)) // logs response data
          .catch((err) => console.log(err)); // logs any error
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
