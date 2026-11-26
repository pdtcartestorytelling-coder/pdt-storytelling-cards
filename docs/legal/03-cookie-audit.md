# PdT — audit cookie e tracciamento
26 novembre 2026 — verifica preliminare, non dichiarazione di conformità.

## Evidenza statica
Esaminati 37 file HTML (34 pagine elencate nella sitemap e tre informative privacy), cinque script (script.js, interest.js, pdt-shop.js, guida-informativa.js, pdt-motion.js) e sei fogli di stile (style.css, pdt-motion.css, pdt-shop.css, pdt-first-action.css, preorder.css, guida-informativa.css). Ricerca statica di indicatori comuni: cookie JavaScript, local/session storage, IndexedDB, analytics, pixel, iframe, richieste JS, import CSS remoti. Nessun indicatore di tracciamento rilevato nei controlli eseguiti. La ricerca di pattern non è una dimostrazione di assenza assoluta. Sitemap non necessariamente esaustiva. Manifest e CNAME controllati. Moduli email e guida locale non sono servizi di tracciamento di per sé.

## Verifica in esecuzione — NON COMPLETATA
Tentativo di accesso al dominio pubblico non riuscito (strumento web non raggiunge il sito; ambiente di test non risolve il dominio). Non sono stati verificati gli header HTTP, le richieste effettive, i cookie del browser o il pannello Cloudflare. Non concludere che il sito sia cookie-free.

## Checklist prima del merge
- [ ] Confermare hosting, DNS/proxy Cloudflare, impostazioni WAF/Bot Management, Web Analytics, Zaraz e altri servizi/iniezioni.
- [ ] Aprire il dominio pubblico in un profilo browser pulito, senza estensioni, controllare Network e Application/Storage, inclusi header Set-Cookie, richieste, cookie HttpOnly, local/session storage, IndexedDB, service worker.
- [ ] Ripetere per Home, Contatti, Pre Order, articoli e guide nelle tre lingue; navigare, usare selettore lingua e guida con dati fittizi, aprire la bozza email senza inviarla; verificare anche eventuali challenge di sicurezza e browser mobile.
- [ ] Inventariare ciascun cookie/strumento effettivo: nome, dominio, fornitore, finalità, durata, categoria, base/esenzione, trasferimenti se pertinenti.
- [ ] Se solo strumenti strettamente necessari: informativa specifica senza banner; se strumenti soggetti a consenso: blocco preventivo, scelta libera e granulare, rifiuto facile, revoca e prova del consenso.
- [ ] Coordinare con PR #47 e #48, estendere link a tutte le pagine nel footer legale, sostituire i segnaposto, revisione professionale.
- [ ] Ripetere audit prima di ogni nuova integrazione, anche pagamenti, analytics e account.

## Fonti
- Garante, Linee guida 10 giugno 2021: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- Garante, FAQ: https://www.garanteprivacy.it/faq/cookie
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Cloudflare, cookie: https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/

**Non pubblicare le bozze prima di completare i controlli.**
