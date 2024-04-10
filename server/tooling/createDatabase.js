const sqlite3 = require('sqlite3').verbose();
// Create a new SQLite database
const db = new sqlite3.Database("database.db");
// Create a table to store the JSON objects
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS notes (noteid INTEGER PRIMARY KEY AUTOINCREMENT, markdown TEXT, coordinateX INTEGER DEFAULT 0, coordinateY INTEGER DEFAULT 0, changed DATETIME, archived INTEGER DEFAULT 0, created DATETIME DEFAULT CURRENT_TIMESTAMP);');
    db.run('CREATE TABLE IF NOT EXISTS connections (connectionid INTEGER PRIMARY KEY AUTOINCREMENT, connector1 INTEGER, connector2 INTEGER, FOREIGN KEY(connector1) REFERENCES notes(noteid), FOREIGN KEY(connector2) REFERENCES notes(noteid));');
});