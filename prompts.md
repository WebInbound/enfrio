# Enfrio — Prompt ChatGPT v3 (zero invenzioni)

## Perché v3

v2 dava a ChatGPT una descrizione testuale dell'M-Tower ("tre fasce, alette V-shape, ecc.") sperando che la rispettasse. Non funziona: l'AI ha un fortissimo bias a "interpretare" → ogni volta che genera il prodotto, lo ridisegna o lo inventa diverso. Stesso problema per i radiatori: anche con la regola "preserva la geometria", la foto i2i finiva con prodotti modificati.

v3 cambia strategia di radice:

1. **Niente più descrizioni a parole del prodotto.** L'unico modo per avere un prodotto Enfrio coerente è **allegare il file che lo contiene** e dire a ChatGPT "copia questo, non inventarne uno".
2. **L'unico M-Tower al mondo è `public/assets/images/site/mtower-render.png`.** Va allegato a ogni scena dove deve apparire un M-Tower.
3. **Per i radiatori e cooling unit, la canon è la foto originale del file da rigenerare** (i2i).
4. **Failure mode esplicito**: se ChatGPT non riesce a rispettare il prodotto, deve **ometterlo** dalla scena (sfondo vuoto), NON sostituirlo con un cooler di fantasia.

> ⚠️ **NON rigenerare `mtower-render.png` con AI.** È il file canonico del prodotto e va lasciato in pace. Se in futuro serve una versione più "marketing" (senza la griglia frontale di protezione), va chiesta a Enfrio come export CAD pulito, non generata.

> ⚠️ **Se dopo 2–3 tentativi una foto non viene fedele**, non salvarla. Annotala in un foglio e la facciamo a parte (Photoshop manuale, asset CAD, ecc.). Meglio nessuna foto che una foto sbagliata sul sito.

---

## Come usarla

1. Apri una NUOVA chat ChatGPT (GPT-4o con image generation)
2. Per ogni file qui sotto: copia il **blocco prompt** indicato, **allega i file richiesti** sotto "ATTACH"
3. Salva il risultato con il **filename esatto** (stessa estensione, case-sensitive)
4. Quando hai finito o sei a metà, manda la cartella a Chris

---

## Regole base (vanno in cima a OGNI prompt)

I tre blocchi sotto sono **già incollati** dentro ogni template più giù, in modo che ogni prompt sia self-contained.

