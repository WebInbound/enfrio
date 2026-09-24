// Testi italiani di src/content/legal.ts (chiave = slug del blocco inglese).
// Bozza del 24 set 2026: la terminologia tecnica va riletta da Enfrio.
// Informativa privacy: traduzione fedele del testo inglese, da validare con il cliente.
export const IT_LEGAL: Record<string, string> = {
  legal_seo_title: "Enfrio | Privacy e cookie",
  legal_seo_description:
    "Come Enfrio Srl tratta i dati personali raccolti tramite questo sito, in conformità al Regolamento generale sulla protezione dei dati dell'UE (GDPR).",

  legal_hero_kicker: "NOTE LEGALI",
  legal_hero_title: "Privacy e cookie.",
  legal_hero_lead:
    "Come Enfrio Srl tratta i dati personali raccolti tramite questo sito, in conformità al Regolamento (UE) 2016/679 (GDPR) e al D.Lgs. 196/2003 e successive modifiche. Ultimo aggiornamento: {date}.",
  legal_hero_updated: "29 maggio 2026",

  legal_controller_title: "Titolare del trattamento",
  legal_controller_requests_title: "Contatti per le richieste sui dati",
  legal_controller_requests_text:
    "Per qualsiasi domanda sul modo in cui trattiamo i vostri dati, o per esercitare i diritti descritti di seguito, scrivete a <a href=\"mailto:{email}\">{email}</a>.",

  legal_collect_kicker: "DATI RACCOLTI",
  legal_collect_title: "Le categorie di dati personali che possiamo trattare.",
  legal_collect_browsing_title: "Dati di navigazione",
  legal_collect_browsing_text:
    "Log del server raccolti automaticamente durante la visita al sito: indirizzo IP, user agent, referrer, risorsa richiesta, data e ora. Conservati per analisi di sicurezza e statistiche aggregate sul traffico.",
  legal_collect_inquiry_title: "Dati di contatto e delle richieste",
  legal_collect_inquiry_text:
    "Quando inviate il modulo di contatto: nome, azienda, email aziendale, telefono (facoltativo), ambito del progetto, tempistiche e testo del messaggio. Fornite queste informazioni volontariamente, per consentirci di rispondere alla vostra richiesta.",
  legal_collect_config_title: "Dati di configurazione",
  legal_collect_config_text:
    "Il simulatore di dimensionamento M Tower funziona interamente nel vostro browser. I valori inseriti (potenza del motore, temperatura ambiente, altitudine, ridondanza) non vengono trasmessi a Enfrio, a meno che non li inviate esplicitamente tramite il modulo di contatto.",
  legal_collect_cookies_title: "Cookie e tecnologie simili",
  legal_collect_cookies_text:
    "Il sito utilizza esclusivamente cookie tecnici strettamente necessari alla navigazione. Non utilizziamo cookie di profilazione, cookie pubblicitari né strumenti di analisi di terze parti che vi tracciano su altri siti web.",

  legal_purposes_kicker: "PERCHÉ LI TRATTIAMO",
  legal_purposes_title: "Finalità e base giuridica ai sensi dell'articolo 6 del GDPR.",
  legal_purposes_reply_title: "Rispondere alla vostra richiesta",
  legal_purposes_reply_text:
    "Le informazioni inviate tramite il modulo di contatto sono utilizzate esclusivamente per valutare la vostra richiesta e rispondervi.",
  legal_purposes_reply_basis:
    "Base giuridica: misure precontrattuali e nostro legittimo interesse a condurre un dialogo commerciale (art. 6.1.b / 6.1.f).",
  legal_purposes_site_title: "Gestire il sito web",
  legal_purposes_site_text:
    "I log del server sono utilizzati per garantire la raggiungibilità del sito, indagare su eventuali abusi e compilare statistiche aggregate.",
  legal_purposes_site_basis:
    "Base giuridica: nostro legittimo interesse alla sicurezza e alla continuità del servizio (art. 6.1.f).",
  legal_purposes_law_title: "Adempiere agli obblighi di legge",
  legal_purposes_law_text:
    "Ove applicabile, conserviamo i dati per adempiere a obblighi fiscali, contabili o normativi.",
  legal_purposes_law_basis: "Base giuridica: obbligo di legge (art. 6.1.c).",

  legal_recipients_kicker: "DESTINATARI",
  legal_recipients_title: "Chi può accedere ai vostri dati e dove sono conservati.",
  legal_recipients_internal_title: "Destinatari interni",
  legal_recipients_internal_text:
    "Il personale Enfrio coinvolto nel seguito commerciale, nella valutazione tecnica e nella gestione dei sistemi IT, ciascuno nei limiti dell'autorizzazione assegnata.",
  legal_recipients_processors_title: "Responsabili e sub-responsabili del trattamento",
  legal_recipients_processors_text:
    "Ci avvaliamo di fornitori di infrastruttura che operano come responsabili del trattamento ai sensi dell'articolo 28 del GDPR:",
  legal_recipients_processor_1:
    "<strong>Vercel Inc.</strong> — hosting e distribuzione dei contenuti di questo sito (regioni dati UE ove disponibili).",
  legal_recipients_processor_2:
    "<strong>FormSubmit (Activated Studio LLC)</strong> — inoltro via email dei messaggi inviati tramite il modulo di contatto.",
  legal_recipients_processor_3:
    "<strong>Fornitore del servizio email</strong> — recapito delle risposte all'indirizzo da voi indicato.",
  legal_recipients_processors_note:
    "Qualora un responsabile operi al di fuori dello SEE, i trasferimenti sono coperti da Clausole contrattuali standard o da garanzie equivalenti ai sensi del Capo V del GDPR.",

  legal_retention_kicker: "CONSERVAZIONE",
  legal_retention_title: "Per quanto tempo conserviamo i vostri dati.",
  legal_retention_logs_title: "Log del server",
  legal_retention_logs_text:
    "Conservati fino a <strong>12 mesi</strong> per analisi di sicurezza e del traffico, poi cancellati automaticamente.",
  legal_retention_form_title: "Dati del modulo di contatto",
  legal_retention_form_text:
    "Conservati per il tempo necessario a gestire la vostra richiesta, più un massimo di <strong>24 mesi</strong> per finalità di follow-up — salvo che ci chiediate di cancellarli prima.",
  legal_retention_records_title: "Documentazione contrattuale / fiscale",
  legal_retention_records_text:
    "Se una richiesta dà luogo a un contratto, i dati correlati sono conservati per i periodi previsti dalla normativa commerciale e fiscale italiana (in genere <strong>10 anni</strong>).",

  legal_rights_kicker: "I VOSTRI DIRITTI",
  legal_rights_title: "Cosa potete chiederci (articoli 15–22 GDPR).",
  legal_rights_info_title: "Diritti di informazione",
  legal_rights_info_1: "Accedere ai dati personali che conserviamo su di voi",
  legal_rights_info_2: "Riceverli in un formato strutturato e portabile",
  legal_rights_info_3: "Conoscere finalità, destinatari e periodi di conservazione",
  legal_rights_control_title: "Diritti di controllo",
  legal_rights_control_1: "Ottenere la rettifica dei dati inesatti o incompleti",
  legal_rights_control_2: "Richiedere la cancellazione quando ricorrono le condizioni dell'art. 17",
  legal_rights_control_3: "Richiedere la limitazione del trattamento quando si applica l'art. 18",
  legal_rights_control_4: "Opporvi al trattamento effettuato sulla base del legittimo interesse",
  legal_rights_control_5:
    "Proporre reclamo all'autorità italiana per la protezione dei dati (<em>Garante per la protezione dei dati personali</em>) — si veda <a href=\"https://www.garanteprivacy.it\" target=\"_blank\" rel=\"noopener noreferrer\">garanteprivacy.it</a>",
  legal_rights_exercise_title: "Come esercitare i vostri diritti",
  legal_rights_exercise_text:
    "Inviate una richiesta a <a href=\"mailto:{email}\">{email}</a>. Risponderemo entro un mese e, se la richiesta è complessa, potremo prorogare la risposta di ulteriori due mesi, tenendovi informati. Per le richieste legittime non addebitiamo alcun costo.",

  legal_cookies_kicker: "COOKIE",
  legal_cookies_title: "Cosa viene eseguito nel vostro browser quando visitate questo sito.",
  legal_cookies_technical_title: "Cookie tecnici (sempre attivi)",
  legal_cookies_technical_text:
    "Strettamente necessari al funzionamento del sito — ad esempio per mantenere lo stato del menu e identificare la sessione per la durata di una visita. Non richiedono il consenso ai sensi dell'art. 122 del Codice Privacy.",
  legal_cookies_marketing_title: "Cookie analitici / di marketing",
  legal_cookies_marketing_text:
    "Il sito <strong>non</strong> imposta cookie analitici o di marketing di terze parti. Non viene caricata alcuna rete pubblicitaria, plug-in social o pixel di tracciamento cross-site. Se in futuro ne introducessimo, richiederemo il consenso esplicito tramite un banner cookie e aggiorneremo prima questa informativa.",

  legal_cta_kicker: "DOMANDE?",
  legal_cta_title: "Contattate il team Enfrio.",
  legal_cta_text:
    "Per domande sulla privacy o per esercitare uno qualsiasi dei diritti sopra indicati, scrivete a <a href=\"mailto:{email}\">{email}</a>. Per richieste di carattere generale utilizzate il modulo di contatto.",
  legal_cta_button: "Aprite il modulo di contatto",
  legal_cta_note:
    "Questa informativa è pubblicata da Enfrio Srl e riesaminata periodicamente. Gli aggiornamenti sostanziali saranno riportati nella data di “Ultimo aggiornamento” indicata sopra e, ove opportuno, comunicati tramite questa pagina.",
};
