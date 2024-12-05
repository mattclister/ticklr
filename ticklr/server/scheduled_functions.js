const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ticklerDB.db");

const sendEmails = async () => {
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

  try {
    const records = await getRecordsToEmail();
    if (records.length > 0) {
      console.log(`Found ${records.length} records to email:`);

      for (const record of records) {
        console.log(
          `Sending email to: ${record.pk_reminder_id} ${record.reminder_email} ${record.title}`
        );

        const formData = require("form-data");
        const Mailgun = require("mailgun.js");
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
          username: "api",
          key: process.env.MAILGUN_API_KEY,
        });

        mg.messages
          .create("sandbox-123.mailgun.org", {
            from: "Excited User <mailgun@ticklr.app>",
            to: ["test@example.com"],
            subject: "Hello",
            text: "Testing some Mailgun awesomeness!",
            html: "<h1>Testing some Mailgun awesomeness!</h1>",
          })
          .then((msg) => console.log(msg)) // logs response data
          .catch((err) => console.log(err)); // logs any error
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
