# PdT — Sito 15: audit finale e registro di rilascio (bozza)
27 novembre 2026 — STATO NO-GO. Nessuna autorizzazione al deploy, merge, chiusura PR o servizi. Tutte le verifiche di seguito sono di repository/documentali e CI; non attestano conformità legale, sicurezza totale o prestazioni del dominio live.

## Base e perimetro verificato
Main osservato: b1830b239151e4851bd1d5350d11adccb8efed55, protected=true (non prova specifica regola o enforcement amministratori). #81: b6ad5b027e1d3445c98ab20a9676b4900c741e2f, tree 570e12d0d44d8edc9e4873c4a538559b67466efc. Compare main...#81 ahead 34, behind 0, 130 file secondo API; tutti gli SHA #67–81 presenti nella catena. 35 PR #47–81 open/draft/merged_at null al controllo. Verificati metadata, descrizioni delle 20 PR legali, SHA, esiti workflow correnti, compare e sorgenti mirati; non riaperto integralmente ogni diff o rieseguito ogni branch indipendente. #47–66 non sono antenati da unire in blocco: #67 ne integra selettivamente funzioni/test; bozze e piani non incorporati restano referenziabili. Non chiudere PR, non fare merge sequenziali o cherry-pick indiscriminati. Il candidato cumulativo #82 si basa su #81.

## Registro PR (head e CI osservati prima della #82)
| PR | SHA | Site Quality / run | Esito sostanziale / disposizione |
|---|---|---|---|
| #47 | 676327c7ffd6639dcb7d9d1bd339d480f41726a8 | success / 45860811295 | Bozze aggiornate; privacy attiva da sostituire |
| #48 | 45df0e57bb216e3c929e7dfe5843cc9ab9f4ea56 | success / 45861419757 | Bozze termini 149/199; approvazione |
| #49 | f23ece41a703eb28d0d3b25fccd5d638e71974e9 | success / 45862073127 | Bozze; audit runtime |
| #50 | a9faec638242d5165de9a6d2cc87c555dcb11058 | success / 45862444909 | Bozze; gestore non identificato |
| #51 | b311293ff2c9cbe034a7735fba226e0bcfae00bc | success / 45862774239 | Bozze; prove diritti |
| #52 | 95bd2354ecccf1f5ccb0ee2aaccc32db5ebb943d | success / 45863460625 | Guard e test integrati |
| #53 | 04aa9ada8dc1d6f5ab033047a7cff845501a44ad | success / 45875204546 | Skip/focus e test integrati, audit manuale |
| #54 | b57cbc77c36592badb052f21fc8a0ae9a9eca592 | success / 45864515790 | Superato da #68, 149/199 |
| #55 | 457f6000331e9ce73189556feaee9e4bad2db919 | success / 45865111041 | Differita, valutare anche vendita email |
| #56 | cf641e07190c355d4f312d8447c983e4e22c6820 | success / 45865687681 | Differita, obblighi da approvare |
| #57 | 921cc43d3a0421f19ab8c316d8b79b414756646c | success / 45866730138 | Differita, gate offerta GPSR |
| #58 | 1b6e295644fa5b631c54b2d336e97aa5ea24b1be | success / 45867797494 | Limiti integrati; revisione manuale/articoli |
| #59 | 02b58b07c4797677427d303f01e538b6636e176b | success / 45868388677 | Raccolta e invio sospesi |
| #60 | 30c21a83f60e46e38a42f064c82463dad95a0916 | success / 45868952908 | Modelli solo nel ramo originale; privato |
| #61 | c31cc902a395af9b9e6f4588947ed2d0f2ffdbbf | success / 45869516207 | Modelli; verifica commercialista |
| #62 | 8082561ed5fdc4dd277d48c1a80f98ec6d2353c5 | success / 45871029828 | Piano futuro, inattivo |
| #63 | e20e56206d9c780eb5ad181df3f5148366020205 | success / 45871683147 | Piano futuro, inattivo |
| #64 | 5c80fcc9609d9cfe6c5a4564ed22fbf85dcbd658 | success / 45872190500 | Piano futuro, inattivo |
| #65 | 256539635914bdfa2dcf6d86482d2235fe6a39bf | success / 45872969370 | Piano futuro, inattivo |
| #66 | 6352ad78ffdf0dbe3bd276f4d63f1559acbbe7ac | success / 45873708016 | Audit storico, non merge |
| #67 | f3df35c97bace020b975113b237c8d27e8ef2339 | success / 45900821413 | Base candidato e bozze legali |
| #68 | 970c5f7c1cc1ff27f64defc36305eaebd5a4028f | success / 45903466188 | 149/199, lotto 50 |
| #69 | c7d6c90d75227fb3594033427c8ff094a0b622e8 | success / 45903628279 | Home IT/EN/ES |
| #70 | d6e8b1e80e664a77c783d76c87df1d70f81a85dc | success / 45903965456 | Prodotto IT/EN/ES |
| #71 | 0c5656be0eb79043be5ffdd3c08ec7597d69c76a | failure / 45904279578 | PDF preliminare; selettore corretto #72 |
| #72 | faffa99102b884ab40a2b3ef864fe0fb32457a14 | success / 45904573304 | Pre Order semplificato, test verde |
| #73 | 807f9c544fac2d1a90e9f871957060fd13210ee8 | success / 45905572544 | Metodo IT/EN/ES |
| #74 | 289dcbdeacb8ccdcd89f1b24be2045bb42a0216c | failure / 45907419700 | Esempi; layout corretto cumulativamente #75–77 |
| #75 | f4c373f46f20b7734a3b2a6ea3e4f3e59e94c15a | failure / 45908215661 | Manuale; caricamento CSS corretto #76–77 |
| #76 | ceae0b9380bf359b493657a8685563bdbeb03c2b | failure / 45908861628 | Percorsi; URL test corretto #77 |
| #77 | 7daef897ab5d004b5f6a0e50f269cb0d1b64a1f6 | success / 45909977834 | Galleria, video solo piano |
| #78 | fb653a06b4a7a265bd0595e177473267f0f0d5d4 | success / 45910271964 | Autori e articoli; no recensioni |
| #79 | 56238d453f38b0a02a3ff3d42fca019d9ac9af40 | success / 45910815580 | Risorse gratuite |
| #80 | 7060c77cab54c373dc5a2c29aff90b14a7a9fb61 | success / 45911319489 | SEO, Search Console inattiva |
| #81 | b6ad5b027e1d3445c98ab20a9676b4900c741e2f | failure / 45912641592 | UX: lab fallito, fix #82 |

