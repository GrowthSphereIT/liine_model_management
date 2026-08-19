import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContactActions from "@/components/admin/ContactActions";
import Pagination from "@/components/admin/Pagination";
import { isAuthenticated } from "@/lib/auth";
import {
  listRequests,
  type AdminRequest,
  type Page,
} from "@/lib/contacts-data";

export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
}

export default async function ClientiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/riservato/login");

  const { page: pageParam } = await searchParams;
  let data: Page<AdminRequest> | null = null;
  let online = true;
  try {
    data = await listRequests(Number(pageParam) || 1);
  } catch {
    online = false;
  }

  return (
    <AdminShell active="clienti">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <div>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
            Contatti · Clienti
          </span>
          <h1 className="u-display mt-1 text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
            Richieste
          </h1>
        </div>
        <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
          {String(data?.total ?? 0).padStart(2, "0")} totali
        </span>
      </div>

      {!online ? (
        <p className="border border-accent/40 px-4 py-3 text-[0.85rem] text-accent">
          Database non raggiungibile.
        </p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-[0.9rem] text-ink-soft">
          Ancora nessuna richiesta. I messaggi dal form clienti compaiono qui.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
                  <th className="py-3 pr-4 font-medium">Data</th>
                  <th className="py-3 pr-4 font-medium">Referente</th>
                  <th className="py-3 pr-4 font-medium">Azienda</th>
                  <th className="py-3 pr-4 font-medium">Contatti</th>
                  <th className="py-3 pr-4 font-medium">Richiesta</th>
                  <th className="py-3 pr-4 font-medium">Stato</th>
                  <th className="py-3 pl-4 text-right font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((r) => (
                  <tr
                    key={r.id}
                    className={`align-top text-[0.8rem] ${r.handled ? "text-ink-soft" : "text-ink"}`}
                  >
                    <td className="py-4 pr-4 tabular-nums text-ink-soft">
                      {fmtDate(r.createdAt)}
                    </td>
                    <td className="py-4 pr-4 font-medium">
                      {r.nome} {r.cognome}
                    </td>
                    <td className="py-4 pr-4 text-ink-soft">
                      <span className="block">{r.azienda || "—"}</span>
                      {r.citta ? (
                        <span className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
                          {r.citta}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-4 pr-4">
                      <a
                        href={`mailto:${r.email}`}
                        className="block truncate underline-offset-2 hover:underline"
                      >
                        {r.email}
                      </a>
                      {r.telefono ? (
                        <span className="mt-0.5 block text-[0.7rem] text-ink-soft">
                          {r.telefono}
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-[22rem] py-4 pr-4 text-[0.78rem] leading-relaxed text-ink-soft">
                      <span className="line-clamp-3 whitespace-pre-line">
                        {r.richiesta}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] ${
                          r.handled
                            ? "border-line text-ink-faint"
                            : "border-accent/50 text-accent"
                        }`}
                      >
                        {r.handled ? "Gestito" : "Nuovo"}
                      </span>
                    </td>
                    <td className="py-4 pl-4">
                      <ContactActions
                        id={r.id}
                        kind="request"
                        handled={r.handled}
                        label={`${r.nome} ${r.cognome}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={data.page}
            pages={data.pages}
            basePath="/riservato/clienti"
          />
        </>
      )}
    </AdminShell>
  );
}
