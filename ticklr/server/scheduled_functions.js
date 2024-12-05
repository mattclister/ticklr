const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db');

const sendEmails = () => {

    async function getRecordsToEmail() {

       const sendCondition = "reminder_date < date('now')"

        await ((resolve, reject) => {
        
          const query = `SELECT * FROM reminders WHERE reminder_date = ?`;
      
          db.all(query, [sendCondition], (err, rows) => {
            if (err) {
              reject(err);
            } else {
                console.log(rows)
              resolve(rows);
            }
          });
        });
      }

      getRecordsToEmail()
}


module.exports = {
sendEmails
}