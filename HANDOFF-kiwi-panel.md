# HANDOFF — Enfrio collegato al pannello Kiwi (23 set 2026)

Branch `feat/kiwi-panel`. Obiettivo: il cliente modifica testi, immagini principali e dati
dal pannello Kiwi e riceve lì i contatti, **senza che il sito cambi di un pixel**.

## Cosa c'è

| Cosa | Dove | Note |
|---|---|---|
| Registro dei contenuti | `src/content/*.ts` | 666 blocchi: slug = `<pagina>_<sezione>_<campo>`, etichetta e gruppo in italiano, default = testo del sito prima dell'integrazione |
| Collection | `src/content/collections.ts` | `technology_machinery_gallery` (5), `industries_madrid_gallery` (5), `projects_references` (3), `projects_snapshots` (5) |
| Lettura da Kiwi | `src/lib/kiwi.ts` | tutti i blocchi in una richiesta da `GET /api/site/blocks` quando Kiwi lo offre, altrimenti (e per gli slug assenti) uno per richiesta da `GET /api/site/block`; tutto in `unstable_cache` (tag `kiwi`, nessuna scadenza a tempo); timeout 2,5 s, max 4 richieste in parallelo (2 in build), circuit breaker 30 s (60 in build). Unico punto di rete: `kiwiGet()`. API in stile skill: `getBlock(slug, default, meta)` |
| Webhook | `src/app/api/revalidate/route.ts` | `POST ?secret=` → `revalidateTag("kiwi", "max")` |
| Form contatti | `src/app/contact/actions.ts` | salva in Kiwi (`/api/site/contact`) **e** manda la mail con FormSubmit come prima; successo se almeno uno dei due va |
| Configuratore M Tower | `src/components/MTowerSizer.tsx` | coefficienti e testi via props dalla pagina; gruppo "M Tower › Configuratore — coefficienti di calcolo (DA CONFERMARE)" |
| Seed del database | `scripts/kiwi-seed-sql.mjs` | genera l'SQL idempotente dal registro |

Le pagine restano **statiche** (ISR, `revalidate = 60` nel layout): nessuna visita chiama Kiwi. La rigenerazione
periodica legge solo la cache dati (nessuna chiamata a Kiwi) salvo i blocchi mai letti con successo.

## Come si comporta

- **Pubblica dal pannello** → Kiwi chiama `/api/revalidate` → tag `kiwi` "stale". Il visitatore
  successivo vede ancora la versione precedente (istantanea) mentre la pagina si rigenera; dal
  secondo in poi vede il testo nuovo. Provato in locale: 10-15 s per la home.
- **Kiwi lento o giù** durante una rigenerazione → `unstable_cache` restituisce l'ultimo valore
  buono (provato: pagina rigenerata con Kiwi irraggiungibile = testo modificato conservato,
  risposta al visitatore in 3 ms). Un blocco mai letto con successo mostra il default.
  Nei log compaiono righe `revalidating cache with key: ...` (di Next, una per blocco): innocue.
- **Kiwi non configurato** (`KIWI_COMPANY_ID` assente, es. build locale) → tutti i default.
- **Rate limit Kiwi** (`/api/site/block`: 120 richieste/min per IP+company, in memoria): 666
  blocchi non si leggono in un colpo. Il primo 429 apre il breaker, i blocchi restanti usano
  l'ultimo valore buono o il default, e la rigenerazione successiva (dopo 60 s, alla prima visita)
  completa il resto. Dopo una pubblicazione la pagina M Tower (~260 blocchi con menu e footer) può
  impiegare qualche minuto ad aggiornarsi del tutto; le altre pagine pochi secondi.
  **La cura vera è `GET /api/site/blocks`** (un altro agente lo sta aggiungendo a kiwi-network): il sito
  lo usa già appena risponde 200 — provato con un finto Kiwi locale: 1 richiesta per worker di build,
  i blocchi assenti dalla risposta letti uno per uno. Finché risponde 404 il sito non lo richiede per 10 min.
- **CDN di Kiwi**: `/api/site/block` e `/api/site/collections` rispondono `public, s-maxage=30,
  stale-while-revalidate=60`, quindi per ~90 s dopo una modifica il CDN restituisce il valore vecchio (visto
  in preview). Il sito aggiunge un parametro `_kv` diverso a ogni lettura per andare sempre all'origine:
  la cache la fa già il sito.
- **Build cache Vercel**: `next build` usa la cache dati di `.next/cache` ripristinata dal deploy precedente,
  che non sa nulla delle pubblicazioni successive. Un deploy può quindi partire con testi vecchi per la
  prima rigenerazione (≤ 60 s + la visita successiva). Con l'endpoint in blocco si può leggere tutto fresco
  in build (una richiesta).

## Parità verificata

`next build` confrontato con www.enfrio.it (HTML normalizzato di tutte le 10 pagine + 404: markup,
classi, testi, attributi, meta SEO, JSON-LD): **0 righe diverse** in tre scenari — Kiwi letto dal
vivo, Kiwi irraggiungibile (`KIWI_API_BASE=https://kiwi-down.invalid`), Kiwi non configurato.
Il database: md5 di slug+valore+tipo+etichetta+gruppo dei 666 blocchi e dei 18 item identico a quello
calcolato dal registro.

Per rifarlo: `npm run build` e poi `node scripts/parity-check.mjs` (confronta con www.enfrio.it; con un URL
come argomento confronta con quello). Controllo visivo fatto anche con screenshot a pagina intera, prod
contro preview, 1440 px e 390 px, animazioni congelate: differenze solo di antialiasing (<0,02 % dei pixel;
su /tower-m ~1,3 %, uguale al confronto prod contro prod per via del canvas 3D e dei contatori animati),
stesso testo, stessa altezza, zero errori in console. Configuratore M Tower provato con gli stessi input
su prod e preview: stessi moduli, metriche, barra di stato e link verso Contatti.

