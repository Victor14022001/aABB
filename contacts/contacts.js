const form = document.getElementById("contactForm");
const responseParagraph = document.getElementById("response");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ subject, message })
    });

    const result = await res.json();
    responseParagraph.textContent = result.message;
    responseParagraph.style.color = result.success ? "green" : "red";

    if (result.success) {
        form.reset();
    }
});