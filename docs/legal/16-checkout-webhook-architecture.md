# PdT — architettura Checkout e webhook
26 novembre 2026 — specifica tecnica proposta, non implementazione attiva. GitHub Pages statico non può ospitare endpoint server-side o segreti. Non aggiungere script Stripe o link live al sito attuale.

## Fase 2: Checkout ospitato
Browser -> endpoint HTTPS di backend privato da selezionare -> Stripe Checkout Session -> pagina Stripe -> ritorno informativo. Stripe -> webhook HTTPS verificato -> inbox/coda durevole -> worker -> stato ordine -> Make (solo eventi autenticati/minimi) -> CRM, contabilità e logistica. Backend con database transazionale o servizio equivalente: Excel non garantisce lock, vincoli univoci e transazioni necessari per il ledger pagamenti.
Server crea ordine e snapshot prezzo/IVA/spedizione/quantità/valuta in centesimi interi secondo regole approvate. Controllare scorte e validità proposta, autorizzazione del cliente (token opaco a scadenza, accesso appropriato), protezione CSRF ove pertinente, rate limit. Non fidarsi di prezzo, SKU, quantità, email, order_id o redirect dal browser. Sessione mode=payment, associazione order_id opaco, importo calcolato server-side, scadenza, URL successo/annullamento consentiti, metodi approvati. Nessun dato sensibile in metadata o URL. Usare chiave idempotenza stabile per tentativo valido; non riutilizzarla per parametri diversi. Prevenire sessioni concorrenti per lo stesso ordine; gestire sessioni scadute e pagamenti doppi tramite eccezione. Chiave idempotenza Stripe non sostituisce ledger interno persistente.

## Stati e autorizzazione all'evasione
Ordine: proposta -> accettato secondo CGV -> in attesa pagamento -> pagato verificato -> pronto per evasione -> spedito -> chiuso. Stati annullato/hold/eccezione separati. Pagamento: non iniziato, in corso, richiede azione, autorizzato non acquisito, acquisito, fallito, rimborso pending/parziale/totale, contestato. Fiscalità e logistica hanno stati autonomi (#61).
Pagina success_url e email del cliente non sono prova. Recuperare Session e PaymentIntent (ove pertinente) dal provider con credenziali autorizzate; verificare account/ambiente, mode, sessione associata univocamente all'ordine, stato paid/succeeded e acquisizione effettiva, importo totale/valuta, assenza di conflitti e ordine valido non già evaso. Escludere no_payment_required per Signature. Se mismatch, pagamento tardivo, scorte mancanti, doppio incasso, contestazione o rischio: hold e revisione, non spedire automaticamente; rispettare obblighi verso cliente. Non attendere payout bancario come condizione generale se pagamento acquisito e verificato.

## Ricezione eventi — contratto tecnico
- HTTPS e versione API/SDK e formato evento fissati e testati; snapshot per eventi sotto indicati, verificare catalogo vigente.
- Verificare Stripe-Signature sul corpo raw non alterato tramite SDK ufficiale e secret endpoint corretto, tolleranza temporale e clock affidabile; rifiutare firma mancante/errata o payload malformato. Separare test/live e account, non usare sola IP allowlist o URL segreto.
- Dopo autenticazione, salvare evento minimizzato (event_id univoco, tipo, ID oggetto, account/ambiente, stato, timestamp) in inbox durevole con vincolo univoco; rispondere 2xx rapidamente solo dopo accettazione durevole o duplicato già registrato. Se storage indisponibile non confermare falsamente, permettere retry. Non eseguire operazioni lente prima di ACK. Non registrare indiscriminatamente payload o header sensibili.
- Worker: eventi possono essere duplicati, concorrenti, fuori ordine o ritardati. Recuperare stato provider corrente, lock transazionale/compare-and-set su ordine, ledger azioni univoco e outbox durevole. Dedup per event_id e per azione business (es. fulfill:order_id, refund:case_id, invoice:fiscal_event_id); oggetti/eventi distinti possono riferirsi stessa azione. Non retrocedere stato a causa di vecchio evento; gestire eccezioni e riconciliazione.
- Make riceve solo notifiche dal backend autenticato (firma o identità verificata, protezione replay), non da webhook Stripe non verificato o browser. Retry con backoff, dead-letter privata, alert, riconciliazione periodica. Non presumere che Make preservi raw body o supporti verifica necessaria: verificare concretamente.
- Effetti esterni: chiave idempotenza per provider ove supportata, controllo esistenza e stato dopo esito ambiguo, nessun retry cieco; nessuna garanzia exactly-once tra più servizi senza controlli di riconciliazione.

| Evento candidato | Azione |
|---|---|
| checkout.session.completed | Verifica Session: se paid e controlli superati, autorizzare evasione una sola volta; altrimenti attesa |
| checkout.session.async_payment_succeeded | Stessa verifica per metodi differiti se abilitati in futuro |
| checkout.session.async_payment_failed / expired | Aggiornare stato dopo riconciliazione, liberare eventuale riserva secondo regole, non spedire |
| payment_intent.succeeded / payment_failed | Riconciliare pagamento; nessun secondo fulfillment indipendente |
| refund.created / updated / failed | Riconciliare importo e stato rimborso, non marcare riuscito se pending/failed |
| charge.dispute.created / closed | Aprire/aggiornare pratica, hold se non spedito, allertare referente |
| payout.paid / failed | Riconciliazione banca, non trigger di spedizione |

Verificare nomi evento e formato con versione scelta. Nessuna implementazione backend, webhook, API key o Make scenario in questo ramo. Fonti: https://docs.stripe.com/checkout/fulfillment ; https://docs.stripe.com/webhooks ; https://docs.stripe.com/api/idempotent_requests ; https://docs.stripe.com/security/guide .
