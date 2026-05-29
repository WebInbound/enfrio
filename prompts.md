# Enfrio — Prompt ChatGPT (v2, prodotto-fedele)

Questa versione rivede tutti i prompt con due ancore rigide:

1. **Regola integrità prodotto** — i radiatori e i cooling unit Enfrio sono prodotti realmente ingegnerizzati. La loro geometria (passo tubi, pattern alette, tank, frame, brackets, fan shroud) NON va modificata. Si tocca solo luce, sfondo, color grade.
2. **Spec M Tower esatta** — ovunque deve apparire un cooler modulare Enfrio si usa l'anatomia ufficiale del prodotto, non un'invenzione generica.

## Come usarla

1. Apri una nuova chat in ChatGPT (GPT-4o con image generation)
2. Per ogni voce qui sotto: **copia tutto il blocco Prompt** dentro la chat
3. Se l'icona è 🖼️ **allega anche la foto originale** che trovi in `public/assets/images/site/<filename>`
4. Salva il risultato con **esattamente lo stesso filename** (case-sensitive, stessa estensione). Niente `(1)`, niente `.png` al posto di `.jpg`. Unica eccezione: `mtower-render.png` deve restare PNG con sfondo trasparente.
5. Quando hai finito (o anche a tranche), mettile in una cartella e mandala a Chris.

## Snippet base

Questi tre paragrafi sono GIÀ INCLUSI in ogni prompt sotto, in modo che ogni blocco sia auto-contenuto e si possa incollare senza pensare.

