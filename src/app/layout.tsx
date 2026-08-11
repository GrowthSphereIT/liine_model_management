/*
  LIINE — direction contract (Persuade surface)

  THESIS: A model agency site that leads with the mechanism — selezione per
  vestibilità reale, non per misure — not a wall of faces. It mirrors Elite's
  editorial minimalism but refuses cool black/white for a warm ink-on-ivory world.
  Refuses: the same-size card grid and the generic centered hero.

  OWN-WORLD: Warm paper ground (#f4eee4), warm near-black ink (#1b1612), sienna
  accent used only on interaction. Single neo-grotesque (Archivo): huge tight
  display vs tiny wide-tracked uppercase labels. Hairline rules, generous voids,
  authored placeholder portraits tagged for replacement.

  STORY: A fashion client understands LIINE selects on fit, sees the board (Lei/Lui),
  reads selected work, and acts via "Richiesta clienti". Models find "Casting aperto".

  FIRST VIEWPORT: Full-bleed rotating cover placeholders, oversized LIINE wordmark
  anchored low, tagline + primary action (Richiesta clienti) visible; warm grain.

  FORM: Editorial agency index (Elite-pinned by brief). Seed: brief-pinned, no roll.

  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
import type { Metadata } from "next";
import { Space_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";

// Body / UI grotesque — neo-grotesque with a monospaced sibling, the closest
// freely-hostable cousin of ABC Monument Grotesk. Quiet, neutral, wide-tracked
// at small sizes; light weight for editorial body copy.
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// Display face — high-contrast Didone, the couture/editorial register
// (Vogue, Bottega). Carries the wordmark and the big statements.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIINE · Model Management",
  description:
    "LIINE nasce per cambiare il modo in cui la moda seleziona i modelli: selezione per vestibilità reale, non per misure. Divisioni Lei e Lui, casting aperto e richieste clienti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${grotesk.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
