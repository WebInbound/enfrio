import type { PageDef } from "./types";

export const COMPANY = {
  id: "company",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Company — titolo pagina", default: "Enfrio Company | Team and Industrial Culture" },
        description: {
          label: "Company — descrizione per Google",
          default: "Enfrio company profile: people, expertise and production culture behind cooling solutions.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Company › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "ABOUT ENFRIO" },
        title: { label: "Titolo principale", default: "Real team, real factory, real execution accountability.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "Enfrio combines engineering leadership with production discipline to deliver cooling systems that work reliably in real operating conditions.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/prod-bench.jpg", type: "image" },
        image_alt: {
          label: "Foto di apertura — testo alternativo",
          default: "Enfrio operator assembling a cooling unit at the production bench",
        },
      },
    },
    values: {
      group: "Company › 2. Valori",
      blocks: {
        card1_title: { label: "Scheda 1 — titolo", default: "Engineering DNA" },
        card1_text: {
          label: "Scheda 1 — testo",
          default: "Technical depth across thermal design, packaging and manufacturability decisions.",
          type: "textarea",
        },
        card2_title: { label: "Scheda 2 — titolo", default: "Factory Mindset" },
        card2_text: {
          label: "Scheda 2 — testo",
          default: "Hands-on production culture where process quality is treated as a product itself.",
          type: "textarea",
        },
        card3_title: { label: "Scheda 3 — titolo", default: "Partner Behavior" },
        card3_text: {
          label: "Scheda 3 — testo",
          default: "Transparent communication, fast problem solving and ownership of outcomes.",
          type: "textarea",
        },
      },
    },
    method: {
      group: "Company › 3. Metodo di lavoro",
      blocks: {
        kicker: { label: "Occhiello", default: "WORKING METHOD" },
        title: { label: "Titolo", default: "Execution principles that keep complex programs under control.", type: "textarea" },
        step1: {
          label: "Passo 01",
          default: "Align objectives, constraints and measurable performance targets with customer teams.",
          type: "textarea",
        },
        step2: {
          label: "Passo 02",
          default: "Engineer robust thermal architecture balancing performance, footprint and serviceability.",
          type: "textarea",
        },
        step3: {
          label: "Passo 03",
          default: "Industrialize through process controls, supplier alignment and quality checkpoints.",
          type: "textarea",
        },
        step4: {
          label: "Passo 04",
          default: "Support transfer, ramp-up and stabilization with direct accountability on delivery.",
          type: "textarea",
        },
      },
    },
    photos: {
      group: "Company › 4. Foto",
      blocks: {
        photo_main: { label: "Foto grande", default: "/assets/images/site/prod-assembly-b.jpg", type: "image" },
        photo_main_alt: { label: "Foto grande — testo alternativo", default: "Factory assembly operation" },
        photo_2: { label: "Foto 2", default: "/assets/images/site/welder-action.jpg", type: "image" },
        photo_2_alt: { label: "Foto 2 — testo alternativo", default: "Welder finishing a radiator core in front of the Enfrio logo" },
        photo_3: { label: "Foto 3", default: "/assets/images/site/assembly-worker.jpg", type: "image" },
        photo_3_alt: { label: "Foto 3 — testo alternativo", default: "Operator preparing components at the assembly station" },
        photo_4: { label: "Foto 4", default: "/assets/images/site/handwork-detail.jpg", type: "image" },
        photo_4_alt: { label: "Foto 4 — testo alternativo", default: "Hand-finishing detail on a cooling unit" },
      },
    },
    cta: {
      group: "Company › 5. Invito finale",
      blocks: {
        kicker: { label: "Occhiello", default: "COLLABORATE" },
        title: { label: "Titolo", default: "Looking for a team that owns outcomes, not only tasks?", type: "textarea" },
        button: { label: "Pulsante (va a Contatti)", default: "Book leadership intro" },
      },
    },
  },
} satisfies PageDef;
