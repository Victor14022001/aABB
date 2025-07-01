const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./Database/users.db');

// POST /login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            console.error("Fehler beim Zugriff auf die Datenbank:", err.message);
            return res.status(500).json({ success: false, message: 'Serverfehler' });
        }

        if (row) {
            res.json({ success: true, message: 'Login erfolgreich', name: row.name });
        } else {
            res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Server läuft auf http://localhost:${port}`);
});
 
// REGISTER FUNKTION

// POST /register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Pflichtfelder prüfen
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Alle Felder müssen ausgefüllt sein.' });
    }

    // Prüfen, ob die E-Mail schon existiert
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('DB-Fehler:', err.message);
            return res.status(500).json({ success: false, message: 'Serverfehler' });
        }

        if (row) {
            // E-Mail ist schon vergeben
            return res.status(409).json({ success: false, message: 'E-Mail ist bereits registriert.' });
        }

        // Neuen User einfügen
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
  

/*
const users = [
{name: "Victor", email: "victor@horn.de", password: "victor"},
{name: "Moritz", email: "moritz@schulte.de", password: "moritz"},
{name: "Torben", email: "torben@frieske.de", password: "torben"},
{name: "Sahra", email: "sahra@demensky.de", password: "sahra"},

];


app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { name, email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Falsche Login-Daten." });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
*/

