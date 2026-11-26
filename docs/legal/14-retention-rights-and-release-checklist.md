# PdT — conservazione, diritti e accountability
26 novembre 2026 — bozza da approvare; nessun dato cancellato o trasferito.

## Conservazione proposta
| Categoria | Termine o criterio | Azione |
|---|---|---|
| Contatti/richieste non convertite | 12 mesi dalla chiusura, proposta #47 | Eliminare dati non necessari da CRM e posta, salvo obblighi/difesa documentati |
| Consenso in attesa | 30 giorni dalla richiesta, proposta #59 | Scadere e cancellare dati non necessari |
| Marketing attivo | Fino a revoca o 24 mesi dalla raccolta, proposta #47/#59 | Bloccare invii, rimuovere dalla lista attiva, non rinnovare tramite apertura email |
| Prove consenso/revoca e soppressione | Durata necessaria e proporzionata da definire | Separare dal marketing e mantenere solo prova/identificatore minimo |
| Ordini e contratti | Esecuzione, obblighi e difesa documentati; termini specifici da confermare | Separare archivio operativo da archivio con accesso ristretto |
| Scritture contabili | Di norma 10 anni ex art.2220 c.c.; verificare termini fiscali e documenti specifici | Conservazione a norma ove dovuta, non estendere automaticamente a tutto il CRM |
| Spedizioni e assistenza | Necessità operativa, garanzia, obblighi/difesa applicabili | Eliminare copie e dettagli non necessari |
| Reclami sicurezza GPSR | Dati personali necessari, non oltre 5 anni art.9(12) | Distinguere fascicolo tecnico 10 anni e tracciabilità operatori art.15 6 anni ove applicabile |
| Log, copie backup, social | Da definire in base a configurazione e fornitori | Rotazione, accesso ristretto, scadenze documentate; ripristino non deve reattivare dati cancellati o revocati |
| Diritti e incidenti | Durata necessaria a documentare obblighi e difesa, da motivare | Registro minimo privato |

12/24/30 giorni o mesi come sopra sono proposte organizzative, non obblighi universali GDPR. Riesame mensile proposto; nessuna cancellazione automatica prima di approvazione. Definire trigger, data scadenza, eccezioni/hold circoscritti, responsabile, verifica e prova minima di eliminazione. Non conservare indefinitamente per semplice possibilità di controversia. Verificare copie locali, cestini, email, export, fornitori, backup e ripristini. Anonimizzazione effettiva per statistiche quando utile; pseudonimi/hash non sono automaticamente anonimi.

## Diritti (artt. 12–22 GDPR)
1. Ricevere richiesta via recapito privacy confermato; registrare data, oggetto e scadenza. Nessun modulo obbligatorio. Sospendere marketing subito se opposizione/revoca.
2. Verificare identità solo quanto necessario e proporzionato in caso di ragionevoli dubbi; non richiedere documento sistematicamente.
3. Identificare sistemi, finalità e responsabili coinvolti (posta, CRM futuro, newsletter, fatture ecc.); distinguere accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca e relativi presupposti.
4. Valutare eccezioni, diritti di terzi e obblighi legali; non cancellare documenti fiscali dovuti. Limitare trattamento ove richiesto/applicabile, propagare correzioni/cancellazioni/limitazioni ai destinatari secondo art.19. Portabilità ove applicabile in formato strutturato leggibile da macchina. Accesso con copia sicura e redazioni necessarie.
5. Rispondere senza ingiustificato ritardo e entro un mese; proroga fino a due ulteriori mesi per complessità/numero, informando entro il primo mese con motivazione. Se non si dà seguito, indicare motivi e possibilità reclamo/ricorso entro il termine. Gratuito salvo condizioni art.12(5).
6. Registrare esito, prova minima e chiusura. Non inserire dati reali in GitHub pubblico. Coordinare incidenti #52 (artt.33–34), non confondere termini con gestione diritti.

## Valutazione rischio, DPO e DPIA
- LIA per trattamenti basati su 6(1)(f): interesse concreto, necessità, bilanciamento, aspettative e salvaguardie; documentare esito. Nessuna LIA conclusa.
- Screening art.35 prima di ciascuna nuova attività: valutazione/scoring, monitoraggio sistematico, dati particolari, larga scala, soggetti vulnerabili, combinazione dataset, innovazione, impedimento accesso a servizi, elenco Garante. Nessuna DPIA completata; se rischio elevato svolgerla prima dell'avvio; art.36 consultazione preventiva se rischio residuo elevato non mitigato. CRM ordinario non implica automaticamente DPIA, ma verificare contesto reale. Non raccogliere dati clinici/HR di terzi per uso ordinario.
- DPO art.37: verificare ente pubblico, monitoraggio regolare/sistematico su larga scala come attività principale o trattamento su larga scala di dati art.9/10 come attività principale; motivare esito e riesaminare. Nessuna nomina effettuata; referente interno non equivale a DPO.

## Gate prima della pubblicazione/attivazione
- [ ] Identificare titolare e ruoli #50; mappare trattamenti reali anche offline e verificare account/fornitori/trasferimenti.
- [ ] Approvare registro art.30 e misure effettive, tempi, informative #47 e cookie #49, LIA, screening DPIA/DPO.
- [ ] Approvare DPA ove applicabili e schede fornitori; verificare piani e configurazioni.
- [ ] Creare archivio privato autorizzato, permessi, MFA, backup/restore; test cancellazione, revoca e richieste diritti con dati fittizi.
- [ ] Attivare servizi futuri solo per fasi dopo approvazione, aggiornando registro e informativa prima dell'avvio. Niente segreti in repository pubblico.
- [ ] Coordinare PR #47–59, soprattutto sicurezza #52, CGV #55, resi #56, GPSR #57, destinazione #58 e marketing #59. Riesaminare almeno annualmente (proposta) e a ogni cambiamento o incidente. Nessuna modifica alle pagine pubbliche in questa PR.

Fonti: https://www.garanteprivacy.it/home/faq/registro-delle-attivita-di-trattamento ; https://www.garanteprivacy.it/valutazione-d-impatto-della-protezione-dei-dati-dpia- ; https://eur-lex.europa.eu/eli/reg/2016/679/oj ; https://eur-lex.europa.eu/eli/reg/2023/988/oj .