**STYLE\_BASE** — *stile globale del sito*
> Photoreal industrial photography. Cinematic lighting, shallow depth of field where appropriate. Palette: deep navy + cool steel + a precise lime-green accent (#a3e635) used SPARINGLY (one small LED, one stripe, never a wash). Caterpillar / Siemens Energy / Cummins editorial energy. NO logos, NO readable text, NO recognisable faces, NO third-party OEM brand names anywhere. Enfrio is an Italian engine-cooling brand for power generation and datacenter only (no automotive, no off-highway). Aluminium cores only (never copper).

**INTEGRITY\_RULE** — *quando in scena c'è un prodotto Enfrio vero*
> PRODUCT INTEGRITY — The radiator/cooling unit in the source is a real engineered product. PRESERVE EXACTLY: tube pitch and spacing, fin pattern direction and density, header-tank shape, side reinforcement frame, mounting brackets, fan shroud architecture and fan-blade count, hose-connection layout, inlet/outlet positions. Do NOT redesign, simplify, modernise, stylise, add or remove any structural element. Treat the product geometry as a locked engineering reference. Only modify: ambient light, background, surface highlights, colour grade, atmosphere.

**M\_TOWER\_SPEC** — *quando deve apparire un modulo M Tower*
> M TOWER — use this EXACT anatomy, never invent a generic cooler. Tall rectangular vertical industrial cooling unit, container-fit envelope (≈3.5 m tall × 1.2 m × 1.2 m). Three visible vertical sections: TOP THIRD — two V-shaped aluminium finned heat-exchanger bays with horizontal louvered fins (NO front protection mesh). MIDDLE THIRD — exposed structural section with dimpled stainless-steel tube bundles between cylindrical headers. BOTTOM THIRD — black-painted integrated inverter cabinet, single access door, one small lime-green status LED. Frame: matte black structural-steel beams with visible welded gussets at corners, rubber vibration-isolation pads at base. Modules install in banks of 1 to 8 identical units sharing hydraulic interfaces. NEVER add: front mesh grid, side ladders, OEM logos, colour stripes, decorative styling.

---

# HOME — `/`

## `hero-main.jpg` 🖼️
**Allega**: `public/assets/images/site/hero-main.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE — incolla il paragrafo STYLE_BASE qui sopra]
[INTEGRITY_RULE — incolla il paragrafo INTEGRITY_RULE qui sopra]

ROLE — homepage hero (split layout, image on the right). Sells "real engineering, real hands-on craft."
KEEP from source — operator silhouette, welding pose, the radiator core in the foreground (this is a real Enfrio aluminium core — preserve tube pitch, fin pattern, header shape exactly per INTEGRITY_RULE).
CHANGE — re-light to cinematic side-key + soft fill, deepen background into out-of-focus factory shadow, push grade to cool teal/steel with warm orange weld-arc glow on the visor and PPE, add subtle spark bokeh, add one small lime rim on the shoulder. Remove every logo in the background.
COMPOSITION — 16:9, focus on the welding hand and the core, operator face hidden by welding mask. Annual-report cover quality.
```

## `prod-line.jpg` 🖼️
**Allega**: `public/assets/images/site/prod-line.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — homepage "Inside Enfrio" dominant image: an aluminium radiator production line in active manufacturing.
KEEP from source — every radiator visible (their tube/fin geometry, header tanks, frames). Preserve exactly per INTEGRITY_RULE. Keep the line layout and the spatial arrangement of units.
CHANGE — add a single volumetric light shaft from the ceiling, deepen background into soft factory bokeh, cool industrial grade with one warm task lamp. Operators in plain dark-blue unbranded workwear. Strip every brand marking from machinery and walls.
COMPOSITION — 3:2, foreground unit sharp, line falling into bokeh, slight low-angle perspective.
```

## `tube-bending-operator.jpg` 🖼️
**Allega**: `public/assets/images/site/tube-bending-operator.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata anche su /technology*

```
[STYLE_BASE]

ROLE — "6-axis tube bending" capability shot, used on homepage carousel and on /technology process-step.
KEEP from source — the CNC bender geometry, the stainless tube currently being bent, the operator's hand position.
CHANGE — rim-light the cell interior, deepen surrounding shadows, neutral industrial steel grade, sharpen the tube curvature, allow a tiny motion blur on the hand. Strip every brand marking from the machine body.
COMPOSITION — 3:2, hands and tube as hero subject, operator face out of frame or hidden by helmet.
```

## `assembly-worker.jpg` 🖼️
**Allega**: `public/assets/images/site/assembly-worker.jpg`  ·  **Output**: JPG 1024×1536 (verticale)  ·  *Riusata su /company*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — vertical "hand assembly" shot, used in the homepage dominant-cluster (tall-shot slot) and /company.
KEEP from source — the aluminium-fin component the operator is working on (preserve fin pattern per INTEGRITY_RULE), the operator's posture.
CHANGE — clean three-point lighting, hands tack-sharp on the aluminium fins, operator face slightly out of focus or in profile (no recognisable identity), cool blue-grey palette with a single warm task lamp from the side.
COMPOSITION — 2:3 portrait, vertical, premium B2B editorial.
```

## `rad-engine-complete.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-engine-complete.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /solutions*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — "integrated cooling on a finished engine" confidence shot, used on the homepage cluster and the /solutions cluster.
KEEP from source — the diesel genset engine and the Enfrio aluminium cooling package mounted on top. Preserve the cooling unit's core, header tanks, fan shroud, mounting brackets exactly per INTEGRITY_RULE. Do not "beautify" the engine block — keep its real proportions.
CHANGE — pure dark studio background (#0a0e15), single softbox key from upper-left, accent rim along the cooling fins to make aluminium gleam, soft floor reflection. Strip every visible OEM badge from the engine.
COMPOSITION — 16:9, three-quarter view, hero product-shot energy.
```

## `power-gen-hall.jpg` ✨
**No allegati**  ·  **Output**: JPG 1536×1024  ·  *Riusata su homepage, /industries, /tower-m — è la "flagship" della Power Generation*

```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — flagship "Power Generation" image. MUST depict the real M Tower per M_TOWER_SPEC — do NOT invent a generic cooler.

SCENE — interior of a massive power-generation hall. 6 large industrial diesel gensets aligned in a row down the hall; each genset has 1 M Tower module installed directly above/behind it (so the viewer reads: one genset = one M Tower module = modular cooling philosophy). Polished concrete floor reflecting overhead industrial lighting. NO PEOPLE.

LIGHT — deep teal-navy ambient with cool LED key lights along the ceiling, one warm accent on the closest unit, the lime-green status LED on the bottom inverter cabinet of each M Tower clearly visible (a row of tiny lime dots receding into perspective).

COMPOSITION — 3:2, cinematic low-angle from down the row, vanishing point at the end of the hall. Sharp on the first M Tower + genset pair, the others fall into atmospheric haze. No logos, no readable signage.
```

## `welder-action.jpg` 🖼️
**Allega**: `public/assets/images/site/welder-action.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /company*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — "Fabrication Precision" shot, used on homepage and /company carousels.
KEEP from source — the operator welding pose and the radiator core being welded (preserve core geometry per INTEGRITY_RULE).
CHANGE — REMOVE every logo and brand mark in the background (this is the critical fix on this shot). Replace background with out-of-focus factory bokeh, deep navy ambient. Dramatic warm orange arc-glow on the visor; cool blue rim everywhere else. Sharp on welding hands and the core.
COMPOSITION — 3:2, welder in profile or three-quarter-back, face hidden by mask.
```

## `handwork-detail.jpg` 🖼️
**Allega**: `public/assets/images/site/handwork-detail.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /technology*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — "Hands-on Quality" macro, used on homepage carousel and /technology.
KEEP from source — the aluminium cooling unit detail being finished (preserve fin geometry and surface texture per INTEGRITY_RULE).
CHANGE — extreme close-up macro, sharp focus on a single fin and a calloused thumb, everything else creamy bokeh. Cool neutral grade with a hint of warm skin tone. Editorial "craftsmanship" macro.
COMPOSITION — 3:2, fingers and aluminium dominating the frame, no operator face visible.
```

---

# COMPANY — `/company`

## `team-office-floor.jpg` ✨
**No allegati**  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]

ROLE — /company hero. Communicates "real engineering team + real factory under the same roof."

SCENE — wide editorial of an industrial office mezzanine overlooking a production floor through a floor-to-ceiling glass wall. Foreground: 2–3 silhouetted engineers around a large monitor showing abstract CAD line-art of a radiator core (no recognisable faces — all back-of-head or profile blur). Mid-ground: minimalist white desks. Background through the glass: a sharply lit aluminium radiator assembly line in operation, several Enfrio cooling units visible on the line. Use simplified STANDARD aluminium radiator architecture for these background units (rectangular finned cores with header tanks and fan shrouds) — they are NOT M Towers.

LIGHT — cool overhead office LEDs, one accent lime stripe on a single wall element.

COMPOSITION — 16:9 (1536×1024), wide, deep field, no logos, no readable text.
```

## `prod-assembly-b.jpg` 🖼️
**Allega**: `public/assets/images/site/prod-assembly-b.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /company dominant cluster main image: factory floor assembly in motion.
KEEP from source — the aluminium cooling unit being assembled and its sub-frame (preserve per INTEGRITY_RULE).
CHANGE — cinematic teal/orange grade, ambient warehouse light balanced with one warm key on the unit. Foreground unit sharp, production line softly blurred. Operators in unbranded dark blue workwear, faces obscured or backs to camera. Strip all third-party logos.
COMPOSITION — 3:2, premium industrial editorial.
```

*Le altre foto di /company (welder-action, assembly-worker, handwork-detail) sono già coperte sopra in HOME.*

---

# SOLUTIONS — `/solutions`

## `installed-v20-integrated.jpg` 🖼️
**Allega**: `public/assets/images/site/installed-v20-integrated.jpg`  ·  **Output**: JPG 1536×1024  ·  *Usata sia come hero che nel dominant cluster*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /solutions hero AND /solutions dominant cluster main image: "integrated cooling package on a finished V20 engine."
KEEP from source — the V20 engine block AND the Enfrio cooling package mounted on it. Preserve EXACTLY all structural geometry of the cooling unit (core, header tanks, fan shroud, brackets, hose routing) per INTEGRITY_RULE. Keep the V20's authentic proportions and cylinder bank layout.
CHANGE — studio relight to seamless black background, dramatic single key light from above-left, subtle lime-green rim accent on one cooling-package edge, soft floor shadow. Strip ALL engine-manufacturer logos from the block and accessories.
COMPOSITION — 16:9, three-quarter front view, hero product-shot.
```

## `installed-baudouin-canopy.jpg` 🖼️
**Allega**: `public/assets/images/site/installed-baudouin-canopy.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /projects*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /solutions cluster + /projects carousel: "genset in opened canopy with Enfrio cooling at the top."
KEEP from source — the genset engine, the open canopy enclosure structure, and especially the Enfrio cooling unit at the top (preserve cooling-unit architecture exactly per INTEGRITY_RULE).
CHANGE — three-point lighting, deep navy interior background, cool rim light on the cooling unit, soft warm fill on the engine. Strip ALL OEM logos from engine, control panel, and canopy walls.
COMPOSITION — 3:2, three-quarter view showing the open canopy + the cooling unit silhouette against a darker background.
```

## `product-complete-b.jpg` 🖼️
**Allega**: `public/assets/images/site/product-complete-b.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /solutions cluster: "finished integrated cooling module" product hero.
KEEP from source — the complete Enfrio cooling module. Preserve EXACTLY all geometry: core, headers, fan shroud, frame, brackets, hose ports (INTEGRITY_RULE).
CHANGE — clean dark grey backdrop, cinematic light from upper-left, soft fill, sharp specular rim on the aluminium fins. Flagship-catalogue feel. No logos.
COMPOSITION — 4:3 (close to 1536×1024), three-quarter view, single product hero.
```

*L'altra foto di /solutions (rad-engine-complete) è già coperta sopra in HOME.*

---

# TECHNOLOGY — `/technology`

## `laser-operator-jq.jpg` 🖼️
**Allega**: `public/assets/images/site/laser-operator-jq.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]

ROLE — /technology hero: "process excellence" establishing shot.
KEEP from source — the fiber laser tube-cutting cell architecture, the operator's stance at the control panel, the stainless tube being processed.
CHANGE — the orange/red glow of the laser cut as the DOMINANT light source on the operator's face area (face partially obscured or out of focus, no identifiable identity) and on PPE; deep navy ambient elsewhere; hands sharp on the control panel. Strip every brand marking from the machine.
COMPOSITION — 16:9, "Inside the Factory of the Future" editorial energy, slight backlit drama.
```

## `mach-laser-d.jpg` 🖼️
**Allega**: `public/assets/images/site/mach-laser-d.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]

