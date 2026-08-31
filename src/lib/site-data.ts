/*
  Placeholder content for the LIINE landing page.
  Every model, credit and figure below is SYNTHETIC and marked for replacement.
  Real facts only: agency name, mission, divisions, and the legal entity block.
*/

// Board divisions — the three columns of the "Modelli" mega menu. Each links
// back to the home board with the matching filter preselected (read by Board
// from the `div` query param).
export const DIVISIONS = [
  { id: "lei", label: "Lei", note: "Donne", desc: "Campagne, sfilate e fitting.", href: "/?div=lei#board", cover: "/models/DINA%20H%20177/3.jpg" },
  { id: "lui", label: "Lui", note: "Uomini", desc: "Campagne, sfilate e fitting.", href: "/?div=lui#board", cover: "/models/BRUNO%20H190/2.JPG" },
  { id: "kids", label: "Kids", note: "Bambini", desc: "Campagne, sfilate e fitting.", href: "/?div=kids#board", cover: null },
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
      { label: "Contatti", href: "/richiesta" },
      { label: "AI Act", href: "/ai-act" },
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
  { label: "Kids", href: "/?div=kids#board", desc: "Bambini · board" },
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
 * Feature flag — the "Lavori" area is temporarily parked (not deleted): the
 * home section, the footer link and the single work pages are hidden while the
 * real archive is being prepared. Flip to true to bring it back; nothing else
 * changes.
 */
export const LAVORI_ENABLED = false;

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

// The method — presented as an editorial index, not cards. Copy from the
// agency deck: fitting-first selection, targeted profiles, the 41-point measure.
export const METHOD = [
  {
    term: "Fitting e showroom",
    desc: "Modelli su misura per fitting e showroom: niente casting di massa, ma il profilo giusto per il capo.",
  },
  {
    term: "Profili mirati",
    desc: "Ogni richiesta è trattata con la massima precisione: selezioniamo solo i profili perfetti per il brand.",
  },
  {
    term: "41 punti misura",
    desc: "Ogni modello è misurato in 41 punti del corpo, dalla testa ai piedi, per proporzioni esatte e vestibilità garantita.",
  },
] as const;

export const COVERS = ["01", "02", "03", "04"] as const;

// Model portraits used by the cursor image-trail on the method index — the
// covers of the current roster plus a few extra stills (public/models).
export const MODELS = [
  "/models/AMANDA%20H180/viso.jpeg",
  "/models/BRUNO%20H190/viso.JPG",
  "/models/DINA%20H%20177/VISO.jpg",
  "/models/ELINA%20H178/viso.jpeg",
  "/models/GIOVANNI%20H181/viso.JPG",
  "/models/GUI%20H190/viso.jpg",
  "/models/HELIOS%20H186/portfolio/viso.jpeg",
  "/models/ISAAC%20H186/viso.jpg",
  "/models/JULIE%20H168/viso.jpg",
  "/models/TATIANA%20H%20180/Viso.jpg",
  "/models/TATYANA%20H177/Portfolio/viso.JPG",
  "/models/YULII%20H%20185/viso.jpg",
  "/models/AMANDA%20H180/1.jpeg",
  "/models/BRUNO%20H190/1.JPG",
  "/models/DINA%20H%20177/1.jpg",
  "/models/ELINA%20H178/1.jpeg",
];

// Client / partner maison logos — reproduced in-project as monochrome
// wordmarks (SVG). Placeholder association, marked for replacement with the
// real client roster / officially licensed marks.
export const BRANDS = [
  { name: "A. Filippi", src: "/logos/a-filippi.svg", ratio: "200 / 72" },
  { name: "Ermanno Scervino", src: "/logos/ermanno-scervino.svg", ratio: "220 / 72" },
  { name: "Vivienne Westwood", src: "/logos/vivienne-westwood.svg", ratio: "320 / 72" },
  { name: "Fendi", src: "/logos/fendi.svg", ratio: "200 / 72" },
  { name: "Brunello Cucinelli", src: "/logos/brunello-cucinelli.svg", ratio: "240 / 72" },
  { name: "Chiara Boni", src: "/logos/chiara-boni.svg", ratio: "240 / 72" },
  { name: "Fabiana Filippi", src: "/logos/fabiana-filippi.svg", ratio: "280 / 72" },
] as const;

// Real, from liinemodelmanagement.com and the agency deck.
export const LEGAL = {
  entity: "LIINE Ltd",
  address: "1 New Providence Wharf, Fairmont Avenue, Londra, E14 9PB, Regno Unito",
  vat: "GB500653922",
  email: "info@liinemodelmanagement.com",
  website: "www.liinemodelmanagement.com",
  phones: ["+39 345 529 7546", "+33 7 50 68 17 34"],
} as const;
