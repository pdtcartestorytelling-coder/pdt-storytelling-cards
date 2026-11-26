# PdT — budget Make, collaudo e rilascio
26 novembre 2026 — modello non operativo. Nessuna sottoscrizione, connessione o esecuzione Make attivata.

## Crediti e costi
Listino ufficiale consultato 26/11/2026: Free 1.000 crediti/mese; i piani a pagamento e i costi dipendono da volume, durata e condizioni esposte al momento dell'acquisto. La pagina consultata non ha restituito prezzi numerici dei piani a pagamento: non inventarli. Verificare anche numero scenari attivi, intervallo minimo, API, log, ruoli e storage. Most non-AI modules use 1 credit per operation; trigger polling usa normalmente un credito anche senza risultati; moduli successivi possono essere eseguiti per ogni bundle. Alcune funzionalità hanno costo differente; router ed error handler specifici non consumano direttamente crediti secondo listino, ma operazioni ripetute sì. Nessun modulo AI previsto.
Esempio polling continuo ogni 15 minuti per 30 giorni: 2.880 esecuzioni del solo trigger, oltre quota Free; ogni ora: 720; una volta al giorno: 30. Non usare polling indiscriminato. Preferire eventi autenticati o task approvati e batch mirati; misurare crediti reali.
Simulazione esclusivamente di dimensionamento (non conteggi osservati):
- richiesta commerciale: 4 crediti stimati
- ciclo ordine fisico, compresi aggiornamenti e notifiche: 25 crediti stimati
- pratica post-vendita: 10 crediti stimati
- eventi marketing: 5 crediti stimati ciascuno, escludendo campagne bulk da stimare separatamente
- licenza digitale: 6 crediti stimati ciascuna, non attiva
- riconciliazioni/monitoraggio: 150 crediti/mese stimati
- margine prudenziale 25% per ripetizioni, errori e crescita.
| Scenario 30 giorni | Richieste | Ordini | Pratiche | Marketing | Licenze | Base | Con margine 25% (arrotondato per eccesso) |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pilot leggero | 20 | 10 | 2 | 0 | 0 | 500 | 625 |
| Lancio | 100 | 50 | 5 | 0 | 0 | 1850 | 2313 |
| Crescita | 200 | 100 | 10 | 40 | 0 | 3750 | 4688 |
Non sono previsioni di vendita; costo reale dipende da bundle, frequenza, connettori, retry, polling e provider. Free candidato solo per pilot sintetico limitato se funzionalità disponibili; verificare vincolo scenari. Sottoscrizione a pagamento solo dopo autorizzazione e misurazione; non abilitare extra automatici. Esaurimento crediti sospende esecuzioni e code Make sono limitate: backend conserva job e consente fallback. Costi Stripe, Fatture in Cloud, Sendcloud, Microsoft, backend, email e storage sono separati; non confondere crediti Make con costo totale.
Fonti: https://www.make.com/en/pricing ; https://help.make.com/how-features-use-credits ; https://help.make.com/step-10-schedule-your-scenario .

## Test di accettazione integrata, tutti DA ESEGUIRE
| ID | Scenario | Esito atteso |
|---|---|---|
| M01 | Richiesta valida / duplicata | Una pratica, risposta da approvare |
| M02 | Email modificata o contenente dati di terzi | Revisione, minimizzazione, nessuna iscrizione |
| M03 | Proposta scaduta / non accettata | Nessun ordine vincolante o pagamento |
| M04 | Due ordini concorrenti ultima unità | Una sola riserva valida |
| M05 | Redirect successo senza pagamento | Nessuna evasione |
| M06 | Webhook falso o ambiente errato | Rifiuto e audit minimo |
| M07 | Evento doppio / fuori ordine | Nessun effetto duplicato, stato verificato |
| M08 | Pagamento errato o tardivo | Hold e revisione |
| M09 | B2C senza fattura / B2B con fattura | Regola fiscale approvata, niente duplicazione ricavi |
| M10 | Timeout creazione documento / scarto SdI | Verifica prima retry, gestione separata |
| M11 | Collo non misurato o lotto bloccato | Nessuna label |
| M12 | Timeout label / trigger concorrente | Una sola azione per collo |
| M13 | Label creata ma non affidata | Non segna spedito |
| M14 | Tracking ripetuto / consegna contestata | Nessuna notifica doppia, pratica corretta |
| M15 | Rimborso pending, duplicato o chargeback | Verifica residuo/stato, nessun doppio effetto |
| M16 | Marketing pending/non confermato | Nessuna campagna |
| M17 | Revoca durante campagna o provider indisponibile | Blocca invii futuri; fallback immediato |
| M18 | Riscatto licenza concorrente / accesso abusivo | Backend nega duplicazione e accesso |
| M19 | 401/403, 429, 5xx | Classificazione errori e retry sicuri |
| M20 | Crediti esauriti/coda piena | Job persistenti, alert indipendente, fallback |
| M21 | Interruzione dopo effetto esterno prima ACK | UNKNOWN e riconciliazione prima retry |
| M22 | Riavvio dopo ripristino backup | Nessuna riattivazione revoche o doppie operazioni |
| M23 | Dati eccedenti o segreti in log/blueprint | Blocco release, rimozione e rotazione se necessario |
| M24 | Kill switch e ripresa controllata | Stop nuovi effetti, gestione obblighi esistenti, riconciliazione |
Testare con dati sintetici e mock, sandbox Stripe ove autorizzata; non trasmettere SdI, creare etichette fatturabili, effettuare pagamenti/rimborsi, inviare email reali o creare account clienti. Registrare esiti, versione, prova, data, approvatore e crediti misurati in archivio privato. Non importare blueprint non validati.

## Gate rilascio
- [ ] Approvazione venditore, condizioni fiscali/legali, sicurezza prodotto, privacy e processi (#47–64).
- [ ] Scegliere piano, regione e account; DPA/trasferimenti, accessi minimi, MFA, audit log e retention; budget massimo e responsabile.
- [ ] Configurare backend/ledger e mock, scenari separati, contratti API versionati e test; nessun segreto in GitHub pubblico.
- [ ] Verificare M01–M24, test specifici #62–64, continuità, kill switch, scadenze e fallback; approvare pilot limitato separatamente.
- [ ] Attivare singolarmente solo gli scenari approvati, con monitoraggio e rollback. Registrare revisioni e blueprint redatti in archivio privato, riesaminare costi e permessi periodicamente.
Nessuna automazione eseguita in questa PR. Coordinare tutte le bozze nel Punto 20 prima di pubblicare o attivare.
