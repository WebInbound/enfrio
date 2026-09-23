import type { PageDef } from "./types";

// Blocks shared by every page: menu, footer, company data, documents,
// site-wide images and default SEO.
export const GLOBAL = {
  id: "global",
  sections: {
    company: {
      group: "Globale › Dati aziendali",
      blocks: {
        name: { label: "Ragione sociale", default: "Enfrio Srl" },
        street: { label: "Indirizzo sede (via e numero)", default: "Via Cascina Nuova 27" },
        postal_code: { label: "CAP", default: "13875" },
        city: { label: "Comune", default: "Ponderano" },
        province: { label: "Provincia (sigla)", default: "BI" },
        country: { label: "Paese (come appare sul sito)", default: "Italy" },
        vat: { label: "Partita IVA (con prefisso IT)", default: "IT02553940020" },
        vat_label: { label: "Etichetta davanti alla partita IVA (footer, contatti, privacy)", default: "VAT:" },
        email: { label: "Email aziendale (contatti, privacy, QHSE)", default: "info@enfrio.eu", type: "email" },
        phone: {
          label: "Telefono per i motori di ricerca (dati strutturati; vuoto = non indicato)",
          default: "",
          type: "tel",
        },
        social_links: {
          label: "Profili social per i motori di ricerca (un URL per riga; vuoto = nessuno)",
          default: "",
          type: "textarea",
        },
        description: {
          label: "Descrizione azienda per i motori di ricerca (dati strutturati)",
          default:
            "Italian manufacturer of aluminium engine cooling systems for power generation and datacenter applications.",
          type: "textarea",
        },
      },
    },
    documents: {
      group: "Globale › Documenti",
      blocks: {
        iso_certificate_url: {
          label: "Certificato ISO (link al PDF)",
          default: "/assets/certificazioneiso.pdf",
          type: "url",
        },
        mtower_datasheet_url: {
          label: "Scheda tecnica M Tower (link al PDF; vuoto = pulsante disattivato)",
          default: "",
          type: "url",
        },
      },
    },
    images: {
      group: "Globale › Immagini",
      blocks: {
        logo: { label: "Logo Enfrio (menu)", default: "/assets/images/logo-enfrio.png", type: "image" },
        logo_alt: { label: "Logo — testo alternativo", default: "Enfrio logo" },
        mtower_render: {
          label: "Render M Tower (PNG scontornato, verticale ~500×870): home, configuratore, pagina M Tower",
          default: "/assets/images/site/mtower-render.png",
          type: "image",
        },
      },
    },
    nav: {
      group: "Globale › Menu",
      blocks: {
        home: { label: "Menu: Home", default: "Home" },
        solutions: { label: "Menu: Solutions", default: "Solutions" },
        technology: { label: "Menu: Technology", default: "Technology" },
        tower_m: { label: "Menu: M Tower", default: "M Tower" },
        industries: { label: "Menu: Industries", default: "Industries" },
        projects: { label: "Menu: Projects", default: "Projects" },
        company: { label: "Menu: Company", default: "Company" },
        contact: { label: "Menu: Contact", default: "Contact" },
      },
    },
    footer: {
      group: "Globale › Footer",
      blocks: {
        tagline: { label: "Frase sotto il nome azienda", default: "Engine cooling for Power Generation and Datacenter." },
        hq_title: { label: "Titolo colonna sede", default: "Headquarters" },
        contact_title: { label: "Titolo colonna contatti", default: "Contact" },
        contact_link: { label: "Link alla pagina contatti", default: "Request a project call" },
        compliance_title: { label: "Titolo colonna documenti", default: "Compliance" },
        iso_link: { label: "Link certificato ISO", default: "ISO Certificate" },
        privacy_link: { label: "Link privacy", default: "Privacy & Cookies" },
        qhse_link: { label: "Link politica QHSE", default: "QHSE Policy" },
        copyright: { label: "Copyright ({year} = anno corrente)", default: "© {year} Enfrio Srl. All rights reserved." },
      },
    },
    seo: {
      group: "SEO",
      blocks: {
        default_title: {
          label: "Sito — titolo predefinito e titolo per la condivisione social",
          default: "Enfrio | Cooling Engineered to Perform",
        },
        default_description: {
          label: "Sito — descrizione predefinita",
          default:
            "Enfrio designs and manufactures aluminium engine cooling systems for power generation and datacenter applications — 5P delivery model from concept to serial production.",
          type: "textarea",
        },
        social_description: {
          label: "Sito — descrizione per la condivisione social (home)",
          default:
            "Aluminium engine cooling systems for power generation and datacenter — modular, scalable, mission-critical.",
          type: "textarea",
        },
        keywords: {
          label: "Sito — parole chiave (separate da virgola)",
          default:
            "engine cooling, power generation cooling, datacenter cooling, M Tower, modular heat rejection, aluminium radiators, Enfrio",
          type: "textarea",
        },
        og_image: {
          label: "Immagine per la condivisione social (1536×1024)",
          default: "/assets/images/site/hero-main.jpg",
          type: "image",
        },
        og_image_alt: {
          label: "Immagine social — testo alternativo",
          default: "Enfrio — engineering aluminium cooling systems",
        },
      },
    },
  },
} satisfies PageDef;

export const NOT_FOUND = {
  id: "notfound",
  sections: {
    main: {
      group: "Pagina 404",
      blocks: {
        kicker: { label: "Occhiello", default: "404" },
        title: { label: "Titolo", default: "We couldn't find that page." },
        text: {
          label: "Testo",
          default:
            "The link may be outdated, or the page may have moved. From here you can head back to the home page, explore our flagship M Tower platform, or get in touch with the Enfrio team.",
          type: "textarea",
        },
        cta_home: { label: "Pulsante: torna alla home", default: "Back to home" },
        cta_mtower: { label: "Pulsante: M Tower", default: "Explore M Tower" },
        cta_contact: { label: "Pulsante: contatti", default: "Talk to us" },
        seo_title: { label: "Titolo della pagina (scheda del browser)", default: "Page not found | Enfrio" },
        seo_description: {
          label: "Descrizione della pagina",
          default: "The page you were looking for doesn't exist on enfrio.it.",
        },
      },
    },
  },
} satisfies PageDef;