ROLE — /technology "laser process" image in the process-story carousel.
KEEP from source — laser cutting head and the cut detail on the tube.
CHANGE — tack-sharp macro on the cut point with bright cut spark and molten metal glow; industrial ambient blur behind; cool steel palette with red-orange cut accent.
COMPOSITION — 3:2, macro hero on the cut, no operator visible, no logos.
```

## `quality-hexagon-a.jpg` 🖼️
**Allega**: `public/assets/images/site/quality-hexagon-a.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /technology "CMM metrology" image in the process-story carousel.
KEEP from source — the CMM probe geometry, the granite reference table, the aluminium component under inspection (this is a real Enfrio part — preserve per INTEGRITY_RULE).
CHANGE — clean laboratory lighting, neutral white-grey palette, one small lime-green status LED on the probe head. Strip ALL brand names from the CMM body.
COMPOSITION — 3:2, documentary quality-control still.
```

## Galleria macchinari — `mach-bending-a.jpg`, `mach-bending-d.jpg`, `mach-laser-a.jpg`, `prod-weld-station.jpg` 🖼️
**Allega**: la foto corrispondente in `public/assets/images/site/<filename>`  ·  **Output**: JPG 1536×1024

Stessa logica per tutte e 4: relight + sharpen + strip logos + INTEGRITY_RULE quando si vede un componente Enfrio sul banco. Ecco i prompt singoli:

### `mach-bending-a.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /technology machinery gallery: "Bending platform setup."
KEEP from source — the bending machine geometry and the stainless tube workpiece (preserve workpiece per INTEGRITY_RULE).
CHANGE — tight editorial relight, cool industrial palette with one warm task lamp accent, sharp on the bent-tube path, soft bokeh elsewhere. Strip every brand marking from the machine.
COMPOSITION — 3:2.
```

### `mach-bending-d.jpg`
```
[STYLE_BASE]

