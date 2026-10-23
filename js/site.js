const menuButton = document.querySelector(".menu-toggle");
if (menuButton) menuButton.addEventListener("click", () => {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(nav.classList.contains("nav-open")));
});
