import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ModelForm from "@/components/admin/ModelForm";
import DeleteForm from "@/components/admin/DeleteForm";
import { isAuthenticated } from "@/lib/auth";
import { listModels, type AdminModel } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

async function load(): Promise<{ models: AdminModel[]; online: boolean }> {
  try {
    return { models: await listModels(), online: true };
  } catch {
    return { models: [], online: false };
  }
}

export default async function ModelliPage() {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { models, online } = await load();

  return (
    <AdminShell active="modelli">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Create */}
        <section className="lg:col-span-5">
          <h1 className="u-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
            Nuovo modello
          </h1>
          <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
            Nome, divisione e immagini. La prima immagine diventa la copertina
            sul board; le altre popolano la scheda.
          </p>
          <div className="mt-9">
            <ModelForm />
          </div>
        </section>

        {/* List */}
        <section className="lg:col-span-7">
          <div className="mb-8 flex items-end justify-between border-b border-ink pb-4">
            <h2 className="u-display text-[clamp(1.4rem,3vw,2rem)]">Board</h2>
            <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
              {String(models.length).padStart(2, "0")} caricati
            </span>
          </div>

          {!online ? (
            <p className="border border-accent/40 px-4 py-3 text-[0.85rem] text-accent">
              Database non raggiungibile.
            </p>
          ) : models.length === 0 ? (
            <p className="text-[0.9rem] text-ink-soft">
              Ancora nessun modello caricato. I volti del board di partenza
              restano quelli del sito finché non aggiungi i tuoi.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
              {models.map((m) => (
                <li key={m.id}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.cover}
                      alt={m.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                      {m.divisionLabel}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-line pt-2">
                    <span className="truncate text-[0.85rem] font-medium">
                      {m.name}
                    </span>
                    <DeleteForm id={m.id} kind="model" label={m.name} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
