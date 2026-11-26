# PdT — sicurezza e protezione dei dati
26 novembre 2026 — bozza, controlli esterni non completati.

## Modifiche
Sei moduli Contatti/Pre Order: metodo POST di riserva, blocco delle sottomissioni HTML tramite CSP form-action 'none', controlli inizialmente disabilitati e attivati soltanto dopo la registrazione del gestore submit; link email di riserva. Validazione dei campi e distinzione presa visione/consenso mantenute. Nessun servizio esterno, database, tracker o pagamento aggiunto. Il mailto contiene dati nella URI gestita dall'app email, non in una query HTTP; non garantisce cifratura end-to-end o riservatezza dell'email. Non inviare dati sanitari o riservati. Coordinare avvertenze PR #47.

## Verifiche
Test automatico Chromium aggiunto a Site Quality: sei pagine, funzionamento normale, JS disattivato, script bloccato, annullamento submit non valido e blocco della sottomissione HTML nativa con dati fittizi. Verificare anche la bozza email effettiva, tastiera, mobile e browser diversi con dati fittizi. Nessun test pubblico o controllo account effettuato; non dichiarare l'assenza di incidenti passati o la conformità definitiva.

## Misure organizzative da attuare privatamente
- [ ] Verificare Enforce HTTPS GitHub Pages, certificato, redirect HTTP, DNS e proxy effettivi. Verificare TLS, CSP e header HTTP; frame-ancestors/X-Frame-Options, nosniff, Permissions-Policy e HSTS sul livello che serve le risposte; HSTS solo dopo verifica HTTPS e sottodomini.
- [ ] Verificare WAF/Cloudflare, se attivo, senza introdurre tracker; coordinare audit cookie #49.
- [ ] 2FA/passkey su GitHub, posta, registrar e Cloudflare; account nominativi, privilegi minimi, revoca accessi, recovery codes in password manager; nessuna credenziale nel repository.
- [ ] Verificare protezione main e revisione PR/CI prima del deploy, autorizzazioni GitHub Actions e collaboratori.
- [ ] Controllo privato di file e cronologia del repository, segreti e dati personali; se un segreto risulta esposto, revocarlo/ruotarlo prima di gestire la cronologia. Non pubblicare risultati sensibili.
- [ ] Posta e archivi clienti: accesso limitato, cifratura dei dispositivi, aggiornamenti, conservazione e cancellazione, backup protetti con prove di ripristino; verificare condizioni/DPA del provider.
- [ ] Designare referente incidenti e sostituto; registro incidenti privato, conservazione delle evidenze, contenimento, valutazione del rischio e revisione delle misure.
- [ ] In caso di violazione di dati personali: documentare tutte le violazioni, notificare al Garante senza ingiustificato ritardo e ove possibile entro 72 ore dalla conoscenza salvo improbabilità del rischio; informare gli interessati senza ingiustificato ritardo se rischio elevato salvo eccezioni di legge (artt. 33–34 GDPR).
- [ ] Prima di Stripe/Make/Excel/OneDrive/Sendcloud/fatturazione: valutare fornitori e trasferimenti, accessi minimi, segreti lato server, firme webhook e idempotenza, separazione ambiente test/produzione, backup, cancellazione e audit. Non archiviare dati di carta o clienti in GitHub pubblico.
- [ ] Revisionare periodicamente le misure e prima di ogni nuova integrazione, ai sensi dell'art. 32 GDPR.

## Riferimenti
- GDPR artt. 25, 32–34: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- MDN CSP form-action: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action
- GitHub HTTPS: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

Non unire prima del collaudo e del coordinamento con le altre PR. Nessun segreto, dettaglio di accesso o dato reale va inserito qui.
