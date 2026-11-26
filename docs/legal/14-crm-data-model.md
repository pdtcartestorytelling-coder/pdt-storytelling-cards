# PdT — CRM privato, schema logico v0.1
26 novembre 2026 — progettazione, nessun account o archivio creato.
Proposta Excel Online su tenant aziendale approvato (SharePoint/OneDrive business secondo configurazione), oppure database privato se volumi/concorrenza lo richiedono. Excel non offre automaticamente autorizzazioni granulari per riga, integrità relazionale o transazioni: separare file/librerie per ruolo, non usare fogli nascosti/protezione celle come sicurezza. Nessun dato reale in GitHub pubblico, nemmeno branch draft.

## Struttura
| Tabella logica | Chiave e relazioni | Campi essenziali | Fonte autorevole |
|---|---|---|---|
| CONTATTI | contact_id | nome, email, lingua, fonte, creato/aggiornato, stato, revisione retention | CRM autorizzato |
| RICHIESTE | enquiry_id, contact_id | data ricevuta, tipo, settore facoltativo solo se necessario, quantità indicativa, destinazione facoltativa, stato, riferimento email privato, chiusura | Gmail / CRM |
| CLIENTI | customer_id, contact_id se pertinente | tipo/finalità B2B/B2C verificata, ragione sociale se pertinente, dati fiscali solo quando necessari, contatti fatturazione | CRM / sistema fiscale |
| ORDINI | order_id, customer_id | data, stato, valuta, imponibile/imposte/totale, spedizione, versione condizioni, riferimento accettazione/conferma privata | sistema ordini futuro |
| RIGHE_ORDINE | line_id, order_id | SKU, quantità, prezzo unitario, lotto o riferimento assegnazioni | ordini / lotti |
| PAGAMENTI | payment_id, order_id | ID Stripe, importo, valuta, stato verificato, rimborsato, data | Stripe |
| FATTURE | invoice_id, order_id | ID provider, numero, data, stato, riferimento documento privato, nota di credito | Fatture in Cloud |
| SPEDIZIONI | shipment_id, order_id | destinatario, indirizzo, contatto necessario, tracking, stato, vettore, date | Sendcloud / vettore |
| LOTTI | batch_id, SKU | revisione, quantità, rilascio, riferimento fascicolo privato, stato | registro qualità |
| ASSEGNAZIONI_LOTTO | allocation_id, line_id, batch_id | quantità | magazzino / registro qualità |
| ASSISTENZA | case_id, order_id se esiste | motivo, data, scadenza, stato, rimedio, importo, ID rimborso, data chiusura | registro post-vendita |
| CONSENSI | consent_id, contact_id | email necessaria, finalità/canale, versione testo/informativa, prova privata, data richiesta/conferma/revoca, stato, scadenza | registro consensi #59 |
| SOPPRESSIONI | suppression_id | identificatore email minimo, ambito, data opposizione/revoca, prova minima | registro esclusioni privato |
| DIRITTI | request_id | data ricezione, tipo diritto, verifica proporzionata, scadenza, esito, prova privata | referente privacy |
| EVENTI_INTEGRAZIONE | event_id univoco | provider, tipo evento, ID esterno, stato, tentativi, timestamp, errore redatto | log tecnico privato |

Separare registro diritti, consensi, pagamenti, fatture e incidenti per permessi. Registro incidenti e documenti fornitori in librerie private dedicate. ID casuali/univoci non basati su nome/email; evitare duplicazione indirizzi e documenti, mantenere snapshot contrattuali quando necessari. Dati pagamento completi (PAN/CVC), credenziali, informazioni sanitarie e dati di pazienti/candidati/dipendenti non ammessi. Non importare contatti Gmail indistintamente.

## Flussi
Attuale: browser -> app email dell'utente -> Gmail PdT soltanto se inviata. GitHub Pages serve sito; nessun database nel codice esaminato. CRM iniziale manuale: verifica richiesta, minimizzazione, inserimento autorizzato e ID; nessuna iscrizione marketing implicita.
Futuro: backend autenticato (da scegliere) -> sistema ordini; Stripe checkout -> webhook firmato verificato lato server -> elaborazione Make autorizzata -> aggiornamento ordine/CRM, fattura e spedizione solo secondo condizioni approvate. Distinguere pagamento autorizzato/acquisito/rimborsato; non fidarsi del redirect successo. Idempotenza per evento e azione (ordine, fattura, spedizione, rimborso); controllo concorrenza, riconciliazione e coda errori minimizzata. Make è orchestratore, non fonte autorevole. Niente segreti in JS; nessun endpoint effettivo creato.
Newsletter: richiesta -> conferma -> registro -> verifica esclusioni e scadenza immediatamente prima di invio. Revoca blocca campagne in coda; non sovrascrivere con import successivo. #59.
Resi: #56; lotti/richiami: #57; conservare collegamento minimo ordine-lotto.

## Matrice accessi proposta
| Ruolo | Accesso minimo |
|---|---|
| Responsabile progetto/titolare autorizzato | Amministrazione e approvazioni, audit; account nominativo |
| Commerciale | Contatti, richieste, preventivi, stato ordini necessario |
| Logistica | Solo ordini da evadere, destinatari, lotti e tracking necessari |
| Contabilità | Dati fiscali, importi, fatture e riferimenti pagamenti necessari |
| Marketing | Lista attiva e soppressioni, non dettagli ordini o dati fiscali |
| Privacy/sicurezza | Registri diritti, incidenti, prove e accessi necessari |
| Automazioni | Identità di servizio distinta con permessi limitati al singolo flusso |

Ruoli logici, non persone nominate. Una persona può ricoprire più ruoli con autorizzazione documentata. Account admin separati se possibile; MFA, condivisione esterna disabilitata salvo necessità, no link pubblici, no export indiscriminati. Verificare audit, backup e ripristino. Test con dati fittizi, nessun accesso account effettuato.
