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


/* Privacy information is available in the footer and next to each form.
   No non-essential tracking is used; avoid blocking the mobile viewport. */

/* Contact form: reliable direct-email fallback for a static GitHub Pages site. */
(function initMailtoContactForms() {
  const forms = document.querySelectorAll(".secure-contact-form[data-mailto-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const recipient = form.dataset.recipient || "pdtstorytellingcards@gmail.com";
      const subject = form.dataset.subject || "PdT Storytelling Cards";
      const name = (form.elements.name?.value || "").trim();
      const email = (form.elements.email?.value || "").trim();
      const message = (form.elements.message?.value || "").trim();
      const lang = (document.documentElement.lang || "it").toLowerCase().slice(0, 2);

      const labels = {
        it: { name: "Nome e cognome", email: "Email", message: "Messaggio", status: "Si sta aprendo la tua app email. Controlla il messaggio e premi Invia per completare la richiesta." },
        en: { name: "Full name", email: "Email", message: "Message", status: "Your email app is opening. Review the message and press Send to complete your request." },
        es: { name: "Nombre y apellidos", email: "Email", message: "Mensaje", status: "Se está abriendo tu aplicación de correo. Revisa el mensaje y pulsa Enviar para completar la solicitud." }
      };
      const c = labels[lang] || labels.it;
      const body = `${c.name}: ${name}\n${c.email}: ${email}\n\n${c.message}:\n${message}`;
      const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const status = form.querySelector("[data-mailto-status]");
      if (status) status.textContent = c.status;

      window.location.href = mailto;
    });
  });
})();
