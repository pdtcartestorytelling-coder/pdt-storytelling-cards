"use strict";

/* Progressive enhancements for PdT landing and Pre Order pages.
   No dependencies, no tracking, and reduced-motion support. */
(() => {
  const body = document.body;
  if (!body || !["home", "preorder"].includes(body.dataset.page)) return;

  const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const allowsReveal = !supportsReducedMotion.matches && "IntersectionObserver" in window;
  const selectors = body.dataset.page === "home"
    ? [
        ".pdt-h-heading", ".pdt-h-facts article", ".pdt-h-edition",
        ".pdt-h-method-grid > div", ".pdt-h-method li",
        ".pdt-h-cta-grid > div", ".pdt-h-cta-actions"
      ]
    : [
        ".preorder-highlights-grid > div", ".preorder-section-heading",
        ".preorder-audience-item", ".preorder-audience-note",
        ".preorder-bundle-visual", ".preorder-component", ".pdt-tier-card",
        ".pdt-digital-grid article", ".preorder-method-item",
        ".preorder-gallery-card", ".pdt-interest-intro", ".pdt-interest-card"
      ];

  if (allowsReveal) {
    const targets = [...document.querySelectorAll(selectors.join(","))];
    const observer = new IntersectionObserver((entries, instance) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("pdt-is-visible");
        instance.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    targets.forEach((element) => element.classList.add("pdt-motion-target"));
    body.classList.add("pdt-motion-enabled");

    // Don't hide sections already above the viewport on reload or an anchor jump.
    targets.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        element.classList.add("pdt-is-visible");
      } else {
        observer.observe(element);
      }
    });
  }

  // Keep the three introductory pathways exclusive across browsers.
  // Native details/summary still works without JavaScript.
  if (body.dataset.page === "home") {
    const choices = [...document.querySelectorAll(".pdt-first-action-option")];
    choices.forEach((choice) => {
      choice.querySelector("summary")?.addEventListener("click", () => {
        choices.forEach((other) => {
          if (other !== choice) other.open = false;
        });
      });
    });
  }

  // Fine reading-progress line, attached outside the site header.
  const progress = document.createElement("div");
  progress.className = "pdt-reading-progress";
  progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  let scheduled = false;
  const update = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
    progress.style.transform = "scaleX(" + fraction + ")";
    body.classList.toggle("pdt-has-scrolled", window.scrollY > 24);
    scheduled = false;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
})();
