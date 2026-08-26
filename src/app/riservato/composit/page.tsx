import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CompositStudio from "@/components/admin/CompositStudio";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CompositPage() {
  if (!(await isAuthenticated())) redirect("/riservato/login");

  return (
    <AdminShell active="composit">
      <div className="mb-10 max-w-2xl">
        <h1 className="u-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.92]">
          Composit
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
          Carica le due foto (fronte e retro), inserisci nome e misure e scarica
          il composit pronto per la stampa.
        </p>
      </div>

      <CompositStudio />
    </AdminShell>
  );
}
