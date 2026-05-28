# Enfrio — Prompt Gemini per rigenerazione immagini

Lista completa delle immagini usate sul sito Enfrio con relativo prompt da dare a Gemini (Imagen 4) per generarne una versione migliore. Le immagini rigenerate vanno salvate con lo **stesso nome file** in `public/assets/images/site/` — non serve toccare il codice.

## Legenda

- **🖼️ Image-to-image** → allega l'immagine originale a Gemini insieme al prompt. Usalo quando l'originale ha una composizione buona ma serve ripulirla / migliorarla.
- **✨ Text-to-image** → solo prompt, niente allegato. Usalo quando l'originale è da buttare o vuoi una versione "marketing" da zero.

## Stile globale (incolla in cima a ogni prompt per coerenza brand)

> Photoreal industrial photography, cinematic lighting, shallow depth of field, color palette: deep navy + steel + a hint of lime green accent, premium B2B aesthetic à la Caterpillar / Siemens Energy editorial style, 16:9, no logos, no watermarks, no text.

---

## HOME (`/`)

### 1. `hero-main.jpg` — hero principale

🖼️ Image-to-image

> Refine this photo into a premium hero shot. Keep the technician welding a radiator core, but: relight with cinematic side-key + soft fill, add subtle sparks bokeh, deepen background into out-of-focus factory shadow, color-grade to a teal/steel palette with a warm orange weld glow. Add minimal lime-green rim light on the operator's PPE. Remove any visible third-party logos. Make it look like the cover of an industrial annual report. 16:9.

### 2. `prod-line.jpg` — production line (dominante)

🖼️ Image-to-image

> Cinematic wide shot of an aluminium radiator production line. Restore sharpness, balance colors to cool industrial palette, add depth with subtle volumetric light from the ceiling. Operators in branded workwear (generic dark blue, no logos). Foreground in focus on a finished cooling unit, background softly blurred. Photoreal, 3:2.

### 3. `tube-bending-operator.jpg` — 6-axis tube bending

🖼️ Image-to-image

> Enhance this 6-axis CNC tube bending operation. Keep the operator's hands and the bent stainless tube as hero subject. Add controlled rim lighting from the machine's interior, deepen shadows around the cell, color-grade to neutral industrial steel. Remove any brand markings from the machine. Ultra-sharp focus on the tube curvature, motion blur subtle on the hand. 3:2.

### 4. `assembly-worker.jpg` — assembly station (verticale)

🖼️ Image-to-image

> Vertical portrait of a skilled operator at an aluminium cooling unit assembly bench. Relight to clean three-point lighting, hands in sharp focus on aluminium fins, face slightly out of focus for editorial feel. Cool blue-grey palette with a single warm task lamp. Premium B2B industrial photography. 2:3 portrait.

### 5. `rad-engine-complete.jpg` — engine + cooling integrated

🖼️ Image-to-image

