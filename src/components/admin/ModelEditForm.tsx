"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateModelAction, type FormState } from "@/app/riservato/actions";
import type { AdminModel } from "@/lib/admin-data";
import ModelFields from "./ModelFields";
import ImageGalleryEditor from "./ImageGalleryEditor";

export default function ModelEditForm({ model }: { model: AdminModel }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    updateModelAction,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-9">
      <input type="hidden" name="id" value={model.id} />

      <ModelFields model={model} />

      <div className="border-t border-line pt-7">
        <ImageGalleryEditor images={model.images} kinds={model.kinds} />
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
          href="/riservato/modelli"
          className="text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
