import type { PageDef } from "./types";

export const SOLUTIONS = {
  id: "solutions",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Solutions — titolo pagina", default: "Enfrio Solutions | 5P Execution and Cooling Systems" },
        description: {
          label: "Solutions — descrizione per Google",
          default:
            "Enfrio business solutions across project management, engineering, process definition, procurement and production transfer.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Solutions › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "SOLUTIONS" },
        title: { label: "Titolo principale", default: "Commercial clarity with industrial execution depth.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "Enfrio combines engineering consulting, technology, and process outsourcing in one scalable delivery model for cooling-intensive platforms.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/installed-v20-integrated.jpg", type: "image" },
        image_alt: {
          label: "Foto di apertura — testo alternativo",
          default: "Integrated Enfrio cooling package mounted on a finished engine",
        },
      },
    },
    offer: {
      group: "Solutions › 2. Offerta",
      blocks: {
        card1_title: { label: "Scheda 1 — titolo", default: "Industrial Cooling Systems" },
        card1_text: {
          label: "Scheda 1 — testo",
          default: "Water radiators, oil coolers, fuel coolers and charge air coolers configured for application-specific duty cycles.",
          type: "textarea",
        },
        card2_title: { label: "Scheda 2 — titolo", default: "OEM Cooling Solutions" },
        card2_text: {
          label: "Scheda 2 — testo",
          default: "Custom architecture engineered for footprint constraints, serviceability, and repeatable manufacturing performance.",
          type: "textarea",
        },
        card3_title: { label: "Scheda 3 — titolo", default: "Energy-Efficient Thermal Packages" },
        card3_text: {
          label: "Scheda 3 — testo",
          default: "High-efficiency cores, optimized fan power and low-noise integration for cost-effective operation.",
          type: "textarea",
        },
      },
    },
    execution: {
      group: "Solutions › 3. Esecuzione 5P",
      blocks: {
        kicker: { label: "Occhiello", default: "5P EXECUTION" },
        title: { label: "Titolo", default: "One integrated model from project governance to production transfer.", type: "textarea" },
        panel1_title: { label: "Riquadro 1 — titolo", default: "Project + Product" },
        panel1_item1: { label: "Riquadro 1 — punto 1", default: "Program governance and phase-gate control" },
        panel1_item2: { label: "Riquadro 1 — punto 2", default: "Thermal sizing and packaging engineering" },
        panel1_item3: { label: "Riquadro 1 — punto 3", default: "Design aligned to manufacturability" },
        panel2_title: { label: "Riquadro 2 — titolo", default: "Process + Procurement + Transfer" },
        panel2_item1: { label: "Riquadro 2 — punto 1", default: "Industrial process definition and validation loops" },
        panel2_item2: { label: "Riquadro 2 — punto 2", default: "Supplier coordination on critical components" },
        panel2_item3: { label: "Riquadro 2 — punto 3", default: "Controlled ramp-up and production stabilization" },
      },
    },
    variants: {
      group: "Solutions › 4. Varianti (foto)",
      blocks: {
        kicker: { label: "Occhiello", default: "SOLUTION VARIANTS" },
        title: { label: "Titolo", default: "One main architecture, adapted to multiple installation contexts.", type: "textarea" },
        photo_main: { label: "Foto grande", default: "/assets/images/site/installed-v20-integrated.jpg", type: "image" },
        photo_main_alt: { label: "Foto grande — testo alternativo", default: "V20 engine with integrated Enfrio cooling package" },
        photo_2: { label: "Foto 2", default: "/assets/images/site/installed-baudouin-canopy.jpg", type: "image" },
        photo_2_alt: { label: "Foto 2 — testo alternativo", default: "Cooling unit installed in a genset open canopy" },
        photo_3: { label: "Foto 3", default: "/assets/images/site/rad-40ng.jpg", type: "image" },
        photo_3_alt: { label: "Foto 3 — testo alternativo", default: "Genset with Enfrio container-fit cooling package" },
        photo_4: { label: "Foto 4", default: "/assets/images/site/rad-warehouse-stock.jpg", type: "image" },
        photo_4_alt: { label: "Foto 4 — testo alternativo", default: "Finished Enfrio cooling units staged on warehouse racks" },
      },
    },
    cta: {
      group: "Solutions › 5. Invito finale",
      blocks: {
        kicker: { label: "Occhiello", default: "COMMERCIAL NEXT STEP" },
        title: { label: "Titolo", default: "Share your requirements and receive a practical execution scope.", type: "textarea" },
        text: {
          label: "Testo",
          default: "We can start from concept notes or existing technical data and build a phased delivery roadmap.",
          type: "textarea",
        },
        button: { label: "Pulsante (va a Contatti)", default: "Start solution scoping" },
      },
    },
  },
} satisfies PageDef;