> Studio-style hero of a diesel genset engine with the Enfrio aluminium cooling package installed on top. Pure dark background (#0a0e15), single softbox key from upper left, accent rim light along the cooling fins. Make the aluminium fins gleam, the engine look monolithic and confidence-inspiring. Remove any non-Enfrio brand badges. 16:9.

### 6. `power-gen-hall.jpg` — genset hall (M Tower spotlight + industries hero)

✨ Text-to-image (o image-to-image se l'attuale è già forte)

> Photoreal interior of a massive power generation hall: 6–8 large industrial diesel gensets aligned in a row, each topped with a tall modular aluminium cooling tower (M Tower style, finned heat exchangers, painted black steel frame, integrated inverter cabinet on the side). Polished concrete floor reflecting overhead industrial lighting. Cinematic perspective from low angle, vanishing point down the row. Deep teal-navy ambient with cool LED key lights, lime-green accent indicators on the cooling units. No people, no logos, no text. Editorial industrial photography, 4:3.

### 7. `welder-action.jpg` — welder (WOW carousel)

🖼️ Image-to-image

> Enhance this welder photo: keep the operator's pose welding a radiator core, but remove ALL background logos and branding. Replace background with clean out-of-focus factory blur. Add a dramatic orange weld arc glow on the worker's visor, cool blue ambient elsewhere. Premium editorial feel, sharp on welder's hands. 3:2.

### 8. `handwork-detail.jpg` — hand-finishing

🖼️ Image-to-image

> Extreme close-up macro of hands finishing an aluminium cooling unit. Sharp focus on a single fin and a calloused thumb, everything else creamy bokeh. Color-grade to neutral cool, a hint of warm skin tone. Editorial macro photography, the "craftsmanship" shot for a premium industrial brand. 3:2.

---

## COMPANY (`/company`)

### 9. `team-office-floor.jpg` — hero company

✨ Text-to-image (sostituisci, evita foto team riconoscibili)

> Wide editorial shot of an industrial office mezzanine overlooking a production floor through floor-to-ceiling glass. In the foreground, blurred silhouettes of 2–3 engineers reviewing CAD on a large screen. Mid-ground: the office space with minimalist white desks. Background: a sharply lit aluminium radiator assembly line visible through the glass. Cool industrial palette, lime green accent on a single wall graphic. No faces clearly visible, no logos, no text. Premium B2B feel. 4:3.

### 10. `prod-assembly-b.jpg` — factory assembly (dominante)

🖼️ Image-to-image

> Wide dynamic shot of factory floor assembly: workers integrating an aluminium cooling unit onto a sub-frame. Restore detail, balance ambient warehouse lighting with a cinematic teal/orange grade. Foreground: the cooling unit, sharp. Background: production line softly blurred. Remove any third-party logos. Premium industrial editorial, 3:2.

> Nota: `welder-action.jpg`, `assembly-worker.jpg` e `handwork-detail.jpg` sono riusati qui — vedi prompt #7, #4, #8.

---

## SOLUTIONS (`/solutions`)

### 11. `installed-v20-integrated.jpg` — hero (anche in dominant cluster)

🖼️ Image-to-image

> Studio relight of a V20 engine with integrated Enfrio cooling system mounted on top. Black seamless background, dramatic single key light from above-left, lime green rim accent. Make the engine look like a hero product render. Remove all third-party engine manufacturer logos. Ultra-sharp on the cooling fins. 16:9.

### 12. `installed-baudouin-canopy.jpg` — canopy aperta

🖼️ Image-to-image

> Premium shot of a genset inside an open canopy enclosure, with the Enfrio aluminium cooling unit prominently visible at the top. Three-point lighting, deep navy interior background, cooling unit accented with a soft cool rim light. Remove all OEM logos from the engine and canopy. Editorial product photography, 3:2.

### 13. `product-complete-b.jpg` — finished integrated module

🖼️ Image-to-image

> Hero studio shot of a complete Enfrio cooling module on a clean dark grey backdrop. Cinematic light from upper left, soft fill, sharp rim on the aluminium fins. Make it look like a flagship product render. No logos. 4:3.

> Nota: `rad-engine-complete.jpg` è riusato qui — vedi prompt #5.

---

## TECHNOLOGY (`/technology`)

### 14. `laser-operator-jq.jpg` — hero (laser cutting)

🖼️ Image-to-image

> Cinematic shot of an operator running a fiber laser tube cutting cell. The orange/red glow of the laser cut as the dominant light source on the operator's face and PPE. Deep navy ambient elsewhere. Hands in focus on the control panel. Remove any brand markings from the machine. Dramatic industrial photography à la "Inside the Factory of the Future." 16:9.

### 15. `mach-laser-d.jpg` — laser detail

🖼️ Image-to-image

> Macro detail of the laser cutting head mid-operation: bright cut spark, molten metal, focused beam. Tack-sharp on the cut, ambient industrial blur behind. Cool steel palette with red-orange cut accent. No logos. 3:2.

### 16. `quality-hexagon-a.jpg` — CMM metrology

🖼️ Image-to-image

> Editorial photo of a Hexagon-style CMM probe inspecting a precision aluminium component on a granite reference table. Clean laboratory lighting, neutral white-grey palette, single lime-green accent indicator LED on the probe. Remove all visible brand names. Make the scene look like a quality control documentary still. 3:2.

> Nota: `tube-bending-operator.jpg` e `handwork-detail.jpg` sono riusati qui — vedi prompt #3 e #8.

### Galleria macchinari (auto-scroll) — `mach-bending-a/d`, `mach-laser-a`, `quality-hexagon-b`, `prod-weld-station`

🖼️ Image-to-image (per ognuna)

> Tight editorial detail of an industrial machinery cell at Enfrio. Restore sharpness, cool industrial palette with single warm task accent, sharp focus on the working tool, soft bokeh elsewhere. Remove all third-party brand markings. Premium B2B documentary style. 3:2.

---

## INDUSTRIES (`/industries`)

### 17. `enfrio-system-infographic.jpg` — datacenter card

✨ Text-to-image (sostituisci con render fotoreale, no infografica)

> Vertical photoreal scene of a modern datacenter exterior service yard: a row of 4 modular aluminium cooling towers (tall finned heat exchangers, painted black steel frame, integrated inverter cabinets) standing next to a row of server hall outdoor units. Late blue-hour sky, warm interior light glowing through datacenter windows, lime-green LED status indicators on each cooling unit. Editorial industrial photography, no people, no logos, no text. 3:4 portrait.

### 18. `waste-madrid-01..05.jpg` — Madrid case (5 foto)

🖼️ Image-to-image (per ogni foto)

> Enhance this photo of an Enfrio cooling system integrated on a Madrid municipal waste collection truck. Color-grade to cinematic neutral, sharpen detail on the radiator and CAC core-box opening. Remove any logos that are not Enfrio. Keep the technical authenticity. Editorial industrial reportage feel. 3:2.

> Nota: `power-gen-hall.jpg` è riusato qui — vedi prompt #6.

---

## PROJECTS (`/projects`)

### 19. `enfrio-trade-show.jpg` — hero

✨ Text-to-image (la foto attuale è poco distinctive)

> Wide editorial shot of a premium B2B trade show booth: matte dark navy walls with subtle lime green graphic accents, a large modular aluminium cooling tower on display as the centerpiece, soft track lighting picking out its fins. Two blurred silhouettes of visitors at the side. Polished black floor. International trade show atmosphere (think Hannover Messe / Power-Gen Europe). No readable logos or text on the booth. 3:2.

### 20. `rad-40ng.jpg` — 40HC container package

🖼️ Image-to-image

> Studio product shot of a 40HC container-fit cooling package. Pure white-to-light-grey gradient backdrop, soft top key, sharp shadows underneath for grounding. Highlight the container-shaped envelope and the aluminium core. Remove all logos. Catalog hero feel. 4:3.

### 21. `rad-remote-mtu.jpg` — remote installation radiator

🖼️ Image-to-image

> Outdoor editorial shot of a large remote-installation radiator package on a concrete pad in a wide industrial site. Late afternoon golden hour light, deep blue sky, lens flare subtle. Make the unit look monumental and field-tough. Remove third-party logos. 3:2.

### 22. `waste-madrid-03.jpg` — Madrid project card

🖼️ Vedi prompt #18 — stesso trattamento applicato a questo frame.

### 23. `fair-dubai-1.jpg`, `fair-dubai-2.jpg`, `fair-mee-2.jpg` — eventi

✨ Text-to-image (sostituisci con shot generici professionali — evita questioni di loghi terzi)

> Editorial wide angle of a premium industrial trade show floor in the Middle East: warm golden ambient light, suspended geometric ceiling graphics, blurred crowd in mid-ground, foreground sharp on a sleek dark-navy booth with a modular aluminium cooling unit on a podium. Cinematic depth, no readable text or logos. 3:2.

### 24. `installed-baudouin-canopy.jpg` — WOW carousel

🖼️ Vedi prompt #12.

### 25. `warehouse-delivery.jpg` — execution closure (anche su `/tower-m`)

🖼️ Image-to-image

> Cinematic wide shot of an industrial warehouse interior: a forklift moving a palletized Enfrio cooling unit toward an open dock door at sunrise. Long shadows, sun shaft through the open door creating volumetric light. Foreground: another cooling unit, sharp. Mid-ground: forklift in slight motion blur. Color-grade to cool teal with warm sun accent. Remove all third-party logos. 4:3.

### 26. `rad-warehouse-stock.jpg` — production continuity

🖼️ Image-to-image

> Wide editorial shot of a warehouse rack filled with finished aluminium cooling units, neatly aligned in rows. Symmetrical perspective down the aisle, controlled overhead LED lighting, cool industrial palette, lime green safety line on the floor. Premium logistics feel. No logos visible. 3:2.

### 27. `rad-double.jpg` — dual radiator variant

🖼️ Image-to-image

> Studio product shot of a dual-circuit (HT+LT) Enfrio aluminium radiator on a dark seamless backdrop. Single softbox key, soft fill, sharp specular on the fins. Catalog hero treatment, the "engineering excellence" shot. No logos. 4:3.

### 28. `rad-truck-load.jpg` — loading onto truck

🖼️ Image-to-image

> Dynamic editorial shot of an Enfrio cooling unit being loaded onto a flatbed truck via overhead crane. Late afternoon light, long shadows, motion blur subtle on the crane chain, sharp on the unit. Industrial reportage feel. Remove all logos from the truck cab. 3:2.

---

## TOWER M (`/tower-m`)

### 29. `mtower-render.png` — modulo configuratore (configurator + hero poster)

✨ Text-to-image — soluzione ideale: chiedere a Enfrio un render "marketing" senza la griglia di protezione frontale. Altrimenti:

> Studio 3D-render aesthetic of a single M Tower modular cooling unit: tall rectangular industrial cooling tower, white/black painted steel frame, top section is the aluminium finned heat exchanger with louvered fins, mid-section is exposed dimpled stainless tubing, bottom section is the integrated inverter cabinet with subtle lime-green LED status indicator. Three-quarter front view. Pure transparent background (PNG with alpha). Soft studio lighting, slight rim light on the right side. Premium industrial product render. NO front protection mesh grid. NO logos, no text. Vertical 9:16.

### 30. `power-gen-hall.jpg` — deploy card 1 (Power Generation)

🖼️ Vedi prompt #6.

### 31. `warehouse-delivery.jpg` — deploy card 2 (Datacenter)

🖼️ Vedi prompt #25.

---

## CONTACT (`/contact`)

### 32. `quality-hexagon-b.jpg` — hero

🖼️ Image-to-image

> Macro editorial shot of a CMM measuring probe touching down on a precision-machined component. Tack-sharp on the probe tip, creamy bokeh behind. Cool neutral palette with a single lime-green accent LED. Premium "quality" feel for a contact page hero. No logos. 4:3.

---

## ASSETS GLOBALI

### 33. `logo-enfrio.png` — logo navbar

⚠️ **Non rigenerare con AI** — è il logo brand ufficiale. Se hai bisogno di una versione vector pulita, chiedi al cliente l'SVG originale.

---

## WORKFLOW CONSIGLIATO

1. **Prima passa**: rigenera le 4 hero (`hero-main`, `power-gen-hall`, `installed-v20-integrated`, `laser-operator-jq`). Sono quelle che pesano di più sulla percezione di brand premium.
2. **Fiera / team**: meglio rigenerare da zero (text-to-image) — eviti questioni di liberatorie e loghi terzi.
3. **Render M Tower**: piano A → chiedi a Enfrio un export pulito senza la griglia frontale di protezione. Piano B → prompt #29.
4. **Filename**: salva con lo stesso nome dell'originale — niente da toccare nel codice.
5. **Doppio passaggio "ritocco"**: quando l'output di Imagen 4 ha ancora artefatti, ripassalo come image-to-image con `"keep composition, refine lighting and remove any text/logos"`.