ROLE — /technology machinery gallery: "Operator-controlled routing precision."
KEEP from source — the hands guiding the stainless tube into the bender, the tube curvature.
CHANGE — cool industrial palette, sharp on the tube and finger grip, soft bokeh in the machine cell. Strip brand markings.
COMPOSITION — 3:2, hands-only crop (no face).
```

### `mach-laser-a.jpg`
```
[STYLE_BASE]

ROLE — /technology machinery gallery: "Laser processing cell for consistent component geometry."
KEEP from source — the laser cell architecture and the stainless tube being processed.
CHANGE — cool steel ambient with red-orange cut accent at the focal point, sharp on the cutting head and the tube. Strip brand markings.
COMPOSITION — 3:2.
```

### `prod-weld-station.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /technology machinery gallery: "Fabrication station with controlled workmanship."
KEEP from source — the welding workstation, weld torch, the radiator component on the bench (preserve radiator-component geometry per INTEGRITY_RULE).
CHANGE — clean fabrication bench, warm orange arc-glow at the weld point, cool blue ambient elsewhere, sharp on the gloved hand and the weld. No logos.
COMPOSITION — 3:2, no operator face visible.
```

---

# INDUSTRIES — `/industries`

## `enfrio-system-infographic.jpg` ✨
**No allegati**  ·  **Output**: PNG/JPG 1024×1536 (verticale)

```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — /industries "Datacenter" card (vertical). MUST depict the real M Tower in a datacenter context (apply M_TOWER_SPEC verbatim — never a generic cooler).

