# PdT — rimborsi, contestazioni e collaudo pagamenti
26 novembre 2026 — bozza, nessuna transazione reale o test Stripe eseguito.

## Procedura rimborsi
Collegare case_id, order_id, pagamento e documento fiscale (#56/#61). Verificare identità/ordine in modo proporzionato, diritto e importo, valuta, stato acquisizione, eventuali contestazioni e residuo rimborsabile. Se solo autorizzazione, valutare annullamento anziché rimborso. Per incasso acquisito, rimborso sul mezzo originale salvo accordo lecito senza costi. Controllo manuale e autorizzazione prima dell'azione; lock per pagamento, chiave idempotenza stabile per pratica e importo approvato, ledger persistente. Non inviare refund duplicato dopo timeout; recuperare stato provider. Non rimborsare separatamente una somma già stornata tramite contestazione; coordinare con provider e obblighi legali. Se pending/failed, aprire eccezione e assicurare rimedio nei termini dovuti; monitorare saldo sufficiente. Confermare al cliente solo stato verificato, distinguendo avvio da completamento/accredito. Rimborsare importo dovuto senza detrarre commissioni Stripe; note di variazione secondo consulente, non ostacolare rimborso legale. Conservare prove minime private.
Stripe: commissione originaria di elaborazione non restituita, verificare tariffe e condizioni; prevedere riserva di cassa per rimborsi e contestazioni.

## Contestazioni (chargeback)
Ricevere evento, verificare stato nel Dashboard, registrare ID, importo, motivo e termine specifico per rispondere. Sospendere spedizione se non ancora effettuata e valutare contratto/diritti cliente. Riconciliare addebito e commissioni con contabilità. Decidere se accettare o contestare con referente autorizzato; fornire prove veritiere e pertinenti (ordine, condizioni accettate, conferme, tracking, consegna, corrispondenza, rimborso), oscurare dati estranei. Mai fabbricare prove o chiedere OTP. Non confondere contestazione con recesso/garanzia. Monitorare esito e chiudere pratica solo dopo riconciliazione. Radar e 3DS riducono alcuni rischi, non garantiscono esito favorevole. Contattare cliente senza pressioni indebite.
Riconciliazione settimanale proposta: transazioni acquisite, commissioni, saldo, payout, banca, rimborsi, contestazioni, documenti fiscali, ordini e spedizioni; eccezioni separate e risolte. Controllo giornaliero delle scadenze contestazioni/rimborsi durante operatività.

## Test di accettazione (da eseguire in sandbox/test mode con dati sintetici)
| ID | Scenario | Esito atteso |
|---|---|---|
| T01 | Pagamento riuscito, importo corretto | Un ordine pagato, una sola evasione autorizzata |
| T02 | SCA completata / abbandonata / fallita | Solo pagamento acquisito verificato autorizza evasione |
| T03 | Carta rifiutata, fondi insufficienti | Nessuna evasione, messaggio neutro e nuovo tentativo controllato |
| T04 | Success URL visitato direttamente | Nessuna conferma di pagamento senza provider |
| T05 | Prezzo, quantità, valuta o ordine alterati | Rifiuto/hold; server decide totale |
| T06 | Firma mancante/errata, raw body alterato, replay scaduto | Rifiuto prima di effetti o accettazione |
| T07 | Stesso evento duplicato, eventi distinti stesso ordine, concorrenti | Una sola azione business e audit |
| T08 | Eventi fuori ordine / tardivi | Recupero stato corrente, nessuna regressione o spedizione indebita |
| T09 | Sessione scaduta, doppio link/tentativo, stock esaurito | Nessuna evasione doppia; hold e rimedio se incasso tardivo |
| T10 | Session completed ma non paid | Attesa, nessuna evasione |
| T11 | Storage indisponibile / ACK perso | Retry sicuro, evento durevole prima ACK, dedup |
| T12 | Timeout Make/Fatture in Cloud/Sendcloud | Riconciliazione prima retry, nessuna duplicazione |
| T13 | Rimborso totale/parziale, duplicato, residuo superato | Importo corretto, singolo effetto, blocco eccedenze |
| T14 | Rimborso pending/failed / saldo insufficiente | Escalation e rimedio, stato non falsamente completato |
| T15 | Contestazione prima/dopo spedizione | Pratica, termine, hold se applicabile, nessun doppio rimborso |
| T16 | Ambiente o account errato / chiave revocata | Nessuna azione, alert e gestione sicura |
| T17 | Scarto SdI o fattura non richiesta | Stato fiscale separato, flusso #61, no doppio ricavo |
| T18 | Payout fallito, commissioni e rimborsi | Riconciliazione saldo/banca, non trigger spedizione |
| T19 | Accessibilità, lingua, mobile, obbligo pagamento, privacy | Riepilogo corretto, navigazione e consensi separati |
| T20 | Link individuale inoltrato, più sessioni, scaduto | Controllo ordine/destinatario e limite; eccezione senza doppia evasione |

Usare esclusivamente carte di test Stripe documentate; non usare numeri reali, dati personali reali, webhook live, invii SdI, etichette o email commerciali reali. Mock servizi esterni; non connettere ambiente test a produzione. Registrare versione, scenario, evidenza, esito, responsabile e data in archivio privato; nessun esito inventato. Gate: approvazione fiscale/legale, PCI applicabile, DPA, KYC, test passati, rollback (disabilitare link/checkout, mantenere gestione transazioni esistenti), monitoraggio e incident response #52. Non cambiare main prima di approvazione. 
Fonti: https://docs.stripe.com/refunds ; https://docs.stripe.com/disputes ; https://docs.stripe.com/testing ; https://docs.stripe.com/payment-links/customize ; https://docs.stripe.com/checkout/fulfillment .
