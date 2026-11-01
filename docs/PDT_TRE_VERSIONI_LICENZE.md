# PdT — versioni Low / Mid / Top e licenze digitali
Stato: progettazione, **non operativo**. 1 novembre 2026.

## Pack in studio (tutti con 102 carte = 2 mazzi da 51)
- LOW: custodia semplice, manuale digitale (60 pagine), 22 schede digitali.
- MID: cofanetto semplificato, manuale stampato (60 pagine), 22 schede digitali.
- TOP: cofanetto premium, manuale e 22 schede stampati; accesso digitale previsto.
Qualità delle carte invariata. Mix per circa 50 kit iniziali da decidere dopo preventivi e campioni; nessun prodotto ancora ordinabile.

## Licenze per documenti — architettura futura
1. Ogni pack porta un codice segreto di attivazione **univoco**, non indovinabile, generato dal backend. QR pubblico generico verso pagina di attivazione HTTPS, **mai un QR contenente il codice segreto**.
2. Utente si autentica con provider affidabile e riscatta il codice una volta sola; backend collega il tier al suo account.
3. Ogni richiesta documento passa da verifica server-side della sessione e dei permessi; i file non risiedono nel repository pubblico o su GitHub Pages, ma in storage **privato** con accesso autenticato/link temporanei.
4. Policy per recupero account, trasferimenti, revoche, limitazioni abusi, privacy GDPR, diritti e sicurezza; consenso marketing separato.
5. Watermark e lettura nel browser possibili ma non possono impedire definitivamente screenshot, copie o fotografie.
**Non sono stati creati account, codici, licenze o aree documentali. Non caricare segreti nel client.**

## Costi (solo pianificazione interna)
Obiettivi da chiedere alla stamperia, IVA inclusa: Low 28–30 €, Mid 45–50 €; Top da quotare. Non sono prezzi di vendita pubblici.
