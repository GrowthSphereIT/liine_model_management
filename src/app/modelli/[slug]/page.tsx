import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import RevealShell from "@/components/RevealShell";
import Lines from "@/components/Lines";
import Reveal from "@/components/Reveal";
import ModelGalleries from "@/components/ModelGalleries";
import { getModelPage, getUploadedModel } from "@/lib/admin-data";

// Models live in MongoDB and are managed from /riservato, so detail pages are
// rendered on demand rather than pre-generated from a static roster.
export const dynamicParams = true;

export function generateStaticParams() {
  return [] as { slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = await getUploadedModel(slug);
  if (!m) return {};
  return {
    title: `${m.name} · Modello ${m.divisionLabel}`,
    description: `${m.name}, modello della divisione ${m.divisionLabel} di LIINE Model Management a Londra. Disponibile per campagne, sfilate, editoriali e fitting.`,
    alternates: { canonical: `/modelli/${m.slug}` },
    openGraph: {
      type: "profile",
      title: `${m.name} · ${m.divisionLabel} · LIINE Model Management`,
      description: `${m.name}, modello ${m.divisionLabel} di LIINE. Campagne, sfilate, editoriali e fitting.`,
      images: m.portfolio[0] ? [{ url: m.portfolio[0], alt: `${m.name}, modello ${m.divisionLabel} LIINE` }] : undefined,
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getModelPage(slug);
  if (!page) notFound();

  const { model, prev, next, index, total } = page;

  const cover = model.portfolio[0];
  // The two public galleries; the hero cover is shown above, so drop it here.
  const galleria = model.galleria.filter((u) => u !== cover);
  const polaroid = model.polaroid.filter((u) => u !== cover);
  const bookHref = `/richiesta?modello=${encodeURIComponent(model.name)}`;

  const neighbors = [
    { ...prev, role: "Precedente" as const },
    { ...next, role: "Successivo" as const },
  ];

  return (
    <RevealShell>
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero: full-bleed portrait ─────────────────────────── */}
        <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${model.name}, modello ${model.divisionLabel} di LIINE Model Management`}
            className="absolute inset-0 h-full w-full object-cover object-top"
            style={{ animation: "liine-kenburns 14s ease-out forwards" }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1612]/85 via-[#1b1612]/10 to-[#1b1612]/45" />

          {/* Top meta row (under fixed header) */}
          <div
            className="absolute inset-x-0 z-10 mx-auto flex max-w-[1600px] items-center justify-between px-5 text-paper sm:px-8"
            style={{ top: "calc(var(--header-h) + 0.75rem)" }}
          >
            <Link
              href="/#board"
              className="group inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.24em] text-paper/80"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              Board
            </Link>
            <span className="text-[0.625rem] tabular-nums tracking-[0.24em] text-paper/70">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Name block */}
          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 sm:pb-16">
            <Lines
              as="h1"
              lines={[model.name]}
              className="u-display text-paper"
              startDelay={120}
            />
            <div
              className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/25 pt-5 text-[0.625rem] uppercase tracking-[0.24em] text-paper/75"
              style={{
                animation: "liine-reveal .9s var(--ease-out-quint) .5s both",
              }}
            >
              <span className="text-paper">Divisione {model.divisionLabel}</span>
              <span className="hidden sm:inline text-paper/40">/</span>
              <span>{model.status}</span>
              <span className="hidden sm:inline text-paper/40">/</span>
              <span>{model.location}</span>
            </div>
          </div>
        </section>

        {/* ── Gallerie: selettore full-width + galleria attiva ──── */}
        <ModelGalleries
          modelName={model.name}
          galleria={galleria}
          polaroid={polaroid}
        />

        {/* ── Scheda: truthful data strip ───────────────────────── */}
        <section className="border-b border-line px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <Lines
                as="h2"
                lines={[`${model.name}`, "per LIINE."]}
                className="u-display text-[clamp(2rem,5.4vw,3.8rem)] leading-[0.92]"
              />
              <Reveal
                as="p"
                delay={160}
                className="mt-8 max-w-md whitespace-pre-line text-[1rem] leading-relaxed text-ink-soft"
              >
                {model.intro}
              </Reveal>
            </div>

            <dl className="md:col-span-5 md:col-start-8">
              {[
                { k: "Divisione", v: model.divisionLabel },
                { k: "Agenzia", v: model.agency },
                { k: "Sede", v: model.location },
                { k: "Disponibilità", v: model.availability },
                { k: "Casting", v: model.casting },
              ].map((row, i) => (
                <Reveal
                  key={row.k}
                  delay={i * 60}
                  className="flex items-baseline justify-between gap-6 border-t border-line py-4 last:border-b"
                >
                  <dt className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
                    {row.k}
                  </dt>
                  <dd className="text-right text-[0.95rem] text-ink">{row.v}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Name ribbon ───────────────────────────────────────── */}
        <div
          aria-hidden
          className="overflow-hidden border-b border-line py-5 sm:py-7"
        >
          <div className="marquee-track u-display text-[clamp(1.8rem,5vw,3.4rem)] text-ink/10">
            {Array.from({ length: 2 }).map((_, dup) => (
              <span key={dup} className="flex shrink-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="flex items-center">
                    <span className="px-8">{model.name}</span>
                    <span className="text-accent/40">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── Booking panel ─────────────────────────────────────── */}
        <section className="bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1600px]">
            <Lines
              as="h2"
              lines={["Prenota", `${model.name}.`]}
              className="u-display max-w-4xl text-[clamp(2.2rem,7vw,5rem)] leading-[0.9] text-paper"
            />
            <Reveal
              delay={140}
              className="mt-10 flex flex-col gap-6 border-t border-paper/20 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="max-w-md text-[1rem] leading-relaxed text-paper/70">
                Campagne, sfilate, editoriali o fitting: scrivici la richiesta e
                ti inviamo disponibilità e book completo.
              </p>
              <a
                href={bookHref}
                className="group inline-flex w-fit items-center gap-3 bg-paper px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-accent hover:text-paper"
              >
                Richiedi {model.name}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── Prev / next model ─────────────────────────────────── */}
        <nav
          aria-label="Altri volti"
          className="grid border-t border-line sm:grid-cols-2"
        >
          {neighbors.map((n, idx) => (
            <Link
              key={n.slug}
              href={`/modelli/${n.slug}`}
              className={`group relative flex min-h-[46vh] items-end overflow-hidden border-b border-line sm:min-h-[62vh] sm:border-b-0 ${
                idx === 0 ? "sm:border-r sm:border-line" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={n.portfolio[0]}
                alt={n.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-top opacity-45 transition-[transform,opacity] duration-[900ms] group-hover:scale-100 group-hover:opacity-80"
                style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1612]/85 via-[#1b1612]/25 to-[#1b1612]/40" />
              <div
                className={`relative z-10 flex w-full items-end justify-between gap-6 p-6 text-paper sm:p-10 ${
                  idx === 0 ? "" : "sm:flex-row-reverse sm:text-right"
                }`}
              >
                <div>
                  <span className="block text-[0.625rem] uppercase tracking-[0.24em] text-paper/70">
                    {n.role}
                  </span>
                  <span className="mt-2 block overflow-hidden">
                    <span className="u-display block text-[clamp(2rem,6vw,3.6rem)] leading-[0.95] transition-transform duration-500 group-hover:-translate-y-0.5">
                      {n.name}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.625rem] uppercase tracking-[0.24em] text-paper/60">
                    Divisione {n.divisionLabel}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl text-paper/70 transition-transform duration-500 group-hover:translate-x-1"
                >
                  {idx === 0 ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </main>
    </RevealShell>
  );
}
