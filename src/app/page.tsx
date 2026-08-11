import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Board from "@/components/Board";
import Reveal from "@/components/Reveal";
import { WORK_INDEX, LEGAL } from "@/lib/site-data";

const MARQUEE = [
  "Casting aperto",
  "Candidature sempre aperte",
  "Lei",
  "Lui",
  "Vestibilità reale, non misure",
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        {/* Announcement marquee */}
        <div className="overflow-hidden border-y border-ink bg-ink py-3 text-paper">
          <div className="marquee-track">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center" aria-hidden={rep === 1}>
                {MARQUEE.map((word, i) => (
                  <span
                    key={`${rep}-${i}`}
                    className="flex items-center text-[0.6875rem] uppercase tracking-[0.24em]"
                  >
                    {word}
                    <span className="mx-6 text-accent-soft">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Manifesto / positioning */}
        <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <Reveal as="p" className="u-eyebrow">
                Il metodo
              </Reveal>
            </div>
            <div className="md:col-span-9">
              <Reveal
                as="h2"
                className="text-balance text-[clamp(1.7rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.03em]"
              >
                LIINE nasce per cambiare il modo in cui la moda seleziona i
                modelli. Ogni richiesta di casting è trattata come una sartoria
                su misura: talenti{" "}
                <span className="text-ink-soft">accuratamente selezionati</span>{" "}
                per la vestibilità reale del capo, non per una taglia decisa a
                priori.
              </Reveal>

              <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
                {[
                  {
                    n: "01",
                    t: "Selezione per fit",
                    d: "Non partiamo dalle misure standard ma dal capo e da come cade sul corpo giusto.",
                  },
                  {
                    n: "02",
                    t: "Due divisioni",
                    d: "Lei e Lui: board curati, aggiornati e pronti per campagne, sfilate e fitting.",
                  },
                  {
                    n: "03",
                    t: "Casting aperto",
                    d: "Un canale sempre attivo per nuovi volti e per le richieste dei clienti.",
                  },
                ].map((item, i) => (
                  <Reveal
                    key={item.n}
                    delay={i * 90}
                    className="bg-paper p-7"
                  >
                    <span className="u-display text-[1.4rem] text-accent">
                      {item.n}
                    </span>
                    <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight">
                      {item.t}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                      {item.d}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Board */}
        <section
          id="board"
          className="border-t border-line bg-paper-2/50 px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto max-w-[1600px]">
            <Reveal className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="u-eyebrow mb-3">Il board</p>
                <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
                  I volti di LIINE
                </h2>
              </div>
              <p className="max-w-xs text-[0.9rem] leading-relaxed text-ink-soft">
                Immagini e nomi qui riportati sono segnaposto — da sostituire con
                il roster reale.
              </p>
            </Reveal>
            <Board />
          </div>
        </section>

        {/* Selected work index — Elite signature */}
        <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="mb-12 flex items-end justify-between border-b border-ink pb-5">
            <h2 className="u-display text-[clamp(1.8rem,4vw,3rem)]">
              Lavori selezionati
            </h2>
            <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
              Segnaposto
            </span>
          </Reveal>

          <ul>
            {WORK_INDEX.map((w, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 40}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-5 transition-colors duration-300 hover:bg-paper-2/60"
              >
                <span className="col-span-1 text-[0.625rem] tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-11 text-[clamp(1.05rem,2.4vw,1.6rem)] font-medium tracking-tight transition-[padding,color] duration-300 group-hover:pl-3 group-hover:text-accent sm:col-span-5">
                  {w.model}
                </span>
                <span className="col-span-6 hidden text-[0.95rem] text-ink-soft sm:block sm:col-span-4">
                  {w.client}
                </span>
                <span className="col-span-6 col-start-2 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft sm:col-span-2 sm:col-start-auto sm:text-right">
                  {w.credit}
                </span>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Casting aperto */}
        <section
          id="casting"
          className="border-t border-line bg-paper-2/50 px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <Reveal as="p" className="u-eyebrow mb-4">
                Nuovi volti
              </Reveal>
              <Reveal
                as="h2"
                className="text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1] tracking-[-0.03em]"
              >
                Casting aperto,
                <br />
                tutto l&apos;anno.
              </Reveal>
              <Reveal as="p" delay={120} className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink-soft">
                Cerchi rappresentanza? Il nostro casting è sempre attivo. Inviaci
                le tue misure e alcune foto: valutiamo ogni candidatura in base
                alla vestibilità, non solo ai numeri.
              </Reveal>
            </div>
            <div className="md:col-span-5">
              <Reveal
                as="a"
                delay={80}
                className="ph group flex aspect-[4/3] items-end p-6 transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="ph-tag">Foto segnaposto</span>
                <span className="relative z-[3] inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-paper">
                  Candidati
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Richiesta clienti — primary conversion */}
        <section id="richiesta" className="bg-ink px-5 py-28 text-paper sm:px-8 sm:py-36">
          <div className="mx-auto max-w-[1600px]">
            <Reveal as="p" className="mb-6 text-[0.6875rem] uppercase tracking-[0.28em] text-paper/60">
              Per i clienti
            </Reveal>
            <Reveal
              as="h2"
              className="u-display max-w-5xl text-balance text-[clamp(2.4rem,8vw,7rem)] text-paper"
            >
              Raccontaci il capo. Troviamo il corpo giusto.
            </Reveal>
            <Reveal
              delay={140}
              className="mt-12 flex flex-col gap-6 border-t border-paper/20 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="max-w-md text-[1rem] leading-relaxed text-paper/70">
                Campagne, sfilate, editoriali o fitting couture: descrivi la
                richiesta e ti proponiamo una selezione mirata.
              </p>
              <a
                href={`mailto:info@liinemodelmanagement.com`}
                className="group inline-flex w-fit items-center gap-3 bg-paper px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-accent hover:text-paper"
              >
                Invia una richiesta
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contatti"
          className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-28"
        >
          <div className="grid gap-10 md:grid-cols-12">
            <Reveal as="h2" className="u-display col-span-full text-[clamp(1.6rem,3.4vw,2.6rem)] md:col-span-4">
              Contatti
            </Reveal>
            <div className="md:col-span-8">
              <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                {[
                  { k: "Sede", v: LEGAL.address },
                  { k: "Email", v: "info@liinemodelmanagement.com" },
                  { k: "Telefono", v: "[da confermare]" },
                  { k: "Social", v: "[da confermare]" },
                ].map((row) => (
                  <div key={row.k} className="bg-paper p-6">
                    <dt className="u-eyebrow mb-2">{row.k}</dt>
                    <dd className="text-[0.95rem] leading-relaxed text-ink">
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink bg-paper px-5 pb-10 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
            <span
              className="u-display leading-[0.82] tracking-[-0.05em]"
              style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}
            >
              LIINE
            </span>
            <p className="max-w-xs text-[0.9rem] leading-relaxed text-ink-soft">
              Model management. Selezione per vestibilità reale — Lei, Lui,
              casting aperto.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft sm:flex-row sm:justify-between">
            <span>
              {LEGAL.entity} · {LEGAL.address}
            </span>
            <span>Partita IVA {LEGAL.vat}</span>
            <span>© {new Date().getFullYear()} — Sito segnaposto</span>
          </div>
        </div>
      </footer>
    </>
  );
}
