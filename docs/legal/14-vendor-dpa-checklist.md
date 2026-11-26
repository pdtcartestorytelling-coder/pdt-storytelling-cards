# PdT — fornitori, DPA e trasferimenti
26 novembre 2026 — modello non operativo. Nessun contratto, account o configurazione verificati nei pannelli.

| Fornitore | Stato | Trattamento ipotizzato / verifica |
|---|---|---|
| GitHub Pages | Hosting documentato | IP/log, sicurezza, ruoli per finalità, condizioni del piano effettivo |
| Google Gmail | Casella pubblicata e flusso email documentato | Posta e metadati; account consumer o Workspace da verificare; non presumere DPA disponibile per account personale |
| Cloudflare | Da confermare | DNS/CDN/WAF/log se effettivamente attivo; configurazione, ruoli, retention |
| Meta/Instagram | Profilo da verificare | Social/DM, eventuali insights e pubblicità; ruoli distinti per finalità, eventuale contitolarità |
| Microsoft Excel Online/OneDrive/SharePoint | Futuro | Archivio CRM aziendale, tenant, accessi, localizzazione, DPA |
| Make | Futuro | Orchestrazione, connessioni e log, trattamento per conto PdT secondo contratto |
| Stripe | Futuro | Checkout, pagamenti, antifrode e rimborsi; ruoli possono differire per finalità |
| Fatture in Cloud | Futuro | Documenti fiscali, integrazioni, conservazione e destinatari |
| Sendcloud / corrieri | Futuro | Spedizione, tracking e resi; distinguere ruolo piattaforma e vettore |
| Commercialista / consulenti | Da verificare | Dati necessari, obblighi propri e ruolo effettivo |
| Newsletter / backend / altri | Non selezionati | Valutazione prima di attivare |

## Scheda privata da compilare per ogni rapporto
- Entità contrattuale, sede, piano/versione, contatto, servizio, stato, finalità, categorie interessati/dati, accessi, destinatari.
- Ruolo per ciascuna finalità: titolare autonomo, contitolare (accordo art.26 se pertinente), responsabile (art.28), autorizzato; non qualificare indistintamente tutti come responsabili.
- DPA quando art.28 applicabile: oggetto/durata, natura/finalità, categorie dati/interessati, istruzioni documentate, riservatezza, misure art.32, sub-responsabili e autorizzazione, assistenza diritti/incidenti/DPIA, restituzione/cancellazione a fine rapporto, audit e informazioni, segnalazione istruzione illecita; copia, versione, data e accettazione documentata.
- Paesi di trattamento, storage, assistenza e accessi remoti; sub-responsabili; trasferimenti e successivi trasferimenti. Regione UE non garantisce assenza di trasferimenti.
- Capitolo V GDPR: decisione di adeguatezza valida e pertinente, oppure garanzie appropriate (es. SCC con modulo corretto), valutazione trasferimento e misure supplementari se richieste. Se invocato EU-US DPF verificare al momento della decisione validità, entità certificata e ambito. Non usare deroghe art.49 per flussi ordinari senza presupposti.
- Sicurezza, MFA, ruoli, condivisione, audit, retention/log, export, backup/restore, cancellazione e incidenti. Verificare anche condizioni commerciali e supporto.
- Esito approvazione, responsabile, rischi residui, data verifica e prossima revisione. Bloccare nuovi trattamenti finché elementi essenziali non sono verificati.

Proposta: valutare account aziendale per posta e archivi se necessario; non migrare ora. Non utilizzare credenziali condivise, link pubblici o dati reali di test. Non aggiungere app o richiedere preventivi senza autorizzazione. Conservare DPA e valutazioni reali fuori da GitHub pubblico.

Fonti: https://eur-lex.europa.eu/eli/reg/2016/679/oj ; https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj ; https://www.dataprivacyframework.gov/list ; https://www.edpb.europa.eu/our-work-tools/our-documents/recommendations/recommendations-012020-measures-supplement-transfer_en .
