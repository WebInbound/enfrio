# HANDOFF — Enfrio collegato al pannello Kiwi (23 set 2026)

**In produzione dal 23 set 2026** (merge fast-forward di `feat/kiwi-panel` su `main`, commit `3be7849`,
deploy `dpl_2ABuYJpYwngA66ZvwV5GDpTwZwKp`, regione `dub1`). Obiettivo: il cliente modifica testi, immagini
principali e dati dal pannello Kiwi e riceve lì i contatti, **senza che il sito cambi di un pixel**.

## Stato al 23 set 2026

- www.enfrio.it dopo il deploy: HTML normalizzato delle 10 pagine + 404 **identico** a quello di prima
  del merge; configuratore, schede M Tower, canvas 3D e validazione del form funzionanti, zero errori in console.
- Webhook configurato su Kiwi: `companies.site_revalidate_url = https://www.enfrio.it/api/revalidate`
  + `site_revalidate_secret` (= `KIWI_REVALIDATE_SECRET` su Vercel).
- Prova in produzione: blocco `qhse_closing_note` modificato nel DB + chiamata al webhook come fa Kiwi →
  testo nuovo online in ~80 s (la prima rigenerazione ha preso un 429: cache ancora fredda dopo il primo
  deploy); testo originale rimesso → online in ~15 s. Tutti i 666 blocchi sono di nuovo = default.
- Nel pannello: 666 blocchi in 71 gruppi ("Globale ›", "Home ›", ..., "SEO", "Form contatti ›",
  "M Tower › Configuratore — coefficienti di calcolo (DA CONFERMARE)") e 4 elenchi con 18 elementi.

## Cosa c'è

