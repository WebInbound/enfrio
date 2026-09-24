# HANDOFF — Enfrio, Sezione A della proposta KW-2026-002 (S3, 24-25 set 2026)

Sessione S3 del piano `KiwiNetwork\docs\kiwi-business\PIANO-SESSIONI-3-clienti.md`. Il sito era già collegato al
pannello Kiwi (vedi `HANDOFF-kiwi-panel.md`, che resta valido). Qui ci sono le due lavorazioni "wow" della
Sezione A e lo stato della fase di completamento.

| Voce | Cosa | Stato |
|---|---|---|
| A.4 | M Tower 3D (120 fotogrammi) | già online prima di S3 |
| A.5 | **Configuratore → richiesta d'offerta nel pannello + PDF** | **online dal 24 set** (`main` 17d604e) |
| A.6 | **Versione italiana** `/it`, testi dal pannello | vedi "Versione italiana" sotto |
| A.8 | Coefficienti reali + scheda tecnica PDF | **aspetta Enfrio** (`clienti\enfrio\DOMANDE-per-Enfrio-S3.md`) |
| A.9 | Account del cliente nel pannello, avvisi email | aspetta nomi ed email (S6) |
| A.10 | Gallerie e referenze modificabili | fatto (4 elenchi EN + 4 IT in "Elenchi") |
| A.11 | Informativa privacy IT/EN con Kiwi responsabile | **aspetta la validazione di Enfrio**: testi pronti da scrivere nel pannello, vedi sotto |
| A.12 | Giro di revisione (testi, recapiti, social) | aspetta Enfrio |

## A.5 — Richiesta d'offerta dal configuratore

Il pulsante del configuratore ("Send this configuration to Enfrio engineering →") apre un pannello (destra su
desktop, dal basso su telefono) con la configurazione (moduli, render, 12 dati) e un modulo breve. Il link
verso `/contact?…` resta come ripiego (senza JavaScript, nuova scheda, clic prima dell'idratazione).

Invio (`src/actions/quote.ts`):
1. il server **ricalcola** il dimensionamento dagli input (`src/lib/mtower-sizing.ts`, stessa funzione del
   configuratore) con i coefficienti del pannello; i numeri del browser non contano;
2. costruisce il PDF A4 (`src/lib/mtower-pdf.ts`: pdf-lib + Rajdhani OFL in `src/assets/pdf/`, logo e render dal
   pannello ridotti con sharp, ~56 KB). Se il PDF fallisce la richiesta parte lo stesso, senza riepilogo;
3. email a Enfrio con FormSubmit (`src/lib/formsubmit.ts`, come il form contatti). **Solo in produzione**: sulle
   preview e in locale l'invio è simulato (a meno di `CONTACT_TO` esplicito);
4. solo se l'email a Enfrio è partita: la richiesta va nel pannello (Messaggi, fonte
   "enfrio.it/tower-m · configuratore M Tower", configurazione nel testo e in `metadata`) e Kiwi manda il PDF al
   richiedente (`requester_copy`, kiwi-network PR #252, doc `docs/siti-clienti-contatti-copia-richiedente.md`);
5. il visitatore vede il riferimento (`MT-AAMMGG-XXXX`), scarica il PDF e legge se è partito per email.

Protezioni: limite in memoria 3 invii ogni 10 minuti per IP (prima del PDF e di FormSubmit; niente cookie: un
cookie impostato in una server action fa rinfrescare la pagina a Next e la pagina dietro il pannello saltava in
cima). Lato Kiwi: company abilitata in `SITE_REQUESTER_COPY_COMPANY_IDS` (env del pannello, oggi solo Enfrio),
IP firmato, 20 copie all'ora per company e 3 al giorno per destinatario contati sul DB. Nel testo e nel PDF mandati
al richiedente non c'è niente di scritto dal visitatore.

Testi nel pannello: gruppi "M Tower › Richiesta d'offerta — …" (pannello, conferma, PDF, email al richiedente,
avviso a Enfrio). Campi, consenso ed errori sono quelli di "Form contatti ›".

Prova end-to-end fatta sulla preview il 24 set (destinatario `delivered@resend.dev`, richiesta archiviata):
4,6 s, copia `sent`, PDF corretto. In produzione aperto il pannello senza inviare (arriverebbe una mail vera).

## A.6 — Versione italiana

Struttura:
- `src/app/(en)/…` e `src/app/(it)/it/…`: due **layout radice** (`<html lang>` giusto, pagine statiche, URL inglesi
  invariati). Le route sono file sottili; le pagine vere stanno in `src/views/*Page.tsx` e ricevono `lang`.
  Il documento è `src/components/RootDocument.tsx`.
- **404**: `src/app/global-not-found.tsx` (`experimental.globalNotFound`). Non usare `notFound()` dentro una pagina
  con due layout radice: Next 16 risponde con una shell di errore vuota (`<html id="__next_error__">`) e disegna il
  404 nel browser. Le URL italiane sconosciute mostrano il 404 inglese.
- Testi: `src/content/it/<pagina>.ts` (chiave = slug inglese) → blocco `it_<slug>` nel gruppo
  "Italiano › <gruppo>" (`localizedBlock()` in `src/lib/kiwi.ts`). Un testo senza traduzione (immagini, link,
  numeri, coefficienti, dati aziendali, marchi) è **condiviso** con l'inglese. Elenchi: `it_<slug>` con le
  didascalie tradotte ("… (IT)" in Elenchi).
- Lingua lato client (numeri "3.000", testi per screen reader): `src/components/I18nProvider.tsx` + `useI18n()`.
  Lato server la lingua si passa esplicita: `getContent(PAGE, lang)`, `getEdit(PAGE, lang)`, `getList(def, lang)`,
  `pageSeo(path, seo, lang)`, link con `localePath(lang, "/x")`.
- Moduli: campo nascosto `lang`; messaggi, PDF (data italiana, numeri italiani) ed email al richiedente nella
  lingua della pagina.

**Pubblicazione** (pannello "Globale › Lingue", "Versione italiana online"):
- `0` (oggi, per contratto art. 9: si pubblica dopo la rilettura di Enfrio): le pagine `/it` si aprono col link e
  nell'editor Kiwi (il selettore lingua c'è sempre in modifica), sono `noindex`, niente selettore per i visitatori,
  niente `hreflang`, niente sitemap. L'inglese è identico a prima.