SCENE — modern datacenter exterior service yard at blue hour. A row of 4 M Tower modules aligned along a concrete pad, parallel to a row of server-hall outdoor units. The 4 M Towers are identical and clearly modular (same envelope, same finned top, same exposed-tube mid-section, same inverter-cabinet bottom). One lime-green status LED on each inverter cabinet. NO PEOPLE.

LIGHT — late blue-hour sky behind, warm interior glow leaking from datacenter windows, cool LED uplighting on each M Tower silhouette.

COMPOSITION — vertical 3:4 (1024×1536), low-angle, sky takes the top third, M Tower row dominates the middle, concrete pad in foreground. No logos, no readable text.
```

## Madrid case — `waste-madrid-01..05.jpg` 🖼️
**Allega**: la foto corrispondente  ·  **Output**: JPG 1536×1024

Stessa logica per tutte e 5: preservare l'integrazione cooling sul mezzo (è il punto tecnico della foto), ripulire il color grade, rimuovere ogni logo non Enfrio. Ecco i prompt singoli:

### `waste-madrid-01.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /industries Madrid carousel: "custom core-box opening on radiator package."
KEEP from source — the truck-mounted Enfrio cooling system, the radiator package, the custom core-box opening, the CAC (preserve all per INTEGRITY_RULE). Keep the truck bay geometry as the constrained installation context (this is the technical point of the photo).
CHANGE — cinematic neutral grade, sharp detail on the radiator and core-box opening, soft urban background bokeh. Strip every non-Enfrio logo from the truck body and panels.
COMPOSITION — 3:2, reportage detail of the cooling integration.
```

### `waste-madrid-02.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /industries Madrid carousel: "truck integration detail."
KEEP from source — the Enfrio aluminium cooling package and how it's mounted in the constrained vehicle bay (preserve per INTEGRITY_RULE).
CHANGE — cinematic neutral grade, sharp on cooling architecture and bay context. Strip every non-Enfrio logo.
COMPOSITION — 3:2, technical reportage.
```

### `waste-madrid-03.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects card AND /industries carousel: "vehicle-level integration in operation context."
KEEP from source — the Madrid waste truck and the Enfrio radiator/CAC integration (preserve per INTEGRITY_RULE).
CHANGE — sharpen the radiator/CAC, softly blur the urban background, cinematic grade. Strip every non-Enfrio logo.
COMPOSITION — 3:2, three-quarter view of the truck with cooling integration clearly readable.
```

### `waste-madrid-04.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /industries Madrid carousel: cooling system mounted on the waste collection vehicle.
KEEP from source — the cooling system and the custom core-box opening (preserve per INTEGRITY_RULE).
CHANGE — cinematic neutral grade, no non-Enfrio logos.
COMPOSITION — 3:2.
```

### `waste-madrid-05.jpg`
```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /industries Madrid carousel: "field-ready Enfrio architecture for the Madrid platform."
KEEP from source — the Enfrio cooling architecture installed on the truck (preserve per INTEGRITY_RULE).
CHANGE — outdoor light, sharp on technical detail of the radiator package, no non-Enfrio logos.
COMPOSITION — 3:2.
```

*L'altra foto di /industries (power-gen-hall) è già coperta sopra in HOME.*

---

# PROJECTS — `/projects`

## `enfrio-trade-show.jpg` ✨
**No allegati**  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — /projects hero. Communicates "commercial credibility, international presence." MUST show the real M Tower as the booth's hero exhibit (apply M_TOWER_SPEC verbatim — not a generic cooler).

SCENE — premium B2B trade-show booth. Matte dark-navy walls with subtle lime-green graphic line accents. A single full-size M Tower module on a low podium as the booth centrepiece, soft track lighting picking out its finned top and exposed-tube mid-section, the lime-green status LED on its inverter cabinet visible. 2 silhouetted visitors at the side in conversation, slightly out of focus, no faces.

LIGHT — track spots on the M Tower, cool venue ambient, warm rim on visitors.

COMPOSITION — 3:2 wide editorial, polished black floor reflecting the unit's base. International trade-show vibe (Hannover Messe / Power-Gen Europe). NO readable text, NO logos on the booth walls.
```

