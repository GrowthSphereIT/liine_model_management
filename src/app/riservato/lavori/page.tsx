import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import WorkForm from "@/components/admin/WorkForm";
import DeleteForm from "@/components/admin/DeleteForm";
import { isAuthenticated } from "@/lib/auth";
import { listWorks, type AdminWork } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

async function load(): Promise<{ works: AdminWork[]; online: boolean }> {
  try {
    return { works: await listWorks(), online: true };
  } catch {
    return { works: [], online: false };
  }
}

export default async function LavoriPage() {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { works, online } = await load();

  return (
    <AdminShell active="lavori">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Create */}
        <section className="lg:col-span-5">
          <h1 className="u-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
            Nuovo lavoro
          </h1>
          <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
            Titolo, crediti e immagini del progetto. Compare nell&apos;indice
            &laquo;Lavori selezionati&raquo; della home.
          </p>
          <div className="mt-9">
            <WorkForm />
          </div>
        </section>

        {/* List */}
        <section className="lg:col-span-7">
          <div className="mb-8 flex items-end justify-between border-b border-ink pb-4">
            <h2 className="u-display text-[clamp(1.4rem,3vw,2rem)]">Indice</h2>
            <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
              {String(works.length).padStart(2, "0")} caricati
            </span>
          </div>

          {!online ? (
            <p className="border border-accent/40 px-4 py-3 text-[0.85rem] text-accent">
              Database non raggiungibile.
            </p>
          ) : works.length === 0 ? (
            <p className="text-[0.9rem] text-ink-soft">
              Ancora nessun lavoro caricato. L&apos;indice mostra i segnaposto
              del sito finché non aggiungi i tuoi progetti.
            </p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {works.map((w) => (
                <li key={w.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-paper-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.cover}
                      alt={w.credit}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.95rem] font-medium">
                      {w.credit}
                    </p>
                    <p className="truncate text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
                      {[w.client, w.location, w.year].filter(Boolean).join(" · ") || "Senza dati"}
                    </p>
                  </div>
                  <DeleteForm id={w.id} kind="work" label={w.credit} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
