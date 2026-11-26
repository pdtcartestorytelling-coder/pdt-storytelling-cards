# PdT Storytelling Cards — piano operativo Pre Order

Stato al 26 novembre 2026: **PREPARAZIONE / NON APERTO**.

## Valori di progetto aggiornati (non offerta vincolante)
- PdT Signature: **149 EUR** per cofanetto, prezzo di lancio previsto per Lotto 01 (50 cofanetti programmati).
- Listino futuro previsto: **199 EUR**, non prezzo precedente applicato.
- Le precedenti ipotesi 70/90 EUR sono superate; 6,90 EUR di spedizione era solo un'ipotesi storica, non confermata.
- Spedizione, fiscalità, IVA, disponibilità e totale devono essere confermati; non pubblicare tariffe, sconti o tempi inventati.
- Nessun ordine, prenotazione, pagamento o stock in tempo reale. Richieste via email non vincolanti; nessun servizio attivo.
- Spedizioni internazionali da valutare separatamente.

## Operatività Stripe (NON attiva)
1. Ricevere il preventivo di produzione; verificare margini, IVA, tempi e disponibilità.
2. Completare la configurazione di Stripe con l'intestatario commerciale, i dati fiscali e il conto di accredito.
3. Predisporre un prodotto per il kit PdT e un prezzo reale; definire shipping fee, indirizzo di spedizione e paese consentito (IT), fiscalità e policy.
4. Usare un link di pagamento Stripe **reale, creato nel proprio account**, e verificarlo prima di inserirlo nel sito. Non archiviare chiavi segrete in GitHub Pages.
5. Testare ricevuta, recapito indirizzi, riconciliazione, cancellazione/rimborso e assistenza; verificare tutela consumatori, termini di consegna, privacy e condizioni di vendita.
6. Solo dopo esito test ed autorizzazione del titolare, attivare un'azione "Ordina" e spostare lo stato da "in preparazione" ad "aperto".

## Operatività Sendcloud (NON attiva)
1. Attivare Sendcloud; inserire mittente, dati pacco, pesi e dimensioni **misurati a confezione ultimata**.
2. Confrontare costi e servizi del corriere per destinazione Italia; definire una tariffa reale dopo la verifica del collo e dei preventivi.
3. Per un primo piccolo lotto, preparare manualmente le spedizioni a partire dagli ordini confermati e dagli indirizzi ottenuti tramite Stripe, evitando automatismi non configurati.
4. Creare etichette, spedire, comunicare tracking e conservare i dati necessari per assistenza.
5. Per automatizzare il passaggio Stripe→Sendcloud, prevedere un backend sicuro/API oppure un'integrazione di e-commerce adatta. **GitHub Pages statico non fornisce webhook né gestione ordini lato server.**

## Check prima di pubblicare i pagamenti
- [ ] Preventivo produttore e quantità minima ricevuti
- [ ] Prezzi finali e IVA confermati con consulente fiscale
- [ ] Inventario/lotti e scadenza Pre Order stabiliti
- [ ] Tempi di consegna reali comunicabili
- [ ] Corriere, costi, peso e imballaggio confermati
- [ ] Account Stripe pronto con link pagamento testato
- [ ] Account Sendcloud pronto con test di etichetta
- [ ] Condizioni vendita, privacy, resi e recesso da revisionare
- [ ] Controllo checkout mobile, ricevute e assistenza completato
- [ ] Autorizzazione esplicita ad aprire realmente il Pre Order

Fonti tecniche:
- https://docs.stripe.com/payment-links
- https://support.sendcloud.com/hc/it/articles/360041316951-Come-creare-una-spedizione-manualmente
- https://www.mimit.gov.it/it/assistenza/domande-frequenti/annunci-di-riduzione-di-prezzo-domande-frequenti-faq

Nessuna chiave privata, account cliente, dato di ordine o pagamento è incluso nel repository.
