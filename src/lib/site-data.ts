/*
  Placeholder content for the LIINE landing page.
  Every model, credit and figure below is SYNTHETIC and marked for replacement.
  Real facts only: agency name, mission, divisions, and the legal entity block.
*/

// Board divisions — the three columns of the "Modelli" mega menu. Each links
// back to the home board with the matching filter preselected (read by Board
// from the `div` query param).
export const DIVISIONS = [
  { id: "lei", label: "Lei", note: "Donne", desc: "Campagne, sfilate e fitting.", href: "/?div=lei#board" },
  { id: "lui", label: "Lui", note: "Uomini", desc: "Campagne, sfilate e fitting.", href: "/?div=lui#board" },
  { id: "kids", label: "Kids", note: "In arrivo", desc: "Divisione in preparazione.", href: "/?div=kids#board" },
] as const;

// Simple desktop links shown alongside the "Modelli" mega-menu trigger.
export const NAV_LINKS = [
  { label: "Casting", href: "/candidatura" },
  { label: "Contatti", href: "/richiesta" },
] as const;

// Footer link columns — reuses the site's real routes and section anchors.
export const FOOTER_NAV = [
  {
    title: "Modelli",
    links: [
      { label: "Lei", href: "/?div=lei#board" },
      { label: "Lui", href: "/?div=lui#board" },
      { label: "Kids", href: "/?div=kids#board" },
    ],
  },
  {
    title: "Agenzia",
    links: [
      { label: "Metodo", href: "/#metodo" },
      { label: "Lavori", href: "/#lavori" },
      { label: "Contatti", href: "/richiesta" },
    ],
  },
  {
    title: "Lavora con noi",
    links: [
      { label: "Casting aperto", href: "/candidatura" },
      { label: "Richiesta clienti", href: "/richiesta" },
      { label: "Area riservata", href: "/riservato" },
    ],
  },
] as const;

// Social profiles — icon keys map to react-icons glyphs in SiteFooter.
// SYNTHETIC: hrefs are placeholders, replace with the real handles.
export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" },
  { label: "Pinterest", href: "https://www.pinterest.com/", icon: "pinterest" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
] as const;

// Flat list for the mobile ledger menu — divisions expanded inline.
export const MOBILE_NAV = [
  { label: "Lei", href: "/?div=lei#board", desc: "Donne · board" },
  { label: "Lui", href: "/?div=lui#board", desc: "Uomini · board" },
  { label: "Kids", href: "/?div=kids#board", desc: "In arrivo" },
  { label: "Casting", href: "/candidatura", desc: "Candidature" },
  { label: "Contatti", href: "/richiesta", desc: "Richiesta clienti" },
] as const;

/**
 * Presentation toggle. When true, the model + work DETAIL pages render the
 * site's placeholder tiles instead of the real portraits, so the layout can
 * be shown to the client without committing the imagery. Flip to false to
 * restore the real photos — nothing else changes.
 */
export const USE_PLACEHOLDERS = true;

/**
 * Model shape shared by the board and the reserved-area data layer. The roster
 * itself is no longer hardcoded here — models are stored in MongoDB and managed
 * from /riservato. Run `npm run seed` once to migrate the initial roster.
 */
export interface ModelCard {
  name: string;
  slug: string;
  img: string;
  /** Detail-page portfolio stills (900×1200). Cover is images[0]. */
  portfolio: string[];
}

// Elite-signature "selected work" index — placeholder credits.
// SYNTHETIC: model/client names, years and imagery are stand-ins for the
// real archive, marked "Segnaposto" throughout the UI.
export interface WorkItem {
  slug: string;
  model: string;
  client: string;
  credit: string;
  year: string;
  location: string;
  images: string[];
}

