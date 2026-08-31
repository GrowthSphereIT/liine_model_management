import type { Metadata } from "next";
import FormLayout from "@/components/forms/FormLayout";

export const metadata: Metadata = {
  title: "Trasparenza IA: informativa ai sensi dell'AI Act",
  description:
    "Informativa di trasparenza sull'uso dell'intelligenza artificiale su questo sito, ai sensi dell'art. 50 del Regolamento europeo sull'IA (AI Act, Reg. UE 2024/1689).",
  keywords: [
    "trasparenza IA",
    "AI Act",
    "art. 50",
    "Regolamento UE 2024/1689",
    "immagini generate dall'IA",
    "contenuti sintetici",
    "LIINE",
  ],
  alternates: { canonical: "/ai-act" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: "/ai-act",
    title: "Trasparenza IA · LIINE Model Management",
    description:
      "Come e dove usiamo l'intelligenza artificiale su questo sito, ai sensi dell'AI Act.",
  },
};

const CONTACT_EMAIL = "info@liinemodelmanagement.com";
const UPDATED = "31 agosto 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 className="u-display text-[clamp(1.5rem,3.4vw,2.2rem)] leading-[1.02]">
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-[1rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

export default function AiActPage() {
  return (
    <FormLayout
      eyebrow="Trasparenza IA"
      titleLines={["Trasparenza", "sull'IA."]}
      intro="Informativa resa ai sensi dell'articolo 50 del Regolamento europeo sull'intelligenza artificiale (AI Act, Reg. UE 2024/1689). Qui dichiariamo come e dove usiamo l'intelligenza artificiale su questo sito."
      backHref="/"
      backLabel="Home"
      aside={
        <div className="flex flex-col gap-6 text-[0.9rem] leading-relaxed text-ink-soft">
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Riferimento</p>
            <p>
              Regolamento (UE) 2024/1689 — «AI Act», art. 50 (obblighi di
              trasparenza).
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Contatto</p>
            <p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Ultimo aggiornamento</p>
            <p>{UPDATED}</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <Section title="Immagini generate con l'IA">
          <p>
            Alcune immagini editoriali e di atmosfera presenti su questo sito —
            tra cui la fotografia di copertina della home page nella versione
            desktop — sono <span className="font-medium text-ink">generate o
            modificate con strumenti di intelligenza artificiale</span>.
          </p>
          <p>
            Le segnaliamo qui in modo chiaro, in conformità con l&apos;obbligo di
            trasparenza sui contenuti sintetici previsto dall&apos;art. 50
            dell&apos;AI Act. Non raffigurano persone reali né eventi reali: sono
            visual creati per finalità estetiche e di comunicazione.
          </p>
        </Section>

        <Section title="Le foto dei modelli sono autentiche">
          <p>
            Le fotografie dei modelli nei book e nelle gallerie sono{" "}
            <span className="font-medium text-ink">immagini reali di persone
            reali</span>, pubblicate con il loro consenso. Non sono generate
            dall&apos;IA.
          </p>
          <p>
            Non creiamo volti o corpi sintetici che imitino una persona reale
            senza il suo accordo esplicito, e non alteriamo l&apos;identità di un
            modello con l&apos;IA. L&apos;uso dell&apos;immagine di ciascuna
            persona resta soggetto al suo consenso e alle tutele del GDPR e del
            diritto all&apos;immagine.
          </p>
        </Section>

        <Section title="Nessun uso ingannevole">
          <p>
            Non impieghiamo l&apos;intelligenza artificiale per far apparire come
            autentici contenuti che non lo sono, né per manipolare in modo
            ingannevole immagini di persone. Ogni contenuto sintetico ha una
            finalità dichiarata e riconoscibile.
          </p>
        </Section>

        <Section title="Interazioni automatizzate">
          <p>
            Questo sito non utilizza chatbot o assistenti conversazionali basati
            su IA che interagiscono con te. Se in futuro introdurremo strumenti
            di questo tipo, saranno chiaramente identificati come sistemi di
            intelligenza artificiale, come richiesto dall&apos;AI Act.
          </p>
        </Section>

        <Section title="Contatti e diritti">
          <p>
            Per domande sull&apos;uso dell&apos;IA su questo sito, per segnalare
            un contenuto o per esercitare i tuoi diritti, scrivici a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p className="text-[0.85rem] text-ink-faint">
            Questa informativa può essere aggiornata quando cambia il modo in cui
            usiamo l&apos;IA. Riferimento normativo: Regolamento (UE) 2024/1689.
            Ultimo aggiornamento: {UPDATED}.
          </p>
        </Section>
      </div>
    </FormLayout>
  );
}
