const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
// Connect database
const db = new sqlite3.Database(process.env.DATABASE);
if(process.env.BACKUP_SCRIPT != undefined){
    exec('bash ' + process.env.BACKUP_SCRIPT, () => {})
    new CronJob('0 0 * * * *', () =>  {
        exec('bash '+process.env.BACKUP_SCRIPT, () => {})
    }, null,true, 'Europe/Berlin');
}

const app = express();
const port = process.env.PORT || 9000;
// Serve static files from the "public" folder
app.use(express.static('client/dist'));

// Serve static files from the "public" folder
app.use(express.json());

app.get('/api/notes',(req,res) => {
    db.all('SELECT * FROM notes WHERE archived = 0', (err,rows) => {
        res.send(rows)
    })
})
app.get('/api/notes/all',(req,res) => {
    db.all('SELECT * FROM notes', (err,rows) => {
        res.send(rows)
    })
})
app.get('/api/notes/date',(req,res) => {
    if(req.query.year != undefined){
        let date = new Date()
        date.setFullYear(req.query.year)
        date.setMonth(0)
        date.setDate(1)
        date.setHours(1)
        let timestamp = date.getTime();
        db.all('SELECT * FROM notes WHERE changed > (?)',[timestamp], (err,rows) => {
            res.send(rows)
        })
    }else{
        res.send([])
    }
})
app.post('/api/notes', (req, res) => {
    let note = req.body; // Assuming the JSON data is in the request body
    // Insert the JSON object into the database
    db.run('INSERT INTO notes (markdown,coordinateX,coordinateY,archived,changed) VALUES (?,?,?,?,?)', [note.markdown,note.coordinateX,note.coordinateY,note.archived,note.changed], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating object');
        } else {
            res.status(200).json({id: this.lastID});
        }
    });
});
app.put('/api/notes/:id/markdown', (req, res) => {
    let note = req.body; // Assuming the JSON data is in the request body
    // Insert the JSON object into the database
    db.run('UPDATE notes SET markdown = (?), changed = (?) WHERE noteid = (?)', [note.markdown, note.changed ,req.params.id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating object');
        } else {
            res.status(200).json({id: this.lastID});
        }
    });
});
app.put('/api/notes/:id/archive', (req, res) => {
    db.run('UPDATE notes SET archived = 1 WHERE noteid = (?)', [req.params.id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating object');
        } else {
            res.status(200).json({id: this.lastID});
        }
    });
});
app.put('/api/notes/:id/position', (req, res) => {
    let note = req.body; // Assuming the JSON data is in the request body
    // Insert the JSON object into the database
    db.run('UPDATE notes SET coordinateX = (?), coordinateY = (?), changed = (?) WHERE noteid = (?)', [note.coordinateX, note.coordinateY, note.changed, req.params.id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating object');
        } else {
            res.status(200).json({id: this.lastID});
        }
    });
});
// Route to create an object from JSON and store it in SQLite
app.delete('/api/notes/:id', (req, res) => {
    db.run('DELETE FROM notes WHERE noteid = (?)',[req.params.id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting object');
        } else {
            res.status(200).send('Object deleted')
        }
    });
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