## `rad-40ng.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-40ng.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects card "40HC Container Package" for a container-fit cooling product.
KEEP from source — the Enfrio cooling package and its container-fit envelope (preserve all radiator/cooling-unit geometry per INTEGRITY_RULE).
CHANGE — studio product treatment, white-to-light-grey gradient backdrop, soft top key, sharp ground shadow for grounding, gentle specular on the aluminium fins. Strip every logo or marking from the unit and surroundings.
COMPOSITION — 4:3 (close to 1536×1024), three-quarter view, catalogue hero.
```

## `rad-remote-mtu.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-remote-mtu.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects card "Remote installation radiator."
KEEP from source — the large remote-installation Enfrio radiator package (preserve per INTEGRITY_RULE — this is a real engineered product).
CHANGE — outdoor editorial relight: late-afternoon golden-hour key, deep blue sky behind, subtle lens flare. Make the unit feel monumental and field-tough on a concrete pad. Strip third-party logos.
COMPOSITION — 3:2, three-quarter view, slight low angle.
```

## Fiere — `fair-dubai-1.jpg`, `fair-dubai-2.jpg`, `fair-mee-2.jpg` ✨
**No allegati**  ·  **Output**: JPG 1536×1024

Tre foto fiera nello stesso linguaggio editoriale, con il modulo M Tower (o un modulo Enfrio aluminium-radiator) come "hero exhibit" sul booth, niente loghi.

### `fair-dubai-1.jpg`
```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — /projects carousel: "commercial engagement in strategic energy markets" (Middle East trade fair). Should hint at the real Enfrio product line — preferably a corner of an M Tower visible (apply M_TOWER_SPEC if shown).

