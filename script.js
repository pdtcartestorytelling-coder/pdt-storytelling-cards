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
      text: "Questo sito utilizza tecnologie necessarie al funzionamento. Il modulo contatti attiva una verifica anti-spam al momento dell’invio. Puoi consultare la nostra Privacy Policy.",
      link: "Privacy Policy",
      close: "Ho capito",
      href: "privacy-policy.html"
    },
    en: {
      title: "Privacy and site use",
      text: "This site uses technologies necessary for its operation. The contact form activates anti-spam verification when submitted. You can read our Privacy Policy.",
      link: "Privacy Policy",
      close: "Got it",
      href: "privacy-policy-en.html"
    },
    es: {
      title: "Privacidad y uso del sitio",
      text: "Este sitio utiliza tecnologías necesarias para su funcionamiento. El formulario de contacto activa una verificación anti-spam al enviarse. Puedes consultar nuestra Política de privacidad.",
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
