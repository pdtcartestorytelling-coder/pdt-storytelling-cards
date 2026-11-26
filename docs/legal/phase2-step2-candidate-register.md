# PdT — Fase 2 / Step 2: ramo candidato vetrina
26 novembre 2026 — candidato tecnico, NON APPROVATO e NON pubblicabile.
Base osservata: b1830b239151e4851bd1d5350d11adccb8efed55. Ramo release/vetrina-candidate-20261126. PR originarie conservate; non unire su main prima di approvazione separata. Questo registro documenta integrazione selettiva, non merge integrale di tutte le PR. Riferimento audit storico #66 (risultati CI poi aggiornati nello Step 1: #53 run 45875204546, #65 run 45872969370, #66 run 45873708016 tutti success).
## Matrice dei 14 percorsi condivisi
| Percorso | Integrato nel candidato | Differito |
|---|---|---|
| index.html, home-en.html, home-es.html | #54 CTA e prezzi, #53 skip/menu/lang/main, #58 limite professionale contestuale | link a nuove pagine legali #48–51/#58 |
| pre-order.html, pre-order-en.html, pre-order-es.html | #54 prezzi e richiesta non vincolante, #52 POST/CSP/guard e fallback, #53 skip/menu/main, #47 minimizzazione, #58 avvertenza | #59 raccolta marketing sospesa; link #48/#55–58 |
| contatti.html, contact-en.html, contact-es.html | #52 guard modulo e CSP, #53 skip/menu/main/live status, #47 nota dati; redirect contatti-acquista | informativa sostitutiva #47 |
| script.js | #53 head 04aa9ada8dc1d6f5ab033047a7cff845501a44ad (focus e menu) + #52 handler/abilitazione | nessuno per le funzioni selezionate |
| interest.js | #54 copy + #52 enable dopo listener; rimosso campo/riga marketing | #59 metadata/consensi fino approvazione processo |
| guida-informativa.js | #53 live region + #54 prezzi/Signature + #58 special/HR; fallback aggiornati | nessun link a pagina professionale incompleta |
| scripts/check_site.py | #54 controlli e cache aggiornate + gate candidati | #59 test consenso attivo sostituito da controllo assenza raccolta |
| .github/workflows/site-quality.yml | #52 form_security + #53 accessibility_smoke + #54 browser_smoke/check_site, controlli sintassi e AVIF conservati | #59 test marketing positivo non applicabile finché raccolta sospesa |
## File unici
#53 CSS e motion con fix Step 1; #54 CSS/JS shop e browser smoke; #52 guida sicurezza e form regression; #47 redirect; #58 nove pagine editoriali/metodo/FAQ/usi professionali con testi contestuali e senza link a pagina bozza. Versioni condivise: style 22, script 12, motion CSS 10, interest 13, shop CSS 7, shop JS 5, guida JS 5. Aggiornamento riferimenti nelle pagine esistenti, incluse privacy attuali (solo versioni asset).
## Cosa NON è integrato
Pagine legali con dati da verificare #47–51/#55–58 restano nelle PR originali; nessun footer verso bozza, privacy esistente mantenuta temporaneamente, da sostituire solo dopo completamento. Test marketing #59 conservato sul ramo originale, non attivo nel candidato; nessuna cancellazione preferenze storiche. Documenti di lavoro #49–66 restano referenziabili nei rami originali, non copiati nel pacchetto vetrina. Nessuna vendita, login, pagamento, newsletter, Make, CRM, Fatture in Cloud, Sendcloud, dati reali o servizi attivati. Nessuna nuova classificazione, origine o specifica prodotto confermata. Test CI del candidato da verificare prima di qualsiasi rilascio.
## Blocco rilascio
Identità titolare/gestore, privacy e dati reali fornitori/cookie, diritti autori, destinazione e claim, 22 schede e origine, natura offerta e art.4/19 GPSR, prezzi e IVA, traduzioni e footer definitivo da approvare nello Step 3. Verifiche manuali/assistive technology e runtime, asset/storia Git, collaudo dopo revisione e approvazione esplicita nello Step 4/5. Nessun merge automatico. Se dati GPSR necessari per offerta e mancanti, sospendere o riformulare prima di pubblicare. Nessuna attestazione di conformità.
