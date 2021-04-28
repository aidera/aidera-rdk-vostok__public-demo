import "./header.scss";


const html = document.querySelector("html") as HTMLElement;
const body = document.querySelector("body") as HTMLElement;
const header = document.querySelector("header") as HTMLElement;
const fullscreenMenu = document.querySelector("#fullscreen-menu") as HTMLElement;
const headerMobileMenuTrigger = document.querySelector("header .mobile-menu-trigger") as HTMLElement;
const fullScreenMenuMobileMenuTrigger = document.querySelector("#fullscreen-menu .mobile-menu-trigger") as HTMLElement;

headerMobileMenuTrigger.addEventListener("click", () => {
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  header.classList.add("active");
  fullscreenMenu.style.display = "block";

  setTimeout(() => {
    fullscreenMenu.classList.add("active");
  }, 10);
});

fullScreenMenuMobileMenuTrigger.addEventListener("click", () => {
  html.style.overflowY = "auto";
  body.style.overflowY = "auto";
  header.classList.remove("active");
  fullscreenMenu.classList.remove("active");
  setTimeout(() => {
    fullscreenMenu.style.display = "none";
  }, 500);
});

const headerLinks = document.querySelectorAll("#fullscreen-menu nav a");
headerLinks.forEach(link => {
  link.addEventListener("click", () => {
    header.classList.remove("active");
    fullscreenMenu.classList.remove("active");
  });
});


/* --------------- */
/* Section changes */
/* --------------- */

const sections = document.querySelectorAll("section");
const links = document.querySelectorAll("#fullscreen-menu nav a, #float-button");

function clickHandler(e) {
  e.preventDefault();
  const href = this.getAttribute("href");

  if (href && !this.getAttribute("data-gallery")) {
    document.querySelector(href).scrollIntoView({
      behavior: "smooth"
    });
  }
}

links.forEach(link => {
  link.addEventListener("click", clickHandler);
});


