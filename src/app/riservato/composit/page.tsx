import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CompositStudio from "@/components/admin/CompositStudio";
import DeleteForm from "@/components/admin/DeleteForm";
import { isAuthenticated } from "@/lib/auth";
import { compositMeasureLines } from "@/lib/composit";
import { listComposits, type AdminComposit } from "@/lib/composit-data";

export const dynamic = "force-dynamic";

async function load(): Promise<{ composits: AdminComposit[]; online: boolean }> {
  try {
    return { composits: await listComposits(), online: true };
  } catch {
    return { composits: [], online: false };
  }
}

export default async function CompositPage() {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { composits, online } = await load();

  return (
    <AdminShell active="composit">
      <div className="mb-10 max-w-2xl">
        <h1 className="u-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
          Composit
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
          Carica le due foto (fronte e retro), inserisci nome e misure e scarica
          il composit pronto per la stampa. Salva per riaprirlo e modificarlo più
          tardi.
        </p>
      </div>

      <CompositStudio />

      {/* Saved composits */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-ink pb-4">
          <h2 className="u-display text-[clamp(1.4rem,3vw,2rem)]">Salvati</h2>
          <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
            {String(composits.length).padStart(2, "0")} composit
          </span>
        </div>

        {!online ? (
          <p className="border border-accent/40 px-4 py-3 text-[0.85rem] text-accent">
            Database non raggiungibile.
          </p>
        ) : composits.length === 0 ? (
          <p className="text-[0.9rem] text-ink-soft">
            Ancora nessun composit salvato. Compila i campi qui sopra e premi
            «Salva composit».
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
                  <th className="py-3 pr-4 font-normal">Composit</th>
                  <th className="py-3 pr-4 font-normal">Misure</th>
                  <th className="py-3 pr-4 font-normal">Colore</th>
                  <th className="py-3 pr-4 font-normal">Creato</th>
                  <th className="py-3 font-normal" />
                </tr>
              </thead>
              <tbody>
                {composits.map((c) => {
                  const { it } = compositMeasureLines(c);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-line align-middle"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/riservato/composit/${c.id}`}
                          className="flex items-center gap-3 transition-colors hover:text-accent"
                        >
                          <span className="flex shrink-0 gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={c.frontUrl}
                              alt=""
                              className="h-12 w-9 rounded-sm object-cover object-top"
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={c.backUrl}
                              alt=""
                              className="h-12 w-9 rounded-sm object-cover object-top"
                            />
                          </span>
                          <span className="text-[0.9rem] font-medium">
                            {c.name || "Senza nome"}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[0.72rem] leading-snug text-ink-soft">
                        {it || "—"}
                      </td>
                      <td className="py-3 pr-4 text-[0.72rem] text-ink-soft">
                        {c.theme === "dark" ? "Scuro" : "Chiaro"}
                      </td>
                      <td className="py-3 pr-4 text-[0.72rem] text-ink-soft">
                        {new Date(c.createdAt).toLocaleDateString("it-IT")}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/riservato/composit/${c.id}`}
                            className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-300 hover:text-ink"
                          >
                            Modifica
                          </Link>
                          <DeleteForm
                            id={c.id}
                            kind="composit"
                            label={c.name || "composit"}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