| Cosa | Dove | Note |
|---|---|---|
| Registro dei contenuti | `src/content/*.ts` | 666 blocchi: slug = `<pagina>_<sezione>_<campo>`, etichetta e gruppo in italiano, default = testo del sito prima dell'integrazione |
| Collection | `src/content/collections.ts` | `technology_machinery_gallery` (5), `industries_madrid_gallery` (5), `projects_references` (3), `projects_snapshots` (5) |
| Lettura da Kiwi | `src/lib/kiwi.ts` | tutti i blocchi in una richiesta da `GET /api/site/blocks` quando Kiwi lo offre, altrimenti (e per gli slug assenti) uno per richiesta da `GET /api/site/block`; tutto in `unstable_cache` (tag `kiwi`, nessuna scadenza a tempo); timeout 8 s (2,5 s nell'editor, dove qualcuno aspetta), max 4 richieste in parallelo (2 in build), circuit breaker 30 s (60 in build). Unico punto di rete: `kiwiGet()`. API in stile skill: `getBlock(slug, default, meta)` |
| Webhook | `src/app/api/revalidate/route.ts` | `POST ?secret=` → `revalidateTag("kiwi", "max")` |
| Form contatti | `src/app/contact/actions.ts` | salva in Kiwi (`/api/site/contact`) **e** manda la mail con FormSubmit come prima; **successo solo se la mail è partita** (dal 24 set: Kiwi oggi non avvisa nessuno, vedi sotto); IP del visitatore firmato verso Kiwi |
| Configuratore M Tower | `src/components/MTowerSizer.tsx` | coefficienti e testi via props dalla pagina; gruppo "M Tower › Configuratore — coefficienti di calcolo (DA CONFERMARE)" |
| Seed del database | `scripts/kiwi-seed-sql.mjs` | genera l'SQL idempotente dal registro |

Le pagine restano **statiche** (ISR, `revalidate = 60` nel layout): nessuna visita chiama Kiwi. La rigenerazione
periodica legge solo la cache dati (nessuna chiamata a Kiwi) salvo i blocchi mai letti con successo.

## Come si comporta

- **Pubblica dal pannello** → Kiwi chiama `/api/revalidate` → tag `kiwi` "stale". Il visitatore
  successivo vede ancora la versione precedente (istantanea) mentre la pagina si rigenera; dal
  secondo in poi vede il testo nuovo. Provato in locale: 10-15 s per la home.
- **Bozze dell'editor fuori dal sito (provato in produzione il 24 set 2026)**: la rigenerazione ogni
  60 s legge da `unstable_cache` (`revalidate: false`, tag `kiwi`) e non chiama Kiwi; in draftMode Next
  salta la cache e non la scrive. Prova: blocco cambiato nel DB senza webhook, due rigenerazioni in 2+ min
  col valore vecchio, dopo il webhook il nuovo, poi ripristinato. Nessuna modifica al codice. Resta, come
  nel kit v2.11.3, la lettura a cache vuota (Kiwi giù al giro prima, chiave nuova): prende il DB del momento.
- **Kiwi lento o giù** durante una rigenerazione → `unstable_cache` restituisce l'ultimo valore
  buono (provato: pagina rigenerata con Kiwi irraggiungibile = testo modificato conservato,
  risposta al visitatore in 3 ms). Un blocco mai letto con successo mostra il default.
  Nei log compaiono righe `revalidating cache with key: ...` (di Next, una per blocco): innocue.
- **Kiwi non configurato** (`KIWI_COMPANY_ID` assente, es. build locale) → tutti i default.
- **Lettura in blocco, verificata in produzione il 23 set 2026**: `GET /api/site/blocks` (kiwi-network
  PR #245/#246) risponde 200 con tutti i 666 blocchi in ~0,3-0,8 s. Prova: webhook di revalidate + visita
  delle 10 pagine → nei log di kiwi-network 1-2 richieste a `/api/site/blocks` e **zero** a
  `/api/site/block` (la cache dati è condivisa fra le pagine: una lettura serve tutta la rigenerazione).
  Le letture singole restano solo come ripiego (endpoint in blocco assente → non lo richiede per 10 min,
  o slug mancante nella risposta). Rate limit: 60/min sulla lettura in blocco, 120/min su quella singola.
- **Kiwi dal 23 set**: `/api/site/block` e `/api/site/collections` sono `no-store` e rispondono **503**
  quando il loro DB non risponde (prima: 200 col default). Il sito tratta 503/429 come "Kiwi giù"
  (breaker, ultimo valore buono); l'euristica sull'header che serviva prima è stata tolta. Il parametro
  `_kv` resta (Kiwi lo ignora).
- **Nessuna rilettura voluta per deploy**: l'editor Kiwi salva le bozze direttamente nel valore del blocco
  prima di "Pubblica", quindi ogni lettura fuori dal webhook mette online le bozze salvate fin lì. La revisione
  del 24 set aveva aggiunto una rilettura per deploy (chiave con `VERCEL_DEPLOYMENT_ID`): **tolta** nel merge
  con main. Non rimetterla. Build e runtime usano la stessa chiave stabile.
- **⚠️ Problema aperto, provato in produzione il 24 set 2026 (c'era già su main)**: la build su Vercel **non
  trova** la chiave stabile nella sua cache e legge Kiwi, cioè il DB del momento, bozze comprese. Prova: blocco
  `qhse_hero_kicker` cambiato nel DB senza webhook alle 11:07 UTC, deploy di `7639276` alle 11:11: la prima
  visita a /qhse (`x-vercel-cache: PRERENDER`) mostrava il valore nuovo, la rigenerazione subito dopo (`HIT`)
  quello vecchio preso dalla cache del runtime; dopo il webhook il nuovo, poi ripristinato. Effetto: a ogni
  deploy le bozze sono online **per la prima visita di ogni pagina** (secondi) e **sulla 404 per tutta la vita
  del deploy**. La soluzione giusta è nella piattaforma: Kiwi deve tenere separati bozza e valore pubblicato
  (l'editor scrive la bozza, "Pubblica" la copia) e far leggere ai siti solo il pubblicato.
- **La pagina 404 è un file statico** (Vercel la serve come `/404` fuori dall'ISR): nessuna pubblicazione e
  nessuna rigenerazione la aggiornano, solo il deploy successivo, che oggi prende il DB del momento (vedi
  sopra). Vale per i testi del gruppo "Pagina 404 (online solo dal prossimo aggiornamento del sito)" e anche
  per menu, footer e dati aziendali mostrati sulla 404.

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
**Da aggiungere** per l'editor: `KIWI_EDIT_SHARED_SECRET` (vedi "Cosa manca" sotto).

## Aggiungere o cambiare un testo

1. Aggiungi il blocco nel file di `src/content/` della pagina (etichetta italiana, default = testo).
2. Usalo nel JSX: `const { hero } = await getContent(HOME)` → `{hero.nuovo_campo}`.
3. Registra il blocco nel database: `node scripts/kiwi-seed-sql.mjs --part N` (una parte per
   volta) ed esegui l'SQL sul progetto Supabase `qvswzthlruowjjlxioas`. Serve perché Kiwi
   **non auto-registra più blocchi oltre i 500 per company** (`MAX_AUTO_BLOCKS` in
   `kiwi-network/src/app/api/site/block/route.ts`) ed Enfrio ne ha 666.
   Il seed non tocca i valori già modificati dal cliente; un blocco mai toccato segue il nuovo default.
4. Cambiare solo il default nel codice non cambia il sito: vince il valore nel database.

## Editor Kiwi: modifica cliccando sul sito (dal 23 set 2026)

In `main` dal 23 set 2026 (commit `59ba6fd` + `108bbd7`). Il pannello Kiwi modifica i blocchi con
l'editor iframe (`products/kiwiweb/editor/[projectId]`): carica il sito vero e il cliente clicca sul testo.

**Come funziona**

1. L'editor apre `https://www.enfrio.it/<pagina>?kiwi_edit=1&token=<JWT>` (HS256, 5 min, rinnovato
   ogni ~4 min). `src/proxy.ts` gira **solo** sugli URL con `kiwi_edit` (matcher con `has: query`,
   nessuna chiamata di rete): passa il token a `/api/kiwi-edit/init`.
2. `init` verifica firma (`KIWI_EDIT_SHARED_SECRET`), scadenza e company (= `KIWI_COMPANY_ID`), poi
   accende `draftMode()` e mette il cookie `kiwi_edit_token`: entrambi `SameSite=None; Secure;
   HttpOnly; Partitioned` (dentro l'iframe cross-site funzionano anche coi cookie di terze parti
   bloccati, e non vengono mai mandati a chi apre www.enfrio.it direttamente). Redirect alla pagina
   pulita, senza token nell'URL.
3. In draft mode la pagina si genera a ogni richiesta con i valori freschi e `isEditing()` è vero:
   gli elementi portano `data-kiwi-block/type/label/group` + `data-kiwi-no-drag="1"`, il layout
   monta l'overlay e SiteShell il pannello "Altri testi della pagina".
4. Uscita dall'editor (`KIWI_TERMINATE`, chiusura scheda): `/api/kiwi-edit/logout` spegne tutto.

**Cosa può fare il cliente**: cliccare un testo e riscriverlo (anche i pulsanti, i link del footer, le
etichette del form e del configuratore, i testi delle schede Data Center/Petrochemical/...); cliccare
una foto e sceglierne un'altra dalla libreria; usare la barra degli stili dell'editor (salvati come
`style_overrides` e applicati anche ai visitatori, con whitelist). I link del menu navigano fra le pagine,
schede e configuratore restano interattivi. **Non può spostare o ridimensionare nulla** (scelta: il
layout è disegnato al pixel). Tutto ciò che non ha un elemento cliccabile — SEO, testi alternativi,
messaggi del form, coefficienti del configuratore, numeri animati, testi composti (indirizzo, copyright
con `{year}`), le schede non visibili — sta nel pannello flottante in basso a sinistra, che mostra solo
i blocchi della pagina non già cliccabili (con ricerca e "mostra tutti").

**Per i visitatori non cambia nulla**: pagine statiche (○ in build), HTML identico a prod su tutte le
10 pagine + 404, nessun chunk dell'editor scaricato (overlay 55 KB e pannello sono chunk separati
caricati solo in modifica), risposte dal CDN (`X-Vercel-Cache: HIT`) con la stessa latenza di prima; su
Vercel il middleware risulta invocato solo per le richieste con `kiwi_edit`.

**Verificato in locale** con un JWT firmato da un segreto di prova e una finta pagina "editor" su
un'altra origine (Chrome headless, protocollo postMessage vero): `KIWI_EDIT_READY` con 175 blocchi e le 8
pagine; clic sul titolo → `KIWI_BLOCK_SELECTED` col valore del DB, digitazione → `KIWI_BLOCK_DIRTY`;
pulsanti con testo maiuscolo via CSS letti col testo originale; clic su foto → libreria, nessuno
spostamento; `KIWI_BLOCK_UPDATE` di testo e foto applicato; campo del pannello modificabile; navigazione
dal menu e `KIWI_NAVIGATE`; schede e configuratore cliccabili; rinnovo token; `KIWI_TERMINATE` → pagina
di nuovo pubblica; stesso browser, visita diretta → nessun attributo. Token sbagliato / di un'altra
company → 401, nessun cookie; `next=//evil.com` → redirect a `/`. Dal 24 set `safeNext` risolve `next` come
farebbe il browser e tiene solo un percorso sulla stessa origine: anche `/%09/evil.com`, `/%0A/…`, `/%5C…` → `/`.

**Letture da Kiwi nell'editor**: in draft mode `unstable_cache` non legge né scrive la cache. Una lettura
in blocco per rendering (non una per prefetch: le letture della stessa istanza sono condivise per 2 s),
blocchi deduplicati per rendering, e se Kiwi rifiuta (429/5xx) resta l'ultima risposta buona invece dei
testi di ripiego.

**File**: `src/lib/kiwi-edit.ts` (verifica JWT, `isEditing`, `getEdit`/`getEditForClient`/`getEditorFields`,
whitelist stili), `src/lib/kiwi-edit-session.ts`, `src/proxy.ts`, `src/app/api/kiwi-edit/{init,logout}`,
`src/components/KiwiEditOverlay.tsx` (template della piattaforma + patch `ENFRIO:`, vedi intestazione),
`KiwiEditMount.tsx`, `KiwiHiddenFields.tsx` (+ `Mount`), `EditSpan.tsx`.

## Cosa manca perché il cliente modifichi davvero

1. **`KIWI_EDIT_SHARED_SECRET` sul progetto Vercel `enfrio`** (Preview + Production, sensitive), stesso
   valore di kiwi-network, poi un redeploy. Non è una shared env var del team (in kiwi-network è una
   variabile di progetto, id `SfeM6oeBRUZXx5OG`, niente `sharedEnvVarId`): non si può collegare senza
   leggerla, quindi va copiata a mano da chi ha accesso. Finché manca, la modalità modifica è spenta
   (init non mette cookie, nessun attributo): no-op sicuro. `NEXT_PUBLIC_KIWI_EDIT_PARENT_ORIGIN` non serve
   (default: app./www./kiwienterprise.it).
2. **Un utente del cliente**: l'editor è aperto a owner/manager/editor della company o super_admin.
   Enfrio oggi non ha membri: Christopher può già usarlo come super_admin; per il cliente serve un invito.
3. Riga `web_projects` **fatta**: `02ffe84b-a4e2-4060-a75e-6a101edfb626` (company Enfrio,
   `site_url = https://www.enfrio.it`, `editor_settings.iframe_edit_enabled = true`, stato `maintenance`,
   modellata su quella di LSG).

Le **collection** (gallerie e referenze progetti) non si modificano dall'editor: non sono blocchi, e il
link "Elenchi" dell'editor porta a `/workspace/admin/kiwiweb/<company>/items/<slug>`, pagina che in
kiwi-network **non esiste**. Per ora si cambiano dal database.

## Problemi della piattaforma trovati (kiwi-network, non toccato)

1. ~~Manca una lettura in blocco~~ — **risolto** il 23 set (PR #245/#246), in uso in produzione.
2. ~~`/api/site/block` risponde 200 col default se il DB fallisce~~ — **risolto** (ora 503, `no-store`).
3. `/api/site/contact` ha il rate limit per IP del chiamante: col form lato server l'IP è quello
   della function Vercel, quindi il limite (5/min) vale per tutto il sito, non per visitatore.
   **Dal 24 set** il sito manda l'IP del visitatore firmato (`x-kiwi-client-ip/-ts/-sig/-ua`, HMAC-SHA256 con
   `KIWI_REVALIDATE_SECRET` di `ip.ts.company_id`, protocollo di kiwi-network `src/lib/site-contact-ip.ts`);
   vale da quando la piattaforma lo verifica in produzione, prima gli header sono ignorati.
4. `/api/site/contact` manda l'email solo al membro `owner` della company: Enfrio non ha membri,
   quindi oggi Kiwi salva ma non avvisa nessuno. Per questo dal 24 set il visitatore vede "inviato" solo
   se la mail di FormSubmit è partita; con la sola copia su Kiwi vede l'errore con l'indirizzo email.
   Quando Enfrio avrà un owner con l'avviso di Kiwi si potrà tornare a "basta uno dei due".
5. Link "Elenchi" dell'editor verso una pagina admin inesistente (vedi sopra).
6. ~~CDN 30-90 s su `/api/site/block` e `/api/site/collections`~~ — **risolto** (ora `no-store`).
7. Tetto `MAX_AUTO_BLOCKS = 500` (in salita a 2000 secondo il coordinatore): Enfrio ha 666 blocchi, tutti
   inseriti via SQL (verificati: 666/666 presenti, md5 identico al registro), quindi nessuno dipende
   dall'auto-registrazione.
8. **Il template dell'overlay non compila così com'è** (`public/skill-templates/edit-mode/KiwiEditOverlay.tsx`,
   v2.11.1): riga 23 del commento iniziale contiene `src/app/**/page.tsx`, e quel `*/` chiude il commento;
   dentro il `<style jsx global>` (dalla riga ~2199, "cosi\` non interferisce") i commenti CSS usano il
   backtick come accento e chiudono il template literal. Qui corretto nella copia (patch `ENFRIO:` 11-12);
   chi copia il template in un altro sito si trova lo stesso errore di build.
9. Il template legge il testo con `innerText`, che applica `text-transform` del CSS: su un occhiello o un
   pulsante in maiuscolo via CSS, un semplice clic + blur salverebbe il testo tutto maiuscolo. Qui corretto
   (`readRawText`); da portare nel template.

## Da sapere

- Test del form: una sola richiesta finta mandata direttamente a Kiwi (niente FormSubmit, nessuna
  email): `web_contact_submissions.id = 7654f029-8f15-40f0-9707-64d62df4f1e9`, nome
  "TEST KIWI - ignorare". Il 23 set è stata messa in `status = archived` ma **non cancellata** (la
  cancellazione definitiva di dati non la fa l'agente): la può cancellare Christopher dal pannello.
- Controllo di parità fra due siti live: `PARITY_COOKIE="_vercel_jwt=..." node scripts/parity-check.mjs
  <preview> https://www.enfrio.it` (il cookie si ottiene aprendo il link di condivisione della preview).
- Privacy (**aperto, decisione di Christopher**, revisione del 24 set): il form conserva i dati anche su Kiwi
  (Kiwi Network SRL + Supabase/Vercel), senza scadenza, ma /legal elenca solo Vercel, FormSubmit e il provider
  email ("Last updated 29 May 2026", conservazione "fino a 24 mesi"). Serve: il testo di
  `legal_recipients_processor_4` (vuoto = non mostrato) che nomina Kiwi Network SRL, la data
  `legal_hero_updated`, la conservazione allineata (o cancellazione a 24 mesi anche su Kiwi) e la nomina a
  responsabile ex art. 28 fra Enfrio e Kiwi. Tutto dal pannello, nessun codice.
- Repo pubblico (**aperto, decisione di Christopher**): `WebInbound/enfrio` è pubblico; va reso privato
  (prima verificare che il piano Vercel del team faccia il deploy da un repo privato dell'org). Dettaglio del
  rischio nel repo privato kiwi-network, `docs/siti-clienti-blocchi-in-blocco.md` ("Rischi noti").
- `vercel.json` porta le function a `dub1` (Dublino, vicino al database Kiwi).