SCENE — editorial wide of an industrial trade-show floor in the Middle East. Warm golden ambient light, suspended geometric ceiling graphics, blurred professionals in mid-ground, foreground sharp on a sleek dark-navy booth with an M Tower module on a low podium (only the top half of the M Tower visible from the angle is fine).

LIGHT — warm venue ambient, accent spots on the M Tower.

COMPOSITION — 3:2 wide, cinematic depth, no readable text, no logos.
```

### `fair-dubai-2.jpg`
```
[STYLE_BASE]

ROLE — /projects carousel: secondary Dubai-energy event shot.

SCENE — editorial three-quarter view of an industrial trade-show booth. Matte dark booth walls with lime-green spot accents, a finished Enfrio cooling module on display (use the architecture of an aluminium radiator package — header tanks, finned core, mounting frame — not a fantasy unit), blurred visitors at the edge of frame (no faces).

LIGHT — warm-cool ambient contrast, soft directional accent on the product.

COMPOSITION — 3:2, no readable text, no logos.
```

### `fair-mee-2.jpg`
```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — /projects carousel: "Middle East Energy event presence." MUST depict the real M Tower as booth exhibit (apply M_TOWER_SPEC verbatim).

SCENE — editorial of a sleek dark-navy booth with one M Tower module as the hero exhibit; soft directional lighting picks out the finned top + exposed-tube mid-section; ambient venue glow behind; 2 blurred professionals in conversation at the side (no faces).

LIGHT — track spots on the M Tower, ambient cool fill.

COMPOSITION — 3:2, premium B2B event photography, no readable text, no logos.
```

## `warehouse-delivery.jpg` 🖼️
**Allega**: `public/assets/images/site/warehouse-delivery.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /tower-m*

```
[STYLE_BASE]
[INTEGRITY_RULE]
[M_TOWER_SPEC]

ROLE — /projects "Execution Closure" carousel AND /tower-m "Datacenter Cooling" deploy card. The unit being moved should read as an Enfrio cooling product (preserve the source product's geometry if it already shows one; if not, an M Tower module on a pallet is the ideal subject per M_TOWER_SPEC).
KEEP from source — the warehouse architecture, the forklift, the palletised cooling unit (preserve its geometry per INTEGRITY_RULE).
CHANGE — cinematic wide, sunrise volumetric sunbeam through the open dock door behind, foreground other cooling unit sharp, mid-ground forklift in subtle motion blur. Cool teal grade with warm sun accent. Strip all third-party logos from the forklift and dock signage.
COMPOSITION — 4:3 (close to 1536×1024), wide editorial.
```