30 CI success e 5 failure sui 35 head osservati. #71 selettore contesti/specifiche, #74/#75 layout e attesa CSS, #76 URL italiano obsoleto: correzioni cumulative, #77–80 verdi; #81 run 132: static, syntax, form security, keyboard/no-JS, AVIF, browser smoke PASS; laboratorio UX fallito su pre-order.html CTA must not obscure focused form. Nessuna dichiarazione che #82 sia verde prima del run. #82 usa display:none immediato in focus-within, senza transizione, e test verifica focus effettivo, abilitazione, assenza geometria. Cache preorder v24. Origin copy Home IT/EN/ES e residuo EN Pre Order qualificati come produzione prevista da documentare. Bozze privacy IT/EN/ES riallineate ai campi ridotti #72; radice privacy ancora vecchia, BLOCCANTE, non sostituita perché approvazione/ruoli mancano. Nota editoriale nei 12 articoli, non modifica testi firmati; affermazioni originali su efficacia/trauma/terapia restano da revisionare o escludere prima del rilascio. README rimuove istruzione pericolosa di copiare tutto. Nessuna nuova testimonianza, contenuto proprietario, pagamento o tracking.

## Configurazione commerciale candidata (sostituisce ipotesi storiche 179/159)
Signature 102 carte (2×51), manuale 60 pagine, 22 schede integrate (8 individuale, 6 gruppo, 8 HR), cofanetto magnetico; dimensioni indicative 21×21×5 cm non misurate. Lotto 01: 50 programmati, 149 EUR/unità prezzo di lancio previsto; 199 futuro listino previsto, non precedente prezzo. 7.450 EUR lordo teorico se 50 venduti, non previsione ricavi netti. Regime IVA, margine, costi, disponibilità e consegna non confermati. Richiesta via mailto, non ordine, prenotazione o pagamento. Non accettare ordini vincolanti via email senza chiudere gate vendita. Scansione mirata 9 pagine commerciali e 3 JS: nessun 179/159 con simbolo euro rilevato; non prova inventario completo. Storico resta storico.

