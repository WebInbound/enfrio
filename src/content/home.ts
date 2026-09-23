import type { PageDef } from "./types";

export const HOME = {
  id: "home",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Home — titolo pagina (Google e scheda del browser)", default: "Enfrio | Cooling Engineered to Perform" },
        description: {
          label: "Home — descrizione per Google",
          default:
            "Enfrio designs products, processes and tests for cooling engines with end-to-end engineering and manufacturing support.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Home › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "ENGINEER LEADERS" },
        title: { label: "Titolo principale", default: "We de-risk thermal performance for mission-critical engines.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "From bid phase to production transfer, Enfrio runs the full execution chain so your teams hit launch windows, cost targets and field reliability.",
          type: "textarea",
        },
        cta_primary: { label: "Pulsante principale (va a Contatti)", default: "Request executive call" },
        cta_secondary: { label: "Pulsante secondario (va a Solutions)", default: "Explore 5P solutions" },
        image: { label: "Foto di apertura", default: "/assets/images/site/hero-main.jpg", type: "image" },
        image_alt: { label: "Foto di apertura — testo alternativo", default: "Enfrio technician welding radiator" },
      },
    },
    model: {
      group: "Home › 2. Modello end-to-end",
      blocks: {
        kicker: { label: "Occhiello", default: "END-TO-END MODEL" },
        title: { label: "Titolo", default: "One accountable partner from concept freeze to stable serial output.", type: "textarea" },
        stat1_value: { label: "Riquadro 1 — valore", default: "5P" },
        stat1_text: {
          label: "Riquadro 1 — testo",
          default: "Project Management, Product Design Engineering, Process Definition, Procurement, Production Transfers.",
          type: "textarea",
        },
        stat2_value: { label: "Riquadro 2 — valore (numero animato + unità, es. 12000 kW)", default: "12000 kW" },
        stat2_text: {
          label: "Riquadro 2 — testo",
          default: "Heat rejection per M Tower bank — modular, scalable, datacenter-ready.",
          type: "textarea",
        },
        stat3_value: { label: "Riquadro 3 — valore", default: "24/7" },
        stat3_text: {
          label: "Riquadro 3 — testo",
          default: "Focus on uptime, durability and thermal stability in demanding environments.",
          type: "textarea",
        },
      },
    },
    inside: {
      group: "Home › 3. Dentro Enfrio (foto)",
      blocks: {
        kicker: { label: "Occhiello", default: "INSIDE ENFRIO" },
        title: { label: "Titolo", default: "Real engineering. Real manufacturing. Real delivery discipline.", type: "textarea" },
        photo_main: { label: "Foto grande", default: "/assets/images/site/prod-line.jpg", type: "image" },
        photo_main_alt: { label: "Foto grande — testo alternativo", default: "Enfrio production line" },
        photo_2: { label: "Foto 2", default: "/assets/images/site/tube-bending-operator.jpg", type: "image" },
        photo_2_alt: { label: "Foto 2 — testo alternativo", default: "6-axis tube bending in operation" },
        photo_3: { label: "Foto 3 (verticale)", default: "/assets/images/site/assembly-worker.jpg", type: "image" },
        photo_3_alt: { label: "Foto 3 — testo alternativo", default: "Enfrio operator at the assembly station" },
        photo_4: { label: "Foto 4", default: "/assets/images/site/rad-engine-complete.jpg", type: "image" },
        photo_4_alt: { label: "Foto 4 — testo alternativo", default: "Integrated cooling unit with engine" },
      },
    },
    domain: {
      group: "Home › 4. Ambiti di raffreddamento",
      blocks: {
        kicker: { label: "Occhiello", default: "COOLING DOMAIN" },
        title: { label: "Titolo", default: "High-performance cooling architecture for critical industrial platforms.", type: "textarea" },
        card1_title: { label: "Scheda 1 — titolo", default: "Engine Cooling" },
        card1_text: { label: "Scheda 1 — testo", default: "Aluminium radiator systems with robust heat rejection and field durability.", type: "textarea" },
        card2_title: { label: "Scheda 2 — titolo", default: "Thermal Subsystems" },
        card2_text: {
          label: "Scheda 2 — testo",
          default: "Oil coolers, fuel coolers, charge air coolers and climate condensers engineered for duty cycles.",
          type: "textarea",
        },
        card3_title: { label: "Scheda 3 — titolo", default: "Custom Integration" },
        card3_text: {
          label: "Scheda 3 — testo",
          default: "Packaging logic for container constraints, remote environments and OEM installation envelopes.",
          type: "textarea",
        },
      },
    },
    spotlight: {
      group: "Home › 5. M Tower in evidenza",
      blocks: {
        kicker: { label: "Occhiello", default: "FLAGSHIP PRODUCT" },
        title: { label: "Titolo", default: "M Tower: cooling that scales as your power grows.", type: "textarea" },
        text_start: { label: "Testo — inizio (prima del numero animato)", default: "Modular heat-rejection units of" },
        text_stat: { label: "Testo — numero animato in grassetto (es. 1500 kW)", default: "1500 kW" },
        text_middle: {
          label: "Testo — parte centrale",
          default: "each. Start with one, add more as the plant scales. From a 1.5 MW genset to a",
          type: "textarea",
        },
        text_bold: { label: "Testo — parola in grassetto", default: "12 MW" },
        text_end: {
          label: "Testo — fine",
          default: "datacenter hall — same proven core, same hydraulic interface, same control logic.",
          type: "textarea",
        },
        check1: { label: "Punto elenco 1", default: "1 → 8 unit configurations, vertical or horizontal" },
        check2: { label: "Punto elenco 2", default: "Inverter-ready variable cooling on every fan stage" },
        check3: { label: "Punto elenco 3", default: "ATEX-ready and sea-water options available" },
        check4: { label: "Punto elenco 4", default: "Container-fit logic for fast field deployment" },
        cta_primary: { label: "Pulsante principale (va a M Tower)", default: "Explore M Tower" },
        cta_secondary: { label: "Pulsante secondario (va al configuratore)", default: "Size your installation" },
        image_alt: { label: "Render M Tower — testo alternativo", default: "Enfrio M Tower module — canonical product render" },
      },
    },
    motion: {
      group: "Home › 6. Capacità in movimento",
      blocks: {
        kicker: { label: "Occhiello", default: "CAPABILITY IN MOTION" },
        title: { label: "Titolo", default: "Three real moments that auto-cycle through Enfrio execution flow.", type: "textarea" },
        item1_title: { label: "Momento 1 — titolo", default: "Fabrication Precision" },
        item1_text: { label: "Momento 1 — testo", default: "Controlled welding and joining quality on heat-critical assemblies.", type: "textarea" },
        item1_image: { label: "Momento 1 — foto", default: "/assets/images/site/welder-action.jpg", type: "image" },
        item1_image_alt: {
          label: "Momento 1 — foto, testo alternativo",
          default: "Enfrio operator welding a radiator core in front of the company logo",
        },
        item2_title: { label: "Momento 2 — titolo", default: "Advanced Machinery" },
        item2_text: {
          label: "Momento 2 — testo",
          default: "Bending and laser operations designed for repeatable industrial throughput.",
          type: "textarea",
        },
        item2_image: { label: "Momento 2 — foto", default: "/assets/images/site/tube-bending-operator.jpg", type: "image" },
        item2_image_alt: { label: "Momento 2 — foto, testo alternativo", default: "Operator at the 6-axis tube bending machine" },
        item3_title: { label: "Momento 3 — titolo", default: "Hands-on Quality" },
        item3_text: {
          label: "Momento 3 — testo",
          default: "Hand-finished detail work on every cooling unit before it leaves the line.",
          type: "textarea",
        },
        item3_image: { label: "Momento 3 — foto", default: "/assets/images/site/handwork-detail.jpg", type: "image" },
        item3_image_alt: { label: "Momento 3 — foto, testo alternativo", default: "Final hand assembly detail on a cooling unit" },
      },
    },
    cta: {
      group: "Home › 7. Invito finale",
      blocks: {
        kicker: { label: "Occhiello", default: "BUILD WITH ENFRIO" },
        title: { label: "Titolo", default: "Need an execution partner that engineers and delivers with ownership?", type: "textarea" },
        text: {
          label: "Testo",
          default: "We design, validate and industrialize cooling systems with clear governance and measurable delivery milestones.",
          type: "textarea",
        },
        cta_primary: { label: "Pulsante principale (va a Contatti)", default: "Open strategic conversation" },
        cta_secondary: { label: "Pulsante secondario (va a Projects)", default: "View project evidence" },
      },
    },
  },
} satisfies PageDef;