- `1` + "Pubblica": selettore EN/IT nel menu, `hreflang` en/it/x-default su tutte le pagine, `/it` nella sitemap e
  indicizzabile.
- Sulle **preview** la versione italiana è sempre pubblica (per la revisione).

Traduzione: bozza del 24 set (615 testi). Dubbi di terminologia da far confermare a Enfrio in
`clienti\enfrio\DOMANDE-per-Enfrio-S3.md`. Enfrio corregge dall'editor direttamente sulle pagine `/it`.

Aggiungere un testo: registro in `src/content/<pagina>.ts`, traduzione in `src/content/it/<pagina>.ts`, poi
`node scripts/kiwi-seed-sql.mjs --page <id>` (o `--lang it`) ed eseguire l'SQL. DB al 25 set: **1.336 blocchi**
(721 EN + 615 IT) e 36 voci di elenco, uguali al registro.

## A.11 — Privacy (cosa manca)

L'informativa inglese e quella italiana (tradotta fedelmente) sono ancora quelle di maggio: dicono che i dati del
configuratore arrivano a Enfrio solo col modulo contatti, e fra i responsabili non c'è Kiwi Network. Da scrivere
**nel pannello dopo la validazione di Enfrio** (nessun codice):
- `legal_recipients_processor_4` (EN) e `it_legal_recipients_processor_4` (IT): Kiwi Network S.R.L. responsabile
  del trattamento (pannello, conservazione dei messaggi e delle richieste d'offerta, email del riepilogo);
- `legal_collect_config_text` (+ IT): con la richiesta d'offerta i parametri sono conservati con i dati di contatto
  e il riepilogo PDF va all'email indicata (come nell'Allegato 1);
- conservazione allineata (oggi "24 mesi" sul sito, senza scadenza nel pannello) e `legal_hero_updated`.

## Parità

- EN: `npm run build`, `npx next start -p 3107`, poi `node scripts/parity-check.mjs http://localhost:3107 https://www.enfrio.it`
  → 10 pagine + 404 **identiche** (25 set). In locale Kiwi non è configurato e la versione italiana non è
  pubblica: è il confronto giusto per l'inglese.
- Sulla preview l'inglese ha in più il selettore e gli `hreflang` (versione italiana sempre pubblica lì).
