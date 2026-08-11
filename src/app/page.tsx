import { Suspense } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";
import Board from "@/components/Board";
import Reveal from "@/components/Reveal";
import Lines from "@/components/Lines";
import MethodList from "@/components/MethodList";
import LogoMarquee from "@/components/LogoMarquee";
import ImageTrail from "@/components/ImageTrail";
import WorkIndex from "@/components/WorkIndex";
import { MODELS } from "@/lib/site-data";
import { getPublicBoard, getPublicWorks } from "@/lib/admin-data";

// Reads uploaded content from Mongo (falls back to the static seed if the DB
// is offline), so newly published models and works appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [board, works] = await Promise.all([
    getPublicBoard(),
    getPublicWorks(),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        {/* Client maison logo strip */}
        <LogoMarquee />

        {/* Il metodo — editorial statement + method index (no cards) */}
        <section id="metodo">
          <ImageTrail
            images={MODELS}
            className="mx-auto max-w-[1600px] px-5 pb-28 pt-14 sm:px-8 sm:pb-40 sm:pt-20"
          >
            <Lines
              as="h2"
              lines={["Ogni casting", "è una sartoria", "su misura."]}
              className="u-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.92]"
            />

            <MethodList />
          </ImageTrail>
        </section>

        {/* Board */}
        <section
          id="board"
          className="border-t border-line bg-paper-2/50 px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Lines
                as="h2"
                lines={["I volti", "di LIINE"]}
                className="u-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.9]"
              />
              <Reveal
                as="p"
                delay={200}
                className="max-w-xs text-[0.9rem] leading-relaxed text-ink-soft"
              >
                Una selezione dal roster: le divisioni Lei e Lui, con Kids in
                arrivo, aggiornate per campagne, sfilate e fitting.
              </Reveal>
            </div>
            <Suspense fallback={null}>
              <Board board={board} />
            </Suspense>
          </div>
        </section>

        {/* Selected work index — Elite signature */}
        <section
          id="lavori"
          className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className="mb-10 sm:mb-14">
            <Lines
              as="h2"
              lines={["Lavori", "selezionati"]}
              className="u-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.9]"
            />
          </div>

          <WorkIndex works={works} />
        </section>

        {/* Casting aperto */}
        <section
          id="casting"
          className="border-t border-line bg-paper-2/50 px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <Lines
                as="h2"
                lines={["Casting aperto,", "tutto l'anno."]}
                className="u-display text-[clamp(2rem,5.4vw,3.8rem)] leading-[0.92]"
              />
              <Reveal as="p" delay={180} className="mt-8 max-w-md text-[1rem] leading-relaxed text-ink-soft">
                Cerchi rappresentanza? Il nostro casting è sempre attivo. Inviaci
                le tue misure e alcune foto: valutiamo ogni candidatura in base
                alla vestibilità, non solo ai numeri.
              </Reveal>
            </div>
            <div className="md:col-span-5">
              <Reveal>
                <Link
                  href="/candidatura"
                  className="ph group flex aspect-[4/3] items-end p-6 transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="ph-tag">Foto segnaposto</span>
                  <span className="relative z-[3] inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-paper">
                    Candidati
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Richiesta clienti — primary conversion */}
        <section id="richiesta" className="bg-ink px-5 py-28 text-paper sm:px-8 sm:py-36">
          <div className="mx-auto max-w-[1600px]">
            <Lines
              as="h2"
              lines={["Raccontaci", "il capo.", "Troviamo", "il corpo giusto."]}
              className="u-display max-w-5xl text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] text-paper"
            />
            <Reveal
              delay={140}
              className="mt-12 flex flex-col gap-6 border-t border-paper/20 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="max-w-md text-[1rem] leading-relaxed text-paper/70">
                Campagne, sfilate, editoriali o fitting couture: descrivi la
                richiesta e ti proponiamo una selezione mirata.
              </p>
              <Link
                href="/richiesta"
                className="group inline-flex w-fit items-center gap-3 bg-paper px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-accent hover:text-paper"
              >
                Invia una richiesta
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
