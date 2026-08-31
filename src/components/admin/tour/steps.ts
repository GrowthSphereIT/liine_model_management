/**
 * Ordered steps for the reserved-area guided tour. Each step points at an
 * element via a [data-tour="…"] anchor on a given page; the tour navigates
 * between pages automatically and skips any step whose anchor isn't present
 * (e.g. per-model actions when the board is still empty).
 */

export interface TourStep {
  /** Route the step lives on. */
  path: string;
  /** Value of the target's data-tour attribute. */
  anchor: string;
  title: string;
  body: string;
  /** Extra spotlight padding in px. */
  padding?: number;
}

export const TOUR_STEPS: TourStep[] = [
  // ── Sidebar ──────────────────────────────────────────────────────────
  {
    path: "/riservato",
    anchor: "brand",
    title: "Benvenuto nell'area riservata",
    body: "Da qui gestisci i contenuti del sito e i contatti in arrivo. Ti faccio fare un giro completo: usa Avanti / Indietro qui sotto (o le frecce ← →). Premi Esc per uscire quando vuoi.",
  },
  {
    path: "/riservato",
    anchor: "nav-dashboard",
    title: "Panoramica",
    body: "La home dell'area riservata: un colpo d'occhio su quanti modelli, lavori e contatti hai, con le scorciatoie per gestirli.",
  },
  {
    path: "/riservato",
    anchor: "nav-modelli",
    title: "Modelli",
    body: "Qui aggiungi, modifichi ed elimini i volti del board pubblico (Lei, Lui, Kids). È la sezione che alimenta la home del sito.",
  },
  {
    path: "/riservato",
    anchor: "nav-lavori",
    title: "Lavori",
    body: "L'archivio dei progetti selezionati. La sezione pubblica è momentaneamente in pausa, ma la gestione resta qui per quando la riattiverai.",
  },
  {
    path: "/riservato",
    anchor: "nav-composit",
    title: "Composit",
    body: "Lo strumento che genera i composit (comp card) fronte/retro pronti per la stampa. Lo vediamo tra poco nel dettaglio.",
  },
  {
    path: "/riservato",
    anchor: "nav-casting",
    title: "Casting",
    body: "Le candidature che arrivano dal form «casting aperto» del sito, in ordine di arrivo.",
  },
  {
    path: "/riservato",
    anchor: "nav-clienti",
    title: "Clienti",
    body: "Le richieste che i clienti inviano dal form contatti del sito.",
  },
  {
    path: "/riservato",
    anchor: "logout",
    title: "Esci",
    body: "Chiude la sessione e riporta al login. L'area è protetta: ogni pagina richiede l'accesso.",
  },

  // ── Dashboard ────────────────────────────────────────────────────────
  {
    path: "/riservato",
    anchor: "dash-intro",
    title: "Come funziona",
    body: "Ogni modifica ai contenuti è pubblicata immediatamente sul sito: non serve ripubblicare o ricostruire nulla.",
  },
  {
    path: "/riservato",
    anchor: "dash-cards",
    title: "I riquadri di sintesi",
    body: "Ogni riquadro mostra il totale di una sezione (numero in evidenza) ed è una scorciatoia: cliccando entri nella gestione. Se ci sono contatti «da gestire», te lo segnala qui.",
  },
  {
    path: "/riservato",
    anchor: "dash-composit",
    title: "Scorciatoia Composit",
    body: "Accesso diretto al generatore di composit, lo strumento che useremo per creare le comp card.",
  },

  // ── Modelli ──────────────────────────────────────────────────────────
  {
    path: "/riservato/modelli",
    anchor: "model-new",
    title: "Nuovo modello",
    body: "Il modulo per inserire un volto nel board. La prima immagine diventa la copertina; le altre popolano la scheda pubblica.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-name",
    title: "Nome",
    body: "Appare sulla scheda pubblica e genera l'indirizzo della pagina del modello (lo «slug»).",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-division",
    title: "Divisione",
    body: "Decide in quale colonna del board (Lei, Lui, Kids) comparirà il modello sul sito.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-misure",
    title: "Misure",
    body: "Servono a compilare automaticamente il composit del modello. Non vengono mostrate sulla scheda pubblica.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-images",
    title: "Immagini",
    body: "Carica qui le foto. Puoi scegliere quale usare come copertina; le altre diventano il portfolio della scheda.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-submit",
    title: "Salva",
    body: "Salva il modello: compare subito sul board del sito.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-list",
    title: "Il board caricato",
    body: "L'elenco dei modelli pubblicati, ciascuno con copertina e divisione. Da qui li gestisci uno per uno.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-composit",
    title: "Composit rapido",
    body: "Apre il generatore già pieno con foto e misure di questo modello: scegli quali scatti mettere e scarichi il PDF.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-edit",
    title: "Modifica",
    body: "Apre la scheda per cambiare nome, divisione, misure e immagini del modello.",
  },
  {
    path: "/riservato/modelli",
    anchor: "model-delete",
    title: "Elimina",
    body: "Rimuove il modello dal board. Viene chiesta conferma perché l'azione non è reversibile.",
  },

  // ── Composit ─────────────────────────────────────────────────────────
  {
    path: "/riservato/composit",
    anchor: "composit-new",
    title: "Nuovo composit",
    body: "Da qui apri la pagina di creazione per generare una nuova comp card fronte/retro.",
  },
  {
    path: "/riservato/composit",
    anchor: "composit-list",
    title: "I composit salvati",
    body: "La tabella dei composit già creati: apri «Modifica» per riaprirne uno, cambiarne foto o misure e riscaricarlo. Da qui puoi anche eliminarli.",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-name",
    title: "Nome sul composit",
    body: "Il nome che comparirà in grande sul fronte della comp card.",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-photos",
    title: "Le due foto",
    body: "Una per il fronte (copertina) e una per il retro (scheda). Vengono ritagliate alla stessa dimensione, così le due facce combaciano perfettamente.",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-misure",
    title: "Misure",
    body: "Le misure stampate sul retro (altezza, taglie, scarpe, capelli, occhi). Lascia vuoto ciò che non serve.",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-theme",
    title: "Colore",
    body: "Scegli la versione chiara (fondo bianco) o scura (fondo nero, logo e testi in bianco).",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-actions",
    title: "Scarica il PDF",
    body: "«Digitale» è un unico file orizzontale (fronte + retro affiancati). «Stampa» è a 2 pagine, pensato per la stampa fronte/retro.",
  },
  {
    path: "/riservato/composit/nuovo",
    anchor: "composit-preview",
    title: "Anteprima",
    body: "Mostra in tempo reale come verranno le due facce, prima di scaricare.",
  },

  // ── Casting ──────────────────────────────────────────────────────────
  {
    path: "/riservato/casting",
    anchor: "casting-head",
    title: "Candidature",
    body: "L'elenco di chi si propone dal casting aperto: dati, contatti, misure e foto, in ordine di arrivo.",
  },
  {
    path: "/riservato/casting",
    anchor: "contact-status",
    title: "Stato del contatto",
    body: "Segna una candidatura come «Gestito» quando l'hai valutata. «Nuovo» resta evidenziato per non perderlo di vista.",
  },
  {
    path: "/riservato/casting",
    anchor: "contact-actions",
    title: "Azioni",
    body: "Elimina un contatto quando non ti serve più (con conferma).",
  },

  // ── Clienti ──────────────────────────────────────────────────────────
  {
    path: "/riservato/clienti",
    anchor: "clienti-head",
    title: "Richieste clienti",
    body: "I messaggi dei clienti dal form contatti: referente, azienda e testo della richiesta. Stato e azioni funzionano come nel casting.",
  },

  // ── Chiusura ─────────────────────────────────────────────────────────
  {
    path: "/riservato",
    anchor: "tutorial",
    title: "Fine del tour",
    body: "Puoi rilanciare questo tutorial quando vuoi da questo pulsante. Buon lavoro!",
  },
];
