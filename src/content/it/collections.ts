// Testi italiani di src/content/collections.ts (chiave = slug della collezione).
// Stesso ordine e stesso numero di voci dell'inglese; le immagini restano condivise.
// Bozza del 24 set 2026: la terminologia tecnica va riletta da Enfrio.
export const IT_COLLECTIONS: Record<string, Array<{ title: string; alt: string; body?: string }>> = {
  technology_machinery_gallery: [
    { title: "Piattaforma di curvatura predisposta per l'integrazione nella linea termica.", alt: "Panoramica della curvatubi" },
    { title: "Precisione di percorso controllata dall'operatore.", alt: "Curvatubi in funzione" },
    { title: "Lavorazione laser per una geometria dei componenti costante.", alt: "Cella di lavorazione laser" },
    { title: "Verifica con CMM sulle quote critiche.", alt: "Metrologia per la qualità" },
    { title: "Postazione di lavorazione con esecuzione controllata.", alt: "Postazione di saldatura" },
  ],
  industries_madrid_gallery: [
    { title: "Apertura core-box su misura sul pacchetto radiatore.", alt: "Progetto camion rifiuti di Madrid, immagine 1" },
    { title: "Dettaglio dell'integrazione sul camion della piattaforma di Madrid.", alt: "Progetto camion rifiuti di Madrid, immagine 2" },
    { title: "Integrazione a livello di veicolo in contesto operativo.", alt: "Progetto camion rifiuti di Madrid, immagine 3" },
    { title: "Sistema di raffreddamento montato su un veicolo per la raccolta rifiuti.", alt: "Progetto camion rifiuti di Madrid, immagine 4" },
    { title: "Architettura Enfrio pronta per il campo per la piattaforma di Madrid.", alt: "Progetto camion rifiuti di Madrid, immagine 5" },
  ],
  projects_references: [
    {
      title: "Pacchetto per container 40HC",
      body: "Pacchetto di raffreddamento progettato per l'installazione compatta in container, con pacchi radianti ad alta efficienza, bassa potenza dei ventilatori e bassa rumorosità.",
      alt: "Pacchetto per container 40HC",
    },
    {
      title: "Personalizzazione MTU per siti remoti",
      body: "Radiatore personalizzato per installazioni remote, con dimensioni compatibili con i container e un'architettura robusta pensata per il campo.",
      alt: "Radiatore MTU per installazione remota",
    },
    {
      title: "Prodotto per i camion rifiuti di Madrid (sviluppo Enfrio)",
      body: "Soluzione proprietaria Enfrio per i veicoli della raccolta rifiuti di Madrid, progettata attorno a vincoli di ingombro severi con un'architettura radiatore/intercooler su misura.",
      alt: "Prodotto di raffreddamento Enfrio per i camion rifiuti di Madrid",
    },
  ],
  projects_snapshots: [
    { title: "Pacchetti a misura di container, progettati per una messa in opera rapida.", alt: "Pacchetto di raffreddamento 40HC a misura di container" },
    { title: "Motore e raffreddamento integrati in un'unica piattaforma consegnata chiavi in mano.", alt: "Motore V20 con pacchetto di raffreddamento Enfrio integrato" },
    { title: "Continuità produttiva e consegne scaglionate pronte.", alt: "Unità di raffreddamento finite in attesa in magazzino" },
    { title: "Architetture in variante per esigenze di progetto differenziate.", alt: "Radiatore Enfrio a doppio circuito" },
    { title: "L'esecuzione si chiude con una logistica disciplinata.", alt: "Unità di raffreddamento caricata su un camion per la consegna" },
  ],
};
