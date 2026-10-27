# PdT — gestione ordini, dati e automazioni (fase di predisposizione)

**Stato: PROGETTATO, NON CONNESSO, NON OPERATIVO.** Questo documento riguarda il futuro flusso Stripe → Make → Microsoft Excel Online / Sendcloud / Fatture in Cloud.

## Architettura
- **Sito**: GitHub Pages rimane una vetrina; nessun database o credenziale sul sito.
- **Checkout**: quando autorizzato, Stripe Checkout/Payment Links (prodotti e tariffe reali da configurare).
- **Automazioni**: Make con connessioni sicure e un Data Store di idempotenza. Non usare la pagina di conferma come prova di pagamento.
- **Registro**: `PdT_Registro_Operativo_Excel_Online.xlsx` (consegnato in chat separatamente, **NON** nel repository). Un solo master PRIVATO su Microsoft 365 OneDrive for Business / SharePoint, non una copia online più copie indipendenti.
- **Spedizioni**: Sendcloud (controllo di stock/indirizzi, generazione etichetta solo quando lotto pronto, recupero tracking).
- **Documenti fiscali**: Fatture in Cloud, inizialmente in **bozza / revisione**, solo nei casi e nei tempi concordati con commercialista.

Stripe resta fonte di verità per i pagamenti, Sendcloud per il tracking e Fatture in Cloud per i documenti fiscali. Excel è un **cruscotto operativo riconciliato**, non un sostituto del registro fiscale né un database transazionale robusto.

## Tabelle Excel (nomi per Make)
| Sheet | Excel Table | Key | Gestione |
|---|---|---|---|
| Ordini | `PdTOrders` | `Order_ID` (Stripe Checkout Session ID univoco) | Crea dopo pagamento, aggiorna per spedizione/rimborso |
| Clienti | `PdTClients` | `Cliente_ID` | Upsert; dati minimi necessari |
| Produzione | `PdTProduction` | `Lotto_ID` | Aggiornato da operatore/supplier, niente dati inventati |
| Spedizioni | `PdTShipments` | `Order_ID` | Upsert dopo ordine/logistica |
| Fatture | `PdTInvoices` | `FIC_Document_ID` o `Order_ID` | Evitare doppia creazione |
| Eventi | `PdTEvents` | `Chiave_idempotenza` | Log di transizioni, **senza dati anagrafici** |
| Attivazione | `PdTLaunchChecklist` | `ID` | Checklist apertura commercializzazione |
| Trend | `PdTMonthlyTrend` | `Mese` | Formule automatiche, **non scrivere da Make** |
| Dashboard | (formule, nessuna tabella) | — | Sola lettura |
| Parametri | (ipotesi, nessuna tabella) | — | Solo amministratore |
| Guida | (istruzioni, nessuna tabella) | — | Sola lettura |

Il file contiene **0 vendite e 0 clienti reali**. Eventi e campi ID sono segnaposto strutturali. Il prodotto non è acquistabile finché il checkout non viene attivato separatamente.

## Scenario A — Checkout Stripe → registro
1. Ricevere eventi ufficiali di Stripe: `checkout.session.completed` e `checkout.session.async_payment_succeeded`; gestire `checkout.session.async_payment_failed`, rimborsi e contestazioni in scenari dedicati.
2. Verificare in Stripe il Checkout Session ID, `payment_status == paid`, valuta, prodotti, importi e dati di spedizione; non usare la pagina di successo come conferma.
3. Usare un **Make Data Store** con chiave composta da Stripe event ID + `session.id` per bloccare gli eventi già elaborati; prima della creazione verificare se `Order_ID` esiste.
4. Upsert `PdTClients` con ID cliente Stripe o ID interno, limitando i dati personali a quanto serve per evasione e fiscalità. Consenso marketing separato; mai implicito.
5. Upsert `PdTOrders` con quantità/importi effettivi **ricevuti da Stripe**, non copiati dalle ipotesi 70 / 90 / 6,90. Stati canonici IT: `Pagato`, `Rimborsato`, `In attesa`, `Fallito`.
6. Scrivere `PdTEvents` con event ID, ordine, timestamp e stato — **mai payload Stripe integrali** nei log.
7. Registrare eventuali errori; alert all'operatore, nessuna generazione automatica di una seconda etichetta o secondo documento.

