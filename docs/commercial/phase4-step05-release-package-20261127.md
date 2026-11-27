# Fase 4 / Step 05 — pacchetto di release e collaudo (QA ONLY / NO-GO)
27 novembre 2026. Candidato base 9290b0f4244085c9fc0bf14c6f43da271796ad94, CI precedente 46063013830 success, main b1830b239151e4851bd1d5350d11adccb8efed55. PR #82 resta aperta/in bozza. Nessun deploy, merge, modifica Pages/DNS, servizio o ZIP pubblicabile.

## Separazione fisica e collaudo
- Allowlist esplicita scripts/release-qa-allowlist.json: 66 HTML radice, CSS/JS e file tecnici espliciti, 34 immagini ammissibili solo se referenziate dal testo dei file web. Non si aggiungono directory intere; modifiche inventario richiedono revisione. Build in directory nuova esterna al repo, senza symlink/path traversal; verifica href/src/srcset, CSS url/import, manifest e sitemap, poi manifest esterno al web con SHA256, dimensioni, elenco esclusi e SHA sorgente. Controllo riferimenti JS letterali e browser non equivalgono a copertura di ogni possibile percorso dinamico.
- QA include deliberatamente le tre privacy radice obsolete e il SOLO PDF tecnico preliminare (per mantenere link e test attuali). Non sono approvati. Anche immagini, articoli e offerta sono da approvare. Nessuna bozza .html.txt, report, Markdown, setup, CSV/JSON interni, script test, workflow o immagini storiche non referenziate nel web tree. PDF è unica eccezione docs/ solo QA, non certificazione. Repo pubblico: esclusione dal web tree non rende privati file già in GitHub o nella cronologia.
- Il builder non ha modalità produzione, richiede tutti i gate OPEN ed esce con errore se si tenta di cambiare stato senza nuovo processo revisionato. Il web tree rimane nel runner temporaneo; pubblicato solo report CI di metadati (manifest, report prestazioni, screenshot sintetici già previsti), NON artifact web/ZIP né deploy. Non usare il tree QA come cartella Pages.
- Site Quality: statico sorgente, build, statico e sintassi sul tree QA, smoke moduli, accessibilità, browser e lab locale sul tree QA, verifica finale file set e hash invariati; output test fuori dal tree. Test storico render originali solo nel sorgente, non necessario nel pacchetto. Nessun allentamento delle altre asserzioni. Nuova CI da verificare.
- Comandi locali (repository checkout, dipendenze disponibili): python3 scripts/build_release_qa.py --out /percorso/nuovo/pdt-qa ; PDT_WEB_ROOT=/percorso/nuovo/pdt-qa/web python3 scripts/check_site.py ; python3 scripts/verify_release_qa.py /percorso/nuovo/pdt-qa . Solo server loopback e dati fittizi, non inviare mail. Manifest non è un backup o approvazione.

## Checklist finale GO/NO-GO
| Gate | Stato attuale | Condizione GO |
|---|---|---|
| A01 | parziale | identità e dati obbligatori verificati |
| A02 | parziale | titolare, ruoli, obbligo DPO e informativa approvati |
| A03 | aperto | Gmail/Cloudflare e contratti/trasferimenti verificati |
| A04 | parziale | procedura 12 mesi attuata e verificata |
| A05 | aperto | audit browser/CDN cookie effettivi |
| A06 | parziale | marketing sospeso verificato, nessuna raccolta non approvata |
| A07 | parziale | prova diritti/marchio, liberatorie e asset autorizzati |
| A08 | aperto | destinazione, minori, manuale e claim/traduzioni approvati |
| A09 | aperto | campione, sicurezza GPSR, fabbricante, etichetta e tracciabilità |
| A10 | aperto | fiscalità e offerta/vendita/CGV/recesso/garanzie ove applicabili |
| A11 | aperto | sei testi in tre lingue approvati, privacy obsolete sostituite, footer e date efficacia |
| A12 | aperto | account/MFA, Pages/DNS/TLS, backup/restore e sicurezza verificati |
| A13 | parziale | CI esatto pacchetto definitivo, QA reale mobile/screen reader/traduzioni e mailto |
| A14 | parziale | allowlist definitiva, audit storia, deploy source e backup verificati, firma GO separata |

**Verdetto NO-GO.** Nessun gate chiuso definitivamente per semplice CI/conferma dichiarativa. Per i dati fiscali, prodotto e titolarità usare archivio privato; nessun certificato o dato riservato in repo. Se si sceglie vetrina puramente informativa più limitata, definire e approvare separatamente perimetro, rimuovere offerta/claim e raccolte non approvate, rifare link, policy, SEO e test: non è autorizzata automaticamente da questo step.

## Passaggio alla produzione (NON eseguito)
1. Chiudere gate pertinenti con evidenze/approvatori; sostituire privacy e promuovere soltanto testi legali approvati, footer localizzati, rimuovere placeholder, contenuti e asset non autorizzati. Verificare PDF definitivo o rimuovere link e PDF; non riusare QA come produzione.
2. Confermare amministrativamente Pages source/build, custom domain, proxy/TLS, autorizzazioni e backup/restore prima del merge. Definire processo di deploy allowlist separato, non pubblicare repo root. Revisione nuova del builder/manifest per produzione, manifest finale firmato/approvato e CI esatto. Non cambiare configurazione in questa PR.
3. Nuova PR cumulativa verso main o artifact autorizzato; verificare main, SHA, differenze e gate. Non unire le PR storiche singolarmente. Conferma esplicita GO del gestore, soltanto dopo tutte le verifiche pertinenti. Nessuna operazione di pubblicazione oggi.
4. Collaudo pre/post release e rollback: HTTPS/redirect, 3 lingue, prezzi e richieste senza invio reale, policy, cookie/storage, SEO, mobile, percorsi interni esclusi 404. Backup precedente verificato, revert/redeploy senza force push; manutenzione autorizzata se precedente non sicuro. DNS invariato salvo autorizzazione distinta.
