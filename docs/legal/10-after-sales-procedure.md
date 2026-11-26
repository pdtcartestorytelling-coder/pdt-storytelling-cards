# PdT — procedura post-vendita
26 novembre 2026 — bozza non operativa; nessun ordine o pagamento attivato.

## Classificazione
- Recesso B2C: annotare data possesso fisico, data comunicazione, eventuale estensione ex art. 53, termine restituzione e rimborso; non esigere motivazione, RMA, sigillo o imballaggio originale. Costi diretti di reso solo se comunicati prima del contratto e non assunti dal venditore. Rimborsare anche consegna standard, non supplemento consegna più costosa scelta dal cliente. Eventuale diminuzione di valore solo se giustificata dall'uso eccedente e nei limiti art. 57; nessuna trattenuta forfettaria. Non imporre credito negozio.
- Difetto/consegna incompleta/errata: riparazione o sostituzione secondo scelta e limiti di legge, senza spese e senza notevoli inconvenienti; ricambi solo se ripristinano conformità. Riduzione proporzionale o risoluzione nei casi previsti; reso a spese del venditore per risoluzione per difetto. Non imporre termine 24/48 ore, foto o riserva al corriere come precondizioni assolute. Il venditore si occupa del vettore separatamente.
- Mancata consegna: verificare tracking, termine contrattuale, rimedi ex art. 61 e circostanze che consentono risoluzione immediata; non ritardare indebitamente il rimborso.
- B2B: verificare accordo e termini artt. 1490 ss. c.c., non negare automaticamente garanzia. Resi volontari da approvare.
- Sospetto rischio sicurezza: interrompere uso, isolare lotto, informare referente prodotto, valutare obblighi GPSR e richiamo. Non trattare come semplice reso.

## Flusso proposto
1. Ricevere richiesta via email; registrare data/ora effettiva di ricezione e codice pratica interno.
2. Identificare contratto e finalità B2B/B2C, verificare ordine con dati minimi. Non confondere richiesta di disponibilità con ordine.
3. Classificare richiesta e calcolare le scadenze legali; confermare ricezione, indicare prossimo passaggio. Obiettivo interno proposto: risposta iniziale entro due giorni lavorativi, senza promessa pubblica e senza sospendere termini legali.
4. Organizzare restituzione/ritiro se necessario, fornire recapito verificato e costi applicabili; inviare etichetta prepagata per rimedio di conformità ove necessaria. Non chiedere informazioni eccedenti.
5. Verificare bene, quantità, lotto, componenti; annotare condizioni senza ritardare illegittimamente rimborso. Nel recesso rimborso entro 14 giorni dalla comunicazione, salvo facoltà legale di trattenere fino a ricezione o prova spedizione (prima delle due), se non offerto ritiro.
6. Approvare rimedio, registrare motivazione e importo; comunicare decisione, tempi e istruzioni. Se controversia, escalation al referente.
7. Eseguire rimedio e riconciliare pagamento/contabilità; confermare esito effettivo, non semplicemente invio richiesta al provider.
8. Chiudere pratica solo dopo verifica, conservare dati secondo tempi applicabili; analizzare ricorrenze e difetti di lotto.

## Registro privato futuro (Excel Online o altro archivio autorizzato)
Campi: ID pratica, ID ordine, B2B/B2C, motivo, data ricezione, data consegna, termine legale, stato, responsabile, lotto, rimedio, importo e valuta, ID rimborso provider, stato provider, tracking reso, riferimento nota di credito, data chiusura. Dati identificativi minimi; link a documenti privati con accesso limitato. Mai salvare dati carte, chiavi API, foto personali o informazioni pazienti in GitHub pubblico.
Stati proposti: ricevuta, in verifica, attesa restituzione, rimedio concordato, rimborso avviato, rimborso completato, sostituzione spedita, escalation, chiusa. Gli stati interni non limitano i diritti o sospendono automaticamente le scadenze.