## Scenario B — Da ordine pagato a spedizione
1. Verificare `Stato_pagamento=Pagato`, scorte disponibili, indirizzo valido, lotto pronto e assenza di parcel già creato.
2. Creare la spedizione in Sendcloud senza emettere automaticamente l'etichetta se il prodotto è ancora in preordine.
3. Quando merce e imballaggio sono pronti, confermare servizio di spedizione, costi e pacco; **solo allora** generare etichetta e tracking.
4. Upsert `PdTShipments` per Order_ID, recuperando `Sendcloud_Parcel_ID`, corriere, tracking, costo e date reali.
5. Gestire eventi di tracking, tentate consegne, resi, cancellazioni e rimborsi senza duplicare ordini.

**Attenzione**: nuovi account Sendcloud devono utilizzare l'API v3 se si implementa un'integrazione HTTP diretta; per Make verificare i moduli e la versione dell'API in uso.

## Scenario C — Documenti fiscali
- Stabilire con il commercialista obbligo documento, momento di emissione (specie per incasso prima della consegna), IVA/aliquota del bundle e distinzioni B2C/B2B.
- Quando dovuto, creare bozza in Fatture in Cloud usando **importi reali** e dati fiscali richiesti, collegando `Order_ID` / `FIC_Document_ID`.
- Prima dell'invio SDI e/o della finalizzazione, revisione umana dei primi documenti; non assumere che una ricevuta Stripe sia una fattura fiscale italiana.
- Aggiornare `PdTInvoices` con numero, data, stato e stato SDI, senza archiviare file PDF fiscali nel repo.

## Privacy e governance
- File `.xlsx` con clienti in OneDrive/SharePoint **privato**, accesso limitato; **mai committare dati reali** nel GitHub pubblico, nemmeno per prova.
- Token Stripe / Sendcloud / Make / Microsoft / Fatture in Cloud **solo** nei rispettivi vault o connessioni protette; mai GitHub Pages.
- Evitare note libere con informazioni sensibili, dati clinici o di salute. Per analytics preferire dati aggregati e ID pseudonimi.
- Stabilire tempi di conservazione, policy di cancellazione, informative checkout e base giuridica; backup gestiti dal titolare.
- **Offline**: scaricare `File → Salva una copia` in Excel. È uno snapshot, **non** si sincronizza al master una volta separato. Per vere modifiche condivise usare co-authoring/OneDrive AutoSave.

## Dati di esempio / prezzi di progetto
- Pre Order ipotizzato: **70 €**
- Prezzo ordinario futuro ipotizzato: **90 €**
- Spedizione Italia stimata: **6,90 €**
- Totale Italia per un cofanetto in ipotesi: **76,90 €**
- Prezzi, costi, fiscalità, corrieri e tempi ancora da confermare prima di accettare pagamenti.

## Stato di attivazione
- [x] Sito informativo su `main` già pubblicato con valori ipotetici.
- [x] Schema Excel operativo + dashboard preparati e scaricabili dall'utente.
- [x] Contratti dati, mapping e flussi Make documentati.
- [ ] Master Excel effettivamente caricato in OneDrive privato e condiviso
- [ ] Connessioni Stripe, Make, Microsoft 365 Excel, Sendcloud, Fatture in Cloud autorizzate
- [ ] Preventivo di produzione, prezzi e finestra consegne confermati
- [ ] Revisione commercialista e Privacy Policy
- [ ] Scenario Make creato, test di duplicati, rimborsi e spedizioni superati
- [ ] Etichette e documenti provati in ambiente controllato
- [ ] Checkout reale attivato con esplicita autorizzazione

## Documentazione ufficiale
- https://apps.make.com/microsoft-excel
- https://docs.stripe.com/api/checkout/sessions
- https://www.sendcloud.com/api/
- https://apps.make.com/sendcloud
- https://apps.make.com/fatture-in-cloud
- https://support.microsoft.com/en-us/excel/get-started/collaborate-on-excel-workbooks-at-the-same-time-with-co-authoring
