# PdT — audit finale delle PR #47–65
26 novembre 2026 — snapshot GitHub, non attestazione legale. Base comune osservata b1830b239151e4851bd1d5350d11adccb8efed55. Tutte 19 open, draft=true, merged=false, mergeable=true singolarmente rispetto alla base osservata. Lo stato può cambiare; ricontrollare prima del rilascio. Nessuna integrazione effettuata in questo audit.

## Inventario verificato
| PR | Ambito | File | Head SHA | Site Quality (run associato al commit) | Fase proposta |
|---|---|---:|---|---|---|
| [#47](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/47) | Privacy | 10 | `676327c7ffd6639dcb7d9d1bd339d480f41726a8` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45860811295) | A — condizionato |
| [#48](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/48) | Termini sito | 9 | `45df0e57bb216e3c929e7dfe5843cc9ab9f4ea56` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45861419757) | A — condizionato |
| [#49](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/49) | Cookie | 7 | `f23ece41a703eb28d0d3b25fccd5d638e71974e9` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45862073127) | A — condizionato |
| [#50](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/50) | Identità gestore | 7 | `a9faec638242d5165de9a6d2cc87c555dcb11058` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45862444909) | A — condizionato |
| [#51](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/51) | Proprietà intellettuale | 7 | `b311293ff2c9cbe034a7735fba226e0bcfae00bc` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45862774239) | A — condizionato |
| [#52](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/52) | Sicurezza | 13 | `95bd2354ecccf1f5ccb0ee2aaccc32db5ebb943d` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45863460625) | A — priorità tecnica |
| [#53](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/53) | Accessibilità | 17 | `454f0af1d3468243258b8aa192279adaff2b7fa3` | [FAIL](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45863934213) | A — CI fallita |
| [#54](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/54) | Trasparenza | 13 | `b57cbc77c36592badb052f21fc8a0ae9a9eca592` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45864515790) | A — priorità comunicazione |
| [#55](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/55) | CGV | 7 | `457f6000331e9ce73189556feaee9e4bad2db919` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45865111041) | B — prima della vendita |
| [#56](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/56) | Resi | 7 | `cf641e07190c355d4f312d8447c983e4e22c6820` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45865687681) | B — prima della vendita |
| [#57](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/57) | GPSR | 9 | `921cc43d3a0421f19ab8c316d8b79b414756646c` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45866730138) | A/B — gate offerta e prodotto |
| [#58](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/58) | Uso professionale | 20 | `1b6e295644fa5b631c54b2d336e97aa5ea24b1be` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45867797494) | A — condizionato |
| [#59](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/59) | Marketing | 8 | `02b58b07c4797677427d303f01e538b6636e176b` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45868388677) | A/B — consenso attuale e campagna futura |
| [#60](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/60) | CRM GDPR | 4 | `30c21a83f60e46e38a42f064c82463dad95a0916` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45868952908) | A/B — registro attuale e sistemi futuri |
| [#61](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/61) | Fiscalità | 3 | `c31cc902a395af9b9e6f4588947ed2d0f2ffdbbf` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45869516207) | B — gate fiscale |
| [#62](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/62) | Stripe | 3 | `8082561ed5fdc4dd277d48c1a80f98ec6d2353c5` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45871029828) | B/C — pagamento assistito / checkout |
| [#63](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/63) | Sendcloud | 3 | `e20e56206d9c780eb5ad181df3f5148366020205` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45871683147) | B/C — logistica manuale / API |
| [#64](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/64) | Licenze | 3 | `5c80fcc9609d9cfe6c5a4564ed22fbf85dcbd658` | [PASS](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45872190500) | D — area riservata |
| [#65](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/pull/65) | Make | 3 | `256539635914bdfa2dcf6d86482d2235fe6a39bf` | [FAIL](https://github.com/pdtcartestorytelling-coder/pdt-storytelling-cards/actions/runs/45872969370) | C — CI fallita |
Totale: 153 occorrenze file per PR, 92 percorsi distinti, 14 condivisi e 78 esclusivi. Controllo degli elenchi completi dei file, metadata/diff disponibili e run GitHub Actions associati alle 19 head; esito workflow 17 success, 2 failure. Non è revisione riga per riga di ogni diff, né collaudo di un ramo integrato. Una CI verde su bozza non approva contenuto legale o sistema futuro.

## Sovrapposizioni reali (stesso percorso, non necessariamente conflitto Git)
| Percorsi | PR |
|---|---|
| pre-order.html, pre-order-en.html, pre-order-es.html | 47,48,52,53,54,55,56,57,58,59 |
| index.html, home-en.html, home-es.html | 48,49,50,51,53,54,58 |
| contatti.html, contact-en.html, contact-es.html | 47,52,53 |
| interest.js | 52,54,59 |
| script.js | 52,53 |
| guida-informativa.js | 53,54,58 |
| scripts/check_site.py | 52,53,54,59 |
| .github/workflows/site-quality.yml | 52,53,59 |

## Evidenze CI fallite, log consultati
- #53 run 45863934213, job 140061792197: step Accessibility keyboard and no-JS regression; AssertionError ERR_ASSERTION: index.html menu keyboard navigation. Test: dopo skip link, focus toggle, Enter (aria-expanded true), Tab deve raggiungere .nav-panel. Errore effettivo, causa da isolare (focus order, CSS, rendering e interazione col resto del layout); non rimuovere assertion. AVIF e browser smoke successivi skipped. Correggere e ripetere tutte le 9 pagine, no-JS e tastiera, più test manuali.
- #65 run 45872969370, job 140092824036: step Browser smoke test, TimeoutError: Timed out after 20000 ms while waiting for the WS endpoint URL to appear in stdout. Modifica #65 solo documentale, non prova di regressione Make né prova che il test sia innocuo. Indagare avvio Chromium/runner, pin versione e diagnostica; rerun controllato, nessuna deroga al gate. Non è stato eseguito rerun in questo audit.
- Entrambi i log segnalano deprecazione Node.js 20 per upload-artifact@v4. Verificare azioni e compatibilità runner, aggiornare solo con test.

## Evidenze di contenuto
- main index e Pre Order: CTA Acquista, 199 barrato con nota listino futuro; #54 cambia in prezzo futuro esplicito, non vincolo. Prodotto.html dice 22 schede integrate nel manuale; altre pagine possono far intendere materiali separati. Confermare distinta reale e origine Made in Italy. #54 non è verifica della veridicità di prezzo/origine.
- #52 pre-order imposta form-action 'none', controlli disabled data-pdt-enable e interest.js abilita dopo handler. #59 parte da main, ha form-action 'self', checkbox non disabilitata e codice senza abilitazione #52. #54 ha versioni cache e testi prezzi differenti. Sostituzione integrale del file annullerebbe fix; integrare semanticamente.
- #58 guida contiene ancora Essential/Studio, risposte senza prezzo verificato; #54 aggiorna prezzi e singola edizione. #53 modifica live region. Integrare tutte e tre le modifiche, non prendere ultima versione come unica fonte.
- #47 informativa ha placeholder espliciti su identità, recapiti, fornitori, trasferimenti e retention. #49 e #48 sono noindex e bozze; noindex non è controllo accessi. Non pubblicare placeholder.
- #47 contatti-acquista.html è redirect noindex verso contatti, mantenere e testare.
- La situazione reale di account, traffico, Cloudflare, cookie, fiscalità, prototipo, fornitori e vendite offline non è stata verificata. Non accertata conformità attuale. Audit asset/storia Git e documentazione pubblica da completare; documento storico delle licenze da rivedere, nessuna cancellazione eseguita.

Fasi: A vetrina attuale (dopo gate); B vendita assistita; C automazioni e checkout; D digitale. Consultare 20-consolidation-plan.md e 20-release-gates-and-decisions.md. Nessuna PR precedente modificata, chiusa o unita.
