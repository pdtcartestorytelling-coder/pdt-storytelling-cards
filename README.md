# PdT Storytelling Cards

Sito ufficiale statico di **PdT Storytelling Cards**, pubblicato tramite GitHub Pages.

## Sito online

https://pdtstorytellingcards.com/

## Struttura

Il sito è realizzato in HTML, CSS e JavaScript e include:

- Home IT / EN / ES;
- Chi siamo IT / EN / ES;
- Articoli e pubblicazioni IT / EN / ES;
- Contatti IT / EN / ES, separati dalla pagina Pre Order;
- Pre Order IT / EN / ES, con anteprima del bundle e informazioni sul lancio (nessun pagamento attivo);
- Privacy Policy IT / EN / ES;
- sitemap.xml e robots.txt;
- favicon e web manifest;
- pagina 404;
- modulo contatti con validazione client-side e invio tramite app email dell’utente;
- pagine di conferma invio;
- configurazione per dominio custom tramite `CNAME`.

## Dominio

Dominio principale:

`pdtstorytellingcards.com`

Il file `CNAME` deve rimanere nel repository per mantenere il collegamento con GitHub Pages.

## Modulo contatti

Il modulo non usa servizi esterni di inoltro. Al submit prepara un'email tramite `mailto:` indirizzata a:

`pdtstorytellingcards@gmail.com`

L'utente deve confermare l'invio dalla propria applicazione email.

## Sicurezza

Il repository contiene anche `SICUREZZA-SETUP.txt` con le impostazioni consigliate lato Cloudflare/GitHub.

Non inserire mai nel repository pubblico:

- password;
- API key;
- token;
- credenziali account;
- dati personali non destinati alla pubblicazione.

## Pubblicazione / aggiornamento — BLOCCATA NEL CANDIDATO

Non copiare tutti i file del repository sul sito. Questo ramo contiene bozze non approvate. Seguire esclusivamente il registro finale `docs/commercial/site-15-release-audit-20261127.md`: approvazioni, pacchetto web verificato, PR finale verso main, autorizzazione esplicita, verifica deployment e rollback. Non cambiare GitHub Pages, DNS, CNAME o servizi in questa fase. Nessuna credenziale o dato reale nel repository pubblico.

## Pacchetto di collaudo isolato — NO-GO

`python3 scripts/build_release_qa.py --out /percorso/nuovo/pdt-qa` genera solo un tree di test fuori dal repository, non un pacchetto pubblicabile. La CI verifica il tree isolato. Le tre privacy obsolete e il PDF preliminare sono eccezioni QA, non approvazioni. Non copiare il tree QA su Pages. Vedere `docs/commercial/phase4-step05-release-package-20261127.md`.

## SEO

Sono presenti:

- canonical;
- meta title e description;
- hreflang IT / EN / ES;
- sitemap.xml;
- robots.txt;
- favicon per browser e risultati di ricerca.

Dopo modifiche importanti alle pagine è possibile richiedere una nuova scansione tramite Google Search Console.

## Nota privacy

La Privacy Policy deve essere aggiornata se vengono aggiunti nuovi servizi esterni, analytics, newsletter, sistemi di pagamento, account utente o altre funzionalità che trattano dati personali.

## Fase attuale — raccolta d'interesse

Da ottobre 2026 PdT è nella fase di finalizzazione e prime prove; nessun ordine, prenotazione o pagamento è attivo. Il modulo della pagina Pre Order prepara una email strutturata che il visitatore deve inviare manualmente. Non esiste ancora un database pubblico/automatico dei lead. Prima di attivarlo serve scegliere un provider, configurare un modulo sicuro e verificare informativa privacy e consenso comunicazioni. Vedere `docs/PDT_PIANO_VALIDAZIONE_MARKETING_2026.md`.

## Essential / Studio / Signature

Tre edizioni di PdT: Essential (carte e risorse digitali), Studio (manuale e 22 schede stampate), Signature (lo stesso kit cartaceo con finiture e cofanetto premium). Accesso digitale con licenza personale previsto. Nessuna autenticazione o licenza attiva. Dettagli in `docs/PDT_TRE_VERSIONI_LICENZE.md`.

## Controlli qualità (novembre 2026)

`python3 scripts/check_site.py` controlla gli HTML, i collegamenti locali, le ancore, le risorse, la sitemap e le tre edizioni Pre Order. `node --check script.js && node --check interest.js && node --check guida-informativa.js` valida la sintassi JavaScript. La verifica viene eseguita anche dalla GitHub Action `Site Quality`.

I rendering approvati sono pubblicati come **tre immagini distinte**, ciascuna in formato AVIF e WebP con risoluzione 960 × 720: `images/pdt-essential-hq.*`, `images/pdt-studio-hq.*` e `images/pdt-signature-hq.*`. Le schede hanno un link all'immagine in grande e fallback WebP per la compatibilità. L'atlante originale `images/pdt-editions-hq.avif` rimane come sorgente; per generare di nuovo le immagini: `npm install --no-save sharp@0.34.4 && node scripts/export-edition-images.cjs`.

L'avviso privacy intrusivo è stato rimosso: la policy resta disponibile nel footer e nei moduli, senza introdurre tracciamento o cookie non essenziali.
