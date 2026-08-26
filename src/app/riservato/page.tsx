import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isAuthenticated } from "@/lib/auth";
import { listModels, listWorks } from "@/lib/admin-data";
import { countApplications, countRequests } from "@/lib/contacts-data";

export const dynamic = "force-dynamic";

async function counts() {
  try {
    const [models, works, casting, clienti] = await Promise.all([
      listModels(),
      listWorks(),
      countApplications(),
      countRequests(),
    ]);
    return {
      models: models.length,
      works: works.length,
      casting,
      clienti,
      online: true,
    };
  } catch {
    return {
      models: 0,
      works: 0,
      casting: { total: 0, nuovi: 0 },
      clienti: { total: 0, nuovi: 0 },
      online: false,
    };
  }
}

export default async function DashboardPage() {
  if (!(await isAuthenticated())) redirect("/riservato/login");

  const { models, works, casting, clienti, online } = await counts();

  const cards = [
    {
      href: "/riservato/modelli",
      label: "Modelli",
      count: models,
      note: "Board · Lei, Lui, Kids",
    },
    {
      href: "/riservato/lavori",
      label: "Lavori",
      count: works,
      note: "Indice lavori selezionati",
    },
    {
      href: "/riservato/casting",
      label: "Casting",
      count: casting.total,
      note: casting.nuovi > 0 ? `${casting.nuovi} da gestire` : "Candidature",
    },
    {
      href: "/riservato/clienti",
      label: "Clienti",
      count: clienti.total,
      note: clienti.nuovi > 0 ? `${clienti.nuovi} da gestire` : "Richieste",
    },
  ];

  return (
    <AdminShell active="dashboard">
      <div className="mb-12">
        <h1 className="u-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.92]">
          Panoramica
        </h1>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
          Da qui carichi e gestisci i contenuti del sito — i volti del board e i
          lavori dell&apos;indice — e i contatti in arrivo dai form di casting e
          clienti. Le modifiche ai contenuti sono pubblicate immediatamente.
        </p>
        {!online && (
          <p className="mt-5 inline-block border border-accent/40 px-3 py-2 text-[0.75rem] text-accent">
            Database non raggiungibile: avvia il container Mongo
            (<span className="font-mono">docker compose up mongo</span>).
          </p>
        )}
      </div>

      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col justify-between gap-10 bg-paper p-8 transition-colors duration-300 hover:bg-paper-2 sm:p-10"
          >
            <div className="flex items-baseline justify-between">
              <span className="u-eyebrow">{card.label}</span>
              <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint transition-transform duration-500 group-hover:translate-x-1">
                Gestisci →
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="u-display text-[clamp(3rem,10vw,6rem)] leading-[0.8] tabular-nums">
                {String(card.count).padStart(2, "0")}
              </span>
              <span className="pb-2 text-[0.75rem] text-ink-soft">
                {card.note}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-px border border-line border-t-0">
        <Link
          href="/riservato/composit"
          className="group flex items-center justify-between gap-6 bg-paper p-8 transition-colors duration-300 hover:bg-paper-2 sm:p-10"
        >
          <div>
            <span className="u-eyebrow">Composit</span>
            <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-ink-soft">
              Genera i composit (fronte/retro) pronti per la stampa a partire da
              due foto e dalle misure.
            </p>
          </div>
          <span className="shrink-0 text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint transition-transform duration-500 group-hover:translate-x-1">
            Apri →
          </span>
        </Link>
      </div>
    </AdminShell>
  );
}