## Stripe / Make / Fatture in Cloud / Sendcloud — integrazioni future, NON attive
- Verificare prima il pagamento effettivamente acquisito; distinguere annullamento di autorizzazione da rimborso di pagamento acquisito.
- Calcolare importo con operatore autorizzato, valuta e residuo rimborsabile; impedire duplicati con ID pratica, chiave idempotenza stabile e controllo concorrenza. Non eseguire rimborsi solo sulla base di email non autenticata. Approvazione manuale iniziale.
- Usare API/console Stripe autorizzata lato server, mai segreti nel sito pubblico; rimborsare sul metodo originale salvo accordo lecito alternativo senza costi. Verificare stato, webhook firmati, riconciliazione e gestione pending/failed; non marcare completato prima della conferma. Valutare ritardi provider senza eludere termini legali. Test mode prima della produzione.
- Make: accessi minimi, proteggere log, retry idempotenti, nessuna duplicazione di note di credito o messaggi.
- Fatture in Cloud: verifica con commercialista di eventuale nota di variazione, importi e tempi, distinguendo documento fiscale da rimborso.
- Sendcloud: etichette reso, indirizzi, tracking e costi conformi; nessun rinvio obbligatorio del cliente al vettore.
- Test con dati fittizi: rimborso totale/parziale, duplicato, errore, pending, chargeback, pagamento non acquisito, perdita/danno, reso con prova spedizione, sostituzione; separare produzione e test.

## Modelli email (non inviare automaticamente)
Ricezione: "Abbiamo ricevuto la tua comunicazione in data [data/ora], riferimento [ID]. La registrazione non condiziona l'esercizio dei tuoi diritti. Ti comunichiamo [istruzioni pertinenti, recapiti, costi e termini]."
Difetto: "Grazie per la segnalazione relativa all'ordine [ID]. Descrivici il problema; se disponibili, le fotografie possono aiutarci. Ti proporremo i rimedi previsti dalla legge, senza costi quando dovuti."
Rimborso: "Per l'ordine [ID] è stato [avviato/completato secondo stato verificato] un rimborso di [importo, valuta] tramite [metodo]. Riferimento [ID]. [Eventuali informazioni verificate su accredito]."
Non richiedere dati carta o dati sanitari. Adattare ai diritti e circostanze specifiche.

## Prima del lancio
- [ ] Confermare venditore, indirizzo resi, referente, costi, mercati e condizioni commerciali.
- [ ] Allineare PR #55, modulo tipo recesso e politica resi; link reciproci sul ramo integrato. Inserire avviso armonizzato ufficiale della garanzia e funzione di recesso art. 54-bis ove applicabile. Non implementare un semplice mailto spacciandolo per funzione conforme.
- [ ] Definire stock ricambi (carte, manuale, schede, cofanetto) e processo controllo qualità.
- [ ] Definire eventuale reso gratuito volontario, SLA e garanzia commerciale aggiuntiva solo dopo approvazione; nessuna promessa introdotta.
- [ ] Configurare archivi privati, ruoli e retention, fornitori e accordi privacy.
- [ ] Collaudare workflow e sito; coordinare PR #47–55, soprattutto footer, accessibilità e Pre Order. Revisione legale/fiscale e mercati esteri prima dell'uso.
- [ ] Conservare versione contrattuale applicata e storico pratica.

## Fonti
- Codice del consumo, artt. 52–59, 61, 63, 128 ss., 135-bis ss.
- Your Europe: https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_it.htm
- D.Lgs. 170/2021: https://www.normattiva.it/eli/id/2021/11/25/21G00185/CONSOLIDATED
- Reg. UE 2025/1960: https://eur-lex.europa.eu/eli/reg_impl/2025/1960/oj
- Codice civile artt. 1490–1495.
- Documentazione tecnica Stripe da verificare prima dell'integrazione: https://docs.stripe.com/refunds

Non unire o utilizzare operativamente prima dell'approvazione. Nessun dato reale, rimborso, integrazione o costo attivato.
