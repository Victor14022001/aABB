const registerForm = document.getElementById("registerForm");
const messageParagraph = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (result.success) {
            messageParagraph.style.color = "green";
            messageParagraph.textContent = "Registrierung erfolgreich! Du kannst dich jetzt einloggen.";
            window.location.href = "index.html"; // Login-Seite
            // Optional: automatisch weiterleiten zum Login
            /*setTimeout(() => {
                window.location.href = "index.html"; // Login-Seite
            }, 5000);*/
        } else {
            messageParagraph.style.color = "red";
            messageParagraph.textContent = result.message;
        }
    } catch (err) {
        console.error("Fehler:", err);
        messageParagraph.style.color = "red";
        messageParagraph.textContent = "Fehler bei der Verbindung zum Server.";
    }
});