## Registro approvazioni (tutte aperte, evidenze in archivio privato)
| ID | Gate / evidenza necessaria | Referente proposto |
|---|---|---|
| A01/L01 | Identità gestore/prestatore, indirizzo professionale, recapiti e dati obbligatori; non dedurre gestore da titolare GDPR | Fondatori + legale |
| A02/L02 | Conferma titolare GDPR dichiarato Silvia Dierico, ruoli e contatto diritti pdtstorytellingcards@gmail.com, indirizzo, DPO solo se nominato | Titolare + legale |
| A03/L03 | Gmail consumer/Cloudflare attivo dichiarati; verifica ruoli, contratto/DPA dove dovuto, trasferimenti, accessi, inoltri, hosting e alternativa professionale | Titolare + tecnico |
| A04/L04 | 12 mesi dalla chiusura delle richieste dichiarati; procedura attuata, eccezioni/backup/log, basi giuridiche, registro e diritti | Titolare |
| A05/L05 | Browser pulito, DevTools/HAR privato, cookie/storage/Set-Cookie/network, DNS/proxy/CDN; blocco preventivo se necessario | Tecnico + privacy |
| A06/L06 | Marketing sospeso, consensi storici/revoche da gestire, no CRM pubblico | Titolare |
| A07/L07 | Titolarità foto/testi/manuale/logo/design dichiarata, documentazione, liberatorie, marchio e storia Git, leggibilità immagini e grafica retro | Autori |
| A08/L08 | Destinazione reale non approvata, manuale originale e classificazione; revisione clinica/HR e 12 articoli, rimuovere claim non sostenuti | Autori + competente |
| A09/L09 | 102/60/22 confermati a progetto; campione, pesi/materiali/magneti/origine, scheda tecnica PDF, lotto, GPSR applicabilità già ora | Fabbricante/legale |
| A10/L10 | P.IVA esistente dichiarata, venditore/fabbricante/ATECO/regime/IVA, prezzo totale, mercati; CGV/garanzia/recesso/resi/logistica prima di offerta/vendita applicabile | Commercialista + legale |
| A11/L11 | Privacy sostitutiva e termini/cookie/identità/IP/uso professionale approvati IT/EN/ES, footer e data efficacia, nessun placeholder; CGV/GPSR se applicabili | Fondatori + legale |
| A12 | Sicurezza account, backup/recovery, DNS/TLS/HTTP header, accesso minimo, incident response, audit autorizzato; tecnico indicato non equivale a gestore legale | Tecnico + specialista |
| A13 | CI sullo SHA esatto, report lab, visual QA, Safari/Android reali, screen reader, zoom/contrasto/focus, test mailto senza dati reali, traduzioni e assets | Tecnico + autori |
| A14 | Pacchetto web isolato da docs/sorgenti di revisione, nessuna credenziale/dati reali anche nella storia, verifica config Pages e deploy preview autorizzato; approvazione finale | Gestore + tecnico |

Nessuna approvazione chiusa automaticamente. Conferme dichiarative non equivalgono a verifiche documentali. Ruoli, indirizzi, P.IVA, documenti, consensi e segreti in archivio privato; repository e branch sono pubblici. Non caricare manuale originale, dati sanitari, identità private, contratti o screenshot amministrativi. #57 GPSR art.4/19 va valutato ora: non basta chiamare una pagina "richiesta"; se è offerta a distanza applicare obblighi o rimuovere/riformulare offerta. Verifica normativa aggiornata al rilascio, inclusi obblighi accessibilità, recesso/garanzia e mercati; questo audit non è parere legale. Per i futuri servizi #59–65 gate separati e sandbox, mai attivare con questa PR.

