async function loadContacts() {
    try {
        const res = await fetch('/contacts');
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Fehler beim Laden');

        const tbody = document.querySelector('#contactsTable tbody');
        tbody.innerHTML = '';  // altes leeren

        data.contacts.forEach((c, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${c.subject}</td>
          <td>${c.message}</td>
          <td>${new Date(c.created_at).toLocaleString()}</td>
        `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        alert('Fehler beim Laden der Kontaktanfragen.');
    }
}

// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', loadContacts);
  