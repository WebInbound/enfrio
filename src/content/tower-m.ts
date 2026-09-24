import type { PageDef } from "./types";

// Flagship M Tower page: page sections + the texts of the interactive
// components (3D stage, deployment switcher, sizing simulator), which are
// client components and receive these values as props.
export const TOWER_M = {
  id: "towerm",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "M Tower — titolo pagina", default: "M Tower | Modular cooling that scales with your power | Enfrio" },
        description: {
          label: "M Tower — descrizione per Google",
          default:
            "Enfrio M Tower is a modular heat-rejection platform: 1500 kW per unit, scaling from standalone gensets to 12 MW datacenter halls. Real engineering, ATEX-ready, sea-water proof.",
          type: "textarea",
        },
      },
    },
    stage: {
      group: "M Tower › 1. Apertura 3D",
      blocks: {
        kicker: { label: "Occhiello", default: "FLAGSHIP PLATFORM" },
        title_line1: { label: "Titolo — prima riga", default: "M Tower." },
        title_accent: { label: "Titolo — parte evidenziata (seconda riga)", default: "Cooling that scales" },
        title_end: { label: "Titolo — fine della seconda riga", default: "with your power." },
        lead: {
          label: "Testo introduttivo",
          default:
            "Modular heat-rejection units of 1500 kW each. Start with one, add more as your plant grows. From standalone gensets to 12 MW datacenter halls — same proven core.",
          type: "textarea",
        },
        spec1_value: { label: "Dato 1 — valore (numero animato + unità)", default: "1500 kW" },
        spec1_label: { label: "Dato 1 — etichetta", default: "PER MODULE" },
        spec2_value: { label: "Dato 2 — valore (numero animato + unità)", default: "12 MW" },
        spec2_label: { label: "Dato 2 — etichetta", default: "MAX BANK" },
        spec3_value: { label: "Dato 3 — valore", default: "N+1" },
        spec3_label: { label: "Dato 3 — etichetta", default: "REDUNDANCY" },
        cta_primary: { label: "Pulsante principale (va al configuratore)", default: "Size your installation" },
        cta_secondary: { label: "Pulsante secondario (va a \"Explore the unit\")", default: "Explore the unit" },
        scroll_hint: { label: "Suggerimento sotto i pulsanti", default: "↓ scroll to spin" },
        hint_drag: { label: "Suggerimento sul render: trascina", default: "drag" },
        hint_scroll: { label: "Suggerimento sul render: scorri", default: "scroll" },
        chip1_label: { label: "Etichetta 3D 1 — nome", default: "HEAT-EXCHANGER CORE" },
        chip1_spec: { label: "Etichetta 3D 1 — dettaglio", default: "Cu-Al finned bundle" },
        chip2_label: { label: "Etichetta 3D 2 — nome", default: "FAN STACK" },
        chip2_spec: { label: "Etichetta 3D 2 — dettaglio", default: "EC fans, IE5 efficiency" },
        chip3_label: { label: "Etichetta 3D 3 — nome", default: "INVERTER CABINET" },
        chip3_spec: { label: "Etichetta 3D 3 — dettaglio", default: "Integrated side-mount" },
        chip4_label: { label: "Etichetta 3D 4 — nome", default: "STRUCTURAL FRAME" },
        chip4_spec: { label: "Etichetta 3D 4 — dettaglio", default: "Hot-dip galvanized steel" },
      },
    },
    explore: {
      group: "M Tower › 2. Esplora l'unità",
      blocks: {
        kicker: { label: "Occhiello", default: "EXPLORE THE UNIT" },
        title: { label: "Titolo", default: "Engineered to the millimetre, built to ship.", type: "textarea" },
        text: {
          label: "Testo",
          default:
            "The stainless tube bundles, the louvered aluminium fins, the inverter cabinet on the side, the vibration-isolated frame — every detail is engineered for the duty cycle of mission-critical heat rejection. Spin the render above to inspect every face.",
          type: "textarea",
        },
        mech_title: { label: "Meccanica — titolo", default: "Mechanical" },
        mech_1: { label: "Meccanica — punto 1", default: "High-alloy aluminium cores with dimpled tubes" },
        mech_2: { label: "Meccanica — punto 2", default: "Louvered fins for maximum heat transfer surface" },
        mech_3: { label: "Meccanica — punto 3", default: "Vibration-isolated black-painted steel frame" },
        mech_4: { label: "Meccanica — punto 4", default: "Welded gussets at every structural corner" },
        integ_title: { label: "Integrazione — titolo", default: "Integration" },
        integ_1: { label: "Integrazione — punto 1", default: "Inverter cabinet integrated on the side" },
        integ_2: { label: "Integrazione — punto 2", default: "Container-fit envelope: ship, lift, bolt down" },
        integ_3: { label: "Integrazione — punto 3", default: "Hydraulic interface shared across every module" },
        integ_4: { label: "Integrazione — punto 4", default: "Rubber vibration-isolation pads at the base" },
      },
    },
    craft: {
      group: "M Tower › 3. Dettagli costruttivi",
      blocks: {
        kicker: { label: "Occhiello", default: "ENGINEERING DETAIL" },
        title: { label: "Titolo", default: "Built from the inside out." },
        crop1_image: { label: "Dettaglio 1 — foto", default: "/assets/images/site/rad-vertical.jpg", type: "image" },
        crop1_image_alt: { label: "Dettaglio 1 — testo alternativo", default: "Cu/Al finned coil close-up" },
        crop1_caption: { label: "Dettaglio 1 — didascalia", default: "Cu/Al finned coil. 0.12 mm fin pitch." },
        crop2_image: { label: "Dettaglio 2 — foto", default: "/assets/images/site/prod-welding.jpg", type: "image" },
        crop2_image_alt: { label: "Dettaglio 2 — testo alternativo", default: "Hot-dip galvanized weld detail" },
        crop2_caption: { label: "Dettaglio 2 — didascalia", default: "Hot-dip galvanized DIN EN ISO 1461." },
        crop3_image: { label: "Dettaglio 3 — foto", default: "/assets/images/site/mach-laser-b.jpg", type: "image" },
        crop3_image_alt: { label: "Dettaglio 3 — testo alternativo", default: "EC fan motor detail" },
        crop3_caption: { label: "Dettaglio 3 — didascalia", default: "EC fans. IE5 efficiency class." },
      },
    },
    why: {
      group: "M Tower › 4. Perché modulare",
      blocks: {
        kicker: { label: "Occhiello", default: "WHY MODULAR MATTERS" },
        title: { label: "Titolo", default: "Three reasons engineers pick M Tower over fixed-size cooling.", type: "textarea" },
        card1_value: { label: "Motivo 1 — valore (numero animato + testo)", default: "-42% CAPEX" },
        card1_tag: { label: "Motivo 1 — etichetta", default: "CAPEX" },
        card1_text: {
          label: "Motivo 1 — testo",
          default:
            "Pay for capacity you actually use. Buy what today's load needs. Add modules later when the plant grows. No oversized installation depreciating from day one.",
          type: "textarea",
        },
        card2_value: { label: "Motivo 2 — valore (numero animato + testo)", default: "100% UPTIME" },
        card2_tag: { label: "Motivo 2 — etichetta", default: "UPTIME" },
        card2_text: {
          label: "Motivo 2 — testo",
          default:
            "N+1 redundancy comes for free. Add one extra module to every bank and you have hot-swap redundancy. A failed unit doesn't take production down.",
          type: "textarea",
        },
        card3_value: { label: "Motivo 3 — valore (numero animato + testo)", default: "90 DAYS" },
        card3_tag: { label: "Motivo 3 — etichetta", default: "LOGISTICS" },
        card3_text: {
          label: "Motivo 3 — testo",
          default:
            "Container-fit, container-shipped. Each module fits standard freight envelopes. From port to slab in days, not weeks. Field assembly on a single bolt pattern.",
          type: "textarea",
        },
      },
    },
    scale: {
      group: "M Tower › 5. Scala modulare",
      blocks: {
        kicker: { label: "Occhiello", default: "MODULAR SCALES WITH YOU" },
        title: { label: "Titolo", default: "From one unit to twelve megawatts." },
        text: {
          label: "Testo",
          default:
            "One bolt pattern, one spare-parts library — and a capacity envelope that follows the project from a single genset to a full hyperscale hall.",
          type: "textarea",
        },
        tier1_label: { label: "Livello 1 modulo — nome", default: "Single genset" },
        tier2_label: { label: "Livello 2 moduli — nome", default: "Backup bank" },
        tier3_label: { label: "Livello 4 moduli — nome", default: "Datacenter row" },
        tier4_label: { label: "Livello 8 moduli — nome", default: "Hyperscale hall" },
        module_one: { label: "Parola \"modulo\" (singolare)", default: "module" },
        module_many: { label: "Parola \"moduli\" (plurale)", default: "modules" },
      },
    },
    sizer_intro: {
      group: "M Tower › 6. Configuratore — introduzione",
      blocks: {
        kicker: { label: "Occhiello", default: "SIZING SIMULATOR" },
        title: { label: "Titolo", default: "How many M Tower modules does your project need?", type: "textarea" },
        text: {
          label: "Testo",
          default:
            "Type your engine power, pick the application, choose redundancy. The simulator returns a baseline configuration on the spot. Final sizing is confirmed by Enfrio engineering on real platform data.",
          type: "textarea",
        },
      },
    },
    deploy: {
      group: "M Tower › 7. Contesti di impiego",
      blocks: {
        kicker: { label: "Occhiello", default: "DEPLOYMENT CONTEXTS" },
        title: { label: "Titolo", default: "One platform, four worlds." },
        text: {
          label: "Testo",
          default:
            "The M Tower envelope adapts to ambient, fluid and certification rules across the industries we serve. Switch contexts to compare the spec deltas.",
          type: "textarea",
        },
        unit_alt: { label: "Render nella scheda — testo alternativo", default: "M Tower modular cooling unit" },
      },
    },
    deploy_dc: {
      group: "M Tower › 7a. Contesto Data Center",
      blocks: {
        tab: { label: "Nome scheda", default: "Data Center" },
        blurb: {
          label: "Descrizione",
          default:
            "High-density compute halls. Glycol loop tuned for IT-load profiles, N+1 from day one, ready for liquid-cooled rack expansion.",
          type: "textarea",
        },
        spec1_label: { label: "Dato 1 — etichetta", default: "Design ambient" },
        spec1_value: { label: "Dato 1 — valore", default: "32 °C" },
        spec2_label: { label: "Dato 2 — etichetta", default: "Glycol mix" },
        spec2_value: { label: "Dato 2 — valore", default: "30%" },
        spec3_label: { label: "Dato 3 — etichetta", default: "Fans" },
        spec3_value: { label: "Dato 3 — valore", default: "EC only" },
        spec4_label: { label: "Dato 4 — etichetta", default: "Redundancy" },
        spec4_value: { label: "Dato 4 — valore", default: "N+1 standard" },
      },
    },
    deploy_petro: {
      group: "M Tower › 7b. Contesto Petrolchimico",
      blocks: {
        tab: { label: "Nome scheda", default: "Petrochemical" },
        blurb: {
          label: "Descrizione",
          default:
            "ATEX zone-rated cooling. Sea-water-proof galvanizing, gas-tight enclosures, fan motors certified for hazardous duty.",
          type: "textarea",
        },
        spec1_label: { label: "Dato 1 — etichetta", default: "Zoning" },
        spec1_value: { label: "Dato 1 — valore", default: "ATEX II 3G" },
        spec2_label: { label: "Dato 2 — etichetta", default: "Coating" },
        spec2_value: { label: "Dato 2 — valore", default: "Hot-dip Zn" },
        spec3_label: { label: "Dato 3 — etichetta", default: "Fans" },
        spec3_value: { label: "Dato 3 — valore", default: "Ex-d rated" },
        spec4_label: { label: "Dato 4 — etichetta", default: "Coil" },
        spec4_value: { label: "Dato 4 — valore", default: "Cu / epoxy" },
      },
    },
    deploy_power: {
      group: "M Tower › 7c. Contesto Power Generation",
      blocks: {
        tab: { label: "Nome scheda", default: "Power Generation" },
        blurb: {
          label: "Descrizione",
          default:
            "One M Tower per genset, bank up as the site grows. Tracks engine jacket-water load with proportional fan staging.",
          type: "textarea",
        },
        spec1_label: { label: "Dato 1 — etichetta", default: "Engine pair" },
        spec1_value: { label: "Dato 1 — valore", default: "1.5 MW" },
        spec2_label: { label: "Dato 2 — etichetta", default: "Bank max" },
        spec2_value: { label: "Dato 2 — valore", default: "12 MW" },
        spec3_label: { label: "Dato 3 — etichetta", default: "Staging" },
        spec3_value: { label: "Dato 3 — valore", default: "Proportional" },
        spec4_label: { label: "Dato 4 — etichetta", default: "Footprint" },
        spec4_value: { label: "Dato 4 — valore", default: "Bolt pattern" },
      },
    },
    deploy_hvac: {
      group: "M Tower › 7d. Contesto HVAC",
      blocks: {
        tab: { label: "Nome scheda", default: "HVAC District" },
        blurb: {
          label: "Descrizione",
          default:
            "District heating and cooling loops. Wide-delta-T trim, low-noise fan curve, ready for variable secondary distribution.",
          type: "textarea",
        },
        spec1_label: { label: "Dato 1 — etichetta", default: "Loop delta-T" },
        spec1_value: { label: "Dato 1 — valore", default: "12 K" },
        spec2_label: { label: "Dato 2 — etichetta", default: "Sound" },
        spec2_value: { label: "Dato 2 — valore", default: "Low-noise" },
        spec3_label: { label: "Dato 3 — etichetta", default: "Control" },
        spec3_value: { label: "Dato 3 — valore", default: "BMS / Modbus" },
        spec4_label: { label: "Dato 4 — etichetta", default: "Glycol" },
        spec4_value: { label: "Dato 4 — valore", default: "0 – 40%" },
      },
    },
    outro: {
      group: "M Tower › 8. Chiusura",
      blocks: {
        image_alt: { label: "Render — testo alternativo", default: "M Tower modular cooling unit" },
        kicker: { label: "Occhiello", default: "READY TO SCALE WITH YOU" },
        title: { label: "Titolo", default: "From brief to bolted-down in 90 days." },
        strip1: { label: "Striscia dati — valore 1", default: "1500 kW" },
        strip2: { label: "Striscia dati — valore 2", default: "12 MW" },
        strip3: { label: "Striscia dati — valore 3", default: "N+1" },
        step1_label: { label: "Fase 1 — nome", default: "Brief" },
        step1_text: {
          label: "Fase 1 — testo",
          default: "Engine card, ambient, redundancy target — we read the project on a single page.",
          type: "textarea",
        },
        step2_label: { label: "Fase 2 — nome", default: "Engineer" },
        step2_text: {
          label: "Fase 2 — testo",
          default: "Sized on real platform data, validated against the operating envelope before steel is cut.",
          type: "textarea",
        },
        step3_label: { label: "Fase 3 — nome", default: "Build" },
        step3_text: {
          label: "Fase 3 — testo",
          default: "Laser, bend, weld, galvanize, assemble — all in-house at Ponderano (BI), Italy.",
          type: "textarea",
        },
        step4_label: { label: "Fase 4 — nome", default: "Commission" },
        step4_text: {
          label: "Fase 4 — testo",
          default: "Container shipped, bolted down, hot-tested on site. Handover signed by Enfrio engineering.",
          type: "textarea",
        },
        cta: { label: "Pulsante contatto", default: "Talk to the M Tower team" },
        datasheet: { label: "Pulsante scheda tecnica (il PDF si imposta in \"Globale › Documenti\")", default: "Download datasheet" },
        datasheet_missing: {
          label: "Suggerimento sul pulsante quando la scheda tecnica non c'è",
          default: "Datasheet available on request — contact the M Tower team",
        },
      },
    },
  },
} satisfies PageDef;

