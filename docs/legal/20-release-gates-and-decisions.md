# PdT — decisioni e checklist di pubblicazione
26 novembre 2026 — piano non approvato. Le 20 fasi documentali non equivalgono a conformità. Nessuna dichiarazione di conformità, pubblicazione o attivazione autorizzata. Ruoli indicativi, persone da nominare.

## A — Sito vetrina attuale (prima priorità)
| ID | Decisione / evidenza necessaria | Referente proposto |
|---|---|---|
| A1 | Confermare gestore, titolare/contitolari effettivi, recapito postale/email diritti, ruoli e identità da pubblicare; distinguere futuro venditore | Fondatori + consulente privacy |
| A2 | Audit effettivo Gmail consumer/Workspace, GitHub Pages, Cloudflare se attivo, social, storage/network/cookie, log, accessi e DPA/trasferimenti; tempi di conservazione motivati, registro art.30 e diritti operativi | Titolare + tecnico |
| A3 | Confermare destinazione d'uso con autori, manuale/schede e claim; diritti fotografie/logo/marchio, origine, distinta prodotto; niente certificazioni o efficacia non dimostrate | Autori + consulenti |
| A4 | Decidere natura dell'attuale comunicazione commerciale: solo richiesta informativa, nessun ordine automatico; valutare offerta a distanza art.4/19 GPSR indipendentemente dal checkout. Se offerta applicabile, dati fabbricante/sicurezza necessari prima di mantenerla, oppure rivedere comunicazione/CTA e sospendere offerta non conforme. Prezzi 179/199 previsti, non sconto da precedente prezzo; supporto veridicità e IVA | Fondatori + legale |
| A5 | Consenso marketing effettivamente verificabile, testo approvato, revoca e conferma operativa; altrimenti non raccogliere nuove adesioni e non inviare marketing | Titolare |
| A6 | Consolidamento dei 14 file, risoluzione CI #53 e #65, audit link/footer/noindex/placeholder, prove tecniche e manuali; revisione legale e traduzioni | Tecnico + revisori |
A è condizionata: nessuna PR intera è dichiarata pubblicabile immediatamente. Priorità alta a sicurezza moduli #52 e trasparenza #54, dopo test e approvazione; non rinviare la verifica dell'attuale sito dietro il futuro checkout. Se rischi presenti ora, valutare correzione/sospensione urgente e alternativa email approvata. Non presentare bozze incomplete come informative definitive.

## B — Vendita assistita del kit fisico
| ID | Gate necessario | Referente proposto |
|---|---|---|
| B1 | Venditore, forma giuridica, P.IVA/ATECO, iscrizioni, SCIA ove dovuta, INPS, regime/IVA kit, fiscalità 2027, fatture/corrispettivi e mercati | Commercialista + fondatori |
| B2 | Fabbricante GPSR, classificazione, distinta finale 102/60/22, magneti e materiali, prove, rischio residuo, etichetta, lotti, richiamo; PPWR/EPR e origine | Referente prodotto + tecnico qualificato |
| B3 | Prezzo totale e costo consegna, CGV B2B/B2C, recesso/garanzia, avviso armonizzato e funzione recesso ove applicabili, conferma durevole, termini e indirizzo reso, mercati | Legale + venditore |
| B4 | Scorte reali rilasciate, magazzino, peso/collo, preventivi corrieri, condizioni danni e resi; scelta copertura | Logistica |
| B5 | Account Stripe/KYC/PCI e condizioni, link individuali dopo approvazione, verifica importo e stato, rimborso, fiscalità, riconciliazione manuale, archivi privati e accessi | Amministrazione + tecnico |
| B6 | Pilot autorizzato, test fittizi e poi eventuale pilot reale separatamente approvato, supporto e scadenze | Tutti i referenti |
Non aprire ordini vincolanti/incassi o spedire finché B e le parti pertinenti di A non sono completate. Assenza di checkout non esclude vendite offline o obblighi.

## C — Checkout e automazioni
Backend transazionale e provider approvati; Stripe webhook, Sendcloud API, Fatture in Cloud, Make con DPA/permessi e budget; test M01–M24 e T01–T20/L01–L20, retry sicuri, idempotenza, alert indipendenti, fallback, gestione scadenze, rollback. Marketing solo dopo A5, registro soppressioni e test; nessun soft spam iniziale proposto. Excel non ledger transazionale. Attivare solo scenari approvati singolarmente. Nessun costo o fornitore già autorizzato.
## D — Licenze e area riservata
Diritti e catalogo, durata, stampa/download, trasferimento, recesso digitale e bundle, prezzo/IVA, auth/backend/storage privato, audit esposizione Git, DPIA screening, accessibilità, continuità, test D01–D22. Nessun accesso promesso prima dell'approvazione. Proposta tenere Signature unica edizione.

## Checklist decisionale e rilascio
- [ ] A1–A6 completati e approvati per vetrina.
- [ ] Conferma separata per creare ramo candidato e consolidare codice; nessuna unione automatica delle 19 PR.
- [ ] Candidato finale diff e CI verde sul medesimo SHA, test manuali e verifica live configurazioni.
- [ ] Nessun placeholder, link a bozza o affermazione non provata; trilingue coerente; versioni e revisori registrati.
- [ ] Approvazione esplicita del pacchetto da pubblicare e piano rollback; verifica dopo deploy.
- [ ] B1–B6 prima di vendita; C e D solo quando necessari e dopo autorizzazione.
- [ ] Archivi reali, contratti, documenti identità, prezzi fornitori, credenziali e prove in privato, non GitHub pubblico.
Riesame fonti normative alla data di rilascio, non dare per valida ogni citazione/link delle bozze; revisione competente delle parti fiscali, legali, cliniche e tecniche. Riferimenti principali: GDPR (UE) 2016/679; GPSR (UE) 2023/988; Codice consumo D.Lgs.206/2005; PPWR (UE) 2025/40; documentazione ufficiale dei provider. Non eseguita una nuova revisione legale integrale di tutte le fonti in questo audit.
