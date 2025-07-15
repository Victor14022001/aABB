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
      localStorage.setItem("username", result.name);
      localStorage.setItem("useremail", result.email);

      const name = result.name ? result.name.toLowerCase() : 'default';
      window.location.href = 'profiles/welcome.html'; // Standard-Weiterleitung
      // window.location.href = `profiles/${name}.html`;
    } else {
      errorParagraph.textContent = result.message;
    }
    

  } catch (err) {
    console.error("Fehler:", err);
    errorParagraph.textContent = "Fehler beim Verbinden mit dem Server.";
  }
});

