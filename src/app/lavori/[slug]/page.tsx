import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Lines from "@/components/Lines";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import PhCover from "@/components/PhCover";
import {
  WORK_INDEX,
  getWork,
  workNeighbors,
  USE_PLACEHOLDERS,
} from "@/lib/site-data";
import { getUploadedWork } from "@/lib/admin-data";

export function generateStaticParams() {
  return WORK_INDEX.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug) ?? (await getUploadedWork(slug));
  if (!w) return {};
  const isUploaded = Boolean((w as { uploaded?: boolean }).uploaded);
  return {
    title: isUploaded
      ? `${w.credit} · LIINE`
      : `${w.credit} · LIINE (segnaposto)`,
    description: `${w.credit}${w.client ? `, ${w.client}` : ""}. LIINE Model Management.`,
  };
}

const GALLERY_WIDTH = [
  "w-full",
  "w-full sm:w-[68%] sm:ml-auto",
  "w-full sm:w-[60%]",
];

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug) ?? (await getUploadedWork(slug));
  if (!work) notFound();

  const uploaded = Boolean((work as { uploaded?: boolean }).uploaded);
  const real = !USE_PLACEHOLDERS || uploaded;

  const index = WORK_INDEX.findIndex((w) => w.slug === slug) + 1;
  const inIndex = index > 0;
  const total = WORK_INDEX.length;
  const { prev, next } = workNeighbors(slug);
  const lead = work.images[0];
  const gallery = work.images.slice(1);

  const neighbors = [
    { ...prev, role: "Precedente" as const },
    { ...next, role: "Successivo" as const },
  ];

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
          {!real ? (
            <PhCover corner="br" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lead}
              alt={`${work.credit} — ${work.client}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{ animation: "liine-kenburns 14s ease-out forwards" }}
              draggable={false}
            />
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              real
                ? "from-[#1b1612]/85 via-[#1b1612]/10 to-[#1b1612]/45"
                : "from-[#1b1612]/70 via-transparent to-[#1b1612]/30"
            }`}
          />

          <div
            className="absolute inset-x-0 z-10 mx-auto flex max-w-[1600px] items-center justify-between px-5 text-paper sm:px-8"
            style={{ top: "calc(var(--header-h) + 0.75rem)" }}
          >
            <Link
              href="/#lavori"
              className="group inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.24em] text-paper/80"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              Lavori
            </Link>
            {inIndex && (
              <span className="text-[0.625rem] tabular-nums tracking-[0.24em] text-paper/70">
                {String(index).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
            )}
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 sm:pb-16">
            {!real && (
              <span
                className="mb-4 inline-block border border-paper/30 px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.24em] text-paper/80"
                style={{
                  animation: "liine-reveal .8s var(--ease-out-quint) .3s both",
                }}
              >
                Segnaposto
              </span>
            )}
            <Lines
              as="h1"
              lines={[work.credit]}
              className="u-display max-w-5xl text-paper text-[clamp(2.6rem,9vw,7rem)] leading-[0.9]"
              startDelay={120}
            />
            <div
              className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/25 pt-5 text-[0.625rem] uppercase tracking-[0.24em] text-paper/75"
              style={{
                animation: "liine-reveal .9s var(--ease-out-quint) .5s both",
              }}
            >
              {[work.client, work.location, work.year]
                .filter(Boolean)
                .map((v, i, arr) => (
                  <span key={`${v}-${i}`} className="flex items-center gap-x-6">
                    <span className={i === 0 ? "text-paper" : undefined}>{v}</span>
                    {i < arr.length - 1 && (
                      <span className="hidden text-paper/40 sm:inline">/</span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* ── Scheda progetto ───────────────────────────────────── */}
        <section className="border-b border-line px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <Lines
                as="h2"
                lines={["Un capo,", "il corpo giusto."]}
                className="u-display text-[clamp(2rem,5.4vw,3.8rem)] leading-[0.92]"
              />
              <Reveal
                as="p"
                delay={160}
                className="mt-8 max-w-md text-[1rem] leading-relaxed text-ink-soft"
              >
                {real
                  ? "Un progetto dall'archivio LIINE: la selezione parte dal capo e da come cade sul corpo, non dalle misure standard."
                  : "Voce d'archivio segnaposto: modello, cliente, crediti e immagini qui riprodotti sono sostitutivi e verranno rimpiazzati con il progetto reale. La struttura della pagina è definitiva."}
              </Reveal>
            </div>

            <dl className="md:col-span-5 md:col-start-8">
              {[
                { k: "Cliente", v: work.client },
                { k: "Modello", v: work.model },
                { k: "Credito", v: work.credit },
                { k: "Sede", v: work.location },
                { k: "Anno", v: work.year },
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

        {/* ── Immagini ──────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
            <div className="mb-14 flex items-end justify-between border-b border-ink pb-5">
              <Lines
                as="h2"
                lines={["Immagini"]}
                className="u-display text-[clamp(1.6rem,3.6vw,2.6rem)]"
              />
              <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
                {real ? "" : "Segnaposto · "}
                {String(work.images.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col gap-16 sm:gap-28">
              {gallery.map((src, i) => (
                <figure
                  key={`${src}-${i}`}
                  className={GALLERY_WIDTH[i % GALLERY_WIDTH.length]}
                >
                  <ImageReveal
                    src={src}
                    alt={`${work.credit} — ${i + 2}`}
                    className="aspect-[3/4] w-full bg-paper-3"
                    sizes="(min-width: 640px) 68vw, 100vw"
                    placeholder={!real}
                    label={`Foto ${String(i + 2).padStart(2, "0")}`}
                  />
                  <figcaption className="mt-3 flex items-baseline justify-between text-[0.625rem] uppercase tracking-[0.2em] text-ink-soft">
                    <span>{work.credit}</span>
                    <span className="tabular-nums">
                      {String(i + 2).padStart(2, "0")} /{" "}
                      {String(work.images.length).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── Crediti ───────────────────────────────────────────── */}
        <section className="border-t border-line bg-paper-2/50 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-10 flex items-end justify-between border-b border-ink pb-5">
              <Lines
                as="h2"
                lines={["Crediti"]}
                className="u-display text-[clamp(1.6rem,3.4vw,2.6rem)]"
              />
              {!real && (
                <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
                  Segnaposto
                </span>
              )}
            </div>
            <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {[
                { k: "Cliente", v: work.client },
                { k: "Modello", v: work.model },
                { k: "Fotografia", v: "Da confermare" },
                { k: "Styling", v: "Da confermare" },
                { k: "Casting", v: "LIINE Model Management" },
                { k: "Anno", v: work.year },
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
        </section>

        {/* ── Prev / next work ──────────────────────────────────── */}
        <nav
          aria-label="Altri lavori"
          className="grid border-t border-line sm:grid-cols-2"
        >
          {neighbors.map((n, idx) => (
            <Link
              key={n.slug}
              href={`/lavori/${n.slug}`}
              className={`group relative flex min-h-[42vh] items-end overflow-hidden border-b border-line sm:min-h-[56vh] sm:border-b-0 ${
                idx === 0 ? "sm:border-r sm:border-line" : ""
              }`}
            >
              {USE_PLACEHOLDERS ? (
                <PhCover
                  corner="br"
                  className="opacity-70 transition-opacity duration-[900ms] group-hover:opacity-95"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.images[0]}
                  alt={n.credit}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-top opacity-45 transition-[transform,opacity] duration-[900ms] group-hover:scale-100 group-hover:opacity-80"
                  style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                  draggable={false}
                />
              )}
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
                    <span className="u-display block text-[clamp(1.8rem,5vw,3.2rem)] leading-[0.95] transition-transform duration-500 group-hover:-translate-y-0.5">
                      {n.credit}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.625rem] uppercase tracking-[0.24em] text-paper/60">
                    {n.client}
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

      <SiteFooter />
    </>
  );
}
