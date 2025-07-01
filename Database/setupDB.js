const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// Datanbank initialisieren
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

// Beispiel-Daten einfügen
    const stmt = db.prepare(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );

    const exampleUsers = [
        ["victor", "victor@horn.de", "victor"],
        ["moritz", "moritz@schulte.de", "moritz"],
        ["nico", "nico@klatt.de", "nico"],
        ["torben", "torben@frieske.de", "torben"],
        ["sahra", "sahra@demensky.de", "sahra"]
    ];

    exampleUsers.forEach(user => stmt.run(user));
    stmt.finalize();

});

db.close();