# PdT — Sito 10: galleria e video (bozza)

Base PR #76. Inventario dal tree e didascalie esistenti, non da verifica fotografica del campione. Nuove gallerie IT/EN/ES con 3 asset, nessun nuovo file immagine o video.

| Asset | Classificazione documentale | Decisione |
|---|---|---|
| pdt-cofanetto-signature-2026.webp | rendering 3D 1448x1086 | mostrare con didascalia esplicita |
| pdt-grafica-frontale-2026.webp | grafica fronte 1002x1000 | mostrare come artwork, non foto |
| pdt-grafica-retro-2026.webp | grafica retro 1497x1500 | artwork; controllare testo, indicazioni e diritti prima del rilascio |
| 05_manuale_schede.webp | immagine promozionale 609x683, origine/leggibilità/diritti non verificati | già presente, qualificare in prodotto/Pre Order; non replicare nella nuova galleria; verificare o rimuovere prima del rilascio |
| 06_mazzi_affiancati.webp | immagine promozionale 644x579, origine non verificata | già presente, qualificare; non replicare |
| 01–04, SVG anteprime, pdt-render-*, pdt-*-hq.*, atlas | asset storici/anteprime, revisione e provenienza non accertate | non reintrodurre automaticamente |
| ritratti autori | materiale esistente per pagina autori | fuori dalla galleria prodotto |

Non risultano file video nel tree; nessun player finto, iframe, embed esterno, autoplay, link video inventato, tracking o data di pubblicazione. Non affermare che le immagini promozionali siano foto reali. Repo pubblico: non caricare originali integrali o file riservati in alcun branch. Le grafiche esistenti richiedono controllo visivo/diritti, compresi eventuali testi della confezione. Nessuna nuova immagine originale generata.

## Piano di produzione (proposto, non materiali esistenti)
1. Shooting dopo ricezione e verifica campione: 6–8 scatti (fronte, retro, 3/4, apertura magnetica, interno, due mazzi, dettaglio finiture, manuale chiuso/copertina approvata). Sfondo neutro, luce diffusa, riferimento scala ove utile; nessun filtro che alteri colore/materiali. Non mostrare pagine leggibili senza autorizzazione. Conservare master privati, derivati autorizzati WebP/AVIF, alt locali, dimensioni dichiarate, lazy loading.
2. Unboxing Signature (45–60 s): cofanetto chiuso, apertura, contenuto, chiusura; solo dopo verifica campione. Inquadratura dall'alto + dettagli; nessuna affermazione su materiali non confermati.
3. Metodo in pratica (60–90 s): introduzione, Osserva/Racconta/Approfondisci con situazione inventata e immagine autorizzata; non mostrare schede originali, pazienti o risultati clinici; voce narrante, didascalia dimostrativa.
4. Tre contesti (3 clip da 30–45 s): individuale, gruppo, HR con attori adulti consenzienti o riprese di oggetti. HR: dialogo sui processi, non valutazione. Evitare dati sensibili o storie reali; partecipazione volontaria.
5. Versioni 16:9 per sito e 9:16 per social, audio comprensibile, sottotitoli IT/EN/ES e trascrizione, nessuna musica senza licenza. Liberatorie ove necessarie, diritti immagini/audio, autorizzazione autori, verifica metadati, accuratezza del prodotto, revisione professionale. Master privati. Derivati web solo dopo approvazione; player futuro con controlli accessibili, niente autoplay/tracker, valutare privacy e hosting. Nessun servizio attivato.

## QA
Aggiornate didascalie in Pre Order e prodotto, preservati i quattro asset preesistenti e gli ancoraggi; link alla nuova galleria, canonical/hreflang e sitemap. Test statici e browser no-JS 320/1365. CI #76 run 127: click EN navigava al nuovo URL mentre l'asserzione richiedeva ancora italiano; aggiornato a usePages[0] senza ridurre il requisito di navigazione. Esiti ulteriori da verificare. Revisione traduzioni, asset e diritti, CI, gate #67–76. Non unire o pubblicare senza autorizzazione.
