# PdT — pubblicazione contenuti riservati e piano di collaudo
26 novembre 2026 — modello non operativo. Nessun PDF originale, account, codice o provider attivato.

## Catalogo candidato, non promessa commerciale
| ID candidato | Materiale | Stato |
|---|---|---|
| MAN-01 | Manuale teorico-operativo, 60 pagine dichiarate | Diritti, versione, formato e accessibilità da verificare |
| IND-01 | Schede individuali (8 previste) | Verifica autori e permessi stampa |
| GRP-01 | Schede gruppo (6 previste) | Verifica autori e permessi stampa |
| HR-01 | Schede HR (8 previste) | Revisione destinazione e claim #58 |
| PHOTO | 102 fotografie | Non previste come download separato nella proposta; diritti da verificare |
La suddivisione 8/6/8 deriva da bozze precedenti, confermare materiale effettivo e distinzione schede integrate/separate. Non promettere traduzioni dei materiali solo perché il sito ha tre lingue.
Registro privato per documento: ID/versione, autore e titolare, prova diritti e autorizzazioni per distribuzione digitale, crediti, lingua, checksum, stato approvazione, accessibilità, scope, data rilascio, aggiornamenti/supporto. Verificare anche immagini, font, liberatorie e fonti. File originali e prove riservate fuori dal repository pubblico. PDF con testo selezionabile, tag/ordine di lettura e alternative pertinenti; verificare tecnologie assistive e diritto di accesso; eventuale HTML accessibile. 
Audit prima del lancio: elenco file/asset del sito, rami, storia Git, release/artifact CI e storage pubblico, CDN e indicizzazione. Nessun audit completo svolto in questa PR. Se materiale riservato già esposto, limitare accesso, valutare rimozione/copie e incidenti, ruotare eventuali segreti; riscrittura storia non garantisce cancellazione da fork/cache e richiede approvazione separata. Il vecchio documento delle tre edizioni contiene anche stime interne pubbliche: non riprodurle nei nuovi file, sottoporre a revisione di pubblicabilità; nessuna cancellazione eseguita.

## Fasi e costi
A — approvazione contrattuale, catalogo, titolarità e durata; nessun costo assunto.
B — prototipo isolato con file fittizi, confronto provider auth/database/storage gestiti, verifica contratti, costi mensili e per utenti, storage, traffico, email, backup e assistenza. Nessun prezzo provider assunto, nessun servizio scelto. 
C — collaudo e pilot chiuso autorizzato; nessun utente reale prima dei gate. 
D — lancio dopo approvazione; aggiorna sito, CGV, privacy, cookie, fiscalità, accessibilità, sicurezza e procedure. Prevedere piano di continuità, export dati e materiali e supporto se servizio termina. Nessun abbonamento o canone cliente introdotto.

## Scenari di accettazione (sintetici, non eseguiti)
| ID | Scenario | Esito atteso |
|---|---|---|
| D01 | Registrazione/email non verificata | Nessun riscatto |
| D02 | Codice valido e ordine eleggibile | Un entitlement associato una volta |
| D03 | Codice errato, revocato, non ancora eleggibile | Rifiuto neutro |
| D04 | Due utenti riscattano in parallelo | Un solo commit valido |
| D05 | Retry dopo timeout | Nessuna licenza duplicata |
| D06 | Tentativi massivi/enumerazione | Rate limit e alert proporzionati |
| D07 | Utente A tenta documento di B / ID alterato | Accesso negato server-side |
| D08 | URL storage diretto senza autorizzazione | Negato |
| D09 | URL firmato scaduto, logout, revoca | Nessun nuovo accesso; verificare finestra residua link già emessi |
| D10 | Cookie/session fixation, CSRF, XSS | Controlli attivi, sessione ruotata |
| D11 | Reset password e cambio email, replay token | Verifica, uso singolo, scadenza, revoca sessioni pertinenti |
| D12 | Codice perso/rubato, regalo o trasferimento ammesso | Recupero documentato senza duplicati |
| D13 | Ordine rimborsato/contestato | Valutazione contrattuale, no revoca automatica illegittima |
| D14 | Recesso fisico dopo accesso PDF | Nessuna perdita automatica del diritto; gestione conforme |
| D15 | Richiesta anticipata digitale e conferma durevole | Prova distinta e versionata quando applicabile |
| D16 | Guasto storage/provider o migrazione | Ripristino, accessi corretti, rimedi/continuità |
| D17 | Backup con vecchi stati o account cancellato | Nessuna riattivazione indebita |
| D18 | Admin/supporto tenta azione non autorizzata | Negata, audit minimo |
| D19 | Tastiera, screen reader, contrasto, mobile, PDF | Accesso fruibile, alternativa appropriata |
| D20 | Segreti/file riservati in build, log, CDN o repository | Blocco release e correzione |
| D21 | Revoca marketing e chiusura account | Nessun marketing; diritti contrattuali/obblighi preservati |
| D22 | Aggiornamento documento e condizioni | Versione, informazione e diritti rispettati |
Non usare codici o dati reali, nessuna email commerciale inviata. Test unitari, integrazione, sicurezza (OWASP), browser e assistive technology da eseguire su ambiente dedicato; registrare esiti, evidenze, versione e approvatore.

## Gate finale
- [ ] Autori approvano diritti, catalogo, modalità uso, durata e stampa.
- [ ] Legale/fiscale confermano licenze, bundle, recesso, garanzia e IVA digitale; no promesse retroattive.
- [ ] Provider approvati, DPA/trasferimenti, privacy e cookie aggiornati; backend, DB, storage e auth configurati in privato.
- [ ] Audit esposizione, minacce, permessi, recovery, backup e accessibilità; test D01–D22 superati e difetti risolti.
- [ ] Pilot autorizzato, assistenza e rollback pronti, approvazione finale. Coordinare PR #47–63. Non pubblicare pagina login fittizia o codice attivazione prima dell'operatività. 
Fonti: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html ; https://www.w3.org/WAI/standards-guidelines/wcag/ ; https://eur-lex.europa.eu/eli/dir/2019/770/oj?locale=it .
