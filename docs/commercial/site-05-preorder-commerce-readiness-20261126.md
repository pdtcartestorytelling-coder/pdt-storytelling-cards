# PdT — Sito 05: Pre Order e predisposizione commerciale (bozza)

Base incrementale PR #71. Lotto 01: 50 cofanetti programmati, prezzo di lancio previsto 149 EUR/unità; futuro listino 199 EUR non precedente. Nessuno stock live o ordine, nessuna garanzia di consegna. CTA principali (hero, scheda kit, mobile) puntano al modulo #interest; rimane un percorso email diretto alternativo e fallback con JS non funzionante. Rimosse richieste di settore/tipo; nome e email richiesti, copie indicative, destinazione e messaggio facoltativi, presa visione privacy obbligatoria. Edizione fissa Signature (campo storico top); bozza locale mailto, invio deciso dall'utente. Nessun tracking o marketing. CSP form-action none, controlli disabilitati finché handler installato, nessun endpoint aggiunto. Localizzazione IT/EN/ES e cache interest v14; link a scheda tecnica localizzata. Origine produttiva da documentare; rivedere ulteriori claim ereditati in audit. Il vecchio piano 70/90 EUR è superato; spedizione 6,90 non confermata.

## Architettura futura — solo progetto, NON ATTIVA
1. Vetrina statica: offerta e condizioni approvate; inventario e disponibilità autorevoli in sistema privato, nessun contatore inventato.
2. Checkout Stripe ospitato: prodotto/prezzo/currency/IVA/spedizione e condizioni verificate; nessuna chiave nel browser o GitHub. Separare test e live; non creare account o link in questa fase.
3. Backend/integrazione autorizzata: verifica firma webhook, idempotenza event/session ID, verifica stato pagamento e importi lato server, assegnazione scorte e gestione concorrenza; redirect di successo non è prova di pagamento. GitHub Pages non riceve webhook.
4. Make: eventi verificati, accessi minimi, retry/deduplica, log senza dati superflui, allerta errori. CRM/registro ordini privato con accessi limitati. Non convertire richieste email in ordini o consensi marketing.
5. Fatturazione secondo commercialista; Sendcloud solo dopo pagamento verificato, indirizzo e scorta confermati. Test riconciliazione, annullamento, rimborso, reso e assistenza; nessuna automazione o sottoscrizione attivata.

Gate: confermare fabbricante/soggetto venditore, destinazione, GPSR, privacy, condizioni B2B/B2C, fiscalità, margini, stock, consegna; definire segreti/ruoli, test sandbox e rilascio, approvazione esplicita. Prima del merge verificare CI, desktop/mobile, no-JS, mailto con app reale e tutti i gate #67–71; mantenere sito pubblico invariato. Nessun dato cliente reale in repository.

## Correzione CI
Run #121 PR #71: browser smoke contava anche i 3 pannelli specifiche con classe sig-context; selettore ora limitato a #contexts, con asserzione separata sui 3 pannelli #specifications. Run #122 PR #72: controllo legacy Essential intercettava la parola inglese generica essential; copy sostituito con key details senza rimuovere il controllo anti-edizione. Correzioni solo nella #72, #71 invariata. Nuova CI da verificare.
