const sqlite3 = require('sqlite3').verbose();
// Create a new SQLite database
const db = new sqlite3.Database("database.db");
const db2 = new sqlite3.Database("database_new.db");
// Create a table to store the JSON objects
db.all('SELECT * FROM notes;', (err,rows) => {
    rows.forEach((row) => {
        let data = JSON.parse(row.data)
        let timestamp = new Date().getTime()
        db2.run('INSERT INTO notes (markdown,changed) VALUES (?,?);', [data.content,timestamp], function(err) {
            if (err) {
                console.error(err);
            }
        });
    })
})