/*
  Placeholder content for the LIINE landing page.
  Every model, credit and figure below is SYNTHETIC and marked for replacement.
  Real facts only: agency name, mission, divisions, and the legal entity block.
*/

export const NAV = [
  { label: "Lei", href: "#board" },
  { label: "Lui", href: "#board" },
  { label: "Casting aperto", href: "#casting" },
  { label: "Richiesta clienti", href: "#richiesta" },
  { label: "Contatti", href: "#contatti" },
] as const;

export type Division = "lei" | "lui";

export interface ModelCard {
  name: string; // placeholder
  height: string;
  origin: string;
}

// Placeholder rosters — replace with real talent from liinemodelmanagement.com
export const BOARD: Record<Division, ModelCard[]> = {
  lei: [
    { name: "Nome Cognome", height: "178", origin: "Milano" },
    { name: "Nome Cognome", height: "180", origin: "Parigi" },
    { name: "Nome Cognome", height: "176", origin: "Londra" },
    { name: "Nome Cognome", height: "181", origin: "Berlino" },
    { name: "Nome Cognome", height: "177", origin: "New York" },
    { name: "Nome Cognome", height: "179", origin: "Roma" },
    { name: "Nome Cognome", height: "175", origin: "Amsterdam" },
    { name: "Nome Cognome", height: "182", origin: "Copenaghen" },
  ],
  lui: [
    { name: "Nome Cognome", height: "187", origin: "Milano" },
    { name: "Nome Cognome", height: "189", origin: "Londra" },
    { name: "Nome Cognome", height: "186", origin: "Parigi" },
    { name: "Nome Cognome", height: "190", origin: "Stoccolma" },
    { name: "Nome Cognome", height: "188", origin: "Madrid" },
    { name: "Nome Cognome", height: "185", origin: "New York" },
    { name: "Nome Cognome", height: "191", origin: "Berlino" },
    { name: "Nome Cognome", height: "187", origin: "Praga" },
  ],
};

// Elite-signature "selected work" index — placeholder credits.
export const WORK_INDEX = [
  { model: "Nome Cognome", client: "Maison ——", credit: "Campagna FW26" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Editoriale" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Sfilata SS26" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Lookbook" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Campagna" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Fitting couture" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Editoriale cover" },
  { model: "Nome Cognome", client: "Maison ——", credit: "Sfilata FW26" },
] as const;

export const COVERS = ["01", "02", "03", "04"] as const;

// Real, from liinemodelmanagement.com
export const LEGAL = {
  entity: "LIINE Ltd",
  address: "1 New Providence Wharf, Fairmont Avenue, Londra, E14 9PB, Regno Unito",
  vat: "GB500653922",
} as const;
