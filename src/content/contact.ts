import type { PageDef } from "./types";

export const CONTACT = {
  id: "contact",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Contact — titolo pagina", default: "Contact Enfrio | Start Your Cooling Project" },
        description: {
          label: "Contact — descrizione per Google",
          default: "Contact Enfrio to discuss engine cooling projects, technical requirements and production transfer plans.",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Contact › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "CONTACT" },
        title: { label: "Titolo principale", default: "Turn your cooling challenge into an execution-ready plan.", type: "textarea" },
        lead: {
          label: "Testo introduttivo",
          default:
            "Share platform data, thermal targets and timeline. Enfrio can support from concept engineering to full production transfer.",
          type: "textarea",
        },
        image: { label: "Foto di apertura", default: "/assets/images/site/quality-hexagon-b.jpg", type: "image" },
        image_alt: { label: "Foto di apertura — testo alternativo", default: "Quality check detail" },
      },
    },
    inquiry: {
      group: "Contact › 2. Richiesta progetto",
      blocks: {
        kicker: { label: "Occhiello", default: "PROJECT INQUIRY" },
        title: { label: "Titolo", default: "Tell us about your platform." },
        text: {
          label: "Testo sopra il modulo",
          default:
            "Fill in the form and an Enfrio engineer will reply within one business day. For procurement documentation requests please mention it in the message field.",
          type: "textarea",
        },
        loading: { label: "Testo mentre il modulo si carica", default: "Loading form..." },
      },
    },
    side: {
      group: "Contact › 3. Colonna laterale",
      blocks: {
        direct_title: { label: "Contatto diretto — titolo", default: "Direct contact" },
        direct_text: { label: "Contatto diretto — testo (sotto compare l'email aziendale)", default: "Prefer to write to us directly?" },
        hq_title: { label: "Sede — titolo (indirizzo e P.IVA da \"Dati aziendali\")", default: "Headquarters" },
        share_title: { label: "Cosa condividere — titolo", default: "What to share" },
        share_item1: { label: "Cosa condividere — punto 1", default: "Engine model and power class" },
        share_item2: { label: "Cosa condividere — punto 2", default: "Heat rejection target (kW)" },
        share_item3: { label: "Cosa condividere — punto 3", default: "Installation context and constraints" },
        share_item4: { label: "Cosa condividere — punto 4", default: "Prototype / start-of-production milestones" },
        quality_title: { label: "Certificazioni — titolo", default: "Quality credentials" },
        quality_text: { label: "Certificazioni — testo", default: "Certification document for vendor qualification:" },
        quality_button: { label: "Certificazioni — pulsante", default: "Download ISO Certificate" },
      },
    },
  },
} satisfies PageDef;

// Texts of the contact form: labels (client component) and the messages the
// server returns after a submit. {email} = company email from "Dati aziendali".
export const CONTACT_FORM = {
  id: "form",
  sections: {
    fields: {
      group: "Form contatti › Campi",
      blocks: {
        name: { label: "Campo nome", default: "Name *" },
        company: { label: "Campo azienda", default: "Company *" },
        email: { label: "Campo email", default: "Work email *" },
        phone: { label: "Campo telefono", default: "Phone" },
        scope: { label: "Campo ambito progetto", default: "Project scope" },
        timeline: { label: "Campo tempistiche", default: "Timeline" },
        select_placeholder: { label: "Scelta vuota dei menu a tendina", default: "Select..." },
        scope_power: { label: "Ambito: Power Generation", default: "Power Generation cooling" },
        scope_datacenter: { label: "Ambito: Datacenter", default: "Datacenter cooling" },
        scope_mtower: { label: "Ambito: M Tower", default: "M Tower platform sizing" },
        scope_custom: { label: "Ambito: su misura", default: "Custom thermal architecture" },
        scope_other: { label: "Ambito: altro", default: "Other" },
        timeline_3m: { label: "Tempistica: meno di 3 mesi", default: "Under 3 months" },
        timeline_6m: { label: "Tempistica: 3-6 mesi", default: "3 – 6 months" },
        timeline_12m: { label: "Tempistica: 6-12 mesi", default: "6 – 12 months" },
        timeline_exploring: { label: "Tempistica: solo esplorazione", default: "Just exploring" },
        message: { label: "Campo messaggio", default: "Tell us about your project *" },
        message_placeholder: {
          label: "Suggerimento nel campo messaggio",
          default: "Engine power class, heat rejection target, installation context, anything we should know...",
          type: "textarea",
        },
        consent: {
          label: "Consenso privacy — testo prima del link",
          default: "I consent to Enfrio processing the data I submitted to reply to my inquiry, in line with the",
          type: "textarea",
        },
        consent_link: { label: "Consenso privacy — testo del link (va a Privacy)", default: "privacy policy" },
        consent_end: { label: "Consenso privacy — testo dopo il link", default: "." },
        submit: { label: "Pulsante invia", default: "Send inquiry" },
        sending: { label: "Pulsante durante l'invio", default: "Sending..." },
        prefill: {
          label: "Avviso quando arriva una configurazione dal configuratore M Tower",
          default: "Your M Tower configuration has been added below. Review the message, add a name, company and email, and send.",
          type: "textarea",
        },
      },
    },
    messages: {
      group: "Form contatti › Messaggi",
      blocks: {
        success: {
          label: "Invio riuscito",
          default: "Thank you. Your inquiry was sent to the Enfrio team — we will reply within one business day.",
          type: "textarea",
        },
        spam_success: { label: "Risposta ai bot (campo nascosto compilato)", default: "Thank you. We will be in touch shortly." },
        repeat: {
          label: "Secondo invio ravvicinato dallo stesso browser",
          default: "Thanks — your previous message is on its way. Please wait a moment before sending another one.",
          type: "textarea",
        },
        review: { label: "Errori nei campi (riepilogo)", default: "Please review the highlighted fields and try again." },
        name_required: { label: "Errore: nome mancante", default: "Name is required." },
        email_required: { label: "Errore: email mancante", default: "Email is required." },
        email_invalid: { label: "Errore: email non valida", default: "Enter a valid email address." },
        company_required: { label: "Errore: azienda mancante", default: "Company is required." },
        message_short: {
          label: "Errore: messaggio troppo corto",
          default: "Tell us a bit more about your project (at least 20 characters).",
        },
        consent_required: { label: "Errore: consenso mancante", default: "We need your consent to process this request." },
        not_delivered: {
          label: "Invio non riuscito ({email} = email aziendale)",
          default: "We couldn't deliver your message right now. Please retry shortly or email {email} directly.",
          type: "textarea",
        },
        unexpected: {
          label: "Errore imprevisto ({email} = email aziendale)",
          default: "Something went wrong sending the message. Please retry shortly or email {email} directly.",
          type: "textarea",
        },
      },
    },
  },
} satisfies PageDef;
