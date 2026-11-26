# PdT — magazzino e fulfillment
26 novembre 2026 — modello non operativo, nessuna scorta fisica accertata. Magazzino interno proposto, sede e referente da approvare. Dati reali in archivio privato autorizzato, mai su GitHub.

## Registro logico complementare a CRM #60 e lotti #57
SKU candidato PDT-SIG-01; ID lotto già proposto PDT-SIG-YYYYMM-NNN. Non assegnare esempi a produzione.
| Registro | Campi essenziali |
|---|---|
| MOVIMENTI_STOCK | movement_id univoco, SKU, batch_id, quantità, da/a stato, causa, riferimento ordine/pratica, operatore e timestamp |
| RISERVE | reservation_id, order_line_id, batch_id, quantità, validità, stato |
| COLLI | parcel_id interno, shipment_id, ordine/righe e quantità, peso e dimensioni, versione imballo, vettore/metodo, ID Sendcloud/tracking, stato, costo previsto/effettivo |
| CONTROLLI_QUALITA | control_id, lotto, campione, esito, evidenza privata, autorizzato da/data |
| ANOMALIE_LOGISTICA | case_id, collo, motivo, data, termini, stato, azione, evidenza privata |
Stati stock mutuamente esclusivi: quarantena, disponibile, riservato, in preparazione, spedito/uscito, scarto; resi rientrano in quarantena prima del controllo. Disponibile alla vendita = giacenza fisica rilasciata meno riservato e in preparazione (se giacenza rilasciata include tali stati); con stati separati sommare solo AVAILABLE, non sottrarre due volte. Escludere ricambi, quarantena e scarti. Quantità intere non negative, movimenti append-only e correzioni tracciate. Riconciliare inventario fisico e registro; nessuna vendita oltre scorte. Excel privato possibile per pilot manuale a operatore unico con controlli; automazione concorrente richiede storage transazionale o equivalente (non Excel come ledger autoritativo). Riserva atomica prima di link/sessione, durata correlata alla proposta/sessione, rilascio dopo verifica pagamento assente e scadenza, gestire pagamento tardivo in eccezione. Nessuna promessa di disponibilità da semplice lead.

## Procedura operativa
1. Ricevere dal produttore, contare, identificare lotto e documenti, quarantena fino a controllo e rilascio GPSR. Ispezionare materiali, componenti, chiusura, etichette e campioni secondo piano approvato. Tenere ricambi separati.
2. Verificare disponibilità e costo spedizione, destinazione e dati minimi. Confermare proposta e condizioni; riservare quantità alla fase approvata, non per semplice richiesta. Confrontare pagamento acquisito verificato (#62) o modalità B2B esplicitamente autorizzata. Hold per anomalie o richiamo.
3. Picking: associare SKU/lotto/quantità a riga ordine, doppio controllo prima imballo; tracciabilità anche per ordini multipli e sostituzioni.
4. Packing: verificare integrità e contenuto, protezione, peso e dimensioni esterne, destinatario, numero colli. Fotografare solo se necessario, senza dati eccedenti; non mostrare etichette pubblicamente.
5. Selezionare servizio valido per origine, CAP, peso e dimensioni, copertura approvata, costi; approvazione umana iniziale. Generare una sola etichetta per collo tramite Sendcloud. Non confondere etichetta creata con pacco affidato.
6. Affidare al vettore, registrare prova ritiro/scansione effettiva, tracking e data; movimento stock in uscita una sola volta. Inviare conferma di spedizione veritiera con link tracking autorizzato. Nessuna promessa automatica di consegna garantita.
7. Monitorare consegna, giacenza, mancato ritiro, indirizzo errato, perdita/danno e ritorno al mittente. Non ripubblicare tracking o indirizzi. Gestire eccezioni entro termini contrattuali e di legge; non bloccare rimedi B2C in attesa di reclamo corriere. Se consegnato ma contestato verificare prova consegna, senza negare automaticamente diritto.
8. Resi (#56): etichetta prepagata quando dovuta per difetto; recesso con costi diretti cliente solo se preventivamente comunicati e non assunti da PdT. Ricezione in quarantena, valutazione sicurezza/conformità e reintegro solo se approvato, non ritardare rimborsi dovuti. Distinguere reclami GPSR (#57), bloccare lotto e applicare procedura richiamo.
9. Riconciliare periodicamente giacenze, ordini, spedizioni, resi, etichette annullate, fatture corriere e supplementi; indicatori costo effettivo/collo, puntualità, danni e resi con dati aggregati, senza tracciamento superfluo.

## Comunicazioni (modelli da approvare; nessun invio)
Conferma affidamento: "Il tuo ordine [ID] è stato affidato a [vettore] il [data]. Tracking: [link verificato]. Per assistenza: pdtstorytellingcards@gmail.com. [Tempi indicativi verificati]."
Anomalia: "Abbiamo rilevato un problema con la consegna dell'ordine [ID]. Stiamo verificando e ti comunicheremo il rimedio applicabile. Puoi contattarci a [recapito]."
Solo servizio, niente promozioni o richieste recensioni automatiche nella fase iniziale; #59. Registrare stati e tempi effettivi. 
