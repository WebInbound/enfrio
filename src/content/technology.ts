import type { PageDef } from "./types";

export const TECHNOLOGY = {
  id: "technology",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Technology — titolo pagina", default: "Enfrio Technology | Manufacturing and Process Capability" },
        description: {
          label: "Technology — descrizione per Google",
          default: "Advanced machinery, fabrication control and process technology for industrial cooling systems.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Technology › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "PROCESS EXCELLENCE" },
        title: { label: "Titolo principale", default: "Real process control from machine setup to validated output.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "Technology at Enfrio is built around repeatability: controlled process windows, traceable checks and reliable industrial throughput.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/laser-operator-jq.jpg", type: "image" },
        image_alt: {
          label: "Foto di apertura — testo alternativo",
          default: "Operator running the JQ laser cutting machine on Enfrio production line",
        },
      },
    },
    flow: {
      group: "Technology › 2. Flusso di capacità",
      blocks: {
        kicker: { label: "Occhiello", default: "CAPABILITY FLOW" },
        title: { label: "Titolo", default: "Technology → fabrication → assembly → quality.", type: "textarea" },
        step1_title: { label: "Fase 1 — titolo", default: "6-Axis Tube Bending" },
        step1_text: {
          label: "Fase 1 — testo",
          default: "New 6-axis bending cell for stainless tubes up to key best-seller standards, supporting compact and complex routing.",
          type: "textarea",
        },
        step1_image: { label: "Fase 1 — foto", default: "/assets/images/site/tube-bending-operator.jpg", type: "image" },
        step1_image_alt: { label: "Fase 1 — foto, testo alternativo", default: "6-axis tube bending machine in operation" },
        step2_title: { label: "Fase 2 — titolo", default: "Laser Tube Cutting" },
        step2_text: {
          label: "Fase 2 — testo",
          default: "Dedicated laser operations for radiator components, expansion tanks and structural motor fixation frames.",
          type: "textarea",
        },
        step2_image: { label: "Fase 2 — foto", default: "/assets/images/site/mach-laser-d.jpg", type: "image" },
        step2_image_alt: { label: "Fase 2 — foto, testo alternativo", default: "Laser machine detail" },
        step3_title: { label: "Fase 3 — titolo", default: "Hexagon + 3D Routines" },
        step3_text: {
          label: "Fase 3 — testo",
          default: "3D Catia and PLM routines linked with Hexagon CMM to secure dimensional control across bending and laser workflows.",
          type: "textarea",
        },
        step3_image: { label: "Fase 3 — foto", default: "/assets/images/site/quality-hexagon-a.jpg", type: "image" },
        step3_image_alt: { label: "Fase 3 — foto, testo alternativo", default: "Hexagon quality control" },
        step4_title: { label: "Fase 4 — titolo", default: "Controlled Assembly Execution" },
        step4_text: {
          label: "Fase 4 — testo",
          default: "Final assembly is driven by repeatable process logic, traceability checkpoints and serial-readiness criteria.",
          type: "textarea",
        },
        step4_image: { label: "Fase 4 — foto", default: "/assets/images/site/handwork-detail.jpg", type: "image" },
        step4_image_alt: { label: "Fase 4 — foto, testo alternativo", default: "Operator hand-finishing a finished cooling unit" },
      },
    },
    machinery: {
      group: "Technology › 3. Dettaglio macchinari",
      blocks: {
        kicker: { label: "Occhiello", default: "MACHINERY DETAIL" },
        title: { label: "Titolo (le foto sono nell'elenco \"Technology — galleria macchinari\")", default: "Selected visual evidence from active process lines.", type: "textarea" },
      },
    },
    cta: {
      group: "Technology › 4. Invito finale",
      blocks: {
        kicker: { label: "Occhiello", default: "TECHNICAL DEEP DIVE" },
        title: { label: "Titolo", default: "Need to align our process capability with your platform?", type: "textarea" },
        text: {
          label: "Testo",
          default: "Book a deep-dive call to walk through bending tolerances, laser parameters and quality routines on your application.",
          type: "textarea",
        },
        button: { label: "Pulsante (va a Contatti)", default: "Book technical deep dive" },
      },
    },
  },
} satisfies PageDef;