### `[STYLE]`
> Photoreal industrial photography. Cinematic lighting, shallow depth of field where appropriate. Palette: deep navy + cool steel + a precise lime-green accent (#a3e635) used SPARINGLY (one small LED or stripe, never a wash). Premium B2B editorial (Caterpillar / Siemens Energy / Cummins). NO logos, NO readable text, NO recognisable faces, NO third-party OEM brand names anywhere. Brand: Enfrio (Italian engine cooling for power generation + datacenter — aluminium cores only, never copper).

### `[NO_INVENTION]`
> CRITICAL — Do NOT draw any Enfrio cooling product from memory or imagination. The ONLY Enfrio products that may appear in the output are the ones shown in the attached reference image(s). Each attached reference is the absolute canon: the product must appear in the output IDENTICAL to its reference — same silhouette, same internal details, same proportions, same components. Do NOT redesign, restyle, simplify, modernise, or stylise. If the references do not show a particular Enfrio product, that product must NOT appear in the output.

### `[FAILURE_MODE]`
> If you cannot place a reference product into the scene with full fidelity, OMIT the product entirely and output the scene without any cooling unit — just the environment, with the spot empty or atmospheric. DO NOT substitute a generic, fantasy, or invented cooler. An empty scene is fully acceptable; an invented product is NOT.

---

## Tre template

Ogni file più sotto rimanda a uno di questi tre template. Copia il template, sostituisci le parti tra `<…>` con il brief specifico della foto.

### Template A — Scena con M-Tower
Da usare quando nella foto deve apparire uno o più moduli M-Tower.

**ATTACH**: `public/assets/images/site/mtower-render.png` (sempre, come unico reference del prodotto).

**Prompt**:
```
[STYLE]
[NO_INVENTION]
[FAILURE_MODE]

The attached reference image IS the only canonical M-Tower module. Every cooling tower in your output must be a 1:1 copy of this reference — same silhouette, same three vertical sections, same finned top, same exposed tube mid-section, same inverter cabinet bottom, same proportions. Do NOT invent any other "M-Tower-like" object. If you cannot reproduce the reference faithfully, leave the scene WITHOUT an M-Tower (per FAILURE_MODE).

ROLE — <ruolo della foto sul sito>
SCENE — <descrizione dell'ambiente, NO descrizioni del prodotto>
LIGHT — <come illuminare l'ambiente>
COMPOSITION — <inquadratura, aspect ratio, focal point>

Output: <1536×1024 JPG / 1024×1536 PNG / ecc.>
```

### Template B — i2i di un prodotto Enfrio (radiatore, cooling unit)
Da usare quando la foto mostra un radiatore o cooling unit Enfrio reale.

**ATTACH**: la foto originale del file da rigenerare (es. per `hero-main.jpg` allega `public/assets/images/site/hero-main.jpg`).

**Prompt**:
```
[STYLE]
[NO_INVENTION]
[FAILURE_MODE]

The attached source photo shows the canonical Enfrio cooling product geometry. Treat its tube pitch and spacing, fin pattern, header-tank shape, side reinforcement frame, mounting brackets, fan shroud architecture, hose/connection layout as a LOCKED engineering reference. Do NOT modify any structural element. The product in your output must be a 1:1 copy of the product in the source. If you cannot preserve the product faithfully, prefer minimal changes (lighting + background only) over modifying it.

You MAY freely modify: ambient light direction and quality, background environment, surface highlights and reflections, atmospheric haze, colour grade. You must strip all third-party logos and brand markings visible in the source.

ROLE — <ruolo della foto sul sito>
CHANGES — <cosa cambiare dell'ambiente/luce/grade>
COMPOSITION — <inquadratura, aspect ratio>

Output: <1536×1024 JPG / ecc.>
```

### Template C — Ambient / processo (nessun prodotto Enfrio visibile)
Da usare quando la foto mostra solo macchinari, operatori al lavoro, ambienti — senza un prodotto Enfrio identificabile in primo piano.

**ATTACH**: la foto originale del file da rigenerare.

**Prompt**:
```
[STYLE]

Refine this scene editorially. Treat machinery, operator pose, hand position and environment as the source reference — preserve the spatial composition. Strip every brand marking from machinery, operator faces must be obscured or out of frame. The output must NOT contain any identifiable Enfrio cooling product in foreground or hero position — if there is one in the source, leave it as an out-of-focus background element or remove it. This image is about the process / capability, not the product.

ROLE — <ruolo della foto sul sito>
CHANGES — <cosa cambiare di luce/ambient/grade>
COMPOSITION — <inquadratura, aspect ratio>

Output: <1536×1024 JPG / ecc.>
```

---

# Mappa dei 37 file

`mtower-render.png` è la canon, non va rigenerato → restano 37 file da rifare.

> Ogni voce indica: il **template** da usare, cosa **allegare**, il **brief specifico** (ROLE / SCENE / CHANGES / COMPOSITION) da incollare al posto dei `<…>` nel template. Lo `[STYLE]` / `[NO_INVENTION]` / `[FAILURE_MODE]` vanno SEMPRE in cima al prompt (anche se non li ripeto qui sotto sono sottintesi).

## HOME

### `hero-main.jpg` — Template B
- **Attach**: `public/assets/images/site/hero-main.jpg`
- **ROLE**: homepage hero (split layout, immagine a destra). Comunica "real engineering, real hands-on craft."
- **CHANGES**: relight cinematic side-key + soft fill, deepen background to out-of-focus factory shadow, push grade to cool teal/steel with warm orange weld-arc glow on the visor, add subtle spark bokeh, add one small lime rim on the shoulder. Strip every logo in the background.
- **COMPOSITION**: 16:9 / 1536×1024, sharp on welding hand and core, operator face hidden by welding mask.

### `prod-line.jpg` — Template B
- **Attach**: `public/assets/images/site/prod-line.jpg`
- **ROLE**: homepage "Inside Enfrio" dominant — production line in active manufacturing.
- **CHANGES**: add a single volumetric light shaft from the ceiling, soften background to factory bokeh, cool industrial grade with one warm task lamp. Plain unbranded dark blue workwear. Strip every brand marking from machinery and walls.
- **COMPOSITION**: 3:2 / 1536×1024, slight low-angle, foreground unit sharp, line falling into bokeh.

### `tube-bending-operator.jpg` — Template C
- **Attach**: `public/assets/images/site/tube-bending-operator.jpg`
- **ROLE**: homepage carousel + /technology process-step — "6-axis tube bending."
- **CHANGES**: rim-light the cell interior, deepen surrounding shadows, neutral industrial steel grade, sharpen the tube curvature, tiny motion blur on the hand. Strip every brand marking from the machine.
- **COMPOSITION**: 3:2 / 1536×1024, hands and tube as hero, operator face hidden by helmet.

### `assembly-worker.jpg` — Template C
- **Attach**: `public/assets/images/site/assembly-worker.jpg`
- **ROLE**: homepage tall-shot + /company.
- **CHANGES**: clean three-point lighting, hands tack-sharp on the aluminium fins, operator face slightly out of focus or in profile, cool blue-grey palette with a single warm task lamp from the side.
- **COMPOSITION**: 2:3 portrait / 1024×1536.

### `rad-engine-complete.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-engine-complete.jpg`
- **ROLE**: homepage cluster + /solutions cluster — engine with Enfrio cooling package integrated.
- **CHANGES**: pure dark studio background (#0a0e15), single softbox key from upper-left, accent rim along the cooling fins to make aluminium gleam, soft floor reflection. Strip every visible OEM badge from the engine block.
- **COMPOSITION**: 16:9 / 1536×1024, three-quarter view.

### `power-gen-hall.jpg` — Template A ⭐ flagship
- **Attach**: `public/assets/images/site/mtower-render.png` (solo)
- **ROLE**: flagship Power Generation — usata su homepage spotlight, /industries hero+card, /tower-m deploy card. DEVE mostrare l'M-Tower reale (NO invenzioni).
- **SCENE**: interior of a massive power-generation hall. 6 large industrial diesel gensets aligned in a row down the hall; each genset has 1 M-Tower module (the reference) installed directly above/behind it (1 genset = 1 M-Tower, the modular philosophy). Polished concrete floor reflecting overhead industrial lighting. NO PEOPLE.
- **LIGHT**: deep teal-navy ambient + cool ceiling LEDs, one warm accent on the closest unit. Lime-green status LED visible on each M-Tower inverter cabinet (a row of small lime dots receding).
- **COMPOSITION**: 3:2 / 1536×1024, low-angle, vanishing point at the end of the hall. Sharp on the first M-Tower + genset pair, the others fall into atmospheric haze (so any rendering imperfection on distant units is hidden by depth-of-field).

### `welder-action.jpg` — Template B
- **Attach**: `public/assets/images/site/welder-action.jpg`
- **ROLE**: homepage + /company carousel — "Fabrication Precision."
- **CHANGES**: remove every logo and brand mark in the background (this is the critical fix on this shot — was full of logos in v2). Replace background with out-of-focus factory bokeh, deep navy ambient. Dramatic warm orange arc-glow on the visor; cool blue rim everywhere else. Sharp on welding hands and the core.
- **COMPOSITION**: 3:2 / 1536×1024, welder in profile or three-quarter-back, face hidden by mask.

### `handwork-detail.jpg` — Template B
- **Attach**: `public/assets/images/site/handwork-detail.jpg`
- **ROLE**: homepage carousel + /technology — "Hands-on Quality" macro.
- **CHANGES**: extreme close-up macro, sharp focus on a single fin and a calloused thumb, everything else creamy bokeh. Cool neutral grade with a hint of warm skin tone.
- **COMPOSITION**: 3:2 / 1536×1024, fingers + aluminium dominate, no operator face.

## COMPANY

### `team-office-floor.jpg` — Template C ✨ (text-to-image, no attach)
- **Attach**: niente
- Prompt speciale (no template, t2i pure):
```
[STYLE]

Wide editorial of an industrial office mezzanine overlooking a production floor through a floor-to-ceiling glass wall. Foreground: 2–3 silhouetted engineers around a large monitor showing abstract CAD line-art of a generic radiator core (no recognisable faces — back-of-head or profile blur). Mid-ground: minimalist white desks. Background through the glass: a sharply lit factory assembly line in operation, with rectangular industrial silhouettes that read as "cooling product manufacturing" but NOT as specific identifiable products (abstract, atmospheric, blurred).

Cool overhead office LEDs, one accent lime stripe on a single wall element. 16:9 / 1536×1024, wide, deep field. No logos, no readable text. NO specific Enfrio products visible.
```

### `prod-assembly-b.jpg` — Template B
- **Attach**: `public/assets/images/site/prod-assembly-b.jpg`
- **ROLE**: /company dominant cluster — factory floor assembly in motion.
- **CHANGES**: cinematic teal/orange grade, ambient warehouse light + one warm key on the unit. Operators in unbranded dark blue workwear, faces obscured. Strip all third-party logos.
- **COMPOSITION**: 3:2 / 1536×1024.

## SOLUTIONS

### `installed-v20-integrated.jpg` — Template B ⭐
- **Attach**: `public/assets/images/site/installed-v20-integrated.jpg`
- **ROLE**: /solutions hero + /solutions cluster — V20 engine with integrated Enfrio cooling.
- **CHANGES**: studio relight to seamless black background, dramatic single key light from above-left, subtle lime-green rim accent on one cooling-package edge, soft floor shadow. Strip ALL engine-manufacturer logos from the block and accessories.
- **COMPOSITION**: 16:9 / 1536×1024, three-quarter front view, hero product-shot.

### `installed-baudouin-canopy.jpg` — Template B
- **Attach**: `public/assets/images/site/installed-baudouin-canopy.jpg`
- **ROLE**: /solutions cluster + /projects carousel — genset in opened canopy with Enfrio cooling at top.
- **CHANGES**: three-point lighting, deep navy interior background, cool rim light on the cooling unit, soft warm fill on the engine. Strip ALL OEM logos from engine, control panel, canopy walls.
- **COMPOSITION**: 3:2 / 1536×1024, three-quarter view.

### `product-complete-b.jpg` — Template B
- **Attach**: `public/assets/images/site/product-complete-b.jpg`
- **ROLE**: /solutions cluster — finished integrated cooling module product hero.
- **CHANGES**: clean dark grey backdrop, cinematic light from upper-left, soft fill, sharp specular rim on the aluminium fins.
- **COMPOSITION**: 4:3 / 1536×1024, three-quarter view, single product hero.

## TECHNOLOGY

### `laser-operator-jq.jpg` — Template C ⭐
- **Attach**: `public/assets/images/site/laser-operator-jq.jpg`
- **ROLE**: /technology hero — "process excellence" establishing shot.
- **CHANGES**: orange/red glow of the laser cut as DOMINANT light source on operator's face area (face partially obscured / out of focus); deep navy ambient elsewhere; hands sharp on the control panel. Strip every brand marking from the machine.
- **COMPOSITION**: 16:9 / 1536×1024.

### `mach-laser-d.jpg` — Template C
- **Attach**: `public/assets/images/site/mach-laser-d.jpg`
- **ROLE**: /technology carousel — laser process detail.
- **CHANGES**: tack-sharp macro on the cut point with bright cut spark and molten metal glow; industrial ambient blur behind; cool steel palette with red-orange cut accent.
- **COMPOSITION**: 3:2 / 1536×1024, macro hero on the cut, no operator visible.

### `quality-hexagon-a.jpg` — Template B
- **Attach**: `public/assets/images/site/quality-hexagon-a.jpg`
- **ROLE**: /technology carousel — CMM metrology on a real Enfrio component.
- **CHANGES**: clean laboratory lighting, neutral white-grey palette, one small lime-green status LED on the probe head. Strip ALL brand names from the CMM body.
- **COMPOSITION**: 3:2 / 1536×1024.

### `mach-bending-a.jpg` — Template C
- **Attach**: `public/assets/images/site/mach-bending-a.jpg`
- **ROLE**: /technology machinery gallery — "Bending platform setup."
- **CHANGES**: tight editorial relight, cool industrial palette with one warm task lamp accent, sharp on the bent-tube path, soft bokeh elsewhere. Strip brand markings.
- **COMPOSITION**: 3:2 / 1536×1024.

### `mach-bending-d.jpg` — Template C
- **Attach**: `public/assets/images/site/mach-bending-d.jpg`
- **ROLE**: /technology machinery gallery — "Operator-controlled routing precision."
- **CHANGES**: cool industrial palette, sharp on the tube and finger grip, soft bokeh in the cell. Strip brand markings.
- **COMPOSITION**: 3:2 / 1536×1024, hands-only crop (no face).

### `mach-laser-a.jpg` — Template C
- **Attach**: `public/assets/images/site/mach-laser-a.jpg`
- **ROLE**: /technology machinery gallery — laser cell.
- **CHANGES**: cool steel ambient with red-orange cut accent at the focal point, sharp on the cutting head and the tube. Strip brand markings.
- **COMPOSITION**: 3:2 / 1536×1024.

### `prod-weld-station.jpg` — Template B
- **Attach**: `public/assets/images/site/prod-weld-station.jpg`
- **ROLE**: /technology machinery gallery — "Fabrication station."
- **CHANGES**: clean bench, warm orange arc-glow at the weld point, cool blue ambient elsewhere, sharp on gloved hand and the weld. No logos.
- **COMPOSITION**: 3:2 / 1536×1024, no operator face visible.

## INDUSTRIES

### `enfrio-system-infographic.jpg` — Template A ⭐
- **Attach**: `public/assets/images/site/mtower-render.png`
- **ROLE**: /industries "Datacenter" card (verticale). DEVE mostrare l'M-Tower reale in contesto datacenter.
- **SCENE**: modern datacenter exterior service yard at blue hour. A row of 4 M-Tower modules (the reference, identical copies) aligned along a concrete pad, parallel to a row of server-hall outdoor units. NO PEOPLE.
- **LIGHT**: late blue-hour sky behind, warm interior glow leaking from datacenter windows, cool LED uplighting on each M-Tower silhouette. One lime-green status LED per inverter cabinet.
- **COMPOSITION**: vertical 3:4 / 1024×1536, low-angle, sky top third, M-Tower row middle, concrete pad foreground. Sharp on the closest M-Tower, others fade into atmospheric haze.

### Madrid case — `waste-madrid-01..05.jpg` — Template B
Per tutti e 5, stesso template B con role/changes simili. Allega la foto corrispondente.

**Role comune**: /industries Madrid case carousel (e `waste-madrid-03.jpg` anche su /projects card) — Enfrio cooling integrated on a municipal waste collection truck (Madrid platform). The technical point of these photos is the constrained installation context + custom core-box opening.

**Changes comuni**: cinematic neutral grade, sharp on the radiator/CAC and the custom core-box opening, soft urban background bokeh. Strip every non-Enfrio logo from the truck body and panels.

**Composition**: 3:2 / 1536×1024.

Brief specifici:
- `waste-madrid-01.jpg` — angolo che evidenzia il core-box opening
- `waste-madrid-02.jpg` — dettaglio integrazione nel vano
- `waste-madrid-03.jpg` — vista 3/4 del mezzo in operation context
- `waste-madrid-04.jpg` — cooling system mounted, vista frontale
- `waste-madrid-05.jpg` — field-ready, vista d'insieme

## PROJECTS

### `enfrio-trade-show.jpg` — Template A ⭐
- **Attach**: `public/assets/images/site/mtower-render.png`
- **ROLE**: /projects hero. DEVE mostrare l'M-Tower reale come hero del booth.
- **SCENE**: premium B2B trade-show booth. Matte dark-navy walls with subtle lime-green graphic line accents. A single M-Tower module (the reference, copied 1:1) on a low podium as booth centrepiece, soft track lighting picking out the finned top and exposed tubes. 2 silhouetted visitors at the side in conversation, slightly out of focus, no faces.
- **LIGHT**: track spots on the M-Tower, cool venue ambient, warm rim on visitors.
- **COMPOSITION**: 3:2 / 1536×1024 wide editorial, polished black floor reflecting the unit's base. NO readable text, NO logos on booth walls.

### `rad-40ng.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-40ng.jpg`
- **ROLE**: /projects card "40HC Container Package."
- **CHANGES**: studio product treatment, white-to-light-grey gradient backdrop, soft top key, sharp ground shadow, gentle specular on the aluminium fins. Strip every logo.
- **COMPOSITION**: 4:3 / 1536×1024, three-quarter view.

### `rad-remote-mtu.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-remote-mtu.jpg`
- **ROLE**: /projects card "Remote installation radiator."
- **CHANGES**: outdoor editorial relight — late-afternoon golden-hour key, deep blue sky behind, subtle lens flare. Make the unit feel monumental on a concrete pad. Strip third-party logos.
- **COMPOSITION**: 3:2 / 1536×1024, three-quarter view, slight low angle.

### `fair-dubai-1.jpg` — Template A
- **Attach**: `public/assets/images/site/mtower-render.png`
- **ROLE**: /projects carousel — Middle East trade fair, M-Tower visible.
- **SCENE**: editorial wide of an industrial trade-show floor in the Middle East. Warm golden ambient light, suspended geometric ceiling graphics, blurred professionals in mid-ground (no faces), foreground sharp on a sleek dark-navy booth with the reference M-Tower module on a low podium (it's OK if only the top half is visible from the angle).
- **LIGHT**: warm venue ambient + accent spots on the M-Tower.
- **COMPOSITION**: 3:2 / 1536×1024, no readable text, no logos.

### `fair-dubai-2.jpg` — Template C (no product)
- **Attach**: niente
- Prompt speciale t2i:
```
[STYLE]

Editorial three-quarter view of a generic industrial trade-show booth at a Middle East energy event. Matte dark booth walls with subtle lime-green spot accents, an abstract modular display element on a podium (NOT a specific product — just an atmospheric industrial silhouette), blurred visitors at edge of frame (no faces). Warm-cool ambient contrast, soft directional accent.

3:2 / 1536×1024, no readable text, no logos, no identifiable cooling product.
```

### `fair-mee-2.jpg` — Template A
- **Attach**: `public/assets/images/site/mtower-render.png`
- **ROLE**: /projects carousel — Middle East Energy event presence with M-Tower as exhibit.
- **SCENE**: editorial of a sleek dark-navy booth with the reference M-Tower as the hero exhibit; soft directional lighting picks out finned top + exposed tubes; ambient venue glow behind; 2 blurred professionals in conversation at side (no faces).
- **LIGHT**: track spots on the M-Tower, ambient cool fill.
- **COMPOSITION**: 3:2 / 1536×1024.

### `warehouse-delivery.jpg` — Template A
- **Attach**: `public/assets/images/site/mtower-render.png` + `public/assets/images/site/warehouse-delivery.jpg`
- **ROLE**: /projects "Execution Closure" + /tower-m "Datacenter Cooling" deploy card.
- **SCENE**: cinematic wide of an industrial warehouse interior at sunrise; a forklift moving a palletised reference M-Tower module toward an open dock door. Foreground: a second reference M-Tower on a pallet, sharp. Mid-ground: forklift in subtle motion blur. Volumetric sunbeam through the open door.
- **LIGHT**: cool teal grade with warm sun accent.
- **COMPOSITION**: 4:3 / 1536×1024 close-to. Strip all third-party logos from the forklift and dock signage.

### `rad-warehouse-stock.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-warehouse-stock.jpg`
- **ROLE**: /projects carousel — warehouse rack with finished aluminium cooling units.
- **CHANGES**: symmetrical perspective straight down the aisle, controlled overhead LED lighting, cool industrial palette, one lime-green safety stripe painted on the floor as the only colour accent. Premium logistics editorial.
- **COMPOSITION**: 3:2 / 1536×1024, vanishing-point perspective.

### `rad-double.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-double.jpg`
- **ROLE**: /projects carousel — real dual-circuit (HT+LT) Enfrio aluminium radiator.
- **CHANGES**: dark seamless studio backdrop, single softbox key from upper-left, soft fill, sharp specular on aluminium fins, gentle floor shadow.
- **COMPOSITION**: 4:3 / 1536×1024, three-quarter view.

### `rad-truck-load.jpg` — Template B
- **Attach**: `public/assets/images/site/rad-truck-load.jpg`
- **ROLE**: /projects carousel — Enfrio cooling unit being loaded onto a flatbed truck.
- **CHANGES**: dynamic reportage edit, late-afternoon light, long shadows, subtle motion blur on the crane chain, sharp on the unit body. Strip every logo from the truck cab and the crane.
- **COMPOSITION**: 3:2 / 1536×1024, three-quarter angle mid-lift.

## CONTACT

### `quality-hexagon-b.jpg` — Template B
- **Attach**: `public/assets/images/site/quality-hexagon-b.jpg`
- **ROLE**: /contact hero + /projects info card "Quality Proof."
- **CHANGES**: macro editorial, tack-sharp on the probe tip touching the component, creamy bokeh behind, cool neutral palette with one lime-green accent LED on the probe head. Strip every CMM-manufacturer brand name.
- **COMPOSITION**: 4:3 / 1536×1024, macro.

---

# Logo brand

⚠️ **Non rigenerare** `public/assets/images/logo-enfrio.png` con AI. È il logo ufficiale del brand.

⚠️ **Non rigenerare** `public/assets/images/site/mtower-render.png` con AI. È il file canonico del prodotto, va lasciato in pace.

---

# Ordine consigliato

**Prima passata — le 4 chiave del sito (massima cura):**
1. `hero-main.jpg` (Template B)
2. `power-gen-hall.jpg` (Template A) ⭐
3. `installed-v20-integrated.jpg` (Template B)
4. `laser-operator-jq.jpg` (Template C)

**Seconda passata — le altre scene M-Tower:**
5. `enfrio-system-infographic.jpg` (datacenter) ⭐
6. `enfrio-trade-show.jpg` (booth) ⭐
7. `fair-mee-2.jpg` (booth)
8. `fair-dubai-1.jpg` (booth)
9. `warehouse-delivery.jpg` (logistics) ⭐

**Terza passata — i radiatori prodotti veri (i2i):**
10–17. `rad-engine-complete.jpg`, `installed-baudouin-canopy.jpg`, `product-complete-b.jpg`, `rad-40ng.jpg`, `rad-remote-mtu.jpg`, `rad-double.jpg`, `rad-warehouse-stock.jpg`, `rad-truck-load.jpg`

**Quarta passata — Madrid case + process + ambient:**
18–37. Il resto (waste-madrid 01–05, welder-action, handwork-detail, assembly-worker, prod-line, prod-assembly-b, tube-bending-operator, mach-laser-a/d, mach-bending-a/d, prod-weld-station, quality-hexagon-a/b, team-office-floor, fair-dubai-2).

# Cosa fare se ChatGPT non collabora

- Dopo **2–3 tentativi falliti** su una stessa foto, **NON salvarla** e passa alla prossima. Annota il filename.
- Quando hai finito il giro, mandami la lista dei "non riusciti" → li faccio io con Photoshop / approccio diverso.
- È meglio finire con 30 foto buone + 7 da rifare che 37 foto con prodotti inventati.