## Piano di pubblicazione — solo dopo autorizzazione separata
1. Congelare prezzo, specifiche, copy e branch; chiudere A01–A14 con approvazioni ed evidenze. Sostituire le tre privacy radice con versioni approvate; promuovere i testi legali .html.txt solo dopo rimozione placeholder e note e aggiungere footer localizzati. Non pubblicare testi in revisione. Correggere/ritirare articoli o asset non approvati, aggiornare link, sitemap e test coerentemente.
2. Verificare in sola lettura GitHub Pages source/build, custom domain/CNAME, HTTPS, Cloudflare DNS/proxy/cache, branch protection e autorizzazioni. API Pages non accessibile tramite connettore in questo audit: configurazione effettiva non verificata. Stabilire esattamente il meccanismo di deploy prima del merge. Backup privato di main, configurazioni, asset e pacchetto pubblicato, test ripristino; no segreti nel repo. Non cambiare DNS o CNAME automaticamente.
3. Preparare pacchetto web con allowlist: HTML approvati radice, CSS/JS locali effettivamente referenziati, immagini/font/icone/manifest, sitemap/robots/CNAME e .well-known/security.txt verificato, solo PDF tecnico approvato. Escludere docs/legal e tutti .html.txt, report, test, file setup, note interne, asset storici non necessari e sorgenti proprietari; escludere dati personali non autorizzati. Verificare tutte le dipendenze (srcset, CSS url(), favicon, font, PDF) con manifest/hash e test su pacchetto, non solo repo. Se Pages serve branch root, scegliere con autorizzazione un processo di build/artifact controllato o ramo/pacchetto pulito; non assumere che noindex o robots proteggano file. Non aggiunto un workflow di deploy. Audit asset/storia Git separato; escludere dal deploy non rimuove da GitHub.
4. Rivalidare main e base; se main cambia, riconciliare in ramo nuovo e ripetere CI. Creare futura PR verso main/pacchetto autorizzato con diff cumulativo #67–82 e approvazioni, senza unire le PR storiche singolarmente. Verificare SHA, tutte le CI, no placeholder, privacy e assenza di prezzi obsoleti nei contenuti attivi; collaudo statico e staging autorizzato con dati fittizi, mailto senza invio. Ottenere ok esplicito, solo allora eseguire merge/deploy. Nessuna azione ora.
5. Post-deploy: controllare SHA deployment, HTTPS, 3 lingue, prezzi, form/mailto, policy, canonical/hreflang, sitemap, noindex, assenza tracker, network/storage, responsive e accessibilità. Verificare URL diretti dei file esclusi restituiscano 404; non divulgare percorsi privati. Misurare CWV campo dopo disponibilità dati, non confondere lab. Search Console eventuale attivazione separata; niente Stripe/Make/Sendcloud/CRM/account digitali/marketing.

## Rollback — esercitazione privata prima del lancio
Trigger: errori 4xx/5xx su percorsi critici, form trasmette dati impropri, privacy/claim errati, indisponibilità o regressione significativa, esposizione file/dati, TLS/DNS guasto. Sospendere rollout, registrare ora/SHA/sintomi ed evidenze minimizzate, avvisare gestore/titolare. Ripristinare pacchetto precedente verificato (SHA main osservato b1830b239151e4851bd1d5350d11adccb8efed55 solo riferimento, riconfermare al lancio) tramite nuovo revert PR/commit o redeploy dell'artifact precedente autorizzato, senza force push, senza eliminare cronologia, senza modifiche DNS salvo necessità e approvazione. Attenzione: main precedente non automaticamente conforme; se necessario usare pagina di manutenzione autorizzata priva di raccolta/offerta. Purge cache mirato solo se necessario, verificare deployment e smoke test. Se esposizione dati, contenere accesso, preservare evidenze, ruotare segreti compromessi, valutare obblighi di notifica con titolare e consulente; rollback non cancella copie pubbliche. Non riattivare finché causa e gate risolti. Nessuna procedura eseguita.

