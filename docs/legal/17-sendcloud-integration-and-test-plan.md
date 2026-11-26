# PdT — Sendcloud, integrazione e collaudo
26 novembre 2026 — specifica tecnica, nessun account/API/etichetta/ritiro attivato. Il sito statico GitHub Pages resta invariato.

## Configurazione iniziale
- [ ] Confermare soggetto, indirizzi mittente/reso privati e verificati, piano, corrieri, tariffe, coperture, ritiro, stampante e formati etichetta. Verificare accesso API e documentazione effettiva.
- [ ] DPA/ruoli e trasferimenti per Sendcloud, corrieri, eventuale protezione XCover e Make; GDPR art.28 ove applicabile, privacy #47/#60. Inviare solo nome/indirizzo/contatti necessari e dati collo; no dati carta, pazienti, profili HR o note private. Non usare dati fiscali non necessari in metadata.
- [ ] MFA ove disponibile, account nominativi/ruoli, chiavi lato server/vault e rotazione; nessuna chiave/API in JS o GitHub. Separare test e produzione. Disabilitare tracking analytics, banner promo, recensioni e notifiche a pagamento non approvate. Email transazionali soltanto, nessuna iscrizione newsletter.
- [ ] Verificare policy pubbliche, tempi, procedure reso, mercati, prezzo totale e gate #50/#54–57/#60–62. Nessuna offerta vincolante o spedizione prima approvazioni.

## Flusso tecnico futuro
Stripe Checkout/backend -> pagamento verificato e ordine/riserva valida -> autorizzazione fulfillment nel ledger -> Make riceve evento autenticato -> task picking/packing -> misurazione e approvazione -> backend Sendcloud API v3 (raccomandata dal fornitore; verificare endpoint/schema/versione e funzionalità piano) -> ID shipment/parcel e label -> consegna vettore -> tracking -> CRM e messaggi. Fatturazione secondo evento fiscale approvato #61, non semplice label. 
Chiave business per spedizione: order_id + fulfillment_id; per collo parcel_id interno stabile (ordine può essere multicollo o sostituito). Vincoli univoci e lock prima richiesta. Persistenza stato creating/request_unknown/created/voided/handed_over; dopo timeout verificare se creazione riuscita nel provider, recuperare ID o riconciliare manualmente prima nuovo tentativo; non presumere header idempotency supportato. Non riusare etichette, distinguere ristampa da nuova spedizione; annullamento entro condizioni del vettore e verifica effettivo storno, non assumere rimborso automatico. 
Webhook: autenticare firma HMAC secondo documentazione esatta e secret dell'integrazione sul payload raw richiesto; non assumere identico schema Stripe. Verificare account e ambiente, payload e ID noti, protezione replay e rate limit; confronti constant-time ove pertinenti. Persistenza durevole prima ACK, dedup per evento/azione e worker transazionale; se firma/identità non verificabili non usare webhook per effetti automatici: interrogare API autorizzata e riconciliare. Make non riceve callback non autenticata. Eventi duplicati/fuori ordine: recupero stato autorevole e transizioni consentite, no regressioni cieche; consegna non equivale a prova incontrovertibile. Tracking link e dati privati con accesso appropriato; log minimizzati, no payload integrale. 
Stati interni: ready_to_pick, packed, label_requested, label_created, handed_over, in_transit, delivery_exception, delivered, returned, cancelled/hold. Mappare codici Sendcloud/vettore effettivi, non inventare corrispondenze. Stato provider separato da quello interno. Riconciliazione se webhook mancanti. Non inviare email doppie, dedup per evento comunicativo. 
Piano test: mock API/fixture sintetiche inizialmente; verificare se ambiente di test fornitore consente simulazione senza costi, non presumere sandbox equivalente a Stripe. Nessuna chiamata annuncia spedizione reale, nessuna etichetta fatturabile/ritiro, nessuna email reale senza approvazione separata. 

| ID | Scenario | Esito atteso |
|---|---|---|
| L01 | Ordine non pagato/non autorizzato | Nessun fulfillment |
| L02 | Pagato ma riserva scaduta / stock insufficiente | Hold e revisione, no overselling |
| L03 | Lotto in quarantena/richiamo | Blocco picking e spedizione |
| L04 | Quantità 1 / 2 / multicollo | Assegnazioni e ID univoci corretti |
| L05 | CAP/indirizzo incompleto o zona non servita | Revisione, nessuna label |
| L06 | Peso/dimensioni oltre metodo | Rifiuto e nuova scelta approvata |
| L07 | Tariffa cambiata / supplemento | Revisione costi, no addebito cliente non concordato |
| L08 | Doppio trigger concorrente | Una sola azione per collo |
| L09 | Timeout dopo creazione label | Riconciliare prima retry |
| L10 | Ristampa / annullamento etichetta | Nessun duplicato, storno verificato |
| L11 | Webhook alterato / non autenticato | Nessun effetto |
| L12 | Evento duplicato / fuori ordine | Stato verificato, notifiche uniche |
| L13 | Label senza affidamento effettivo | Non segnare spedito |
| L14 | Tracking fermo / giacenza / ritardo | Escalation e rimedi |
| L15 | Perdita/danno e reclamo | Pratica, termini, nessuna attesa illegittima |
| L16 | Reso recesso vs difetto | Costi corretti, quarantena e rimedio |
| L17 | Reso/sostituzione e riconciliazione stock | Movimenti univoci, lotto tracciato |
| L18 | Invio a paese non approvato / dogana | Blocco preventivo |
| L19 | Errore Make/CRM o evento perso | Retry sicuro, riconciliazione |
| L20 | Dati eccedenti, link pubblici o notifiche promo | Blocco e revisione privacy |
Nessun test eseguito contro provider. Registrare esiti e prove private. Gate approvazione: misure reali, preventivi, prove imballaggio, controllo stock, contratti/DPA, corrieri e mercati, procedure fiscali/legali, test sintetici superati e pilot reale autorizzato separatamente. Rollback: sospendere nuovi task e label, mantenere gestione degli ordini/collo esistenti, riconciliare e assistere clienti.
Fonti: https://www.sendcloud.com/api/ ; https://sendcloud.dev/ ; https://support.sendcloud.com/hc/it/articles/12455997971220 ; https://support.sendcloud.com/hc/it/articles/360025143991 ; https://support.sendcloud.com/hc/it/articles/360034595531 .
