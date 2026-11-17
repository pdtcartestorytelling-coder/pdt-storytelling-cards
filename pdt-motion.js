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
        ".pdt-h-edition picture", ".pdt-h-method-grid > div", ".pdt-h-method li",
        ".pdt-h-cta-grid > div", ".pdt-h-cta-actions", ".pdt-shop-home-fineprint"
      ]
    : [
        ".preorder-highlights-grid > div", ".preorder-section-heading",
        ".preorder-audience-item", ".preorder-audience-note",
        ".preorder-bundle-visual", ".preorder-component", ".pdt-tier-card",
        ".pdt-edition-preview picture", ".pdt-digital-grid article",
        ".pdt-shop-flow-title", ".pdt-shop-flow-lead", ".pdt-shop-flow-step",
        ".pdt-shop-flow-cta", ".pdt-shop-section-note",
        ".preorder-method-item", ".preorder-gallery-card",
        ".preorder-gallery-image", ".pdt-interest-intro", ".pdt-interest-card"
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

    targets.forEach((element) => {
      element.classList.add("pdt-motion-target");
      if (element.matches("picture, .preorder-gallery-image")) {
        element.classList.add("pdt-reveal-photo");
      }
    });
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
  let updateDepth = () => {};
  const update = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
    progress.style.transform = "scaleX(" + fraction + ")";
    body.classList.toggle("pdt-has-scrolled", window.scrollY > 24);
    updateDepth();
    scheduled = false;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  // Noticeable but restrained depth on scroll. Only update visible visuals and
  // use transforms/CSS variables, so no layout shifts or additional libraries.
  const heroVisual = document.querySelector(
    body.dataset.page === "home" ? ".pdt-h-hero-figure" : ".preorder-hero-product"
  );
  const heroSection = document.querySelector(
    body.dataset.page === "home" ? ".pdt-h-hero" : ".preorder-hero"
  );
  const depthImages = [...document.querySelectorAll(
    body.dataset.page === "home"
      ? ".pdt-h-edition picture img"
      : ".pdt-edition-preview picture img, .preorder-gallery-card img"
  )];

  // Independent ambient light layers on section backgrounds. Decorative only:
  // sections and content do not move, so layout and click targets stay stable.
  const sceneSections = !supportsReducedMotion.matches
    ? [...document.querySelectorAll(
        body.dataset.page === "home"
          ? ".pdt-h-kit, .pdt-h-collection, .pdt-h-method, .pdt-h-cta"
          : ".preorder-audience, .pdt-tier-section, .pdt-shop-flow, .preorder-gallery, .pdt-interest-section"
      )]
    : [];
  sceneSections.forEach((section, index) => {
    section.classList.add("pdt-scroll-scene");
    section.style.setProperty("--pdt-scene-anchor", index % 2 ? "22%" : "78%");
  });

  updateDepth = () => {
    if (supportsReducedMotion.matches) return;
    const viewportHeight = window.innerHeight;
    if (heroVisual && heroSection) {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        const fraction = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        // The complete box moves as one: never zoom or crop the cover image.
        heroVisual.style.setProperty("--pdt-hero-shift", Math.round(-(window.innerWidth < 760 ? 20 : 38) * fraction) + "px");
        // The colored radial lights follow the page at a different speed.
        // CSS 'translate' composes with the existing ambient keyframe transform.
        heroSection.style.setProperty("--pdt-hero-bg-shift",
          Math.round((window.innerWidth < 760 ? 32 : 85) * fraction) + "px");
      }
    }
    const mobile = window.innerWidth < 760;
    sceneSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -60 || rect.top > viewportHeight + 60) return;
      const center = rect.top + rect.height / 2;
      const span = viewportHeight / 2 + rect.height / 2;
      const relative = Math.max(-1, Math.min(1, (viewportHeight / 2 - center) / span));
      const direction = index % 2 ? -1 : 1;
      section.style.setProperty("--pdt-scene-x",
        Math.round(direction * relative * (mobile ? 12 : 42)) + "px");
      section.style.setProperty("--pdt-scene-y",
        Math.round(relative * (mobile ? 30 : 84)) + "px");
    });
    for (const image of depthImages) {
      const rect = (image.closest("picture") || image).getBoundingClientRect();
      if (rect.bottom < -40 || rect.top > viewportHeight + 40) continue;
      const imageCenter = (rect.top + rect.bottom) / 2;
      const range = viewportHeight / 2 + rect.height / 2;
      const relative = Math.max(-1, Math.min(1, (imageCenter - viewportHeight / 2) / range));
      const amplitude = window.innerWidth < 760 ? 7 : 13;
      image.style.setProperty("--pdt-image-shift", Math.round(-relative * amplitude) + "px");
    }
  };

  // Subtle mouse-following gold highlight on cards; ignored on touch devices.
  if (!supportsReducedMotion.matches &&
      window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(
      body.dataset.page === "home" ? ".pdt-h-edition" : ".pdt-tier-card"
    ).forEach((card) => {
      card.classList.add("pdt-spotlight-card");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        card.style.setProperty("--pdt-pointer-x",
          Math.round(100 * (event.clientX - rect.left) / rect.width) + "%");
        card.style.setProperty("--pdt-pointer-y",
          Math.round(100 * (event.clientY - rect.top) / rect.height) + "%");
      }, { passive: true });
    });
  }

  // Scroll progress and image depth share one requestAnimationFrame.
  update();

})();
