const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function updateTheme(isDark) {
  body.classList.toggle("dark-mode", isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}

updateTheme(localStorage.getItem("portfolio-theme") === "dark");

themeToggle.addEventListener("click", function () {
  const isDark = !body.classList.contains("dark-mode");
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  updateTheme(isDark);
});