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


/* Lightweight privacy notice — informational only, no tracking consent required at present. */
(function initPrivacyNotice() {
  const storageKey = "pdtPrivacyNoticeDismissedV1";
  try {
    if (window.localStorage.getItem(storageKey) === "1") return;
  } catch (_) {
    // If storage is unavailable, the notice can still be closed for the current page.
  }

  const lang = (document.documentElement.lang || "it").toLowerCase().slice(0, 2);
  const copy = {
    it: {
      title: "Privacy e utilizzo del sito",
      text: "Questo sito utilizza tecnologie necessarie al funzionamento. Il modulo contatti apre la tua app email e non utilizza servizi esterni di inoltro. Puoi consultare la nostra Privacy Policy.",
      link: "Privacy Policy",
      close: "Ho capito",
      href: "privacy-policy.html"
    },
    en: {
      title: "Privacy and site use",
      text: "This site uses technologies necessary for its operation. The contact form opens your email app and does not use an external delivery service. You can read our Privacy Policy.",
      link: "Privacy Policy",
      close: "Got it",
      href: "privacy-policy-en.html"
    },
    es: {
      title: "Privacidad y uso del sitio",
      text: "Este sitio utiliza tecnologías necesarias para su funcionamiento. El formulario de contacto abre tu aplicación de correo y no utiliza un servicio externo de envío. Puedes consultar nuestra Política de privacidad.",
      link: "Política de privacidad",
      close: "Entendido",
      href: "privacy-policy-es.html"
    }
  };
  const c = copy[lang] || copy.it;

  const notice = document.createElement("aside");
  notice.className = "privacy-notice";
  notice.setAttribute("role", "dialog");
  notice.setAttribute("aria-live", "polite");
  notice.setAttribute("aria-label", c.title);
  notice.innerHTML = `
    <div class="privacy-notice-copy">
      <strong>${c.title}</strong>
      <span>${c.text}</span>
    </div>
    <div class="privacy-notice-actions">
      <a href="${c.href}">${c.link}</a>
      <button type="button" class="privacy-notice-close">${c.close}</button>
    </div>
  `;
  document.body.appendChild(notice);

  const closeButton = notice.querySelector(".privacy-notice-close");
  closeButton?.addEventListener("click", () => {
    notice.remove();
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch (_) {}
  });
})();


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
