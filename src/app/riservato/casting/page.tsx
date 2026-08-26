import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ContactActions from "@/components/admin/ContactActions";
import ContactPhotos from "@/components/admin/ContactPhotos";
import ContactStatusSelect from "@/components/admin/ContactStatusSelect";
import Pagination from "@/components/admin/Pagination";
import { isAuthenticated } from "@/lib/auth";
import {
  listApplications,
  type AdminApplication,
  type Page,
} from "@/lib/contacts-data";

export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "–"
    : d.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
}

function measures(a: AdminApplication): string {
  const parts = [
    a.altezza && `H ${a.altezza}`,
    [a.seno, a.vita, a.bacino].some(Boolean) &&
      `${a.seno || "–"}/${a.vita || "–"}/${a.bacino || "–"}`,
    a.scarpe && `${a.scarpe} EU`,
  ].filter(Boolean);
  return parts.join(" · ") || "–";
}

export default async function CastingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/riservato/login");

  const { page: pageParam } = await searchParams;
  let data: Page<AdminApplication> | null = null;
  let online = true;
  try {
    data = await listApplications(Number(pageParam) || 1);
  } catch {
    online = false;
  }

  return (
    <AdminShell active="casting">
      <div
        className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4"
        data-tour="casting-head"
      >
        <div>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
            Contatti · Casting
          </span>
          <h1 className="u-display mt-1 text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
            Candidature
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
          Ancora nessuna candidatura. Le richieste dal form di casting aperto
          compaiono qui.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
                  <th className="py-3 pr-4 font-medium">Data</th>
                  <th className="py-3 pr-4 font-medium">Candidato</th>
                  <th className="py-3 pr-4 font-medium">Contatti</th>
                  <th className="py-3 pr-4 font-medium">Città</th>
                  <th className="py-3 pr-4 font-medium">Misure</th>
                  <th className="py-3 pr-4 font-medium">Foto</th>
                  <th className="py-3 pr-4 font-medium">Stato</th>
                  <th className="py-3 pl-4 text-right font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((a) => (
                  <tr
                    key={a.id}
                    className={`text-[0.8rem] [&>td]:align-middle ${a.handled ? "text-ink-soft" : "text-ink"}`}
                  >
                    <td className="py-4 pr-4 tabular-nums text-ink-soft">
                      {fmtDate(a.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="font-medium">
                        {a.nome} {a.cognome}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
                        {[a.genere, a.dataNascita].filter(Boolean).join(" · ")}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <a
                        href={`mailto:${a.email}`}
                        className="block truncate underline-offset-2 hover:underline"
                      >
                        {a.email}
                      </a>
                      <span className="mt-0.5 block text-[0.7rem] text-ink-soft">
                        {a.telefono}
                        {a.whatsapp ? ` · WA ${a.whatsapp}` : ""}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-ink-soft">{a.citta || "–"}</td>
                    <td className="py-4 pr-4 text-[0.72rem] text-ink-soft">
                      {measures(a)}
                    </td>
                    <td className="py-4 pr-4">
                      <ContactPhotos
                        images={a.images}
                        label={`${a.nome} ${a.cognome}`}
                      />
                    </td>
                    <td className="py-4 pr-4">
                      <ContactStatusSelect
                        id={a.id}
                        kind="application"
                        handled={a.handled}
                      />
                    </td>
                    <td className="py-4 pl-4">
                      <ContactActions
                        id={a.id}
                        kind="application"
                        label={`${a.nome} ${a.cognome}`}
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
            basePath="/riservato/casting"
          />
        </>
      )}
    </AdminShell>
  );
}
