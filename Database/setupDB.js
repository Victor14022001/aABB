const sqlite3 = require('sqlite3').verbose();
const dbUsers = new sqlite3.Database('users.db');
const dbContacts = new sqlite3.Database('contacts.db');

// Users-Datenbank
dbUsers.serialize(() => {
    dbUsers.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    const stmtDBUsers = dbUsers.prepare(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );

    const exampleUsers = [
        ["victor", "victor@horn.de", "victor"],
        ["moritz", "moritz@schulte.de", "moritz"],
        ["nico", "nico@klatt.de", "nico"],
        ["torben", "torben@frieske.de", "torben"],
        ["sahra", "sahra@demensky.de", "sahra"]
    ];

    exampleUsers.forEach(user => stmtDBUsers.run(user));
    stmtDBUsers.finalize();
});

// Contacts-Datenbank
dbContacts.serialize(() => {
    dbContacts.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const stmtDBContacts = dbContacts.prepare(
        "INSERT INTO contacts (subject, message) VALUES (?, ?)"
    );

    const exampleContacts = [
        ["Kontakt 1", "Dies ist eine Nachricht von Kontakt 1."],
        ["Kontakt 2", "Dies ist eine Nachricht von Kontakt 2."],
        ["Kontakt 3", "Dies ist eine Nachricht von Kontakt 3."],
        ["Kontakt 4", "Dies ist eine Nachricht von Kontakt 4."],
        ["Kontakt 5", "Dies ist eine Nachricht von Kontakt 5."]
    ];

    exampleContacts.forEach(contact => stmtDBContacts.run(contact));
    stmtDBContacts.finalize();
});

// WICHTIG: Beide erst schließen, nachdem alle Befehle durch sind.
dbUsers.close();
dbContacts.close();
