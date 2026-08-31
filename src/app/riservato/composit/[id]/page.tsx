import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CompositStudio from "@/components/admin/CompositStudio";
import { isAuthenticated } from "@/lib/auth";
import { getComposit } from "@/lib/composit-data";

export const dynamic = "force-dynamic";

export default async function EditCompositPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { id } = await params;
  const composit = await getComposit(id);
  if (!composit) notFound();

  return (
    <AdminShell active="composit">
      <div className="mb-9 flex items-baseline justify-between border-b border-ink pb-4">
        <div>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
            Modifica composit
          </span>
          <h1 className="u-display mt-1 text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.95]">
            {composit.name || "Senza nome"}
          </h1>
        </div>
        <Link
          href="/riservato/composit"
          className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors hover:text-accent"
        >
          ← Tutti i composit
        </Link>
      </div>

      <CompositStudio initial={composit} />
    </AdminShell>
  );
}