export const WORK_INDEX: WorkItem[] = [
  { slug: "campagna-fw26", model: "Nome Cognome", client: "Maison", credit: "Campagna FW26", year: "2026", location: "Milano", images: ["/models/portfolio/chloe-01.jpg", "/models/portfolio/daria-02.jpg", "/models/portfolio/iryna-03.jpg"] },
  { slug: "editoriale", model: "Nome Cognome", client: "Maison", credit: "Editoriale", year: "2025", location: "Parigi", images: ["/models/portfolio/daria-01.jpg", "/models/portfolio/chloe-03.jpg", "/models/portfolio/iryna-02.jpg"] },
  { slug: "sfilata-ss26", model: "Nome Cognome", client: "Maison", credit: "Sfilata SS26", year: "2026", location: "Firenze", images: ["/models/portfolio/iryna-01.jpg", "/models/portfolio/emanuele-01.jpg", "/models/portfolio/chloe-04.jpg"] },
  { slug: "lookbook", model: "Nome Cognome", client: "Maison", credit: "Lookbook", year: "2025", location: "Londra", images: ["/models/portfolio/daria-03.jpg", "/models/portfolio/chloe-05.jpg", "/models/portfolio/iryna-04.jpg"] },
  { slug: "campagna", model: "Nome Cognome", client: "Maison", credit: "Campagna", year: "2025", location: "Milano", images: ["/models/portfolio/chloe-02.jpg", "/models/portfolio/daria-04.jpg", "/models/portfolio/emanuele-02.jpg"] },
  { slug: "fitting-couture", model: "Nome Cognome", client: "Maison", credit: "Fitting couture", year: "2026", location: "Parigi", images: ["/models/portfolio/iryna-05.jpg", "/models/portfolio/daria-05.jpg", "/models/portfolio/chloe-06.jpg"] },
  { slug: "editoriale-cover", model: "Nome Cognome", client: "Maison", credit: "Editoriale cover", year: "2025", location: "Roma", images: ["/models/portfolio/chloe-01.jpg", "/models/portfolio/iryna-06.jpg", "/models/portfolio/daria-06.jpg"] },
  { slug: "sfilata-fw26", model: "Nome Cognome", client: "Maison", credit: "Sfilata FW26", year: "2026", location: "Milano", images: ["/models/portfolio/emanuele-03.jpg", "/models/portfolio/tommaso-01.jpg", "/models/portfolio/chloe-03.jpg"] },
];

export function getWork(slug: string): WorkItem | undefined {
  return WORK_INDEX.find((w) => w.slug === slug);
}

export function workNeighbors(slug: string): { prev: WorkItem; next: WorkItem } {
  const i = WORK_INDEX.findIndex((w) => w.slug === slug);
  const n = WORK_INDEX.length;
  return {
    prev: WORK_INDEX[(i - 1 + n) % n],
    next: WORK_INDEX[(i + 1) % n],
  };
}

// The method — presented as an editorial index, not cards.
export const METHOD = [
  {
    term: "Selezione per fit",
    desc: "Non partiamo dalle misure standard, ma dal capo e da come cade sul corpo giusto.",
  },
  {
    term: "Due divisioni",
    desc: "Lei e Lui: board curati, aggiornati e pronti per campagne, sfilate e fitting.",
  },
  {
    term: "Casting aperto",
    desc: "Un canale sempre attivo per nuovi volti e per le richieste dei clienti.",
  },
] as const;

export const COVERS = ["01", "02", "03", "04"] as const;

// Model portraits (Lei + Lui) used by the cursor image-trail on the method
// index. Optimised stills sourced from the roster — marked for replacement.
export const MODELS = Array.from(
  { length: 16 },
  (_, i) => `/models/model-${String(i + 1).padStart(2, "0")}.jpg`,
);

// Client / partner maison logos — reproduced in-project as monochrome
// wordmarks (SVG). Placeholder association, marked for replacement with the
// real client roster / officially licensed marks.
export const BRANDS = [
  { name: "A. Filippi", src: "/logos/a-filippi.svg" },
  { name: "Ermanno Scervino", src: "/logos/ermanno-scervino.svg" },
  { name: "Vivienne Westwood", src: "/logos/vivienne-westwood.svg" },
  { name: "Fendi", src: "/logos/fendi.svg" },
  { name: "Brunello Cucinelli", src: "/logos/brunello-cucinelli.svg" },
  { name: "Chiara Boni", src: "/logos/chiara-boni.svg" },
  { name: "Fabiana Filippi", src: "/logos/fabiana-filippi.svg" },
] as const;

// Real, from liinemodelmanagement.com
export const LEGAL = {
  entity: "LIINE Ltd",
  address: "1 New Providence Wharf, Fairmont Avenue, Londra, E14 9PB, Regno Unito",
  vat: "GB500653922",
} as const;
