# PdT — accessibilità web
26 novembre 2026 — audit preliminare, non dichiarazione di conformità.

## Obiettivo e perimetro
WCAG 2.2 AA come obiettivo volontario. D.Lgs. 82/2022 ed EAA: servizi interessati dal 28 giugno 2025, inclusi servizi di commercio elettronico; verificare effettiva applicabilità, natura B2C del servizio ed eventuale esenzione microimpresa (meno di 10 addetti e fatturato oppure bilancio annuo non superiore a 2 milioni EUR). Non presumere esenzione o conformità. Verificare anche eventuali altri obblighi e il riferimento tecnico applicabile con professionista.

## Evidenze e interventi
Analisi statica di Home, Contatti e Pre Order in IT/EN/ES: lang, H1, alt presenti, campi con label; assente skip link. Modificati nove HTML con skip link statico e target main focusabile, lingua dei link e indicazione lingua attiva, etichette landmark tradotte, annunci status Contatti. CSS condiviso: focus a due colori, fallback navigazione mobile in flusso senza JS, contenuti reveal visibili se non inizializzati, focus-within visibile, bordo campi più contrastato e alcune etichette scure su fondo chiaro. Menu chiudibile con Escape e focus restituito. Tolte animazioni decorative infinite ambientali e fluttuazione continua; restano entrate brevi e animazioni legate allo scroll, da valutare. Guida: regione live disponibile prima della risposta. Nessun cambio a contenuti commerciali, prezzi, dati o invio.
Aggiunto test Chromium su nove pagine, da eseguire in CI. Le modifiche condivise si estendono alle pagine che caricano i file aggiornati; skip link statici e semantica modificati soltanto nelle nove pagine. Le nuove pagine legali delle PR precedenti richiedono integrazione equivalente. Non è stato svolto audit completo o test con tecnologie assistive reali.

## Checklist prima del rilascio
- [ ] CI verde, verificare skip link, focus, menu Escape, navigazione senza JS, reduced motion e annunci della guida.
- [ ] Coordinare PR #47–52, in particolare versione script, moduli fail-closed #52, workflow e controllo statico; ripetere test sul ramo integrato. Non sovrascrivere fix sicurezza.
- [ ] Estendere skip link e semantica a tutte le pagine effettive incluse pagine legali, aggiornare versioni cache condivise.
- [ ] Audit automatico axe/Lighthouse e revisione manuale WCAG 2.2 AA, pagine e stati dinamici.
- [ ] Verificare contrasto testo 4.5:1 (3:1 per testo grande), componenti e stati 3:1 ove applicabile, inclusi gradienti, immagini, hover e focus; non assumere che tutto sia conforme.
- [ ] Verificare tastiera e ordine focus, focus non oscurato da header/CTA/guida, assenza di trappole, target minimi 24x24 CSS px salvo eccezioni.
- [ ] Zoom 200%, reflow a 320 CSS px, spaziatura testo, landscape e mobile, nessuna perdita di contenuto; controllare eventuale overflow nascosto.
- [ ] NVDA/Firefox o Chrome, VoiceOver/Safari, TalkBack/Chrome; verificare qualità alt, struttura titoli, nomi/ruoli, errori dei moduli, annunci e cambio lingua.
- [ ] Verificare riduzione movimento, animazioni su scroll, contrasto forzato e leggibilità dei documenti futuri.
- [ ] Predisporre informazioni sull'accessibilità e canale feedback nella forma applicabile dopo audit; non dichiarare conformità prima della verifica.
- [ ] Verificare accessibilità end-to-end delle future integrazioni pagamento, checkout, email, account, fatture e PDF; ripetere a ogni modifica.

## Fonti
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- AgID FAQ: https://accessibilita.agid.gov.it/domande-frequenti/
- Direttiva UE 2019/882: https://eur-lex.europa.eu/eli/dir/2019/882/oj?locale=it

Non unire prima del collaudo e del coordinamento delle altre PR. Nessuna attestazione di conformità.
