"use strict";

const menuButton = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".nav-panel");

function closeMenu() {
  if (!menuButton || !menuPanel) return;

  menuPanel.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute(
    "aria-label",
    menuButton.dataset.labelOpen || "Open menu"
  );
}

if (menuButton && menuPanel) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? menuButton.dataset.labelClose || "Close menu"
        : menuButton.dataset.labelOpen || "Open menu"
    );
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInside = menuPanel.contains(event.target);
    const clickedButton = menuButton.contains(event.target);

    if (!clickedInside && !clickedButton) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}
