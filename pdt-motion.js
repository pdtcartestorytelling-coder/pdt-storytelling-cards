"use strict";

/* Progressive enhancements for PdT landing and Pre Order pages.
   No dependencies, no tracking, and reduced-motion support. */
(() => {
  const body = document.body;
  if (!body || !["home", "preorder"].includes(body.dataset.page)) return;

  const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const allowsReveal = !supportsReducedMotion.matches && "IntersectionObserver" in window;
  // Touch devices retain simple reveal/progress; skip expensive decorative scroll depth.
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const allowsDepth = !supportsReducedMotion.matches && !coarsePointer.matches;
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
  const sceneSections = allowsDepth
    ? [...document.querySelectorAll(
        body.dataset.page === "home"
          ? ".pdt-h-kit, .pdt-h-collection, .pdt-h-method, .pdt-h-cta"
          : ".preorder-audience, .pdt-tier-section, .pdt-digital-section, .pdt-shop-flow, .preorder-method, .preorder-gallery, .pdt-interest-section"
      )]
    : [];
  const chapterNames={
    it:body.dataset.page==="home"
      ? ["Il kit","Le edizioni","Il metodo","La tua storia"]
      : ["Per chi","Il cofanetto","Come acquistare","Il metodo","Le immagini","Contattaci"],
    en:body.dataset.page==="home"
      ? ["The kit","The editions","The method","Your story"]
      : ["For whom","The box","How to buy","The method","The images","Contact us"],
    es:body.dataset.page==="home"
      ? ["El kit","Las ediciones","El método","Tu historia"]
      : ["Para quién","El cofre","Cómo comprar","El método","Las imágenes","Contacta"]
  };
  const language=(document.documentElement.lang||"it").slice(0,2);
  const names=chapterNames[language]||chapterNames.it;
  sceneSections.forEach((section, index) => {
    section.classList.add("pdt-scroll-scene");
    section.style.setProperty("--pdt-scene-anchor", index % 2 ? "22%" : "78%");
    section.dataset.pdtChapter=String(index+1).padStart(2,"0");
  });

  // A continuous, visible motion layer: a large diagonal band and a chapter
  // seam. They stay behind the content and never catch pointer events.
  // We add them only on motion-capable devices, so the website remains
  // fully readable when scripting or animations are unavailable.
  const cinematicScenes = sceneSections.map((section,index) => {
    const sweep = document.createElement("div");
    sweep.className = "pdt-cinema-sweep";
    sweep.setAttribute("aria-hidden","true");
    const edge = document.createElement("div");
    edge.className = "pdt-cinema-edge";
    edge.setAttribute("aria-hidden","true");
    section.prepend(edge,sweep);
    section.classList.add("pdt-cinema-scene");
    return {section,sweep,edge,index};
  });
  const cinematicCards = allowsDepth
    ? [...document.querySelectorAll(
        body.dataset.page === "home"
          ? ".pdt-h-edition,.pdt-h-facts article,.pdt-h-method-grid > div"
          : ".pdt-tier-card,.pdt-shop-flow-step,.preorder-gallery-card"
      )]
    : [];
  cinematicCards.forEach((card,index) => {
    card.classList.add("pdt-cinema-card");
    card.dataset.pdtCineSide = index % 2 ? "right" : "left";
  });
  if(cinematicScenes.length)body.classList.add("pdt-cinema-enabled");

  // A small visual scroll guide makes the current chapter unmistakable.
  // It is decorative, never replaces the real site navigation.
  let journey=null,journeyCount=null,journeyName=null,journeyFill=null;
  if(sceneSections.length){
    journey=document.createElement("div");
    journey.className="pdt-journey";
    journey.setAttribute("aria-hidden","true");
    journeyCount=document.createElement("span");
    journeyCount.className="pdt-journey-count";
    const track=document.createElement("span");
    track.className="pdt-journey-track";
    journeyFill=document.createElement("span");
    journeyFill.className="pdt-journey-fill";
    track.appendChild(journeyFill);
    journeyName=document.createElement("span");
    journeyName.className="pdt-journey-name";
    journey.append(journeyCount,track,journeyName);
    body.appendChild(journey);
  }

  updateDepth = () => {
    if (!allowsDepth || supportsReducedMotion.matches || coarsePointer.matches) return;
    const viewportHeight = window.innerHeight;
    const mobile = window.innerWidth < 760;

    // Read layout in one batch, then update transforms in one batch.
    // Interleaving layout reads and writes on scroll causes jank on phones.
    const heroRect = heroSection?.getBoundingClientRect();
    const sectionRects = sceneSections.map(section=>section.getBoundingClientRect());
    const cardRects = cinematicCards.map(card=>card.getBoundingClientRect());
    const imageRects = depthImages.map(image=>
      (image.closest("picture") || image).getBoundingClientRect());

    if (heroVisual && heroSection && heroRect &&
        heroRect.bottom > 0 && heroRect.top < viewportHeight) {
      const fraction = Math.max(0, Math.min(1,-heroRect.top / Math.max(heroRect.height,1)));
      // Move the whole closed box, never zoom or crop its actual photograph.
      heroVisual.style.setProperty("--pdt-hero-shift",
        Math.round(-(mobile?20:38)*fraction)+"px");
      heroSection.style.setProperty("--pdt-hero-bg-shift",
        Math.round((mobile?32:85)*fraction)+"px");
    }

    let visibleChapter=-1;
    sectionRects.forEach((rect,index)=>{
      const section=sceneSections[index];
      if(rect.top<viewportHeight*.55 && rect.bottom>viewportHeight*.25){
        visibleChapter=index;
      }
      if(rect.bottom < -60 || rect.top > viewportHeight+60)return;

      // Existing chapter lighting and numerals.
      const center=rect.top+rect.height/2;
      const span=viewportHeight/2+rect.height/2;
      const relative=Math.max(-1,Math.min(1,(viewportHeight/2-center)/span));
      const direction=index%2?-1:1;
      section.style.setProperty("--pdt-scene-x",
        Math.round(direction*relative*(mobile?25:130))+"px");
      section.style.setProperty("--pdt-scene-y",
        Math.round(relative*(mobile?36:145))+"px");

      // New cinematic band passes through each section continuously.
      const progress=Math.max(0,Math.min(1,
        (viewportHeight-rect.top)/(viewportHeight+rect.height)));
      const {sweep,edge}=cinematicScenes[index];
      const horizontal=Math.round(direction*(progress-.5)*(mobile?66:130));
      const vertical=Math.round((progress-.5)*(mobile?44:88));
      sweep.style.transform="translate3d("+horizontal+"%,"+vertical+
        "px,0) rotate("+(direction*-9)+"deg)";
      edge.style.transform="scaleX("+
        Math.max(.08,Math.min(1,progress*2.1)).toFixed(3)+")";
      section.style.setProperty("--pdt-cinema-step",progress.toFixed(3));
    });

    cardRects.forEach((rect,index)=>{
      if(rect.bottom < -30 || rect.top > viewportHeight+30)return;
      const cardCenter=rect.top+rect.height/2;
      const distance=Math.abs(cardCenter-viewportHeight*.52);
      const range=viewportHeight*.63+rect.height*.42;
      const focus=Math.max(0,1-distance/range);
      cinematicCards[index].style.setProperty("--pdt-cinema-zoom",
        (mobile?.978+.022*focus:.95+.055*focus).toFixed(3));
    });

    if(journey){
      body.classList.toggle("pdt-show-journey",visibleChapter>=0);
      if(visibleChapter>=0){
        const step=visibleChapter+1;
        journeyCount.textContent=String(step).padStart(2,"0")+" / "+
          String(sceneSections.length).padStart(2,"0");
        journeyName.textContent=names[visibleChapter]||"PdT";
        journeyFill.style.transform="scaleY("+(step/sceneSections.length)+")";
      }
    }

    imageRects.forEach((rect,index)=>{
      if(rect.bottom < -40 || rect.top > viewportHeight+40)return;
      const imageCenter=(rect.top+rect.bottom)/2;
      const range=viewportHeight/2+rect.height/2;
      const relative=Math.max(-1,Math.min(1,
        (imageCenter-viewportHeight/2)/range));
      depthImages[index].style.setProperty("--pdt-image-shift",
        Math.round(-relative*(mobile?7:13))+"px");
    });
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
