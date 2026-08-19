import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ModelEditForm from "@/components/admin/ModelEditForm";
import { isAuthenticated } from "@/lib/auth";
import { getAdminModel } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function EditModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { id } = await params;
  const model = await getAdminModel(id);
  if (!model) notFound();

  return (
    <AdminShell active="modelli">
      <div className="mx-auto max-w-2xl">
        <div className="mb-9 flex items-baseline justify-between border-b border-ink pb-4">
          <div>
            <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
              Modifica modello
            </span>
            <h1 className="u-display mt-1 text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.95]">
              {model.name}
            </h1>
          </div>
          <Link
            href={`/modelli/${model.slug}`}
            target="_blank"
            className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors hover:text-accent"
          >
            Vedi scheda →
          </Link>
        </div>

        <ModelEditForm model={model} />
      </div>
    </AdminShell>
  );
}