## Check operativo finale
- [ ] A01–A14 pertinenti chiusi con prove e approvazioni
- [ ] CI finale su SHA effettivo verde, report laboratorio completo
- [ ] Privacy e footer definitivi, no placeholder, claims approvati
- [ ] Pacchetto allowlist verificato, backup e ripristino provato
- [ ] Conferma esplicita pubblicazione e responsabile release
- [ ] Collaudo post-deploy e monitoraggio concordati
- [ ] Servizi futuri mantenuti inattivi

### Cache commerciale e guard aggiuntivi
Versioni shop JS v6 e guida JS v7 riallineate nelle sei pagine che le caricano, per evitare riutilizzo del copy precedente in cache. Script invariati nel contenuto. Aggiunto controllo statico prezzi 159/179 EUR sulle 9 pagine commerciali e 3 script e presenza nota editoriale nei 12 articoli. Restano da verificare cache CDN effettiva, inventario completo asset/storia e approvazioni.

## Fase 4 — conferma identità del gestore
Silvia Dierico confermata dal referente quale gestore giuridico e futuro venditore tramite la propria partita IVA; già indicata quale titolare GDPR. A01 e A10 parzialmente completati a livello dichiarativo, non chiusi: P.IVA, domicilio professionale e recapiti obbligatori, regime/attività e fabbricante da verificare. Aggiornate le tre bozze informazioni legali, non le pagine attive. CI precedente run 45913740430 success; nuova CI da verificare. Nessun merge/deploy. NO-GO invariato.

## Fase 4 — dati identificativi e fiscali dichiarati
Ricevuti P.IVA, domicilio professionale, PEC; regime forfettario dichiarato. Controllo formale P.IVA (checksum) positivo, nessuna verifica dell'attribuzione o del regime presso fonti ufficiali. Aggiornate nove bozze legali IT/EN/ES. A01 dati principali ricevuti, approvazione e completezza da verificare (CAP, eventuali iscrizioni/recapiti obbligatori); A02 indirizzo fornito, verifica ruoli/DPO; A10 verifica commercialista e fabbricante ancora aperta. Non dedurre che la posizione fiscale attuale consenta già la vendita. NO-GO invariato. Nessun merge/deploy.

## Conferme Step 02 — 27 novembre 2026
Il referente dichiara: nessun DPO nominato; procedura di conservazione delle richieste per 12 mesi dalla chiusura approvata, con eccezioni documentate di legge/difesa di diritti; nessuna lista clienti, newsletter o consenso marketing storico; mantenere provvisoriamente Gmail consumer, subordinatamente alla verifica contrattuale e privacy. Non si presume l'assenza di normali messaggi o archivi di corrispondenza. Non è stato svolto uno screening documentale dell'obbligo DPO ex art.37 GDPR; da completare con il titolare anche in relazione alle sue altre attività. La procedura di conservazione è approvata a livello dichiarativo ma non ancora attuata/verificata: definire responsabile, data di chiusura, riesame mensile, cancellazione e gestione cestino, copie/inoltri/backup, eccezioni e prova minima; nessuna cancellazione eseguita, nessuna automazione creata. Marketing resta sospeso; eventuali future adesioni richiederanno procedura separata. Gmail: nessun DPA consumer disponibile secondo Google; valutare ruolo, art.28 ove dovuto, trasferimenti e adeguatezza; se verifica negativa, adottare soluzione appropriata prima del rilascio del flusso di raccolta. Non acquistare o migrare ora. Aggiornate tre informative privacy v0.7 di revisione. A02/A04/A06 avanzati nelle decisioni, A03 ancora aperto; audit cookie, diritti, destinazione, GPSR, fiscalità, approvazione dei testi, attuazione e QA restano necessari. Nessuna approvazione definitiva automatica dei sei testi. CI precedente 45915108648 success. Nessun merge, pubblicazione o attivazione servizi. Proseguire con Step 03 prodotto e contenuti, Step 04 sicurezza/hosting per verifiche tecniche.

