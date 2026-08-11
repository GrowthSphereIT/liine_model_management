import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
import FooterReveal from "@/components/FooterReveal";
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
      {/* Content column — opaque and lifted above the footer so it slides over
          it while scrolling and only uncovers it at the very end (sheet reveal). */}
      <div
        className="relative z-10 bg-paper"
        style={{ boxShadow: "0 34px 60px -26px rgba(27,22,18,0.5)" }}
      >
        <SiteHeader />

        <main className="flex-1">
        <Hero />

        {/* Client maison logo strip */}
        <LogoMarquee />

        {/* Il metodo — editorial statement + method index (no cards) */}
        <section
          id="metodo"
          style={{
            background:
              "radial-gradient(34% 42% at 22% 10%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)," +
              "radial-gradient(30% 36% at 80% 22%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 72%)," +
              "radial-gradient(32% 40% at 56% 82%, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 72%)," +
              "var(--paper)",
          }}
        >
          <ImageTrail
            images={MODELS}
            className="mx-auto max-w-[1600px] px-5 pt-14 sm:px-8 sm:pt-20"
          >
            <Lines
              as="h2"
              lines={["Ogni casting", "e' una sartoria", "su misura."]}
              className="u-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.92]"
              underline={2}
            />

            <MethodList />
          </ImageTrail>
        </section>

        {/* Board */}
        <section
          id="board"
          className="relative isolate overflow-hidden border-t border-line px-5 pt-14 pb-14 sm:px-8 sm:pt-20 sm:pb-20"
          style={{
            background:
              "radial-gradient(40% 46% at 6% 6%, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)," +
              "radial-gradient(30% 34% at 88% 20%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 72%)," +
              "radial-gradient(32% 40% at 68% 92%, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 72%)," +
              "var(--paper)",
          }}
        >
          <div className="light-rays" aria-hidden />
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Lines
                as="h2"
                lines={["I volti", "di LIINE"]}
                className="u-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.92]"
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
          className="relative isolate overflow-hidden border-t border-line px-5 pt-14 pb-24 sm:px-8 sm:pt-20 sm:pb-32"
        >
          {/* Soft blurred accent patches, weighted toward the right */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[2%] top-[4%] -z-10 h-[28rem] w-[28rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent 72%)",
              filter: "blur(80px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[16%] bottom-[2%] -z-10 h-[22rem] w-[22rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 16%, transparent), transparent 72%)",
              filter: "blur(72px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[44%] top-[34%] -z-10 h-[16rem] w-[16rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 13%, transparent), transparent 74%)",
              filter: "blur(64px)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <Lines
                as="h2"
                lines={["Lavori", "selezionati"]}
                className="u-display text-[clamp(2.2rem,6.4vw,5rem)] leading-[0.92]"
              />
              <Reveal
                as="p"
                delay={200}
                className="max-w-xs text-[0.9rem] leading-relaxed text-ink-soft"
              >
                Progetti scelti tra campagne, editoriali e sfilate: dove il
                casting per vestibilità reale ha fatto la differenza.
              </Reveal>
            </div>

            <WorkIndex works={works} />
          </div>
        </section>

        {/* Casting aperto */}
        <section
          id="casting"
          className="relative isolate overflow-hidden border-t border-line bg-paper-2/50 px-5 pt-14 pb-24 sm:px-8 sm:pt-20 sm:pb-32"
        >
          {/* Faint dot-grid tint, fading toward the base */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.7]"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, color-mix(in srgb, var(--ink) 13%, transparent) 1.1px, transparent 1.6px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(130% 100% at 50% 0%, black, transparent 76%)",
              WebkitMaskImage:
                "radial-gradient(130% 100% at 50% 0%, black, transparent 76%)",
            }}
          />

          {/* Soft blurred accent patches */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[4%] top-[6%] -z-10 h-[26rem] w-[26rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 18%, transparent), transparent 72%)",
              filter: "blur(80px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[30%] -bottom-[10%] -z-10 h-[22rem] w-[22rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 13%, transparent), transparent 72%)",
              filter: "blur(74px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[8%] top-[24%] -z-10 h-[17rem] w-[17rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 11%, transparent), transparent 74%)",
              filter: "blur(66px)",
            }}
          />
          <div className="relative z-10 mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <Lines
                as="h2"
                lines={["Casting aperto,", "tutto l'anno."]}
                className="u-display text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[0.94]"
                underline={1}
              />
              <Reveal as="p" delay={180} className="mt-8 max-w-md text-[1rem] leading-relaxed text-ink-soft">
                Cerchi rappresentanza? Il nostro casting è sempre attivo. Inviaci
                le tue misure e alcune foto: valutiamo ogni candidatura in base
                alla vestibilità, non solo ai numeri.
              </Reveal>
            </div>
            <div className="md:col-span-6">
              <Reveal>
                <Link
                  href="/candidatura"
                  className="group relative flex aspect-[5/4] items-end overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1"
                >
                  <Image
                    src="/covers/casting.webp"
                    alt="Casting LIINE — modelli in attesa in studio"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent"
                  />
                  <span className="relative z-[3] inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
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
        <section id="richiesta" className="bg-ink px-5 py-14 text-paper sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[1600px]">
            <Lines
              as="h2"
              lines={["Raccontaci", "il capo.", "Troviamo", "il corpo giusto."]}
              className="u-display max-w-5xl text-[clamp(2.6rem,8vw,6rem)] leading-[0.92] text-paper"
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
                className="group inline-flex w-fit items-center gap-3 bg-paper px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink-soft hover:text-paper"
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
      </div>

      <FooterReveal>
        <SiteFooter />
      </FooterReveal>
    </>
  );
}
