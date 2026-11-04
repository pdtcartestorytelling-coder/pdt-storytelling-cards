"use strict";

/*
 * Guida PdT locale e gratuita: nessuna API, invio di messaggi,
 * analytics o archiviazione delle domande. Non è AI generativa.
 */
(() => {
  const language = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  const lang = ["it", "en", "es"].includes(language) ? language : "it";

  const copy = {
    it: {
      title: "Come posso aiutarti?", start: "Hai una domanda?", close: "Chiudi la guida",
      intro: "Sono una guida automatica, non un assistente AI. Posso aiutarti a trovare informazioni ufficiali sul prodotto PdT e sul suo utilizzo professionale.",
      prompt: "Oppure scrivi una domanda generale", placeholder: "Es. quante carte contiene?",
      send: "Invia", note: "Non inserire dati personali o sanitari. Le domande non vengono inviate o memorizzate. Questo strumento non fornisce consulenza clinica.",
      unknown: "Posso aiutarti a conoscere le tre edizioni PdT, il metodo, le applicazioni professionali e le modalità di richiesta informazioni. Prova una delle domande qui sopra.",
      special: "PdT è uno strumento narrativo professionale, non un test diagnostico e non offre consulenza clinica individuale.",
      specialLink: "Scopri il metodo", price: "Per prezzi, disponibilità e condizioni di acquisto aggiornate, contatta direttamente il progetto PdT. Il sito non riporta qui un prezzo verificato.",
      priceLink: "Richiedi informazioni", fallbackLink: "Vai ai contatti", contact: "contatti.html",
      topics: [
        { label: "Cosa contiene il kit?", keys: ["kit","contien","mazz","quante carte","quantita","manual","schede","prodott","bundle"], answer: "Ogni edizione PdT comprende 102 carte fotografiche (due mazzi da 51). Essential include manuale e 22 schede digitali; Studio comprende manuale e 22 schede stampate; Signature valorizza lo stesso kit completo con cofanetto e finiture premium.", link: "Confronta le edizioni", href: "pre-order.html" },
        { label: "Come funziona il metodo?", keys: ["metod","come funziona","storytelling","narrativ","immagin","fotograf","domand","esploraz"], answer: "Le fotografie sono stimoli aperti che favoriscono narrazione, ascolto e costruzione di significati. Le domande guida sostengono il processo senza attribuire significati prefissati alle immagini.", link: "Approfondisci il metodo", href: "metodo-pdt.html" },
        { label: "Si può usare individualmente?", keys: ["individual","singol","persona","uno a uno","1 a 1","colloquio"], answer: "Sì, in contesti professionali appropriati. Le 8 schede per il lavoro individuale accompagnano l'esplorazione narrativa; lo strumento viene integrato nel mandato e nelle competenze del professionista.", link: "Utilizzo individuale", href: "utilizzo-individuale.html" },
        { label: "Si può usare con i gruppi?", keys: ["grupp","team","equipe","équipe","collettiv","workshop"], answer: "PdT prevede 6 schede operative per il setting di gruppo, orientate a narrazione, ascolto e confronto tra punti di vista all'interno di un contesto professionale condiviso.", link: "Setting di gruppo", href: "setting-gruppo.html" },
        { label: "È utile per psicologi e psicoterapeuti?", keys: ["psicolog","psicoterap","terapeut","clinico","clinica"], answer: "PdT è rivolto anche a psicologi e psicoterapeuti come supporto narrativo e relazionale da integrare nel proprio setting. Non sostituisce test o strumenti diagnostici.", link: "Per psicologi e psicoterapeuti", href: "psicologi-psicoterapeuti.html" },
        { label: "Come si usa nelle Risorse Umane?", keys: ["risors","uman","lavoro","organizz","hr","selezion","aziend"], answer: "Sono previste 8 schede per i contesti Risorse Umane. Le carte possono sostenere la narrazione e il confronto in attività coerenti con il ruolo e il mandato del professionista.", link: "Per le Risorse Umane", href: "risorse-umane.html" },
        { label: "Come posso richiedere informazioni?", keys: ["acquist","ordin","compr","spediz","consegn","disponib","contatt","email","informaz"], answer: "Per conoscere meglio Essential, Studio o Signature e ricevere dettagli sulla disponibilità, consulta la pagina Pre Order o scrivi a pdtstorytellingcards@gmail.com.", link: "Scopri le edizioni", href: "pre-order.html" }
      ]
    },
    en: {
      title: "How can I help?", start: "Have a question?", close: "Close the guide",
      intro: "I'm an automated information guide, not an AI assistant. I can help you find official information about PdT and its professional uses.",
      prompt: "Or ask a general question", placeholder: "E.g. how many cards?",
      send: "Send", note: "Do not enter personal or health information. Questions are not sent or stored. This guide does not provide clinical advice.",
      unknown: "I can help you explore the three PdT editions, the method, professional uses and product enquiries. Please choose a question above.",
      special: "PdT is a professional storytelling tool, not a diagnostic test, and this guide cannot provide personal clinical advice.",
      specialLink: "Explore the project", price: "For current prices, availability and purchase terms, please contact PdT directly. No verified price is provided here.",
      priceLink: "Request information", fallbackLink: "Contact PdT", contact: "contact-en.html",
      topics: [
        { label: "What is included in the kit?", keys: ["kit","include","contain","deck","cards","how many","manual","product","bundle"], answer: "Each PdT edition includes 102 photographic cards (two decks of 51). Essential offers a digital manual and 22 digital sheets; Studio includes a printed manual and 22 printed sheets; Signature presents the same complete kit with premium packaging and finishes.", link: "Compare editions", href: "pre-order-en.html" },
        { label: "How does the method work?", keys: ["method","how does","storytell","narrativ","image","photo","question","explor"], answer: "Photographs provide open-ended prompts for storytelling, listening and exploring personal meanings. Guided questions support the process without prescribing what an image should mean.", link: "Learn about PdT", href: "home-en.html#project" },
        { label: "Can it be used individually?", keys: ["individual","one-to-one","one to one","single","session","personal"], answer: "Yes, in an appropriate professional setting. Eight activity sheets are intended for individual work; their use depends on the professional's role and agreed purpose.", link: "Explore PdT", href: "home-en.html#project" },
        { label: "Can it be used with groups?", keys: ["group","team","workshop","collective"], answer: "Six activity sheets are dedicated to group settings, supporting storytelling, listening and exchange of perspectives within an agreed professional framework.", link: "Explore PdT", href: "home-en.html#project" },
        { label: "Is it for psychologists?", keys: ["psycholog","psychotherap","therap","clinician","clinical"], answer: "PdT is designed for psychologists and psychotherapists as a narrative and relational resource to use within their professional practice. It does not replace diagnostic or psychometric tools.", link: "About the project", href: "about-en.html" },
        { label: "Can HR professionals use it?", keys: ["human resources","hr","workplace","organisation","organization","company","recruit"], answer: "PdT includes eight activity sheets for Human Resources contexts. Their use should be aligned with the professional's role and the purpose of the activity.", link: "About the project", href: "about-en.html" },
        { label: "How can I learn about availability?", keys: ["buy","purchase","order","ship","delivery","availab","contact","email","information"], answer: "Explore Essential, Studio and Signature on the Pre Order page, or email pdtstorytellingcards@gmail.com for information and availability.", link: "Explore editions", href: "pre-order-en.html" }
      ]
    },
    es: {
      title: "¿En qué puedo ayudarte?", start: "¿Tienes una pregunta?", close: "Cerrar la guía",
      intro: "Soy una guía informativa automática, no un asistente de IA. Puedo ayudarte a encontrar información oficial sobre PdT y sus aplicaciones profesionales.",
      prompt: "O escribe una pregunta general", placeholder: "Ej. ¿cuántas cartas hay?",
      send: "Enviar", note: "No introduzcas datos personales ni de salud. Las preguntas no se envían ni se guardan. Esta guía no ofrece asesoramiento clínico.",
      unknown: "Puedo ayudarte a conocer las tres ediciones PdT, el método, sus usos profesionales y cómo solicitar información. Prueba una pregunta de la lista.",
      special: "PdT es una herramienta narrativa profesional, no una prueba diagnóstica, y esta guía no puede ofrecer asesoramiento clínico personal.",
      specialLink: "Conoce el proyecto", price: "Para conocer precios, disponibilidad y condiciones de compra actualizados, ponte en contacto con PdT. Aquí no se indica ningún precio verificado.",
      priceLink: "Solicitar información", fallbackLink: "Contacta con PdT", contact: "contact-es.html",
      topics: [
        { label: "¿Qué incluye el kit?", keys: ["kit","incluy","contien","baraja","cartas","cuantas","cuantos","manual","producto"], answer: "Cada edición PdT incluye 102 cartas fotográficas (dos barajas de 51). Essential ofrece manual y 22 fichas digitales; Studio incluye manual y 22 fichas impresas; Signature presenta el mismo kit completo con caja y acabados premium.", link: "Compara ediciones", href: "pre-order-es.html" },
        { label: "¿Cómo funciona el método?", keys: ["metod","como funciona","narraci","historia","fotograf","imagen","pregunta"], answer: "Las fotografías son estímulos abiertos que favorecen la narración, la escucha y la exploración de significados. Las preguntas guía acompañan el proceso sin imponer interpretaciones.", link: "Conoce PdT", href: "home-es.html#project" },
        { label: "¿Sirve para trabajo individual?", keys: ["individual","uno a uno","una persona","sesion","personal"], answer: "Sí, en un contexto profesional adecuado. Ocho fichas están dedicadas al trabajo individual y deben utilizarse según la función y el encuadre del profesional.", link: "Conoce PdT", href: "home-es.html#project" },
        { label: "¿Se puede usar con grupos?", keys: ["grupo","equipo","taller","colectiv"], answer: "Seis fichas operativas están dedicadas a los contextos grupales para favorecer la narración, la escucha y el intercambio de perspectivas.", link: "Conoce PdT", href: "home-es.html#project" },
        { label: "¿Es para psicólogos?", keys: ["psicolog","psicoterap","terapeut","clinic"], answer: "PdT puede integrarse en el trabajo de psicólogos y psicoterapeutas como recurso narrativo y relacional. No sustituye herramientas diagnósticas ni psicométricas.", link: "Sobre el proyecto", href: "about-es.html" },
        { label: "¿Es útil en Recursos Humanos?", keys: ["recursos humanos","rrhh","empresa","organiz","trabajo","seleccion"], answer: "PdT incluye ocho fichas destinadas al ámbito de Recursos Humanos. Su utilización debe adaptarse al cometido y a las competencias profesionales.", link: "Sobre el proyecto", href: "about-es.html" },
        { label: "¿Cómo puedo solicitar información?", keys: ["compr","pedid","envio","entrega","disponib","contact","correo","informacion"], answer: "Conoce Essential, Studio y Signature en la página Pre Order o escribe a pdtstorytellingcards@gmail.com para consultar disponibilidad.", link: "Descubre las ediciones", href: "pre-order-es.html" }
      ]
    }
  };
  const t = copy[lang];
  const normalize = (value) => value.toLocaleLowerCase(lang).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const root = document.createElement("div");
  root.className = "pdt-guide";
  root.innerHTML =
    '<section id="pdt-guide-panel" class="pdt-guide__panel" hidden>' +
      '<div class="pdt-guide__header">' +
        '<div><span class="pdt-guide__eyebrow">PdT Storytelling Cards</span><strong class="pdt-guide__title"></strong></div>' +
        '<button type="button" class="pdt-guide__close" aria-label=""></button>' +
      '</div>' +
      '<div class="pdt-guide__body">' +
        '<p class="pdt-guide__intro"></p>' +
        '<div class="pdt-guide__choices"></div>' +
        '<div class="pdt-guide__answer" aria-live="polite" aria-atomic="true" hidden></div>' +
        '<form class="pdt-guide__form" autocomplete="off">' +
          '<label for="pdt-guide-input"></label>' +
          '<div class="pdt-guide__form-row"><input type="text" id="pdt-guide-input" maxlength="160" autocomplete="off" required /><button type="submit"></button></div>' +
        '</form>' +
        '<p class="pdt-guide__note"></p>' +
      '</div>' +
    '</section>' +
    '<button type="button" class="pdt-guide__toggle" aria-controls="pdt-guide-panel" aria-expanded="false"><span class="pdt-guide__symbol" aria-hidden="true">?</span><span class="pdt-guide__toggle-text"></span></button>';

  document.body.appendChild(root);
  const panel = root.querySelector(".pdt-guide__panel");
  const toggle = root.querySelector(".pdt-guide__toggle");
  const close = root.querySelector(".pdt-guide__close");
  const choices = root.querySelector(".pdt-guide__choices");
  const answer = root.querySelector(".pdt-guide__answer");
  const form = root.querySelector(".pdt-guide__form");
  const input = root.querySelector("#pdt-guide-input");
  root.querySelector(".pdt-guide__title").textContent = t.title;
  root.querySelector(".pdt-guide__intro").textContent = t.intro;
  root.querySelector(".pdt-guide__note").textContent = t.note;
  root.querySelector(".pdt-guide__form label").textContent = t.prompt;
  root.querySelector(".pdt-guide__form-row button").textContent = t.send;
  root.querySelector(".pdt-guide__toggle-text").textContent = t.start;
  input.placeholder = t.placeholder;
  close.textContent = "×";
  close.setAttribute("aria-label", t.close);
  toggle.setAttribute("aria-label", t.start);
  panel.setAttribute("aria-label", t.title);

  function show(message, label, href) {
    answer.replaceChildren();
    const p = document.createElement("p");
    p.textContent = message;
    answer.appendChild(p);
    if (label && href) {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      answer.appendChild(link);
    }
    answer.hidden = false;
  }

  function respond(raw) {
    const question = normalize(raw);
    if (/suicid|autoles|farmi del male|diagnos|terapia personale|clinical advice|self.harm|suicid|diagnos|diagnostic|psicoterap[ií]a personal|autolesi[oó]n/.test(question)) {
      show(t.special, t.specialLink, lang === "it" ? "metodo-pdt.html" : lang === "en" ? "home-en.html#project" : "home-es.html#project");
      return;
    }
    if (/prezz|cost[oia]|quant[oai] costa|tariff|price|cost|precio|cuanto cuesta|pagament|payment/.test(question)) {
      show(t.price, t.priceLink, t.contact);
      return;
    }
    const topic = t.topics.find((item) => item.keys.some((key) => question.includes(normalize(key))));
    if (topic) {
      show(topic.answer, topic.link, topic.href);
    } else {
      show(t.unknown, t.fallbackLink, t.contact);
    }
  }

  t.topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = topic.label;
    button.addEventListener("click", () => show(topic.answer, topic.link, topic.href));
    choices.appendChild(button);
  });

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? t.close : t.start);
    if (open) {
      close.focus();
    } else {
      input.value = "";
      answer.hidden = true;
      answer.replaceChildren();
      toggle.focus();
    }
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    input.value = "";
    if (question) respond(question);
  });

  root.addEventListener("click", (event) => {
    const link = event.target.closest(".pdt-guide__answer a");
    if (link && link.getAttribute("href")?.includes("#")) setOpen(false);
  });
})();