// Sizing simulator (MTowerSizer): interface texts + calculation
// coefficients. The coefficients are PLACEHOLDERS pending confirmation by
// Enfrio engineering: they are editable in the panel so Enfrio can set the
// real values without touching code.
export const SIZER = {
  id: "sizer",
  sections: {
    coefficients: {
      group: "M Tower › Configuratore — coefficienti di calcolo (DA CONFERMARE)",
      blocks: {
        unit_kw: { label: "Potenza di un modulo (kW) — solo il numero, es. 1500 o 1.500", default: "1500" },
        footprint_m2: { label: "Ingombro a terra per modulo (m²) — solo il numero, decimali con la virgola, es. 12,5", default: "12" },
        water_lpm: { label: "Portata acqua per modulo (L/min) — solo il numero, es. 2150 o 2.150", default: "240" },
        weight_t: { label: "Peso per modulo (tonnellate) — solo il numero, decimali con la virgola, es. 1,85", default: "1.85" },
        electrical_kva: { label: "Assorbimento elettrico per modulo (kVA) — solo il numero, es. 18 o 1.500", default: "18" },
        factor_diesel: { label: "Fattore calore: motore diesel (0–2)", default: "0.85" },
        factor_gas: { label: "Fattore calore: motore a gas (0–2)", default: "0.75" },
        factor_datacenter: { label: "Fattore calore: carico IT datacenter (0–2)", default: "1.0" },
        factor_custom: { label: "Fattore calore: personalizzato (0–2)", default: "1.0" },
        double_circuit: { label: "Moltiplicatore circuito doppio HT+LT (1–2)", default: "1.05" },
        derate_30c: { label: "Declassamento a 30 °C ambiente (0–1)", default: "1.0" },
        derate_40c: { label: "Declassamento a 40 °C ambiente (0–1)", default: "0.95" },
        derate_50c: { label: "Declassamento a 50 °C ambiente (0–1)", default: "0.88" },
        derate_alt_low: { label: "Declassamento altitudine < 1 km (0–1)", default: "1.0" },
        derate_alt_med: { label: "Declassamento altitudine 1–2 km (0–1)", default: "0.96" },
        derate_alt_high: { label: "Declassamento altitudine > 2 km (0–1)", default: "0.92" },
      },
    },
    inputs: {
      group: "M Tower › Configuratore — comandi",
      blocks: {
        power: { label: "Potenza motore — etichetta", default: "Engine power" },
        application: { label: "Applicazione — etichetta", default: "Application" },
        app_diesel: { label: "Applicazione: diesel", default: "Diesel genset" },
        app_gas: { label: "Applicazione: gas", default: "Gas engine" },
        app_datacenter: { label: "Applicazione: datacenter", default: "Datacenter IT load" },
        app_custom: { label: "Applicazione: personalizzata", default: "Custom (1:1)" },
        circuit: { label: "Circuito — etichetta", default: "Circuit" },
        circuit_single: { label: "Circuito singolo", default: "Single (HT)" },
        circuit_double: { label: "Circuito doppio", default: "Double (HT + LT)" },
        ambient: { label: "Temperatura ambiente — etichetta", default: "Ambient temperature" },
        altitude: { label: "Altitudine — etichetta", default: "Altitude" },
        alt_low: { label: "Altitudine bassa", default: "< 1 km" },
        alt_med: { label: "Altitudine media", default: "1 – 2 km" },
        alt_high: { label: "Altitudine alta", default: "> 2 km" },
        redundancy: { label: "Ridondanza — titolo", default: "N+1 redundancy" },
        redundancy_hint: { label: "Ridondanza — spiegazione", default: "Add one spare module for hot-swap continuity" },
      },
    },
    readout: {
      group: "M Tower › Configuratore — risultati",
      blocks: {
        hud_title: { label: "Pannello dati — titolo", default: "LIVE BUILD READOUT" },
        hud_footprint: { label: "Pannello dati — ingombro", default: "Footprint" },
        hud_water: { label: "Pannello dati — portata acqua", default: "Water flow" },
        hud_weight: { label: "Pannello dati — peso", default: "Weight" },
        hud_electrical: { label: "Pannello dati — assorbimento", default: "Electrical draw" },
        card_kicker: { label: "Scheda modulo — occhiello", default: "SINGLE M TOWER MODULE" },
        card_heat: { label: "Scheda modulo — sotto la potenza", default: "heat rejection" },
        card_footprint: { label: "Scheda modulo — sotto l'ingombro", default: "footprint" },
        card_circuits_value: { label: "Scheda modulo — circuiti (valore)", default: "HT / HT+LT" },
        card_circuits: { label: "Scheda modulo — sotto i circuiti", default: "circuits" },
        tag1: { label: "Scheda modulo — etichetta 1", default: "Container-fit" },
        tag2: { label: "Scheda modulo — etichetta 2", default: "Sea-water" },
        tag3: { label: "Scheda modulo — etichetta 3", default: "ATEX-ready" },
        tag4: { label: "Scheda modulo — etichetta 4", default: "Inverter-ready" },
        build_kicker: { label: "Risultato — occhiello", default: "YOUR M TOWER BUILD" },
        module_one: { label: "Parola \"modulo\" (singolare)", default: "module" },
        module_many: { label: "Parola \"moduli\" (plurale)", default: "modules" },
        config_1: { label: "Configurazione con 1 modulo", default: "Standalone unit" },
        config_4: { label: "Configurazione fino a 4 moduli", default: "Vertical bank" },
        config_8: { label: "Configurazione fino a 8 moduli", default: "Dual-bank array" },
        config_more: { label: "Configurazione oltre 8 moduli", default: "Custom large array" },
        footprint_word: { label: "Parola dopo i m² nel risultato", default: "footprint" },
        status_online: { label: "Barra di stato — banco attivo", default: "BANK ONLINE" },
        status_module: { label: "Barra di stato — MODULE (singolare)", default: "MODULE" },
        status_modules: { label: "Barra di stato — MODULES (plurale)", default: "MODULES" },
        status_redundant: { label: "Barra di stato — con ridondanza", default: "N+1 READY" },
        status_base: { label: "Barra di stato — senza ridondanza", default: "BASELOAD" },
        metric_heat: { label: "Metrica — carico termico", default: "Estimated heat load" },
        metric_capacity: { label: "Metrica — capacità effettiva", default: "Effective capacity" },
        metric_derated: { label: "Metrica — potenza declassata per modulo", default: "Per-module derated" },
        metric_headroom: { label: "Metrica — margine", default: "Headroom" },
        note: {
          label: "Nota sotto i risultati (testo libero: non si aggiorna da solo coi coefficienti)",
          default:
            "Indicative figures. Derate factors: ambient +10 °C ≈ −5 to −7%, altitude > 2000 m ≈ −8%. Final sizing is confirmed by Enfrio engineering on actual platform data.",
          type: "textarea",
        },
        cta: { label: "Pulsante invio configurazione", default: "Send this configuration to Enfrio engineering →" },
        share: { label: "Pulsante condividi", default: "Save & share configuration" },
        share_copied: { label: "Condividi — link copiato", default: "✓ Link copied" },
        share_error: { label: "Condividi — errore", default: "Copy failed — try again" },
      },
    },
  },
} satisfies PageDef;

