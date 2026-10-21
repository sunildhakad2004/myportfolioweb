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
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const subject = formData.get("subject").toString().trim();
    const message = formData.get("message").toString().trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const submitter = event.submitter;

    if (!(submitter instanceof HTMLButtonElement)) {
      return;
    }

    if (submitter.value === "email") {
      const gmailUrl = new URL("https://mail.google.com/mail/");
      gmailUrl.search = new URLSearchParams({
        view: "cm",
        fs: "1",
        to: "sunildhakadsd27@gmail.com",
        su: subject,
        body
      }).toString();
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (submitter.value === "whatsapp") {
      const whatsappUrl = new URL("https://wa.me/918718850393");
      whatsappUrl.searchParams.set("text", `Subject: ${subject}\n\n${body}`);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  });
}