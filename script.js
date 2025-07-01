/*
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Formular nicht normal abschicken

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Beispiel: einfache Prüfung im Frontend
  if (email === "" || password === "" || name === "") {
    document.getElementById("error").textContent = "Bitte alle Felder ausfüllen.";
    return;
  }

  // Anfrage an Server schicken (z. B. Node.js oder PHP)
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Login erfolgreich!");
      // z. B. weiterleiten: window.location.href = "/dashboard";

      if (name === "Victor") {
        window.location.href = "/profiles/victor.html";
      } else if (name === "Nico") {
        window.location.href = "/profiles/nico.html";
      } else if (name === "Moritz") {
        window.location.href = "/profiles/moritz.html";
      } else if (name === "Torben") {
        window.location.href = "/profiles/torben.html";
      } else if (name === "Sahra") {
        window.location.href = "/profiles/sahra.html";
      }

    } else {
      document.getElementById("error").textContent = data.message;
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("error").textContent = "Fehler beim Verbinden mit dem Server.";
  });
});
*/

const loginForm = document.getElementById("loginForm");
const errorParagraph = document.getElementById("error");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      const name = result.name ? result.name.toLowerCase() : 'default';
      window.location.href = `profiles/${name}.html`;
    } else {
      errorParagraph.textContent = result.message;
    }
    

  } catch (err) {
    console.error("Fehler:", err);
    errorParagraph.textContent = "Fehler beim Verbinden mit dem Server.";
  }
});

