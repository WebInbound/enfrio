import type { PageDef } from "./types";

export const PROJECTS_PAGE = {
  id: "projects",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Projects — titolo pagina", default: "Enfrio Projects | Applied Industrial Credibility" },
        description: {
          label: "Projects — descrizione per Google",
          default: "Selected Enfrio projects and references demonstrating technical delivery in real contexts.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Projects › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "PROJECT EVIDENCE" },
        title: {
          label: "Titolo principale (le referenze sono nell'elenco \"Projects — referenze\")",
          default: "Applied credibility from real manufacturing and deployment contexts.",
          type: "textarea",
        },
        lead: {
          label: "Testo introduttivo",
          default:
            "These selected references show how Enfrio translates thermal complexity into execution-ready industrial solutions.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/installed-baudouin-canopy.jpg", type: "image" },
        image_alt: {
          label: "Foto di apertura — testo alternativo",
          default: "Genset with Enfrio cooling installed inside an open canopy enclosure",
        },
      },
    },
    platform: {
      group: "Projects › 2. Piattaforma M Tower",
      blocks: {
        kicker: { label: "Occhiello", default: "SPECIAL PLATFORM" },
        title: { label: "Titolo", default: "M Tower modular capacity for large-scale heat rejection.", type: "textarea" },
        perf_title: { label: "Riquadro prestazioni — titolo", default: "Performance Envelope" },
        perf_item1: { label: "Riquadro prestazioni — punto 1", default: "1 unit: 1500 kW heat rejection" },
        perf_item2: { label: "Riquadro prestazioni — punto 2", default: "4 units: 6000 kW heat rejection" },
        perf_item3: { label: "Riquadro prestazioni — punto 3", default: "8 units: 12000 kW heat rejection" },
        options_title: { label: "Riquadro opzioni — titolo", default: "Configuration Options" },
        options_item1: { label: "Riquadro opzioni — punto 1", default: "Vertical or horizontal installation" },
        options_item2: { label: "Riquadro opzioni — punto 2", default: "Variable cooling with inverter logic" },
        options_item3: { label: "Riquadro opzioni — punto 3", default: "Sea-water corrosion resistance and ATEX options" },
        options_button: { label: "Pulsante (va a M Tower)", default: "Open M Tower page" },
      },
    },
    flow: {
      group: "Projects › 3. Sequenza progetti",
      blocks: {
        kicker: { label: "Occhiello", default: "PROJECT FLOW" },
        title: { label: "Titolo", default: "Applied credibility shown in an auto-advancing sequence.", type: "textarea" },
        item1_title: { label: "Momento 1 — titolo", default: "Market Visibility" },
        item1_text: {
          label: "Momento 1 — testo",
          default: "International presence that reinforces partner trust and technical positioning.",
          type: "textarea",
        },
        item1_image: { label: "Momento 1 — foto", default: "/assets/images/site/fair-dubai-2.jpg", type: "image" },
        item1_image_alt: {
          label: "Momento 1 — foto, testo alternativo",
          default: "Enfrio exhibition stand with cooling units on display at an energy trade show in Dubai",
        },
        item2_title: { label: "Momento 2 — titolo", default: "Installed Reality" },
        item2_text: {
          label: "Momento 2 — testo",
          default: "Configured systems adapted to real-world space and duty-cycle constraints.",
          type: "textarea",
        },
        item2_image: { label: "Momento 2 — foto", default: "/assets/images/site/installed-baudouin-canopy.jpg", type: "image" },
        item2_image_alt: { label: "Momento 2 — foto, testo alternativo", default: "Enfrio cooling package installed in finished canopy" },
        item3_title: { label: "Momento 3 — titolo", default: "Execution Closure" },
        item3_text: {
          label: "Momento 3 — testo",
          default: "Factory output translated into disciplined logistics and on-time dispatch.",
          type: "textarea",
        },
        item3_image: { label: "Momento 3 — foto", default: "/assets/images/site/rad-truck-load.jpg", type: "image" },
        item3_image_alt: { label: "Momento 3 — foto, testo alternativo", default: "Enfrio cooling unit being loaded onto a delivery truck" },
      },
    },
    snapshots: {
      group: "Projects › 4. Istantanee",
      blocks: {
        kicker: { label: "Occhiello", default: "PROJECT SNAPSHOTS" },
        title: {
          label: "Titolo (le foto sono nell'elenco \"Projects — galleria istantanee\")",
          default: "Supporting visuals from fairs, delivery contexts and installed families.",
          type: "textarea",
        },
      },
    },
    closing: {
      group: "Projects › 5. Certificazione e contatto",
      blocks: {
        iso_kicker: { label: "Riquadro ISO — occhiello", default: "QUALITY PROOF" },
        iso_title: { label: "Riquadro ISO — titolo", default: "ISO Certification" },
        iso_text: {
          label: "Riquadro ISO — testo",
          default: "Official certification is available for vendor qualification and procurement processes.",
          type: "textarea",
        },
        iso_button: { label: "Riquadro ISO — pulsante", default: "Open ISO Certificate" },
        contact_kicker: { label: "Riquadro contatto — occhiello", default: "COMMERCIAL NEXT" },
        contact_title: { label: "Riquadro contatto — titolo", default: "Discuss your program" },
        contact_text: {
          label: "Riquadro contatto — testo",
          default: "Share your constraints and timeline to evaluate feasibility, risk and deployment options.",
          type: "textarea",
        },
        contact_button: { label: "Riquadro contatto — pulsante (va a Contatti)", default: "Start project review" },
      },
    },
  },
} satisfies PageDef;
