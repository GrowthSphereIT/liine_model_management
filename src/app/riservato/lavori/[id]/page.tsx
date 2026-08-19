import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import WorkEditForm from "@/components/admin/WorkEditForm";
import { isAuthenticated } from "@/lib/auth";
import { getAdminWork } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/riservato/login");
  const { id } = await params;
  const work = await getAdminWork(id);
  if (!work) notFound();

  return (
    <AdminShell active="lavori">
      <div className="mx-auto max-w-2xl">
        <div className="mb-9 flex items-baseline justify-between border-b border-ink pb-4">
          <div>
            <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
              Modifica lavoro
            </span>
            <h1 className="u-display mt-1 text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.95]">
              {work.credit}
            </h1>
          </div>
          <Link
            href={`/lavori/${work.slug}`}
            target="_blank"
            className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors hover:text-accent"
          >
            Vedi scheda →
          </Link>
        </div>

        <WorkEditForm work={work} />
      </div>
    </AdminShell>
  );
}
