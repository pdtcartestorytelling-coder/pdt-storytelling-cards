# PdT Storytelling Cards — piano operativo Pre Order

Stato al 27 ottobre 2026: **PREPARAZIONE / NON APERTO**.

## Valori pubblicati (tutti indicativi)
- Pre Order ipotizzato: **70,00 EUR** per cofanetto.
- Prezzo ordinario futuro ipotizzato: **90,00 EUR** per cofanetto.
- Spedizione standard **Italia** ipotizzata: **6,90 EUR** per un cofanetto.
- Totale esemplificativo Italia per un cofanetto in Pre Order: **76,90 EUR**.
- Prezzi non definitivi; trattamento fiscale, IVA, costi e condizioni finali vanno confermati.
- Non si presenta il prezzo 90 EUR come prezzo precedente realmente praticato, né si barrano prezzi o si dichiarano sconti percentuali.
- Nessuna promessa di spedizione gratuita su due o più cofanetti: da valutare solo dopo il preventivo.
- Spedizioni internazionali: non lanciate e da valutare separatamente.

## Operatività Stripe (NON attiva)
1. Ricevere il preventivo di produzione; verificare margini, IVA, tempi e disponibilità.
2. Completare la configurazione di Stripe con l'intestatario commerciale, i dati fiscali e il conto di accredito.
3. Predisporre un prodotto per il kit PdT e un prezzo reale; definire shipping fee, indirizzo di spedizione e paese consentito (IT), fiscalità e policy.
4. Usare un link di pagamento Stripe **reale, creato nel proprio account**, e verificarlo prima di inserirlo nel sito. Non archiviare chiavi segrete in GitHub Pages.
5. Testare ricevuta, recapito indirizzi, riconciliazione, cancellazione/rimborso e assistenza; verificare tutela consumatori, termini di consegna, privacy e condizioni di vendita.
6. Solo dopo esito test ed autorizzazione del titolare, attivare un'azione "Ordina" e spostare lo stato da "in preparazione" ad "aperto".

## Operatività Sendcloud (NON attiva)
1. Attivare Sendcloud; inserire mittente, dati pacco, pesi e dimensioni **misurati a confezione ultimata**.
2. Confrontare costi e servizi del corriere per destinazione Italia; confermare o modificare l'ipotesi commerciale 6,90 EUR.
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
