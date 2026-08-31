import type { Metadata } from "next";
import FormLayout from "@/components/forms/FormLayout";

export const metadata: Metadata = {
  title: "AI Act: la nostra posizione sull'intelligenza artificiale",
  description:
    "Cosa prevede il Regolamento europeo sull'intelligenza artificiale (EU AI Act, Reg. UE 2024/1689), le sue scadenze e cosa significa per la moda, l'immagine dei modelli e i contenuti generati dall'IA.",
  keywords: [
    "AI Act",
    "Regolamento UE 2024/1689",
    "intelligenza artificiale moda",
    "deepfake",
    "immagini generate dall'IA",
    "trasparenza IA",
    "modelli sintetici",
    "LIINE",
  ],
  alternates: { canonical: "/ai-act" },
  openGraph: {
    type: "article",
    url: "/ai-act",
    title: "AI Act · LIINE Model Management",
    description:
      "Il Regolamento europeo sull'IA e cosa significa per la moda e per l'immagine dei modelli.",
  },
};

// Key milestones of the EU AI Act (Reg. (EU) 2024/1689), for the aside rail.
const TIMELINE: { date: string; label: string }[] = [
  { date: "Ago 2024", label: "Entrata in vigore del Regolamento." },
  { date: "Feb 2025", label: "Divieto dei sistemi a rischio inaccettabile." },
  {
    date: "Ago 2025",
    label: "Obblighi per i modelli di IA per finalità generali (GPAI).",
  },
  {
    date: "Ago 2026",
    label: "Piena applicazione, inclusi gli obblighi di trasparenza (art. 50).",
  },
  {
    date: "2026–2028",
    label: "Entrata in vigore graduale degli obblighi sui sistemi ad alto rischio.",
  },
];

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
      eyebrow="Normativa"
      titleLines={["EU AI Act", "e moda."]}
      intro="Il Regolamento europeo sull'intelligenza artificiale (Reg. UE 2024/1689) fissa regole comuni per un'IA affidabile. Ecco cosa prevede e cosa comporta per l'immagine dei modelli e per i contenuti generati dall'IA."
      backHref="/"
      backLabel="Home"
      aside={
        <div className="flex flex-col gap-6 text-[0.9rem] leading-relaxed text-ink-soft">
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-4">Scadenze principali</p>
            <ul className="flex flex-col gap-4">
              {TIMELINE.map((t) => (
                <li key={t.date} className="flex flex-col gap-1">
                  <span className="text-[0.625rem] uppercase tracking-[0.24em] text-accent">
                    {t.date}
                  </span>
                  <span className="text-[0.9rem] text-ink">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Sanzioni</p>
            <p>
              Fino a 35 milioni di euro o il 7% del fatturato mondiale annuo per
              le violazioni più gravi.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <Section title="Che cos'è l'AI Act">
          <p>
            L&apos;AI Act è il primo quadro giuridico organico al mondo
            sull&apos;intelligenza artificiale. È entrato in vigore il 1º agosto
            2024 e si applica in modo graduale nei mesi e anni successivi. Regola
            chi sviluppa e chi utilizza sistemi di IA nel mercato europeo, con un
            approccio basato sul rischio: più alto è il rischio per le persone e
            per i diritti fondamentali, più stringenti sono gli obblighi.
          </p>
        </Section>

        <Section title="Le quattro classi di rischio">
          <p>
            <span className="font-medium text-ink">Rischio inaccettabile.</span>{" "}
            Pratiche vietate, come il social scoring o la manipolazione dei
            comportamenti che può causare danni.
          </p>
          <p>
            <span className="font-medium text-ink">Alto rischio.</span> Sistemi
            ammessi ma soggetti a requisiti rigorosi: gestione del rischio,
            qualità dei dati, documentazione, sorveglianza umana.
          </p>
          <p>
            <span className="font-medium text-ink">Rischio limitato.</span>{" "}
            Obblighi di trasparenza: le persone devono sapere quando interagiscono
            con un&apos;IA o quando un contenuto è generato o manipolato
            artificialmente.
          </p>
          <p>
            <span className="font-medium text-ink">Rischio minimo.</span> La
            maggior parte delle applicazioni, senza obblighi specifici.
          </p>
        </Section>

        <Section title="Cosa cambia per la moda e per i modelli">
          <p>
            Il punto più rilevante per un&apos;agenzia di modelli è la
            trasparenza sui contenuti sintetici (art. 50). Immagini, video o
            &laquo;modelli&raquo; interamente generati dall&apos;IA, così come i
            volti e i corpi alterati in modo artificiale (i cosiddetti deepfake),
            devono essere identificabili come tali: etichettati in modo chiaro e,
            dove tecnicamente possibile, marcati in formato leggibile dalle
            macchine.
          </p>
          <p>
            Questo si aggiunge, senza sostituirle, alle tutele già previste dal
            GDPR e dal diritto all&apos;immagine: l&apos;uso del volto, del corpo
            e della likeness di una persona richiede un consenso informato e
            circoscritto, tanto più quando entra in gioco l&apos;IA generativa.
          </p>
        </Section>

        <Section title="La posizione di LIINE">
          <p>
            Il nostro lavoro parte dalla persona: dal capo e da come cade sul
            corpo reale, non da un&apos;immagine sintetica. Consideriamo l&apos;IA
            uno strumento, mai un sostituto del modello e del suo consenso.
          </p>
          <p>
            Per questo adottiamo alcuni principi: trasparenza su qualsiasi
            contenuto generato o alterato dall&apos;IA; consenso esplicito dei
            modelli per ogni uso della loro immagine; nessuna creazione di volti o
            corpi sintetici che imitino una persona senza il suo accordo.
          </p>
          <p className="text-[0.85rem] text-ink-faint">
            Questa pagina ha finalità informative e non costituisce consulenza
            legale. Per il testo integrale si rimanda al Regolamento (UE)
            2024/1689.
          </p>
        </Section>
      </div>
    </FormLayout>
  );
}