## Fase 4 — Step 03: prodotto, IP e GPSR
Revisione documentale del candidato e delle checklist #51/#57/#58; CI precedente 45915570127 success. Specifiche di progetto 102 (2×51), manuale 60 pagine, 22 schede integrate 8/6/8, chiusura magnetica, dimensioni indicative 21×21×5 cm; nessun collaudo fisico. Venditore dichiarato non equivale a fabbricante giuridico. Manuale originale, campione, rapporti prove, diritti e registrazione marchio non reperiti nelle fonti esaminate; le affermazioni cliniche originali e la grafica restano da verificare. Aggiornate bozze IP e uso professionale nelle tre lingue; creato registro docs/legal/phase4-step03-product-review-20261127.md. A07–A09/A10 restano aperti, nessuna attestazione o pubblicazione. Non rimuovere o promuovere asset senza approvazione; se non autorizzati, escluderli dal futuro pacchetto web e valutare separatamente cronologia pubblica. Nessuna stampa, ordine, modifica prezzo o servizio.

## Conferme Step 03 — 27 novembre 2026
Risposte dichiarative del referente, non verifica indipendente. P01: specifiche e disponibilità del campione da verificare; i valori 102/60/22 e dimensioni indicative restano dati di progetto non definitivi. P02: Silvia Dierico indicata come soggetto che commissiona e commercializza sotto il marchio PdT, quindi candidata al ruolo di fabbricante giuridico ai sensi GPSR, da verificare rispetto al processo effettivo e agli obblighi applicabili; produttore materiale ancora da identificare. P03: destinazione d'uso non approvata; destinatari indicati adulti e minori in contesti professionali, senza età minima convalidata. Non pubblicizzare l'idoneità ai minori prima della valutazione di sicurezza, classificazione, competenze, appropriatezza e autorizzazioni; verificare uso prevedibile, magneti e parti piccole, istruzioni e eventuale disciplina giocattoli/dispositivi medici in base alla finalità effettiva. P04: Silvia Dierico e Roberto Antoniello detengono i diritti sui materiali originali e autorizzano la commercializzazione secondo conferma del referente; marchio dichiarato registrato. Conservare prove, ripartizione diritti e autorizzazioni in archivio privato; acquisire certificato/numero, titolare, classi, territorio, stato e verificare corrispondenza logo/segno prima di dichiarare registrazione pubblicamente. Nessuna prova acquisita o verifica registrale eseguita; nessuna modifica al simbolo/logo. P05/P06: manuale, claim, campione, distinta, prove, fascicolo GPSR, etichetta, tracciabilità e natura dell'offerta restano aperti. IP v0.6 e uso professionale v0.5 nelle tre lingue: bozze aggiornate, nessuna promozione pubblica. A07–A09/A10 avanzati solo nelle dichiarazioni, non chiusi. Prezzi e sito attivo invariati. CI precedente 45915900388 success. Step 04 sicurezza/hosting può procedere in parallelo; NO-GO fino a evidenze e approvazioni. Nessun merge, pubblicazione, stampa, ordine o servizio.

## Fase 4 — Step 04 cybersecurity
Audit in sola lettura documentato in docs/legal/phase4-step04-security-hosting-audit-20261127.md. Repository pubblico has_pages=true, main protected=true; dettaglio regole, Pages, collaboratori e Actions permissions non accessibili. DNS/HTTPS/header/cookie reali non verificati per limiti di accesso; non dedurre disservizio. Scan mirato JS e controlli form/CI locali, aggiunta regressione storage locale 15 pagine, CI nuova da verificare. Checklist S01–S12, piano backup/restore proposto, nessuna copia o prova ripristino eseguita. Gmail consumer provvisorio con gate DPA/ruoli ancora aperto. A03/A04/A05/A12–A14 restano aperti; NO-GO. Nessuna modifica configurazione, merge, pubblicazione o attivazione.
