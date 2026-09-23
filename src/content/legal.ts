import type { PageDef } from "./types";

// Privacy & cookie policy. Richtext blocks allow <strong>, <em>, <br> and
// links; {email} = company email from "Globale › Dati aziendali".
export const LEGAL = {
  id: "legal",
  sections: {
    seo: {
      group: "SEO",
      blocks: {
        title: { label: "Privacy — titolo pagina", default: "Enfrio | Privacy & Cookies" },
        description: {
          label: "Privacy — descrizione per Google",
          default:
            "How Enfrio Srl handles personal data collected through this website, in line with the EU General Data Protection Regulation (GDPR).",
          type: "textarea",
        },
      },
    },
    hero: {
      group: "Privacy › 1. Apertura",
      blocks: {
        kicker: { label: "Occhiello", default: "LEGAL" },
        title: { label: "Titolo principale", default: "Privacy & Cookies." },
        lead: {
          label: "Testo introduttivo ({date} = data di aggiornamento qui sotto)",
          default:
            "How Enfrio Srl handles personal data collected through this website, in line with EU Regulation 2016/679 (GDPR) and Italian Legislative Decree 196/2003 as amended. Last updated {date}.",
          type: "textarea",
        },
        updated: { label: "Data di ultimo aggiornamento", default: "29 May 2026" },
      },
    },
    controller: {
      group: "Privacy › 2. Titolare",
      blocks: {
        title: { label: "Titolare — titolo (dati da \"Dati aziendali\")", default: "Data Controller" },
        requests_title: { label: "Richieste — titolo", default: "Contact for data requests" },
        requests_text: {
          label: "Richieste — testo",
          default:
            'For any question about how we process your data, or to exercise the rights described below, write to <a href="mailto:{email}">{email}</a>.',
          type: "richtext",
        },
      },
    },
    collect: {
      group: "Privacy › 3. Dati raccolti",
      blocks: {
        kicker: { label: "Occhiello", default: "WHAT WE COLLECT" },
        title: { label: "Titolo", default: "The categories of personal data we may process.", type: "textarea" },
        browsing_title: { label: "Navigazione — titolo", default: "Browsing data" },
        browsing_text: {
          label: "Navigazione — testo",
          default:
            "Server logs collected automatically when you visit the site: IP address, user agent, referrer, requested resource, timestamp. Retained for security analysis and aggregate traffic statistics.",
          type: "textarea",
        },
        inquiry_title: { label: "Richieste — titolo", default: "Contact and inquiry data" },
        inquiry_text: {
          label: "Richieste — testo",
          default:
            "When you submit the contact form: name, company, work email, phone (optional), project scope, timeline and the message body. You provide this information voluntarily to enable us to reply to your request.",
          type: "textarea",
        },
        config_title: { label: "Configuratore — titolo", default: "Configuration data" },
        config_text: {
          label: "Configuratore — testo",
          default:
            "The M Tower sizing simulator runs entirely in your browser. The values you enter (engine power, ambient, altitude, redundancy) are not transmitted to Enfrio unless you explicitly send them through the contact form.",
          type: "textarea",
        },
        cookies_title: { label: "Cookie — titolo", default: "Cookies and similar technologies" },
        cookies_text: {
          label: "Cookie — testo",
          default:
            "The site uses only technical cookies strictly necessary for navigation. We do not use profiling cookies, advertising cookies or third-party analytics that track you across other websites.",
          type: "textarea",
        },
      },
    },
    purposes: {
      group: "Privacy › 4. Finalità",
      blocks: {
        kicker: { label: "Occhiello", default: "WHY WE PROCESS IT" },
        title: { label: "Titolo", default: "Purposes and lawful basis under Article 6 GDPR.", type: "textarea" },
        reply_title: { label: "Risposta — titolo", default: "Reply to your inquiry" },
        reply_text: {
          label: "Risposta — testo",
          default: "Information you submit through the contact form is used solely to evaluate and reply to your request.",
          type: "textarea",
        },
        reply_basis: {
          label: "Risposta — base giuridica",
          default:
            "Lawful basis: pre-contractual measures and our legitimate interest in conducting commercial dialogue (Art. 6.1.b / 6.1.f).",
          type: "textarea",
        },
        site_title: { label: "Sito — titolo", default: "Maintain the website" },
        site_text: {
          label: "Sito — testo",
          default: "Server logs are used to ensure the site is reachable, to investigate abuse and to compile aggregate statistics.",
          type: "textarea",
        },
        site_basis: {
          label: "Sito — base giuridica",
          default: "Lawful basis: our legitimate interest in security and continuity of service (Art. 6.1.f).",
          type: "textarea",
        },
        law_title: { label: "Obblighi di legge — titolo", default: "Comply with the law" },
        law_text: {
          label: "Obblighi di legge — testo",
          default: "Where applicable, we retain data to meet tax, accounting or regulatory obligations.",
          type: "textarea",
        },
        law_basis: { label: "Obblighi di legge — base giuridica", default: "Lawful basis: legal obligation (Art. 6.1.c)." },
      },
    },
    recipients: {
      group: "Privacy › 5. Destinatari",
      blocks: {
        kicker: { label: "Occhiello", default: "RECIPIENTS" },
        title: { label: "Titolo", default: "Who can access your data, and where it is stored.", type: "textarea" },
        internal_title: { label: "Interni — titolo", default: "Internal recipients" },
        internal_text: {
          label: "Interni — testo",
          default:
            "Enfrio personnel involved in commercial follow-up, engineering evaluation and IT operations, each acting within their assigned authorization.",
          type: "textarea",
        },
        processors_title: { label: "Responsabili — titolo", default: "Processors and sub-processors" },
        processors_text: {
          label: "Responsabili — introduzione",
          default: "We rely on infrastructure providers acting as data processors under Article 28 GDPR:",
          type: "textarea",
        },
        processor_1: {
          label: "Responsabile 1",
          default: "<strong>Vercel Inc.</strong> — hosting and content delivery for this website (EU data regions where available).",
          type: "richtext",
        },
        processor_2: {
          label: "Responsabile 2",
          default: "<strong>FormSubmit (Activated Studio LLC)</strong> — email relay for contact form submissions.",
          type: "richtext",
        },
        processor_3: {
          label: "Responsabile 3",
          default: "<strong>Email service provider</strong> — delivery of replies to the address you supply.",
          type: "richtext",
        },
        processor_4: {
          label: "Responsabile 4 (facoltativo: vuoto = non mostrato)",
          default: "",
          type: "richtext",
        },
        processors_note: {
          label: "Responsabili — nota",
          default:
            "Where a processor operates outside the EEA, transfers are covered by Standard Contractual Clauses or equivalent safeguards under Chapter V GDPR.",
          type: "textarea",
        },
      },
    },
    retention: {
      group: "Privacy › 6. Conservazione",
      blocks: {
        kicker: { label: "Occhiello", default: "RETENTION" },
        title: { label: "Titolo", default: "How long we keep your data." },
        logs_title: { label: "Log — titolo", default: "Server logs" },
        logs_text: {
          label: "Log — testo",
          default: "Retained for up to <strong>12 months</strong> for security and traffic analysis, then automatically deleted.",
          type: "richtext",
        },
        form_title: { label: "Modulo contatti — titolo", default: "Contact-form data" },
        form_text: {
          label: "Modulo contatti — testo",
          default:
            "Retained for the time necessary to handle your inquiry, plus up to <strong>24 months</strong> for follow-up purposes — unless you ask us to delete it earlier.",
          type: "richtext",
        },
        records_title: { label: "Contratti — titolo", default: "Contractual / fiscal records" },
        records_text: {
          label: "Contratti — testo",
          default:
            "Where an inquiry results in a contract, related data is kept for the retention periods required by Italian commercial and fiscal law (generally <strong>10 years</strong>).",
          type: "richtext",
        },
      },
    },
    rights: {
      group: "Privacy › 7. Diritti",
      blocks: {
        kicker: { label: "Occhiello", default: "YOUR RIGHTS" },
        title: { label: "Titolo", default: "What you can ask us to do (Articles 15–22 GDPR).", type: "textarea" },
        info_title: { label: "Informazione — titolo", default: "Information rights" },
        info_1: { label: "Informazione — punto 1", default: "Access the personal data we hold about you" },
        info_2: { label: "Informazione — punto 2", default: "Receive it in a structured, portable format" },
        info_3: { label: "Informazione — punto 3", default: "Know the purposes, recipients and retention periods" },
        control_title: { label: "Controllo — titolo", default: "Control rights" },
        control_1: { label: "Controllo — punto 1", default: "Have inaccurate or incomplete data corrected" },
        control_2: { label: "Controllo — punto 2", default: "Request erasure where the conditions of Art. 17 apply" },
        control_3: { label: "Controllo — punto 3", default: "Request restriction of processing where Art. 18 applies" },
        control_4: { label: "Controllo — punto 4", default: "Object to processing carried out on legitimate-interest grounds" },
        control_5: {
          label: "Controllo — punto 5",
          default:
            'Lodge a complaint with the Italian Data Protection Authority (<em>Garante per la protezione dei dati personali</em>) — see <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">garanteprivacy.it</a>',
          type: "richtext",
        },
        exercise_title: { label: "Come esercitarli — titolo", default: "How to exercise your rights" },
        exercise_text: {
          label: "Come esercitarli — testo",
          default:
            'Send a request to <a href="mailto:{email}">{email}</a>. We will reply within one month and, where the request is complex, may extend the reply by a further two months while keeping you informed. We will not charge a fee for legitimate requests.',
          type: "richtext",
        },
      },
    },
    cookies: {
      group: "Privacy › 8. Cookie",
      blocks: {
        kicker: { label: "Occhiello", default: "COOKIES" },
        title: { label: "Titolo", default: "What runs in your browser when you visit this site.", type: "textarea" },
        technical_title: { label: "Tecnici — titolo", default: "Technical cookies (always on)" },
        technical_text: {
          label: "Tecnici — testo",
          default:
            "Strictly necessary for the site to function — for example to preserve your menu state and to identify your session for the duration of a visit. These do not require consent under Art. 122 of the Italian Privacy Code.",
          type: "textarea",
        },
        marketing_title: { label: "Analitici / marketing — titolo", default: "Analytical / marketing cookies" },
        marketing_text: {
          label: "Analitici / marketing — testo",
          default:
            "The site does <strong>not</strong> set third-party analytical or marketing cookies. No advertising network, social plug-in or cross-site tracking pixel is loaded. If we introduce any in the future, we will request explicit consent through a cookie banner and update this policy first.",
          type: "richtext",
        },
      },
    },
    cta: {
      group: "Privacy › 9. Domande e nota finale",
      blocks: {
        kicker: { label: "Occhiello", default: "QUESTIONS?" },
        title: { label: "Titolo", default: "Reach out to the Enfrio team." },
        text: {
          label: "Testo",
          default:
            'For privacy questions or to exercise any of the rights above, write to <a href="mailto:{email}">{email}</a>. For general inquiries please use the contact form.',
          type: "richtext",
        },
        button: { label: "Pulsante (va a Contatti)", default: "Open the contact form" },
        note: {
          label: "Nota finale",
          default:
            "This policy is published by Enfrio Srl and reviewed periodically. Substantive updates will be reflected in the “Last updated” date above and, where appropriate, communicated through this page.",
          type: "textarea",
        },
      },
    },
  },
} satisfies PageDef;
