"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateWorkAction, type FormState } from "@/app/riservato/actions";
import type { AdminWork } from "@/lib/admin-data";
import WorkFields from "./WorkFields";
import ImageGalleryEditor from "./ImageGalleryEditor";

export default function WorkEditForm({ work }: { work: AdminWork }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    updateWorkAction,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-9">
      <input type="hidden" name="id" value={work.id} />

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <WorkFields work={work} />
      </div>

      <div className="border-t border-line pt-7">
        <ImageGalleryEditor images={work.images} />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center justify-between gap-3 bg-ink px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Salvataggio…" : "Salva modifiche"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <Link
          href="/riservato/lavori"
          className="text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