## `rad-warehouse-stock.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-warehouse-stock.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects carousel: "production continuity and staged delivery readiness."
KEEP from source — every aluminium cooling unit on the warehouse rack. Preserve EXACTLY each unit's geometry per INTEGRITY_RULE (do not "fix" or "modernise" the products visible — they are real engineered pieces).
CHANGE — symmetrical perspective straight down the aisle, controlled overhead LED lighting, cool industrial palette, one lime-green safety stripe painted on the floor down the aisle as the only colour accent. Premium logistics editorial feel.
COMPOSITION — 3:2, vanishing-point perspective, no logos visible.
```

## `rad-double.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-double.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects carousel: "variant architecture" — a real dual-circuit (HT+LT) Enfrio aluminium radiator.
KEEP from source — the dual-circuit radiator (preserve EXACTLY both cores, both header sets, the side-by-side architecture, the frame, hose ports per INTEGRITY_RULE).
CHANGE — dark seamless studio backdrop, single softbox key from upper-left, soft fill, sharp specular on aluminium fins, gentle floor shadow. Engineering-excellence catalogue feel. No logos.
COMPOSITION — 4:3 (close to 1536×1024), three-quarter view.
```

## `rad-truck-load.jpg` 🖼️
**Allega**: `public/assets/images/site/rad-truck-load.jpg`  ·  **Output**: JPG 1536×1024

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /projects carousel: "execution closes with logistics discipline."
KEEP from source — the Enfrio cooling unit and how it's slung from an overhead crane onto a flatbed (preserve unit geometry per INTEGRITY_RULE).
CHANGE — dynamic reportage edit, late-afternoon light, long shadows, subtle motion blur on the crane chain, sharp on the unit body. Strip every logo from the truck cab and the crane.
COMPOSITION — 3:2, three-quarter angle catching the unit mid-lift.
```

---

# TOWER M — `/tower-m`

## `mtower-render.png` ✨
**No allegati**  ·  **Output**: PNG 1024×1536 (verticale, sfondo TRASPARENTE)  ·  ⚠️ *Estensione obbligatoria `.png`, non `.jpg`*

```
[STYLE_BASE]
[M_TOWER_SPEC]

ROLE — single M Tower module hero used as the product silhouette in the /tower-m configurator. This image defines the CANONICAL look of the product on the site.

SCENE — one isolated M Tower module on PURE TRANSPARENT background (alpha channel — PNG output). Three-quarter front view (slight right-side rotation, ≈25°). The three vertical sections must be clearly readable: V-shaped finned top, exposed dimpled-tube mid, black inverter-cabinet bottom with one lime-green LED.

LIGHT — soft studio key from upper-left, gentle rim from the right, mild contact shadow under the base.

COMPOSITION — vertical 2:3 (1024×1536), unit occupies ~80% of canvas height, centred horizontally. NO front mesh grid, NO logos, NO text, NO background props.
```

*Le altre due foto di /tower-m (power-gen-hall, warehouse-delivery) sono già coperte sopra.*

---

# CONTACT — `/contact`

## `quality-hexagon-b.jpg` 🖼️
**Allega**: `public/assets/images/site/quality-hexagon-b.jpg`  ·  **Output**: JPG 1536×1024  ·  *Riusata su /projects*

```
[STYLE_BASE]
[INTEGRITY_RULE]

ROLE — /contact hero AND /projects info card "Quality Proof."
KEEP from source — the CMM probe and the precision aluminium component being measured (preserve component geometry per INTEGRITY_RULE).
CHANGE — macro editorial, tack-sharp on the probe tip touching the component, creamy bokeh behind, cool neutral palette with one lime-green accent LED on the probe head. Strip every CMM-manufacturer brand name.
COMPOSITION — 4:3 (close to 1536×1024), macro.
```

---

# Logo

⚠️ **Non rigenerare con AI** il file `public/assets/images/logo-enfrio.png`. È il logo brand ufficiale.

---

# Promemoria filename

Sono 38 file in totale. Il socio non deve generare 38 *prompts* separati: alcuni file sono usati su più pagine ma vengono generati UNA volta sola. La lista finale univoca è già qui sopra (un blocco per file).

Ordine consigliato (priorità calante):

**Prima passata — le 4 chiavi del sito (massima cura):**
1. `hero-main.jpg`
2. `power-gen-hall.jpg`
3. `installed-v20-integrated.jpg`
4. `laser-operator-jq.jpg`

**Seconda passata — modulo M Tower e datacenter:**
5. `mtower-render.png`
6. `enfrio-system-infographic.jpg`
7. `enfrio-trade-show.jpg`

**Terza passata — il resto.**
