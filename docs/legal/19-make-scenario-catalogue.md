# PdT — catalogo scenari Make e ordine di attivazione
26 novembre 2026 — progettazione non operativa. Nessuno scenario Make creato, importato, collegato o avviato. Nessuna modifica alle pagine pubbliche. Specifiche logiche, non blueprint Make importabili.
Fonti interne riesaminate: PR #59 marketing, #60 CRM, #61 fiscalità, #62 Stripe, #63 logistica, #64 licenze. Sito statico con mailto; non assumere che esista già un sistema ordini. Ogni scenario richiede verifica del connettore, moduli, piano, autorizzazioni e test.

| ID | Scenario e trigger proposto | Azioni / output | Gate e chiave business |
|---|---|---|---|
| A01 | Richiesta commerciale approvata dall'operatore (inizialmente manuale) | Inserimento minimo contatto/richiesta in CRM, task risposta | Gmail message ID + tipo richiesta; verifica mittente e contenuto, nessuna importazione massiva |
| A02 | Proposta approvata | Registra snapshot prezzo/IVA/spedizione/scadenza, prepara conferma | enquiry_id + revision; nessun ordine automatico da lead |
| A03 | Accettazione verificata | Backend crea ordine e riserva stock atomica; task pagamento | order_id; condizioni approvate, link individuale o Checkout #62 |
| A04 | Pagamento verificato dal backend | Aggiorna proiezione CRM, task conferma e fulfillment | payment_event_id + order_id; stato acquisito e importo/valuta verificati, hold anomalie |
| A05 | Evento fiscale autorizzato | Prepara documento Fatture in Cloud oppure task registrazione corrispettivo | order_id + fiscal_event_id + document_type; regole #61, revisione manuale, niente invio SdI automatico |
| A06 | Ordine autorizzato all'evasione | Task picking/packing e associazione lotto | fulfillment_id; riserva valida, lotto rilasciato, niente doppio decremento |
| A07 | Collo misurato e approvato | Richiesta label Sendcloud via backend o modulo validato, registra ID | parcel_id; verifica costo/mercato, riconcilia timeout prima retry |
| A08 | Affidamento effettivo / tracking verificato | Aggiorna spedizione, email transazionale | shipment_id + milestone; label non equivale a spedito; niente pubblicità |
| A09 | Pratica reso/rimborso approvata | Task etichetta, rimborso autorizzato, verifica stato e documento fiscale | case_id + refund_action_id; no rimborso su semplice email, no duplicazione con chargeback |
| A10 | Richiesta marketing verificata | Registra pending, conferma indirizzo, aggiorna consenso | consent_request_id; nessuna iscrizione da mailto o lead senza conferma #59 |
| A11 | Revoca/opposizione | Blocco immediato in registro autorevole, propagazione lista esclusioni, conferma neutra | consent_event_id; fail closed se registro non raggiungibile; priorità e gestione code |
| A12 | Campagna approvata (futura) | Seleziona soli consensi attivi, ricontrollo immediatamente prima invio, invio tramite provider | campaign_id + recipient_id; no tracking individuale proposto; blocco se dati non certi |
| A13 | Diritto licenza autorizzato (futuro) | Richiede al backend entitlement, aggiorna solo stato/riferimento CRM | entitlement_id per unità; nessun codice segreto nei payload Make, #64 |
| A14 | Riconciliazione periodica | Confronta pagamenti, ordini, stock, documenti, spedizioni, consensi, licenze; task anomalie | reconciliation_run_id + discrepancy_key; report minimizzato e nessuna correzione cieca |
| A15 | Errore, scadenza critica o soglia crediti | Alert privato e task operatore, blocco effetti non sicuri | incident_id + alert_type; canale indipendente da Make, no PII in notifiche |

## Fasi
0. Manuale: posta, preventivi e registri privati approvati; nessun servizio a pagamento necessario per progettazione.
1. Pilot sintetico A01/A14/A15, senza dati reali, con mock; configurare accessi e budget. A01 inizialmente riceve solo dati già approvati/minimizzati, non corpo email integrale. Se Gmail Watch viene valutato, limitare label/cartella e scope, verificare OAuth e costi polling, non analizzare tutta la posta o allegati.
2. Avvio commerciale assistito: A02–A09 dopo gate venditore/IVA, sicurezza prodotto, scorte, CGV, privacy, Stripe e corrieri; approvazione umana per offerta, documento fiscale, etichetta e rimborso. Mantenere alternativa manuale e registro comune.
3. Marketing A10–A12 solo dopo registro consensi, conferma e revoca realmente operative, fornitori approvati. Nessun soft spam iniziale.
4. A13 soltanto dopo diritti/durata/catalogo, auth e storage privato, test #64. Nessun account o accesso digitale promesso ora.
Automatizzare progressivamente per modulo, non attivare un unico scenario che esegue tutto dopo un pagamento. Ordine tecnico, documento fiscale e consegna hanno tempi e condizioni distinti. Prezzi kit invariati 179/199 EUR previsti. Non modificare la fase vetrina.
Fonti Make: https://www.make.com/en/integrations/fatture-in-cloud ; https://apps.make.com/fatture-in-cloud ; https://www.make.com/integrations/stripe/microsoft-excel ; https://www.make.com/en/pricing . Compatibilità effettiva da collaudare; per Sendcloud valutare API v3 via backend se moduli non coprono i requisiti.
