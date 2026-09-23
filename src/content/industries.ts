import type { PageDef } from "./types";

export const INDUSTRIES = {
  id: "industries",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Industries — titolo pagina", default: "Enfrio Industries | Application Domains" },
        description: {
          label: "Industries — descrizione per Google",
          default: "Industry applications for Enfrio engine cooling solutions across power generation and datacenter sectors.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Industries › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "INDUSTRY FOCUS" },
        title: { label: "Titolo principale", default: "Sector-fit cooling platforms for high-consequence operations.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "Enfrio supports markets where thermal reliability, packaging constraints and operational uptime are commercially critical.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/installed-v20-integrated.jpg", type: "image" },
        image_alt: { label: "Foto di apertura — testo alternativo", default: "V20 engine with integrated Enfrio cooling package" },
      },
    },
    sectors: {
      group: "Industries › 2. Settori",
      blocks: {
        sector1_title: { label: "Settore 1 — titolo", default: "Power Generation" },
        sector1_text: {
          label: "Settore 1 — testo",
          default: "High-capacity thermal systems for gensets and stationary assets in mission-critical environments.",
          type: "textarea",
        },
        sector1_image: { label: "Settore 1 — foto", default: "/assets/images/site/installed-baudouin-canopy.jpg", type: "image" },
        sector1_image_alt: { label: "Settore 1 — foto, testo alternativo", default: "Genset enclosure with Enfrio cooling unit installed" },
        sector2_title: { label: "Settore 2 — titolo", default: "Datacenter" },
        sector2_text: {
          label: "Settore 2 — testo",
          default:
            "Mission-critical thermal management for high-density compute environments with demanding uptime and efficiency targets.",
          type: "textarea",
        },
        sector2_image: { label: "Settore 2 — foto", default: "/assets/images/site/rad-remote-mtu.jpg", type: "image" },
        sector2_image_alt: {
          label: "Settore 2 — foto, testo alternativo",
          default: "Outdoor Enfrio cooling installation for remote and datacenter contexts",
        },
      },
    },
    scope: {
      group: "Industries › 3. Ambito applicativo",
      blocks: {
        kicker: { label: "Occhiello", default: "APPLICATION SCOPE" },
        title: { label: "Titolo", default: "From component-level products to integrated cooling packages.", type: "textarea" },
        item1_title: { label: "Prodotto 1 — titolo", default: "Water Radiators" },
        item1_text: { label: "Prodotto 1 — testo", default: "Aluminium architecture optimized for heat rejection and durability.", type: "textarea" },
        item2_title: { label: "Prodotto 2 — titolo", default: "Oil & Fuel Coolers" },
        item2_text: { label: "Prodotto 2 — testo", default: "Stable thermal windows for reliable operation under variable load profiles.", type: "textarea" },
        item3_title: { label: "Prodotto 3 — titolo", default: "Charge Air Coolers" },
        item3_text: { label: "Prodotto 3 — testo", default: "Air-path temperature control for efficiency and engine consistency.", type: "textarea" },
        item4_title: { label: "Prodotto 4 — titolo", default: "Condensers" },
        item4_text: { label: "Prodotto 4 — testo", default: "Climate-unit heat exchange systems with corrosion and lifecycle focus.", type: "textarea" },
      },
    },
    madrid: {
      group: "Industries › 4. Caso Madrid",
      blocks: {
        kicker: { label: "Occhiello", default: "ENFRIO ORIGINAL DEVELOPMENT" },
        title: {
          label: "Titolo (le foto sono nell'elenco \"Industries — galleria camion Madrid\")",
          default: "Madrid waste collection truck cooling product, engineered by Enfrio.",
          type: "textarea",
        },
        why_title: { label: "Riquadro — titolo", default: "Why it matters" },
        why_text: {
          label: "Riquadro — testo",
          default:
            "This solution was developed by Enfrio to solve a constrained installation where a standard radiator layout would not fit the vehicle architecture.",
          type: "textarea",
        },
        why_item1: { label: "Riquadro — punto 1", default: "Custom core-box opening integrated in radiator and charge air cooler" },
        why_item2: { label: "Riquadro — punto 2", default: "Performance-preserving coolant flow management" },
        why_item3: { label: "Riquadro — punto 3", default: "Complex process execution: brazing, soldering, TIG and MIG" },
      },
    },
    cta: {
      group: "Industries › 5. Invito finale",
      blocks: {
        kicker: { label: "Occhiello", default: "INDUSTRY MATCHING" },
        title: {
          label: "Titolo",
          default: "Share your operating envelope and we will define the right thermal architecture.",
          type: "textarea",
        },
        button: { label: "Pulsante (va a Contatti)", default: "Submit your application" },
      },
    },
  },
} satisfies PageDef;
