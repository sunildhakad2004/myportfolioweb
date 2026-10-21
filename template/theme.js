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