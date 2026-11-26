# PdT — Sito 13: SEO e indicizzazione (bozza)

Base PR #79, Site Quality run 130 success. Audit documentale del candidato: 58 URL in sitemap, 19 gruppi trilingui e FAQ solo IT. Nessuna misurazione del sito live, Search Console, impression, volumi, posizione o concorrenza quantitativa. Ricerca qualitativa sulle espressioni del settore, non stima di domanda. Fonti: https://psicoludia.it/prodotto/carte-proiettive-di-story-and-therapy/ ; https://www.vic-italia.eu/le-immagini-come-strumento-clinico-e-simbolico-uso-delle-carte-e-delle-fotografie/ ; https://innovativeresources.org/resources/card-sets/picture-this/ ; https://www.ludoconsciencia.com/juegos/cartas-metaf%C3%B3ricas-asociativas-y-evocativas . Non copiare claim, nomi concorrenti o posizionamento diagnostico.

| Intento / pagina | IT | EN | ES | Priorità proposta |
|---|---|---|---|---|
| Home | carte fotografiche narrative | photo cards for storytelling | cartas fotográficas narrativas | Alta |
| Signature | kit carte fotografiche professionisti | professional photo card kit | kit de cartas fotográficas profesional | Alta |
| Psicologi | carte fotografiche per psicologi | photo cards for psychologists | cartas fotográficas para psicólogos | Alta |
| Gruppo | carte narrative lavoro di gruppo | storytelling cards group facilitation | cartas narrativas facilitación de grupos | Media |
| HR | carte narrative Risorse Umane | storytelling cards for HR | cartas narrativas RR. HH. | Media |
| Individuale | carte fotografiche lavoro individuale | photo cards individual storytelling | cartas fotográficas trabajo individual | Media |
| Metodo | fotografia narrazione ascolto | photography storytelling listening | fotografía narración escucha | Media |
| Risorse | guida narrazione immagini | visual storytelling resources | recursos narración con imágenes | Media |
| Pre Order | PdT Signature disponibilità | PdT Signature availability | PdT Signature disponibilidad | Alta, brand |
| Articoli | fotografia e narrazione | photography and storytelling | fotografía y narración | Informativa |

Priorità qualitativa per pertinenza e intento, non volume o difficoltà misurata. Escludere come target commerciale test proiettivi, diagnosi, trattamento trauma, fototerapia clinica validata, certificazioni o efficacia. Non introdurre meta keywords, keyword stuffing, pagine doorway, recensioni finte. Distinguere home (categoria), prodotto (kit), pre order (richiesta non vincolante), metodo (spiegazione), contesti (intento professionale), risorse (informativo).

## Implementazione
45 pagine con title/description/OG/JSON-LD coerenti; 12 articoli conservano metadata e Article originali, FAQ title aggiornato. 58 pagine indicizzabili con accesso alla biblioteca nel menu e collegamenti footer locali a Signature, Metodo, Risorse, Galleria. Pagine tecniche/privacy mantenute fuori da sitemap e noindex; nessuna modifica dei testi legali. Canonical e hreflang preesistenti da validare con test; sitemap esplicita con alternate reciproci e x-default, FAQ solo IT; lastmod aggiornato per i link/metadata modificati. robots.txt già corretto, invariato. WebSite, WebPage, CollectionPage, AboutPage, ContactPage, Article; Product descrittivo come mainEntity solo sulle pagine Signature, senza Offer, rating, disponibilità o prezzo strutturato. Non promettere rich result: dati prodotto incompleti ai fini dei risultati avanzati. Nessun merchant listing, FAQ rich result, certificazione, Organization con identità giuridica inventata. Noindex non protegge materiali riservati: PR e repo pubblici.

## Search Console (solo piano, non attiva)
Dopo autorizzazione al deploy e verifica DNS/HTTPS, accedere a https://search.google.com/search-console/ con account del gestore autorizzato (2FA, permessi minimi). Aggiungere proprietà Dominio pdtstorytellingcards.com; generare record TXT da Google, inserirlo solo con autorizzazione in DNS autorevole, senza pubblicare credenziali o token nel repo. Verificare proprietà, mantenere record. Inviare https://pdtstorytellingcards.com/sitemap.xml una volta pubblicato. Controllare URL inspection delle pagine principali IT/EN/ES, canonical scelto, indicizzazione, robots, sitemap e Core Web Vitals. Non inviare sitemap del candidato non pubblicato. Misurare query, impression, clic, CTR, posizione media per pagina/lingua e trend a 28/90 giorni; non promettere ranking o indicizzazione. Nessun record DNS, proprietà, verifica, richiesta indicizzazione, Google Analytics, GTM o raccolta dati attivati.

Fonti tecniche ufficiali: https://developers.google.com/search/docs/specialty/international/localized-versions ; https://developers.google.com/search/docs/appearance/title-link ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/fundamentals/get-started ; https://support.google.com/webmasters/answer/9008080 ; https://support.google.com/webmasters/answer/7451001 .

QA: test canonical, sitemap, hreflang, title/description unici, JSON-LD, noindex, link menu/footer e browser. CI da verificare; resa menu mobile e contrasto footer, audit live, credenziali/diritti, revisione articoli e traduzioni, gate #67–79 e approvazione autori prima del rilascio. Nessun merge/deploy.
