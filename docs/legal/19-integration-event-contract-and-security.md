# PdT — contratto eventi, sicurezza e resilienza
26 novembre 2026 — specifica non implementata. Nessun endpoint, token, webhook URL o credenziale reale. GitHub pubblico contiene solo modelli.

## Autorità dei dati e confini
Backend/database transazionale: ordine, riserva, ledger azioni, entitlement. Stripe: pagamento/rimborso/contestazione. Fatture in Cloud e ricevute SdI: documento fiscale. Sendcloud/vettore: stato collo e tracking, affidamento verificato. Registro consensi privato: prova, revoca e soppressione. Identity provider: identità/sessione. Excel Online: proiezione amministrativa e report, non lock, ledger o controllo autorizzazioni. Make: orchestratore, non fonte autorevole. Niente segreti o dati di carte, pazienti, candidati, dipendenti, file riservati o codici licenza nei payload, log o repository.
Provider callback -> verifica firma/raw body/account/ambiente nel backend -> inbox durevole -> controllo provider e transazione -> outbox -> Make autenticato -> comando ristretto al backend/provider autorizzato -> verifica stato e ledger. Non inviare direttamente webhook pubblici non verificati a scenari che eseguono effetti. Opzione preferita: Make recupera job dal backend con identità a privilegi minimi; eventuale push autenticato da validare, senza fidarsi del solo URL segreto. ACK Make non equivale a effetto completato.

## Envelope candidato (esempio sintetico, non schema ufficiale Make)
{"schema_version":1,"event_id":"evt_demo_001","event_type":"order.payment_verified","environment":"test","occurred_at":"2026-11-26T12:00:00Z","correlation_id":"corr_demo_001","aggregate_id":"ord_demo_001","aggregate_version":3,"source":"pdt_backend","payload":{"order_id":"ord_demo_001","amount_minor":17900,"currency":"EUR"}}
Schema allowlist, enum, interi centesimi, versione, dimensione massima, validazione timestamp, scoping account/tenant. Envelope non è prova di pagamento: backend verifica autorevolezza. Auth di trasporto TLS e identità servizio/firma timestamp+nonce dove supportata, protezione replay. Segreti nel vault o connessioni gestite, OAuth scope minimi, MFA, account nominativi, separazione test/live, rotazione e revoca. Non mettere chiavi o header nei blueprint export; ispezionare e redigere prima di archiviare.
Job lifecycle: queued -> leased -> running -> succeeded / retry_wait / unknown / manual_review / dead_letter / cancelled. Lease e scadenza con fencing/lock lato backend, evitare sovrapposizione; non fare affidamento solo su elaborazione sequenziale Make. Vincolo univoco action_key, eventi duplicati/distinti con stesso effetto, versione aggregato e stato corrente per fuori ordine. Registro durevole prima ACK; outbox persistente, eventuale replay controllato. Stato unknown se esito provider ambiguo; controllare esistenza/ID/riconciliazione prima retry. Mai chiamare due volte per risolvere timeout senza verifica. Nessuna promessa exactly-once distribuita.

## Error handling
| Categoria | Azione |
|---|---|
| 400/422 o dati incoerenti | Stop job, correzione umana, nessuna azione sostitutiva |
| 401/403 | Sospendi connessione/scenario interessato, verifica credenziali/permessi, alert |
| 429 | Rispetta Retry-After ove presente, backoff con jitter e limite |
| 5xx/timeout prima effetto noto | Retry solo se sicuro e idempotente |
| Timeout/esito ambiguo dopo effetto | UNKNOWN, verifica provider prima nuovo tentativo |
| Evento non autenticato / ambiente errato | Rifiuto e audit minimo |
| Crediti esauriti, coda piena, outage | Stop nuovi effetti, conserva job nel backend, fallback manuale con stesso ledger |
Retry candidato 1, 5, 15, 60 minuti (max 4 tentativi aggiuntivi, adattare a provider e scadenze); poi dead-letter e operatore. Non rimandare revoche, rimborsi, reclami GPSR o scadenze legali in attesa del retry. Make incomplete executions e Retry handler da verificare su piano, log e retention; non usare Ignore/Resume per simulare successo di azione finanziaria/logistica. Elaborazione sequenziale può bloccare job successivi e non protegge altri scenari; nessuna dipendenza esclusiva. Impostare gestione errori esplicita, alert indipendente, replay autorizzato e riconciliazione. 
Kill switch per azione e ambiente, non cancellare job già accettati. Fallback manuale deve acquisire stesso action_key/lock e aggiornare ledger; se backend indisponibile, non ripetere operazioni ambigue, registro eccezioni temporaneo privato e riconciliazione prima riavvio. Revoca marketing ha canale manuale immediato nel provider.

## GDPR e monitoraggio
Prima attivazione verificare entità/regioni Make, DPA art.28 ove applicabile, subresponsabili e trasferimenti, retention log/incomplete executions, permessi, dati e finalità (#47/#52/#60). Non presumere data residency UE escluda trasferimenti. Ridurre payload, accesso storico run, contenuti log e alert; impostazioni confidenzialità da collaudare senza compromettere audit minimo. Segregare ambienti e connessioni, non connettere test a servizi produttivi. Backup/restore del ledger, non affidarsi alle code temporanee Make; nessun dato reale nei test.
Monitorare età job più vecchio, backlog, errori, UNKNOWN, doppioni evitati, crediti usati, scadenze rimborso/contestazione e anomalie. Soglie proposte 70/85/95% crediti con avvisi, auto-acquisto extra disabilitato ove disponibile; prima esaurimento passare a manuale. Alert indipendente da Make per outage/esaurimento. Review giornaliera durante vendite, riconciliazione settimanale e prima di riattivare dopo incidente. Responsabile e sostituto da nominare.
Fonti: https://help.make.com/overview-of-error-handling ; https://help.make.com/how-features-use-credits ; https://www.make.com/en/pricing ; GDPR artt.5,25,28,32,44 ss. Coordinare #52, #59–64.