// Quote request from the configurator (proposal KW-2026-002, A.5): the drawer
// that sends the sized build to Enfrio, the confirmation, the PDF summary and
// the email the requester receives. Field labels, timeline options, consent
// and error messages are shared with the contact form ("Form contatti ›").
// {ref} = request reference, {email} = requester's email, {company} = requester's company.
export const QUOTE = {
  id: "quote",
  sections: {
    drawer: {
      group: "M Tower › Richiesta d'offerta — pannello",
      blocks: {
        kicker: { label: "Occhiello", default: "REQUEST A QUOTE" },
        title: { label: "Titolo", default: "Send this build to Enfrio engineering" },
        lead: {
          label: "Testo sotto il titolo",
          default: "Your configuration travels with the request. Our engineers check it against real platform data and reply with a sized offer.",
          type: "textarea",
        },
        build_label: { label: "Riepilogo configurazione — titolo", default: "YOUR CONFIGURATION" },
        edit: { label: "Link per tornare a modificare la configurazione", default: "Edit" },
        close: { label: "Pulsante chiudi (letto dagli screen reader)", default: "Close" },
        location: { label: "Campo luogo del progetto", default: "Project location" },
        location_placeholder: { label: "Suggerimento nel campo luogo", default: "City, country" },
        notes: { label: "Campo note", default: "Notes for engineering" },
        notes_placeholder: {
          label: "Suggerimento nel campo note",
          default: "Engine model, installation constraints, delivery milestones...",
          type: "textarea",
        },
        email_note: {
          label: "Nota sopra il pulsante (PDF via email)",
          default: "You will receive a PDF summary of this configuration at your work email.",
          type: "textarea",
        },
        submit: { label: "Pulsante invia", default: "Send request" },
        sending: { label: "Pulsante durante l'invio", default: "Sending..." },
        config_invalid: {
          label: "Errore: configurazione non valida",
          default: "This configuration can't be sent. Reload the page and try again.",
          type: "textarea",
        },
      },
    },
    done: {
      group: "M Tower › Richiesta d'offerta — conferma",
      blocks: {
        kicker: { label: "Occhiello", default: "REQUEST SENT" },
        title: { label: "Titolo", default: "Your build is with Enfrio engineering." },
        ref_label: { label: "Etichetta del numero di riferimento", default: "Reference" },
        emailed: {
          label: "Testo se il PDF è partito per email ({email})",
          default: "A PDF summary is on its way to {email}. We will reply to the same address.",
          type: "textarea",
        },
        not_emailed: {
          label: "Testo se il PDF non è partito per email ({email})",
          default: "We will reply to {email}. Download the PDF summary of your configuration here.",
          type: "textarea",
        },
        download: { label: "Pulsante scarica PDF", default: "Download PDF summary" },
        back: { label: "Pulsante torna al configuratore", default: "Back to the configurator" },
      },
    },
    pdf: {
      group: "M Tower › Richiesta d'offerta — PDF di riepilogo",
      blocks: {
        title: { label: "Titolo del PDF", default: "M Tower configuration summary" },
        ref_label: { label: "Etichetta riferimento", default: "Reference" },
        date_label: { label: "Etichetta data", default: "Date" },
        inputs_title: { label: "Titolo dati di progetto", default: "Design inputs" },
        results_title: { label: "Titolo risultato", default: "Sized build" },
        units_label: { label: "Scritta accanto al numero di moduli", default: "M Tower modules" },
        spare: { label: "Nota sul modulo di riserva (N+1)", default: "incl. 1 spare module" },
        disclaimer: {
          label: "Avvertenza (valore orientativo, art. 4 del contratto)",
          default:
            "Indicative sizing calculated by the configurator on www.enfrio.it with provisional coefficients. It is not an offer: final sizing is confirmed by Enfrio engineering on actual platform data.",
          type: "textarea",
        },
        next_title: { label: "Prossimi passi — titolo", default: "What happens next" },
        next_text: {
          label: "Prossimi passi — testo",
          default: "Enfrio engineering reviews your configuration and replies with a sized offer to the email address you provided.",
          type: "textarea",
        },
        filename: { label: "Nome del file PDF (senza .pdf; si aggiunge il riferimento)", default: "Enfrio-M-Tower" },
      },
    },
    email: {
      group: "M Tower › Richiesta d'offerta — email al richiedente",
      blocks: {
        subject: { label: "Oggetto ({ref})", default: "Your M Tower configuration {ref} — Enfrio" },
        text: {
          label: "Testo ({ref}); il PDF è allegato",
          default:
            "Thank you for your request.\n\nAttached is the summary of the M Tower configuration you sent us (reference {ref}). Enfrio engineering will review it and reply to this address.\n\nEnfrio Srl",
          type: "textarea",
        },
      },
    },
    notify: {
      group: "M Tower › Richiesta d'offerta — avviso a Enfrio",
      blocks: {
        subject: { label: "Oggetto dell'email a Enfrio ({ref}, {company})", default: "M Tower quote request {ref} — {company}" },
      },
    },
  },
} satisfies PageDef;
