const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ====================
// User-Datenbank
// ====================
const db = new sqlite3.Database('./Database/users.db', (err) => {
    if (err) return console.error("Fehler beim Öffnen users.db:", err.message);
    console.log("✅ users.db verbunden");

    // Tabelle users erstellen, falls sie nicht existiert
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error("❌ Fehler beim Erstellen der Tabelle users:", err.message);
        else console.log("✅ Tabelle 'users' ist bereit.");
    });
});

// ====================
// Kontakt-Datenbank
// ====================
const contactDB = new sqlite3.Database('./Database/contacts.db', (err) => {
    if (err) return console.error("Fehler beim Öffnen contacts.db:", err.message);
    console.log("✅ contacts.db verbunden");

    // Tabelle contacts erstellen, falls sie nicht existiert
    contactDB.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("❌ Fehler beim Erstellen der Tabelle contacts:", err.message);
        else console.log("✅ Tabelle 'contacts' ist bereit.");
    });
});

// POST /login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            console.error("Fehler beim Zugriff auf die Datenbank:", err.message);
            return res.status(500).json({ success: false, message: 'Serverfehler' });
        }

        if (row) {
            res.json({ success: true, message: 'Login erfolgreich', name: row.name, email: row.email });

           // res.json({ success: true, message: 'Login erfolgreich', name: row.name });
        } else {
            res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
        }
    });
});

// POST /register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Alle Felder müssen ausgefüllt sein.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('DB-Fehler:', err.message);
            return res.status(500).json({ success: false, message: 'Serverfehler' });
        }

        if (row) {
            return res.status(409).json({ success: false, message: 'E-Mail ist bereits registriert.' });
        }

        db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            function (err) {
                if (err) {
                    console.error('Fehler beim Einfügen:', err.message);
                    return res.status(500).json({ success: false, message: 'Serverfehler' });
                }

                res.json({ success: true, message: 'Registrierung erfolgreich' });
            }
        );
    });
});

// POST /contact – neue Nachricht speichern
app.post('/contact', (req, res) => {
    console.log('📨 Kontaktformular gesendet:', req.body);
    const { subject, message } = req.body;

    if (!subject || !message) {
        return res.status(400).json({ success: false, message: 'Betreff und Nachricht erforderlich.' });
    }

    const stmt = contactDB.prepare('INSERT INTO contacts (subject, message) VALUES (?, ?)');
    stmt.run(subject, message, function (err) {
        if (err) {
            console.error('Fehler beim Einfügen in contacts.db:', err.message);
            return res.status(500).json({ success: false, message: 'Fehler beim Speichern.' });
        }

        res.json({ success: true, message: 'Nachricht wurde gesendet.' });
    });
});

// GET /contacts – alle Nachrichten abrufen
app.get('/contacts', (req, res) => {
    contactDB.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Fehler beim Abrufen aus contacts.db:', err.message);
            return res.status(500).json({ success: false, message: 'Fehler beim Abrufen.' });
        }

        res.json({ success: true, contacts: rows });
    });
});

// ====================
// Server starten
// ====================
app.listen(port, () => {
    console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
