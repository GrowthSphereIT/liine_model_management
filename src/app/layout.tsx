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

// Canonical origin for metadata, structured data, sitemap and robots.
const SITE_URL = "https://liine.growthsphere.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LIINE Model Management · Agenzia di modelli a Londra",
    template: "%s · LIINE Model Management",
  },
  description:
    "LIINE è l'agenzia boutique di model management che seleziona i modelli per vestibilità reale, non per misure. Fitting, showroom, campagne e sfilate a Londra e in Europa. Ogni modello è misurato in 41 punti del corpo.",
  applicationName: "LIINE Model Management",
  keywords: [
    "model management",
    "agenzia di modelli",
    "agenzia di moda",
    "modelli",
    "modelle",
    "fitting",
    "showroom",
    "casting modelli",
    "sfilate",
    "campagne moda",
    "Londra",
    "The Art of Fitting",
    "LIINE",
  ],
  authors: [{ name: "LIINE Model Management" }],
  creator: "LIINE Model Management",
  publisher: "LIINE Model Management",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "LIINE Model Management",
    locale: "it_IT",
    url: SITE_URL,
    title: "LIINE Model Management · The Art of Fitting",
    description:
      "Agenzia boutique di model management: selezione per vestibilità reale, non per misure. Fitting, showroom, campagne e sfilate. Ogni modello è misurato in 41 punti.",
    images: [
      { url: "/covers/hero-lei.webp", alt: "LIINE Model Management, The Art of Fitting" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIINE Model Management · The Art of Fitting",
    description:
      "Selezione dei modelli per vestibilità reale, non per misure. Fitting, showroom, campagne e sfilate a Londra.",
    images: ["/covers/hero-lei.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "fashion",
};

// Organization structured data — helps search and generative engines identify
// the entity (name, location, contacts) behind the site.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LIINE Model Management",
  alternateName: "LIINE",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/logo-liine-nero.webp`,
  image: `${SITE_URL}/covers/hero-lei.webp`,
  slogan: "The Art of Fitting",
  description:
    "Agenzia boutique di model management: selezione dei modelli per vestibilità reale, non per misure. Fitting, showroom, campagne e sfilate.",
  email: "info@liinemodelmanagement.com",
  telephone: "+39 345 529 7546",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1 New Providence Wharf, Fairmont Avenue",
    addressLocality: "London",
    postalCode: "E14 9PB",
    addressCountry: "GB",
  },
  areaServed: ["IT", "GB", "FR", "EU"],
  sameAs: ["https://www.liinemodelmanagement.com"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${grotesk.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
