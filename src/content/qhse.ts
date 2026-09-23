import type { PageDef } from "./types";

export const QHSE = {
  id: "qhse",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "QHSE — titolo pagina", default: "Enfrio | QHSE Policy" },
        description: {
          label: "QHSE — descrizione per Google",
          default:
            "Enfrio Quality, Health, Safety and Environment policy aligned with ISO certification requirements for engine cooling manufacturing.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "QHSE › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "QHSE POLICY" },
        title: { label: "Titolo principale", default: "Quality, Health, Safety and Environment." },
        lead: {
          label: "Testo introduttivo",
          default:
            "Enfrio Srl operates an integrated QHSE management system aligned with ISO certification requirements. This policy commits the organization to product quality, workplace safety and environmental responsibility across every cooling project we deliver.",
          type: "textarea",
        },
      },
    },
    pillars: {
      group: "QHSE › 2. Impegni",
      blocks: {
        kicker: { label: "Occhiello", default: "OUR COMMITMENTS" },
        title: {
          label: "Titolo",
          default: "Four pillars that guide every decision in the factory and on customer programs.",
          type: "textarea",
        },
        quality_title: { label: "Qualità — titolo", default: "Quality" },
        quality_1: { label: "Qualità — punto 1", default: "Compliance with applicable customer, regulatory and ISO standards" },
        quality_2: { label: "Qualità — punto 2", default: "Process control on critical operations: brazing, welding, bending, laser cutting" },
        quality_3: { label: "Qualità — punto 3", default: "Dimensional verification with Hexagon CMM and traceable measurement records" },
        quality_4: { label: "Qualità — punto 4", default: "Continuous improvement through internal audits and corrective action loops" },
        safety_title: { label: "Salute e sicurezza — titolo", default: "Health & Safety" },
        safety_1: { label: "Salute e sicurezza — punto 1", default: "Risk assessment for all manufacturing activities and worksites" },
        safety_2: { label: "Salute e sicurezza — punto 2", default: "Mandatory PPE, training and competence verification for operators" },
        safety_3: { label: "Salute e sicurezza — punto 3", default: "Incident reporting, investigation and prevention culture" },
        safety_4: { label: "Salute e sicurezza — punto 4", default: "Compliance with Italian D.Lgs. 81/2008 and applicable EU directives" },
        env_title: { label: "Ambiente — titolo", default: "Environment" },
        env_1: { label: "Ambiente — punto 1", default: "Responsible management of metal scrap, coolants and process consumables" },
        env_2: { label: "Ambiente — punto 2", default: "Energy efficiency targets on production lines and facility operations" },
        env_3: { label: "Ambiente — punto 3", default: "Waste segregation and authorized disposal partners" },
        env_4: { label: "Ambiente — punto 4", default: "Reduction of solvent and emission impact in fabrication processes" },
        trust_title: { label: "Fiducia — titolo", default: "Stakeholder Trust" },
        trust_1: { label: "Fiducia — punto 1", default: "Transparent communication with customers, suppliers and authorities" },
        trust_2: { label: "Fiducia — punto 2", default: "Supplier qualification and performance monitoring" },
        trust_3: { label: "Fiducia — punto 3", default: "Documented evidence available for vendor and audit requests" },
        trust_4: { label: "Fiducia — punto 4", default: "Regular management review of QHSE objectives and indicators" },
      },
    },
    governance: {
      group: "QHSE › 3. Governance",
      blocks: {
        kicker: { label: "Occhiello", default: "GOVERNANCE" },
        title: { label: "Titolo", default: "How the policy is operated, reviewed and improved.", type: "textarea" },
        step1: {
          label: "Passo 01",
          default: "Top management establishes QHSE objectives and allocates the resources required to achieve them.",
          type: "textarea",
        },
        step2: {
          label: "Passo 02",
          default:
            "Operational procedures and work instructions translate objectives into measurable activities on the shop floor and in engineering.",
          type: "textarea",
        },
        step3: {
          label: "Passo 03",
          default:
            "Indicators (non-conformities, near-misses, energy and waste KPIs) are tracked and reviewed periodically by the QHSE function.",
          type: "textarea",
        },
        step4: {
          label: "Passo 04",
          default:
            "Annual management review verifies adequacy, captures improvement opportunities and updates the policy when scope or context changes.",
          type: "textarea",
        },
      },
    },
    closing: {
      group: "QHSE › 4. Certificazione e contatti",
      blocks: {
        iso_kicker: { label: "Riquadro ISO — occhiello", default: "CERTIFICATION" },
        iso_title: { label: "Riquadro ISO — titolo", default: "ISO certificate available" },
        iso_text: {
          label: "Riquadro ISO — testo",
          default: "The active certification document is available for vendor qualification and procurement processes.",
          type: "textarea",
        },
        iso_button: { label: "Riquadro ISO — pulsante", default: "Open ISO Certificate" },
        contact_kicker: { label: "Riquadro contatti — occhiello", default: "CONTACT" },
        contact_title: { label: "Riquadro contatti — titolo", default: "QHSE inquiries" },
        contact_text: {
          label: "Riquadro contatti — testo (sotto compare l'email aziendale)",
          default: "For QHSE documentation, supplier qualification or audit requests:",
          type: "textarea",
        },
        note: {
          label: "Nota finale",
          default:
            "Policy issued by Enfrio Srl management. Last review aligned with current ISO certification cycle. The policy is communicated to all employees and made available to interested parties.",
          type: "textarea",
        },
      },
    },
  },
} satisfies PageDef;
