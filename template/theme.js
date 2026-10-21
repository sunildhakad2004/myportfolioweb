const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const siteMenu = document.getElementById("site-menu");
const body = document.body;

function updateTheme(isDark) {
  body.classList.toggle("dark-mode", isDark);
  themeToggle.textContent = isDark ? "☾" : "☼";
}

updateTheme(localStorage.getItem("portfolio-theme") === "dark");

themeToggle.addEventListener("click", function () {
  const isDark = !body.classList.contains("dark-mode");
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  updateTheme(isDark);
});

menuToggle.addEventListener("click", function () {
  const isOpen = siteMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

siteMenu.addEventListener("click", function (event) {
  if (event.target instanceof HTMLAnchorElement) {
    siteMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const contactStatus = document.getElementById("contactStatus");
  const contactSubmit = contactForm.querySelector("button[type='submit']");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    contactSubmit.disabled = true;
    contactStatus.dataset.state = "pending";
    contactStatus.textContent = "Sending your message...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent. Please try again.");
      }

      contactStatus.dataset.state = result.delivered.email && result.delivered.whatsapp ? "success" : "partial";
      contactStatus.textContent = result.message;
      contactForm.reset();
    } catch (error) {
      contactStatus.dataset.state = "error";
      contactStatus.textContent = error.message || "Your message could not be sent. Please try again.";
    } finally {
      contactSubmit.disabled = false;
    }
  });
}