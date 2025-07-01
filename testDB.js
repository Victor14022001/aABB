const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./Database/users.db', (err) => {
    if (err) {
        return console.error('Fehler beim Öffnen der Datenbank:', err.message);
    }
    console.log('Datenbank erfolgreich geöffnet');
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
        return console.error('Fehler beim Abfragen der Tabelle:', err.message);
    }
    if (row) {
        console.log('Tabelle users existiert.');
    } else {
        console.log('Tabelle users existiert NICHT.');
    }
    db.close();
});