## Variabili d'ambiente (Vercel, Preview + Production)

`KIWI_COMPANY_ID`, `KIWI_API_BASE` (= `https://app.kiwienterprise.it`), `KIWI_REVALIDATE_SECRET`
(sensitive, uguale a `companies.site_revalidate_secret`). Nessuna `NEXT_PUBLIC_*`: il form scrive
lato server. Già presenti prima: nessuna (`SITE_URL` e `CONTACT_TO` hanno default nel codice).

## Aggiungere o cambiare un testo

1. Aggiungi il blocco nel file di `src/content/` della pagina (etichetta italiana, default = testo).
2. Usalo nel JSX: `const { hero } = await getContent(HOME)` → `{hero.nuovo_campo}`.
3. Registra il blocco nel database: `node scripts/kiwi-seed-sql.mjs --part N` (una parte per
   volta) ed esegui l'SQL sul progetto Supabase `qvswzthlruowjjlxioas`. Serve perché Kiwi
   **non auto-registra più blocchi oltre i 500 per company** (`MAX_AUTO_BLOCKS` in
   `kiwi-network/src/app/api/site/block/route.ts`) ed Enfrio ne ha 666.
   Il seed non tocca i valori già modificati dal cliente; un blocco mai toccato segue il nuovo default.
4. Cambiare solo il default nel codice non cambia il sito: vince il valore nel database.

## Cosa manca per l'editing da parte del cliente

Oggi il pannello Kiwi modifica i blocchi **solo** con l'editor iframe (clic sul testo del sito
vero, `products/kiwiweb/editor/[projectId]`). Per Enfrio servono ancora:

1. una riga `web_projects` per la company con `site_url = https://www.enfrio.it` ed
   `editor_settings.iframe_edit_enabled = true`;
2. `KIWI_EDIT_SHARED_SECRET` su Vercel (stesso valore di kiwi-network) e
   `KIWI_EDIT_PARENT_ORIGIN=https://app.kiwienterprise.it`;
3. l'overlay edit-in-place nel sito (skill `kiwiweb-site-integration`, `examples/edit-mode/`).
   **Da non copiare così com'è**: `isEditMode()` legge i cookie nel layout e rende dinamico tutto
   il sito (è ciò che fa apicoltura). Qui va fatto con `draftMode()` (le pagine restano statiche per
   i visitatori) e il wrapper `<Editable>` va messo nel punto unico dove i blocchi vengono letti.
   Tutti gli slug, le etichette e i tipi sono già nel registro.

Le collection si vedono nell'editor ("Elenchi"), ma il link per modificarle porta a
`/workspace/admin/kiwiweb/<company>/items/<slug>`, pagina che in kiwi-network **non esiste**.

## Problemi della piattaforma trovati (kiwi-network, non toccato)

1. **Manca una lettura in blocco**: serve `GET /api/site/blocks?company_id=` (una query, tutti i
   blocchi con valore e tipo). Con 120 req/min per IP+company un sito con centinaia di testi non
   può rileggerli in una rigenerazione. Quando esiste, `src/lib/kiwi.ts` diventa una richiesta sola.
2. `src/app/api/site/block/route.ts` risponde **200 con il default** quando la sua lettura dal DB
   fallisce (e anche se l'insert fallisce o si supera il tetto): il sito non distingue il valore vero
   da quello di ripiego. Qui lo si riconosce dall'header (`no-store` / `max-age=0`) e lo si tratta
   come errore; meglio che Kiwi risponda 503.
3. `/api/site/contact` ha il rate limit per IP del chiamante: col form lato server l'IP è quello
   della function Vercel, quindi il limite (5/min) vale per tutto il sito, non per visitatore.
   Per un sito B2B basta; da sapere.
4. `/api/site/contact` manda l'email solo al membro `owner` della company: Enfrio non ha membri,
   quindi oggi Kiwi salva ma non avvisa nessuno. La mail arriva comunque da FormSubmit.
5. Link "Elenchi" dell'editor verso una pagina admin inesistente (vedi sopra).
6. `/api/site/block` e `/api/site/collections/[slug]` mandano `s-maxage=30, stale-while-revalidate=60`:
   il CDN di Vercel serve il valore precedente fino a ~90 s dopo una modifica, proprio quando il webhook
   di pubblicazione fa rileggere il sito. Il sito aggira con un parametro anti-cache; gli altri siti
   clienti no.
7. Tetto `MAX_AUTO_BLOCKS = 500`: Enfrio ha 666 blocchi, tutti inseriti via SQL (verificati: 666/666
   presenti, md5 identico al registro), quindi nessuno dipende dall'auto-registrazione.

## Da sapere

- Test del form: una sola richiesta finta mandata direttamente a Kiwi (niente FormSubmit, nessuna
  email): `web_contact_submissions.id = 7654f029-8f15-40f0-9707-64d62df4f1e9`, nome
  "TEST KIWI - ignorare". È ancora lì: la può cancellare Christopher dal pannello.
- Privacy: il form ora conserva i dati anche su Kiwi (Kiwi Network SRL + Supabase/Vercel). La pagina
  privacy elenca Vercel e FormSubmit: va deciso se aggiungere Kiwi. C'è già il blocco facoltativo
  `legal_recipients_processor_4` (vuoto = non mostrato), così non serve toccare il codice.
- `vercel.json` porta le function a `dub1` (Dublino, vicino al database Kiwi).
